package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ElioCloud/shared-models/models"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var reviewCollection *mongo.Collection

func connectDB() *mongo.Database {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}
	return client.Database(os.Getenv("DB_NAME"))
}

func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		h(w, r)
	}
}

func addReviewHandler(w http.ResponseWriter, r *http.Request) {
	var review models.Review
	if err := json.NewDecoder(r.Body).Decode(&review); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	review.ID = primitive.NewObjectID()
	review.CreatedAt = time.Now().Unix()
	// Ensure taskId is always a string
	switch v := any(review.TaskID).(type) {
	case primitive.ObjectID:
		review.TaskID = v.Hex()
	case string:
		// already a string, do nothing
	default:
		review.TaskID = fmt.Sprintf("%v", v)
	}
	_, err := reviewCollection.InsertOne(context.TODO(), review)
	if err != nil {
		http.Error(w, "Failed to save review", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(review)
}

func getReviewerNameFromAuth(reviewerId primitive.ObjectID) string {
	// Try to fetch from auth service
	authApiUrl := os.Getenv("AUTH_API_URL")
	if authApiUrl == "" {
		authApiUrl = "http://localhost:8080"
	}
	url := fmt.Sprintf("%s/api/auth/user/%s", authApiUrl, reviewerId.Hex())
	log.Printf("[DEBUG] Fetching reviewer name from: %s", url)
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("[DEBUG] Error fetching reviewer: %v", err)
		return "Unknown"
	}
	defer resp.Body.Close()
	log.Printf("[DEBUG] Reviewer fetch status: %d", resp.StatusCode)
	var user struct {
		Name     string `json:"Name"`
		name     string `json:"name"`
		FullName string `json:"fullName"`
	}
	bodyBytes, _ := io.ReadAll(resp.Body)
	log.Printf("[DEBUG] Reviewer fetch body: %s", string(bodyBytes))
	_ = json.Unmarshal(bodyBytes, &user)
	if user.Name != "" {
		return user.Name
	}
	if user.name != "" {
		return user.name
	}
	if user.FullName != "" {
		return user.FullName
	}
	return "Unknown"
}

func getReviewsHandler(w http.ResponseWriter, r *http.Request) {
	revieweeIdHex := r.URL.Query().Get("userId")
	taskId := r.URL.Query().Get("taskId")
	reviewerIdHex := r.URL.Query().Get("reviewerId")
	var filter bson.M

	if taskId != "" {
		filter = bson.M{"taskId": taskId}
		log.Printf("[DEBUG] GET /api/reviews?taskId=%s, filter: %+v", taskId, filter)
	} else if reviewerIdHex != "" {
		reviewerId, err := primitive.ObjectIDFromHex(reviewerIdHex)
		if err != nil {
			log.Printf("[DEBUG] Invalid reviewerId: %v", err)
			http.Error(w, "Invalid reviewerId", http.StatusBadRequest)
			return
		}
		filter = bson.M{"reviewerId": reviewerId}
		log.Printf("[DEBUG] GET /api/reviews?reviewerId=%s, filter: %+v", reviewerIdHex, filter)
	} else if revieweeIdHex != "" {
		revieweeId, err := primitive.ObjectIDFromHex(revieweeIdHex)
		if err != nil {
			log.Printf("[DEBUG] Invalid userId: %v", err)
			http.Error(w, "Invalid userId", http.StatusBadRequest)
			return
		}
		filter = bson.M{"revieweeId": revieweeId}
		log.Printf("[DEBUG] GET /api/reviews?userId=%s, filter: %+v", revieweeIdHex, filter)
	} else {
		log.Printf("[DEBUG] Missing userId, reviewerId, or taskId parameter")
		http.Error(w, "Missing userId, reviewerId, or taskId parameter", http.StatusBadRequest)
		return
	}

	cursor, err := reviewCollection.Find(context.Background(), filter)
	if err != nil {
		log.Printf("[DEBUG] Error fetching reviews: %v", err)
		http.Error(w, "Error fetching reviews", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	var reviews []models.Review
	if err = cursor.All(context.Background(), &reviews); err != nil {
		log.Printf("[DEBUG] Error decoding reviews: %v", err)
		http.Error(w, "Error decoding reviews", http.StatusInternalServerError)
		return
	}
	log.Printf("[DEBUG] Found %d reviews for filter: %+v", len(reviews), filter)
	enriched := make([]map[string]interface{}, 0)
	for _, review := range reviews {
		m := make(map[string]interface{})
		data, _ := json.Marshal(review)
		_ = json.Unmarshal(data, &m)
		m["reviewerName"] = getReviewerNameFromAuth(review.ReviewerID)
		enriched = append(enriched, m)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(enriched)
}

func main() {
	// Load .env file for environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading .env")
	}
	db := connectDB()
	reviewCollection = db.Collection("reviews")

	http.HandleFunc("/api/reviews", withCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			addReviewHandler(w, r)
		case http.MethodGet:
			getReviewsHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8086"
	}
	fmt.Println("Review service running on:", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
