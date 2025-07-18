package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"trademinutes-auth/config"
	"trademinutes-auth/routes"
)
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusNoContent)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func main() {
	// Load .env file
	if os.Getenv("ENV") != "production" {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found, assuming production environment variables")
	}
}

	// Connect to MongoDB
	config.ConnectDB()
	fmt.Println("✅ Connected to MongoDB:", config.GetDB().Name())

	// Set up router
	router := mux.NewRouter()

	// Health check
	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	// Auth routes
	routes.AuthRoutes(router)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, CORSMiddleware(router)))

}
