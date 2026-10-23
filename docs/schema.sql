-- ==============================================================================
-- TRUSTEDU ERP: ENTERPRISE DATABASE SCHEMA SPECIFICATION
-- Database Engine: PostgreSQL 14+ / 16
-- Multi-Tenancy: Row Level Isolation via trust_id and branch_id with RLS Policies
-- Compliance: ACID Financial Ledgers, Append-Only Audit Logging, Zero-Downtime Design
-- ==============================================================================

-- 1. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ENUM DEFINITIONS
-- ==============================================================================

CREATE TYPE user_role AS ENUM (
    'SUPERADMIN',          -- Trust Executive / Trustee / President
    'INSTITUTE_DIRECTOR',  -- Institute Principal / Director
    'BRANCH_ADMIN',        -- Campus Branch Administrator
    'ACCOUNTANT',          -- Fee Collector / Cashier / Financial Auditor
    'TEACHER',             -- Faculty / Lecturer / Chef Instructor
    'RECEPTIONIST',        -- Front Desk / Visitor Gatepass Officer
    'LIBRARIAN',           -- Library Catalog & Circulation Manager
    'HOSTEL_WARDEN',       -- Hostel Supervisor & Curfew Monitor
    'TRANSPORT_MANAGER',   -- Fleet & Route Coordinator
    'STUDENT',             -- K-12 Student / College Scholar
    'PARENT'               -- Guardian / Parent
);

CREATE TYPE branch_type AS ENUM (
    'K12_SCHOOL',
    'ENGINEERING_COLLEGE',
    'POLYTECHNIC_INSTITUTE',
    'HOTEL_MANAGEMENT_COLLEGE',
    'JUNIOR_COLLEGE'
);

CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');

CREATE TYPE cap_round_status AS ENUM ('DRAFT', 'REGISTRATION_OPEN', 'ALLOCATION_PUBLISHED', 'COMPLETED');

CREATE TYPE cap_seat_status AS ENUM ('APPLIED', 'ALLOCATED', 'ACCEPTED', 'REJECTED', 'FROZEN', 'FLOAT');

CREATE TYPE payment_mode AS ENUM ('CASH', 'CHEQUE', 'UPI', 'NEFT_RTGS', 'RAZORPAY_STRIPE', 'DEMAND_DRAFT');

CREATE TYPE voucher_type AS ENUM ('RECEIPT', 'PAYMENT', 'JOURNAL', 'CONTRA');

CREATE TYPE concession_status AS ENUM ('PENDING', 'RECOMMENDED_PRINCIPAL', 'APPROVED_TRUSTEE', 'REJECTED');

CREATE TYPE doc_inward_status AS ENUM ('CUSTODY', 'TEMPORARY_RETURN', 'PERMANENT_RETURN');

CREATE TYPE certificate_type AS ENUM ('BONAFIDE', 'TRANSFER_LEAVING', 'CHARACTER', 'ATTENDANCE_EXCELLENCE', 'INTERNSHIP_NOC');

CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_DUTY', 'EXCUSED');

CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED_HOD', 'APPROVED_HR', 'REJECTED');

CREATE TYPE gate_pass_status AS ENUM ('INSIDE_CAMPUS', 'EXITED', 'OVERSTAYED');

-- ==============================================================================
-- 3. MULTI-TENANT ORGANIZATIONAL HIERARCHY
-- ==============================================================================

-- Top-Level Tenant: Educational Trust
CREATE TABLE trusts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100) NOT NULL,
    tax_exempt_80g_no VARCHAR(100),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    registered_address TEXT NOT NULL,
    logo_url TEXT,
    letterhead_template TEXT,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institute under the Trust (e.g. Engineering College, Hotel Mgmt College, Public School)
CREATE TABLE institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id) ON DELETE RESTRICT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    institute_type branch_type NOT NULL,
    accreditation VARCHAR(100), -- 'NAAC A+', 'AICTE Approved', 'CBSE Affiliated'
    affiliation_no VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branch / Physical Campus
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id) ON DELETE RESTRICT,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic Stream & Affiliation Board (e.g., CBSE, Maharashtra State Board, Pune University)
CREATE TABLE academic_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    stream_name VARCHAR(100) NOT NULL, -- 'Science', 'Culinary Arts & Kitchen Operations', 'Computer Science'
    board_or_university VARCHAR(150) NOT NULL,
    duration_years INT NOT NULL DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class / Standard (e.g. Standard 10, B.Tech Year 2, Semester 3)
