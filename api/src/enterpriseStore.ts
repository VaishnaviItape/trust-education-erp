/**
 * ENTERPRISE DATA STORE FOR TRUSTEDU ERP
 * Contains in-memory state and mock data for all 9 Enterprise Modules.
 */

// ==============================================================================
// 1. CAP (CENTRALIZED ADMISSION PROCESS)
// ==============================================================================

export interface CAPRound {
  id: string;
  academicYear: string;
  roundNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'REGISTRATION_OPEN' | 'ALLOCATION_PUBLISHED' | 'COMPLETED';
}

export interface CAPApplicant {
  id: string;
  applicationNo: string;
  name: string;
  email: string;
  phone: string;
  category: 'GENERAL' | 'OBC' | 'SC' | 'ST';
  meritRank: number;
  percentage: number;
  preferences: string[];
  allocatedStreamId?: string;
  allocatedStreamName?: string;
  status: 'APPLIED' | 'ALLOCATED' | 'ACCEPTED' | 'REJECTED';
}

export const capRoundsData: CAPRound[] = [
  {
    id: 'cap-round-01',
    academicYear: '2026-2027',
    roundNumber: 1,
    name: 'CAP Round 1 - Central Merit Admissions',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    status: 'ALLOCATION_PUBLISHED',
  },
  {
    id: 'cap-round-02',
    academicYear: '2026-2027',
    roundNumber: 2,
    name: 'CAP Round 2 - Quota & Vacancy Round',
    startDate: '2026-06-20',
    endDate: '2026-07-05',
    status: 'REGISTRATION_OPEN',
  },
];

export const capApplicantsData: CAPApplicant[] = [
  {
    id: 'cap-app-01',
    applicationNo: 'CAP-2026-8801',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    phone: '+91 98220 55441',
    category: 'GENERAL',
    meritRank: 14,
    percentage: 92.4,
    preferences: ['stream-culinary-01', 'stream-engg-cs-01'],
    allocatedStreamId: 'stream-culinary-01',
    allocatedStreamName: 'B.Sc Hotel Management & Culinary Arts',
    status: 'ALLOCATED',
  },
  {
    id: 'cap-app-02',
    applicationNo: 'CAP-2026-8802',
    name: 'Pooja Kulkarni',
    email: 'pooja.k@example.com',
    phone: '+91 98220 77112',
    category: 'OBC',
    meritRank: 28,
    percentage: 88.6,
    preferences: ['stream-engg-cs-01', 'stream-culinary-01'],
    allocatedStreamId: 'stream-engg-cs-01',
    allocatedStreamName: 'B.Tech Computer Science & AI',
    status: 'ALLOCATED',
  },
  {
    id: 'cap-app-03',
    applicationNo: 'CAP-2026-8803',
    name: 'Aditya More',
    email: 'aditya.m@example.com',
    phone: '+91 98220 99334',
    category: 'SC',
    meritRank: 45,
    percentage: 84.2,
    preferences: ['stream-culinary-01'],
    allocatedStreamId: 'stream-culinary-01',
    allocatedStreamName: 'B.Sc Hotel Management & Culinary Arts',
    status: 'ALLOCATED',
  },
];

// ==============================================================================
// 2. ACCOUNTING & FEE CONCESSIONS
// ==============================================================================

export interface AccountingLedger {
  id: string;
  code: string;
  name: string;
  group: 'ASSET' | 'LIABILITY' | 'INCOME' | 'EXPENSE';
  balance: number;
}

export interface AccountingVoucher {
  id: string;
  voucherNo: string;
  type: 'RECEIPT' | 'PAYMENT' | 'JOURNAL' | 'CONTRA';
  date: string;
  narration: string;
  entries: Array<{
    ledgerId: string;
    ledgerName: string;
    debit: number;
    credit: number;
  }>;
  createdBy: string;
}

