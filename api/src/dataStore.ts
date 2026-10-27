// In-memory data store with realistic seed data for the Trust Education ERP demo

export interface TrustOverview {
  id: string;
  name: string;
  registrationNo: string;
  totalStudents: number;
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
  activeBranches: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  type: 'SCHOOL' | 'COLLEGE';
  studentCount: number;
  annualTarget: number;
}

export interface Student {
  id: string;
  branchId: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  gradeOrSemester: string;
  parentName: string;
  parentPhone: string;
  feeTotal: number;
  feePaid: number;
  feePending: number;
  attendancePercent: number;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  hotelSpecialization?: string; // For College students
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  roleTag?: 'STUDENT' | 'PREFECT' | 'INTERN' | 'STAFF' | 'ADMIN';
  // Marathi / Devanagari Script (मराठी नोंद - Required for statutory LC, Bonafide, GR):
  nameMarathi?: string;
  fatherNameMarathi?: string;
  motherNameMarathi?: string;
  casteMarathi?: string;
  placeOfBirthMarathi?: string;
  // Statutory & Historical General Register (GR) Fields for Long-Term Archive (10+ Years)
  grNumber?: string;
  motherName?: string;
  fatherName?: string;
  nationality?: string;
  religion?: string;
  caste?: string;
  placeOfBirth?: string;
  dob?: string;
  dobWords?: string;
  lastSchoolAttended?: string;
  admissionDate?: string;
  admissionGrade?: string;
  leavingDate?: string;
  leavingGrade?: string;
  passingYear?: string;
  academicYear?: string;
  progress?: string;
  conduct?: string;
  reasonForLeaving?: string;
  remarks?: string;
  // Transfer / Previous School Details (Kaksha Plus 23 Standard):
  admissionType?: 'Fresh' | 'Transfer' | 'Existing' | 'Lateral' | 'Re-admission' | string;
  isExistingStudent?: boolean;
  originalAdmissionYear?: string;
  previousSchool?: string;
  standardDivLeft?: string;
  schoolLeavingDate?: string;
  lcReceivedDate?: string;
  migrationUniversity?: string;
  voluntarySubjectSpecial?: string;
  previousProgress?: string;
  previousConduct?: string;
  previousLcNumber?: string;
  status?: 'ACTIVE' | 'ALUMNI_PASSED' | 'ALUMNI_WITHDRAWN';
  branchName?: string;
  penNumber?: string;
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  branchName: string;
  amount: number;
  paymentMode: 'UPI' | 'CASH' | 'CHEQUE' | 'NETBANKING';
  date: string;
  installmentNo: number;
  status: 'PAID';
}

export interface KitchenPracticalBatch {
  id: string;
  labName: string; // "Basic Training Kitchen (BTK)", "Quantity Food Kitchen", "Bakery Lab"
  batchName: string;
  timing: string;
  instructor: string;
  menuTopic: string;
  studentCount: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface HotelInternship {
  id: string;
  studentName: string;
  rollNo: string;
  hotelBrand: string; // "Taj Lands End, Mumbai", "JW Marriott, Pune"
  city: string;
  department: string; // "Food Production", "F&B Service", "Front Office"
  mentorName: string;
  mentorRating: number; // e.g., 9.2 / 10
  status: 'ONGOING' | 'COMPLETED';
}

export interface ChefKitInventory {
  id: string;
  itemName: string;
  totalStock: number;
  issuedCount: number;
  remainingStock: number;
  kitType: 'CULINARY' | 'BAKERY' | 'FNB_SERVICE';
}

export interface BusStop {
  name: string;
  time: string;
  passed: boolean;
}

export interface BusRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  currentLat: number;
  currentLng: number;
  currentSpeed: number;
  activeTrip: boolean;
  stops: BusStop[];
}

export interface AdmissionEnquiry {
  id: string;
  applicantName: string;
  parentName: string;
  phone: string;
  targetBranch: 'SCHOOL' | 'COLLEGE';
  targetClassOrCourse: string;
  status: 'NEW' | 'CONTACTED' | 'ADMITTED';
  createdAt: string;
  parentRelation?: string;
  altPhone?: string;
  email?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dob?: string;
  previousSchool?: string;
  city?: string;
  address?: string;
  needTransportOrHostel?: boolean;
  preferredContactTime?: string;
  notes?: string;
  counselorNotes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  branchId: string;
  classOrBatch: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks?: string;
}

export interface Homework {
  id: string;
  branchId: string;
  classOrBatch: string;
  subjectOrLab: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  teacherName: string;
  attachments?: string[];
}

export interface StudyNote {
  id: string;
  branchId: string;
  title: string;
  subjectOrLab: string;
  description: string;
  fileUrl: string;
  uploadedDate: string;
  teacherName: string;
  tags?: string[];
}

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  rollNo?: string;
  branchId: string;
  classOrGrade?: string;
  examOrPracticalName: string;
  subject?: string;
  maxMarks: number;
  marksObtained: number;
  percentage?: number;
  grade: string;
  status?: 'PASS' | 'FAIL';
  remarks?: string;
  date: string;
}

export interface PhotoAlbum {
  id: string;
  branchId: string;
  title: string;
  eventDate: string;
  description: string;
  coverPhotoUrl: string;
  photos: { id: string; url: string; caption: string }[];
}

export interface InternshipLog {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  date: string;
  hotelBrand: string;
  department: string;
  shiftHours: number;
  tasksCompleted: string;
  chefMentor: string;
  mentorFeedback?: string;
  verified: boolean;
}

export interface StudentProgressionRecord {
  id: string;
  studentId: string;
  studentName: string;
  fromYear: string;
  toYear: string;
  fromGrade: string;
  toGrade: string;
  pendingFeeCarriedForward: number;
  promotedDate: string;
  status: 'PROMOTED' | 'GRADUATED';
}

/**
 * Calculates next academic standard or semester
 * E.g., "Class 1-A" -> "Class 2-A"
 * E.g., "Class 7-A" -> "Class 8-A"
 * E.g., "Class 12-A" -> "School Alumnus (Class 12 Passed)"
 * E.g., "B.Sc H&HA Semester 3" -> "B.Sc H&HA Semester 4"
 */
