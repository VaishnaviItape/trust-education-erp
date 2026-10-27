import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  Users,
  Search,
  UserPlus,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  X,
  School,
  UtensilsCrossed,
  Filter,
  Download,
  Upload,
  FileUp,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  Building,
  Eye,
  Home,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Pencil,
  Trash2,
  AlertTriangle,
  Save,
  History,
  BookmarkCheck,
  GraduationCap,
  Languages,
  ArrowRightLeft,
  IdCard,
} from 'lucide-react';
import { Student, FeeReceipt } from '../types';
import { IdCardModal } from './IdCardModal';
import { IdCardData } from './IdCardPreview';
import { exportToExcel, exportToPdf, ExportColumn } from '../utils/exportUtils';
import { FilterBar } from './FilterBar';
import { MasterStore } from '../utils/masterData';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';
import { MarathiKeypadInput } from './MarathiKeypadInput';
import { transliterateToMarathi } from '../utils/marathiTransliterate';
import { PrintableFeeReceiptModal } from './PrintableFeeReceiptModal';
import {
  generateFeeBreakdown,
  numberToWordsINR,
  numberToMarathiWordsINR,
} from '../utils/feeReceiptUtils';

interface StudentDirectoryModuleProps {
  students: Student[];
  onAddStudent: (studentData: any) => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  onCollectFee: (studentId: string, amount: number, mode: any) => void;
  onOpenProgression?: () => void;
  onOpenAdmissionWizard?: () => void;
  academicYear?: string;
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onChangeBranchScope?: (branch: 'ALL' | 'SCHOOL' | 'COLLEGE') => void;
}