export interface FeeConcessionRequest {
  id: string;
  studentId: string;
  studentName: string;
  branchName: string;
  annualFee: number;
  requestedAmount: number;
  reason: string;
  status: 'PENDING' | 'RECOMMENDED_PRINCIPAL' | 'APPROVED_TRUSTEE' | 'REJECTED';
  approvedAmount: number;
  requestDate: string;
  approvalHistory: Array<{ role: string; approver: string; action: string; date: string }>;
}

export const accountingLedgersData: AccountingLedger[] = [
  { id: 'ledg-101', code: 'CASH-01', name: 'Cash in Hand (Campus Counter)', group: 'ASSET', balance: 145000 },
  { id: 'ledg-102', code: 'BANK-HDFC', name: 'HDFC Trust Collection A/c', group: 'ASSET', balance: 4250000 },
  { id: 'ledg-201', code: 'TUIT-INC', name: 'Student Tuition Fees Income', group: 'INCOME', balance: 3820000 },
  { id: 'ledg-202', code: 'LAB-INC', name: 'Kitchen & Practical Lab Fee Income', group: 'INCOME', balance: 575000 },
  { id: 'ledg-301', code: 'SAL-EXP', name: 'Faculty & Staff Salary Expense', group: 'EXPENSE', balance: 1850000 },
  { id: 'ledg-302', code: 'ELEC-EXP', name: 'Campus Electricity & Power', group: 'EXPENSE', balance: 124000 },
];

export const accountingVouchersData: AccountingVoucher[] = [
  {
    id: 'vouch-01',
    voucherNo: 'VCH-RCP-2026-001',
    type: 'RECEIPT',
    date: '2026-10-18',
    narration: 'Fee collection batch from Modern Public School Bhose',
    entries: [
      { ledgerId: 'ledg-102', ledgerName: 'HDFC Trust Collection A/c', debit: 48000, credit: 0 },
      { ledgerId: 'ledg-201', ledgerName: 'Student Tuition Fees Income', debit: 0, credit: 48000 },
    ],
    createdBy: 'Accountant Priya Joshi',
  },
  {
    id: 'vouch-02',
    voucherNo: 'VCH-PAY-2026-002',
    type: 'PAYMENT',
    date: '2026-10-19',
    narration: 'Commercial Gas Cylinder purchase for Hotel Mgmt Basic Training Kitchen',
    entries: [
      { ledgerId: 'ledg-302', ledgerName: 'Kitchen Utility & Power', debit: 18500, credit: 0 },
      { ledgerId: 'ledg-101', ledgerName: 'Cash in Hand (Campus Counter)', debit: 0, credit: 18500 },
    ],
    createdBy: 'Accountant Priya Joshi',
  },
];

export const feeConcessionsData: FeeConcessionRequest[] = [
  {
    id: 'conc-001',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    branchName: 'Modern Public School And Junior College Bhose',
    annualFee: 36000,
    requestedAmount: 6000,
    reason: 'Father lost agricultural crop due to unseasonal rain. Provided Tahsildar income certificate.',
    status: 'APPROVED_TRUSTEE',
    approvedAmount: 6000,
    requestDate: '2026-09-10',
    approvalHistory: [
      { role: 'PRINCIPAL', approver: 'Principal Sunita Kulkarni', action: 'RECOMMENDED', date: '2026-09-12' },
      { role: 'SUPERADMIN', approver: 'Dr. Rajesh Patil (Trustee)', action: 'APPROVED', date: '2026-09-15' },
    ],
  },
  {
    id: 'conc-002',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    annualFee: 75000,
    requestedAmount: 15000,
    reason: 'Single mother earning livelihood via local tailoring. Applied for Merit-cum-Means concession.',
    status: 'RECOMMENDED_PRINCIPAL',
    approvedAmount: 0,
    requestDate: '2026-10-02',
    approvalHistory: [
      { role: 'PRINCIPAL', approver: 'Director Chef Sanjeev Menon', action: 'RECOMMENDED', date: '2026-10-05' },
    ],
  },
];

