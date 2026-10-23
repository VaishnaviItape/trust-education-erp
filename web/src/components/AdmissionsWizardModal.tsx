import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Users,
  ShieldCheck,
  GraduationCap,
  FileText,
  CreditCard,
  Award,
  Sparkles,
  Layers,
  Building,
  Upload,
  Check,
  FileCheck,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Home,
  Shield,
  Clock,
  Zap,
} from 'lucide-react';
import { MasterStore } from '../utils/masterData';
import { formatDobInWords } from '../utils/documentUtils';

interface AdmissionsWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdmitted: (studentData: any) => void;
}

export const AdmissionsWizardModal: React.FC<AdmissionsWizardModalProps> = ({
  isOpen,
  onClose,
  onStudentAdmitted,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(true);

  // Form state across 6 comprehensive tabs matching statutory Student Master requirements
  const [formData, setFormData] = useState({
    // Step 1: Student Identity & Profile
    profilePhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    firstName: 'AAFAN ALI',
    lastName: 'A',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dob: '2013-07-30',
    dobWords: 'Thirty July Two Thousand Thirteen',
    placeOfBirth: 'Hinjawadi',
    bloodGroup: 'O+',
    religion: 'Muslim',
    caste: 'Muslim / General',
    subCategory: 'Sunni',
    category: 'GENERAL',
    aadhaarNumber: '9823-4412-8801',
    nationality: 'India',
    motherTongue: 'Marathi',

    // Step 2: Academic Enrollment & Statutory Identifiers
    targetBranch: 'branch-sch-01', // School or College
    standard: 'STD 8',
    division: 'Division A',
    admissionNo: 'ADM-2026-000285',
    rollNo: '01',
    admissionType: 'Fresh' as 'Fresh' | 'Transfer' | 'Lateral' | 'Re-admission',
    admissionDate: '2026-06-10',
    grNumber: 'GR-2026-000285',
    prnNumber: 'PRN-2026-00285',
    penNumber: 'PEN-MH-2026-99120',
    saralId: 'SARAL-2725120042',
    hotelSpecialization: '',

    // Step 3: Parents & Guardians
    fatherName: 'Ali A',
    motherName: 'TARANUM',
    parentName: 'Ali A & Taranum',
    parentPhone: '+91 98230 11999',
    parentEmail: 'taranum.ali@gmail.com',
    emergencyContact: '+91 98230 99887',

    // Step 4: Quota, Household & Demographics
    annualHouseholdIncome: '450000',
    domicileState: 'Maharashtra',

    // Step 5: Current & Permanent Address
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

    // Step 6: Documents Attachment & Vault Rack
    documents: [
      { id: 'doc-birth', title: 'Original Birth Certificate (Gram Panchayat / Municipal stamped)', code: 'DOC-BIRTH', isMandatory: true, submitted: true, fileName: 'AAFAN_BirthCertificate_Hinjawadi.pdf', fileSize: '1.4 MB' },
      { id: 'doc-lc', title: 'Original Previous School Leaving Certificate (L.C. / T.C.)', code: 'DOC-LC', isMandatory: true, submitted: true, fileName: 'AAFAN_LC_TC_Primary.pdf', fileSize: '2.1 MB' },
      { id: 'doc-marks', title: 'Previous Year Grade 7th Marksheet & Passing Certificate', code: 'DOC-MARKS-7', isMandatory: true, submitted: true, fileName: 'AAFAN_Std7_Marksheet.pdf', fileSize: '1.8 MB' },
      { id: 'doc-aadhaar', title: 'Aadhaar Card Verified Photocopy (UIDAI QR-Verified)', code: 'DOC-AADHAAR', isMandatory: true, submitted: true, fileName: 'AAFAN_Aadhaar_UIDAI.pdf', fileSize: '950 KB' },
      { id: 'doc-domicile', title: 'Domicile & Nationality Certificate (State of Maharashtra)', code: 'DOC-DOMICILE', isMandatory: true, submitted: true, fileName: 'AAFAN_Domicile_MH.pdf', fileSize: '1.1 MB' },
      { id: 'doc-caste', title: 'Caste Certificate & Validity (Social Welfare Dept)', code: 'DOC-CASTE', isMandatory: false, submitted: false, fileName: '', fileSize: '' },
      { id: 'doc-med', title: 'Medical Fitness & Blood Group Certificate', code: 'DOC-MED-FIT', isMandatory: false, submitted: true, fileName: 'AAFAN_MedicalFitness.pdf', fileSize: '820 KB' },
      { id: 'doc-photo', title: 'Passport Size Photographs (4 Copies)', code: 'DOC-PHOTO', isMandatory: true, submitted: true, fileName: 'AAFAN_Photo_Formal.jpg', fileSize: '450 KB' },
    ],

    allocatedCupboard: 'C-01 (Fireproof Steel Archive)',
    allocatedShelf: 'Shelf 2',
    allocatedRackCode: 'C1-S2-SCH',
    folderIndexNumber: 'FL-2026-000285',

    // Financial Fees & Deposit
    feeStructureAnnual: 36000,
    transportOptIn: true,
    transportRoute: 'Route 1 - Hinjawadi to Bhose Campus',
    hostelOptIn: false,
    initialPaymentMode: 'UPI',
    initialDepositAmount: 12000,
  });

  if (!isOpen) return null;

  // Auto-generate DOB in words when date changes
  const handleDobChange = (dateValue: string) => {
    const words = formatDobInWords(dateValue) || 'Thirty July Two Thousand Thirteen';
    setFormData((prev) => ({
      ...prev,
      dob: dateValue,
      dobWords: words,
    }));
  };

  // Sync permanent address when "Same as Current Address" is checked
  const handleCurrentAddressChange = (field: string, val: string) => {
    setFormData((prev) => {
      const nextCurrent = { ...prev.currentAddress, [field]: val };
      const nextPermanent = sameAsCurrentAddress ? { ...nextCurrent } : prev.permanentAddress;
      return {
        ...prev,
        currentAddress: nextCurrent,
        permanentAddress: nextPermanent,
      };
    });
  };

  const handlePermanentAddressChange = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      permanentAddress: { ...prev.permanentAddress, [field]: val },
    }));
  };

  const toggleDocumentSubmission = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.id === docId
          ? {
              ...d,
              submitted: !d.submitted,
              fileName: !d.submitted ? `${formData.firstName || 'Student'}_${d.code}.pdf` : '',
              fileSize: !d.submitted ? '1.2 MB' : '',
            }
          : d
      ),
    }));
  };

  // Fill sample exact data requested by user
  const handleFillSampleAafan = () => {
    setFormData({
      profilePhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      firstName: 'AAFAN ALI',
      lastName: 'A',
      gender: 'MALE',
      dob: '2013-07-30',
      dobWords: 'Thirty July Two Thousand Thirteen',
      placeOfBirth: 'Hinjawadi',
      bloodGroup: 'O+',
      religion: 'Muslim',
      caste: 'Muslim / General',
      subCategory: 'Sunni',
      category: 'GENERAL',
      aadhaarNumber: '9823-4412-8801',
      nationality: 'India',
      motherTongue: 'Marathi',

      targetBranch: 'branch-sch-01',
      standard: 'STD 8',
      division: 'Division A',
      admissionNo: 'ADM-2026-000285',
      rollNo: '01',
      admissionType: 'Fresh',
      admissionDate: '2026-06-10',
      grNumber: 'GR-2026-000285',
      prnNumber: 'PRN-2026-00285',
      penNumber: 'PEN-MH-2026-99120',
      saralId: 'SARAL-2725120042',
      hotelSpecialization: '',

      fatherName: 'Ali A',
      motherName: 'TARANUM',
      parentName: 'Ali A & Taranum',
      parentPhone: '+91 98230 11999',
      parentEmail: 'taranum.ali@gmail.com',
      emergencyContact: '+91 98230 99887',

      annualHouseholdIncome: '450000',
      domicileState: 'Maharashtra',

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

      documents: [
        { id: 'doc-birth', title: 'Original Birth Certificate (Gram Panchayat / Municipal stamped)', code: 'DOC-BIRTH', isMandatory: true, submitted: true, fileName: 'AAFAN_BirthCertificate_Hinjawadi.pdf', fileSize: '1.4 MB' },
        { id: 'doc-lc', title: 'Original Previous School Leaving Certificate (L.C. / T.C.)', code: 'DOC-LC', isMandatory: true, submitted: true, fileName: 'AAFAN_LC_TC_Primary.pdf', fileSize: '2.1 MB' },
        { id: 'doc-marks', title: 'Previous Year Grade 7th Marksheet & Passing Certificate', code: 'DOC-MARKS-7', isMandatory: true, submitted: true, fileName: 'AAFAN_Std7_Marksheet.pdf', fileSize: '1.8 MB' },
        { id: 'doc-aadhaar', title: 'Aadhaar Card Verified Photocopy (UIDAI QR-Verified)', code: 'DOC-AADHAAR', isMandatory: true, submitted: true, fileName: 'AAFAN_Aadhaar_UIDAI.pdf', fileSize: '950 KB' },
        { id: 'doc-domicile', title: 'Domicile & Nationality Certificate (State of Maharashtra)', code: 'DOC-DOMICILE', isMandatory: true, submitted: true, fileName: 'AAFAN_Domicile_MH.pdf', fileSize: '1.1 MB' },
        { id: 'doc-caste', title: 'Caste Certificate & Validity (Social Welfare Dept)', code: 'DOC-CASTE', isMandatory: false, submitted: false, fileName: '', fileSize: '' },
        { id: 'doc-med', title: 'Medical Fitness & Blood Group Certificate', code: 'DOC-MED-FIT', isMandatory: false, submitted: true, fileName: 'AAFAN_MedicalFitness.pdf', fileSize: '820 KB' },
        { id: 'doc-photo', title: 'Passport Size Photographs (4 Copies)', code: 'DOC-PHOTO', isMandatory: true, submitted: true, fileName: 'AAFAN_Photo_Formal.jpg', fileSize: '450 KB' },
      ],

      allocatedCupboard: 'C-01 (Fireproof Steel Archive)',
      allocatedShelf: 'Shelf 2',
      allocatedRackCode: 'C1-S2-SCH',
      folderIndexNumber: 'FL-2026-000285',

      feeStructureAnnual: 36000,
      transportOptIn: true,
      transportRoute: 'Route 1 - Hinjawadi to Bhose Campus',
      hostelOptIn: false,
      initialPaymentMode: 'UPI',
      initialDepositAmount: 12000,
    });
  };

  const steps = [
    { number: 1, title: 'Personal Identity', icon: <User className="w-4 h-4" /> },
    { number: 2, title: 'Academic & IDs', icon: <GraduationCap className="w-4 h-4" /> },
    { number: 3, title: 'Parents & Contact', icon: <Users className="w-4 h-4" /> },
    { number: 4, title: 'Demographics & Quota', icon: <ShieldCheck className="w-4 h-4" /> },
    { number: 5, title: 'Current & Permanent Address', icon: <MapPin className="w-4 h-4" /> },
    { number: 6, title: 'Documents & Vault Rack', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleNext = () => {
    if (activeStep < 6) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isSchool = formData.targetBranch === 'branch-sch-01';
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'New Scholar';

    const payload = {
      name: fullName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      branchId: formData.targetBranch,
      gradeOrSemester: `${formData.standard} - ${formData.division.replace('Division ', '')}`,
      standard: formData.standard,
      division: formData.division,
      admissionNo: formData.admissionNo,
      rollNo: formData.rollNo,
      admissionType: formData.admissionType,
      admissionDate: formData.admissionDate,
      grNumber: formData.grNumber,
      prnNumber: formData.prnNumber || `PRN-${Date.now().toString().slice(-5)}`,
      penNumber: formData.penNumber,
      saralId: formData.saralId,
      parentName: formData.parentName || formData.fatherName || formData.motherName,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      religion: formData.religion,
      caste: formData.caste,
      subCategory: formData.subCategory,
      category: formData.category,
      bloodGroup: formData.bloodGroup,
      motherTongue: formData.motherTongue,
      placeOfBirth: formData.placeOfBirth,
      nationality: formData.nationality,
      dob: formData.dob,
      dobWords: formData.dobWords,
      profilePhotoUrl: formData.profilePhotoUrl,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      submittedDocuments: formData.documents.filter((d) => d.submitted),
      feeTotal: formData.feeStructureAnnual,
      feePaid: formData.initialDepositAmount,
      feePending: formData.feeStructureAnnual - formData.initialDepositAmount,
      hotelSpecialization: formData.hotelSpecialization,
      aadhaarNumber: formData.aadhaarNumber,
      aadhaarVerified: true,
      roleTag: isSchool ? 'STUDENT' : 'INTERN',
      kycStatus: 'VERIFIED',
      rackCode: formData.allocatedRackCode,
      folderNumber: formData.folderIndexNumber,
    };

    setTimeout(() => {
      onStudentAdmitted(payload);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header with Auto-fill Sample */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Student Master & Statutory Admission Intake</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  Step {activeStep} of 6
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Statutory student register with G.R. Number, SARAL/PEN, full address, and document vault inward
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillSampleAafan}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs transition-colors cursor-pointer"
              title="Auto-fill exact details for AAFAN ALI A"
            >
              <Zap className="w-3.5 h-3.5 text-orange-600" />
              <span>Fill Sample: AAFAN ALI A</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Step Progress Navigation */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
          {steps.map((s) => {
            const isCurrent = activeStep === s.number;
            const isCompleted = activeStep > s.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setActiveStep(s.number)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.icon}
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: PERSONAL IDENTITY & PROFILE */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                  1. Candidate Personal Identity & Birth Information
                </h3>
                <button
                  type="button"
                  onClick={handleFillSampleAafan}
                  className="sm:hidden text-xs text-orange-600 font-bold underline"
                >
                  Fill Sample
                </button>
              </div>

              {/* Profile Photo & Name Grid */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative group shrink-0">
                  <img
                    src={formData.profilePhotoUrl}
                    alt="Student Profile"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-xs bg-white"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer">
                    Change
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AAFAN ALI"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Gender, DOB, DOB in words, Place of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Place of Birth</label>
                  <input
                    type="text"
                    placeholder="e.g. Hinjawadi"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DOB in Words</label>
                <input
                  type="text"
                  placeholder="e.g. Thirty July Two Thousand Thirteen"
                  value={formData.dobWords}
                  onChange={(e) => setFormData({ ...formData, dobWords: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-orange-700 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Blood Group, Mother Tongue, Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    placeholder="e.g. Marathi"
                    value={formData.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC ENROLLMENT & STATUTORY IDENTIFIERS */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                2. Academic Placement, Admission Details & Statutory Identifiers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Institution Branch *
                  </label>
                  <select
                    value={formData.targetBranch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        targetBranch: val,
                        standard: val === 'branch-sch-01' ? 'STD 8' : 'B.Sc in Hospitality Studies - Semester 1',
                        feeStructureAnnual: val === 'branch-sch-01' ? 36000 : 75000,
                        allocatedRackCode: val === 'branch-sch-01' ? 'C1-S2-SCH' : 'C2-S1-HM',
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="branch-sch-01">Modern Public School And Junior College Bhose</option>
                    <option value="branch-hm-01">Modern College Of Hotel Management And Technology Solapur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard / Class *
                  </label>
                  <select
                    required
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    {MasterStore.getStandards()
                      .filter((s) => s.branchScope === (formData.targetBranch === 'branch-sch-01' ? 'SCHOOL' : 'COLLEGE'))
                      .map((s) => (
                        <option key={s.id} value={s.code === 'STD-8' ? 'STD 8' : s.name}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select an option</option>
                    <option value="Division A">Division A</option>
                    <option value="Division B">Division B</option>
                    <option value="Division C">Division C</option>
                    <option value="Division D">Division D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Type *</label>
                  <select
                    value={formData.admissionType}
                    onChange={(e) => setFormData({ ...formData, admissionType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Fresh">Fresh</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Lateral">Lateral Entry</option>
                    <option value="Re-admission">Re-admission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Admission No</label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-orange-700 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll No</label>
                  <input
                    type="text"
                    placeholder="01"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Statutory Registrations: G.R., PRN, PEN, SARAL ID */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-orange-600" />
                  <span>Statutory Government & Education Department Registration IDs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      General Reg. No. (G.R. No.)
                    </label>
                    <input
                      type="text"
                      placeholder="General Reg. No."
                      value={formData.grNumber}
                      onChange={(e) => setFormData({ ...formData, grNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      PRN Number (Permanent Registration No.)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank to auto-generate"
                      value={formData.prnNumber}
                      onChange={(e) => setFormData({ ...formData, prnNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      PEN Number (Central UDISE+ Govt of India)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter PEN Number"
                      value={formData.penNumber}
                      onChange={(e) => setFormData({ ...formData, penNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      SARAL ID (State Student Portal ID)
                    </label>
                    <input
                      type="text"
                      placeholder="State Student ID"
                      value={formData.saralId}
                      onChange={(e) => setFormData({ ...formData, saralId: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARENTS & GUARDIANS CONTACT */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                3. Parents, Legal Guardians & Communication Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    placeholder="Father's Name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mother's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TARANUM"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Parent Name"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="Parent Phone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    placeholder="Parent Email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Hotline Contact</label>
                <input
                  type="text"
                  placeholder="+91 98230 99887"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: DEMOGRAPHICS, RELIGION & CASTE QUOTA */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                4. Religion, Caste Category & Social Welfare Quota
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Religion</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select Religion</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Christian">Christian</option>
                    <option value="Jain">Jain</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Parsi">Parsi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select Category</option>
                    <option value="GENERAL">General / Open</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="VJNT">VJNT</option>
                    <option value="SBC">SBC</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="SEBC">SEBC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Caste</label>
                  <input
                    type="text"
                    placeholder="Select or enter Caste"
                    value={formData.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sub Category</label>
                  <input
                    type="text"
                    placeholder="Select Sub Category (e.g. Sunni / Kokani)"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UID / Aadhar No. (12 Digits)
                  </label>
                  <input
                    type="text"
                    placeholder="UID / Aadhar No."
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Household Income (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.annualHouseholdIncome}
                    onChange={(e) => setFormData({ ...formData, annualHouseholdIncome: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CURRENT & PERMANENT ADDRESS */}
          {activeStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                5. Residential Location & Address Verification
              </h3>

              {/* Current Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Home className="w-4 h-4 text-orange-600" />
                  <span>Current Residential Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S.No.160/1/2,Plot No.12"
                      value={formData.currentAddress.street}
                      onChange={(e) => handleCurrentAddressChange('street', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Area</label>
                    <input
                      type="text"
                      placeholder="Area"
                      value={formData.currentAddress.area}
                      onChange={(e) => handleCurrentAddressChange('area', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tehsil / Taluka</label>
                    <input
                      type="text"
                      placeholder="Pimpri-Chinchwad"
                      value={formData.currentAddress.taluka}
                      onChange={(e) => handleCurrentAddressChange('taluka', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.currentAddress.country}
                      onChange={(e) => handleCurrentAddressChange('country', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.currentAddress.state}
                      onChange={(e) => handleCurrentAddressChange('state', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">District</label>
                    <input
                      type="text"
                      placeholder="Pune"
                      value={formData.currentAddress.district}
                      onChange={(e) => handleCurrentAddressChange('district', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="416205"
                      value={formData.currentAddress.pincode}
                      onChange={(e) => handleCurrentAddressChange('pincode', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Permanent Address with "Same as Current Address" */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>Permanent Address</span>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-orange-700 cursor-pointer bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                    <input
                      type="checkbox"
                      checked={sameAsCurrentAddress}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameAsCurrentAddress(checked);
                        if (checked) {
                          setFormData((prev) => ({
                            ...prev,
                            permanentAddress: { ...prev.currentAddress },
                          }));
                        }
                      }}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>Same as Current Address</span>
                  </label>
                </div>

                {!sameAsCurrentAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street</label>
                      <input
                        type="text"
                        placeholder="Street"
                        value={formData.permanentAddress.street}
                        onChange={(e) => handlePermanentAddressChange('street', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Area</label>
                      <input
                        type="text"
                        placeholder="Area"
                        value={formData.permanentAddress.area}
                        onChange={(e) => handlePermanentAddressChange('area', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tehsil / Taluka</label>
                      <input
                        type="text"
                        placeholder="Tehsil / Taluka"
                        value={formData.permanentAddress.taluka}
                        onChange={(e) => handlePermanentAddressChange('taluka', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.permanentAddress.country}
                        onChange={(e) => handlePermanentAddressChange('country', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.permanentAddress.state}
                        onChange={(e) => handlePermanentAddressChange('state', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.permanentAddress.pincode}
                        onChange={(e) => handlePermanentAddressChange('pincode', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENT ATTACHMENTS & VAULT RACK INTAKE */}
          {activeStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                  6. Original Documents Inward & Fireproof Vault Rack Allocation
                </h3>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {formData.documents.filter((d) => d.submitted).length} of {formData.documents.length} Submitted
                </span>
              </div>

              {/* Document Checkcards */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {formData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocumentSubmission(doc.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      doc.submitted
                        ? 'bg-orange-50/50 border-orange-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={doc.submitted}
                        onChange={() => {}} // handled by div click
                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{doc.title}</span>
                          <span className="font-mono text-[10px] font-bold text-orange-700 bg-orange-100/70 px-1.5 py-0.2 rounded">
                            {doc.code}
                          </span>
                          {doc.isMandatory && (
                            <span className="text-[10px] font-extrabold text-rose-600">
                              *Mandatory
                            </span>
                          )}
                        </div>

                        {doc.submitted && doc.fileName && (
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-700 font-semibold">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Attached: {doc.fileName}</span>
                            <span className="text-slate-400">({doc.fileSize})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {doc.submitted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" />
                          In Custody
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                          <Upload className="w-3 h-3" />
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Physical Vault Rack Location */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-orange-600" />
                  <span>Physical Fireproof Archive Allocation & Barcode Identifier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Assigned Cupboard
                    </label>
                    <input
                      type="text"
                      value={formData.allocatedCupboard}
                      onChange={(e) => setFormData({ ...formData, allocatedCupboard: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Vault Rack Code
                    </label>
                    <input
                      type="text"
                      value={formData.allocatedRackCode}
                      onChange={(e) => setFormData({ ...formData, allocatedRackCode: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-orange-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Folder Serial Barcode
                    </label>
                    <input
                      type="text"
                      value={formData.folderIndexNumber}
                      onChange={(e) => setFormData({ ...formData, folderIndexNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fee Enrollment & Initial Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Tuition Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.feeStructureAnnual}
                    onChange={(e) => setFormData({ ...formData, feeStructureAnnual: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Inward Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.initialDepositAmount}
                    onChange={(e) => setFormData({ ...formData, initialDepositAmount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formData.initialPaymentMode}
                    onChange={(e) => setFormData({ ...formData, initialPaymentMode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="CASH">Cash Counter</option>
                    <option value="CHEQUE">Bank Cheque / DD</option>
                    <option value="NETBANKING">Netbanking / NEFT</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {activeStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Scholar...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Admission</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
