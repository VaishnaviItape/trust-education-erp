import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
  Printer,
  X,
  Building,
  School,
  UtensilsCrossed,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Student, FeeReceipt } from '../types';
import { exportToExcel, exportToPdf, ExportColumn } from '../utils/exportUtils';
import { FilterBar } from './FilterBar';
import { useTableSort, SortableTh } from './TableSort';

interface FeeLedgerModuleProps {
  students: Student[];
  receipts: FeeReceipt[];
  onCollectFee: (studentId: string, amount: number, mode: any) => void;
  onEditReceipt?: (receipt: FeeReceipt) => void;
  onDeleteReceipt?: (receiptId: string) => void;
  academicYear?: string;
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onChangeBranchScope?: (branch: 'ALL' | 'SCHOOL' | 'COLLEGE') => void;
}

export const FeeLedgerModule: React.FC<FeeLedgerModuleProps> = ({
  students,
  receipts,
  onCollectFee,
  onEditReceipt,
  onDeleteReceipt,
  academicYear = '2026-2027',
  selectedBranchScope = 'ALL',
  onChangeBranchScope,
}) => {
  const [editingReceipt, setEditingReceipt] = useState<FeeReceipt | null>(null);
  const [deletingReceipt, setDeletingReceipt] = useState<FeeReceipt | null>(null);
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(selectedBranchScope);

  useEffect(() => {
    if (selectedBranchScope) {
      setBranchFilter(selectedBranchScope);
    }
  }, [selectedBranchScope]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>('ALL');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [collectAmount, setCollectAmount] = useState('12000');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'CHEQUE'>('UPI');
  const [activeReceipt, setActiveReceipt] = useState<FeeReceipt | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Filter students based on branch
  const filteredStudents = students.filter((s) => {
    if (branchFilter === 'SCHOOL' && s.branchId !== 'branch-sch-01') return false;
    if (branchFilter === 'COLLEGE' && s.branchId !== 'branch-hm-01') return false;
    return true;
  });

  const totalBilled = filteredStudents.reduce((sum, s) => sum + s.feeTotal, 0);
  const totalCollected = filteredStudents.reduce((sum, s) => sum + s.feePaid, 0);
  const totalPending = filteredStudents.reduce((sum, s) => sum + s.feePending, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Filter receipts
  const filteredReceipts = receipts.filter((rcp) => {
    if (branchFilter === 'SCHOOL' && !rcp.branchName.toLowerCase().includes('school')) return false;
    if (branchFilter === 'COLLEGE' && !rcp.branchName.toLowerCase().includes('hotel') && !rcp.branchName.toLowerCase().includes('solapur') && !rcp.branchName.toLowerCase().includes('imperial')) return false;
    if (paymentModeFilter !== 'ALL' && rcp.paymentMode.toUpperCase() !== paymentModeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rcp.studentName.toLowerCase().includes(q) ||
        rcp.receiptNo.toLowerCase().includes(q) ||
        rcp.paymentMode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Client-side sorting for fee receipts
  const {
    sortedData: sortedReceipts,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<FeeReceipt>(filteredReceipts, {
    defaultKey: null,
    defaultDirection: 'desc',
  });

  const handleExportExcel = (onlyFiltered: boolean) => {
    const dataset = onlyFiltered ? filteredReceipts : receipts;
    const columns: ExportColumn[] = [
      { header: 'Receipt No', key: 'receiptNo' },
      { header: 'Student Name', key: 'studentName' },
      { header: 'Institution Branch', key: 'branchName' },
      { header: 'Amount Paid (₹)', key: 'amount' },
      { header: 'Payment Mode', key: 'paymentMode' },
      { header: 'Transaction Date', key: 'date' },
      { header: 'Installment No', key: 'installmentNo' },
      { header: 'Status', key: 'status' },
    ];

    exportToExcel(
      columns,
      dataset,
      onlyFiltered ? `Trust_Filtered_Fee_Ledger_${dataset.length}` : `Trust_ALL_Fee_Ledger_${receipts.length}`
    );
    setShowExportDropdown(false);
  };

  const handleExportPdf = (onlyFiltered: boolean) => {
    const dataset = onlyFiltered ? filteredReceipts : receipts;
    const totalAmount = dataset.reduce((sum, r) => sum + r.amount, 0);

    const columns = [
      'Receipt No',
      'Student Name',
      'Institution Branch',
      'Amount',
      'Mode',
      'Date',
      'Status',
    ];

    const rows = dataset.map((r) => [
      r.receiptNo,
      r.studentName,
      r.branchName.toLowerCase().includes('school') ? 'School' : 'Hotel Mgmt',
      `₹ ${r.amount.toLocaleString()}`,
      r.paymentMode,
      r.date,
      r.status,
    ]);

    exportToPdf({
      title: 'Trust Official Financial Ledger & Receipts Register',
      subtitle: `${onlyFiltered ? 'Filtered Transactions' : 'All Institutional Receipts'} • Session ${academicYear}`,
      summaryMetrics: [
        { label: 'Receipts Logged', value: dataset.length, color: '#0f172a' },
        { label: 'Amount Collected', value: `₹ ${totalAmount.toLocaleString()}`, color: '#16a34a' },
        { label: 'Total Revenue Target', value: `₹ ${(totalBilled / 100000).toFixed(2)} L`, color: '#ea580c' },
        { label: 'Remaining Outstanding', value: `₹ ${(totalPending / 100000).toFixed(2)} L`, color: '#dc2626' },
      ],
      columns,
      rows,
      fileName: onlyFiltered ? 'Trust_Filtered_Fee_Ledger' : 'Trust_Master_Fee_Ledger',
    });
    setShowExportDropdown(false);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === selectedStudentId);
    if (!stu) return;

    const amt = Number(collectAmount);
    onCollectFee(stu.id, amt, paymentMode);

    const generated: FeeReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNo: `RCP-${stu.branchId === 'branch-sch-01' ? 'SCH' : 'HM'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: stu.id,
      studentName: stu.name,
      branchName:
        stu.branchId === 'branch-sch-01'
          ? 'Modern Public School And Junior College Bhose'
          : 'Modern College Of Hotel Management And Technology Solapur',
      amount: amt,
      paymentMode,
      date: new Date().toISOString().split('T')[0],
      installmentNo: 2,
      status: 'PAID',
    };

    setActiveReceipt(generated);
    setShowCollectModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar with Simple Branch Filter & Collect Fee Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              Finance & Ledger
            </span>
            <span className="text-xs text-slate-400 font-bold">Session: {academicYear}</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
              {branchFilter === 'SCHOOL'
                ? 'Modern Public School & Jr College'
                : branchFilter === 'COLLEGE'
                ? 'Modern College of HM & Technology'
                : 'All Campuses Consolidated'}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Fee Management & Collections</h2>
          <p className="text-xs text-slate-500">
            Track fee collections, pending installments, and digital receipts across institutions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export Ledger</span>
              <ChevronDown className="w-3.5 h-3.5 text-orange-200" />
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 animate-scale-in">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Excel (.xlsx / .csv)
                </div>
                <button
                  onClick={() => handleExportExcel(true)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>Export Filtered Receipts</div>
                    <div className="text-[10px] font-normal text-slate-400">{filteredReceipts.length} Receipts in view</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExportExcel(false)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>Export ALL Receipts</div>
                    <div className="text-[10px] font-normal text-slate-400">{receipts.length} Total database receipts</div>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Official PDF Document
                </div>
                <button
                  onClick={() => handleExportPdf(true)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <div>
                    <div>Export Filtered to PDF</div>
                    <div className="text-[10px] font-normal text-slate-400">Printable financial report</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExportPdf(false)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <div>
                    <div>Export ALL Receipts to PDF</div>
                    <div className="text-[10px] font-normal text-slate-400">Complete Master ledger report</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedStudentId(filteredStudents[0]?.id || '');
              setShowCollectModal(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
          >
            <CreditCard className="w-4 h-4" />
            Collect Fee Payment
          </button>
        </div>
      </div>

      {/* 2. 3 Clean, Simple Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Budgeted Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹ {(totalBilled / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {filteredStudents.length} enrolled students
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Fees Collected
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900">
            ₹ {(totalCollected / 100000).toFixed(2)} Lakhs
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-700">
            <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${collectionRate}%` }}
              ></div>
            </div>
            <span>{collectionRate}%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-100 bg-rose-50/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Pending Installments
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-900">
            ₹ {(totalPending / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">
            {filteredStudents.filter((s) => s.feePending > 0).length} students with active dues
          </p>
        </div>
      </div>

      {/* 3. Reusable Unified FilterBar */}
      <FilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search fee receipts by student name, receipt number, mode..."
        dropdowns={[
          {
            id: 'mode',
            label: 'Payment Mode',
            value: paymentModeFilter,
            onChange: setPaymentModeFilter,
            options: [
              { label: 'All Modes', value: 'ALL' },
              { label: 'UPI / Online', value: 'UPI' },
              { label: 'Cash', value: 'CASH' },
              { label: 'Cheque / DD', value: 'CHEQUE' },
            ],
          },
        ]}
        pills={[
          {
            id: 'branch',
            label: 'Branch',
            value: branchFilter,
            onChange: (v) => setBranchFilter(v as any),
            options: [
              { label: 'All', value: 'ALL' },
              { label: 'School', value: 'SCHOOL' },
              { label: 'Hotel Mgmt', value: 'COLLEGE' },
            ],
          },
        ]}
        totalCount={receipts.length}
        filteredCount={filteredReceipts.length}
        itemLabel="receipts"
        isFiltered={searchQuery !== '' || branchFilter !== 'ALL' || paymentModeFilter !== 'ALL'}
        onReset={() => {
          setSearchQuery('');
          setBranchFilter('ALL');
          setPaymentModeFilter('ALL');
        }}
      />

      {/* 4. Transaction Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

        <div className="erp-table-scroll">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px] shadow-2xs">
              <tr>
                <SortableTh label="Sr. No." sortKey="receiptNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center" />
                <SortableTh label="Receipt No" sortKey="receiptNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                <SortableTh label="Student" sortKey="studentName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                <SortableTh label="Institution" sortKey="branchName" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                <SortableTh label="Amount" sortKey="amount" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                <SortableTh label="Payment Mode" sortKey="paymentMode" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                <SortableTh label="Date" sortKey="date" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3 px-4" />
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedReceipts.map((rcp, index) => (
                <tr key={rcp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3 text-center font-bold text-slate-500 font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rcp.receiptNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rcp.studentName}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rcp.branchName.toLowerCase().includes('school')
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rcp.branchName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-600">
                    ₹ {rcp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold text-[11px]">
                      {rcp.paymentMode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{rcp.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveReceipt(rcp)}
                        className="text-orange-600 hover:text-orange-700 font-bold text-[11px] hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReceipt({ ...rcp })}
                        title="Edit Receipt"
                        className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingReceipt(rcp)}
                        title="Delete / Void Receipt"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
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

      {/* 4. Modal: Collect Fee Payment */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                Record Fee Payment
              </h3>
              <button
                onClick={() => setShowCollectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePay} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    const stu = students.find((s) => s.id === e.target.value);
                    if (stu && stu.feePending > 0) {
                      setCollectAmount(String(stu.feePending));
                    }
                  }}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.gradeOrSemester}) - Due: ₹ {s.feePending.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount to Collect (₹)</label>
                <input
                  type="number"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'CASH', 'CHEQUE'] as const).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`text-xs font-bold py-2 rounded-xl border transition-all ${
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

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-md transition-all"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Digital Fee Receipt */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-scale-in text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Payment Receipt Issued</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Zep Foundation Bhose ERP</p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900">{activeReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{activeReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch:</span>
                <span className="font-semibold text-slate-700 text-[11px]">{activeReceipt.branchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold text-slate-800">{activeReceipt.paymentMode}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-slate-700">Amount Paid:</span>
                <span className="text-emerald-600 font-extrabold text-sm">₹ {activeReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveReceipt(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Edit Receipt */}
      {editingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Receipt Record</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingReceipt.receiptNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onEditReceipt) onEditReceipt(editingReceipt);
                setEditingReceipt(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingReceipt.studentName}
                  onChange={(e) => setEditingReceipt({ ...editingReceipt, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Receipt Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={editingReceipt.amount}
                  onChange={(e) => setEditingReceipt({ ...editingReceipt, amount: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Mode</label>
                <select
                  value={editingReceipt.paymentMode}
                  onChange={(e) => setEditingReceipt({ ...editingReceipt, paymentMode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CASH">Cash Counter</option>
                  <option value="NET_BANKING">Net Banking / NEFT</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Receipt Date</label>
                <input
                  type="date"
                  required
                  value={editingReceipt.date}
                  onChange={(e) => setEditingReceipt({ ...editingReceipt, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReceipt(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Receipt Confirmation */}
      {deletingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Void / Delete Receipt</h3>
                <p className="text-xs text-slate-500">Confirm cancellation of fee payment record</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingReceipt.receiptNo}</div>
              <div className="text-slate-600">Student: <strong>{deletingReceipt.studentName}</strong></div>
              <div className="text-slate-600">Amount: <strong>₹ {deletingReceipt.amount.toLocaleString()}</strong> ({deletingReceipt.paymentMode})</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                ⚠️ Warning: Deleting this receipt will remove the payment transaction from the double-entry ledger.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingReceipt(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteReceipt) onDeleteReceipt(deletingReceipt.id);
                  setDeletingReceipt(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Void Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
