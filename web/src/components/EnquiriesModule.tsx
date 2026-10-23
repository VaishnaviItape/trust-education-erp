import React, { useState } from 'react';
import {
  FileQuestion,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { AdmissionEnquiry } from '../types';

interface EnquiriesModuleProps {
  enquiries: AdmissionEnquiry[];
  onAddEnquiry?: (enquiry: AdmissionEnquiry) => void;
  onEditEnquiry?: (enquiry: AdmissionEnquiry) => void;
  onDeleteEnquiry?: (enquiryId: string) => void;
}

export const EnquiriesModule: React.FC<EnquiriesModuleProps> = ({
  enquiries,
  onAddEnquiry,
  onEditEnquiry,
  onDeleteEnquiry,
}) => {
  const [editingEnquiry, setEditingEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState<AdmissionEnquiry | null>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnquiry) return;
    if (onEditEnquiry) {
      onEditEnquiry(editingEnquiry);
    }
    setEditingEnquiry(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingEnquiry) return;
    if (onDeleteEnquiry) {
      onDeleteEnquiry(deletingEnquiry.id);
    }
    setDeletingEnquiry(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              Lead Inflow
            </span>
            <span className="text-xs text-slate-400 font-bold">Portal & Public Site</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Admission Enquiries & Prospects</h2>
          <p className="text-xs text-slate-500">
            Prospective parents and students who submitted inquiry forms on abceducationtrust.org.
          </p>
        </div>

        <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full">
          {enquiries.length} Inquiries Logged
        </span>
      </div>

      {/* 2. Enquiries Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {enquiries.map((enq) => (
          <div
            key={enq.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-orange-300 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  enq.targetBranch === 'SCHOOL'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {enq.targetBranch === 'SCHOOL' ? 'School Admission' : 'Hotel Mgmt College'}
              </span>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    enq.status === 'NEW'
                      ? 'bg-rose-100 text-rose-700'
                      : enq.status === 'CONTACTED'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {enq.status}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingEnquiry({ ...enq })}
                  title="Edit Enquiry"
                  className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingEnquiry(enq)}
                  title="Delete Enquiry"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{enq.applicantName}</h4>
              <p className="text-xs text-orange-700 font-bold mt-0.5">
                Target: {enq.targetClassOrCourse}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Parent / Guardian:</span>
                <span className="font-bold text-slate-900">{enq.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <a
                  href={`tel:${enq.phone}`}
                  className="font-bold text-orange-600 flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  {enq.phone}
                </a>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Submitted: {enq.createdAt}
              </span>

              <button
                type="button"
                onClick={() => setEditingEnquiry({ ...enq })}
                className="text-orange-600 font-bold hover:text-orange-700 hover:underline cursor-pointer"
              >
                Update Status &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Modal: Edit Enquiry */}
      {editingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Enquiry Lead</h3>
                  <p className="text-[11px] text-slate-500">{editingEnquiry.applicantName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={editingEnquiry.applicantName}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, applicantName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Campus</label>
                <select
                  value={editingEnquiry.targetBranch}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, targetBranch: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="SCHOOL">School (Modern Public School & Jr College Bhose)</option>
                  <option value="COLLEGE">College (Modern College Of Hotel Management Solapur)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Class / Course *</label>
                <input
                  type="text"
                  required
                  value={editingEnquiry.targetClassOrCourse}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, targetClassOrCourse: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Parent / Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={editingEnquiry.parentName}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, parentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={editingEnquiry.phone}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Lead Status</label>
                <select
                  value={editingEnquiry.status}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="NEW">NEW - Fresh Lead</option>
                  <option value="CONTACTED">CONTACTED - Call Completed</option>
                  <option value="CONVERTED">CONVERTED - Admitted</option>
                  <option value="REJECTED">REJECTED - Not Interested</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Delete Enquiry Confirmation */}
      {deletingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Enquiry Lead</h3>
                <p className="text-xs text-slate-500">Remove prospect inquiry record</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingEnquiry.applicantName}</div>
              <div className="text-slate-600">Target: <strong>{deletingEnquiry.targetClassOrCourse}</strong> ({deletingEnquiry.targetBranch})</div>
              <div className="text-slate-600">Parent: <strong>{deletingEnquiry.parentName}</strong> ({deletingEnquiry.phone})</div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                Are you sure you want to permanently delete this admission enquiry?
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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
