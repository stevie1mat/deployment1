package routes

import (
	"net/http"                      // required for http.HandlerFunc
	"trademinutes-auth/controllers" // controller handlers
	"trademinutes-auth/middleware"  // JWT middleware

	"github.com/gorilla/mux"
)

func AuthRoutes(router *mux.Router) {
	authRouter := router.PathPrefix("/api/auth").Subrouter()

	authRouter.HandleFunc("/register", controllers.RegisterHandler).Methods("POST")
	authRouter.HandleFunc("/login", controllers.LoginHandler).Methods("POST")
	authRouter.Handle("/profile", middleware.JWTAuthMiddleware(http.HandlerFunc(controllers.ProfileHandler))).Methods("GET")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPasswordHandler).Methods("POST")
	authRouter.HandleFunc("/reset-password", controllers.ResetPasswordHandler).Methods("POST")
	authRouter.HandleFunc("/github", controllers.GitHubOAuthHandler).Methods("POST")
	authRouter.HandleFunc("/google", controllers.GitHubOAuthHandler).Methods("POST")
	authRouter.HandleFunc("/user/{id}", controllers.GetUserByIDHandler).Methods("GET")
}