CREATE TABLE classes_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES academic_streams(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL, -- 'Class 10', 'B.Sc H&HA Semester 3'
    sequence_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Division / Section (e.g. Section A, Division B)
CREATE TABLE divisions_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes_standards(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL, -- 'A', 'B', 'Div 1'
    room_number VARCHAR(50),
    max_capacity INT DEFAULT 60,
    class_teacher_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, section_name)
);

-- Practical / Lab Batches (e.g. Batch A1, Basic Training Kitchen Batch B)
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID NOT NULL REFERENCES divisions_sections(id) ON DELETE CASCADE,
    batch_name VARCHAR(50) NOT NULL, -- 'Batch 1 (Roll 1-30)', 'Culinary Practical Batch A'
    lab_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. USERS, ROLES & GRANULAR RBAC
-- ==============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL, -- NULL for cross-institute superadmins
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(100) NOT NULL, -- 'ADMISSIONS', 'FEES', 'EXAMS_OMR', 'BIOMETRICS', 'PAYROLL', 'AUXILIARY'
    action VARCHAR(50) NOT NULL,   -- 'CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'PRINT', 'EXPORT'
    description TEXT,
    UNIQUE(module, action)
);

CREATE TABLE role_permissions (
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY(role, permission_id)
);

-- Multi-branch authorization mapping for users managing multiple campuses
CREATE TABLE user_branches (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, branch_id)
);

-- ==============================================================================
-- 5. MODULE 1: ADMISSIONS & CAP (CENTRALIZED ADMISSION PROCESS)
-- ==============================================================================

CREATE TABLE cap_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    academic_year VARCHAR(20) NOT NULL, -- '2026-2027'
    round_number INT NOT NULL,
    round_name VARCHAR(100) NOT NULL, -- 'CAP Round 1 - Merit Seats'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cutoff_merit_score NUMERIC(5, 2),
    status cap_round_status DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cap_round_id UUID NOT NULL REFERENCES cap_rounds(id),
    application_no VARCHAR(50) UNIQUE NOT NULL,
    candidate_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    caste_category VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- 'GENERAL', 'OBC', 'SC', 'ST', 'EWS'
    merit_rank INT NOT NULL,
    merit_percentage NUMERIC(5, 2) NOT NULL,
    applied_institute_id UUID NOT NULL REFERENCES institutes(id),
    applied_stream_id UUID REFERENCES academic_streams(id),
    allocated_seat_status cap_seat_status DEFAULT 'APPLIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES cap_applications(id) ON DELETE CASCADE,
    preference_rank INT NOT NULL, -- 1, 2, 3
    institute_id UUID NOT NULL REFERENCES institutes(id),
    stream_id UUID REFERENCES academic_streams(id),
    UNIQUE(application_id, preference_rank)
);

-- Enrolled Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    division_id UUID REFERENCES divisions_sections(id),
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type NOT NULL,
    blood_group VARCHAR(10),
    caste_category VARCHAR(50) DEFAULT 'GENERAL',
    aadhaar_number VARCHAR(20),
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    academic_year VARCHAR(20) NOT NULL,
    grade_or_semester VARCHAR(100) NOT NULL,
    father_name VARCHAR(255),
    father_phone VARCHAR(50),
    mother_name VARCHAR(255),
    mother_phone VARCHAR(50),
    address TEXT,
    parent_user_id UUID REFERENCES users(id),
    student_user_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Promotion History (Batch promotions with fee balance carry-forward)
CREATE TABLE student_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    from_academic_year VARCHAR(20) NOT NULL,
    to_academic_year VARCHAR(20) NOT NULL,
    from_grade VARCHAR(100) NOT NULL,
    to_grade VARCHAR(100) NOT NULL,
    carried_forward_pending_fee NUMERIC(12, 2) DEFAULT 0.00,
    promoted_by UUID NOT NULL REFERENCES users(id),
    promotion_status VARCHAR(50) DEFAULT 'PROMOTED', -- 'PROMOTED', 'RETAINED', 'GRADUATED'
    promoted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. MODULE 2: FEE COLLECTIONS, CONCESSIONS & TRUST ACCOUNTING
