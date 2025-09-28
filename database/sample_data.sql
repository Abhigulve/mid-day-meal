-- Sample data for Mid-Day Meal Management System

-- Insert sample schools
INSERT INTO schools (name, code, address, city, state, pincode, phone, email, principal_name, total_students) VALUES
('Government Primary School Pimpri', 'GPS001', 'Pimpri Colony, Near Bus Stand', 'Pimpri', 'Maharashtra', '411018', '020-27651234', 'gps.pimpri@education.gov.in', 'Mrs. Sunita Sharma', 350),
('Municipal School Avaghad', 'MS002', 'Avaghad Village, Main Road', 'Avaghad', 'Maharashtra', '411025', '020-27652345', 'ms.avaghad@pcmc.gov.in', 'Mr. Rajesh Patil', 280),
('Zilla Parishad School Dehu', 'ZPS003', 'Dehu Road, Near Temple', 'Dehu', 'Maharashtra', '412101', '020-27653456', 'zps.dehu@zp.gov.in', 'Mrs. Kavita Desai', 420),
('Government High School Chinchwad', 'GHS004', 'Chinchwad East, Sector 15', 'Chinchwad', 'Maharashtra', '411019', '020-27654567', 'ghs.chinchwad@education.gov.in', 'Mr. Anil Kumar', 650),
('Municipal Primary School Wakad', 'MPS005', 'Wakad, Phase 2', 'Wakad', 'Maharashtra', '411057', '020-27655678', 'mps.wakad@pcmc.gov.in', 'Mrs. Priya Joshi', 320);

