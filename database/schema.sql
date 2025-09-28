-- Mid-Day Meal Management System Database Schema
-- PostgreSQL

-- Create database
-- CREATE DATABASE middaymeal_db;

-- Create user
-- CREATE USER middaymeal_user WITH PASSWORD 'password';
-- GRANT ALL PRIVILEGES ON DATABASE middaymeal_db TO middaymeal_user;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schools table
CREATE TABLE schools (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    principal_name VARCHAR(255),
    total_students INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'SUPERVISOR', 'COOK')),
    school_id BIGINT REFERENCES schools(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE food_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_marathi VARCHAR(255),
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('GRAINS', 'VEGETABLES', 'FRUITS', 'DAIRY', 'PROTEINS', 'SPICES', 'OIL', 'OTHERS')),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('KG', 'GRAM', 'LITRE', 'ML', 'PIECE', 'PACKET', 'BAG')),
    cost_per_unit DECIMAL(10,2),
    nutritional_info TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    category VARCHAR(10) CHECK (category IN ('GENERAL', 'OBC', 'SC', 'ST', 'EWS')),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    address TEXT,
    school_id BIGINT NOT NULL REFERENCES schools(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, roll_number)
);

-- Menus table
CREATE TABLE menus (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('BREAKFAST', 'LUNCH', 'SNACK', 'DINNER')),
    menu_description TEXT,
    menu_description_marathi TEXT,
    month INTEGER,
    year INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, meal_type)
);

-- Menu food items junction table
CREATE TABLE menu_food_items (
    id BIGSERIAL PRIMARY KEY,
    menu_id BIGINT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    food_item_id BIGINT NOT NULL REFERENCES food_items(id),
    quantity_per_student DECIMAL(10,3) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(menu_id, food_item_id)
);

-- Meal records table
CREATE TABLE meal_records (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id),
    menu_id BIGINT NOT NULL REFERENCES menus(id),
    date DATE NOT NULL,
    students_present INTEGER NOT NULL DEFAULT 0,
    meals_served INTEGER NOT NULL DEFAULT 0,
    teacher_in_charge VARCHAR(255),
    remarks TEXT,
    photo_url VARCHAR(500),
    meal_quality VARCHAR(20) CHECK (meal_quality IN ('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, menu_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_state ON schools(state);
CREATE INDEX idx_schools_active ON schools(active);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school_id ON users(school_id);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_name ON students(class_name);
CREATE INDEX idx_students_active ON students(active);

CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_food_items_active ON food_items(active);

CREATE INDEX idx_menus_date ON menus(date);
CREATE INDEX idx_menus_meal_type ON menus(meal_type);
CREATE INDEX idx_menus_month_year ON menus(month, year);
CREATE INDEX idx_menus_active ON menus(active);

CREATE INDEX idx_meal_records_school_id ON meal_records(school_id);
CREATE INDEX idx_meal_records_date ON meal_records(date);
CREATE INDEX idx_meal_records_menu_id ON meal_records(menu_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_food_items_updated_at BEFORE UPDATE ON menu_food_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_records_updated_at BEFORE UPDATE ON meal_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();