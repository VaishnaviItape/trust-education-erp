import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Award,
  Printer,
  Download,
  Sparkles,
  Save,
  RotateCcw,
  Search,
  BookOpen,
  Calendar,
  Check,
  TrendingUp,
  X,
  Filter,
  Eye,
  GraduationCap,
} from 'lucide-react';
import { Student, MarksheetStudentEntry, StudentGrade } from '../types';
import { getInstitutionDetails } from '../utils/documentUtils';
import { useTableSort, SortableTh } from './TableSort';
import { usePagination, TablePagination } from './TablePagination';

interface ExamMarksheetStudioProps {
  initialStudents?: Student[];
  currentBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  academicYear?: string;
}

// Standard Master Exams
const standardExams = [
  'Term-End Examination (October 2026)',
  'Mid-Term Assessment 2026-2027',
  'Unit Test 1 (Formative Evaluation)',
  'Unit Test 2 (Formative Evaluation)',
  'Pre-Board Mock Examination',
  'Kitchen Practical Assessment (Hotel Mgmt)',
];

// Standard Master Subjects by Stream
const schoolSubjects = [
  'Science & Thermal Thermodynamics',
  'Mathematics & Geometry',
  'English Language & Literature',
  'Social Sciences & Geography',
  'Marathi Bhasha & Grammar',
  'Hindi Rashtrabhasha',
  'Computer Studies & IT',
];

const collegeSubjects = [
  'Culinary Fundamentals & Food Chemistry',
  'Food & Beverage Service Practical',
  'Bakery & Confectionery Arts',
  'Front Office Operations & Management',
  'Hospitality Accounts & Costing',
  'Hotel Housekeeping Operations',
];