-- ==============================================================================

-- Master Chart of Accounts (Ledger)
CREATE TABLE accounting_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID REFERENCES branches(id), -- NULL for trust consolidated
    ledger_code VARCHAR(50) NOT NULL,
    ledger_name VARCHAR(255) NOT NULL,
    group_type VARCHAR(50) NOT NULL, -- 'ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'
    opening_balance NUMERIC(14, 2) DEFAULT 0.00,
    current_balance NUMERIC(14, 2) DEFAULT 0.00,
    is_bank_or_cash BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trust_id, ledger_code)
);

-- Fee Heads (Tuition, Lab Fee, Transport, Library, Hostel, Development)
CREATE TABLE fee_heads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    accounting_ledger_id UUID REFERENCES accounting_ledgers(id),
    is_refundable BOOLEAN DEFAULT FALSE
);

CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    academic_year VARCHAR(20) NOT NULL,
    class_id UUID NOT NULL REFERENCES classes_standards(id),
    quota_category VARCHAR(50) DEFAULT 'GENERAL', -- 'GENERAL', 'OBC', 'SC_ST', 'MANAGEMENT'
    total_annual_fee NUMERIC(12, 2) NOT NULL,
    installments_count INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fee_structure_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    fee_head_id UUID NOT NULL REFERENCES fee_heads(id),
    amount NUMERIC(12, 2) NOT NULL
);

-- Fee Concessions & Multi-Level Approvals
CREATE TABLE fee_concessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    requested_amount NUMERIC(12, 2) NOT NULL,
    concession_reason TEXT NOT NULL,
    income_certificate_url TEXT,
    status concession_status DEFAULT 'PENDING',
    approved_amount NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fee_concession_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concession_id UUID NOT NULL REFERENCES fee_concessions(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    approver_role VARCHAR(50) NOT NULL, -- 'PRINCIPAL', 'TRUSTEE'
    decision VARCHAR(50) NOT NULL, -- 'APPROVED', 'REJECTED'
    remarks TEXT,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Double-Entry Accounting Vouchers
CREATE TABLE accounting_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    voucher_no VARCHAR(100) UNIQUE NOT NULL,
    voucher_type voucher_type NOT NULL,
    voucher_date DATE NOT NULL,
    narration TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE accounting_voucher_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id UUID NOT NULL REFERENCES accounting_vouchers(id) ON DELETE CASCADE,
    ledger_id UUID NOT NULL REFERENCES accounting_ledgers(id),
    debit_amount NUMERIC(14, 2) DEFAULT 0.00,
    credit_amount NUMERIC(14, 2) DEFAULT 0.00,
    CONSTRAINT chk_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR
        (credit_amount > 0 AND debit_amount = 0)
    )
);

-- Fee Payments & Receipts
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    student_id UUID NOT NULL REFERENCES students(id),
    receipt_no VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_mode payment_mode NOT NULL,
    transaction_ref VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    collected_by UUID NOT NULL REFERENCES users(id),
    voucher_id UUID REFERENCES accounting_vouchers(id),
    barcode_hash VARCHAR(100) NOT NULL,
    idempotency_key VARCHAR(100) UNIQUE
);

-- ==============================================================================
-- 7. MODULE 3: ORIGINAL DOCUMENTS & CERTIFICATE ENGINE
-- ==============================================================================

CREATE TABLE document_rack_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    cupboard_no VARCHAR(50) NOT NULL,
    shelf_no VARCHAR(50) NOT NULL,
    rack_code VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE(branch_id, cupboard_no, shelf_no, rack_code)
);

CREATE TABLE original_document_inward (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    document_title VARCHAR(150) NOT NULL, -- 'Original 10th Passing Certificate', 'Original 12th Migration'
    serial_no VARCHAR(100),
    received_date DATE NOT NULL,
    received_by UUID NOT NULL REFERENCES users(id),
    rack_location_id UUID REFERENCES document_rack_locations(id),
    folder_number VARCHAR(50),
    inward_receipt_no VARCHAR(100) UNIQUE NOT NULL,
    status doc_inward_status DEFAULT 'CUSTODY',
    returned_date DATE,
    return_authorized_by UUID REFERENCES users(id),
    acknowledgement_url TEXT
);

