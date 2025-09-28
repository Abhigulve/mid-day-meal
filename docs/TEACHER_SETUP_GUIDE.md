# 👨‍🏫 Teacher Setup Guide - गाडे वस्ती School

## Current Status
- **School**: गाडे वस्ती (Gade Wasti)
- **School Code**: 001
- **Principal**: Sheetal Gulve
- **Teachers**: 0 (Need to create)

## Step-by-Step Teacher Creation

### Step 1: Login as Admin
1. Go to: http://localhost:3000/login
2. Username: `admin`
3. Password: `admin123`

### Step 2: Navigate to Teacher Management
1. After login, click on **"Teacher & Staff Management"** in the menu
2. Or go directly to: http://localhost:3000/teachers

### Step 3: Add Principal/School Admin
Click **"Add New Teacher/Staff"** and fill:

```
Username: principal_gade001
Password: principal123
Full Name: Sheetal Gulve
Email: abhigulve06@gmail.com
Phone: 9834206001
Role: SCHOOL_ADMIN (Principal)
School: गाडे वस्ती • 001
```

### Step 4: Add Teachers
For each teacher, click **"Add New Teacher/Staff"**:

**Teacher 1:**
```
Username: teacher_gade001
Password: teacher123
Full Name: [Teacher's Full Name]
Email: [teacher's email]
Phone: [teacher's phone]
Role: TEACHER
School: गाडे वस्ती • 001
```

**Teacher 2:**
```
Username: teacher_gade002
Password: teacher123
Full Name: [Teacher's Full Name]
Email: [teacher's email]
Phone: [teacher's phone]
Role: TEACHER
School: गाडे वस्ती • 001
```

### Step 5: Add Cook (if needed)
```
Username: cook_gade001
Password: cook123
Full Name: [Cook's Full Name]
Email: [cook's email]
Phone: [cook's phone]
Role: COOK
School: गाडे वस्ती • 001
```

## Login Credentials After Creation

### Principal Login:
- **Username**: `principal_gade001`
- **Password**: `principal123`
- **Role**: School Admin
- **Access**: Can manage school data, create meal records, view reports

### Teacher Login:
- **Username**: `teacher_gade001`
- **Password**: `teacher123`
- **Role**: Teacher
- **Access**: Can record daily meals, view school data

### Cook Login:
- **Username**: `cook_gade001`
- **Password**: `cook123`
- **Role**: Cook
- **Access**: Can record meal preparation details

## Quick Create Script (Advanced Users)

If you have database access, you can run this SQL to create users quickly:

```sql
-- Add Principal
INSERT INTO users (username, password, full_name, email, phone, role, school_id, active) VALUES
('principal_gade001', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Sheetal Gulve', 'abhigulve06@gmail.com', '9834206001', 'SCHOOL_ADMIN', 1, TRUE);

-- Add Teacher 1
INSERT INTO users (username, password, full_name, email, phone, role, school_id, active) VALUES
('teacher_gade001', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Teacher Name 1', 'teacher1@school.com', '9876543210', 'TEACHER', 1, TRUE);

-- Add Teacher 2
INSERT INTO users (username, password, full_name, email, phone, role, school_id, active) VALUES
('teacher_gade002', '$2a$10$8Q7V8K8K8K8K8K8K8K8K8O', 'Teacher Name 2', 'teacher2@school.com', '9876543211', 'TEACHER', 1, TRUE);
```

Note: Replace school_id with the actual ID of गाडे वस्ती school.

## Password Security Notes

1. **Change Default Passwords**: All default passwords (admin123, teacher123, etc.) should be changed immediately in production
2. **Strong Passwords**: Use minimum 8 characters with mix of letters, numbers, and symbols
3. **User Training**: Train teachers on how to login and use the system

## Troubleshooting

### "School not found" error
- Make sure the school "गाडे वस्ती" exists in the Schools section first
- Check the school ID matches when creating users

### Login fails
- Verify username is correct (case-sensitive)
- Verify password is correct
- Check if user account is active

### Can't access teacher features
- Verify user role is set correctly (TEACHER, SCHOOL_ADMIN, etc.)
- Check if user is assigned to the correct school