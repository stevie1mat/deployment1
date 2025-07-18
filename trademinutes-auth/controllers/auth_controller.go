package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"trademinutes-auth/config"
	"trademinutes-auth/middleware"
	"trademinutes-auth/models"
	"trademinutes-auth/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Helper for consistent error responses
func writeJSONError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// ✅ RegisterHandler
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	collection := config.GetDB().Collection("MyClusterCol")

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		writeJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	count, err := collection.CountDocuments(ctx, bson.M{"email": user.Email})
	if err != nil {
		writeJSONError(w, "Database error", http.StatusInternalServerError)
		return
	}
	if count > 0 {
		writeJSONError(w, "User already exists", http.StatusConflict)
		return
	}

	user.Password, err = utils.HashPassword(user.Password)
	if err != nil {
		writeJSONError(w, "Password hashing failed", http.StatusInternalServerError)
		return
	}

	if _, err := collection.InsertOne(ctx, user); err != nil {
		writeJSONError(w, "User creation failed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// ✅ LoginHandler
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	collection := config.GetDB().Collection("MyClusterCol")

	var input models.User
	var foundUser models.User

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&foundUser)
	if err != nil {
		writeJSONError(w, "User not found", http.StatusUnauthorized)
		return
	}

	if !utils.CheckPasswordHash(input.Password, foundUser.Password) {
		writeJSONError(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	fmt.Println("🔐 Logging in:", foundUser.Email)
	token, err := utils.GenerateJWT(foundUser.Email)
	if err != nil {
		writeJSONError(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	fmt.Println("✅ Token issued:", token)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// ✅ ProfileHandler
func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	rawEmail := r.Context().Value(middleware.EmailKey)
	fmt.Println("📥 Email from JWT context:", rawEmail)

	email := rawEmail.(string)
	collection := config.GetDB().Collection("MyClusterCol")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
		writeJSONError(w, "User not found", http.StatusNotFound)
		return
	}

	user.Password = "" // Never expose password
	fmt.Println("✅ Profile found for:", user.Email)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GitHubOAuthHandler(w http.ResponseWriter, r *http.Request) {
	collection := config.GetDB().Collection("MyClusterCol")

	var input struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		fmt.Println("❌ Failed to decode GitHub input:", err)
		writeJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	fmt.Println("📩 GitHub Login for:", input.Email)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		fmt.Println("👤 New GitHub user, registering:", input.Email)
		user = models.User{
			Email:    input.Email,
			Name:     input.Name,
			Password: "",
		}
		if _, err := collection.InsertOne(ctx, user); err != nil {
			fmt.Println("❌ Failed to insert GitHub user:", err)
			writeJSONError(w, "Registration failed", http.StatusInternalServerError)
			return
		}
	}

	// 🧪 Generate JWT
	token, err := utils.GenerateJWT(input.Email)
	if err != nil {
		fmt.Println("❌ Token generation failed:", err)
		writeJSONError(w, "Token error", http.StatusInternalServerError)
		return
	}

	fmt.Println("✅ GitHub JWT issued:", token)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func GoogleOAuthHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	collection := config.GetDB().Collection("MyClusterCol")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		// Not found → register
		user = models.User{Email: input.Email, Name: input.Name}
		if _, err := collection.InsertOne(ctx, user); err != nil {
			writeJSONError(w, "Failed to register", http.StatusInternalServerError)
			return
		}
	}

	token, err := utils.GenerateJWT(input.Email)
	if err != nil {
		writeJSONError(w, "Token generation failed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// GetUserByIDHandler returns user info by MongoDB ObjectID
func GetUserByIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idHex := vars["id"]
	if idHex == "" {
		writeJSONError(w, "Missing user ID", http.StatusBadRequest)
		return
	}
	objID, err := primitive.ObjectIDFromHex(idHex)
	if err != nil {
		writeJSONError(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	collection := config.GetDB().Collection("MyClusterCol")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var user models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		writeJSONError(w, "User not found", http.StatusNotFound)
		return
	}
	user.Password = "" // Never expose password
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