CREATE TABLE issued_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    student_id UUID NOT NULL REFERENCES students(id),
    certificate_type certificate_type NOT NULL,
    certificate_serial_no VARCHAR(100) UNIQUE NOT NULL, -- e.g. "TC-SCH-2026-0042"
    issued_date DATE NOT NULL,
    issued_by UUID NOT NULL REFERENCES users(id),
    digital_signature_hash TEXT NOT NULL,
    qr_verification_url TEXT NOT NULL, -- e.g. "https://trustedu.org/verify/doc/uuid"
    certificate_pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 8. MODULE 4: EXAMINATIONS, ONLINE TESTS & OMR COMPUTER VISION
-- ==============================================================================

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    academic_year VARCHAR(20) NOT NULL,
    title VARCHAR(150) NOT NULL, -- 'Mid-Term Examination 2026', 'Final Culinary Arts Assessment'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE exam_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_marks INT NOT NULL DEFAULT 100,
    passing_marks INT NOT NULL DEFAULT 35
);

CREATE TABLE exam_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    room_number VARCHAR(50) NOT NULL,
    total_benches INT NOT NULL,
    seats_per_bench INT NOT NULL DEFAULT 2
);

CREATE TABLE exam_seating_matrix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_schedule_id UUID NOT NULL REFERENCES exam_schedules(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    room_id UUID NOT NULL REFERENCES exam_rooms(id),
    seat_label VARCHAR(50) NOT NULL, -- 'Room 201 - Bench 14A'
    hall_ticket_barcode VARCHAR(100) NOT NULL
);

-- OMR Configuration & Scans
CREATE TABLE omr_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    title VARCHAR(150) NOT NULL, -- 'Standard 100-Question 4-Option Sheet'
    total_questions INT NOT NULL DEFAULT 100,
    options_per_question INT NOT NULL DEFAULT 4,
    has_corner_anchors BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE omr_answer_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES omr_templates(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    set_code VARCHAR(10) NOT NULL, -- 'SET_A', 'SET_B'
    answers_json JSONB NOT NULL, -- {"1": "A", "2": "C", ...}
    positive_mark NUMERIC(4, 2) DEFAULT 1.00,
    negative_mark NUMERIC(4, 2) DEFAULT 0.25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE omr_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_key_id UUID NOT NULL REFERENCES omr_answer_keys(id),
    student_id UUID REFERENCES students(id),
    roll_number_detected VARCHAR(50),
    scanned_image_url TEXT NOT NULL,
    recognized_answers JSONB NOT NULL,
    correct_count INT NOT NULL,
    wrong_count INT NOT NULL,
    unattempted_count INT NOT NULL,
    computed_score NUMERIC(6, 2) NOT NULL,
    evaluation_verified BOOLEAN DEFAULT FALSE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 9. MODULE 5: HARDWARE BIOMETRICS & ATTENDANCE SYSTEM
-- ==============================================================================

CREATE TABLE biometric_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    device_name VARCHAR(100) NOT NULL, -- 'Main Gate Turnstile Biometric #1'
    ip_address VARCHAR(50) NOT NULL,
    port INT DEFAULT 4370,
    protocol VARCHAR(20) DEFAULT 'ZK_TCP', -- 'ZK_TCP', 'MQTT', 'WEBSOCKET'
    last_heartbeat_at TIMESTAMP WITH TIME ZONE,
    is_online BOOLEAN DEFAULT FALSE
);

CREATE TABLE biometric_punches_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES biometric_devices(id),
    biometric_user_id VARCHAR(50) NOT NULL, -- User card or biometric ID
    punch_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    punch_type VARCHAR(20) NOT NULL, -- 'CHECK_IN', 'CHECK_OUT'
    is_synced_to_attendance BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE student_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    marked_by UUID REFERENCES users(id),
    remarks TEXT,
    UNIQUE(student_id, date)
);

CREATE TABLE staff_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    in_time TIME,
    out_time TIME,
    total_hours NUMERIC(4, 2),
    is_late BOOLEAN DEFAULT FALSE,
    is_half_day BOOLEAN DEFAULT FALSE,
    status attendance_status NOT NULL,
    UNIQUE(user_id, date)
);

