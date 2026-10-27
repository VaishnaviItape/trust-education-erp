import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Users,
  Briefcase,
  Camera,
  Upload,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Layers,
  GraduationCap,
  Building,
  RotateCw,
  Droplet,
  Phone,
  FileText,
  AlertCircle,
  Copy,
  ExternalLink,
  Scissors,
} from 'lucide-react';
import { Student, Employee } from '../types';
import {
  IdCardPreview,
  IdCardData,
} from './IdCardPreview';
import {
  IdCardTheme,
  IdCardOrientation,
  IdCardSide,
  THEME_CONFIG,
  PRESET_PHOTOS,
  readFileAsDataUrl,
} from '../utils/idCardUtils';
import { StaffService } from '../utils/staffData';
import { IdCardModal } from './IdCardModal';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';

interface IdCardsModuleProps {
  students: Student[];
  employees?: Employee[];
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onUpdateStudentPhoto?: (studentId: string, photoUrl: string) => void;
  onUpdateEmployeePhoto?: (employeeId: string, photoUrl: string) => void;
}

export const IdCardsModule: React.FC<IdCardsModuleProps> = ({
  students,
  employees: propEmployees,
  selectedBranchScope = 'ALL',
  onUpdateStudentPhoto,
  onUpdateEmployeePhoto,
}) => {
  // Staff state
  const [employees, setEmployees] = useState<Employee[]>(() =>
    propEmployees && propEmployees.length > 0
      ? propEmployees
      : StaffService.getEmployees()
  );

  // Active Main Subtab: 'STUDENTS' | 'STAFF' | 'BULK_A4'
  const [activeSubTab, setActiveSubTab] = useState<'STUDENTS' | 'STAFF' | 'BULK_A4'>('STUDENTS');

  // Filters
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(selectedBranchScope);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [photoFilter, setPhotoFilter] = useState<'ALL' | 'WITH_PHOTO' | 'WITHOUT_PHOTO'>('ALL');

  // Card Studio Design Controls
  const [orientation, setOrientation] = useState<IdCardOrientation>('PORTRAIT');
  const [theme, setTheme] = useState<IdCardTheme>('NAVY');
  const [cardSide, setCardSide] = useState<IdCardSide>('BOTH');

  // Selection for Batch / Bulk Print
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<string>>(new Set());

  // Quick Modal Preview
  const [activeModalCard, setActiveModalCard] = useState<IdCardData | null>(null);

  // Bulk A4 Grid Configuration
  const [cardsPerPage, setCardsPerPage] = useState<number>(6);
  const [bulkSide, setBulkSide] = useState<'FRONT' | 'BACK' | 'BOTH'>('FRONT');

  // Selected Card for Live Side Panel Preview
  const [selectedStudentCardId, setSelectedStudentCardId] = useState<string>(
    students[0]?.id || ''
  );
  const [selectedStaffCardId, setSelectedStaffCardId] = useState<string>(
    employees[0]?.id || ''
  );

  // ---------------------------------------------------------------------------
  // Helpers to convert Student / Employee into standard IdCardData
  // ---------------------------------------------------------------------------
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
      photoUrl:
        s.profilePhotoUrl ||
        (s.gender === 'FEMALE'
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'),
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

  const employeeToCardData = (emp: Employee): IdCardData => {
    const isCollege =
      emp.branch.toLowerCase().includes('hotel') ||
      emp.branch.toLowerCase().includes('hm') ||
      emp.dept.toLowerCase().includes('culinary');

    return {
      type: 'STAFF',
      id: emp.id,
      name: emp.name,
      nameMarathi: emp.nameMarathi,
      photoUrl:
        emp.profilePhotoUrl ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      primaryCode: emp.code,
      secondaryCode: emp.dept,
      badgeLabel: emp.role,
      branchName: emp.branch,
      bloodGroup: emp.bloodGroup || 'O+',
      dobOrJoinDate: emp.joinDate || '2020-06-01',
      dobOrJoinLabel: 'DOJ',
      emergencyPhone: emp.emergencyContact || emp.phone,
      validUpto: emp.validUpto || '2028-05-31',
      address: emp.address || 'Civil Lines, Solapur - 413002',
      signatoryTitle: isCollege ? 'Director' : 'Principal / Trustee',
      staffRef: emp,
    };
  };

  // ---------------------------------------------------------------------------
  // Filtered Students & Staff
  // ---------------------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Branch filter
      if (branchFilter === 'SCHOOL' && s.branchId && s.branchId.includes('hm')) return false;
      if (branchFilter === 'COLLEGE' && s.branchId && !s.branchId.includes('hm')) return false;

      // Grade filter
      if (gradeFilter !== 'ALL' && s.gradeOrSemester && !s.gradeOrSemester.includes(gradeFilter)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesAdm = s.admissionNo.toLowerCase().includes(q);
        const matchesRoll = s.rollNo.toLowerCase().includes(q);
        const matchesGr = (s.grNumber || '').toLowerCase().includes(q);
        if (!matchesName && !matchesAdm && !matchesRoll && !matchesGr) return false;
      }

      // Photo filter
      if (photoFilter === 'WITH_PHOTO' && !s.profilePhotoUrl) return false;
      if (photoFilter === 'WITHOUT_PHOTO' && s.profilePhotoUrl) return false;

      return true;
    });
  }, [students, branchFilter, gradeFilter, searchQuery, photoFilter]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Branch filter
      if (branchFilter === 'SCHOOL' && emp.branch.toLowerCase().includes('hotel')) return false;
      if (branchFilter === 'COLLEGE' && !emp.branch.toLowerCase().includes('hotel')) return false;

      // Dept filter
      if (deptFilter !== 'ALL' && !emp.dept.toLowerCase().includes(deptFilter.toLowerCase())) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesCode = emp.code.toLowerCase().includes(q);
        const matchesRole = emp.role.toLowerCase().includes(q);
        const matchesDept = emp.dept.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesRole && !matchesDept) return false;
      }

      // Photo filter
      if (photoFilter === 'WITH_PHOTO' && !emp.profilePhotoUrl) return false;
      if (photoFilter === 'WITHOUT_PHOTO' && emp.profilePhotoUrl) return false;

      return true;
    });
  }, [employees, branchFilter, deptFilter, searchQuery, photoFilter]);

  // Sorting
  const {
    sortedData: sortedStudents,
    sortKey: studentSortKey,
    sortDirection: studentSortDirection,
    handleSort: handleStudentSort,
  } = useTableSort(filteredStudents, { defaultKey: 'rollNo', defaultDirection: 'asc' });

  const {
    currentPage: studentPage,
    setCurrentPage: setStudentPage,
    pageSize: studentPageSize,
    setPageSize: setStudentPageSize,
    paginatedItems: paginatedStudents,
  } = usePagination(sortedStudents, 10);

  // Sorting for Staff
  const {
    sortedData: sortedEmployees,
    sortKey: staffSortKey,
    sortDirection: staffSortDirection,
    handleSort: handleStaffSort,
  } = useTableSort(filteredEmployees, { defaultKey: 'code', defaultDirection: 'asc' });

  const {
    currentPage: staffPage,
    setCurrentPage: setStaffPage,
    pageSize: staffPageSize,
    setPageSize: setStaffPageSize,
    paginatedItems: paginatedEmployees,
  } = usePagination(sortedEmployees, 10);

  // ---------------------------------------------------------------------------
  // Photo Update Handlers
  // ---------------------------------------------------------------------------
  const handleUpdatePhoto = (cardId: string, type: 'STUDENT' | 'STAFF', newPhotoUrl: string) => {
    if (type === 'STUDENT') {
      if (onUpdateStudentPhoto) {
        onUpdateStudentPhoto(cardId, newPhotoUrl);
      }
    } else {
      const updated = StaffService.updateEmployeePhoto(cardId, newPhotoUrl);
      setEmployees(updated);
      if (onUpdateEmployeePhoto) {
        onUpdateEmployeePhoto(cardId, newPhotoUrl);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Checkbox Selection for Bulk Print
  // ---------------------------------------------------------------------------
  const toggleSelectAllStudents = () => {
    if (selectedStudentIds.size === filteredStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const toggleSelectStudent = (id: string) => {
    const next = new Set(selectedStudentIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStudentIds(next);
  };

  const toggleSelectAllStaff = () => {
    if (selectedStaffIds.size === filteredEmployees.length) {
      setSelectedStaffIds(new Set());
    } else {
      setSelectedStaffIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  const toggleSelectStaff = (id: string) => {
    const next = new Set(selectedStaffIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStaffIds(next);
  };

  // Cards selected for Bulk Print
  const bulkCards: IdCardData[] = useMemo(() => {
    if (activeSubTab === 'STAFF') {
      return employees
        .filter((e) => selectedStaffIds.has(e.id))
        .map(employeeToCardData);
    }
    return students
      .filter((s) => selectedStudentIds.has(s.id))
      .map(studentToCardData);
  }, [activeSubTab, employees, students, selectedStaffIds, selectedStudentIds]);

  // Current Preview Card
  const currentPreviewCard: IdCardData | null = useMemo(() => {
    if (activeSubTab === 'STAFF') {
      const emp = employees.find((e) => e.id === selectedStaffCardId) || employees[0];
      return emp ? employeeToCardData(emp) : null;
    }
    const stu = students.find((s) => s.id === selectedStudentCardId) || students[0];
    return stu ? studentToCardData(stu) : null;
  }, [activeSubTab, selectedStaffCardId, selectedStudentCardId, employees, students]);

  // Trigger Print Dialog or Open Full Card Modal
  const handlePrint = () => {
    if (activeSubTab === 'BULK_A4') {
      window.print();
    } else if (currentPreviewCard) {
      setActiveModalCard(currentPreviewCard);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Module Header (Non-Printable) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                ID Cards Studio & Batch Printing
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                CR-80 PVC Standards
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-definition photographic ID cards with scannable QR verification, barcode security & A4 sheet batch printing.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{activeSubTab === 'BULK_A4' ? 'Print All Sheets' : 'Print Selected ID Card'}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation (Non-Printable) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('STUDENTS')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'STUDENTS'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students ID Cards</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {filteredStudents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('STAFF')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'STAFF'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Staff & Faculty ID Cards</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {filteredEmployees.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('BULK_A4')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'BULK_A4'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Bulk A4 Print Studio</span>
            {bulkCards.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white font-mono font-bold">
                {bulkCards.length} Selected
              </span>
            )}
          </button>
        </div>

        {/* Global Branch Scope Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold">Campus:</span>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-800 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Campus Branches</option>
            <option value="SCHOOL">Modern Public School & Jr College</option>
            <option value="COLLEGE">Modern College of HM & Technology</option>
          </select>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBTAB 1 & 2: STUDENT & STAFF DIRECTORY WITH LIVE SIDE PREVIEW        */}
      {/* ===================================================================== */}
      {(activeSubTab === 'STUDENTS' || activeSubTab === 'STAFF') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Filter Controls & Directory Table (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 print:hidden">
            
            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeSubTab === 'STUDENTS'
                      ? 'Search student name, roll no, admission no...'
                      : 'Search staff name, code, designation, dept...'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Grade / Dept Filter */}
              {activeSubTab === 'STUDENTS' ? (
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Standards</option>
                  <option value="STD 8">Standard 8</option>
                  <option value="STD 7">Standard 7</option>
                  <option value="STD 9">Standard 9</option>
                  <option value="STD 10">Standard 10</option>
                  <option value="Class 1">Class 1</option>
                  <option value="BHMCT">Hotel Mgmt (BHMCT)</option>
                </select>
              ) : (
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Academics">Academics</option>
                  <option value="Culinary">Culinary Arts</option>
                  <option value="Finance">Finance & Accounts</option>
                  <option value="Transport">Transport & Fleet</option>
                  <option value="Hospitality">Hospitality</option>
                </select>
              )}

              {/* Photo Filter */}
              <select
                value={photoFilter}
                onChange={(e) => setPhotoFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Photo Status</option>
                <option value="WITH_PHOTO">Photos Linked</option>
                <option value="WITHOUT_PHOTO">Missing Photo</option>
              </select>
            </div>

            {/* Batch Select Action Bar */}
            <div className="flex items-center justify-between text-xs px-1 text-slate-600">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    activeSubTab === 'STUDENTS' ? toggleSelectAllStudents : toggleSelectAllStaff
                  }
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  {activeSubTab === 'STUDENTS'
                    ? selectedStudentIds.size === filteredStudents.length
                      ? 'Deselect All'
                      : 'Select All Students'
                    : selectedStaffIds.size === filteredEmployees.length
                    ? 'Deselect All'
                    : 'Select All Staff'}
                </button>
                <span>&bull;</span>
                <span>
                  {activeSubTab === 'STUDENTS' ? selectedStudentIds.size : selectedStaffIds.size}{' '}
                  Selected for Bulk Print
                </span>
              </div>

              {(activeSubTab === 'STUDENTS' ? selectedStudentIds.size : selectedStaffIds.size) >
                0 && (
                <button
                  type="button"
                  onClick={() => setActiveSubTab('BULK_A4')}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Preview on A4 Sheet</span>
                </button>
              )}
            </div>

            {/* Listing Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                {activeSubTab === 'STUDENTS' ? (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-8">
                          <input
                            type="checkbox"
                            checked={
                              filteredStudents.length > 0 &&
                              selectedStudentIds.size === filteredStudents.length
                            }
                            onChange={toggleSelectAllStudents}
                            className="rounded text-amber-600 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 w-12">Photo</th>
                        <SortableTh
                          label="Roll No"
                          sortKey="rollNo"
                          currentKey={studentSortKey}
                          direction={studentSortDirection}
                          onSort={handleStudentSort}
                        />
                        <SortableTh
                          label="Student Name"
                          sortKey="name"
                          currentKey={studentSortKey}
                          direction={studentSortDirection}
                          onSort={handleStudentSort}
                        />
                        <th className="p-3">Standard</th>
                        <th className="p-3">Blood</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center p-8 text-slate-400">
                            No students match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedStudents.map((s) => {
                          const isSelected = selectedStudentCardId === s.id;
                          const isChecked = selectedStudentIds.has(s.id);
                          return (
                            <tr
                              key={s.id}
                              onClick={() => setSelectedStudentCardId(s.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/60'
                              }`}
                            >
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSelectStudent(s.id)}
                                  className="rounded text-amber-600 cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <div className="relative group w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                                  <img
                                    src={
                                      s.profilePhotoUrl ||
                                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
                                    }
                                    alt={s.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-800">
                                {s.rollNo}
                              </td>
                              <td className="p-3">
                                <div className="font-extrabold text-slate-900">{s.name}</div>
                                {s.nameMarathi && (
                                  <div className="text-[10px] text-amber-800 font-serif">
                                    {s.nameMarathi}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-slate-600">{s.gradeOrSemester}</td>
                              <td className="p-3 text-rose-600 font-extrabold">
                                {s.bloodGroup || 'O+'}
                              </td>
                              <td className="p-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setActiveModalCard(studentToCardData(s))}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                  title="Open Full Card Modal"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedStudentCardId(s.id);
                                    setActiveModalCard(studentToCardData(s));
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                                  title="Print / View This ID Card"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-8">
                          <input
                            type="checkbox"
                            checked={
                              filteredEmployees.length > 0 &&
                              selectedStaffIds.size === filteredEmployees.length
                            }
                            onChange={toggleSelectAllStaff}
                            className="rounded text-amber-600 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 w-12">Photo</th>
                        <SortableTh
                          label="Emp Code"
                          sortKey="code"
                          currentKey={staffSortKey}
                          direction={staffSortDirection}
                          onSort={handleStaffSort}
                        />
                        <SortableTh
                          label="Employee Name"
                          sortKey="name"
                          currentKey={staffSortKey}
                          direction={staffSortDirection}
                          onSort={handleStaffSort}
                        />
                        <th className="p-3">Designation</th>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center p-8 text-slate-400">
                            No staff members match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedEmployees.map((emp) => {
                          const isSelected = selectedStaffCardId === emp.id;
                          const isChecked = selectedStaffIds.has(emp.id);
                          return (
                            <tr
                              key={emp.id}
                              onClick={() => setSelectedStaffCardId(emp.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/60'
                              }`}
                            >
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSelectStaff(emp.id)}
                                  className="rounded text-amber-600 cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <div className="relative group w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                                  <img
                                    src={
                                      emp.profilePhotoUrl ||
                                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                                    }
                                    alt={emp.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-800">
                                {emp.code}
                              </td>
                              <td className="p-3">
                                <div className="font-extrabold text-slate-900">{emp.name}</div>
                                {emp.nameMarathi && (
                                  <div className="text-[10px] text-amber-800 font-serif">
                                    {emp.nameMarathi}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-slate-700 font-medium">{emp.role}</td>
                              <td className="p-3 text-slate-500">{emp.dept}</td>
                              <td className="p-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setActiveModalCard(employeeToCardData(emp))}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                  title="Open Full Card Modal"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedStaffCardId(emp.id);
                                    setActiveModalCard(employeeToCardData(emp));
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                                  title="Print / View This ID Card"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="p-3 border-t border-slate-200">
                {activeSubTab === 'STUDENTS' ? (
                  <TablePagination
                    currentPage={studentPage}
                    totalItems={filteredStudents.length}
                    pageSize={studentPageSize}
                    onPageChange={setStudentPage}
                    onPageSizeChange={setStudentPageSize}
                  />
                ) : (
                  <TablePagination
                    currentPage={staffPage}
                    totalItems={filteredEmployees.length}
                    pageSize={staffPageSize}
                    onPageChange={setStaffPage}
                    onPageSizeChange={setStaffPageSize}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Card Preview & Studio Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center sticky top-4">
              {/* Top Studio Controls */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-3 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>ID Card Studio Preview</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live CR-80 PVC rendering for selected {activeSubTab === 'STUDENTS' ? 'student' : 'staff'}
                  </p>
                </div>
                {currentPreviewCard && (
                  <button
                    type="button"
                    onClick={() => setActiveModalCard(currentPreviewCard)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Card</span>
                  </button>
                )}
              </div>

              {/* Quick Controls Bar: Orientation, Sides, Theme */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70">
                {/* Orientation */}
                <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setOrientation('PORTRAIT')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      orientation === 'PORTRAIT' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('LANDSCAPE')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      orientation === 'LANDSCAPE' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Landscape
                  </button>
                </div>

                {/* View Side */}
                <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setCardSide('FRONT')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      cardSide === 'FRONT' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardSide('BACK')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      cardSide === 'BACK' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardSide('BOTH')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      cardSide === 'BOTH' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Both
                  </button>
                </div>

                {/* Theme Palette */}
                <div className="flex items-center gap-1">
                  {(Object.keys(THEME_CONFIG) as IdCardTheme[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      title={THEME_CONFIG[t].name}
                      className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                        theme === t ? 'scale-125 border-amber-500 ring-1 ring-amber-400' : 'border-white hover:scale-110 shadow-2xs'
                      }`}
                      style={{ backgroundColor: THEME_CONFIG[t].headerBg }}
                    />
                  ))}
                </div>
              </div>

              {/* Card Rendering Container */}
              <div className="w-full bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-center min-h-[380px] overflow-x-auto">
                {currentPreviewCard ? (
                  <IdCardPreview
                    cardData={currentPreviewCard}
                    orientation={orientation}
                    theme={theme}
                    side={cardSide}
                    onPhotoChange={(newUrl) =>
                      handleUpdatePhoto(currentPreviewCard.id, currentPreviewCard.type, newUrl)
                    }
                  />
                ) : (
                  <div className="text-center text-slate-400 text-xs py-10">
                    <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    Select a student or employee to preview their ID card
                  </div>
                )}
              </div>

              {/* Bottom Tip & Quick Launch Button */}
              {currentPreviewCard && (
                <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">CR-80 PVC (85.6mm × 54mm)</span>
                  <button
                    type="button"
                    onClick={() => setActiveModalCard(currentPreviewCard)}
                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Studio & Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 3: BULK A4 SHEET PRINT STUDIO                                  */}
      {/* ===================================================================== */}
      {activeSubTab === 'BULK_A4' && (
        <div className="space-y-6">
          
          {/* A4 Sheet Control Ribbon (Non-Printable) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  A4 Bulk Sheet Printing Layout
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Batch layout with dashed cutting guidelines &bull; Ready for guillotine cutter or laminate die-punch.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Target Data Selector */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Source:</span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedStudentIds.size === 0) {
                        setSelectedStudentIds(new Set(students.map((s) => s.id)));
                      }
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      bulkCards.length > 0 && bulkCards[0]?.type === 'STUDENT'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Students ({students.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedStaffIds.size === 0) {
                        setSelectedStaffIds(new Set(employees.map((e) => e.id)));
                      }
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      bulkCards.length > 0 && bulkCards[0]?.type === 'STAFF'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Staff ({employees.length})
                  </button>
                </div>
              </div>

              {/* Side Mode */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Print Side:</span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBulkSide('FRONT')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      bulkSide === 'FRONT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Front Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkSide('BACK')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      bulkSide === 'BACK' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Back Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkSide('BOTH')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      bulkSide === 'BOTH' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Front & Back
                  </button>
                </div>
              </div>

              {/* Cards Per Sheet */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Grid:</span>
                <select
                  value={cardsPerPage}
                  onChange={(e) => setCardsPerPage(Number(e.target.value) as any)}
                  className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg font-bold text-xs"
                >
                  {orientation === 'PORTRAIT' ? (
                    <>
                      <option value={6}>6 Cards / Sheet (2 × 3) - Standard Fit</option>
                      <option value={9}>9 Cards / Sheet (3 × 3) - High Density</option>
                    </>
                  ) : (
                    <>
                      <option value={8}>8 Cards / Sheet (2 × 4) - Standard Fit</option>
                      <option value={10}>10 Cards / Sheet (2 × 5) - High Density</option>
                    </>
                  )}
                </select>
              </div>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print All Sheets ({bulkCards.length || students.length} Cards)</span>
              </button>
            </div>
          </div>

          {/* Printable A4 Sheets Container */}
          <div id="printable-bulk-a4-container" className="bg-slate-200/80 p-6 rounded-3xl overflow-x-auto flex flex-col items-center gap-8 print:p-0 print:m-0 print:bg-transparent print:gap-0">
            {(() => {
              const cardsToPrint =
                bulkCards.length > 0
                  ? bulkCards
                  : students.slice(0, 16).map(studentToCardData);

              // Split cards into pages of `cardsPerPage`
              const pages: IdCardData[][] = [];
              for (let i = 0; i < cardsToPrint.length; i += cardsPerPage) {
                pages.push(cardsToPrint.slice(i, i + cardsPerPage));
              }

              return pages.map((pageCards, pageIdx) => (
                <div
                  key={pageIdx}
                  className="bg-white shadow-2xl rounded-xl p-4 w-[210mm] min-h-[297mm] max-h-[297mm] border border-slate-300 flex flex-col justify-between print:w-full print:min-h-screen print:max-h-screen print:shadow-none print:border-none print:p-2 page-break-after id-card-a4-sheet"
                  style={{
                    boxSizing: 'border-box',
                    printColorAdjust: 'exact',
                    WebkitPrintColorAdjust: 'exact',
                  }}
                >
                  {/* Sheet Top Attribution */}
                  <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between text-[10px] text-slate-500 print:mb-2">
                    <div className="font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Zep Foundation Bhose &bull; Official CR-80 ID Card Print Master</span>
                    </div>
                    <div>
                      Page {pageIdx + 1} of {pages.length} &bull; Batch {pageCards.length} Cards
                    </div>
                  </div>

                  {/* Cards Grid with Cutting Guidelines */}
                  <div
                    className={`grid gap-2 sm:gap-3 flex-1 items-center justify-items-center ${
                      orientation === 'PORTRAIT'
                        ? cardsPerPage === 9
                          ? 'grid-cols-3'
                          : 'grid-cols-2'
                        : 'grid-cols-2'
                    }`}
                  >
                    {pageCards.map((card) => (
                      <div
                        key={card.id}
                        className="relative p-1 border border-dashed border-slate-300 rounded-xl bg-slate-50/40 print:border-slate-400 print:bg-transparent"
                      >
                        {/* Little Scissors Cutting Mark in corner */}
                        <div className="absolute -top-1.5 -left-1.5 text-slate-400 print:text-slate-600">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>

                        <IdCardPreview
                          cardData={card}
                          orientation={orientation}
                          theme={theme}
                          side={bulkSide}
                          isPrintMode={true}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Sheet Bottom Footer */}
                  <div className="border-t border-slate-300 pt-2 mt-3 text-center text-[8.5px] text-slate-400 print:mt-1 font-mono">
                    Standard CR-80 PVC Dimensions (85.60 mm × 53.98 mm) &bull; Crop along dashed guidelines &bull; Cryptographically Verified Credentials
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Scoped Print CSS for Bulk A4 Printing */}
          <style>{`
            @media print {
              @page {
                size: A4 portrait;
                margin: 5mm;
              }
              body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-bulk-a4-container,
              #printable-bulk-a4-container * {
                visibility: visible !important;
              }
              #printable-bulk-a4-container {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .id-card-a4-sheet {
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              .id-card-print-card,
              #printable-bulk-a4-container,
              #printable-bulk-a4-container * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}</style>

        </div>
      )}

      {/* Quick Modal Popup for Preview & Photo Upload */}
      {activeModalCard && (
        <IdCardModal
          cardData={activeModalCard}
          isOpen={true}
          onClose={() => setActiveModalCard(null)}
          onPhotoUpdated={(id, newUrl) =>
            handleUpdatePhoto(id, activeModalCard.type, newUrl)
          }
        />
      )}
    </div>
  );
};