// Fallback Default Students if API is starting up
const defaultRosterStudents: Student[] = [
  {
    id: 'stu-s01',
    name: 'Aarav Sharma',
    nameMarathi: 'आरव शर्मा',
    admissionNo: 'SCH-2026-001',
    rollNo: '7A-01',
    gradeOrSemester: 'Class 7-A',
    branchId: 'branch-sch-01',
    branchName: 'Saraswati International Public School',
    gender: 'MALE',
    feeTotal: 36000,
    feePaid: 24000,
    feePending: 12000,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98220 12345',
  },
  {
    id: 'stu-s02',
    name: 'Ananya Patel',
    nameMarathi: 'अनन्या पटेल',
    admissionNo: 'SCH-2026-002',
    rollNo: '7A-02',
    gradeOrSemester: 'Class 7-A',
    branchId: 'branch-sch-01',
    branchName: 'Saraswati International Public School',
    gender: 'FEMALE',
    feeTotal: 36000,
    feePaid: 36000,
    feePending: 0,
    attendancePercent: 98,
    kycStatus: 'VERIFIED',
    parentName: 'Bhavin Patel',
    parentPhone: '+91 98220 54321',
  },
  {
    id: 'stu-s03',
    name: 'Rohan Deshmukh',
    nameMarathi: 'रोहन देशमुख',
    admissionNo: 'SCH-2026-003',
    rollNo: '7A-03',
    gradeOrSemester: 'Class 7-A',
    branchId: 'branch-sch-01',
    branchName: 'Saraswati International Public School',
    gender: 'MALE',
    feeTotal: 36000,
    feePaid: 18000,
    feePending: 18000,
    attendancePercent: 88,
    kycStatus: 'VERIFIED',
    parentName: 'Sanjay Deshmukh',
    parentPhone: '+91 98220 99887',
  },
  {
    id: 'stu-s04',
    name: 'Diya Joshi',
    nameMarathi: 'दिया जोशी',
    admissionNo: 'SCH-2026-004',
    rollNo: '7A-04',
    gradeOrSemester: 'Class 7-A',
    branchId: 'branch-sch-01',
    branchName: 'Saraswati International Public School',
    gender: 'FEMALE',
    feeTotal: 36000,
    feePaid: 20000,
    feePending: 16000,
    attendancePercent: 94,
    kycStatus: 'VERIFIED',
    parentName: 'Vikram Joshi',
    parentPhone: '+91 98220 77665',
  },
  {
    id: 'stu-s05',
    name: 'Aditya Suresh Patil',
    nameMarathi: 'आदित्य सुरेश पाटील',
    admissionNo: 'SCH-2026-005',
    rollNo: '10A-01',
    gradeOrSemester: 'Class 10-A',
    branchId: 'branch-sch-01',
    branchName: 'Saraswati International Public School',
    gender: 'MALE',
    feeTotal: 42000,
    feePaid: 42000,
    feePending: 0,
    attendancePercent: 97,
    kycStatus: 'VERIFIED',
    parentName: 'Suresh Patil',
    parentPhone: '+91 98220 11223',
  },
  {
    id: 'stu-s06',
    name: 'Sneha Milind Kulkarni',
    nameMarathi: 'स्नेहा मिलिंद कुलकर्णी',
    admissionNo: 'SCH-2026-006',
    rollNo: '10A-02',
    gradeOrSemester: 'Class 10-A',
    branchId: 'branch-sch-01',
    branchName: 'Saraswati International Public School',
    gender: 'FEMALE',
    feeTotal: 42000,
    feePaid: 30000,
    feePending: 12000,
    attendancePercent: 95,
    kycStatus: 'VERIFIED',
    parentName: 'Milind Kulkarni',
    parentPhone: '+91 98220 33445',
  },
  {
    id: 'stu-hm01',
    name: 'Kabir Verma',
    nameMarathi: 'कबीर वर्मा',
    admissionNo: 'HM-2026-101',
    rollNo: 'HM-101',
    gradeOrSemester: 'B.Sc HM Semester 3',
    branchId: 'branch-hm-01',
    branchName: 'Modern College of Hotel Management and Technology',
    gender: 'MALE',
    feeTotal: 75000,
    feePaid: 50000,
    feePending: 25000,
    attendancePercent: 92,
    kycStatus: 'VERIFIED',
    parentName: 'Sanjay Verma',
    parentPhone: '+91 98221 44556',
  },
  {
    id: 'stu-hm02',
    name: 'Pooja Kulkarni',
    nameMarathi: 'पूजा कुलकर्णी',
    admissionNo: 'HM-2026-102',
    rollNo: 'HM-102',
    gradeOrSemester: 'B.Sc HM Semester 3',
    branchId: 'branch-hm-01',
    branchName: 'Modern College of Hotel Management and Technology',
    gender: 'FEMALE',
    feeTotal: 75000,
    feePaid: 75000,
    feePending: 0,
    attendancePercent: 96,
    kycStatus: 'VERIFIED',
    parentName: 'Ashok Kulkarni',
    parentPhone: '+91 98221 99887',
  },
  {
    id: 'stu-hm03',
    name: 'Aditya Mane',
    nameMarathi: 'आदित्य माने',
    admissionNo: 'HM-2026-103',
    rollNo: 'HM-103',
    gradeOrSemester: 'B.Sc HM Semester 3',
    branchId: 'branch-hm-01',
    branchName: 'Modern College of Hotel Management and Technology',
    gender: 'MALE',
    feeTotal: 75000,
    feePaid: 40000,
    feePending: 35000,
    attendancePercent: 89,
    kycStatus: 'VERIFIED',
    parentName: 'Dhananjay Mane',
    parentPhone: '+91 98221 66554',
  },
  {
    id: 'stu-hm04',
    name: 'Neha Chawla',
    nameMarathi: 'नेहा चावला',
    admissionNo: 'HM-2026-104',
    rollNo: 'HM-104',
    gradeOrSemester: 'B.Sc HM Semester 3',
    branchId: 'branch-hm-01',
    branchName: 'Modern College of Hotel Management and Technology',
    gender: 'FEMALE',
    feeTotal: 75000,
    feePaid: 75000,
    feePending: 0,
    attendancePercent: 97,
    kycStatus: 'VERIFIED',
    parentName: 'Praveen Chawla',
    parentPhone: '+91 98221 33221',
  },
];

