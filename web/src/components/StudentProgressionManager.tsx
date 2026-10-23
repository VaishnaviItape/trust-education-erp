import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  School,
  UtensilsCrossed,
  Users,
  Search,
  History,
  Sparkles,
  CreditCard,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';
import { Student, StudentProgressionRecord } from '../types';
import { envConfig } from '../config/env';
import { useTableSort, SortableTh } from './TableSort';

interface StudentProgressionManagerProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
  progressionHistory: StudentProgressionRecord[];
  onAddProgressionRecords: (records: StudentProgressionRecord[]) => void;
  currentAcademicYear?: string;
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onChangeBranchScope?: (branch: 'ALL' | 'SCHOOL' | 'COLLEGE') => void;
}

// Client-side next grade calculation for instant preview & fallback
export function computeNextGrade(grade: string): { nextGrade: string; status: 'PROMOTED' | 'GRADUATED' } {
  // Class 1 to 12
  const classMatch = grade.match(/Class\s*(\d+)(.*)/i);
  if (classMatch) {
    const classNum = parseInt(classMatch[1], 10);
    const suffix = classMatch[2] || '';
    if (classNum >= 12) {
      return { nextGrade: 'School Alumnus (Class 12 Graduated)', status: 'GRADUATED' };
    }
    return { nextGrade: `Class ${classNum + 1}${suffix}`, status: 'PROMOTED' };
  }

  // 1st Standard, 2nd Std, etc.
  const stdMatch = grade.match(/(\d+)(?:st|nd|rd|th)?\s*(Standard|Std)(.*)/i);
  if (stdMatch) {
    const num = parseInt(stdMatch[1], 10);
    const word = stdMatch[2];
    const suffix = stdMatch[3] || '';
    if (num >= 12) {
      return { nextGrade: 'School Alumnus (Class 12 Graduated)', status: 'GRADUATED' };
    }
    const suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
    const nextOrd = (num + 1) % 100 >= 11 && (num + 1) % 100 <= 13 ? 'th' : suffixes[(num + 1) % 10] || 'th';
    return { nextGrade: `${num + 1}${nextOrd} ${word}${suffix}`, status: 'PROMOTED' };
  }

  // Semesters (College)
  const semMatch = grade.match(/(.*Semester\s*)(\d+)(.*)/i);
  if (semMatch) {
    const prefix = semMatch[1];
    const semNum = parseInt(semMatch[2], 10);
    const suffix = semMatch[3] || '';
    if (semNum >= 6) {
      return { nextGrade: 'Degree Conferred (Hotel Mgmt Alumnus)', status: 'GRADUATED' };
    }
    return { nextGrade: `${prefix}${semNum + 1}${suffix}`, status: 'PROMOTED' };
  }

  return { nextGrade: `${grade} (Promoted)`, status: 'PROMOTED' };
}

