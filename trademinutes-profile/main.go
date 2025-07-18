package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"trademinutes-profile/config"
	"trademinutes-profile/routes"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load .env
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Println(".env file not found, assuming production environment variables")
		}
	}

	// Connect to MongoDB
	config.ConnectDB()
	fmt.Println("✅ Connected to MongoDB:", config.GetDB().Name())

	// Create router
	router := mux.NewRouter()

	// Health check (public)
	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	// Register routes (prefix handled inside routes.ProfileRoutes)
	routes.ProfileRoutes(router)

	// Optional: log unmatched routes
	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("404 Not Found: %s %s\n", r.Method, r.URL.Path)
		http.Error(w, "404 not found", http.StatusNotFound)
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Println("Profile service running on :", port)
	log.Fatal(http.ListenAndServe(":"+port, CORSMiddleware(router)))
}
