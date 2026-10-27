import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Send,
  Plus,
  Search,
  Filter,
  FileText,
  ShieldCheck,
  Phone,
  Bus,
  Sparkles,
  ChevronRight,
  X,
  ExternalLink,
  Download,
  AlertCircle,
  Eye,
  Smartphone,
  Heart,
  Luggage,
  Coffee,
  Check,
  UserCheck,
  Building,
} from 'lucide-react';
import {
  TripItem,
  TripService,
  TripNotification,
  TripEnrolledStudent,
} from '../utils/tripService';
import { TablePagination } from './TablePagination';

interface TripsAndToursModuleProps {
  selectedBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onChangeBranchScope?: (scope: 'ALL' | 'SCHOOL' | 'COLLEGE') => void;
  academicYear?: string;
  onOpenMobileSimulator?: (tripId: string) => void;
}

export const TripsAndToursModule: React.FC<TripsAndToursModuleProps> = ({
  selectedBranchScope = 'ALL',
  onChangeBranchScope,
  academicYear = '2026-2027',
  onOpenMobileSimulator,
}) => {
  const [trips, setTrips] = useState<TripItem[]>(() => TripService.getTrips());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HERITAGE' | 'SCIENCE_ECO' | 'HOSPITALITY_INDUSTRIAL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'REGISTRATION_OPEN' | 'PLANNING' | 'COMPLETED'>('ALL');

  // Selected Trip Drawer / Modal
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(() => trips[0] || null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'ITINERARY' | 'PACKING_RULES' | 'COORDINATORS' | 'CONSENTS' | 'NOTIFICATIONS'>('ITINERARY');

  // Enrolled Students Consent Table Pagination
  const [consentPage, setConsentPage] = useState<number>(1);
  const [consentPageSize, setConsentPageSize] = useState<number>(10);

  useEffect(() => {
    setConsentPage(1);
  }, [selectedTrip?.id]);

  // Notification Broadcaster Modal
  const [broadcastModalTrip, setBroadcastModalTrip] = useState<TripItem | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLocation, setBroadcastLocation] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'INFO' | 'MILESTONE' | 'ALERT'>('MILESTONE');
  const [broadcastSuccessToast, setBroadcastSuccessToast] = useState<string | null>(null);

  // New Trip Creator Modal
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('');
  const [newTripCategory, setNewTripCategory] = useState<'HERITAGE' | 'SCIENCE_ECO' | 'HOSPITALITY_INDUSTRIAL' | 'ADVENTURE'>('HERITAGE');
  const [newTripBranch, setNewTripBranch] = useState<'SCHOOL' | 'COLLEGE'>('SCHOOL');
  const [newTripClasses, setNewTripClasses] = useState('Class 8-A, Class 9-A');
  const [newTripStartDate, setNewTripStartDate] = useState('2026-12-10');
  const [newTripEndDate, setNewTripEndDate] = useState('2026-12-12');
  const [newTripCost, setNewTripCost] = useState(3500);
  const [newTripAssemblyTime, setNewTripAssemblyTime] = useState('06:00 AM');
  const [newTripAssemblyPoint, setNewTripAssemblyPoint] = useState('School Main Gate, Bhose Campus');
  const [newTripOverview, setNewTripOverview] = useState('');

  // Subscribe to service updates
  useEffect(() => {
    const unsub = TripService.subscribe((updated) => {
      setTrips(updated);
      if (selectedTrip) {
        const found = updated.find((t) => t.id === selectedTrip.id);
        if (found) setSelectedTrip(found);
      }
    });
    return () => unsub();
  }, [selectedTrip]);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      if (selectedBranchScope !== 'ALL') {
        if (selectedBranchScope === 'SCHOOL' && t.branchScope === 'COLLEGE') return false;
        if (selectedBranchScope === 'COLLEGE' && t.branchScope === 'SCHOOL') return false;
      }
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDest = t.destination.toLowerCase().includes(q);
        const matchClasses = t.targetClasses.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchDest && !matchClasses) return false;
      }
      return true;
    });
  }, [trips, selectedBranchScope, categoryFilter, statusFilter, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const active = trips.filter((t) => t.status === 'IN_PROGRESS').length;
    const upcoming = trips.filter((t) => t.status === 'REGISTRATION_OPEN').length;
    let totalEnrolled = 0;
    let totalConsentsGranted = 0;
    let totalRevenue = 0;
    let totalNotifications = 0;

    trips.forEach((t) => {
      totalEnrolled += t.enrolledStudents.length;
      totalConsentsGranted += t.enrolledStudents.filter((s) => s.consentStatus === 'GRANTED').length;
      totalRevenue += t.enrolledStudents.reduce((acc, s) => acc + s.amountPaid, 0);
      totalNotifications += t.notifications.length;
    });

    const consentRate = totalEnrolled > 0 ? Math.round((totalConsentsGranted / totalEnrolled) * 100) : 0;

    return {
      active,
      upcoming,
      totalEnrolled,
      totalConsentsGranted,
      consentRate,
      totalRevenue,
      totalNotifications,
    };
  }, [trips]);

  // Handle Quick Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastModalTrip || !broadcastTitle || !broadcastMessage) return;

    TripService.broadcastNotification(broadcastModalTrip.id, {
      title: broadcastTitle,
      message: broadcastMessage,
      location: broadcastLocation,
      severity: broadcastSeverity,
      sentBy: 'Campus Principal & Faculty Escorts',
    });

    setBroadcastSuccessToast(`Notification successfully dispatched to all ${broadcastModalTrip.enrolledStudents.length || 42} parent mobile apps!`);
    setTimeout(() => setBroadcastSuccessToast(null), 4000);

    setBroadcastModalTrip(null);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastLocation('');
  };

  // Quick Preset Broadcast Templates
  const handleApplyPresetBroadcast = (template: { title: string; message: string; location: string; severity: 'INFO' | 'MILESTONE' | 'ALERT' }) => {
    setBroadcastTitle(template.title);
    setBroadcastMessage(template.message);
    setBroadcastLocation(template.location);
    setBroadcastSeverity(template.severity);
  };

  // Handle Create New Trip
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle || !newTripDestination) return;

    const classesArray = newTripClasses.split(',').map((c) => c.trim()).filter(Boolean);

    const created = TripService.addTrip({
      title: newTripTitle,
      destination: newTripDestination,
      category: newTripCategory,
      branchScope: newTripBranch,
      targetClasses: classesArray,
      startDate: newTripStartDate,
      endDate: newTripEndDate,
      durationDays: 2,
      durationNights: 1,
      assemblyTime: newTripAssemblyTime,
      assemblyPoint: newTripAssemblyPoint,
      departureTime: '06:30 AM',
      returnEta: `${newTripEndDate}, 08:00 PM`,
      costPerStudent: Number(newTripCost),
      totalCapacity: 45,
      status: 'PLANNING',
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      overview: newTripOverview || 'Educational study tour organized by Zep Foundation for holistic experiential learning.',
      itinerary: [
        {
          dayNumber: 1,
          date: newTripStartDate,
          title: `Day 1 • Departure & ${newTripDestination} Study Walkthrough`,
          activities: [
            {
              id: 'a1',
              time: newTripAssemblyTime,
              title: 'Student Assembly & Handover',
              description: 'Faculty headcount and safety briefing before boarding.',
              location: newTripAssemblyPoint,
            },
            {
              id: 'a2',
              time: '11:00 AM',
              title: 'Sightseeing & Educational Fieldwork',
              description: 'Guided tour with certified historical or ecological educators.',
              location: newTripDestination,
            },
          ],
          mealsProvided: 'Breakfast, Lunch, Dinner',
          nightStay: 'Approved 3-Star Partner Hotel (Secured campus)',
        },
      ],
      mandatoryPackingList: [
        'School Identity Card (must wear around neck during journey)',
        '2 sets of casual comfortable clothes + 1 school sports track suit',
        'Pair of sturdy walking sports shoes with cotton socks',
        'Personal water bottle (minimum 1 litre)',
        'Prescription medicines with parent note & dosage instructions',
      ],
      prohibitedItems: [
        'Gold jewelry or expensive electronic gadgets',
        'Large amounts of cash (strictly not more than ₹ 500 pocket money allowed)',
        'Sharp items, pocket knives, or firecrackers',
      ],
      safetyGuidelines: [
        'Buddy System enforced at all times.',
        'Immediate faculty roll call at every stop.',
        '24x7 doctor on call with first-aid medical kit onboard.',
      ],
      coordinators: [
        {
          id: 'c1',
          name: 'Prof. Sachin Kulkarni',
          role: 'Lead Tour Director',
          phone: '+91 98224 55112',
          email: 'sachin.kulkarni@modernschool.edu.in',
        },
        {
          id: 'c2',
          name: 'Mrs. Anjali Deshmukh',
          role: 'Lady Student Escort',
          phone: '+91 98221 66778',
          email: 'anjali.deshmukh@modernschool.edu.in',
        },
      ],
      emergencyHelpline: '1800-202-6000 (24x7 Trust Control Room)',
      medicalOfficer: 'Dr. R. K. Patil, MD',
      hospitalTieUp: 'Local Civil District Hospital',
      busNumber: 'MH-12-TR-9901',
      driverName: 'Mr. Ramesh Pawar',
      driverPhone: '+91 97654 32100',
      gpsTrackingActive: false,
    });

    setShowCreateTripModal(false);
    setSelectedTrip(created);
    setBroadcastSuccessToast(`Trip "${newTripTitle}" successfully scheduled! Registration is now live.`);
    setTimeout(() => setBroadcastSuccessToast(null), 4000);
  };

  // Export Roster to CSV
  const handleExportRoster = (trip: TripItem) => {
    const headers = 'Roll No,Student Name,Class,Parent Name,Parent Phone,Digital Consent,Consent Time,Fee Status,Medical Notes\n';
    const rows = trip.enrolledStudents
      .map(
        (s) =>
          `"${s.rollNo}","${s.name}","${s.gradeOrSemester}","${s.parentName}","${s.parentPhone}","${s.consentStatus}","${s.consentGrantedAt || 'Pending'}","${s.feeStatus}","${s.medicalNotes || 'None'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${trip.title.replace(/\s+/g, '_')}_Student_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Toast Alert */}
      {broadcastSuccessToast && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{broadcastSuccessToast}</span>
          </div>
          <button onClick={() => setBroadcastSuccessToast(null)} className="text-emerald-100 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-200 mb-1">
            <Compass className="w-4 h-4 text-orange-300" />
            <span>Educational Tours & Excursions Portal &bull; Session {academicYear}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>School & College Study Trips</span>
            <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold backdrop-blur-xs">
              Live Parent Mobile Sync
            </span>
          </h1>
          <p className="text-xs text-orange-100 max-w-2xl mt-1 leading-relaxed">
            Manage multi-day experiential tours, day-by-day itineraries, essential packing checklists for parents, teacher escort emergency teams, parent digital consent permission slips, and real-time push broadcasts to mobile apps.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCreateTripModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-orange-700 hover:bg-orange-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Plan New Educational Trip</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase">Scheduled Tours</span>
            <Compass className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{trips.length} Trips</div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{stats.active} Live Tour En Route</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase">Enrolled Scholars</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalEnrolled} Students</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Across School & College</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase">Parent Digital Consent</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.consentRate}% Signed</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
            {stats.totalConsentsGranted} of {stats.totalEnrolled} permissions granted
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase">Total Tour Ledger</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹ {stats.totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">AC Coach & Hotel Package</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold uppercase">Parent Mobile Alerts</span>
            <Bell className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{stats.totalNotifications} Updates</div>
          <div className="text-[11px] font-semibold text-rose-700 mt-0.5">Instant Mobile Push Synced</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destination, fort, or tour title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Branch Scope Selector */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => onChangeBranchScope && onChangeBranchScope('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedBranchScope === 'ALL' ? 'bg-white text-orange-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                All Campuses
              </button>
              <button
                type="button"
                onClick={() => onChangeBranchScope && onChangeBranchScope('SCHOOL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedBranchScope === 'SCHOOL' ? 'bg-white text-orange-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                School (K-12)
              </button>
              <button
                type="button"
                onClick={() => onChangeBranchScope && onChangeBranchScope('COLLEGE')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedBranchScope === 'COLLEGE' ? 'bg-white text-orange-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Hotel Mgmt College
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Category:</span>
          {(['ALL', 'HERITAGE', 'SCIENCE_ECO', 'HOSPITALITY_INDUSTRIAL'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'All Categories'
                : cat === 'HERITAGE'
                ? '🏰 Historical Forts & Heritage'
                : cat === 'SCIENCE_ECO'
                ? '🔬 Science, Planetarium & Eco'
                : '🏨 5-Star Hotel & Vineyard'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Educational Trips Roster Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredTrips.map((trip) => {
          const consentsCount = trip.enrolledStudents.filter((s) => s.consentStatus === 'GRANTED').length;
          const totalCount = trip.enrolledStudents.length || 1;
          const consentPct = Math.round((consentsCount / totalCount) * 100);

          return (
            <div
              key={trip.id}
              className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col shadow-xs hover:shadow-md ${
                selectedTrip?.id === trip.id ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
              }`}
            >
              {/* Cover Image & Badges */}
              <div className="relative h-44 w-full bg-slate-900">
                <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
                      trip.status === 'IN_PROGRESS'
                        ? 'bg-emerald-500/95 text-white flex items-center gap-1.5'
                        : trip.status === 'REGISTRATION_OPEN'
                        ? 'bg-blue-600/90 text-white'
                        : trip.status === 'PLANNING'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-slate-700/90 text-white'
                    }`}
                  >
                    {trip.status === 'IN_PROGRESS' && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    {trip.status === 'IN_PROGRESS'
                      ? 'Live on Tour'
                      : trip.status === 'REGISTRATION_OPEN'
                      ? 'Registrations Open'
                      : trip.status === 'PLANNING'
                      ? 'Draft Planning'
                      : 'Completed'}
                  </span>

                  <span className="text-[10px] font-extrabold bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-md">
                    {trip.branchScope === 'SCHOOL' ? '🏫 School' : trip.branchScope === 'COLLEGE' ? '🎓 College HM' : '🌐 All'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-orange-300 block uppercase tracking-wider">
                    {trip.destination}
                  </span>
                  <h3 className="font-extrabold text-sm leading-snug line-clamp-2 text-white drop-shadow-xs">
                    {trip.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>
                      {trip.durationDays}D / {trip.durationNights}N
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{trip.assemblyTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">₹ {trip.costPerStudent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{trip.enrolledStudents.length} Students</span>
                  </div>
                </div>

                {/* Target Classes */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eligible Classes:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {trip.targetClasses.map((cls) => (
                      <span key={cls} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Parent Digital Consent Meter */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Parent Digital Consent
                    </span>
                    <span className="font-extrabold text-emerald-700 text-[11px]">
                      {consentsCount} / {trip.enrolledStudents.length} ({consentPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${consentPct}%` }} />
                  </div>
                </div>

                {/* Live GPS Beacon / Latest Update */}
                {trip.notifications.length > 0 && (
                  <div className="p-2.5 bg-orange-50/80 rounded-xl border border-orange-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-orange-900 flex items-center gap-1">
                        <Bell className="w-3 h-3 text-orange-600" />
                        Latest Mobile Notification
                      </span>
                      <span className="text-[10px] text-orange-700 font-mono">{trip.notifications[0].timestamp}</span>
                    </div>
                    <p className="text-[11px] text-orange-950 font-medium line-clamp-1">
                      {trip.notifications[0].title}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrip(trip);
                      setActiveDrawerTab('ITINERARY');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastModalTrip(trip);
                      setBroadcastTitle('');
                      setBroadcastMessage('');
                      setBroadcastLocation(trip.destination);
                    }}
                    className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                    title="Send Real-Time Notification to Parent Mobile App"
                  >
                    <Bell className="w-4 h-4 text-amber-800" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trip Comprehensive Dossier (Modal / Detail Panel) */}
      {selectedTrip && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-scale-in">
          {/* Header of Drawer */}
          <div className="p-6 bg-slate-900 text-white relative">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                  <Compass className="w-4 h-4" />
                  <span>{selectedTrip.destination} &bull; Official Institutional Tour Dossier</span>
                </div>
                <h2 className="text-xl font-black text-white">{selectedTrip.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    {selectedTrip.startDate} to {selectedTrip.endDate} ({selectedTrip.durationDays} Days / {selectedTrip.durationNights} Nights)
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    Assemble: {selectedTrip.assemblyTime} ({selectedTrip.assemblyPoint})
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    ₹ {selectedTrip.costPerStudent.toLocaleString()} per scholar
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalTrip(selectedTrip)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Send Mobile Update to Parents</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportRoster(selectedTrip)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Roster CSV</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs inside Dossier */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto border-b border-slate-800 pb-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveDrawerTab('ITINERARY')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDrawerTab === 'ITINERARY'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Day-by-Day Itinerary ({selectedTrip.itinerary.length} Days)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('PACKING_RULES')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDrawerTab === 'PACKING_RULES'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Luggage className="w-4 h-4" />
                <span>Packing Checklist & Parent Guidelines</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('COORDINATORS')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDrawerTab === 'COORDINATORS'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Faculty Escorts & 24x7 Emergency Helpline</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('CONSENTS')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDrawerTab === 'CONSENTS'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Parent Consent Ledger ({selectedTrip.enrolledStudents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('NOTIFICATIONS')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDrawerTab === 'NOTIFICATIONS'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Mobile Push Log ({selectedTrip.notifications.length})</span>
              </button>
            </div>
          </div>

          {/* Dossier Content Body */}
          <div className="p-6">
            {/* 1. ITINERARY TAB */}
            {activeDrawerTab === 'ITINERARY' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Complete Day-Wise Educational Tour Itinerary</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Assembly Point: <strong>{selectedTrip.assemblyPoint}</strong> &bull; Return ETA: <strong>{selectedTrip.returnEta}</strong>
                  </span>
                </div>

                <div className="space-y-5">
                  {selectedTrip.itinerary.map((day) => (
                    <div key={day.dayNumber} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                      <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black bg-orange-600 text-white px-2.5 py-1 rounded-lg">
                            Day {day.dayNumber}
                          </span>
                          <span className="font-bold text-xs text-slate-900">{day.title}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">{day.date}</span>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Timeline */}
                        <div className="relative pl-6 space-y-3.5 border-l-2 border-orange-200 ml-2">
                          {day.activities.map((act) => (
                            <div key={act.id} className="relative">
                              <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-orange-600 border-2 border-white shadow-xs" />
                              <div className="text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md text-[10px]">
                                    {act.time}
                                  </span>
                                  <span className="font-bold text-slate-900">{act.title}</span>
                                  {act.location && (
                                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                      <MapPin className="w-3 h-3 text-slate-400" />
                                      {act.location}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Meals & Night Stay */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                              🍽️ Meals Included
                            </span>
                            <span className="font-medium">{day.mealsProvided}</span>
                          </div>
                          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-950">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                              🏨 Night Accommodation
                            </span>
                            <span className="font-medium">{day.nightStay}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. PACKING CHECKLIST & GUIDELINES TAB */}
            {activeDrawerTab === 'PACKING_RULES' && (
              <div className="space-y-6">
                {/* Notice for Parents */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                  <Luggage className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-orange-950 space-y-1">
                    <h4 className="font-bold text-sm">Important Instructions for Parents & Ward Packing Checklist</h4>
                    <p className="leading-relaxed text-orange-900">
                      Please ensure your child packs strictly according to this checklist. Excessive baggage, expensive jewelry, and personal gaming gadgets are strictly prohibited for child safety.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Mandatory Packing List */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Mandatory Items (Must Pack)</span>
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {selectedTrip.mandatoryPackingList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strictly Prohibited Items */}
                  <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/20 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>2. Strictly Prohibited Items (Do Not Carry)</span>
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {selectedTrip.prohibitedItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-rose-950 font-medium">
                          <X className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Safety & Disciplinary Protocols */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>3. Tour Safety & Disciplinary Protocols</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    {selectedTrip.safetyGuidelines.map((rule, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                        <span className="font-bold text-blue-600 shrink-0">#{idx + 1}</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. COORDINATORS & 24x7 EMERGENCY TEAM TAB */}
            {activeDrawerTab === 'COORDINATORS' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-950 space-y-1">
                    <h4 className="font-bold text-sm">24x7 Institutional Emergency Tour Control</h4>
                    <p className="leading-relaxed text-blue-900">
                      Parents can reach faculty coordinators at any time during the tour. The dedicated Trust Emergency Helpline is monitored 24x7 at the central Bhose campus control room.
                    </p>
                  </div>
                </div>

                {/* Faculty Coordinator Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedTrip.coordinators.map((coord) => (
                    <div key={coord.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        {coord.name.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{coord.name}</h4>
                        <span className="text-[11px] text-slate-500 block leading-tight">{coord.role}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                        <a
                          href={`tel:${coord.phone}`}
                          className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{coord.phone}</span>
                        </a>
                        {coord.email && (
                          <span className="text-slate-400 text-[10px] block truncate">{coord.email}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vehicle & Emergency Hospital Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tour Vehicle & Driver
                    </span>
                    <span className="font-bold text-slate-900 block mt-1">{selectedTrip.busNumber}</span>
                    <span className="text-slate-600">
                      Driver: {selectedTrip.driverName} ({selectedTrip.driverPhone})
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Accompanying Medical Doctor
                    </span>
                    <span className="font-bold text-emerald-800 block mt-1">{selectedTrip.medicalOfficer}</span>
                    <span className="text-slate-600">High-altitude first aid & medical kit</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Emergency Hospital Tie-up
                    </span>
                    <span className="font-bold text-slate-900 block mt-1">{selectedTrip.hospitalTieUp}</span>
                    <span className="text-rose-600 font-bold">Helpline: {selectedTrip.emergencyHelpline}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PARENT CONSENT LEDGER TAB */}
            {activeDrawerTab === 'CONSENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Parent Digital Consent & Student Travel Roster</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedTrip.enrolledStudents.filter((s) => s.consentStatus === 'GRANTED').length} Approved /{' '}
                    {selectedTrip.enrolledStudents.filter((s) => s.consentStatus === 'PENDING').length} Pending Consent
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Roll & Name</th>
                        <th className="px-3 py-3">Class</th>
                        <th className="px-3 py-3">Parent Name & Phone</th>
                        <th className="px-3 py-3">Digital Consent Status</th>
                        <th className="px-3 py-3">Fee Status</th>
                        <th className="px-3 py-3">Medical Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTrip.enrolledStudents
                        .slice((consentPage - 1) * consentPageSize, consentPage * consentPageSize)
                        .map((stu) => (
                        <tr key={stu.studentId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">
                            <div>{stu.name}</div>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">Roll #{stu.rollNo}</span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-slate-700">{stu.gradeOrSemester}</td>
                          <td className="px-3 py-3 text-slate-600">
                            <div>{stu.parentName}</div>
                            <span className="font-mono text-[10px] text-slate-400">{stu.parentPhone}</span>
                          </td>
                          <td className="px-3 py-3">
                            {stu.consentStatus === 'GRANTED' ? (
                              <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Granted ({stu.consentGrantedAt?.slice(0, 11) || 'Signed'})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-bold text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Permission Pending
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold">
                            <span className={stu.feeStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}>
                              ₹ {stu.amountPaid.toLocaleString()} ({stu.feeStatus})
                            </span>
                          </td>
                          <td className="px-3 py-3 text-[11px] text-slate-600 max-w-xs truncate">
                            {stu.medicalNotes || 'Fit for travel'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enrolled Students Table Pagination Controls */}
                <TablePagination
                  currentPage={consentPage}
                  totalItems={selectedTrip.enrolledStudents.length}
                  pageSize={consentPageSize}
                  pageSizeOptions={[5, 10, 25, 50]}
                  onPageChange={setConsentPage}
                  onPageSizeChange={setConsentPageSize}
                  itemName="enrolled students"
                />
              </div>
            )}

            {/* 5. NOTIFICATIONS TAB */}
            {activeDrawerTab === 'NOTIFICATIONS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-orange-600" />
                      <span>Live Push Notifications Stream Sent to Parent Mobile Apps</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Messages broadcast here appear in the Parent Mobile App notification tray and tour tracker.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBroadcastModalTrip(selectedTrip)}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Send New Update Now</span>
                  </button>
                </div>

                {/* Notifications History List */}
                <div className="space-y-3">
                  {selectedTrip.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              notif.severity === 'MILESTONE'
                                ? 'bg-orange-500'
                                : notif.severity === 'ALERT'
                                ? 'bg-rose-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <h4 className="font-bold text-xs text-slate-900">{notif.title}</h4>
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pl-4">{notif.message}</p>
                      <div className="pl-4 flex items-center justify-between text-[10px] text-slate-400">
                        {notif.location && <span>📍 Location: {notif.location}</span>}
                        <span>Sent by: {notif.sentBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast Notification Composer Modal */}
      {broadcastModalTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Broadcast Update to Parents Mobile App
                </h3>
              </div>
              <button
                onClick={() => setBroadcastModalTrip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-orange-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                  Target Tour Audience:
                </span>
                <span className="font-bold text-xs">{broadcastModalTrip.title}</span>
                <span className="text-[11px] block text-orange-900">
                  Will instantly push to {broadcastModalTrip.enrolledStudents.length || 42} parents on their mobile smartphones.
                </span>
              </div>

              {/* Quick Template Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">⚡ 1-Click Fast Templates:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyPresetBroadcast({
                        title: '📢 Tour Bus Departed on Schedule',
                        message: 'Tour bus departed campus safely. All students boarded after biometric verification.',
                        location: 'School Gate 1',
                        severity: 'MILESTONE',
                      })
                    }
                    className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    🚌 Bus Departed
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApplyPresetBroadcast({
                        title: '🥪 Refreshment & Meal Halt Safe',
                        message: 'Students have enjoyed fresh breakfast/lunch halt. All children hydrated and happy.',
                        location: 'Highway Plaza Stop',
                        severity: 'INFO',
                      })
                    }
                    className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    🥪 Meal Halt
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApplyPresetBroadcast({
                        title: '🏨 Safe Hotel Check-in & Room Allocation',
                        message: 'Students arrived safely at the hotel and settled in rooms. Dinner at 08:00 PM.',
                        location: 'Hotel Green Valley',
                        severity: 'MILESTONE',
                      })
                    }
                    className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    🏨 Hotel Check-In
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApplyPresetBroadcast({
                        title: '🚌 Return Journey Commenced • ETA 08:30 PM',
                        message: 'Returning toward school campus. Expected arrival at main gate by 08:30 PM. Please be present for pickup.',
                        location: 'En route Bhose',
                        severity: 'MILESTONE',
                      })
                    }
                    className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    🏠 Return Journey ETA
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notification Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 🏰 Raigad Fort Ascent via Ropeway Commenced"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Location / Stop</label>
                <input
                  type="text"
                  placeholder="e.g. Raigad Ropeway Base Station"
                  value={broadcastLocation}
                  onChange={(e) => setBroadcastLocation(e.target.value)}
                  className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message for Parents *</label>
                <textarea
                  rows={3}
                  placeholder="Enter message details for parents..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalTrip(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification to Mobile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan New Educational Trip Modal */}
      {showCreateTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Plan & Schedule New Educational Tour
                </h3>
              </div>
              <button
                onClick={() => setShowCreateTripModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tour Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Shivneri Fort & Agro-Eco Botanical Study Tour"
                    value={newTripTitle}
                    onChange={(e) => setNewTripTitle(e.target.value)}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination & Region *</label>
                  <input
                    type="text"
                    placeholder="e.g. Junnar, Pune District, Maharashtra"
                    value={newTripDestination}
                    onChange={(e) => setNewTripDestination(e.target.value)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTripCategory}
                    onChange={(e) => setNewTripCategory(e.target.value as any)}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    <option value="HERITAGE">🏰 Historical Forts & Heritage</option>
                    <option value="SCIENCE_ECO">🔬 Science, Planetarium & Ecology</option>
                    <option value="HOSPITALITY_INDUSTRIAL">🏨 5-Star Hotel & Vineyard</option>
                    <option value="ADVENTURE">🏕️ Adventure & Nature Trekking</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Branch</label>
                  <select
                    value={newTripBranch}
                    onChange={(e) => setNewTripBranch(e.target.value as any)}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  >
                    <option value="SCHOOL">Modern Public School & Jr College, Bhose</option>
                    <option value="COLLEGE">Modern College of Hotel Management, Solapur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligible Classes (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 8-A, Class 9-A, Class 10-A"
                    value={newTripClasses}
                    onChange={(e) => setNewTripClasses(e.target.value)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTripStartDate}
                    onChange={(e) => setNewTripStartDate(e.target.value)}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newTripEndDate}
                    onChange={(e) => setNewTripEndDate(e.target.value)}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost per Student (₹)</label>
                  <input
                    type="number"
                    value={newTripCost}
                    onChange={(e) => setNewTripCost(Number(e.target.value))}
                    className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assembly Time & Point</label>
                  <input
                    type="text"
                    value={newTripAssemblyTime}
                    onChange={(e) => setNewTripAssemblyTime(e.target.value)}
                    className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tour Overview & Objective</label>
                <textarea
                  rows={2}
                  placeholder="Summary of learning outcomes, historical background..."
                  value={newTripOverview}
                  onChange={(e) => setNewTripOverview(e.target.value)}
                  className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTripModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Save & Publish Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
