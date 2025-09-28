# 🐳 Docker Setup Guide - Mid-Day Meal Management System

This guide will help you run the complete Mid-Day Meal Management System using Docker Compose.

## 📋 Prerequisites

Make sure you have Docker and Docker Compose installed:

### Install Docker
- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### Install Docker Compose
Docker Compose comes bundled with Docker Desktop. For Linux:
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
cd mid-day-meal
```

### 2. Run Setup Script
```bash
./setup-local.sh
```

That's it! The script will:
- ✅ Check Docker installation
- 🔧 Configure all services
- 🏗️ Build Docker images
- 🚀 Start all services
- ⏳ Wait for services to be healthy
- 📊 Show service status

## 🌐 Access the System

Once setup is complete, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Web App** | http://localhost:3000 | React web application |
| **Backend API** | http://localhost:8080/api | Spring Boot REST API |
| **API Docs** | http://localhost:8080/swagger-ui.html | Interactive API documentation |
| **Full System** | http://localhost | Complete system via Nginx |

## 🔑 Default Login Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | admin | admin123 | Full system access |
| **Principal** | principal_gps001 | principal123 | School management |
| **Teacher** | teacher_gps001 | teacher123 | Daily operations |
| **Supervisor** | supervisor | supervisor123 | Multi-school oversight |

## 🛠️ Management Commands

### View Logs
```bash
# All services
./logs.sh all

# Specific service
./logs.sh backend
./logs.sh postgres
./logs.sh frontend-web
```

### Stop System
```bash
./stop-local.sh
```

### Restart Services
```bash
# Restart specific service
docker-compose restart backend

# Restart all services
docker-compose restart
```

### Clean Up (Remove all data)
```bash
docker-compose down -v --remove-orphans
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (Port 80)                     │
│                     Reverse Proxy                          │
└─────────────────┬─────────────────┬─────────────────────────┘
                  │                 │
          ┌───────▼────────┐ ┌──────▼──────────────────────────┐
          │ React Frontend │ │     Spring Boot Backend         │
          │  (Port 3000)   │ │       (Port 8080)              │
          └────────────────┘ └──────┬──────────────────────────┘
                                    │
                            ┌───────▼────────┐
                            │  PostgreSQL    │
                            │  (Port 5432)   │
                            └────────────────┘
```

## 📱 Mobile App Setup

The React Native mobile app runs separately. To set it up:

1. **Install Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```

2. **Navigate to mobile app**:
   ```bash
   cd mobile-app
   npm install
   ```

3. **Update API URL** in `src/services/ApiService.ts`:
   ```typescript
   const BASE_URL = 'http://localhost:8080/api';
   ```

4. **Start mobile app**:
   ```bash
   npm start
   ```

## 🔧 Troubleshooting

### Port Conflicts
If you get port conflict errors:
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8080
lsof -i :5432

# Kill processes using those ports
sudo kill -9 <PID>
```

### Database Issues
```bash
# Reset database completely
docker-compose down -v
./setup-local.sh
```

### Backend Build Issues
```bash
# Rebuild backend only
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Frontend Issues
```bash
# Rebuild frontend only
docker-compose build --no-cache frontend-web
docker-compose up -d frontend-web
```

### View Service Status
```bash
docker-compose ps
```

### Access Database Directly
```bash
docker-compose exec postgres psql -U middaymeal_user -d middaymeal_db
```

## 📊 Database Schema

The system automatically creates:
- **5 sample schools** with students
- **10+ food items** with Marathi names
- **Weekly menu** for September 2025
- **Sample meal records** with attendance data
- **User accounts** for testing different roles

## 🔄 Development Workflow

### Making Backend Changes
1. Make changes to Java code
2. Rebuild: `docker-compose build backend`
3. Restart: `docker-compose up -d backend`

### Making Frontend Changes
Frontend has hot reloading enabled, so changes appear automatically.

### Database Changes
1. Update `database/schema.sql` or `database/sample_data.sql`
2. Rebuild: `docker-compose down -v && ./setup-local.sh`

## 📈 Production Deployment

For production deployment:
1. Update environment variables in `.env`
2. Use production Docker Compose file
3. Set up proper SSL certificates
4. Configure domain names
5. Set up monitoring and backups

## 🆘 Getting Help

1. **Check logs**: `./logs.sh all`
2. **Verify Docker**: `docker --version && docker-compose --version`
3. **Check service health**: `docker-compose ps`
4. **Reset everything**: `docker-compose down -v && ./setup-local.sh`