export const StudentProgressionManager: React.FC<StudentProgressionManagerProps> = ({
  students,
  onUpdateStudents,
  progressionHistory,
  onAddProgressionRecords,
  currentAcademicYear = '2026-2027',
  selectedBranchScope = 'ALL',
  onChangeBranchScope,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'PROGRESSION' | 'HISTORY'>('PROGRESSION');
  const [fromYear, setFromYear] = useState('2025-2026');
  const [toYear, setToYear] = useState('2026-2027');
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(selectedBranchScope);

  useEffect(() => {
    if (selectedBranchScope) {
      setBranchFilter(selectedBranchScope);
    }
  }, [selectedBranchScope]);
  const [schoolBaseFee, setSchoolBaseFee] = useState<number>(38000);
  const [collegeBaseFee, setCollegeBaseFee] = useState<number>(80000);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter students based on branch filter
  const candidateStudents = students.filter((s) => {
    if (branchFilter === 'SCHOOL' && s.branchId !== 'branch-sch-01') return false;
    if (branchFilter === 'COLLEGE' && s.branchId !== 'branch-hm-01') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.gradeOrSemester.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const {
    sortedData: sortedCandidates,
    sortKey: candSortKey,
    sortDirection: candSortDir,
    handleSort: handleCandSort,
  } = useTableSort<Student>(candidateStudents, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  const {
    sortedData: sortedHistory,
    sortKey: histSortKey,
    sortDirection: histSortDir,
    handleSort: handleHistSort,
  } = useTableSort<StudentProgressionRecord>(progressionHistory, {
    defaultKey: null,
    defaultDirection: 'desc',
  });

  const handleSelectAll = () => {
    if (selectedStudentIds.length === candidateStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(candidateStudents.map((s) => s.id));
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Perform promotion & carry forward
  const handleExecuteProgression = async (targets: Student[]) => {
    if (targets.length === 0) return;
    setIsProcessing(true);
    setSuccessMessage(null);

    const targetIds = targets.map((s) => s.id);

    try {
      // 1. Try sending to backend API
      const res = await fetch(`${envConfig.apiBaseUrl}/api/students/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: targetIds,
          fromYear,
          toYear,
          annualNewFee: targets[0].branchId === 'branch-sch-01' ? schoolBaseFee : collegeBaseFee,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local React state with returned records
        if (data.records && data.records.length > 0) {
          onAddProgressionRecords(data.records);
        }
        // Also refresh students list from server
        const stuRes = await fetch(`${envConfig.apiBaseUrl}/api/students`);
        if (stuRes.ok) {
          const stuData = await stuRes.json();
          if (stuData.students) {
            onUpdateStudents(stuData.students);
          }
        }
        setSuccessMessage(
          `Successfully processed academic carry forward for ${targets.length} student(s) from ${fromYear} to ${toYear}!`
        );
        setSelectedStudentIds([]);
        setIsProcessing(false);
        return;
      }
    } catch {
      // Offline fallback: perform same promotion in client state
    }

    // 2. Client-side execution fallback
    const newRecords: StudentProgressionRecord[] = [];
    const updated = students.map((stu) => {
      if (!targetIds.includes(stu.id)) return stu;

      const { nextGrade, status } = computeNextGrade(stu.gradeOrSemester);
      const carriedPending = stu.feePending;
      const baseFee = stu.branchId === 'branch-sch-01' ? schoolBaseFee : collegeBaseFee;
      const newFeeTotal = status === 'GRADUATED' ? stu.feePending : baseFee + carriedPending;

      newRecords.push({
        id: `prog-${Date.now()}-${stu.id}`,
        studentId: stu.id,
        studentName: stu.name,
        admissionNo: stu.admissionNo,
        branchName:
          stu.branchId === 'branch-sch-01'
            ? 'Modern Public School And Junior College Bhose'
            : 'Modern College Of Hotel Management And Technology Solapur',
        fromYear,
        toYear,
        fromGrade: stu.gradeOrSemester,
        toGrade: nextGrade,
        pendingFeeCarriedForward: carriedPending,
        promotedDate: new Date().toISOString().split('T')[0],
        status,
      });

      return {
        ...stu,
        gradeOrSemester: nextGrade,
        feeTotal: newFeeTotal,
        feePaid: 0,
        feePending: newFeeTotal,
      };
    });

    onUpdateStudents(updated);
    onAddProgressionRecords(newRecords);
    setSelectedStudentIds([]);
    setSuccessMessage(
      `Successfully carried forward ${targets.length} student(s) to ${toYear}! Pending fee balances rolled forward.`
    );
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full text-orange-100 border border-white/30">
              Academic Lifecycle Engine
            </span>
            <span className="text-xs font-bold bg-orange-950/40 text-amber-200 px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
              <Calendar className="w-3 h-3" />
              Annual Progression & Fee Carry-Forward
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Student Academic Progression & Carry Forward
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-2xl">
            Advance students into their next academic standard (e.g. <strong>Class 1st &rarr; 2nd Std</strong>,{' '}
            <strong>Class 7th &rarr; 8th Std</strong>, or <strong>Hotel Mgmt Semester 3 &rarr; Semester 4</strong>).
            Unpaid fee balances automatically carry forward into the new academic year ledger.
          </p>
        </div>

        {/* Tab switch inside progression manager */}
        <div className="flex bg-white/20 p-1 rounded-2xl border border-white/30 shrink-0">
          <button
            onClick={() => setActiveSubTab('PROGRESSION')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'PROGRESSION'
                ? 'bg-white text-orange-700 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Progression Console
          </button>
          <button
            onClick={() => setActiveSubTab('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'HISTORY'
                ? 'bg-white text-orange-700 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit History ({progressionHistory.length})
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 flex items-center justify-between text-emerald-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-emerald-950">Carry Forward Completed</div>
              <div className="text-xs text-emerald-800 font-medium">{successMessage}</div>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SUB-TAB 1: PROGRESSION CONSOLE */}
      {activeSubTab === 'PROGRESSION' && (
        <>
          {/* Policy & Rule Explainer Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Sequential Grade Progression</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Students advance automatically: <strong>Class 1-A &rarr; Class 2-A</strong>,{' '}
                  <strong>Class 7-A &rarr; Class 8-A</strong>, and Hotel Mgmt Semesters increment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Pending Fee Roll-Over</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Any unpaid balance from the old academic year is rolled into the new academic year fee ledger:
                  <code className="block mt-1 bg-amber-50 text-amber-900 p-1 rounded font-mono text-[10px]">
                    New Total = Base Fee + Pending Dues
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Graduation Status</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Class 12 students transition to <em>School Alumnus</em> and Semester 6 students to{' '}
                  <em>Degree Conferred</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Toolbar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* From Session */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  From Academic Session
                </label>
                <select
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
              </div>

              {/* To Session */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  To Academic Session (Target)
                </label>
                <select
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-orange-300 bg-orange-50/50 text-orange-950 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Institution Branch Scope
                </label>
                <select
                  value={branchFilter}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setBranchFilter(val);
                    onChangeBranchScope?.(val);
                  }}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Branches (Zep Foundation)</option>
                  <option value="SCHOOL">Modern Public School & Jr College Bhose</option>
                  <option value="COLLEGE">Modern College of HM & Tech Solapur</option>
                </select>
              </div>

              {/* Base New Year Fee */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  New Session Annual Base Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={branchFilter === 'COLLEGE' ? collegeBaseFee : schoolBaseFee}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (branchFilter === 'COLLEGE') setCollegeBaseFee(val);
                      else setSchoolBaseFee(val);
                    }}
                    className="w-full text-xs font-bold pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Filter & Execution Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter candidate students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all"
                >
                  {selectedStudentIds.length === candidateStudents.length ? 'Deselect All' : 'Select All'} (
                  {candidateStudents.length})
                </button>

                <button
                  disabled={selectedStudentIds.length === 0 || isProcessing}
                  onClick={() => {
                    const targets = candidateStudents.filter((s) => selectedStudentIds.includes(s.id));
                    handleExecuteProgression(targets);
                  }}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 ${
                    selectedStudentIds.length === 0 || isProcessing
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-95 shadow-orange-600/20'
                  }`}
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  Execute Carry Forward ({selectedStudentIds.length} Selected)
                </button>
              </div>
            </div>
          </div>

          {/* Student Candidate & Live Carry Forward Preview Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Student Roster Progression & Fee Carry Forward Preview
                </h3>
                <p className="text-[11px] text-slate-500">
                  Preview next year grade advancement & rolled-over balance for session {fromYear} &rarr; {toYear}.
                </p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                {candidateStudents.length} Students Ready
              </span>
            </div>

            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] shadow-2xs">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center bg-slate-50">
                      <input
                        type="checkbox"
                        checked={
                          candidateStudents.length > 0 &&
                          selectedStudentIds.length === candidateStudents.length
                        }
                        onChange={handleSelectAll}
                        className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                    </th>
                    <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={candSortKey} currentDirection={candSortDir} onSort={handleCandSort} align="center" className="w-12 text-center" />
                    <SortableTh label="Student Details" sortKey="name" currentSortKey={candSortKey} currentDirection={candSortDir} onSort={handleCandSort} className="py-3.5 px-4" />
                    <SortableTh label="Branch" sortKey="branchName" currentSortKey={candSortKey} currentDirection={candSortDir} onSort={handleCandSort} className="py-3.5 px-4" />
                    <SortableTh label={`Current Grade (${fromYear})`} sortKey="gradeOrSemester" currentSortKey={candSortKey} currentDirection={candSortDir} onSort={handleCandSort} className="py-3.5 px-4" />
                    <th className="py-3.5 px-4">Promoted Grade ({toYear})</th>
                    <SortableTh label="Carried Pending Fee" sortKey="feePending" currentSortKey={candSortKey} currentDirection={candSortDir} onSort={handleCandSort} className="py-3.5 px-4" />
                    <th className="py-3.5 px-4">New Session Fee Total</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sortedCandidates.map((stu, index) => {
                    const isSelected = selectedStudentIds.includes(stu.id);
                    const { nextGrade, status } = computeNextGrade(stu.gradeOrSemester);
                    const baseFee = stu.branchId === 'branch-sch-01' ? schoolBaseFee : collegeBaseFee;
                    const newTotal = status === 'GRADUATED' ? stu.feePending : baseFee + stu.feePending;

                    return (
                      <tr
                        key={stu.id}
                        className={`hover:bg-orange-50/20 transition-colors ${
                          isSelected ? 'bg-orange-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleStudent(stu.id)}
                            className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                          />
                        </td>
                        <td className="py-3.5 px-2 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{stu.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {stu.admissionNo} &bull; {stu.rollNo}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              stu.branchId === 'branch-sch-01'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {stu.branchId === 'branch-sch-01' ? 'School' : 'Hotel Mgmt'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-bold">
                            {stu.gradeOrSemester}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span
                              className={`px-2.5 py-1 rounded-lg ${
                                status === 'GRADUATED'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {nextGrade}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {stu.feePending > 0 ? (
                            <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              + ₹ {stu.feePending.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold">₹ 0 (Cleared)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">
                            ₹ {newTotal.toLocaleString()}
                          </div>
                          {stu.feePending > 0 && status !== 'GRADUATED' && (
                            <div className="text-[10px] text-slate-400">
                              (₹ {baseFee.toLocaleString()} base + ₹ {stu.feePending.toLocaleString()} carried)
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleExecuteProgression([stu])}
                            disabled={isProcessing}
                            className="bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-600 font-bold px-3 py-1.5 rounded-lg border border-orange-200 transition-all text-[11px] inline-flex items-center gap-1"
                          >
                            <TrendingUp className="w-3 h-3" />
                            Carry Forward
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SUB-TAB 2: AUDIT HISTORY */}
      {activeSubTab === 'HISTORY' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-orange-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Academic Progression & Fee Carry-Forward Audit Trail
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full">
              {progressionHistory.length} Past Operations Logged
            </span>
          </div>

          {progressionHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-sm text-slate-600">No Historical Records Logged Yet</div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Promote students using the Progression Console to view audited session transitions, carried fee
                balances, and timestamps.
              </p>
            </div>
          ) : (
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="id" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} align="center" className="w-12 text-center" />
                    <SortableTh label="Student Name" sortKey="studentName" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                    <SortableTh label="Branch" sortKey="branchName" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                    <SortableTh label="Academic Sessions" sortKey="fromYear" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                    <SortableTh label="Grade Progression" sortKey="toGrade" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                    <SortableTh label="Carried Pending Dues" sortKey="carriedPendingFee" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                    <SortableTh label="Date" sortKey="date" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                    <SortableTh label="Status" sortKey="status" currentSortKey={histSortKey} currentDirection={histSortDir} onSort={handleHistSort} className="py-3.5 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sortedHistory.map((rec, index) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{rec.studentName}</div>
                        <div className="text-[11px] text-slate-400">{rec.admissionNo || rec.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {rec.branchName || 'Zep Foundation Bhose'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {rec.fromYear} &rarr; {rec.toYear}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-600">{rec.fromGrade}</span>
                        <span className="mx-1.5 text-slate-400">&rarr;</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {rec.toGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {rec.pendingFeeCarriedForward > 0 ? (
                          <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            ₹ {rec.pendingFeeCarriedForward.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">₹ 0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{rec.promotedDate}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'PROMOTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
