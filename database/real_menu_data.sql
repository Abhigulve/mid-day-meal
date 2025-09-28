-- Real Menu Data from Pimpri Avaghad School Excel Sheet
-- September 2025 Mid-Day Meal Program Data

-- Update the school information with real data
UPDATE schools SET 
    name = 'जिल्हा परिषद प्राथमिक शाळा पिंप्री अवघड',
    code = 'PIMPRI_AVAGHAD_001',
    address = 'पिंप्री अवघड, केंद्र- सडे',
    city = 'राहुरी',
    state = 'अहमदनगर',
    total_students = 155,
    grade_1_5_count = 121,
    grade_6_8_count = 34
WHERE id = 1;

-- Insert real menu templates based on the Excel data
INSERT INTO meal_templates (template_name, day_of_week, meal_type, description, description_marathi, active) VALUES
('Monday Meal', 'MONDAY', 'LUNCH', 'Vegetable Pulav with Kheer', 'व्हेजिटेबल पुलाव आणि तांदळाची खीर', true),
('Tuesday Meal', 'TUESDAY', 'LUNCH', 'Moong Dal with Sprouted Matki', 'मोड आलेल्या मटकी उसळभात', true),
('Wednesday Meal', 'WEDNESDAY', 'LUNCH', 'Bajra Bhakri with Palak Dal', 'बाजरी भाकरी आणि पालक डाळ', true),
('Thursday Meal', 'THURSDAY', 'LUNCH', 'Rice with Vegetables', 'भात आणि भाज्या', true),
('Friday Meal', 'FRIDAY', 'LUNCH', 'Special Rice with Dal', 'विशेष भात आणि डाळ', true),
('Saturday Meal', 'SATURDAY', 'LUNCH', 'Wheat Bhakri with Dal', 'गहू भाकरी आणि डाळ', true);

-- Insert real food items with actual quantities from the school system
INSERT INTO food_items (name, name_marathi, category, unit, cost_per_unit, active) VALUES
('Rice (तांदूळ)', 'तांदूळ', 'GRAINS', 'GRAM', 0.45, true),
('Soybean (सोयाबीन)', 'सोयाबीन', 'PROTEINS', 'GRAM', 0.80, true),
('Moong Dal (मुगडाळ)', 'मुगडाळ', 'PROTEINS', 'GRAM', 1.10, true),
('Tur Dal (तुरडाळ)', 'तुरडाळ', 'PROTEINS', 'GRAM', 1.20, true),
('Masoor Dal (मसूरडाळ)', 'मसूरडाळ', 'PROTEINS', 'GRAM', 0.95, true),
('Matki (मटकी)', 'मटकी', 'PROTEINS', 'GRAM', 0.85, true),
('Green Moong (मुग)', 'मुग', 'PROTEINS', 'GRAM', 1.00, true),
('Bajra (बाजरी)', 'बाजरी', 'GRAINS', 'GRAM', 0.40, true),
('Wheat (गहू)', 'गहू', 'GRAINS', 'GRAM', 0.42, true),
('Nachni (नाचणी)', 'नाचणी', 'GRAINS', 'GRAM', 0.50, true),
('Green Vegetables (हिरव्या भाज्या)', 'हिरव्या भाज्या', 'VEGETABLES', 'GRAM', 0.30, true),
('Cooking Oil (तेल)', 'तेल', 'OIL', 'ML', 0.12, true),
('Salt (मीठ)', 'मीठ', 'SPICES', 'GRAM', 0.025, true),
('Turmeric (हळद)', 'हळद', 'SPICES', 'GRAM', 2.00, true),
('Jaggery (गूळ)', 'गूळ', 'OTHERS', 'GRAM', 0.60, true)
ON CONFLICT (name) DO NOTHING;

-- Insert grade-specific quantities based on the real school data
-- These are actual quantities from the Maharashtra Mid-Day Meal scheme
INSERT INTO food_quantities (food_item_id, grade_level, quantity_per_student) VALUES
-- Rice: Different quantities for different meals
((SELECT id FROM food_items WHERE name = 'Rice (तांदूळ)'), '1-5', 0.100),  -- 100g for grades 1-5
((SELECT id FROM food_items WHERE name = 'Rice (तांदूळ)'), '6-8', 0.150),  -- 150g for grades 6-8

