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

export interface ExamSeatingAllocationRecord {
  id: string;
  examName: string;
  subject: string;
  subjectCode?: string;
  examDate: string;
  examTime: string;
  roomNo: string;
  blockNo?: string;
  invigilatorName?: string;
  srNo: number;
  rollNo: string;
  studentName: string;
  admissionNo?: string;
  hallTicketNo: string;
  benchNo: string;
  classOrGrade: string;
  branchName?: string;
  attendanceStatus?: 'PRESENT' | 'ABSENT' | 'ALLOCATED';
  notes?: string;
}

export const examSeatingData: ExamSeatingAllocationRecord[] = [
  {
    id: 'seat-alloc-01',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Science & Thermal Thermodynamics',
    subjectCode: 'SCI-301',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 1,
    rollNo: '7A-01',
    studentName: 'Aarav Sharma',
    admissionNo: 'SCH-2026-001',
    hallTicketNo: 'HT-2026-101',
    benchNo: 'Bench 01-A (Window)',
    classOrGrade: 'Class 10-A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
    notes: 'Standard seat allocation',
  },
  {
    id: 'seat-alloc-02',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Culinary Fundamentals & Food Chemistry',
    subjectCode: 'HM-201',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 2,
    rollNo: 'HM-101',
    studentName: 'Kabir Verma',
    admissionNo: 'HM-2026-101',
    hallTicketNo: 'HT-2026-102',
    benchNo: 'Bench 01-B (Aisle)',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
    notes: 'Interleaved college candidate',
  },
  {
    id: 'seat-alloc-03',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Science & Thermal Thermodynamics',
    subjectCode: 'SCI-301',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 3,
    rollNo: '7A-02',
    studentName: 'Ananya Patel',
    admissionNo: 'SCH-2026-002',
    hallTicketNo: 'HT-2026-103',
    benchNo: 'Bench 02-A (Window)',
    classOrGrade: 'Class 10-A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
    notes: 'Standard seat allocation',
  },
  {
    id: 'seat-alloc-04',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Culinary Fundamentals & Food Chemistry',
    subjectCode: 'HM-201',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 4,
    rollNo: 'HM-102',
    studentName: 'Pooja Kulkarni',
    admissionNo: 'HM-2026-102',
    hallTicketNo: 'HT-2026-104',
    benchNo: 'Bench 02-B (Aisle)',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
    notes: 'Interleaved college candidate',
  },
  {
    id: 'seat-alloc-05',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Science & Thermal Thermodynamics',
    subjectCode: 'SCI-301',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 5,
    rollNo: '7A-03',
    studentName: 'Rohan Deshmukh',
    admissionNo: 'SCH-2026-003',
    hallTicketNo: 'HT-2026-105',
    benchNo: 'Bench 03-A (Window)',
    classOrGrade: 'Class 10-A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-06',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Culinary Fundamentals & Food Chemistry',
    subjectCode: 'HM-201',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 6,
    rollNo: 'HM-103',
    studentName: 'Aditya Mane',
    admissionNo: 'HM-2026-103',
    hallTicketNo: 'HT-2026-106',
    benchNo: 'Bench 03-B (Aisle)',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-07',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Science & Thermal Thermodynamics',
    subjectCode: 'SCI-301',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 7,
    rollNo: '7A-04',
    studentName: 'Diya Joshi',
    admissionNo: 'SCH-2026-004',
    hallTicketNo: 'HT-2026-107',
    benchNo: 'Bench 04-A (Window)',
    classOrGrade: 'Class 10-A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-08',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Culinary Fundamentals & Food Chemistry',
    subjectCode: 'HM-201',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 8,
    rollNo: 'HM-104',
    studentName: 'Sneha Patil',
    admissionNo: 'HM-2026-104',
    hallTicketNo: 'HT-2026-108',
    benchNo: 'Bench 04-B (Aisle)',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-09',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Science & Thermal Thermodynamics',
    subjectCode: 'SCI-301',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 9,
    rollNo: '01',
    studentName: 'Aafan Ali A',
    admissionNo: 'ADM-2026-000285',
    hallTicketNo: 'HT-2026-109',
    benchNo: 'Bench 05-A (Window)',
    classOrGrade: 'STD 8 - Division A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-10',
    examName: 'Term-End Examination (October 2026)',
    subject: 'Culinary Fundamentals & Food Chemistry',
    subjectCode: 'HM-201',
    examDate: '2026-10-28',
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    srNo: 10,
    rollNo: 'HM-105',
    studentName: 'Vikram Shinde',
    admissionNo: 'HM-2026-105',
    hallTicketNo: 'HT-2026-110',
    benchNo: 'Bench 05-B (Aisle)',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-11',
    examName: 'Annual Board Examination 2026',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MTH-102',
    examDate: '2026-10-29',
    examTime: '02:00 PM - 05:00 PM (Afternoon Session)',
    roomNo: 'Hall 104 - Junior Wing',
    blockNo: 'Block A',
    invigilatorName: 'Mrs. Anjali Deshmukh',
    srNo: 1,
    rollNo: '10A-01',
    studentName: 'Aarav Sharma',
    admissionNo: 'SCH-2026-001',
    hallTicketNo: 'HT-2026-201',
    benchNo: 'Desk 01-A',
    classOrGrade: 'Class 10-A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-12',
    examName: 'Annual Board Examination 2026',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MTH-102',
    examDate: '2026-10-29',
    examTime: '02:00 PM - 05:00 PM (Afternoon Session)',
    roomNo: 'Hall 104 - Junior Wing',
    blockNo: 'Block A',
    invigilatorName: 'Mrs. Anjali Deshmukh',
    srNo: 2,
    rollNo: '10B-01',
    studentName: 'Sameer Shaikh',
    admissionNo: 'SCH-2026-005',
    hallTicketNo: 'HT-2026-202',
    benchNo: 'Desk 01-B',
    classOrGrade: 'Class 10-B',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-13',
    examName: 'Annual Board Examination 2026',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MTH-102',
    examDate: '2026-10-29',
    examTime: '02:00 PM - 05:00 PM (Afternoon Session)',
    roomNo: 'Hall 104 - Junior Wing',
    blockNo: 'Block A',
    invigilatorName: 'Mrs. Anjali Deshmukh',
    srNo: 3,
    rollNo: '10A-02',
    studentName: 'Ananya Patel',
    admissionNo: 'SCH-2026-002',
    hallTicketNo: 'HT-2026-203',
    benchNo: 'Desk 02-A',
    classOrGrade: 'Class 10-A',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-14',
    examName: 'Annual Board Examination 2026',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MTH-102',
    examDate: '2026-10-29',
    examTime: '02:00 PM - 05:00 PM (Afternoon Session)',
    roomNo: 'Hall 104 - Junior Wing',
    blockNo: 'Block A',
    invigilatorName: 'Mrs. Anjali Deshmukh',
    srNo: 4,
    rollNo: '10B-02',
    studentName: 'Priya Shirodkar',
    admissionNo: 'SCH-2026-006',
    hallTicketNo: 'HT-2026-204',
    benchNo: 'Desk 02-B',
    classOrGrade: 'Class 10-B',
    branchName: 'Saraswati International Public School',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-15',
    examName: 'Semester Final Assessment - Culinary Arts',
    subject: 'Food Production & Bakery Technology',
    subjectCode: 'HM-301',
    examDate: '2026-10-30',
    examTime: '09:30 AM - 12:30 PM (Morning Practical)',
    roomNo: 'Basic Training Kitchen Hall',
    blockNo: 'BTK Wing',
    invigilatorName: 'Chef Sanjeev Patil',
    srNo: 1,
    rollNo: 'HM-101',
    studentName: 'Kabir Verma',
    admissionNo: 'HM-2026-101',
    hallTicketNo: 'HT-2026-301',
    benchNo: 'Workstation 01',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-16',
    examName: 'Semester Final Assessment - Culinary Arts',
    subject: 'Food Production & Bakery Technology',
    subjectCode: 'HM-301',
    examDate: '2026-10-30',
    examTime: '09:30 AM - 12:30 PM (Morning Practical)',
    roomNo: 'Basic Training Kitchen Hall',
    blockNo: 'BTK Wing',
    invigilatorName: 'Chef Sanjeev Patil',
    srNo: 2,
    rollNo: 'HM-102',
    studentName: 'Pooja Kulkarni',
    admissionNo: 'HM-2026-102',
    hallTicketNo: 'HT-2026-302',
    benchNo: 'Workstation 02',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
  },
  {
    id: 'seat-alloc-17',
    examName: 'Semester Final Assessment - Culinary Arts',
    subject: 'Food Production & Bakery Technology',
    subjectCode: 'HM-301',
    examDate: '2026-10-30',
    examTime: '09:30 AM - 12:30 PM (Morning Practical)',
    roomNo: 'Basic Training Kitchen Hall',
    blockNo: 'BTK Wing',
    invigilatorName: 'Chef Sanjeev Patil',
    srNo: 3,
    rollNo: 'HM-103',
    studentName: 'Aditya Mane',
    admissionNo: 'HM-2026-103',
    hallTicketNo: 'HT-2026-303',
    benchNo: 'Workstation 03',
    classOrGrade: 'B.Sc HM Semester 3',
    branchName: 'Modern College of Hotel Management and Technology',
    attendanceStatus: 'ALLOCATED',
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

// ============================================================================
// Classroom & Class Teacher Allocation
// ============================================================================
export interface ClassroomAllocationRecord {
  id: string;
  branchScope: 'SCHOOL' | 'COLLEGE';
  branchId: string;
  academicYear: string;
  classroomId: string;
  classroomName: string;
  roomCode: string;
  wing: string;
  floor: string;
  capacity: number;
  classOrGrade: string;
  division?: string;
  enrolledStudentsCount: number;
  teacherId: string;
  teacherName: string;
  teacherEmail?: string;
  teacherPhone?: string;
  teacherDesignation?: string;
  specializationSubject?: string;
  coTeacherId?: string;
  coTeacherName?: string;
  coTeacherSubject?: string;
  responsibilities: string[];
  classTeacherMeetingHours?: string;
  status: 'ACTIVE' | 'SUBSTITUTE' | 'VACANT';
  assignedDate: string;
  remarks?: string;
}

export function getInitialClassroomAllocations(): ClassroomAllocationRecord[] {
  return [
    {
      id: 'alloc-rm-01',
      branchScope: 'SCHOOL',
      branchId: 'branch-sch-01',
      academicYear: '2026-2027',
      classroomId: 'rm-sch-101',
      classroomName: 'Room 101 (Smart Interactive Board)',
      roomCode: 'SCH-101',
      wing: 'North Wing',
      floor: '1st Floor',
      capacity: 45,
      classOrGrade: 'Class 7-A',
      division: 'A',
      enrolledStudentsCount: 38,
      teacherId: 'tch-sch-02',
      teacherName: 'Rajendra Patil',
      teacherEmail: 'rajendra.patil@mpsbhose.edu.in',
      teacherPhone: '+91 98220 11002',
      teacherDesignation: 'Trained Graduate Teacher (TGT Secondary)',
      specializationSubject: 'Social Sciences & Marathi',
      coTeacherId: 'tch-sch-04',
      coTeacherName: 'Vikram Shinde',
      coTeacherSubject: 'Physical Education & Athletics',
      responsibilities: [
        'Daily Roll Call Attendance Signoff',
        'Report Card & Marksheet Signoff',
        'Discipline & Conduct Records',
        'Parent-Teacher Association Liaison',
        'Room Smart Board Asset Custody',
      ],
      classTeacherMeetingHours: '08:30 AM - 09:00 AM (Zero Period)',
      status: 'ACTIVE',
      assignedDate: '2026-06-15',
      remarks: 'Primary high school division with 100% digital podium utilization.',
    },
    {
      id: 'alloc-rm-02',
      branchScope: 'SCHOOL',
      branchId: 'branch-sch-01',
      academicYear: '2026-2027',
      classroomId: 'rm-sch-201',
      classroomName: 'Room 201 (Senior Secondary Wing)',
      roomCode: 'SCH-201',
      wing: 'South Wing',
      floor: '2nd Floor',
      capacity: 50,
      classOrGrade: 'Class 10-A',
      division: 'A',
      enrolledStudentsCount: 42,
      teacherId: 'tch-sch-01',
      teacherName: 'Sunita Kulkarni',
      teacherEmail: 'sunita.kulkarni@mpsbhose.edu.in',
      teacherPhone: '+91 98220 11001',
      teacherDesignation: 'Principal & Senior Physics Faculty',
      specializationSubject: 'Science & Thermal Thermodynamics',
      coTeacherId: 'tch-sch-03',
      coTeacherName: 'Neha Joshi',
      coTeacherSubject: 'Mathematics & Analytical Geometry',
      responsibilities: [
        'Board Exam Counseling & Guidance',
        'Daily Roll Call Attendance Signoff',
        'Conduct Evaluation for Leaving Certificate',
        'Parent Liaison for Career Guidance',
      ],
      classTeacherMeetingHours: '08:15 AM - 08:45 AM (Morning Briefing)',
      status: 'ACTIVE',
      assignedDate: '2026-06-15',
      remarks: 'SSC Board Appearing Class. Rigorous weekly assessment monitoring.',
    },
    {
      id: 'alloc-rm-03',
      branchScope: 'SCHOOL',
      branchId: 'branch-sch-01',
      academicYear: '2026-2027',
      classroomId: 'rm-sch-102',
      classroomName: 'Room 102 (Smart Interactive Board)',
      roomCode: 'SCH-102',
      wing: 'North Wing',
      floor: '1st Floor',
      capacity: 45,
      classOrGrade: 'Class 8-A',
      division: 'A',
      enrolledStudentsCount: 35,
      teacherId: 'tch-sch-03',
      teacherName: 'Neha Joshi',
      teacherEmail: 'neha.joshi@mpsbhose.edu.in',
      teacherPhone: '+91 98220 11003',
      teacherDesignation: 'Senior Faculty (Mathematics)',
      specializationSubject: 'Mathematics & Geometry',
      responsibilities: [
        'Daily Roll Call Attendance Signoff',
        'Mathematics Remedial Clinic',
        'Report Card Generation',
      ],
      classTeacherMeetingHours: '08:30 AM - 09:00 AM (Zero Period)',
      status: 'ACTIVE',
      assignedDate: '2026-06-15',
      remarks: 'Active STEM group.',
    },
    {
      id: 'alloc-rm-04',
      branchScope: 'COLLEGE',
      branchId: 'branch-hm-01',
      academicYear: '2026-2027',
      classroomId: 'lab-col-btk',
      classroomName: 'Basic Training Kitchen (BTK)',
      roomCode: 'COL-BTK-01',
      wing: 'Culinary Block',
      floor: 'Ground Floor',
      capacity: 24,
      classOrGrade: 'B.Sc in Hospitality Studies - Semester 1',
      division: 'Batch A',
      enrolledStudentsCount: 22,
      teacherId: 'tch-col-01',
      teacherName: 'Chef Anand Deshpande',
      teacherEmail: 'culinary@mchmtsolapur.edu.in',
      teacherPhone: '+91 98220 22001',
      teacherDesignation: 'Executive Chef Instructor (Culinary Arts)',
      specializationSubject: 'Culinary Arts & Basic Food Production',
      responsibilities: [
        'HACCP Food Safety & Hygiene Compliance',
        'Daily Culinary Lab Attendance & Chef Kit Checks',
        'Practical Assessment Log Signoff',
        'Industry Internship Preparation',
      ],
      classTeacherMeetingHours: '09:00 AM - 09:30 AM (Kitchen Briefing & Grooming Inspection)',
      status: 'ACTIVE',
      assignedDate: '2026-07-01',
      remarks: 'Individual induction range and cutlery locker allocation active.',
    },
    {
      id: 'alloc-rm-05',
      branchScope: 'COLLEGE',
      branchId: 'branch-hm-01',
      academicYear: '2026-2027',
      classroomId: 'lab-col-bakery',
      classroomName: 'European Bakery & Patisserie Studio',
      roomCode: 'COL-BAK-04',
      wing: 'Culinary Block',
      floor: '1st Floor',
      capacity: 24,
      classOrGrade: 'Diploma in Bakery, Confectionery & Pastry Arts',
      division: 'Batch A',
      enrolledStudentsCount: 20,
      teacherId: 'tch-col-02',
      teacherName: 'Chef Meera Jadhav',
      teacherEmail: 'bakery@mchmtsolapur.edu.in',
      teacherPhone: '+91 98220 22002',
      teacherDesignation: 'Head of Department - Bakery & Pastry Arts',
      specializationSubject: 'Pastry Arts & Viennoiserie',
      responsibilities: [
        'Commercial Deck Oven & Proving Chamber Oversight',
        'Raw Material & Ingredient Issue Signoff',
        'Student Practical Marksheet Verification',
      ],
      classTeacherMeetingHours: '09:00 AM - 09:30 AM (Bakery Briefing)',
      status: 'ACTIVE',
      assignedDate: '2026-07-01',
      remarks: 'Specialized pastry laboratory with temperature controlled room.',
    },
    {
      id: 'alloc-rm-06',
      branchScope: 'SCHOOL',
      branchId: 'branch-sch-01',
      academicYear: '2026-2027',
      classroomId: 'rm-sch-sci',
      classroomName: 'C.V. Raman Integrated Science Lab',
      roomCode: 'SCH-SCI-LAB',
      wing: 'East Wing',
      floor: '2nd Floor',
      capacity: 40,
      classOrGrade: 'Class 9-A (Science Practical Batch)',
      division: 'A',
      enrolledStudentsCount: 0,
      teacherId: '',
      teacherName: 'Unassigned',
      responsibilities: [
        'Chemical Reagent Safety Custody',
        'Lab Equipment Verification',
      ],
      status: 'VACANT',
      assignedDate: '2026-06-15',
      remarks: 'Awaiting class teacher appointment for academic term.',
    },
  ];
}

export let classroomAllocationsData: ClassroomAllocationRecord[] = getInitialClassroomAllocations();

export function resetClassroomAllocations(): void {
  classroomAllocationsData = getInitialClassroomAllocations();
}

// ============================================================================
// 12. MULTI-LINGUAL QUESTION BANK & QUESTION PAPER GENERATOR
// Supports Mathematics (LaTeX/Symbols), Marathi (मराठी), Hindi (हिंदी), English
// ============================================================================

export interface BankQuestion {
  id: string;
  code: string;
  subject: string;
  subjectCode: string;
  gradeOrClass: string;
  branchScope: 'SCHOOL' | 'COLLEGE';
  chapterTopic: string;
  language: 'ENGLISH' | 'MARATHI' | 'HINDI' | 'BILINGUAL_EN_MR' | 'BILINGUAL_EN_HI';
  questionType: 'MCQ' | 'SHORT' | 'LONG' | 'NUMERICAL_MATH' | 'TRUE_FALSE' | 'DIAGRAM';
  marks: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE';
  questionText: string;
  questionTextSecondary?: string;
  options?: string[];
  correctAnswer: string;
  solutionExplanation?: string;
  formulaUsed?: string;
  tags: string[];
  createdAt: string;
}

export interface QuestionPaperSection {
  sectionName: string;
  sectionInstructions?: string;
  targetMarks: number;
  questionIds: string[];
}

export interface QuestionPaperRecord {
  id: string;
  paperCode: string;
  title: string;
  subject: string;
  gradeOrClass: string;
  branchScope: 'SCHOOL' | 'COLLEGE';
  language: 'ENGLISH' | 'MARATHI' | 'HINDI' | 'BILINGUAL';
  academicYear: string;
  maxMarks: number;
  timeAllowedMinutes: number;
  generalInstructions: string[];
  sections: QuestionPaperSection[];
  questions: BankQuestion[];
  status: 'DRAFT' | 'FINALIZED' | 'PUBLISHED';
  createdDate: string;
  authorTeacher: string;
}

export function getInitialQuestionBank(): BankQuestion[] {
  return [
    // ------------------------------------------------------------------------
    // MATHEMATICS & GEOMETRY (Class 10 & 12)
    // ------------------------------------------------------------------------
    {
      id: 'qb-math-01',
      code: 'MATH-10-Q01',
      subject: 'Mathematics & Analytical Geometry',
      subjectCode: 'MATH-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'Quadratic Equations (वर्गसमीकरणे)',
      language: 'ENGLISH',
      questionType: 'NUMERICAL_MATH',
      marks: 4,
      difficulty: 'MEDIUM',
      bloomLevel: 'APPLY',
      questionText: 'Solve the quadratic equation: 2x² - 7x + 3 = 0 using the standard quadratic formula. Show the discriminant calculation Δ = b² - 4ac and find the two distinct real roots.',
      formulaUsed: 'x = (-b ± √(b² - 4ac)) / (2a)',
      correctAnswer: 'Roots are x = 3 and x = 1/2',
      solutionExplanation: 'Here a=2, b=-7, c=3. Discriminant Δ = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0. Hence x = (7 ± √25) / (2 × 2) = (7 ± 5) / 4. For (+): x = 12/4 = 3. For (-): x = 2/4 = 1/2.',
      tags: ['QuadraticFormula', 'Algebra', 'BoardExam', 'Discriminant'],
      createdAt: '2026-10-15',
    },
    {
      id: 'qb-math-02',
      code: 'MATH-10-Q02',
      subject: 'Mathematics & Analytical Geometry',
      subjectCode: 'MATH-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'Trigonometry & Pythagoras Theorem',
      language: 'ENGLISH',
      questionType: 'SHORT',
      marks: 3,
      difficulty: 'EASY',
      bloomLevel: 'UNDERSTAND',
      questionText: 'In a right-angled triangle ABC, ∠B = 90°, side AB = 6 cm, and side BC = 8 cm. Using Pythagoras Theorem AC² = AB² + BC², calculate the hypotenuse AC. Hence determine the exact values of sin(A) and cos(A).',
      formulaUsed: 'AC² = AB² + BC², sin(A) = Opposite / Hypotenuse, cos(A) = Adjacent / Hypotenuse',
      correctAnswer: 'AC = 10 cm, sin(A) = 8/10 = 4/5 (0.8), cos(A) = 6/10 = 3/5 (0.6)',
      solutionExplanation: 'AC = √(6² + 8²) = √(36 + 64) = √100 = 10 cm. sin(A) = BC/AC = 8/10 = 4/5. cos(A) = AB/AC = 6/10 = 3/5.',
      tags: ['Trigonometry', 'Pythagoras', 'Class10'],
      createdAt: '2026-10-15',
    },
    {
      id: 'qb-math-03',
      code: 'MATH-10-Q03',
      subject: 'Mathematics & Analytical Geometry',
      subjectCode: 'MATH-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'Mensuration & Surface Areas',
      language: 'ENGLISH',
      questionType: 'MCQ',
      marks: 1,
      difficulty: 'EASY',
      bloomLevel: 'REMEMBER',
      questionText: 'What is the curved surface area (CSA) of a right circular cone having base radius r = 7 cm and slant height l = 10 cm? (Use π = 22/7)',
      formulaUsed: 'CSA = π × r × l',
      options: [
        'A) 220 cm²',
        'B) 440 cm²',
        'C) 154 cm²',
        'D) 700 cm²',
      ],
      correctAnswer: 'A) 220 cm²',
      solutionExplanation: 'CSA = (22/7) × 7 × 10 = 22 × 10 = 220 cm².',
      tags: ['Mensuration', 'MCQ', 'Geometry'],
      createdAt: '2026-10-15',
    },
    {
      id: 'qb-math-04',
      code: 'MATH-12-Q04',
      subject: 'Mathematics & Analytical Geometry',
      subjectCode: 'MATH-12',
      gradeOrClass: 'Class 12-Science',
      branchScope: 'SCHOOL',
      chapterTopic: 'Definite Integration & Calculus',
      language: 'ENGLISH',
      questionType: 'NUMERICAL_MATH',
      marks: 4,
      difficulty: 'HARD',
      bloomLevel: 'ANALYZE',
      questionText: 'Evaluate the definite integral: I = ∫₀² (3x² - 4x + 5) dx. Show all antiderivative terms and apply the Fundamental Theorem of Calculus.',
      formulaUsed: '∫ xⁿ dx = xⁿ⁺¹ / (n + 1), I = [F(b) - F(a)]',
      correctAnswer: 'I = 10',
      solutionExplanation: 'Antiderivative F(x) = x³ - 2x² + 5x. Upper limit F(2) = 2³ - 2(2)² + 5(2) = 8 - 8 + 10 = 10. Lower limit F(0) = 0. Therefore I = 10 - 0 = 10.',
      tags: ['Calculus', 'Integration', 'SeniorSecondary'],
      createdAt: '2026-10-16',
    },

    // ------------------------------------------------------------------------
    // MARATHI (मराठी भाषा व व्याकरण)
    // ------------------------------------------------------------------------
    {
      id: 'qb-mar-01',
      code: 'MAR-10-Q01',
      subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
      subjectCode: 'MAR-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'मराठी व्याकरण - प्रयोग विचार (Marathi Grammar)',
      language: 'MARATHI',
      questionType: 'MCQ',
      marks: 1,
      difficulty: 'MEDIUM',
      bloomLevel: 'UNDERSTAND',
      questionText: 'खालील वाक्यातील योग्य "प्रयोग" ओळखा: "रामाने रावणास मारले."',
      options: [
        'A) कर्तरी प्रयोग (Subjective Construction)',
        'B) कर्मणी प्रयोग (Objective Construction)',
        'C) भावे प्रयोग (Neutral Construction)',
        'D) कर्मकर्तरी प्रयोग',
      ],
      correctAnswer: 'C) भावे प्रयोग (Neutral Construction)',
      solutionExplanation: 'या वाक्यात कर्त्याला (रामाने) व कर्माला (रावणास) प्रत्यय असून क्रियापद तृतीयपुरुषी, नपुंसकलिंगी, एकवचनी (मारले) आहे. म्हणून हा भावे प्रयोग आहे.',
      tags: ['मराठी', 'व्याकरण', 'प्रयोग', 'SSC-Board'],
      createdAt: '2026-10-16',
    },
    {
      id: 'qb-mar-02',
      code: 'MAR-10-Q02',
      subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
      subjectCode: 'MAR-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'मराठी शब्दसंग्रह - म्हणी व वाक्प्रचार',
      language: 'MARATHI',
      questionType: 'SHORT',
      marks: 2,
      difficulty: 'EASY',
      bloomLevel: 'REMEMBER',
      questionText: 'खालील म्हणीचा अचूक अर्थ स्पष्ट करा आणि स्वतःच्या वाक्यात उपयोग करा: "नाव मोठे लक्षण खोटे."',
      correctAnswer: 'अर्थ: बाह्य देखावा फार मोठा पण प्रत्यक्ष गुण किंवा वागणूक मात्र अगदी सामान्य असणे.',
      solutionExplanation: 'वाक्यात उपयोग: त्या नामांकित कोचिंग क्लासच्या भव्य जाहिराती होत्या, पण प्रत्यक्ष शिकवण्याची पातळी पाहून "नाव मोठे लक्षण खोटे" अशी अनुभूती आली.',
      tags: ['मराठी', 'म्हणी', 'वाक्प्रचार'],
      createdAt: '2026-10-16',
    },
    {
      id: 'qb-mar-03',
      code: 'MAR-10-Q03',
      subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
      subjectCode: 'MAR-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'मराठी व्याकरण - समास',
      language: 'MARATHI',
      questionType: 'SHORT',
      marks: 2,
      difficulty: 'MEDIUM',
      bloomLevel: 'APPLY',
      questionText: 'खालील सामासिक शब्दांचा विग्रह करून समासाचे नाव लिहा: (१) ज्ञानामृत (२) प्रतिदिन',
      correctAnswer: '(१) ज्ञानामृत = ज्ञान हेच अमृत (कर्मधारय समास), (२) प्रतिदिन = प्रत्येक दिवशी (अव्ययीभाव समास)',
      solutionExplanation: 'ज्ञानामृत मध्ये दोन्ही पदे एकाच विभक्तीत असून उपमेय-उपमान संबंध आहे (कर्मधारय). प्रतिदिन मध्ये पहिले पद अव्यय असून ते महत्त्वाचे आहे (अव्ययीभाव).',
      tags: ['मराठी', 'समास', 'व्याकरण'],
      createdAt: '2026-10-16',
    },
    {
      id: 'qb-mar-04',
      code: 'MAR-10-Q04',
      subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
      subjectCode: 'MAR-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'उपयोजित लेखन - निबंध लेखन (Essay Writing)',
      language: 'MARATHI',
      questionType: 'LONG',
      marks: 8,
      difficulty: 'HARD',
      bloomLevel: 'EVALUATE',
      questionText: 'खालीलपैकी कोणत्याही एका विषयावर सुमारे १५० ते २०० शब्दांत निबंध लिहा:\n(१) "माझे आवडते शास्त्रज्ञ - डॉ. ए. पी. जे. अब्दुल कलाम"\n(२) "पाण्याचे मोल व जलसंधारण: काळाची गरज"\n(३) "डिजिटल तंत्रज्ञान: शाप की वरदान?"',
      correctAnswer: 'मुद्देसूद मांडणी, भाषाशैली, प्रस्तावना, मध्य व निष्कर्ष या निकषांवर ८ गुणांचे मूल्यमापन करावे.',
      solutionExplanation: 'निबंधात विषयाचे महत्त्व, व्यक्तिमत्त्व पैलू किंवा समस्या व उपाय, समर्पक सुभाषिते व म्हणींचा वापर आणि प्रभावी समारोप असावा.',
      tags: ['मराठी', 'निबंध', 'उपयोजित-लेखन', 'BoardExam'],
      createdAt: '2026-10-16',
    },
    {
      id: 'qb-mar-math',
      code: 'MAR-MATH-05',
      subject: 'Mathematics & Analytical Geometry',
      subjectCode: 'MATH-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'भूमिती - त्रिकोणाचे क्षेत्रफळ (Geometry Marathi Medium)',
      language: 'MARATHI',
      questionType: 'NUMERICAL_MATH',
      marks: 3,
      difficulty: 'MEDIUM',
      bloomLevel: 'APPLY',
      questionText: 'एका काटकोन त्रिकोणात पाया b = १२ सेमी आणि उंची h = ५ सेमी असल्यास कर्णाची लांबी (c) आणि त्रिकोणाचे क्षेत्रफळ काढा. (पायथागोरस सूत्र: c² = a² + b²; क्षेत्रफळ = १/२ × पाया × उंची)',
      formulaUsed: 'कर्ण² = पाया² + उंची², क्षेत्रफळ = (१/२) × पाया × उंची',
      correctAnswer: 'कर्ण = १३ सेमी, क्षेत्रफळ = ३० चौ. सेमी',
      solutionExplanation: 'कर्ण = √(१२² + ५²) = √(१४४ + २५) = √१६९ = १३ सेमी. क्षेत्रफळ = १/२ × १२ × ५ = ६ × ५ = ३० चौ. सेमी.',
      tags: ['भूमिती', 'पायथागोरस', 'मराठी-माध्यम'],
      createdAt: '2026-10-16',
    },

    // ------------------------------------------------------------------------
    // HINDI (हिंदी राष्ट्रभाषा व साहित्य)
    // ------------------------------------------------------------------------
    {
      id: 'qb-hin-01',
      code: 'HIN-10-Q01',
      subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
      subjectCode: 'HIN-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'हिंदी व्याकरण - संधि एवं विच्छेद',
      language: 'HINDI',
      questionType: 'SHORT',
      marks: 2,
      difficulty: 'EASY',
      bloomLevel: 'UNDERSTAND',
      questionText: 'निम्नलिखित शब्दों का सही संधि-विच्छेद कीजिए और संधि का नाम बताइए:\n(१) पुस्तकालय = ______ + ______\n(२) सूर्योदय = ______ + ______',
      correctAnswer: '(१) पुस्तकालय = पुस्तक + आलय (दीर्घ स्वर संधि), (२) सूर्योदय = सूर्य + उदय (गुण स्वर संधि)',
      solutionExplanation: 'पुस्तक + आलय में अ + आ मिलकर "आ" बनता है (दीर्घ संधि)। सूर्य + उदय में अ + उ मिलकर "ओ" बनता है (गुण संधि)।',
      tags: ['हिंदी', 'व्याकरण', 'संधि', 'Class10'],
      createdAt: '2026-10-17',
    },
    {
      id: 'qb-hin-02',
      code: 'HIN-10-Q02',
      subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
      subjectCode: 'HIN-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'मुहावरे एवं लोकोक्तियाँ',
      language: 'HINDI',
      questionType: 'SHORT',
      marks: 3,
      difficulty: 'MEDIUM',
      bloomLevel: 'APPLY',
      questionText: 'निम्नलिखित मुहावरों का अर्थ लिखकर सार्थक वाक्यों में प्रयोग कीजिए:\n(१) आँखों का तारा होना\n(२) दाँतों तले उँगली दबाना',
      correctAnswer: '(१) अत्यधिक प्रिय होना, (२) आश्चर्यचकित होना বা स्तब्ध रह जाना',
      solutionExplanation: 'वाक्य प्रयोग: (१) राहुल अपने माता-पिता की आँखों का तारा है। (२) सर्कस के हैरतअंगेज़ करतब देखकर दर्शकों ने दाँतों तले उँगली दबा ली।',
      tags: ['हिंदी', 'मुहावरे', 'व्याकरण'],
      createdAt: '2026-10-17',
    },
    {
      id: 'qb-hin-03',
      code: 'HIN-10-Q03',
      subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
      subjectCode: 'HIN-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'पद्य साहित्य - कबीर के दोहे',
      language: 'HINDI',
      questionType: 'LONG',
      marks: 4,
      difficulty: 'MEDIUM',
      bloomLevel: 'ANALYZE',
      questionText: 'संत कबीरदास जी के निम्नलिखित दोहे का संदर्भ सहित भावार्थ स्पष्ट कीजिए:\n"बड़ा भया तो क्या भया, जैसे पेड़ खजूर।\nपंथी को छाया नहीं, फल लागै अति दूर॥"',
      correctAnswer: 'भावार्थ: केवल आकार या धन-दौलत से बड़ा होना व्यर्थ है यदि वह दूसरों के किसी काम न आए।',
      solutionExplanation: 'कबीरदास जी कहते हैं कि खजूर का पेड़ बहुत ऊँचा होता है, किंतु न तो वह थके हुए राही को छाया दे सकता है और न ही उसके फल आसानी से तोड़े जा सकते हैं। उसी प्रकार परोपकार और विनम्रता के बिना मनुष्य की महानता निरर्थक है।',
      tags: ['हिंदी', 'साहित्य', 'कबीर-दोहा', 'BoardExam'],
      createdAt: '2026-10-17',
    },
    {
      id: 'qb-hin-04',
      code: 'HIN-10-Q04',
      subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
      subjectCode: 'HIN-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'रचनात्मक लेखन - निबंध',
      language: 'HINDI',
      questionType: 'LONG',
      marks: 7,
      difficulty: 'HARD',
      bloomLevel: 'EVALUATE',
      questionText: 'निम्नलिखित में से किसी एक विषय पर १५० से २०० शब्दों में प्रभावशाली निबंध लिखिए:\n(१) पर्यावरण संरक्षण: समय की पुकार\n(२) मेरा भारत: महान विरासत और आधुनिक विकास\n(३) समय का सदुपयोग और विद्यार्थी जीवन',
      correctAnswer: 'प्रस्तावना, मुख्य विषय का विस्तार, उदाहरण, निष्कर्ष और शुद्ध वर्तनी के आधार पर ७ अंकों का मूल्यांकन करें।',
      solutionExplanation: 'निबंध में विषय वस्तु का स्पष्ट विश्लेषण, राष्ट्रीय व सामाजिक संदर्भ और प्रेरक उपसंहार अनिवार्य है।',
      tags: ['हिंदी', 'निबंध', 'BoardExam'],
      createdAt: '2026-10-17',
    },

    // ------------------------------------------------------------------------
    // SCIENCE & TECHNOLOGY (Physics & Chemistry Formulas)
    // ------------------------------------------------------------------------
    {
      id: 'qb-sci-01',
      code: 'SCI-10-Q01',
      subject: 'Science & Thermal Thermodynamics',
      subjectCode: 'SCI-10',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      chapterTopic: 'Electricity & Ohm\'s Law',
      language: 'ENGLISH',
      questionType: 'NUMERICAL_MATH',
      marks: 3,
      difficulty: 'MEDIUM',
      bloomLevel: 'APPLY',
      questionText: 'An electric iron of resistance R = 20 Ω takes a current of I = 5 A. Calculate the heat developed (H in Joules) in t = 30 seconds using Joule\'s Law of Heating: H = I² × R × t.',
      formulaUsed: 'H = I² × R × t',
      correctAnswer: 'H = 15,000 Joules (15 kJ)',
      solutionExplanation: 'H = (5)² × 20 × 30 = 25 × 20 × 30 = 500 × 30 = 15,000 J.',
      tags: ['Physics', 'Electricity', 'Formula', 'Class10'],
      createdAt: '2026-10-17',
    },

    // ------------------------------------------------------------------------
    // COLLEGE: HOTEL MANAGEMENT & CULINARY ARTS
    // ------------------------------------------------------------------------
    {
      id: 'qb-hm-01',
      code: 'HM-COL-Q01',
      subject: 'Food Production & Culinary Operations',
      subjectCode: 'HM-101',
      gradeOrClass: 'B.Sc in Hospitality Studies - Semester 1',
      branchScope: 'COLLEGE',
      chapterTopic: 'French Mother Sauces & Derivatives',
      language: 'ENGLISH',
      questionType: 'LONG',
      marks: 5,
      difficulty: 'MEDIUM',
      bloomLevel: 'UNDERSTAND',
      questionText: 'Enumerate the five classical French Mother Sauces (Grandes Sauces) codified by Auguste Escoffier. Specify the liquid base, thickening roux, and at least two daughter derivatives for Béchamel and Velouté.',
      correctAnswer: '1) Béchamel (Milk + White Roux; Derivatives: Mornay, Soubise), 2) Velouté (White Stock + Blond Roux; Derivatives: Supreme, Allemande), 3) Espagnole (Brown Stock + Brown Roux), 4) Tomato Sauce, 5) Hollandaise (Clarified Butter + Egg Yolk Emulsion).',
      solutionExplanation: 'Each sauce requires precise temperature control. Béchamel uses warm milk whisked into equal weight butter-flour roux.',
      tags: ['CulinaryArts', 'Escoffier', 'MotherSauces', 'BHM'],
      createdAt: '2026-10-18',
    },
    {
      id: 'qb-hm-02',
      code: 'HM-COL-Q02',
      subject: 'Food Production & Culinary Operations',
      subjectCode: 'HM-101',
      gradeOrClass: 'B.Sc in Hospitality Studies - Semester 1',
      branchScope: 'COLLEGE',
      chapterTopic: 'Kitchen Costing & Yield Mathematics',
      language: 'ENGLISH',
      questionType: 'NUMERICAL_MATH',
      marks: 4,
      difficulty: 'MEDIUM',
      bloomLevel: 'APPLY',
      questionText: 'In a 5-star hotel banquet kitchen, Opening Food Stock = ₹45,000, Monthly Food Purchases = ₹1,20,000, Closing Food Stock = ₹35,000, and Food Sales Revenue = ₹3,90,000. Calculate: (1) Cost of Food Consumed, and (2) Food Cost Percentage using the formula: Food Cost % = (Cost of Food Consumed / Food Sales) × 100.',
      formulaUsed: 'Cost of Food = Opening Stock + Purchases - Closing Stock; Food Cost % = (Cost / Revenue) × 100',
      correctAnswer: '(1) Cost of Food Consumed = ₹1,30,000, (2) Food Cost Percentage = 33.33%',
      solutionExplanation: 'Cost = ₹45,000 + ₹1,20,000 - ₹35,000 = ₹1,30,000. Food Cost % = (1,30,000 / 3,90,000) × 100 = 33.33%. Standard 5-star benchmark is 30-34%.',
      tags: ['KitchenCosting', 'Mathematics', 'HospitalityManagement'],
      createdAt: '2026-10-18',
    },
  ];
}

export function getInitialQuestionPapers(): QuestionPaperRecord[] {
  const bank = getInitialQuestionBank();
  return [
    {
      id: 'qp-ssc-math-01',
      paperCode: 'QP-SSC-2026-MATH',
      title: 'Term-End Board Examination 2026 - Mathematics & Geometry',
      subject: 'Mathematics & Analytical Geometry',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      language: 'ENGLISH',
      academicYear: '2026-2027',
      maxMarks: 40,
      timeAllowedMinutes: 120,
      generalInstructions: [
        'All questions are compulsory and carry specified marks.',
        'Draw neat and accurate geometric figures wherever necessary.',
        'Use of scientific calculators is strictly prohibited as per State Board norms.',
        'Marks on the right margin indicate full marks for that sub-question.',
      ],
      sections: [
        {
          sectionName: 'Section A - Objective & MCQs (4 Marks)',
          sectionInstructions: 'Choose the correct alternative for each question.',
          targetMarks: 4,
          questionIds: ['qb-math-03'],
        },
        {
          sectionName: 'Section B - Short Answer Conceptual Questions (12 Marks)',
          sectionInstructions: 'Solve any four questions with step-by-step working.',
          targetMarks: 12,
          questionIds: ['qb-math-02', 'qb-sci-01'],
        },
        {
          sectionName: 'Section C - Long Answer Problem Solving (24 Marks)',
          sectionInstructions: 'Show detailed algebraic solutions and quadratic formula deductions.',
          targetMarks: 24,
          questionIds: ['qb-math-01', 'qb-math-04'],
        },
      ],
      questions: bank.filter((q) => ['qb-math-03', 'qb-math-02', 'qb-math-01', 'qb-math-04'].includes(q.id)),
      status: 'PUBLISHED',
      createdDate: '2026-10-19',
      authorTeacher: 'Mrs. Neha Joshi (Senior Mathematics Faculty)',
    },
    {
      id: 'qp-ssc-mar-01',
      paperCode: 'QP-SSC-2026-MAR',
      title: 'सत्रान्त परीक्षा २०२६ - मराठी प्रथम भाषा व व्याकरण',
      subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      language: 'MARATHI',
      academicYear: '2026-2027',
      maxMarks: 80,
      timeAllowedMinutes: 180,
      generalInstructions: [
        'सर्व प्रश्न सोडवणे अनिवार्य आहे. उजवीकडील अंक पूर्ण गुण दर्शवितात.',
        'हस्ताक्षर सुवाच्य व व्याकरणदृष्ट्या शुद्ध असणे आवश्यक आहे.',
        'उपयोजित लेखनात दिलेल्या मुद्यांचा सविस्तर विचार करून निबंध व पत्र लिहावे.',
      ],
      sections: [
        {
          sectionName: 'विभाग १: गद्य व व्याकरण (Objective & Grammar)',
          targetMarks: 20,
          questionIds: ['qb-mar-01', 'qb-mar-02', 'qb-mar-03'],
        },
        {
          sectionName: 'विभाग २: उपयोजित लेखन व निबंध (Creative Writing)',
          targetMarks: 60,
          questionIds: ['qb-mar-04', 'qb-mar-math'],
        },
      ],
      questions: bank.filter((q) => q.language === 'MARATHI'),
      status: 'FINALIZED',
      createdDate: '2026-10-20',
      authorTeacher: 'श्री. राजेंद्र पाटील (वरिष्ठ मराठी शिक्षक)',
    },
    {
      id: 'qp-ssc-hin-01',
      paperCode: 'QP-SSC-2026-HIN',
      title: 'सत्रांत परीक्षा २०२६ - हिंदी द्वितीय भाषा (राष्ट्रभाषा)',
      subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
      gradeOrClass: 'Class 10-A',
      branchScope: 'SCHOOL',
      language: 'HINDI',
      academicYear: '2026-2027',
      maxMarks: 50,
      timeAllowedMinutes: 120,
      generalInstructions: [
        'सभी प्रश्न अनिवार्य हैं। यथासंभव सभी प्रश्नों के उत्तर क्रमानुसार लिखिए।',
        'वर्तनी की शुद्धता एवं स्पष्ट लिखावट पर विशेष ध्यान दें।',
        'प्रश्नों के अंक दाईं ओर अंकित हैं।',
      ],
      sections: [
        {
          sectionName: 'खंड क: भाषा अध्ययन एवं व्याकरण',
          targetMarks: 20,
          questionIds: ['qb-hin-01', 'qb-hin-02'],
        },
        {
          sectionName: 'खंड ख: पद्य साहित्य एवं रचनात्मक निबंध',
          targetMarks: 30,
          questionIds: ['qb-hin-03', 'qb-hin-04'],
        },
      ],
      questions: bank.filter((q) => q.language === 'HINDI'),
      status: 'PUBLISHED',
      createdDate: '2026-10-20',
      authorTeacher: 'श्रीमती सुनीता कुलकर्णी (मुख्याध्यापिका)',
    },
    {
      id: 'qp-col-hm-01',
      paperCode: 'QP-BHM-2026-CUL',
      title: 'B.Sc Hospitality Studies Semester 1 - Culinary Arts Theory Examination',
      subject: 'Food Production & Culinary Operations',
      gradeOrClass: 'B.Sc in Hospitality Studies - Semester 1',
      branchScope: 'COLLEGE',
      language: 'ENGLISH',
      academicYear: '2026-2027',
      maxMarks: 70,
      timeAllowedMinutes: 150,
      generalInstructions: [
        'Attempt all questions. Marks are indicated against each question.',
        'Write culinary terminology in standard French/English classical nomenclature.',
        'Show all calculations clearly for kitchen costing problems.',
      ],
      sections: [
        {
          sectionName: 'Section A - Classical Culinary Theory (35 Marks)',
          targetMarks: 35,
          questionIds: ['qb-hm-01'],
        },
        {
          sectionName: 'Section B - Kitchen Cost Control & Yield Calculations (35 Marks)',
          targetMarks: 35,
          questionIds: ['qb-hm-02'],
        },
      ],
      questions: bank.filter((q) => q.branchScope === 'COLLEGE'),
      status: 'FINALIZED',
      createdDate: '2026-10-21',
      authorTeacher: 'Chef Anand Deshpande (Executive Chef Instructor)',
    },
  ];
}

export let questionBankData: BankQuestion[] = getInitialQuestionBank();
export let questionPapersData: QuestionPaperRecord[] = getInitialQuestionPapers();

export function resetQuestionBankAndPapers(): void {
  questionBankData = getInitialQuestionBank();
  questionPapersData = getInitialQuestionPapers();
}

// ==============================================================================
// 12. PARENT-TEACHER MEETINGS (PTM) & NOTIFICATION DISPATCH
// ==============================================================================

export interface ParentMeetingRSVP {
  studentId: string;
  studentName: string;
  rollNo: string;
  gradeOrSemester: string;
  parentName: string;
  parentPhone: string;
  status: 'ATTENDING' | 'TENTATIVE' | 'CANNOT_ATTEND' | 'REQUEST_RESCHEDULE' | 'PENDING';
  respondedAt?: string;
  parentRemarks?: string;
  attended: boolean;
  teacherRemarks?: string;
}

export interface ParentMeetingRecord {
  id: string;
  meetingCode: string;
  branchScope: 'SCHOOL' | 'COLLEGE' | 'ALL';
  branchName: string;
  title: string;
  meetingType:
    | 'ACADEMIC_REVIEW'
    | 'DISCIPLINE_COUNSELING'
    | 'BOARD_EXAM_PREPARATION'
    | 'ANNUAL_PTA'
    | 'INTERNSHIP_PLACEMENT'
    | 'FEE_CLEARANCE'
    | 'GENERAL';
  targetAudienceType: 'ALL_CLASSES' | 'SPECIFIC_CLASSES' | 'INDIVIDUAL_STUDENTS';
  targetClasses: string[];
  targetStudentIds?: string[];
  meetingMode: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  onlineMeetingUrl?: string;
  teacherInCharge: string;
  teacherPhone: string;
  agenda: string[];
  notes?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notificationDispatch: {
    dispatched: boolean;
    dispatchedAt?: string;
    channels: ('IN_APP' | 'WHATSAPP' | 'SMS' | 'EMAIL')[];
    totalParentsTargeted: number;
    deliveredCount: number;
    readCount: number;
    smsTemplateMarathi: string;
    smsTemplateEnglish: string;
  };
  rsvps: ParentMeetingRSVP[];
  minutesOfMeeting?: string;
  createdAt: string;
  updatedAt: string;
}

export function getInitialParentMeetings(): ParentMeetingRecord[] {
  return [
    {
      id: 'ptm-sch-01',
      meetingCode: 'PTM-SCH-2026-T1',
      branchScope: 'SCHOOL',
      branchName: 'Modern Public School & Jr College Bhose',
      title: 'इयत्ता १० वी प्रथम सत्र निकाल व पालक सभा / Class 10-A Term 1 Academic Performance & Board Strategy Meeting',
      meetingType: 'ACADEMIC_REVIEW',
      targetAudienceType: 'SPECIFIC_CLASSES',
      targetClasses: ['Class 10-A', 'Class 10-B'],
      meetingMode: 'HYBRID',
      date: '2026-10-28',
      startTime: '10:30 AM',
      endTime: '01:30 PM',
      venue: 'Main Auditorium & Room 102 (Class 10-A Room)',
      onlineMeetingUrl: 'https://meet.google.com/zep-ptm-std10',
      teacherInCharge: 'Prof. Rajendra Patil (Class Teacher & Exam Coordinator)',
      teacherPhone: '+91 98220 12345',
      agenda: [
        'प्रथम सत्र गुणपत्रिका वाटप व विषयनिहाय निकाल विश्लेषण (Term 1 Marksheet Distribution)',
        'गणित, इंग्रजी व विज्ञान विषयातील विशेष सराव वर्ग (Remedial Study Plan for Core Subjects)',
        'दहावी बोर्ड परीक्षा २०२७ पूर्वतयारी नियोजन (SSC Board Examination Prep Strategy)',
        'विद्यार्थी नियमित उपस्थिती, शिस्त व गृहपाठ आढावा (Attendance & Discipline Review)',
      ],
      notes: 'सर्व पालकांनी विद्यार्थ्यांची गुणपत्रिका व डायरी सोबत आणावी. ज्या पालकांना प्रत्यक्ष येणे शक्य नाही त्यांनी गुगल मीट लिंक द्वारे ऑनलाईन उपस्थित राहावे.',
      status: 'SCHEDULED',
      notificationDispatch: {
        dispatched: true,
        dispatchedAt: '2026-10-23T10:00:00Z',
        channels: ['IN_APP', 'WHATSAPP', 'SMS'],
        totalParentsTargeted: 4,
        deliveredCount: 4,
        readCount: 3,
        smsTemplateMarathi: 'आदरणीय पालक, मॉडर्न पब्लिक स्कूल तर्फे इयत्ता १० वी ची पालक सभा २८ ऑक्टोबर रोजी सकाळी १०:३० वाजता आयोजित केली आहे. कृपया उपस्थित राहावे किंवा ऑनलाइन लिंक वर RSVP नोंदवावे.',
        smsTemplateEnglish: 'Dear Parent, Modern Public School has scheduled the Class 10-A Term 1 Parent-Teacher Meeting on 28 Oct at 10:30 AM. Venue: Room 102 & Google Meet. Please RSVP via Parent Portal.',
      },
      rsvps: [
        {
          studentId: 'stu-s01',
          studentName: 'Aarav Sharma',
          rollNo: '101',
          gradeOrSemester: 'Class 10-A',
          parentName: 'Ramesh Sharma',
          parentPhone: '+91 98230 11223',
          status: 'ATTENDING',
          respondedAt: '2026-10-23T11:15:00Z',
          parentRemarks: 'Will attend in person at 10:30 AM. Would like to discuss Mathematics paper marks.',
          attended: false,
          teacherRemarks: '',
        },
        {
          studentId: 'stu-s02',
          studentName: 'Ananya Patel',
          rollNo: '102',
          gradeOrSemester: 'Class 10-A',
          parentName: 'Bhavesh Patel',
          parentPhone: '+91 98230 44556',
          status: 'ATTENDING',
          respondedAt: '2026-10-23T12:05:00Z',
          parentRemarks: 'Attending physical session in Auditorium.',
          attended: false,
          teacherRemarks: '',
        },
        {
          studentId: 'stu-s03',
          studentName: 'Rohan Deshmukh',
          rollNo: '103',
          gradeOrSemester: 'Class 10-A',
          parentName: 'Sunil Deshmukh',
          parentPhone: '+91 98230 77889',
          status: 'REQUEST_RESCHEDULE',
          respondedAt: '2026-10-23T13:40:00Z',
          parentRemarks: 'On office duty until 12:30 PM. Requesting 01:00 PM slot or will join via Google Meet.',
          attended: false,
          teacherRemarks: 'Approved Google Meet slot at 12:45 PM.',
        },
        {
          studentId: 'stu-s04',
          studentName: 'Snehal Jadhav',
          rollNo: '104',
          gradeOrSemester: 'Class 10-A',
          parentName: 'Vitthal Jadhav',
          parentPhone: '+91 98233 44112',
          status: 'PENDING',
          attended: false,
        },
      ],
      createdAt: '2026-10-23',
      updatedAt: '2026-10-23',
    },
    {
      id: 'ptm-col-hm-01',
      meetingCode: 'PTM-BHM-2026-INT',
      branchScope: 'COLLEGE',
      branchName: 'Modern College of Hotel Management and Technology Solapur',
      title: 'B.Sc Hospitality Studies Semester 4 - 5-Star Hotel Internship Briefing & Parents Conference',
      meetingType: 'INTERNSHIP_PLACEMENT',
      targetAudienceType: 'SPECIFIC_CLASSES',
      targetClasses: ['B.Sc in Hospitality Studies - Semester 4', 'Diploma in Food Production - Sem 2'],
      meetingMode: 'HYBRID',
      date: '2026-10-31',
      startTime: '11:00 AM',
      endTime: '02:00 PM',
      venue: 'Culinary Training Auditorium & Training Restaurant',
      onlineMeetingUrl: 'https://meet.google.com/hm-internship-ptm',
      teacherInCharge: 'Chef Anand Deshpande (Head of Training & Placement)',
      teacherPhone: '+91 98221 44556',
      agenda: [
        'Mandatory 6-Month 5-Star Industrial Training Orientation (Oberoi, Taj, Marriott properties)',
        'Stipend structure, food & accommodation, and professional grooming regulations',
        'Practical Examination Schedule prior to industrial deputation',
        'Parent Consent Forms, Medical Fitness Clearance, and Student Code of Conduct',
      ],
      notes: 'Culinary uniform showcase and lunch buffet prepared by students will be hosted for all attending parents.',
      status: 'SCHEDULED',
      notificationDispatch: {
        dispatched: true,
        dispatchedAt: '2026-10-23T10:30:00Z',
        channels: ['IN_APP', 'WHATSAPP', 'EMAIL'],
        totalParentsTargeted: 2,
        deliveredCount: 2,
        readCount: 2,
        smsTemplateMarathi: 'आदरणीय पालक, मॉडर्न कॉलेज ऑफ हॉटेल मॅनेजमेंट तर्फे बी.एस्सी सत्र ४ च्या विद्यार्थ्यांची ५-स्टार हॉटेल इंटर्नशिप पालक परिषद ३१ ऑक्टोबर रोजी सकाळी ११ वाजता आयोजित केली आहे.',
        smsTemplateEnglish: 'Dear Parent, Modern College of Hotel Management invites you to the Semester 4 5-Star Hotel Internship & Placement Conference on 31 Oct at 11:00 AM. Please RSVP.',
      },
      rsvps: [
        {
          studentId: 'stu-hm01',
          studentName: 'Kabir Kulkarni',
          rollNo: 'HM-201',
          gradeOrSemester: 'B.Sc in Hospitality Studies - Semester 4',
          parentName: 'Milind Kulkarni',
          parentPhone: '+91 98231 66778',
          status: 'ATTENDING',
          respondedAt: '2026-10-23T11:00:00Z',
          parentRemarks: 'Will attend the internship session with Kabir. Interested in Taj group placement.',
          attended: false,
        },
        {
          studentId: 'stu-hm02',
          studentName: 'Shreya Shinde',
          rollNo: 'HM-202',
          gradeOrSemester: 'B.Sc in Hospitality Studies - Semester 4',
          parentName: 'Eknath Shinde',
          parentPhone: '+91 98232 55443',
          status: 'TENTATIVE',
          respondedAt: '2026-10-23T12:20:00Z',
          parentRemarks: 'Might be delayed by 30 mins due to Solapur commute. Please keep presentation handouts.',
          attended: false,
        },
      ],
      createdAt: '2026-10-22',
      updatedAt: '2026-10-23',
    },
    {
      id: 'ptm-sch-02',
      meetingCode: 'PTM-SCH-2026-MID',
      branchScope: 'SCHOOL',
      branchName: 'Modern Public School & Jr College Bhose',
      title: 'Class 7-A Mid-Term Assessment & Foundation Olympiad Review',
      meetingType: 'ACADEMIC_REVIEW',
      targetAudienceType: 'SPECIFIC_CLASSES',
      targetClasses: ['Class 7-A'],
      meetingMode: 'IN_PERSON',
      date: '2026-10-15',
      startTime: '09:30 AM',
      endTime: '12:30 PM',
      venue: 'Classroom 7-A (Middle Wing)',
      teacherInCharge: 'Mrs. Sunita Kulkarni (Headmistress)',
      teacherPhone: '+91 98220 99887',
      agenda: [
        'Mid-Term Unit Test Marks distribution',
        'Marathi Handwriting & English Reading improvement',
        'National Science & Mathematics Olympiad enrollment',
      ],
      status: 'COMPLETED',
      notificationDispatch: {
        dispatched: true,
        dispatchedAt: '2026-10-10T09:00:00Z',
        channels: ['IN_APP', 'WHATSAPP', 'SMS'],
        totalParentsTargeted: 24,
        deliveredCount: 24,
        readCount: 22,
        smsTemplateMarathi: 'इयत्ता ७ वी ची पालक सभा १५ ऑक्टोबर रोजी पार पडेल.',
        smsTemplateEnglish: 'Class 7-A PTM scheduled on 15 Oct.',
      },
      rsvps: [
        {
          studentId: 'stu-s01',
          studentName: 'Aarav Sharma',
          rollNo: '101',
          gradeOrSemester: 'Class 7-A',
          parentName: 'Ramesh Sharma',
          parentPhone: '+91 98230 11223',
          status: 'ATTENDING',
          attended: true,
          teacherRemarks: 'Parent attended. Discussed focus on Marathi grammar and cursive handwriting.',
        },
      ],
      minutesOfMeeting: 'Meeting commenced at 09:30 AM. 21 out of 24 parents attended. Parents appreciated Olympiad coaching and suggested additional Saturday practice sessions. Resolved to start weekend doubt-clearing sessions.',
      createdAt: '2026-10-10',
      updatedAt: '2026-10-15',
    },
  ];
}

export let parentMeetingsData: ParentMeetingRecord[] = getInitialParentMeetings();

export function resetParentMeetingsData(): void {
  parentMeetingsData = getInitialParentMeetings();
}
