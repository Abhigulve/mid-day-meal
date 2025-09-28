# Mid-Day Meal Management System - Complete Setup Guide

This guide will help you set up the complete Mid-Day Meal Management System including backend, web frontend, and mobile app.

## System Overview

The system consists of:
- **Backend**: Java Spring Boot REST API
- **Web Frontend**: React web application
- **Mobile App**: React Native mobile application
- **Database**: PostgreSQL

## Prerequisites

Before starting, ensure you have:

### Required Software
- **Java 17+** - For backend development
- **Node.js 16+** - For frontend development
- **PostgreSQL 12+** - Database
- **Maven 3.6+** - Java build tool
- **Git** - Version control

### Development Tools (Recommended)
- **IntelliJ IDEA** or **VS Code** - IDE
- **Postman** - API testing
- **pgAdmin** - PostgreSQL management
- **Android Studio** - For mobile development
- **Expo CLI** - For React Native development

## Step-by-Step Setup

### 1. Clone and Setup Project Structure

```bash
# Navigate to your development directory
cd /path/to/your/projects

# The project structure should be:
mid-day-meal/
├── backend/           # Spring Boot backend
├── frontend-web/      # React web app
├── mobile-app/        # React Native app
├── database/          # Database scripts
└── docs/             # Documentation
```

### 2. Database Setup

#### Install PostgreSQL
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# On Windows
# Download and install from: https://www.postgresql.org/download/windows/
```

#### Create Database and User
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE middaymeal_db;
CREATE USER middaymeal_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE middaymeal_db TO middaymeal_user;
\q
```

#### Setup Schema and Sample Data
```bash
# Navigate to database directory
cd mid-day-meal/database

# Create schema
psql -U middaymeal_user -d middaymeal_db -f schema.sql

# Load sample data
psql -U middaymeal_user -d middaymeal_db -f sample_data.sql
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd mid-day-meal/backend

# Install dependencies and build
mvn clean install

# Update application.yml with your database credentials if needed
# Default configuration should work with the setup above

# Run the backend
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

#### Verify Backend Setup
```bash
# Test API endpoint
curl http://localhost:8080/api/schools

# Access Swagger UI
# Open browser: http://localhost:8080/swagger-ui.html
```

### 4. Web Frontend Setup

```bash
# Navigate to frontend directory
cd mid-day-meal/frontend-web

# Install dependencies
npm install

# Start development server
npm start
```

The web app will open at `http://localhost:3000`

### 5. Mobile App Setup

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Navigate to mobile app directory
cd mid-day-meal/mobile-app

# Install dependencies
npm install

# Start Expo development server
npm start
```

#### Run on Different Platforms
```bash
# Android (requires Android Studio/emulator)
npm run android

# iOS (requires Xcode, macOS only)
npm run ios

# Web version
npm run web
```

## Default Login Credentials

After setting up sample data, you can login with:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin | admin123 | System administrator |
| Principal | principal_gps001 | principal123 | School principal |
| Teacher | teacher_gps001 | teacher123 | School teacher |
| Supervisor | supervisor | supervisor123 | District supervisor |

## Testing the Complete System

### 1. Test Backend APIs
```bash
# Login to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use the token to access protected endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/schools
```

### 2. Test Web Application
1. Open `http://localhost:3000`
2. Login with admin credentials
3. Navigate through different sections:
   - Dashboard
   - Schools
   - Menus
   - Meal Records
   - Reports

### 3. Test Mobile Application
1. Use Expo Go app on your phone, or
2. Use Android/iOS simulator
3. Scan QR code from Expo dev server
4. Test the same functionality as web app

## Production Deployment

### Backend Deployment
```bash
# Build production JAR
mvn clean package -Pprod

# Run production build
java -jar target/midday-meal-backend-1.0.0.jar
```

### Web Frontend Deployment
```bash
# Build for production
npm run build

# Deploy the 'build' folder to your web server
# (Apache, Nginx, or cloud hosting service)
```

### Mobile App Deployment
```bash
# Build Android APK
expo build:android

# Build iOS IPA (requires Apple Developer account)
expo build:ios
```

## Environment Variables for Production

### Backend (.env or system environment)
```bash
DB_USERNAME=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_jwt_secret_key_at_least_32_chars
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_APP_NAME=Mid-Day Meal Management
```

### Mobile App
Update `ApiService.ts` with production API URL:
```typescript
const BASE_URL = 'https://your-api-domain.com/api';
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PostgreSQL service is running
   - Verify credentials in application.yml
   - Ensure database exists and user has permissions

2. **CORS Issues**
   - Backend includes CORS configuration
   - Check if frontend URL is in allowed origins

3. **JWT Token Issues**
   - Ensure JWT secret is set
   - Check token expiration time
   - Verify Authorization header format

4. **Mobile App Network Issues**
   - Use correct IP address for local development
   - Check firewall settings
   - Ensure backend is accessible from mobile device

### Getting Help

1. Check application logs for detailed error messages
2. Verify all services are running on correct ports
3. Test API endpoints individually using Postman
4. Check browser developer tools for frontend issues

## Next Steps

After successful setup:

1. **Customize the system** for your specific requirements
2. **Import real school data** replacing sample data
3. **Configure user roles** and permissions
4. **Set up backup procedures** for the database
5. **Configure monitoring** and logging for production
6. **Train users** on the system functionality

## Support

For technical support or questions:
- Check the individual README files in each component directory
- Review the API documentation at `/swagger-ui.html`
- Examine the sample data to understand the data model