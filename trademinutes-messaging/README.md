# TradeMinutes Messaging Service

A realtime messaging service built with **Go**, **WebSockets**, and **MongoDB** for the TradeMinutes platform.

## Features

- **Realtime messaging** using WebSockets
- **Direct and group conversations**
- **Typing indicators**
- **Read receipts**
- **Message persistence** in MongoDB
- **Conversation management**

## Setup

1. **Create a `.env` file** in the root directory:
```bash
MONGO_URI=mongodb://localhost:27017
DB_NAME=trademinutes
PORT=8085
```

2. **Install dependencies**:
```bash
go mod tidy
```

3. **Run the service**:
```bash
go run main.go
```

## API Endpoints

### WebSocket Connection
- **Endpoint**: `ws://localhost:8085/ws?userId=<user_id>`
- **Purpose**: Real-time messaging connection

### REST API

#### Get Conversations
- **GET** `/api/conversations?userId=<user_id>`
- **Response**: List of user's conversations

#### Create Conversation
- **POST** `/api/conversations`
- **Body**:
```json
{
  "type": "direct",
  "name": "Chat with John",
  "avatar": "https://...",
  "participants": ["user1", "user2"]
}
```

#### Get Messages
- **GET** `/api/conversations/{conversation_id}/messages`
- **Response**: List of messages in conversation

## WebSocket Message Types

### Send Message
```json
{
  "type": "message",
  "roomId": "conversation_id",
  "senderName": "John Doe",
  "senderAvatar": "https://...",
  "content": "Hello!"
}
```

### Typing Indicator
```json
{
  "type": "typing",
  "roomId": "conversation_id",
  "userName": "John Doe",
  "isTyping": true
}
```

### Read Receipt
```json
{
  "type": "read",
  "roomId": "conversation_id",
  "messageId": "message_id"
}
```

## Frontend Integration

The frontend can connect to this service using the WebSocket API and REST endpoints for a complete realtime messaging experience. 