-- Restore Sample Data Script
-- Use this script to restore sample data for testing/demo purposes

-- Warning: This will clear existing data and restore sample data
-- DO NOT RUN IN PRODUCTION

BEGIN;

-- Clear existing data
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

-- Restore sample data from sample_data.sql
\i sample_data.sql

-- Add notification
SELECT 'Sample data restored successfully' as status;

COMMIT;