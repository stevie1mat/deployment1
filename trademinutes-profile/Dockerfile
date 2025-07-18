# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go modules and download dependencies
COPY go.mod go.sum ./
COPY shared-models ./shared-models
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN go build -o profile-service main.go

# Stage 2: Final image
FROM alpine:latest

WORKDIR /root/

# Copy the compiled Go binary from builder
COPY --from=builder /app/profile-service .

# Expose port
EXPOSE 8081

# Run the binary
CMD ["./profile-service"]