export function calculateNextGrade(currentGrade: string): { nextGrade: string; status: 'PROMOTED' | 'GRADUATED' } {
  // Pattern 1: School Classes: "Class 1", "Class 7-A", "Class 10-B"
  const classMatch = currentGrade.match(/Class\s*(\d+)(.*)/i);
  if (classMatch) {
    const classNum = parseInt(classMatch[1], 10);
    const suffix = classMatch[2] || '';
    if (classNum >= 12) {
      return { nextGrade: 'School Alumnus (Class 12 Graduated)', status: 'GRADUATED' };
    }
    return { nextGrade: `Class ${classNum + 1}${suffix}`, status: 'PROMOTED' };
  }

  // Pattern 2: College Hotel Management Semesters: "Semester 1", "B.Sc H&HA Semester 3"
  const semMatch = currentGrade.match(/(.*Semester\s*)(\d+)(.*)/i);
  if (semMatch) {
    const semNum = parseInt(semMatch[2], 10);
    const prefix = semMatch[1];
    const suffix = semMatch[3] || '';
    if (semNum >= 6) {
      return { nextGrade: 'Degree Conferred (Hotel Mgmt Alumnus)', status: 'GRADUATED' };
    }
    return { nextGrade: `${prefix}${semNum + 1}${suffix}`, status: 'PROMOTED' };
  }

  return { nextGrade: `${currentGrade} (Promoted)`, status: 'PROMOTED' };
}

// Initial Data Seed
const getInitialTrustData = (): TrustOverview => ({
  id: 'trust-001',
  name: 'Zep Foundation Bhose',
  registrationNo: 'MH/EDU/TR-18452/SOLAPUR',
  totalStudents: 300,
  totalRevenue: 5400000,
  totalCollected: 4120000,
  totalPending: 1280000,
  activeBranches: 2,
});

const getInitialBranches = (): Branch[] => [
  {
    id: 'branch-sch-01',
    name: 'Modern Public School And Junior College Bhose',
    code: 'SCH-01',
    type: 'SCHOOL',
    studentCount: 100,
    annualTarget: 100,
  },
  {
    id: 'branch-hm-01',
    name: 'Modern College Of Hotel Management And Technology Solapur',
    code: 'HM-01',
    type: 'COLLEGE',
    studentCount: 200,
    annualTarget: 200,
  },
];

