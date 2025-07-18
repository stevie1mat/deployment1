# TradeMinutes Profile API

This is a user profile management API built with **Go** and **MongoDB**, using **JWT** for authentication. It allows updating user profile information with JWT-protected endpoints.

---

## 🛠️ Features

- Update user profile info
- JWT-based authentication middleware
- MongoDB for profile data storage

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ElioCloud/trademinutes-profile.git
cd trademinutes-profile
```

Initialize Go module
```bash
go mod init trademinutes-profile
go mod tidy
```

Create a .env file in the root directory with:
```bash
MONGO_URI=your_mongodb_uri
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=8081
```

Run the server
```bash
go run main.go
```