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
  admissionType?: 'Fresh' | 'Transfer' | 'Lateral' | 'Re-admission';
  admissionDate?: string;
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

export interface AdmissionEnquiry {
  id: string;
  applicantName: string;
  parentName: string;
  phone: string;
  targetBranch: 'SCHOOL' | 'COLLEGE';
  targetClassOrCourse: string;
  status: 'NEW' | 'CONTACTED' | 'ADMITTED';
  createdAt: string;
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