const getInitialStudents = (): Student[] => [
  // ==========================================
  // CURRENT ENROLLED STUDENTS (2026-2027)
  // ==========================================
  {
    id: 'stu-aafan-01',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2026-000285',
    admissionNo: 'ADM-2026-000285',
    rollNo: '01',
    name: 'AAFAN ALI A',
    nameMarathi: 'आफान अली ए',
    gender: 'MALE',
    gradeOrSemester: 'STD 8 - Division A',
    motherName: 'TARANUM',
    motherNameMarathi: 'तरन्नुम',
    parentName: 'Ali A & Taranum',
    fatherName: 'Ali A',
    fatherNameMarathi: 'अली ए',
    parentPhone: '+91 98230 11999',
    nationality: 'Indian',
    religion: 'Muslim',
    caste: 'Muslim / General',
    casteMarathi: 'मुस्लिम (सर्वसाधारण)',
    placeOfBirth: 'Hinjawadi',
    placeOfBirthMarathi: 'हिंजवडी',
    dob: '2013-07-30',
    dobWords: 'Thirty July Two Thousand Thirteen',
    lastSchoolAttended: 'Zilla Parishad Primary School, Hinjawadi',
    admissionType: 'Transfer',
    previousSchool: 'Zilla Parishad Primary School, Hinjawadi',
    standardDivLeft: 'Std 7 A',
    schoolLeavingDate: '2026-05-20',
    lcReceivedDate: '2026-06-05',
    reasonForLeaving: 'Parent Job Transfer to Solapur Campus',
    migrationUniversity: 'Maharashtra State Board of Secondary & Higher Secondary Education',
    voluntarySubjectSpecial: 'General Science & Mathematics',
    previousProgress: 'Outstanding',
    previousConduct: 'Exemplary',
    previousLcNumber: 'LC-HINJ-2026-0182',
    admissionDate: '2026-06-10',
    admissionGrade: 'STD 8',
    academicYear: '2026-2027',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    feeTotal: 38000,
    feePaid: 26000,
    feePending: 12000,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '9823-4412-8801',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
    penNumber: 'PEN-MH-2026-99120',
  },
  {
    id: 'stu-s00',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2026-0001',
    admissionNo: 'SCH-2026-000',
    rollNo: '1A-01',
    name: 'Vihaan Gupta',
    gender: 'MALE',
    gradeOrSemester: 'Class 1-A',
    motherName: 'Sunita Gupta',
    parentName: 'Amit Gupta',
    fatherName: 'Amit Gupta',
    parentPhone: '+91 98230 11999',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Vaishya (General)',
    placeOfBirth: 'Pune, Maharashtra',
    dob: '2020-03-15',
    dobWords: 'Fifteenth March Two Thousand Twenty',
    admissionType: 'Fresh',
    lastSchoolAttended: 'Little Angels Play School, Pune',
    admissionDate: '2026-06-10',
    admissionGrade: 'Class 1-A',
    academicYear: '2026-2027',
    progress: 'Good',
    conduct: 'Good',
    feeTotal: 32000,
    feePaid: 20000,
    feePending: 12000,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '9823-4412-8801',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s01',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2020-0142',
    admissionNo: 'SCH-2026-001',
    rollNo: '7A-01',
    name: 'Aarav Sharma',
    nameMarathi: 'आरव शर्मा',
    gender: 'MALE',
    gradeOrSemester: 'Class 7-A',
    motherName: 'Anjali Sharma',
    motherNameMarathi: 'अंजली शर्मा',
    parentName: 'Ramesh Sharma',
    fatherName: 'Ramesh Sharma',
    fatherNameMarathi: 'रमेश शर्मा',
    parentPhone: '+91 98230 11223',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Brahmin (General)',
    casteMarathi: 'ब्राह्मण (सर्वसाधारण)',
    placeOfBirth: 'Pune, Maharashtra',
    placeOfBirthMarathi: 'पुणे, महाराष्ट्र',
    dob: '2014-07-22',
    dobWords: 'Twenty-Second July Two Thousand Fourteen',
    lastSchoolAttended: 'Zilla Parishad Primary School, Haveli',
    admissionDate: '2020-06-15',
    admissionGrade: 'Class 1-A',
    academicYear: '2026-2027',
    progress: 'Very Good',
    conduct: 'Exemplary',
    feeTotal: 36000,
    feePaid: 24000,
    feePending: 12000,
    attendancePercent: 94,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '4512-7721-3392',
    aadhaarVerified: true,
    roleTag: 'PREFECT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s02',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2020-0158',
    admissionNo: 'SCH-2026-002',
    rollNo: '7A-02',
    name: 'Ananya Patel',
    nameMarathi: 'अनन्या पटेल',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 7-A',
    motherName: 'Neeta Patel',
    motherNameMarathi: 'नीता पटेल',
    parentName: 'Bhavesh Patel',
    fatherName: 'Bhavesh Patel',
    fatherNameMarathi: 'भावेश पटेल',
    parentPhone: '+91 98230 44556',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Patidar / Gujjar (OBC)',
    casteMarathi: 'पाटीदार (इ.मा.व.)',
    placeOfBirth: 'Solapur, Maharashtra',
    placeOfBirthMarathi: 'सोलापूर, महाराष्ट्र',
    dob: '2014-09-18',
    dobWords: 'Eighteenth September Two Thousand Fourteen',
    lastSchoolAttended: 'St. Xavier English Academy, Surat',
    admissionDate: '2020-06-18',
    admissionGrade: 'Class 1-B',
    academicYear: '2026-2027',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    feeTotal: 36000,
    feePaid: 36000,
    feePending: 0,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '6721-8844-9912',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s03',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2019-0112',
    admissionNo: 'SCH-2026-003',
    rollNo: '8B-15',
    name: 'Rohan Deshmukh',
    gender: 'MALE',
    gradeOrSemester: 'Class 8-B',
    motherName: 'Kavita Deshmukh',
    parentName: 'Sunil Deshmukh',
    fatherName: 'Sunil Deshmukh',
    parentPhone: '+91 98230 77889',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    placeOfBirth: 'Satara, Maharashtra',
    dob: '2013-05-11',
    dobWords: 'Eleventh May Two Thousand Thirteen',
    lastSchoolAttended: 'Primary Vidya Mandir, Satara',
    admissionDate: '2019-06-20',
    admissionGrade: 'Class 2-A',
    academicYear: '2026-2027',
    progress: 'Good',
    conduct: 'Good',
    feeTotal: 38000,
    feePaid: 20000,
    feePending: 18000,
    attendancePercent: 88,
    kycStatus: 'PENDING',
    aadhaarNumber: '3341-9920-5514',
    aadhaarVerified: false,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s04',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2018-0205',
    admissionNo: 'SCH-2026-004',
    rollNo: '9A-08',
    name: 'Tanvi Kulkarni',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 9-A',
    motherName: 'Aparna Kulkarni',
    parentName: 'Milind Kulkarni',
    fatherName: 'Milind Kulkarni',
    parentPhone: '+91 98231 66778',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Brahmin (General)',
    placeOfBirth: 'Pune, Maharashtra',
    dob: '2012-08-14',
    dobWords: 'Fourteenth August Two Thousand Twelve',
    lastSchoolAttended: 'Modern Primary School, Bhose',
    admissionDate: '2018-06-15',
    admissionGrade: 'Class 1-A',
    academicYear: '2026-2027',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    feeTotal: 40000,
    feePaid: 40000,
    feePending: 0,
    attendancePercent: 95,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '4482-1190-3367',
    aadhaarVerified: true,
    roleTag: 'PREFECT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s05',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2017-0310',
    admissionNo: 'SCH-2026-005',
    rollNo: '10A-12',
    name: 'Aryan Shinde',
    gender: 'MALE',
    gradeOrSemester: 'Class 10-A',
    motherName: 'Suman Shinde',
    parentName: 'Eknath Shinde',
    fatherName: 'Eknath Shinde',
    parentPhone: '+91 98232 55443',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    placeOfBirth: 'Solapur, Maharashtra',
    dob: '2011-04-19',
    dobWords: 'Nineteenth April Two Thousand Eleven',
    lastSchoolAttended: 'Zilla Parishad High School, Mohol',
    admissionDate: '2017-06-12',
    admissionGrade: 'Class 1-A',
    academicYear: '2026-2027',
    progress: 'Good',
    conduct: 'Good',
    feeTotal: 42000,
    feePaid: 32000,
    feePending: 10000,
    attendancePercent: 91,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '5561-8823-9901',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s06',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2025-0512',
    admissionNo: 'SCH-2026-006',
    rollNo: '11S-03',
    name: 'Sakshi Jadhav',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 11-A',
    motherName: 'Shaila Jadhav',
    parentName: 'Vitthal Jadhav',
    fatherName: 'Vitthal Jadhav',
    parentPhone: '+91 98233 44112',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    placeOfBirth: 'Pandharpur, Maharashtra',
    dob: '2010-09-25',
    dobWords: 'Twenty-Fifth September Two Thousand Ten',
    lastSchoolAttended: 'Saraswati Kanya Vidyalaya, Pandharpur',
    admissionDate: '2025-06-20',
    admissionGrade: 'Class 11-A (Science)',
    academicYear: '2026-2027',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    feeTotal: 45000,
    feePaid: 45000,
    feePending: 0,
    attendancePercent: 97,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '6672-9901-2234',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-s07',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2024-0618',
    admissionNo: 'SCH-2026-007',
    rollNo: '12S-15',
    name: 'Omkar Gaikwad',
    gender: 'MALE',
    gradeOrSemester: 'Class 12-A',
    motherName: 'Lata Gaikwad',
    parentName: 'Balasaheb Gaikwad',
    fatherName: 'Balasaheb Gaikwad',
    parentPhone: '+91 98234 33221',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Nav-Bauddha (SC)',
    placeOfBirth: 'Kurduwadi, Maharashtra',
    dob: '2009-12-03',
    dobWords: 'Third December Two Thousand Nine',
    lastSchoolAttended: 'Modern Public Jr College, Bhose',
    admissionDate: '2024-06-18',
    admissionGrade: 'Class 11-A (Science)',
    academicYear: '2026-2027',
    progress: 'Good',
    conduct: 'Very Good',
    feeTotal: 48000,
    feePaid: 28000,
    feePending: 20000,
    attendancePercent: 89,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '7783-0012-3345',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-hm01',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2025-0419',
    admissionNo: 'HM-2026-101',
    rollNo: 'BHM-301',
    name: 'Kabir Verma',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA Semester 3',
    motherName: 'Meenakshi Verma',
    parentName: 'Sanjay Verma',
    fatherName: 'Sanjay Verma',
    parentPhone: '+91 99220 12345',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Khatri',
    placeOfBirth: 'Nagpur, Maharashtra',
    dob: '2005-02-14',
    dobWords: 'Fourteenth February Two Thousand Five',
    lastSchoolAttended: 'Shivaji Junior Science College, Nagpur',
    admissionDate: '2025-07-05',
    admissionGrade: 'First Year B.Sc H&HA (Semester 1)',
    academicYear: '2026-2027',
    progress: 'Very Good',
    conduct: 'Exemplary',
    feeTotal: 75000,
    feePaid: 50000,
    feePending: 25000,
    attendancePercent: 92,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Food Production & Bakery',
    aadhaarNumber: '7821-3329-1142',
    aadhaarVerified: true,
    roleTag: 'INTERN',
    status: 'ACTIVE',
  },
  {
    id: 'stu-hm02',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2025-0422',
    admissionNo: 'HM-2026-102',
    rollNo: 'BHM-302',
    name: 'Pooja Nair',
    gender: 'FEMALE',
    gradeOrSemester: 'B.Sc H&HA Semester 3',
    motherName: 'Radha Nair',
    parentName: 'Venkatesh Nair',
    fatherName: 'Venkatesh Nair',
    parentPhone: '+91 99220 54321',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Nair (General)',
    placeOfBirth: 'Thiruvananthapuram, Kerala',
    dob: '2005-10-28',
    dobWords: 'Twenty-Eighth October Two Thousand Five',
    lastSchoolAttended: 'Kendriya Vidyalaya, Pune',
    admissionDate: '2025-07-06',
    admissionGrade: 'First Year B.Sc H&HA (Semester 1)',
    academicYear: '2026-2027',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    feeTotal: 75000,
    feePaid: 75000,
    feePending: 0,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Food & Beverage Service / Mock Bar',
    aadhaarNumber: '8841-2290-7715',
    aadhaarVerified: true,
    roleTag: 'PREFECT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-hm03',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2024-0388',
    admissionNo: 'HM-2026-103',
    rollNo: 'BHM-505',
    name: 'Manish Rawat',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA Semester 5',
    motherName: 'Geeta Rawat',
    parentName: 'Devendra Rawat',
    fatherName: 'Devendra Rawat',
    parentPhone: '+91 99220 99887',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Rajput',
    placeOfBirth: 'Dehradun, Uttarakhand',
    dob: '2004-06-19',
    dobWords: 'Nineteenth June Two Thousand Four',
    lastSchoolAttended: 'Doon Valley Public School',
    admissionDate: '2024-07-12',
    admissionGrade: 'First Year B.Sc H&HA (Semester 1)',
    academicYear: '2026-2027',
    progress: 'Very Good',
    conduct: 'Good',
    feeTotal: 80000,
    feePaid: 40000,
    feePending: 40000,
    attendancePercent: 90,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Front Office & Hospitality Management',
    aadhaarNumber: '5512-4481-9903',
    aadhaarVerified: true,
    roleTag: 'INTERN',
    status: 'ACTIVE',
  },
  {
    id: 'stu-hm04',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2026-0104',
    admissionNo: 'HM-2026-104',
    rollNo: 'BHM-102',
    name: 'Neha Chawla',
    gender: 'FEMALE',
    gradeOrSemester: 'B.Sc H&HA Semester 1',
    motherName: 'Simran Chawla',
    parentName: 'Harish Chawla',
    fatherName: 'Harish Chawla',
    parentPhone: '+91 99221 88776',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Khatri',
    placeOfBirth: 'Solapur, Maharashtra',
    dob: '2006-03-22',
    dobWords: 'Twenty-Second March Two Thousand Six',
    lastSchoolAttended: 'St. Thomas Junior College, Solapur',
    admissionDate: '2026-06-25',
    admissionGrade: 'First Year B.Sc H&HA (Semester 1)',
    academicYear: '2026-2027',
    progress: 'Very Good',
    conduct: 'Good',
    feeTotal: 75000,
    feePaid: 55000,
    feePending: 20000,
    attendancePercent: 94,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Culinary Arts & Basic Training Kitchen',
    aadhaarNumber: '8892-3341-5567',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-hm05',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2025-0205',
    admissionNo: 'HM-2026-105',
    rollNo: 'DBC-201',
    name: 'Aditi Rao',
    gender: 'FEMALE',
    gradeOrSemester: 'Diploma in Bakery & Confectionery Sem 2',
    motherName: 'Sudha Rao',
    parentName: 'Kishore Rao',
    fatherName: 'Kishore Rao',
    parentPhone: '+91 99222 77665',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Brahmin (General)',
    placeOfBirth: 'Solapur, Maharashtra',
    dob: '2005-11-10',
    dobWords: 'Tenth November Two Thousand Five',
    lastSchoolAttended: 'Haribhai Deokaran Junior College, Solapur',
    admissionDate: '2025-07-10',
    admissionGrade: 'Diploma in Bakery & Confectionery Sem 1',
    academicYear: '2026-2027',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    feeTotal: 55000,
    feePaid: 55000,
    feePending: 0,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Bakery & Confectionery Lab',
    aadhaarNumber: '9903-4452-6678',
    aadhaarVerified: true,
    roleTag: 'STUDENT',
    status: 'ACTIVE',
  },
  {
    id: 'stu-hm06',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2023-0106',
    admissionNo: 'HM-2026-106',
    rollNo: 'BHM-601',
    name: 'Sahil Shaikh',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA Semester 6',
    motherName: 'Farida Shaikh',
    parentName: 'Imran Shaikh',
    fatherName: 'Imran Shaikh',
    parentPhone: '+91 99223 66554',
    nationality: 'Indian',
    religion: 'Muslim',
    caste: 'Muslim / General',
    placeOfBirth: 'Solapur, Maharashtra',
    dob: '2004-08-16',
    dobWords: 'Sixteenth August Two Thousand Four',
    lastSchoolAttended: 'Walchand College of Arts & Science, Solapur',
    admissionDate: '2023-07-02',
    admissionGrade: 'First Year B.Sc H&HA (Semester 1)',
    academicYear: '2026-2027',
    progress: 'Very Good',
    conduct: 'Exemplary',
    feeTotal: 85000,
    feePaid: 55000,
    feePending: 30000,
    attendancePercent: 93,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Accommodation Operations & Housekeeping',
    aadhaarNumber: '7714-5563-7789',
    aadhaarVerified: true,
    roleTag: 'INTERN',
    status: 'ACTIVE',
  },
];

