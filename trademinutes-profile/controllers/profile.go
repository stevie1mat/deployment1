package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"trademinutes-profile/config"
	"trademinutes-profile/middleware"

	"github.com/ElioCloud/shared-models/models"
	"go.mongodb.org/mongo-driver/bson"
)

func UpdateProfileInfoHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Entered UpdateProfileInfoHandler")

	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if !ok {
		log.Println("Failed to get email from context")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	log.Printf("Email from context: %s\n", email)

	var req models.User
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request body: %v\n", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	log.Printf("Decoded request: %+v\n", req)

	collection := config.GetDB().Collection("MyClusterCol")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{}

	// Update only non-zero values (if they are provided)
	if req.Program != "" {
		update["program"] = req.Program
	}
	if req.Location != "" {
		update["location"] = req.Location
	}
	if req.College != "" {
		update["college"] = req.College
	}
	if req.YearOfStudy != "" {
		update["yearOfStudy"] = req.YearOfStudy
	}
	if req.Bio != "" {
		update["bio"] = req.Bio
	}
	if len(req.Skills) > 0 {
		update["skills"] = req.Skills
	}
	if req.ProfilePictureURL != "" {
		update["profilePictureURL"] = req.ProfilePictureURL
	}
	if (req.Stats != models.ProfileStats{}) {
		update["stats"] = req.Stats
	}
	if len(req.Achievements) > 0 {
		update["achievements"] = req.Achievements
	}

	// Check if profile was previously incomplete
	var existingUser models.User
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&existingUser)
	if err != nil {
		log.Printf("Failed to fetch existing user: %v\n", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	wasIncomplete := existingUser.College == "" || existingUser.Program == "" || existingUser.YearOfStudy == ""
	isNowComplete := req.College != "" && req.Program != "" && req.YearOfStudy != ""

	// If profile is being completed for the first time, set credits to 200 (not increment)
	if wasIncomplete && isNowComplete {
		update["credits"] = 200
	}

	if len(update) == 0 {
		http.Error(w, "No valid fields to update", http.StatusBadRequest)
		return
	}

	log.Printf("Update document: %+v\n", update)

	result, err := collection.UpdateOne(ctx, bson.M{"email": email}, bson.M{"$set": update})
	if err != nil {
		log.Printf("Failed to update profile: %v\n", err)
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}
	log.Printf("Update result: %+v\n", result)

	w.Write([]byte("Profile information updated successfully"))
}

// GetProfileHandler returns the full user profile for the authenticated user
func GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	// Get email from JWT context
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if !ok || email == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	collection := config.GetDB().Collection("MyClusterCol")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	user.Password = "" // Never expose password

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
