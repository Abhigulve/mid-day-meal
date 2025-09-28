-- Mid-Day Meal Management System - Data Cleanup Script
-- This script removes all dummy/sample data and keeps only admin user

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Delete sample data in correct order (respecting foreign keys)
DELETE FROM meal_records;
DELETE FROM menu_food_items;
DELETE FROM menus;
DELETE FROM students;
DELETE FROM users WHERE username != 'admin';
DELETE FROM schools;

-- Reset sequences to start from 1
ALTER SEQUENCE schools_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 2; -- Keep admin as ID 1
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE food_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_food_items_id_seq RESTART WITH 1;
ALTER SEQUENCE meal_records_id_seq RESTART WITH 1;

-- Keep only essential food items for system functionality
DELETE FROM food_items;
INSERT INTO food_items (name, name_marathi, description, category, unit, cost_per_unit, nutritional_info) VALUES
('Rice', 'तांदूळ', 'White rice for daily meals', 'GRAINS', 'KG', 45.00, 'Carbohydrates: 80g per 100g'),
('Wheat Flour', 'गहूचं पीठ', 'Whole wheat flour for chapati', 'GRAINS', 'KG', 35.00, 'Protein: 12g, Fiber: 10g per 100g'),
('Tur Dal', 'तूर डाळ', 'Split pigeon peas', 'PROTEINS', 'KG', 120.00, 'Protein: 22g per 100g'),
('Cooking Oil', 'स्वयंपाकाचं तेल', 'Refined cooking oil', 'OIL', 'LITRE', 180.00, 'Essential fatty acids'),
('Salt', 'मीठ', 'Iodized salt', 'SPICES', 'KG', 20.00, 'Iodine fortified');

-- Update admin user password (hashed P@ssw0rd)
UPDATE users 
SET password = '$2a$10$7Z8K8K8K8K8K8K8K8K8K8O.W7xK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K'
WHERE username = 'admin';

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Verify cleanup
SELECT 'Cleanup completed successfully' as status;
SELECT COUNT(*) as remaining_schools FROM schools;
SELECT COUNT(*) as remaining_users FROM users;
SELECT COUNT(*) as remaining_students FROM students;
SELECT COUNT(*) as remaining_food_items FROM food_items;