// =========================================================================================
// HISTORICAL ALUMNI GENERAL REGISTER (10+ YEARS ARCHIVE: 2011 - 2024 BATCHES)
// For students returning after 10+ years requesting Bonafide, Leaving Certificate (LC), etc.
// =========================================================================================
export const historicalAlumniData: Student[] = [
  {
    id: 'stu-hist-01',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2012-0042',
    admissionNo: 'SCH-2012-042',
    rollNo: '10A-14',
    name: 'Aditya Suresh Patil',
    gender: 'MALE',
    gradeOrSemester: 'Class 10th (Passed Out)',
    motherName: 'Sunita Patil',
    parentName: 'Suresh Patil',
    fatherName: 'Suresh Patil',
    parentPhone: '+91 98221 44550',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    placeOfBirth: 'Haveli, Pune, Maharashtra',
    dob: '2000-05-18',
    dobWords: 'Eighteenth May Two Thousand',
    lastSchoolAttended: 'Zilla Parishad Primary School, Manchar',
    admissionDate: '2012-06-15',
    admissionGrade: 'Class 5th Standard',
    leavingDate: '2016-05-31',
    leavingGrade: 'Class 10th Standard (SSC Board)',
    passingYear: '2016',
    academicYear: '2012-2016',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    reasonForLeaving: 'Passed 10th SSC Board Examination with First Class (88.4%) - Joined Science Junior College',
    remarks: 'Studied for 4 academic years. Cleared all school dues. Eligible for Higher Secondary Education.',
    status: 'ALUMNI_PASSED',
    feeTotal: 24000,
    feePaid: 24000,
    feePending: 0,
    attendancePercent: 95,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '8912-3341-7720',
    aadhaarVerified: true,
    penNumber: 'PEN-MH-2012-00421',
  },
  {
    id: 'stu-hist-02',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2014-0108',
    admissionNo: 'SCH-2014-0108',
    rollNo: '10B-08',
    name: 'Sneha Milind Kulkarni',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 10th (Passed Out)',
    motherName: 'Aparna Kulkarni',
    parentName: 'Milind Kulkarni',
    fatherName: 'Milind Kulkarni',
    parentPhone: '+91 98220 77112',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Brahmin (General)',
    placeOfBirth: 'Karad, Satara, Maharashtra',
    dob: '2001-11-04',
    dobWords: 'Fourth November Two Thousand One',
    lastSchoolAttended: 'Kanya Shala, Karad',
    admissionDate: '2014-06-20',
    admissionGrade: 'Class 7th Standard',
    leavingDate: '2018-05-30',
    leavingGrade: 'Class 10th Standard (SSC Board)',
    passingYear: '2018',
    academicYear: '2014-2018',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    reasonForLeaving: 'Passed SSC Board Examination with Distinction (92.6%) - Meritorious State Ranker',
    remarks: 'School Head Girl (2017-18). Cleared all dues. Awarded President Medal in Inter-School Debating.',
    status: 'ALUMNI_PASSED',
    feeTotal: 28000,
    feePaid: 28000,
    feePending: 0,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '7412-5589-3301',
    aadhaarVerified: true,
    penNumber: 'PEN-MH-2014-01089',
  },
  {
    id: 'stu-hist-03',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2015-0245',
    admissionNo: 'HM-2015-0245',
    rollNo: 'BHM-612',
    name: 'Vikram Sanjeev Malhotra',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA (Graduated)',
    motherName: 'Reena Malhotra',
    parentName: 'Sanjeev Malhotra',
    fatherName: 'Sanjeev Malhotra',
    parentPhone: '+91 98231 99001',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Khatri / Punjabi',
    placeOfBirth: 'Bandra, Mumbai, Maharashtra',
    dob: '1997-08-22',
    dobWords: 'Twenty-Second August Nineteen Ninety-Seven',
    lastSchoolAttended: 'Fergusson Junior College of Science, Pune',
    admissionDate: '2015-07-10',
    admissionGrade: 'First Year B.Sc Hospitality & Hotel Administration',
    leavingDate: '2018-06-15',
    leavingGrade: 'Final Year B.Sc H&HA (Semester 6)',
    passingYear: '2018',
    academicYear: '2015-2018',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    reasonForLeaving: 'Graduated B.Sc in Hospitality & Hotel Administration (Gold Medalist, CGPA 9.8)',
    remarks: 'Zero institutional dues. Completed 6 months Industrial Training at Taj Mahal Palace, Mumbai.',
    status: 'ALUMNI_PASSED',
    feeTotal: 65000,
    feePaid: 65000,
    feePending: 0,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Culinary Arts & Food Production',
    aadhaarNumber: '9920-1188-4433',
    aadhaarVerified: true,
  },
  {
    id: 'stu-hist-04',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2013-0091',
    admissionNo: 'SCH-2013-0091',
    rollNo: '10A-21',
    name: 'Pooja Ramesh Deshmukh',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 10th (Passed Out)',
    motherName: 'Kavita Deshmukh',
    parentName: 'Ramesh Deshmukh',
    fatherName: 'Ramesh Deshmukh',
    parentPhone: '+91 98223 88120',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    placeOfBirth: 'Nashik, Maharashtra',
    dob: '1999-03-12',
    dobWords: 'Twelfth March Nineteen Ninety-Nine',
    lastSchoolAttended: 'Adarsh Vidyalaya, Nashik',
    admissionDate: '2013-06-18',
    admissionGrade: 'Class 6th Standard',
    leavingDate: '2017-05-25',
    leavingGrade: 'Class 10th Standard (SSC Board)',
    passingYear: '2017',
    academicYear: '2013-2017',
    progress: 'Very Good',
    conduct: 'Good',
    reasonForLeaving: 'Passed SSC Board Examination with First Class (86.2%) - Relocated to Mumbai for Junior College',
    remarks: 'All library books returned and accounts cleared. Character certified exemplary.',
    status: 'ALUMNI_PASSED',
    feeTotal: 25000,
    feePaid: 25000,
    feePending: 0,
    attendancePercent: 91,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '4412-9988-7711',
    aadhaarVerified: true,
  },
  {
    id: 'stu-hist-05',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2016-0312',
    admissionNo: 'HM-2016-0312',
    rollNo: 'BHM-620',
    name: 'Mohammad Farhan Ansari',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA (Graduated)',
    motherName: 'Nasreen Ansari',
    parentName: 'Javed Ansari',
    fatherName: 'Javed Ansari',
    parentPhone: '+91 98901 33445',
    nationality: 'Indian',
    religion: 'Islam',
    caste: 'Ansari (OBC)',
    placeOfBirth: 'Aurangabad, Maharashtra',
    dob: '1998-01-19',
    dobWords: 'Nineteenth January Nineteen Ninety-Eight',
    lastSchoolAttended: 'Milind College of Arts & Commerce, Aurangabad',
    admissionDate: '2016-07-15',
    admissionGrade: 'B.Sc H&HA Semester 1',
    leavingDate: '2019-06-20',
    leavingGrade: 'B.Sc H&HA Semester 6',
    passingYear: '2019',
    academicYear: '2016-2019',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    reasonForLeaving: 'Completed Degree with First Class - Campus Placed at Oberoi Hotels & Resorts',
    remarks: 'Zero outstanding dues. Winner of Inter-College MasterChef Competition 2018.',
    status: 'ALUMNI_PASSED',
    feeTotal: 68000,
    feePaid: 68000,
    feePending: 0,
    attendancePercent: 94,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Food & Beverage Production',
    aadhaarNumber: '3341-2299-8800',
    aadhaarVerified: true,
  },
  {
    id: 'stu-hist-06',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2019-0440',
    admissionNo: 'SCH-2019-0440',
    rollNo: '10C-12',
    name: 'Tanvi Dilip Joshi',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 10th (Passed Out)',
    motherName: 'Varsha Joshi',
    parentName: 'Dilip Joshi',
    fatherName: 'Dilip Joshi',
    parentPhone: '+91 98220 33991',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Brahmin',
    placeOfBirth: 'Thane, Maharashtra',
    dob: '2004-09-30',
    dobWords: 'Thirtieth September Two Thousand Four',
    lastSchoolAttended: 'Saraswati Vidyalaya, Thane',
    admissionDate: '2019-06-15',
    admissionGrade: 'Class 8th Standard',
    leavingDate: '2022-05-30',
    leavingGrade: 'Class 10th Standard',
    passingYear: '2022',
    academicYear: '2019-2022',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    reasonForLeaving: 'Passed 10th CBSE Board with 94.0% - Enrolled in Higher Secondary Junior College',
    remarks: 'School sports captain. All fees and library accounts cleared.',
    status: 'ALUMNI_PASSED',
    feeTotal: 34000,
    feePaid: 34000,
    feePending: 0,
    attendancePercent: 97,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '7721-9900-1122',
    aadhaarVerified: true,
  },
  {
    id: 'stu-hist-07',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    grNumber: 'GR-2011-0027',
    admissionNo: 'SCH-2011-0027',
    rollNo: '10A-04',
    name: 'Rahul Eknath Shinde',
    gender: 'MALE',
    gradeOrSemester: 'Class 10th (Passed Out)',
    motherName: 'Lata Shinde',
    parentName: 'Eknath Shinde',
    fatherName: 'Eknath Shinde',
    parentPhone: '+91 98224 55110',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    placeOfBirth: 'Shirur, Pune, Maharashtra',
    dob: '1999-01-25',
    dobWords: 'Twenty-Fifth January Nineteen Ninety-Nine',
    lastSchoolAttended: 'Zilla Parishad Primary School, Shirur',
    admissionDate: '2011-06-12',
    admissionGrade: 'Class 5th Standard',
    leavingDate: '2015-05-31',
    leavingGrade: 'Class 10th Standard (SSC Board)',
    passingYear: '2015',
    academicYear: '2011-2015',
    progress: 'Good',
    conduct: 'Good',
    reasonForLeaving: 'Passed SSC Board Examination with First Class (79.5%) - Relocated to Pune City',
    remarks: 'Perpetual General Register Entry verified. 10+ Years alumni archive record.',
    status: 'ALUMNI_PASSED',
    feeTotal: 20000,
    feePaid: 20000,
    feePending: 0,
    attendancePercent: 92,
    kycStatus: 'VERIFIED',
    aadhaarNumber: '9901-4411-2233',
    aadhaarVerified: true,
  },
  {
    id: 'stu-hist-08',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    grNumber: 'GR-2014-0198',
    admissionNo: 'HM-2014-0198',
    rollNo: 'BHM-604',
    name: 'Aniket Balasaheb Gaikwad',
    gender: 'MALE',
    gradeOrSemester: 'B.Sc H&HA (Graduated)',
    motherName: 'Shobha Gaikwad',
    parentName: 'Balasaheb Gaikwad',
    fatherName: 'Balasaheb Gaikwad',
    parentPhone: '+91 99221 88443',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha',
    placeOfBirth: 'Baramati, Pune, Maharashtra',
    dob: '1996-09-14',
    dobWords: 'Fourteenth September Nineteen Ninety-Six',
    lastSchoolAttended: 'Vidya Pratishthan Junior College, Baramati',
    admissionDate: '2014-07-08',
    admissionGrade: 'B.Sc H&HA Semester 1',
    leavingDate: '2017-06-15',
    leavingGrade: 'B.Sc H&HA Semester 6',
    passingYear: '2017',
    academicYear: '2014-2017',
    progress: 'Very Good',
    conduct: 'Exemplary',
    reasonForLeaving: 'Completed 3-Year Degree in Hospitality & Hotel Administration with Distinction',
    remarks: 'Currently working abroad as Senior Hospitality Executive. All dues cleared.',
    status: 'ALUMNI_PASSED',
    feeTotal: 60000,
    feePaid: 60000,
    feePending: 0,
    attendancePercent: 95,
    kycStatus: 'VERIFIED',
    hotelSpecialization: 'Front Office & Guest Relations',
    aadhaarNumber: '6611-3344-9988',
    aadhaarVerified: true,
  },
];

