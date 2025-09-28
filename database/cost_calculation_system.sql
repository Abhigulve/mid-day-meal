-- Cost Calculation System Based on Government Rates
-- Official Maharashtra Mid-Day Meal Program rates from Excel

-- Add cost calculation function
CREATE OR REPLACE FUNCTION calculate_meal_cost(
    p_grade_1_5_count INT,
    p_grade_6_8_count INT
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    grade_1_5_rate DECIMAL(5,2) := 2.59;  -- ₹2.59 per student per day (from Excel)
    grade_6_8_rate DECIMAL(5,2) := 3.88;  -- ₹3.88 per student per day (from Excel)
    total_cost DECIMAL(10,2);
BEGIN
    total_cost := (p_grade_1_5_count * grade_1_5_rate) + (p_grade_6_8_count * grade_6_8_rate);
    RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Update the menu calculation function to include cost
CREATE OR REPLACE FUNCTION calculate_menu_with_cost(
    p_template_id BIGINT,
    p_grade_1_5_count INT,
    p_grade_6_8_count INT
) RETURNS TABLE (
    food_item_name VARCHAR,
    food_item_marathi VARCHAR,
    total_quantity DECIMAL,
    unit VARCHAR,
    category VARCHAR,
    estimated_food_cost DECIMAL,
    total_meal_cost DECIMAL
) AS $$
DECLARE
    govt_cost DECIMAL(10,2);
BEGIN
    -- Calculate government allocation cost
    govt_cost := calculate_meal_cost(p_grade_1_5_count, p_grade_6_8_count);
    
    RETURN QUERY
    SELECT 
        fi.name,
        fi.name_marathi,
        (tfi.grade_1_5_quantity * p_grade_1_5_count + tfi.grade_6_8_quantity * p_grade_6_8_count)::DECIMAL as total_quantity,
        fi.unit,
        fi.category,
        -- Estimate food cost based on market rates
        ((tfi.grade_1_5_quantity * p_grade_1_5_count + tfi.grade_6_8_quantity * p_grade_6_8_count) * fi.cost_per_unit)::DECIMAL as estimated_food_cost,
        govt_cost as total_meal_cost
    FROM template_food_items tfi
    JOIN food_items fi ON tfi.food_item_id = fi.id
    WHERE tfi.template_id = p_template_id
    ORDER BY fi.category, fi.name;
END;
$$ LANGUAGE plpgsql;

-- Update food items with realistic market costs (per gram/ml)
UPDATE food_items SET cost_per_unit = 0.045 WHERE name_marathi = 'तांदूळ';      -- ₹45/kg = ₹0.045/gram
UPDATE food_items SET cost_per_unit = 0.120 WHERE name_marathi = 'तुरडाळ';     -- ₹120/kg = ₹0.120/gram  
UPDATE food_items SET cost_per_unit = 0.110 WHERE name_marathi = 'मुगडाळ';     -- ₹110/kg = ₹0.110/gram
UPDATE food_items SET cost_per_unit = 0.085 WHERE name_marathi = 'मटकी';       -- ₹85/kg = ₹0.085/gram
UPDATE food_items SET cost_per_unit = 0.030 WHERE name_marathi = 'हिरव्या भाज्या'; -- ₹30/kg = ₹0.030/gram
UPDATE food_items SET cost_per_unit = 0.040 WHERE name_marathi = 'बाजरी';      -- ₹40/kg = ₹0.040/gram
UPDATE food_items SET cost_per_unit = 0.042 WHERE name_marathi = 'गहू';        -- ₹42/kg = ₹0.042/gram
UPDATE food_items SET cost_per_unit = 0.120 WHERE name_marathi = 'तेल';        -- ₹120/litre = ₹0.120/ml
UPDATE food_items SET cost_per_unit = 0.025 WHERE name_marathi = 'मीठ';        -- ₹25/kg = ₹0.025/gram
UPDATE food_items SET cost_per_unit = 0.060 WHERE name_marathi = 'गूळ';        -- ₹60/kg = ₹0.060/gram

-- Create a view for easy cost calculation
CREATE OR REPLACE VIEW meal_cost_summary AS
SELECT 
    mt.template_name,
    mt.description_marathi,
    -- For 121 grade 1-5 students (from Excel)
    calculate_meal_cost(121, 0) as cost_grade_1_5_only,
    -- For 34 grade 6-8 students (from Excel)  
    calculate_meal_cost(0, 34) as cost_grade_6_8_only,
    -- For full school (121 + 34 = 155 students)
    calculate_meal_cost(121, 34) as cost_full_school,
    -- Average cost per student
    ROUND(calculate_meal_cost(121, 34) / 155, 2) as avg_cost_per_student
FROM meal_templates mt
WHERE mt.active = true
ORDER BY mt.template_name;

-- Test the cost calculation
SELECT 
    'Grade 1-5 (121 students)' as category,
    calculate_meal_cost(121, 0) as daily_cost,
    '₹2.59 per student' as rate
UNION ALL
SELECT 
    'Grade 6-8 (34 students)' as category,
    calculate_meal_cost(0, 34) as daily_cost,
    '₹3.88 per student' as rate
UNION ALL
SELECT 
    'Full School (155 students)' as category,
    calculate_meal_cost(121, 34) as daily_cost,
    'Combined rate' as rate;