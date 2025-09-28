-- Enhanced Mid-Day Meal Management Schema
-- Adding grade-specific quantities and meal planning functionality

-- Add grade-specific columns to schools
ALTER TABLE schools ADD COLUMN IF NOT EXISTS grade_1_5_count INTEGER DEFAULT 0;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS grade_6_8_count INTEGER DEFAULT 0;

-- Enhanced food items with grade-specific quantities
CREATE TABLE IF NOT EXISTS food_quantities (
    id BIGSERIAL PRIMARY KEY,
    food_item_id BIGINT NOT NULL REFERENCES food_items(id),
    grade_level VARCHAR(20) NOT NULL CHECK (grade_level IN ('1-5', '6-8')),
    quantity_per_student DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(food_item_id, grade_level)
);

-- Daily meal templates for different days/meals
CREATE TABLE IF NOT EXISTS meal_templates (
    id BIGSERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    day_of_week VARCHAR(20) CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')),
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('BREAKFAST', 'LUNCH', 'SNACK')),
    description TEXT,
    description_marathi TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Template food items (what foods are in each template)
CREATE TABLE IF NOT EXISTS template_food_items (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL REFERENCES meal_templates(id),
    food_item_id BIGINT NOT NULL REFERENCES food_items(id),
    grade_1_5_quantity DECIMAL(10,3) NOT NULL,
    grade_6_8_quantity DECIMAL(10,3) NOT NULL,
    is_essential BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_id, food_item_id)
);

-- Enhanced meal records with grade-specific data
ALTER TABLE meal_records ADD COLUMN IF NOT EXISTS grade_1_5_present INTEGER DEFAULT 0;
ALTER TABLE meal_records ADD COLUMN IF NOT EXISTS grade_6_8_present INTEGER DEFAULT 0;
ALTER TABLE meal_records ADD COLUMN IF NOT EXISTS total_cost DECIMAL(12,2) DEFAULT 0.00;
ALTER TABLE meal_records ADD COLUMN IF NOT EXISTS cooking_cost DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE meal_records ADD COLUMN IF NOT EXISTS template_id BIGINT REFERENCES meal_templates(id);

-- Daily consumption tracking
CREATE TABLE IF NOT EXISTS daily_consumption (
    id BIGSERIAL PRIMARY KEY,
    meal_record_id BIGINT NOT NULL REFERENCES meal_records(id),
    food_item_id BIGINT NOT NULL REFERENCES food_items(id),
    planned_quantity DECIMAL(10,3) NOT NULL,
    actual_quantity DECIMAL(10,3) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0.00,
    supplier VARCHAR(255),
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meal_record_id, food_item_id)
);

-- Monthly summary reports
CREATE TABLE IF NOT EXISTS monthly_summaries (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_meal_days INTEGER DEFAULT 0,
    total_meals_served INTEGER DEFAULT 0,
    average_attendance DECIMAL(5,2) DEFAULT 0.00,
    total_food_cost DECIMAL(12,2) DEFAULT 0.00,
    total_cooking_cost DECIMAL(12,2) DEFAULT 0.00,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, year, month)
);

-- Insert Maharashtra Mid-Day Meal Program standard food items
INSERT INTO food_items (name, name_marathi, category, unit, cost_per_unit, active) VALUES
-- Grains
('Rice', 'तांदूळ', 'GRAINS', 'KG', 45.00, true),
('Wheat Flour', 'गहू पीठ', 'GRAINS', 'KG', 42.00, true),
('Jowar', 'ज्वारी', 'GRAINS', 'KG', 38.00, true),
('Bajra', 'बाजरी', 'GRAINS', 'KG', 40.00, true),

-- Proteins  
('Arhar Dal', 'तूर डाळ', 'PROTEINS', 'KG', 120.00, true),
('Moong Dal', 'मूग डाळ', 'PROTEINS', 'KG', 110.00, true),
('Masoor Dal', 'मसूर डाळ', 'PROTEINS', 'KG', 95.00, true),
('Soybean', 'सोयाबीन', 'PROTEINS', 'KG', 80.00, true),
('Eggs', 'अंडी', 'PROTEINS', 'PIECE', 6.00, true),

-- Vegetables
('Onion', 'कांदा', 'VEGETABLES', 'KG', 25.00, true),
('Potato', 'बटाटा', 'VEGETABLES', 'KG', 20.00, true),
('Tomato', 'टमाटर', 'VEGETABLES', 'KG', 35.00, true),
('Green Leafy Vegetables', 'पालेभाज्या', 'VEGETABLES', 'KG', 30.00, true),
('Drumstick', 'शेवगा', 'VEGETABLES', 'KG', 40.00, true),
('Brinjal', 'वांगे', 'VEGETABLES', 'KG', 28.00, true),

-- Oil and Spices
('Cooking Oil', 'स्वयंपाकाचे तेल', 'OIL', 'LITRE', 120.00, true),
('Salt', 'मीठ', 'SPICES', 'KG', 25.00, true),
('Turmeric Powder', 'हळद पावडर', 'SPICES', 'KG', 200.00, true),
('Red Chili Powder', 'लाल मिरची पावडर', 'SPICES', 'KG', 180.00, true),
('Cumin Seeds', 'जिरे', 'SPICES', 'KG', 300.00, true),
('Mustard Seeds', 'मोहरी', 'SPICES', 'KG', 120.00, true),

