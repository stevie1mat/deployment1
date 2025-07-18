package utils

import (
    "errors"
    "net/http"
    "strings"

    "github.com/golang-jwt/jwt/v4"
	"context"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "github.com/ElioCloud/shared-models/models"
)


// Extract email from JWT
func ExtractEmailFromJWT(r *http.Request, secret string) (string, error) {
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        return "", errors.New("missing auth header")
    }

    tokenString := strings.TrimPrefix(authHeader, "Bearer ")
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(secret), nil
    })
    if err != nil || !token.Valid {
        return "", errors.New("invalid token")
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        return "", errors.New("invalid token claims")
    }

    email, ok := claims["email"].(string)
    if !ok {
        return "", errors.New("email not found in token")
    }

    return email, nil
}

// Get user details from database
func GetUserByEmail(db *mongo.Database, email string) (models.User, error) {
    var user models.User
    collection := db.Collection("MyClusterCol") // "users"
    filter := bson.M{"email": email}

    err := collection.FindOne(context.TODO(), filter).Decode(&user)
    if err != nil {
        return models.User{}, err // Return empty user if not found
    }

    return user, nil
}