const getInitialFeeReceipts = (): FeeReceipt[] => [
  {
    id: 'rcp-01',
    receiptNo: 'RCP-SCH-2026-081',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    branchName: 'Modern Public School And Junior College Bhose',
    amount: 12000,
    paymentMode: 'UPI',
    date: '2026-10-18',
    installmentNo: 2,
    status: 'PAID',
  },
  {
    id: 'rcp-02',
    receiptNo: 'RCP-HM-2026-142',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    amount: 25000,
    paymentMode: 'NETBANKING',
    date: '2026-10-15',
    installmentNo: 2,
    status: 'PAID',
  },
];

const getInitialKitchenLabs = (): KitchenPracticalBatch[] => [
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

const getInitialHotelInternships = (): HotelInternship[] => [
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
    hotelBrand: 'JW Marriott Sahar',
    city: 'Mumbai',
    department: 'Food & Beverage Service',
    mentorName: 'Priya Mukherjee (Restaurant Manager)',
    mentorRating: 9.1,
    status: 'ONGOING',
  },
  {
    id: 'it-03',
    studentName: 'Aditya Kulkarni',
    rollNo: 'BHM-415',
    hotelBrand: 'The Oberoi, Nariman Point',
    city: 'Mumbai',
    department: 'Front Office & Guest Relations',
    mentorName: 'Alok Gupta (Front Desk Mgr)',
    mentorRating: 9.6,
    status: 'COMPLETED',
  },
];

