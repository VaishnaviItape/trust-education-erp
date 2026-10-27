import React, { useState, useMemo } from 'react';
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
  Search,
  Filter,
  Plus,
  Download,
  School,
  UtensilsCrossed,
  MessageCircle,
  Clock,
  MapPin,
  Sparkles,
  UserPlus,
  Building,
  GraduationCap,
  Check,
  HelpCircle,
} from 'lucide-react';
import { AdmissionEnquiry } from '../types';
import { TablePagination, usePagination } from './TablePagination';

interface EnquiriesModuleProps {
  enquiries: AdmissionEnquiry[];
  onAddEnquiry?: (enquiry: AdmissionEnquiry) => void;
  onEditEnquiry?: (enquiry: AdmissionEnquiry) => void;
  onDeleteEnquiry?: (enquiryId: string) => void;
  onConvertToAdmission?: (enquiry: AdmissionEnquiry) => void;
}

export const EnquiriesModule: React.FC<EnquiriesModuleProps> = ({
  enquiries,
  onAddEnquiry,
  onEditEnquiry,
  onDeleteEnquiry,
  onConvertToAdmission,
}) => {
  const [editingEnquiry, setEditingEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'ADMITTED'>('ALL');

  // New Enquiry Form State
  const [newForm, setNewForm] = useState({
    applicantName: '',
    parentName: '',
    phone: '',
    email: '',
    targetBranch: 'SCHOOL' as 'SCHOOL' | 'COLLEGE',
    targetClassOrCourse: 'STD 8 - Secondary',
    city: 'Bhose / Solapur',
    notes: '',
  });

  // Calculate Metrics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === 'NEW').length;
  const contactedCount = enquiries.filter((e) => e.status === 'CONTACTED').length;
  const admittedCount = enquiries.filter((e) => e.status === 'ADMITTED').length;
  const schoolCount = enquiries.filter((e) => e.targetBranch === 'SCHOOL').length;
  const collegeCount = enquiries.filter((e) => e.targetBranch === 'COLLEGE').length;

  // Filtered List
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      // Branch filter
      if (branchFilter !== 'ALL' && enq.targetBranch !== branchFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && enq.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          enq.applicantName.toLowerCase().includes(q) ||
          enq.parentName.toLowerCase().includes(q) ||
          enq.phone.toLowerCase().includes(q) ||
          enq.targetClassOrCourse.toLowerCase().includes(q) ||
          enq.id.toLowerCase().includes(q) ||
          (enq.city && enq.city.toLowerCase().includes(q)) ||
          (enq.email && enq.email.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [enquiries, branchFilter, statusFilter, searchQuery]);

  const {
    currentPage: enqPage,
    setCurrentPage: setEnqPage,
    pageSize: enqPageSize,
    setPageSize: setEnqPageSize,
    paginatedItems: paginatedEnquiries,
  } = usePagination(filteredEnquiries, 6);

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

  const handleQuickStatusChange = (enq: AdmissionEnquiry, newStatus: 'NEW' | 'CONTACTED' | 'ADMITTED') => {
    if (onEditEnquiry) {
      onEditEnquiry({
        ...enq,
        status: newStatus,
      });
    }
  };

  const handleCreateNewEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.applicantName.trim() || !newForm.phone.trim()) return;

    const generatedId = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: AdmissionEnquiry = {
      id: generatedId,
      applicantName: newForm.applicantName.trim(),
      parentName: newForm.parentName.trim() || 'Parent',
      phone: newForm.phone.trim(),
      email: newForm.email.trim() || undefined,
      targetBranch: newForm.targetBranch,
      targetClassOrCourse: newForm.targetClassOrCourse.trim() || (newForm.targetBranch === 'SCHOOL' ? 'STD 8 - Secondary' : 'B.Sc in Hospitality'),
      city: newForm.city.trim() || undefined,
      notes: newForm.notes.trim() || undefined,
      status: 'NEW',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddEnquiry) {
      onAddEnquiry(newRecord);
    }

    setNewForm({
      applicantName: '',
      parentName: '',
      phone: '',
      email: '',
      targetBranch: 'SCHOOL',
      targetClassOrCourse: 'STD 8 - Secondary',
      city: 'Bhose / Solapur',
      notes: '',
    });
    setShowNewModal(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Inquiry ID',
      'Date',
      'Applicant Name',
      'Gender',
      'DOB',
      'Institution',
      'Target Course/Grade',
      'Parent Name',
      'Relation',
      'Phone',
      'Alt Phone',
      'Email',
      'City',
      'Transport/Hostel',
      'Callback Time',
      'Status',
      'Counselor Notes',
    ];

    const rows = filteredEnquiries.map((e) => [
      `"${e.id}"`,
      `"${e.createdAt}"`,
      `"${e.applicantName}"`,
      `"${e.gender || ''}"`,
      `"${e.dob || ''}"`,
      `"${e.targetBranch === 'SCHOOL' ? 'School (Bhose)' : 'Hotel Mgmt College (Solapur)'}"`,
      `"${e.targetClassOrCourse}"`,
      `"${e.parentName}"`,
      `"${e.parentRelation || 'Parent'}"`,
      `"${e.phone}"`,
      `"${e.altPhone || ''}"`,
      `"${e.email || ''}"`,
      `"${e.city || ''}"`,
      `"${e.needTransportOrHostel ? 'Yes' : 'No'}"`,
      `"${e.preferredContactTime || ''}"`,
      `"${e.status}"`,
      `"${(e.counselorNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Trust_Admission_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header Bar with Metrics & Action Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              Live Admission Inquiries
            </span>
            <span className="text-xs text-slate-400 font-bold">Public Web & Walk-in Inflow</span>
            {newCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                <Sparkles className="w-3 h-3" />
                {newCount} New Leads
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Admission Enquiries & Prospective Pipeline
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Track inquiries submitted through the public website or campus counseling desk. Review prospective students, log follow-ups, and convert inquiries into enrolled students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            title="Export CSV spreadsheet for counseling follow-ups"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in Inquiry</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Enquiries</span>
            <FileQuestion className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {schoolCount} School &bull; {collegeCount} College
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600 text-xs font-bold">
            <span>New Leads (Pending Call)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{newCount}</div>
          <div className="text-[11px] text-rose-700 font-medium mt-0.5">
            Requires initial counseling callback
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 text-xs font-bold">
            <span>Contacted & Follow-up</span>
            <Phone className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{contactedCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">
            Campus visit / counseling scheduled
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-bold">
            <span>Admitted / Enrolled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{admittedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Successfully converted to student
          </div>
        </div>
      </div>

      {/* 3. Search & Interactive Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, parent, phone, course, inquiry ID, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Campus Selector Pills */}
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
              School
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
              Hotel Mgmt
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Statuses ({totalCount})</option>
            <option value="NEW">NEW ({newCount})</option>
            <option value="CONTACTED">CONTACTED ({contactedCount})</option>
            <option value="ADMITTED">ADMITTED ({admittedCount})</option>
          </select>
        </div>
      </div>

      {/* 4. Enquiries Grid / List */}
      {paginatedEnquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Admission Enquiries Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery || branchFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'No inquiries match your current search or filter criteria. Try clearing filters.'
              : 'New inquiries submitted via the web admission page will immediately appear here.'}
          </p>
          {(searchQuery || branchFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setBranchFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="mt-4 px-4 py-2 bg-orange-50 text-orange-700 font-bold text-xs rounded-xl border border-orange-200 hover:bg-orange-100"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {paginatedEnquiries.map((enq) => {
            const isSchool = enq.targetBranch === 'SCHOOL';
            const cleanPhone = enq.phone.replace(/[^0-9]/g, '').slice(-10);

            return (
              <div
                key={enq.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:border-orange-300 hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Reference ID & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {enq.id}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isSchool
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isSchool ? 'Modern Public School' : 'Hotel Mgmt College'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          enq.status === 'NEW'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : enq.status === 'CONTACTED'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
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

                  {/* Applicant & Program Info */}
                  <div className="mt-2.5">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center justify-between">
                      <span>{enq.applicantName}</span>
                      {enq.gender && (
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {enq.gender} {enq.dob && `&bull; DOB: ${enq.dob}`}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs font-bold text-orange-700 mt-0.5 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{enq.targetClassOrCourse}</span>
                    </p>
                    {enq.previousSchool && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Previous: {enq.previousSchool}
                      </p>
                    )}
                  </div>

                  {/* Contact Details Card */}
                  <div className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-200/70 text-xs space-y-1.5 text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Parent / Guardian:</span>
                      <span className="font-bold text-slate-900">
                        {enq.parentName} {enq.parentRelation && `(${enq.parentRelation})`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Phone & WhatsApp:</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${enq.phone}`}
                          className="font-bold text-orange-600 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {enq.phone}
                        </a>
                        <a
                          href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(enq.parentName)},%20this%20is%20the%20Admissions%20Office%20of%20Zep%20Foundation%20Bhose%20regarding%20the%20admission%20inquiry%20(Ref:%20${enq.id})%20for%20${encodeURIComponent(enq.applicantName)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {enq.email && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Email:</span>
                        <a href={`mailto:${enq.email}`} className="text-slate-700 hover:text-orange-600 truncate max-w-[200px]">
                          {enq.email}
                        </a>
                      </div>
                    )}

                    {enq.city && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Location:</span>
                        <span className="text-slate-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {enq.city}
                        </span>
                      </div>
                    )}

                    {enq.needTransportOrHostel && (
                      <div className="flex justify-between items-center text-orange-700 font-bold text-[11px] pt-1 border-t border-slate-200/60">
                        <span>Facility Requested:</span>
                        <span>{isSchool ? '✓ GPS School Bus' : '✓ College Hostel'}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Counselor remarks */}
                  {(enq.notes || enq.counselorNotes) && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100 text-[11px] text-slate-700 space-y-1">
                      {enq.notes && (
                        <div>
                          <strong className="text-orange-900">Student Note: </strong>
                          {enq.notes}
                        </div>
                      )}
                      {enq.counselorNotes && (
                        <div className="text-slate-600">
                          <strong className="text-slate-800">Counselor Follow-up: </strong>
                          {enq.counselorNotes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {enq.createdAt}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Status quick toggle */}
                    {enq.status === 'NEW' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(enq, 'CONTACTED')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {enq.status !== 'ADMITTED' && (
                      <button
                        type="button"
                        onClick={() => {
                          handleQuickStatusChange(enq, 'ADMITTED');
                          if (onConvertToAdmission) {
                            onConvertToAdmission(enq);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3 text-emerald-600" />
                        Convert to Admission
                      </button>
                    )}

                    {enq.status === 'ADMITTED' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                        <Check className="w-3 h-3" />
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <TablePagination
        currentPage={enqPage}
        totalItems={filteredEnquiries.length}
        pageSize={enqPageSize}
        pageSizeOptions={[4, 6, 10, 20, 50]}
        onPageChange={setEnqPage}
        onPageSizeChange={setEnqPageSize}
        itemName="inquiries"
      />

      {/* 5. MODAL: ADD WALK-IN / MANUAL INQUIRY */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Add Walk-in / Phone Inquiry</h3>
                  <p className="text-xs text-slate-500">Record a prospective student lead manually</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewEnquiry} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Institution *</label>
                <select
                  value={newForm.targetBranch}
                  onChange={(e) =>
                    setNewForm({
                      ...newForm,
                      targetBranch: e.target.value as any,
                      targetClassOrCourse: e.target.value === 'SCHOOL' ? 'STD 8 - Secondary' : 'B.Sc in Hospitality & Hotel Administration',
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="SCHOOL">Modern Public School & Jr College Bhose (K-12)</option>
                  <option value="COLLEGE">Modern College Of Hotel Management Solapur (Degree/Diploma)</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Patil"
                    value={newForm.applicantName}
                    onChange={(e) => setNewForm({ ...newForm, applicantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Patil"
                    value={newForm.parentName}
                    onChange={(e) => setNewForm({ ...newForm, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9823011999"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. suresh@gmail.com"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class / Course *</label>
                  <input
                    type="text"
                    required
                    placeholder={newForm.targetBranch === 'SCHOOL' ? 'e.g. Class 7 CBSE' : 'e.g. B.Sc in Hospitality'}
                    value={newForm.targetClassOrCourse}
                    onChange={(e) => setNewForm({ ...newForm, targetClassOrCourse: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Bhose / Solapur"
                    value={newForm.city}
                    onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counselor Discussion Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Parent visited campus, interested in bus route #4, requested fee concession information..."
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Walk-in Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: EDIT ENQUIRY */}
      {editingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Edit Admission Enquiry</h3>
                  <p className="text-xs text-slate-500 font-mono">{editingEnquiry.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEnquiry(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Status *</label>
                <select
                  value={editingEnquiry.status}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="NEW">NEW - Unreviewed Lead</option>
                  <option value="CONTACTED">CONTACTED - Call / Counseling Completed</option>
                  <option value="ADMITTED">ADMITTED - Converted to Formal Admission</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEnquiry.applicantName}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, applicantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Campus</label>
                  <select
                    value={editingEnquiry.targetBranch}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, targetBranch: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="SCHOOL">School (Modern Public School Bhose)</option>
                    <option value="COLLEGE">College (Hotel Mgmt College Solapur)</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class / Course *</label>
                  <input
                    type="text"
                    required
                    value={editingEnquiry.targetClassOrCourse}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, targetClassOrCourse: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEnquiry.parentName}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editingEnquiry.phone}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingEnquiry.email || ''}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counselor Call / Follow-up Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record callback summary, discussion with parent, discount requested, documents pending..."
                  value={editingEnquiry.counselorNotes || ''}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, counselorNotes: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: DELETE ENQUIRY CONFIRMATION */}
      {deletingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Admission Enquiry</h3>
                <p className="text-xs text-slate-500 font-mono">{deletingEnquiry.id}</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingEnquiry.applicantName}</div>
              <div className="text-slate-600">
                Course: <strong>{deletingEnquiry.targetClassOrCourse}</strong> ({deletingEnquiry.targetBranch})
              </div>
              <div className="text-slate-600">
                Parent: <strong>{deletingEnquiry.parentName}</strong> ({deletingEnquiry.phone})
              </div>
              <div className="text-rose-700 font-bold pt-1 text-[11px]">
                Are you sure you want to permanently delete this admission enquiry record?
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
