# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum from task-core
COPY trademinutes-task-core/go.mod trademinutes-task-core/go.sum ./

# Copy shared models (required by replace in go.mod)
COPY shared-models ./shared-models

# Download Go dependencies
RUN go mod download

# Copy the actual source code
COPY trademinutes-task-core/ .

# Build the Go app
RUN go build -o main .

# Stage 2: Minimal image
FROM alpine:latest

WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8084
CMD ["./main"]

