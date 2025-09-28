#!/bin/bash

# Production Deployment Script for Mid-Day Meal Management System
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Mid-Day Meal Management System"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

echo -e "${BLUE}🍽️  ${PROJECT_NAME} - Production Deployment${NC}"
echo -e "${BLUE}================================================${NC}"

# Function to check if required files exist
check_requirements() {
    echo -e "${YELLOW}📋 Checking requirements...${NC}"
    
    local required_files=(
        "$COMPOSE_FILE"
        "database/schema.sql"
        "database/production_setup.sql"
        "backend/Dockerfile"
        "frontend-web/Dockerfile"
        "nginx/nginx.prod.conf"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}❌ Required file not found: $file${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ All required files found${NC}"
}

# Function to create environment file
create_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${YELLOW}📝 Creating production environment file...${NC}"
        
        # Generate random passwords
        DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
        JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
        
        cat > "$ENV_FILE" << EOF
# Production Environment Variables
# Generated on $(date)

# Database Configuration
DB_PASSWORD=$DB_PASSWORD

# JWT Configuration  
JWT_SECRET=$JWT_SECRET

# API Configuration
API_URL=http://localhost:8080/api

# Backup Configuration
BACKUP_RETENTION_DAYS=30
EOF
        
        echo -e "${GREEN}✅ Environment file created: $ENV_FILE${NC}"
        echo -e "${YELLOW}🔒 Please secure the environment file and backup the passwords!${NC}"
    else
        echo -e "${GREEN}✅ Environment file already exists${NC}"
    fi
}

# Function to make database setup scripts executable
setup_database_scripts() {
    echo -e "${YELLOW}🔧 Setting up database scripts...${NC}"
    
    if [ -f "database/setup_scripts.sh" ]; then
        chmod +x database/setup_scripts.sh
        echo -e "${GREEN}✅ Database setup scripts are ready${NC}"
    fi
}

# Function to build and deploy
deploy() {
    echo -e "${YELLOW}🚀 Starting production deployment...${NC}"
    
    # Stop existing containers
    echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    
    # Remove old images (optional)
    read -p "Do you want to rebuild all images? (y/N): " rebuild
    if [[ $rebuild =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🔨 Rebuilding images...${NC}"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache
    fi
    
    # Start services
    echo -e "${YELLOW}🏗️  Starting production services...${NC}"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    echo -e "${GREEN}✅ Deployment started${NC}"
}

# Function to check service health
check_health() {
    echo -e "${YELLOW}🏥 Checking service health...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo -e "${YELLOW}Attempt $attempt/$max_attempts...${NC}"
        
        # Check database
        if docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U middaymeal_user -d middaymeal_db > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Database is healthy${NC}"
            
            # Check backend
            if curl -f http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Backend is healthy${NC}"
                
                # Check frontend
                if curl -f http://localhost:3000 > /dev/null 2>&1; then
                    echo -e "${GREEN}✅ Frontend is healthy${NC}"
                    echo -e "${GREEN}🎉 All services are healthy!${NC}"
                    return 0
                fi
            fi
        fi
        
        sleep 10
        ((attempt++))
    done
    
    echo -e "${RED}❌ Health check failed after $max_attempts attempts${NC}"
    echo -e "${YELLOW}💡 Check logs with: docker-compose -f $COMPOSE_FILE logs${NC}"
    return 1
}

# Function to show deployment info
show_deployment_info() {
    echo
    echo -e "${BLUE}🌐 Deployment Information${NC}"
    echo -e "${BLUE}========================${NC}"
    echo -e "📱 Web Application: ${GREEN}http://localhost:3000${NC}"
    echo -e "🔌 Backend API: ${GREEN}http://localhost:8080/api${NC}"
    echo -e "🌍 Full System: ${GREEN}http://localhost${NC}"
    echo -e "📊 API Documentation: ${GREEN}http://localhost:8080/swagger-ui.html${NC}"
    echo
    echo -e "${YELLOW}👤 Default Admin Credentials:${NC}"
    echo -e "   Username: ${GREEN}admin${NC}"
    echo -e "   Password: ${RED}admin123${NC} ${YELLOW}(CHANGE IMMEDIATELY!)${NC}"
    echo
    echo -e "${YELLOW}🔧 Management Commands:${NC}"
    echo -e "   View logs: ${GREEN}docker-compose -f $COMPOSE_FILE logs -f${NC}"
    echo -e "   Stop services: ${GREEN}docker-compose -f $COMPOSE_FILE down${NC}"
    echo -e "   Database management: ${GREEN}./database/setup_scripts.sh${NC}"
    echo
}

# Function to create backup script
create_backup_script() {
    cat > "backup-production.sh" << 'EOF'
#!/bin/bash
# Production Backup Script

set -e

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="middaymeal_backup_$DATE.sql"

mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U middaymeal_user middaymeal_db > "$BACKUP_DIR/$BACKUP_FILE"

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"
echo "Backup compressed: $BACKUP_DIR/$BACKUP_FILE.gz"

# Clean old backups (keep last 30 days)
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

echo "Backup completed successfully!"
EOF
    
    chmod +x "backup-production.sh"
    echo -e "${GREEN}✅ Backup script created: backup-production.sh${NC}"
}

# Main execution
main() {
    cd "$(dirname "$0")"
    
    check_requirements
    create_env_file
    setup_database_scripts
    
    echo
    read -p "Do you want to proceed with production deployment? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ Deployment cancelled${NC}"
        exit 0
    fi
    
    deploy
    
    echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
    sleep 20
    
    if check_health; then
        show_deployment_info
        create_backup_script
        
        echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
        echo -e "${RED}⚠️  IMPORTANT: Change the default admin password immediately!${NC}"
    else
        echo -e "${RED}❌ Deployment completed but health checks failed${NC}"
        echo -e "${YELLOW}💡 Please check the service logs for issues${NC}"
    fi
}

# Check if running directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi