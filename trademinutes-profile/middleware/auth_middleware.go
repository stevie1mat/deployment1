package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"
	"log"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const EmailKey = contextKey("email")

func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			log.Println("Authorization header missing or malformed")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		secret := []byte(os.Getenv("JWT_SECRET"))

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return secret, nil
		})
		if err != nil {
			log.Printf("JWT parse error: %v\n", err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}
		if !token.Valid {
			log.Println("JWT token is not valid")
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			log.Println("Failed to convert JWT claims")
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}
		email, emailOk := claims["email"].(string)
		if !emailOk || email == "" {
			log.Println("JWT claims missing 'email' or it is empty")
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		log.Printf("JWT token validated for email: %s\n", email)

		ctx := context.WithValue(r.Context(), EmailKey, email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