-- Insert sample users (passwords should be hashed in real implementation)
INSERT INTO users (username, password, full_name, email, phone, role, school_id) VALUES
('admin', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'System Administrator', 'admin@middaymeal.gov.in', '9876543210', 'ADMIN', NULL),
('principal_gps001', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Mrs. Sunita Sharma', 'sunita.sharma@education.gov.in', '9876543211', 'SCHOOL_ADMIN', 1),
('teacher_gps001', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Mr. Ganesh Bhosale', 'ganesh.bhosale@education.gov.in', '9876543212', 'TEACHER', 1),
('principal_ms002', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Mr. Rajesh Patil', 'rajesh.patil@pcmc.gov.in', '9876543213', 'SCHOOL_ADMIN', 2),
('cook_ms002', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Mrs. Lata Jadhav', 'lata.jadhav@pcmc.gov.in', '9876543214', 'COOK', 2),
('supervisor', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Mr. Vijay Kulkarni', 'vijay.kulkarni@education.gov.in', '9876543215', 'SUPERVISOR', NULL);

-- Insert sample food items
INSERT INTO food_items (name, name_marathi, description, category, unit, cost_per_unit, nutritional_info) VALUES
('Rice', 'तांदूळ', 'White rice for daily meals', 'GRAINS', 'KG', 45.00, 'Carbohydrates: 80g per 100g'),
('Wheat Flour', 'गहूचं पीठ', 'Whole wheat flour for chapati', 'GRAINS', 'KG', 35.00, 'Protein: 12g, Fiber: 10g per 100g'),
('Tur Dal', 'तूर डाळ', 'Split pigeon peas', 'PROTEINS', 'KG', 120.00, 'Protein: 22g per 100g'),
('Moong Dal', 'मूग डाळ', 'Split green gram', 'PROTEINS', 'KG', 110.00, 'Protein: 24g per 100g'),
('Potatoes', 'बटाटे', 'Fresh potatoes', 'VEGETABLES', 'KG', 25.00, 'Vitamin C, Potassium'),
('Onions', 'कांदे', 'Fresh onions', 'VEGETABLES', 'KG', 30.00, 'Vitamin C, Antioxidants'),
('Tomatoes', 'टोमॅटो', 'Fresh tomatoes', 'VEGETABLES', 'KG', 40.00, 'Vitamin C, Lycopene'),
('Cooking Oil', 'स्वयंपाकाचं तेल', 'Refined cooking oil', 'OIL', 'LITRE', 180.00, 'Essential fatty acids'),
('Salt', 'मीठ', 'Iodized salt', 'SPICES', 'KG', 20.00, 'Iodine fortified'),
('Turmeric Powder', 'हळद पावडर', 'Pure turmeric powder', 'SPICES', 'KG', 250.00, 'Anti-inflammatory properties');

-- Insert sample students
INSERT INTO students (name, roll_number, class_name, section, date_of_birth, gender, category, guardian_name, guardian_phone, address, school_id) VALUES
('Arjun Patil', '001', '1st', 'A', '2017-05-15', 'MALE', 'OBC', 'Ramesh Patil', '9876543300', 'Pimpri Colony House No 15', 1),
('Priya Sharma', '002', '1st', 'A', '2017-03-22', 'FEMALE', 'GENERAL', 'Suresh Sharma', '9876543301', 'Pimpri Colony House No 28', 1),
('Rahul Jadhav', '003', '2nd', 'A', '2016-08-10', 'MALE', 'OBC', 'Mahesh Jadhav', '9876543302', 'Pimpri Colony House No 45', 1),
('Sneha Desai', '004', '2nd', 'B', '2016-11-05', 'FEMALE', 'SC', 'Prakash Desai', '9876543303', 'Pimpri Colony House No 67', 1),
('Amit Kumar', '005', '3rd', 'A', '2015-12-18', 'MALE', 'GENERAL', 'Vijay Kumar', '9876543304', 'Pimpri Colony House No 89', 1),
('Kavya Joshi', '001', '1st', 'A', '2017-07-30', 'FEMALE', 'GENERAL', 'Anil Joshi', '9876543305', 'Avaghad Village Road No 12', 2),
('Rohan Bhosale', '002', '1st', 'A', '2017-04-12', 'MALE', 'OBC', 'Santosh Bhosale', '9876543306', 'Avaghad Village Road No 25', 2),
('Anjali Pawar', '003', '2nd', 'A', '2016-09-25', 'FEMALE', 'ST', 'Ravi Pawar', '9876543307', 'Avaghad Village Road No 38', 2);

-- Insert sample menus for September 2025
INSERT INTO menus (date, meal_type, menu_description, menu_description_marathi, month, year) VALUES
('2025-09-01', 'LUNCH', 'Rice, Tur Dal, Mixed Vegetables, Chapati', 'तांदूळ, तूर डाळ, मिक्स भाजी, चपाती', 9, 2025),
('2025-09-02', 'LUNCH', 'Rice, Moong Dal, Potato Curry, Chapati', 'तांदूळ, मूग डाळ, बटाटा भाजी, चपाती', 9, 2025),
('2025-09-03', 'LUNCH', 'Rice, Tur Dal, Cabbage Sabzi, Chapati', 'तांदूळ, तूर डाळ, कोबी भाजी, चपाती', 9, 2025),
('2025-09-04', 'LUNCH', 'Rice, Moong Dal, Bhindi Fry, Chapati', 'तांदूळ, मूग डाळ, भेंडी फ्राय, चपाती', 9, 2025),
('2025-09-05', 'LUNCH', 'Rice, Tur Dal, Cauliflower Curry, Chapati', 'तांदूळ, तूर डाळ, फुलकोबी भाजी, चपाती', 9, 2025),
('2025-09-06', 'LUNCH', 'Rice, Mixed Dal, Drumstick Sambar, Chapati', 'तांदूळ, मिक्स डाळ, शेवगा सांबार, चपाती', 9, 2025),
('2025-09-07', 'LUNCH', 'Rice, Tur Dal, Pumpkin Curry, Chapati', 'तांदूळ, तूर डाळ, भोपळा भाजी, चपाती', 9, 2025),
('2025-09-08', 'LUNCH', 'Rice, Moong Dal, Spinach Dal, Chapati', 'तांदूळ, मूग डाळ, पालक डाळ, चपाती', 9, 2025);

-- Insert menu food items for detailed recipes
INSERT INTO menu_food_items (menu_id, food_item_id, quantity_per_student, notes) VALUES
-- Menu 1 (Sept 1): Rice, Tur Dal, Mixed Vegetables, Chapati
(1, 1, 150.000, 'Cooked rice portion per student'),
(1, 3, 30.000, 'Tur dal cooked with spices'),
(1, 5, 50.000, 'Mixed with onions and tomatoes'),
(1, 6, 20.000, 'For seasoning vegetables'),
(1, 7, 30.000, 'For vegetables base'),
(1, 2, 60.000, 'For making 2 chapatis per student'),

-- Menu 2 (Sept 2): Rice, Moong Dal, Potato Curry, Chapati
(2, 1, 150.000, 'Cooked rice portion per student'),
(2, 4, 30.000, 'Moong dal with turmeric'),
(2, 5, 80.000, 'Potato curry with spices'),
(2, 2, 60.000, 'For making 2 chapatis per student'),

-- Menu 3 (Sept 3): Rice, Tur Dal, Cabbage Sabzi, Chapati
(3, 1, 150.000, 'Cooked rice portion per student'),
(3, 3, 30.000, 'Tur dal preparation'),
(3, 2, 60.000, 'For making 2 chapatis per student');

-- Insert sample meal records
INSERT INTO meal_records (school_id, menu_id, date, students_present, meals_served, teacher_in_charge, remarks, meal_quality) VALUES
(1, 1, '2025-09-01', 340, 340, 'Mr. Ganesh Bhosale', 'All students enjoyed the meal. Good quality preparation.', 'EXCELLENT'),
(1, 2, '2025-09-02', 335, 335, 'Mr. Ganesh Bhosale', 'Potato curry was well cooked. Students liked it.', 'GOOD'),
(1, 3, '2025-09-03', 345, 345, 'Mrs. Sunita Sharma', 'Cabbage was fresh. Proper seasoning done.', 'EXCELLENT'),
(2, 1, '2025-09-01', 275, 275, 'Mr. Rajesh Patil', 'Quality meal served. Students satisfied.', 'GOOD'),
(2, 2, '2025-09-02', 270, 270, 'Mrs. Lata Jadhav', 'Good preparation. Adequate quantity served.', 'GOOD'),
(2, 3, '2025-09-03', 280, 280, 'Mr. Rajesh Patil', 'Fresh vegetables used. Students appreciated.', 'EXCELLENT');

-- Create some views for reporting
CREATE VIEW monthly_meal_summary AS
SELECT 
    s.name as school_name,
    s.code as school_code,
    DATE_TRUNC('month', mr.date) as month,
    COUNT(*) as total_meal_days,
    SUM(mr.students_present) as total_students_present,
    SUM(mr.meals_served) as total_meals_served,
    AVG(mr.students_present) as avg_daily_attendance
FROM meal_records mr
JOIN schools s ON mr.school_id = s.id
GROUP BY s.id, s.name, s.code, DATE_TRUNC('month', mr.date)
ORDER BY month DESC, school_name;

CREATE VIEW daily_attendance_report AS
SELECT 
    mr.date,
    s.name as school_name,
    s.code as school_code,
    s.total_students as enrolled_students,
    mr.students_present,
    mr.meals_served,
    ROUND((mr.students_present::DECIMAL / s.total_students) * 100, 2) as attendance_percentage,
    mr.meal_quality,
    mr.teacher_in_charge
FROM meal_records mr
JOIN schools s ON mr.school_id = s.id
ORDER BY mr.date DESC, s.name;

CREATE VIEW food_consumption_summary AS
SELECT 
    fi.name as food_item_name,
    fi.name_marathi as food_item_name_marathi,
    fi.category,
    fi.unit,
    SUM(mfi.quantity_per_student * mr.meals_served) as total_quantity_consumed,
    COUNT(DISTINCT mr.date) as days_served,
    AVG(mfi.quantity_per_student) as avg_quantity_per_student
FROM menu_food_items mfi
JOIN food_items fi ON mfi.food_item_id = fi.id
JOIN menus m ON mfi.menu_id = m.id
JOIN meal_records mr ON m.id = mr.menu_id
GROUP BY fi.id, fi.name, fi.name_marathi, fi.category, fi.unit
ORDER BY total_quantity_consumed DESC;