-- Dal quantities
((SELECT id FROM food_items WHERE name = 'Tur Dal (तुरडाळ)'), '1-5', 0.025), -- 25g
((SELECT id FROM food_items WHERE name = 'Tur Dal (तुरडाळ)'), '6-8', 0.035), -- 35g

((SELECT id FROM food_items WHERE name = 'Moong Dal (मुगडाळ)'), '1-5', 0.025),
((SELECT id FROM food_items WHERE name = 'Moong Dal (मुगडाळ)'), '6-8', 0.035),

-- Vegetables
((SELECT id FROM food_items WHERE name = 'Green Vegetables (हिरव्या भाज्या)'), '1-5', 0.075), -- 75g
((SELECT id FROM food_items WHERE name = 'Green Vegetables (हिरव्या भाज्या)'), '6-8', 0.100), -- 100g

-- Oil
((SELECT id FROM food_items WHERE name = 'Cooking Oil (तेल)'), '1-5', 0.005), -- 5ml
((SELECT id FROM food_items WHERE name = 'Cooking Oil (तेल)'), '6-8', 0.007), -- 7ml

-- Grains for different meals
((SELECT id FROM food_items WHERE name = 'Bajra (बाजरी)'), '1-5', 0.080),
((SELECT id FROM food_items WHERE name = 'Bajra (बाजरी)'), '6-8', 0.120),

((SELECT id FROM food_items WHERE name = 'Wheat (गहू)'), '1-5', 0.080),
((SELECT id FROM food_items WHERE name = 'Wheat (गहू)'), '6-8', 0.120)
ON CONFLICT (food_item_id, grade_level) DO NOTHING;

-- Insert template food items for Monday's Vegetable Pulav
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'Monday Meal'), 
 (SELECT id FROM food_items WHERE name = 'Rice (तांदूळ)'), 0.100, 0.150, true),
((SELECT id FROM meal_templates WHERE template_name = 'Monday Meal'), 
 (SELECT id FROM food_items WHERE name = 'Green Vegetables (हिरव्या भाज्या)'), 0.075, 0.100, true),
((SELECT id FROM meal_templates WHERE template_name = 'Monday Meal'), 
 (SELECT id FROM food_items WHERE name = 'Cooking Oil (तेल)'), 0.005, 0.007, true);

-- Insert template food items for Tuesday's Matki Sprouted meal
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'Tuesday Meal'), 
 (SELECT id FROM food_items WHERE name = 'Rice (तांदूळ)'), 0.100, 0.150, true),
((SELECT id FROM meal_templates WHERE template_name = 'Tuesday Meal'), 
 (SELECT id FROM food_items WHERE name = 'Matki (मटकी)'), 0.025, 0.035, true),
((SELECT id FROM meal_templates WHERE template_name = 'Tuesday Meal'), 
 (SELECT id FROM food_items WHERE name = 'Green Moong (मुग)'), 0.020, 0.030, true);

-- Sample meal records for the current month
INSERT INTO meal_records (school_id, date, grade_1_5_present, grade_6_8_present, meals_served, teacher_in_charge, meal_quality) VALUES
(1, '2025-09-02', 121, 30, 151, 'Mrs. पाटेल', 'GOOD'),
(1, '2025-09-03', 115, 28, 143, 'Mrs. शर्मा', 'EXCELLENT'),
(1, '2025-09-04', 118, 32, 150, 'Mr. देसाई', 'GOOD')
ON CONFLICT (school_id, date) DO NOTHING;

-- Create a view for easy meal planning
CREATE OR REPLACE VIEW daily_meal_planning AS
SELECT 
    s.name as school_name,
    s.grade_1_5_count,
    s.grade_6_8_count,
    mt.template_name,
    mt.day_of_week,
    mt.description_marathi,
    fi.name as food_item,
    fi.name_marathi,
    tfi.grade_1_5_quantity,
    tfi.grade_6_8_quantity,
    (tfi.grade_1_5_quantity * s.grade_1_5_count) as total_qty_1_5,
    (tfi.grade_6_8_quantity * s.grade_6_8_count) as total_qty_6_8,
    ((tfi.grade_1_5_quantity * s.grade_1_5_count) + (tfi.grade_6_8_quantity * s.grade_6_8_count)) as total_quantity_needed
FROM schools s
CROSS JOIN meal_templates mt
JOIN template_food_items tfi ON mt.id = tfi.template_id
JOIN food_items fi ON tfi.food_item_id = fi.id
WHERE s.active = true AND mt.active = true
ORDER BY mt.day_of_week, fi.category;