// ==============================================================================
// 3. ORIGINAL DOCUMENTS & CERTIFICATE VERIFICATION
// ==============================================================================

export interface DocumentRackLocation {
  id: string;
  cupboardNo: string;
  shelfNo: string;
  rackCode: string;
  capacityFiles: number;
  currentStored: number;
}

export interface InwardDocumentRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  documentTitle: string;
  serialNo: string;
  receivedDate: string;
  rackLocationId: string;
  rackCode: string;
  folderNumber: string;
  receiptNo: string;
  status: 'CUSTODY' | 'TEMPORARY_RETURN' | 'PERMANENT_RETURN';
}

export interface IssuedCertificate {
  id: string;
  certificateSerialNo: string;
  certificateType: 'BONAFIDE' | 'TRANSFER_LEAVING' | 'CHARACTER' | 'NO_DUES' | 'PASSING_ATTEMPT' | 'MIGRATION';
  studentId: string;
  studentName: string;
  grNumber?: string;
  branchName: string;
  gradeOrCourse: string;
  academicYear: string;
  issueDate: string;
  issuedBy: string;
  digitalSignatureHash: string;
  qrVerificationUrl: string;
  motherName?: string;
  fatherName?: string;
  dob?: string;
  dobWords?: string;
  placeOfBirth?: string;
  nationality?: string;
  religion?: string;
  caste?: string;
  admissionDate?: string;
  admissionGrade?: string;
  leavingDate?: string;
  leavingGrade?: string;
  reasonForLeaving?: string;
  progress?: string;
  conduct?: string;
  purpose?: string;
  isDuplicate?: boolean;
  remarks?: string;
  details?: Record<string, any>;
}

export const documentRackLocationsData: DocumentRackLocation[] = [
  { id: 'rack-01', cupboardNo: 'C-01 (Fireproof Steel)', shelfNo: 'Shelf 2', rackCode: 'C1-S2-SCH', capacityFiles: 150, currentStored: 42 },
  { id: 'rack-02', cupboardNo: 'C-02 (Fireproof Steel)', shelfNo: 'Shelf 1', rackCode: 'C2-S1-HM', capacityFiles: 200, currentStored: 68 },
];

export const inwardDocumentsData: InwardDocumentRecord[] = [
  {
    id: 'inw-01',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    admissionNo: 'SCH-2026-001',
    documentTitle: 'Original 5th Standard Transfer Certificate & Birth Certificate',
    serialNo: 'TC-ORIG-2024-4412',
    receivedDate: '2024-06-12',
    rackLocationId: 'rack-01',
    rackCode: 'C1-S2-SCH',
    folderNumber: 'FL-SCH-001',
    receiptNo: 'DOC-INW-2024-001',
    status: 'CUSTODY',
  },
  {
    id: 'inw-02',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    admissionNo: 'HM-2026-101',
    documentTitle: 'Original 12th HSC Marksheet & Passing Certificate',
    serialNo: 'HSC-MS-2024-88912',
    receivedDate: '2024-07-02',
    rackLocationId: 'rack-02',
    rackCode: 'C2-S1-HM',
    folderNumber: 'FL-HM-101',
    receiptNo: 'DOC-INW-2024-101',
    status: 'CUSTODY',
  },
];

