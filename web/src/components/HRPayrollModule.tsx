import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Calendar,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  ShieldCheck,
  FileText,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { calculateMonthlyPayroll } from '../utils/domainMath';
import { useTableSort, SortableTh } from './TableSort';

export const HRPayrollModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'EMPLOYEES' | 'LEAVES' | 'PAYROLL_BATCH'>('PAYROLL_BATCH');
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<any | null>(null);
  const [editingLeave, setEditingLeave] = useState<any | null>(null);
  const [deletingLeave, setDeletingLeave] = useState<any | null>(null);

  // Employee Directory
  const [employees, setEmployees] = useState([
    {
      id: 'emp-01',
      code: 'EMP-SCH-001',
      name: 'Sunita Kulkarni',
      role: 'School Principal',
      dept: 'Academics',
      branch: 'Modern Public School & Jr College Bhose',
      basic: 45000,
      hra: 15000,
      da: 8000,
      special: 7000,
      pan: 'ABCDE1234F',
    },
    {
      id: 'emp-02',
      code: 'EMP-HM-002',
      name: 'Chef Sanjeev Menon',
      role: 'Director & Executive Chef',
      dept: 'Culinary Arts',
      branch: 'Modern College of HM & Tech Solapur',
      basic: 60000,
      hra: 20000,
      da: 10000,
      special: 15000,
      pan: 'FGHIJ5678K',
    },
    {
      id: 'emp-03',
      code: 'EMP-ACC-003',
      name: 'Priya Joshi',
      role: 'Senior Accountant',
      dept: 'Finance',
      branch: 'Trust Central Office',
      basic: 28000,
      hra: 9000,
      da: 4000,
      special: 3000,
      pan: 'KLMNO9012P',
    },
  ]);

  // Leave Applications
  const [leaves, setLeaves] = useState([
    {
      id: 'leave-01',
      employee: 'Chef Sanjeev Menon',
      type: 'CASUAL_LEAVE',
      duration: '2 Days (Oct 25 - Oct 26)',
      reason: 'Attending National Culinary Masterclass & Jury Panel',
      status: 'APPROVED',
      balanceRemaining: 10,
    },
    {
      id: 'leave-02',
      employee: 'Priya Joshi',
      type: 'MEDICAL_LEAVE',
      duration: '1 Day (Oct 22)',
      reason: 'Medical health checkup',
      status: 'PENDING_HOD',
      balanceRemaining: 7,
    },
  ]);

  // Process Payroll for Employees
  const processedPayroll = employees.map((emp) => {
    const calc = calculateMonthlyPayroll({
      basicSalary: emp.basic,
      hra: emp.hra,
      da: emp.da,
      specialAllowance: emp.special,
      month: 10,
    });
    return {
      ...emp,
      ...calc,
    };
  });

  const {
    sortedData: sortedProcessedPayroll,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort(processedPayroll, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  const totalGrossDisbursed = processedPayroll.reduce((sum, p) => sum + p.earnedGross, 0);
  const totalDeductionsDisbursed = processedPayroll.reduce((sum, p) => sum + p.totalDeductions, 0);
  const totalNetDisbursed = processedPayroll.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              HR, Leave Engine & Monthly Payroll
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                Statutory PF / ESIC / PT / TDS
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Biometric attendance sync, multi-level leave approvals, auto salary calculation & printable payslips
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('PAYROLL_BATCH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'PAYROLL_BATCH'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Monthly Payroll Batch (October 2026)
        </button>
        <button
          onClick={() => setActiveSubTab('LEAVES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'LEAVES'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Leave Applications & Balances
        </button>
        <button
          onClick={() => setActiveSubTab('EMPLOYEES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'EMPLOYEES'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Employee Service Master ({employees.length})
        </button>
      </div>

      {/* TAB 1: PAYROLL BATCH PROCESSING */}
      {activeSubTab === 'PAYROLL_BATCH' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Total Gross Salary</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{totalGrossDisbursed.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Basic + HRA + DA + Allowances</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-rose-600 uppercase">Statutory Deductions</div>
              <div className="text-2xl font-black text-rose-700 mt-1">
                -₹{totalDeductionsDisbursed.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">PF (12%) + ESIC + PT + TDS</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-emerald-700 uppercase">Net Disbursed to Bank</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{totalNetDisbursed.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">Ready for Automated Bank NEFT Batch</div>
            </div>
          </div>

          {/* Detailed Payroll Register Table */}
          <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Monthly Payroll Breakdown & Payslip Generator
              </h3>
            </div>

            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="code" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center p-3.5" />
                    <SortableTh label="Employee" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                    <SortableTh label="Gross (₹)" sortKey="earnedGross" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="right" className="p-3.5 text-right" />
                    <SortableTh label="PF 12% (₹)" sortKey="pfDeduction" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="right" className="p-3.5 text-right text-rose-600" />
                    <SortableTh label="PT (₹)" sortKey="professionalTax" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="right" className="p-3.5 text-right text-rose-600" />
                    <SortableTh label="TDS (₹)" sortKey="tdsDeduction" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="right" className="p-3.5 text-right text-rose-600" />
                    <SortableTh label="Net Salary (₹)" sortKey="netSalary" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="right" className="p-3.5 text-right text-emerald-700" />
                    <th className="p-3.5 text-center">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedProcessedPayroll.map((p, index) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{p.code} • {p.role}</div>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                        ₹{p.earnedGross.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-mono text-rose-700">
                        ₹{p.pfDeduction.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-mono text-rose-700">
                        ₹{p.professionalTax.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-mono text-rose-700">
                        ₹{p.tdsDeduction.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-mono font-black text-emerald-700">
                        ₹{p.netSalary.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPayslip(p)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            <Printer className="w-3 h-3 text-orange-600" /> Payslip
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const emp = employees.find((e) => e.id === p.id);
                              if (emp) setEditingEmployee({ ...emp });
                            }}
                            title="Edit salary components"
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const emp = employees.find((e) => e.id === p.id);
                              if (emp) setDeletingEmployee(emp);
                            }}
                            title="Delete employee from payroll"
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
        </div>
      )}

      {/* TAB 2: LEAVE APPLICATIONS */}
      {activeSubTab === 'LEAVES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaves.map((l) => (
              <div key={l.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{l.employee}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      l.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900">Type: </strong> {l.type} • {l.duration}
                </div>
                <div className="text-xs text-slate-500">{l.reason}</div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Remaining Balance: {l.balanceRemaining} days</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingLeave({ ...l })}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Leave Status"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLeave(l)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Delete Leave Application"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYEES */}
      {activeSubTab === 'EMPLOYEES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {employees.map((e) => (
            <div key={e.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-700 font-bold">{e.code}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingEmployee({ ...e })}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit Employee"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingEmployee(e)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{e.name}</h4>
              <div className="text-xs text-slate-500">{e.role} • {e.dept}</div>
              <div className="text-xs text-slate-700 font-mono">Basic Salary: ₹{e.basic.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">PAN: {e.pan}</div>
            </div>
          ))}
        </div>
      )}

      {/* PAYSLIP PRINT MODAL */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="text-center border-b pb-3">
              <div className="text-xs font-bold text-orange-600 uppercase">Zep Foundation Bhose</div>
              <h3 className="text-base font-black text-slate-900">Official Monthly Payslip (October 2026)</h3>
              <div className="text-[11px] text-slate-500">{selectedPayslip.branch}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Employee: <strong>{selectedPayslip.name}</strong></span>
                <span>Code: <strong>{selectedPayslip.code}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Designation: <strong>{selectedPayslip.role}</strong></span>
                <span>PAN: <strong>{selectedPayslip.pan}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-700 border-b pb-1">Earnings</div>
                <div className="flex justify-between"><span>Basic Salary:</span><span>₹{selectedPayslip.basic}</span></div>
                <div className="flex justify-between"><span>HRA:</span><span>₹{selectedPayslip.hra}</span></div>
                <div className="flex justify-between"><span>DA:</span><span>₹{selectedPayslip.da}</span></div>
                <div className="flex justify-between"><span>Special Allow:</span><span>₹{selectedPayslip.special}</span></div>
                <div className="flex justify-between font-bold border-t pt-1"><span>Total Gross:</span><span>₹{selectedPayslip.earnedGross}</span></div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-rose-700 border-b pb-1">Deductions</div>
                <div className="flex justify-between text-rose-600"><span>PF (12%):</span><span>₹{selectedPayslip.pfDeduction}</span></div>
                <div className="flex justify-between text-rose-600"><span>Prof Tax:</span><span>₹{selectedPayslip.professionalTax}</span></div>
                <div className="flex justify-between text-rose-600"><span>TDS / IT:</span><span>₹{selectedPayslip.tdsDeduction}</span></div>
                <div className="flex justify-between font-bold border-t pt-1 text-rose-700"><span>Total Deductions:</span><span>₹{selectedPayslip.totalDeductions}</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex justify-between items-center text-sm font-bold text-emerald-900">
              <span>Net Take-Home Disbursed:</span>
              <span className="text-base font-black">₹{selectedPayslip.netSalary.toLocaleString()}.00</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
              >
                <Printer className="w-4 h-4" /> Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Edit Employee */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Employee Profile</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingEmployee.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmployees((prev) => prev.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp)));
                setEditingEmployee(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Employee Name *</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.role}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.dept}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, dept: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Basic Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingEmployee.basic}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, basic: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">PAN Number</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.pan}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Employee</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Employee */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Employee</h3>
                <p className="text-xs text-slate-500">Confirm permanent staff member removal</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingEmployee.name}</div>
              <div className="text-slate-600">Role: <strong>{deletingEmployee.role}</strong> ({deletingEmployee.code})</div>
              <div className="text-slate-600">Department: {deletingEmployee.dept} &bull; Salary: ₹{deletingEmployee.basic.toLocaleString()}</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                Are you sure you want to remove this employee from HR records?
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingEmployee(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
                  setDeletingEmployee(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Leave */}
      {editingLeave && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Review / Edit Leave Application</h3>
                  <p className="text-[11px] text-slate-500">{editingLeave.employee}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLeave(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLeaves((prev) => prev.map((l) => (l.id === editingLeave.id ? editingLeave : l)));
                setEditingLeave(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Approval Status</label>
                <select
                  value={editingLeave.status}
                  onChange={(e) => setEditingLeave({ ...editingLeave, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Reason / Remarks</label>
                <input
                  type="text"
                  required
                  value={editingLeave.reason}
                  onChange={(e) => setEditingLeave({ ...editingLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLeave(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Leave Application */}
      {deletingLeave && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Leave Request</h3>
                <p className="text-xs text-slate-500">Remove leave application</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingLeave.employee}</div>
              <div className="text-slate-600">Leave: <strong>{deletingLeave.type}</strong> ({deletingLeave.duration})</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                Are you sure you want to delete this leave application record?
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingLeave(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaves((prev) => prev.filter((l) => l.id !== deletingLeave.id));
                  setDeletingLeave(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
