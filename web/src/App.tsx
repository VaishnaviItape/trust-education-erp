import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PublicWebsite } from './components/PublicWebsite';
import { LoginPage, UserProfile } from './components/LoginPage';
import { Sidebar, DashboardTab, TAB_ROUTE_MAP, getTabFromPathname } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { SuperadminDashboard } from './components/SuperadminDashboard';
import { StudentDirectoryModule } from './components/StudentDirectoryModule';
import { FeeLedgerModule } from './components/FeeLedgerModule';
import { AcademicsModule } from './components/AcademicsModule';
import { BusFleetModule } from './components/BusFleetModule';
import { EnquiriesModule } from './components/EnquiriesModule';
import { AdmissionInquiryPage } from './components/AdmissionInquiryPage';
import { StudentProgressionManager } from './components/StudentProgressionManager';
import { AdmissionsWizardModal } from './components/AdmissionsWizardModal';
import { TrustAccountingModule } from './components/TrustAccountingModule';
import { CertificatesModule } from './components/CertificatesModule';
import { IdCardsModule } from './components/IdCardsModule';
import { ExamOmrStudioModule } from './components/ExamOmrStudioModule';
import { BiometricsAttendanceModule } from './components/BiometricsAttendanceModule';
import { HRPayrollModule } from './components/HRPayrollModule';
import { TimetableModule } from './components/TimetableModule';
import { CampusAuxiliaryModule } from './components/CampusAuxiliaryModule';
import { CommunicationModule } from './components/CommunicationModule';
import { TripsAndToursModule } from './components/TripsAndToursModule';
import { AcademicMastersModule } from './components/AcademicMastersModule';
import { ReportsCenterModule } from './components/ReportsCenterModule';
import { FeatureFlagsModule } from './components/FeatureFlagsModule';
import { FeatureFlagService } from './utils/featureFlags';
import {
  Student,
  Employee,
  FeeReceipt,
  BusRoute,
  KitchenPracticalBatch,
  HotelInternship,
  ChefKitInventory,
  AdmissionEnquiry,
  StudentProgressionRecord,
} from './types';
import { StaffService } from './utils/staffData';
import {
  generateFeeBreakdown,
  numberToWordsINR,
  numberToMarathiWordsINR,
} from './utils/feeReceiptUtils';
import { FileQuestion, CheckCircle2, Phone, Mail, Calendar, UserCheck, Sliders } from 'lucide-react';
import { envConfig } from './config/env';

const initialProgressionRecords: StudentProgressionRecord[] = [
  {
    id: 'prog-init-01',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    admissionNo: 'SCH-2026-001',
    branchName: 'Saraswati International Public School',
    fromYear: '2024-2025',
    toYear: '2025-2026',
    fromGrade: 'Class 6-A',
    toGrade: 'Class 7-A',
    pendingFeeCarriedForward: 8000,
    promotedDate: '2025-04-10',
    status: 'PROMOTED',
  },
  {
    id: 'prog-init-02',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    admissionNo: 'HM-2026-101',
    branchName: 'Imperial Institute of Hotel Management',
    fromYear: '2024-2025',
    toYear: '2025-2026',
    fromGrade: 'B.Sc H&HA Semester 2',
    toGrade: 'B.Sc H&HA Semester 3',
    pendingFeeCarriedForward: 15000,
    promotedDate: '2025-06-25',
    status: 'PROMOTED',
  },
];