CREATE TABLE hostel_curfew_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    curfew_date DATE NOT NULL,
    time_punched TIME,
    is_present BOOLEAN NOT NULL DEFAULT TRUE,
    warden_user_id UUID NOT NULL REFERENCES users(id),
    remarks TEXT,
    UNIQUE(student_id, curfew_date)
);

-- ==============================================================================
-- 10. MODULE 6: HR, LEAVES & MONTHLY PAYROLL
-- ==============================================================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    user_id UUID REFERENCES users(id),
    emp_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL, -- 'Principal', 'Associate Professor', 'Master Chef'
    department VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    basic_salary NUMERIC(12, 2) NOT NULL,
    hra NUMERIC(12, 2) DEFAULT 0.00,
    da NUMERIC(12, 2) DEFAULT 0.00,
    special_allowance NUMERIC(12, 2) DEFAULT 0.00,
    pan_card_no VARCHAR(20) NOT NULL,
    provident_fund_no VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    title VARCHAR(50) NOT NULL, -- 'CASUAL_LEAVE', 'MEDICAL_LEAVE', 'EARNED_LEAVE'
    annual_quota INT NOT NULL DEFAULT 12
);

CREATE TABLE leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(4, 1) NOT NULL,
    reason TEXT NOT NULL,
    status leave_status DEFAULT 'PENDING',
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    payroll_month INT NOT NULL, -- 1-12
    payroll_year INT NOT NULL,
    total_gross_disbursed NUMERIC(14, 2) NOT NULL,
    total_deductions NUMERIC(14, 2) NOT NULL,
    total_net_disbursed NUMERIC(14, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PROCESSED', -- 'DRAFT', 'PROCESSED', 'DISBURSED'
    executed_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    gross_earnings NUMERIC(12, 2) NOT NULL,
    pf_deduction NUMERIC(12, 2) DEFAULT 0.00,       -- 12% statutory PF
    esic_deduction NUMERIC(12, 2) DEFAULT 0.00,     -- 0.75% statutory ESIC
    professional_tax NUMERIC(12, 2) DEFAULT 200.00, -- PT Slab
    tds_deduction NUMERIC(12, 2) DEFAULT 0.00,      -- Income Tax
    net_salary NUMERIC(12, 2) NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 11. MODULE 7: TIMETABLE, CLASSROOMS & ACADEMIC PROGRESS
-- ==============================================================================

CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    room_name VARCHAR(100) NOT NULL, -- 'Room 302', 'Culinary Lab 1'
    capacity INT NOT NULL DEFAULT 60
);

CREATE TABLE timetable_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID NOT NULL REFERENCES divisions_sections(id),
    day_of_week VARCHAR(20) NOT NULL, -- 'MONDAY', 'TUESDAY', ...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(100) NOT NULL,
    teacher_id UUID NOT NULL REFERENCES users(id),
    classroom_id UUID NOT NULL REFERENCES classrooms(id),
    CONSTRAINT uq_teacher_slot UNIQUE (teacher_id, day_of_week, start_time),
    CONSTRAINT uq_room_slot UNIQUE (classroom_id, day_of_week, start_time),
    CONSTRAINT uq_section_slot UNIQUE (division_id, day_of_week, start_time)
);

CREATE TABLE lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID NOT NULL REFERENCES divisions_sections(id),
    teacher_id UUID NOT NULL REFERENCES users(id),
    subject VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    topic_title VARCHAR(255) NOT NULL,
    curriculum_objectives TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    teacher_diary_reflection TEXT
);

-- ==============================================================================
-- 12. MODULE 8: CAMPUS AUXILIARY OPERATIONS
-- ==============================================================================

-- Library LMS
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    isbn VARCHAR(50),
    barcode VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(150),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    rack_location VARCHAR(50)
);

CREATE TABLE library_circulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES library_books(id),
    borrower_user_id UUID NOT NULL REFERENCES users(id),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount NUMERIC(8, 2) DEFAULT 0.00,
    librarian_user_id UUID NOT NULL REFERENCES users(id)
);

