#!/bin/bash

# Database Setup Scripts for Mid-Day Meal Management System
# Use these scripts to manage production vs development data

set -e

DB_NAME="middaymeal_db"
DB_USER="middaymeal_user"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run SQL script
run_sql_script() {
    local script_file=$1
    local description=$2
    
    echo -e "${YELLOW}Running: $description${NC}"
    
    if [ -f "$script_file" ]; then
        PGPASSWORD=password psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$script_file"
        echo -e "${GREEN}✅ $description completed${NC}"
    else
        echo -e "${RED}❌ Script file not found: $script_file${NC}"
        exit 1
    fi
}

# Function to setup production database
setup_production() {
    echo -e "${YELLOW}🏭 Setting up PRODUCTION database...${NC}"
    echo -e "${RED}⚠️  WARNING: This will remove ALL sample data!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" == "yes" ]; then
        run_sql_script "production_setup.sql" "Production database setup"
        echo -e "${GREEN}🎉 Production database setup complete!${NC}"
        echo -e "${YELLOW}📝 Default admin credentials:${NC}"
        echo -e "   Username: admin"
        echo -e "   Password: admin123"
        echo -e "${RED}🔒 IMPORTANT: Change the admin password immediately!${NC}"
    else
        echo -e "${YELLOW}❌ Production setup cancelled${NC}"
    fi
}

# Function to restore sample data
restore_sample_data() {
    echo -e "${YELLOW}🧪 Restoring sample data for testing/demo...${NC}"
    echo -e "${RED}⚠️  WARNING: This will replace ALL existing data!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" == "yes" ]; then
        run_sql_script "restore_sample_data.sql" "Sample data restoration"
        echo -e "${GREEN}🎉 Sample data restored successfully!${NC}"
        echo -e "${YELLOW}📝 Demo credentials available:${NC}"
        echo -e "   Admin: admin / admin123"
        echo -e "   Principal: principal_gps001 / principal123"
        echo -e "   Teacher: teacher_gps001 / teacher123"
    else
        echo -e "${YELLOW}❌ Sample data restoration cancelled${NC}"
    fi
}

# Function to cleanup production data (keep master data)
cleanup_prod_data() {
    echo -e "${YELLOW}🧹 Cleaning production data (keeping master data)...${NC}"
    echo -e "${YELLOW}ℹ️  This will remove transactional data but keep schools and food items${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" == "yes" ]; then
        run_sql_script "cleanup_prod_data.sql" "Production data cleanup"
        echo -e "${GREEN}🎉 Production data cleaned successfully!${NC}"
    else
        echo -e "${YELLOW}❌ Data cleanup cancelled${NC}"
    fi
}

# Function to show database status
show_status() {
    echo -e "${YELLOW}📊 Database Status:${NC}"
    echo
    
    # Check if database exists and is accessible
    if PGPASSWORD=password psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\l" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Database connection: OK${NC}"
        
        # Get table counts
        echo -e "${YELLOW}📈 Data Summary:${NC}"
        PGPASSWORD=password psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        SELECT 
            'Schools' as table_name, COUNT(*) as count FROM schools
        UNION ALL
        SELECT 'Users', COUNT(*) FROM users
        UNION ALL  
        SELECT 'Students', COUNT(*) FROM students
        UNION ALL
        SELECT 'Food Items', COUNT(*) FROM food_items
        UNION ALL
        SELECT 'Menus', COUNT(*) FROM menus
        UNION ALL
        SELECT 'Meal Records', COUNT(*) FROM meal_records;
        "
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        echo -e "${YELLOW}💡 Make sure PostgreSQL is running and credentials are correct${NC}"
    fi
}

# Function to backup database
backup_database() {
    local backup_file="middaymeal_backup_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${YELLOW}💾 Creating database backup: $backup_file${NC}"
    
    PGPASSWORD=password pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > "$backup_file"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup created successfully: $backup_file${NC}"
    else
        echo -e "${RED}❌ Backup failed${NC}"
    fi
}

# Main menu
show_menu() {
    echo
    echo -e "${YELLOW}🍽️  Mid-Day Meal Database Management${NC}"
    echo -e "${YELLOW}====================================${NC}"
    echo "1. Setup Production Database (Clean)"
    echo "2. Restore Sample Data (Demo/Testing)"
    echo "3. Cleanup Production Data (Keep Master Data)"
    echo "4. Show Database Status"
    echo "5. Backup Database"
    echo "6. Exit"
    echo
}

# Main execution
main() {
    cd "$(dirname "$0")"
    
    while true; do
        show_menu
        read -p "Please select an option (1-6): " choice
        
        case $choice in
            1)
                setup_production
                ;;
            2)
                restore_sample_data
                ;;
            3)
                cleanup_prod_data
                ;;
            4)
                show_status
                ;;
            5)
                backup_database
                ;;
            6)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please select 1-6.${NC}"
                ;;
        esac
        
        echo
        read -p "Press Enter to continue..."
    done
}

# Check if running directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi