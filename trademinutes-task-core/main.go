package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"trademinutes-task-core/config"
	"trademinutes-task-core/controllers"
	"trademinutes-task-core/routes"

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
	controllers.SetTaskCollection(config.GetDB().Collection("tasks"))                 // Set task collection
	controllers.SetBookingCollection(config.GetDB().Collection("bookings"))           // Set booking collection
	controllers.SetNotificationCollection(config.GetDB().Collection("notifications")) // Set notification collection
	controllers.SetUserCollection(config.GetDB().Collection("MyClusterCol"))                 // Set user collection for creditschec
	fmt.Println("✅ Connected to MongoDB:", config.GetDB().Name())

	// Create router
	router := mux.NewRouter()

	// Health check (public)
	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	// Register routes
	// Pass all required arguments: router, db, jwtSecret
	db := config.GetDB()
	jwtSecret := os.Getenv("JWT_SECRET") // Make sure you have JWT_SECRET in .env or environment
	routes.TaskCreationRoutes(router, db, jwtSecret)
	routes.BookingRoutes(router, db, jwtSecret)
	router.HandleFunc("/api/notifications", controllers.GetNotificationsHandler).Methods("GET")
	router.HandleFunc("/api/notifications/mark-all-read", controllers.MarkAllNotificationsReadHandler).Methods("PUT")

	// Optional: log unmatched routes
	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("404 Not Found: %s %s\n", r.Method, r.URL.Path)
		http.Error(w, "404 not found", http.StatusNotFound)
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	log.Println("Task service running on :", port)
	log.Fatal(http.ListenAndServe(":"+port, CORSMiddleware(router)))
}