-- Hostel
CREATE TABLE hostel_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    block_name VARCHAR(100) NOT NULL, -- 'Tagore Boys Hostel', 'Sarojini Girls Hostel'
    total_rooms INT NOT NULL
);

CREATE TABLE hostel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID NOT NULL REFERENCES hostel_blocks(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    capacity INT NOT NULL DEFAULT 2
);

CREATE TABLE hostel_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES hostel_rooms(id),
    student_id UUID NOT NULL REFERENCES students(id),
    bed_label VARCHAR(10) NOT NULL, -- 'A', 'B'
    academic_year VARCHAR(20) NOT NULL,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transport
CREATE TABLE transport_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    vehicle_number VARCHAR(50) UNIQUE NOT NULL, -- 'MH-12-AB-9876'
    capacity INT NOT NULL,
    driver_user_id UUID REFERENCES users(id),
    gps_device_imei VARCHAR(50)
);

CREATE TABLE transport_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    route_name VARCHAR(100) NOT NULL, -- 'Route 1 - East City Express'
    vehicle_id UUID REFERENCES transport_vehicles(id)
);

CREATE TABLE transport_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES transport_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(150) NOT NULL,
    pickup_time TIME NOT NULL,
    drop_time TIME NOT NULL,
    stop_fee NUMERIC(10, 2) NOT NULL,
    stop_sequence INT NOT NULL
);

-- Inventory & Asset Management
CREATE TABLE inventory_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    vendor_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(50),
    contact_phone VARCHAR(50),
    email VARCHAR(255)
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Lab Chemical', 'Kitchen Utensil', 'Stationery'
    current_stock NUMERIC(10, 2) DEFAULT 0.00,
    unit VARCHAR(20) NOT NULL -- 'PCS', 'KG', 'BOX'
);

CREATE TABLE goods_receipt_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES inventory_vendors(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    grn_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_number VARCHAR(100),
    grn_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    received_by UUID NOT NULL REFERENCES users(id)
);

-- Front Desk Visitor Gate Passes
CREATE TABLE visitor_gate_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    pass_number VARCHAR(100) UNIQUE NOT NULL, -- 'GP-2026-0001'
    visitor_name VARCHAR(150) NOT NULL,
    visitor_phone VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    whom_to_meet VARCHAR(150) NOT NULL,
    photo_url TEXT,
    in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    out_time TIMESTAMP WITH TIME ZONE,
    status gate_pass_status DEFAULT 'INSIDE_CAMPUS'
);

-- ==============================================================================
-- 13. MODULE 9: COMMUNICATION & WHATSAPP
-- ==============================================================================

CREATE TABLE whatsapp_message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID REFERENCES branches(id),
    recipient_phone VARCHAR(50) NOT NULL,
    template_name VARCHAR(100) NOT NULL, -- 'fee_due_alert', 'attendance_absent_alert'
    message_payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'FAILED'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notice_board_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES trusts(id),
    branch_id UUID REFERENCES branches(id), -- NULL for trust-wide notice
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_roles user_role[] NOT NULL,
    posted_by UUID NOT NULL REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 14. RELIABILITY: APPEND-ONLY AUDIT LOGS & IDEMPOTENCY
-- ==============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_data JSONB,
    new_data JSONB,
    performed_by UUID,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE idempotency_keys (
    idempotency_key VARCHAR(100) PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    response_status INT NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 15. PERFORMANCE INDEXES & CONSTRAINTS
-- ==============================================================================

CREATE INDEX idx_users_trust_branch ON users(trust_id, branch_id);
CREATE INDEX idx_students_branch_grade ON students(branch_id, grade_or_semester);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_receipt ON fee_payments(receipt_no);
CREATE INDEX idx_student_attendances_date ON student_attendances(date);
CREATE INDEX idx_staff_attendances_date ON staff_attendances(date);
CREATE INDEX idx_accounting_vouchers_no ON accounting_vouchers(voucher_no);
CREATE INDEX idx_omr_scans_key ON omr_scans(answer_key_id);
CREATE INDEX idx_issued_certificates_serial ON issued_certificates(certificate_serial_no);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES EXAMPLE
-- ==============================================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_vouchers ENABLE ROW LEVEL SECURITY;