const getInitialChefKit = (): ChefKitInventory[] => [
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

const getInitialBusRoute = (): BusRoute => ({
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
    { name: 'Trust Main Campus (School & College)', time: '08:20 AM', passed: false },
  ],
});

const getInitialEnquiries = (): AdmissionEnquiry[] => [
  {
    id: 'enq-01',
    applicantName: 'Tanya Sengupta',
    parentName: 'Debabrata Sengupta',
    phone: '+91 98112 33445',
    targetBranch: 'COLLEGE',
    targetClassOrCourse: 'B.Sc in Hospitality & Hotel Administration',
    status: 'NEW',
    createdAt: '2026-10-20',
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

const getInitialAttendance = (): AttendanceRecord[] => [
  {
    id: 'att-01',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    branchId: 'branch-sch-01',
    classOrBatch: 'Class 7-A',
    date: '2026-10-21',
    status: 'PRESENT',
  },
  {
    id: 'att-02',
    studentId: 'stu-s02',
    studentName: 'Ananya Patel',
    branchId: 'branch-sch-01',
    classOrBatch: 'Class 7-A',
    date: '2026-10-21',
    status: 'PRESENT',
  },
  {
    id: 'att-03',
    studentId: 'stu-s03',
    studentName: 'Rohan Deshmukh',
    branchId: 'branch-sch-01',
    classOrBatch: 'Class 8-B',
    date: '2026-10-21',
    status: 'ABSENT',
    remarks: 'Informed sick leave',
  },
  {
    id: 'att-04',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    branchId: 'branch-hm-01',
    classOrBatch: 'Batch A - Culinary Fundamentals',
    date: '2026-10-21',
    status: 'PRESENT',
  },
];

const getInitialHomework = (): Homework[] => [
  {
    id: 'hw-01',
    branchId: 'branch-sch-01',
    classOrBatch: 'Class 7-A',
    subjectOrLab: 'Mathematics',
    title: 'Algebraic Expressions & Geometry Practice',
    description: 'Solve exercises 4.1 to 4.3 from NCERT textbook Chapter 4.',
    dueDate: '2026-10-24',
    assignedDate: '2026-10-21',
    teacherName: 'Mrs. Neha Kulkarni',
    attachments: ['https://trust-erp.local/docs/algebra_ws_7a.pdf'],
  },
  {
    id: 'hw-02',
    branchId: 'branch-hm-01',
    classOrBatch: 'Batch A - Culinary Fundamentals',
    subjectOrLab: 'Food Production (BTK)',
    title: 'Standard Recipe Cost Card - Béchamel & Velouté',
    description: 'Calculate ingredient cost and yield percentage for 5 liters of mother sauces.',
    dueDate: '2026-10-23',
    assignedDate: '2026-10-21',
    teacherName: 'Chef Sanjeev Menon',
    attachments: ['https://trust-erp.local/docs/recipe_cost_card_template.xlsx'],
  },
];

const getInitialStudyNotes = (): StudyNote[] => [
  {
    id: 'note-01',
    branchId: 'branch-sch-01',
    title: 'Physics - Heat Transfer & Thermodynamics Notes',
    subjectOrLab: 'Science',
    description: 'Comprehensive handwritten revision notes with solved numerical problems.',
    fileUrl: 'https://trust-erp.local/materials/physics_ch3_notes.pdf',
    uploadedDate: '2026-10-18',
    teacherName: 'Mr. Arvind Shinde',
    tags: ['Physics', 'Class 7', 'Thermodynamics'],
  },
  {
    id: 'note-02',
    branchId: 'branch-hm-01',
    title: 'Classic French Culinary Terminology & Cuts of Vegetables',
    subjectOrLab: 'Food Production',
    description: 'Julienne, Brunoise, Paysanne, Chiffonade definitions and safety guidelines.',
    fileUrl: 'https://trust-erp.local/materials/culinary_cuts_guide.pdf',
    uploadedDate: '2026-10-19',
    teacherName: 'Chef Sanjeev Menon',
    tags: ['Culinary Arts', 'Kitchen', 'Knifework'],
  },
];

const getInitialGrades = (): StudentGrade[] => [
  {
    id: 'grd-01',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    rollNo: '7A-01',
    branchId: 'branch-sch-01',
    classOrGrade: 'Class 7-A',
    examOrPracticalName: 'Mid-Term Examination 2026',
    subject: 'Science & Thermal Thermodynamics',
    maxMarks: 100,
    marksObtained: 92,
    percentage: 92.0,
    grade: 'A+',
    status: 'PASS',
    remarks: 'Outstanding analytical skills in Mathematics & Science',
    date: '2026-10-10',
  },
  {
    id: 'grd-02',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    rollNo: 'HM-101',
    branchId: 'branch-hm-01',
    classOrGrade: 'B.Sc HM Semester 3',
    examOrPracticalName: 'BTK Practical Assessment - Sauces & Poultry',
    subject: 'Culinary Fundamentals & Food Chemistry',
    maxMarks: 50,
    marksObtained: 47,
    percentage: 94.0,
    grade: 'A+',
    status: 'PASS',
    remarks: 'Flawless sauce consistency and professional plating technique',
    date: '2026-10-14',
  },
];

const getInitialPhotoAlbums = (): PhotoAlbum[] => [
  {
    id: 'album-01',
    branchId: 'branch-sch-01',
    title: 'Annual Sports Day 2026 - Sprint & Relay Championships',
    eventDate: '2026-10-12',
    description: 'Students competing in track & field, march past, and gymnastics display.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        caption: '100m Sprint Finals - Senior Boys',
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1576972405668-2d020a01cbfa?auto=format&fit=crop&w=800&q=80',
        caption: 'Trophy ceremony with Principal Madam',
      },
    ],
  },
  {
    id: 'album-02',
    branchId: 'branch-sch-01',
    title: 'Science & Innovation Exhibition 2026',
    eventDate: '2026-09-25',
    description: 'Working models on renewable solar energy, robotics, and water filtration.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
        caption: 'Robotics demo by Class 8 young innovators',
      },
    ],
  },
];

