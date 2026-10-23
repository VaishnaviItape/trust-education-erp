import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Send,
  CheckCheck,
  AlertCircle,
  Plus,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import { FilterBar } from './FilterBar';
import { useTableSort, SortableTh } from './TableSort';

export const CommunicationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'WHATSAPP' | 'NOTICES'>('WHATSAPP');
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // WhatsApp Message Logs
  const [waLogs, setWaLogs] = useState([
    {
      id: 'wa-01',
      recipient: 'Ramesh Sharma (Parent of Aarav)',
      phone: '+91 98230 11223',
      template: 'fee_due_alert',
      message: 'Dear Ramesh, 2nd installment of ₹12,000 for Class 7-A is due on Oct 25. Pay online: https://trustedu.org/pay/stu-s01',
      status: 'DELIVERED',
      time: 'Today, 09:00 AM',
    },
    {
      id: 'wa-02',
      recipient: 'Bhavesh Patel (Parent of Ananya)',
      phone: '+91 98230 44556',
      template: 'attendance_daily_alert',
      message: 'Dear Bhavesh, Ananya Patel has been marked PRESENT at Modern Public School And Junior College Bhose at 07:55 AM.',
      status: 'DELIVERED',
      time: 'Today, 08:05 AM',
    },
    {
      id: 'wa-03',
      recipient: 'Pooja Kulkarni (Student)',
      phone: '+91 98220 77112',
      template: 'cap_allocation_published',
      message: 'Congratulations! You have been allocated a merit seat in B.Tech Computer Science under CAP Round 1.',
      status: 'DELIVERED',
      time: 'Yesterday, 04:30 PM',
    },
  ]);

  // Notice Board Posts
  const [notices, setNotices] = useState([
    {
      id: 'notice-01',
      title: '🏆 Annual Inter-Trust Sports & Culinary Championship 2026',
      content: 'All schools and colleges under Zep Foundation Bhose are invited to submit student rosters by Friday.',
      target: 'All Campuses (Staff & Students)',
      postedBy: 'Dr. Rajesh Patil (Trust Chairman)',
      date: 'Oct 18, 2026',
      urgent: true,
    },
    {
      id: 'notice-02',
      title: '📢 Diwali Vacation & Academic Examination Schedule Notice',
      content: 'School and College mid-term exams conclude on Oct 28. Trust institutions remain closed from Nov 01 to Nov 10 for Diwali.',
      target: 'Parents, Faculty & Students',
      postedBy: 'Principal Sunita Kulkarni',
      date: 'Oct 20, 2026',
      urgent: false,
    },
  ]);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    target: 'All Campuses (Staff & Students)',
    urgent: false,
  });

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const noticeItem = {
      id: `notice-${Date.now()}`,
      title: newNotice.title,
      content: newNotice.content,
      target: newNotice.target,
      postedBy: 'Trust Executive Office',
      date: 'Just now',
      urgent: newNotice.urgent,
    };

    setNotices([noticeItem, ...notices]);
    setShowNoticeModal(false);
    setNewNotice({ title: '', content: '', target: 'All Campuses (Staff & Students)', urgent: false });
  };

  const filteredWaLogs = waLogs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.recipient.toLowerCase().includes(q) ||
      log.phone.toLowerCase().includes(q) ||
      log.message.toLowerCase().includes(q) ||
      log.template.toLowerCase().includes(q)
    );
  });

  const filteredNotices = notices.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.target.toLowerCase().includes(q)
    );
  });

  const {
    sortedData: sortedWaLogs,
    sortKey: waSortKey,
    sortDirection: waSortDir,
    handleSort: handleWaSort,
  } = useTableSort(filteredWaLogs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Communication, WhatsApp & Digital Notice Board
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official WhatsApp Business API
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Automated fee reminders, daily attendance alerts, CAP seat notifications & role-targeted bulletins
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('WHATSAPP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'WHATSAPP'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          WhatsApp Business Logs ({waLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('NOTICES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'NOTICES'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Digital Notice Board ({notices.length})
        </button>
      </div>

      {/* TAB 1: WHATSAPP LOGS */}
      {activeTab === 'WHATSAPP' && (
        <div className="space-y-4">
          <FilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search WhatsApp logs by recipient name, mobile number, message..."
            pills={[
              {
                id: 'status',
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: 'All', value: 'ALL' },
                  { label: 'Delivered', value: 'DELIVERED' },
                  { label: 'Pending', value: 'PENDING' },
                ],
              },
            ]}
            totalCount={waLogs.length}
            filteredCount={filteredWaLogs.length}
            itemLabel="message logs"
            isFiltered={searchQuery !== '' || statusFilter !== 'ALL'}
            onReset={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
          />

          <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                <tr>
                  <SortableTh label="Sr. No." sortKey="id" currentKey={waSortKey} direction={waSortDir} onSort={handleWaSort} align="center" className="w-12" />
                  <SortableTh label="Recipient" sortKey="recipient" currentKey={waSortKey} direction={waSortDir} onSort={handleWaSort} />
                  <SortableTh label="Template" sortKey="template" currentKey={waSortKey} direction={waSortDir} onSort={handleWaSort} />
                  <SortableTh label="Dispatched Message" sortKey="message" currentKey={waSortKey} direction={waSortDir} onSort={handleWaSort} />
                  <SortableTh label="Timestamp" sortKey="time" currentKey={waSortKey} direction={waSortDir} onSort={handleWaSort} />
                  <SortableTh label="Receipt Status" sortKey="status" currentKey={waSortKey} direction={waSortDir} onSort={handleWaSort} align="center" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedWaLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{log.recipient}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.phone}</div>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 font-bold">
                      {log.template}
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-md">{log.message}</td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{log.time}</td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCheck className="w-3.5 h-3.5" /> {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL NOTICES */}
      {activeTab === 'NOTICES' && (
        <div className="space-y-4">
          <FilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search notices by title, target audience, keyword..."
            totalCount={notices.length}
            filteredCount={filteredNotices.length}
            itemLabel="notices"
            isFiltered={searchQuery !== ''}
            onReset={() => setSearchQuery('')}
            actions={
              <button
                type="button"
                onClick={() => setShowNoticeModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Post Digital Notice
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.map((n) => (
              <div key={n.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">{n.date}</span>
                  {n.urgent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                      Urgent Notice
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Audience: <strong>{n.target}</strong></span>
                  <span>{n.postedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST NOTICE MODAL */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-600" /> Post Digital Notice
              </h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Annual Examinations"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Circular Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice content for students, teachers and parents..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                <select
                  value={newNotice.target}
                  onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="All Campuses (Staff & Students)">All Campuses (Staff & Students)</option>
                  <option value="Parents Only (School)">Parents Only (School)</option>
                  <option value="College Students (Hotel Management)">College Students (Hotel Management)</option>
                  <option value="Faculty & Staff">Faculty & Staff</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={newNotice.urgent}
                  onChange={(e) => setNewNotice({ ...newNotice, urgent: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Mark as High-Priority / Urgent Broadcast</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
