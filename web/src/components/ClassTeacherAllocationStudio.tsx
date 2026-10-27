import React, { useState, useEffect, useMemo } from 'react';
import {
  DoorOpen,
  UserCheck,
  GraduationCap,
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Building,
  Edit3,
  UserMinus,
  Sparkles,
  LayoutGrid,
  List,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  X,
  RotateCcw,
} from 'lucide-react';
import { ClassroomAllocation } from '../types';
import { getInstitutionDetails } from '../utils/documentUtils';
import { useTableSort, SortableTh } from './TableSort';
import { usePagination, TablePagination } from './TablePagination';
import { INITIAL_TEACHERS, INITIAL_CLASSROOMS } from '../utils/masterData';

interface ClassTeacherAllocationStudioProps {
  currentBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  academicYear?: string;
}

// Initial fallback allocation roster
const DEFAULT_ALLOCATIONS: ClassroomAllocation[] = [
  {
    id: 'alloc-rm-01',
    branchScope: 'SCHOOL',
    branchId: 'branch-sch-01',
    academicYear: '2026-2027',
    classroomId: 'rm-sch-101',
    classroomName: 'Room 101 (Smart Interactive Board)',
    roomCode: 'SCH-101',
    roomType: 'CLASSROOM',
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
    roomType: 'CLASSROOM',
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
    roomType: 'CLASSROOM',
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
    roomType: 'KITCHEN_LAB',
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
    roomType: 'KITCHEN_LAB',
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
    roomType: 'SCIENCE_LAB',
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

const STANDARD_RESPONSIBILITIES = [
  'Daily Roll Call Attendance Signoff',
  'Report Card & Marksheet Signoff',
  'Discipline & Conduct Records (Leaving Certificate)',
  'Parent-Teacher Association (PTA) Liaison',
  'Classroom Smart Board & Asset Custody',
  'Student Mentorship & Guidance',
  'Student Leave Application Approval',
];

export const ClassTeacherAllocationStudio: React.FC<ClassTeacherAllocationStudioProps> = ({
  currentBranchScope = 'ALL',
  academicYear = '2026-2027',
}) => {
  // State
  const [allocations, setAllocations] = useState<ClassroomAllocation[]>(() => {
    try {
      const saved = localStorage.getItem('trust_classroom_allocations');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ALLOCATIONS;
  });

  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(currentBranchScope);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'VACANT' | 'SUBSTITUTE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Modal
  const [editingAllocation, setEditingAllocation] = useState<Partial<ClassroomAllocation> | null>(null);

  // Synchronize when currentBranchScope prop changes
  useEffect(() => {
    if (currentBranchScope !== 'ALL') {
      setScopeFilter(currentBranchScope);
    }
  }, [currentBranchScope]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('trust_classroom_allocations', JSON.stringify(allocations));
    } catch {
      // ignore
    }
  }, [allocations]);

  // Fetch initial allocations from backend API if available
  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/enterprise/classrooms/allocations');
        if (res.ok) {
          const data = await res.json();
          if (data.allocations && data.allocations.length > 0) {
            setAllocations(data.allocations);
          }
        }
      } catch {
        // use local fallback
      }
    };
    fetchAllocations();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Filtered Allocations
  const filteredAllocations = useMemo(() => {
    return allocations.filter((item) => {
      if (scopeFilter !== 'ALL' && item.branchScope !== scopeFilter) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.classroomName.toLowerCase().includes(q) ||
        item.roomCode.toLowerCase().includes(q) ||
        item.classOrGrade.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q) ||
        (item.specializationSubject || '').toLowerCase().includes(q) ||
        (item.wing || '').toLowerCase().includes(q)
      );
    });
  }, [allocations, scopeFilter, statusFilter, searchQuery]);

  // Table Sorting
  const {
    sortedData: sortedAllocations,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<ClassroomAllocation>(filteredAllocations, {
    defaultKey: 'roomCode',
    defaultDirection: 'asc',
  });

  // Table Pagination
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems,
  } = usePagination(sortedAllocations, 8);

  // Summary Statistics
  const stats = useMemo(() => {
    const totalRooms = allocations.length;
    const assignedRooms = allocations.filter((a) => a.status !== 'VACANT' && a.teacherName !== 'Unassigned').length;
    const vacantRooms = totalRooms - assignedRooms;
    const totalStudents = allocations.reduce((acc, a) => acc + (a.enrolledStudentsCount || 0), 0);
    const avgStudentsPerClass = assignedRooms > 0 ? Math.round(totalStudents / assignedRooms) : 0;
    return { totalRooms, assignedRooms, vacantRooms, totalStudents, avgStudentsPerClass };
  }, [allocations]);

  // Conflict Detection for Form
  const teacherConflict = useMemo(() => {
    if (!editingAllocation || !editingAllocation.teacherName || editingAllocation.teacherName === 'Unassigned') {
      return null;
    }
    const match = allocations.find(
      (a) =>
        a.teacherName === editingAllocation.teacherName &&
        a.id !== editingAllocation.id &&
        a.status === 'ACTIVE'
    );
    if (match) {
      return `${editingAllocation.teacherName} is currently assigned as Class Teacher for ${match.classOrGrade} (${match.classroomName}). Assigning here will transfer class in-charge mentorship.`;
    }
    return null;
  }, [editingAllocation, allocations]);

  // Open Modal for New Allocation
  const handleOpenNewModal = () => {
    setEditingAllocation({
      id: `alloc-rm-${Date.now()}`,
      branchScope: scopeFilter === 'ALL' ? 'SCHOOL' : scopeFilter,
      academicYear,
      classroomId: 'rm-sch-101',
      classroomName: 'Room 101 (Smart Interactive Board)',
      roomCode: 'SCH-101',
      roomType: 'CLASSROOM',
      wing: 'North Wing',
      floor: '1st Floor',
      capacity: 45,
      classOrGrade: 'Class 9-A',
      division: 'A',
      enrolledStudentsCount: 36,
      teacherId: '',
      teacherName: '',
      teacherDesignation: 'Trained Graduate Teacher (TGT)',
      specializationSubject: 'Science & Mathematics',
      responsibilities: [
        'Daily Roll Call Attendance Signoff',
        'Report Card & Marksheet Signoff',
        'Discipline & Conduct Records (Leaving Certificate)',
        'Parent-Teacher Association (PTA) Liaison',
      ],
      classTeacherMeetingHours: '08:30 AM - 09:00 AM (Zero Period)',
      status: 'ACTIVE',
      assignedDate: new Date().toISOString().split('T')[0],
      remarks: '',
    });
    setShowAssignModal(true);
  };

  // Open Modal for Edit Allocation
  const handleEditAllocation = (alloc: ClassroomAllocation) => {
    setEditingAllocation({ ...alloc });
    setShowAssignModal(true);
  };

  // Vacate Allocation
  const handleVacateRoom = async (alloc: ClassroomAllocation) => {
    const updated: ClassroomAllocation = {
      ...alloc,
      teacherId: '',
      teacherName: 'Unassigned',
      teacherEmail: '',
      teacherPhone: '',
      status: 'VACANT',
      remarks: `Vacated by admin on ${new Date().toLocaleDateString()}. Previously in-charge: ${alloc.teacherName}`,
    };

    setAllocations((prev) => prev.map((a) => (a.id === alloc.id ? updated : a)));
    triggerToast(`Classroom ${alloc.classroomName} vacated. Class teacher unassigned.`);

    try {
      await fetch(`http://localhost:5000/api/enterprise/classrooms/allocations/${alloc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // offline
    }
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAllocation) return;

    const fullAllocation: ClassroomAllocation = {
      id: editingAllocation.id || `alloc-rm-${Date.now()}`,
      branchScope: editingAllocation.branchScope || 'SCHOOL',
      branchId: editingAllocation.branchScope === 'COLLEGE' ? 'branch-hm-01' : 'branch-sch-01',
      academicYear: editingAllocation.academicYear || academicYear,
      classroomId: editingAllocation.classroomId || `rm-${Date.now()}`,
      classroomName: editingAllocation.classroomName || 'Standard Classroom',
      roomCode: editingAllocation.roomCode || 'ROOM-STD',
      roomType: editingAllocation.roomType || 'CLASSROOM',
      wing: editingAllocation.wing || 'Academic Wing',
      floor: editingAllocation.floor || '1st Floor',
      capacity: Number(editingAllocation.capacity) || 45,
      classOrGrade: editingAllocation.classOrGrade || 'Class Standard',
      division: editingAllocation.division || 'A',
      enrolledStudentsCount: Number(editingAllocation.enrolledStudentsCount) || 30,
      teacherId: editingAllocation.teacherId || '',
      teacherName: editingAllocation.teacherName || 'Unassigned',
      teacherEmail: editingAllocation.teacherEmail,
      teacherPhone: editingAllocation.teacherPhone,
      teacherDesignation: editingAllocation.teacherDesignation || 'Faculty Member',
      specializationSubject: editingAllocation.specializationSubject || '',
      coTeacherId: editingAllocation.coTeacherId,
      coTeacherName: editingAllocation.coTeacherName,
      coTeacherSubject: editingAllocation.coTeacherSubject,
      responsibilities: editingAllocation.responsibilities || STANDARD_RESPONSIBILITIES.slice(0, 4),
      classTeacherMeetingHours: editingAllocation.classTeacherMeetingHours || '08:30 AM - 09:00 AM',
      status: editingAllocation.teacherName && editingAllocation.teacherName !== 'Unassigned' ? 'ACTIVE' : 'VACANT',
      assignedDate: editingAllocation.assignedDate || new Date().toISOString().split('T')[0],
      remarks: editingAllocation.remarks || '',
    };

    setAllocations((prev) => {
      const idx = prev.findIndex((a) => a.id === fullAllocation.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = fullAllocation;
        return next;
      }
      return [fullAllocation, ...prev];
    });

    triggerToast(`Class Teacher "${fullAllocation.teacherName}" successfully assigned to ${fullAllocation.classroomName}!`);
    setShowAssignModal(false);

    // Save to API
    try {
      await fetch('http://localhost:5000/api/enterprise/classrooms/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullAllocation),
      });
    } catch {
      // offline
    }
  };

  // Auto-Assign Vacant Classrooms
  const handleAutoAssignVacant = () => {
    const unassignedTeachers = INITIAL_TEACHERS.filter(
      (t) => !allocations.some((a) => a.teacherName === t.name && a.status === 'ACTIVE')
    );

    let assignedCount = 0;
    const updated = allocations.map((alloc) => {
      if (alloc.status === 'VACANT' || alloc.teacherName === 'Unassigned') {
        const match = unassignedTeachers.find(
          (t) => t.branchScope === alloc.branchScope || alloc.branchScope === 'SCHOOL'
        );
        if (match) {
          assignedCount++;
          // Remove used teacher
          const idx = unassignedTeachers.indexOf(match);
          if (idx >= 0) unassignedTeachers.splice(idx, 1);

          return {
            ...alloc,
            teacherId: match.id,
            teacherName: match.name,
            teacherEmail: match.email,
            teacherPhone: match.phone,
            teacherDesignation: 'Faculty Mentor',
            specializationSubject: match.qualification,
            status: 'ACTIVE' as const,
            remarks: 'Auto-assigned by Academic Coordinator engine',
          };
        }
      }
      return alloc;
    });

    if (assignedCount > 0) {
      setAllocations(updated);
      triggerToast(`Automated engine paired ${assignedCount} available faculty with vacant classrooms!`);
    } else {
      triggerToast('All classrooms already have active class teachers or no available faculty.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Room Code',
      'Classroom Name',
      'Branch',
      'Wing & Floor',
      'Class / Section',
      'Capacity',
      'Enrolled Students',
      'Class Teacher Name',
      'Teacher Designation',
      'Subject Specialization',
      'Co-Class Teacher',
      'Parent Meeting Hours',
      'Status',
    ];

    const rows = allocations.map((a) => [
      `"${a.roomCode}"`,
      `"${a.classroomName}"`,
      `"${a.branchScope}"`,
      `"${a.wing}, ${a.floor}"`,
      `"${a.classOrGrade}"`,
      a.capacity,
      a.enrolledStudentsCount,
      `"${a.teacherName}"`,
      `"${a.teacherDesignation || ''}"`,
      `"${a.specializationSubject || ''}"`,
      `"${a.coTeacherName || 'None'}"`,
      `"${a.classTeacherMeetingHours || ''}"`,
      `"${a.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Class_Teacher_Allocations_${academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Class Teacher Allocation Directory exported as CSV!');
  };

  const institution = getInstitutionDetails(
    scopeFilter === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xl border border-emerald-700 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <DoorOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Classroom & Class Teacher Allocation Studio
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                Academic Year {academicYear}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Assign designated Class In-Charges to classrooms, manage section mentors, room capacities, and student roll calls
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAutoAssignVacant}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
            title="Automatically pair unassigned faculty with vacant classrooms"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto-Assign Vacant</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Notice Board Print</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Class Teacher</span>
          </button>
        </div>
      </div>

      {/* 2. Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <DoorOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Rooms & Labs</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.totalRooms}</div>
            <div className="text-[11px] text-slate-500">School & College Wings</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Class Teachers</div>
            <div className="text-xl font-extrabold text-emerald-700">{stats.assignedRooms}</div>
            <div className="text-[11px] text-emerald-600 font-medium">In-Charges Assigned</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vacant / Unassigned</div>
            <div className="text-xl font-extrabold text-rose-600">{stats.vacantRooms}</div>
            <div className="text-[11px] text-slate-500">Awaiting Mentors</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enrolled Students</div>
            <div className="text-xl font-extrabold text-blue-700">{stats.totalStudents}</div>
            <div className="text-[11px] text-slate-500">Avg {stats.avgStudentsPerClass} / class</div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Branch Scope Pills */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setScopeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                scopeFilter === 'ALL' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Campuses
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('SCHOOL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                scopeFilter === 'SCHOOL' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School (MPS Bhose)
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('COLLEGE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                scopeFilter === 'COLLEGE' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              College (MCHMT Solapur)
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Assigned (Active)</option>
            <option value="VACANT">Vacant / Unassigned</option>
            <option value="SUBSTITUTE">Temporary Substitute</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teacher, room, class..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Roster View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('CARDS')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'CARDS' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Classroom Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      {viewMode === 'TABLE' ? (
        /* Tabular Roster View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <SortableTh label="Room & Code" sortKey="roomCode" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5 w-44" />
                  <SortableTh label="Class / Section" sortKey="classOrGrade" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5 w-36" />
                  <SortableTh label="Designated Class Teacher" sortKey="teacherName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5 min-w-[220px]" />
                  <th className="p-3.5 w-36">Location</th>
                  <th className="p-3.5 w-32">Capacity</th>
                  <th className="p-3.5 min-w-[180px]">Meeting Hours</th>
                  <SortableTh label="Status" sortKey="status" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="p-3.5 w-24 text-center" />
                  <th className="p-3.5 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((alloc) => {
                    const isVacant = alloc.status === 'VACANT' || alloc.teacherName === 'Unassigned';
                    const fillPercent = alloc.capacity > 0 ? Math.round((alloc.enrolledStudentsCount / alloc.capacity) * 100) : 0;

                    return (
                      <tr key={alloc.id} className="hover:bg-orange-50/20 transition-colors group">
                        {/* Room & Code */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <DoorOpen className="w-3.5 h-3.5 text-orange-600" />
                            <span>{alloc.classroomName}</span>
                          </div>
                          <div className="font-mono text-[11px] font-semibold text-orange-700 mt-0.5">
                            {alloc.roomCode}
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                              {alloc.branchScope}
                            </span>
                          </div>
                        </td>

                        {/* Class / Section */}
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-800 font-extrabold border border-orange-200/80">
                            <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                            {alloc.classOrGrade}
                          </span>
                        </td>

                        {/* Designated Class Teacher */}
                        <td className="p-3.5">
                          {isVacant ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              Vacant / Unassigned
                            </span>
                          ) : (
                            <div>
                              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-bold text-[10px]">
                                  {alloc.teacherName.charAt(0)}
                                </div>
                                <span>{alloc.teacherName}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {alloc.teacherDesignation} {alloc.specializationSubject ? `• ${alloc.specializationSubject}` : ''}
                              </div>
                              {alloc.coTeacherName && (
                                <div className="text-[10px] text-amber-700 mt-0.5 font-medium">
                                  Co-Teacher: {alloc.coTeacherName}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Location */}
                        <td className="p-3.5 text-slate-600">
                          <div>{alloc.wing}</div>
                          <div className="text-[11px] text-slate-400">{alloc.floor}</div>
                        </td>

                        {/* Capacity Utilization */}
                        <td className="p-3.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                            <span>{alloc.enrolledStudentsCount} Enrolled</span>
                            <span className="text-slate-400">/ {alloc.capacity}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                fillPercent > 90 ? 'bg-amber-500' : fillPercent > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${Math.min(fillPercent, 100)}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 text-right mt-0.5">{fillPercent}% full</div>
                        </td>

                        {/* Meeting Hours */}
                        <td className="p-3.5">
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{alloc.classTeacherMeetingHours || '08:30 AM - 09:00 AM'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Zero Period & Parent Hours</div>
                        </td>

                        {/* Status */}
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              alloc.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : alloc.status === 'SUBSTITUTE'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {alloc.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditAllocation(alloc)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition-colors cursor-pointer"
                              title="Assign or Reassign Class Teacher"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {!isVacant && (
                              <button
                                type="button"
                                onClick={() => handleVacateRoom(alloc)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                title="Vacate Classroom"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <DoorOpen className="w-10 h-10 mx-auto text-slate-300 mb-2 opacity-50" />
                      <div className="text-sm font-bold text-slate-600">No classroom allocations found</div>
                      <div className="text-xs text-slate-400 mt-1">Try adjusting your campus or status filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-3 border-t border-slate-200">
            <TablePagination
              currentPage={currentPage}
              totalItems={sortedAllocations.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      ) : (
        /* Visual Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAllocations.map((alloc) => {
            const isVacant = alloc.status === 'VACANT' || alloc.teacherName === 'Unassigned';
            const fillPercent = alloc.capacity > 0 ? Math.round((alloc.enrolledStudentsCount / alloc.capacity) * 100) : 0;

            return (
              <div
                key={alloc.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md ${
                  isVacant ? 'border-dashed border-rose-300 bg-rose-50/20' : 'border-slate-200/90'
                }`}
              >
                {/* Door Header Plaque */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                        {alloc.roomCode}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {alloc.branchScope}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-1">{alloc.classroomName}</h3>
                    <div className="text-[11px] text-slate-500">{alloc.wing} • {alloc.floor}</div>
                  </div>

                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      alloc.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : alloc.status === 'SUBSTITUTE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {alloc.status}
                  </span>
                </div>

                {/* Hosted Class Badge */}
                <div className="my-3 p-2.5 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-600" />
                    <span className="font-black text-xs text-orange-900">{alloc.classOrGrade}</span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-700">
                    {alloc.enrolledStudentsCount} / {alloc.capacity} Students ({fillPercent}%)
                  </span>
                </div>

                {/* Teacher Profile */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Designated Class In-Charge</div>
                  {isVacant ? (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                      <div className="text-xs font-bold text-rose-700">No Teacher Assigned</div>
                      <div className="text-[10px] text-rose-500 mt-0.5">Click below to allocate a classroom in-charge</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {alloc.teacherName.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-xs text-slate-900 truncate">{alloc.teacherName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{alloc.teacherDesignation}</div>
                        <div className="text-[10px] text-orange-700 font-semibold truncate">{alloc.specializationSubject}</div>
                      </div>
                    </div>
                  )}

                  {/* Co-Teacher */}
                  {alloc.coTeacherName && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <span className="font-bold text-slate-700">Associate Mentor: </span>
                      <span>{alloc.coTeacherName}</span>
                    </div>
                  )}

                  {/* Meeting Hours */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Parent Meeting: {alloc.classTeacherMeetingHours}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditAllocation(alloc)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isVacant ? 'Assign Teacher' : 'Reassign / Edit'}</span>
                  </button>

                  {!isVacant && (
                    <button
                      type="button"
                      onClick={() => handleVacateRoom(alloc)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      title="Vacate room"
                    >
                      Vacate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: ASSIGN / REASSIGN CLASS TEACHER TO CLASSROOM */}
      {/* ========================================================================= */}
      {showAssignModal && editingAllocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <DoorOpen className="w-5 h-5" />
                <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
                  Assign Class Teacher to Classroom
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Conflict Warning Box */}
              {teacherConflict && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider text-amber-800">
                      Dual Mentorship / Conflict Warning
                    </div>
                    <div className="text-xs mt-0.5">{teacherConflict}</div>
                  </div>
                </div>
              )}

              {/* Campus Scope & Room Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Scope</label>
                  <select
                    value={editingAllocation.branchScope}
                    onChange={(e) =>
                      setEditingAllocation((prev) => ({
                        ...prev,
                        branchScope: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="SCHOOL">School (Modern Public School & Jr College)</option>
                    <option value="COLLEGE">College (Modern College of Hotel Management)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classroom / Laboratory</label>
                  <select
                    value={editingAllocation.classroomId}
                    onChange={(e) => {
                      const selectedRm = INITIAL_CLASSROOMS.find((r) => r.id === e.target.value);
                      if (selectedRm) {
                        setEditingAllocation((prev) => ({
                          ...prev,
                          classroomId: selectedRm.id,
                          classroomName: selectedRm.name,
                          roomCode: selectedRm.roomCode,
                          roomType: selectedRm.type,
                          wing: selectedRm.wing,
                          floor: selectedRm.floor,
                          capacity: selectedRm.capacity,
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20"
                  >
                    {INITIAL_CLASSROOMS.filter(
                      (r) =>
                        !editingAllocation.branchScope ||
                        r.branchScope === editingAllocation.branchScope ||
                        r.branchScope === 'ALL'
                    ).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomCode} - {r.name} ({r.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class Name & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Class Standard / Academic Section <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAllocation.classOrGrade || ''}
                    onChange={(e) =>
                      setEditingAllocation((prev) => ({ ...prev, classOrGrade: e.target.value }))
                    }
                    placeholder="e.g. Class 10-A / B.Sc Hospitality Sem-3"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrolled Strength</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingAllocation.enrolledStudentsCount || ''}
                    onChange={(e) =>
                      setEditingAllocation((prev) => ({
                        ...prev,
                        enrolledStudentsCount: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Designated Primary Class Teacher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designated Primary Class Teacher (In-Charge) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editingAllocation.teacherName || ''}
                    onChange={(e) => {
                      const tName = e.target.value;
                      const teacher = INITIAL_TEACHERS.find((t) => t.name === tName);
                      if (teacher) {
                        setEditingAllocation((prev) => ({
                          ...prev,
                          teacherId: teacher.id,
                          teacherName: teacher.name,
                          teacherEmail: teacher.email,
                          teacherPhone: teacher.phone,
                          specializationSubject: teacher.qualification,
                          status: 'ACTIVE',
                        }));
                      } else {
                        setEditingAllocation((prev) => ({
                          ...prev,
                          teacherId: '',
                          teacherName: tName,
                          status: tName === 'Unassigned' ? 'VACANT' : 'ACTIVE',
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="">-- Select Faculty In-Charge --</option>
                    <option value="Unassigned">-- Mark Room as Vacant / Unassigned --</option>
                    {INITIAL_TEACHERS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.qualification}) - {t.branchScope}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associate / Co-Class Teacher</label>
                  <select
                    value={editingAllocation.coTeacherName || ''}
                    onChange={(e) =>
                      setEditingAllocation((prev) => ({
                        ...prev,
                        coTeacherName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="">-- None (Solo Class Teacher) --</option>
                    {INITIAL_TEACHERS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.qualification})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meeting Hours & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Class Teacher Meeting / Zero Period Hours
                  </label>
                  <input
                    type="text"
                    value={editingAllocation.classTeacherMeetingHours || ''}
                    onChange={(e) =>
                      setEditingAllocation((prev) => ({
                        ...prev,
                        classTeacherMeetingHours: e.target.value,
                      }))
                    }
                    placeholder="e.g. 08:30 AM - 09:00 AM (Daily)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assignment Status</label>
                  <select
                    value={editingAllocation.status}
                    onChange={(e) =>
                      setEditingAllocation((prev) => ({
                        ...prev,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="ACTIVE">ACTIVE (Designated In-Charge)</option>
                    <option value="SUBSTITUTE">SUBSTITUTE (Temporary Proctor)</option>
                    <option value="VACANT">VACANT (Awaiting Teacher)</option>
                  </select>
                </div>
              </div>

              {/* Responsibilities Checklist */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Class Teacher Statutory Privileges & Oversight Responsibilities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {STANDARD_RESPONSIBILITIES.map((resp) => {
                    const isChecked = editingAllocation.responsibilities?.includes(resp);
                    return (
                      <label key={resp} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = editingAllocation.responsibilities || [];
                            if (e.target.checked) {
                              setEditingAllocation((prev) => ({
                                ...prev,
                                responsibilities: [...cur, resp],
                              }));
                            } else {
                              setEditingAllocation((prev) => ({
                                ...prev,
                                responsibilities: cur.filter((r) => r !== resp),
                              }));
                            }
                          }}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-[11px] text-slate-700">{resp}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Administrative Remarks</label>
                <input
                  type="text"
                  value={editingAllocation.remarks || ''}
                  onChange={(e) =>
                    setEditingAllocation((prev) => ({ ...prev, remarks: e.target.value }))
                  }
                  placeholder="e.g. Science stream primary mentor; weekly PTA hours on Saturdays."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                >
                  Save Class Teacher Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: OFFICIAL NOTICE BOARD PRINT CHART */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-sm">Official Notice Board Class Teacher Directory</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Letterhead Paper */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0">
              {/* Trust & Campus Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-500">
                  {institution.trustName}
                </div>
                <div className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  {institution.name}
                </div>
                <div className="text-xs text-slate-600">
                  {institution.address} • Phone: {institution.phone} • Email: {institution.email}
                </div>
                <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-md font-bold text-xs text-slate-800 tracking-wide">
                  OFFICIAL CLASS TEACHER & CLASSROOM ALLOCATION DIRECTORY ({academicYear})
                </div>
              </div>

              {/* Roster Table */}
              <table className="w-full text-left border-collapse text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-[11px]">
                    <th className="p-2 border-r border-slate-300 text-center w-10">Sr.</th>
                    <th className="p-2 border-r border-slate-300 w-32">Room & Code</th>
                    <th className="p-2 border-r border-slate-300 w-28">Standard / Div</th>
                    <th className="p-2 border-r border-slate-300">Designated Class Teacher</th>
                    <th className="p-2 border-r border-slate-300">Associate Mentor</th>
                    <th className="p-2 border-r border-slate-300 w-36">Location</th>
                    <th className="p-2 text-center w-24">Parent Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAllocations.map((alloc, idx) => (
                    <tr key={alloc.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-bold text-slate-500 border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-200">
                        {alloc.roomCode}
                        <div className="text-[10px] text-slate-500 font-sans">{alloc.classroomName}</div>
                      </td>
                      <td className="p-2 font-extrabold text-orange-900 border-r border-slate-200">
                        {alloc.classOrGrade}
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{alloc.teacherName}</div>
                        <div className="text-[10px] text-slate-500">
                          {alloc.teacherDesignation} {alloc.specializationSubject ? `• ${alloc.specializationSubject}` : ''}
                        </div>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        {alloc.coTeacherName || '—'}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600 text-[11px]">
                        {alloc.wing}, {alloc.floor}
                      </td>
                      <td className="p-2 text-center text-[10px] text-slate-600">
                        {alloc.classTeacherMeetingHours || '08:30-09:00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Statutory Signatures */}
              <div className="pt-12 grid grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    Class Teacher Coordinator
                  </div>
                  <div className="text-[10px] text-slate-500">Academic Committee</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    Vice Principal / Dean
                  </div>
                  <div className="text-[10px] text-slate-500">Curriculum & Student Affairs</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    Campus Director / Principal
                  </div>
                  <div className="text-[10px] text-slate-500">Official Institutional Seal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