// Initial fallback mock data for guaranteed offline demo
const initialStudents: Student[] = [
  {
    id: 'stu-aafan-01',
    branchId: 'branch-sch-01',
    admissionNo: 'ADM-2026-000285',
    rollNo: '01',
    name: 'AAFAN ALI A',
    firstName: 'AAFAN ALI',
    lastName: 'A',
    gender: 'MALE',
    gradeOrSemester: 'STD 8 - Division A',
    standard: 'STD 8',
    division: 'Division A',
    admissionType: 'Fresh',
    admissionDate: '2026-06-10',
    grNumber: 'GR-2026-000285',
    prnNumber: 'PRN-2026-00285',
    penNumber: 'PEN-MH-2026-99120',
    saralId: 'SARAL-2725120042',
    parentName: 'Ali A & Taranum',
    parentPhone: '+91 98230 11999',
    parentEmail: 'taranum.ali@gmail.com',
    fatherName: 'Ali A',
    motherName: 'TARANUM',
    feeTotal: 38000,
    feePaid: 26000,
    feePending: 12000,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    religion: 'Muslim',
    caste: 'Muslim / General',
    subCategory: 'Sunni',
    category: 'GENERAL',
    bloodGroup: 'O+',
    motherTongue: 'Marathi',
    placeOfBirth: 'Hinjawadi',
    dob: '2013-07-30',
    dobWords: 'Thirty July Two Thousand Thirteen',
    nationality: 'India',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    currentAddress: {
      street: 'S.No.160/1/2,Plot No.12',
      area: 'Hinjawadi Phase 1',
      taluka: 'Pimpri-Chinchwad',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
      pincode: '416205',
    },
    permanentAddress: {
      street: 'S.No.160/1/2,Plot No.12',
      area: 'Hinjawadi Phase 1',
      taluka: 'Pimpri-Chinchwad',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
      pincode: '416205',
    },
    submittedDocuments: [
      { id: 'doc-birth', documentTitle: 'Original Birth Certificate (Gram Panchayat / Municipal stamped)', documentCode: 'DOC-BIRTH', isMandatory: true, submitted: true, fileName: 'AAFAN_BirthCertificate_Hinjawadi.pdf', fileSize: '1.4 MB' },
      { id: 'doc-lc', documentTitle: 'Original Previous School Leaving Certificate (L.C. / T.C.)', documentCode: 'DOC-LC', isMandatory: true, submitted: true, fileName: 'AAFAN_LC_TC_Primary.pdf', fileSize: '2.1 MB' },
      { id: 'doc-marks', documentTitle: 'Previous Year Grade 7th Marksheet & Passing Certificate', documentCode: 'DOC-MARKS-7', isMandatory: true, submitted: true, fileName: 'AAFAN_Std7_Marksheet.pdf', fileSize: '1.8 MB' },
      { id: 'doc-aadhaar', documentTitle: 'Aadhaar Card Verified Photocopy (UIDAI QR-Verified)', documentCode: 'DOC-AADHAAR', isMandatory: true, submitted: true, fileName: 'AAFAN_Aadhaar_UIDAI.pdf', fileSize: '950 KB' },
      { id: 'doc-domicile', documentTitle: 'Domicile & Nationality Certificate (State of Maharashtra)', documentCode: 'DOC-DOMICILE', isMandatory: true, submitted: true, fileName: 'AAFAN_Domicile_MH.pdf', fileSize: '1.1 MB' },
      { id: 'doc-med', documentTitle: 'Medical Fitness & Blood Group Certificate', documentCode: 'DOC-MED-FIT', isMandatory: false, submitted: true, fileName: 'AAFAN_MedicalFitness.pdf', fileSize: '820 KB' },
      { id: 'doc-photo', documentTitle: 'Passport Size Photographs (4 Copies)', documentCode: 'DOC-PHOTO', isMandatory: true, submitted: true, fileName: 'AAFAN_Photo_Formal.jpg', fileSize: '450 KB' },
    ],
    rackCode: 'C1-S2-SCH',
    folderNumber: 'FL-2026-000285',
    aadhaarNumber: '9823-4412-8801',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-s00',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-000',
    rollNo: '1A-01',
    name: 'Vihaan Gupta (1st Std)',
    gender: 'MALE',
    gradeOrSemester: 'Class 1-A',
    parentName: 'Amit Gupta',
    parentPhone: '+91 98230 11999',
    feeTotal: 32000,
    feePaid: 20000,
    feePending: 12000,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '9823-4412-8801',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-s01',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-001',
    rollNo: '7A-01',
    name: 'Aarav Sharma',
    gender: 'MALE',
    gradeOrSemester: 'Class 7-A',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98230 11223',
    feeTotal: 36000,
    feePaid: 24000,
    feePending: 12000,
    attendancePercent: 94,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '4512-7721-3392',
    aadhaarVerified: true,
    roleTag: 'PREFECT',
  },
  {
    id: 'stu-s02',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-002',
    rollNo: '7A-02',
    name: 'Ananya Patel',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 7-A',
    parentName: 'Bhavesh Patel',
    parentPhone: '+91 98230 44556',
    feeTotal: 36000,
    feePaid: 36000,
    feePending: 0,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '6721-8844-9912',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-s03',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-003',
    rollNo: '8B-15',
    name: 'Rohan Deshmukh',
    gender: 'MALE',
    gradeOrSemester: 'Class 8-B',
    parentName: 'Sunil Deshmukh',
    parentPhone: '+91 98230 77889',
    feeTotal: 38000,
    feePaid: 20000,
    feePending: 18000,
    attendancePercent: 88,
    kycStatus: 'PENDING',
    aadhaarNumber: '3341-9920-5514',
    aadhaarVerified: false,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-s04',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-004',
    rollNo: '9A-08',
    name: 'Tanvi Kulkarni',
    firstName: 'Tanvi',
    lastName: 'Kulkarni',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 9-A',
    standard: 'Class 9',
    division: 'Division A',
    admissionType: 'Existing',
    isExistingStudent: true,
    originalAdmissionYear: '2023-2024',
    grNumber: 'GR-2023-0142',
    prnNumber: 'PRN-2023-8890',
    previousClassOrSem: 'Class 8-A',
    previousYearPercentage: 91.2,
    legacyEnrollmentSource: 'OLD_GR_REGISTER',
    parentName: 'Milind Kulkarni',
    fatherName: 'Milind Kulkarni',
    motherName: 'Aparna Kulkarni',
    parentPhone: '+91 98231 66778',
    feeTotal: 40000,
    feePaid: 40000,
    feePending: 0,
    attendancePercent: 95,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '4482-1190-3367',
    aadhaarVerified: true,
    roleTag: 'PREFECT',
  },
  {
    id: 'stu-s05',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-005',
    rollNo: '10A-12',
    name: 'Aryan Shinde',
    firstName: 'Aryan',
    lastName: 'Shinde',
    gender: 'MALE',
    gradeOrSemester: 'Class 10-A',
    standard: 'Class 10',
    division: 'Division A',
    admissionType: 'Existing',
    isExistingStudent: true,
    originalAdmissionYear: '2022-2023',
    grNumber: 'GR-2022-0914',
    prnNumber: 'PRN-2022-7714',
    previousClassOrSem: 'Class 9-A',
    previousYearPercentage: 88.5,
    legacyEnrollmentSource: 'OLD_GR_REGISTER',
    parentName: 'Eknath Shinde',
    fatherName: 'Eknath Shinde',
    motherName: 'Suman Shinde',
    parentPhone: '+91 98232 55443',
    feeTotal: 42000,
    feePaid: 32000,
    feePending: 10000,
    attendancePercent: 91,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '5561-8823-9901',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-s06',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-006',
    rollNo: '11S-03',
    name: 'Sakshi Jadhav',
    firstName: 'Sakshi',
    lastName: 'Jadhav',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 11-A',
    standard: 'Class 11',
    division: 'Division A',
    admissionType: 'Existing',
    isExistingStudent: true,
    originalAdmissionYear: '2024-2025',
    grNumber: 'GR-2024-0312',
    prnNumber: 'PRN-2024-5512',
    previousClassOrSem: 'Class 10-A',
    previousYearPercentage: 94.0,
    legacyEnrollmentSource: 'OLD_GR_REGISTER',
    parentName: 'Vitthal Jadhav',
    fatherName: 'Vitthal Jadhav',
    motherName: 'Shaila Jadhav',
    parentPhone: '+91 98233 44112',
    feeTotal: 45000,
    feePaid: 45000,
    feePending: 0,
    attendancePercent: 97,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '6672-9901-2234',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-s07',
    branchId: 'branch-sch-01',
    admissionNo: 'SCH-2026-007',
    rollNo: '12S-15',
    name: 'Omkar Gaikwad',
    firstName: 'Omkar',
    lastName: 'Gaikwad',
    gender: 'MALE',
    gradeOrSemester: 'Class 12-A',
    standard: 'Class 12',
    division: 'Division A',
    parentName: 'Balasaheb Gaikwad',
    fatherName: 'Balasaheb Gaikwad',
    motherName: 'Lata Gaikwad',
    parentPhone: '+91 98234 33221',
    feeTotal: 48000,
    feePaid: 28000,
    feePending: 20000,
    attendancePercent: 89,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '7783-0012-3345',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-hm01',
    branchId: 'branch-hm-01',
    admissionNo: 'HM-2026-101',
    rollNo: 'BHM-301',
    name: 'Kabir Verma',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA Semester 3',
    admissionType: 'Existing',
    isExistingStudent: true,
    originalAdmissionYear: '2024-2025',
    grNumber: 'GR-2024-HM-0101',
    prnNumber: 'PRN-2024-UNI-8810',
    previousClassOrSem: 'B.Sc H&HA Semester 2',
    previousYearPercentage: 86.4,
    legacyEnrollmentSource: 'OLD_GR_REGISTER',
    parentName: 'Sanjay Verma',
    parentPhone: '+91 99220 12345',
    feeTotal: 75000,
    feePaid: 50000,
    feePending: 25000,
    attendancePercent: 92,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Food Production & Bakery',
    aadhaarNumber: '7821-3329-1142',
    aadhaarVerified: true,
    roleTag: 'INTERN',
  },
  {
    id: 'stu-hm02',
    branchId: 'branch-hm-01',
    admissionNo: 'HM-2026-102',
    rollNo: 'BHM-302',
    name: 'Pooja Nair',
    gender: 'FEMALE',
    gradeOrSemester: 'B.Sc H&HA Semester 3',
    admissionType: 'Existing',
    isExistingStudent: true,
    originalAdmissionYear: '2024-2025',
    grNumber: 'GR-2024-HM-0102',
    prnNumber: 'PRN-2024-UNI-8811',
    previousClassOrSem: 'B.Sc H&HA Semester 2',
    previousYearPercentage: 92.8,
    legacyEnrollmentSource: 'OLD_GR_REGISTER',
    parentName: 'Venkatesh Nair',
    parentPhone: '+91 99220 54321',
    feeTotal: 75000,
    feePaid: 75000,
    feePending: 0,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Food & Beverage Service / Mock Bar',
    aadhaarNumber: '8841-2290-7715',
    aadhaarVerified: true,
    roleTag: 'PREFECT',
  },
  {
    id: 'stu-hm03',
    branchId: 'branch-hm-01',
    admissionNo: 'HM-2026-103',
    rollNo: 'BHM-505',
    name: 'Manish Rawat',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA Semester 5',
    parentName: 'Devendra Rawat',
    parentPhone: '+91 99220 99887',
    feeTotal: 80000,
    feePaid: 40000,
    feePending: 40000,
    attendancePercent: 90,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Front Office & Hospitality Management',
    aadhaarNumber: '5512-4481-9903',
    aadhaarVerified: true,
    roleTag: 'INTERN',
  },
  {
    id: 'stu-hm04',
    branchId: 'branch-hm-01',
    admissionNo: 'HM-2026-104',
    rollNo: 'BHM-102',
    name: 'Neha Chawla',
    firstName: 'Neha',
    lastName: 'Chawla',
    gender: 'FEMALE',
    gradeOrSemester: 'B.Sc H&HA Semester 1',
    standard: 'B.Sc H&HA',
    parentName: 'Harish Chawla',
    fatherName: 'Harish Chawla',
    motherName: 'Simran Chawla',
    parentPhone: '+91 99221 88776',
    feeTotal: 75000,
    feePaid: 55000,
    feePending: 20000,
    attendancePercent: 94,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Culinary Arts & Basic Training Kitchen',
    aadhaarNumber: '8892-3341-5567',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-hm05',
    branchId: 'branch-hm-01',
    admissionNo: 'HM-2026-105',
    rollNo: 'DBC-201',
    name: 'Aditi Rao',
    firstName: 'Aditi',
    lastName: 'Rao',
    gender: 'FEMALE',
    gradeOrSemester: 'Diploma in Bakery & Confectionery Sem 2',
    standard: 'Diploma in Bakery',
    parentName: 'Kishore Rao',
    fatherName: 'Kishore Rao',
    motherName: 'Sudha Rao',
    parentPhone: '+91 99222 77665',
    feeTotal: 55000,
    feePaid: 55000,
    feePending: 0,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Bakery & Confectionery Lab',
    aadhaarNumber: '9903-4452-6678',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
  },
  {
    id: 'stu-hm06',
    branchId: 'branch-hm-01',
    admissionNo: 'HM-2026-106',
    rollNo: 'BHM-601',
    name: 'Sahil Shaikh',
    firstName: 'Sahil',
    lastName: 'Shaikh',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA Semester 6',
    standard: 'B.Sc H&HA',
    parentName: 'Imran Shaikh',
    fatherName: 'Imran Shaikh',
    motherName: 'Farida Shaikh',
    parentPhone: '+91 99223 66554',
    feeTotal: 85000,
    feePaid: 55000,
    feePending: 30000,
    attendancePercent: 93,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Accommodation Operations & Housekeeping',
    aadhaarNumber: '7714-5563-7789',
    aadhaarVerified: true,
    roleTag: 'INTERN',
  },
];

