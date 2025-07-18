package utils

import (
	"time"
	"os"
	"github.com/golang-jwt/jwt/v5"
	"fmt"
)

func GenerateJWT(email string) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))

	fmt.Println("🧪 Issuing token for:", email)
	fmt.Println("🧪 JWT_SECRET in GenerateJWT:", os.Getenv("JWT_SECRET"))

	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}