export const issuedCertificatesData: IssuedCertificate[] = [
  {
    id: 'cert-bf-01',
    certificateSerialNo: 'BF-SCH-2026-0041',
    certificateType: 'BONAFIDE',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    grNumber: 'GR-2020-0142',
    branchName: 'Modern Public School And Junior College Bhose',
    gradeOrCourse: 'Class 7-A',
    academicYear: '2026-2027',
    issueDate: '2026-10-15',
    issuedBy: 'Principal Sunita Kulkarni',
    digitalSignatureHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    qrVerificationUrl: 'http://localhost:5000/verify/doc/cert-bf-01',
    motherName: 'Anjali Sharma',
    fatherName: 'Ramesh Sharma',
    dob: '2014-07-22',
    dobWords: 'Twenty-Second July Two Thousand Fourteen',
    purpose: 'Passport Application & Visa Proof',
    progress: 'Very Good',
    conduct: 'Exemplary',
  },
  {
    id: 'cert-tc-02',
    certificateSerialNo: 'LC-HM-2026-0012',
    certificateType: 'TRANSFER_LEAVING',
    studentId: 'stu-hm01',
    studentName: 'Kabir Verma',
    grNumber: 'GR-2025-0419',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    gradeOrCourse: 'B.Sc H&HA Semester 3',
    academicYear: '2026-2027',
    issueDate: '2026-10-20',
    issuedBy: 'Director Chef Sanjeev Menon',
    digitalSignatureHash: 'SHA256:9c56cc51b374c3ba189210d5b6d4bf57790d351c96c47c02190ecf1e430635ab',
    qrVerificationUrl: 'http://localhost:5000/verify/doc/cert-tc-02',
    motherName: 'Meenakshi Verma',
    fatherName: 'Sanjay Verma',
    dob: '2005-02-14',
    dobWords: 'Fourteenth February Two Thousand Five',
    placeOfBirth: 'Nagpur, Maharashtra',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Khatri',
    admissionDate: '2025-07-05',
    admissionGrade: 'First Year B.Sc H&HA',
    leavingDate: '2026-10-18',
    leavingGrade: 'B.Sc H&HA Semester 3',
    reasonForLeaving: 'Transferring to Mumbai Branch / Family Relocation',
    progress: 'Very Good',
    conduct: 'Exemplary',
  },
  {
    id: 'cert-lc-arch-01',
    certificateSerialNo: 'LC-SCH-2026-0039',
    certificateType: 'TRANSFER_LEAVING',
    studentId: 'stu-hist-01',
    studentName: 'Aditya Suresh Patil',
    grNumber: 'GR-2012-0042',
    branchName: 'Modern Public School And Junior College Bhose',
    gradeOrCourse: 'Class 10th Standard (SSC Board)',
    academicYear: '2012-2016',
    issueDate: '2026-10-21',
    issuedBy: 'Principal Sunita Kulkarni',
    digitalSignatureHash: 'SHA256:3a1b94cd81ea209b5c872e41fa334589d81249b6b90f421ac9018e47bf990212',
    qrVerificationUrl: 'http://localhost:5000/verify/doc/cert-lc-arch-01',
    motherName: 'Sunita Patil',
    fatherName: 'Suresh Patil',
    dob: '2000-05-18',
    dobWords: 'Eighteenth May Two Thousand',
    placeOfBirth: 'Haveli, Pune, Maharashtra',
    nationality: 'Indian',
    religion: 'Hindu',
    caste: 'Maratha (General)',
    admissionDate: '2012-06-15',
    admissionGrade: 'Class 5th Standard',
    leavingDate: '2016-05-31',
    leavingGrade: 'Class 10th Standard (SSC Board)',
    reasonForLeaving: 'Passed 10th SSC Board Examination with First Class (88.4%)',
    progress: 'Outstanding',
    conduct: 'Exemplary',
    isDuplicate: true,
    remarks: 'DUPLICATE COPY ISSUED UPON FORMAL ALUMNI APPLICATION (10 YEARS POST-PASSING FOR EMBASSY VISA VERIFICATION).',
  },
];

// ==============================================================================
// 4. EXAMINATIONS & OMR COMPUTER VISION
// ==============================================================================

export interface OMRTemplate {
  id: string;
  title: string;
  totalQuestions: number;
  optionsPerQuestion: number;
  cornerAnchors: boolean;
}

export interface OMRAnswerKey {
  id: string;
  templateId: string;
  subject: string;
  setCode: string;
  answers: Record<string, string>;
  positiveMark: number;
  negativeMark: number;
}

