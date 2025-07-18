# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum first and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all source code
COPY . .

# Build the Go application
RUN go build -o main .

# Stage 2: Use a minimal image to run the binary
FROM alpine:latest

WORKDIR /root/

# Copy the compiled Go binary
COPY --from=builder /app/main .

# Expose the port your app listens on (optional for documentation)
EXPOSE 8085

# Run the application
CMD ["./main"]

