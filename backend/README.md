# Mid-Day Meal Backend

Spring Boot backend service for the Mid-Day Meal Management System.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL and create database:
```sql
CREATE DATABASE middaymeal_db;
CREATE USER middaymeal_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE middaymeal_db TO middaymeal_user;
```

2. Run the schema script:
```bash
psql -U middaymeal_user -d middaymeal_db -f ../database/schema.sql
```

3. Load sample data:
```bash
psql -U middaymeal_user -d middaymeal_db -f ../database/sample_data.sql
```

### 2. Application Configuration

Update `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/middaymeal_db
    username: your_username
    password: your_password
```

### 3. Build and Run

```bash
# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. API Documentation

Once the application is running, access the Swagger UI at:
`http://localhost:8080/swagger-ui.html`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Schools
- `GET /api/schools` - Get all schools
- `POST /api/schools` - Create new school
- `PUT /api/schools/{id}` - Update school
- `DELETE /api/schools/{id}` - Delete school
- `GET /api/schools/search?query=` - Search schools

### Menus
- `GET /api/menus` - Get all menus
- `GET /api/menus/current-week` - Get current week menus
- `GET /api/menus/current-month` - Get current month menus
- `POST /api/menus` - Create new menu
- `PUT /api/menus/{id}` - Update menu

### Meal Records
- `GET /api/meal-records` - Get all meal records
- `GET /api/meal-records/today` - Get today's records
- `POST /api/meal-records` - Create new meal record
- `PUT /api/meal-records/{id}` - Update meal record

### Food Items
- `GET /api/food-items` - Get all food items
- `POST /api/food-items` - Create new food item
- `GET /api/food-items/search?query=` - Search food items

## Default Users

After loading sample data, you can login with:

- **Admin**: username: `admin`, password: `admin123`
- **Principal**: username: `principal_gps001`, password: `principal123`
- **Teacher**: username: `teacher_gps001`, password: `teacher123`

## Environment Variables

Set these environment variables for production:

```bash
export DB_USERNAME=your_db_username
export DB_PASSWORD=your_db_password
export JWT_SECRET=your_jwt_secret_key
```

## Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn integration-test
```

## Building for Production

```bash
# Create production JAR
mvn clean package -Pprod

# Run production JAR
java -jar target/midday-meal-backend-1.0.0.jar
```