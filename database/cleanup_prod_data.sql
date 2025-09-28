-- Clean Production Data Script
-- Use this to remove all transactional data while keeping master data

BEGIN;

-- Remove transactional data
DELETE FROM meal_records;
DELETE FROM menu_food_items;
DELETE FROM menus;
DELETE FROM students;

-- Remove non-admin users (keep admin)
DELETE FROM users WHERE role != 'ADMIN';

-- Keep schools and food_items as they are master data
-- Admin can add schools and modify food items as needed

-- Reset sequences for cleaned tables
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_food_items_id_seq RESTART WITH 1;
ALTER SEQUENCE meal_records_id_seq RESTART WITH 1;

-- Update school student counts to 0
UPDATE schools SET total_students = 0;

SELECT 'Production data cleaned. Master data (schools, food_items) preserved.' as status;

COMMIT;