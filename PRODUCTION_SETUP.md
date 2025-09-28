# 🏭 Production Setup Guide - Mid-Day Meal Management System

This guide walks you through setting up the Mid-Day Meal Management System for production use.

## 📋 Quick Start for Production

### 1. Clean Production Deployment

```bash
# Make scripts executable
chmod +x deploy-production.sh database/setup_scripts.sh

# Deploy to production (clean database)
./deploy-production.sh
```

### 2. Access Your System

- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/swagger-ui.html

### 3. Initial Login

- **Username**: `admin`
- **Password**: `admin123`
- **🚨 CHANGE THE PASSWORD IMMEDIATELY!**

## 🗄️ Database Management

### Clean Production Setup (Recommended for new deployments)

```bash
# Interactive database management
./database/setup_scripts.sh

# Or run specific operations:
cd database
psql -h localhost -U middaymeal_user -d middaymeal_db -f production_setup.sql
```

This will:
- Remove all sample data
- Keep only essential food items
- Create a single admin user
- Reset all sequences

### Restore Sample Data (For Testing/Demo)

```bash
# Use the interactive script
./database/setup_scripts.sh
# Select option 2: "Restore Sample Data"

# Or manually:
cd database
psql -h localhost -U middaymeal_user -d middaymeal_db -f restore_sample_data.sql
```

## 👨‍🏫 Teacher & Staff Management

### Admin Features

The system includes a comprehensive **Teacher Management** interface accessible at `/teachers`:

#### Available Roles:
- **TEACHER** - Classroom teachers
- **SCHOOL_ADMIN** - Principals and school administrators  
- **COOK** - Kitchen staff and cooks
- **SUPERVISOR** - District/regional supervisors

#### Features:
- ✅ Create new teachers/staff with role-based access
- ✅ Assign teachers to specific schools
- ✅ Edit user details and change roles
- ✅ Deactivate users (soft delete)
- ✅ Search and filter by role/school
- ✅ Summary statistics by role

### Adding a New Teacher (Admin Only)

1. Login as admin
2. Navigate to **Teacher & Staff Management** 
3. Click **"Add New Teacher/Staff"**
4. Fill in the form:
   - Username (unique)
   - Password (minimum 6 characters)
   - Full Name
   - Email and Phone
   - Role (Teacher/Principal/Cook/Supervisor)
   - Assign to School (optional)
5. Click **"Create"**

## 🔐 Security & Access Control

### Role-Based Permissions

- **ADMIN**: Full system access, can manage all data
- **SCHOOL_ADMIN**: Manage their school's data and users
- **TEACHER**: Record meals, view school data
- **COOK**: Record meal preparation details
- **SUPERVISOR**: View reports across multiple schools

### Password Security

- Passwords are bcrypt hashed
- Minimum 6 characters required
- Change default admin password immediately
- Users can update their own passwords

## 🚀 Deployment Options

### Option 1: Clean Production Deployment

```bash
# Automated production setup
./deploy-production.sh
```

### Option 2: Development with Sample Data

```bash
# Use regular docker-compose with sample data
docker-compose up -d
```

### Option 3: Manual Production Setup

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Setup clean database
./database/setup_scripts.sh
```

## 💾 Backup & Maintenance

### Automated Backups

```bash
# The deployment script creates a backup script
./backup-production.sh
```

### Manual Database Backup

```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U middaymeal_user middaymeal_db > backup.sql
```

### Database Maintenance

```bash
# View current status
./database/setup_scripts.sh
# Select option 4: "Show Database Status"

# Clean transactional data (keep master data)
./database/setup_scripts.sh  
# Select option 3: "Cleanup Production Data"
```

## 📊 Monitoring & Logs

### View Service Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/api/actuator/health

# Frontend health  
curl http://localhost:3000

# Nginx health
curl http://localhost/health
```

## 🔧 Configuration

### Environment Variables (.env.prod)

```bash
# Database
DB_PASSWORD=your_secure_password

# JWT Security
JWT_SECRET=your_jwt_secret_key

# API Configuration
API_URL=http://localhost:8080/api
```

### Nginx Configuration

Production nginx config includes:
- Rate limiting for API endpoints
- GZIP compression
- Security headers
- Static file caching
- HTTPS support (configure SSL certificates)

## 🏫 Setting Up Schools

### After Clean Installation

1. **Login as admin**
2. **Add Schools**:
   - Go to Schools section
   - Add your actual schools with correct details
   - Note the school codes for user assignment

3. **Add Teachers/Staff**:
   - Go to Teacher Management
   - Create users for each school
   - Assign appropriate roles and schools

4. **Configure Food Items**:
   - Review and modify the default food items
   - Add region-specific items
   - Update costs according to local rates

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check logs
docker-compose -f docker-compose.prod.yml logs postgres
```

#### Backend Not Starting
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Verify database is ready
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U middaymeal_user
```

#### Frontend Not Loading
```bash
# Check if backend is accessible
curl http://localhost:8080/api/actuator/health

# Check frontend logs
docker-compose -f docker-compose.prod.yml logs frontend-web
```

### Reset Everything

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down -v

# Remove all containers and volumes
docker system prune -a --volumes

# Redeploy
./deploy-production.sh
```

## 📞 Support

### Log Files Location

- **Application Logs**: Available via `docker-compose logs`
- **Database Logs**: Available via `docker-compose logs postgres`
- **Nginx Logs**: Available via `docker-compose logs nginx`

### Backup Important Data

Before any major changes:
1. Backup database: `./backup-production.sh`
2. Backup environment file: `cp .env.prod .env.prod.backup`
3. Backup custom configurations

---

## ✅ Production Checklist

- [ ] Deploy with clean production setup
- [ ] Change default admin password
- [ ] Add your schools
- [ ] Create teacher/staff accounts
- [ ] Configure food items and costs
- [ ] Set up regular backups
- [ ] Configure HTTPS (if needed)
- [ ] Test all functionality
- [ ] Train users on the system

**🎉 Your Mid-Day Meal Management System is ready for production use!**