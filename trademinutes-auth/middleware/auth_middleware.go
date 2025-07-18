package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const EmailKey contextKey = "email"

func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		fmt.Println("🛡️ Authorization Header:", authHeader)

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			fmt.Println("❌ Missing or invalid Authorization header")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		fmt.Println("🔐 Token received:", tokenString)

		secret := []byte(os.Getenv("JWT_SECRET"))
		fmt.Println("🧪 JWT_SECRET in Middleware:", os.Getenv("JWT_SECRET"))

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return secret, nil
		})

		if err != nil || !token.Valid {
			fmt.Println("❌ Token validation error:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["email"] == nil {
			fmt.Println("❌ Invalid token claims")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		email := claims["email"].(string)
		fmt.Println("✅ JWT valid for:", email)

		ctx := context.WithValue(r.Context(), EmailKey, email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