const initialReceipts: FeeReceipt[] = [
  {
    id: 'rcp-01',
    receiptNo: 'RCP-SCH-2026-081',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    studentNameMarathi: 'आरव शर्मा',
    branchName: 'Modern Public School And Junior College Bhose',
    standardOrGrade: 'Class 7-A',
    division: 'A',
    rollNo: '12',
    admissionNo: 'SCH-2026-001',
    grNumber: 'GR-2026-001',
    academicYear: '2026-2027',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98220 12345',
    category: 'General',
    amount: 12000,
    totalAnnualFee: 45000,
    previouslyPaid: 15000,
    remainingBalance: 18000,
    paymentMode: 'UPI',
    transactionReference: 'UPI/UTR-6291048201',
    date: '2026-10-21',
    installmentNo: 'Installment 2 (Term II)',
    feeBreakdown: generateFeeBreakdown(12000, 'SCHOOL'),
    amountInWords: numberToWordsINR(12000),
    amountInWordsMarathi: numberToMarathiWordsINR(12000),
    cashierName: 'Accounts Officer (Central Office)',
    status: 'PAID',
  },
  {
    id: 'rcp-02',
    receiptNo: 'RCP-HM-2026-142',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    studentNameMarathi: 'कबीर वर्मा',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    standardOrGrade: 'B.Sc H&HA Semester 2',
    division: 'A',
    rollNo: 'BHM-201',
    admissionNo: 'HM-2026-101',
    grNumber: 'GR-2026-HM-0101',
    academicYear: '2026-2027',
    parentName: 'Sanjay Verma',
    parentPhone: '+91 98221 44556',
    category: 'General',
    amount: 25000,
    totalAnnualFee: 75000,
    previouslyPaid: 25000,
    remainingBalance: 25000,
    paymentMode: 'NETBANKING',
    transactionReference: 'HDFC-NEFT-992144',
    date: '2026-10-18',
    installmentNo: 'Installment 2 (Semester II)',
    feeBreakdown: generateFeeBreakdown(25000, 'COLLEGE'),
    amountInWords: numberToWordsINR(25000),
    amountInWordsMarathi: numberToMarathiWordsINR(25000),
    cashierName: 'Accounts Officer (Central Office)',
    status: 'PAID',
  },
  {
    id: 'rcp-03',
    receiptNo: 'RCP-SCH-2026-095',
    studentId: 'stu-s02',
    studentName: 'Diya Patel',
    studentNameMarathi: 'दिया पटेल',
    branchName: 'Modern Public School And Junior College Bhose',
    standardOrGrade: 'Class 8-B',
    division: 'B',
    rollNo: '05',
    admissionNo: 'SCH-2026-002',
    grNumber: 'GR-2026-002',
    academicYear: '2026-2027',
    parentName: 'Bhavin Patel',
    parentPhone: '+91 98222 34567',
    category: 'OBC',
    amount: 18000,
    totalAnnualFee: 48000,
    previouslyPaid: 10000,
    remainingBalance: 20000,
    paymentMode: 'CHEQUE',
    transactionReference: 'CHQ-581902 (SBI)',
    date: '2026-10-22',
    installmentNo: 'Installment 2 (Term II)',
    feeBreakdown: generateFeeBreakdown(18000, 'SCHOOL'),
    amountInWords: numberToWordsINR(18000),
    amountInWordsMarathi: numberToMarathiWordsINR(18000),
    cashierName: 'Accounts Officer (Central Office)',
    status: 'PAID',
  },
];

const initialKitchenLabs: KitchenPracticalBatch[] = [
  {
    id: 'lab-01',
    labName: 'Basic Training Kitchen (BTK)',
    batchName: 'Batch A - Culinary Fundamentals',
    timing: '09:00 AM - 12:30 PM',
    instructor: 'Chef Sanjeev Menon (Executive Chef)',
    menuTopic: 'Classic French Stocks, Mother Sauces & Herb Roasting',
    studentCount: 22,
    status: 'IN_PROGRESS',
  },
  {
    id: 'lab-02',
    labName: 'Bakery & Confectionery Studio',
    batchName: 'Batch B - Pastry Arts',
    timing: '01:30 PM - 04:30 PM',
    instructor: 'Chef Maria Fernandes (Pastry Chef)',
    menuTopic: 'Croissant Lamination, Sourdough & Chocolate Ganache',
    studentCount: 20,
    status: 'SCHEDULED',
  },
  {
    id: 'lab-03',
    labName: 'Training Restaurant & Mock Cocktail Bar',
    batchName: 'Batch C - Banquet Service',
    timing: '10:00 AM - 01:00 PM',
    instructor: 'Prof. David Dsouza (F&B Director)',
    menuTopic: 'Silver Gueridon Service, Table Setting & Mocktail Mixology',
    studentCount: 24,
    status: 'SCHEDULED',
  },
];

