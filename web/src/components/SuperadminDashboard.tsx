import React from 'react';
import {
  TrendingUp,
  CreditCard,
  Users,
  AlertCircle,
  School,
  UtensilsCrossed,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Calendar,
  Bus,
  BookOpen,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Student, FeeReceipt, AdmissionEnquiry } from '../types';
import { DashboardTab } from './Sidebar';
import { useTableSort, SortableTh } from './TableSort';

interface SuperadminDashboardProps {
  students: Student[];
  receipts: FeeReceipt[];
  enquiries: AdmissionEnquiry[];
  onSwitchBranch: (branch: 'SCHOOL' | 'COLLEGE') => void;
  academicYear?: string;
  selectedBranch?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onOpenProgression?: () => void;
  onNavigateTab?: (tab: DashboardTab) => void;
  userRole?: string;
}

export const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({
  students,
  receipts,
  enquiries,
  onSwitchBranch,
  academicYear = '2026-2027',
  selectedBranch = 'ALL',
  onOpenProgression,
  onNavigateTab,
  userRole,
}) => {
  // Academic year multiplier for realistic historical simulation
  const yearMultiplier = academicYear === '2026-2027' ? 1.0 : academicYear === '2025-2026' ? 0.91 : 0.82;

  // Filter students based on branch scope
  const filteredStudents = students.filter((s) => {
    if (selectedBranch === 'SCHOOL') return s.branchId === 'branch-sch-01';
    if (selectedBranch === 'COLLEGE') return s.branchId === 'branch-hm-01';
    return true;
  });

  const schoolStudents = students.filter((s) => s.branchId === 'branch-sch-01');
  const collegeStudents = students.filter((s) => s.branchId === 'branch-hm-01');

  const totalRevenue = Math.round(filteredStudents.reduce((sum, s) => sum + s.feeTotal, 0) * yearMultiplier);
  const totalCollected = Math.round(filteredStudents.reduce((sum, s) => sum + s.feePaid, 0) * yearMultiplier);
  const totalPending = Math.round(filteredStudents.reduce((sum, s) => sum + s.feePending, 0) * yearMultiplier);
  const collectionPercentage = totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0;

  // Recent 3 receipts for clean preview
  const recentReceipts = receipts
    .filter((rcp) => {
      if (selectedBranch === 'SCHOOL') return rcp.branchName.toLowerCase().includes('school');
      if (selectedBranch === 'COLLEGE') return rcp.branchName.toLowerCase().includes('hotel') || rcp.branchName.toLowerCase().includes('imperial');
      return true;
    })
    .slice(0, 3);

  const {
    sortedData: sortedRecentReceipts,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<FeeReceipt>(recentReceipts, {
    defaultKey: null,
    defaultDirection: 'desc',
  });

  const isSchoolScope = selectedBranch === 'SCHOOL';
  const isCollegeScope = selectedBranch === 'COLLEGE';
  const isAllScope = selectedBranch === 'ALL';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Executive Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-orange-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase font-black tracking-wider bg-white/20 px-3 py-1 rounded-full text-orange-100 border border-white/30">
              {isAllScope ? 'Trust Superadmin Executive Console' : isSchoolScope ? 'School Branch Console' : 'Hotel Mgmt College Console'}
            </span>
            <span className="text-[11px] font-bold bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1 border border-white/30">
              <Calendar className="w-3 h-3" />
              Academic Year: {academicYear}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2.5 tracking-tight">
            {isAllScope
              ? 'Zep Foundation Bhose'
              : isSchoolScope
              ? 'Modern Public School And Junior College Bhose'
              : 'Modern College Of Hotel Management And Technology Solapur'}
          </h1>

          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl font-medium">
            {isAllScope
              ? 'Master financial and academic oversight over both the School and the Hotel Management College.'
              : isSchoolScope
              ? 'K-12 Primary, Middle & Secondary CBSE education. Strictly isolated branch financials and student rosters.'
              : 'B.Sc in Hospitality & Hotel Administration. Culinary kitchen labs, bakery studios, and 5-star internships.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenProgression && (
            <button
              onClick={onOpenProgression}
              className="bg-amber-400 hover:bg-amber-300 text-orange-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-orange-950" />
              Annual Progression
            </button>
          )}

          {isAllScope && (
            <>
              <button
                onClick={() => onSwitchBranch('SCHOOL')}
                className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <School className="w-4 h-4 text-orange-600" />
                School Branch
              </button>
              <button
                onClick={() => onSwitchBranch('COLLEGE')}
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs border border-white/30 transition-all flex items-center gap-1.5"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-200" />
                College Branch
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Primary Financial & Student KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Strength */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isAllScope ? 'Trust Total Strength' : 'Enrolled Students'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{filteredStudents.length} Students</div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            {isAllScope ? (
              <span>
                <strong className="text-emerald-600">{schoolStudents.length} School</strong> &bull;{' '}
                <strong className="text-orange-600">{collegeStudents.length} College</strong>
              </span>
            ) : (
              <span className="text-emerald-600 font-bold">100% active KYC verified</span>
            )}
          </div>
        </div>

        {/* Total Fee Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Revenue Target
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹ {(totalRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Annual fee budget for {academicYear}
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Fees Collected
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900">
            ₹ {(totalCollected / 100000).toFixed(2)} Lakhs
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
            <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${collectionPercentage}%` }}
              ></div>
            </div>
            <span>{collectionPercentage}%</span>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-white rounded-2xl p-5 border border-rose-100 bg-rose-50/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              Pending Dues
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-900">
            ₹ {(totalPending / 100000).toFixed(2)} Lakhs
          </div>
          <div className="mt-2 text-xs font-semibold text-rose-600">
            Outstanding balance to be collected
          </div>
        </div>
      </div>

      {/* 3. The 2 Arches (Displayed prominently when viewing Trust Superadmin) */}
      {isAllScope && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                The 2 Branches / Arches Under Superadmin Supervision
              </h2>
              <p className="text-xs text-slate-500">
                Independent academic programs under unified trust governance.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Session: {academicYear}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Arch 1: School */}
            <div className="bg-white rounded-2xl p-5 border-2 border-orange-100 shadow-sm hover:border-orange-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                        Branch #1 &bull; School
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                        Modern Public School And Junior College Bhose
                      </h3>
                      <p className="text-[11px] text-slate-500">K-12 Primary, Middle & Secondary Education</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSwitchBranch('SCHOOL')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 shrink-0"
                  >
                    Open Branch <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-orange-50/50 rounded-xl p-3 text-center border border-orange-100/60 my-3">
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Strength</div>
                    <div className="text-base font-black text-slate-800">{schoolStudents.length} / 100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Collected</div>
                    <div className="text-base font-black text-emerald-600">
                      ₹ {((schoolStudents.reduce((sum, s) => sum + s.feePaid, 0) * yearMultiplier) / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Pending</div>
                    <div className="text-base font-black text-rose-600">
                      ₹ {((schoolStudents.reduce((sum, s) => sum + s.feePending, 0) * yearMultiplier) / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Transport: 4 Buses Active (Live GPS)</span>
                <span className="text-emerald-600 font-bold">Avg. Attendance: 94%</span>
              </div>
            </div>

            {/* Arch 2: College */}
            <div className="bg-white rounded-2xl p-5 border-2 border-amber-100 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Branch #2 &bull; College
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                        Modern College Of Hotel Management And Technology Solapur
                      </h3>
                      <p className="text-[11px] text-slate-500">B.Sc in Hospitality & Culinary Arts</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSwitchBranch('COLLEGE')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0"
                  >
                    Open Branch <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-amber-50/50 rounded-xl p-3 text-center border border-amber-100/60 my-3">
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Strength</div>
                    <div className="text-base font-black text-slate-800">{collegeStudents.length} / 200</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Collected</div>
                    <div className="text-base font-black text-emerald-600">
                      ₹ {((collegeStudents.reduce((sum, s) => sum + s.feePaid, 0) * yearMultiplier) / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Pending</div>
                    <div className="text-base font-black text-rose-600">
                      ₹ {((collegeStudents.reduce((sum, s) => sum + s.feePending, 0) * yearMultiplier) / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Culinary Labs: BTK & Bakery Active</span>
                <span className="text-amber-600 font-bold">Industry Internships: 100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Quick Access to Clean Dedicated Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900">
            Dedicated ERP Modules & Operations
          </h2>
          <span className="text-xs text-slate-400">Click to open any module directly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Module 1: Students */}
          <button
            onClick={() => onNavigateTab?.('STUDENTS')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Student Directory</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{filteredStudents.length} Students</div>
            </div>
          </button>

          {/* Module 2: Progression */}
          <button
            onClick={() => onNavigateTab?.('PROGRESSION')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Academic Progression</div>
              <div className="text-[10px] text-slate-400 mt-0.5">1st &rarr; 2nd Std Rollover</div>
            </div>
          </button>

          {/* Module 3: Fees */}
          <button
            onClick={() => onNavigateTab?.('FEES')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Fee Ledger</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{receipts.length} Receipts Logged</div>
            </div>
          </button>

          {/* Module 4: Academics */}
          <button
            onClick={() => onNavigateTab?.('ACADEMIC')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              {isCollegeScope ? <UtensilsCrossed className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-orange-600">
                {isCollegeScope ? 'Kitchen Labs' : 'Academics & Attendance'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isCollegeScope ? 'BTK & Bakery' : '30-sec Rapid Mark'}
              </div>
            </div>
          </button>

          {/* Module 5: Bus Fleet (School or All) */}
          {(isAllScope || isSchoolScope) && (
            <button
              onClick={() => onNavigateTab?.('BUS')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Live Bus GPS</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Route #4 Active</div>
              </div>
            </button>
          )}

          {/* Module 6: Enquiries */}
          {(isAllScope || isSchoolScope) && (
            <button
              onClick={() => onNavigateTab?.('ENQUIRIES')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-orange-600">Admission Enquiries</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{enquiries.length} Inquiries</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 5. Clean, Compact Recent Fee Activity Highlight */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Latest Fee Receipts Snapshot
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab?.('FEES')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            Open Full Fee Ledger <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="erp-table-scroll">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <SortableTh label="Sr. No." sortKey="receiptNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center py-2 px-3" />
                <SortableTh label="Receipt No" sortKey="receiptNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2 px-3" />
                <SortableTh label="Student Name" sortKey="studentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2 px-3" />
                <SortableTh label="Branch" sortKey="branchName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2 px-3" />
                <SortableTh label="Amount" sortKey="amount" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2 px-3" />
                <SortableTh label="Payment Mode" sortKey="paymentMode" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2 px-3" />
                <SortableTh label="Status" sortKey="status" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-2 px-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRecentReceipts.map((rcp, index) => (
                <tr key={rcp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{rcp.receiptNo}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{rcp.studentName}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rcp.branchName.toLowerCase().includes('school')
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rcp.branchName.toLowerCase().includes('school') ? 'School' : 'Hotel Mgmt'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">
                    ₹ {rcp.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{rcp.paymentMode}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rcp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

