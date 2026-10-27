import React, { useState, useEffect } from 'react';
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
  Image as ImageIcon,
  Film,
  Smartphone,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Trash2,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { FilterBar } from './FilterBar';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';
import {
  EventBroadcast,
  EventBroadcastService,
} from '../utils/eventBroadcastService';
import { CreateEventBroadcastModal } from './CreateEventBroadcastModal';
import { EventMobileSimulatorModal } from './EventMobileSimulatorModal';
import { ParentTeacherMeetingStudio } from './ParentTeacherMeetingStudio';

interface CommunicationModuleProps {
  initialTab?: 'EVENTS' | 'NOTICES' | 'WHATSAPP' | 'PARENT_MEETINGS';
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({ initialTab = 'EVENTS' }) => {
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'NOTICES' | 'WHATSAPP' | 'PARENT_MEETINGS'>(initialTab);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);
  const [simulatorEventId, setSimulatorEventId] = useState<string | undefined>(undefined);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchScopeFilter, setBranchScopeFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>('ALL');
  const [eventStatusFilter, setEventStatusFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

  // Broadcast Events State
  const [events, setEvents] = useState<EventBroadcast[]>(() => EventBroadcastService.getEvents());

  // Listen to cross-component storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setEvents(EventBroadcastService.getEvents());
    };
    window.addEventListener('trust_broadcast_events_updated', handleUpdate);
    return () => window.removeEventListener('trust_broadcast_events_updated', handleUpdate);
  }, []);

  const handleOpenSimulator = (eventId?: string) => {
    setSimulatorEventId(eventId);
    setShowMobileSimulator(true);
  };

  const handleDeleteEvent = (id: string) => {
    EventBroadcastService.deleteEvent(id);
    setEvents(EventBroadcastService.getEvents());
  };

  const handleResetDefaultEvents = () => {
    const res = EventBroadcastService.resetDefaults();
    setEvents(res);
  };

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
      template: 'event_notice_broadcast',
      message: '✨ Grand Dandiya Raas-Garba 2026: Photos and official video recap are live! View on Trust Mobile App.',
      status: 'DELIVERED',
      time: 'Oct 22, 10:30 PM',
    },
  ]);

  // Plain Digital Notice Board Posts
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

  // Filtered lists
  const filteredEvents = events.filter((evt) => {
    if (branchScopeFilter !== 'ALL' && evt.branchScope !== branchScopeFilter && evt.branchScope !== 'ALL') {
      return false;
    }
    if (eventStatusFilter !== 'ALL' && evt.status !== eventStatusFilter) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q) ||
      evt.venue.toLowerCase().includes(q) ||
      evt.postedBy.toLowerCase().includes(q)
    );
  });

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

  const {
    currentPage: waPage,
    setCurrentPage: setWaPage,
    pageSize: waPageSize,
    setPageSize: setWaPageSize,
    paginatedItems: paginatedWaLogs,
  } = usePagination(sortedWaLogs, 10);

  return (
    <div className="space-y-4 animate-fade-in pb-8">
      {/* 1. Header Card with Live Mobile Simulator CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Event Circulars, Photo Gallery & Mobile Broadcasting
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                1,200+ Mobile Users Live
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Superadmin, Trustee & Principal portal to share upcoming event circulars, festive photo albums (Dandiya, Sports) & video reels directly to students&apos; and parents&apos; mobile apps
            </p>
          </div>
        </div>

        {/* Global Shortcuts */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => handleOpenSimulator()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Open phone frame simulator to view exact student mobile feed"
          >
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>Student Mobile Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateEventModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Event & Photos</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'EVENTS'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Events & Mobile Photo/Video Gallery ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTICES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'NOTICES'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Digital Bulletins ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('WHATSAPP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'WHATSAPP'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp Automation Logs ({waLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PARENT_MEETINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'PARENT_MEETINGS'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>Parents Meetings & PTM Studio</span>
        </button>
      </div>

      {/* TAB 1: EVENTS, CIRCULARS & PHOTO/VIDEO GALLERY */}
      {activeTab === 'EVENTS' && (
        <div className="space-y-4">
          {/* Filter Bar with Scope & Event Status */}
          <FilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search events by title (e.g. Dandiya, Sports Day), venue or notice..."
            dropdowns={[
              {
                id: 'scope',
                label: 'Institution Scope',
                value: branchScopeFilter,
                onChange: (v) => setBranchScopeFilter(v as any),
                options: [
                  { label: 'All Campuses (Trust-wide)', value: 'ALL' },
                  { label: 'School (MPS & JC Bhose)', value: 'SCHOOL' },
                  { label: 'College of HM & Tech', value: 'COLLEGE' },
                ],
              },
            ]}
            pills={[
              {
                id: 'status',
                label: 'Status',
                value: eventStatusFilter,
                onChange: (v) => setEventStatusFilter(v as any),
                options: [
                  { label: 'All Events', value: 'ALL' },
                  { label: 'Upcoming Notices', value: 'UPCOMING' },
                  { label: 'Completed Photo Recaps', value: 'COMPLETED' },
                ],
              },
            ]}
            totalCount={events.length}
            filteredCount={filteredEvents.length}
            itemLabel="event circulars"
            isFiltered={searchQuery !== '' || branchScopeFilter !== 'ALL' || eventStatusFilter !== 'ALL'}
            onReset={() => {
              setSearchQuery('');
              setBranchScopeFilter('ALL');
              setEventStatusFilter('ALL');
            }}
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaultEvents}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                  title="Reset demo event feed to original Dandiya & Sports Day items"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Event & Photos</span>
                </button>
              </div>
            }
          />

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-orange-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Event Cover Image Banner */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                            evt.status === 'UPCOMING'
                              ? 'bg-amber-500 text-white'
                              : evt.status === 'ONGOING'
                              ? 'bg-emerald-500 text-white animate-pulse'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {evt.status === 'UPCOMING' ? 'Upcoming Notice' : evt.status === 'COMPLETED' ? 'Event Completed • Gallery Live' : 'Live Ongoing'}
                        </span>
                        {evt.urgent && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
                            Urgent Notice
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-sm">
                        {evt.branchScope === 'ALL'
                          ? 'Both Campuses'
                          : evt.branchScope === 'SCHOOL'
                          ? 'School'
                          : 'College of HM'}
                      </span>
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">
                        {evt.category} Event
                      </span>
                      <h3 className="font-black text-base leading-snug drop-shadow-md">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 text-xs">
                    {/* Schedule & Venue Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span><strong>Date:</strong> {evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span><strong>Time:</strong> {evt.time}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-2 flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span className="truncate"><strong>Venue:</strong> {evt.venue}</span>
                      </div>
                    </div>

                    {/* Circular Notice Text */}
                    <p className="text-slate-600 leading-relaxed text-xs line-clamp-3">
                      {evt.description}
                    </p>

                    {/* Photo Gallery Thumbnails Strip */}
                    {evt.photos.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                            Photo Gallery ({evt.photos.length} Photos Captured)
                          </span>
                          <span className="text-slate-400 font-mono">Visible on Student Mobile</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {evt.photos.slice(0, 4).map((photo, i) => (
                            <div
                              key={photo.id}
                              onClick={() => handleOpenSimulator(evt.id)}
                              className="relative h-16 rounded-xl overflow-hidden border border-slate-200 group cursor-pointer"
                              title={photo.caption}
                            >
                              <img
                                src={photo.url}
                                alt={photo.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                              {i === 3 && evt.photos.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xs">
                                  +{evt.photos.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video Highlights Banner */}
                    {evt.videos.length > 0 && (
                      <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                            <Film className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {evt.videos[0].title}
                            </div>
                            <div className="text-[10px] text-orange-800">
                              Embedded video reel playing inside Mobile App
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenSimulator(evt.id)}
                          className="px-3 py-1 rounded-xl bg-white text-orange-700 font-bold text-xs border border-orange-200 shadow-2xs hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                          Play Reel &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Metadata & Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                  {/* Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Smartphone className="w-3 h-3" /> Live in Student App
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {evt.likesCount}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      By {evt.postedBy.split('(')[0]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenSimulator(evt.id)}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>View on Phone</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `*${evt.title}*\n${evt.date} • ${evt.venue}\n${evt.description}\nPhotos & videos live on Trust Mobile App!`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                      title="Share to WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Delete event broadcast"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* TAB 3: WHATSAPP BUSINESS LOGS */}
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
                    <SortableTh label="Sr. No." sortKey="id" currentSortKey={waSortKey} currentDirection={waSortDir} onSort={handleWaSort} align="center" className="w-12" />
                    <SortableTh label="Recipient" sortKey="recipient" currentSortKey={waSortKey} currentDirection={waSortDir} onSort={handleWaSort} />
                    <SortableTh label="Template" sortKey="template" currentSortKey={waSortKey} currentDirection={waSortDir} onSort={handleWaSort} />
                    <SortableTh label="Dispatched Message" sortKey="message" currentSortKey={waSortKey} currentDirection={waSortDir} onSort={handleWaSort} />
                    <SortableTh label="Timestamp" sortKey="time" currentSortKey={waSortKey} currentDirection={waSortDir} onSort={handleWaSort} />
                    <SortableTh label="Receipt Status" sortKey="status" currentSortKey={waSortKey} currentDirection={waSortDir} onSort={handleWaSort} align="center" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedWaLogs.map((log, index) => {
                    const globalIndex = (waPage - 1) * waPageSize + index + 1;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{globalIndex}</td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Communication Dispatch Logs Pagination Controls */}
            <TablePagination
              currentPage={waPage}
              totalItems={sortedWaLogs.length}
              pageSize={waPageSize}
              pageSizeOptions={[5, 10, 25, 50]}
              onPageChange={setWaPage}
              onPageSizeChange={setWaPageSize}
              itemName="messages"
            />
          </div>
        </div>
      )}

      {/* TAB 4: PARENTS MEETINGS (PTM) & NOTIFICATION DISPATCH */}
      {activeTab === 'PARENT_MEETINGS' && (
        <ParentTeacherMeetingStudio
          currentBranchScope={branchScopeFilter}
          onOpenMobileSimulator={() => handleOpenSimulator()}
        />
      )}

      {/* MODAL 1: CREATE EVENT & MEDIA NOTICE BROADCAST */}
      <CreateEventBroadcastModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onEventCreated={(newEvent) => {
          setEvents(EventBroadcastService.getEvents());
          // Automatically open simulator to preview the created event!
          handleOpenSimulator(newEvent.id);
        }}
      />

      {/* MODAL 2: LIVE STUDENT MOBILE APP SIMULATOR */}
      <EventMobileSimulatorModal
        isOpen={showMobileSimulator}
        onClose={() => setShowMobileSimulator(false)}
        selectedEventId={simulatorEventId}
      />

      {/* MODAL 3: POST PLAIN NOTICE */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-600" /> Post Digital Notice
              </h3>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
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
