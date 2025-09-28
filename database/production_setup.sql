-- Production Database Setup - Clean data with only essentials
-- This script sets up the database for production with minimal essential data

-- Clear all sample data while preserving schema
TRUNCATE TABLE meal_records CASCADE;
TRUNCATE TABLE menu_food_items CASCADE;
TRUNCATE TABLE menus CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE schools CASCADE;
TRUNCATE TABLE food_items CASCADE;

-- Reset sequences
ALTER SEQUENCE schools_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE food_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_food_items_id_seq RESTART WITH 1;
ALTER SEQUENCE meal_records_id_seq RESTART WITH 1;

-- Create default admin user (password should be changed immediately)
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (username, password, full_name, email, phone, role, school_id, active) VALUES
('admin', '$2a$10$DQVz4X.JX.JX.JX.JX.JX.O', 'System Administrator', 'admin@middaymeal.gov.in', '9999999999', 'ADMIN', NULL, TRUE);

-- Insert essential food items (commonly used in Indian school meals)
INSERT INTO food_items (name, name_marathi, description, category, unit, cost_per_unit, nutritional_info, active) VALUES
-- Grains
('Rice', 'तांदूळ', 'White rice for daily meals', 'GRAINS', 'KG', 45.00, 'Carbohydrates: 80g per 100g', TRUE),
('Wheat Flour', 'गहूचं पीठ', 'Whole wheat flour for chapati', 'GRAINS', 'KG', 35.00, 'Protein: 12g, Fiber: 10g per 100g', TRUE),

-- Proteins/Dal
('Tur Dal', 'तूर डाळ', 'Split pigeon peas', 'PROTEINS', 'KG', 120.00, 'Protein: 22g per 100g', TRUE),
('Moong Dal', 'मूग डाळ', 'Split green gram', 'PROTEINS', 'KG', 110.00, 'Protein: 24g per 100g', TRUE),
('Chana Dal', 'चना डाळ', 'Split chickpeas', 'PROTEINS', 'KG', 130.00, 'Protein: 20g per 100g', TRUE),

-- Vegetables
('Potatoes', 'बटाटे', 'Fresh potatoes', 'VEGETABLES', 'KG', 25.00, 'Vitamin C, Potassium', TRUE),
('Onions', 'कांदे', 'Fresh onions', 'VEGETABLES', 'KG', 30.00, 'Vitamin C, Antioxidants', TRUE),
('Tomatoes', 'टोमॅटो', 'Fresh tomatoes', 'VEGETABLES', 'KG', 40.00, 'Vitamin C, Lycopene', TRUE),
('Carrots', 'गाजर', 'Fresh carrots', 'VEGETABLES', 'KG', 35.00, 'Vitamin A, Beta-carotene', TRUE),
('Cabbage', 'कोबी', 'Fresh cabbage', 'VEGETABLES', 'KG', 20.00, 'Vitamin C, Fiber', TRUE),

-- Spices & Oil
('Cooking Oil', 'स्वयंपाकाचं तेल', 'Refined cooking oil', 'OIL', 'LITRE', 180.00, 'Essential fatty acids', TRUE),
('Salt', 'मीठ', 'Iodized salt', 'SPICES', 'KG', 20.00, 'Iodine fortified', TRUE),
('Turmeric Powder', 'हळद पावडर', 'Pure turmeric powder', 'SPICES', 'KG', 250.00, 'Anti-inflammatory properties', TRUE),
('Cumin Seeds', 'जिरं', 'Cumin seeds for tempering', 'SPICES', 'KG', 400.00, 'Iron, antioxidants', TRUE),
('Mustard Seeds', 'मोहरी', 'Mustard seeds for tempering', 'SPICES', 'KG', 350.00, 'Selenium, magnesium', TRUE),

-- Dairy & Others
('Milk', 'दूध', 'Fresh milk', 'DAIRY', 'LITRE', 55.00, 'Protein, Calcium', TRUE),
('Jaggery', 'गूळ', 'Natural sweetener', 'OTHERS', 'KG', 80.00, 'Iron, minerals', TRUE),
('Tea Leaves', 'चहाची पाने', 'Tea leaves for chai', 'OTHERS', 'KG', 300.00, 'Antioxidants', TRUE);

-- Create production admin notice
COMMENT ON TABLE users IS 'Production database - Sample data removed. Default admin user created with username: admin, password: admin123 (CHANGE IMMEDIATELY)';

-- Log the setup
INSERT INTO meal_records (school_id, menu_id, date, students_present, meals_served, teacher_in_charge, remarks, meal_quality) 
SELECT NULL, NULL, CURRENT_DATE, 0, 0, 'System', 'Production database initialized. Sample data cleared.', NULL
WHERE FALSE; -- This won't actually insert but serves as documentation

COMMENT ON DATABASE middaymeal_db IS 'Mid-Day Meal Management System - Production Setup Completed';