# Database Schema & Data Models

This schema is designed for **PostgreSQL** using **Prisma ORM**. It handles multi-branch tenancy (Trust -> School & Hotel Management College) with strict data segregation and flexible role-based access.

---

## 1. Entity Relationship Overview

```
+---------------+         1:N         +---------------+
|     Trust     | -------------------> |    Branch     | (School, Hotel Mgmt College)
+---------------+                     +---------------+
                                              |
                     +------------------------+------------------------+
                     | 1:N                                             | 1:N
                     v                                                 v
              +---------------+                                 +---------------+
              |     User      |                                 | AcademicYear  |
              | (Roles, Auth) |                                 +---------------+
              +---------------+                                         |
                     |                                                 |
                     v 1:N                                             v 1:N
              +---------------+         1:N                     +---------------+
              |  StaffProfile | ------------------------------> | Class/Batch   |
              +---------------+                                 +---------------+
                                                                       |
                     +-------------------------------------------------+
                     | 1:N
                     v
              +---------------+
              |    Student    |
              +---------------+
                     |
       +-------------+-------------+-------------+-------------+
       | 1:N         | 1:N         | 1:N         | 1:N         | 1:N
       v             v             v             v             v
+-------------+ +-----------+ +-----------+ +-----------+ +-------------------+
|  Document   | | FeeRecord | |Attendance | | ExamMarks | | HotelMgmtTraining |
+-------------+ +-----------+ +-----------+ +-----------+ +-------------------+
```

---

## 2. Core Tables Specification

### 1. Multi-Tenant Organization (`Trust` & `Branch`)
```sql
-- Trust: The top umbrella organization
CREATE TABLE trusts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- e.g., "Shree Saraswati Education Trust"
    registration_no VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branch: Either School or College
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., "Saraswati International School" or "Imperial College of Hotel Management"
    branch_type VARCHAR(50) NOT NULL, -- 'SCHOOL' or 'COLLEGE'
    code VARCHAR(50) UNIQUE NOT NULL, -- 'SCH-01', 'HM-01'
    address TEXT,
    phone VARCHAR(50),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Users & Authentication (`User` & `Role`)
```sql
CREATE TYPE user_role AS ENUM (
    'SUPERADMIN',     -- Trust President / Trustee
    'BRANCH_ADMIN',   -- School Principal / College Director
    'ACCOUNTANT',     -- Fee collector
    'TEACHER',        -- School Teacher / College Lecturer / Chef Instructor
    'PARENT',         -- School Parent
    'STUDENT',        -- College Hotel Management Student
    'DRIVER'          -- Bus Driver
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID REFERENCES branches(id), -- NULL for Superadmin (Superadmin sees both)
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Students & Admissions
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    category VARCHAR(50), -- General, OBC, SC, ST
    
    -- Academic Placement
    academic_year VARCHAR(20) NOT NULL, -- e.g., "2026-2027"
    grade_or_semester VARCHAR(50) NOT NULL, -- School: "Class 7-A" | College: "B.Sc H&HA Semester 3"
    stream_or_course VARCHAR(100), -- College: "Food Production & Culinary Arts"
    
    -- Parent / Guardian Details (Key for School)
    father_name VARCHAR(255),
    father_phone VARCHAR(50),
    mother_name VARCHAR(255),
    mother_phone VARCHAR(50),
    emergency_contact VARCHAR(50),
    address TEXT,
    
    -- User account links
    parent_user_id UUID REFERENCES users(id),
    student_user_id UUID REFERENCES users(id), -- Used for College students
    
    -- Status
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ENQUIRY, ADMITTED, ACTIVE, ALUMNI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Digital Documents (KYC & Certificates)
```sql
CREATE TABLE student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'AADHAR_CARD', 'BIRTH_CERTIFICATE', 'TRANSFER_CERTIFICATE', '10TH_MARKSHEET', '12TH_MARKSHEET'
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- Cloud Storage URL
    file_size_bytes BIGINT,
    verification_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    verified_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Fees Management & Receipts
```sql
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    academic_year VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g., "Class 7 Annual Fee" or "1st Year Hotel Mgmt Tuition + Kitchen Kit"
    total_amount NUMERIC(12, 2) NOT NULL,
    installments_allowed INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    receipt_no VARCHAR(100) UNIQUE NOT NULL, -- Auto-generated: "RCP-SCH-2026-0001"
    installment_no INT NOT NULL,
    amount_paid NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL, -- 'CASH', 'UPI', 'CARD', 'NETBANKING', 'CHEQUE'
    transaction_ref VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    collected_by UUID REFERENCES users(id),
    receipt_pdf_url TEXT
);
```

### 6. Attendance & Homework
```sql
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    student_id UUID NOT NULL REFERENCES students(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'
    remarks TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

CREATE TABLE homework_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    teacher_id UUID NOT NULL REFERENCES users(id),
    grade_or_course VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachment_url TEXT, -- PDF or image of worksheet
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. School Bus & Transport Tracking
```sql
CREATE TABLE bus_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    route_name VARCHAR(100) NOT NULL, -- e.g. "Route 4 - City Center to Campus"
    bus_number VARCHAR(50) NOT NULL,  -- e.g. "MH-12-AB-1234"
    driver_user_id UUID REFERENCES users(id),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(50)
);

CREATE TABLE bus_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(255) NOT NULL,
    stop_sequence INT NOT NULL,
    scheduled_time TIME NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

CREATE TABLE bus_live_locations (
    route_id UUID PRIMARY KEY REFERENCES bus_routes(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed_kmh DECIMAL(5, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Specialized Hotel Management Module Tables
```sql
-- Kitchen / Lab Practical Rosters
CREATE TABLE hm_kitchen_labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    lab_name VARCHAR(100) NOT NULL, -- "Basic Training Kitchen", "Advance Food Production Lab", "Mock Bar / Restaurant"
    capacity INT DEFAULT 30,
    incharge_faculty_id UUID REFERENCES users(id)
);

CREATE TABLE hm_practical_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID NOT NULL REFERENCES hm_kitchen_labs(id),
    batch_name VARCHAR(100) NOT NULL, -- "Batch A - Morning Continental Cookery"
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    menu_or_topic TEXT -- "4-Course French Menu Practical: Consomme, Chicken Chasseur, Pommes Anna, Souffle"
);

-- Industrial Training (Internship) in Star Hotels
CREATE TABLE hm_industrial_trainings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    hotel_name VARCHAR(255) NOT NULL, -- e.g., "Taj Lands End, Mumbai" or "JW Marriott"
    city VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    department VARCHAR(100), -- Food Production, F&B Service, Front Office, Housekeeping
    hotel_mentor_name VARCHAR(100),
    performance_score DECIMAL(3, 1), -- Out of 10
    completion_certificate_url TEXT
);
```
