-- Fixed Menu System - Based on Real Excel Data
-- Each menu has fixed quantities, teacher just selects menu + student count

-- Clear existing data and create proper fixed menus
DELETE FROM template_food_items;
DELETE FROM meal_templates;
DELETE FROM food_quantities;

-- Create fixed menu templates with proper recipes
INSERT INTO meal_templates (template_name, day_of_week, meal_type, description, description_marathi, active) VALUES
('व्हेजिटेबल पुलाव', NULL, 'LUNCH', 'Vegetable Pulav with Rice', 'व्हेजिटेबल पुलाव', true),
('मोड आलेल्या मटकी उसळभात', NULL, 'LUNCH', 'Sprouted Matki with Rice', 'मोड आलेल्या मटकी उसळभात', true),
('बाजरी भाकरी पालक डाळ', NULL, 'LUNCH', 'Bajra Bhakri with Palak Dal', 'बाजरी भाकरी पालक डाळ', true),
('हरभरा पुलाव', NULL, 'LUNCH', 'Green Gram Pulav', 'हरभरा पुलाव', true),
('मसुरी पुलाव', NULL, 'LUNCH', 'Masoor Dal Pulav', 'मसुरी पुलाव', true),
('सोयाबीन पुलाव', NULL, 'LUNCH', 'Soybean Pulav', 'सोयाबीन पुलाव', true),
('मटार पुलाव', NULL, 'LUNCH', 'Peas Pulav', 'मटार पुलाव', true),
('तांदळाची खीर', NULL, 'LUNCH', 'Rice Kheer', 'तांदळाची खीर', true),
('डाळ खिचडी', NULL, 'LUNCH', 'Dal Khichdi', 'डाळ खिचडी', true),
('भात डाळ भाजी', NULL, 'LUNCH', 'Rice Dal Vegetables', 'भात डाळ भाजी', true);

-- व्हेजिटेबल पुलाव Recipe (Fixed quantities per student)
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential, notes) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'व्हेजिटेबल पुलाव'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तांदूळ'), 0.100, 0.150, true, 'Main ingredient'),
((SELECT id FROM meal_templates WHERE template_name = 'व्हेजिटेबल पुलाव'), 
 (SELECT id FROM food_items WHERE name_marathi = 'हिरव्या भाज्या'), 0.075, 0.100, true, 'Mixed vegetables'),
((SELECT id FROM meal_templates WHERE template_name = 'व्हेजिटेबल पुलाव'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तेल'), 0.005, 0.007, true, 'Cooking oil'),
((SELECT id FROM meal_templates WHERE template_name = 'व्हेजिटेबल पुलाव'), 
 (SELECT id FROM food_items WHERE name_marathi = 'मीठ'), 0.003, 0.004, true, 'Salt'),
((SELECT id FROM meal_templates WHERE template_name = 'व्हेजिटेबल पुलाव'), 
 (SELECT id FROM food_items WHERE name_marathi = 'हळद'), 0.001, 0.001, true, 'Turmeric');

-- डाळ खिचडी Recipe
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential, notes) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'डाळ खिचडी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तांदूळ'), 0.080, 0.120, true, 'Rice for khichdi'),
((SELECT id FROM meal_templates WHERE template_name = 'डाळ खिचडी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तुरडाळ'), 0.030, 0.040, true, 'Tur dal'),
((SELECT id FROM meal_templates WHERE template_name = 'डाळ खिचडी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तेल'), 0.005, 0.007, true, 'Cooking oil'),
((SELECT id FROM meal_templates WHERE template_name = 'डाळ खिचडी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'मीठ'), 0.003, 0.004, true, 'Salt'),
((SELECT id FROM meal_templates WHERE template_name = 'डाळ खिचडी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'हळद'), 0.001, 0.001, true, 'Turmeric');

-- मटकी उसळभात Recipe  
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential, notes) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'मोड आलेल्या मटकी उसळभात'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तांदूळ'), 0.100, 0.150, true, 'Rice base'),
((SELECT id FROM meal_templates WHERE template_name = 'मोड आलेल्या मटकी उसळभात'), 
 (SELECT id FROM food_items WHERE name_marathi = 'मटकी'), 0.025, 0.035, true, 'Sprouted matki'),
((SELECT id FROM meal_templates WHERE template_name = 'मोड आलेल्या मटकी उसळभात'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तेल'), 0.005, 0.007, true, 'Oil'),
((SELECT id FROM meal_templates WHERE template_name = 'मोड आलेल्या मटकी उसळभात'), 
 (SELECT id FROM food_items WHERE name_marathi = 'मीठ'), 0.003, 0.004, true, 'Salt');

-- भात डाळ भाजी Recipe (Complete meal)
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential, notes) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'भात डाळ भाजी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तांदूळ'), 0.100, 0.150, true, 'Rice'),
((SELECT id FROM meal_templates WHERE template_name = 'भात डाळ भाजी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तुरडाळ'), 0.025, 0.035, true, 'Dal'),
((SELECT id FROM meal_templates WHERE template_name = 'भात डाळ भाजी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'हिरव्या भाज्या'), 0.075, 0.100, true, 'Vegetables'),
((SELECT id FROM meal_templates WHERE template_name = 'भात डाळ भाजी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तेल'), 0.008, 0.010, true, 'Cooking oil'),
((SELECT id FROM meal_templates WHERE template_name = 'भात डाळ भाजी'), 
 (SELECT id FROM food_items WHERE name_marathi = 'मीठ'), 0.003, 0.004, true, 'Salt');

-- तांदळाची खीर Recipe
INSERT INTO template_food_items (template_id, food_item_id, grade_1_5_quantity, grade_6_8_quantity, is_essential, notes) VALUES
((SELECT id FROM meal_templates WHERE template_name = 'तांदळाची खीर'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तांदूळ'), 0.060, 0.080, true, 'Rice for kheer'),
((SELECT id FROM meal_templates WHERE template_name = 'तांदळाची खीर'), 
 (SELECT id FROM food_items WHERE name_marathi = 'गूळ'), 0.015, 0.020, true, 'Jaggery for sweetness'),
((SELECT id FROM meal_templates WHERE template_name = 'तांदळाची खीर'), 
 (SELECT id FROM food_items WHERE name_marathi = 'तेल'), 0.003, 0.004, true, 'Ghee/Oil');

-- Create a function to calculate total quantities for a menu
CREATE OR REPLACE FUNCTION calculate_menu_quantities(
    p_template_id BIGINT,
    p_grade_1_5_count INT,
    p_grade_6_8_count INT
) RETURNS TABLE (
    food_item_name VARCHAR,
    food_item_marathi VARCHAR,
    total_quantity DECIMAL,
    unit VARCHAR,
    category VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fi.name,
        fi.name_marathi,
        (tfi.grade_1_5_quantity * p_grade_1_5_count + tfi.grade_6_8_quantity * p_grade_6_8_count)::DECIMAL as total_quantity,
        fi.unit,
        fi.category
    FROM template_food_items tfi
    JOIN food_items fi ON tfi.food_item_id = fi.id
    WHERE tfi.template_id = p_template_id
    ORDER BY fi.category, fi.name;
END;
$$ LANGUAGE plpgsql;

-- Create view for easy menu selection
CREATE OR REPLACE VIEW available_menus AS
SELECT 
    id,
    template_name,
    description_marathi,
    description,
    (SELECT COUNT(*) FROM template_food_items WHERE template_id = mt.id) as ingredient_count
FROM meal_templates mt
WHERE active = true
ORDER BY template_name;