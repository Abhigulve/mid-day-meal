#!/bin/bash

# Mid-Day Meal Management System - Local Setup Script
# This script sets up the entire system using Docker Compose

set -e  # Exit on any error

echo "🍽️  Mid-Day Meal Management System - Local Setup"
echo "================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Navigate to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $(pwd)"

# Create necessary directories and files if they don't exist
echo "📋 Preparing project structure..."

# Create .env file for environment variables
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Database Configuration
POSTGRES_DB=middaymeal_db
POSTGRES_USER=middaymeal_user
POSTGRES_PASSWORD=password

# Backend Configuration
JWT_SECRET=mySecretKeyForJWTTokenGenerationAndValidation123456789
SPRING_PROFILES_ACTIVE=docker

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=Mid-Day Meal Management

# Development
NODE_ENV=development
EOL
fi

# Update backend application.yml for Docker
echo "⚙️  Configuring backend for Docker..."
if [ ! -f backend/src/main/resources/application-docker.yml ]; then
    mkdir -p backend/src/main/resources
    cat > backend/src/main/resources/application-docker.yml << EOL
spring:
  application:
    name: midday-meal-backend
  
  datasource:
    url: jdbc:postgresql://postgres:5432/middaymeal_db
    username: middaymeal_user
    password: password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  security:
    jwt:
      secret-key: \${JWT_SECRET:mySecretKeyForJWTTokenGenerationAndValidation123456789}
      expiration: 86400000

server:
  port: 8080
  servlet:
    context-path: /api

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized

logging:
  level:
    com.middaymeal: INFO
    org.springframework.security: INFO
EOL
fi

# Create frontend .env file
echo "⚙️  Configuring frontend..."
if [ ! -f frontend-web/.env ]; then
    cat > frontend-web/.env << EOL
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=Mid-Day Meal Management
GENERATE_SOURCEMAP=false
EOL
fi

# Function to check if a service is healthy
check_service_health() {
    local service_name=$1
    local max_attempts=30
    local attempt=1

    echo "🔍 Checking $service_name health..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "$service_name.*healthy\|$service_name.*running"; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        
        echo "⏳ Waiting for $service_name... (attempt $attempt/$max_attempts)"
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to become healthy"
    return 1
}

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down --remove-orphans

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for services to start..."
sleep 20

# Check service health
check_service_health "postgres" || {
    echo "❌ Database failed to start. Check logs:"
    docker-compose logs postgres
    exit 1
}

check_service_health "backend" || {
    echo "❌ Backend failed to start. Check logs:"
    docker-compose logs backend
    exit 1
}

# Show service status
echo ""
echo "📊 Service Status:"
docker-compose ps

# Show logs for a few seconds
echo ""
echo "📋 Recent logs:"
docker-compose logs --tail=10

echo ""
echo "🎉 Setup complete! Your Mid-Day Meal Management System is running!"
echo ""
echo "🌐 Access URLs:"
echo "   • Web Application:  http://localhost:3000"
echo "   • Backend API:      http://localhost:8080/api"
echo "   • API Documentation: http://localhost:8080/swagger-ui.html"
echo "   • Full System:      http://localhost (via Nginx)"
echo ""
echo "🔑 Default Login Credentials:"
echo "   • Admin:      username: admin,      password: admin123"
echo "   • Principal:  username: principal_gps001, password: principal123"
echo "   • Teacher:    username: teacher_gps001,   password: teacher123"
echo ""
echo "📱 For Mobile App Development:"
echo "   Update the API URL in mobile-app/src/services/ApiService.ts to:"
echo "   const BASE_URL = 'http://localhost:8080/api';"
echo ""
echo "🔧 Useful Commands:"
echo "   • Stop services:    ./stop-local.sh"
echo "   • View logs:        docker-compose logs -f [service_name]"
echo "   • Restart service:  docker-compose restart [service_name]"
echo "   • Clean up:         docker-compose down -v"
echo ""