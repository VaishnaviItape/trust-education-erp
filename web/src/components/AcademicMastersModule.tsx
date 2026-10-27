import React, { useState, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  GraduationCap,
  Award,
  Building,
  Users,
  Briefcase,
  FileText,
  Calendar,
  Globe,
  MapPin,
  Search,
  Plus,
  Trash2,
  Pencil,
  Save,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  RotateCcw,
  UtensilsCrossed,
  DoorOpen,
  Hash,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  ClipboardList,
  CheckSquare,
  Cpu,
  Bus,
  Bed,
  Package,
  School,
} from 'lucide-react';
import {
  BranchScope,
  MasterBoard,
  MasterMedium,
  MasterStandard,
  MasterDivision,
  MasterSubject,
  MasterClassroom,
  MasterDepartment,
  MasterDesignation,
  MasterTeacher,
  MasterStaff,
  MasterOriginalDocument,
  MasterAcademicYear,
  MasterCountry,
  MasterState,
  MasterDistrict,
  MasterStore,
} from '../utils/masterData';
import { SortableTh, defaultComparator, SortDirection } from './TableSort';

type MasterCategory =
  | 'STANDARDS'
  | 'BOARDS'
  | 'MEDIUMS'
  | 'DIVISIONS'
  | 'SUBJECTS'
  | 'CLASSROOMS'
  | 'DEPARTMENTS'
  | 'DESIGNATIONS'
  | 'TEACHERS'
  | 'STAFF'
  | 'ORIGINAL_DOCS'
  | 'ACADEMIC_YEARS'
  | 'COUNTRIES'
  | 'STATES'
  | 'DISTRICTS'
  | 'FEE_HEADS'
  | 'FEE_GROUPS'
  | 'EXAM_GROUPS'
  | 'GRADING_SCALES'
  | 'LEAVE_TYPES'
  | 'COMPENSATION_BANDS'
  | 'BIOMETRIC_DEVICES'
  | 'TRANSPORT_VEHICLES'
  | 'HOSTEL_ROOM_TYPES'
  | 'INVENTORY_SUPPLIERS'
  | 'ROLES_PERMISSIONS'
  | 'INSTITUTES';

export interface MasterFeeHead {
  id: string;
  name: string;
  code: string;
  frequency: 'Annual' | 'Semester' | 'Quarterly' | 'Per Term';
  defaultAmount: number;
  branchScope: 'ALL' | 'SCHOOL' | 'COLLEGE';
  description: string;
}

export interface MasterFeeGroup {
  id: string;
  name: string;
  code: string;
  targetStandard: string;
  totalAnnualFee: number;
  installmentsAllowed: number;
}

export interface MasterExamGroup {
  id: string;
  name: string;
  code: string;
  weightagePercent: string;
  termPeriod: string;
  description: string;
}

export interface MasterGradingScale {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  gpaPoint: number;
  description: string;
}

export interface MasterLeaveType {
  id: string;
  name: string;
  code: string;
  annualQuota: number;
  payType: 'Full Paid' | 'Official Duty' | 'Statutory Paid';
  terms: string;
}

export interface MasterCompensationBand {
  id: string;
  roleName: string;
  payScaleLevel: string;
  basicSalaryRange: string;
  daPercent: number;
  hraPercent: number;
  epfApplicable: string;
}

export interface MasterBiometricDevice {
  id: string;
  name: string;
  model: string;
  ipAddress: string;
  port: number;
  location: string;
  usersMapped: number;
  status: 'ONLINE' | 'OFFLINE';
}

export interface MasterTransportVehicle {
  id: string;
  vehicleNo: string;
  busName: string;
  capacity: number;
  driverName: string;
  rtoFitnessExpiry: string;
  gpsIMEI: string;
  status: 'ACTIVE' | 'MAINTENANCE';
}

export interface MasterHostelRoomType {
  id: string;
  typeName: string;
  blockName: string;
  monthlyFee: number;
  amenities: string;
  totalBeds: number;
  vacantBeds: number;
}

export interface MasterInventorySupplier {
  id: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  category: string;
  city: string;
  gstin: string;
}

export interface MasterRolePermission {
  id: string;
  roleName: string;
  accessScope: string;
  usersCount: number;
  canManageFees: boolean;
  canApproveAdmissions: boolean;
  canExportAudit: boolean;
}

export interface MasterInstitute {
  id: string;
  instituteName: string;
  regNo: string;
  affiliation: string;
  campusAddress: string;
  principalName: string;
  studentCapacity: number;
  activeEnrollment: number;
}

