package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Message represents a chat message
type Message struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	RoomID       string             `bson:"roomId" json:"roomId"`
	SenderID     string             `bson:"senderId" json:"senderId"`
	SenderName   string             `bson:"senderName" json:"senderName"`
	SenderAvatar string             `bson:"senderAvatar" json:"senderAvatar"`
	Content      string             `bson:"content" json:"content"`
	Type         string             `bson:"type" json:"type"` // "text", "image", "file"
	Timestamp    int64              `bson:"timestamp" json:"timestamp"`
}

// Conversation represents a chat room
type Conversation struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Type         string             `bson:"type" json:"type"` // "direct", "group"
	Name         string             `bson:"name" json:"name"`
	Avatar       string             `bson:"avatar" json:"avatar"`
	Participants []string           `bson:"participants" json:"participants"`
	TaskID       string             `bson:"taskId,omitempty" json:"taskId,omitempty"`
	LastMessage  *Message           `bson:"lastMessage" json:"lastMessage"`
	CreatedAt    int64              `bson:"createdAt" json:"createdAt"`
	UpdatedAt    int64              `bson:"updatedAt" json:"updatedAt"`
}

// Client represents a connected WebSocket client
type Client struct {
	ID     string
	UserID string
	Conn   *websocket.Conn
	Send   chan []byte
	Hub    *Hub
}

// Hub manages all connected clients
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
}

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for development
		},
	}
	hub = &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
	db *mongo.Database
)

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			h.mutex.Unlock()
		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
			h.mutex.Unlock()
		case message := <-h.broadcast:
			h.mutex.RLock()
			for client := range h.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
			h.mutex.RUnlock()
		}
	}
}

