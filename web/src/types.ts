export interface StudentAddress {
  street: string;
  area: string;
  taluka: string;
  country: string;
  state: string;
  district: string;
  pincode: string;
}

export interface StudentDocumentAttachment {
  id: string;
  documentTitle: string;
  documentCode: string;
  isMandatory: boolean;
  submitted: boolean;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  rackLocation?: string;
}

export interface Student {
  id: string;
  branchId: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  firstName?: string;
  lastName?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  gradeOrSemester: string;
  standard?: string;
  division?: string;
  admissionType?: 'Fresh' | 'Transfer' | 'Lateral' | 'Re-admission' | 'Existing';
  admissionDate?: string;
  isExistingStudent?: boolean;
  originalAdmissionYear?: string;
  previousClassOrSem?: string;
  previousYearPercentage?: number;
  openingFeeBalance?: number;
  legacyEnrollmentSource?: 'MANUAL_ENTRY' | 'BULK_CSV_MIGRATION' | 'OLD_GR_REGISTER';
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  fatherName?: string;
  motherName?: string;
  feeTotal: number;
  feePaid: number;
  feePending: number;
  attendancePercent: number;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  hotelSpecialization?: string;
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  roleTag?: 'STUDENT' | 'PREFECT' | 'INTERN' | 'STAFF' | 'ADMIN';

  // Marathi / Devanagari Script (मराठी नोंद - Required for statutory LC, Bonafide, GR):
  nameMarathi?: string;
  fatherNameMarathi?: string;
  motherNameMarathi?: string;
  casteMarathi?: string;
  placeOfBirthMarathi?: string;

  // Statutory & Historical General Register (GR) Archive Fields:
  grNumber?: string;
  prnNumber?: string;
  penNumber?: string;
  saralId?: string;
  nationality?: string;
  religion?: string;
  caste?: string;
  subCategory?: string;
  category?: string;
  bloodGroup?: string;
  motherTongue?: string;
  placeOfBirth?: string;
  dob?: string;
  dobWords?: string;
  profilePhotoUrl?: string;

  // Detailed Addresses:
  currentAddress?: StudentAddress;
  permanentAddress?: StudentAddress;

  // Attached Statutory Documents:
  submittedDocuments?: StudentDocumentAttachment[];
  rackCode?: string;
  folderNumber?: string;

  lastSchoolAttended?: string;
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
}

export type CertificateType =
  | 'TRANSFER_LEAVING'
  | 'BONAFIDE'
  | 'CHARACTER'
  | 'NO_DUES'
  | 'PASSING_ATTEMPT'
  | 'MIGRATION';

export interface IssuedCertificate {
  id: string;
  certificateSerialNo: string;
  certificateType: CertificateType;
  studentId: string;
  studentName: string;
  studentNameMarathi?: string;
  nameMarathi?: string;
  grNumber?: string;
  branchName: string;
  gradeOrCourse: string;
  academicYear: string;
  issueDate: string;
  issuedBy: string;
  digitalSignatureHash: string;
  qrVerificationUrl: string;
  motherName?: string;
  motherNameMarathi?: string;
  fatherName?: string;
  fatherNameMarathi?: string;
  dob?: string;
  dobWords?: string;
  placeOfBirth?: string;
  placeOfBirthMarathi?: string;
  nationality?: string;
  religion?: string;
  caste?: string;
  casteMarathi?: string;
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

export interface FeeHeadItem {
  id: string;
  headName: string;
  headNameMarathi?: string;
  amount: number;
  category?: 'MANDATORY' | 'OPTIONAL' | 'ANNUAL' | 'TERM';
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  studentNameMarathi?: string;
  branchName: string;
  standardOrGrade?: string;
  division?: string;
  rollNo?: string;
  admissionNo?: string;
  grNumber?: string;
  academicYear?: string;
  parentName?: string;
  parentPhone?: string;
  category?: string;
  amount: number;
  totalAnnualFee?: number;
  previouslyPaid?: number;
  remainingBalance?: number;
  paymentMode: 'UPI' | 'CASH' | 'CHEQUE' | 'NETBANKING';
  transactionReference?: string;
  bankName?: string;
  chequeDate?: string;
  date: string;
  time?: string;
  installmentNo: number | string;
  feeBreakdown?: FeeHeadItem[];
  amountInWords?: string;
  amountInWordsMarathi?: string;
  cashierName?: string;
  status: 'PAID';
  remarks?: string;
  qrVerificationUrl?: string;
}

export interface KitchenPracticalBatch {
  id: string;
  labName: string;
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
  hotelBrand: string;
  city: string;
  department: string;
  mentorName: string;
  mentorRating: number;
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
  stops: { name: string; time: string; passed: boolean }[];
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  nameMarathi?: string;
  role: string;
  dept: string;
  branch: string;
  branchId?: string;
  email?: string;
  phone: string;
  emergencyContact?: string;
  bloodGroup?: string;
  dob?: string;
  joinDate?: string;
  validUpto?: string;
  address?: string;
  profilePhotoUrl?: string;
  aadhaarNumber?: string;
  pan?: string;
  basic?: number;
  hra?: number;
  da?: number;
  special?: number;
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

export interface StudentProgressionRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo?: string;
  branchName?: string;
  fromYear: string;
  toYear: string;
  fromGrade: string;
  toGrade: string;
  pendingFeeCarriedForward: number;
  promotedDate: string;
  status: 'PROMOTED' | 'GRADUATED';
}

export type UserRole =
  | 'SUPERADMIN'
  | 'BRANCH_ADMIN_SCHOOL'
  | 'BRANCH_ADMIN_COLLEGE'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'STUDENT';

export interface UserProfile {
  id?: string;
  name: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
  email: string;
  token?: string;
}

export interface ExamSeatingAllocation {
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

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  rollNo?: string;
  admissionNo?: string;
  branchId?: string;
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

export interface MarksheetStudentEntry {
  studentId: string;
  studentName: string;
  nameMarathi?: string;
  rollNo: string;
  admissionNo: string;
  classOrGrade: string;
  branchId: string;
  marksObtained: number | '';
  maxMarks: number;
  passingMarks: number;
  percentage: number;
  grade: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'ABSENT';
  remarks: string;
}

export interface ClassroomAllocation {
  id: string;
  branchScope: 'SCHOOL' | 'COLLEGE';
  branchId?: string;
  academicYear: string;
  classroomId: string;
  classroomName: string;
  roomCode: string;
  roomType?: string;
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
  bloomLevel?: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE';
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

export interface QuestionPaper {
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

// --------------------------------------------------------------------------
// PARENT-TEACHER MEETINGS (PTM) & NOTIFICATIONS
// --------------------------------------------------------------------------
export type MeetingRSVPStatus = 'ATTENDING' | 'TENTATIVE' | 'CANNOT_ATTEND' | 'REQUEST_RESCHEDULE' | 'PENDING';

export interface ParentMeetingRSVP {
  studentId: string;
  studentName: string;
  rollNo: string;
  gradeOrSemester: string;
  parentName: string;
  parentPhone: string;
  status: MeetingRSVPStatus;
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




