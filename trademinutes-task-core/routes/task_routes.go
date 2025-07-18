package routes

import (
	"trademinutes-task-core/controllers"
	"trademinutes-task-core/middleware"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func TaskCreationRoutes(router *mux.Router, db *mongo.Database, jwtSecret string) {
	taskRouter := router.PathPrefix("/api/tasks").Subrouter()
	taskRouter.Use(middleware.JWTMiddleware)
	taskRouter.HandleFunc("/create", controllers.CreateTaskHandler(db, jwtSecret)).Methods("POST")
	taskRouter.HandleFunc("/get/all", controllers.GetAllTasksHandler(db)).Methods("GET")
	taskRouter.HandleFunc("/get/user", controllers.GetUserTasksHandler(db, jwtSecret)).Methods("GET")
	taskRouter.HandleFunc("/get/{id}", controllers.GetTaskByIdHandler).Methods("GET")
	taskRouter.HandleFunc("/update/{id}", controllers.UpdateTaskHandler).Methods("PUT")
	taskRouter.HandleFunc("/delete/{id}", controllers.DeleteTaskHandler).Methods("DELETE")
	taskRouter.HandleFunc("/categories", controllers.CategoriesHandler).Methods("GET")
}