const getInitialInternshipLogs = (): InternshipLog[] => [
  {
    id: 'log-01',
    studentId: 'stu-hm01',
    rollNo: 'BHM-301',
    studentName: 'Kabir Verma',
    date: '2026-10-20',
    hotelBrand: 'Taj Lands End, Bandra, Mumbai',
    department: 'Food Production (Butchery & Main Kitchen)',
    shiftHours: 8,
    tasksCompleted: 'Assisted in morning mise-en-place, portioned Atlantic salmon, prepared demi-glace.',
    chefMentor: 'Sous Chef Vikramaditya',
    mentorFeedback: 'Very punctual, excellent hygiene standards, and fast knife skills.',
    verified: true,
  },
];

const getInitialProgressionHistory = (): StudentProgressionRecord[] => [
  {
    id: 'prog-01',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    fromYear: '2025-2026',
    toYear: '2026-2027',
    fromGrade: 'Class 6-A',
    toGrade: 'Class 7-A',
    pendingFeeCarriedForward: 5000,
    promotedDate: '2026-04-15',
    status: 'PROMOTED',
  },
  {
    id: 'prog-02',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    fromYear: '2025-2026',
    toYear: '2026-2027',
    fromGrade: 'B.Sc H&HA Semester 2',
    toGrade: 'B.Sc H&HA Semester 3',
    pendingFeeCarriedForward: 10000,
    promotedDate: '2026-06-20',
    status: 'PROMOTED',
  },
];