export interface OMRScanRecord {
  id: string;
  answerKeyId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  scannedImageUrl: string;
  recognizedAnswers: Record<string, string>;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  totalScore: number;
  percentage: number;
  verificationVerified: boolean;
  scannedAt: string;
}

export const omrTemplatesData: OMRTemplate[] = [
  {
    id: 'omr-tpl-100',
    title: 'National OMR Standard - 100 MCQs (4 Anchors)',
    totalQuestions: 100,
    optionsPerQuestion: 4,
    cornerAnchors: true,
  },
  {
    id: 'omr-tpl-50',
    title: 'Midterm Rapid Assessment - 50 MCQs',
    totalQuestions: 50,
    optionsPerQuestion: 4,
    cornerAnchors: true,
  },
];

export const omrAnswerKeysData: OMRAnswerKey[] = [
  {
    id: 'key-sci-01',
    templateId: 'omr-tpl-50',
    subject: 'Science & Culinary Thermodynamics',
    setCode: 'SET_A',
    positiveMark: 1.0,
    negativeMark: 0.25,
    answers: {
      '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
      '6': 'B', '7': 'C', '8': 'A', '9': 'D', '10': 'B',
      '11': 'C', '12': 'A', '13': 'D', '14': 'B', '15': 'C',
    },
  },
];

export const omrScansData: OMRScanRecord[] = [
  {
    id: 'scan-001',
    answerKeyId: 'key-sci-01',
    studentId: 'stu-s01',
    studentName: 'Aarav Sharma',
    rollNo: '7A-01',
    scannedImageUrl: '/assets/omr_samples/scan_7A01.png',
    recognizedAnswers: {
      '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
      '6': 'B', '7': 'C', '8': 'C', '9': 'D', '10': 'B',
      '11': 'C', '12': 'A', '13': 'D', '14': 'A', '15': 'C',
    },
    correctCount: 13,
    wrongCount: 2,
    unattemptedCount: 0,
    totalScore: 12.5,
    percentage: 83.3,
    verificationVerified: true,
    scannedAt: '2026-10-19T14:32:00Z',
  },
];

// ==============================================================================
// 5. HARDWARE BIOMETRICS & ATTENDANCE
// ==============================================================================

export interface BiometricDevice {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  ipAddress: string;
  port: number;
  protocol: 'ZK_TCP' | 'MQTT' | 'WEBSOCKET';
  status: 'ONLINE' | 'OFFLINE';
  lastHeartbeat: string;
  cachedPunchCount: number;
}

export interface RawPunchEvent {
  id: string;
  deviceId: string;
  biometricUserId: string;
  userName: string;
  role: string;
  punchTime: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
}

export const biometricDevicesData: BiometricDevice[] = [
  {
    id: 'bio-dev-01',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
    name: 'School Gate #1 Turnstile Ingress',
    ipAddress: '192.168.10.45',
    port: 4370,
    protocol: 'MQTT',
    status: 'ONLINE',
    lastHeartbeat: new Date().toISOString(),
    cachedPunchCount: 0,
  },
  {
    id: 'bio-dev-02',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    name: 'College Production Kitchen Biometric',
    ipAddress: '192.168.20.12',
    port: 4370,
    protocol: 'WEBSOCKET',
    status: 'ONLINE',
    lastHeartbeat: new Date().toISOString(),
    cachedPunchCount: 0,
  },
];

export const rawPunchesData: RawPunchEvent[] = [
  {
    id: 'punch-01',
    deviceId: 'bio-dev-01',
    biometricUserId: 'EMP-1002',
    userName: 'Principal Sunita Kulkarni',
    role: 'STAFF',
    punchTime: '2026-10-21T07:48:12Z',
    type: 'CHECK_IN',
  },
  {
    id: 'punch-02',
    deviceId: 'bio-dev-02',
    biometricUserId: 'EMP-2005',
    userName: 'Chef Sanjeev Menon',
    role: 'STAFF',
    punchTime: '2026-10-21T08:02:45Z',
    type: 'CHECK_IN',
  },
];

