package routes

import (
	"trademinutes-profile/controllers"
	"trademinutes-profile/middleware"

	"github.com/gorilla/mux"
)

func ProfileRoutes(router *mux.Router) {
	profileRouter := router.PathPrefix("/api/profile").Subrouter()
	profileRouter.Use(middleware.JWTMiddleware)
	profileRouter.HandleFunc("/get", controllers.GetProfileHandler).Methods("GET")
	profileRouter.HandleFunc("/update-info", controllers.UpdateProfileInfoHandler).Methods("POST")
}