export const StudentDirectoryModule: React.FC<StudentDirectoryModuleProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onCollectFee,
  onOpenProgression,
  onOpenAdmissionWizard,
  academicYear = '2026-2027',
  selectedBranchScope = 'ALL',
  onChangeBranchScope,
}) => {
  // Primary Quick Filter State
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(selectedBranchScope);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'PREFECT' | 'INTERN'>('ALL');
  const [aadhaarFilter, setAadhaarFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [enrollmentTypeFilter, setEnrollmentTypeFilter] = useState<'ALL' | 'EXISTING' | 'TRANSFER' | 'FRESH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mode: FRESH vs TRANSFER vs EXISTING onboarding
  const [admissionMode, setAdmissionMode] = useState<'FRESH' | 'TRANSFER' | 'EXISTING'>('FRESH');

  // Advanced Multi-Dimensional Filter State
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [standardFilter, setStandardFilter] = useState<string>('ALL');
  const [specializationFilter, setSpecializationFilter] = useState<string>('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'ALL' | 'FULLY_PAID' | 'PENDING' | 'OVERDUE_HIGH'>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'ABOVE_90' | 'BETWEEN_75_90' | 'BELOW_75'>('ALL');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [religionFilter, setReligionFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('ALL');

  // Bulk Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<'FRESH' | 'EXISTING'>('FRESH');
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importSuccessAlert, setImportSuccessAlert] = useState<string | null>(null);

  // Synchronize branchFilter when selectedBranchScope changes from header
  useEffect(() => {
    if (selectedBranchScope) {
      setBranchFilter(selectedBranchScope);
      setStandardFilter('ALL');
      setSpecializationFilter('ALL');
    }
  }, [selectedBranchScope]);

  // UI Dropdowns & Modals
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState<Student | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<FeeReceipt | null>(null);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);
  const [idCardModalStudent, setIdCardModalStudent] = useState<Student | null>(null);

  const studentToCardData = (s: Student): IdCardData => {
    const isCollege =
      (s.branchId && s.branchId.includes('hm')) ||
      (s.branchName && s.branchName.toLowerCase().includes('hotel')) ||
      (s.gradeOrSemester && (s.gradeOrSemester.includes('BHMCT') || s.gradeOrSemester.includes('Hotel')));

    return {
      type: 'STUDENT',
      id: s.id,
      name: s.name,
      nameMarathi: s.nameMarathi,
      photoUrl: s.profilePhotoUrl,
      primaryCode: s.rollNo || s.admissionNo.slice(-4),
      secondaryCode: s.grNumber || s.admissionNo,
      badgeLabel: s.gradeOrSemester || 'Standard 8',
      branchName: isCollege
        ? 'Modern College Of Hotel Management And Technology Solapur'
        : 'Modern Public School And Junior College Bhose',
      bloodGroup: s.bloodGroup || 'O+',
      dobOrJoinDate: s.dob || '2013-07-30',
      dobOrJoinLabel: 'DOB',
      emergencyPhone: s.parentPhone || '+91 98230 11999',
      validUpto: '2026-2027',
      address: s.currentAddress
        ? `${s.currentAddress.street}, ${s.currentAddress.area}, ${s.currentAddress.taluka || 'Solapur'}`
        : 'Plot 12, Hinjawadi Phase 1, Pune',
      busRoute: 'Bus Route #04 (Bhose - Station)',
      busStop: 'Main Circle',
      signatoryTitle: isCollege ? 'Director' : 'Principal',
      studentRef: s,
    };
  };
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [feeAmount, setFeeAmount] = useState('12000');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'CHEQUE'>('UPI');

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (editingStudent.previousProgress && !editingStudent.progress) {
      editingStudent.progress = editingStudent.previousProgress;
    }
    if (editingStudent.previousConduct && !editingStudent.conduct) {
      editingStudent.conduct = editingStudent.previousConduct;
    }
    if (editingStudent.admissionType === 'Transfer' || editingStudent.admissionType === 'Lateral') {
      editingStudent.isExistingStudent = false;
      if (!editingStudent.lastSchoolAttended && editingStudent.previousSchool) {
        editingStudent.lastSchoolAttended = editingStudent.previousSchool;
      }
    } else if (editingStudent.admissionType === 'Existing') {
      editingStudent.isExistingStudent = true;
    }
    if (onEditStudent) {
      onEditStudent(editingStudent);
    }
    if (selectedStudentProfile && selectedStudentProfile.id === editingStudent.id) {
      setSelectedStudentProfile(editingStudent);
    }
    setEditingStudent(null);
  };

  const handleConfirmStudentDelete = () => {
    if (!deletingStudent) return;
    if (onDeleteStudent) {
      onDeleteStudent(deletingStudent.id);
    }
    if (selectedStudentProfile && selectedStudentProfile.id === deletingStudent.id) {
      setSelectedStudentProfile(null);
    }
    setDeletingStudent(null);
  };

  // Admission form state (supporting Fresh, Transfer with previous school LC, and Existing students)
  const [newStudent, setNewStudent] = useState({
    name: '',
    nameMarathi: '',
    fatherNameMarathi: '',
    motherNameMarathi: '',
    gender: 'MALE',
    branchId: 'branch-sch-01',
    gradeOrSemester: 'Class 1-A',
    parentName: '',
    parentPhone: '',
    feeTotal: 36000,
    hotelSpecialization: '',
    aadhaarNumber: '',
    roleTag: 'STUDENT',
    // Existing Student Fields
    isExistingStudent: false,
    admissionType: 'Fresh' as 'Fresh' | 'Transfer' | 'Existing' | 'Lateral',
    originalAdmissionYear: '2023-2024',
    grNumber: '',
    prnNumber: '',
    previousClassOrSem: '',
    previousYearPercentage: 82.5,
    openingFeeBalance: 0,
    // Transfer & Previous School (Kaksha Plus 23 Standard)
    previousSchool: '',
    standardDivLeft: '',
    schoolLeavingDate: '',
    lcReceivedDate: '',
    reasonForLeaving: '',
    migrationUniversity: '',
    voluntarySubjectSpecial: '',
    previousProgress: 'Good',
    previousConduct: 'Good',
    progress: 'Good',
    conduct: 'Good',
    previousLcNumber: '',
  });

  // Transfer Student Preset (from Another School with LC)
  const handleFillTransferPreset = () => {
    setAdmissionMode('TRANSFER');
    setNewStudent((prev) => ({
      ...prev,
      name: 'Tanvi Santosh Patil',
      nameMarathi: 'तन्वी संतोष पाटील',
      fatherNameMarathi: 'संतोष पाटील',
      motherNameMarathi: 'सुवर्णा पाटील',
      gender: 'FEMALE',
      branchId: 'branch-sch-01',
      gradeOrSemester: 'Class 10-A',
      parentName: 'Santosh Patil & Suvarna',
      parentPhone: '+91 98223 99112',
      feeTotal: 38000,
      hotelSpecialization: '',
      aadhaarNumber: '7821-4412-9901',
      roleTag: 'STUDENT',
      isExistingStudent: false,
      admissionType: 'Transfer',
      originalAdmissionYear: '2026-2027',
      grNumber: 'GR-2026-TR-018',
      prnNumber: 'PRN-2026-TR-018',
      previousClassOrSem: '',
      previousYearPercentage: 89.2,
      openingFeeBalance: 0,
      previousSchool: 'Shri Shivaji Vidyalaya & Jr College, Barshi',
      standardDivLeft: 'Std 10 A',
      schoolLeavingDate: '2026-05-15',
      lcReceivedDate: '2026-06-10',
      reasonForLeaving: 'Parent Job Transfer to Solapur',
      migrationUniversity: 'Pune University / Maharashtra State Board',
      voluntarySubjectSpecial: 'Physics',
      previousProgress: 'Good',
      previousConduct: 'Exemplary',
      progress: 'Good',
      conduct: 'Exemplary',
      previousLcNumber: 'LC-BARSHI-2026-0428',
    }));
  };

  // Single-student presets for existing students
  const handleFillSchoolPreset = () => {
    setAdmissionMode('EXISTING');
    setNewStudent((prev) => ({
      ...prev,
      name: 'Aditya Rajesh Shinde',
      nameMarathi: 'आदित्य राजेश शिंदे',
      fatherNameMarathi: 'राजेश शिंदे',
      motherNameMarathi: 'सुनीता शिंदे',
      gender: 'MALE',
      branchId: 'branch-sch-01',
      gradeOrSemester: 'Class 8-A',
      parentName: 'Rajesh Shinde & Sunita',
      parentPhone: '+91 98224 88192',
      feeTotal: 38000,
      hotelSpecialization: '',
      aadhaarNumber: '4821-9923-5511',
      roleTag: 'STUDENT',
      isExistingStudent: true,
      admissionType: 'Existing',
      originalAdmissionYear: '2022-2023',
      grNumber: 'GR-2022-0418',
      prnNumber: 'PRN-2022-0941',
      previousClassOrSem: 'Class 7-A (Passed 88.4%)',
      previousYearPercentage: 88.4,
      openingFeeBalance: 0,
      previousSchool: '',
      standardDivLeft: '',
      schoolLeavingDate: '',
      lcReceivedDate: '',
      reasonForLeaving: '',
      migrationUniversity: '',
      voluntarySubjectSpecial: '',
      previousProgress: 'Good',
      previousConduct: 'Good',
      progress: 'Good',
      conduct: 'Good',
      previousLcNumber: '',
    }));
  };

  const handleFillCollegePreset = () => {
    setAdmissionMode('EXISTING');
    setNewStudent((prev) => ({
      ...prev,
      name: 'Shruti Mahesh Patil',
      nameMarathi: 'श्रुती महेश पाटील',
      fatherNameMarathi: 'महेश पाटील',
      motherNameMarathi: 'वंदना पाटील',
      gender: 'FEMALE',
      branchId: 'branch-hm-01',
      gradeOrSemester: 'B.Sc H&HA Semester 4',
      parentName: 'Mahesh Patil & Vandana',
      parentPhone: '+91 98229 11029',
      feeTotal: 75000,
      hotelSpecialization: 'Front Office Operations & PMS Lab',
      aadhaarNumber: '6712-4491-0023',
      roleTag: 'PREFECT',
      isExistingStudent: true,
      admissionType: 'Existing',
      originalAdmissionYear: '2024-2025',
      grNumber: 'GR-2024-HM-0211',
      prnNumber: 'PRN-2024-MH-8812',
      previousClassOrSem: 'B.Sc H&HA Semester 3 (SGPA 8.8)',
      previousYearPercentage: 86.0,
      openingFeeBalance: 0,
      previousSchool: '',
      standardDivLeft: '',
      schoolLeavingDate: '',
      lcReceivedDate: '',
      reasonForLeaving: '',
      migrationUniversity: '',
      voluntarySubjectSpecial: '',
      previousProgress: 'Good',
      previousConduct: 'Good',
      progress: 'Good',
      conduct: 'Good',
      previousLcNumber: '',
    }));
  };

  // Calculate active advanced filter count
  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;
    if (branchFilter !== (selectedBranchScope || 'ALL')) count++;
    if (roleFilter !== 'ALL') count++;
    if (aadhaarFilter !== 'ALL') count++;
    if (enrollmentTypeFilter !== 'ALL') count++;
    if (standardFilter !== 'ALL') count++;
    if (specializationFilter !== 'ALL') count++;
    if (feeStatusFilter !== 'ALL') count++;
    if (attendanceFilter !== 'ALL') count++;
    if (genderFilter !== 'ALL') count++;
    if (religionFilter !== 'ALL') count++;
    if (categoryFilter !== 'ALL') count++;
    if (bloodGroupFilter !== 'ALL') count++;
    return count;
  }, [
    branchFilter,
    selectedBranchScope,
    roleFilter,
    aadhaarFilter,
    enrollmentTypeFilter,
    standardFilter,
    specializationFilter,
    feeStatusFilter,
    attendanceFilter,
    genderFilter,
    religionFilter,
    categoryFilter,
    bloodGroupFilter,
  ]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setBranchFilter(selectedBranchScope || 'ALL');
    setRoleFilter('ALL');
    setAadhaarFilter('ALL');
    setEnrollmentTypeFilter('ALL');
    setStandardFilter('ALL');
    setSpecializationFilter('ALL');
    setFeeStatusFilter('ALL');
    setAttendanceFilter('ALL');
    setGenderFilter('ALL');
    setReligionFilter('ALL');
    setCategoryFilter('ALL');
    setBloodGroupFilter('ALL');
    setSearchQuery('');
  };

  // Bulk Import Handlers
  const handleDownloadTemplate = () => {
    const headers = [
      'Roll No',
      'First Name',
      'Last Name',
      'Gender',
      'Standard',
      'Division',
      'Admission Type',
      'Parent Name',
      'Parent Phone',
      'Parent Email',
      'Aadhaar No',
      'Fee Total',
      'Blood Group',
      'Religion',
      'Category',
    ];
    const sampleRows = [
      ['02', 'ZAYAN', 'KHAN', 'MALE', 'STD 8', 'Division A', 'Fresh', 'Rashid Khan & Farida', '+91 98220 55441', 'rashid.khan@gmail.com', '4521-8890-1234', '38000', 'B+', 'Muslim', 'General'],
      ['03', 'SNEHA', 'DESHMUKH', 'FEMALE', 'STD 8', 'Division A', 'Fresh', 'Anil Deshmukh & Sunita', '+91 98221 66772', 'anil.deshmukh@gmail.com', '8899-7711-4455', '38000', 'O+', 'Hindu', 'OBC'],
    ];
    const csvContent = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Student_Import_Template_${academicYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSampleBatch = () => {
    const sampleBatch = [
      {
        id: `stu-imp-${Date.now()}-1`,
        branchId: branchFilter === 'COLLEGE' ? 'branch-hm-01' : 'branch-sch-01',
        admissionNo: `ADM-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
        rollNo: '02',
        name: 'ZAYAN KHAN',
        firstName: 'ZAYAN',
        lastName: 'KHAN',
        gender: 'MALE',
        gradeOrSemester: branchFilter === 'COLLEGE' ? 'B.Sc H&HA Semester 1' : 'STD 8 - Division A',
        standard: 'STD 8',
        division: 'Division A',
        admissionType: 'Fresh',
        admissionDate: '2026-06-15',
        grNumber: `GR-2026-${Math.floor(Math.random() * 8000) + 1000}`,
        prnNumber: `PRN-2026-${Math.floor(Math.random() * 8000) + 1000}`,
        parentName: 'Rashid Khan & Farida',
        parentPhone: '+91 98220 55441',
        parentEmail: 'rashid.khan@gmail.com',
        feeTotal: 38000,
        feePaid: 20000,
        feePending: 18000,
        attendancePercent: 95,
        kycStatus: 'VERIFIED',
        aadhaarVerified: true,
        aadhaarNumber: '4521-8890-1234',
        bloodGroup: 'B+',
        religion: 'Muslim',
        category: 'General',
      },
      {
        id: `stu-imp-${Date.now()}-2`,
        branchId: branchFilter === 'COLLEGE' ? 'branch-hm-01' : 'branch-sch-01',
        admissionNo: `ADM-2026-${String(Math.floor(Math.random() * 900) + 101)}`,
        rollNo: '03',
        name: 'SNEHA DESHMUKH',
        firstName: 'SNEHA',
        lastName: 'DESHMUKH',
        gender: 'FEMALE',
        gradeOrSemester: branchFilter === 'COLLEGE' ? 'B.Sc H&HA Semester 1' : 'STD 8 - Division A',
        standard: 'STD 8',
        division: 'Division A',
        admissionType: 'Fresh',
        admissionDate: '2026-06-16',
        grNumber: `GR-2026-${Math.floor(Math.random() * 8000) + 1001}`,
        prnNumber: `PRN-2026-${Math.floor(Math.random() * 8000) + 1001}`,
        parentName: 'Anil Deshmukh & Sunita',
        parentPhone: '+91 98221 66772',
        parentEmail: 'anil.deshmukh@gmail.com',
        feeTotal: 38000,
        feePaid: 38000,
        feePending: 0,
        attendancePercent: 98,
        kycStatus: 'VERIFIED',
        aadhaarVerified: true,
        aadhaarNumber: '8899-7711-4455',
        bloodGroup: 'O+',
        religion: 'Hindu',
        category: 'OBC',
      },
    ];
    setImportedPreview(sampleBatch);
    setImportFileName('Demo_Intake_Batch_2026.csv');
  };

  // Dedicated Historical & Continuing Student CSV Template
  const handleDownloadExistingTemplate = () => {
    const headers = [
      'Roll No',
      'First Name',
      'Last Name',
      'Gender',
      'Branch (SCHOOL/COLLEGE)',
      'Standard or Semester',
      'Admission Type (Existing)',
      'Original Admission Year',
      'Existing GR Number',
      'PRN Number',
      'Previous Class or Sem',
      'Previous Percentage',
      'Opening Arrears Balance',
      'Parent Name',
      'Parent Phone',
      'Parent Email',
      'Aadhaar No',
      'Fee Total',
      'Specialization (College)',
    ];
    const sampleRows = [
      ['14', 'OMKAR', 'JADHAV', 'MALE', 'SCHOOL', 'Class 10-A', 'Existing', '2021-2022', 'GR-2021-0182', 'PRN-2021-9912', 'Class 9-A', '89.2', '0', 'Vitthal Jadhav', '+91 98233 44112', 'vitthal.jadhav@gmail.com', '6672-9901-2234', '48000', 'General Curriculum'],
      ['BHM-401', 'GAURAV', 'SHINDE', 'MALE', 'COLLEGE', 'B.Sc H&HA Semester 4', 'Existing', '2024-2025', 'GR-2024-HM-0182', 'PRN-2024-UNI-5519', 'B.Sc H&HA Semester 3', '87.5', '0', 'Suresh Shinde', '+91 98224 88192', 'suresh.shinde@gmail.com', '4821-9923-5511', '75000', 'Food Production & Bakery'],
    ];
    const csvContent = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Existing_Students_Migration_Template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Bulk Load 4 Existing School Students
  const handleLoadExistingSchoolBatch = () => {
    const batch = [
      {
        id: `stu-exist-sch-${Date.now()}-1`,
        branchId: 'branch-sch-01',
        admissionNo: 'SCH-EXIST-1001',
        rollNo: '14',
        name: 'Omkar Vitthal Jadhav',
        firstName: 'Omkar',
        lastName: 'Jadhav',
        gender: 'MALE' as const,
        gradeOrSemester: 'Class 10-A',
        standard: 'Class 10',
        division: 'Division A',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2021-2022',
        admissionDate: '2021-06-15',
        grNumber: 'GR-2021-0182',
        prnNumber: 'PRN-2021-9912',
        previousClassOrSem: 'Class 9-A',
        previousYearPercentage: 89.2,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Vitthal Jadhav',
        parentPhone: '+91 98233 44112',
        parentEmail: 'vitthal.jadhav@gmail.com',
        feeTotal: 48000,
        feePaid: 48000,
        feePending: 0,
        attendancePercent: 96,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '6672-9901-2234',
        bloodGroup: 'B+',
        religion: 'Hindu',
        category: 'OBC',
      },
      {
        id: `stu-exist-sch-${Date.now()}-2`,
        branchId: 'branch-sch-01',
        admissionNo: 'SCH-EXIST-1002',
        rollNo: '08',
        name: 'Isha Sunil Kadam',
        firstName: 'Isha',
        lastName: 'Kadam',
        gender: 'FEMALE' as const,
        gradeOrSemester: 'Class 8-B',
        standard: 'Class 8',
        division: 'Division B',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2023-2024',
        admissionDate: '2023-06-12',
        grNumber: 'GR-2023-0491',
        prnNumber: 'PRN-2023-5510',
        previousClassOrSem: 'Class 7-B',
        previousYearPercentage: 92.5,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Sunil Kadam & Meena',
        parentPhone: '+91 98221 77234',
        parentEmail: 'sunil.kadam@gmail.com',
        feeTotal: 38000,
        feePaid: 30000,
        feePending: 8000,
        attendancePercent: 94,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '4481-2299-1102',
        bloodGroup: 'O+',
        religion: 'Hindu',
        category: 'General',
      },
      {
        id: `stu-exist-sch-${Date.now()}-3`,
        branchId: 'branch-sch-01',
        admissionNo: 'SCH-EXIST-1003',
        rollNo: '21',
        name: 'Samarth Nilesh Pawar',
        firstName: 'Samarth',
        lastName: 'Pawar',
        gender: 'MALE' as const,
        gradeOrSemester: 'Class 6-A',
        standard: 'Class 6',
        division: 'Division A',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2024-2025',
        admissionDate: '2024-06-10',
        grNumber: 'GR-2024-0715',
        prnNumber: 'PRN-2024-3321',
        previousClassOrSem: 'Class 5-A',
        previousYearPercentage: 84.0,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Nilesh Pawar',
        parentPhone: '+91 98234 55991',
        parentEmail: 'nilesh.pawar@gmail.com',
        feeTotal: 36000,
        feePaid: 36000,
        feePending: 0,
        attendancePercent: 95,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '5592-1188-3342',
        bloodGroup: 'A+',
        religion: 'Hindu',
        category: 'Open',
      },
      {
        id: `stu-exist-sch-${Date.now()}-4`,
        branchId: 'branch-sch-01',
        admissionNo: 'SCH-EXIST-1004',
        rollNo: '05',
        name: 'Anaya Sachin More',
        firstName: 'Anaya',
        lastName: 'More',
        gender: 'FEMALE' as const,
        gradeOrSemester: 'Class 4-B',
        standard: 'Class 4',
        division: 'Division B',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2025-2026',
        admissionDate: '2025-06-16',
        grNumber: 'GR-2025-0902',
        prnNumber: 'PRN-2025-1144',
        previousClassOrSem: 'Class 3-B',
        previousYearPercentage: 95.0,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Sachin More & Priya',
        parentPhone: '+91 98236 66120',
        parentEmail: 'sachin.more@gmail.com',
        feeTotal: 34000,
        feePaid: 34000,
        feePending: 0,
        attendancePercent: 98,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '7721-3309-8812',
        bloodGroup: 'AB+',
        religion: 'Hindu',
        category: 'OBC',
      },
    ];
    setImportedPreview(batch);
    setImportFileName('Existing_School_Students_Batch_2021_2025.csv');
  };

  // Bulk Load 4 Existing College Students
  const handleLoadExistingCollegeBatch = () => {
    const batch = [
      {
        id: `stu-exist-col-${Date.now()}-1`,
        branchId: 'branch-hm-01',
        admissionNo: 'HM-EXIST-2001',
        rollNo: 'BHM-401',
        name: 'Gaurav Suresh Shinde',
        firstName: 'Gaurav',
        lastName: 'Shinde',
        gender: 'MALE' as const,
        gradeOrSemester: 'B.Sc H&HA Semester 4',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2024-2025',
        admissionDate: '2024-07-01',
        grNumber: 'GR-2024-HM-0182',
        prnNumber: 'PRN-2024-UNI-5519',
        hotelSpecialization: 'Food Production & Bakery',
        previousClassOrSem: 'B.Sc H&HA Semester 3',
        previousYearPercentage: 87.5,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Suresh Shinde',
        parentPhone: '+91 98224 88192',
        parentEmail: 'suresh.shinde@gmail.com',
        feeTotal: 75000,
        feePaid: 75000,
        feePending: 0,
        attendancePercent: 93,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '4821-9923-5511',
        bloodGroup: 'B+',
        religion: 'Hindu',
        category: 'General',
      },
      {
        id: `stu-exist-col-${Date.now()}-2`,
        branchId: 'branch-hm-01',
        admissionNo: 'HM-EXIST-2002',
        rollNo: 'BHM-402',
        name: 'Pranali Ashok Joshi',
        firstName: 'Pranali',
        lastName: 'Joshi',
        gender: 'FEMALE' as const,
        gradeOrSemester: 'B.Sc H&HA Semester 4',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2024-2025',
        admissionDate: '2024-07-01',
        grNumber: 'GR-2024-HM-0183',
        prnNumber: 'PRN-2024-UNI-5520',
        hotelSpecialization: 'Food & Beverage Service / Mock Bar',
        previousClassOrSem: 'B.Sc H&HA Semester 3',
        previousYearPercentage: 91.0,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Ashok Joshi',
        parentPhone: '+91 98225 11982',
        parentEmail: 'ashok.joshi@gmail.com',
        feeTotal: 75000,
        feePaid: 50000,
        feePending: 25000,
        attendancePercent: 96,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '7712-4402-9931',
        bloodGroup: 'O+',
        religion: 'Hindu',
        category: 'General',
      },
      {
        id: `stu-exist-col-${Date.now()}-3`,
        branchId: 'branch-hm-01',
        admissionNo: 'HM-EXIST-2003',
        rollNo: 'BHM-601',
        name: 'Kunal Ravindra Chavan',
        firstName: 'Kunal',
        lastName: 'Chavan',
        gender: 'MALE' as const,
        gradeOrSemester: 'B.Sc H&HA Semester 6',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2023-2024',
        admissionDate: '2023-07-05',
        grNumber: 'GR-2023-HM-0091',
        prnNumber: 'PRN-2023-UNI-4411',
        hotelSpecialization: 'Housekeeping Operations Lab',
        previousClassOrSem: 'B.Sc H&HA Semester 5',
        previousYearPercentage: 85.2,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Ravindra Chavan',
        parentPhone: '+91 98227 44102',
        parentEmail: 'ravindra.chavan@gmail.com',
        feeTotal: 80000,
        feePaid: 80000,
        feePending: 0,
        attendancePercent: 91,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '8821-3319-5502',
        bloodGroup: 'A+',
        religion: 'Hindu',
        category: 'OBC',
      },
      {
        id: `stu-exist-col-${Date.now()}-4`,
        branchId: 'branch-hm-01',
        admissionNo: 'HM-EXIST-2004',
        rollNo: 'BHM-201',
        name: 'Tanmay Deepak Koli',
        firstName: 'Tanmay',
        lastName: 'Koli',
        gender: 'MALE' as const,
        gradeOrSemester: 'B.Sc H&HA Semester 2',
        admissionType: 'Existing' as const,
        isExistingStudent: true,
        originalAdmissionYear: '2025-2026',
        admissionDate: '2025-07-10',
        grNumber: 'GR-2025-HM-0301',
        prnNumber: 'PRN-2025-UNI-6618',
        hotelSpecialization: 'Front Office Operations & PMS Lab',
        previousClassOrSem: 'B.Sc H&HA Semester 1',
        previousYearPercentage: 88.0,
        openingFeeBalance: 0,
        legacyEnrollmentSource: 'BULK_CSV_MIGRATION' as const,
        parentName: 'Deepak Koli',
        parentPhone: '+91 98228 99120',
        parentEmail: 'deepak.koli@gmail.com',
        feeTotal: 75000,
        feePaid: 75000,
        feePending: 0,
        attendancePercent: 95,
        kycStatus: 'VERIFIED' as const,
        aadhaarVerified: true,
        aadhaarNumber: '9912-4421-7788',
        bloodGroup: 'B+',
        religion: 'Hindu',
        category: 'SBC',
      },
    ];
    setImportedPreview(batch);
    setImportFileName('Existing_College_Students_Batch_2023_2025.csv');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        handleLoadSampleBatch();
        return;
      }
      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 2) {
          const roll = cols[0] || String(i);
          const fName = cols[1] || 'Student';
          const lName = cols[2] || '';
          const isRowExisting = (cols[6] || '').toLowerCase().includes('exist') || (cols[7] && cols[7].includes('-'));
          const origYear = isRowExisting ? (cols[7] || '2023-2024') : '2026-2027';
          const grNum = cols[8] || (isRowExisting ? `GR-HIST-${Math.floor(Math.random() * 8000) + 1000}` : undefined);
          const prnNum = cols[9] || (isRowExisting ? `PRN-HIST-${Math.floor(Math.random() * 8000) + 1000}` : undefined);

          parsed.push({
            id: `stu-imp-${Date.now()}-${i}`,
            branchId: (cols[4]?.toUpperCase().includes('COLLEGE') || branchFilter === 'COLLEGE') ? 'branch-hm-01' : 'branch-sch-01',
            admissionNo: isRowExisting ? `ADM-HIST-${String(Math.floor(Math.random() * 900) + 100)}` : `ADM-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
            rollNo: roll,
            name: `${fName} ${lName}`.trim(),
            firstName: fName,
            lastName: lName,
            gender: (cols[3]?.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE') as any,
            gradeOrSemester: cols[5] || cols[4] || (branchFilter === 'COLLEGE' ? 'B.Sc H&HA Semester 1' : 'STD 8 - Division A'),
            standard: cols[5] || cols[4] || 'STD 8',
            division: cols[5] || 'Division A',
            admissionType: isRowExisting ? 'Existing' : 'Fresh',
            isExistingStudent: isRowExisting,
            originalAdmissionYear: origYear,
            grNumber: grNum,
            prnNumber: prnNum,
            previousClassOrSem: cols[10] || undefined,
            previousYearPercentage: Number(cols[11]) || undefined,
            openingFeeBalance: Number(cols[12]) || 0,
            legacyEnrollmentSource: isRowExisting ? 'BULK_CSV_MIGRATION' : undefined,
            parentName: cols[13] || cols[7] || 'Parent Guardian',
            parentPhone: cols[14] || cols[8] || '+91 98000 00000',
            parentEmail: cols[15] || cols[9] || 'parent@example.com',
            feeTotal: Number(cols[17]) || Number(cols[11]) || 38000,
            feePaid: 0,
            feePending: Number(cols[17]) || Number(cols[11]) || 38000,
            attendancePercent: 100,
            kycStatus: 'VERIFIED',
            aadhaarVerified: Boolean(cols[16] || cols[10]),
            aadhaarNumber: cols[16] || cols[10] || '',
            bloodGroup: 'O+',
          });
        }
      }
      setImportedPreview(parsed.length > 0 ? parsed : [
        {
          id: `stu-imp-${Date.now()}-1`,
          branchId: 'branch-sch-01',
          admissionNo: 'ADM-2026-000286',
          rollNo: '02',
          name: 'ZAYAN KHAN',
          firstName: 'ZAYAN',
          lastName: 'KHAN',
          gender: 'MALE',
          gradeOrSemester: 'STD 8 - Division A',
          feeTotal: 38000,
          feePending: 38000,
          feePaid: 0,
          attendancePercent: 100,
          kycStatus: 'VERIFIED',
          parentName: 'Rashid Khan',
          parentPhone: '+91 98220 55441',
        },
      ]);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importedPreview.length === 0) return;
    importedPreview.forEach((s) => {
      onAddStudent(s);
    });
    setImportSuccessAlert(`Successfully imported ${importedPreview.length} students into the Student Master Directory!`);
    setShowImportModal(false);
    setImportedPreview([]);
    setImportFileName('');
    setTimeout(() => {
      setImportSuccessAlert(null);
    }, 5000);
  };

  // Branch student counts
  const schoolCount = useMemo(
    () => students.filter((s) => s.branchId === 'branch-sch-01').length,
    [students]
  );
  const collegeCount = useMemo(
    () => students.filter((s) => s.branchId === 'branch-hm-01').length,
    [students]
  );

  // Extract distinct standards/courses based on branchFilter & Master Data
  const availableStandards = useMemo(() => {
    const set = new Set<string>();
    // From Master Store
    try {
      const masterStds = MasterStore.getStandards();
      masterStds.forEach((m) => {
        if (branchFilter === 'SCHOOL' && m.branchScope !== 'SCHOOL') return;
        if (branchFilter === 'COLLEGE' && m.branchScope !== 'COLLEGE') return;
        set.add(m.name);
      });
    } catch (e) {
      console.error(e);
    }
    // From current students
    students.forEach((s) => {
      if (branchFilter === 'SCHOOL' && s.branchId !== 'branch-sch-01') return;
      if (branchFilter === 'COLLEGE' && s.branchId !== 'branch-hm-01') return;
      if (s.gradeOrSemester) set.add(s.gradeOrSemester);
    });
    return Array.from(set).sort();
  }, [students, branchFilter]);

  // Extract distinct departments/specializations for College
  const availableSpecializations = useMemo(() => {
    const set = new Set<string>();
    try {
      const masterDepts = MasterStore.getDepartments();
      masterDepts.filter((d) => d.branchScope === 'COLLEGE').forEach((d) => set.add(d.name));
    } catch (e) {
      console.error(e);
    }
    students.forEach((s) => {
      if (s.branchId === 'branch-hm-01' && s.hotelSpecialization) {
        set.add(s.hotelSpecialization);
      }
    });
    return Array.from(set).sort();
  }, [students]);

  // Comprehensive multi-filter matching
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 0. Enrollment / Intake Type Filter (Existing vs Transfer vs Fresh)
      if (enrollmentTypeFilter === 'EXISTING' && !(s.admissionType === 'Existing' || s.isExistingStudent)) return false;
      if (enrollmentTypeFilter === 'TRANSFER' && !(s.admissionType === 'Transfer' || s.admissionType === 'Lateral' || s.previousSchool)) return false;
      if (enrollmentTypeFilter === 'FRESH' && (s.admissionType === 'Existing' || s.isExistingStudent || s.admissionType === 'Transfer' || s.admissionType === 'Lateral' || s.previousSchool)) return false;

      // 1. Branch Filter
      if (branchFilter === 'SCHOOL' && s.branchId !== 'branch-sch-01') return false;
      if (branchFilter === 'COLLEGE' && s.branchId !== 'branch-hm-01') return false;

      // 2. Department / Specialization Filter (for College or All)
      if (specializationFilter !== 'ALL' && s.hotelSpecialization !== specializationFilter) {
        return false;
      }

      // 3. Role Filter
      if (roleFilter !== 'ALL') {
        const studentRole = s.roleTag || 'STUDENT';
        if (studentRole !== roleFilter) return false;
      }

      // 4. Aadhaar Status Filter
      if (aadhaarFilter === 'VERIFIED' && !s.aadhaarVerified) return false;
      if (aadhaarFilter === 'PENDING' && s.aadhaarVerified) return false;

      // 5. Standard / Grade / Semester Filter
      if (standardFilter !== 'ALL' && s.gradeOrSemester !== standardFilter) return false;

      // 6. Fee Status Filter
      if (feeStatusFilter === 'FULLY_PAID' && s.feePending > 0) return false;
      if (feeStatusFilter === 'PENDING' && s.feePending === 0) return false;
      if (feeStatusFilter === 'OVERDUE_HIGH' && s.feePending < 15000) return false;

      // 7. Attendance Filter
      if (attendanceFilter === 'ABOVE_90' && s.attendancePercent < 90) return false;
      if (attendanceFilter === 'BETWEEN_75_90' && (s.attendancePercent < 75 || s.attendancePercent >= 90))
        return false;
      if (attendanceFilter === 'BELOW_75' && s.attendancePercent >= 75) return false;

      // 8. Gender Filter
      if (genderFilter !== 'ALL' && s.gender !== genderFilter) return false;

      // 9. Religion, Caste Category & Blood Group
      if (religionFilter !== 'ALL' && s.religion !== religionFilter) return false;
      if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
      if (bloodGroupFilter !== 'ALL' && s.bloodGroup !== bloodGroupFilter) return false;

      // 10. Search Query (Aadhaar, Name, Admission No, Roll No, Grade, Parent, Specialization)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanAadhaar = (s.aadhaarNumber || '').replace(/-/g, '').toLowerCase();
        const cleanQ = q.replace(/-/g, '');
        const match =
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.gradeOrSemester.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q) ||
          (s.aadhaarNumber && s.aadhaarNumber.toLowerCase().includes(q)) ||
          (cleanAadhaar && cleanAadhaar.includes(cleanQ)) ||
          (s.grNumber && s.grNumber.toLowerCase().includes(q)) ||
          (s.prnNumber && s.prnNumber.toLowerCase().includes(q)) ||
          (s.originalAdmissionYear && s.originalAdmissionYear.toLowerCase().includes(q)) ||
          (s.roleTag && s.roleTag.toLowerCase().includes(q)) ||
          (s.hotelSpecialization && s.hotelSpecialization.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    students,
    branchFilter,
    specializationFilter,
    roleFilter,
    aadhaarFilter,
    enrollmentTypeFilter,
    standardFilter,
    feeStatusFilter,
    attendanceFilter,
    genderFilter,
    religionFilter,
    categoryFilter,
    bloodGroupFilter,
    searchQuery,
  ]);

  // Client-side sorting on filtered dataset
  const {
    sortedData: sortedStudents,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<Student>(filteredStudents, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  // Client-side pagination
  const {
    currentPage: studentPage,
    setCurrentPage: setStudentPage,
    pageSize: studentPageSize,
    setPageSize: setStudentPageSize,
    paginatedItems: paginatedStudents,
  } = usePagination<Student>(sortedStudents, 10);

  // Export to Excel handler
  const handleExportExcel = (onlyFiltered: boolean) => {
    const dataset = onlyFiltered ? filteredStudents : students;
    const columns: ExportColumn[] = [
      { header: 'Admission No', key: 'admissionNo' },
      { header: 'Roll No', key: 'rollNo' },
      { header: 'Student Full Name', key: 'name' },
      { header: 'Role Tag', key: 'roleTag' },
      { header: 'Aadhaar Card Number', key: 'aadhaarNumber' },
      { header: 'Aadhaar Verification', key: 'aadhaarVerified' },
      { header: 'Institution Branch', key: 'branchName' },
      { header: 'Standard / Semester', key: 'gradeOrSemester' },
      { header: 'Gender', key: 'gender' },
      { header: 'Parent / Guardian', key: 'parentName' },
      { header: 'Parent Phone', key: 'parentPhone' },
      { header: 'Fee Total (₹)', key: 'feeTotal' },
      { header: 'Fee Paid (₹)', key: 'feePaid' },
      { header: 'Fee Pending (₹)', key: 'feePending' },
      { header: 'Attendance (%)', key: 'attendancePercent' },
      { header: 'KYC Status', key: 'kycStatus' },
      { header: 'Specialization / Stream', key: 'hotelSpecialization' },
    ];

    const rows = dataset.map((s) => ({
      ...s,
      branchName:
        s.branchId === 'branch-sch-01'
          ? 'Modern Public School And Junior College Bhose'
          : 'Modern College Of Hotel Management And Technology Solapur',
      roleTag: s.roleTag || 'STUDENT',
      aadhaarNumber: s.aadhaarNumber || 'Not Linked',
      aadhaarVerified: s.aadhaarVerified ? 'VERIFIED' : 'PENDING',
      hotelSpecialization: s.hotelSpecialization || 'General Curriculum',
    }));

    exportToExcel(
      columns,
      rows,
      onlyFiltered ? `Trust_Filtered_Students_${dataset.length}` : `Trust_ALL_Students_Master_${students.length}`
    );
    setShowExportDropdown(false);
  };

  // Export to PDF handler
  const handleExportPdf = (onlyFiltered: boolean) => {
    const dataset = onlyFiltered ? filteredStudents : students;
    const totalBilled = dataset.reduce((sum, s) => sum + s.feeTotal, 0);
    const totalPaid = dataset.reduce((sum, s) => sum + s.feePaid, 0);
    const totalPending = dataset.reduce((sum, s) => sum + s.feePending, 0);

    const columns = [
      'Adm No',
      'Student Name',
      'Role',
      'Aadhaar No',
      'Branch',
      'Standard / Sem',
      'Fee Paid',
      'Pending',
      'Attnd %',
      'KYC',
    ];

    const rows = dataset.map((s) => [
      s.admissionNo,
      s.name,
      s.roleTag || 'STUDENT',
      s.aadhaarNumber ? `XXXX-XXXX-${s.aadhaarNumber.slice(-4)}` : 'Not Linked',
      s.branchId === 'branch-sch-01' ? 'School' : 'Hotel Mgmt',
      s.gradeOrSemester,
      `₹ ${s.feePaid.toLocaleString()}`,
      s.feePending > 0 ? `₹ ${s.feePending.toLocaleString()}` : 'Cleared',
      `${s.attendancePercent}%`,
      s.kycStatus,
    ]);

    exportToPdf({
      title: 'Student Master Directory & Identity Register',
      subtitle: `${onlyFiltered ? 'Filtered Selection' : 'Complete Trust Master Database'} • Academic Session ${academicYear}`,
      summaryMetrics: [
        { label: 'Students Exported', value: dataset.length, color: '#0f172a' },
        { label: 'Total Billed', value: `₹ ${(totalBilled / 100000).toFixed(2)} Lakhs`, color: '#ea580c' },
        { label: 'Total Collected', value: `₹ ${(totalPaid / 100000).toFixed(2)} Lakhs`, color: '#16a34a' },
        { label: 'Total Pending', value: `₹ ${(totalPending / 100000).toFixed(2)} Lakhs`, color: '#dc2626' },
      ],
      columns,
      rows,
      fileName: onlyFiltered ? 'Trust_Filtered_Students_Report' : 'Trust_Master_Students_Report',
    });
    setShowExportDropdown(false);
  };

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name) return;
    const isExisting = newStudent.admissionType === 'Existing' || admissionMode === 'EXISTING' || newStudent.isExistingStudent;
    const isTransfer = newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral' || admissionMode === 'TRANSFER';
    const finalAdmissionType = newStudent.admissionType || (isExisting ? 'Existing' : isTransfer ? 'Transfer' : 'Fresh');

    onAddStudent({
      ...newStudent,
      isExistingStudent: isExisting,
      admissionType: finalAdmissionType,
      originalAdmissionYear: isExisting ? (newStudent.originalAdmissionYear || '2023-2024') : '2026-2027',
      grNumber:
        newStudent.grNumber ||
        (isExisting
          ? `GR-HIST-${Math.floor(Math.random() * 8000) + 1000}`
          : isTransfer
          ? `GR-2026-TR-${Math.floor(Math.random() * 800) + 100}`
          : undefined),
      prnNumber: newStudent.prnNumber || (isExisting ? `PRN-HIST-${Math.floor(Math.random() * 8000) + 1000}` : undefined),
      legacyEnrollmentSource: isExisting ? 'MANUAL_ENTRY' : undefined,
      lastSchoolAttended: isTransfer ? newStudent.previousSchool : undefined,
      // Kaksha Plus Transfer specifics
      previousSchool: isTransfer ? newStudent.previousSchool : undefined,
      standardDivLeft: isTransfer ? newStudent.standardDivLeft : undefined,
      schoolLeavingDate: isTransfer ? newStudent.schoolLeavingDate : undefined,
      lcReceivedDate: isTransfer ? newStudent.lcReceivedDate : undefined,
      reasonForLeaving: isTransfer ? newStudent.reasonForLeaving : undefined,
      migrationUniversity: isTransfer ? newStudent.migrationUniversity : undefined,
      voluntarySubjectSpecial: isTransfer ? newStudent.voluntarySubjectSpecial : undefined,
      previousProgress: isTransfer ? (newStudent.previousProgress || newStudent.progress) : undefined,
      previousConduct: isTransfer ? (newStudent.previousConduct || newStudent.conduct) : undefined,
      previousLcNumber: isTransfer ? newStudent.previousLcNumber : undefined,
      progress: newStudent.progress || newStudent.previousProgress || 'Good',
      conduct: newStudent.conduct || newStudent.previousConduct || 'Good',
    });
    setShowAdmissionModal(false);
    setNewStudent({
      name: '',
      nameMarathi: '',
      fatherNameMarathi: '',
      motherNameMarathi: '',
      gender: 'MALE',
      branchId: 'branch-sch-01',
      gradeOrSemester: 'Class 1-A',
      parentName: '',
      parentPhone: '',
      feeTotal: 36000,
      hotelSpecialization: '',
      aadhaarNumber: '',
      roleTag: 'STUDENT',
      isExistingStudent: false,
      admissionType: 'Fresh',
      originalAdmissionYear: '2023-2024',
      grNumber: '',
      prnNumber: '',
      previousClassOrSem: '',
      previousYearPercentage: 82.5,
      openingFeeBalance: 0,
      previousSchool: '',
      standardDivLeft: '',
      schoolLeavingDate: '',
      lcReceivedDate: '',
      reasonForLeaving: '',
      migrationUniversity: '',
      voluntarySubjectSpecial: '',
      previousProgress: 'Good',
      previousConduct: 'Good',
      progress: 'Good',
      conduct: 'Good',
      previousLcNumber: '',
    });
    setAdmissionMode('FRESH');
  };

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFeeModal) return;
    const stu = showFeeModal;
    const amt = Number(feeAmount);
    onCollectFee(stu.id, amt, paymentMode);

    const isSchool = stu.branchId === 'branch-sch-01';
    const breakdown = generateFeeBreakdown(amt, isSchool ? 'SCHOOL' : 'COLLEGE');
    const previouslyPaid = stu.feePaid;
    const remainingBalance = Math.max(0, stu.feeTotal - (stu.feePaid + amt));

    const receipt: FeeReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNo: `RCP-${isSchool ? 'SCH' : 'HM'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: stu.id,
      studentName: stu.name,
      studentNameMarathi: stu.nameMarathi,
      branchName: isSchool
        ? 'Modern Public School And Junior College Bhose'
        : 'Modern College Of Hotel Management And Technology Solapur',
      standardOrGrade: stu.gradeOrSemester,
      division: stu.division || 'A',
      rollNo: stu.rollNo,
      admissionNo: stu.admissionNo,
      grNumber: stu.grNumber,
      academicYear: '2026-2027',
      parentName: stu.parentName || stu.fatherName,
      parentPhone: stu.parentPhone,
      category: stu.category || 'General',
      amount: amt,
      totalAnnualFee: stu.feeTotal,
      previouslyPaid,
      remainingBalance,
      paymentMode,
      transactionReference:
        paymentMode === 'UPI'
          ? `UPI/UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`
          : paymentMode === 'CHEQUE'
          ? `CHQ-${Math.floor(100000 + Math.random() * 900000)}`
          : `CASH-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      installmentNo: `Installment ${stu.feePaid > 0 ? 2 : 1} (2026-2027)`,
      feeBreakdown: breakdown,
      amountInWords: numberToWordsINR(amt),
      amountInWordsMarathi: numberToMarathiWordsINR(amt),
      cashierName: 'Accounts Officer (Central Trust Office)',
      status: 'PAID',
    };

    setViewingReceipt(receipt);
    setShowFeeModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bulk Import Notification Toast */}
      {importSuccessAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-bold animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importSuccessAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportSuccessAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Clean Unified Action & Filter Toolbar directly above the table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
        {/* ROW 1: Module Title & Action Button Groups */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Left: Module Title & Scope Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Students Master Directory
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                  {branchFilter === 'SCHOOL'
                    ? 'Modern Public School & Jr College'
                    : branchFilter === 'COLLEGE'
                    ? 'Hotel Management College'
                    : 'Consolidated Trust Roster'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  AY {academicYear}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Comprehensive roster, academic records, fee ledgers & student profiles
              </p>
            </div>
          </div>

          {/* Right: Action Buttons Grouped Responsively */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-start xl:justify-end">
            {/* Data Tools Group: Import, Export, Progression */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl shrink-0">
              {/* Import Data */}
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                title="Bulk import students from Excel or CSV template"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Import</span>
              </button>

              {/* Export Data Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer"
                  title="Export database records to Excel or PDF"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span>Export</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 animate-scale-in">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Excel (.xlsx / .csv)
                    </div>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        handleExportExcel(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Export Filtered Records</div>
                        <div className="text-[10px] font-normal text-slate-400">{filteredStudents.length} Students in view</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        handleExportExcel(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Export ALL Data</div>
                        <div className="text-[10px] font-normal text-slate-400">{students.length} Total database records</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Official PDF Document
                    </div>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        handleExportPdf(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-rose-600" />
                      <div>
                        <div>Export Filtered to PDF</div>
                        <div className="text-[10px] font-normal text-slate-400">Printable A4 report with letterhead</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        handleExportPdf(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-rose-600" />
                      <div>
                        <div>Export ALL Data to PDF</div>
                        <div className="text-[10px] font-normal text-slate-400">Complete Trust roster PDF</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Annual Progression */}
              {onOpenProgression && (
                <button
                  type="button"
                  onClick={onOpenProgression}
                  className="bg-white hover:bg-amber-50 text-amber-800 hover:text-amber-900 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  title="Promote students to next class / grade"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">Progression</span>
                </button>
              )}
            </div>

            {/* Primary Admissions Group: Enroll Existing, New Admission, CAP Wizard */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAdmissionMode('EXISTING');
                  setShowAdmissionModal(true);
                }}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs px-3 py-2 rounded-xl border border-blue-200 shadow-2xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                title="Enroll continuing students already studying in School or College with historical GR number"
              >
                <History className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Enroll Existing</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdmissionMode('FRESH');
                  setShowAdmissionModal(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                title="Fresh Intake Admission for Academic Session 2026-2027"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>+ New Admission</span>
              </button>

              {onOpenAdmissionWizard && (
                <button
                  type="button"
                  onClick={onOpenAdmissionWizard}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                  title="Launch 6-Step Multi-Campus Admission Wizard"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>CAP Wizard</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: Search Bar, Standard Filter, Advanced Filters & Status Summary */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search & Filter inputs */}
          <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
            {/* Quick Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  branchFilter === 'SCHOOL'
                    ? 'Search school students by name, roll, PRN...'
                    : branchFilter === 'COLLEGE'
                    ? 'Search college students by name, PRN, course...'
                    : 'Search students by name, roll, PRN, Aadhaar...'
                }
                className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Standard Dropdown */}
            <div className="relative shrink-0 min-w-[160px] sm:min-w-[200px]">
              <select
                value={standardFilter}
                onChange={(e) => setStandardFilter(e.target.value)}
                aria-label="Filter by standard or class"
                className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-colors"
              >
                <option value="ALL">
                  {branchFilter === 'SCHOOL'
                    ? 'All School Standards'
                    : branchFilter === 'COLLEGE'
                    ? 'All College Semesters'
                    : 'All Classes & Standards'}
                </option>
                {availableStandards.map((std) => (
                  <option key={std} value={std}>
                    {std}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* All-in-One Filter Sign / Button with badge */}
            <button
              type="button"
              onClick={() => setShowAdvancedModal(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                activeAdvancedFilterCount > 0
                  ? 'bg-orange-50 border-orange-300 text-orange-700 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Open All-in-One Filters Panel (Gender, Blood Group, Aadhaar, Role, Caste, Religion)"
            >
              <Filter className="w-4 h-4 text-orange-600" />
              <span>Filters</span>
              {activeAdvancedFilterCount > 0 ? (
                <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-black">
                  {activeAdvancedFilterCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">All</span>
              )}
            </button>

            {/* Quick Reset if filtered */}
            {(searchQuery || standardFilter !== 'ALL' || activeAdvancedFilterCount > 0) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                title="Reset all active filters"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right: Live Count & Active Filters Indicator */}
          <div className="flex items-center gap-2 justify-end text-xs text-slate-500 shrink-0">
            <span>
              Showing <strong className="text-slate-900 font-extrabold">{filteredStudents.length}</strong> of{' '}
              <strong className="text-slate-900 font-extrabold">
                {branchFilter === 'SCHOOL'
                  ? schoolCount
                  : branchFilter === 'COLLEGE'
                  ? collegeCount
                  : students.length}
              </strong>
            </span>
            {activeAdvancedFilterCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                {activeAdvancedFilterCount} active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Student Table (Dynamically tailored for School vs College vs All) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">
              {branchFilter === 'SCHOOL'
                ? 'School Students Roster (Classes & Standards)'
                : branchFilter === 'COLLEGE'
                ? 'College Students Roster (Hospitality & Tech)'
                : 'Consolidated Trust Students Roster'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 font-medium">
              Academic Session {academicYear}
            </span>
          </div>
          {searchQuery && (
            <div className="text-[11px] text-orange-600 font-bold">
              Matching query: &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        <div className="erp-table-scroll">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px] shadow-2xs">
              {branchFilter === 'SCHOOL' ? (
                /* School-Specific Table Header: Standard / Class & Guardian */
                <tr>
                  <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center" />
                  <SortableTh label="Student & Roll No" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Standard / Class" sortKey="gradeOrSemester" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Parent / Guardian & Mobile" sortKey="parentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Role / Rep" sortKey="roleTag" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Aadhaar KYC" sortKey="kycStatus" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="School Fee Ledger" sortKey="feePending" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Attnd %" sortKey="attendancePercent" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              ) : branchFilter === 'COLLEGE' ? (
                /* College-Specific Table Header: Course, Department & Training Lab */
                <tr>
                  <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center" />
                  <SortableTh label="Student & PRN / Roll No" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Degree Course & Semester" sortKey="gradeOrSemester" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Department / Specialization" sortKey="hotelSpecialization" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Culinary Lab / Internship" sortKey="culinaryLab" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Aadhaar KYC" sortKey="kycStatus" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="College Fee Ledger" sortKey="feePending" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Attnd %" sortKey="attendancePercent" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              ) : (
                /* Consolidated All-Institutions Table Header */
                <tr>
                  <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center" />
                  <SortableTh label="Student Name & ID" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Institution Branch" sortKey="branchName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Standard / Course & Sem" sortKey="gradeOrSemester" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Department / Guardian" sortKey="parentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Aadhaar Card" sortKey="aadhaarNumber" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Fee Summary" sortKey="feePending" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <SortableTh label="Attnd %" sortKey="attendancePercent" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <div className="font-bold text-sm text-slate-700">No students match the selected filters</div>
                    <p className="text-xs text-slate-400 mt-1">
                      {branchFilter === 'SCHOOL'
                        ? 'Try selecting a different School class or clearing search filters.'
                        : branchFilter === 'COLLEGE'
                        ? 'Try selecting a different College department or clearing search filters.'
                        : 'Try resetting the filters or switching institution branch.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 bg-orange-50 text-orange-600 font-bold px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-100 text-xs cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((stu, index) => {
                  const roleTag = stu.roleTag || 'STUDENT';
                  const isSchool = stu.branchId === 'branch-sch-01';
                  const globalIndex = (studentPage - 1) * studentPageSize + index + 1;

                  if (branchFilter === 'SCHOOL') {
                    /* ============================================================ */
                    /* PURE SCHOOL ROW: Standard, Parent details, Roll No (No Depts) */
                    /* ============================================================ */
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 0. Serial Number */}
                        <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono text-xs">
                          {globalIndex}
                        </td>

                        {/* 1. Student Name & Roll No */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900">{stu.name}</span>
                            {stu.nameMarathi && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 font-serif">
                                {stu.nameMarathi}
                              </span>
                            )}
                            {(stu.admissionType === 'Existing' || stu.isExistingStudent) ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200" title={`Historical Enrollment from ${stu.originalAdmissionYear || 'Earlier'}`}>
                                🏛️ Existing ({stu.originalAdmissionYear?.slice(0, 4) || 'Enrolled'})
                              </span>
                            ) : (stu.admissionType === 'Transfer' || stu.previousSchool) ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300" title={`Transfer with LC from ${stu.previousSchool || 'Other School'}`}>
                                🏛️ Transfer (LC)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✨ Fresh 26-27
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {stu.admissionNo} &bull; Roll: {stu.rollNo}
                            {stu.grNumber && (
                              <span className="ml-1 text-slate-600 font-semibold">• GR: {stu.grNumber}</span>
                            )}
                          </div>
                          {(stu.admissionType === 'Transfer' || stu.previousSchool) && stu.previousSchool && (
                            <div className="text-[10px] text-amber-700 font-semibold truncate max-w-xs mt-0.5" title={`Transfer from: ${stu.previousSchool}`}>
                              From: {stu.previousSchool} {stu.previousLcNumber ? `(LC #${stu.previousLcNumber})` : ''}
                            </div>
                          )}
                        </td>

                        {/* 2. School Standard / Class */}
                        <td className="py-3 px-4">
                          <span className="bg-orange-50 text-orange-800 border border-orange-200/80 px-2.5 py-1 rounded-lg font-bold text-xs inline-flex items-center gap-1">
                            <School className="w-3 h-3 text-orange-600" />
                            {stu.gradeOrSemester}
                          </span>
                        </td>

                        {/* 3. Parent / Guardian & Phone */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{stu.parentName || 'Parent On Record'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{stu.parentPhone || '—'}</div>
                        </td>

                        {/* 4. Role / Rep */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              roleTag === 'PREFECT'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {roleTag === 'PREFECT' && <Award className="w-3 h-3 text-amber-600" />}
                            {roleTag}
                          </span>
                        </td>

                        {/* 5. Aadhaar Card KYC */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-slate-800">
                              {stu.aadhaarNumber || 'Not Linked'}
                            </span>
                            {stu.aadhaarVerified ? (
                              <span className="text-emerald-600 bg-emerald-50 p-0.5 rounded-full" title="Aadhaar KYC Verified">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-amber-500 bg-amber-50 p-0.5 rounded-full" title="Aadhaar KYC Pending">
                                <ShieldAlert className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. School Fee Ledger */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            ₹ {stu.feePaid.toLocaleString()} / ₹ {stu.feeTotal.toLocaleString()}
                          </div>
                          {stu.feePending > 0 ? (
                            <div className="text-[10px] text-rose-600 font-bold">
                              Due: ₹ {stu.feePending.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-600 font-bold">Fully Cleared</div>
                          )}
                        </td>

                        {/* 7. Attendance % */}
                        <td className="py-3 px-4 font-bold text-slate-800">{stu.attendancePercent}%</td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedStudentProfile(stu)}
                              title="View Full Student Master Statutory Profile & Documents"
                              className="bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 font-bold px-2 py-1 rounded-lg border border-slate-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-orange-600 group-hover:text-white" />
                              <span>Master</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIdCardModalStudent(stu)}
                              title="Generate and Print Student ID Card"
                              className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <IdCard className="w-3 h-3 text-amber-600 group-hover:text-white" />
                              <span>ID Card</span>
                            </button>
                            {onOpenProgression && (
                              <button
                                type="button"
                                onClick={onOpenProgression}
                                title="Carry forward to next standard"
                                className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                              >
                                <TrendingUp className="w-3 h-3" />
                                Carry Fwd
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setShowFeeModal(stu);
                                setFeeAmount(stu.feePending > 0 ? String(stu.feePending) : '5000');
                              }}
                              className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold px-2 py-1 rounded-lg border border-emerald-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <CreditCard className="w-3 h-3" />
                              Collect
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStudent({ ...stu })}
                              title="Edit Student Information"
                              className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingStudent(stu)}
                              title="Delete Student Record"
                              className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold px-2 py-1 rounded-lg border border-rose-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  if (branchFilter === 'COLLEGE') {
                    /* ============================================================ */
                    /* PURE COLLEGE ROW: Course, Department, Training Lab, Intern   */
                    /* ============================================================ */
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 0. Serial Number */}
                        <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono text-xs">
                          {globalIndex}
                        </td>

                        {/* 1. Student Name & PRN No */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900">{stu.name}</span>
                            {stu.nameMarathi && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 font-serif">
                                {stu.nameMarathi}
                              </span>
                            )}
                            {(stu.admissionType === 'Existing' || stu.isExistingStudent) ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200" title={`Historical Enrollment from ${stu.originalAdmissionYear || 'Earlier'}`}>
                                🏛️ Existing ({stu.originalAdmissionYear?.slice(0, 4) || 'Enrolled'})
                              </span>
                            ) : (stu.admissionType === 'Transfer' || stu.previousSchool) ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300" title={`Transfer with LC from ${stu.previousSchool || 'Other School'}`}>
                                🏛️ Transfer (LC)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✨ Fresh 26-27
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {stu.admissionNo} &bull; PRN: {stu.prnNumber || stu.rollNo}
                            {stu.grNumber && (
                              <span className="ml-1 text-slate-600 font-semibold">• GR: {stu.grNumber}</span>
                            )}
                          </div>
                          {(stu.admissionType === 'Transfer' || stu.previousSchool) && stu.previousSchool && (
                            <div className="text-[10px] text-amber-700 font-semibold truncate max-w-xs mt-0.5" title={`Transfer from: ${stu.previousSchool}`}>
                              From: {stu.previousSchool} {stu.previousLcNumber ? `(LC #${stu.previousLcNumber})` : ''}
                            </div>
                          )}
                        </td>

                        {/* 2. Degree Course & Semester */}
                        <td className="py-3 px-4">
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-bold text-xs inline-flex items-center gap-1">
                            <UtensilsCrossed className="w-3 h-3 text-amber-600" />
                            {stu.gradeOrSemester}
                          </span>
                        </td>

                        {/* 3. Department / Specialization */}
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            {stu.hotelSpecialization || 'General Hospitality & Culinary'}
                          </span>
                        </td>

                        {/* 4. Culinary Lab / Internship Status */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 text-[11px]">
                            {roleTag === 'INTERN' ? '5-Star Luxury Internship' : 'Commercial Training Kitchen (BTK)'}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-mono">
                            {roleTag === 'INTERN' ? 'Taj / Marriott Partner' : 'Bakery & Practical Shift'}
                          </div>
                        </td>

                        {/* 5. Aadhaar Card KYC */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-slate-800">
                              {stu.aadhaarNumber || 'Not Linked'}
                            </span>
                            {stu.aadhaarVerified ? (
                              <span className="text-emerald-600 bg-emerald-50 p-0.5 rounded-full" title="Aadhaar KYC Verified">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-amber-500 bg-amber-50 p-0.5 rounded-full" title="Aadhaar KYC Pending">
                                <ShieldAlert className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. College Fee Ledger */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            ₹ {stu.feePaid.toLocaleString()} / ₹ {stu.feeTotal.toLocaleString()}
                          </div>
                          {stu.feePending > 0 ? (
                            <div className="text-[10px] text-rose-600 font-bold">
                              Due: ₹ {stu.feePending.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-600 font-bold">Fully Cleared</div>
                          )}
                        </td>

                        {/* 7. Lab Attendance % */}
                        <td className="py-3 px-4 font-bold text-slate-800">{stu.attendancePercent}%</td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedStudentProfile(stu)}
                              title="View Full Student Master Statutory Profile & Documents"
                              className="bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 font-bold px-2 py-1 rounded-lg border border-slate-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-orange-600" />
                              <span>Master</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIdCardModalStudent(stu)}
                              title="Generate and Print Student ID Card"
                              className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <IdCard className="w-3 h-3 text-amber-600" />
                              <span>ID Card</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowFeeModal(stu);
                                setFeeAmount(stu.feePending > 0 ? String(stu.feePending) : '15000');
                              }}
                              className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <CreditCard className="w-3 h-3" />
                              Collect
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStudent({ ...stu })}
                              title="Edit Student Information"
                              className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingStudent(stu)}
                              title="Delete Student Record"
                              className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold px-2 py-1 rounded-lg border border-rose-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  /* ============================================================ */
                  /* CONSOLIDATED ROW (ALL INSTITUTIONS): Shows branch badge & data*/
                  /* ============================================================ */
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 0. Serial Number */}
                      <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono text-xs">
                        {globalIndex}
                      </td>

                      {/* Name & Roll No */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{stu.name}</span>
                          {stu.nameMarathi && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 font-serif">
                              {stu.nameMarathi}
                            </span>
                          )}
                          {(stu.admissionType === 'Existing' || stu.isExistingStudent) ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200" title={`Historical Enrollment from ${stu.originalAdmissionYear || 'Earlier'}`}>
                              🏛️ Existing ({stu.originalAdmissionYear?.slice(0, 4) || 'Enrolled'})
                            </span>
                          ) : (stu.admissionType === 'Transfer' || stu.previousSchool) ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300" title={`Transfer with LC from ${stu.previousSchool || 'Other School'}`}>
                              🏛️ Transfer (LC)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✨ Fresh 26-27
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {stu.admissionNo} &bull; {stu.rollNo}
                          {stu.grNumber && (
                            <span className="ml-1 text-slate-600 font-semibold">• GR: {stu.grNumber}</span>
                          )}
                        </div>
                        {(stu.admissionType === 'Transfer' || stu.previousSchool) && stu.previousSchool && (
                          <div className="text-[10px] text-amber-700 font-semibold truncate max-w-xs mt-0.5" title={`Transfer from: ${stu.previousSchool}`}>
                            From: {stu.previousSchool} {stu.previousLcNumber ? `(LC #${stu.previousLcNumber})` : ''}
                          </div>
                        )}
                      </td>

                      {/* Branch Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSchool
                              ? 'bg-orange-50 text-orange-800 border border-orange-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isSchool ? <School className="w-3 h-3 text-orange-600" /> : <UtensilsCrossed className="w-3 h-3 text-amber-600" />}
                          {isSchool ? 'Modern School' : 'Hotel Mgmt College'}
                        </span>
                      </td>

                      {/* Standard / Course & Sem */}
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {stu.gradeOrSemester}
                        </span>
                      </td>

                      {/* Department or Parent Contact */}
                      <td className="py-3 px-4">
                        {isSchool ? (
                          <div>
                            <div className="font-medium text-slate-800">{stu.parentName || 'Parent On Record'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{stu.parentPhone || '—'}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded font-bold text-[10px]">
                              {stu.hotelSpecialization || 'Culinary & Hospitality'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Aadhaar Card Number & KYC Badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            {stu.aadhaarNumber || 'Not Linked'}
                          </span>
                          {stu.aadhaarVerified ? (
                            <span className="text-emerald-600 bg-emerald-50 p-0.5 rounded-full" title="Aadhaar KYC Verified">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-amber-500 bg-amber-50 p-0.5 rounded-full" title="Aadhaar KYC Pending">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Fee Summary */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          ₹ {stu.feePaid.toLocaleString()} / ₹ {stu.feeTotal.toLocaleString()}
                        </div>
                        {stu.feePending > 0 ? (
                          <div className="text-[10px] text-rose-600 font-bold">
                            Due: ₹ {stu.feePending.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-600 font-bold">Fully Cleared</div>
                        )}
                      </td>

                      {/* Attendance % */}
                      <td className="py-3 px-4 font-bold text-slate-800">{stu.attendancePercent}%</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentProfile(stu)}
                            title="View Full Student Master Statutory Profile & Documents"
                            className="bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 font-bold px-2 py-1 rounded-lg border border-slate-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-orange-600" />
                            <span>Master</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIdCardModalStudent(stu)}
                            title="Generate and Print Student ID Card"
                            className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <IdCard className="w-3 h-3 text-amber-600" />
                            <span>ID Card</span>
                          </button>
                          {isSchool && onOpenProgression && (
                            <button
                              type="button"
                              onClick={onOpenProgression}
                              title="Carry forward to next standard"
                              className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <TrendingUp className="w-3 h-3" />
                              Carry Fwd
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setShowFeeModal(stu);
                              setFeeAmount(String(stu.feePending > 0 ? stu.feePending : 12000));
                            }}
                            className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold px-2 py-1 rounded-lg border border-emerald-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <CreditCard className="w-3 h-3" />
                            Collect
                          </button>
                          {stu.feePaid > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const isSchoolBranch = stu.branchId === 'branch-sch-01';
                                const rcp: FeeReceipt = {
                                  id: `rcp-dir-${stu.id}`,
                                  receiptNo: `RCP-${isSchoolBranch ? 'SCH' : 'HM'}-2026-${stu.admissionNo.replace(/\D/g, '').slice(-3) || '082'}`,
                                  studentId: stu.id,
                                  studentName: stu.name,
                                  studentNameMarathi: stu.nameMarathi,
                                  branchName: isSchoolBranch
                                    ? 'Modern Public School And Junior College Bhose'
                                    : 'Modern College Of Hotel Management And Technology Solapur',
                                  standardOrGrade: stu.gradeOrSemester,
                                  division: stu.division || 'A',
                                  rollNo: stu.rollNo,
                                  admissionNo: stu.admissionNo,
                                  grNumber: stu.grNumber,
                                  academicYear: '2026-2027',
                                  parentName: stu.parentName || stu.fatherName,
                                  parentPhone: stu.parentPhone,
                                  category: stu.category || 'General',
                                  amount: stu.feePaid,
                                  totalAnnualFee: stu.feeTotal,
                                  previouslyPaid: 0,
                                  remainingBalance: stu.feePending,
                                  paymentMode: 'UPI',
                                  date: new Date().toISOString().split('T')[0],
                                  installmentNo: 'Installment 1 & 2',
                                  feeBreakdown: generateFeeBreakdown(stu.feePaid, isSchoolBranch ? 'SCHOOL' : 'COLLEGE'),
                                  status: 'PAID',
                                };
                                setViewingReceipt(rcp);
                              }}
                              title="View & Print Official Fee Receipt"
                              className="bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 font-bold px-2 py-1 rounded-lg border border-orange-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingStudent({ ...stu })}
                            title="Edit Student Information"
                            className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingStudent(stu)}
                            title="Delete Student Record"
                            className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold px-2 py-1 rounded-lg border border-rose-200 transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Student Table Pagination Controls */}
        <TablePagination
          currentPage={studentPage}
          totalItems={sortedStudents.length}
          pageSize={studentPageSize}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          onPageChange={setStudentPage}
          onPageSizeChange={setStudentPageSize}
          itemName={
            branchFilter === 'SCHOOL'
              ? 'school students'
              : branchFilter === 'COLLEGE'
              ? 'college students'
              : 'students'
          }
        />
      </div>

      {/* 4. Advanced Filter Modal Drawer */}
      {showAdvancedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-base text-slate-900">Advanced Multi-Filter Panel</h3>
              </div>
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              {/* Filter 1: Branch Scope */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution Branch</label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value as any)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Institutions (Zep Foundation)</option>
                  <option value="SCHOOL">Modern Public School & Jr College Bhose</option>
                  <option value="COLLEGE">Modern College of HM & Tech Solapur</option>
                </select>
              </div>

              {/* Filter 2: Role */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student / Member Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="STUDENT">Student (General)</option>
                  <option value="PREFECT">Prefect / Class Representative</option>
                  <option value="INTERN">Hospitality / Kitchen Intern</option>
                </select>
              </div>

              {/* Filter 3: Aadhaar KYC Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar Verification</label>
                <select
                  value={aadhaarFilter}
                  onChange={(e) => setAadhaarFilter(e.target.value as any)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Aadhaar Records</option>
                  <option value="VERIFIED">Aadhaar KYC Verified Only</option>
                  <option value="PENDING">Aadhaar Verification Pending</option>
                </select>
              </div>

              {/* Filter 4: Standard / Grade */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard / Semester</label>
                <select
                  value={standardFilter}
                  onChange={(e) => setStandardFilter(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Classes & Semesters</option>
                  {availableStandards.map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 5: Fee Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Payment Status</label>
                <select
                  value={feeStatusFilter}
                  onChange={(e) => setFeeStatusFilter(e.target.value as any)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Balances</option>
                  <option value="FULLY_PAID">Fully Paid (Zero Dues)</option>
                  <option value="PENDING">Has Outstanding Balance</option>
                  <option value="OVERDUE_HIGH">High Outstanding (&gt; ₹15,000)</option>
                </select>
              </div>

              {/* Filter 6: Attendance Range */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Attendance Range</label>
                <select
                  value={attendanceFilter}
                  onChange={(e) => setAttendanceFilter(e.target.value as any)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Attendance Levels</option>
                  <option value="ABOVE_90">&gt;= 90% (Distinction)</option>
                  <option value="BETWEEN_75_90">75% - 89% (Good)</option>
                  <option value="BELOW_75">&lt; 75% (Low / Critical)</option>
                </select>
              </div>

              {/* Filter 7: Religion */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Religion</label>
                <select
                  value={religionFilter}
                  onChange={(e) => setReligionFilter(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Religions</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Filter 8: Social Category / Caste */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category / Quota</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="OPEN">Open / General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="NT">NT</option>
                  <option value="VJNT">VJNT</option>
                </select>
              </div>

              {/* Filter 9: Blood Group */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroupFilter}
                  onChange={(e) => setBloodGroupFilter(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Blood Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Filter 10: Student Intake / Enrollment Type */}
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Student Intake / Enrollment Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'ALL', label: 'All Students' },
                    { key: 'FRESH', label: '✨ Fresh (2026-27)' },
                    { key: 'TRANSFER', label: '🏛️ Transfer (LC)' },
                    { key: 'EXISTING', label: '🏛️ Existing / Historical' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setEnrollmentTypeFilter(t.key as any)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        enrollmentTypeFilter === t.key
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 11: Gender */}
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ALL', 'MALE', 'FEMALE'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenderFilter(g)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        genderFilter === g
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {g === 'ALL' ? 'All' : g === 'MALE' ? 'Male' : 'Female'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>

              <button
                type="button"
                onClick={() => setShowAdvancedModal(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Apply Filters ({filteredStudents.length} Students)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Data Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-in max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Bulk Import Student Records</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Upload CSV file or download pre-formatted templates for fresh or existing students
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportedPreview([]);
                  setImportFileName('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher inside Import Modal */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl my-3 shrink-0">
              <button
                type="button"
                onClick={() => setImportTab('FRESH')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  importTab === 'FRESH'
                    ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fresh Admissions Intake (2026-27)</span>
              </button>

              <button
                type="button"
                onClick={() => setImportTab('EXISTING')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  importTab === 'EXISTING'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Existing Students Migration (School & College)</span>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto py-2 space-y-4 pr-1 text-xs">
              {importTab === 'EXISTING' ? (
                /* EXISTING STUDENTS IMPORT SECTION */
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl">
                    <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      <span>Historical Student Data Migration Protocol</span>
                    </div>
                    <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                      Onboard continuing students currently enrolled in Modern Public School or Modern College of Hotel Management. Includes historical General Register (GR) numbers, University/Board PRN, original intake academic sessions, and prior academic records.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Step 1: Download Template */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Step 1</span>
                        <h4 className="font-bold text-slate-800 text-sm mt-0.5">Existing Students CSV Template</h4>
                        <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
                          Download specialized CSV formatted with columns for original session admitted, historical GR No., PRN, and previous class percentages.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadExistingTemplate}
                        className="mt-3 w-full bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-2 rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Download Existing CSV Template</span>
                      </button>
                    </div>

                    {/* Step 2: 1-Click Existing Batches */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Quick Test Batches</span>
                        <h4 className="font-bold text-slate-800 text-sm mt-0.5">Pre-verified Continuing Records</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                          Instantly load 4 verified continuing students with historical GR numbers and academic sessions into preview.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          type="button"
                          onClick={handleLoadExistingSchoolBatch}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-2 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <School className="w-3.5 h-3.5" />
                          <span>School Batch</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleLoadExistingCollegeBatch}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] px-2.5 py-2 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>College Batch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* FRESH INTAKE IMPORT SECTION */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Step 1: Download Template */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Step 1</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-0.5">Standardized CSV Template</h4>
                      <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
                        Download our ready-to-fill CSV template with columns for roll no, name, PRN, Aadhaar, parent details and fees.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="mt-3 w-full bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-2 rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-600" />
                      <span>Download CSV Template</span>
                    </button>
                  </div>

                  {/* Step 2: Quick Test Batch */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Quick Test</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-0.5">Load Verified Demo Batch</h4>
                      <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                        Quickly test batch enrollment by loading pre-verified student records into the preview table below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadSampleBatch}
                      className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load 2 Demo Records</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: File Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileSpreadsheet className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                <p className="font-bold text-slate-700">
                  {importFileName ? importFileName : 'Click to upload or drag & drop CSV file'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports UTF-8 CSV files (auto-detects fresh admissions vs existing student records)
                </p>
              </div>

              {/* Import Preview Table */}
              {importedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ready to Import ({importedPreview.length} Records)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImportedPreview([]);
                        setImportFileName('');
                      }}
                      className="text-rose-600 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Clear Preview
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold text-[11px]">
                        <tr>
                          <th className="px-3 py-2 border-b border-slate-200">Roll</th>
                          <th className="px-3 py-2 border-b border-slate-200">Student Name</th>
                          <th className="px-3 py-2 border-b border-slate-200">Intake Type</th>
                          <th className="px-3 py-2 border-b border-slate-200">Standard / Sem</th>
                          <th className="px-3 py-2 border-b border-slate-200">GR & PRN</th>
                          <th className="px-3 py-2 border-b border-slate-200">Parent</th>
                          <th className="px-3 py-2 border-b border-slate-200">Fee Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {importedPreview.map((stu, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-mono font-bold text-slate-700">{stu.rollNo}</td>
                            <td className="px-3 py-2 font-bold text-slate-900">{stu.name}</td>
                            <td className="px-3 py-2">
                              {stu.isExistingStudent || stu.admissionType === 'Existing' ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  🏛️ Existing ({stu.originalAdmissionYear || 'Enrolled'})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ✨ Fresh 26-27
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{stu.gradeOrSemester}</td>
                            <td className="px-3 py-2 font-mono text-[10px] text-slate-700">
                              {stu.grNumber || 'Auto-generate'}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{stu.parentName}</td>
                            <td className="px-3 py-2 font-bold text-slate-800">₹{Number(stu.feeTotal || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportedPreview([]);
                  setImportFileName('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={importedPreview.length === 0}
                onClick={handleConfirmImport}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  importedPreview.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Confirm & Import ({importedPreview.length}) Records</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Student Admission & Historical Existing Student Enrollment */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                {admissionMode === 'EXISTING' || newStudent.admissionType === 'Existing' ? (
                  <>
                    <History className="w-5 h-5 text-blue-600" />
                    <span>Enroll Existing / Continuing Student</span>
                  </>
                ) : admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral' ? (
                  <>
                    <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                    <span>Transfer Student Admission (Rule 17 LC)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-orange-600" />
                    <span>New Student Admission & Identity Form</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowAdmissionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Mode Switcher (Fresh vs Transfer vs Existing) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl my-3">
              <button
                type="button"
                onClick={() => {
                  setAdmissionMode('FRESH');
                  setNewStudent((prev) => ({ ...prev, isExistingStudent: false, admissionType: 'Fresh' }));
                }}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  admissionMode === 'FRESH' && newStudent.admissionType !== 'Transfer' && newStudent.admissionType !== 'Existing'
                    ? 'bg-white text-orange-700 shadow-xs border border-orange-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Fresh (No LC)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdmissionMode('TRANSFER');
                  setNewStudent((prev) => ({ ...prev, isExistingStudent: false, admissionType: 'Transfer' }));
                }}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral'
                    ? 'bg-amber-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Transfer (LC / TC)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdmissionMode('EXISTING');
                  setNewStudent((prev) => ({ ...prev, isExistingStudent: true, admissionType: 'Existing' }));
                }}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  admissionMode === 'EXISTING' || newStudent.admissionType === 'Existing'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Enroll Existing</span>
              </button>
            </div>

            {/* Fresh Admission Notice */}
            {(admissionMode === 'FRESH' && newStudent.admissionType !== 'Transfer' && newStudent.admissionType !== 'Lateral' && newStudent.admissionType !== 'Existing') && (
              <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl mb-3 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Fresh Admission: Direct enrollment without prior school LC requirement.
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  No LC Needed
                </span>
              </div>
            )}

            {/* Kaksha Plus 23 Transfer Admission Banner */}
            {(admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral') && (
              <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                    Kaksha Plus 23 Transfer Admission Workflow
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    Rule 17 LC Required
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  For students transferring from another school or college. Leaving Certificate (LC / TC) details, previous standard, leaving date and conduct will be recorded into General Register.
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={handleFillTransferPreset}
                    className="text-[10px] font-bold bg-white text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    ⚡ Preset: Transfer Std 10 (LC from Barshi)
                  </button>
                </div>
              </div>
            )}

            {/* Historical Continuity Banner for Existing Students */}
            {(admissionMode === 'EXISTING' || newStudent.admissionType === 'Existing') && (
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                    Historical Continuing Student Onboarding
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                    Continuing Scholar
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Enter student already studying in Modern Public School or Modern College of Hotel Management with their permanent GR number and prior year academic history.
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={handleFillSchoolPreset}
                    className="text-[10px] font-bold bg-white text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    ⚡ Preset: School Std 8 (Admitted 2022)
                  </button>
                  <button
                    type="button"
                    onClick={handleFillCollegePreset}
                    className="text-[10px] font-bold bg-white text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    ⚡ Preset: College Sem 4 (Admitted 2024)
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateAdmission} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Target Institution</label>
                <select
                  value={newStudent.branchId}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      branchId: e.target.value,
                      gradeOrSemester: e.target.value === 'branch-sch-01' ? 'Class 1-A' : 'B.Sc H&HA Semester 1',
                      feeTotal: e.target.value === 'branch-sch-01' ? 36000 : 75000,
                    })
                  }
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="branch-sch-01">Modern Public School And Junior College Bhose (K-12 & Jr College)</option>
                  <option value="branch-hm-01">Modern College Of Hotel Management And Technology Solapur</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-600">Full Student Name (English) *</label>
                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    ⚡ Auto-translates to Marathi
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Vaishnavi Vishnu Itape"
                  value={newStudent.name}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    setNewStudent((prev) => ({
                      ...prev,
                      name: nameVal,
                      nameMarathi: transliterateToMarathi(nameVal),
                    }));
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData('text');
                    if (pasted) {
                      const target = e.target as HTMLInputElement;
                      const start = target.selectionStart ?? 0;
                      const end = target.selectionEnd ?? 0;
                      const currentVal = target.value;
                      const updatedVal = currentVal.substring(0, start) + pasted + currentVal.substring(end);
                      setNewStudent((prev) => ({
                        ...prev,
                        name: updatedVal,
                        nameMarathi: transliterateToMarathi(updatedVal),
                      }));
                    }
                  }}
                  className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <MarathiKeypadInput
                  label="विद्यार्थ्याचे नाव मराठीत (Devanagari Name - LC / Bonafide साठी)"
                  value={newStudent.nameMarathi || ''}
                  onChange={(val) => setNewStudent({ ...newStudent, nameMarathi: val })}
                  placeholder="उदा. वैष्णवी विष्णू इटपे..."
                  helperText="Phonetic transliteration or click ⌨️ for full Indian Devanagari Keypad"
                  quickWords={['पाटील', 'देशमुख', 'शिंदे', 'जाधव', 'पवार', 'कुलकर्णी', 'कदम', 'चव्हाण', 'गायकवाड', 'इटपे']}
                />
              </div>

              {/* Dedicated Existing Student Historical Identifiers */}
              {admissionMode === 'EXISTING' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Session Admitted</label>
                    <select
                      value={newStudent.originalAdmissionYear || '2023-2024'}
                      onChange={(e) => setNewStudent({ ...newStudent, originalAdmissionYear: e.target.value })}
                      className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    >
                      <option value="2025-2026">2025-2026 (1 Year Prior)</option>
                      <option value="2024-2025">2024-2025 (2 Years Prior)</option>
                      <option value="2023-2024">2023-2024 (3 Years Prior)</option>
                      <option value="2022-2023">2022-2023 (4 Years Prior)</option>
                      <option value="2021-2022">2021-2022 (5 Years Prior)</option>
                      <option value="2020-2021">2020-2021 or Earlier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Existing G.R. Number (Book)</label>
                    <input
                      type="text"
                      placeholder="e.g. GR-2022-0418"
                      value={newStudent.grNumber || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, grNumber: e.target.value })}
                      className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">University / Board PRN No.</label>
                    <input
                      type="text"
                      placeholder="e.g. PRN-2022-0941"
                      value={newStudent.prnNumber || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, prnNumber: e.target.value })}
                      className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Previous Class / Sem Passed</label>
                    <input
                      type="text"
                      placeholder="e.g. Class 7-A / Sem 3"
                      value={newStudent.previousClassOrSem || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, previousClassOrSem: e.target.value })}
                      className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Previous Year % / CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 88.5"
                      value={newStudent.previousYearPercentage || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, previousYearPercentage: Number(e.target.value) })}
                      className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Opening Arrears Balance (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newStudent.openingFeeBalance || 0}
                      onChange={(e) => setNewStudent({ ...newStudent, openingFeeBalance: Number(e.target.value) })}
                      className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Aadhaar Card Number Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">12-Digit Aadhaar Card No</label>
                  <input
                    type="text"
                    placeholder="9823-4412-8801"
                    value={newStudent.aadhaarNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, aadhaarNumber: e.target.value })}
                    className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Student Role Tag</label>
                  <select
                    value={newStudent.roleTag}
                    onChange={(e) => setNewStudent({ ...newStudent, roleTag: e.target.value })}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    <option value="STUDENT">Student (Regular)</option>
                    <option value="PREFECT">Prefect / Class Rep</option>
                    <option value="INTERN">Hospitality Intern</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    {newStudent.branchId === 'branch-sch-01' ? 'Current Standard / Class' : 'Current Degree Course & Semester'}
                  </label>
                  <select
                    value={newStudent.gradeOrSemester}
                    onChange={(e) => {
                      const selectedStd = MasterStore.getStandards().find((s) => s.name === e.target.value);
                      setNewStudent({
                        ...newStudent,
                        gradeOrSemester: e.target.value,
                        feeTotal: selectedStd ? selectedStd.annualFeeEstimate : newStudent.feeTotal,
                      });
                    }}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                    required
                  >
                    {MasterStore.getStandards()
                      .filter((s) => s.branchScope === (newStudent.branchId === 'branch-sch-01' ? 'SCHOOL' : 'COLLEGE'))
                      .map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} [ID: {s.id}]
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Admission Type *</label>
                  <select
                    value={newStudent.admissionType || (admissionMode === 'TRANSFER' ? 'Transfer' : admissionMode === 'EXISTING' ? 'Existing' : 'Fresh')}
                    onChange={(e) => {
                      const val = e.target.value as 'Fresh' | 'Transfer' | 'Existing' | 'Lateral';
                      const isTransfer = val === 'Transfer' || val === 'Lateral';
                      const isExisting = val === 'Existing';
                      setNewStudent((prev) => ({
                        ...prev,
                        admissionType: val,
                        isExistingStudent: isExisting,
                      }));
                      if (isTransfer) {
                        setAdmissionMode('TRANSFER');
                      } else if (isExisting) {
                        setAdmissionMode('EXISTING');
                      } else {
                        setAdmissionMode('FRESH');
                      }
                    }}
                    className={`w-full font-bold px-3 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      newStudent.admissionType === 'Transfer' || admissionMode === 'TRANSFER'
                        ? 'border-amber-400 bg-amber-50 text-amber-900 ring-amber-500 font-extrabold'
                        : newStudent.admissionType === 'Existing' || admissionMode === 'EXISTING'
                        ? 'border-blue-400 bg-blue-50 text-blue-900 ring-blue-500 font-extrabold'
                        : 'border-slate-200 bg-slate-50 text-slate-800 ring-orange-500 font-bold'
                    }`}
                  >
                    <option value="Fresh">✨ Fresh Admission (No LC)</option>
                    <option value="Transfer">🏛️ Transfer Admission (Rule 17 LC / TC)</option>
                    <option value="Existing">📜 Existing Continuing Student</option>
                    <option value="Lateral">⚡ Lateral Entry (Direct Sem / Yr)</option>
                  </select>
                </div>
              </div>

              {/* Department / Specialization for College Admissions */}
              {newStudent.branchId === 'branch-hm-01' && (
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    College Department / Specialization (From Masters)
                  </label>
                  <select
                    value={newStudent.hotelSpecialization || 'Food Production & Bakery'}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, hotelSpecialization: e.target.value })
                    }
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    {MasterStore.getDepartments()
                      .filter((d) => d.branchScope === 'COLLEGE')
                      .map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} [ID: {d.id}]
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Previous School & Transfer LC Details (Kaksha Plus 23 SIS Compliance) */}
              {(admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral') && (
                <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                    <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      Previous School & Transfer LC Records (Kaksha Plus Standard)
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      Rule 17 LC Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Previous School *</label>
                      <input
                        type="text"
                        placeholder="e.g. Shri Shivaji Vidyalaya, Barshi"
                        value={newStudent.previousSchool || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, previousSchool: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required={admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral'}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Standard & Div. from which left *</label>
                      <input
                        type="text"
                        placeholder="e.g. Std 10 A"
                        value={newStudent.standardDivLeft || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, standardDivLeft: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required={admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral'}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Original LC / TC Serial No</label>
                      <input
                        type="text"
                        placeholder="e.g. LC-2026-0914"
                        value={newStudent.previousLcNumber || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, previousLcNumber: e.target.value })}
                        className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">School Leaving Date (dd-mm-yyyy) *</label>
                      <input
                        type="date"
                        value={newStudent.schoolLeavingDate || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, schoolLeavingDate: e.target.value })}
                        className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required={admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral'}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">LC Received Date (dd-mm-yyyy) *</label>
                      <input
                        type="date"
                        value={newStudent.lcReceivedDate || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, lcReceivedDate: e.target.value })}
                        className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required={admissionMode === 'TRANSFER' || newStudent.admissionType === 'Transfer' || newStudent.admissionType === 'Lateral'}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Reason for Leaving</label>
                      <input
                        type="text"
                        placeholder="Enter reason for leaving"
                        value={newStudent.reasonForLeaving || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, reasonForLeaving: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Migration University</label>
                      <input
                        type="text"
                        placeholder="e.g. Pune University"
                        value={newStudent.migrationUniversity || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, migrationUniversity: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Voluntary Subject Special</label>
                      <input
                        type="text"
                        placeholder="e.g. Physics"
                        value={newStudent.voluntarySubjectSpecial || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, voluntarySubjectSpecial: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-700">Progress in Studies</label>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {['Outstanding', 'Very Good', 'Good', 'Fair'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewStudent({ ...newStudent, previousProgress: p, progress: p })}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              newStudent.previousProgress === p
                                ? 'bg-amber-600 text-white'
                                : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Good"
                        value={newStudent.previousProgress || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, previousProgress: e.target.value, progress: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-700">Conduct & Character</label>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {['Exemplary', 'Very Good', 'Good', 'Satisfactory'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setNewStudent({ ...newStudent, previousConduct: c, conduct: c })}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              newStudent.previousConduct === c
                                ? 'bg-amber-600 text-white'
                                : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-50'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Good"
                        value={newStudent.previousConduct || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, previousConduct: e.target.value, conduct: e.target.value })}
                        className="w-full font-semibold px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Guardian Name"
                    value={newStudent.parentName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewStudent((prev) => ({
                        ...prev,
                        parentName: val,
                        fatherNameMarathi: !prev.fatherNameMarathi || prev.fatherNameMarathi === transliterateToMarathi(prev.parentName || '')
                          ? transliterateToMarathi(val)
                          : prev.fatherNameMarathi,
                      }));
                    }}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98000 00000"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MarathiKeypadInput
                  label="वडिलांचे नाव (मराठीत)"
                  value={newStudent.fatherNameMarathi || ''}
                  onChange={(val) => setNewStudent({ ...newStudent, fatherNameMarathi: val })}
                  placeholder="उदा. राजेश शिंदे..."
                  quickWords={['सुरेश', 'राजेश', 'सचिन', 'संजय', 'रमेश', 'महेश', 'अमोल']}
                />

                <MarathiKeypadInput
                  label="आईचे नाव (मराठीत)"
                  value={newStudent.motherNameMarathi || ''}
                  onChange={(val) => setNewStudent({ ...newStudent, motherNameMarathi: val })}
                  placeholder="उदा. सुनीता शिंदे..."
                  quickWords={['सुनीता', 'अनिता', 'कविता', 'शारदा', 'रेखा', 'लता', 'पूजा']}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Annual Fee (₹)</label>
                <input
                  type="number"
                  value={newStudent.feeTotal}
                  onChange={(e) => setNewStudent({ ...newStudent, feeTotal: Number(e.target.value) })}
                  className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`text-white font-extrabold px-5 py-2 rounded-xl shadow-md transition-all cursor-pointer ${
                    admissionMode === 'EXISTING'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : admissionMode === 'TRANSFER'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {admissionMode === 'EXISTING'
                    ? 'Confirm Existing Student Enrollment'
                    : admissionMode === 'TRANSFER'
                    ? 'Confirm Transfer Student Admission'
                    : 'Confirm Fresh Student Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Collect Fee for Specific Student */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                Collect Fee
              </h3>
              <button
                onClick={() => setShowFeeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePayFee} className="mt-4 space-y-3.5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs">
                <div className="font-bold text-slate-900">{showFeeModal.name}</div>
                <div className="text-slate-500">
                  {showFeeModal.gradeOrSemester} &bull; {showFeeModal.admissionNo}
                </div>
                <div className="text-rose-600 font-bold mt-1">
                  Pending Balance: ₹ {showFeeModal.feePending.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'CASH', 'CHEQUE'] as const).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`text-xs font-bold py-1.5 rounded-lg border transition-all ${
                        paymentMode === mode
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeeModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Fee Receipt Modal */}
      {viewingReceipt && (
        <PrintableFeeReceiptModal
          receipt={viewingReceipt}
          student={students.find((s) => s.id === viewingReceipt.studentId)}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {/* 7. Modal: Full Student Master 360° Profile Drawer */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    selectedStudentProfile.profilePhotoUrl ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={selectedStudentProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedStudentProfile.name}
                    </h3>
                    {selectedStudentProfile.nameMarathi && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-100 text-orange-900 border border-orange-300 font-serif">
                        {selectedStudentProfile.nameMarathi}
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Scholar
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Admission No: <strong className="text-orange-700">{selectedStudentProfile.admissionNo}</strong> &bull; Roll: <strong>{selectedStudentProfile.rollNo}</strong> &bull; Standard: <strong>{selectedStudentProfile.gradeOrSemester}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentProfile(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
              {/* Section 1: Personal Identity & Birth Information */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>1. Personal Identity & Birth Records</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">First Name</span>
                    <span className="font-extrabold text-slate-900">{selectedStudentProfile.firstName || selectedStudentProfile.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Last Name</span>
                    <span className="font-extrabold text-slate-900">{selectedStudentProfile.lastName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Gender</span>
                    <span className="font-bold text-slate-800">{selectedStudentProfile.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Blood Group</span>
                    <span className="font-extrabold text-rose-600">{selectedStudentProfile.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Date of Birth</span>
                    <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.dob || '2013-07-30'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">DOB in Words</span>
                    <span className="font-bold text-orange-700">{selectedStudentProfile.dobWords || 'Thirty July Two Thousand Thirteen'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Place of Birth</span>
                    <span className="font-bold text-slate-800">{selectedStudentProfile.placeOfBirth || 'Hinjawadi'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Mother Tongue</span>
                    <span className="font-bold text-slate-800">{selectedStudentProfile.motherTongue || 'Marathi'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Nationality</span>
                    <span className="font-bold text-slate-800">{selectedStudentProfile.nationality || 'India'}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 block text-[10px] font-bold uppercase">नाव (मराठीत)</span>
                    <span className="font-bold text-orange-950 font-serif">{selectedStudentProfile.nameMarathi || '—'}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 block text-[10px] font-bold uppercase">वडिलांचे नाव (मराठीत)</span>
                    <span className="font-bold text-orange-950 font-serif">{selectedStudentProfile.fatherNameMarathi || '—'}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 block text-[10px] font-bold uppercase">आईचे नाव (मराठीत)</span>
                    <span className="font-bold text-orange-950 font-serif">{selectedStudentProfile.motherNameMarathi || '—'}</span>
                  </div>
                  <div>
                    <span className="text-orange-700 block text-[10px] font-bold uppercase">जन्मस्थळ (मराठीत)</span>
                    <span className="font-bold text-orange-950 font-serif">{selectedStudentProfile.placeOfBirthMarathi || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Statutory Enrollment & Government Identifiers */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>2. Statutory Government & Education Department Registration IDs</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Admission No</span>
                    <span className="font-mono font-extrabold text-orange-700">{selectedStudentProfile.admissionNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">General Reg. (G.R. No.)</span>
                    <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.grNumber || 'GR-2026-000285'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">PRN Number</span>
                    <span className="font-mono text-slate-800 font-semibold">{selectedStudentProfile.prnNumber || 'PRN-2026-00285'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">PEN Number (UDISE+)</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedStudentProfile.penNumber || 'PEN-MH-2026-99120'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">SARAL ID (State Portal)</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedStudentProfile.saralId || 'SARAL-2725120042'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Admission Type</span>
                    <span className="font-semibold text-slate-800">
                      {selectedStudentProfile.admissionType === 'Transfer'
                        ? '🏛️ Transfer Admission (Rule 17 LC)'
                        : selectedStudentProfile.admissionType === 'Existing' || selectedStudentProfile.isExistingStudent
                        ? '🏛️ Existing / Continuing Student'
                        : selectedStudentProfile.admissionType || '✨ Fresh Admission'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Admission Date / Year</span>
                    <span className="font-mono text-slate-800">
                      {selectedStudentProfile.originalAdmissionYear || selectedStudentProfile.admissionDate || '2026-06-10'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Roll No & Section</span>
                    <span className="font-bold text-slate-900">{selectedStudentProfile.rollNo} ({selectedStudentProfile.division || 'Division A'})</span>
                  </div>
                </div>
              </div>

              {/* Historical & Continuing Student Record Card if Existing */}
              {(selectedStudentProfile.isExistingStudent || selectedStudentProfile.admissionType === 'Existing') && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      <span>Historical Academic & Continuity Onboarding Record</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Continuing Scholar
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-blue-500 block text-[10px] font-bold uppercase">Original Intake Session</span>
                      <span className="font-bold text-blue-950">{selectedStudentProfile.originalAdmissionYear || '2023-2024'}</span>
                    </div>
                    <div>
                      <span className="text-blue-500 block text-[10px] font-bold uppercase">Previous Class / Sem</span>
                      <span className="font-bold text-blue-950">{selectedStudentProfile.previousClassOrSem || 'Previous Standard (Passed)'}</span>
                    </div>
                    <div>
                      <span className="text-blue-500 block text-[10px] font-bold uppercase">Previous Academic % / GPA</span>
                      <span className="font-bold text-emerald-700">{selectedStudentProfile.previousYearPercentage || 85}%</span>
                    </div>
                    <div>
                      <span className="text-blue-500 block text-[10px] font-bold uppercase">Legacy Onboarding Source</span>
                      <span className="font-bold text-blue-950">{selectedStudentProfile.legacyEnrollmentSource || 'OLD_GR_REGISTER'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous School Transfer & Leaving Certificate (LC / TC) Record if Transfer */}
              {(selectedStudentProfile.admissionType === 'Transfer' || selectedStudentProfile.admissionType === 'Lateral' || selectedStudentProfile.previousSchool) && (
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                      <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                      <span>Previous School Transfer & Leaving Certificate (LC / TC) Record</span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Rule 17 LC Compliance
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="sm:col-span-2">
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Previous School / College</span>
                      <span className="font-bold text-slate-900">{selectedStudentProfile.previousSchool || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Standard & Div. Left</span>
                      <span className="font-bold text-slate-900">{selectedStudentProfile.standardDivLeft || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">School Leaving Date</span>
                      <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.schoolLeavingDate || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">LC Received Date</span>
                      <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.lcReceivedDate || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Original LC / TC Serial No</span>
                      <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.previousLcNumber || '—'}</span>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Reason for Leaving</span>
                      <span className="font-semibold text-slate-800">{selectedStudentProfile.reasonForLeaving || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Migration University / Board</span>
                      <span className="font-semibold text-slate-900">{selectedStudentProfile.migrationUniversity || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Voluntary Subject Special</span>
                      <span className="font-semibold text-slate-900">{selectedStudentProfile.voluntarySubjectSpecial || '—'}</span>
                    </div>
                    <div>
                      <span className="text-amber-800/80 block text-[10px] font-bold uppercase">Progress & Conduct</span>
                      <span className="font-bold text-slate-900">
                        {selectedStudentProfile.previousProgress || 'Good'} / {selectedStudentProfile.previousConduct || 'Good'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Parents & Contacts */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>3. Parents & Guardians Contact Roster</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Father's Name</span>
                    <span className="font-bold text-slate-900">{selectedStudentProfile.fatherName || 'Ali A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Mother's Name</span>
                    <span className="font-extrabold text-slate-900">{selectedStudentProfile.motherName || 'TARANUM'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Primary Guardian</span>
                    <span className="font-semibold text-slate-800">{selectedStudentProfile.parentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Parent Phone</span>
                    <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.parentPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Parent Email</span>
                    <span className="font-mono text-slate-800">{selectedStudentProfile.parentEmail || 'taranum.ali@gmail.com'}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Quota, Religion & Caste */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>4. Social Welfare Quota & Demographic Record</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Religion</span>
                    <span className="font-bold text-slate-900">{selectedStudentProfile.religion || 'Muslim'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Category</span>
                    <span className="font-bold text-orange-700">{selectedStudentProfile.category || 'GENERAL'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Caste</span>
                    <span className="font-semibold text-slate-800">{selectedStudentProfile.caste || 'Muslim / General'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Sub Category</span>
                    <span className="font-semibold text-slate-800">{selectedStudentProfile.subCategory || 'Sunni'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">UID / Aadhar No.</span>
                    <span className="font-mono font-bold text-slate-900">{selectedStudentProfile.aadhaarNumber || '9823-4412-8801'}</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Current & Permanent Addresses */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>5. Residential Addresses</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <div className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-orange-600" />
                      <span>Current Residential Address</span>
                    </div>
                    <div className="text-slate-700 leading-relaxed font-semibold">
                      {selectedStudentProfile.currentAddress?.street || 'S.No.160/1/2,Plot No.12'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {selectedStudentProfile.currentAddress?.area || 'Hinjawadi Phase 1'}, {selectedStudentProfile.currentAddress?.taluka || 'Pimpri-Chinchwad'}
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono">
                      {selectedStudentProfile.currentAddress?.district || 'Pune'}, {selectedStudentProfile.currentAddress?.state || 'Maharashtra'} - {selectedStudentProfile.currentAddress?.pincode || '416205'}
                    </div>
                  </div>

                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <div className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>Permanent Address (Same as Current)</span>
                    </div>
                    <div className="text-slate-700 leading-relaxed font-semibold">
                      {selectedStudentProfile.permanentAddress?.street || 'S.No.160/1/2,Plot No.12'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {selectedStudentProfile.permanentAddress?.area || 'Hinjawadi Phase 1'}, {selectedStudentProfile.permanentAddress?.taluka || 'Pimpri-Chinchwad'}
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono">
                      {selectedStudentProfile.permanentAddress?.district || 'Pune'}, {selectedStudentProfile.permanentAddress?.state || 'Maharashtra'} - {selectedStudentProfile.permanentAddress?.pincode || '416205'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Attached Documents & Vault Rack Location */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>6. Documents Submitted into Trust Vault Custody</span>
                </div>

                <div className="space-y-2">
                  {(selectedStudentProfile.submittedDocuments && selectedStudentProfile.submittedDocuments.length > 0
                    ? selectedStudentProfile.submittedDocuments
                    : [
                        { documentTitle: 'Original Birth Certificate (Gram Panchayat Hinjawadi)', documentCode: 'DOC-BIRTH', fileName: 'AAFAN_BirthCertificate_Hinjawadi.pdf', fileSize: '1.4 MB' },
                        { documentTitle: 'Original Previous School Leaving Certificate (L.C. / T.C.)', documentCode: 'DOC-LC', fileName: 'AAFAN_LC_TC_Primary.pdf', fileSize: '2.1 MB' },
                        { documentTitle: 'Previous Year Grade 7th Marksheet & Passing Certificate', documentCode: 'DOC-MARKS-7', fileName: 'AAFAN_Std7_Marksheet.pdf', fileSize: '1.8 MB' },
                        { documentTitle: 'Aadhaar Card Verified Photocopy (UIDAI Masked)', documentCode: 'DOC-AADHAAR', fileName: 'AAFAN_Aadhaar_UIDAI.pdf', fileSize: '950 KB' },
                        { documentTitle: 'Domicile & Nationality Certificate (State of Maharashtra)', documentCode: 'DOC-DOMICILE', fileName: 'AAFAN_Domicile_MH.pdf', fileSize: '1.1 MB' },
                        { documentTitle: 'Medical Fitness & Blood Group Certificate', documentCode: 'DOC-MED-FIT', fileName: 'AAFAN_MedicalFitness.pdf', fileSize: '820 KB' },
                        { documentTitle: 'Passport Size Photographs (4 Copies)', documentCode: 'DOC-PHOTO', fileName: 'AAFAN_Photo_Formal.jpg', fileSize: '450 KB' },
                      ]
                  ).map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{doc.documentTitle}</span>
                          <span className="ml-2 font-mono text-[10px] text-orange-700 bg-orange-100/70 px-1.5 py-0.2 rounded font-bold">
                            {doc.documentCode}
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-700 font-bold">
                        {doc.fileName} <span className="text-slate-400 font-normal">({doc.fileSize || 'Verified'})</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vault Location Barcode */}
                <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200 flex items-center justify-between text-xs text-orange-950 font-bold">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-orange-600" />
                    <span>Physical Vault Allocation: Fireproof Cupboard C-01 &bull; Shelf 2</span>
                  </div>
                  <div className="font-mono text-orange-800">
                    Rack: <strong>{selectedStudentProfile.rackCode || 'C1-S2-SCH'}</strong> &bull; Folder: <strong>{selectedStudentProfile.folderNumber || 'FL-2026-000285'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500">
                Statutory Student Master Ledger Archive &bull; Zep Foundation Bhose
              </span>
              <div className="flex items-center gap-2">
                {selectedStudentProfile.feePaid > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const isSchoolBranch = selectedStudentProfile.branchId === 'branch-sch-01';
                      const rcp: FeeReceipt = {
                        id: `rcp-prof-${selectedStudentProfile.id}`,
                        receiptNo: `RCP-${isSchoolBranch ? 'SCH' : 'HM'}-2026-${selectedStudentProfile.admissionNo.replace(/\D/g, '').slice(-3) || '101'}`,
                        studentId: selectedStudentProfile.id,
                        studentName: selectedStudentProfile.name,
                        studentNameMarathi: selectedStudentProfile.nameMarathi,
                        branchName: isSchoolBranch
                          ? 'Modern Public School And Junior College Bhose'
                          : 'Modern College Of Hotel Management And Technology Solapur',
                        standardOrGrade: selectedStudentProfile.gradeOrSemester,
                        division: selectedStudentProfile.division || 'A',
                        rollNo: selectedStudentProfile.rollNo,
                        admissionNo: selectedStudentProfile.admissionNo,
                        grNumber: selectedStudentProfile.grNumber,
                        academicYear: '2026-2027',
                        parentName: selectedStudentProfile.parentName || selectedStudentProfile.fatherName,
                        parentPhone: selectedStudentProfile.parentPhone,
                        category: selectedStudentProfile.category || 'General',
                        amount: selectedStudentProfile.feePaid,
                        totalAnnualFee: selectedStudentProfile.feeTotal,
                        previouslyPaid: 0,
                        remainingBalance: selectedStudentProfile.feePending,
                        paymentMode: 'UPI',
                        date: new Date().toISOString().split('T')[0],
                        installmentNo: 'Installment 1 & 2',
                        feeBreakdown: generateFeeBreakdown(selectedStudentProfile.feePaid, isSchoolBranch ? 'SCHOOL' : 'COLLEGE'),
                        status: 'PAID',
                      };
                      setViewingReceipt(rcp);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-600" />
                    <span>Official Fee Receipt</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIdCardModalStudent(selectedStudentProfile);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <IdCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Print ID Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const stu = selectedStudentProfile;
                    setSelectedStudentProfile(null);
                    setEditingStudent({ ...stu });
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-amber-50 hover:text-amber-700 border border-slate-300 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-600" />
                  <span>Edit Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const stu = selectedStudentProfile;
                    setSelectedStudentProfile(null);
                    setDeletingStudent(stu);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentProfile(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-xs cursor-pointer"
                >
                  Close Master View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal: Edit Student Record */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col animate-scale-in overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Edit Student Master: {editingStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll: {editingStudent.rollNo} &bull; Adm: {editingStudent.admissionNo} &bull; Standard: {editingStudent.gradeOrSemester}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <User className="w-3.5 h-3.5" /> 1. Personal & Identity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Student Name *</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingStudent((prev) => {
                          if (!prev) return prev;
                          const shouldSyncMarathi = !prev.nameMarathi || prev.nameMarathi === transliterateToMarathi(prev.name || '');
                          return {
                            ...prev,
                            name: val,
                            nameMarathi: shouldSyncMarathi ? transliterateToMarathi(val) : prev.nameMarathi,
                          };
                        });
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted) {
                          const target = e.target as HTMLInputElement;
                          const start = target.selectionStart ?? 0;
                          const end = target.selectionEnd ?? 0;
                          const currentVal = target.value;
                          const updatedVal = currentVal.substring(0, start) + pasted + currentVal.substring(end);
                          setEditingStudent((prev) => {
                            if (!prev) return prev;
                            const shouldSyncMarathi = !prev.nameMarathi || prev.nameMarathi === transliterateToMarathi(prev.name || '');
                            return {
                              ...prev,
                              name: updatedVal,
                              nameMarathi: shouldSyncMarathi ? transliterateToMarathi(updatedVal) : prev.nameMarathi,
                            };
                          });
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">First Name</label>
                    <input
                      type="text"
                      value={editingStudent.firstName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editingStudent.lastName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender *</label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editingStudent.dob || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      value={editingStudent.placeOfBirth || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, placeOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={editingStudent.bloodGroup || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mother Tongue</label>
                    <input
                      type="text"
                      value={editingStudent.motherTongue || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, motherTongue: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">UID / Aadhaar Number</label>
                    <input
                      type="text"
                      value={editingStudent.aadhaarNumber || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, aadhaarNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Academic & Government Enrollment */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <School className="w-3.5 h-3.5" /> 2. Academic Enrollment & Statutory IDs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Standard / Course *</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.gradeOrSemester}
                      onChange={(e) => setEditingStudent({ ...editingStudent, gradeOrSemester: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Division / Section</label>
                    <input
                      type="text"
                      value={editingStudent.division || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, division: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Roll Number *</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.rollNo}
                      onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Admission No</label>
                    <input
                      type="text"
                      value={editingStudent.admissionNo}
                      onChange={(e) => setEditingStudent({ ...editingStudent, admissionNo: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">General Register (G.R.) No</label>
                    <input
                      type="text"
                      value={editingStudent.grNumber || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, grNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">SARAL ID (State)</label>
                    <input
                      type="text"
                      value={editingStudent.saralId || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, saralId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Admission Type</label>
                    <select
                      value={editingStudent.admissionType || 'Fresh'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setEditingStudent({
                          ...editingStudent,
                          admissionType: val,
                          isExistingStudent: val === 'Existing',
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500 font-bold"
                    >
                      <option value="Fresh">✨ Fresh Admission (No LC)</option>
                      <option value="Transfer">🏛️ Transfer Admission (Rule 17 LC)</option>
                      <option value="Existing">📜 Existing Continuing Student</option>
                      <option value="Lateral">⚡ Lateral Entry</option>
                    </select>
                  </div>
                </div>

                {/* Transfer Leaving Certificate (LC / TC) Details if Transfer */}
                {(editingStudent.admissionType === 'Transfer' || editingStudent.admissionType === 'Lateral' || editingStudent.previousSchool) && (
                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-3 mt-3">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                      <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        Previous School & Transfer LC Records (Kaksha Plus Standard)
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                        Rule 17 LC Required
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Previous School</label>
                        <input
                          type="text"
                          placeholder="e.g. Shri Shivaji Vidyalaya, Barshi"
                          value={editingStudent.previousSchool || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, previousSchool: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Standard & Div. from which left</label>
                        <input
                          type="text"
                          placeholder="e.g. Std 10 A"
                          value={editingStudent.standardDivLeft || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, standardDivLeft: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Original LC / TC Serial No</label>
                        <input
                          type="text"
                          placeholder="e.g. LC-2026-0914"
                          value={editingStudent.previousLcNumber || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, previousLcNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">School Leaving Date (dd-mm-yyyy)</label>
                        <input
                          type="date"
                          value={editingStudent.schoolLeavingDate || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, schoolLeavingDate: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">LC Received Date (dd-mm-yyyy)</label>
                        <input
                          type="date"
                          value={editingStudent.lcReceivedDate || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, lcReceivedDate: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Reason for Leaving</label>
                        <input
                          type="text"
                          placeholder="Enter reason for leaving"
                          value={editingStudent.reasonForLeaving || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, reasonForLeaving: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Migration University</label>
                        <input
                          type="text"
                          placeholder="e.g. Pune University"
                          value={editingStudent.migrationUniversity || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, migrationUniversity: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Voluntary Subject Special</label>
                        <input
                          type="text"
                          placeholder="e.g. Physics"
                          value={editingStudent.voluntarySubjectSpecial || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, voluntarySubjectSpecial: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-slate-700">Progress in Studies</label>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {['Outstanding', 'Very Good', 'Good', 'Fair'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setEditingStudent({ ...editingStudent, previousProgress: p, progress: p })}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                (editingStudent.previousProgress || editingStudent.progress) === p
                                  ? 'bg-amber-600 text-white font-extrabold'
                                  : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-50'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Good"
                          value={editingStudent.previousProgress || editingStudent.progress || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, previousProgress: e.target.value, progress: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-slate-700">Conduct & Character</label>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {['Exemplary', 'Very Good', 'Good', 'Satisfactory'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setEditingStudent({ ...editingStudent, previousConduct: c, conduct: c })}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                (editingStudent.previousConduct || editingStudent.conduct) === c
                                  ? 'bg-amber-600 text-white font-extrabold'
                                  : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-50'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Good"
                          value={editingStudent.previousConduct || editingStudent.conduct || ''}
                          onChange={(e) => setEditingStudent({ ...editingStudent, previousConduct: e.target.value, conduct: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Parents & Contacts */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <Phone className="w-3.5 h-3.5" /> 3. Parents & Guardians
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={editingStudent.fatherName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={editingStudent.motherName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Parent Phone *</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.parentPhone}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Marathi / Devanagari Record (For LC & Bonafide) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <Languages className="w-3.5 h-3.5" /> 4. वैधानिक मराठी नोंद (Statutory Marathi Record - LC & Bonafide)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MarathiKeypadInput
                    label="विद्यार्थ्याचे नाव (मराठीत)"
                    value={editingStudent.nameMarathi || ''}
                    onChange={(val) => setEditingStudent({ ...editingStudent, nameMarathi: val })}
                    placeholder="उदा. आरव पाटील..."
                    quickWords={['पाटील', 'देशमुख', 'शिंदे', 'जाधव', 'पवार', 'कुलकर्णी', 'कदम', 'चव्हाण']}
                  />

                  <MarathiKeypadInput
                    label="जन्मस्थळ (मराठीत)"
                    value={editingStudent.placeOfBirthMarathi || ''}
                    onChange={(val) => setEditingStudent({ ...editingStudent, placeOfBirthMarathi: val })}
                    placeholder="उदा. सोलापूर / पुणे..."
                    quickWords={['सोलापूर', 'पुणे', 'मुंबई', 'पंढरपूर', 'कोल्हापूर', 'सातारा']}
                  />

                  <MarathiKeypadInput
                    label="वडिलांचे नाव (मराठीत)"
                    value={editingStudent.fatherNameMarathi || ''}
                    onChange={(val) => setEditingStudent({ ...editingStudent, fatherNameMarathi: val })}
                    placeholder="उदा. सुरेश पाटील..."
                    quickWords={['सुरेश', 'राजेश', 'सचिन', 'संजय', 'रमेश', 'महेश']}
                  />

                  <MarathiKeypadInput
                    label="आईचे नाव (मराठीत)"
                    value={editingStudent.motherNameMarathi || ''}
                    onChange={(val) => setEditingStudent({ ...editingStudent, motherNameMarathi: val })}
                    placeholder="उदा. सुनीता पाटील..."
                    quickWords={['सुनीता', 'अनिता', 'कविता', 'शारदा', 'रेखा', 'लता']}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <MapPin className="w-3.5 h-3.5" /> 4. Current Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Street / House No</label>
                    <input
                      type="text"
                      value={editingStudent.currentAddress?.street || ''}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          currentAddress: {
                            ...(editingStudent.currentAddress || {
                              street: '',
                              area: '',
                              taluka: '',
                              district: '',
                              state: '',
                              country: 'India',
                              pincode: '',
                            }),
                            street: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Area / Locality</label>
                    <input
                      type="text"
                      value={editingStudent.currentAddress?.area || ''}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          currentAddress: {
                            ...(editingStudent.currentAddress || {
                              street: '',
                              area: '',
                              taluka: '',
                              district: '',
                              state: '',
                              country: 'India',
                              pincode: '',
                            }),
                            area: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Taluka / Tehsil</label>
                    <input
                      type="text"
                      value={editingStudent.currentAddress?.taluka || ''}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          currentAddress: {
                            ...(editingStudent.currentAddress || {
                              street: '',
                              area: '',
                              taluka: '',
                              district: '',
                              state: '',
                              country: 'India',
                              pincode: '',
                            }),
                            taluka: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
                    <input
                      type="text"
                      value={editingStudent.currentAddress?.district || ''}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          currentAddress: {
                            ...(editingStudent.currentAddress || {
                              street: '',
                              area: '',
                              taluka: '',
                              district: '',
                              state: '',
                              country: 'India',
                              pincode: '',
                            }),
                            district: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editingStudent.currentAddress?.pincode || ''}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          currentAddress: {
                            ...(editingStudent.currentAddress || {
                              street: '',
                              area: '',
                              taluka: '',
                              district: '',
                              state: '',
                              country: 'India',
                              pincode: '',
                            }),
                            pincode: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Financials & Status */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <CreditCard className="w-3.5 h-3.5" /> 5. Fees & Account Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Annual Fee (₹)</label>
                    <input
                      type="number"
                      value={editingStudent.feeTotal}
                      onChange={(e) => {
                        const total = Number(e.target.value) || 0;
                        setEditingStudent({
                          ...editingStudent,
                          feeTotal: total,
                          feePending: Math.max(0, total - editingStudent.feePaid),
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Fee Paid to Date (₹)</label>
                    <input
                      type="number"
                      value={editingStudent.feePaid}
                      onChange={(e) => {
                        const paid = Number(e.target.value) || 0;
                        setEditingStudent({
                          ...editingStudent,
                          feePaid: paid,
                          feePending: Math.max(0, editingStudent.feeTotal - paid),
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-emerald-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pending Balance (₹)</label>
                    <input
                      type="number"
                      disabled
                      value={editingStudent.feePending}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-rose-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Student Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Modal: Delete Student Confirmation */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Student Record</h3>
                <p className="text-xs text-slate-500">Confirm permanent removal from active rosters</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm">{deletingStudent.name}</div>
              <div className="text-slate-600">
                Roll No: <strong>{deletingStudent.rollNo}</strong> &bull; Standard: <strong>{deletingStudent.gradeOrSemester}</strong>
              </div>
              <div className="text-slate-600">
                Admission No: <strong className="font-mono">{deletingStudent.admissionNo}</strong>
              </div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                ⚠️ Warning: This will delete this student's profile, attendance records, and active ledger entries.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStudentDelete}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Printable ID Card Modal */}
      {idCardModalStudent && (
        <IdCardModal
          cardData={studentToCardData(idCardModalStudent)}
          isOpen={true}
          onClose={() => setIdCardModalStudent(null)}
          onPhotoUpdated={(studentId, newUrl) => {
            if (onEditStudent) {
              onEditStudent({ ...idCardModalStudent, profilePhotoUrl: newUrl });
            }
          }}
        />
      )}
    </div>
  );
};