const initialInternships: HotelInternship[] = [
  {
    id: 'it-01',
    studentName: 'Rohan Mehra',
    rollNo: 'BHM-410',
    hotelBrand: 'Taj Lands End, Bandra, Mumbai',
    city: 'Mumbai',
    department: 'Food Production (Gourmet Kitchen)',
    mentorName: 'Chef Vikramaditya (Sous Chef)',
    mentorRating: 9.4,
    status: 'ONGOING',
  },
  {
    id: 'it-02',
    studentName: 'Simran Kaur',
    rollNo: 'BHM-412',
    hotelBrand: 'JW Marriott Sahar, Mumbai',
    city: 'Mumbai',
    department: 'Food & Beverage Service',
    mentorName: 'Priya Mukherjee (F&B Manager)',
    mentorRating: 9.1,
    status: 'ONGOING',
  },
];

const initialChefKits: ChefKitInventory[] = [
  {
    id: 'kit-01',
    itemName: 'Professional Chef Coat & Checkered Trouser Set',
    totalStock: 250,
    issuedCount: 195,
    remainingStock: 55,
    kitType: 'CULINARY',
  },
  {
    id: 'kit-02',
    itemName: 'Stainless Steel 6-Piece Chef Knife Set with Roll Bag',
    totalStock: 220,
    issuedCount: 190,
    remainingStock: 30,
    kitType: 'CULINARY',
  },
  {
    id: 'kit-03',
    itemName: 'F&B Service Waistcoat, Bow Tie & Waiter Toolkit',
    totalStock: 200,
    issuedCount: 175,
    remainingStock: 25,
    kitType: 'FNB_SERVICE',
  },
];

const initialBusRoute: BusRoute = {
  id: 'route-04',
  routeName: 'Route #4: City Center -> Green Valley -> Campus',
  busNumber: 'MH-12-TR-4421',
  driverName: 'Suresh Patil',
  driverPhone: '+91 97654 32100',
  currentLat: 18.5204,
  currentLng: 73.8567,
  currentSpeed: 38.5,
  activeTrip: true,
  stops: [
    { name: 'City Center Metro Station', time: '07:15 AM', passed: true },
    { name: 'Shivaji Chowk Junction', time: '07:30 AM', passed: true },
    { name: 'Green Valley Gardens', time: '07:45 AM', passed: false },
    { name: 'Lotus Heights Society', time: '08:00 AM', passed: false },
    { name: 'Trust Main Campus', time: '08:20 AM', passed: false },
  ],
};

const initialEnquiries: AdmissionEnquiry[] = [
  {
    id: 'enq-01',
    applicantName: 'Tanya Sengupta',
    parentName: 'Debabrata Sengupta',
    phone: '+91 98112 33445',
    targetBranch: 'COLLEGE',
    targetClassOrCourse: 'B.Sc in Hospitality & Hotel Administration',
    status: 'NEW',
    createdAt: '2026-10-21',
  },
  {
    id: 'enq-02',
    applicantName: 'Kunal Deshpande',
    parentName: 'Mahesh Deshpande',
    phone: '+91 98112 99887',
    targetBranch: 'SCHOOL',
    targetClassOrCourse: 'Class 8 (CBSE)',
    status: 'CONTACTED',
    createdAt: '2026-10-19',
  },
];

// Helper to determine the active route view from pathname and hostname
const getRouteFromLocation = (): 'WEBSITE' | 'INQUIRY' | 'LOGIN' | 'REGISTER' | 'PORTAL' => {
  if (typeof window === 'undefined') return 'WEBSITE';
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hostname = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Explicit Admission Inquiry Public Routes (e.g. /admission-inquiry, /admissions, /inquiry, /apply)
  if (
    pathname === '/admission-inquiry' ||
    pathname === '/admissions' ||
    pathname === '/inquiry' ||
    pathname === '/inquiries' ||
    pathname === '/apply' ||
    pathname.startsWith('/admission-inquiry/') ||
    search.includes('page=inquiry') ||
    search.includes('view=admission-inquiry')
  ) {
    return 'INQUIRY';
  }

  // Explicit Register Routes (e.g. http://localhost:3000/register or /signup)
  if (pathname === '/register' || pathname === '/signup' || pathname.startsWith('/register/')) {
    return 'REGISTER';
  }

  // Explicit Login Routes (e.g. http://localhost:3000/login or /signin)
  if (pathname === '/login' || pathname === '/signin' || pathname.startsWith('/login/')) {
    return 'LOGIN';
  }

  // Explicit ERP / Dashboard / Portal Routes or direct Tab paths (e.g. /dashboard/students, /students)
  if (
    hostname.startsWith('erp.') ||
    pathname === '/erp' ||
    pathname.startsWith('/erp/') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/portal' ||
    pathname.startsWith('/portal/') ||
    search.includes('portal=erp') ||
    getTabFromPathname(pathname) !== null
  ) {
    return 'PORTAL';
  }

  // Default to Public Website Landing Page
  return 'WEBSITE';
};

const getDefaultTabForRole = (role?: string): DashboardTab => {
  switch (role) {
    case 'SUPERADMIN':
    case 'BRANCH_ADMIN_SCHOOL':
    case 'BRANCH_ADMIN_COLLEGE':
      return 'OVERVIEW';
    case 'TEACHER':
      return 'ACADEMIC';
    case 'ACCOUNTANT':
      return 'FEES';
    case 'STUDENT':
      return 'ACADEMIC';
    default:
      return 'OVERVIEW';
  }
};

