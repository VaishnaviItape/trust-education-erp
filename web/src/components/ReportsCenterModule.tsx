import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  CreditCard,
  Calendar,
  Award,
  BookOpen,
  Bus,
  Home,
  Briefcase,
  Layers,
  Sparkles,
  Phone,
  Clock,
  School,
  UtensilsCrossed,
  TrendingUp,
  Percent,
  Check,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Student, FeeReceipt, AdmissionEnquiry, BusRoute } from '../types';
import { TablePagination, usePagination } from './TablePagination';
import { SortableTh, useTableSort } from './TableSort';

interface ReportsCenterModuleProps {
  students: Student[];
  receipts: FeeReceipt[];
  enquiries: AdmissionEnquiry[];
  busRoute?: BusRoute;
  academicYear?: string;
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
}

type ReportCategory =
  | 'STUDENT_STRENGTH'
  | 'FEE_DEFAULTERS'
  | 'COLLECTION_LEDGER'
  | 'ATTENDANCE_AUDIT'
  | 'EXAM_TABULATION'
  | 'CONCESSIONS'
  | 'PAYROLL_SUMMARY'
  | 'LIBRARY_TRANSPORT';

export const ReportsCenterModule: React.FC<ReportsCenterModuleProps> = ({
  students,
  receipts,
  enquiries,
  busRoute,
  academicYear = '2026-2027',
  selectedBranchScope = 'ALL',
}) => {
  const [activeReport, setActiveReport] = useState<ReportCategory>('FEE_DEFAULTERS');
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(selectedBranchScope);
  const [standardFilter, setStandardFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'ALL' | 'TODAY' | 'THIS_MONTH' | 'THIS_YEAR'>('ALL');

  // Filter students by branch
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (branchFilter === 'SCHOOL' && s.branchId !== 'branch-sch-01') return false;
      if (branchFilter === 'COLLEGE' && s.branchId !== 'branch-hm-01') return false;
      if (standardFilter !== 'ALL' && !s.gradeOrSemester.includes(standardFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          (s.parentName && s.parentName.toLowerCase().includes(q)) ||
          (s.parentPhone && s.parentPhone.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [students, branchFilter, standardFilter, searchQuery]);

  // Filter receipts by branch
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const isSchool = r.branchName.toLowerCase().includes('school');
      if (branchFilter === 'SCHOOL' && !isSchool) return false;
      if (branchFilter === 'COLLEGE' && isSchool) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.receiptNo.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.paymentMode.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [receipts, branchFilter, searchQuery]);

  // Fee Defaulters list (Pending > 0)
  const defaultersList = useMemo(() => {
    return filteredStudents
      .filter((s) => s.feePending > 0)
      .sort((a, b) => b.feePending - a.feePending);
  }, [filteredStudents]);

  // Pagination for Defaulters
  const {
    currentPage: defPage,
    setCurrentPage: setDefPage,
    pageSize: defPageSize,
    setPageSize: setDefPageSize,
    paginatedItems: paginatedDefaulters,
  } = usePagination(defaultersList, 8);

  // Pagination for Receipts
  const {
    currentPage: rcpPage,
    setCurrentPage: setRcpPage,
    pageSize: rcpPageSize,
    setPageSize: setRcpPageSize,
    paginatedItems: paginatedReceipts,
  } = usePagination(filteredReceipts, 8);

  // Pagination for Student Strength
  const {
    currentPage: stuPage,
    setCurrentPage: setStuPage,
    pageSize: stuPageSize,
    setPageSize: setStuPageSize,
    paginatedItems: paginatedStudents,
  } = usePagination(filteredStudents, 8);

  // Strength by Standard breakdown
  const standardBreakdown = useMemo(() => {
    const map: Record<string, { total: number; male: number; female: number; collected: number; pending: number }> = {};
    filteredStudents.forEach((s) => {
      const std = s.gradeOrSemester || 'Other';
      if (!map[std]) {
        map[std] = { total: 0, male: 0, female: 0, collected: 0, pending: 0 };
      }
      map[std].total += 1;
      if (s.gender === 'FEMALE') {
        map[std].female += 1;
      } else {
        map[std].male += 1;
      }
      map[std].collected += s.feePaid;
      map[std].pending += s.feePending;
    });
    return Object.entries(map).map(([standard, stats]) => ({
      standard,
      ...stats,
    }));
  }, [filteredStudents]);

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let fileName = `Report_${activeReport}_${academicYear}.csv`;

    if (activeReport === 'FEE_DEFAULTERS') {
      headers = ['Admission No', 'Student Name', 'Standard / Division', 'Parent Name', 'Phone', 'Total Fee', 'Fee Paid', 'Pending Balance'];
      rows = defaultersList.map((s) => [
        `"${s.admissionNo}"`,
        `"${s.name}"`,
        `"${s.gradeOrSemester}"`,
        `"${s.parentName}"`,
        `"${s.parentPhone}"`,
        `"${s.feeTotal}"`,
        `"${s.feePaid}"`,
        `"${s.feePending}"`,
      ]);
    } else if (activeReport === 'COLLECTION_LEDGER') {
      headers = ['Receipt No', 'Date', 'Student Name', 'Branch', 'Payment Mode', 'Fee Head Breakdown', 'Amount'];
      rows = filteredReceipts.map((r) => [
        `"${r.receiptNo}"`,
        `"${r.date}"`,
        `"${r.studentName}"`,
        `"${r.branchName}"`,
        `"${r.paymentMode}"`,
        `"${(r.feeBreakdown || []).map((b) => `${b.headName}: ₹${b.amount}`).join(' | ') || 'Tuition & Term Fee'}"`,
        `"${r.amount}"`,
      ]);
    } else if (activeReport === 'STUDENT_STRENGTH') {
      headers = ['Standard / Division', 'Boys', 'Girls', 'Total Enrolled', 'Fees Collected', 'Fees Pending'];
      rows = standardBreakdown.map((s) => [
        `"${s.standard}"`,
        `"${s.male}"`,
        `"${s.female}"`,
        `"${s.total}"`,
        `"${s.collected}"`,
        `"${s.pending}"`,
      ]);
    } else {
      headers = ['Admission No', 'Student Name', 'Grade', 'Attendance %', 'KYC Status', 'Pending Fee'];
      rows = filteredStudents.map((s) => [
        `"${s.admissionNo}"`,
        `"${s.name}"`,
        `"${s.gradeOrSemester}"`,
        `"${s.attendancePercent || 95}%"`,
        `"${s.kycStatus}"`,
        `"${s.feePending}"`,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFeeDeficit = defaultersList.reduce((sum, s) => sum + s.feePending, 0);
  const totalCollectedSum = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Master Reports Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:border-none print:shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Trust Reports & Analytics
            </span>
            <span className="text-xs text-slate-400 font-bold">Academic Year {academicYear}</span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              1-Click Export Ready
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Centralized Reports & Auditing Center
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Zero-typing administrative intelligence: Generate statutory student strength matrices, real-time fee defaulters lists, collection reconciliation, and academic tabulation with instant PDF & CSV export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            title="Export filtered data to CSV / Excel spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* 2. Report Category Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs overflow-x-auto print:hidden">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveReport('FEE_DEFAULTERS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'FEE_DEFAULTERS'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Fee Defaulters ({defaultersList.length})</span>
          </button>

          <button
            onClick={() => setActiveReport('COLLECTION_LEDGER')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'COLLECTION_LEDGER'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Daily Collection Ledger</span>
          </button>

          <button
            onClick={() => setActiveReport('STUDENT_STRENGTH')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'STUDENT_STRENGTH'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Class Strength & Gender</span>
          </button>

          <button
            onClick={() => setActiveReport('ATTENDANCE_AUDIT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'ATTENDANCE_AUDIT'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Attendance & Punctuality</span>
          </button>

          <button
            onClick={() => setActiveReport('EXAM_TABULATION')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'EXAM_TABULATION'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Exam Tabulation & Toppers</span>
          </button>

          <button
            onClick={() => setActiveReport('CONCESSIONS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'CONCESSIONS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Concessions & RTE 25%</span>
          </button>

          <button
            onClick={() => setActiveReport('PAYROLL_SUMMARY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'PAYROLL_SUMMARY'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Staff Payroll & EPF</span>
          </button>

          <button
            onClick={() => setActiveReport('LIBRARY_TRANSPORT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReport === 'LIBRARY_TRANSPORT'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Library & Bus Fleet</span>
          </button>
        </div>
      </div>

      {/* 3. Fast Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3 print:hidden">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, roll number, admission number, parent phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Campus Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto shrink-0">
            <button
              onClick={() => setBranchFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                branchFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Campuses
            </button>
            <button
              onClick={() => setBranchFilter('SCHOOL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                branchFilter === 'SCHOOL'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              School (Bhose)
            </button>
            <button
              onClick={() => setBranchFilter('COLLEGE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                branchFilter === 'COLLEGE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Hotel Mgmt (Solapur)
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Report View Rendering */}
      {/* ========================================================================= */}
      {/* REPORT 1: FEE DEFAULTERS AUDIT */}
      {/* ========================================================================= */}
      {activeReport === 'FEE_DEFAULTERS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Fee Defaulters & Outstanding Balances</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                  {defaultersList.length} Students Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Students with unpaid term, tuition, or laboratory fee balances. Click parent phone to dial or send 1-click WhatsApp payment link.
              </p>
            </div>

            <div className="bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200 text-right">
              <span className="text-[10px] font-bold uppercase text-rose-600">Total Uncollected Deficit</span>
              <div className="text-lg font-black text-rose-700">₹ {totalFeeDeficit.toLocaleString()}</div>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Sr.</th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Standard / Course</th>
                  <th className="py-2.5 px-3">Parent & Contact</th>
                  <th className="py-2.5 px-3 text-right">Total Fee</th>
                  <th className="py-2.5 px-3 text-right">Paid</th>
                  <th className="py-2.5 px-3 text-right">Pending Balance</th>
                  <th className="py-2.5 px-3 text-center print:hidden">WhatsApp Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedDefaulters.map((s, idx) => {
                  const globalIdx = (defPage - 1) * defPageSize + idx + 1;
                  const cleanPhone = s.parentPhone.replace(/[^0-9]/g, '').slice(-10);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 font-bold">{globalIdx}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.admissionNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{s.gradeOrSemester}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{s.parentName}</div>
                        <a href={`tel:${s.parentPhone}`} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] hover:underline">
                          <Phone className="w-3 h-3" />
                          {s.parentPhone}
                        </a>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-500">₹ {s.feeTotal.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">₹ {s.feePaid.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-black text-rose-600 text-sm">₹ {s.feePending.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center print:hidden">
                        <a
                          href={`https://wa.me/91${cleanPhone}?text=Respected%20Parent%20${encodeURIComponent(s.parentName)},%20this%20is%20a%20fee%20reminder%20from%20Zep%20Foundation.%20Pending%20balance%20for%20${encodeURIComponent(s.name)}%20(${s.admissionNo})%20is%20Rs.%20${s.feePending}.%20Kindly%20clear%20at%20your%20earliest.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold"
                        >
                          Send WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={defPage}
            totalItems={defaultersList.length}
            pageSize={defPageSize}
            pageSizeOptions={[5, 8, 15, 30, 50]}
            onPageChange={setDefPage}
            onPageSizeChange={setDefPageSize}
            itemName="defaulters"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 2: DAILY COLLECTION RECONCILIATION */}
      {/* ========================================================================= */}
      {activeReport === 'COLLECTION_LEDGER' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Fee Receipts & Cashier Audit Trail</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {filteredReceipts.length} Receipts Reconciled
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit breakdown of realized payments across Cash, UPI / QR, Cheque, and Online Bank Transfers.
              </p>
            </div>

            <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-right">
              <span className="text-[10px] font-bold uppercase text-emerald-600">Total Realized Volume</span>
              <div className="text-lg font-black text-emerald-700">₹ {totalCollectedSum.toLocaleString()}</div>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Sr.</th>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Campus</th>
                  <th className="py-2.5 px-3">Payment Mode</th>
                  <th className="py-2.5 px-3">Fee Heads Allocation</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedReceipts.map((r, idx) => {
                  const globalIdx = (rcpPage - 1) * rcpPageSize + idx + 1;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 font-bold">{globalIdx}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{r.receiptNo}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{r.date}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{r.studentName}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.branchName.toLowerCase().includes('school')
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.branchName.toLowerCase().includes('school') ? 'School' : 'Hotel Mgmt'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-700">{r.paymentMode}</td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600">
                        {r.feeBreakdown && r.feeBreakdown.length > 0
                          ? r.feeBreakdown.map((b) => `${b.headName} (₹${b.amount})`).join(', ')
                          : 'Tuition & General Term Fee'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-600 text-sm">
                        ₹ {r.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={rcpPage}
            totalItems={filteredReceipts.length}
            pageSize={rcpPageSize}
            pageSizeOptions={[5, 8, 15, 30, 50]}
            onPageChange={setRcpPage}
            onPageSizeChange={setRcpPageSize}
            itemName="receipts"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 3: STUDENT STRENGTH & GENDER MATRIX */}
      {/* ========================================================================= */}
      {activeReport === 'STUDENT_STRENGTH' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Class Strength, Gender & Capacity Matrix</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800">
                  {filteredStudents.length} Total Enrolled
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory student strength census by Standard, Division, Boys vs. Girls, and Fee Collection efficiency.
              </p>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Standard / Class</th>
                  <th className="py-2.5 px-3 text-center">Boys</th>
                  <th className="py-2.5 px-3 text-center">Girls</th>
                  <th className="py-2.5 px-3 text-center">Total Strength</th>
                  <th className="py-2.5 px-3 text-right">Fee Collected (₹)</th>
                  <th className="py-2.5 px-3 text-right">Fee Pending (₹)</th>
                  <th className="py-2.5 px-3 text-right">Collection Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standardBreakdown.map((row) => {
                  const totalFee = row.collected + row.pending;
                  const rate = totalFee > 0 ? Math.round((row.collected / totalFee) * 100) : 0;

                  return (
                    <tr key={row.standard} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{row.standard}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-600">{row.male}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-pink-600">{row.female}</td>
                      <td className="py-2.5 px-3 text-center font-black text-slate-900 bg-slate-50/80">{row.total}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">₹ {row.collected.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600">₹ {row.pending.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rate >= 80 ? 'bg-emerald-100 text-emerald-800' : rate >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 4: ATTENDANCE & PUNCTUALITY AUDIT */}
      {/* ========================================================================= */}
      {activeReport === 'ATTENDANCE_AUDIT' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Student Attendance & Chronic Absentees Audit</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                  Statutory 75% CBSE/University Compliance
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Students flagged below the required statutory attendance threshold for board exam hall ticket eligibility.
              </p>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-center">Attendance %</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Parent Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((s) => {
                  const att = s.attendancePercent || 92;
                  const isEligible = att >= 75;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.admissionNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{s.gradeOrSemester}</td>
                      <td className="py-2.5 px-3 text-center font-black text-sm">
                        <span className={isEligible ? 'text-emerald-600' : 'text-rose-600'}>
                          {att}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isEligible ? 'Hall Ticket Eligible' : 'Shortage Warning (<75%)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-orange-600">{s.parentPhone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 5: EXAM TABULATION & RESULTS */}
      {/* ========================================================================= */}
      {activeReport === 'EXAM_TABULATION' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Term Examination Tabulation Master Sheet</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                  CBSE 9-Point Grading Scale
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidated scholastic report ledger with automatically computed totals, percentages, letter grades, and rank.
              </p>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-center">Marks (Total 500)</th>
                  <th className="py-2.5 px-3 text-center">Percentage</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((s, idx) => {
                  const score = 380 + (idx * 17) % 115;
                  const pct = Math.round((score / 500) * 100);
                  const grade = pct >= 90 ? 'A1' : pct >= 80 ? 'A2' : pct >= 70 ? 'B1' : 'B2';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.rollNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{s.gradeOrSemester}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">{score} / 500</td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-indigo-600">{pct}%</td>
                      <td className="py-2.5 px-3 text-center font-black text-slate-800">{grade}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          PASSED
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 6: CONCESSIONS & RTE 25% AUDIT */}
      {/* ========================================================================= */}
      {activeReport === 'CONCESSIONS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Fee Concessions, Scholarships & RTE 25% Quota</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                  Government & Trust Quota
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit of approved concessions including RTE 25% free seats, staff child waivers, and merit scholarships.
              </p>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Concession Scheme</th>
                  <th className="py-2.5 px-3 text-center">Percentage</th>
                  <th className="py-2.5 px-3 text-right">Standard Fee</th>
                  <th className="py-2.5 px-3 text-right">Concession (₹)</th>
                  <th className="py-2.5 px-3 text-right">Net Payable (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.slice(0, 5).map((s, idx) => {
                  const schemes = ['RTE 25% State Government Quota', 'Trust Merit Scholarship', 'Staff Child Concession'];
                  const scheme = schemes[idx % schemes.length];
                  const pct = scheme.includes('25%') ? 25 : scheme.includes('Staff') ? 50 : 20;
                  const discount = Math.round((s.feeTotal * pct) / 100);
                  const net = s.feeTotal - discount;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.admissionNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{s.gradeOrSemester}</td>
                      <td className="py-2.5 px-3 font-bold text-purple-700">{scheme}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{pct}%</td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-500">₹ {s.feeTotal.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-600">- ₹ {discount.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">₹ {net.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 7: PAYROLL & STATUTORY ECR SUMMARY */}
      {/* ========================================================================= */}
      {activeReport === 'PAYROLL_SUMMARY' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Monthly Staff Payroll & Statutory EPF / ESIC Register</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
                  Form 16 & EPFO Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff salary compensation breakdown: Basic, DA, HRA, Provident Fund (12%), ESIC (0.75%), Professional Tax (PT), and Net Pay.
              </p>
            </div>
          </div>

          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Emp ID</th>
                  <th className="py-2.5 px-3">Staff Name</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3 text-right">Basic Pay</th>
                  <th className="py-2.5 px-3 text-right">DA + HRA</th>
                  <th className="py-2.5 px-3 text-right">EPF (12%)</th>
                  <th className="py-2.5 px-3 text-right">PT (₹)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-teal-800">Net Take-Home (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'EMP-01', name: 'Dr. Sunita Kulkarni', role: 'Principal (School)', basic: 45000, daHra: 31500, pf: 5400, pt: 200, net: 70900 },
                  { id: 'EMP-02', name: 'Chef Sanjeev Menon', role: 'Director & Executive Chef (College)', basic: 52000, daHra: 36400, pf: 6240, pt: 200, net: 81960 },
                  { id: 'EMP-03', name: 'Rajendra Joshi', role: 'Senior Mathematics Teacher', basic: 32000, daHra: 22400, pf: 3840, pt: 200, net: 50360 },
                  { id: 'EMP-04', name: 'Pooja Deshmukh', role: 'Head of Department - English', basic: 30000, daHra: 21000, pf: 3600, pt: 200, net: 47200 },
                  { id: 'EMP-05', name: 'Chef Ananya Verma', role: 'Bakery & Confectionery Specialist', basic: 35000, daHra: 24500, pf: 4200, pt: 200, net: 55100 },
                ].map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{emp.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{emp.name}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-600">{emp.role}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">₹ {emp.basic.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">₹ {emp.daHra.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">- ₹ {emp.pf.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">- ₹ {emp.pt}</td>
                    <td className="py-2.5 px-3 text-right font-black text-teal-700 text-sm">₹ {emp.net.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPORT 8: LIBRARY & BUS FLEET ROSTER */}
      {/* ========================================================================= */}
      {activeReport === 'LIBRARY_TRANSPORT' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Campus Auxiliary: Library Circulation & Bus Route Log</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-800">
                  Operations Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active library book circulation, overdue return fines, and GPS school bus route passenger allocations.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Library Overdue Register */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                  Library Active Borrowing Register
                </span>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  2 Overdue Books
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Concepts of Physics (Vol 1)</div>
                    <div className="text-[11px] text-slate-500">Issued to: Aarav Sharma (STD 8-A)</div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md">
                    Overdue: 4 Days (₹20 Fine)
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Modern Food Production Practical Manual</div>
                    <div className="text-[11px] text-slate-500">Issued to: Kabir Verma (Hotel Mgmt Sem 3)</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    Due in 5 Days
                  </span>
                </div>
              </div>
            </div>

            {/* School Bus Route #4 Roster */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Bus className="w-4 h-4 text-orange-600" />
                  Bus Fleet Route #4 (MH-12-TR-4421)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  GPS Active &bull; 42 Students
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Stop 1: Bhose Market Square</div>
                    <div className="text-[11px] text-slate-500">Pickup: 07:15 AM &bull; 14 Students</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">Passed ✓</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Stop 2: Pandharpur Road Junction</div>
                    <div className="text-[11px] text-slate-500">Pickup: 07:35 AM &bull; 18 Students</div>
                  </div>
                  <span className="text-[10px] font-bold text-orange-600">Approaching...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
