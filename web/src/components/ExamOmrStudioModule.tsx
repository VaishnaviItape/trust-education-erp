import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Scan,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  Camera,
  Layers,
  Award,
  Hash,
  Printer,
  Download,
  Plus,
  Shuffle,
  Search,
  Building,
  Calendar,
  Clock,
  User,
  Grid,
  List,
  FileText,
  Edit3,
  Trash2,
  Filter,
  RefreshCw,
  X,
  UserCheck,
  ChevronDown,
  FileQuestion,
} from 'lucide-react';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';
import { ExamSeatingAllocation } from '../types';
import { PrintableExamSeatingModal } from './PrintableExamSeatingModal';
import { ExamMarksheetStudio } from './ExamMarksheetStudio';
import { QuestionBankPaperStudio } from './QuestionBankPaperStudio';

// Default initial dataset of Exam Seating Allocations
const initialSeatingAllocations: ExamSeatingAllocation[] = [
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
    attendanceStatus: 'PRESENT',
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
    attendanceStatus: 'PRESENT',
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
    attendanceStatus: 'PRESENT',
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
    attendanceStatus: 'PRESENT',
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

export const ExamOmrStudioModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'MARKSHEET' | 'QUESTION_BANK' | 'OMR_SCANNER' | 'ANSWER_KEYS' | 'ONLINE_EXAM' | 'SEATING'>('MARKSHEET');
  const [selectedScanModal, setSelectedScanModal] = useState<any | null>(null);

  // OMR Answer Key
  const [answerKey, setAnswerKey] = useState<Record<string, string>>({
    '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
    '6': 'B', '7': 'C', '8': 'A', '9': 'D', '10': 'B',
  });
  const [positiveMark, setPositiveMark] = useState(1.0);
  const [negativeMark, setNegativeMark] = useState(0.25);

  // Scanned OMR Records
  const [scans, setScans] = useState([
    {
      id: 'scan-01',
      studentName: 'Aarav Sharma',
      rollNo: '7A-01',
      subject: 'Science & Thermal Thermodynamics',
      setCode: 'SET_A',
      recognizedAnswers: {
        '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
        '6': 'B', '7': 'C', '8': 'C', '9': 'D', '10': 'B',
      },
      correctCount: 9,
      wrongCount: 1,
      unattemptedCount: 0,
      score: 8.75, // 9 - 0.25
      maxScore: 10,
      percentage: 87.5,
      confidenceScore: 99.2,
    },
    {
      id: 'scan-02',
      studentName: 'Ananya Patel',
      rollNo: '7A-02',
      subject: 'Science & Thermal Thermodynamics',
      setCode: 'SET_A',
      recognizedAnswers: {
        '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
        '6': 'B', '7': 'C', '8': 'A', '9': 'D', '10': 'B',
      },
      correctCount: 10,
      wrongCount: 0,
      unattemptedCount: 0,
      score: 10.0,
      maxScore: 10,
      percentage: 100.0,
      confidenceScore: 99.8,
    },
  ]);

  // Online Exam Sample Question (with Math & Formula)
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});

  const {
    sortedData: sortedScans,
    sortKey: scanSortKey,
    sortDirection: scanSortDir,
    handleSort: handleScanSort,
  } = useTableSort(scans);

  const {
    currentPage: scanPage,
    setCurrentPage: setScanPage,
    pageSize: scanPageSize,
    setPageSize: setScanPageSize,
    paginatedItems: paginatedScans,
  } = usePagination(sortedScans, 10);

  // =========================================================================
  // EXAM SEATING ARRANGEMENT STATE & REPOSITORY
  // =========================================================================
  const [seatingAllocations, setSeatingAllocations] = useState<ExamSeatingAllocation[]>(() => {
    try {
      const saved = localStorage.getItem('trust_exam_seating_allocations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore JSON parse error
    }
    return initialSeatingAllocations;
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trust_exam_seating_allocations', JSON.stringify(seatingAllocations));
    } catch {
      // ignore
    }
  }, [seatingAllocations]);

  // Optionally attempt fetch from backend on mount
  useEffect(() => {
    const fetchBackendSeating = async () => {
      try {
        const res = await fetch('/api/enterprise/exams/seating');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.allocations) && data.allocations.length > 0) {
            setSeatingAllocations(data.allocations);
          }
        }
      } catch {
        // Backend offline or running in mock mode - local state continues seamlessly
      }
    };
    fetchBackendSeating();
  }, []);

  // Seating Filters
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('ALL');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('ALL');
  const [seatingSearchQuery, setSeatingSearchQuery] = useState<string>('');
  const [seatingStatusFilter, setSeatingStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'VISUAL_GRID'>('TABLE');
  const [selectedDeskDetails, setSelectedDeskDetails] = useState<ExamSeatingAllocation | null>(null);

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printInitialExam, setPrintInitialExam] = useState<string>('ALL');
  const [printInitialRoom, setPrintInitialRoom] = useState<string>('ALL');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<ExamSeatingAllocation | null>(null);

  const [isAutoAllocateModalOpen, setIsAutoAllocateModalOpen] = useState(false);

  // Add / Edit form state
  const [formData, setFormData] = useState<Partial<ExamSeatingAllocation>>({
    examName: 'Term-End Examination (October 2026)',
    subject: 'Science & Thermal Thermodynamics',
    subjectCode: 'SCI-301',
    examDate: new Date().toISOString().split('T')[0],
    examTime: '10:00 AM - 01:00 PM (Morning Session)',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Prof. R. S. Kulkarni',
    rollNo: '',
    studentName: '',
    hallTicketNo: '',
    benchNo: 'Bench 01-A (Window)',
    classOrGrade: 'Class 10-A',
    notes: '',
  });

  // Auto-allocate form state
  const [autoForm, setAutoForm] = useState({
    examName: 'Term-End Examination (October 2026)',
    roomNo: 'Room 201 - Science Block',
    class1: 'Standard 10-A (Secondary School)',
    class2: 'B.Sc Hotel Management Sem 3 (College)',
    benchCount: 8,
  });

  // Extract unique exams & rooms for filter drop-downs
  const availableExams = useMemo(() => {
    const set = new Set<string>();
    seatingAllocations.forEach((a) => {
      if (a.examName) set.add(a.examName);
    });
    return Array.from(set);
  }, [seatingAllocations]);

  const availableRooms = useMemo(() => {
    const set = new Set<string>();
    seatingAllocations.forEach((a) => {
      if (a.roomNo) set.add(a.roomNo);
    });
    return Array.from(set);
  }, [seatingAllocations]);

  // Filtered Seating Records
  const filteredSeating = useMemo(() => {
    return seatingAllocations.filter((item) => {
      const matchExam = selectedExamFilter === 'ALL' || item.examName === selectedExamFilter;
      const matchRoom = selectedRoomFilter === 'ALL' || item.roomNo === selectedRoomFilter;
      const matchStatus = seatingStatusFilter === 'ALL' || item.attendanceStatus === seatingStatusFilter;

      const q = seatingSearchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.studentName.toLowerCase().includes(q) ||
        item.rollNo.toLowerCase().includes(q) ||
        item.hallTicketNo.toLowerCase().includes(q) ||
        item.benchNo.toLowerCase().includes(q) ||
        item.examName.toLowerCase().includes(q) ||
        (item.classOrGrade && item.classOrGrade.toLowerCase().includes(q));

      return matchExam && matchRoom && matchStatus && matchSearch;
    });
  }, [seatingAllocations, selectedExamFilter, selectedRoomFilter, seatingStatusFilter, seatingSearchQuery]);

  // Seating Table Sorting & Pagination
  const {
    sortedData: sortedSeating,
    sortKey: seatingSortKey,
    sortDirection: seatingSortDir,
    handleSort: handleSeatingSort,
  } = useTableSort(filteredSeating, { defaultKey: 'srNo', defaultDirection: 'asc' });

  const {
    currentPage: seatingPage,
    setCurrentPage: setSeatingPage,
    pageSize: seatingPageSize,
    setPageSize: setSeatingPageSize,
    paginatedItems: paginatedSeating,
  } = usePagination(sortedSeating, 10);

  // Attendance Toggle
  const toggleAttendance = (id: string) => {
    setSeatingAllocations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: 'PRESENT' | 'ABSENT' | 'ALLOCATED' =
            item.attendanceStatus === 'ALLOCATED'
              ? 'PRESENT'
              : item.attendanceStatus === 'PRESENT'
              ? 'ABSENT'
              : 'ALLOCATED';
          return { ...item, attendanceStatus: nextStatus };
        }
        return item;
      })
    );
  };

  // Open Edit Modal
  const handleEditClick = (item: ExamSeatingAllocation) => {
    setEditingAllocation(item);
    setFormData({ ...item });
    setIsAddEditModalOpen(true);
  };

  // Open Add Modal
  const handleAddNewClick = () => {
    setEditingAllocation(null);
    const nextSr = seatingAllocations.length + 1;
    setFormData({
      examName: selectedExamFilter !== 'ALL' ? selectedExamFilter : (availableExams[0] || 'Term-End Examination (October 2026)'),
      subject: 'Science & Thermal Thermodynamics',
      subjectCode: 'SCI-301',
      examDate: new Date().toISOString().split('T')[0],
      examTime: '10:00 AM - 01:00 PM (Morning Session)',
      roomNo: selectedRoomFilter !== 'ALL' ? selectedRoomFilter : 'Room 201 - Science Block',
      blockNo: 'Block 1',
      invigilatorName: 'Prof. R. S. Kulkarni',
      rollNo: `7A-${String(nextSr).padStart(2, '0')}`,
      studentName: '',
      admissionNo: `SCH-2026-${String(nextSr).padStart(3, '0')}`,
      hallTicketNo: `HT-2026-${100 + nextSr}`,
      benchNo: `Bench ${String(Math.ceil(nextSr / 2)).padStart(2, '0')}-${nextSr % 2 === 1 ? 'A (Window)' : 'B (Aisle)'}`,
      classOrGrade: 'Class 10-A',
      notes: '',
    });
    setIsAddEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.rollNo || !formData.examName) {
      alert('Please fill Exam Name, Student Name, and Roll Number.');
      return;
    }

    if (editingAllocation) {
      setSeatingAllocations((prev) =>
        prev.map((item) => (item.id === editingAllocation.id ? ({ ...item, ...formData } as ExamSeatingAllocation) : item))
      );
    } else {
      const nextSrNo = seatingAllocations.filter((a) => a.examName === formData.examName).length + 1;
      const newItem: ExamSeatingAllocation = {
        id: `seat-alloc-${Date.now()}`,
        examName: formData.examName || 'Annual Board Examination 2026',
        subject: formData.subject || 'General Assessment',
        subjectCode: formData.subjectCode || 'EX-GEN',
        examDate: formData.examDate || new Date().toISOString().split('T')[0],
        examTime: formData.examTime || '10:00 AM - 01:00 PM',
        roomNo: formData.roomNo || 'Room 201 - Science Block',
        blockNo: formData.blockNo || 'Block 1',
        invigilatorName: formData.invigilatorName || 'Invigilator',
        srNo: nextSrNo,
        rollNo: formData.rollNo || 'ROLL-01',
        studentName: formData.studentName || 'Student Name',
        admissionNo: formData.admissionNo || `ADM-${Date.now().toString().slice(-4)}`,
        hallTicketNo: formData.hallTicketNo || `HT-2026-${100 + nextSrNo}`,
        benchNo: formData.benchNo || `Bench ${String(Math.ceil(nextSrNo / 2)).padStart(2, '0')}-A`,
        classOrGrade: formData.classOrGrade || 'Class 10-A',
        attendanceStatus: 'ALLOCATED',
        notes: formData.notes || '',
      };
      setSeatingAllocations((prev) => [...prev, newItem]);
    }
    setIsAddEditModalOpen(false);
  };

  // Delete Allocation
  const handleDeleteAllocation = (id: string, name: string) => {
    if (confirm(`Remove seating allocation for "${name}"?`)) {
      setSeatingAllocations((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Auto-allocate anti-cheat matrix
  const handleRunAutoAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(autoForm.benchCount) * 2;
    const isSchoolRoom = autoForm.roomNo.includes('Science') || autoForm.roomNo.includes('104') || autoForm.roomNo.includes('Room');

    const generated: ExamSeatingAllocation[] = [];
    for (let i = 0; i < count; i++) {
      const isOdd = i % 2 === 0;
      const benchIndex = Math.floor(i / 2) + 1;
      const benchPos = isOdd ? 'A (Window)' : 'B (Aisle)';
      const studentClass = isOdd ? autoForm.class1 : autoForm.class2;
      const isSchoolStudent = studentClass.includes('10') || studentClass.includes('School');

      const sampleNamesSchool = [
        'Aarav Sharma', 'Ananya Patel', 'Rohan Deshmukh', 'Diya Joshi',
        'Aafan Ali A', 'Tanvi Kadam', 'Sameer Shaikh', 'Priya Shirodkar',
        'Omkar Jadhav', 'Nisha Verma', 'Kunal Shinde', 'Gauri Kulkarni'
      ];
      const sampleNamesCollege = [
        'Kabir Verma', 'Pooja Kulkarni', 'Aditya Mane', 'Sneha Patil',
        'Vikram Shinde', 'Neha Gaikwad', 'Gaurav Sawant', 'Mayur Shinde',
        'Shruti More', 'Akash Salunkhe', 'Pranita Bagal', 'Sachin Pawar'
      ];

      const name = isSchoolStudent
        ? sampleNamesSchool[Math.floor(i / 2) % sampleNamesSchool.length]
        : sampleNamesCollege[Math.floor(i / 2) % sampleNamesCollege.length];

      const roll = isSchoolStudent
        ? `10A-${String(Math.floor(i / 2) + 1).padStart(2, '0')}`
        : `HM-${100 + Math.floor(i / 2) + 1}`;

      generated.push({
        id: `seat-auto-${Date.now()}-${i}`,
        examName: autoForm.examName,
        subject: isSchoolStudent ? 'Science & Mathematics' : 'Culinary Operations & Food Safety',
        subjectCode: isSchoolStudent ? 'SCI-101' : 'HM-201',
        examDate: '2026-10-31',
        examTime: '10:00 AM - 01:00 PM',
        roomNo: autoForm.roomNo,
        blockNo: 'Interleaved Anti-Collusion Wing',
        invigilatorName: 'Prof. R. S. Kulkarni & Mrs. Anjali Deshmukh',
        srNo: i + 1,
        rollNo: roll,
        studentName: `${name} (${isSchoolStudent ? 'School' : 'College'})`,
        admissionNo: isSchoolStudent ? `SCH-2026-${100 + i}` : `HM-2026-${200 + i}`,
        hallTicketNo: `HT-2026-${300 + i}`,
        benchNo: `Bench ${String(benchIndex).padStart(2, '0')}-${benchPos}`,
        classOrGrade: isSchoolStudent ? 'Class 10-A' : 'B.Sc HM Sem 3',
        branchName: isSchoolStudent ? 'Saraswati International Public School' : 'Modern College of Hotel Management and Technology',
        attendanceStatus: 'ALLOCATED',
        notes: 'Generated via anti-collusion interleaving engine',
      });
    }

    setSeatingAllocations((prev) => [...prev, ...generated]);
    setIsAutoAllocateModalOpen(false);
    setSelectedExamFilter(autoForm.examName);
    setSelectedRoomFilter(autoForm.roomNo);
  };

  // CSV Export for Seating
  const handleExportCSV = () => {
    const headers = [
      'Sr No',
      'Roll No',
      'Student Name',
      'Exam Name',
      'Subject',
      'Date',
      'Time',
      'Room No',
      'Bench No',
      'Hall Ticket No',
      'Class',
      'Attendance Status',
    ];

    const rows = filteredSeating.map((a, idx) => [
      a.srNo || idx + 1,
      `"${a.rollNo}"`,
      `"${a.studentName}"`,
      `"${a.examName}"`,
      `"${a.subject || ''}"`,
      `"${a.examDate || ''}"`,
      `"${a.examTime || ''}"`,
      `"${a.roomNo}"`,
      `"${a.benchNo}"`,
      `"${a.hallTicketNo}"`,
      `"${a.classOrGrade || ''}"`,
      `"${a.attendanceStatus || 'ALLOCATED'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Exam_Seating_Arrangement_${selectedExamFilter !== 'ALL' ? selectedExamFilter : 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Examinations, Online Tests & OMR Computer Vision
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                AI Vision + Seating Studio
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Corner alignment anchors, answer keys with +/- marks, scanned bubble verification modal & seating matrix printout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('MARKSHEET')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'MARKSHEET'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Teacher Marksheet
          </button>
          <button
            onClick={() => setActiveSubTab('QUESTION_BANK')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'QUESTION_BANK'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
            }`}
          >
            <FileQuestion className="w-4 h-4" /> Question Bank & Papers
          </button>
          <button
            onClick={() => setActiveSubTab('SEATING')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Seating
          </button>
          <button
            onClick={() => setActiveSubTab('OMR_SCANNER')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Scan OMR Batch
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'MARKSHEET', label: 'Teacher Marksheet & Grading Studio' },
          { id: 'QUESTION_BANK', label: 'Question Bank & Papers (Maths, मराठी, हिंदी)' },
          { id: 'OMR_SCANNER', label: 'OMR Vision Scanner & Results' },
          { id: 'ANSWER_KEYS', label: 'Answer Key & Penalty Marking' },
          { id: 'ONLINE_EXAM', label: 'Online Test Engine (LaTeX Math)' },
          { id: 'SEATING', label: 'Exam Seating Arrangement & Print Studio' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === t.id
                ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 0: TEACHER MARKSHEET & EVALUATION STUDIO */}
      {/* ========================================================================= */}
      {activeSubTab === 'MARKSHEET' && (
        <ExamMarksheetStudio />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 0.5: MULTI-LINGUAL QUESTION BANK & QUESTION PAPER STUDIO */}
      {/* ========================================================================= */}
      {activeSubTab === 'QUESTION_BANK' && (
        <QuestionBankPaperStudio />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: OMR COMPUTER VISION SCANNER */}
      {/* ========================================================================= */}
      {activeSubTab === 'OMR_SCANNER' && (
        <div className="space-y-4">
          {/* Visual Sheet Anchor Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wider">
                OMR Corner Anchor Specification
              </span>
              <h3 className="text-base font-bold text-slate-900">
                4-Corner Fiducial Anchor Computer Vision Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zep Foundation ERP prints high-contrast black square fiducial markers at all four corners of every
                OMR sheet. When teachers photograph sheets via mobile camera or flatbed scanner, the backend
                auto-corrects skew, perspective, and optical distortion before thresholding bubble darkness.
              </p>
            </div>

            {/* Visual Mini OMR Sheet Graphic */}
            <div className="w-48 h-32 rounded-2xl bg-white border-2 border-slate-300 p-2 relative shadow-inner shrink-0 flex flex-col justify-between">
              {/* 4 Corner Anchors */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-slate-900"></div>
              <div className="absolute top-1 right-1 w-3 h-3 bg-slate-900"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 bg-slate-900"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-slate-900"></div>

              <div className="text-[8px] font-bold text-slate-800 text-center uppercase tracking-tighter">
                TrustEdu OMR - 100 Q
              </div>

              <div className="space-y-1 my-auto">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[7px] font-mono text-slate-600">Q1</span>
                  <div className="w-2 h-2 rounded-full border border-slate-800 bg-slate-900"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[7px] font-mono text-slate-600">Q2</span>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800 bg-slate-900"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                </div>
              </div>

              <div className="text-[6px] text-center text-slate-400 font-mono">
                FIDUCIAL ALIGNED • 300 DPI
              </div>
            </div>
          </div>

          {/* Scanned Results Table */}
          <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recognized OMR Scans & Auto-Scoring
              </h3>
            </div>
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="rollNo" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" className="w-12" />
                    <SortableTh label="Candidate / Roll" sortKey="studentName" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} />
                    <SortableTh label="Subject & Set" sortKey="subject" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} />
                    <SortableTh label="Correct" sortKey="correctCount" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" />
                    <SortableTh label="Wrong (-0.25)" sortKey="wrongCount" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" />
                    <SortableTh label="Computed Score" sortKey="score" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="right" />
                    <SortableTh label="AI Confidence" sortKey="confidenceScore" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" />
                    <th className="p-3.5 text-center">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedScans.map((s, index) => {
                    const globalIndex = (scanPage - 1) * scanPageSize + index + 1;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{globalIndex}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{s.studentName}</div>
                          <div className="text-[10px] font-mono text-orange-600">{s.rollNo}</div>
                        </td>
                        <td className="p-3.5 text-slate-700">
                          {s.subject} ({s.setCode})
                        </td>
                        <td className="p-3.5 text-center text-emerald-700 font-bold font-mono">
                          {s.correctCount}
                        </td>
                        <td className="p-3.5 text-center text-rose-700 font-bold font-mono">
                          {s.wrongCount}
                        </td>
                        <td className="p-3.5 text-right font-black text-slate-900 font-mono">
                          {s.score} / {s.maxScore} ({s.percentage}%)
                        </td>
                        <td className="p-3.5 text-center text-slate-600 font-mono">
                          {s.confidenceScore}%
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedScanModal(s)}
                            className="flex items-center gap-1 mx-auto px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect Bubbles
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* OMR Scans Table Pagination Controls */}
            <TablePagination
              currentPage={scanPage}
              totalItems={sortedScans.length}
              pageSize={scanPageSize}
              pageSizeOptions={[5, 10, 25, 50]}
              onPageChange={setScanPage}
              onPageSizeChange={setScanPageSize}
              itemName="scans"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ANSWER KEYS & PENALTY MARKING */}
      {/* ========================================================================= */}
      {activeSubTab === 'ANSWER_KEYS' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Master Answer Key & Scoring Policy</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Positive Marks per Correct Answer
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={positiveMark}
                  onChange={(e) => setPositiveMark(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-emerald-700 font-bold font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Negative Penalty per Wrong Answer
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={negativeMark}
                  onChange={(e) => setNegativeMark(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-rose-700 font-bold font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-700 mb-2">Question-by-Question Key (1 - 10):</div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {Object.keys(answerKey).map((qNo) => (
                  <div key={qNo} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-mono">Q{qNo}</div>
                    <div className="text-sm font-black text-orange-600 font-mono mt-0.5">
                      {answerKey[qNo]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: ONLINE EXAM ENGINE WITH MATHEMATICAL EQUATIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'ONLINE_EXAM' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                Time-Limited Online Test
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Thermodynamics & Food Chemistry Midterm Exam
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-mono text-xs font-bold text-orange-700 border border-slate-200">
              ⏱ 42:15 Remaining
            </div>
          </div>

          {/* MathLive / KaTeX equation sample */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-500">QUESTION 1:</div>
              <div className="text-sm font-medium text-slate-800">
                In thermal pastry baking, calculate the heat required using the specific heat capacity formula:
              </div>

              {/* KaTeX Styled Equation Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center font-mono text-amber-900 text-sm">
                {"\\( Q = m \\cdot c \\cdot \\Delta T \\) \u00A0\u00A0 where \u00A0\u00A0 \\( \\Delta T = T_{oven} - T_{ambient} \\)"}
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { opt: 'A', text: 'Q represents thermal energy absorbed in Joules (J)' },
                  { opt: 'B', text: 'Q represents pressure in atmospheres (atm)' },
                  { opt: 'C', text: 'Q represents chemical acidity pH' },
                  { opt: 'D', text: 'None of the above' },
                ].map((choice) => (
                  <label
                    key={choice.opt}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer text-xs text-slate-800 transition-colors shadow-2xs"
                  >
                    <input
                      type="radio"
                      name="q1"
                      checked={examAnswers['1'] === choice.opt}
                      onChange={() => setExamAnswers({ ...examAnswers, '1': choice.opt })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-bold text-orange-600 font-mono">({choice.opt})</span>
                    <span>{choice.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: EXAM SEATING ARRANGEMENT & PRINT STUDIO (FULL IMPLEMENTATION)  */}
      {/* ========================================================================= */}
      {activeSubTab === 'SEATING' && (
        <div className="space-y-6">
          {/* Top Seating Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Benched Candidates
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">{seatingAllocations.length}</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Allocated in Benches
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Exams
              </span>
              <div className="text-2xl font-black text-orange-600 font-mono">{availableExams.length}</div>
              <div className="text-[11px] text-slate-500">Scheduled Sessions</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Exam Halls Active
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">{availableRooms.length}</div>
              <div className="text-[11px] text-slate-500">Airy ventilated rooms</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Anti-Cheat Interleave
              </span>
              <div className="text-2xl font-black text-emerald-700 font-mono">100%</div>
              <div className="text-[11px] text-slate-500">Zero-Adjacency Guaranteed</div>
            </div>
          </div>

          {/* Seating Toolbar & Filter Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-600" />
                  Examination Seating Arrangement & Print Cell
                </h3>
                <p className="text-xs text-slate-500">
                  Search, filter, allocate, and print official door notice charts and desk stickers with Exam Name, Sr. No., Roll No. & Student Name.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setPrintInitialExam(selectedExamFilter);
                    setPrintInitialRoom(selectedRoomFilter);
                    setIsPrintModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Seating Chart</span>
                </button>

                <button
                  onClick={() => setIsAutoAllocateModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs transition-all cursor-pointer"
                  title="Interleave School Standard 10 and College Hotel Mgmt students to prevent collusion"
                >
                  <Shuffle className="w-4 h-4 text-amber-700" />
                  <span>Auto Anti-Cheat Allocation</span>
                </button>

                <button
                  onClick={handleAddNewClick}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Seating Entry</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student, roll #, hall ticket..."
                  value={seatingSearchQuery}
                  onChange={(e) => setSeatingSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Exam Name Filter */}
              <div>
                <select
                  value={selectedExamFilter}
                  onChange={(e) => setSelectedExamFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="ALL">All Exams ({availableExams.length})</option>
                  {availableExams.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room / Hall Filter */}
              <div>
                <select
                  value={selectedRoomFilter}
                  onChange={(e) => setSelectedRoomFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="ALL">All Rooms ({availableRooms.length})</option>
                  {availableRooms.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={seatingStatusFilter}
                  onChange={(e) => setSeatingStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="ALL">All Attendance Status</option>
                  <option value="ALLOCATED">Allocated</option>
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>

              {/* View Switcher (Table vs Visual Grid) */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('TABLE')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'TABLE' ? 'bg-white text-orange-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('VISUAL_GRID')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'VISUAL_GRID' ? 'bg-white text-orange-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> 2D Hall Grid
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: DATA TABLE */}
          {viewMode === 'TABLE' && (
            <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Candidate Seating Allocation Roster ({filteredSeating.length} Records)
                  </h3>
                  {selectedExamFilter !== 'ALL' && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                      {selectedExamFilter}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Click on status badge to toggle <strong className="text-emerald-700">Present</strong> / <strong className="text-rose-700">Absent</strong>
                </div>
              </div>

              <div className="erp-table-scroll">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                    <tr>
                      <SortableTh label="Sr. No." sortKey="srNo" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} align="center" className="w-12" />
                      <SortableTh label="Roll No." sortKey="rollNo" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} align="center" className="w-24" />
                      <SortableTh label="Candidate Name" sortKey="studentName" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} />
                      <SortableTh label="Exam Name & Subject" sortKey="examName" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} />
                      <SortableTh label="Room & Bench" sortKey="roomNo" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} />
                      <SortableTh label="Class / Dept" sortKey="classOrGrade" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} />
                      <SortableTh label="Hall Ticket" sortKey="hallTicketNo" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} align="center" />
                      <SortableTh label="Status" sortKey="attendanceStatus" currentKey={seatingSortKey} direction={seatingSortDir} onSort={handleSeatingSort} align="center" />
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedSeating.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500">
                          <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                          No seating allocations match your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedSeating.map((item, index) => {
                        const globalIndex = (seatingPage - 1) * seatingPageSize + index + 1;
                        const isSchool = item.classOrGrade.includes('10') || item.classOrGrade.includes('8') || item.classOrGrade.includes('Class');
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Sr No */}
                            <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">
                              {item.srNo || globalIndex}
                            </td>

                            {/* Roll No */}
                            <td className="p-3.5 text-center">
                              <span className="inline-block px-2 py-0.5 font-black font-mono text-xs rounded-md bg-slate-100 text-slate-900 border border-slate-300">
                                {item.rollNo}
                              </span>
                            </td>

                            {/* Student Name */}
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{item.studentName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Adm: {item.admissionNo || 'N/A'}
                              </div>
                            </td>

                            {/* Exam Name & Subject */}
                            <td className="p-3.5">
                              <div className="font-bold text-orange-950 truncate max-w-xs">{item.examName}</div>
                              <div className="text-[11px] text-slate-500">{item.subject}</div>
                            </td>

                            {/* Room & Bench */}
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{item.roomNo}</div>
                              <div className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
                                {item.benchNo}
                              </div>
                            </td>

                            {/* Class */}
                            <td className="p-3.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isSchool
                                    ? 'bg-orange-50 text-orange-800 border-orange-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {item.classOrGrade}
                              </span>
                            </td>

                            {/* Hall Ticket No */}
                            <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                              {item.hallTicketNo}
                            </td>

                            {/* Status (Clickable Toggle) */}
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => toggleAttendance(item.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all border ${
                                  item.attendanceStatus === 'PRESENT'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                                    : item.attendanceStatus === 'ABSENT'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-2xs'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                                title="Click to cycle status"
                              >
                                {item.attendanceStatus || 'ALLOCATED'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPrintInitialExam(item.examName);
                                    setPrintInitialRoom(item.roomNo);
                                    setIsPrintModalOpen(true);
                                  }}
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700 transition-colors cursor-pointer"
                                  title="Print exam seating chart for this room"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(item)}
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                  title="Edit Allocation"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAllocation(item.id, item.studentName)}
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                                  title="Remove Allocation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

              {/* Pagination */}
              <TablePagination
                currentPage={seatingPage}
                totalItems={filteredSeating.length}
                pageSize={seatingPageSize}
                pageSizeOptions={[5, 10, 25, 50]}
                onPageChange={setSeatingPage}
                onPageSizeChange={setSeatingPageSize}
                itemName="candidates"
              />
            </div>
          )}

          {/* VIEW MODE 2: 2D INTERACTIVE ROOM LAYOUT GRID */}
          {viewMode === 'VISUAL_GRID' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    2D Examination Hall Floor Plan Layout
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visualizing zero-adjacent anti-collusion interleaving between School and College benches.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>School Class 10 / 8</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                    <span>College Hotel Mgmt</span>
                  </div>
                </div>
              </div>

              {/* Invigilator Podium at Room Front */}
              <div className="max-w-md mx-auto p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-center text-xs font-bold text-slate-700 shadow-2xs">
                🎓 CHIEF INVIGILATOR PODIUM & QUESTION PAPER DISPATCH TABLE
              </div>

              {/* Desks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {filteredSeating.map((b) => {
                  const isSchool = b.classOrGrade.includes('10') || b.classOrGrade.includes('8') || b.classOrGrade.includes('Class');
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedDeskDetails(b)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer space-y-2 hover:shadow-md ${
                        isSchool
                          ? 'bg-orange-50/40 border-orange-300 hover:border-orange-500'
                          : 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span className="font-mono">{b.benchNo}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            isSchool ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isSchool ? 'SCHOOL' : 'COLLEGE'}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-slate-900 truncate">{b.studentName}</div>
                        <div className="text-[11px] font-mono font-bold text-slate-700">Roll: {b.rollNo}</div>
                      </div>

                      <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                        <span>{b.hallTicketNo}</span>
                        <span className="font-bold text-slate-700">{b.attendanceStatus}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clicked Desk Inspector Card */}
              {selectedDeskDetails && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-900 text-sm">
                      Desk Selected: {selectedDeskDetails.benchNo} • {selectedDeskDetails.studentName}
                    </div>
                    <div className="text-slate-600">
                      Roll No: <strong>{selectedDeskDetails.rollNo}</strong> • Hall Ticket: <strong>{selectedDeskDetails.hallTicketNo}</strong> • Class: <strong>{selectedDeskDetails.classOrGrade}</strong>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Exam: {selectedDeskDetails.examName} ({selectedDeskDetails.subject})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAttendance(selectedDeskDetails.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer shadow-2xs"
                    >
                      Status: {selectedDeskDetails.attendanceStatus}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDeskDetails(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT SEATING ENTRY MODAL */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl p-6 text-slate-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" />
                {editingAllocation ? 'Edit Exam Seating Allocation' : 'Add Candidate Seat Allocation'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAllocation} className="space-y-4 text-xs">
              {/* Exam Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Examination Name *</label>
                <input
                  type="text"
                  required
                  list="examNamesList"
                  value={formData.examName || ''}
                  onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                  placeholder="e.g. Term-End Examination (October 2026)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:bg-white focus:outline-none focus:border-orange-500"
                />
                <datalist id="examNamesList">
                  {availableExams.map((e) => (
                    <option key={e} value={e} />
                  ))}
                  <option value="Annual Board Examination 2026" />
                  <option value="Term-End Examination (October 2026)" />
                  <option value="Semester Final Assessment - Culinary Arts" />
                  <option value="Unit Test III - Science & Mathematics" />
                </datalist>
              </div>

              {/* Subject & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Paper Name</label>
                  <input
                    type="text"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Science & Thermal Thermodynamics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={formData.subjectCode || ''}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    placeholder="e.g. SCI-301"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Student Name & Roll No (The key fields requested by user) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-orange-50/50 p-3.5 rounded-2xl border border-orange-200">
                <div>
                  <label className="block font-bold text-orange-900 mb-1">Candidate / Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName || ''}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-orange-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-orange-900 mb-1">Roll Number (roller nu) *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo || ''}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="e.g. 7A-01 or HM-101"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-orange-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              {/* Hall Ticket & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hall Ticket No.</label>
                  <input
                    type="text"
                    value={formData.hallTicketNo || ''}
                    onChange={(e) => setFormData({ ...formData, hallTicketNo: e.target.value })}
                    placeholder="e.g. HT-2026-101"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Department</label>
                  <input
                    type="text"
                    value={formData.classOrGrade || ''}
                    onChange={(e) => setFormData({ ...formData, classOrGrade: e.target.value })}
                    placeholder="e.g. Class 10-A or B.Sc HM Sem 3"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Room & Bench */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Examination Hall / Room</label>
                  <input
                    type="text"
                    list="roomList"
                    value={formData.roomNo || ''}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    placeholder="e.g. Room 201 - Science Block"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                  <datalist id="roomList">
                    {availableRooms.map((r) => (
                      <option key={r} value={r} />
                    ))}
                    <option value="Room 201 - Science Block" />
                    <option value="Hall 104 - Junior Wing" />
                    <option value="Auditorium Exam Annex" />
                    <option value="Basic Training Kitchen Hall" />
                  </datalist>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bench / Desk Number</label>
                  <input
                    type="text"
                    value={formData.benchNo || ''}
                    onChange={(e) => setFormData({ ...formData, benchNo: e.target.value })}
                    placeholder="e.g. Bench 01-A (Window)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-orange-700 focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Date, Time & Invigilator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={formData.examDate || ''}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Timing / Session</label>
                  <input
                    type="text"
                    value={formData.examTime || ''}
                    onChange={(e) => setFormData({ ...formData, examTime: e.target.value })}
                    placeholder="10:00 AM - 01:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Invigilator</label>
                  <input
                    type="text"
                    value={formData.invigilatorName || ''}
                    onChange={(e) => setFormData({ ...formData, invigilatorName: e.target.value })}
                    placeholder="e.g. Prof. R. S. Kulkarni"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  {editingAllocation ? 'Update Allocation' : 'Save Seat Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTO-GENERATE ANTI-CHEAT SEATING MODAL */}
      {/* ========================================================================= */}
      {isAutoAllocateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-amber-600" />
                Automated Anti-Collusion Seating Engine
              </h3>
              <button
                type="button"
                onClick={() => setIsAutoAllocateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This engine alternates candidates across two different standards or departments (e.g. School Standard 10 and College Hotel Management), guaranteeing that adjacent desks never take the same exam paper or belong to the same peer group.
            </p>

            <form onSubmit={handleRunAutoAllocate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Exam Name</label>
                <input
                  type="text"
                  required
                  value={autoForm.examName}
                  onChange={(e) => setAutoForm({ ...autoForm, examName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Examination Hall / Room</label>
                <input
                  type="text"
                  required
                  value={autoForm.roomNo}
                  onChange={(e) => setAutoForm({ ...autoForm, roomNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-orange-900 mb-1">Class 1 (Left Desk A)</label>
                  <input
                    type="text"
                    required
                    value={autoForm.class1}
                    onChange={(e) => setAutoForm({ ...autoForm, class1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-orange-50 border border-orange-300 font-bold text-orange-950 focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Class 2 (Right Desk B)</label>
                  <input
                    type="text"
                    required
                    value={autoForm.class2}
                    onChange={(e) => setAutoForm({ ...autoForm, class2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 font-bold text-emerald-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Dual Benches to Allocate</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={autoForm.benchCount}
                  onChange={(e) => setAutoForm({ ...autoForm, benchCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold focus:bg-white focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Will generate {autoForm.benchCount * 2} candidate seat records ({autoForm.benchCount} desks x 2 seats per desk).
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAutoAllocateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Generate Conflict-Free Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE SEATING ARRANGEMENT MODAL (DEDICATED A4 PRINT PREVIEW) */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <PrintableExamSeatingModal
          allocations={seatingAllocations}
          initialExamName={printInitialExam}
          initialRoomNo={printInitialRoom}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* INSPECT BUBBLES VISUAL VERIFICATION MODAL */}
      {/* ========================================================================= */}
      {selectedScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scan className="w-4 h-4 text-orange-600" /> OMR Bubble Recognition Inspector
              </h3>
              <button
                type="button"
                onClick={() => setSelectedScanModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Candidate: <strong>{selectedScanModal.studentName}</strong> • Roll: {selectedScanModal.rollNo} • Score: {selectedScanModal.score}/{selectedScanModal.maxScore}
            </div>

            {/* Bubble grid showing recognized values vs answer key */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {Object.keys(selectedScanModal.recognizedAnswers).map((qNo) => {
                const rec = selectedScanModal.recognizedAnswers[qNo];
                const key = answerKey[qNo];
                const isCorrect = rec === key;

                return (
                  <div
                    key={qNo}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500">Q{qNo}:</span>
                      <span className="font-bold text-slate-900">Marked: [{rec}]</span>
                      <span className="text-slate-500">• Key: [{key}]</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? '+1.0 Correct' : '-0.25 Penalty'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedScanModal(null)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer border border-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