export const App: React.FC = () => {
  // 1. Authentication State initialized from localStorage session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('trust_user');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Could not parse saved user session:', e);
      }
    }
    return null;
  });

  // 2. Route Navigation State (Supports /admission-inquiry, /login, /register, /dashboard/..., /erp, /)
  const [currentRoute, setCurrentRoute] = useState<'WEBSITE' | 'INQUIRY' | 'LOGIN' | 'REGISTER' | 'PORTAL'>(getRouteFromLocation);

  // 3. Sidebar Active Navigation Tab (persisted and initialized from URL pathname)
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    if (typeof window !== 'undefined') {
      const tabFromPath = getTabFromPathname(window.location.pathname);
      if (tabFromPath) return tabFromPath;
    }
    return 'OVERVIEW';
  });

  // 4. Feature Flags State for Production Module Visibility
  const [featureFlags, setFeatureFlags] = useState(() => FeatureFlagService.getFlags());

  useEffect(() => {
    const unsub = FeatureFlagService.subscribe((updatedFlags) => {
      setFeatureFlags({ ...updatedFlags });
    });
    return () => unsub();
  }, []);

  // Function to switch tabs with HTML5 history pushState / replaceState
  const handleSelectTab = (tab: DashboardTab, replace = false) => {
    setActiveTab(tab);
    const targetPath = TAB_ROUTE_MAP[tab] || `/dashboard/${tab.toLowerCase()}`;
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        if (replace) {
          window.history.replaceState({ tab }, '', targetPath);
        } else {
          window.history.pushState({ tab }, '', targetPath);
        }
      }
      setCurrentRoute('PORTAL');
    }
  };

  const navigateTo = (path: string, replace = false) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        if (replace) {
          window.history.replaceState(null, '', path);
        } else {
          window.history.pushState(null, '', path);
        }
      }
      const route = getRouteFromLocation();
      setCurrentRoute(route);

      if (route === 'PORTAL') {
        const detectedTab = getTabFromPathname(path);
        if (detectedTab) {
          setActiveTab(detectedTab);
        } else if (currentUser) {
          setActiveTab(getDefaultTabForRole(currentUser.role));
        }
      }
    }
  };

  // Listen to browser Back / Forward history events
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromLocation();
      setCurrentRoute(route);

      if (route === 'PORTAL') {
        const tabFromUrl = getTabFromPathname(window.location.pathname);
        if (tabFromUrl) {
          setActiveTab(tabFromUrl);
        } else if (currentUser) {
          setActiveTab(getDefaultTabForRole(currentUser.role));
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Normalize generic /erp or /dashboard URLs to canonical tab route in address bar
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser && currentRoute === 'PORTAL') {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (pathname === '/erp' || pathname === '/dashboard' || pathname === '/portal') {
        const canonical = TAB_ROUTE_MAP[activeTab] || '/dashboard/overview';
        window.history.replaceState({ tab: activeTab }, '', canonical);
      }
    }
  }, [currentUser, currentRoute, activeTab]);

  // 4. Header Filters: Academic Year & Branch
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(() => {
    if (currentUser?.role === 'BRANCH_ADMIN_SCHOOL') return 'SCHOOL';
    if (currentUser?.role === 'BRANCH_ADMIN_COLLEGE') return 'COLLEGE';
    if (currentUser?.branchId === 'branch-hm-01') return 'COLLEGE';
    if (currentUser?.branchId === 'branch-sch-01') return 'SCHOOL';
    return 'ALL';
  });

  // 5. Application Data State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [employees, setEmployees] = useState<Employee[]>(() => StaffService.getEmployees());

  const handleUpdateStudentPhoto = (studentId: string, photoUrl: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, profilePhotoUrl: photoUrl } : s))
    );
  };

  const handleUpdateEmployeePhoto = (employeeId: string, photoUrl: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, profilePhotoUrl: photoUrl } : e))
    );
  };
  const [receipts, setReceipts] = useState<FeeReceipt[]>(initialReceipts);
  const [kitchenLabs, setKitchenLabs] = useState<KitchenPracticalBatch[]>(initialKitchenLabs);
  const [internships, setInternships] = useState<HotelInternship[]>(initialInternships);
  const [chefKits, setChefKits] = useState<ChefKitInventory[]>(initialChefKits);
  const [busRoute, setBusRoute] = useState<BusRoute>(initialBusRoute);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(initialEnquiries);
  const [progressionHistory, setProgressionHistory] =
    useState<StudentProgressionRecord[]>(initialProgressionRecords);
  const [showAdmissionWizard, setShowAdmissionWizard] = useState(false);

  // 6. Theme Mode State (Clean Light Theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trust_theme');
      if (saved === 'dark') {
        localStorage.setItem('trust_theme', 'light');
      }
    }
    return false;
  });

  // 7. Fullscreen Mode State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return Boolean(document.fullscreenElement);
    }
    return false;
  });

  // 8. Navigation Sidebar Visibility State (starts open on desktop, drawer on mobile)
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Theme synchronization effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('trust_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('trust_theme', 'light');
    }
  }, [isDarkMode]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  };

  // Sync with backend API if available
  useEffect(() => {
    fetch(`${envConfig.apiBaseUrl}/api/students`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.students && data.students.length > 0) {
          setStudents(data.students);
        }
      })
      .catch(() => {
        // Fallback silently to rich local mock state
      });

    fetch(`${envConfig.apiBaseUrl}/api/students/progression-history`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.history && data.history.length > 0) {
          setProgressionHistory(data.history);
        }
      })
      .catch(() => {
        // Fallback silently
      });

    fetch(`${envConfig.apiBaseUrl}/api/enquiries`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.enquiries && Array.isArray(data.enquiries) && data.enquiries.length > 0) {
          setEnquiries(data.enquiries);
        }
      })
      .catch(() => {
        // Fallback silently
      });
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    try {
      localStorage.setItem('trust_user', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save user session to localStorage:', e);
    }

    // Dynamic Role-Based Access Control & Default Dashboard Landing:
    if (profile.role === 'SUPERADMIN') {
      setSelectedBranch('ALL');
    } else if (profile.role === 'BRANCH_ADMIN_SCHOOL') {
      setSelectedBranch('SCHOOL');
    } else if (profile.role === 'BRANCH_ADMIN_COLLEGE') {
      setSelectedBranch('COLLEGE');
    } else if (profile.role === 'TEACHER') {
      setSelectedBranch(profile.branchId === 'branch-hm-01' ? 'COLLEGE' : 'SCHOOL');
    } else if (profile.role === 'ACCOUNTANT') {
      setSelectedBranch(profile.branchId === 'branch-hm-01' ? 'COLLEGE' : 'SCHOOL');
    } else if (profile.role === 'STUDENT') {
      setSelectedBranch(profile.branchId === 'branch-hm-01' ? 'COLLEGE' : 'SCHOOL');
    } else {
      setSelectedBranch('ALL');
    }

    // Check if user directly entered a specific tab URL before login
    const requestedTab = getTabFromPathname(window.location.pathname);
    const destinationTab = requestedTab || getDefaultTabForRole(profile.role);
    handleSelectTab(destinationTab, false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('trust_user');
    } catch (e) {
      console.warn('Could not clear user session:', e);
    }
    setCurrentUser(null);
    navigateTo('/login');
  };

  const handleAddStudent = (newStudentData: any) => {
    const isSchool = newStudentData.branchId === 'branch-sch-01';
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      branchId: newStudentData.branchId,
      admissionNo:
        newStudentData.admissionNo ||
        `${isSchool ? 'SCH' : 'HM'}-2026-${String(students.length + 101).padStart(3, '0')}`,
      rollNo: newStudentData.rollNo || `${newStudentData.gradeOrSemester?.slice(0, 3) || 'STD'}-${students.length + 1}`,
      name: newStudentData.name,
      firstName: newStudentData.firstName,
      lastName: newStudentData.lastName,
      gender: newStudentData.gender || 'MALE',
      gradeOrSemester: newStudentData.gradeOrSemester,
      standard: newStudentData.standard,
      division: newStudentData.division,
      admissionType: newStudentData.admissionType || (newStudentData.isExistingStudent ? 'Existing' : 'Fresh'),
      admissionDate: newStudentData.admissionDate || (newStudentData.isExistingStudent ? `${newStudentData.originalAdmissionYear?.slice(0, 4) || '2023'}-06-15` : new Date().toISOString().slice(0, 10)),
      isExistingStudent: Boolean(newStudentData.isExistingStudent || newStudentData.admissionType === 'Existing'),
      originalAdmissionYear: newStudentData.originalAdmissionYear || (newStudentData.isExistingStudent ? '2023-2024' : '2026-2027'),
      previousClassOrSem: newStudentData.previousClassOrSem,
      previousYearPercentage: newStudentData.previousYearPercentage,
      openingFeeBalance: newStudentData.openingFeeBalance || 0,
      legacyEnrollmentSource: newStudentData.legacyEnrollmentSource || (newStudentData.isExistingStudent ? 'MANUAL_ENTRY' : undefined),
      parentName: newStudentData.parentName || 'Guardian',
      parentPhone: newStudentData.parentPhone || '+91 99999 00000',
      parentEmail: newStudentData.parentEmail,
      fatherName: newStudentData.fatherName,
      motherName: newStudentData.motherName,
      feeTotal: newStudentData.feeTotal || (isSchool ? 36000 : 75000),
      feePaid: newStudentData.feePaid || 0,
      feePending:
        newStudentData.feePending !== undefined
          ? newStudentData.feePending
          : (newStudentData.feeTotal || 36000) - (newStudentData.feePaid || 0),
      attendancePercent: 100,
      kycStatus: 'VERIFIED',
      aadhaarNumber: newStudentData.aadhaarNumber || '9988-7766-5544',
      aadhaarVerified: true,
      roleTag: newStudentData.roleTag || (isSchool ? 'STUDENT' : 'INTERN'),
      grNumber: newStudentData.grNumber,
      prnNumber: newStudentData.prnNumber,
      penNumber: newStudentData.penNumber,
      saralId: newStudentData.saralId,
      nationality: newStudentData.nationality || 'India',
      religion: newStudentData.religion,
      caste: newStudentData.caste,
      subCategory: newStudentData.subCategory,
      category: newStudentData.category,
      bloodGroup: newStudentData.bloodGroup,
      motherTongue: newStudentData.motherTongue,
      placeOfBirth: newStudentData.placeOfBirth,
      dob: newStudentData.dob,
      dobWords: newStudentData.dobWords,
      profilePhotoUrl: newStudentData.profilePhotoUrl,
      currentAddress: newStudentData.currentAddress,
      permanentAddress: newStudentData.permanentAddress,
      submittedDocuments: newStudentData.submittedDocuments,
      rackCode: newStudentData.rackCode,
      folderNumber: newStudentData.folderNumber,
      hotelSpecialization: newStudentData.hotelSpecialization,
    };
    setStudents([newStudent, ...students]);
  };

  const handleCollectFee = (studentId: string, amount: number, mode: any) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newPaid = s.feePaid + amount;
          return {
            ...s,
            feePaid: newPaid,
            feePending: Math.max(0, s.feeTotal - newPaid),
          };
        }
        return s;
      })
    );

    const targetStudent = students.find((s) => s.id === studentId);
    if (targetStudent) {
      const isSchool = targetStudent.branchId === 'branch-sch-01';
      const breakdown = generateFeeBreakdown(amount, isSchool ? 'SCHOOL' : 'COLLEGE');
      const previouslyPaid = targetStudent.feePaid;
      const remainingBalance = Math.max(0, targetStudent.feeTotal - (targetStudent.feePaid + amount));

      const newReceipt: FeeReceipt = {
        id: `rcp-${Date.now()}`,
        receiptNo: `RCP-${isSchool ? 'SCH' : 'HM'}-2026-${Math.floor(100 + Math.random() * 900)}`,
        studentId,
        studentName: targetStudent.name,
        studentNameMarathi: targetStudent.nameMarathi,
        branchName: isSchool
          ? 'Modern Public School And Junior College Bhose'
          : 'Modern College Of Hotel Management And Technology Solapur',
        standardOrGrade: targetStudent.gradeOrSemester,
        division: targetStudent.division || 'A',
        rollNo: targetStudent.rollNo,
        admissionNo: targetStudent.admissionNo,
        grNumber: targetStudent.grNumber,
        academicYear: '2026-2027',
        parentName: targetStudent.parentName || targetStudent.fatherName,
        parentPhone: targetStudent.parentPhone,
        category: targetStudent.category || 'General',
        amount,
        totalAnnualFee: targetStudent.feeTotal,
        previouslyPaid,
        remainingBalance,
        paymentMode: mode || 'UPI',
        transactionReference:
          mode === 'UPI'
            ? `UPI/UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`
            : mode === 'CHEQUE'
            ? `CHQ-${Math.floor(100000 + Math.random() * 900000)}`
            : `CASH-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        installmentNo: `Installment ${targetStudent.feePaid > 0 ? 2 : 1} (2026-2027)`,
        feeBreakdown: breakdown,
        amountInWords: numberToWordsINR(amount),
        amountInWordsMarathi: numberToMarathiWordsINR(amount),
        cashierName: 'Accounts Officer (Central Office)',
        status: 'PAID',
      };
      setReceipts((prev) => [newReceipt, ...prev]);
    }
  };

  const handleSimulateBusStep = () => {
    setBusRoute((prev) => ({
      ...prev,
      currentSpeed: Math.floor(32 + Math.random() * 15),
      currentLat: prev.currentLat + 0.0015,
      currentLng: prev.currentLng + 0.0012,
      stops: prev.stops.map((stop, idx) => (idx === 2 ? { ...stop, passed: true } : stop)),
    }));
  };

  const handleAddEnquiry = async (enquiry: AdmissionEnquiry) => {
    // 1. Optimistic update
    setEnquiries((prev) => [enquiry, ...prev]);

    // 2. Persist to API backend
    try {
      const res = await fetch(`${envConfig.apiBaseUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.enquiry) {
          setEnquiries((prev) =>
            prev.map((e) => (e.id === enquiry.id ? { ...e, ...data.enquiry } : e))
          );
        }
      }
    } catch (err) {
      console.warn('Could not post enquiry to API:', err);
    }
  };

  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
  };

  const handleAddProgressionRecords = (newRecords: StudentProgressionRecord[]) => {
    setProgressionHistory((prev) => [...newRecords, ...prev]);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleEditEnquiry = async (updatedEnquiry: AdmissionEnquiry) => {
    setEnquiries((prev) => prev.map((e) => (e.id === updatedEnquiry.id ? updatedEnquiry : e)));
    try {
      await fetch(`${envConfig.apiBaseUrl}/api/enquiries/${updatedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEnquiry),
      });
    } catch (err) {
      console.warn('Could not update enquiry in API:', err);
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
    try {
      await fetch(`${envConfig.apiBaseUrl}/api/enquiries/${enquiryId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete enquiry from API:', err);
    }
  };

  const handleEditReceipt = (updatedReceipt: FeeReceipt) => {
    setReceipts((prev) => prev.map((r) => (r.id === updatedReceipt.id ? updatedReceipt : r)));
  };

  const handleDeleteReceipt = (receiptId: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== receiptId));
  };

  // Title for active dashboard tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return 'Executive Overview & Multi-Branch Analytics';
      case 'STUDENTS':
        return selectedBranch === 'COLLEGE' ? 'Hotel Management Students Roster' : 'School Student Directory & CAP';
      case 'PROGRESSION':
        return 'Annual Student Academic Progression & Fee Carry Forward';
      case 'ACCOUNTING':
        return 'Trust Central Accounting & Concession Audit';
      case 'FEES':
        return 'Financial Fee Ledgers & Collections';
      case 'HR_PAYROLL':
        return 'HR, Leaves & Monthly Payroll Batch';
      case 'EXAMS_OMR':
        return 'Exams Management & OMR Computer Vision Studio';
      case 'CERTIFICATES':
        return 'Official Document Vault, Bonafide & LC Archive';
      case 'BIOMETRICS':
        return 'Biometrics Hardware Sync & Shift Attendance';
      case 'TIMETABLE':
        return 'Master Timetable & AI Conflict Engine';
      case 'ACADEMIC':
        return selectedBranch === 'COLLEGE' ? 'Commercial Kitchen Labs & Practical Batches' : 'Academics & Subject Rosters';
      case 'MASTERS':
        return 'Institutional Academic & Global Masters Center';
      case 'FEATURE_FLAGS':
        return 'Production Feature Flags & Module Visibility Control';
      case 'AUXILIARY':
        return 'Campus Auxiliary Operations, Hostel & Library';
      case 'COMMUNICATION':
        return 'WhatsApp Automation & Digital Notice Board';
      case 'BUS':
        return 'Live GPS School Bus Fleet Tracking';
      case 'TRIPS':
        return 'Educational Trips, Study Tours & Live Parent Alerts';
      case 'ENQUIRIES':
        return 'Public Website Admission Inquiries';
      case 'REPORTS':
        return 'Centralized Reports & Auditing Center';
      default:
        return 'ERP Enterprise Suite';
    }
  };

  return (
    <div
      className={`h-screen flex flex-col font-sans overflow-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 ${
        isDarkMode ? 'dark' : ''
      }`}
    >
      {/* 1. ROUTE A: Dedicated Public Admission Inquiry Page (e.g. /admission-inquiry, /admissions) */}
      {currentRoute === 'INQUIRY' ? (
        <div className="flex-1 flex flex-col overflow-y-auto animate-fade-in">
          <AdmissionInquiryPage
            onGoToHome={() => navigateTo('/')}
            onGoToPortal={() => navigateTo(currentUser ? '/erp' : '/login')}
            onSubmitEnquiry={async (newEnquiry) => {
              await handleAddEnquiry(newEnquiry);
              return true;
            }}
          />
        </div>
      ) : currentRoute === 'WEBSITE' ? (
        /* 2. ROUTE B: Public Landing Page (http://localhost:3000/ or https://abceducationtrust.org) */
        <div id="website-scroll-container" className="flex-1 flex flex-col overflow-y-auto animate-fade-in">
          <Navbar
            onGoToPortal={() => navigateTo('/login')}
            isLoggedIn={Boolean(currentUser)}
            onGoToDashboard={() => navigateTo('/erp')}
            onGoToWebsite={() => navigateTo('/')}
            onGoToInquiry={() => navigateTo('/admission-inquiry')}
          />
          <PublicWebsite
            onGoToPortal={(branch) => {
              if (currentUser) {
                if (currentUser.role === 'SUPERADMIN') {
                  setSelectedBranch(branch as any);
                }
                navigateTo('/erp');
              } else {
                navigateTo('/login');
              }
            }}
            enquiries={enquiries}
            onAddEnquiry={handleAddEnquiry}
            onGoToInquiry={() => navigateTo('/admission-inquiry')}
          />
        </div>
      ) : currentRoute === 'REGISTER' ? (
        /* 3. ROUTE C: Dedicated Clean Create Account Screen (http://localhost:3000/register) */
        <div className="flex-1 flex flex-col overflow-y-auto animate-fade-in">
          <LoginPage
            mode="CREATE_ACCOUNT"
            onSwitchMode={(m) => navigateTo(m === 'CREATE_ACCOUNT' ? '/register' : '/login')}
            onLoginSuccess={handleLoginSuccess}
            onGoToWebsite={() => navigateTo('/')}
            currentUser={currentUser}
            onGoToDashboard={() => navigateTo('/erp')}
          />
        </div>
      ) : currentRoute === 'LOGIN' || !currentUser ? (
        /* 4. ROUTE D: Dedicated Clean Login Screen (http://localhost:3000/login) */
        <div className="flex-1 flex flex-col overflow-y-auto animate-fade-in">
          <LoginPage
            mode="SIGN_IN"
            onSwitchMode={(m) => navigateTo(m === 'CREATE_ACCOUNT' ? '/register' : '/login')}
            onLoginSuccess={handleLoginSuccess}
            onGoToWebsite={() => navigateTo('/')}
            currentUser={currentUser}
            onGoToDashboard={() => navigateTo('/erp')}
          />
        </div>
      ) : (
        /* 5. ROUTE E: Authenticated ERP Portal (http://localhost:3000/erp or https://erp.abceducationtrust.org) */
        <div className="flex-1 flex flex-row min-h-0 overflow-hidden relative">
          {/* Desktop Left Navigation Sidebar (Toggleable & Collapsible) */}
          <div className={`${isSidebarVisible ? 'hidden lg:flex' : 'hidden'} shrink-0 h-full`}>
            <Sidebar
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              currentUser={currentUser}
              onLogout={handleLogout}
              onGoToWebsite={() => navigateTo('/')}
              newEnquiriesCount={enquiries.filter((e) => e.status === 'NEW').length}
            />
          </div>

          {/* Mobile Off-Canvas Sidebar Drawer with Backdrop Overlay */}
          {isSidebarVisible && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Semi-transparent Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={() => setIsSidebarVisible(false)}
              />
              {/* Slide-out Sidebar Drawer */}
              <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-slide-right flex flex-col bg-white dark:bg-slate-900">
                <Sidebar
                  activeTab={activeTab}
                  onSelectTab={(tab) => {
                    handleSelectTab(tab);
                    setIsSidebarVisible(false);
                  }}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onGoToWebsite={() => {
                    setIsSidebarVisible(false);
                    navigateTo('/');
                  }}
                  onCloseMobile={() => setIsSidebarVisible(false)}
                  newEnquiriesCount={enquiries.filter((e) => e.status === 'NEW').length}
                />
              </div>
            </div>
          )}

              {/* Right Column: Permanent Top Header + Scrollable Workspace Below */}
              <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
                {/* 1. Header is Permanently Fixed at the Top (Never scrolls off or gets clipped at any scale) */}
                <DashboardHeader
                  currentUser={currentUser}
                  academicYear={academicYear}
                  onChangeAcademicYear={setAcademicYear}
                  selectedBranch={selectedBranch}
                  onChangeBranch={setSelectedBranch}
                  activeTabTitle={getTabTitle()}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={handleToggleFullscreen}
                  isSidebarVisible={isSidebarVisible}
                  onToggleSidebar={() => setIsSidebarVisible((prev) => !prev)}
                  onLogout={handleLogout}
                />

                {/* 2. Scrollable Workspace Body: ONLY content scrolls vertically & horizontally */}
                <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-auto erp-workspace-scroll flex flex-col justify-between">
                  <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
                  {/* STAGING BANNER (Visible to Superadmin if viewing a hidden module) */}
                  {activeTab !== 'OVERVIEW' &&
                    activeTab !== 'FEATURE_FLAGS' &&
                    featureFlags[activeTab] === false &&
                    currentUser.role === 'SUPERADMIN' && (
                      <div className="mb-6 bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-fade-in shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px]">
                            STAGING PREVIEW
                          </span>
                          <span>
                            This module is currently <strong>HIDDEN from regular users</strong> in production. You are viewing it in Superadmin preview mode.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              FeatureFlagService.setModuleEnabled(activeTab, true);
                              setFeatureFlags(FeatureFlagService.getFlags());
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
                          >
                            Make Visible in Production
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectTab('FEATURE_FLAGS')}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs shrink-0 cursor-pointer"
                          >
                            Open Flags
                          </button>
                        </div>
                      </div>
                    )}

                  {/* STAGED ROLLOUT SCREEN FOR NON-SUPERADMIN USERS */}
                  {activeTab !== 'OVERVIEW' &&
                  activeTab !== 'FEATURE_FLAGS' &&
                  featureFlags[activeTab] === false &&
                  currentUser.role !== 'SUPERADMIN' ? (
                    <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-4 animate-scale-in shadow-xs">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center font-bold">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        Feature Staged for Upcoming Release
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        This module has been temporarily staged and is not active in this production session. Please contact your institutional administrator to enable this feature for your campus.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSelectTab('OVERVIEW')}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* OVERVIEW TAB */}
                  {activeTab === 'OVERVIEW' && (
                    <SuperadminDashboard
                      students={students}
                      receipts={receipts}
                      enquiries={enquiries}
                      onSwitchBranch={(b) => setSelectedBranch(b)}
                      academicYear={academicYear}
                      selectedBranch={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onOpenProgression={() => handleSelectTab('PROGRESSION')}
                      onNavigateTab={handleSelectTab}
                      userRole={currentUser.role}
                    />
                  )}

                  {/* STUDENTS TAB */}
                  {activeTab === 'STUDENTS' && (
                    <StudentDirectoryModule
                      students={students}
                      onAddStudent={handleAddStudent}
                      onEditStudent={handleEditStudent}
                      onDeleteStudent={handleDeleteStudent}
                      onCollectFee={handleCollectFee}
                      onOpenProgression={() => handleSelectTab('PROGRESSION')}
                      onOpenAdmissionWizard={() => setShowAdmissionWizard(true)}
                      academicYear={academicYear}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onChangeBranchScope={setSelectedBranch}
                    />
                  )}

                  {/* PROGRESSION TAB (STUDENT CARRY FORWARD & PROMOTION) */}
                  {activeTab === 'PROGRESSION' && (
                    <StudentProgressionManager
                      students={students}
                      onUpdateStudents={handleUpdateStudents}
                      progressionHistory={progressionHistory}
                      onAddProgressionRecords={handleAddProgressionRecords}
                      currentAcademicYear={academicYear}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onChangeBranchScope={setSelectedBranch}
                    />
                  )}

                  {/* FEES TAB */}
                  {activeTab === 'FEES' && (
                    <FeeLedgerModule
                      students={students}
                      receipts={receipts}
                      onCollectFee={handleCollectFee}
                      onEditReceipt={handleEditReceipt}
                      onDeleteReceipt={handleDeleteReceipt}
                      academicYear={academicYear}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onChangeBranchScope={setSelectedBranch}
                    />
                  )}

                  {/* ACADEMIC TAB */}
                  {activeTab === 'ACADEMIC' && (
                    <AcademicsModule
                      students={students}
                      kitchenLabs={kitchenLabs}
                      internships={internships}
                      chefKits={chefKits}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onChangeBranchScope={setSelectedBranch}
                      academicYear={academicYear}
                    />
                  )}

                  {/* ACADEMIC & GLOBAL MASTERS TAB */}
                  {activeTab === 'MASTERS' && <AcademicMastersModule />}

                  {/* BUS TAB */}
                  {activeTab === 'BUS' && (
                    <BusFleetModule
                      busRoute={busRoute}
                      onSimulateBusStep={handleSimulateBusStep}
                    />
                  )}

                  {/* ENQUIRIES TAB */}
                  {activeTab === 'ENQUIRIES' && (
                    <EnquiriesModule
                      enquiries={enquiries}
                      onAddEnquiry={handleAddEnquiry}
                      onEditEnquiry={handleEditEnquiry}
                      onDeleteEnquiry={handleDeleteEnquiry}
                      onConvertToAdmission={(enq) => {
                        setShowAdmissionWizard(true);
                      }}
                    />
                  )}

                  {/* TRUST ACCOUNTING TAB */}
                  {activeTab === 'ACCOUNTING' && (
                    <TrustAccountingModule
                      students={students}
                      receipts={receipts}
                      onCollectFee={handleCollectFee}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                    />
                  )}

                  {/* CERTIFICATES & VAULT RACK INDEX TAB */}
                  {activeTab === 'CERTIFICATES' && <CertificatesModule />}

                  {/* ID CARDS STUDIO & BATCH PRINTING TAB */}
                  {activeTab === 'ID_CARDS' && (
                    <IdCardsModule
                      students={students}
                      employees={employees}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onUpdateStudentPhoto={handleUpdateStudentPhoto}
                      onUpdateEmployeePhoto={handleUpdateEmployeePhoto}
                    />
                  )}

                  {/* EXAMS & OMR COMPUTER VISION TAB */}
                  {activeTab === 'EXAMS_OMR' && <ExamOmrStudioModule />}

                  {/* BIOMETRICS & SHIFT ATTENDANCE TAB */}
                  {activeTab === 'BIOMETRICS' && <BiometricsAttendanceModule />}

                  {/* HR, LEAVES & PAYROLL BATCH TAB */}
                  {activeTab === 'HR_PAYROLL' && <HRPayrollModule />}

                  {/* TIMETABLE & CONFLICT ENGINE TAB */}
                  {activeTab === 'TIMETABLE' && <TimetableModule />}

                  {/* CAMPUS AUXILIARY TAB */}
                  {activeTab === 'AUXILIARY' && <CampusAuxiliaryModule />}

                  {/* WHATSAPP, PARENTS MEETINGS & NOTICE BOARD TAB */}
                  {activeTab === 'COMMUNICATION' && (
                    <CommunicationModule
                      initialTab={
                        window.location.pathname.includes('parent-meetings') ||
                        window.location.pathname.includes('ptm') ||
                        window.location.search.includes('tab=ptm')
                          ? 'PARENT_MEETINGS'
                          : 'EVENTS'
                      }
                    />
                  )}

                  {/* EDUCATIONAL TRIPS, STUDY TOURS & PARENT ALERTS TAB */}
                  {activeTab === 'TRIPS' && (
                    <TripsAndToursModule
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                      onChangeBranchScope={setSelectedBranch}
                      academicYear={academicYear}
                    />
                  )}

                  {/* PRODUCTION FEATURE FLAGS / DEPLOY VISIBILITY TAB */}
                  {activeTab === 'FEATURE_FLAGS' && <FeatureFlagsModule />}

                  {/* CENTRALIZED REPORTS & AUDITING TAB */}
                  {activeTab === 'REPORTS' && (
                    <ReportsCenterModule
                      students={students}
                      receipts={receipts}
                      enquiries={enquiries}
                      busRoute={busRoute}
                      academicYear={academicYear}
                      selectedBranchScope={
                        currentUser.role === 'BRANCH_ADMIN_SCHOOL'
                          ? 'SCHOOL'
                          : currentUser.role === 'BRANCH_ADMIN_COLLEGE'
                          ? 'COLLEGE'
                          : selectedBranch
                      }
                    />
                  )}
                </>
              )}
            </main>

            {/* Dashboard Bottom Footer with Developer Attribution */}
            <footer className="py-3 px-6 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/70 dark:bg-slate-900/70 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2 text-[11px]">
                <div className="text-slate-400">
                  &copy; {new Date().getFullYear()} Zep Foundation Bhose &bull; Institutional ERP Management System
                </div>
                <div>
                  Developed by <strong className="text-orange-600 dark:text-orange-400 font-bold">Vishnu Software Solutions</strong>
                </div>
              </div>
            </footer>
          </div>
        </div>

              {/* Centralized Admission Wizard Modal */}
              <AdmissionsWizardModal
                isOpen={showAdmissionWizard}
                onClose={() => setShowAdmissionWizard(false)}
                onStudentAdmitted={handleAddStudent}
              />
            </div>
          )}
    </div>
  );
};