// ==============================================================================
// 6. HR, LEAVES & MONTHLY PAYROLL
// ==============================================================================

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  branchName: string;
  basicSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  panNo: string;
  pfNo: string;
  joinDate: string;
}

export interface LeaveRecord {
  id: string;
  empId: string;
  empName: string;
  leaveType: 'CASUAL' | 'MEDICAL' | 'EARNED';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  processedDate: string;
  employeeCount: number;
}

export const employeesData: Employee[] = [
  {
    id: 'emp-01',
    empCode: 'EMP-SCH-001',
    name: 'Sunita Kulkarni',
    email: 'principal.school@trustedu.org',
    phone: '+91 98221 00001',
    designation: 'School Principal',
    department: 'Administration & Academics',
    branchName: 'Modern Public School And Junior College Bhose',
    basicSalary: 45000,
    hra: 15000,
    da: 8000,
    specialAllowance: 7000,
    panNo: 'ABCDE1234F',
    pfNo: 'MH/PUN/0012345/001',
    joinDate: '2020-04-01',
  },
  {
    id: 'emp-02',
    empCode: 'EMP-HM-002',
    name: 'Chef Sanjeev Menon',
    email: 'director.hm@trustedu.org',
    phone: '+91 98221 00002',
    designation: 'Director & Executive Chef',
    department: 'Culinary Arts & Food Production',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
    basicSalary: 60000,
    hra: 20000,
    da: 10000,
    specialAllowance: 15000,
    panNo: 'FGHIJ5678K',
    pfNo: 'MH/PUN/0012345/002',
    joinDate: '2019-06-15',
  },
];

export const leavesData: LeaveRecord[] = [
  {
    id: 'leave-01',
    empId: 'emp-02',
    empName: 'Chef Sanjeev Menon',
    leaveType: 'CASUAL',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    days: 2,
    reason: 'Attending National Culinary Masterclass & Jury Panel',
    status: 'APPROVED',
  },
];

export const payrollRunsData: PayrollRun[] = [
  {
    id: 'pay-2026-09',
    month: 9,
    year: 2026,
    totalGross: 180000,
    totalDeductions: 24200,
    totalNet: 155800,
    processedDate: '2026-09-30',
    employeeCount: 2,
  },
];

// ==============================================================================
// 7. TIMETABLE & CLASSROOMS
// ==============================================================================

export interface TimetableSlotItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  divisionId: string;
  divisionName: string;
}

export const timetableSlotsData: TimetableSlotItem[] = [
  {
    id: 'tt-slot-01',
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Science & Physics',
    teacherId: 'emp-01',
    teacherName: 'Principal Sunita Kulkarni',
    roomId: 'room-301',
    roomName: 'Science Lab 301',
    divisionId: 'div-7a',
    divisionName: 'Class 7-A',
  },
  {
    id: 'tt-slot-02',
    dayOfWeek: 'MONDAY',
    startTime: '10:00',
    endTime: '12:00',
    subject: 'Continental Cuisine Practical',
    teacherId: 'emp-02',
    teacherName: 'Chef Sanjeev Menon',
    roomId: 'room-btk',
    roomName: 'Basic Training Kitchen (BTK)',
    divisionId: 'div-hm-sem3',
    divisionName: 'B.Sc H&HA Sem 3',
  },
];

// ==============================================================================
// 8. CAMPUS AUXILIARY OPERATIONS (Library, Hostel, Transport, Inventory, Visitor)
// ==============================================================================

