package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"
	"os"
	"time"
	"log"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"trademinutes-auth/config"
	"trademinutes-auth/models"
	"trademinutes-auth/utils"
)

func ForgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Check if user exists
	collection := config.GetDB().Collection("MyClusterCol")
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Generate reset token
	resetToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": req.Email,
		"exp":   time.Now().Add(15 * time.Minute).Unix(),
	})
	secret := []byte(os.Getenv("JWT_RESET_SECRET"))
	tokenString, _ := resetToken.SignedString(secret)

	// Send email
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", os.Getenv("FRONTEND_URL"), tokenString)
	sendEmail(req.Email, "Password Reset", fmt.Sprintf("Click to reset password: %s", resetURL))

	w.Write([]byte("Password reset email sent"))
}

func sendEmail(to, subject, body string) {
	from := os.Getenv("EMAIL_FROM")
	auth := smtp.PlainAuth("", os.Getenv("SMTP_USER"), os.Getenv("SMTP_PASS"), os.Getenv("SMTP_HOST"))

	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n\r\n" +
		body + "\r\n")

	_ = smtp.SendMail(os.Getenv("SMTP_HOST")+":"+os.Getenv("SMTP_PORT"), auth, from, []string{to}, msg)
}

func ResetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("ResetPasswordHandler invoked")

	var req struct {
		Token       string `json:"token"`
		NewPassword string `json:"newPassword"`
	}

	// Decode request body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Token == "" || req.NewPassword == "" {
		log.Printf("Invalid request body: err=%v, token=%s, newPassword=%s", err, req.Token, req.NewPassword)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	log.Println("Request body decoded successfully")

	// Parse the JWT token
	secret := []byte(os.Getenv("JWT_RESET_SECRET"))
	token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil || !token.Valid {
		log.Printf("Token parse error or invalid token: err=%v, valid=%v", err, token.Valid)
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}
	log.Println("JWT token parsed successfully")

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["email"] == nil {
		log.Println("Invalid token claims or missing email")
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}
	email := claims["email"].(string)
	log.Printf("Token claims extracted: email=%s", email)

	// Get DB collection
	collection := config.GetDB().Collection("MyClusterCol")
	log.Println("MongoDB collection accessed")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Hash the new password
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		log.Printf("Password hashing failed: err=%v", err)
		http.Error(w, "Password hashing failed", http.StatusInternalServerError)
		return
	}
	log.Println("Password hashed successfully")

	// Update password in DB
	res, err := collection.UpdateOne(ctx,
		bson.M{"email": email},
		bson.M{"$set": bson.M{"password": hashedPassword}},
	)
	if err != nil {
		log.Printf("Failed to update password in DB: err=%v", err)
		http.Error(w, "Failed to update password", http.StatusInternalServerError)
		return
	}
	if res.MatchedCount == 0 {
		log.Printf("No user found with email: %s", email)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	log.Printf("Password updated successfully for email: %s", email)

	w.Write([]byte("Password updated successfully"))
}
