import React, { useState } from 'react';
import {
  School,
  UserPlus,
  Receipt,
  Bus,
  CalendarCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  X,
  Play,
  RotateCcw,
  QrCode,
  TrendingUp,
} from 'lucide-react';
import { Student, FeeReceipt, BusRoute } from '../types';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';

interface SchoolModuleProps {
  students: Student[];
  onAddStudent: (studentData: any) => void;
  onCollectFee: (studentId: string, amount: number, mode: any) => void;
  busRoute: BusRoute;
  onSimulateBusStep: () => void;
  initialTab?: 'STUDENTS' | 'FEES' | 'ATTENDANCE' | 'BUS';
  academicYear?: string;
  onOpenProgression?: () => void;
}

export const SchoolModule: React.FC<SchoolModuleProps> = ({
  students,
  onAddStudent,
  onCollectFee,
  busRoute,
  onSimulateBusStep,
  initialTab,
  academicYear = '2026-2027',
  onOpenProgression,
}) => {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'FEES' | 'ATTENDANCE' | 'BUS'>(initialTab || 'STUDENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState<Student | null>(null);
  const [feeAmount, setFeeAmount] = useState('12000');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'CHEQUE'>('UPI');
  const [activeReceipt, setActiveReceipt] = useState<FeeReceipt | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // New admission form state
  const [newStudent, setNewStudent] = useState({
    name: '',
    gender: 'MALE',
    gradeOrSemester: 'Class 7-A',
    parentName: '',
    parentPhone: '',
    feeTotal: 36000,
  });

  const schoolStudents = students.filter(
    (s) =>
      s.branchId === 'branch-sch-01' &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const {
    sortedData: sortedSchoolStudents,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<Student>(schoolStudents, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  const {
    currentPage: schoolPage,
    setCurrentPage: setSchoolPage,
    pageSize: schoolPageSize,
    setPageSize: setSchoolPageSize,
    paginatedItems: paginatedSchoolStudents,
  } = usePagination(sortedSchoolStudents, 10);

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name) return;
    onAddStudent({
      ...newStudent,
      branchId: 'branch-sch-01',
    });
    setShowAdmissionModal(false);
    setNewStudent({
      name: '',
      gender: 'MALE',
      gradeOrSemester: 'Class 7-A',
      parentName: '',
      parentPhone: '',
      feeTotal: 36000,
    });
  };

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFeeModal) return;
    const amount = Number(feeAmount);
    onCollectFee(showFeeModal.id, amount, paymentMode);

    // Create receipt view for demo
    const generatedReceipt: FeeReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNo: `RCP-SCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: showFeeModal.id,
      studentName: showFeeModal.name,
      branchName: 'Modern Public School And Junior College Bhose',
      amount,
      paymentMode,
      date: new Date().toISOString().split('T')[0],
      installmentNo: 2,
      status: 'PAID',
    };
    setActiveReceipt(generatedReceipt);
    setShowFeeModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Sub-Tabs Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full mb-1">
            <School className="w-3.5 h-3.5" />
            Branch: Modern Public School And Junior College Bhose
          </div>
          <h2 className="text-xl font-bold text-slate-900">School Administration Center</h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <button
            onClick={() => setActiveTab('STUDENTS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'STUDENTS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Admissions ({schoolStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('FEES')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'FEES' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Fees & Receipts
          </button>
          <button
            onClick={() => setActiveTab('ATTENDANCE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ATTENDANCE' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('BUS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'BUS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Bus className="w-3.5 h-3.5 text-orange-500" />
            Live Bus GPS
          </button>
        </div>
      </div>

      {/* TAB 1: STUDENTS & ADMISSIONS */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by student name or admission no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              {onOpenProgression && (
                <button
                  onClick={onOpenProgression}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                  Annual Student Progression
                </button>
              )}
              <button
                onClick={() => setShowAdmissionModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                New Student Admission
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center" />
                    <SortableTh label="Student Name & Roll" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Class" sortKey="gradeOrSemester" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Parent Details" sortKey="parentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Fee Status" sortKey="feePending" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Attendance" sortKey="attendancePercent" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="KYC Docs" sortKey="kycStatus" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedSchoolStudents.map((stu, index) => {
                    const globalIndex = (schoolPage - 1) * schoolPageSize + index + 1;
                    return (
                      <tr key={stu.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-500 font-mono text-xs">{globalIndex}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{stu.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {stu.admissionNo} &bull; {stu.rollNo}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-semibold">
                            {stu.gradeOrSemester}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{stu.parentName}</div>
                          <div className="text-[11px] text-slate-400">{stu.parentPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            ₹ {stu.feePaid.toLocaleString()} / ₹ {stu.feeTotal.toLocaleString()}
                          </div>
                          {stu.feePending > 0 ? (
                            <div className="text-[11px] text-rose-600 font-semibold">
                              Due: ₹ {stu.feePending.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-[11px] text-emerald-600 font-semibold">
                              Fully Cleared
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-800">
                            {stu.attendancePercent}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              stu.kycStatus === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {stu.kycStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onOpenProgression && (
                              <button
                                onClick={onOpenProgression}
                                title="Advance to next standard with pending fee carry forward"
                                className="bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all text-[11px] inline-flex items-center gap-1"
                              >
                                <TrendingUp className="w-3 h-3 text-orange-500" />
                                Carry Fwd
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setShowFeeModal(stu);
                                setFeeAmount(String(stu.feePending > 0 ? stu.feePending : 12000));
                              }}
                              className="bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-600 font-bold px-3 py-1.5 rounded-lg border border-orange-200 transition-all text-[11px]"
                            >
                              Collect Fee
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* School Students Table Pagination Controls */}
            <TablePagination
              currentPage={schoolPage}
              totalItems={sortedSchoolStudents.length}
              pageSize={schoolPageSize}
              pageSizeOptions={[5, 10, 25, 50]}
              onPageChange={setSchoolPage}
              onPageSizeChange={setSchoolPageSize}
              itemName="school students"
            />
          </div>
        </div>
      )}

      {/* TAB 2: FEES & RECEIPT GENERATOR */}
      {activeTab === 'FEES' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Fee Management & Instant Receipts</h3>
            <span className="text-xs text-slate-500">Auto-calculated installment rules</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="text-xs text-orange-800 font-semibold">Standard School Annual Fee</div>
              <div className="text-2xl font-extrabold text-orange-950 mt-1">₹ 36,000</div>
              <div className="text-[11px] text-orange-700 mt-1">Allowed in 3 Installments of ₹12,000</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-xs text-emerald-800 font-semibold">UPI Payment Integration</div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-1">0% Surcharge</div>
              <div className="text-[11px] text-emerald-700 mt-1">Direct Trust Bank Settlement</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="text-xs text-amber-800 font-semibold">Late Fee Grace Period</div>
              <div className="text-2xl font-extrabold text-amber-950 mt-1">10 Days</div>
              <div className="text-[11px] text-amber-700 mt-1">SMS reminder sent on 5th & 10th</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-700 font-medium">
              Want to see a live sample receipt with official Trust seal and QR code?
            </div>
            <button
              onClick={() => {
                const sampleRcp: FeeReceipt = {
                  id: 'rcp-demo',
                  receiptNo: 'RCP-SCH-2026-081',
                  studentId: 'stu-s01',
                  studentName: 'Aarav Sharma',
                  branchName: 'Modern Public School And Junior College Bhose',
                  amount: 12000,
                  paymentMode: 'UPI',
                  date: '2026-10-21',
                  installmentNo: 2,
                  status: 'PAID',
                };
                setActiveReceipt(sampleRcp);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Receipt className="w-4 h-4" />
              Preview Official Fee Receipt
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Class 7-A Daily Attendance Sheet</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => alert('Attendance submitted! Absentee SMS alerts sent to 1 parent.')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              Save Attendance & Send Absent Alerts
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {schoolStudents.map((stu, idx) => (
              <div key={stu.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{stu.name}</div>
                    <div className="text-[11px] text-slate-400">{stu.rollNo}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Present
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SCHOOL BUS TRACKER */}
      {activeTab === 'BUS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                Live GPS Active Trip
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{busRoute.routeName}</h3>
              <p className="text-xs text-slate-500">
                Bus: {busRoute.busNumber} &bull; Driver: {busRoute.driverName} ({busRoute.driverPhone})
              </p>
            </div>

            {/* Simulation Controller for Demo */}
            <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-2xl border border-orange-200">
              <span className="text-xs text-orange-950 font-bold px-2">Demo Controls:</span>
              <button
                onClick={onSimulateBusStep}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Simulate Next Bus Stop
              </button>
            </div>
          </div>

          {/* Interactive Route Map Visualizer */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-600">GPS Signal: Strong (Online)</span>
              </div>
              <div className="text-xs text-slate-500">
                Speed: <span className="text-slate-900 font-bold">{busRoute.currentSpeed} km/h</span>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-4 my-6">
              {busRoute.stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      stop.passed
                        ? 'bg-emerald-500 text-white'
                        : i === 2
                        ? 'bg-orange-600 text-white ring-4 ring-orange-500/20 animate-pulse'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {stop.passed ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between text-xs">
                    <span className={stop.passed ? 'text-slate-400 line-through' : i === 2 ? 'text-orange-600 font-bold' : 'text-slate-700'}>
                      {stop.name} {i === 2 && '📍 (BUS APPROACHING - 400m away)'}
                    </span>
                    <span className="text-slate-500">{stop.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Coordinates broadcasted to parent mobile app every 5 seconds via WebSockets.
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW ADMISSION INTAKE */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-orange-100 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">New School Student Admission</h3>
              <button onClick={() => setShowAdmissionModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmission} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvi Kadam"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Class *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.gradeOrSemester}
                    onChange={(e) => setNewStudent({ ...newStudent, gradeOrSemester: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father/Mother Name</label>
                  <input
                    type="text"
                    placeholder="Parent Name"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98230 XXXXX"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Fee (₹)</label>
                <input
                  type="number"
                  value={newStudent.feeTotal}
                  onChange={(e) => setNewStudent({ ...newStudent, feeTotal: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none font-bold text-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-white shadow-md shadow-orange-600/20"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COLLECT FEE */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-orange-100 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Collect Fee Payment</h3>
              <button onClick={() => setShowFeeModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mb-4 text-xs">
              <div className="font-bold text-slate-900">{showFeeModal.name}</div>
              <div className="text-slate-500">
                {showFeeModal.admissionNo} &bull; {showFeeModal.gradeOrSemester}
              </div>
              <div className="mt-2 text-rose-700 font-bold">
                Current Pending Dues: ₹ {showFeeModal.feePending.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handlePayFee} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount to Collect (₹) *</label>
                <input
                  type="number"
                  required
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full text-base font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'CASH', 'CHEQUE'] as const).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        paymentMode === mode
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeeModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md"
                >
                  Confirm & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE FEE RECEIPT MODAL */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Area */}
            <div id="printable-receipt" className="border-2 border-orange-200 rounded-2xl p-6 bg-amber-50/15">
              <div className="text-center border-b border-orange-200 pb-4 mb-4">
                <div className="text-xs uppercase font-extrabold text-orange-600 tracking-wider">
                  Zep Foundation Bhose
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {activeReceipt.branchName}
                </h4>
                <p className="text-[10px] text-slate-500">
                  Affiliated to CBSE &bull; Reg No: MH/EDU/TR-88219/2005
                </p>
                <div className="inline-block bg-orange-100 text-orange-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-2">
                  Official Fee Payment Receipt
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div>
                  <span className="text-slate-400 text-[10px]">Receipt No:</span>
                  <div className="font-bold text-slate-900">{activeReceipt.receiptNo}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px]">Date of Payment:</span>
                  <div className="font-bold text-slate-900">{activeReceipt.date}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Student Name:</span>
                  <div className="font-bold text-slate-900">{activeReceipt.studentName}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px]">Payment Mode:</span>
                  <div className="font-bold text-slate-900">{activeReceipt.paymentMode}</div>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 my-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-800">
                    Tuition & Academic Term Installment #{activeReceipt.installmentNo}
                  </div>
                  <div className="text-[10px] text-slate-400">Status: Verified & Settled</div>
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  ₹ {activeReceipt.amount.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <QrCode className="w-10 h-10 text-slate-800" />
                  <span className="text-[9px] text-slate-400 leading-tight">
                    Scan QR Code to verify authenticity online
                  </span>
                </div>
                <div className="text-right">
                  <div className="h-6" />
                  <div className="text-[10px] font-bold text-slate-700 border-t border-slate-400 pt-1">
                    Authorized Cashier Sign
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20"
              >
                <Printer className="w-4 h-4" />
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
