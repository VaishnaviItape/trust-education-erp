import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { Student, FeeReceipt } from '../types';
import { useTableSort, SortableTh } from './TableSort';

interface TrustAccountingModuleProps {
  students: Student[];
  receipts: FeeReceipt[];
  onCollectFee: (studentId: string, amount: number, mode: any) => void;
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
}

export const TrustAccountingModule: React.FC<TrustAccountingModuleProps> = ({
  students,
  receipts,
  onCollectFee,
  selectedBranchScope = 'ALL',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'VOUCHERS' | 'CONCESSIONS' | 'AGING' | 'RECEIPTS'>('VOUCHERS');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showConcessionModal, setShowConcessionModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<FeeReceipt | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [deletingVoucher, setDeletingVoucher] = useState<any | null>(null);

  // Voucher Form State
  const [voucherType, setVoucherType] = useState<'RECEIPT' | 'PAYMENT' | 'JOURNAL' | 'CONTRA'>('RECEIPT');
  const [voucherNarration, setVoucherNarration] = useState('');
  const [debitLedger, setDebitLedger] = useState('HDFC Trust Bank A/c');
  const [debitAmount, setDebitAmount] = useState('24000');
  const [creditLedger, setCreditLedger] = useState('Student Tuition Fees Income');
  const [creditAmount, setCreditAmount] = useState('24000');

  // Concessions State
  const [concessions, setConcessions] = useState([
    {
      id: 'conc-001',
      studentName: 'Aarav Sharma (Class 7-A)',
      branch: 'Modern Public School & Jr College Bhose',
      originalFee: 36000,
      requestedWaiver: 6000,
      reason: 'Father agricultural crop failure. Submitted Tahsildar income certificate.',
      status: 'APPROVED_TRUSTEE',
      approvedWaiver: 6000,
      approver: 'Dr. Rajesh Patil (Trustee)',
      date: '2026-09-15',
    },
    {
      id: 'conc-002',
      studentName: 'Kabir Verma (HM Sem 3)',
      branch: 'Modern College of HM & Tech Solapur',
      originalFee: 75000,
      requestedWaiver: 15000,
      reason: 'Single mother tailoring income. Applied for Merit-cum-Means waiver.',
      status: 'PENDING_TRUSTEE',
      approvedWaiver: 0,
      approver: 'Recommended by Chef Director Menon',
      date: '2026-10-05',
    },
  ]);

  // Vouchers List State
  const [vouchers, setVouchers] = useState([
    {
      id: 'vch-101',
      no: 'VCH-RCP-2026-001',
      type: 'RECEIPT',
      date: '2026-10-18',
      amount: 48000,
      narration: 'School Tuition Fee batch collection',
      debit: 'HDFC Trust Collection A/c',
      credit: 'Student Tuition Fees Income',
      balanced: true,
    },
    {
      id: 'vch-102',
      no: 'VCH-PAY-2026-002',
      type: 'PAYMENT',
      date: '2026-10-19',
      amount: 18500,
      narration: 'Kitchen Commercial Gas Refills for Hotel Management Practical Lab',
      debit: 'Kitchen Practical Lab Utility Expense',
      credit: 'Cash Counter A/c',
      balanced: true,
    },
  ]);

  const {
    sortedData: sortedVouchers,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort(vouchers, {
    defaultKey: null,
    defaultDirection: 'desc',
  });

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const dVal = Number(debitAmount);
    const cVal = Number(creditAmount);

    if (dVal !== cVal || dVal <= 0) {
      alert('Double-entry imbalance! Debits must equal Credits.');
      return;
    }

    const newVch = {
      id: `vch-${Date.now()}`,
      no: `VCH-${voucherType.slice(0, 3)}-2026-${String(vouchers.length + 1).padStart(3, '0')}`,
      type: voucherType,
      date: new Date().toISOString().slice(0, 10),
      amount: dVal,
      narration: voucherNarration || 'Authorized accounting entry',
      debit: debitLedger,
      credit: creditLedger,
      balanced: true,
    };

    setVouchers([newVch, ...vouchers]);
    setShowVoucherModal(false);
    setVoucherNarration('');
  };

  const handleApproveConcession = (id: string) => {
    setConcessions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'APPROVED_TRUSTEE',
              approvedWaiver: c.requestedWaiver,
              approver: 'Approved by Trustee Executive',
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Fee Collections, Concessions & Trust Accounting
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                ACID Transactional
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Double-entry ledger reconciliation, multi-level concession approvals & aging recovery analysis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowVoucherModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Double-Entry Voucher
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'VOUCHERS', label: 'Double-Entry Vouchers', count: vouchers.length },
          { id: 'CONCESSIONS', label: 'Concession Approvals', count: concessions.length },
          { id: 'AGING', label: 'Fee Aging Analysis (0-60+ Days)', count: 'Realtime' },
          { id: 'RECEIPTS', label: 'Printable Fee Slips & Barcodes', count: receipts.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600 font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: DOUBLE-ENTRY VOUCHERS */}
      {activeSubTab === 'VOUCHERS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Total Debits Audited</div>
              <div className="text-xl font-black text-slate-900 mt-1">₹66,500.00</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Balanced 100%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Total Credits Audited</div>
              <div className="text-xl font-black text-slate-900 mt-1">₹66,500.00</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Balanced 100%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">General Ledgers Active</div>
              <div className="text-xl font-black text-slate-900 mt-1">6 Ledgers</div>
              <div className="text-[10px] text-slate-500 mt-1">HDFC, Cash, Tuition, Kitchen</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Idempotency Shield</div>
              <div className="text-xl font-black text-emerald-600 mt-1">Active (Zero Dupes)</div>
              <div className="text-[10px] text-slate-500 mt-1">UUID & Barcode Hash Keyed</div>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Audited General Ledger Voucher Register
              </h3>
            </div>
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="no" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center p-3.5" />
                    <SortableTh label="Voucher No" sortKey="no" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                    <SortableTh label="Type" sortKey="type" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                    <SortableTh label="Date" sortKey="date" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                    <SortableTh label="Debit Ledger" sortKey="debit" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                    <SortableTh label="Credit Ledger" sortKey="credit" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                    <SortableTh label="Amount (₹)" sortKey="amount" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="right" className="p-3.5 text-right" />
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedVouchers.map((v, index) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                      <td className="p-3.5 font-mono text-orange-600 font-bold">{v.no}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {v.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{v.date}</td>
                      <td className="p-3.5 text-emerald-700 font-semibold">Dr. {v.debit}</td>
                      <td className="p-3.5 text-amber-700 font-semibold">Cr. {v.credit}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900 font-mono">
                        ₹{v.amount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> BALANCED
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingVoucher({ ...v })}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Edit Voucher"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingVoucher(v)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Delete / Void Voucher"
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
        </div>
      )}

      {/* SUB-TAB 2: CONCESSION APPROVAL WORKFLOW */}
      {activeSubTab === 'CONCESSIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Multi-Level Concession Pipeline:</strong> Fee concessions require primary recommendation from
              the Campus Principal, followed by final budgetary sign-off by the Trust Executive / Trustee.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concessions.map((conc) => (
              <div key={conc.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{conc.studentName}</h4>
                    <span className="text-[11px] text-slate-500">{conc.branch}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      conc.status === 'APPROVED_TRUSTEE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {conc.status === 'APPROVED_TRUSTEE' ? 'APPROVED BY TRUSTEE' : 'PENDING TRUSTEE APPROVAL'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Annual Fee:</span>
                    <span className="text-slate-900 font-mono font-bold">₹{conc.originalFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Requested Concession:</span>
                    <span className="text-orange-600 font-mono font-bold">
                      ₹{conc.requestedWaiver.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Authorized Concession:</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      ₹{conc.approvedWaiver.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900">Grounds / Case Study: </strong>
                  {conc.reason}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sign-off: {conc.approver}</span>
                  {conc.status !== 'APPROVED_TRUSTEE' && (
                    <button
                      onClick={() => handleApproveConcession(conc.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Grant Trustee Approval
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AGING ANALYSIS */}
      {activeSubTab === 'AGING' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Current (0 - 30 Days)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹48,000</div>
              <div className="text-xs text-slate-500 mt-1">4 Students • Low Risk (Standard Notice)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-amber-600 uppercase">Overdue (31 - 60 Days)</div>
              <div className="text-2xl font-black text-amber-700 mt-1">₹60,000</div>
              <div className="text-xs text-slate-500 mt-1">5 Students • Medium Risk (WhatsApp Warning)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-rose-600 uppercase">Critical (60+ Days Overdue)</div>
              <div className="text-2xl font-black text-rose-700 mt-1">₹40,000</div>
              <div className="text-xs text-slate-500 mt-1">3 Students • High Risk (Escalate to Principal)</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Automated Fee Recovery & Escalation Rules
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>1. Day 1 after Due Date: Automated official WhatsApp payment link dispatched to parents.</span>
                <span className="text-emerald-700 font-bold">ACTIVE</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>2. Day 31 Overdue: ₹50/day late fee accrual initiated; Accountant phone follow-up scheduled.</span>
                <span className="text-emerald-700 font-bold">ACTIVE</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>3. Day 61 Overdue: Hall ticket withholding flag raised pending Trustee / Principal review.</span>
                <span className="text-emerald-700 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PRINTABLE FEE SLIPS WITH BARCODES */}
      {activeSubTab === 'RECEIPTS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Issued Trust Fee Receipts ({receipts.length} Total)
            </h3>
            <span className="text-xs text-slate-500">Click any receipt to launch Trust Letterhead Print Slip</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receipts.map((rcp) => (
              <div
                key={rcp.id}
                onClick={() => setSelectedReceiptForPrint(rcp)}
                className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-orange-300 cursor-pointer transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-orange-600">{rcp.receiptNo}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {rcp.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{rcp.studentName}</div>
                  <div className="text-xs text-slate-500">{rcp.branchName}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">{rcp.paymentMode} • {rcp.date}</span>
                  <span className="text-sm font-black text-slate-900 font-mono">₹{rcp.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NEW DOUBLE-ENTRY VOUCHER */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-600" /> Create Double-Entry Voucher
              </h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Voucher Type *</label>
                <select
                  value={voucherType}
                  onChange={(e) => setVoucherType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="RECEIPT">RECEIPT (Inward Fee / Donation)</option>
                  <option value="PAYMENT">PAYMENT (Vendor / Expense Disbursal)</option>
                  <option value="JOURNAL">JOURNAL (Non-cash Adjustment)</option>
                  <option value="CONTRA">CONTRA (Cash & Bank Transfer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Narration / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Chemicals & Practical Kit Procurement"
                  value={voucherNarration}
                  onChange={(e) => setVoucherNarration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-700 mb-1">DEBIT LEDGER</label>
                  <input
                    type="text"
                    value={debitLedger}
                    onChange={(e) => setDebitLedger(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    value={debitAmount}
                    onChange={(e) => {
                      setDebitAmount(e.target.value);
                      setCreditAmount(e.target.value); // Keep in sync by default
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono mt-2 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-700 mb-1">CREDIT LEDGER</label>
                  <input
                    type="text"
                    value={creditLedger}
                    onChange={(e) => setCreditLedger(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono mt-2 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVoucherModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer"
                >
                  Post Voucher to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE TRUST LETTERHEAD FEE SLIP */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                <span className="font-extrabold text-sm text-slate-900">Official Fee Receipt</span>
              </div>
              <button
                onClick={() => setSelectedReceiptForPrint(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Letterhead Body */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3 text-xs bg-slate-50/50">
              <div className="text-center border-b pb-2">
                <div className="font-black text-sm uppercase text-orange-600">Zep Foundation Bhose</div>
                <div className="text-[10px] text-slate-500">Reg No: MAH/1042/PUN • 80G Tax Exemption Certified</div>
                <div className="text-[11px] font-bold text-slate-800 mt-0.5">
                  {selectedReceiptForPrint.branchName}
                </div>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Receipt No: <strong>{selectedReceiptForPrint.receiptNo}</strong></span>
                <span>Date: {selectedReceiptForPrint.date}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Student: <strong>{selectedReceiptForPrint.studentName}</strong></span>
                <span>Payment Mode: <strong>{selectedReceiptForPrint.paymentMode}</strong></span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Amount Paid:</span>
                <span>₹{selectedReceiptForPrint.amount.toLocaleString()}.00</span>
              </div>

              <div className="text-center pt-2 font-mono text-[10px] text-slate-400">
                BARCODE HASH: *{selectedReceiptForPrint.receiptNo}*
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Edit Voucher */}
      {editingVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Journal Voucher</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingVoucher.no}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingVoucher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setVouchers((prev) => prev.map((v) => (v.id === editingVoucher.id ? editingVoucher : v)));
                setEditingVoucher(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Voucher Date</label>
                <input
                  type="date"
                  required
                  value={editingVoucher.date}
                  onChange={(e) => setEditingVoucher({ ...editingVoucher, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Debit Ledger (Dr.)</label>
                <input
                  type="text"
                  required
                  value={editingVoucher.debit}
                  onChange={(e) => setEditingVoucher({ ...editingVoucher, debit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Credit Ledger (Cr.)</label>
                <input
                  type="text"
                  required
                  value={editingVoucher.credit}
                  onChange={(e) => setEditingVoucher({ ...editingVoucher, credit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Audited Voucher Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={editingVoucher.amount}
                  onChange={(e) => setEditingVoucher({ ...editingVoucher, amount: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVoucher(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Voucher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Voucher */}
      {deletingVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete / Void Voucher</h3>
                <p className="text-xs text-slate-500">Cancel double-entry journal entry</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm font-mono">{deletingVoucher.no}</div>
              <div className="text-slate-600">Amount: <strong>₹{deletingVoucher.amount.toLocaleString()}</strong> ({deletingVoucher.type})</div>
              <div className="text-slate-600">Dr. {deletingVoucher.debit} / Cr. {deletingVoucher.credit}</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                ⚠️ Warning: Voiding this voucher will adjust the ledger balance and audit journal.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingVoucher(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setVouchers((prev) => prev.filter((v) => v.id !== deletingVoucher.id));
                  setDeletingVoucher(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Void
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