export const AcademicMastersModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MasterCategory>('STANDARDS');
  const [branchScopeFilter, setBranchScopeFilter] = useState<BranchScope>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Loaded Master Data state
  const [boards, setBoards] = useState<MasterBoard[]>(() => MasterStore.getBoards());
  const [mediums, setMediums] = useState<MasterMedium[]>(() => MasterStore.getMediums());
  const [standards, setStandards] = useState<MasterStandard[]>(() => MasterStore.getStandards());
  const [divisions, setDivisions] = useState<MasterDivision[]>(() => MasterStore.getDivisions());
  const [subjects, setSubjects] = useState<MasterSubject[]>(() => MasterStore.getSubjects());
  const [classrooms, setClassrooms] = useState<MasterClassroom[]>(() => MasterStore.getClassrooms());
  const [departments, setDepartments] = useState<MasterDepartment[]>(() => MasterStore.getDepartments());
  const [designations, setDesignations] = useState<MasterDesignation[]>(() => MasterStore.getDesignations());
  const [teachers, setTeachers] = useState<MasterTeacher[]>(() => MasterStore.getTeachers());
  const [staff, setStaff] = useState<MasterStaff[]>(() => MasterStore.getStaff());
  const [documents, setDocuments] = useState<MasterOriginalDocument[]>(() => MasterStore.getDocuments());
  const [years, setYears] = useState<MasterAcademicYear[]>(() => MasterStore.getYears());
  const [countries, setCountries] = useState<MasterCountry[]>(() => MasterStore.getCountries());
  const [states, setStates] = useState<MasterState[]>(() => MasterStore.getStates());
  const [districts, setDistricts] = useState<MasterDistrict[]>(() => MasterStore.getDistricts());

  // Domain Masters: Fee, Exams, HR, Campus, Org
  const [feeHeads, setFeeHeads] = useState<MasterFeeHead[]>([
    { id: 'fh-01', name: 'Tuition Fee', code: 'TUIT', frequency: 'Annual', defaultAmount: 22000, branchScope: 'ALL', description: 'Core academic instruction & curriculum fee' },
    { id: 'fh-02', name: 'Term & Development Fee', code: 'TERM', frequency: 'Annual', defaultAmount: 6000, branchScope: 'ALL', description: 'School infrastructure, smart digital classrooms' },
    { id: 'fh-03', name: 'Computer & Science Lab Fee', code: 'LAB', frequency: 'Annual', defaultAmount: 4000, branchScope: 'SCHOOL', description: 'Robotics, Physics, Chemistry, Biology labs' },
    { id: 'fh-04', name: 'Commercial Kitchen Practical Fee', code: 'KIT', frequency: 'Semester', defaultAmount: 25000, branchScope: 'COLLEGE', description: 'Bakery ingredients, knives, uniform, BTK' },
    { id: 'fh-05', name: 'GPS Bus Transport Service Fee', code: 'TRANS', frequency: 'Quarterly', defaultAmount: 8000, branchScope: 'SCHOOL', description: 'Air-conditioned bus with live parent GPS' },
    { id: 'fh-06', name: 'Examination & Marksheet Fee', code: 'EXAM', frequency: 'Per Term', defaultAmount: 1500, branchScope: 'ALL', description: 'OMR sheets, hall ticket, report card laminations' },
  ]);

  const [feeGroups, setFeeGroups] = useState<MasterFeeGroup[]>([
    { id: 'fg-01', name: 'Primary School Standard Fee Group (STD 1-5)', code: 'GRP-PRI', targetStandard: 'STD 1 to STD 5', totalAnnualFee: 32000, installmentsAllowed: 3 },
    { id: 'fg-02', name: 'Middle & Secondary Fee Group (STD 6-10)', code: 'GRP-SEC', targetStandard: 'STD 6 to STD 10', totalAnnualFee: 38000, installmentsAllowed: 3 },
    { id: 'fg-03', name: 'Junior College Science / Commerce (STD 11-12)', code: 'GRP-JC', targetStandard: 'STD 11 & STD 12', totalAnnualFee: 42000, installmentsAllowed: 2 },
    { id: 'fg-04', name: 'B.Sc in Hotel Management Degree Program', code: 'GRP-BHM', targetStandard: 'Semester 1 to 6', totalAnnualFee: 75000, installmentsAllowed: 2 },
    { id: 'fg-05', name: 'Diploma in Food Production & Bakery (1.5 Yrs)', code: 'GRP-DIP', targetStandard: '1.5-Year Diploma', totalAnnualFee: 55000, installmentsAllowed: 2 },
  ]);

  const [examGroups, setExamGroups] = useState<MasterExamGroup[]>([
    { id: 'eg-01', name: 'Formative Assessment / Unit Tests (FA-1 & FA-2)', code: 'FA-TERM', weightagePercent: '20%', termPeriod: 'July & September', description: 'Continuous classroom evaluation' },
    { id: 'eg-02', name: 'Semester 1 Summative Examination (SA-1)', code: 'SA-MID', weightagePercent: '40%', termPeriod: 'October', description: 'Mid-term board evaluation' },
    { id: 'eg-03', name: 'Prelims Pre-Board Exam (STD 10 & 12)', code: 'PRE-BRD', weightagePercent: 'Mock', termPeriod: 'January', description: 'State & CBSE pre-board dress rehearsal' },
    { id: 'eg-04', name: 'Annual Final Board Examination (SA-2)', code: 'SA-FIN', weightagePercent: '40%', termPeriod: 'March / April', description: 'Comprehensive annual scholastic evaluation' },
    { id: 'eg-05', name: 'University Culinary Practicals & Viva Voce', code: 'UNIV-PRAC', weightagePercent: '50%', termPeriod: 'Every Semester', description: 'Hotel industry external jury exam' },
  ]);

  const [gradingScales, setGradingScales] = useState<MasterGradingScale[]>([
    { id: 'grd-01', grade: 'A1', minScore: 91, maxScore: 100, gpaPoint: 10.0, description: 'Outstanding Academic Performance' },
    { id: 'grd-02', grade: 'A2', minScore: 81, maxScore: 90, gpaPoint: 9.0, description: 'Excellent / Distinction' },
    { id: 'grd-03', grade: 'B1', minScore: 71, maxScore: 80, gpaPoint: 8.0, description: 'Very Good' },
    { id: 'grd-04', grade: 'B2', minScore: 61, maxScore: 70, gpaPoint: 7.0, description: 'Good / First Class' },
    { id: 'grd-05', grade: 'C1', minScore: 51, maxScore: 60, gpaPoint: 6.0, description: 'Above Average' },
    { id: 'grd-06', grade: 'C2', minScore: 41, maxScore: 50, gpaPoint: 5.0, description: 'Average' },
    { id: 'grd-07', grade: 'D', minScore: 33, maxScore: 40, gpaPoint: 4.0, description: 'Passing Grade' },
    { id: 'grd-08', grade: 'E', minScore: 0, maxScore: 32, gpaPoint: 0.0, description: 'Needs Improvement / Remedial Exam' },
  ]);

  const [leaveTypes, setLeaveTypes] = useState<MasterLeaveType[]>([
    { id: 'lt-01', name: 'Casual Leave (CL)', code: 'CL', annualQuota: 12, payType: 'Full Paid', terms: 'Max 2 days consecutive without prior notice' },
    { id: 'lt-02', name: 'Medical Leave (ML)', code: 'ML', annualQuota: 10, payType: 'Full Paid', terms: 'Certified medical practitioner certificate required' },
    { id: 'lt-03', name: 'Earned Leave (EL)', code: 'EL', annualQuota: 15, payType: 'Full Paid', terms: 'Accumulated annual leave for permanent staff' },
    { id: 'lt-04', name: 'On Duty Leave (OD)', code: 'OD', annualQuota: 10, payType: 'Official Duty', terms: 'Board exam moderation or university jury inspection' },
    { id: 'lt-05', name: 'Maternity Leave', code: 'MAT', annualQuota: 180, payType: 'Statutory Paid', terms: 'Statutory paid leave for eligible female staff' },
  ]);

  const [compensationBands, setCompensationBands] = useState<MasterCompensationBand[]>([
    { id: 'cmp-01', roleName: 'Principal / Director', payScaleLevel: 'Level 14', basicSalaryRange: '₹45,000 - ₹75,000', daPercent: 50, hraPercent: 20, epfApplicable: '12% Statutory' },
    { id: 'cmp-02', roleName: 'Senior Chef / HOD', payScaleLevel: 'Level 11', basicSalaryRange: '₹35,000 - ₹55,000', daPercent: 50, hraPercent: 20, epfApplicable: '12% Statutory' },
    { id: 'cmp-03', roleName: 'Post Graduate Teacher (PGT)', payScaleLevel: 'Level 10', basicSalaryRange: '₹30,000 - ₹48,000', daPercent: 50, hraPercent: 20, epfApplicable: '12% Statutory' },
    { id: 'cmp-04', roleName: 'Trained Graduate Teacher (TGT)', payScaleLevel: 'Level 8', basicSalaryRange: '₹25,000 - ₹40,000', daPercent: 50, hraPercent: 20, epfApplicable: '12% Statutory' },
    { id: 'cmp-05', roleName: 'Primary Teacher (PRT)', payScaleLevel: 'Level 6', basicSalaryRange: '₹20,000 - ₹32,000', daPercent: 50, hraPercent: 20, epfApplicable: '12% Statutory' },
    { id: 'cmp-06', roleName: 'Bus Driver / Maintenance Crew', payScaleLevel: 'Level 4', basicSalaryRange: '₹15,000 - ₹24,000', daPercent: 50, hraPercent: 15, epfApplicable: '12% Statutory' },
  ]);

  const [biometricDevices, setBiometricDevices] = useState<MasterBiometricDevice[]>([
    { id: 'bio-01', name: 'Main Campus Gate Entrance Biometric', model: 'ZKTeco SilkID G3', ipAddress: '192.168.1.201', port: 4370, location: 'Admin Block Front Entry', usersMapped: 68, status: 'ONLINE' },
    { id: 'bio-02', name: 'Kitchen Labs & Culinary Block Biometric', model: 'Essl K90 Pro', ipAddress: '192.168.1.202', port: 4370, location: 'Culinary Arts Building', usersMapped: 42, status: 'ONLINE' },
    { id: 'bio-03', name: 'School Staff Room Punch Terminal', model: 'BioStation 2', ipAddress: '192.168.1.203', port: 4370, location: 'Primary Staff Room', usersMapped: 35, status: 'ONLINE' },
  ]);

  const [transportVehicles, setTransportVehicles] = useState<MasterTransportVehicle[]>([
    { id: 'veh-01', vehicleNo: 'MH-12-TR-4421', busName: 'School Bus #4 (Yellow Line)', capacity: 42, driverName: 'Pandurang Shinde (+91 98229 11001)', rtoFitnessExpiry: '2027-04-15', gpsIMEI: '864209041234567', status: 'ACTIVE' },
    { id: 'veh-02', vehicleNo: 'MH-12-TR-4422', busName: 'School Bus #5 (City Loop)', capacity: 42, driverName: 'Santosh Gaikwad (+91 98229 11002)', rtoFitnessExpiry: '2027-06-20', gpsIMEI: '864209041234568', status: 'ACTIVE' },
    { id: 'veh-03', vehicleNo: 'MH-12-TR-4423', busName: 'College Van (Solapur Shuttle)', capacity: 24, driverName: 'Sachin Kamble (+91 98229 11003)', rtoFitnessExpiry: '2026-12-10', gpsIMEI: '864209041234569', status: 'ACTIVE' },
  ]);

  const [hostelRoomTypes, setHostelRoomTypes] = useState<MasterHostelRoomType[]>([
    { id: 'hrt-01', typeName: 'Standard 2-Bed Sharing (Boys Block)', blockName: 'Tagore Boys Block', monthlyFee: 4500, amenities: 'Attached Bath, Study Table, WiFi, Wardrobe', totalBeds: 60, vacantBeds: 8 },
    { id: 'hrt-02', typeName: 'Standard 2-Bed Sharing (Girls Block)', blockName: 'Sarojini Girls Block', monthlyFee: 4500, amenities: 'Attached Bath, Study Table, WiFi, Geyser, Wardrobe', totalBeds: 50, vacantBeds: 5 },
    { id: 'hrt-03', typeName: 'Deluxe Single Occupancy (Culinary Interns)', blockName: 'Executive Block A', monthlyFee: 7500, amenities: 'AC, Attached Bath, Refrigerator, Study Table', totalBeds: 15, vacantBeds: 2 },
  ]);

  const [inventorySuppliers, setInventorySuppliers] = useState<MasterInventorySupplier[]>([
    { id: 'sup-01', supplierName: 'Solapur Commercial Kitchen Utensils & Knives', contactPerson: 'Anil Bhalerao', phone: '+91 98220 44551', category: 'Chef Toolkits & Bakery Equipment', city: 'Solapur', gstin: '27AABCS1429Q1Z8' },
    { id: 'sup-02', supplierName: 'Navneet Education & Stationers Pvt Ltd', contactPerson: 'Kishore Gandhi', phone: '+91 98220 88992', category: 'Textbooks, Marksheets & Stationery', city: 'Pune', gstin: '27AAACN8821F1ZX' },
    { id: 'sup-03', supplierName: 'Saraswati Science & Chemical Reagents', contactPerson: 'Dr. Vivek Mane', phone: '+91 98220 33221', category: 'Physics & Chemistry Lab Chemicals', city: 'Pandharpur', gstin: '27AABFS9901M1ZT' },
  ]);

  const [rolesPermissions, setRolesPermissions] = useState<MasterRolePermission[]>([
    { id: 'rol-01', roleName: 'SUPERADMIN (Trustee / President)', accessScope: 'Full Master Read & Write Across School & College', usersCount: 2, canManageFees: true, canApproveAdmissions: true, canExportAudit: true },
    { id: 'rol-02', roleName: 'BRANCH_ADMIN_SCHOOL', accessScope: 'Isolated School Administration (Modern Public School Bhose)', usersCount: 3, canManageFees: true, canApproveAdmissions: true, canExportAudit: true },
    { id: 'rol-03', roleName: 'BRANCH_ADMIN_COLLEGE', accessScope: 'Isolated College Administration (Hotel Mgmt Solapur)', usersCount: 2, canManageFees: true, canApproveAdmissions: true, canExportAudit: true },
    { id: 'rol-04', roleName: 'TEACHER / LECTURER', accessScope: 'Daily Attendance, OMR Marks Entry, Homework & Study Notes', usersCount: 38, canManageFees: false, canApproveAdmissions: false, canExportAudit: false },
    { id: 'rol-05', roleName: 'ACCOUNTANT / CASHIER', accessScope: 'Fee Receipts, Defaulters, Trust Daybook & Bank Ledger', usersCount: 4, canManageFees: true, canApproveAdmissions: false, canExportAudit: true },
  ]);

  const [institutes, setInstitutes] = useState<MasterInstitute[]>([
    { id: 'inst-sch-01', instituteName: 'Modern Public School And Junior College Bhose', regNo: 'MH/EDU/TR-18452/SOLAPUR', affiliation: 'CBSE Affiliation #1130842 & Maharashtra State Board', campusAddress: 'Bhose Campus, Tal. Pandharpur, Dist. Solapur', principalName: 'Dr. Sunita Kulkarni', studentCapacity: 600, activeEnrollment: 312 },
    { id: 'inst-hm-01', instituteName: 'Modern College Of Hotel Management And Technology Solapur', regNo: 'MH/HIGHER-EDU/HM-4412/SOLAPUR', affiliation: 'Recognized by Solapur University & Tourism Council', campusAddress: 'Solapur City Campus, Hotgi Road, Solapur', principalName: 'Chef Sanjeev Menon (Director)', studentCapacity: 250, activeEnrollment: 148 },
  ]);

  // Master Table Column Sorting State
  const [masterSortKey, setMasterSortKey] = useState<string | null>(null);
  const [masterSortDir, setMasterSortDir] = useState<SortDirection>('asc');

  const handleMasterSort = (key: string) => {
    if (masterSortKey === key) {
      setMasterSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setMasterSortKey(key);
      setMasterSortDir('asc');
    }
  };

  const sortMasterList = <T,>(list: T[]): T[] => {
    if (!masterSortKey) return list;
    return [...list].sort((a, b) => defaultComparator(a, b, masterSortKey, masterSortDir));
  };

  // Modal State for adding new master record
  
  // Edit & Delete Master State
  const [editingMasterRecord, setEditingMasterRecord] = useState<{
    category: MasterCategory;
    item: any;
  } | null>(null);

  const [deletingMasterRecord, setDeletingMasterRecord] = useState<{
    category: MasterCategory;
    id: string;
    name: string;
  } | null>(null);

  const handleSaveEditMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMasterRecord) return;
    const { category, item } = editingMasterRecord;

    switch (category) {
      case 'STANDARDS': {
        const next = standards.map((x) => (x.id === item.id ? item : x));
        setStandards(next);
        MasterStore.saveStandards(next);
        break;
      }
      case 'BOARDS': {
        const next = boards.map((x) => (x.id === item.id ? item : x));
        setBoards(next);
        MasterStore.saveBoards(next);
        break;
      }
      case 'MEDIUMS': {
        const next = mediums.map((x) => (x.id === item.id ? item : x));
        setMediums(next);
        MasterStore.saveMediums(next);
        break;
      }
      case 'DIVISIONS': {
        const next = divisions.map((x) => (x.id === item.id ? item : x));
        setDivisions(next);
        MasterStore.saveDivisions(next);
        break;
      }
      case 'SUBJECTS': {
        const next = subjects.map((x) => (x.id === item.id ? item : x));
        setSubjects(next);
        MasterStore.saveSubjects(next);
        break;
      }
      case 'CLASSROOMS': {
        const next = classrooms.map((x) => (x.id === item.id ? item : x));
        setClassrooms(next);
        MasterStore.saveClassrooms(next);
        break;
      }
      case 'DEPARTMENTS': {
        const next = departments.map((x) => (x.id === item.id ? item : x));
        setDepartments(next);
        MasterStore.saveDepartments(next);
        break;
      }
      case 'DESIGNATIONS': {
        const next = designations.map((x) => (x.id === item.id ? item : x));
        setDesignations(next);
        MasterStore.saveDesignations(next);
        break;
      }
      case 'TEACHERS': {
        const next = teachers.map((x) => (x.id === item.id ? item : x));
        setTeachers(next);
        MasterStore.saveTeachers(next);
        break;
      }
      case 'STAFF': {
        const next = staff.map((x) => (x.id === item.id ? item : x));
        setStaff(next);
        MasterStore.saveStaff(next);
        break;
      }
      case 'ORIGINAL_DOCS': {
        const next = documents.map((x) => (x.id === item.id ? item : x));
        setDocuments(next);
        MasterStore.saveDocuments(next);
        break;
      }
      case 'ACADEMIC_YEARS': {
        const next = years.map((x) => (x.id === item.id ? item : x));
        setYears(next);
        MasterStore.saveYears(next);
        break;
      }
      case 'COUNTRIES': {
        const next = countries.map((x) => (x.id === item.id ? item : x));
        setCountries(next);
        MasterStore.saveCountries(next);
        break;
      }
      case 'STATES': {
        const next = states.map((x) => (x.id === item.id ? item : x));
        setStates(next);
        MasterStore.saveStates(next);
        break;
      }
      case 'DISTRICTS': {
        const next = districts.map((x) => (x.id === item.id ? item : x));
        setDistricts(next);
        MasterStore.saveDistricts(next);
        break;
      }
      case 'FEE_HEADS': {
        setFeeHeads((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'FEE_GROUPS': {
        setFeeGroups((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'EXAM_GROUPS': {
        setExamGroups((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'GRADING_SCALES': {
        setGradingScales((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'LEAVE_TYPES': {
        setLeaveTypes((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'COMPENSATION_BANDS': {
        setCompensationBands((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'BIOMETRIC_DEVICES': {
        setBiometricDevices((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'TRANSPORT_VEHICLES': {
        setTransportVehicles((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'HOSTEL_ROOM_TYPES': {
        setHostelRoomTypes((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'INVENTORY_SUPPLIERS': {
        setInventorySuppliers((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'ROLES_PERMISSIONS': {
        setRolesPermissions((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
      case 'INSTITUTES': {
        setInstitutes((prev) => prev.map((x) => (x.id === item.id ? item : x)));
        break;
      }
    }
    setEditingMasterRecord(null);
  };

  const handleConfirmDeleteMaster = () => {
    if (!deletingMasterRecord) return;
    const { category, id } = deletingMasterRecord;

    switch (category) {
      case 'STANDARDS': {
        const next = standards.filter((x) => x.id !== id);
        setStandards(next);
        MasterStore.saveStandards(next);
        break;
      }
      case 'BOARDS': {
        const next = boards.filter((x) => x.id !== id);
        setBoards(next);
        MasterStore.saveBoards(next);
        break;
      }
      case 'MEDIUMS': {
        const next = mediums.filter((x) => x.id !== id);
        setMediums(next);
        MasterStore.saveMediums(next);
        break;
      }
      case 'DIVISIONS': {
        const next = divisions.filter((x) => x.id !== id);
        setDivisions(next);
        MasterStore.saveDivisions(next);
        break;
      }
      case 'SUBJECTS': {
        const next = subjects.filter((x) => x.id !== id);
        setSubjects(next);
        MasterStore.saveSubjects(next);
        break;
      }
      case 'CLASSROOMS': {
        const next = classrooms.filter((x) => x.id !== id);
        setClassrooms(next);
        MasterStore.saveClassrooms(next);
        break;
      }
      case 'DEPARTMENTS': {
        const next = departments.filter((x) => x.id !== id);
        setDepartments(next);
        MasterStore.saveDepartments(next);
        break;
      }
      case 'DESIGNATIONS': {
        const next = designations.filter((x) => x.id !== id);
        setDesignations(next);
        MasterStore.saveDesignations(next);
        break;
      }
      case 'TEACHERS': {
        const next = teachers.filter((x) => x.id !== id);
        setTeachers(next);
        MasterStore.saveTeachers(next);
        break;
      }
      case 'STAFF': {
        const next = staff.filter((x) => x.id !== id);
        setStaff(next);
        MasterStore.saveStaff(next);
        break;
      }
      case 'ORIGINAL_DOCS': {
        const next = documents.filter((x) => x.id !== id);
        setDocuments(next);
        MasterStore.saveDocuments(next);
        break;
      }
      case 'ACADEMIC_YEARS': {
        const next = years.filter((x) => x.id !== id);
        setYears(next);
        MasterStore.saveYears(next);
        break;
      }
      case 'COUNTRIES': {
        const next = countries.filter((x) => x.id !== id);
        setCountries(next);
        MasterStore.saveCountries(next);
        break;
      }
      case 'STATES': {
        const next = states.filter((x) => x.id !== id);
        setStates(next);
        MasterStore.saveStates(next);
        break;
      }
      case 'DISTRICTS': {
        const next = districts.filter((x) => x.id !== id);
        setDistricts(next);
        MasterStore.saveDistricts(next);
        break;
      }
      case 'FEE_HEADS': {
        setFeeHeads((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'FEE_GROUPS': {
        setFeeGroups((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'EXAM_GROUPS': {
        setExamGroups((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'GRADING_SCALES': {
        setGradingScales((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'LEAVE_TYPES': {
        setLeaveTypes((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'COMPENSATION_BANDS': {
        setCompensationBands((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'BIOMETRIC_DEVICES': {
        setBiometricDevices((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'TRANSPORT_VEHICLES': {
        setTransportVehicles((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'HOSTEL_ROOM_TYPES': {
        setHostelRoomTypes((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'INVENTORY_SUPPLIERS': {
        setInventorySuppliers((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'ROLES_PERMISSIONS': {
        setRolesPermissions((prev) => prev.filter((x) => x.id !== id));
        break;
      }
      case 'INSTITUTES': {
        setInstitutes((prev) => prev.filter((x) => x.id !== id));
        break;
      }
    }
    setDeletingMasterRecord(null);
  };

  const initialNewMasterForm = {
    name: '',
    code: '',
    branchScope: 'SCHOOL' as BranchScope,
    categoryOrType: '',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    departmentId: 'dept-sch-pri',
    designationId: 'desig-tgt',
    capacity: 45,
    annualFee: 36000,
    phone: '',
    email: '',
    isMandatory: true,
    affiliationNo: '',
    state: 'Maharashtra',
    shift: 'MORNING' as 'MORNING' | 'AFTERNOON' | 'FULL_DAY',
    defaultRoom: 'rm-sch-101',
    subjectType: 'BOTH' as 'THEORY' | 'PRACTICAL' | 'BOTH',
    maxMarks: 100,
    passingMarks: 35,
    wing: 'Main Academic Wing',
    floor: 'Ground Floor',
    facilities: 'CCTV Surveillance, Smart Board',
    headOfDepartment: '',
    payGrade: 'Grade-A',
    roleCategory: 'ADMINISTRATIVE' as 'ADMINISTRATIVE' | 'ACCOUNTING' | 'TECHNICAL' | 'CUSTODIAL',
    issuingAuthority: 'Competent Authority / Government Office',
    defaultRackCupboard: 'C-01 (Fireproof Steel Archive)',
    retentionYears: 10,
    startDate: '2026-06-01',
    endDate: '2027-05-31',
    isCurrent: false,
    isoCode: 'IN',
    iso3: 'IND',
    dialCode: '+91',
    currency: 'INR (₹)',
    countryId: 'cnt-in',
    capital: 'Mumbai',
    stateId: 'st-mh',
    divisionRegion: 'Pune / Solapur Division',
    isHeadquarterZone: false,
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<MasterCategory>('STANDARDS');
  const [newMasterForm, setNewMasterForm] = useState(initialNewMasterForm);

  const openAddModalFor = (cat?: MasterCategory) => {
    const targetCat = cat || activeCategory;
    setModalCategory(targetCat);
    setNewMasterForm({
      ...initialNewMasterForm,
      branchScope: branchScopeFilter === 'ALL' ? 'SCHOOL' : branchScopeFilter,
      boardId: boards[0]?.id || 'brd-mh-ssc',
      mediumId: mediums[0]?.id || 'med-eng',
      departmentId: departments[0]?.id || 'dept-sch-pri',
      designationId: designations[0]?.id || 'desig-tgt',
      countryId: countries[0]?.id || 'cnt-in',
      stateId: states[0]?.id || 'st-mh',
    });
    setIsAddModalOpen(true);
  };

  const renderEmptyRow = (colSpan: number, label: string) => (
    <tr>
      <td colSpan={colSpan} className="py-12 px-4 text-center">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <p className="font-bold text-sm text-slate-800">No {label} Records Found</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            No records matched your search or scope criteria. Click below to add a new record.
          </p>
          <button
            type="button"
            onClick={() => openAddModalFor(activeCategory)}
            className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {label} Record</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const copyToClipboard = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(idText);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all academic & global masters to official institutional defaults?')) {
      MasterStore.resetToDefaults();
      setBoards(MasterStore.getBoards());
      setMediums(MasterStore.getMediums());
      setStandards(MasterStore.getStandards());
      setDivisions(MasterStore.getDivisions());
      setSubjects(MasterStore.getSubjects());
      setClassrooms(MasterStore.getClassrooms());
      setDepartments(MasterStore.getDepartments());
      setDesignations(MasterStore.getDesignations());
      setTeachers(MasterStore.getTeachers());
      setStaff(MasterStore.getStaff());
      setDocuments(MasterStore.getDocuments());
      setYears(MasterStore.getYears());
      setCountries(MasterStore.getCountries());
      setStates(MasterStore.getStates());
      setDistricts(MasterStore.getDistricts());
    }
  };

  const handleCreateMaster = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newMasterForm.name.trim();
    if (!cleanName) return;

    const slugId = `${modalCategory.toLowerCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`;

    switch (modalCategory) {
      case 'STANDARDS': {
        const item: MasterStandard = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || cleanName.toUpperCase().replace(/\s+/g, '-').slice(0, 10),
          branchScope: newMasterForm.branchScope === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL',
          courseCategory: newMasterForm.categoryOrType || (newMasterForm.branchScope === 'COLLEGE' ? 'Degree Course' : 'Secondary'),
          boardId: newMasterForm.boardId,
          mediumId: newMasterForm.mediumId,
          divisions: ['A', 'B'],
          annualFeeEstimate: Number(newMasterForm.annualFee) || 36000,
          status: 'ACTIVE',
        };
        const updated = [item, ...standards];
        setStandards(updated);
        MasterStore.saveStandards(updated);
        break;
      }
      case 'BOARDS': {
        const item: MasterBoard = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || cleanName.toUpperCase().slice(0, 6),
          branchScope: newMasterForm.branchScope,
          affiliationNo: newMasterForm.affiliationNo || `AFF-${Date.now().toString().slice(-4)}`,
          state: newMasterForm.state || 'Maharashtra',
          status: 'ACTIVE',
        };
        const updated = [item, ...boards];
        setBoards(updated);
        MasterStore.saveBoards(updated);
        break;
      }
      case 'MEDIUMS': {
        const item: MasterMedium = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || cleanName.toUpperCase().slice(0, 4),
          status: 'ACTIVE',
        };
        const updated = [item, ...mediums];
        setMediums(updated);
        MasterStore.saveMediums(updated);
        break;
      }
      case 'DIVISIONS': {
        const item: MasterDivision = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || cleanName.slice(0, 2).toUpperCase(),
          shift: newMasterForm.shift || 'MORNING',
          defaultRoom: newMasterForm.defaultRoom || 'rm-sch-101',
          capacity: Number(newMasterForm.capacity) || 45,
          status: 'ACTIVE',
        };
        const updated = [item, ...divisions];
        setDivisions(updated);
        MasterStore.saveDivisions(updated);
        break;
      }
      case 'SUBJECTS': {
        const item: MasterSubject = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || 'SUB-100',
          type: newMasterForm.subjectType || 'BOTH',
          branchScope: newMasterForm.branchScope,
          departmentId: newMasterForm.departmentId,
          maxMarks: Number(newMasterForm.maxMarks) || 100,
          passingMarks: Number(newMasterForm.passingMarks) || 35,
          status: 'ACTIVE',
        };
        const updated = [item, ...subjects];
        setSubjects(updated);
        MasterStore.saveSubjects(updated);
        break;
      }
      case 'CLASSROOMS': {
        const item: MasterClassroom = {
          id: slugId,
          name: cleanName,
          roomCode: newMasterForm.code || 'RM-NEW',
          type: (newMasterForm.categoryOrType as any) || 'CLASSROOM',
          branchScope: newMasterForm.branchScope,
          wing: newMasterForm.wing || 'Main Academic Wing',
          floor: newMasterForm.floor || 'Ground Floor',
          capacity: Number(newMasterForm.capacity) || 40,
          facilities: newMasterForm.facilities
            ? newMasterForm.facilities.split(',').map((f) => f.trim()).filter(Boolean)
            : ['CCTV Surveillance', 'Digital Screen'],
          status: 'ACTIVE',
        };
        const updated = [item, ...classrooms];
        setClassrooms(updated);
        MasterStore.saveClassrooms(updated);
        break;
      }
      case 'DEPARTMENTS': {
        const item: MasterDepartment = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || 'DEPT',
          headOfDepartment: newMasterForm.headOfDepartment || 'Designated Faculty Incharge',
          branchScope: newMasterForm.branchScope,
          email: newMasterForm.email || `${cleanName.toLowerCase().replace(/\s+/g, '')}@zepfoundation.org`,
          status: 'ACTIVE',
        };
        const updated = [item, ...departments];
        setDepartments(updated);
        MasterStore.saveDepartments(updated);
        break;
      }
      case 'DESIGNATIONS': {
        const item: MasterDesignation = {
          id: slugId,
          title: cleanName,
          code: newMasterForm.code || 'DESIG',
          category: (newMasterForm.categoryOrType as any) || 'FACULTY',
          branchScope: newMasterForm.branchScope,
          payGrade: newMasterForm.payGrade || 'Grade-A',
          status: 'ACTIVE',
        };
        const updated = [item, ...designations];
        setDesignations(updated);
        MasterStore.saveDesignations(updated);
        break;
      }
      case 'TEACHERS': {
        const item: MasterTeacher = {
          id: slugId,
          employeeCode: newMasterForm.code || `TCH-${Date.now().toString().slice(-4)}`,
          name: cleanName,
          designationId: newMasterForm.designationId,
          departmentId: newMasterForm.departmentId,
          branchScope: newMasterForm.branchScope,
          qualification: newMasterForm.categoryOrType || 'B.Ed / M.Sc',
          phone: newMasterForm.phone || '+91 98220 00000',
          email: newMasterForm.email || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@zepfoundation.org`,
          assignedSubjectIds: [],
          status: 'ACTIVE',
        };
        const updated = [item, ...teachers];
        setTeachers(updated);
        MasterStore.saveTeachers(updated);
        break;
      }
      case 'STAFF': {
        const item: MasterStaff = {
          id: slugId,
          staffCode: newMasterForm.code || `STF-${Date.now().toString().slice(-4)}`,
          name: cleanName,
          designationId: newMasterForm.designationId,
          departmentId: newMasterForm.departmentId,
          branchScope: newMasterForm.branchScope,
          roleCategory: (newMasterForm.roleCategory as any) || 'ADMINISTRATIVE',
          phone: newMasterForm.phone || '+91 98220 00000',
          email: newMasterForm.email || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@zepfoundation.org`,
          shift: newMasterForm.shift === 'MORNING' ? 'Morning Shift (8:00 AM - 4:00 PM)' : 'General (9:00 AM - 5:30 PM)',
          status: 'ACTIVE',
        };
        const updated = [item, ...staff];
        setStaff(updated);
        MasterStore.saveStaff(updated);
        break;
      }
      case 'ORIGINAL_DOCS': {
        const item: MasterOriginalDocument = {
          id: slugId,
          title: cleanName,
          code: newMasterForm.code || 'DOC-ORIG',
          branchScope: newMasterForm.branchScope,
          isMandatory: Boolean(newMasterForm.isMandatory),
          issuingAuthority: newMasterForm.issuingAuthority || 'Competent Authority / Government Office',
          defaultRackCupboard: newMasterForm.defaultRackCupboard || 'C-01 (Fireproof Steel Archive)',
          retentionYears: Number(newMasterForm.retentionYears) || 10,
          status: 'ACTIVE',
        };
        const updated = [item, ...documents];
        setDocuments(updated);
        MasterStore.saveDocuments(updated);
        break;
      }
      case 'ACADEMIC_YEARS': {
        const isCurr = Boolean(newMasterForm.isCurrent);
        const item: MasterAcademicYear = {
          id: slugId,
          label: cleanName,
          startDate: newMasterForm.startDate || '2026-06-01',
          endDate: newMasterForm.endDate || '2027-05-31',
          isCurrent: isCurr,
          status: isCurr ? 'ACTIVE' : 'UPCOMING',
        };
        let updated = [item, ...years];
        if (isCurr) {
          updated = updated.map((y) => (y.id === item.id ? y : { ...y, isCurrent: false }));
        }
        setYears(updated);
        MasterStore.saveYears(updated);
        break;
      }
      case 'COUNTRIES': {
        const item: MasterCountry = {
          id: slugId,
          name: cleanName,
          isoCode: (newMasterForm.isoCode || newMasterForm.code || 'IN').toUpperCase().slice(0, 2),
          iso3: (newMasterForm.iso3 || 'IND').toUpperCase().slice(0, 3),
          dialCode: newMasterForm.dialCode || '+91',
          currency: newMasterForm.currency || 'INR (₹)',
          status: 'ACTIVE',
        };
        const updated = [item, ...countries];
        setCountries(updated);
        MasterStore.saveCountries(updated);
        break;
      }
      case 'STATES': {
        const item: MasterState = {
          id: slugId,
          name: cleanName,
          code: (newMasterForm.code || 'MH').toUpperCase().slice(0, 4),
          countryId: newMasterForm.countryId || 'cnt-in',
          capital: newMasterForm.capital || cleanName,
          status: 'ACTIVE',
        };
        const updated = [item, ...states];
        setStates(updated);
        MasterStore.saveStates(updated);
        break;
      }
      case 'DISTRICTS': {
        const item: MasterDistrict = {
          id: slugId,
          name: cleanName,
          code: (newMasterForm.code || 'DST').toUpperCase().slice(0, 6),
          stateId: newMasterForm.stateId || 'st-mh',
          division: newMasterForm.divisionRegion || 'Maharashtra Division',
          isHeadquarterZone: Boolean(newMasterForm.isHeadquarterZone),
          status: 'ACTIVE',
        };
        const updated = [item, ...districts];
        setDistricts(updated);
        MasterStore.saveDistricts(updated);
        break;
      }
      case 'FEE_HEADS': {
        const item: MasterFeeHead = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || 'FH-CUSTOM',
          frequency: (newMasterForm.categoryOrType as any) || 'Annual',
          defaultAmount: Number(newMasterForm.annualFee) || 5000,
          branchScope: newMasterForm.branchScope,
          description: newMasterForm.headOfDepartment || 'Institutional fee head',
        };
        setFeeHeads([item, ...feeHeads]);
        break;
      }
      case 'FEE_GROUPS': {
        const item: MasterFeeGroup = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || 'GRP-NEW',
          targetStandard: newMasterForm.categoryOrType || 'All Standards',
          totalAnnualFee: Number(newMasterForm.annualFee) || 40000,
          installmentsAllowed: 3,
        };
        setFeeGroups([item, ...feeGroups]);
        break;
      }
      case 'EXAM_GROUPS': {
        const item: MasterExamGroup = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || 'EX-GRP',
          weightagePercent: newMasterForm.categoryOrType || '25%',
          termPeriod: 'Term Assessment',
          description: newMasterForm.headOfDepartment || 'Curriculum examination evaluation',
        };
        setExamGroups([item, ...examGroups]);
        break;
      }
      case 'GRADING_SCALES': {
        const item: MasterGradingScale = {
          id: slugId,
          grade: cleanName.toUpperCase().slice(0, 4),
          minScore: Number(newMasterForm.passingMarks) || 50,
          maxScore: Number(newMasterForm.maxMarks) || 100,
          gpaPoint: 8.0,
          description: newMasterForm.headOfDepartment || 'Grading band',
        };
        setGradingScales([item, ...gradingScales]);
        break;
      }
      case 'LEAVE_TYPES': {
        const item: MasterLeaveType = {
          id: slugId,
          name: cleanName,
          code: newMasterForm.code || 'LV',
          annualQuota: Number(newMasterForm.capacity) || 12,
          payType: 'Full Paid',
          terms: newMasterForm.headOfDepartment || 'Standard leave entitlement',
        };
        setLeaveTypes([item, ...leaveTypes]);
        break;
      }
      case 'COMPENSATION_BANDS': {
        const item: MasterCompensationBand = {
          id: slugId,
          roleName: cleanName,
          payScaleLevel: newMasterForm.code || 'Level 8',
          basicSalaryRange: `₹${newMasterForm.annualFee || '25,000'} - ₹50,000`,
          daPercent: 50,
          hraPercent: 20,
          epfApplicable: '12% Statutory',
        };
        setCompensationBands([item, ...compensationBands]);
        break;
      }
      case 'BIOMETRIC_DEVICES': {
        const item: MasterBiometricDevice = {
          id: slugId,
          name: cleanName,
          model: newMasterForm.code || 'ZKTeco Pro',
          ipAddress: '192.168.1.250',
          port: 4370,
          location: newMasterForm.wing || 'Campus Entrance',
          usersMapped: 0,
          status: 'ONLINE',
        };
        setBiometricDevices([item, ...biometricDevices]);
        break;
      }
      case 'TRANSPORT_VEHICLES': {
        const item: MasterTransportVehicle = {
          id: slugId,
          vehicleNo: newMasterForm.code || 'MH-12-TR-9999',
          busName: cleanName,
          capacity: Number(newMasterForm.capacity) || 40,
          driverName: newMasterForm.headOfDepartment || 'Assigned Driver',
          rtoFitnessExpiry: '2027-12-31',
          gpsIMEI: '864209040000000',
          status: 'ACTIVE',
        };
        setTransportVehicles([item, ...transportVehicles]);
        break;
      }
      case 'HOSTEL_ROOM_TYPES': {
        const item: MasterHostelRoomType = {
          id: slugId,
          typeName: cleanName,
          blockName: newMasterForm.wing || 'Main Hostel Block',
          monthlyFee: Number(newMasterForm.annualFee) || 5000,
          amenities: newMasterForm.facilities || 'Study Table, Bed, Wardrobe',
          totalBeds: Number(newMasterForm.capacity) || 20,
          vacantBeds: Number(newMasterForm.capacity) || 20,
        };
        setHostelRoomTypes([item, ...hostelRoomTypes]);
        break;
      }
      case 'INVENTORY_SUPPLIERS': {
        const item: MasterInventorySupplier = {
          id: slugId,
          supplierName: cleanName,
          contactPerson: newMasterForm.headOfDepartment || 'Manager',
          phone: newMasterForm.phone || '+91 98220 00000',
          category: newMasterForm.categoryOrType || 'General Supplies',
          city: newMasterForm.state || 'Solapur',
          gstin: newMasterForm.code || '27AABCS0000A1Z0',
        };
        setInventorySuppliers([item, ...inventorySuppliers]);
        break;
      }
      case 'ROLES_PERMISSIONS': {
        const item: MasterRolePermission = {
          id: slugId,
          roleName: cleanName,
          accessScope: newMasterForm.headOfDepartment || 'Designated Module Access',
          usersCount: 1,
          canManageFees: false,
          canApproveAdmissions: false,
          canExportAudit: false,
        };
        setRolesPermissions([item, ...rolesPermissions]);
        break;
      }
      case 'INSTITUTES': {
        const item: MasterInstitute = {
          id: slugId,
          instituteName: cleanName,
          regNo: newMasterForm.code || 'MH/EDU/TR-00000',
          affiliation: newMasterForm.affiliationNo || 'Affiliated Institution',
          campusAddress: newMasterForm.wing || 'Trust Campus, Solapur',
          principalName: 'Principal in Charge',
          studentCapacity: Number(newMasterForm.capacity) || 500,
          activeEnrollment: 0,
        };
        setInstitutes([item, ...institutes]);
        break;
      }
      default:
        break;
    }

    setActiveCategory(modalCategory);
    setIsAddModalOpen(false);
    setNewMasterForm(initialNewMasterForm);
  };

  // Export current catalog as JSON
  const handleExportJSON = () => {
    const payload = {
      institution: 'Zep Foundation Bhose',
      school: 'Modern Public School And Junior College Bhose',
      college: 'Modern College Of Hotel Management And Technology Solapur',
      exportedAt: new Date().toISOString(),
      standards,
      boards,
      mediums,
      divisions,
      subjects,
      classrooms,
      departments,
      designations,
      teachers,
      staff,
      documents,
      academicYears: years,
      countries,
      states,
      districts,
      feeHeads,
      feeGroups,
      examGroups,
      gradingScales,
      leaveTypes,
      compensationBands,
      biometricDevices,
      transportVehicles,
      hostelRoomTypes,
      inventorySuppliers,
      rolesPermissions,
      institutes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institutional_Masters_Zep_Foundation_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Nav categories config - 7 Structured Groups covering all 27 System Masters
  const categoryGroups = [
    {
      groupTitle: '1. Curriculum & Classes',
      categories: [
        { id: 'STANDARDS', label: 'Standards & Classes', icon: <GraduationCap className="w-4 h-4" />, count: standards.length },
        { id: 'BOARDS', label: 'Boards & Councils', icon: <BookOpen className="w-4 h-4" />, count: boards.length },
        { id: 'MEDIUMS', label: 'Mediums of Instruction', icon: <Sparkles className="w-4 h-4" />, count: mediums.length },
        { id: 'DIVISIONS', label: 'Divisions & Sections', icon: <Hash className="w-4 h-4" />, count: divisions.length },
        { id: 'SUBJECTS', label: 'Subjects Master', icon: <BookOpen className="w-4 h-4" />, count: subjects.length },
        { id: 'CLASSROOMS', label: 'Classrooms & Labs', icon: <DoorOpen className="w-4 h-4" />, count: classrooms.length },
      ],
    },
    {
      groupTitle: '2. Fees & Financials',
      categories: [
        { id: 'FEE_GROUPS', label: 'Fee Groups & Structures', icon: <Layers className="w-4 h-4" />, count: feeGroups.length },
        { id: 'FEE_HEADS', label: 'Fee Heads & Tariffs', icon: <CreditCard className="w-4 h-4" />, count: feeHeads.length },
      ],
    },
    {
      groupTitle: '3. Examinations',
      categories: [
        { id: 'EXAM_GROUPS', label: 'Exam Groups & Terms', icon: <ClipboardList className="w-4 h-4" />, count: examGroups.length },
        { id: 'GRADING_SCALES', label: 'Grading Scales & GPA', icon: <CheckSquare className="w-4 h-4" />, count: gradingScales.length },
      ],
    },
    {
      groupTitle: '4. Staff, Faculty & HR',
      categories: [
        { id: 'DEPARTMENTS', label: 'Academic & Admin Depts', icon: <Building className="w-4 h-4" />, count: departments.length },
        { id: 'DESIGNATIONS', label: 'Official Designations', icon: <Award className="w-4 h-4" />, count: designations.length },
        { id: 'TEACHERS', label: 'Teachers & Faculty', icon: <Users className="w-4 h-4" />, count: teachers.length },
        { id: 'STAFF', label: 'Staff Roster & Support', icon: <Briefcase className="w-4 h-4" />, count: staff.length },
        { id: 'LEAVE_TYPES', label: 'Leave Types & Quotas', icon: <Calendar className="w-4 h-4" />, count: leaveTypes.length },
        { id: 'COMPENSATION_BANDS', label: 'Compensation & Pay Scales', icon: <Briefcase className="w-4 h-4" />, count: compensationBands.length },
      ],
    },
    {
      groupTitle: '5. Campus & Logistics',
      categories: [
        { id: 'BIOMETRIC_DEVICES', label: 'Biometric Machines & IPs', icon: <Cpu className="w-4 h-4" />, count: biometricDevices.length },
        { id: 'TRANSPORT_VEHICLES', label: 'Transport Bus Fleet', icon: <Bus className="w-4 h-4" />, count: transportVehicles.length },
        { id: 'HOSTEL_ROOM_TYPES', label: 'Hostel Room Types & Beds', icon: <Bed className="w-4 h-4" />, count: hostelRoomTypes.length },
        { id: 'INVENTORY_SUPPLIERS', label: 'Inventory Suppliers', icon: <Package className="w-4 h-4" />, count: inventorySuppliers.length },
        { id: 'ORIGINAL_DOCS', label: 'Vault Original Documents', icon: <FileText className="w-4 h-4" />, count: documents.length },
      ],
    },
    {
      groupTitle: '6. Organization & Access',
      categories: [
        { id: 'INSTITUTES', label: 'Trust Institutes & Campuses', icon: <School className="w-4 h-4" />, count: institutes.length },
        { id: 'ROLES_PERMISSIONS', label: 'Roles & Permission Matrix', icon: <ShieldCheck className="w-4 h-4" />, count: rolesPermissions.length },
      ],
    },
    {
      groupTitle: '7. Global & Geographic',
      categories: [
        { id: 'ACADEMIC_YEARS', label: 'Academic Session Years', icon: <Calendar className="w-4 h-4" />, count: years.length },
        { id: 'COUNTRIES', label: 'Countries & Currencies', icon: <Globe className="w-4 h-4" />, count: countries.length },
        { id: 'STATES', label: 'States & Capitals', icon: <MapPin className="w-4 h-4" />, count: states.length },
        { id: 'DISTRICTS', label: 'Districts & Zones', icon: <MapPin className="w-4 h-4" />, count: districts.length },
      ],
    },
  ];

  return (
    <div className="space-y-3.5 animate-fade-in pb-4">
      {/* 1. Header Card - Compact & Clean */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                Academic & Global Masters Center
              </h1>
              <p className="text-[11px] font-semibold text-slate-500">
                Institutional Master Database for <span className="text-orange-600 font-bold">Zep Foundation Bhose</span> • Standards, Courses, Departments & Vault Documents
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset all master records to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => openAddModalFor(activeCategory)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white shadow-xs shadow-orange-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Master Record</span>
          </button>
        </div>
      </div>

      {/* 2. Main Layout: Left Sticky Categories & Scope Filter + Right Scrollable Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Pinned Scope Filter & Scrollable Masters Navigation Tree */}
        <div className="lg:col-span-3 sticky top-2 space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col max-h-[calc(100vh-140px)]">
            {/* Institution Scope Filter (All / School / College) - Pinned at Top */}
            <div className="shrink-0 pb-3 border-b border-slate-100">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Scope Filter
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                {(['ALL', 'SCHOOL', 'COLLEGE'] as BranchScope[]).map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setBranchScopeFilter(scope)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      branchScopeFilter === scope
                        ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {scope === 'ALL' ? 'All' : scope === 'SCHOOL' ? 'School' : 'College'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Navigation Lists - Viewport Bounded with Invisible Scrolling */}
            <div className="overflow-y-auto erp-table-scroll py-2 space-y-3 flex-1 pr-1">
              {categoryGroups.map((grp) => (
                <div key={grp.groupTitle} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    {grp.groupTitle}
                  </div>
                  <div className="space-y-0.5">
                    {grp.categories.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setActiveCategory(cat.id as MasterCategory);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/90 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={isActive ? 'text-orange-600' : 'text-slate-400'}>
                              {cat.icon}
                            </span>
                            <span className="truncate">{cat.label}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-orange-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Institutional Information Pill */}
            <div className="shrink-0 mt-2 pt-2 border-t border-slate-100 bg-orange-50/60 border border-orange-200/60 rounded-xl p-2.5 text-[11px] text-orange-900 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-orange-800 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>Multi-Branch Masters</span>
              </div>
              <p className="text-[10px] leading-snug text-orange-800/80">
                Synchronized across School Standards & College HM degrees.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Master Records Table & Details with Interactive Scope Toolbar */}
        <div className="lg:col-span-9 space-y-3 min-w-0">
          {/* Filter Bar with Search, Direct Scope Switch & Add Action */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-1 w-full sm:w-auto">
              <div className="relative flex-1 min-w-[180px] sm:min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeCategory.toLowerCase().replace('_', ' ')} by name, code or ID...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800 transition-all"
                />
              </div>

              {/* Direct Scope Filter Toggle On Table Header */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                {(['ALL', 'SCHOOL', 'COLLEGE'] as BranchScope[]).map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setBranchScopeFilter(scope)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      branchScopeFilter === scope
                        ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {scope === 'ALL' ? 'All Scope' : scope === 'SCHOOL' ? 'School' : 'College'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <span className="font-bold text-slate-800">
                  {activeCategory.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold text-[10px]">
                  {branchScopeFilter}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openAddModalFor(activeCategory)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white shadow-xs shadow-orange-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Record</span>
              </button>
            </div>
          </div>

          {/* Master Content Renderer */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* 1. STANDARDS & SEMESTERS TABLE */}
            {activeCategory === 'STANDARDS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Standard / Course Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Scope" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Category" sortKey="courseCategory" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Divisions</th>
                      <SortableTh label="Fee Est." sortKey="annualFeeEstimate" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = standards.filter((s) => {
                        if (branchScopeFilter !== 'ALL' && s.branchScope !== branchScopeFilter) return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          s.name.toLowerCase().includes(q) ||
                          s.id.toLowerCase().includes(q) ||
                          s.code.toLowerCase().includes(q) ||
                          (s.courseCategory && s.courseCategory.toLowerCase().includes(q))
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Standards & Classes');
                      return sortMasterList(list).map((std, index) => (
                        <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              {std.branchScope === 'COLLEGE' ? (
                                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              ) : (
                                <GraduationCap className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                              )}
                              <span>{std.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-5.5">
                              Code: {std.code}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(std.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === std.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{std.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                std.branchScope === 'SCHOOL'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {std.branchScope === 'SCHOOL' ? 'School' : 'College'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 font-semibold">{std.courseCategory || 'Standard'}</td>
                          <td className="p-3.5">
                            <div className="flex gap-1">
                              {std.divisions.map((d) => (
                                <span key={d} className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-700">
                                  Div {d}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">₹{std.annualFeeEstimate.toLocaleString('en-IN')}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'STANDARDS', item: { ...std } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'STANDARDS', id: std.id, name: std.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. BOARDS TABLE */}
            {activeCategory === 'BOARDS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Board / University Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Scope" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Affiliation No." sortKey="affiliationNo" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="State / Jurisdiction" sortKey="state" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = boards.filter((b) => {
                        if (branchScopeFilter !== 'ALL' && b.branchScope !== branchScopeFilter && b.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Boards & Universities');
                      return sortMasterList(list).map((brd, index) => (
                        <tr key={brd.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{brd.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(brd.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === brd.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{brd.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-bold text-orange-600">{brd.code}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {brd.branchScope}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-600">{brd.affiliationNo}</td>
                          <td className="p-3.5 text-slate-600">{brd.state}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'BOARDS', item: { ...brd } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'BOARDS', id: brd.id, name: brd.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. MEDIUMS TABLE */}
            {activeCategory === 'MEDIUMS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Medium of Instruction" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Medium Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = mediums.filter((med) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return med.name.toLowerCase().includes(q) || med.id.toLowerCase().includes(q) || med.code.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(6, 'Mediums of Instruction');
                      return sortMasterList(list).map((med, index) => (
                        <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{med.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(med.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === med.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{med.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{med.code}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'MEDIUMS', item: { ...med } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'MEDIUMS', id: med.id, name: med.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. DIVISIONS & SECTIONS */}
            {activeCategory === 'DIVISIONS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Division / Section" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Shift Schedule" sortKey="shift" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Assigned Room" sortKey="defaultRoom" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Max Capacity" sortKey="capacity" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = divisions.filter((div) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return div.name.toLowerCase().includes(q) || div.id.toLowerCase().includes(q) || div.code.toLowerCase().includes(q) || div.defaultRoom.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Divisions & Sections');
                      return sortMasterList(list).map((div, index) => (
                        <tr key={div.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{div.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(div.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === div.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{div.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 text-slate-700 font-semibold">{div.shift}</td>
                          <td className="p-3.5 font-mono text-slate-600">{div.defaultRoom}</td>
                          <td className="p-3.5 font-bold text-slate-900">{div.capacity} Students</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'DIVISIONS', item: { ...div } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'DIVISIONS', id: div.id, name: div.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. SUBJECTS TABLE */}
            {activeCategory === 'SUBJECTS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Subject Title" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Scope" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Type" sortKey="type" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Max Marks" sortKey="maxMarks" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Pass Marks" sortKey="passingMarks" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = subjects.filter((s) => {
                        if (branchScopeFilter !== 'ALL' && s.branchScope !== branchScopeFilter && s.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Subjects');
                      return sortMasterList(list).map((sub, index) => (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{sub.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(sub.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === sub.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{sub.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{sub.code}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {sub.branchScope}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-600">{sub.type}</td>
                          <td className="p-3.5 font-bold text-slate-900">{sub.maxMarks}</td>
                          <td className="p-3.5 font-bold text-emerald-600">{sub.passingMarks}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'SUBJECTS', item: { ...sub } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'SUBJECTS', id: sub.id, name: sub.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. CLASSROOMS & KITCHEN LABS */}
            {activeCategory === 'CLASSROOMS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="roomCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Room / Lab Facility" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Room Code" sortKey="roomCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Type" sortKey="type" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Location Wing" sortKey="wing" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Capacity" sortKey="capacity" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Key Facilities</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = classrooms.filter((c) => {
                        if (branchScopeFilter !== 'ALL' && c.branchScope !== branchScopeFilter && c.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return c.name.toLowerCase().includes(q) || c.roomCode.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Classrooms & Labs');
                      return sortMasterList(list).map((rm, index) => (
                        <tr key={rm.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{rm.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(rm.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === rm.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{rm.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{rm.roomCode}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{rm.type.replace('_', ' ')}</td>
                          <td className="p-3.5 text-slate-600">{rm.wing}, {rm.floor}</td>
                          <td className="p-3.5 font-bold text-slate-900">{rm.capacity} Stations</td>
                          <td className="p-3.5 text-slate-500 text-[11px]">{rm.facilities.join(', ')}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'CLASSROOMS', item: { ...rm } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'CLASSROOMS', id: rm.id, name: rm.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 7. DEPARTMENTS */}
            {activeCategory === 'DEPARTMENTS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Department Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Scope" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Head of Department (HOD)" sortKey="headOfDepartment" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Official Contact Email" sortKey="email" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = departments.filter((d) => {
                        if (branchScopeFilter !== 'ALL' && d.branchScope !== branchScopeFilter && d.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Academic Departments');
                      return sortMasterList(list).map((dept, index) => (
                        <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{dept.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(dept.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === dept.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{dept.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{dept.code}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {dept.branchScope}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800">{dept.headOfDepartment}</td>
                          <td className="p-3.5 text-slate-500 font-mono text-[11px]">{dept.email}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'DEPARTMENTS', item: { ...dept } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'DEPARTMENTS', id: dept.id, name: dept.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 8. DESIGNATIONS */}
            {activeCategory === 'DESIGNATIONS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Designation Title" sortKey="title" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Category" sortKey="category" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Pay Grade Scale" sortKey="payGrade" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = designations.filter((d) => {
                        if (branchScopeFilter !== 'ALL' && d.branchScope !== branchScopeFilter && d.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return d.title.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Designations');
                      return sortMasterList(list).map((des, index) => (
                        <tr key={des.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{des.title}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(des.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === des.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{des.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{des.code}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{des.category}</td>
                          <td className="p-3.5 text-slate-600">{des.payGrade || 'Standard'}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'DESIGNATIONS', item: { ...des } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'DESIGNATIONS', id: des.id, name: des.title })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 9. TEACHERS ROSTER */}
            {activeCategory === 'TEACHERS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="employeeCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Faculty Member" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Employee Code" sortKey="employeeCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Branch" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Qualifications" sortKey="qualification" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Contact Phone" sortKey="phone" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Email" sortKey="email" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = teachers.filter((t) => {
                        if (branchScopeFilter !== 'ALL' && t.branchScope !== branchScopeFilter && t.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return t.name.toLowerCase().includes(q) || t.employeeCode.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Teachers & Faculty');
                      return sortMasterList(list).map((tch, index) => (
                        <tr key={tch.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{tch.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(tch.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === tch.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{tch.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{tch.employeeCode}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {tch.branchScope}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 font-semibold">{tch.qualification}</td>
                          <td className="p-3.5 text-slate-700">{tch.phone}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-500">{tch.email}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'TEACHERS', item: { ...tch } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'TEACHERS', id: tch.id, name: tch.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 10. STAFF ROSTER */}
            {activeCategory === 'STAFF' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="staffCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Staff Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Staff Code" sortKey="staffCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Role Category" sortKey="roleCategory" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Duty Shift" sortKey="shift" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Phone Contact" sortKey="phone" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = staff.filter((s) => {
                        if (branchScopeFilter !== 'ALL' && s.branchScope !== branchScopeFilter && s.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return s.name.toLowerCase().includes(q) || s.staffCode.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Staff Members');
                      return sortMasterList(list).map((st, index) => (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{st.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(st.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === st.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{st.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{st.staffCode}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{st.roleCategory}</td>
                          <td className="p-3.5 text-slate-600">{st.shift}</td>
                          <td className="p-3.5 text-slate-700">{st.phone}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'STAFF', item: { ...st } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'STAFF', id: st.id, name: st.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 11. ORIGINAL DOCUMENTS CHECKLIST */}
            {activeCategory === 'ORIGINAL_DOCS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Mandatory Verification Document" sortKey="title" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Doc Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Applicability" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Mandatory?" sortKey="isMandatory" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Designated Rack Vault" sortKey="defaultRackCupboard" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Retention" sortKey="retentionYears" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = documents.filter((d) => {
                        if (branchScopeFilter !== 'ALL' && d.branchScope !== branchScopeFilter && d.branchScope !== 'ALL')
                          return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return d.title.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Original Documents');
                      return sortMasterList(list).map((doc, index) => (
                        <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{doc.title}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(doc.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === doc.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{doc.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{doc.code}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {doc.branchScope}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                doc.isMandatory
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {doc.isMandatory ? 'Mandatory' : 'Conditional'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-600">{doc.defaultRackCupboard}</td>
                          <td className="p-3.5 font-bold text-slate-800">{doc.retentionYears} Years</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'ORIGINAL_DOCS', item: { ...doc } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'ORIGINAL_DOCS', id: doc.id, name: doc.title })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 12. ACADEMIC YEARS */}
            {activeCategory === 'ACADEMIC_YEARS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="label" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Academic Session Year" sortKey="label" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Start Date" sortKey="startDate" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="End Date" sortKey="endDate" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Current Active Year" sortKey="isCurrent" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Status" sortKey="status" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = years.filter((yr) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return yr.label.toLowerCase().includes(q) || yr.id.toLowerCase().includes(q);
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Academic Years');
                      return sortMasterList(list).map((yr, index) => (
                        <tr key={yr.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-extrabold text-slate-900 text-sm">{yr.label}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(yr.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === yr.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{yr.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 text-slate-600">{yr.startDate}</td>
                          <td className="p-3.5 text-slate-600">{yr.endDate}</td>
                          <td className="p-3.5">
                            {yr.isCurrent ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                CURRENT ACTIVE
                              </span>
                            ) : (
                              <span className="text-slate-400 font-semibold">—</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-slate-600 font-bold text-[11px]">
                              {yr.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'ACADEMIC_YEARS', item: { ...yr } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'ACADEMIC_YEARS', id: yr.id, name: yr.label })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 13. COUNTRIES */}
            {activeCategory === 'COUNTRIES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="isoCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Country" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="ISO-2" sortKey="isoCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="ISO-3" sortKey="iso3" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Dial Code" sortKey="dialCode" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Currency" sortKey="currency" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = countries.filter((cnt) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          cnt.name.toLowerCase().includes(q) ||
                          cnt.isoCode.toLowerCase().includes(q) ||
                          cnt.iso3.toLowerCase().includes(q) ||
                          cnt.dialCode.toLowerCase().includes(q) ||
                          cnt.currency.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Countries');
                      return sortMasterList(list).map((cnt, index) => (
                        <tr key={cnt.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{cnt.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cnt.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === cnt.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{cnt.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{cnt.isoCode}</td>
                          <td className="p-3.5 font-mono text-slate-600">{cnt.iso3}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{cnt.dialCode}</td>
                          <td className="p-3.5 font-bold text-slate-900">{cnt.currency}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'COUNTRIES', item: { ...cnt } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'COUNTRIES', id: cnt.id, name: cnt.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 14. STATES */}
            {activeCategory === 'STATES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="State / Province" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="State Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Country ID" sortKey="countryId" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Capital City" sortKey="capital" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = states.filter((st) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          st.name.toLowerCase().includes(q) ||
                          st.code.toLowerCase().includes(q) ||
                          st.capital.toLowerCase().includes(q) ||
                          st.countryId.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'States');
                      return sortMasterList(list).map((st, index) => (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{st.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(st.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === st.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{st.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{st.code}</td>
                          <td className="p-3.5 font-mono text-slate-600">{st.countryId}</td>
                          <td className="p-3.5 text-slate-700 font-semibold">{st.capital}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'STATES', item: { ...st } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'STATES', id: st.id, name: st.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 15. DISTRICTS */}
            {activeCategory === 'DISTRICTS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="District Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="District RTO Code" sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Division / Region" sortKey="division" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Headquarter Zone" sortKey="isHeadquarterZone" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = districts.filter((d) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          d.name.toLowerCase().includes(q) ||
                          d.code.toLowerCase().includes(q) ||
                          d.id.toLowerCase().includes(q) ||
                          d.division.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Districts');
                      return sortMasterList(list).map((dst, index) => (
                        <tr key={dst.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">{dst.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(dst.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            >
                              {copiedId === dst.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{dst.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-orange-600">{dst.code}</td>
                          <td className="p-3.5 text-slate-700">{dst.division}</td>
                          <td className="p-3.5">
                            {dst.isHeadquarterZone ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
                                TRUST HQ (SOLAPUR & BHOSE)
                              </span>
                            ) : (
                              <span className="text-slate-400 font-semibold">—</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'DISTRICTS', item: { ...dst } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'DISTRICTS', id: dst.id, name: dst.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 16. FEE_GROUPS */}
            {activeCategory === 'FEE_GROUPS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Fee Group Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Target Standards" sortKey="targetStandard" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Total Annual Fee" sortKey="totalAnnualFee" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Installments</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = feeGroups.filter((fg) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          fg.name.toLowerCase().includes(q) ||
                          fg.code.toLowerCase().includes(q) ||
                          fg.id.toLowerCase().includes(q) ||
                          fg.targetStandard.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Fee Groups');

                      return sortMasterList(list).map((fg, index) => (
                        <tr key={fg.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                              <span>{fg.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-5.5">Code: {fg.code}</span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(fg.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === fg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{fg.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-700">{fg.targetStandard}</td>
                          <td className="p-3.5 font-bold text-slate-900">₹{fg.totalAnnualFee.toLocaleString('en-IN')}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {fg.installmentsAllowed} Term Installments
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'FEE_GROUPS', item: { ...fg } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'FEE_GROUPS', id: fg.id, name: fg.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 17. FEE_HEADS */}
            {activeCategory === 'FEE_HEADS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Fee Head Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Frequency" sortKey="frequency" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Default Tariff" sortKey="defaultAmount" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Scope" sortKey="branchScope" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = feeHeads.filter((fh) => {
                        if (branchScopeFilter !== 'ALL' && fh.branchScope !== branchScopeFilter && fh.branchScope !== 'ALL') return false;
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          fh.name.toLowerCase().includes(q) ||
                          fh.code.toLowerCase().includes(q) ||
                          fh.id.toLowerCase().includes(q) ||
                          fh.frequency.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Fee Heads');

                      return sortMasterList(list).map((fh, index) => (
                        <tr key={fh.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{fh.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-5.5">Code: {fh.code}</span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(fh.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === fh.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{fh.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {fh.frequency}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">₹{fh.defaultAmount.toLocaleString('en-IN')}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                fh.branchScope === 'SCHOOL'
                                  ? 'bg-orange-100 text-orange-800'
                                  : fh.branchScope === 'COLLEGE'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {fh.branchScope}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 text-xs max-w-xs truncate">{fh.description}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'FEE_HEADS', item: { ...fh } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'FEE_HEADS', id: fh.id, name: fh.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 18. EXAM_GROUPS */}
            {activeCategory === 'EXAM_GROUPS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Exam Group Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Weightage %" sortKey="weightagePercent" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Assessment Period" sortKey="termPeriod" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = examGroups.filter((eg) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          eg.name.toLowerCase().includes(q) ||
                          eg.code.toLowerCase().includes(q) ||
                          eg.id.toLowerCase().includes(q) ||
                          eg.termPeriod.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Exam Groups');

                      return sortMasterList(list).map((eg, index) => (
                        <tr key={eg.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{eg.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-5.5">Code: {eg.code}</span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(eg.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === eg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{eg.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                              {eg.weightagePercent}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800">{eg.termPeriod}</td>
                          <td className="p-3.5 text-slate-600 max-w-xs truncate">{eg.description}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'EXAM_GROUPS', item: { ...eg } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'EXAM_GROUPS', id: eg.id, name: eg.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 19. GRADING_SCALES */}
            {activeCategory === 'GRADING_SCALES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="grade" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Grade" sortKey="grade" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Score Band (%)" sortKey="minScore" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="GPA / Grade Point" sortKey="gpaPoint" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Performance Remarks</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = gradingScales.filter((gs) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          gs.grade.toLowerCase().includes(q) ||
                          gs.description.toLowerCase().includes(q) ||
                          gs.id.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Grading Scales');

                      return sortMasterList(list).map((gs, index) => (
                        <tr key={gs.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 font-mono">
                              {gs.grade}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(gs.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === gs.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{gs.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-bold text-slate-800">{gs.minScore}% - {gs.maxScore}%</td>
                          <td className="p-3.5 font-extrabold text-blue-700">{gs.gpaPoint.toFixed(1)} / 10.0</td>
                          <td className="p-3.5 text-slate-700 font-medium">{gs.description}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'GRADING_SCALES', item: { ...gs } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'GRADING_SCALES', id: gs.id, name: gs.grade })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 20. LEAVE_TYPES */}
            {activeCategory === 'LEAVE_TYPES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="code" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Leave Type Name" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Annual Quota" sortKey="annualQuota" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Pay Treatment" sortKey="payType" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Policy Terms & Conditions</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = leaveTypes.filter((lt) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          lt.name.toLowerCase().includes(q) ||
                          lt.code.toLowerCase().includes(q) ||
                          lt.id.toLowerCase().includes(q) ||
                          lt.payType.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Leave Types');

                      return sortMasterList(list).map((lt, index) => (
                        <tr key={lt.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{lt.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-5.5">Code: {lt.code}</span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(lt.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === lt.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{lt.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-extrabold text-slate-900">{lt.annualQuota} Days / Year</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {lt.payType}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 max-w-xs truncate">{lt.terms}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'LEAVE_TYPES', item: { ...lt } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'LEAVE_TYPES', id: lt.id, name: lt.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 21. COMPENSATION_BANDS */}
            {activeCategory === 'COMPENSATION_BANDS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="roleName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Role / Cadre" sortKey="roleName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Pay Scale Level" sortKey="payScaleLevel" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Basic Salary Range</th>
                      <th className="p-3.5">DA %</th>
                      <th className="p-3.5">HRA %</th>
                      <th className="p-3.5">EPF Coverage</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = compensationBands.filter((cb) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          cb.roleName.toLowerCase().includes(q) ||
                          cb.payScaleLevel.toLowerCase().includes(q) ||
                          cb.id.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Compensation Bands');

                      return sortMasterList(list).map((cb, index) => (
                        <tr key={cb.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>{cb.roleName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cb.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === cb.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{cb.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-bold text-slate-700">{cb.payScaleLevel}</td>
                          <td className="p-3.5 font-extrabold text-slate-900">{cb.basicSalaryRange}</td>
                          <td className="p-3.5 font-bold text-emerald-700">{cb.daPercent}%</td>
                          <td className="p-3.5 font-bold text-blue-700">{cb.hraPercent}%</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                              {cb.epfApplicable}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'COMPENSATION_BANDS', item: { ...cb } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'COMPENSATION_BANDS', id: cb.id, name: cb.roleName })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 22. BIOMETRIC_DEVICES */}
            {activeCategory === 'BIOMETRIC_DEVICES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Terminal Name & Model" sortKey="name" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Campus Location" sortKey="location" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">IP Address : Port</th>
                      <SortableTh label="Users Mapped" sortKey="usersMapped" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = biometricDevices.filter((bd) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          bd.name.toLowerCase().includes(q) ||
                          bd.model.toLowerCase().includes(q) ||
                          bd.id.toLowerCase().includes(q) ||
                          bd.location.toLowerCase().includes(q) ||
                          bd.ipAddress.includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Biometric Devices');

                      return sortMasterList(list).map((bd, index) => (
                        <tr key={bd.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{bd.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-5.5">Hardware: {bd.model}</span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(bd.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === bd.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{bd.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-medium text-slate-800">{bd.location}</td>
                          <td className="p-3.5 font-mono text-slate-600 font-semibold">{bd.ipAddress}:{bd.port}</td>
                          <td className="p-3.5 font-bold text-slate-800">{bd.usersMapped} Active Personnel</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {bd.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'BIOMETRIC_DEVICES', item: { ...bd } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'BIOMETRIC_DEVICES', id: bd.id, name: bd.name })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 23. TRANSPORT_VEHICLES */}
            {activeCategory === 'TRANSPORT_VEHICLES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="vehicleNo" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Bus Fleet Name & Reg No" sortKey="busName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Capacity" sortKey="capacity" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Assigned Driver & Phone</th>
                      <th className="p-3.5">GPS IMEI Tracker</th>
                      <th className="p-3.5">RTO Fitness Expiry</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = transportVehicles.filter((tv) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          tv.busName.toLowerCase().includes(q) ||
                          tv.vehicleNo.toLowerCase().includes(q) ||
                          tv.id.toLowerCase().includes(q) ||
                          tv.driverName.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Transport Vehicles');

                      return sortMasterList(list).map((tv, index) => (
                        <tr key={tv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Bus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{tv.busName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono font-bold ml-5.5">Reg: {tv.vehicleNo}</span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(tv.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === tv.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{tv.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-bold text-slate-800">{tv.capacity} Seats</td>
                          <td className="p-3.5 text-slate-700 font-medium">{tv.driverName}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">{tv.gpsIMEI}</td>
                          <td className="p-3.5 font-bold text-slate-700">{tv.rtoFitnessExpiry}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active Fleet
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'TRANSPORT_VEHICLES', item: { ...tv } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'TRANSPORT_VEHICLES', id: tv.id, name: tv.busName })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 24. HOSTEL_ROOM_TYPES */}
            {activeCategory === 'HOSTEL_ROOM_TYPES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="typeName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Room Category" sortKey="typeName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Block Name" sortKey="blockName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Monthly Tariff" sortKey="monthlyFee" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Bed Occupancy (Vacant / Total)</th>
                      <th className="p-3.5">Amenities</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = hostelRoomTypes.filter((hr) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          hr.typeName.toLowerCase().includes(q) ||
                          hr.blockName.toLowerCase().includes(q) ||
                          hr.id.toLowerCase().includes(q) ||
                          hr.amenities.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Hostel Room Types');

                      return sortMasterList(list).map((hr, index) => (
                        <tr key={hr.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Bed className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>{hr.typeName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(hr.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === hr.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{hr.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-700">{hr.blockName}</td>
                          <td className="p-3.5 font-bold text-slate-900">₹{hr.monthlyFee.toLocaleString('en-IN')}/mo</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-emerald-700">{hr.vacantBeds} Vacant</span>
                              <span className="text-slate-400">/</span>
                              <span className="text-slate-600 font-medium">{hr.totalBeds} Total Beds</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-600 max-w-xs truncate">{hr.amenities}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'HOSTEL_ROOM_TYPES', item: { ...hr } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'HOSTEL_ROOM_TYPES', id: hr.id, name: hr.typeName })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 25. INVENTORY_SUPPLIERS */}
            {activeCategory === 'INVENTORY_SUPPLIERS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="supplierName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Supplier / Vendor Firm" sortKey="supplierName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Supply Category" sortKey="category" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Contact Person & Phone</th>
                      <SortableTh label="City" sortKey="city" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">GSTIN Number</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = inventorySuppliers.filter((is) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          is.supplierName.toLowerCase().includes(q) ||
                          is.category.toLowerCase().includes(q) ||
                          is.id.toLowerCase().includes(q) ||
                          is.city.toLowerCase().includes(q) ||
                          is.gstin.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Inventory Suppliers');

                      return sortMasterList(list).map((is, index) => (
                        <tr key={is.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <Package className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{is.supplierName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(is.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === is.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{is.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                              {is.category}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-800 font-medium">
                            <div>{is.contactPerson}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{is.phone}</div>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-700">{is.city}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">{is.gstin}</td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'INVENTORY_SUPPLIERS', item: { ...is } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'INVENTORY_SUPPLIERS', id: is.id, name: is.supplierName })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 26. ROLES_PERMISSIONS */}
            {activeCategory === 'ROLES_PERMISSIONS' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="roleName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="System Role" sortKey="roleName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Campus Authority & Scope</th>
                      <SortableTh label="Users Count" sortKey="usersCount" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5 text-center">Fee Ledger</th>
                      <th className="p-3.5 text-center">Admissions</th>
                      <th className="p-3.5 text-center">Audit Reports</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = rolesPermissions.filter((rp) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          rp.roleName.toLowerCase().includes(q) ||
                          rp.accessScope.toLowerCase().includes(q) ||
                          rp.id.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(9, 'Roles & Permissions');

                      return sortMasterList(list).map((rp, index) => (
                        <tr key={rp.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>{rp.roleName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(rp.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === rp.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{rp.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 text-slate-700 font-medium max-w-xs">{rp.accessScope}</td>
                          <td className="p-3.5 font-bold text-slate-800">{rp.usersCount} Assigned</td>
                          <td className="p-3.5 text-center">
                            {rp.canManageFees ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Granted</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">Locked</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            {rp.canApproveAdmissions ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Granted</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">Locked</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            {rp.canExportAudit ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Granted</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">Locked</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'ROLES_PERMISSIONS', item: { ...rp } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'ROLES_PERMISSIONS', id: rp.id, name: rp.roleName })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* 27. INSTITUTES */}
            {activeCategory === 'INSTITUTES' && (
              <div className="erp-table-scroll">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <SortableTh label="Sr. No." sortKey="instituteName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} align="center" className="w-12 text-center" />
                      <SortableTh label="Educational Institute" sortKey="instituteName" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <SortableTh label="Master ID" sortKey="id" currentSortKey={masterSortKey} currentDirection={masterSortDir} onSort={handleMasterSort} className="p-3.5" />
                      <th className="p-3.5">Registration & Affiliation</th>
                      <th className="p-3.5">Campus Address</th>
                      <th className="p-3.5">Principal / Director</th>
                      <th className="p-3.5">Enrollment / Capacity</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const list = institutes.filter((inst) => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          inst.instituteName.toLowerCase().includes(q) ||
                          inst.regNo.toLowerCase().includes(q) ||
                          inst.id.toLowerCase().includes(q) ||
                          inst.campusAddress.toLowerCase().includes(q)
                        );
                      });
                      if (list.length === 0) return renderEmptyRow(8, 'Trust Institutes');

                      return sortMasterList(list).map((inst, index) => (
                        <tr key={inst.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <School className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                              <span>{inst.instituteName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(inst.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                              title="Click to copy Master ID"
                            >
                              {copiedId === inst.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{inst.id}</span>
                            </button>
                          </td>
                          <td className="p-3.5 text-slate-700 font-medium">
                            <div className="font-bold text-slate-800">{inst.regNo}</div>
                            <div className="text-[10px] text-slate-500">{inst.affiliation}</div>
                          </td>
                          <td className="p-3.5 text-slate-600 max-w-xs">{inst.campusAddress}</td>
                          <td className="p-3.5 font-bold text-slate-800">{inst.principalName}</td>
                          <td className="p-3.5">
                            <span className="font-extrabold text-orange-600">{inst.activeEnrollment}</span>
                            <span className="text-slate-400"> / </span>
                            <span className="text-slate-600 font-bold">{inst.studentCapacity} Seats</span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingMasterRecord({ category: 'INSTITUTES', item: { ...inst } })}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingMasterRecord({ category: 'INSTITUTES', id: inst.id, name: inst.instituteName })}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Modal: Add New Master Record */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-scale-in overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Add New {modalCategory.replace('_', ' ')} Record
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Auto-assigned Master ID • Instantly synced across Admissions & Fees
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateMaster} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Master Category *
                </label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value as MasterCategory)}
                  className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                >
                  <optgroup label="1. Curriculum & Classes">
                    <option value="STANDARDS">1. Standards & Semesters (School & College)</option>
                    <option value="BOARDS">2. Boards & Affiliating Bodies</option>
                    <option value="MEDIUMS">3. Mediums of Instruction</option>
                    <option value="DIVISIONS">4. Divisions & Class Sections</option>
                    <option value="SUBJECTS">5. Subjects Master</option>
                    <option value="CLASSROOMS">6. Classrooms & Culinary / Lab Facilities</option>
                  </optgroup>
                  <optgroup label="2. Fees & Financials">
                    <option value="FEE_GROUPS">7. Fee Groups & Installments</option>
                    <option value="FEE_HEADS">8. Fee Heads & Standard Tariffs</option>
                  </optgroup>
                  <optgroup label="3. Examinations">
                    <option value="EXAM_GROUPS">9. Examination Groups & Weightage</option>
                    <option value="GRADING_SCALES">10. Grading Scales & GPA Criteria</option>
                  </optgroup>
                  <optgroup label="4. Staff, Faculty & HR">
                    <option value="DEPARTMENTS">11. Academic & Admin Departments</option>
                    <option value="DESIGNATIONS">12. Designations & Cadres</option>
                    <option value="TEACHERS">13. Teachers & Faculty Directory</option>
                    <option value="STAFF">14. Staff Roster & Operational Crew</option>
                    <option value="LEAVE_TYPES">15. Leave Types & Quotas</option>
                    <option value="COMPENSATION_BANDS">16. Compensation Bands & Pay Scales</option>
                  </optgroup>
                  <optgroup label="5. Campus & Logistics">
                    <option value="BIOMETRIC_DEVICES">17. Biometric Punch Terminals</option>
                    <option value="TRANSPORT_VEHICLES">18. Transport Bus Fleet & Drivers</option>
                    <option value="HOSTEL_ROOM_TYPES">19. Hostel Room Types & Capacities</option>
                    <option value="INVENTORY_SUPPLIERS">20. Inventory Suppliers & Vendors</option>
                    <option value="ORIGINAL_DOCS">21. Original Documents Vault Checklist</option>
                  </optgroup>
                  <optgroup label="6. Organization & Access">
                    <option value="INSTITUTES">22. Trust Educational Institutes</option>
                    <option value="ROLES_PERMISSIONS">23. Roles & Security Matrix</option>
                  </optgroup>
                  <optgroup label="7. Global & Geographic">
                    <option value="ACADEMIC_YEARS">24. Academic Session Years</option>
                    <option value="COUNTRIES">25. Global Countries</option>
                    <option value="STATES">26. States & Provinces</option>
                    <option value="DISTRICTS">27. Districts & Administrative Divisions</option>
                  </optgroup>
                </select>
              </div>

              {/* Dynamic Name Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {modalCategory === 'STANDARDS'
                    ? 'Standard / Class / Course Name *'
                    : modalCategory === 'BOARDS'
                    ? 'Board / University Name *'
                    : modalCategory === 'MEDIUMS'
                    ? 'Medium of Instruction *'
                    : modalCategory === 'DIVISIONS'
                    ? 'Division / Section Name *'
                    : modalCategory === 'SUBJECTS'
                    ? 'Subject Name *'
                    : modalCategory === 'CLASSROOMS'
                    ? 'Room / Lab / Facility Name *'
                    : modalCategory === 'DEPARTMENTS'
                    ? 'Department Name *'
                    : modalCategory === 'DESIGNATIONS'
                    ? 'Designation Title *'
                    : modalCategory === 'TEACHERS'
                    ? 'Teacher / Faculty Full Name *'
                    : modalCategory === 'STAFF'
                    ? 'Staff Member Full Name *'
                    : modalCategory === 'ORIGINAL_DOCS'
                    ? 'Original Document Title *'
                    : modalCategory === 'ACADEMIC_YEARS'
                    ? 'Academic Session Label *'
                    : modalCategory === 'COUNTRIES'
                    ? 'Country Name *'
                    : modalCategory === 'STATES'
                    ? 'State / Province Name *'
                    : 'District Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    modalCategory === 'STANDARDS'
                      ? 'e.g. Standard 11th Science / B.Sc Hotel Mgmt Sem 1'
                      : modalCategory === 'BOARDS'
                      ? 'e.g. Maharashtra State Board (MSBSHSE) / Solapur University'
                      : modalCategory === 'MEDIUMS'
                      ? 'e.g. Marathi Medium / Semi-English Medium'
                      : modalCategory === 'DIVISIONS'
                      ? 'e.g. Division C / Section Lotus'
                      : modalCategory === 'SUBJECTS'
                      ? 'e.g. Bakery & Confectionery / Mathematics'
                      : modalCategory === 'CLASSROOMS'
                      ? 'e.g. Commercial Bakery Lab / Smart Classroom 201'
                      : modalCategory === 'DEPARTMENTS'
                      ? 'e.g. Hospitality Management / Science & Maths'
                      : modalCategory === 'DESIGNATIONS'
                      ? 'e.g. Assistant Professor / Headmistress'
                      : modalCategory === 'TEACHERS'
                      ? 'e.g. Prof. Rajesh Kadam'
                      : modalCategory === 'STAFF'
                      ? 'e.g. Mr. Santosh Pawar'
                      : modalCategory === 'ORIGINAL_DOCS'
                      ? 'e.g. Original School Leaving Certificate / Caste Certificate'
                      : modalCategory === 'ACADEMIC_YEARS'
                      ? 'e.g. 2026-2027'
                      : modalCategory === 'COUNTRIES'
                      ? 'e.g. India'
                      : modalCategory === 'STATES'
                      ? 'e.g. Maharashtra'
                      : 'e.g. Solapur'
                  }
                  value={newMasterForm.name}
                  onChange={(e) => setNewMasterForm({ ...newMasterForm, name: e.target.value })}
                  className="w-full font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                />
              </div>

              {/* Code and Scope Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code / Short Tag</label>
                  <input
                    type="text"
                    placeholder={
                      modalCategory === 'STANDARDS'
                        ? 'e.g. STD-11-SCI'
                        : modalCategory === 'BOARDS'
                        ? 'e.g. MSBSHSE'
                        : modalCategory === 'MEDIUMS'
                        ? 'e.g. MAR'
                        : modalCategory === 'DIVISIONS'
                        ? 'e.g. DIV-C'
                        : modalCategory === 'SUBJECTS'
                        ? 'e.g. HM-BK-101'
                        : modalCategory === 'CLASSROOMS'
                        ? 'e.g. LAB-BAKERY-2'
                        : modalCategory === 'DEPARTMENTS'
                        ? 'e.g. DEPT-HM'
                        : modalCategory === 'DESIGNATIONS'
                        ? 'e.g. ASST-PROF'
                        : modalCategory === 'TEACHERS'
                        ? 'e.g. TCH-089'
                        : modalCategory === 'STAFF'
                        ? 'e.g. STF-045'
                        : modalCategory === 'ORIGINAL_DOCS'
                        ? 'e.g. DOC-SLC'
                        : modalCategory === 'ACADEMIC_YEARS'
                        ? 'e.g. 2026-27'
                        : modalCategory === 'COUNTRIES'
                        ? 'e.g. IN'
                        : modalCategory === 'STATES'
                        ? 'e.g. MH'
                        : 'e.g. SOL'
                    }
                    value={newMasterForm.code}
                    onChange={(e) => setNewMasterForm({ ...newMasterForm, code: e.target.value })}
                    className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                  />
                </div>

                {modalCategory !== 'ACADEMIC_YEARS' &&
                  modalCategory !== 'COUNTRIES' &&
                  modalCategory !== 'STATES' &&
                  modalCategory !== 'DISTRICTS' &&
                  modalCategory !== 'MEDIUMS' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Institution Scope</label>
                      <select
                        value={newMasterForm.branchScope}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, branchScope: e.target.value as any })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        <option value="SCHOOL">School (MPS & JC Bhose)</option>
                        <option value="COLLEGE">College (MCHMT Solapur)</option>
                        <option value="ALL">All Institutions (Trust-wide)</option>
                      </select>
                    </div>
                  )}
              </div>

              {/* 1. STANDARDS SPECIAL FIELDS */}
              {modalCategory === 'STANDARDS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stage / Course Category</label>
                    <select
                      value={newMasterForm.categoryOrType}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, categoryOrType: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      <option value="Primary">Primary (1st–4th)</option>
                      <option value="Upper Primary">Upper Primary (5th–7th)</option>
                      <option value="Secondary">Secondary (8th–10th)</option>
                      <option value="Junior College">Junior College (11th–12th)</option>
                      <option value="Degree Course">Degree Course (UG - B.Sc HM)</option>
                      <option value="Diploma Course">Diploma Course (HM & Tech)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Annual Fee Estimate (₹)</label>
                    <input
                      type="number"
                      value={newMasterForm.annualFee}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, annualFee: Number(e.target.value) })}
                      className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Affiliated Board</label>
                    <select
                      value={newMasterForm.boardId}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, boardId: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      {boards.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.code} ({b.name.slice(0, 24)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Instruction Medium</label>
                    <select
                      value={newMasterForm.mediumId}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, mediumId: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      {mediums.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 2. BOARDS SPECIAL FIELDS */}
              {modalCategory === 'BOARDS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Affiliation / Registration No.</label>
                    <input
                      type="text"
                      placeholder="e.g. MH-SSC-4209 / PAHSU-COL-088"
                      value={newMasterForm.affiliationNo}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, affiliationNo: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State / Jurisdiction</label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={newMasterForm.state}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, state: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 3. DIVISIONS SPECIAL FIELDS */}
              {modalCategory === 'DIVISIONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shift Schedule</label>
                    <select
                      value={newMasterForm.shift}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, shift: e.target.value as any })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      <option value="MORNING">Morning (7:30 AM - 1:00 PM)</option>
                      <option value="AFTERNOON">Afternoon (1:00 PM - 6:00 PM)</option>
                      <option value="FULL_DAY">Full Day (9:00 AM - 4:30 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Default Room</label>
                    <input
                      type="text"
                      placeholder="e.g. rm-sch-101"
                      value={newMasterForm.defaultRoom}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, defaultRoom: e.target.value })}
                      className="w-full font-mono px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Student Capacity</label>
                    <input
                      type="number"
                      value={newMasterForm.capacity}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, capacity: Number(e.target.value) })}
                      className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 4. SUBJECTS SPECIAL FIELDS */}
              {modalCategory === 'SUBJECTS' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Type</label>
                    <select
                      value={newMasterForm.subjectType}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, subjectType: e.target.value as any })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      <option value="THEORY">Theory Only</option>
                      <option value="PRACTICAL">Practical / Lab Only</option>
                      <option value="BOTH">Both Theory & Practical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={newMasterForm.departmentId}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, departmentId: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Marks</label>
                      <input
                        type="number"
                        value={newMasterForm.maxMarks}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, maxMarks: Number(e.target.value) })}
                        className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pass Marks</label>
                      <input
                        type="number"
                        value={newMasterForm.passingMarks}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, passingMarks: Number(e.target.value) })}
                        className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CLASSROOMS SPECIAL FIELDS */}
              {modalCategory === 'CLASSROOMS' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Facility Type</label>
                      <select
                        value={newMasterForm.categoryOrType}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, categoryOrType: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        <option value="CLASSROOM">Classroom</option>
                        <option value="KITCHEN_LAB">Culinary / Kitchen Lab</option>
                        <option value="COMPUTER_LAB">Computer Lab</option>
                        <option value="SCIENCE_LAB">Science Lab</option>
                        <option value="AUDITORIUM">Auditorium / Seminar Hall</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Campus Wing</label>
                      <input
                        type="text"
                        placeholder="e.g. West Academic Wing"
                        value={newMasterForm.wing}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, wing: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Floor Level</label>
                      <input
                        type="text"
                        placeholder="e.g. Ground Floor"
                        value={newMasterForm.floor}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, floor: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                      <input
                        type="number"
                        value={newMasterForm.capacity}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, capacity: Number(e.target.value) })}
                        className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Equipped Facilities (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. CCTV Surveillance, Digital Smart Board, Commercial Gas Range, High-Speed Wi-Fi"
                      value={newMasterForm.facilities}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, facilities: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 6. DEPARTMENTS SPECIAL FIELDS */}
              {modalCategory === 'DEPARTMENTS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Head of Department (HOD)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Snehal Patil"
                      value={newMasterForm.headOfDepartment}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, headOfDepartment: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department Email</label>
                    <input
                      type="email"
                      placeholder="e.g. hospitality@zepfoundation.org"
                      value={newMasterForm.email}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, email: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 7. DESIGNATIONS SPECIAL FIELDS */}
              {modalCategory === 'DESIGNATIONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cadre Category</label>
                    <select
                      value={newMasterForm.categoryOrType}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, categoryOrType: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      <option value="FACULTY">Faculty / Teaching</option>
                      <option value="MANAGEMENT">Trust Management / Leadership</option>
                      <option value="ADMIN">Administrative Officer</option>
                      <option value="SUPPORT">Technical / Auxiliary Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pay Grade Scale</label>
                    <input
                      type="text"
                      placeholder="e.g. Level-10 UGC / Grade-A State"
                      value={newMasterForm.payGrade}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, payGrade: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 8. TEACHERS SPECIAL FIELDS */}
              {modalCategory === 'TEACHERS' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designation</label>
                      <select
                        value={newMasterForm.designationId}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, designationId: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        {designations.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={newMasterForm.departmentId}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, departmentId: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Qualifications</label>
                      <input
                        type="text"
                        placeholder="e.g. M.Sc, B.Ed / MHM, NET"
                        value={newMasterForm.categoryOrType}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, categoryOrType: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="+91 98220 00000"
                        value={newMasterForm.phone}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, phone: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                      <input
                        type="email"
                        placeholder="faculty@zepfoundation.org"
                        value={newMasterForm.email}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, email: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. STAFF SPECIAL FIELDS */}
              {modalCategory === 'STAFF' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designation</label>
                      <select
                        value={newMasterForm.designationId}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, designationId: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        {designations.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={newMasterForm.departmentId}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, departmentId: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Role Category</label>
                      <select
                        value={newMasterForm.roleCategory}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, roleCategory: e.target.value as any })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        <option value="ADMINISTRATIVE">Administrative</option>
                        <option value="ACCOUNTING">Accounting & Finance</option>
                        <option value="TECHNICAL">Technical / Lab Support</option>
                        <option value="CUSTODIAL">Custodial & Facilities</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="+91 98220 00000"
                        value={newMasterForm.phone}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, phone: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                      <input
                        type="email"
                        placeholder="staff@zepfoundation.org"
                        value={newMasterForm.email}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, email: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 10. ORIGINAL DOCUMENTS SPECIAL FIELDS */}
              {modalCategory === 'ORIGINAL_DOCS' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designated Vault Rack</label>
                      <input
                        type="text"
                        placeholder="e.g. C-01 (Fireproof Archive)"
                        value={newMasterForm.defaultRackCupboard}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, defaultRackCupboard: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Retention (Years)</label>
                      <input
                        type="number"
                        value={newMasterForm.retentionYears}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, retentionYears: Number(e.target.value) })}
                        className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Issuing Authority</label>
                      <input
                        type="text"
                        placeholder="e.g. Competent Govt Authority"
                        value={newMasterForm.issuingAuthority}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, issuingAuthority: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="doc-mandatory-chk"
                      checked={newMasterForm.isMandatory}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, isMandatory: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="doc-mandatory-chk" className="font-bold text-slate-700 cursor-pointer">
                      Mandatory original document for admission verification
                    </label>
                  </div>
                </div>
              )}

              {/* 11. ACADEMIC YEARS SPECIAL FIELDS */}
              {modalCategory === 'ACADEMIC_YEARS' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Session Start Date</label>
                      <input
                        type="date"
                        value={newMasterForm.startDate}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, startDate: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Session End Date</label>
                      <input
                        type="date"
                        value={newMasterForm.endDate}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, endDate: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="year-current-chk"
                      checked={newMasterForm.isCurrent}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, isCurrent: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="year-current-chk" className="font-bold text-slate-700 cursor-pointer">
                      Set as current active academic session for student admissions
                    </label>
                  </div>
                </div>
              )}

              {/* 12. COUNTRIES SPECIAL FIELDS */}
              {modalCategory === 'COUNTRIES' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ISO-2 Alpha</label>
                    <input
                      type="text"
                      placeholder="e.g. IN"
                      maxLength={2}
                      value={newMasterForm.isoCode}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, isoCode: e.target.value.toUpperCase() })}
                      className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ISO-3 Alpha</label>
                    <input
                      type="text"
                      placeholder="e.g. IND"
                      maxLength={3}
                      value={newMasterForm.iso3}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, iso3: e.target.value.toUpperCase() })}
                      className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dial Code</label>
                    <input
                      type="text"
                      placeholder="e.g. +91"
                      value={newMasterForm.dialCode}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, dialCode: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Currency</label>
                    <input
                      type="text"
                      placeholder="e.g. INR (₹)"
                      value={newMasterForm.currency}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, currency: e.target.value })}
                      className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 13. STATES SPECIAL FIELDS */}
              {modalCategory === 'STATES' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Parent Country</label>
                    <select
                      value={newMasterForm.countryId}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, countryId: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.isoCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Capital City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={newMasterForm.capital}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, capital: e.target.value })}
                      className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 14. DISTRICTS SPECIAL FIELDS */}
              {modalCategory === 'DISTRICTS' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Parent State</label>
                      <select
                        value={newMasterForm.stateId}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, stateId: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      >
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Administrative Division</label>
                      <input
                        type="text"
                        placeholder="e.g. Pune Division / Solapur Zone"
                        value={newMasterForm.divisionRegion}
                        onChange={(e) => setNewMasterForm({ ...newMasterForm, divisionRegion: e.target.value })}
                        className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="dst-hq-chk"
                      checked={newMasterForm.isHeadquarterZone}
                      onChange={(e) => setNewMasterForm({ ...newMasterForm, isHeadquarterZone: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="dst-hq-chk" className="font-bold text-slate-700 cursor-pointer">
                      Designate as Institutional Headquarter Zone (Solapur & Bhose)
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save {modalCategory.replace('_', ' ')} Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    
      {/* 4. Modal: Edit Master Record */}
      {editingMasterRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Edit {editingMasterRecord.category.replace('_', ' ')} Record
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingMasterRecord.item.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMasterRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMaster} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Name / Title / Label *
                </label>
                <input
                  type="text"
                  required
                  value={
                    editingMasterRecord.item.name !== undefined
                      ? editingMasterRecord.item.name
                      : editingMasterRecord.item.title !== undefined
                      ? editingMasterRecord.item.title
                      : editingMasterRecord.item.label || ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const item = { ...editingMasterRecord.item };
                    if (item.name !== undefined) item.name = val;
                    if (item.title !== undefined) item.title = val;
                    if (item.label !== undefined) item.label = val;
                    setEditingMasterRecord({ ...editingMasterRecord, item });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              {(editingMasterRecord.item.code !== undefined ||
                editingMasterRecord.item.roomCode !== undefined ||
                editingMasterRecord.item.employeeCode !== undefined ||
                editingMasterRecord.item.staffCode !== undefined ||
                editingMasterRecord.item.isoCode !== undefined) && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Master Code / Identifier
                  </label>
                  <input
                    type="text"
                    value={
                      editingMasterRecord.item.code !== undefined
                        ? editingMasterRecord.item.code
                        : editingMasterRecord.item.roomCode !== undefined
                        ? editingMasterRecord.item.roomCode
                        : editingMasterRecord.item.employeeCode !== undefined
                        ? editingMasterRecord.item.employeeCode
                        : editingMasterRecord.item.staffCode !== undefined
                        ? editingMasterRecord.item.staffCode
                        : editingMasterRecord.item.isoCode || ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      const item = { ...editingMasterRecord.item };
                      if (item.code !== undefined) item.code = val;
                      if (item.roomCode !== undefined) item.roomCode = val;
                      if (item.employeeCode !== undefined) item.employeeCode = val;
                      if (item.staffCode !== undefined) item.staffCode = val;
                      if (item.isoCode !== undefined) item.isoCode = val;
                      setEditingMasterRecord({ ...editingMasterRecord, item });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {editingMasterRecord.item.branchScope !== undefined && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Institutional Branch Scope
                  </label>
                  <select
                    value={editingMasterRecord.item.branchScope}
                    onChange={(e) =>
                      setEditingMasterRecord({
                        ...editingMasterRecord,
                        item: { ...editingMasterRecord.item, branchScope: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="ALL">Consolidated (Both School & College)</option>
                    <option value="SCHOOL">School (Modern Public School & Jr College Bhose)</option>
                    <option value="COLLEGE">College (Modern College Of Hotel Mgmt Solapur)</option>
                  </select>
                </div>
              )}

              {editingMasterRecord.item.annualFeeEstimate !== undefined && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Annual Fee Estimate (₹)
                  </label>
                  <input
                    type="number"
                    value={editingMasterRecord.item.annualFeeEstimate}
                    onChange={(e) =>
                      setEditingMasterRecord({
                        ...editingMasterRecord,
                        item: { ...editingMasterRecord.item, annualFeeEstimate: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {editingMasterRecord.item.capacity !== undefined && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Student Capacity / Workstations
                  </label>
                  <input
                    type="number"
                    value={editingMasterRecord.item.capacity}
                    onChange={(e) =>
                      setEditingMasterRecord({
                        ...editingMasterRecord,
                        item: { ...editingMasterRecord.item, capacity: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {editingMasterRecord.item.phone !== undefined && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editingMasterRecord.item.phone}
                    onChange={(e) =>
                      setEditingMasterRecord({
                        ...editingMasterRecord,
                        item: { ...editingMasterRecord.item, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMasterRecord(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Master Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Delete Master Record Confirmation */}
      {deletingMasterRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Master Record</h3>
                <p className="text-xs text-slate-500">
                  {deletingMasterRecord.category.replace('_', ' ')} Master
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingMasterRecord.name}</div>
              <div className="text-slate-600 font-mono">Master ID: {deletingMasterRecord.id}</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                ⚠️ Warning: Deleting this master record will remove it from future admission, course, and classroom assignment dropdowns.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingMasterRecord(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMaster}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