func (c *Client) readPump() {
	defer func() {
		c.Hub.unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(512)
	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		// Parse the message
		var msgData map[string]interface{}
		if err := json.Unmarshal(message, &msgData); err != nil {
			log.Printf("error parsing message: %v", err)
			continue
		}

		// Handle different message types
		switch msgData["type"] {
		case "message":
			handleNewMessage(c, msgData)
		case "typing":
			handleTyping(c, msgData)
		case "read":
			handleReadReceipt(c, msgData)
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func handleNewMessage(client *Client, msgData map[string]interface{}) {
	// Create new message
	message := Message{
		ID:           primitive.NewObjectID(),
		RoomID:       msgData["roomId"].(string),
		SenderID:     client.UserID,
		SenderName:   msgData["senderName"].(string),
		SenderAvatar: msgData["senderAvatar"].(string),
		Content:      msgData["content"].(string),
		Type:         "text",
		Timestamp:    time.Now().Unix(),
	}

	// Save to database
	_, err := db.Collection("messages").InsertOne(context.Background(), message)
	if err != nil {
		log.Printf("error saving message: %v", err)
		return
	}

	// Update conversation's last message
	update := bson.M{
		"$set": bson.M{
			"lastMessage": message,
			"updatedAt":   time.Now().Unix(),
		},
	}
	db.Collection("conversations").UpdateOne(
		context.Background(),
		bson.M{"_id": msgData["roomId"]},
		update,
	)

	// Broadcast to all clients in the room
	messageBytes, _ := json.Marshal(map[string]interface{}{
		"type":    "message",
		"message": message,
	})

	hub.mutex.RLock()
	for c := range hub.clients {
		// Only send to clients in the same room
		if c.UserID != client.UserID { // Don't send back to sender
			select {
			case c.Send <- messageBytes:
			default:
				close(c.Send)
				delete(hub.clients, c)
			}
		}
	}
	hub.mutex.RUnlock()
}

func handleTyping(client *Client, msgData map[string]interface{}) {
	typingData := map[string]interface{}{
		"type":     "typing",
		"roomId":   msgData["roomId"],
		"userId":   client.UserID,
		"userName": msgData["userName"],
		"isTyping": msgData["isTyping"],
	}

	typingBytes, _ := json.Marshal(typingData)

	hub.mutex.RLock()
	for c := range hub.clients {
		if c.UserID != client.UserID {
			select {
			case c.Send <- typingBytes:
			default:
				close(c.Send)
				delete(hub.clients, c)
			}
		}
	}
	hub.mutex.RUnlock()
}

func handleReadReceipt(client *Client, msgData map[string]interface{}) {
	readData := map[string]interface{}{
		"type":      "read",
		"roomId":    msgData["roomId"],
		"userId":    client.UserID,
		"messageId": msgData["messageId"],
	}

	readBytes, _ := json.Marshal(readData)

	hub.mutex.RLock()
	for c := range hub.clients {
		if c.UserID != client.UserID {
			select {
			case c.Send <- readBytes:
			default:
				close(c.Send)
				delete(hub.clients, c)
			}
		}
	}
	hub.mutex.RUnlock()
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{
		ID:     primitive.NewObjectID().Hex(),
		UserID: userID,
		Conn:   conn,
		Send:   make(chan []byte, 256),
		Hub:    hub,
	}
	client.Hub.register <- client

	go client.writePump()
	go client.readPump()
}

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
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		log.Fatal("MongoDB Connect Error:", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB Ping Error:", err)
	}

	db = client.Database(os.Getenv("DB_NAME"))
	fmt.Println("✅ Connected to MongoDB:", db.Name())

	// Start the hub
	go hub.run()

	// Create router
	router := mux.NewRouter()

	// Health check
	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	// WebSocket endpoint
	router.HandleFunc("/ws", serveWs)

	// API endpoints
	router.HandleFunc("/api/conversations", getConversations).Methods("GET")
	router.HandleFunc("/api/conversations", createConversation).Methods("POST")
	router.HandleFunc("/api/conversations/{id}/messages", getMessages).Methods("GET")
	router.HandleFunc("/api/conversations/{id}/messages", postMessage).Methods("POST")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	log.Println("Messaging service running on :", port)
	log.Fatal(http.ListenAndServe(":"+port, CORSMiddleware(router)))
}

func getConversations(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	log.Printf("[getConversations] userID: %s", userID)

	cursor, err := db.Collection("conversations").Find(context.Background(), bson.M{
		"participants": userID,
	})
	if err != nil {
		http.Error(w, "Failed to fetch conversations", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var conversations []Conversation
	if err = cursor.All(context.Background(), &conversations); err != nil {
		http.Error(w, "Failed to decode conversations", http.StatusInternalServerError)
		return
	}

	log.Printf("[getConversations] found %d conversations", len(conversations))
	for _, conv := range conversations {
		log.Printf("[getConversations] conversation: %+v", conv)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(conversations)
}

func createConversation(w http.ResponseWriter, r *http.Request) {
	var conversation Conversation
	if err := json.NewDecoder(r.Body).Decode(&conversation); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	log.Printf("[createConversation] participants: %+v, taskId: %s", conversation.Participants, conversation.TaskID)

	// Check if a conversation already exists for these participants and taskId (if provided)
	filter := bson.M{
		"participants": bson.M{"$all": conversation.Participants, "$size": len(conversation.Participants)},
	}
	if conversation.TaskID != "" {
		filter["taskId"] = conversation.TaskID
	}
	var existing Conversation
	err := db.Collection("conversations").FindOne(context.Background(), filter).Decode(&existing)
	if err == nil {
		// Conversation already exists, return its ID
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(existing.ID)
		return
	}

	conversation.ID = primitive.NewObjectID()
	conversation.CreatedAt = time.Now().Unix()
	conversation.UpdatedAt = time.Now().Unix()

	result, err := db.Collection("conversations").InsertOne(context.Background(), conversation)
	if err != nil {
		http.Error(w, "Failed to create conversation", http.StatusInternalServerError)
		return
	}

	log.Printf("[createConversation] inserted conversation: %+v", conversation)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(result.InsertedID)
}

func getMessages(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomID := vars["id"]

	cursor, err := db.Collection("messages").Find(context.Background(), bson.M{
		"roomId": roomID,
	}, options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}).SetLimit(50))
	if err != nil {
		http.Error(w, "Failed to fetch messages", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var messages []Message
	if err = cursor.All(context.Background(), &messages); err != nil {
		http.Error(w, "Failed to decode messages", http.StatusInternalServerError)
		return
	}

	// Reverse the order to get chronological order
	for i, j := 0, len(messages)-1; i < j; i, j = i+1, j-1 {
		messages[i], messages[j] = messages[j], messages[i]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}

func postMessage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomID := vars["id"]

	var msg Message
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	msg.ID = primitive.NewObjectID()
	msg.RoomID = roomID
	msg.Timestamp = time.Now().Unix()

	_, err := db.Collection("messages").InsertOne(context.Background(), msg)
	if err != nil {
		http.Error(w, "Failed to save message", http.StatusInternalServerError)
		return
	}

	// Convert roomID string to ObjectID for the update
	objectID, err := primitive.ObjectIDFromHex(roomID)
	if err != nil {
		http.Error(w, "Invalid conversation ID", http.StatusBadRequest)
		return
	}

	// Update lastMessage and updatedAt in the conversation
	update := bson.M{
		"$set": bson.M{
			"lastMessage": msg,
			"updatedAt":   msg.Timestamp,
		},
	}
	_, _ = db.Collection("conversations").UpdateByID(context.Background(), objectID, update)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msg)
}