export interface LibraryBook {
  id: string;
  isbn: string;
  barcode: string;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface VisitorGatePass {
  id: string;
  passNumber: string;
  visitorName: string;
  phone: string;
  purpose: string;
  whomToMeet: string;
  inTime: string;
  outTime?: string;
  status: 'INSIDE_CAMPUS' | 'EXITED';
  photoUrl?: string;
}

export interface InventoryItemRecord {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
}

export const libraryBooksData: LibraryBook[] = [
  {
    id: 'book-01',
    isbn: '978-0131103627',
    barcode: 'LIB-BK-1001',
    title: 'The C Programming Language & Computer Architecture',
    author: 'Brian Kernighan & Dennis Ritchie',
    totalCopies: 10,
    availableCopies: 7,
    shelfLocation: 'Rack B - Shelf 3',
  },
  {
    id: 'book-02',
    isbn: '978-0471292777',
    barcode: 'LIB-BK-2002',
    title: 'Professional Cooking & Master Kitchen Techniques',
    author: 'Wayne Gisslen',
    totalCopies: 15,
    availableCopies: 12,
    shelfLocation: 'Culinary Library - Shelf 1',
  },
];

export const visitorGatePassesData: VisitorGatePass[] = [
  {
    id: 'gp-001',
    passNumber: 'GP-2026-0042',
    visitorName: 'Mahesh Sharma',
    phone: '+91 98229 44112',
    purpose: 'Admission Enquiry for Daughter in 8th Standard',
    whomToMeet: 'Admission Officer / Principal',
    inTime: '2026-10-21T10:15:00Z',
    status: 'INSIDE_CAMPUS',
  },
];

export const inventoryItemsData: InventoryItemRecord[] = [
  { id: 'inv-01', itemCode: 'KIT-KNIFE-01', name: 'Master Chef 8-inch French Chef Knife', category: 'Kitchen Equipment', stock: 45, unit: 'PCS' },
  { id: 'inv-02', itemCode: 'STAT-A4-02', name: 'A4 Printing Paper Cartons (75 GSM)', category: 'Stationery', stock: 120, unit: 'REAMS' },
];

// ==============================================================================
// 9. COMMUNICATION & NOTICE BOARD
// ==============================================================================

export interface WhatsAppLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: string;
}

export interface NoticePost {
  id: string;
  title: string;
  content: string;
  targetRoles: string[];
  postedBy: string;
  publishedAt: string;
  isUrgent: boolean;
}

export const whatsAppLogsData: WhatsAppLog[] = [
  {
    id: 'wa-001',
    recipientPhone: '+91 98230 11223',
    recipientName: 'Ramesh Sharma (Parent)',
    templateName: 'fee_due_alert',
    message: 'Dear Ramesh, Aarav has an upcoming 2nd installment due of Rs 12,000 for Class 7-A. Click here to pay via UPI: https://trustedu.org/pay/stu-s01',
    status: 'DELIVERED',
    sentAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'wa-002',
    recipientPhone: '+91 98230 44556',
    recipientName: 'Bhavesh Patel (Parent)',
    templateName: 'attendance_daily_alert',
    message: 'Dear Bhavesh, Ananya Patel has been marked PRESENT at Modern Public School Bhose at 07:55 AM.',
    status: 'DELIVERED',
    sentAt: '2026-10-21T08:05:00Z',
  },
];

export const noticePostsData: NoticePost[] = [
  {
    id: 'notice-01',
    title: '🏆 Annual Inter-Trust Sports & Culinary Championship 2026',
    content: 'All schools and colleges under Zep Foundation Bhose are invited to submit student participation lists by Friday.',
    targetRoles: ['SUPERADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    postedBy: 'Dr. Rajesh Patil (Trust Chairman)',
    publishedAt: '2026-10-18T10:00:00Z',
    isUrgent: true,
  },
  {
    id: 'notice-02',
    title: '📢 Diwali Vacation & Academic Examination Schedule Notice',
    content: 'School and College mid-term exams conclude on Oct 28. Trust institutions remain closed from Nov 01 to Nov 10 for Diwali.',
    targetRoles: ['TEACHER', 'STUDENT', 'PARENT'],
    postedBy: 'Principal Sunita Kulkarni',
    publishedAt: '2026-10-20T11:30:00Z',
    isUrgent: false,
  },
];
