package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/ElioCloud/shared-models/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var bookingCollection *mongo.Collection
var notificationCollection *mongo.Collection
var userCollection *mongo.Collection

// SetBookingCollection injects the MongoDB collection
func SetBookingCollection(c *mongo.Collection) {
	bookingCollection = c
}

// SetNotificationCollection injects the Moyes ngoDB collection for notifications
func SetNotificationCollection(c *mongo.Collection) {
	notificationCollection = c
}

// SetUserCollection injects the users collection
func SetUserCollection(c *mongo.Collection) {
	userCollection = c
}

// Create a booking
func CreateBookingHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var booking models.Booking
		if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate required fields
		if booking.TaskID.IsZero() || booking.BookerID.IsZero() || booking.TaskOwnerID.IsZero() || booking.Credits <= 0 || booking.Timeslot.Date == "" || booking.Timeslot.TimeFrom == "" || booking.Timeslot.TimeTo == "" {
			http.Error(w, "Missing required fields", http.StatusBadRequest)
			return
		}

		// Check if booker has enough credits
		var booker models.User
		err := userCollection.FindOne(context.TODO(), bson.M{"_id": booking.BookerID}).Decode(&booker)
		if err != nil {
			http.Error(w, "Booker not found", http.StatusNotFound)
			return
		}
		if booker.Credits < booking.Credits {
			http.Error(w, "Not enough credits to book this task", http.StatusPaymentRequired)
			return
		}

		// Deduct credits from booker
		_, err = userCollection.UpdateOne(
			context.TODO(),
			bson.M{"_id": booking.BookerID},
			bson.M{"$inc": bson.M{"credits": -booking.Credits}},
		)
		if err != nil {
			http.Error(w, "Failed to deduct credits", http.StatusInternalServerError)
			return
		}

		// Prevent multiple active bookings for the same task and user
		activeFilter := bson.M{
			"taskId": booking.TaskID,
			"bookerId": booking.BookerID,
			"status": bson.M{"$in": []string{"pending", "confirmed"}},
		}
		count, err := bookingCollection.CountDocuments(context.TODO(), activeFilter)
		if err != nil {
			http.Error(w, "Error checking existing bookings", http.StatusInternalServerError)
			return
		}
		if count > 0 {
			http.Error(w, "You already have an active booking for this task", http.StatusConflict)
			return
		}

		// Set server-side fields
		booking.ID = primitive.NewObjectID()
		booking.BookedAt = time.Now().Unix()
		if booking.Status == "" {
			booking.Status = "pending"
		}

		_, err = bookingCollection.InsertOne(context.TODO(), booking)
		if err != nil {
			http.Error(w, "Failed to save booking", http.StatusInternalServerError)
			return
		}

		// Insert notification for task owner
		if notificationCollection != nil {
			notification := models.Notification{
				ID:        primitive.NewObjectID(),
				UserID:    booking.TaskOwnerID,
				Type:      "booking",
				Title:     "New Booking Request",
				Message:   "You have a new booking request for your task.",
				Timestamp: time.Now().Unix(),
				Read:      false,
				TaskID:    booking.TaskID,
			}
			_, _ = notificationCollection.InsertOne(context.TODO(), notification)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"bookingId": booking.ID,
			"message":   "Booking created successfully",
		})
	}
}

