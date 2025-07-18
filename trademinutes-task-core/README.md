# Task Creation API

This microservice provides endpoints for creating, retrieving, updating, and deleting tasks.

## Getting Started

1. **Create a `.env` file**  
  Use `.env.example` as a template.  
  - Set your MongoDB URI (Atlas or local).
  - Ensure `JWT_SECRET` matches the one used by the [auth](https://github.com/ElioCloud/trademinutes-auth) microservice.

2. **Port Configuration**  
  - Default port: `8084`
  - Change the port in your `.env` file if needed.

3. **Authentication**  
  - All endpoints require a **valid JWT token** from the frontend for security.

4. **Install Dependencies**  
  - Run `go mod tidy` to install Go module dependencies (recommended after cloning the repo).

5. **Run the Service**  
  - Start the API with:  
    ```bash
    go run main.go
    ```

## API Endpoints

### Create Task

- **Endpoint:** `POST /api/tasks/create`
  
**Example Request Body:**

  ```json
  {
   "title": "Help with homework",
   "description": "Need help with calculus",
   "location": "Maple Street",
   "latitude": 40.7128,
   "longitude": -74.0060,
   "locationType": "in-person",
   "credits": 10,
   "availability": [
    {
      "date": "2025-06-20",
      "timeFrom": "10:00",
      "timeTo": "12:00"
    }
   ]
  }
  ```

### Get Task

- **Endpoint:** `GET /api/tasks/get/all` to list all tasks.

- **Endpoint:** `GET /api/tasks/get/user` to list tasks for the logged-in user (requires JWT authentication).

- **Endpoint:** `GET /api/tasks/get/{TaskID}` to list a single task based on ID.

- **Endpoint:** `GET /api/tasks/categories` to fetch the list of task categories.

### Update Task

- **Endpoint:** `PUT /api/tasks/update/{TaskID}`

**Example Request Body:**
  ```json
  {
   "description": "Need help with calculus and English Presentation",
   "credits": 10
  }
  ```

### Delete Task

- **Endpoint:** `DELETE /api/tasks/delete/{TaskID}`

---

**Note:** Replace `{TaskID}` with the actual task ID which can be retrieved from the MongoDB database.

### Create Booking

- **Endpoint:** `POST /api/bookings/book`
**Example Request Body:**
  ```json
  {
    "taskId": "id_of_the_task_to_book",
    "bookerId": "id_of_the_user_who_books_the_task",
    "taskOwnerId": "id_of_of_the_task_author",
    "credits": 10,
    "timeslot": {
      "date": "2025-07-14",
      "timeFrom": "14:00",
      "timeTo": "15:30"
    },
    "status": "pending" // Optional; will default to "pending" if omitted
  }
  ```

### List Bookings by Role

- **GET** `/api/bookings?role=owner|booker&id=USER_ID`

**Query Parameters:**
- `role`: `"owner"` or `"booker"`
- `id`: MongoDB ObjectID of the user

**Examples:**
```http
GET /api/bookings?role=owner&id=60f5c2e1e3a45b7a4d3c9abc
GET /api/bookings?role=booker&id=60f5c2e1e3a45b7a4d3c9def