-- Others
('Jaggery', 'गूळ', 'OTHERS', 'KG', 60.00, true),
('Tamarind', 'चिंच', 'OTHERS', 'KG', 80.00, true)
ON CONFLICT (name) DO NOTHING;

-- Insert grade-specific quantities based on Maharashtra norms
INSERT INTO food_quantities (food_item_id, grade_level, quantity_per_student) VALUES
-- Rice: 100g for 1-5, 150g for 6-8
((SELECT id FROM food_items WHERE name = 'Rice'), '1-5', 0.100),
((SELECT id FROM food_items WHERE name = 'Rice'), '6-8', 0.150),

-- Dal: 25g for 1-5, 35g for 6-8  
((SELECT id FROM food_items WHERE name = 'Arhar Dal'), '1-5', 0.025),
((SELECT id FROM food_items WHERE name = 'Arhar Dal'), '6-8', 0.035),

-- Vegetables: 75g for 1-5, 100g for 6-8
((SELECT id FROM food_items WHERE name = 'Green Leafy Vegetables'), '1-5', 0.075),
((SELECT id FROM food_items WHERE name = 'Green Leafy Vegetables'), '6-8', 0.100),

-- Oil: 5ml for 1-5, 7ml for 6-8
((SELECT id FROM food_items WHERE name = 'Cooking Oil'), '1-5', 0.005),
((SELECT id FROM food_items WHERE name = 'Cooking Oil'), '6-8', 0.007),

-- Salt: 3g for 1-5, 4g for 6-8
((SELECT id FROM food_items WHERE name = 'Salt'), '1-5', 0.003),
((SELECT id FROM food_items WHERE name = 'Salt'), '6-8', 0.004)
ON CONFLICT (food_item_id, grade_level) DO NOTHING;

-- Sample meal templates
INSERT INTO meal_templates (template_name, day_of_week, meal_type, description, description_marathi) VALUES
('Monday Rice Meal', 'MONDAY', 'LUNCH', 'Rice with Dal and Vegetables', 'भात, डाळ आणि भाज्या'),
('Tuesday Chapati Meal', 'TUESDAY', 'LUNCH', 'Chapati with Dal and Vegetables', 'चपाती, डाळ आणि भाज्या'),
('Wednesday Rice Meal', 'WEDNESDAY', 'LUNCH', 'Rice with Dal and Vegetables', 'भात, डाळ आणि भाज्या'),
('Thursday Chapati Meal', 'THURSDAY', 'LUNCH', 'Chapati with Dal and Vegetables', 'चपाती, डाळ आणि भाज्या'),
('Friday Special Meal', 'FRIDAY', 'LUNCH', 'Rice with Dal, Vegetables and Egg', 'भात, डाळ, भाज्या आणि अंडे')
ON CONFLICT DO NOTHING;

-- Sample schools with student data
INSERT INTO schools (name, code, address, city, state, pincode, phone, email, principal_name, total_students, grade_1_5_count, grade_6_8_count) VALUES
('श्री गांधी प्राथमिक शाळा', 'SCH001', 'पिंपरी', 'पुणे', 'महाराष्ट्र', '411018', '9876543210', 'gandhi@school.com', 'Mrs. शर्मा', 200, 120, 80),
('नेहरू माध्यमिक शाळा', 'SCH002', 'चिंचवड', 'पुणे', 'महाराष्ट्र', '411019', '9876543211', 'nehru@school.com', 'Mr. पाटेल', 300, 180, 120),
('शिवाजी विद्यालय', 'SCH003', 'आकुर्डी', 'पुणे', 'महाराष्ट्र', '411035', '9876543212', 'shivaji@school.com', 'Ms. देसाई', 150, 90, 60)
ON CONFLICT (code) DO NOTHING;

-- Sample users
INSERT INTO users (username, password, full_name, email, role, school_id) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@middaymeal.com', 'ADMIN', NULL),
('school1_admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mrs. शर्मा', 'sharma@gandhi.com', 'SCHOOL_ADMIN', 1),
('school2_admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. पाटेल', 'patel@nehru.com', 'SCHOOL_ADMIN', 2)
ON CONFLICT (username) DO NOTHING;

-- Create indexes for the new tables
CREATE INDEX IF NOT EXISTS idx_food_quantities_food_item ON food_quantities(food_item_id);
CREATE INDEX IF NOT EXISTS idx_food_quantities_grade ON food_quantities(grade_level);
CREATE INDEX IF NOT EXISTS idx_meal_templates_day ON meal_templates(day_of_week);
CREATE INDEX IF NOT EXISTS idx_meal_templates_type ON meal_templates(meal_type);
CREATE INDEX IF NOT EXISTS idx_daily_consumption_meal ON daily_consumption(meal_record_id);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_school ON monthly_summaries(school_id);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_date ON monthly_summaries(year, month);