export const ExamMarksheetStudio: React.FC<ExamMarksheetStudioProps> = ({
  initialStudents,
  currentBranchScope = 'ALL',
  academicYear = '2026-2027',
}) => {
  // Students state
  const [allStudents, setAllStudents] = useState<Student[]>(initialStudents || defaultRosterStudents);

  // Fetch live students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/students');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.students) && data.students.length > 0) {
            setAllStudents(data.students);
          }
        }
      } catch {
        // Fallback to default roster
      }
    };
    if (!initialStudents || initialStudents.length === 0) {
      fetchStudents();
    }
  }, [initialStudents]);

  // Exam Configuration State
  const [selectedExam, setSelectedExam] = useState<string>('Term-End Examination (October 2026)');
  const [customExam, setCustomExam] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('Class 7-A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science & Thermal Thermodynamics');
  const [customSubject, setCustomSubject] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [passingMarks, setPassingMarks] = useState<number>(35);
  const [examDate, setExamDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [teacherName, setTeacherName] = useState<string>('Prof. Sunita Kulkarni');

  // Search filter inside active marksheet
  const [searchFilter, setSearchFilter] = useState('');

  // Status Filter inside marksheet
  const [marksheetStatusFilter, setMarksheetStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL' | 'PENDING'>('ALL');

  // Stored grades repository: key is `${exam}__${class}__${subject}`
  const [gradesStorage, setGradesStorage] = useState<Record<string, Record<string, { marksObtained: number | ''; remarks: string }>>>(() => {
    try {
      const saved = localStorage.getItem('trust_marksheet_repository');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed sample initial marks
    return {
      'Term-End Examination (October 2026)__Class 7-A__Science & Thermal Thermodynamics': {
        'stu-s01': { marksObtained: 92, remarks: 'Excellent analytical presentation' },
        'stu-s02': { marksObtained: 88, remarks: 'Great conceptual clarity' },
        'stu-s03': { marksObtained: 74, remarks: 'Good grasp of principles' },
        'stu-s04': { marksObtained: 81, remarks: 'Very neat diagrammatic work' },
      },
      'Term-End Examination (October 2026)__Class 7-A__Mathematics & Geometry': {
        'stu-s01': { marksObtained: 95, remarks: 'Top scores in algebraic geometry' },
        'stu-s02': { marksObtained: 91, remarks: 'High accuracy in theorem proofs' },
        'stu-s03': { marksObtained: 68, remarks: 'Consistent problem solver' },
        'stu-s04': { marksObtained: 78, remarks: 'Good calculation speed' },
      },
    };
  });

  // Save repository to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trust_marksheet_repository', JSON.stringify(gradesStorage));
    } catch {}
  }, [gradesStorage]);

  // Alert & Feedback state
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [printableModalOpen, setPrintableModalOpen] = useState(false);

  // Available classes in system
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    allStudents.forEach((s) => {
      if (s.gradeOrSemester) set.add(s.gradeOrSemester);
    });
    if (set.size === 0) return ['Class 7-A', 'Class 10-A', 'B.Sc HM Semester 3'];
    return Array.from(set).sort();
  }, [allStudents]);

  // Active Subject list based on selected class (School vs College)
  const isCollegeClass = useMemo(() => {
    return (
      selectedClass.toLowerCase().includes('hm') ||
      selectedClass.toLowerCase().includes('hotel') ||
      selectedClass.toLowerCase().includes('b.sc')
    );
  }, [selectedClass]);

  const availableSubjects = useMemo(() => {
    return isCollegeClass ? collegeSubjects : schoolSubjects;
  }, [isCollegeClass]);

  // Auto-switch subject when class switches if current subject doesn't fit
  useEffect(() => {
    if (isCollegeClass && !collegeSubjects.includes(selectedSubject)) {
      setSelectedSubject(collegeSubjects[0]);
    } else if (!isCollegeClass && !schoolSubjects.includes(selectedSubject)) {
      setSelectedSubject(schoolSubjects[0]);
    }
  }, [isCollegeClass]);

  // Adjust passing marks when max marks changes
  const handleMaxMarksChange = (val: number) => {
    setMaxMarks(val);
    setPassingMarks(Math.round(val * 0.35));
  };

  // Determine current storage key for the marksheet
  const activeExamName = customExam.trim() || selectedExam;
  const activeSubjectName = customSubject.trim() || selectedSubject;
  const currentSheetKey = `${activeExamName}__${selectedClass}__${activeSubjectName}`;

  // Current Marksheet working records
  const [marksheetEntries, setMarksheetEntries] = useState<MarksheetStudentEntry[]>([]);

  // Helper to compute grade & status from marks
  const evaluateScore = (marks: number | '', max: number, pass: number) => {
    if (marks === '' || marks === undefined || isNaN(marks)) {
      return { percentage: 0, grade: 'PENDING', status: 'PENDING' as const };
    }
    const percent = max > 0 ? (marks / max) * 100 : 0;
    let grade = 'F';
    if (percent >= 90) grade = 'A+';
    else if (percent >= 80) grade = 'A';
    else if (percent >= 70) grade = 'B+';
    else if (percent >= 60) grade = 'B';
    else if (percent >= 50) grade = 'C';
    else if (percent >= pass / max * 100) grade = 'D';
    else grade = 'F';

    const status = marks >= pass ? ('PASS' as const) : ('FAIL' as const);
    return { percentage: Number(percent.toFixed(1)), grade, status };
  };

  // Synchronize Marksheet whenever Exam, Class, or Subject changes (The Core "Reuse" Engine)
  useEffect(() => {
    // 1. Filter students enrolled in the chosen class
    const enrolledStudents = allStudents.filter(
      (s) => s.gradeOrSemester === selectedClass || selectedClass === 'ALL'
    );

    // 2. Load stored marks for this specific sheet if available
    const existingSheetData = gradesStorage[currentSheetKey] || {};

    const rows: MarksheetStudentEntry[] = enrolledStudents.map((stu) => {
      const stored = existingSheetData[stu.id];
      const obtained = stored !== undefined && stored.marksObtained !== undefined ? stored.marksObtained : '';
      const { percentage, grade, status } = evaluateScore(obtained, maxMarks, passingMarks);

      return {
        studentId: stu.id,
        studentName: stu.name,
        nameMarathi: stu.nameMarathi,
        rollNo: stu.rollNo || stu.admissionNo || '—',
        admissionNo: stu.admissionNo,
        classOrGrade: stu.gradeOrSemester,
        branchId: stu.branchId,
        marksObtained: obtained,
        maxMarks,
        passingMarks,
        percentage,
        grade,
        status,
        remarks: stored?.remarks || (status === 'PASS' ? 'Good performance' : ''),
      };
    });

    setMarksheetEntries(rows);
  }, [currentSheetKey, selectedClass, allStudents, maxMarks, passingMarks]);

  // Handle Mark Changes per Student
  const handleScoreChange = (studentId: string, valStr: string) => {
    setMarksheetEntries((prev) =>
      prev.map((item) => {
        if (item.studentId !== studentId) return item;
        if (valStr === '') {
          return {
            ...item,
            marksObtained: '',
            percentage: 0,
            grade: 'PENDING',
            status: 'PENDING',
          };
        }
        let num = Number(valStr);
        if (isNaN(num)) return item;
        if (num < 0) num = 0;
        if (num > maxMarks) num = maxMarks;

        const { percentage, grade, status } = evaluateScore(num, maxMarks, passingMarks);
        return {
          ...item,
          marksObtained: num,
          percentage,
          grade,
          status,
        };
      })
    );
  };

  // Handle Remarks Change per Student
  const handleRemarksChange = (studentId: string, remarksVal: string) => {
    setMarksheetEntries((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, remarks: remarksVal } : item))
    );
  };

  // Quick Action: Fill Full Marks
  const setScoreDirect = (studentId: string, score: number) => {
    handleScoreChange(studentId, String(score));
  };

  // Bulk Tool 1: Fill Passing Marks for all Pending
  const handleFillAllPassing = () => {
    setMarksheetEntries((prev) =>
      prev.map((item) => {
        if (item.marksObtained === '') {
          const { percentage, grade, status } = evaluateScore(passingMarks, maxMarks, passingMarks);
          return {
            ...item,
            marksObtained: passingMarks,
            percentage,
            grade,
            status,
            remarks: 'Cleared at passing cutoff',
          };
        }
        return item;
      })
    );
  };

  // Bulk Tool 2: Auto-Fill Realistic Evaluated Sample Marks
  const handleAutoFillSample = () => {
    setMarksheetEntries((prev) =>
      prev.map((item, idx) => {
        // Generate realistic high-performing distribution
        const spread = [94, 88, 76, 82, 91, 65, 84, 79, 95, 72];
        const score = Math.round((spread[idx % spread.length] / 100) * maxMarks);
        const { percentage, grade, status } = evaluateScore(score, maxMarks, passingMarks);
        const sampleRemarks = [
          'Excellent subject grasp and diagram presentation',
          'Good analytical and theoretical reasoning',
          'Consistent and diligent coursework',
          'High problem-solving aptitude',
          'Neat answers with thorough explanations',
        ];
        return {
          ...item,
          marksObtained: score,
          percentage,
          grade,
          status,
          remarks: sampleRemarks[idx % sampleRemarks.length],
        };
      })
    );
  };

  // Bulk Tool 3: Clear All Marks for this Sheet
  const handleClearSheet = () => {
    if (window.confirm(`Are you sure you want to clear all entered marks for ${activeSubjectName}?`)) {
      setMarksheetEntries((prev) =>
        prev.map((item) => ({
          ...item,
          marksObtained: '',
          percentage: 0,
          grade: 'PENDING',
          status: 'PENDING',
          remarks: '',
        }))
      );
    }
  };

  // Save Marksheet to Server & Local Repository
  const handleSaveMarksheet = async () => {
    setIsSaving(true);

    // 1. Prepare record map for local storage
    const sheetMap: Record<string, { marksObtained: number | ''; remarks: string }> = {};
    const apiRecordsPayload: any[] = [];

    marksheetEntries.forEach((entry) => {
      sheetMap[entry.studentId] = {
        marksObtained: entry.marksObtained,
        remarks: entry.remarks,
      };

      if (entry.marksObtained !== '') {
        apiRecordsPayload.push({
          studentId: entry.studentId,
          studentName: entry.studentName,
          rollNo: entry.rollNo,
          branchId: entry.branchId,
          classOrGrade: entry.classOrGrade,
          examOrPracticalName: activeExamName,
          subject: activeSubjectName,
          maxMarks,
          marksObtained: Number(entry.marksObtained),
          grade: entry.grade,
          remarks: entry.remarks,
          date: examDate,
        });
      }
    });

    // Update local repository
    setGradesStorage((prev) => ({
      ...prev,
      [currentSheetKey]: sheetMap,
    }));

    // 2. Submit batch to backend API
    try {
      const res = await fetch('http://localhost:5000/api/teacher/marks/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examOrPracticalName: activeExamName,
          subject: activeSubjectName,
          classOrGrade: selectedClass,
          maxMarks,
          passingMarks,
          records: apiRecordsPayload,
        }),
      });

      if (res.ok) {
        setSuccessToast(`Official mark sheet for "${activeSubjectName}" saved successfully! (${apiRecordsPayload.length} records recorded)`);
      } else {
        setSuccessToast(`Mark sheet cached locally in storage (${apiRecordsPayload.length} records).`);
      }
    } catch {
      setSuccessToast(`Mark sheet saved securely to browser memory (${apiRecordsPayload.length} records).`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  // Marksheet Statistics Computation
  const stats = useMemo(() => {
    const total = marksheetEntries.length;
    const evaluated = marksheetEntries.filter((e) => e.marksObtained !== '');
    const evaluatedCount = evaluated.length;
    const passCount = evaluated.filter((e) => e.status === 'PASS').length;
    const failCount = evaluated.filter((e) => e.status === 'FAIL').length;
    const passPercentage = evaluatedCount > 0 ? ((passCount / evaluatedCount) * 100).toFixed(1) : '0';

    const totalMarks = evaluated.reduce((acc, curr) => acc + Number(curr.marksObtained), 0);
    const avgScore = evaluatedCount > 0 ? (totalMarks / evaluatedCount).toFixed(1) : '0';
    const avgPercent = evaluatedCount > 0 ? ((Number(avgScore) / maxMarks) * 100).toFixed(1) : '0';

    // Find highest scorer
    let highestScorer: MarksheetStudentEntry | null = null;
    evaluated.forEach((item) => {
      if (!highestScorer || Number(item.marksObtained) > Number(highestScorer.marksObtained)) {
        highestScorer = item;
      }
    });

    return {
      total,
      evaluatedCount,
      passCount,
      failCount,
      passPercentage,
      avgScore,
      avgPercent,
      highestScorer,
    };
  }, [marksheetEntries, maxMarks]);

  // Filtered entries inside the table
  const filteredEntries = useMemo(() => {
    return marksheetEntries.filter((item) => {
      const q = searchFilter.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.studentName.toLowerCase().includes(q) ||
        item.rollNo.toLowerCase().includes(q) ||
        item.admissionNo.toLowerCase().includes(q);

      const matchesStatus =
        marksheetStatusFilter === 'ALL' || item.status === marksheetStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [marksheetEntries, searchFilter, marksheetStatusFilter]);

  // Table Sorting
  const { sortedData: sortedEntries, sortKey, sortDirection, handleSort } = useTableSort(filteredEntries);

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems,
  } = usePagination(sortedEntries, 10);

  // CSV Export Generator
  const handleExportCsv = () => {
    const headers = ['Roll No', 'Student Name', 'Admission No', 'Class', 'Subject', 'Marks Obtained', 'Max Marks', 'Percentage', 'Grade', 'Result Status', 'Teacher Remarks'];
    const rows = marksheetEntries.map((e) => [
      `"${e.rollNo}"`,
      `"${e.studentName}"`,
      `"${e.admissionNo}"`,
      `"${e.classOrGrade}"`,
      `"${activeSubjectName}"`,
      e.marksObtained,
      e.maxMarks,
      `${e.percentage}%`,
      `"${e.grade}"`,
      `"${e.status}"`,
      `"${e.remarks}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Marksheet_${selectedClass}_${activeSubjectName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Institution letterhead details
  const instMeta = getInstitutionDetails(isCollegeClass ? 'Modern College' : 'Saraswati International');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-sm animate-scale-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Teacher Marksheet & Evaluation Studio */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                Teacher Exam Studio
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Academic Session: {academicYear}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              Class Marksheet & Student Score Recording
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any class, exam, and subject to open the live marksheet. Record marks per student name, compute grades automatically, and reuse for multiple subjects seamlessly.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
            title="Download formatted CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-slate-500" />
            CSV Export
          </button>

          <button
            type="button"
            onClick={() => setPrintableModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="View & Print Official Marksheet Letterhead"
          >
            <Printer className="w-4 h-4 text-orange-600" />
            Print Marksheet
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveMarksheet}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Entire Marksheet'}
          </button>
        </div>
      </div>

      {/* Reusable Exam & Subject Selection Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Exam & Class Configuration (Reusable Across Subjects)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Current Sheet: <strong className="text-orange-600">{activeSubjectName}</strong> ({selectedClass})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. Exam Name */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">1. Examination / Assessment *</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {standardExams.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
              <option value="CUSTOM">-- Enter Custom Assessment --</option>
            </select>
            {selectedExam === 'CUSTOM' && (
              <input
                type="text"
                placeholder="Type examination title..."
                value={customExam}
                onChange={(e) => setCustomExam(e.target.value)}
                className="w-full mt-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-800"
              />
            )}
          </div>

          {/* 2. Class / Standard */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">2. Class / Standard Roster *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Subject Selector (The key to reusability: switch subjects for same students) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">3. Subject (Select to Switch) *</label>
              <span className="text-[10px] text-orange-600 font-bold">Reusable</span>
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-orange-300 bg-orange-50/40 font-bold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer ring-1 ring-orange-400/20"
            >
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="CUSTOM">-- Enter Custom Subject --</option>
            </select>
            {selectedSubject === 'CUSTOM' && (
              <input
                type="text"
                placeholder="Type subject name..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full mt-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-800"
              />
            )}
          </div>

          {/* 4. Max & Passing Marks */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Max Marks</label>
              <input
                type="number"
                min={10}
                max={500}
                value={maxMarks}
                onChange={(e) => handleMaxMarksChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Pass Cutoff</label>
              <input
                type="number"
                min={1}
                max={maxMarks}
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Subject Switcher Pills (Enables one teacher to switch subjects in 1 click) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Quick Subject Tabs:
          </span>
          {availableSubjects.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Enrolled Candidates
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.total}{' '}
            <span className="text-xs font-semibold text-slate-500">
              ({stats.evaluatedCount} Evaluated)
            </span>
          </div>
          <div className="text-[10px] text-slate-400">Class: {selectedClass}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Pass Percentage
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {stats.passPercentage}%
          </div>
          <div className="text-[10px] text-slate-500">
            {stats.passCount} Passed • {stats.failCount} Needs Re-exam
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Class Average Score
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {stats.avgScore} <span className="text-xs font-semibold text-slate-500">/ {maxMarks}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Mean Performance: {stats.avgPercent}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Top Scorer (Rank #1)
          </div>
          <div className="text-xl font-black text-slate-900 truncate">
            {stats.highestScorer ? (stats.highestScorer as MarksheetStudentEntry).studentName : '—'}
          </div>
          <div className="text-[10px] font-bold text-amber-700">
            {stats.highestScorer
              ? `${(stats.highestScorer as MarksheetStudentEntry).marksObtained} / ${maxMarks} (${(stats.highestScorer as MarksheetStudentEntry).percentage}%)`
              : 'Pending evaluation'}
          </div>
        </div>
      </div>

      {/* Main Marksheet Roster Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5">
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, roll, admission no..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            {/* Filter by Status */}
            <select
              value={marksheetStatusFilter}
              onChange={(e) => setMarksheetStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer shrink-0"
            >
              <option value="ALL">All Status</option>
              <option value="PASS">Pass Only</option>
              <option value="FAIL">Fail / Re-exam</option>
              <option value="PENDING">Pending Marks</option>
            </select>
          </div>

          {/* Quick Bulk Action Tools */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold border border-orange-200 transition-all cursor-pointer"
              title="Populate demo marks for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Auto-Fill Demo
            </button>

            <button
              type="button"
              onClick={handleFillAllPassing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-all cursor-pointer"
              title="Fill cutoff pass marks for all empty candidates"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Pass All Empty
            </button>

            <button
              type="button"
              onClick={handleClearSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold transition-all cursor-pointer"
              title="Clear marks for this subject"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Sheet
            </button>
          </div>
        </div>

        {/* Tabular Marksheet Form */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <SortableTh label="Roll No" sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3 w-24" />
                <SortableTh label="Student Name" sortKey="studentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3 min-w-[200px]" />
                <th className="p-3">Subject</th>
                <th className="p-3 w-40">Marks Obtained</th>
                <th className="p-3 w-28">Score %</th>
                <SortableTh label="Grade" sortKey="grade" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3 w-20 text-center" />
                <SortableTh label="Status" sortKey="status" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3 w-24 text-center" />
                <th className="p-3 min-w-[200px]">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((entry) => (
                  <tr
                    key={entry.studentId}
                    className="hover:bg-orange-50/20 transition-colors group"
                  >
                    {/* Roll No */}
                    <td className="p-3 font-mono font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {entry.rollNo}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-black text-[11px] flex items-center justify-center shrink-0 border border-orange-200">
                          {entry.studentName.slice(0, 1)}
                        </div>
                        <div>
                          <div>{entry.studentName}</div>
                          {entry.nameMarathi && (
                            <div className="text-[11px] font-serif text-slate-500">
                              {entry.nameMarathi}
                            </div>
                          )}
                          <div className="text-[10px] font-mono text-slate-400">
                            {entry.admissionNo} • {entry.classOrGrade}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="p-3 text-slate-600 font-medium">
                      <span className="text-[11px] font-bold text-slate-800 bg-slate-100/80 px-2 py-0.5 rounded">
                        {activeSubjectName}
                      </span>
                    </td>

                    {/* Marks Input Box */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={maxMarks}
                            placeholder="0"
                            value={entry.marksObtained}
                            onChange={(e) => handleScoreChange(entry.studentId, e.target.value)}
                            className={`w-20 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-black text-center focus:outline-none transition-all ${
                              entry.marksObtained === ''
                                ? 'border-slate-300 bg-white text-slate-400'
                                : entry.status === 'PASS'
                                ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 focus:border-emerald-500'
                                : 'border-rose-300 bg-rose-50/50 text-rose-950 focus:border-rose-500'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-400">/ {maxMarks}</span>

                        {/* Quick Set Direct Button */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => setScoreDirect(entry.studentId, maxMarks)}
                            className="px-1 py-0.5 rounded text-[9px] font-bold bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-600"
                            title="Set Full Marks"
                          >
                            Max
                          </button>
                          <button
                            type="button"
                            onClick={() => setScoreDirect(entry.studentId, passingMarks)}
                            className="px-1 py-0.5 rounded text-[9px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600"
                            title="Set Pass Marks"
                          >
                            Pass
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Score Percentage */}
                    <td className="p-3">
                      {entry.marksObtained !== '' ? (
                        <div className="space-y-1">
                          <div className="font-mono font-bold text-slate-900">
                            {entry.percentage}%
                          </div>
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                entry.percentage >= 75
                                  ? 'bg-emerald-500'
                                  : entry.percentage >= 50
                                  ? 'bg-blue-500'
                                  : entry.percentage >= 35
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, entry.percentage)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Grade Badge */}
                    <td className="p-3 text-center">
                      {entry.grade !== 'PENDING' ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-lg font-black text-xs ${
                            entry.grade === 'A+' || entry.grade === 'A'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : entry.grade === 'B+' || entry.grade === 'B'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : entry.grade === 'C'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : entry.grade === 'D'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {entry.grade}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </td>

                    {/* Result Status */}
                    <td className="p-3 text-center">
                      {entry.status === 'PASS' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                        </span>
                      )}
                      {entry.status === 'FAIL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> FAIL
                        </span>
                      )}
                      {entry.status === 'PENDING' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Teacher Remarks Input */}
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Remarks / comments..."
                        value={entry.remarks}
                        onChange={(e) => handleRemarksChange(entry.studentId, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 font-medium">
                    No student candidates found for this class or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="pt-2">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredEntries.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Footer Quick Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            Recorded for: <strong className="text-slate-900">{activeExamName}</strong> • Subject:{' '}
            <strong className="text-orange-950 font-bold">{activeSubjectName}</strong> • Class:{' '}
            <strong className="text-slate-900">{selectedClass}</strong>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Evaluator: <strong>{teacherName}</strong>
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveMarksheet}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[11px] shadow-sm shadow-orange-600/20 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Publish Marksheet'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL PRINTABLE MARKSHEET (LETTERHEAD READY) */}
      {/* ========================================================================= */}
      {printableModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scale-in my-8">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                  Official Academic Mark Sheet (Print Ready)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button
                  type="button"
                  onClick={() => setPrintableModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content Area */}
            <div className="border-2 border-slate-900 p-6 rounded-2xl space-y-5 bg-white text-slate-900 font-sans">
              {/* Institution Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-xs font-black tracking-widest text-orange-700 uppercase">
                  {instMeta.trustName}
                </div>
                <h1 className="text-xl font-black uppercase text-slate-950 font-sans tracking-wide">
                  {instMeta.name}
                </h1>
                <div className="text-[11px] text-slate-600">
                  {instMeta.address}, {instMeta.city} - {instMeta.pincode} • Phone: {instMeta.phone}
                </div>
                <div className="text-[11px] font-bold text-slate-800">
                  {instMeta.affiliationNo} • {instMeta.udiseCode}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="text-center py-1">
                <h2 className="text-base font-black uppercase tracking-wider text-slate-950 underline decoration-2 underline-offset-4">
                  OFFICIAL TABULATED EXAMINATION MARKSHEET
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-700 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>Assessment: <strong>{activeExamName}</strong></div>
                  <div>Class / Grade: <strong>{selectedClass}</strong></div>
                  <div>Subject: <strong className="text-orange-950">{activeSubjectName}</strong></div>
                  <div>Date: <strong>{examDate}</strong></div>
                </div>
              </div>

              {/* Tabulated Scores */}
              <table className="w-full text-left border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 text-slate-900 font-bold uppercase text-[11px]">
                    <th className="border border-slate-900 p-2 text-center w-12">Sr</th>
                    <th className="border border-slate-900 p-2 text-center w-20">Roll No</th>
                    <th className="border border-slate-900 p-2">Student Name</th>
                    <th className="border border-slate-900 p-2 text-center w-24">Max Marks</th>
                    <th className="border border-slate-900 p-2 text-center w-28">Marks Obtained</th>
                    <th className="border border-slate-900 p-2 text-center w-20">Percentage</th>
                    <th className="border border-slate-900 p-2 text-center w-16">Grade</th>
                    <th className="border border-slate-900 p-2 text-center w-20">Status</th>
                    <th className="border border-slate-900 p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-400">
                  {marksheetEntries.map((item, idx) => (
                    <tr key={item.studentId} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                      <td className="border border-slate-400 p-2 text-center font-bold">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 text-center font-mono font-bold">{item.rollNo}</td>
                      <td className="border border-slate-400 p-2 font-bold text-slate-950">
                        {item.studentName}
                        {item.nameMarathi && <span className="font-serif text-[11px] text-slate-600 font-normal ml-1">({item.nameMarathi})</span>}
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-mono">{maxMarks}</td>
                      <td className="border border-slate-400 p-2 text-center font-mono font-black text-sm">
                        {item.marksObtained !== '' ? item.marksObtained : 'AB'}
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-mono font-bold">
                        {item.marksObtained !== '' ? `${item.percentage}%` : '—'}
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-black">
                        {item.grade !== 'PENDING' ? item.grade : '—'}
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-bold">
                        {item.status}
                      </td>
                      <td className="border border-slate-400 p-2 text-[11px] text-slate-700">
                        {item.remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Class Performance Metrics Block */}
              <div className="grid grid-cols-4 gap-3 text-xs border border-slate-300 p-3 rounded-xl bg-slate-50 text-slate-800">
                <div>Total Candidates: <strong>{stats.total}</strong></div>
                <div>Appeared / Evaluated: <strong>{stats.evaluatedCount}</strong></div>
                <div>Class Average: <strong>{stats.avgScore} ({stats.avgPercent}%)</strong></div>
                <div>Pass Rate: <strong className="text-emerald-800">{stats.passPercentage}%</strong></div>
              </div>

              {/* Signatures Block */}
              <div className="pt-10 flex items-end justify-between text-center font-bold text-xs">
                <div className="border-t border-slate-900 pt-1.5 min-w-[160px]">
                  <div>{teacherName}</div>
                  <div className="text-[10px] text-slate-500 font-normal">Subject Teacher / Evaluator</div>
                </div>

                <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">
                  Seal Stamp
                </div>

                <div className="border-t border-slate-900 pt-1.5 min-w-[160px]">
                  <div>Principal Sunita Kulkarni</div>
                  <div className="text-[10px] text-slate-500 font-normal">Head of Institution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