// AcceptBookingHandler sets booking status to confirmed and notifies the booker
func AcceptBookingHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			BookingID string `json:"bookingId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		bookingID, err := primitive.ObjectIDFromHex(req.BookingID)
		if err != nil {
			http.Error(w, "Invalid booking ID", http.StatusBadRequest)
			return
		}
		// Update booking status to confirmed
		update := bson.M{"$set": bson.M{"status": "confirmed", "confirmedAt": time.Now().Unix()}}
		res := bookingCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": bookingID}, update)
		var booking models.Booking
		if err := res.Decode(&booking); err != nil {
			http.Error(w, "Booking not found", http.StatusNotFound)
			return
		}
		// Insert notification for booker
		if notificationCollection != nil {
			notification := models.Notification{
				ID:        primitive.NewObjectID(),
				UserID:    booking.BookerID,
				Type:      "booking_accepted",
				Title:     "Booking Accepted",
				Message:   "Your booking has been accepted!",
				Timestamp: time.Now().Unix(),
				Read:      false,
				TaskID:    booking.TaskID,
			}
			_, _ = notificationCollection.InsertOne(context.TODO(), notification)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Booking accepted and user notified",
		})
	}
}

// CancelBookingHandler cancels a booking
func CancelBookingHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			BookingID   string `json:"bookingId"`
			CancelledBy string `json:"cancelledBy"` // "booker" or "owner"
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"message": "Invalid request body"})
			return
		}
		bookingID, err := primitive.ObjectIDFromHex(req.BookingID)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"message": "Invalid booking ID"})
			return
		}
		update := bson.M{"$set": bson.M{
			"status":      "cancelled",
			"cancelledAt": time.Now().Unix(),
			"cancelledBy": req.CancelledBy,
		}}
		res := bookingCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": bookingID}, update)
		var booking models.Booking
		if err := res.Decode(&booking); err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"message": "Booking not found"})
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Booking cancelled successfully",
		})
	}
}

// CompleteBookingHandler sets booking and task status to completed and notifies the booker
func CompleteBookingHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			BookingID string `json:"bookingId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		bookingID, err := primitive.ObjectIDFromHex(req.BookingID)
		if err != nil {
			http.Error(w, "Invalid booking ID", http.StatusBadRequest)
			return
		}
		// Update booking status to completed
		update := bson.M{"$set": bson.M{"status": "completed", "completedAt": time.Now().Unix()}}
		res := bookingCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": bookingID}, update)
		var booking models.Booking
		if err := res.Decode(&booking); err != nil {
			http.Error(w, "Booking not found", http.StatusNotFound)
			return
		}
		// Update task status to completed
		if !booking.TaskID.IsZero() && taskCollection != nil {
			_, _ = taskCollection.UpdateOne(context.TODO(), bson.M{"_id": booking.TaskID}, bson.M{"$set": bson.M{"status": "completed"}})
		}
		// Insert notification for booker
		if notificationCollection != nil {
			notification := models.Notification{
				ID:        primitive.NewObjectID(),
				UserID:    booking.BookerID,
				Type:      "booking_completed",
				Title:     "Service Completed",
				Message:   "Your booked service has been marked as completed by the provider.",
				Timestamp: time.Now().Unix(),
				Read:      false,
				TaskID:    booking.TaskID,
			}
			_, _ = notificationCollection.InsertOne(context.TODO(), notification)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Booking and task marked as completed, client notified",
		})
	}
}

// GetBookingsHandler returns all bookings for a specific user (owner or booker)
func GetBookingsHandler(w http.ResponseWriter, r *http.Request) {
	idHex := r.URL.Query().Get("id")
	role := r.URL.Query().Get("role") // "owner" or "booker"

	if idHex == "" || (role != "owner" && role != "booker") {
		http.Error(w, "Missing or invalid parameters", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(idHex)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var filter bson.M
	if role == "owner" {
		filter = bson.M{"taskOwnerId": userID}
	} else {
		filter = bson.M{"bookerId": userID}
	}

	cursor, err := bookingCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error fetching bookings", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var bookings []models.Booking
	if err = cursor.All(context.Background(), &bookings); err != nil {
		http.Error(w, "Error decoding bookings", http.StatusInternalServerError)
		return
	}

	var enriched []map[string]interface{}
	for _, booking := range bookings {
		m := make(map[string]interface{})
		data, _ := json.Marshal(booking)
		_ = json.Unmarshal(data, &m)

		// Fetch task title
		var task models.Task
		if booking.TaskID.IsZero() {
			m["taskTitle"] = ""
		} else {
			err := taskCollection.FindOne(context.Background(), bson.M{"_id": booking.TaskID}).Decode(&task)
			if err == nil {
				m["taskTitle"] = task.Title
			} else {
				m["taskTitle"] = ""
			}
		}

		enriched = append(enriched, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(enriched)
}

// GetNotificationsHandler returns all notifications for a user (by userId query param)
func GetNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	userIdHex := r.URL.Query().Get("userId")
	if userIdHex == "" {
		http.Error(w, "Missing userId parameter", http.StatusBadRequest)
		return
	}
	userId, err := primitive.ObjectIDFromHex(userIdHex)
	if err != nil {
		http.Error(w, "Invalid userId", http.StatusBadRequest)
		return
	}
	filter := bson.M{"userId": userId}
	cursor, err := notificationCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error fetching notifications", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var notifications []models.Notification
	if err = cursor.All(context.Background(), &notifications); err != nil {
		http.Error(w, "Error decoding notifications", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

// MarkAllNotificationsReadHandler marks all notifications as read for a user
func MarkAllNotificationsReadHandler(w http.ResponseWriter, r *http.Request) {
	userIdHex := r.URL.Query().Get("userId")
	if userIdHex == "" {
		http.Error(w, "Missing userId parameter", http.StatusBadRequest)
		return
	}
	userId, err := primitive.ObjectIDFromHex(userIdHex)
	if err != nil {
		http.Error(w, "Invalid userId", http.StatusBadRequest)
		return
	}
	filter := bson.M{"userId": userId, "read": false}
	update := bson.M{"$set": bson.M{"read": true}}
	_, err = notificationCollection.UpdateMany(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Failed to mark notifications as read", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "All notifications marked as read"}`))
}