// Active State Variables
export let trustData: TrustOverview = getInitialTrustData();
export let branchesData: Branch[] = getInitialBranches();
export let studentsData: Student[] = getInitialStudents();
export let feeReceiptsData: FeeReceipt[] = getInitialFeeReceipts();
export let kitchenLabsData: KitchenPracticalBatch[] = getInitialKitchenLabs();
export let hotelInternshipsData: HotelInternship[] = getInitialHotelInternships();
export let chefKitData: ChefKitInventory[] = getInitialChefKit();
export let busRouteData: BusRoute = getInitialBusRoute();
export let enquiriesData: AdmissionEnquiry[] = getInitialEnquiries();
export let attendanceData: AttendanceRecord[] = getInitialAttendance();
export let homeworkData: Homework[] = getInitialHomework();
export let studyNotesData: StudyNote[] = getInitialStudyNotes();
export let gradesData: StudentGrade[] = getInitialGrades();
export let photoAlbumsData: PhotoAlbum[] = getInitialPhotoAlbums();
export let internshipLogsData: InternshipLog[] = getInitialInternshipLogs();
export let progressionHistoryData: StudentProgressionRecord[] = getInitialProgressionHistory();

// Reset data store helper for tests
export function resetDataStore(): void {
  trustData = getInitialTrustData();
  branchesData = getInitialBranches();
  studentsData = getInitialStudents();
  feeReceiptsData = getInitialFeeReceipts();
  kitchenLabsData = getInitialKitchenLabs();
  hotelInternshipsData = getInitialHotelInternships();
  chefKitData = getInitialChefKit();
  busRouteData = getInitialBusRoute();
  enquiriesData = getInitialEnquiries();
  attendanceData = getInitialAttendance();
  homeworkData = getInitialHomework();
  studyNotesData = getInitialStudyNotes();
  gradesData = getInitialGrades();
  photoAlbumsData = getInitialPhotoAlbums();
  internshipLogsData = getInitialInternshipLogs();
  progressionHistoryData = getInitialProgressionHistory();
}
