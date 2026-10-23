import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  Printer,
  Archive,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  QrCode,
  RotateCcw,
  Sparkles,
  BookOpen,
  Copy,
  Clock,
  Filter,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { Student, IssuedCertificate, CertificateType } from '../types';
import { formatDobInWords, getInstitutionDetails } from '../utils/documentUtils';
import { FilterBar } from './FilterBar';
import { useTableSort, SortableTh } from './TableSort';

export const CertificatesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ARCHIVE_SEARCH' | 'STUDIO' | 'LEDGER' | 'VAULT_RACK'>('ARCHIVE_SEARCH');

  // Students & Archive data
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('ALL');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Currently selected student for document generation
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Document Studio State
  const [docType, setDocType] = useState<CertificateType>('TRANSFER_LEAVING');
  const [purpose, setPurpose] = useState('Passport Application & Embassy Visa Verification');
  const [customPurpose, setCustomPurpose] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [signatory, setSignatory] = useState('Principal Sunita Kulkarni');
  const [remarks, setRemarks] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Issued certificates ledger
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [previewCert, setPreviewCert] = useState<IssuedCertificate | null>(null);
  const [editingCert, setEditingCert] = useState<IssuedCertificate | null>(null);
  const [deletingCert, setDeletingCert] = useState<IssuedCertificate | null>(null);
  const [editingRackDoc, setEditingRackDoc] = useState<any | null>(null);
  const [deletingRackDoc, setDeletingRackDoc] = useState<any | null>(null);

  // Original Document Physical Rack Ledger
  const [rackDocuments, setRackDocuments] = useState([
    {
      id: 'inw-01',
      studentName: 'Aarav Sharma',
      admissionNo: 'SCH-2026-001',
      documentTitle: 'Original 5th Standard TC & Birth Certificate',
      rackCode: 'C1-S2-SCH',
      cupboard: 'C-01 (Fireproof Steel)',
      shelf: 'Shelf 2',
      folderNo: 'FL-SCH-001',
      status: 'CUSTODY',
      inwardDate: '2024-06-12',
    },
    {
      id: 'inw-02',
      studentName: 'Kabir Verma',
      admissionNo: 'HM-2026-101',
      documentTitle: 'Original 12th HSC Marksheet & Passing Certificate',
      rackCode: 'C2-S1-HM',
      cupboard: 'C-02 (Fireproof Steel)',
      shelf: 'Shelf 1',
      folderNo: 'FL-HM-101',
      status: 'CUSTODY',
      inwardDate: '2024-07-02',
    },
    {
      id: 'inw-03',
      studentName: 'Aditya Suresh Patil',
      admissionNo: 'SCH-2012-042',
      documentTitle: 'Permanent General Register Ledger Page #042 & 5th Std Primary TC',
      rackCode: 'C1-S3-ARCHIVE',
      cupboard: 'C-01 (Archive Vault)',
      shelf: 'Shelf 3',
      folderNo: 'FL-ARCH-2012-42',
      status: 'CUSTODY',
      inwardDate: '2012-06-15',
    },
    {
      id: 'inw-04',
      studentName: 'Sneha Milind Kulkarni',
      admissionNo: 'SCH-2014-0108',
      documentTitle: 'Original SSC Marksheet Duplicate Ledger & Domicile Certificate',
      rackCode: 'C1-S4-ARCHIVE',
      cupboard: 'C-01 (Archive Vault)',
      shelf: 'Shelf 4',
      folderNo: 'FL-ARCH-2014-108',
      status: 'CUSTODY',
      inwardDate: '2014-06-20',
    },
  ]);

  const {
    sortedData: sortedRackDocuments,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort(rackDocuments, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  // Fetch students from API
  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await fetch('http://localhost:5000/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        // Default selected student if none selected
        if (!selectedStudent && data.students && data.students.length > 0) {
          const historical = data.students.find((s: Student) => s.status === 'ALUMNI_PASSED') || data.students[0];
          setSelectedStudent(historical);
        }
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Fetch issued certificates
  const fetchCertificates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/certificates');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error('Failed to load certificates', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCertificates();
  }, []);

  // Update duplicate state & remarks when student changes
  useEffect(() => {
    if (selectedStudent) {
      const isPastStudent = selectedStudent.status === 'ALUMNI_PASSED' || selectedStudent.status === 'ALUMNI_WITHDRAWN';
      setIsDuplicate(isPastStudent && docType === 'TRANSFER_LEAVING');
      if (isPastStudent) {
        setRemarks(`DUPLICATE COPY ISSUED ON FORMAL ALUMNI APPLICATION (PASSING YEAR: ${selectedStudent.passingYear || 'HISTORICAL'}). ALL DUES PERPETUALLY CLEARED.`);
      } else {
        setRemarks(selectedStudent.remarks || 'Conduct and progress have been exemplary. All institutional accounts cleared.');
      }
      // Update signatory based on branch
      if (selectedStudent.branchName && selectedStudent.branchName.toLowerCase().includes('hotel')) {
        setSignatory('Director Chef Sanjeev Menon');
      } else {
        setSignatory('Principal Sunita Kulkarni');
      }
    }
  }, [selectedStudent, docType]);

  // Filter students for the Archive Search
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.grNumber && s.grNumber.toLowerCase().includes(q)) ||
      s.admissionNo.toLowerCase().includes(q) ||
      (s.motherName && s.motherName.toLowerCase().includes(q)) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(q)) ||
      (s.parentName && s.parentName.toLowerCase().includes(q)) ||
      (s.passingYear && s.passingYear.includes(q)) ||
      (s.academicYear && s.academicYear.includes(q)) ||
      (s.aadhaarNumber && s.aadhaarNumber.toLowerCase().includes(q)) ||
      s.gradeOrSemester.toLowerCase().includes(q);

    // Batch decade/range filter
    let matchesBatch = true;
    if (selectedBatchFilter === '10_PLUS_YEARS') {
      const yr = parseInt(s.passingYear || s.academicYear?.slice(0, 4) || '2026', 10);
      matchesBatch = yr <= 2016;
    } else if (selectedBatchFilter === '5_TO_10_YEARS') {
      const yr = parseInt(s.passingYear || s.academicYear?.slice(0, 4) || '2026', 10);
      matchesBatch = yr >= 2017 && yr <= 2021;
    } else if (selectedBatchFilter === 'RECENT') {
      const yr = parseInt(s.passingYear || s.academicYear?.slice(0, 4) || '2026', 10);
      matchesBatch = yr >= 2022 && yr <= 2025;
    } else if (selectedBatchFilter === 'CURRENT') {
      matchesBatch = s.status === 'ACTIVE' || (s.academicYear && s.academicYear.includes('2026'));
    }

    // Branch filter
    let matchesBranch = true;
    if (selectedBranchFilter === 'SCHOOL') {
      matchesBranch = s.branchId === 'branch-sch-01' || (s.branchName && s.branchName.includes('School'));
    } else if (selectedBranchFilter === 'COLLEGE') {
      matchesBranch = s.branchId === 'branch-hm-01' || (s.branchName && s.branchName.includes('Hotel'));
    }

    // Status filter
    let matchesStatus = true;
    if (selectedStatusFilter === 'ALUMNI') {
      matchesStatus = s.status === 'ALUMNI_PASSED';
    } else if (selectedStatusFilter === 'ACTIVE') {
      matchesStatus = s.status === 'ACTIVE';
    }

    return matchesQuery && matchesBatch && matchesBranch && matchesStatus;
  });

  // Handle document generation & signing
  const handleGenerateDocument = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);

    const activePurpose = customPurpose.trim() || purpose;
    const instMeta = getInstitutionDetails(selectedStudent.branchName);

    const payload = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      grNumber: selectedStudent.grNumber || 'GR-ARCHIVE-UNALLOCATED',
      branchName: selectedStudent.branchName || instMeta.name,
      gradeOrCourse: selectedStudent.leavingGrade || selectedStudent.gradeOrSemester,
      certificateType: docType,
      academicYear: selectedStudent.academicYear || '2026-2027',
      motherName: selectedStudent.motherName || 'Verified on Record',
      fatherName: selectedStudent.fatherName || selectedStudent.parentName || 'Verified on Record',
      dob: selectedStudent.dob || '2000-01-01',
      dobWords: selectedStudent.dobWords || formatDobInWords(selectedStudent.dob),
      placeOfBirth: selectedStudent.placeOfBirth || 'Maharashtra, India',
      nationality: selectedStudent.nationality || 'Indian',
      religion: selectedStudent.religion || 'Hindu',
      caste: selectedStudent.caste || 'General',
      admissionDate: selectedStudent.admissionDate || '2012-06-15',
      admissionGrade: selectedStudent.admissionGrade || 'Primary Standard',
      leavingDate: selectedStudent.leavingDate || issueDate,
      leavingGrade: selectedStudent.leavingGrade || selectedStudent.gradeOrSemester,
      reasonForLeaving: selectedStudent.reasonForLeaving || (selectedStudent.status === 'ALUMNI_PASSED' ? 'Passed with Meritorious Record' : 'Higher Studies Transfer'),
      progress: selectedStudent.progress || 'Outstanding',
      conduct: selectedStudent.conduct || 'Exemplary',
      purpose: activePurpose,
      isDuplicate,
      remarks: remarks || selectedStudent.remarks,
      signatoryName: signatory,
    };

    try {
      const res = await fetch('http://localhost:5000/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const createdCert: IssuedCertificate = data.certificate;
        setCertificates((prev) => [createdCert, ...prev]);
        setPreviewCert(createdCert);
      } else {
        alert('Failed to generate document. Please check required fields.');
      }
    } catch (err) {
      console.error('Error generating certificate', err);
      // Fallback local creation if offline
      const prefixMap: Record<string, string> = {
        TRANSFER_LEAVING: 'LC',
        BONAFIDE: 'BF',
        CHARACTER: 'CHAR',
        NO_DUES: 'NODUE',
        PASSING_ATTEMPT: 'PASS',
        MIGRATION: 'MIG',
      };
      const prefix = prefixMap[docType] || 'DOC';
      const fallbackCert: IssuedCertificate = {
        id: `cert-${prefix.toLowerCase()}-${Date.now()}`,
        certificateSerialNo: `${prefix}-TRUST-2026-${String(certificates.length + 101).padStart(4, '0')}`,
        certificateType: docType,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        grNumber: selectedStudent.grNumber,
        branchName: selectedStudent.branchName || instMeta.name,
        gradeOrCourse: selectedStudent.leavingGrade || selectedStudent.gradeOrSemester,
        academicYear: selectedStudent.academicYear || '2026-2027',
        issueDate,
        issuedBy: signatory,
        digitalSignatureHash: `SHA256:${btoa(selectedStudent.name + Date.now()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 48)}`,
        qrVerificationUrl: `http://localhost:5000/verify/doc/cert-${prefix.toLowerCase()}-${Date.now()}`,
        motherName: selectedStudent.motherName,
        fatherName: selectedStudent.fatherName || selectedStudent.parentName,
        dob: selectedStudent.dob,
        dobWords: selectedStudent.dobWords || formatDobInWords(selectedStudent.dob),
        placeOfBirth: selectedStudent.placeOfBirth,
        nationality: selectedStudent.nationality || 'Indian',
        religion: selectedStudent.religion,
        caste: selectedStudent.caste,
        admissionDate: selectedStudent.admissionDate,
        admissionGrade: selectedStudent.admissionGrade,
        leavingDate: selectedStudent.leavingDate,
        leavingGrade: selectedStudent.leavingGrade,
        reasonForLeaving: selectedStudent.reasonForLeaving,
        progress: selectedStudent.progress || 'Outstanding',
        conduct: selectedStudent.conduct || 'Exemplary',
        purpose: activePurpose,
        isDuplicate,
        remarks: remarks || selectedStudent.remarks,
      };
      setCertificates((prev) => [fallbackCert, ...prev]);
      setPreviewCert(fallbackCert);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyQrLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Clean Light Style */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Official Documents & Perpetual Student Archive
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                10+ Years Lookup Engine
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Search past alumni (even 10+ years after graduation) by GR Number or Name, generate statutory Leaving Certificates (LC / TC), Bonafide, and audit physical vault racks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveTab('STUDIO');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Issue Document Now
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Clean White Light Mode */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ARCHIVE_SEARCH')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ARCHIVE_SEARCH'
              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4" />
          10+ Years Student Archive & GR Search ({filteredStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('STUDIO')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'STUDIO'
              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Official Document Generator Studio
          {selectedStudent && (
            <span className="px-2 py-0.5 rounded-full bg-orange-200/60 text-orange-800 text-[10px]">
              {selectedStudent.name.split(' ')[0]}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LEDGER'
              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Issued Certificates Ledger ({certificates.length})
        </button>

        <button
          onClick={() => setActiveTab('VAULT_RACK')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'VAULT_RACK'
              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Archive className="w-4 h-4" />
          Fireproof Vault Rack Index ({rackDocuments.length} Custody Files)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 10+ YEARS HISTORICAL ARCHIVE SEARCH */}
      {/* ========================================================================= */}
      {activeTab === 'ARCHIVE_SEARCH' && (
        <div className="space-y-4">
          {/* Reusable Unified FilterBar */}
          <FilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search past students by GR Number (e.g. GR-2012-0042), Name, Admission No, Mother's Name, Year (e.g. 2012)..."
            dropdowns={[
              {
                id: 'branch',
                label: 'Institution',
                value: selectedBranchFilter,
                onChange: setSelectedBranchFilter,
                icon: <Building className="w-3.5 h-3.5 text-slate-400" />,
                options: [
                  { label: 'All Institutions', value: 'ALL' },
                  { label: 'Modern Public School & Jr College Bhose', value: 'SCHOOL' },
                  { label: 'Modern College of HM & Tech Solapur', value: 'COLLEGE' },
                ],
              },
              {
                id: 'status',
                label: 'Status',
                value: selectedStatusFilter,
                onChange: setSelectedStatusFilter,
                options: [
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Alumni / Passed Out (Historical)', value: 'ALUMNI' },
                  { label: 'Currently Enrolled (Active)', value: 'ACTIVE' },
                ],
              },
            ]}
            pills={[
              {
                id: 'batch',
                label: 'Batch Decade',
                value: selectedBatchFilter,
                onChange: setSelectedBatchFilter,
                options: [
                  { label: 'All Batches', value: 'ALL' },
                  { label: '10+ Years Ago (2011–2016)', value: '10_PLUS_YEARS' },
                  { label: '5–10 Years (2017–2021)', value: '5_TO_10_YEARS' },
                  { label: 'Recent Alumni (2022–2025)', value: 'RECENT' },
                  { label: 'Current Enrolled (2026)', value: 'CURRENT' },
                ],
              },
            ]}
            totalCount={students.length}
            filteredCount={filteredStudents.length}
            itemLabel="student records"
            isFiltered={
              searchQuery !== '' ||
              selectedBranchFilter !== 'ALL' ||
              selectedStatusFilter !== 'ALL' ||
              selectedBatchFilter !== 'ALL'
            }
            onReset={() => {
              setSearchQuery('');
              setSelectedBranchFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSelectedBatchFilter('ALL');
            }}
          />

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((stu) => {
              const isAlumni = stu.status === 'ALUMNI_PASSED' || stu.status === 'ALUMNI_WITHDRAWN';
              const yrNum = parseInt(stu.passingYear || stu.academicYear?.slice(0, 4) || '2026', 10);
              const yearsAgo = 2026 - yrNum;
              const is10PlusYears = isAlumni && yearsAgo >= 10;
              const isSelected = selectedStudent?.id === stu.id;

              return (
                <div
                  key={stu.id}
                  className={`bg-white border rounded-3xl p-5 space-y-3.5 transition-all shadow-sm relative hover:shadow-md ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {stu.grNumber || 'GR PENDING'}
                    </span>

                    {is10PlusYears ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        {yearsAgo}+ YEARS ALUMNI ({stu.passingYear})
                      </span>
                    ) : isAlumni ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        ALUMNI ({stu.passingYear})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ACTIVE ENROLLED
                      </span>
                    )}
                  </div>

                  {/* Student Name & Basic Info */}
                  <div>
                    <h3 className="text-base font-black text-slate-900">{stu.name}</h3>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      {stu.branchName || (stu.branchId === 'branch-sch-01' ? 'Modern Public School & Jr College Bhose' : 'Modern College of HM & Tech Solapur')}
                    </div>
                  </div>

                  {/* Historical Details Pill Box */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Standard / Degree:</span>
                      <strong className="text-slate-800 font-semibold">{stu.leavingGrade || stu.gradeOrSemester}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tenure / Batch:</span>
                      <span className="font-medium text-slate-700">{stu.academicYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mother's Name:</span>
                      <span className="font-medium text-slate-700">{stu.motherName || 'On Record'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date of Birth:</span>
                      <span className="font-medium text-slate-700">{stu.dob || 'On File'}</span>
                    </div>
                    {stu.reasonForLeaving && (
                      <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 line-clamp-1 italic">
                        "{stu.reasonForLeaving}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedStudent(stu);
                        setActiveTab('STUDIO');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Document
                    </button>

                    <button
                      onClick={() => {
                        setSelectedStudent(stu);
                        // Also auto-filter ledger for this student
                        setActiveTab('LEDGER');
                      }}
                      title="View Past Issued Certificates"
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
                    >
                      History
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <Archive className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Historical Records Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No student matched your search for "{searchQuery}". Try searching by General Register (GR) Number, first name, or clearing the batch filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBatchFilter('ALL');
                  setSelectedBranchFilter('ALL');
                  setSelectedStatusFilter('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OFFICIAL DOCUMENT GENERATOR STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'STUDIO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Document Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Student Picker Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Student / Scholar
                </span>
                <button
                  onClick={() => setActiveTab('ARCHIVE_SEARCH')}
                  className="text-xs text-orange-600 hover:underline font-bold"
                >
                  Change Student ↗
                </button>
              </div>

              {selectedStudent ? (
                <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">{selectedStudent.name}</h3>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                      {selectedStudent.grNumber || 'GR PENDING'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {selectedStudent.branchName || 'Zep Foundation Institution'} • {selectedStudent.leavingGrade || selectedStudent.gradeOrSemester}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-orange-200/60">
                    <span>Batch: <strong>{selectedStudent.academicYear}</strong></span>
                    <span>•</span>
                    <span>DOB: <strong>{selectedStudent.dob}</strong></span>
                    <span>•</span>
                    <span className="capitalize">{selectedStudent.status?.toLowerCase().replace('_', ' ')}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 text-center text-xs text-slate-500">
                  Please select a student from the archive to generate documents.
                </div>
              )}
            </div>

            {/* Document Configuration Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Select Document Template
              </h3>

              {/* Document Type Selector Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'TRANSFER_LEAVING' as CertificateType,
                    title: 'Leaving Cert (LC / TC)',
                    desc: 'Statutory 14-Col Gazette Format',
                  },
                  {
                    id: 'BONAFIDE' as CertificateType,
                    title: 'Bonafide Certificate',
                    desc: 'Study & Residence Proof',
                  },
                  {
                    id: 'CHARACTER' as CertificateType,
                    title: 'Character & Conduct',
                    desc: 'Moral Demeanor Endorsement',
                  },
                  {
                    id: 'NO_DUES' as CertificateType,
                    title: 'No Dues / Clearance',
                    desc: '5-Department Audited Signoff',
                  },
                  {
                    id: 'PASSING_ATTEMPT' as CertificateType,
                    title: 'Passing / Attempt Cert',
                    desc: 'Degree & Board First Attempt',
                  },
                  {
                    id: 'MIGRATION' as CertificateType,
                    title: 'Migration Recommendation',
                    desc: 'University / Board Transfer',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocType(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      docType === item.id
                        ? 'border-orange-500 bg-orange-50/60 text-slate-900 shadow-sm ring-1 ring-orange-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Purpose Stated */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stated Purpose for Certificate
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500 mb-2"
                >
                  <option value="Passport Application & Embassy Visa Verification">Passport Application & Embassy Visa Verification</option>
                  <option value="Higher Education Admission & University Transfer">Higher Education Admission & University Transfer</option>
                  <option value="Bank Education Loan & Savings Account Verification">Bank Education Loan & Savings Account Verification</option>
                  <option value="Government Scholarship & Caste Validity Verification">Government Scholarship & Caste Validity Verification</option>
                  <option value="Employment Background Verification (BGV)">Employment Background Verification (BGV)</option>
                  <option value="State Transport (MSRTC / Metro) Student Concession">State Transport (MSRTC / Metro) Student Concession</option>
                  <option value="CUSTOM">-- Enter Custom Purpose --</option>
                </select>

                {purpose === 'CUSTOM' && (
                  <input
                    type="text"
                    placeholder="Type custom official purpose..."
                    value={customPurpose}
                    onChange={(e) => setCustomPurpose(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800"
                  />
                )}
              </div>

              {/* Duplicate Stamp Toggle (Statutory requirement for 10+ year alumni) */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Issue as "DUPLICATE COPY"
                  </div>
                  <div className="text-[10px] text-amber-700">
                    Mandatory statutory stamp if re-issuing document to past students / alumni.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isDuplicate}
                  onChange={(e) => setIsDuplicate(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 cursor-pointer"
                />
              </div>

              {/* Signatory & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Signatory Authority</label>
                  <select
                    value={signatory}
                    onChange={(e) => setSignatory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                  >
                    <option value="Principal Sunita Kulkarni">Principal Sunita Kulkarni</option>
                    <option value="Director Chef Sanjeev Menon">Director Chef Sanjeev Menon</option>
                    <option value="Registrar Dr. Rajesh Patil">Registrar Dr. Rajesh Patil</option>
                    <option value="Head Clerk V. D. Joshi">Head Clerk V. D. Joshi</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Official comments, conduct endorsements, or register notations..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isGenerating || !selectedStudent}
                onClick={handleGenerateDocument}
                className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {isGenerating ? (
                  <>Generating & Cryptographically Signing...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Sign & Issue Official Document
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Printable Document Preview (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-orange-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Official Letterhead Preview (Print Ready)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Certificate
                  </button>
                </div>
              </div>

              {/* Authentic Certificate Template Frame */}
              {selectedStudent ? (
                <div
                  id="printable-certificate"
                  className="bg-white border-4 border-double border-slate-800 p-8 rounded-2xl text-slate-900 space-y-5 shadow-inner relative overflow-hidden font-serif"
                >
                  {/* DUPLICATE WATERMARK if applicable */}
                  {isDuplicate && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] rotate-[-25deg]">
                      <span className="text-8xl font-black text-red-900 tracking-widest border-8 border-red-900 p-6 rounded-3xl">
                        DUPLICATE COPY
                      </span>
                    </div>
                  )}

                  {/* Header: Trust and Institution */}
                  {(() => {
                    const inst = getInstitutionDetails(selectedStudent.branchName);
                    return (
                      <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                        <div className="text-[11px] font-sans font-bold tracking-widest text-orange-700 uppercase">
                          {inst.trustName}
                        </div>
                        <div className="text-[9px] font-sans text-slate-500">{inst.trustRegistration}</div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 font-sans mt-1">
                          {inst.name}
                        </h2>
                        <div className="text-[10px] font-sans font-medium text-slate-600">
                          {inst.address}, {inst.city} - {inst.pincode} • Phone: {inst.phone}
                        </div>
                        <div className="text-[9px] font-sans font-bold text-slate-700 flex flex-wrap items-center justify-center gap-3 pt-0.5">
                          <span>{inst.affiliationNo}</span>
                          <span>•</span>
                          <span>{inst.udiseCode}</span>
                          <span>•</span>
                          <span>{inst.indexNo}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Document Title Banner */}
                  <div className="text-center py-1">
                    {isDuplicate && (
                      <div className="text-center mb-1">
                        <span className="font-sans px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                          OFFICIAL DUPLICATE COPY - ISSUED ON APPLICATION
                        </span>
                      </div>
                    )}
                    <h1 className="text-lg font-black uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
                      {docType === 'TRANSFER_LEAVING' && 'SCHOOL / COLLEGE LEAVING CERTIFICATE'}
                      {docType === 'BONAFIDE' && (selectedStudent.status === 'ALUMNI_PASSED' ? 'EX-STUDENT / ALUMNI BONAFIDE CERTIFICATE' : 'BONAFIDE SCHOLAR CERTIFICATE')}
                      {docType === 'CHARACTER' && 'CHARACTER & MORAL CONDUCT CERTIFICATE'}
                      {docType === 'NO_DUES' && 'INSTITUTIONAL NO DUES / AUDIT CLEARANCE CERTIFICATE'}
                      {docType === 'PASSING_ATTEMPT' && 'COURSE COMPLETION & ATTEMPT CERTIFICATE'}
                      {docType === 'MIGRATION' && 'OFFICIAL MIGRATION & NOC RECOMMENDATION'}
                    </h1>

                    <div className="flex items-center justify-between text-xs font-sans text-slate-600 mt-2 px-2">
                      <div>
                        Serial No:{' '}
                        <strong className="font-mono text-slate-900">
                          {docType === 'TRANSFER_LEAVING' ? 'LC' : docType === 'BONAFIDE' ? 'BF' : 'DOC'}-TRUST-2026-
                          {selectedStudent.grNumber?.slice(-4) || '0101'}
                        </strong>
                      </div>
                      <div>
                        General Register (G.R.) No:{' '}
                        <strong className="font-mono text-slate-900">{selectedStudent.grNumber || 'GR-ARCHIVE'}</strong>
                      </div>
                      <div>
                        Date of Issue: <strong>{issueDate}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Document Body Variant 1: STATUTORY LEAVING CERTIFICATE (LC / TC) */}
                  {docType === 'TRANSFER_LEAVING' && (
                    <div className="border border-slate-700 text-xs font-sans divide-y divide-slate-300">
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">1. Name of Pupil in Full:</div>
                        <div className="col-span-7 font-bold text-slate-900 uppercase">{selectedStudent.name}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">2. Mother's Name:</div>
                        <div className="col-span-7 font-bold text-slate-900">{selectedStudent.motherName || 'Verified on Record'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">3. Father's / Guardian's Name:</div>
                        <div className="col-span-7 font-semibold text-slate-900">{selectedStudent.fatherName || selectedStudent.parentName}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">4. Nationality & Religion:</div>
                        <div className="col-span-7 font-medium text-slate-900">{selectedStudent.nationality || 'Indian'} • {selectedStudent.religion || 'Hindu'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">5. Caste & Sub-caste / Category:</div>
                        <div className="col-span-7 font-medium text-slate-900">{selectedStudent.caste || 'General / Open'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">6. Place of Birth:</div>
                        <div className="col-span-7 font-medium text-slate-900">{selectedStudent.placeOfBirth || 'Maharashtra, India'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-slate-50">
                        <div className="col-span-5 text-slate-600">7. Date of Birth (Figures & Words):</div>
                        <div className="col-span-7 font-bold text-slate-900">
                          {selectedStudent.dob || '2000-01-01'}
                          <div className="text-[11px] font-normal italic text-slate-700">
                            ({selectedStudent.dobWords || formatDobInWords(selectedStudent.dob)})
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">8. Last School/College Attended:</div>
                        <div className="col-span-7 text-slate-800">{selectedStudent.lastSchoolAttended || 'Primary School Mandir'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">9. Date of Admission & Standard:</div>
                        <div className="col-span-7 text-slate-800">{selectedStudent.admissionDate || '2012-06-15'} in {selectedStudent.admissionGrade || 'Primary Standard'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">10. Progress in Studies & Conduct:</div>
                        <div className="col-span-7 text-slate-900">
                          Progress: <strong>{selectedStudent.progress || 'Outstanding'}</strong> • Conduct: <strong>{selectedStudent.conduct || 'Exemplary'}</strong>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">11. Date of Leaving School/College:</div>
                        <div className="col-span-7 font-bold text-slate-900">{selectedStudent.leavingDate || issueDate}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">12. Standard in which Studying / Left:</div>
                        <div className="col-span-7 font-bold text-slate-900">{selectedStudent.leavingGrade || selectedStudent.gradeOrSemester}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2">
                        <div className="col-span-5 text-slate-600">13. Reason for Leaving School/College:</div>
                        <div className="col-span-7 font-medium text-slate-900">{selectedStudent.reasonForLeaving || 'Passed Out / Higher Studies'}</div>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-slate-50">
                        <div className="col-span-5 text-slate-600">14. Remarks & Dues Clearance:</div>
                        <div className="col-span-7 text-slate-800 text-[11px]">{remarks}</div>
                      </div>
                    </div>
                  )}

                  {/* Document Body Variant 2: BONAFIDE CERTIFICATE */}
                  {docType === 'BONAFIDE' && (
                    <div className="text-sm font-sans leading-relaxed text-slate-800 space-y-4 py-2">
                      <p>
                        This is to officially certify that <strong>{selectedStudent.name}</strong>, Son/Daughter of{' '}
                        <strong>{selectedStudent.motherName || 'Verified Parent'}</strong> and{' '}
                        <strong>{selectedStudent.fatherName || selectedStudent.parentName}</strong>, bearing General
                        Register (G.R.) No. <strong>{selectedStudent.grNumber || 'GR-ARCHIVE'}</strong>, is / was a
                        bonafide regular scholar of this institution.
                      </p>

                      <p>
                        According to the official Perpetual Register of this institution, their Date of Birth is{' '}
                        <strong>{selectedStudent.dob || '2000-01-01'}</strong> (in words:{' '}
                        <em>{selectedStudent.dobWords || formatDobInWords(selectedStudent.dob)}</em>).
                      </p>

                      <p>
                        {selectedStudent.status === 'ALUMNI_PASSED' ? (
                          <>
                            The student has completed <strong>{selectedStudent.leavingGrade || selectedStudent.gradeOrSemester}</strong> during the
                            academic tenure <strong>{selectedStudent.academicYear}</strong> and successfully graduated from this institution.
                          </>
                        ) : (
                          <>
                            The student is currently enrolled in <strong>{selectedStudent.gradeOrSemester}</strong> for the
                            Academic Year <strong>{selectedStudent.academicYear || '2026-2027'}</strong>.
                          </>
                        )}
                      </p>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <strong>Certified Purpose:</strong> {customPurpose.trim() || purpose}
                      </div>

                      <p className="text-xs text-slate-600">
                        To the best of our institutional records, their moral demeanor, academic conduct, and discipline
                        have been certified as <strong>{selectedStudent.conduct || 'Exemplary'}</strong> with zero outstanding disciplinary notations.
                      </p>
                    </div>
                  )}

                  {/* Document Body Variant 3: CHARACTER & CONDUCT CERTIFICATE */}
                  {docType === 'CHARACTER' && (
                    <div className="text-sm font-sans leading-relaxed text-slate-800 space-y-4 py-2">
                      <p>
                        This is to certify that <strong>{selectedStudent.name}</strong> was a scholar of this institution
                        enrolled in <strong>{selectedStudent.gradeOrSemester}</strong> during the academic period{' '}
                        <strong>{selectedStudent.academicYear}</strong>.
                      </p>
                      <p>
                        During their period of study at this institution, they displayed exemplary academic perseverance,
                        moral integrity, leadership, and obedience. They participated actively in institutional events,
                        academics, and co-curricular programs.
                      </p>
                      <p>
                        They possess good moral character and clean conduct. We wish them success in all future academic
                        and professional endeavors.
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <strong>Official Evaluation:</strong> Conduct:{' '}
                        <strong>{selectedStudent.conduct || 'Exemplary'}</strong> • Academic Progress:{' '}
                        <strong>{selectedStudent.progress || 'Outstanding'}</strong>
                      </div>
                    </div>
                  )}

                  {/* Document Body Variant 4: NO DUES / FEE CLEARANCE */}
                  {docType === 'NO_DUES' && (
                    <div className="text-xs font-sans space-y-4 py-2">
                      <p className="text-sm text-slate-800">
                        This certifies that <strong>{selectedStudent.name}</strong> (G.R. No:{' '}
                        <strong>{selectedStudent.grNumber}</strong>, Admission No: <strong>{selectedStudent.admissionNo}</strong>)
                        has cleared all audited institutional liabilities across all departments:
                      </p>

                      <div className="border border-slate-300 rounded-xl overflow-hidden divide-y divide-slate-200">
                        {[
                          { dept: 'Accounts & Tuition Fee Section', status: 'CLEARED (Zero Dues Pending)', sign: 'Head Accountant' },
                          { dept: 'Central Library & Reference Vault', status: 'All Books & Journals Returned', sign: 'Chief Librarian' },
                          { dept: 'Laboratories / Culinary Practical Kitchens', status: 'Kit & Equipment Accounted for', sign: 'Lab In-Charge' },
                          { dept: 'Sports, Gymkhana & NCC/NSS', status: 'Sports Equipment Returned', sign: 'Sports Director' },
                          { dept: 'Hostel & Residential Mess', status: 'Mess & Caution Deposit Cleared', sign: 'Hostel Warden' },
                        ].map((row, idx) => (
                          <div key={idx} className="grid grid-cols-12 p-2.5 text-xs">
                            <div className="col-span-5 font-bold text-slate-900">{row.dept}</div>
                            <div className="col-span-4 text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
                            </div>
                            <div className="col-span-3 text-right text-slate-500 italic">{row.sign}</div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-600">
                        Official Caution Deposit refund status: Processed and released to student bank account.
                      </p>
                    </div>
                  )}

                  {/* Document Body Variant 5: PASSING & ATTEMPT CERTIFICATE */}
                  {docType === 'PASSING_ATTEMPT' && (
                    <div className="text-sm font-sans leading-relaxed text-slate-800 space-y-4 py-2">
                      <p>
                        This is to certify that <strong>{selectedStudent.name}</strong> appeared for and successfully
                        passed the examination for <strong>{selectedStudent.leavingGrade || selectedStudent.gradeOrSemester}</strong> held by the
                        Board / University in the year <strong>{selectedStudent.passingYear || '2024'}</strong>.
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div>Examination Seat / Roll No: <strong>{selectedStudent.rollNo}</strong></div>
                        <div>Attempt Record: <strong>PASSED IN FIRST (1ST) ATTEMPT</strong></div>
                        <div>Academic Division / Grade: <strong>FIRST CLASS WITH DISTINCTION</strong></div>
                        <div>General Register (G.R.) Entry: <strong>{selectedStudent.grNumber}</strong></div>
                      </div>
                      <p className="text-xs text-slate-600">
                        This certificate is issued on the basis of official examination tabulations and perpetual registers maintained by the institution.
                      </p>
                    </div>
                  )}

                  {/* Document Body Variant 6: MIGRATION & NOC RECOMMENDATION */}
                  {docType === 'MIGRATION' && (
                    <div className="text-sm font-sans leading-relaxed text-slate-800 space-y-4 py-2">
                      <div className="text-right text-xs text-slate-500">Date: {issueDate}</div>
                      <div className="font-bold">TO WHOMSOEVER IT MAY CONCERN / THE REGISTRAR</div>
                      <p>
                        This institution has <strong>NO OBJECTION</strong> to <strong>{selectedStudent.name}</strong>,
                        who completed <strong>{selectedStudent.leavingGrade || selectedStudent.gradeOrSemester}</strong> at this institution,
                        joining any other recognized University, College, or Secondary Education Board for higher studies.
                      </p>
                      <p>
                        The student has fulfilled all academic requirements, returned all institutional properties, and holds no
                        disciplinary sanctions.
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <strong>Target Institution / Board:</strong> For Admission to Higher Technical & University Courses
                      </div>
                    </div>
                  )}

                  {/* Signatory & Security Footer */}
                  <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between font-sans">
                    {/* Left: QR Code & Verification */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {/* Dynamic Real QR Code Server Graphic with fallback */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=http://localhost:5000/verify/doc/cert-${selectedStudent.grNumber || '01'}`}
                          alt="Verification QR"
                          className="w-16 h-16 border border-slate-300 p-0.5 rounded bg-white shadow-sm"
                        />
                        <div className="text-[10px] text-slate-500 space-y-0.5">
                          <div className="font-bold text-slate-800 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tamper-Evident QR
                          </div>
                          <div>Scan with mobile camera to verify</div>
                          <div className="font-mono text-[9px] text-slate-400">
                            ID: {selectedStudent.grNumber}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center: Official Seal Placeholder */}
                    <div className="text-center px-4">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400 text-center uppercase p-1">
                        Institutional Seal Stamp
                      </div>
                    </div>

                    {/* Right: Signature Blocks */}
                    <div className="text-right space-y-6">
                      <div className="text-[11px] font-bold text-slate-900 border-t border-slate-800 pt-1 min-w-[140px] text-center">
                        <div>Class Teacher / Clerk</div>
                      </div>
                      <div className="text-[11px] font-bold text-slate-900 border-t border-slate-800 pt-1 min-w-[140px] text-center">
                        <div className="text-xs font-black">{signatory}</div>
                        <div className="text-[10px] text-slate-500">
                          {selectedStudent.branchName?.includes('Hotel') ? 'Director & Head of Institute' : 'Principal / Authorized Officer'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  Select a student to render the live document preview.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ISSUED CERTIFICATES AUDIT LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'LEDGER' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-600" />
                Permanent Issued Certificates Registry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All certificates generated by the ERP carry perpetual verification IDs, tamper-evident SHA-256 hashes, and mobile-scannable QR links.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Total Issued: <strong>{certificates.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200 space-y-3 hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {cert.certificateSerialNo}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    VERIFIED
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{cert.studentName}</h3>
                  <div className="text-xs text-slate-600">{cert.branchName} • {cert.gradeOrCourse}</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1">
                  <div>
                    Type: <strong className="text-slate-900 font-sans">{cert.certificateType.replace('_', ' ')}</strong>
                  </div>
                  <div>Issue Date: {cert.issueDate} • Signer: {cert.issuedBy}</div>
                  {cert.grNumber && <div>GR Number: <strong>{cert.grNumber}</strong></div>}
                  {cert.isDuplicate && (
                    <div className="text-red-700 font-sans font-bold text-[10px]">
                      ⚠️ STATUTORY DUPLICATE COPY
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 truncate">Hash: {cert.digitalSignatureHash}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setPreviewCert(cert);
                      }}
                      className="flex items-center gap-1 text-slate-700 hover:text-orange-600 font-bold transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-orange-600" /> Print
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCert({ ...cert })}
                      title="Edit Certificate Details"
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCert(cert)}
                      title="Revoke / Delete Certificate"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={cert.qrVerificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                  >
                    <QrCode className="w-3.5 h-3.5" /> QR <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FIREPROOF VAULT PHYSICAL RACK LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'VAULT_RACK' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Archive className="w-4 h-4 text-orange-600" />
                Fireproof Physical Document Vault Index
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact steel cupboard, shelf, and folder tracking for physical custody of student original marksheets, birth certificates, and historical register ledgers.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Zero-Loss Physical Record Mandate
            </span>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                <tr>
                  <SortableTh label="Sr. No." sortKey="admissionNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center p-3.5" />
                  <SortableTh label="Student / Admission No" sortKey="studentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Original Document Title" sortKey="documentTitle" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Assigned Cupboard" sortKey="cupboard" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Shelf & Rack Code" sortKey="shelf" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Folder Tag" sortKey="folderNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Inward Date" sortKey="inwardDate" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <th className="p-3.5 text-center">Custody Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRackDocuments.map((doc, index) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{doc.studentName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{doc.admissionNo}</div>
                    </td>
                    <td className="p-3.5 text-slate-800 font-medium">{doc.documentTitle}</td>
                    <td className="p-3.5 text-slate-600">{doc.cupboard}</td>
                    <td className="p-3.5 font-mono text-orange-600 font-bold">
                      {doc.shelf} [{doc.rackCode}]
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 font-bold">{doc.folderNo}</td>
                    <td className="p-3.5 text-slate-500">{doc.inwardDate}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingRackDoc({ ...doc })}
                          title="Edit Vault Location"
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingRackDoc(doc)}
                          title="Relinquish / Delete Record"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINT PREVIEW MODAL FOR ISSUED CERTIFICATE */}
      {/* ========================================================================= */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 text-slate-900 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Certificate Print Preview & Verification
                </h3>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Certificate Canvas */}
            <div
              id="printable-certificate"
              className="border-4 border-double border-slate-800 p-8 rounded-2xl text-slate-900 space-y-5 bg-white font-serif relative"
            >
              {previewCert.isDuplicate && (
                <div className="text-center">
                  <span className="font-sans px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                    OFFICIAL DUPLICATE COPY - ISSUED ON APPLICATION
                  </span>
                </div>
              )}

              {/* Header */}
              {(() => {
                const inst = getInstitutionDetails(previewCert.branchName);
                return (
                  <div className="text-center border-b-2 border-slate-800 pb-3 space-y-1">
                    <div className="text-[10px] font-sans font-bold tracking-widest text-orange-700 uppercase">
                      {inst.trustName}
                    </div>
                    <h2 className="text-lg font-black uppercase text-slate-950 font-sans mt-0.5">
                      {inst.name}
                    </h2>
                    <div className="text-[9px] font-sans text-slate-500">
                      {inst.address}, {inst.city} - {inst.pincode} • Phone: {inst.phone}
                    </div>
                    <div className="text-[9px] font-sans font-bold text-slate-700">
                      {inst.affiliationNo} • {inst.udiseCode}
                    </div>
                  </div>
                );
              })()}

              <div className="text-center py-1">
                <h1 className="text-base font-black uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
                  {previewCert.certificateType.replace('_', ' ')} CERTIFICATE
                </h1>
                <div className="flex items-center justify-between text-xs font-sans text-slate-600 mt-2 px-2">
                  <div>Serial No: <strong className="font-mono">{previewCert.certificateSerialNo}</strong></div>
                  {previewCert.grNumber && <div>G.R. No: <strong className="font-mono">{previewCert.grNumber}</strong></div>}
                  <div>Date: <strong>{previewCert.issueDate}</strong></div>
                </div>
              </div>

              {/* Body */}
              <div className="text-sm font-sans leading-relaxed text-slate-800 space-y-3">
                <p>
                  This is to officially certify that <strong>{previewCert.studentName}</strong>
                  {previewCert.motherName ? `, Son/Daughter of ${previewCert.motherName}` : ''}
                  {previewCert.fatherName ? ` and ${previewCert.fatherName}` : ''},
                  is registered under General Register No. <strong>{previewCert.grNumber || 'ARCHIVE'}</strong>.
                </p>

                {previewCert.dob && (
                  <p>
                    Their recorded Date of Birth is <strong>{previewCert.dob}</strong>
                    {previewCert.dobWords ? ` (${previewCert.dobWords})` : ''}.
                  </p>
                )}

                <p>
                  The student was enrolled in <strong>{previewCert.gradeOrCourse}</strong> for the academic period{' '}
                  <strong>{previewCert.academicYear}</strong>. Their conduct and moral character were certified as{' '}
                  <strong>{previewCert.conduct || 'Exemplary'}</strong>.
                </p>

                {previewCert.purpose && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <strong>Certified Purpose:</strong> {previewCert.purpose}
                  </div>
                )}

                {previewCert.remarks && (
                  <div className="text-xs text-slate-600 italic">
                    Remarks: {previewCert.remarks}
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between font-sans">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${previewCert.qrVerificationUrl}`}
                    alt="QR"
                    className="w-14 h-14 border border-slate-300 p-0.5 rounded bg-white"
                  />
                  <div className="text-[9px] text-slate-500">
                    <div className="font-bold text-slate-800">Scannable QR Verification</div>
                    <div className="font-mono truncate max-w-[120px]">{previewCert.id}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 border-t border-slate-800 pt-1 min-w-[140px] text-center">
                    <div>{previewCert.issuedBy}</div>
                    <div className="text-[10px] text-emerald-700 font-mono font-bold">DIGITALLY VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyQrLink(previewCert.qrVerificationUrl)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copySuccess ? 'Link Copied!' : 'Copy Verification URL'}
                </button>

                <a
                  href={previewCert.qrVerificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-emerald-700 hover:bg-emerald-50 font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Public QR
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewCert(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/20"
                >
                  <Printer className="w-4 h-4" /> Print on Letterhead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Edit Certificate */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Certificate Details</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingCert.certificateSerialNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCertificates((prev) => prev.map((c) => (c.id === editingCert.id ? editingCert : c)));
                setEditingCert(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingCert.studentName}
                  onChange={(e) => setEditingCert({ ...editingCert, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Issuing Signatory / Authority</label>
                <input
                  type="text"
                  required
                  value={editingCert.issuedBy}
                  onChange={(e) => setEditingCert({ ...editingCert, issuedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Purpose / Reason</label>
                <input
                  type="text"
                  required
                  value={editingCert.purpose}
                  onChange={(e) => setEditingCert({ ...editingCert, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={editingCert.remarks || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Certificate Confirmation */}
      {deletingCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Revoke / Delete Certificate</h3>
                <p className="text-xs text-slate-500">Confirm cancellation of certificate record</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingCert.studentName}</div>
              <div className="text-slate-600 font-mono">Serial: <strong>{deletingCert.certificateSerialNo}</strong></div>
              <div className="text-slate-600">Type: <strong>{deletingCert.certificateType.replace('_', ' ')}</strong></div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                ⚠️ Warning: Deleting this certificate will revoke its digital public verification ledger.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCert(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setCertificates((prev) => prev.filter((c) => c.id !== deletingCert.id));
                  setDeletingCert(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Vault Rack Document Location */}
      {editingRackDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Vault Physical Location</h3>
                  <p className="text-[11px] text-slate-500">{editingRackDoc.studentName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRackDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRackDocuments((prev) => prev.map((d) => (d.id === editingRackDoc.id ? editingRackDoc : d)));
                setEditingRackDoc(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Cupboard Tag</label>
                <input
                  type="text"
                  required
                  value={editingRackDoc.cupboard}
                  onChange={(e) => setEditingRackDoc({ ...editingRackDoc, cupboard: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Shelf & Rack Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={editingRackDoc.shelf}
                    onChange={(e) => setEditingRackDoc({ ...editingRackDoc, shelf: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    required
                    value={editingRackDoc.rackCode}
                    onChange={(e) => setEditingRackDoc({ ...editingRackDoc, rackCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Folder No Tag</label>
                <input
                  type="text"
                  required
                  value={editingRackDoc.folderNo}
                  onChange={(e) => setEditingRackDoc({ ...editingRackDoc, folderNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Custody Status</label>
                <select
                  value={editingRackDoc.status}
                  onChange={(e) => setEditingRackDoc({ ...editingRackDoc, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="CUSTODY">CUSTODY - In Vault</option>
                  <option value="RELEASED">RELEASED - Returned to Student</option>
                  <option value="ARCHIVED">ARCHIVED - Permanent Warehouse</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRackDoc(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Vault Rack Document */}
      {deletingRackDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Relinquish / Delete Record</h3>
                <p className="text-xs text-slate-500">Remove document from vault custody tracking</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingRackDoc.studentName}</div>
              <div className="text-slate-600">Doc: <strong>{deletingRackDoc.documentTitle}</strong></div>
              <div className="text-slate-600 font-mono">Location: {deletingRackDoc.cupboard} &bull; {deletingRackDoc.rackCode}</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                Are you sure you want to remove this document record from the vault custody register?
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingRackDoc(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRackDocuments((prev) => prev.filter((d) => d.id !== deletingRackDoc.id));
                  setDeletingRackDoc(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
