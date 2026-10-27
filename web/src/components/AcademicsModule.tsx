import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  UtensilsCrossed,
  ChefHat,
  CalendarCheck,
  Building,
  Star,
  Package,
  CheckCircle2,
  Clock,
  Check,
  X,
  School,
  FileSpreadsheet,
  DoorOpen,
  FileQuestion,
} from 'lucide-react';
import { Student, KitchenPracticalBatch, HotelInternship, ChefKitInventory } from '../types';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';
import { ExamMarksheetStudio } from './ExamMarksheetStudio';
import { ClassTeacherAllocationStudio } from './ClassTeacherAllocationStudio';
import { QuestionBankPaperStudio } from './QuestionBankPaperStudio';

interface AcademicsModuleProps {
  students: Student[];
  kitchenLabs: KitchenPracticalBatch[];
  internships: HotelInternship[];
  chefKits: ChefKitInventory[];
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onChangeBranchScope?: (branch: 'ALL' | 'SCHOOL' | 'COLLEGE') => void;
  academicYear?: string;
}

export const AcademicsModule: React.FC<AcademicsModuleProps> = ({
  students,
  kitchenLabs,
  internships,
  chefKits,
  selectedBranchScope = 'ALL',
  onChangeBranchScope,
  academicYear = '2026-2027',
}) => {
  const [activeView, setActiveView] = useState<'SCHOOL_CLASSES' | 'COLLEGE_LABS' | 'INTERNSHIPS' | 'MARKSHEET' | 'CLASS_TEACHERS' | 'QUESTION_BANK'>(
    selectedBranchScope === 'COLLEGE' ? 'COLLEGE_LABS' : 'SCHOOL_CLASSES'
  );

  useEffect(() => {
    if (selectedBranchScope === 'COLLEGE' && activeView !== 'MARKSHEET' && activeView !== 'CLASS_TEACHERS' && activeView !== 'QUESTION_BANK') {
      setActiveView('COLLEGE_LABS');
    } else if (selectedBranchScope === 'SCHOOL' && activeView !== 'MARKSHEET' && activeView !== 'CLASS_TEACHERS' && activeView !== 'QUESTION_BANK') {
      setActiveView('SCHOOL_CLASSES');
    }
  }, [selectedBranchScope]);

  const [selectedClass, setSelectedClass] = useState('Class 7-A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({
    'stu-s00': 'PRESENT',
    'stu-s01': 'PRESENT',
    'stu-s02': 'PRESENT',
    'stu-s03': 'PRESENT',
  });
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  const classStudents = students.filter(
    (s) => s.branchId === 'branch-sch-01' && (s.gradeOrSemester === selectedClass || selectedClass === 'ALL')
  );

  const {
    sortedData: sortedClassStudents,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<Student>(classStudents, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  const {
    currentPage: attendancePage,
    setCurrentPage: setAttendancePage,
    pageSize: attendancePageSize,
    setPageSize: setAttendancePageSize,
    paginatedItems: paginatedClassStudents,
  } = usePagination(sortedClassStudents, 10);

  const handleMarkStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceSubmitted(true);
    setTimeout(() => setAttendanceSubmitted(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              Curricula & Training
            </span>
            <span className="text-xs text-slate-400 font-bold">Session: {academicYear}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {selectedBranchScope === 'COLLEGE'
              ? 'Culinary Kitchen Labs & Industrial Training'
              : selectedBranchScope === 'SCHOOL'
              ? 'Classes, Curricula & Attendance'
              : 'Academics & Practical Training'}
          </h2>
          <p className="text-xs text-slate-500">
            Rapid daily class attendance marking for School; commercial kitchen lab rosters & hotel internships for College.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200 overflow-x-auto">
          {selectedBranchScope !== 'COLLEGE' && (
            <button
              onClick={() => setActiveView('SCHOOL_CLASSES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'SCHOOL_CLASSES' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              School Classes
            </button>
          )}
          {selectedBranchScope !== 'SCHOOL' && (
            <>
              <button
                onClick={() => setActiveView('COLLEGE_LABS')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeView === 'COLLEGE_LABS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Kitchen Labs
              </button>
              <button
                onClick={() => setActiveView('INTERNSHIPS')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeView === 'INTERNSHIPS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Internships
              </button>
            </>
          )}
          <button
            onClick={() => setActiveView('MARKSHEET')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'MARKSHEET' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-orange-600" />
            Exam Mark Sheet
          </button>
          <button
            onClick={() => setActiveView('CLASS_TEACHERS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'CLASS_TEACHERS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5 text-orange-600" />
            Class Teacher & Rooms
          </button>
          <button
            onClick={() => setActiveView('QUESTION_BANK')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'QUESTION_BANK' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5 text-orange-600" />
            Question Bank & Papers
          </button>
        </div>
      </div>

      {/* 2. SECTION A: SCHOOL RAPID 30-SEC ATTENDANCE */}
      {activeView === 'SCHOOL_CLASSES' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-orange-600" />
                30-Second Rapid Daily Attendance Marking
              </h3>
              <p className="text-xs text-slate-500">
                Mark entire class in seconds. Auto-updates school ledger and parent mobile apps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              >
                <option value="Class 1-A">Class 1-A (1st Standard)</option>
                <option value="Class 7-A">Class 7-A (Middle School)</option>
                <option value="Class 8-B">Class 8-B (Secondary)</option>
                <option value="ALL">All School Classes</option>
              </select>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              />
            </div>
          </div>

          {attendanceSubmitted && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-emerald-900 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Daily attendance for {selectedClass} on {attendanceDate} successfully submitted and synced to parent mobile app!
            </div>
          )}

          <form onSubmit={handleSubmitAttendance} className="space-y-3">
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px] shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center py-2.5 px-3" />
                    <SortableTh label="Roll No" sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2.5 px-3" />
                    <SortableTh label="Student Name" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2.5 px-3" />
                    <SortableTh label="Class" sortKey="gradeOrSemester" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2.5 px-3" />
                    <th className="py-2.5 px-3 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedClassStudents.map((stu, index) => {
                    const currentStatus = attendanceState[stu.id] || 'PRESENT';
                    const globalIndex = (attendancePage - 1) * attendancePageSize + index + 1;
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono text-xs">{globalIndex}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-600">{stu.rollNo}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{stu.name}</td>
                        <td className="py-3 px-3 text-slate-500">{stu.gradeOrSemester}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(stu.id, 'PRESENT')}
                              className={`px-2.5 py-1 rounded-lg transition-all ${
                                currentStatus === 'PRESENT'
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(stu.id, 'LATE')}
                              className={`px-2.5 py-1 rounded-lg transition-all ${
                                currentStatus === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(stu.id, 'ABSENT')}
                              className={`px-2.5 py-1 rounded-lg transition-all ${
                                currentStatus === 'ABSENT'
                                  ? 'bg-rose-500 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Attendance Table Pagination Controls */}
            <TablePagination
              currentPage={attendancePage}
              totalItems={sortedClassStudents.length}
              pageSize={attendancePageSize}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              onPageChange={setAttendancePage}
              onPageSizeChange={setAttendancePageSize}
              itemName="students"
            />

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Submit Attendance ({classStudents.length} Students)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. SECTION B: COLLEGE KITCHEN PRACTICAL LABS */}
      {activeView === 'COLLEGE_LABS' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-5">
            {kitchenLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-orange-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {lab.labName}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    {lab.timing}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{lab.batchName}</h4>
                  <p className="text-xs text-orange-700 font-semibold mt-0.5">
                    Topic: {lab.menuTopic}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Chef Instructor:</span>
                    <span className="font-bold text-slate-900">{lab.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batch Capacity:</span>
                    <span className="font-bold text-slate-900">{lab.studentCount} Chefs</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Toolkits Issued
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">Uniform: Checked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECTION C: COLLEGE INDUSTRIAL TRAINING INTERNSHIPS */}
      {activeView === 'INTERNSHIPS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" />
                Hotel Industry Internship Rotations (IT)
              </h3>
              <p className="text-xs text-slate-500">
                5-Star hotel brand placements, shift schedules, and chef mentor ratings.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              100% Placement Record
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {internships.map((it) => (
              <div
                key={it.id}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{it.studentName}</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                    {it.rollNo}
                  </span>
                </div>

                <div className="text-orange-700 font-bold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {it.hotelBrand} &bull; {it.city}
                </div>

                <div className="text-slate-600">
                  Rotation Dept: <strong className="text-slate-800">{it.department}</strong>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500">Mentor: {it.mentorName}</span>
                  <span className="text-amber-600 font-extrabold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {it.mentorRating} / 10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECTION D: TEACHER EXAM MARKSHEET & EVALUATION STUDIO */}
      {activeView === 'MARKSHEET' && (
        <ExamMarksheetStudio
          initialStudents={students}
          currentBranchScope={selectedBranchScope}
          academicYear={academicYear}
        />
      )}

      {/* 2. SECTION E: CLASS TEACHER & CLASSROOM ALLOCATION STUDIO */}
      {activeView === 'CLASS_TEACHERS' && (
        <ClassTeacherAllocationStudio
          currentBranchScope={selectedBranchScope}
          academicYear={academicYear}
        />
      )}

      {/* 2. SECTION F: MULTI-LINGUAL QUESTION BANK & QUESTION PAPER STUDIO */}
      {activeView === 'QUESTION_BANK' && (
        <QuestionBankPaperStudio
          currentBranchScope={selectedBranchScope}
          academicYear={academicYear}
        />
      )}
    </div>
  );
};
