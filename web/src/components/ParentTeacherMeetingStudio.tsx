import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Video,
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Sparkles,
  Printer,
  Download,
  Check,
  X,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  FileText,
  Smartphone,
  Eye,
  RotateCcw,
  GraduationCap,
  Building,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { ParentMeetingRecord, ParentMeetingRSVP, MeetingRSVPStatus } from '../types';
import { TrustLogo } from './TrustLogo';
import { getInstitutionDetails } from '../utils/documentUtils';
import { useTableSort, SortableTh } from './TableSort';
import { usePagination, TablePagination } from './TablePagination';

interface ParentTeacherMeetingStudioProps {
  currentBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  academicYear?: string;
  onOpenMobileSimulator?: () => void;
}

// Initial Seed Meetings
const INITIAL_MEETINGS: ParentMeetingRecord[] = [
  {
    id: 'ptm-sch-01',
    meetingCode: 'PTM-SCH-2026-T1',
    branchScope: 'SCHOOL',
    branchName: 'Modern Public School & Jr College Bhose',
    title: 'इयत्ता १० वी प्रथम सत्र निकाल व पालक सभा / Class 10-A Term 1 Academic Performance & Board Strategy Meeting',
    meetingType: 'ACADEMIC_REVIEW',
    targetAudienceType: 'SPECIFIC_CLASSES',
    targetClasses: ['Class 10-A', 'Class 10-B'],
    meetingMode: 'HYBRID',
    date: '2026-10-28',
    startTime: '10:30 AM',
    endTime: '01:30 PM',
    venue: 'Main Auditorium & Room 102 (Class 10-A Room)',
    onlineMeetingUrl: 'https://meet.google.com/zep-ptm-std10',
    teacherInCharge: 'Prof. Rajendra Patil (Class Teacher & Exam Coordinator)',
    teacherPhone: '+91 98220 12345',
    agenda: [
      'प्रथम सत्र गुणपत्रिका वाटप व निकाल विश्लेषण (Term 1 Marksheet Distribution & Analysis)',
      'गणित, विज्ञान व इंग्रजी विषयातील सराव वर्ग (Remedial Study Plan for Core Subjects)',
      'दहावी बोर्ड परीक्षा २०२७ पूर्वतयारी नियोजन (SSC Board Examination Prep Strategy)',
      'विद्यार्थी नियमित उपस्थिती, शिस्त व गृहपाठ आढावा (Attendance & Discipline Review)',
    ],
    notes: 'सर्व पालकांनी विद्यार्थ्यांची गुणपत्रिका व डायरी सोबत आणावी. ज्या पालकांना प्रत्यक्ष येणे शक्य नाही त्यांनी गुगल मीट लिंक द्वारे ऑनलाईन उपस्थित राहावे.',
    status: 'SCHEDULED',
    notificationDispatch: {
      dispatched: true,
      dispatchedAt: '2026-10-23T10:00:00Z',
      channels: ['IN_APP', 'WHATSAPP', 'SMS'],
      totalParentsTargeted: 4,
      deliveredCount: 4,
      readCount: 3,
      smsTemplateMarathi: 'आदरणीय पालक, मॉडर्न पब्लिक स्कूल तर्फे इयत्ता १० वी ची पालक सभा २८ ऑक्टोबर रोजी सकाळी १०:३० वाजता आयोजित केली आहे. कृपया उपस्थित राहावे किंवा ऑनलाइन लिंक वर RSVP नोंदवावे.',
      smsTemplateEnglish: 'Dear Parent, Modern Public School has scheduled the Class 10-A Term 1 Parent-Teacher Meeting on 28 Oct at 10:30 AM. Venue: Room 102 & Google Meet. Please RSVP via Parent Portal.',
    },
    rsvps: [
      {
        studentId: 'stu-s01',
        studentName: 'Aarav Sharma',
        rollNo: '101',
        gradeOrSemester: 'Class 10-A',
        parentName: 'Ramesh Sharma',
        parentPhone: '+91 98230 11223',
        status: 'ATTENDING',
        respondedAt: '2026-10-23T11:15:00Z',
        parentRemarks: 'Will attend in person at 10:30 AM. Would like to discuss Mathematics paper marks.',
        attended: false,
        teacherRemarks: '',
      },
      {
        studentId: 'stu-s02',
        studentName: 'Ananya Patel',
        rollNo: '102',
        gradeOrSemester: 'Class 10-A',
        parentName: 'Bhavesh Patel',
        parentPhone: '+91 98230 44556',
        status: 'ATTENDING',
        respondedAt: '2026-10-23T12:05:00Z',
        parentRemarks: 'Attending physical session in Auditorium.',
        attended: false,
        teacherRemarks: '',
      },
      {
        studentId: 'stu-s03',
        studentName: 'Rohan Deshmukh',
        rollNo: '103',
        gradeOrSemester: 'Class 10-A',
        parentName: 'Sunil Deshmukh',
        parentPhone: '+91 98230 77889',
        status: 'REQUEST_RESCHEDULE',
        respondedAt: '2026-10-23T13:40:00Z',
        parentRemarks: 'On office duty until 12:30 PM. Requesting 01:00 PM slot or will join via Google Meet.',
        attended: false,
        teacherRemarks: 'Approved Google Meet slot at 12:45 PM.',
      },
      {
        studentId: 'stu-s04',
        studentName: 'Snehal Jadhav',
        rollNo: '104',
        gradeOrSemester: 'Class 10-A',
        parentName: 'Vitthal Jadhav',
        parentPhone: '+91 98233 44112',
        status: 'PENDING',
        attended: false,
      },
    ],
    createdAt: '2026-10-23',
    updatedAt: '2026-10-23',
  },
  {
    id: 'ptm-col-hm-01',
    meetingCode: 'PTM-BHM-2026-INT',
    branchScope: 'COLLEGE',
    branchName: 'Modern College of Hotel Management and Technology Solapur',
    title: 'B.Sc Hospitality Studies Semester 4 - 5-Star Hotel Internship Briefing & Parents Conference',
    meetingType: 'INTERNSHIP_PLACEMENT',
    targetAudienceType: 'SPECIFIC_CLASSES',
    targetClasses: ['B.Sc in Hospitality Studies - Semester 4', 'Diploma in Food Production - Sem 2'],
    meetingMode: 'HYBRID',
    date: '2026-10-31',
    startTime: '11:00 AM',
    endTime: '02:00 PM',
    venue: 'Culinary Training Auditorium & Training Restaurant',
    onlineMeetingUrl: 'https://meet.google.com/hm-internship-ptm',
    teacherInCharge: 'Chef Anand Deshpande (Head of Training & Placement)',
    teacherPhone: '+91 98221 44556',
    agenda: [
      'Mandatory 6-Month 5-Star Industrial Training Orientation (Oberoi, Taj, Marriott properties)',
      'Stipend structure, food & accommodation, and professional grooming regulations',
      'Practical Examination Schedule prior to industrial deputation',
      'Parent Consent Forms, Medical Fitness Clearance, and Student Code of Conduct',
    ],
    notes: 'Culinary uniform showcase and lunch buffet prepared by students will be hosted for all attending parents.',
    status: 'SCHEDULED',
    notificationDispatch: {
      dispatched: true,
      dispatchedAt: '2026-10-23T10:30:00Z',
      channels: ['IN_APP', 'WHATSAPP', 'EMAIL'],
      totalParentsTargeted: 2,
      deliveredCount: 2,
      readCount: 2,
      smsTemplateMarathi: 'आदरणीय पालक, मॉडर्न कॉलेज ऑफ हॉटेल मॅनेजमेंट तर्फे बी.एस्सी सत्र ४ च्या विद्यार्थ्यांची ५-स्टार हॉटेल इंटर्नशिप पालक परिषद ३१ ऑक्टोबर रोजी सकाळी ११ वाजता आयोजित केली आहे.',
      smsTemplateEnglish: 'Dear Parent, Modern College of Hotel Management invites you to the Semester 4 5-Star Hotel Internship & Placement Conference on 31 Oct at 11:00 AM. Please RSVP.',
    },
    rsvps: [
      {
        studentId: 'stu-hm01',
        studentName: 'Kabir Kulkarni',
        rollNo: 'HM-201',
        gradeOrSemester: 'B.Sc in Hospitality Studies - Semester 4',
        parentName: 'Milind Kulkarni',
        parentPhone: '+91 98231 66778',
        status: 'ATTENDING',
        respondedAt: '2026-10-23T11:00:00Z',
        parentRemarks: 'Will attend the internship session with Kabir. Interested in Taj group placement.',
        attended: false,
      },
      {
        studentId: 'stu-hm02',
        studentName: 'Shreya Shinde',
        rollNo: 'HM-202',
        gradeOrSemester: 'B.Sc in Hospitality Studies - Semester 4',
        parentName: 'Eknath Shinde',
        parentPhone: '+91 98232 55443',
        status: 'TENTATIVE',
        respondedAt: '2026-10-23T12:20:00Z',
        parentRemarks: 'Might be delayed by 30 mins due to Solapur commute. Please keep presentation handouts.',
        attended: false,
      },
    ],
    createdAt: '2026-10-22',
    updatedAt: '2026-10-23',
  },
  {
    id: 'ptm-sch-02',
    meetingCode: 'PTM-SCH-2026-MID',
    branchScope: 'SCHOOL',
    branchName: 'Modern Public School & Jr College Bhose',
    title: 'Class 7-A Mid-Term Assessment & Foundation Olympiad Review',
    meetingType: 'ACADEMIC_REVIEW',
    targetAudienceType: 'SPECIFIC_CLASSES',
    targetClasses: ['Class 7-A'],
    meetingMode: 'IN_PERSON',
    date: '2026-10-15',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    venue: 'Classroom 7-A (Middle Wing)',
    teacherInCharge: 'Mrs. Sunita Kulkarni (Headmistress)',
    teacherPhone: '+91 98220 99887',
    agenda: [
      'Mid-Term Unit Test Marks distribution',
      'Marathi Handwriting & English Reading improvement',
      'National Science & Mathematics Olympiad enrollment',
    ],
    status: 'COMPLETED',
    notificationDispatch: {
      dispatched: true,
      dispatchedAt: '2026-10-10T09:00:00Z',
      channels: ['IN_APP', 'WHATSAPP', 'SMS'],
      totalParentsTargeted: 24,
      deliveredCount: 24,
      readCount: 22,
      smsTemplateMarathi: 'इयत्ता ७ वी ची पालक सभा १५ ऑक्टोबर रोजी पार पडेल.',
      smsTemplateEnglish: 'Class 7-A PTM scheduled on 15 Oct.',
    },
    rsvps: [
      {
        studentId: 'stu-s01',
        studentName: 'Aarav Sharma',
        rollNo: '101',
        gradeOrSemester: 'Class 7-A',
        parentName: 'Ramesh Sharma',
        parentPhone: '+91 98230 11223',
        status: 'ATTENDING',
        attended: true,
        teacherRemarks: 'Parent attended. Discussed focus on Marathi grammar and cursive handwriting.',
      },
    ],
    minutesOfMeeting: 'Meeting commenced at 09:30 AM. 21 out of 24 parents attended. Parents appreciated Olympiad coaching and suggested additional Saturday practice sessions. Resolved to start weekend doubt-clearing sessions.',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-15',
  },
];

export const ParentTeacherMeetingStudio: React.FC<ParentTeacherMeetingStudioProps> = ({
  currentBranchScope = 'ALL',
  academicYear = '2026-2027',
  onOpenMobileSimulator,
}) => {
  const [meetings, setMeetings] = useState<ParentMeetingRecord[]>(() => {
    const saved = localStorage.getItem('trust_parent_meetings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_MEETINGS;
  });

  // Filter States
  const [branchScopeFilter, setBranchScopeFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>(
    currentBranchScope === 'ALL' ? 'ALL' : currentBranchScope
  );
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Meeting for Roster & Details
  const [selectedMeeting, setSelectedMeeting] = useState<ParentMeetingRecord | null>(null);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showParentSimulatorModal, setShowParentSimulatorModal] = useState(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('trust_parent_meetings', JSON.stringify(meetings));
  }, [meetings]);

  // Fetch latest from API on mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/enterprise/parent-meetings');
        if (res.ok) {
          const data = await res.json();
          if (data.meetings && data.meetings.length > 0) {
            setMeetings(data.meetings);
          }
        }
      } catch (e) {
        // network or dev mode, use local state
      }
    };
    fetchMeetings();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Filtered Meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      if (branchScopeFilter !== 'ALL' && m.branchScope !== branchScopeFilter && m.branchScope !== 'ALL') {
        return false;
      }
      if (statusFilter !== 'ALL' && m.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchVenue = m.venue.toLowerCase().includes(q);
        const matchTeacher = m.teacherInCharge.toLowerCase().includes(q);
        const matchClasses = m.targetClasses.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchVenue && !matchTeacher && !matchClasses) return false;
      }
      return true;
    });
  }, [meetings, branchScopeFilter, statusFilter, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = meetings.length;
    const upcoming = meetings.filter((m) => m.status === 'SCHEDULED').length;
    const totalParents = meetings.reduce((acc, m) => acc + (m.rsvps?.length || 0), 0);
    const attendingCount = meetings.reduce(
      (acc, m) => acc + (m.rsvps?.filter((r) => r.status === 'ATTENDING').length || 0),
      0
    );
    const rescheduleCount = meetings.reduce(
      (acc, m) => acc + (m.rsvps?.filter((r) => r.status === 'REQUEST_RESCHEDULE').length || 0),
      0
    );
    const attendanceRate = totalParents > 0 ? Math.round((attendingCount / totalParents) * 100) : 0;
    return { total, upcoming, totalParents, attendingCount, rescheduleCount, attendanceRate };
  }, [meetings]);

  // Handler: Dispatch Notification Blast
  const handleDispatchNotificationBlast = async (meetingId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;

    try {
      await fetch(`/api/enterprise/parent-meetings/${meetingId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderType: 'STANDARD', channels: ['IN_APP', 'WHATSAPP', 'SMS'] }),
      });
    } catch (e) {
      // offline fallback
    }

    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === meetingId) {
          return {
            ...m,
            notificationDispatch: {
              ...m.notificationDispatch,
              dispatched: true,
              dispatchedAt: new Date().toISOString(),
              deliveredCount: m.rsvps.length || 1,
            },
          };
        }
        return m;
      })
    );

    triggerToast(`🔔 Notification blast dispatched across WhatsApp, SMS & Mobile App to ${meeting.rsvps.length} parents!`);
  };

  // Handler: Update RSVP from parent simulator or teacher entry
  const handleUpdateRSVP = (
    meetingId: string,
    studentId: string,
    newStatus: MeetingRSVPStatus,
    remarks?: string
  ) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === meetingId) {
          const updatedRsvps = m.rsvps.map((r) => {
            if (r.studentId === studentId) {
              return {
                ...r,
                status: newStatus,
                respondedAt: new Date().toISOString(),
                parentRemarks: remarks !== undefined ? remarks : r.parentRemarks,
              };
            }
            return r;
          });
          return { ...m, rsvps: updatedRsvps };
        }
        return m;
      })
    );

    // If modal is open, keep selectedMeeting synchronized
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting((curr) => {
        if (!curr) return null;
        return {
          ...curr,
          rsvps: curr.rsvps.map((r) =>
            r.studentId === studentId
              ? { ...r, status: newStatus, respondedAt: new Date().toISOString(), parentRemarks: remarks }
              : r
          ),
        };
      });
    }

    triggerToast(`✅ Parent RSVP updated: ${newStatus.replace('_', ' ')}`);
  };

  // Handler: Toggle Parent Physical Attendance
  const handleToggleAttendance = (meetingId: string, studentId: string, currentVal: boolean) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === meetingId) {
          const updated = m.rsvps.map((r) => {
            if (r.studentId === studentId) {
              return { ...r, attended: !currentVal };
            }
            return r;
          });
          return { ...m, rsvps: updated };
        }
        return m;
      })
    );

    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting((curr) => {
        if (!curr) return null;
        return {
          ...curr,
          rsvps: curr.rsvps.map((r) => (r.studentId === studentId ? { ...r, attended: !currentVal } : r)),
        };
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-orange-500 flex items-center gap-3 animate-slide-in">
          <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Master Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/25 shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Parent-Teacher Meeting (PTM) & Parent Notification Studio
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                पालक सभा व्यवस्थापन
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Schedule academic reviews, SSC Board exam consultations & 5-star hotel internship conferences across <strong>School & College</strong>. Target parents receive automated <strong>In-App Push Alerts, WhatsApp messages & SMS with instant RSVP response tracking</strong>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setShowParentSimulatorModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="See exact notification and RSVP screen received on parents' phones"
          >
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>📱 Parent Phone View</span>
          </button>

          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Parents Meeting</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Total Meetings</span>
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <strong className="text-orange-700">{metrics.upcoming} Upcoming</strong> scheduled
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Parents Targeted</span>
            <Bell className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalParents}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            100% Multi-Channel Alerts Dispatched
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Confirmed Attending</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{metrics.attendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <strong className="text-emerald-700">{metrics.attendanceRate}%</strong> RSVP acceptance rate
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold">Reschedule Requested</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{metrics.rescheduleCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Alternative online slot offered
          </div>
        </div>
      </div>

      {/* 3. Filters & Scope Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        {/* Scope Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setBranchScopeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              branchScopeFilter === 'ALL'
                ? 'bg-white text-orange-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ All Campuses
          </button>
          <button
            type="button"
            onClick={() => setBranchScopeFilter('SCHOOL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              branchScopeFilter === 'SCHOOL'
                ? 'bg-white text-orange-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏫 School Classes
          </button>
          <button
            type="button"
            onClick={() => setBranchScopeFilter('COLLEGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              branchScopeFilter === 'COLLEGE'
                ? 'bg-white text-orange-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 College of Hotel Mgmt
          </button>
        </div>

        {/* Search & Status */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings by title, teacher, or class..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-orange-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="SCHEDULED">Upcoming Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* 4. Meetings Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredMeetings.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Parent Meetings Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your campus filter or schedule a new meeting.</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const attendingCount = meeting.rsvps.filter((r) => r.status === 'ATTENDING').length;
            const rescheduleCount = meeting.rsvps.filter((r) => r.status === 'REQUEST_RESCHEDULE').length;
            const pendingCount = meeting.rsvps.filter((r) => r.status === 'PENDING').length;
            const isCompleted = meeting.status === 'COMPLETED';

            return (
              <div
                key={meeting.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-orange-500/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Header Banner */}
                <div className="p-5 border-b border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          meeting.branchScope === 'COLLEGE'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-orange-100 text-orange-900 border border-orange-200'
                        }`}
                      >
                        {meeting.branchScope === 'COLLEGE' ? '🎓 College of HM' : '🏫 School'}
                      </span>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          meeting.meetingMode === 'ONLINE'
                            ? 'bg-blue-100 text-blue-800'
                            : meeting.meetingMode === 'HYBRID'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {meeting.meetingMode === 'ONLINE'
                          ? '🌐 Online Video'
                          : meeting.meetingMode === 'HYBRID'
                          ? '🏛️ Physical + 🌐 Online'
                          : '🏫 Physical Campus'}
                      </span>

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          meeting.status === 'SCHEDULED'
                            ? 'bg-indigo-600 text-white'
                            : meeting.status === 'COMPLETED'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {meeting.status}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {meeting.meetingCode}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {meeting.title}
                  </h3>

                  {/* Target Classes Badge */}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-bold text-slate-500">Target Classes:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {meeting.targetClasses.map((cls, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body Particulars */}
                <div className="p-5 space-y-4 text-xs">
                  {/* Schedule & Venue Details Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                      <span><strong>Date:</strong> {meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                      <span><strong>Time:</strong> {meeting.startTime} - {meeting.endTime}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Venue:</strong> {meeting.venue}
                      </div>
                    </div>
                    {meeting.onlineMeetingUrl && (
                      <div className="col-span-1 sm:col-span-2 flex items-center justify-between gap-2 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                        <div className="flex items-center gap-1.5 truncate">
                          <Video className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate text-[11px] font-mono">{meeting.onlineMeetingUrl}</span>
                        </div>
                        <a
                          href={meeting.onlineMeetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-500 shrink-0"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Teacher in Charge */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-500" />
                      <span><strong>Coordinator:</strong> {meeting.teacherInCharge}</span>
                    </div>
                    <a
                      href={`tel:${meeting.teacherPhone}`}
                      className="flex items-center gap-1 text-orange-700 font-bold hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{meeting.teacherPhone}</span>
                    </a>
                  </div>

                  {/* Agenda Strip */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-orange-600" />
                      Key Agenda Points ({meeting.agenda.length})
                    </div>
                    <ul className="space-y-1 text-slate-700 text-[11px] pl-1">
                      {meeting.agenda.map((ag, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notification Dispatch Status Pill */}
                  <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-[11px]">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-bold text-slate-800">
                        Multi-Channel Broadcast Dispatched:
                      </span>
                      <span className="font-mono text-orange-800 font-bold">
                        {meeting.notificationDispatch.channels.join(' + ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                      <span>Targeted: {meeting.rsvps.length}</span>
                      <span>•</span>
                      <span className="text-emerald-700">Attending: {attendingCount}</span>
                      {rescheduleCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700">Reschedule: {rescheduleCount}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDispatchNotificationBlast(meeting.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-700 bg-orange-100/80 hover:bg-orange-200/80 transition-colors cursor-pointer"
                      title="Send instant SMS/WhatsApp reminder blast to all parents"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reminder</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowPrintModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Print official letterhead notice for student diaries"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Notice</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setShowRosterModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>View Parent RSVP Roster</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: SCHEDULE NEW PARENT MEETING WIZARD */}
      {/* ======================================================== */}
      {showScheduleModal && (
        <ScheduleMeetingModal
          onClose={() => setShowScheduleModal(false)}
          onCreated={(newM) => {
            setMeetings((prev) => [newM, ...prev]);
            setShowScheduleModal(false);
            triggerToast(`🎉 Meeting "${newM.title.slice(0, 30)}..." scheduled & parent alerts dispatched!`);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PARENT RSVP ROSTER & ATTENDANCE TRACKER */}
      {/* ======================================================== */}
      {showRosterModal && selectedMeeting && (
        <ParentRosterModal
          meeting={selectedMeeting}
          onClose={() => {
            setShowRosterModal(false);
            setSelectedMeeting(null);
          }}
          onUpdateRSVP={(stuId, st, rem) => handleUpdateRSVP(selectedMeeting.id, stuId, st, rem)}
          onToggleAttendance={(stuId, cur) => handleToggleAttendance(selectedMeeting.id, stuId, cur)}
          onSendReminder={() => handleDispatchNotificationBlast(selectedMeeting.id)}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 3: PARENT PHONE NOTIFICATION SIMULATOR */}
      {/* ======================================================== */}
      {showParentSimulatorModal && (
        <ParentPhoneSimulatorModal
          meetings={meetings}
          onClose={() => setShowParentSimulatorModal(false)}
          onRSVP={(mId, stuId, status, rem) => handleUpdateRSVP(mId, stuId, status, rem)}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 4: PRINTABLE PTM CIRCULAR / NOTICE */}
      {/* ======================================================== */}
      {showPrintModal && selectedMeeting && (
        <PrintableMeetingNoticeModal
          meeting={selectedMeeting}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedMeeting(null);
          }}
        />
      )}
    </div>
  );
};

// ==============================================================================
// SUBCOMPONENT: SCHEDULE NEW PARENT MEETING MODAL
// ==============================================================================
interface ScheduleMeetingModalProps {
  onClose: () => void;
  onCreated: (meeting: ParentMeetingRecord) => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ onClose, onCreated }) => {
  const [branchScope, setBranchScope] = useState<'SCHOOL' | 'COLLEGE'>('SCHOOL');
  const [meetingType, setMeetingType] = useState('ACADEMIC_REVIEW');
  const [title, setTitle] = useState('इयत्ता १० वी प्रथम सत्र निकाल व पालक सभा');
  const [targetClass, setTargetClass] = useState('Class 10-A');
  const [meetingMode, setMeetingMode] = useState<'IN_PERSON' | 'ONLINE' | 'HYBRID'>('HYBRID');
  const [date, setDate] = useState('2026-10-28');
  const [startTime, setStartTime] = useState('10:30 AM');
  const [endTime, setEndTime] = useState('01:30 PM');
  const [venue, setVenue] = useState('Main Auditorium & Room 102 (Class 10-A Room)');
  const [onlineMeetingUrl, setOnlineMeetingUrl] = useState('https://meet.google.com/zep-ptm-std10');
  const [teacherInCharge, setTeacherInCharge] = useState('Prof. Rajendra Patil (Class Teacher)');
  const [teacherPhone, setTeacherPhone] = useState('+91 98220 12345');
  const [agendaItems, setAgendaItems] = useState<string[]>([
    'प्रथम सत्र निकाल व गुणपत्रिका वाटप (Term 1 Results Distribution)',
    'विद्यार्थी नियमित उपस्थिती व अभ्यास प्रगती चर्चा (Attendance & Study Progress)',
    'पुढील सत्रातील परीक्षा नियोजन (Upcoming Board Exam Strategy)',
  ]);
  const [newAgendaInput, setNewAgendaInput] = useState('');
  const [notes, setNotes] = useState('सर्व पालकांनी उपस्थित राहणे अनिवार्य आहे. डायरी सोबत आणावी.');
  const [channels, setChannels] = useState<string[]>(['IN_APP', 'WHATSAPP', 'SMS']);

  const handleAddAgenda = () => {
    if (newAgendaInput.trim()) {
      setAgendaItems([...agendaItems, newAgendaInput.trim()]);
      setNewAgendaInput('');
    }
  };

  const handleRemoveAgenda = (idx: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const meetingId = `ptm-${Date.now()}`;
    const meetingCode = `PTM-${branchScope.slice(0, 3)}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const branchName =
      branchScope === 'COLLEGE'
        ? 'Modern College of Hotel Management and Technology Solapur'
        : 'Modern Public School & Jr College Bhose';

    // Mock initial students in target class
    const sampleRsvps: ParentMeetingRSVP[] = [
      {
        studentId: 'stu-s01',
        studentName: 'Aarav Sharma',
        rollNo: '101',
        gradeOrSemester: targetClass,
        parentName: 'Ramesh Sharma',
        parentPhone: '+91 98230 11223',
        status: 'PENDING',
        attended: false,
      },
      {
        studentId: 'stu-s02',
        studentName: 'Ananya Patel',
        rollNo: '102',
        gradeOrSemester: targetClass,
        parentName: 'Bhavesh Patel',
        parentPhone: '+91 98230 44556',
        status: 'PENDING',
        attended: false,
      },
      {
        studentId: 'stu-s03',
        studentName: 'Rohan Deshmukh',
        rollNo: '103',
        gradeOrSemester: targetClass,
        parentName: 'Sunil Deshmukh',
        parentPhone: '+91 98230 77889',
        status: 'PENDING',
        attended: false,
      },
    ];

    const newMeeting: ParentMeetingRecord = {
      id: meetingId,
      meetingCode,
      branchScope,
      branchName,
      title,
      meetingType: meetingType as any,
      targetAudienceType: 'SPECIFIC_CLASSES',
      targetClasses: [targetClass],
      meetingMode,
      date,
      startTime,
      endTime,
      venue,
      onlineMeetingUrl: meetingMode !== 'IN_PERSON' ? onlineMeetingUrl : undefined,
      teacherInCharge,
      teacherPhone,
      agenda: agendaItems,
      notes,
      status: 'SCHEDULED',
      notificationDispatch: {
        dispatched: true,
        dispatchedAt: new Date().toISOString(),
        channels: channels as any,
        totalParentsTargeted: sampleRsvps.length,
        deliveredCount: sampleRsvps.length,
        readCount: 0,
        smsTemplateMarathi: `आदरणीय पालक, ${branchName} तर्फे पालक सभेचे आयोजन ${date} रोजी वेळ ${startTime} वाजता करण्यात आले आहे. ठिकाण: ${venue}. कृपया उपस्थित राहावे.`,
        smsTemplateEnglish: `Dear Parent, ${branchName} has scheduled a Parent-Teacher Meeting on ${date} at ${startTime}. Venue: ${venue}. Please submit RSVP.`,
      },
      rsvps: sampleRsvps,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onCreated(newMeeting);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black">Schedule New Parents Meeting (पालक सभा)</h2>
              <p className="text-xs text-orange-100">Broadcasts instant WhatsApp, SMS & App notifications to parents</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Branch & Class Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus Scope</label>
              <select
                value={branchScope}
                onChange={(e) => {
                  const sc = e.target.value as 'SCHOOL' | 'COLLEGE';
                  setBranchScope(sc);
                  if (sc === 'COLLEGE') {
                    setTitle('B.Sc Hospitality Studies Semester 4 - Internship Briefing & Parents Meet');
                    setTargetClass('B.Sc in Hospitality Studies - Semester 4');
                    setVenue('Culinary Training Auditorium & Restaurant');
                  } else {
                    setTitle('इयत्ता १० वी प्रथम सत्र निकाल व पालक सभा');
                    setTargetClass('Class 10-A');
                    setVenue('Main Auditorium & Room 102');
                  }
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
              >
                <option value="SCHOOL">Modern Public School & Jr College</option>
                <option value="COLLEGE">Modern College of Hotel Management</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Class / Batch</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
              >
                {branchScope === 'SCHOOL' ? (
                  <>
                    <option value="Class 10-A">Class 10-A (SSC Board Batch)</option>
                    <option value="Class 10-B">Class 10-B (SSC Board Batch)</option>
                    <option value="Class 7-A">Class 7-A (Middle School)</option>
                    <option value="Class 12 - Science">Class 12 - Science (HSC Board)</option>
                    <option value="All Classes">All School Classes (General PTA)</option>
                  </>
                ) : (
                  <>
                    <option value="B.Sc in Hospitality Studies - Semester 4">B.Sc Hospitality Studies - Semester 4</option>
                    <option value="B.Sc in Hospitality Studies - Semester 1">B.Sc Hospitality Studies - Semester 1</option>
                    <option value="Diploma in Food Production - Sem 2">Diploma in Food Production - Sem 2</option>
                    <option value="All Semesters">All College Semesters</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Meeting Title / Topic</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-orange-500"
            />
          </div>

          {/* Mode, Date, Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Meeting Mode</label>
              <select
                value={meetingMode}
                onChange={(e) => setMeetingMode(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
              >
                <option value="HYBRID">Hybrid (Campus + Google Meet)</option>
                <option value="IN_PERSON">In-Person (Campus Only)</option>
                <option value="ONLINE">Online (Virtual Call Only)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Start & End Time</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-1/2 p-2 rounded-lg border border-slate-200 text-center font-bold"
                  placeholder="10:30 AM"
                />
                <span>-</span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-1/2 p-2 rounded-lg border border-slate-200 text-center font-bold"
                  placeholder="01:30 PM"
                />
              </div>
            </div>
          </div>

          {/* Venue & Online Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical Venue / Room</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Auditorium / Room 102"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Online Google Meet / Zoom Link</label>
              <input
                type="url"
                value={onlineMeetingUrl}
                onChange={(e) => setOnlineMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>
          </div>

          {/* Coordinator / Teacher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Teacher / Coordinator in Charge</label>
              <input
                type="text"
                required
                value={teacherInCharge}
                onChange={(e) => setTeacherInCharge(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Coordinator Contact Phone</label>
              <input
                type="text"
                required
                value={teacherPhone}
                onChange={(e) => setTeacherPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Agenda Builder */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Key Agenda Points</label>
            <div className="space-y-1.5 mb-2">
              {agendaItems.map((ag, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-800 text-[11px] font-medium">{ag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgenda(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newAgendaInput}
                onChange={(e) => setNewAgendaInput(e.target.value)}
                placeholder="Add agenda topic (e.g. Result distribution, Discipline, Olympiad)..."
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddAgenda}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-xs"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Notification Channels Checkboxes */}
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
            <span className="block font-black text-orange-950 uppercase tracking-wider text-[11px]">
              🔔 Multi-Channel Notification Dispatch
            </span>
            <div className="flex items-center gap-4 flex-wrap text-slate-800 font-bold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.includes('IN_APP')}
                  onChange={(e) =>
                    setChannels(e.target.checked ? [...channels, 'IN_APP'] : channels.filter((c) => c !== 'IN_APP'))
                  }
                  className="rounded text-orange-600"
                />
                <span>Mobile App Push Alert</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.includes('WHATSAPP')}
                  onChange={(e) =>
                    setChannels(e.target.checked ? [...channels, 'WHATSAPP'] : channels.filter((c) => c !== 'WHATSAPP'))
                  }
                  className="rounded text-emerald-600"
                />
                <span>WhatsApp Business Message</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.includes('SMS')}
                  onChange={(e) =>
                    setChannels(e.target.checked ? [...channels, 'SMS'] : channels.filter((c) => c !== 'SMS'))
                  }
                  className="rounded text-blue-600"
                />
                <span>SMS Alert (DLT Approved)</span>
              </label>
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-600/20"
            >
              Publish & Dispatch Alerts to Parents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==============================================================================
// SUBCOMPONENT: PARENT RSVP ROSTER & ATTENDANCE MODAL
// ==============================================================================
interface ParentRosterModalProps {
  meeting: ParentMeetingRecord;
  onClose: () => void;
  onUpdateRSVP: (studentId: string, status: MeetingRSVPStatus, remarks?: string) => void;
  onToggleAttendance: (studentId: string, currentVal: boolean) => void;
  onSendReminder: () => void;
}

const ParentRosterModal: React.FC<ParentRosterModalProps> = ({
  meeting,
  onClose,
  onUpdateRSVP,
  onToggleAttendance,
  onSendReminder,
}) => {
  const [filterRsvp, setFilterRsvp] = useState<string>('ALL');
  const [rosterSearch, setRosterSearch] = useState('');

  const filteredRsvps = useMemo(() => {
    return meeting.rsvps.filter((r) => {
      if (filterRsvp !== 'ALL' && r.status !== filterRsvp) return false;
      if (rosterSearch.trim()) {
        const q = rosterSearch.toLowerCase();
        return (
          r.studentName.toLowerCase().includes(q) ||
          r.parentName.toLowerCase().includes(q) ||
          r.rollNo.toLowerCase().includes(q) ||
          r.parentPhone.includes(q)
        );
      }
      return true;
    });
  }, [meeting.rsvps, filterRsvp, rosterSearch]);

  const attendingCount = meeting.rsvps.filter((r) => r.status === 'ATTENDING').length;
  const attendedCount = meeting.rsvps.filter((r) => r.attended).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
              Parent-Teacher Meeting Roster • {meeting.meetingCode}
            </div>
            <h2 className="text-base font-black truncate max-w-xl">{meeting.title}</h2>
            <div className="text-xs text-slate-400 mt-0.5">
              {meeting.date} • {meeting.startTime} - {meeting.endTime} • {meeting.venue}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Filter RSVP:</span>
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
            >
              <option value="ALL">All ({meeting.rsvps.length})</option>
              <option value="ATTENDING">Attending ({attendingCount})</option>
              <option value="REQUEST_RESCHEDULE">Request Reschedule</option>
              <option value="PENDING">Pending Response</option>
              <option value="CANNOT_ATTEND">Cannot Attend</option>
            </select>

            <input
              type="text"
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
              placeholder="Search parent or student..."
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSendReminder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 text-orange-800 font-bold hover:bg-orange-200 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Remind Pending Parents</span>
            </button>
            <span className="font-bold text-emerald-700 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
              {attendedCount} / {meeting.rsvps.length} Attended
            </span>
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-y-auto flex-1 p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Student & Roll No</th>
                <th className="py-2.5 px-3">Parent Name & Contact</th>
                <th className="py-2.5 px-3">RSVP Status</th>
                <th className="py-2.5 px-3">Parent Remarks</th>
                <th className="py-2.5 px-3 text-center">Meeting Attendance</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRsvps.map((rsvp) => (
                <tr key={rsvp.studentId} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{rsvp.studentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Roll: {rsvp.rollNo} • {rsvp.gradeOrSemester}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{rsvp.parentName}</div>
                    <a
                      href={`https://wa.me/${rsvp.parentPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-700 font-mono font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      {rsvp.parentPhone}
                    </a>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        rsvp.status === 'ATTENDING'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rsvp.status === 'REQUEST_RESCHEDULE'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : rsvp.status === 'CANNOT_ATTEND'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rsvp.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-3 max-w-xs text-slate-600 text-[11px]">
                    {rsvp.parentRemarks || <span className="text-slate-400 italic">No notes</span>}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleAttendance(rsvp.studentId, rsvp.attended)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                        rsvp.attended
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {rsvp.attended ? '✓ Attended' : 'Mark Attended'}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <select
                      value={rsvp.status}
                      onChange={(e) => onUpdateRSVP(rsvp.studentId, e.target.value as any)}
                      className="text-[10px] font-bold p-1 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="ATTENDING">Attending</option>
                      <option value="TENTATIVE">Tentative</option>
                      <option value="REQUEST_RESCHEDULE">Request Reschedule</option>
                      <option value="CANNOT_ATTEND">Cannot Attend</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            Showing {filteredRsvps.length} of {meeting.rsvps.length} parents
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// SUBCOMPONENT: PARENT PHONE NOTIFICATION & RSVP SIMULATOR
// ==============================================================================
interface ParentPhoneSimulatorModalProps {
  meetings: ParentMeetingRecord[];
  onClose: () => void;
  onRSVP: (meetingId: string, studentId: string, status: MeetingRSVPStatus, remarks?: string) => void;
}

const ParentPhoneSimulatorModal: React.FC<ParentPhoneSimulatorModalProps> = ({
  meetings,
  onClose,
  onRSVP,
}) => {
  const activeMeeting = meetings[0] || null;
  const [selectedStatus, setSelectedStatus] = useState<MeetingRSVPStatus>('ATTENDING');
  const [parentNotes, setParentNotes] = useState('होय, मी उपस्थित राहीन. गणिताच्या गुणांविषयी चर्चा करायची आहे.');
  const [submitted, setSubmitted] = useState(false);

  const handleParentConfirm = () => {
    if (activeMeeting) {
      onRSVP(activeMeeting.id, 'stu-s01', selectedStatus, parentNotes);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-950 text-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-slate-800 flex flex-col md:flex-row gap-6 items-center justify-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Explanatory Column */}
        <div className="md:w-5/12 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-orange-400 font-black tracking-wider text-[11px] uppercase">
            <Smartphone className="w-4 h-4" />
            <span>Parent Mobile App Experience</span>
          </div>
          <h2 className="text-xl font-black text-white leading-tight">
            How Parents Receive the Meeting Notification
          </h2>
          <p className="text-slate-400 leading-relaxed">
            The moment the Principal or Class Teacher schedules a parent meeting, the parent receives an instant alert on their smartphone. They can view the meeting date, venue, join via Google Meet, and submit their attendance RSVP in seconds.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Multi-Channel Notification Gateway</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Delivered via Marathi & English WhatsApp Business message, SMS, and high-priority push notification.
            </p>
          </div>
        </div>

        {/* Right Side: Smartphone Frame */}
        <div className="w-[310px] h-[580px] bg-slate-900 rounded-[40px] border-[6px] border-slate-800 shadow-2xl flex flex-col overflow-hidden relative text-slate-900">
          {/* Top Notch */}
          <div className="bg-black text-white text-[10px] py-1 px-4 flex items-center justify-between">
            <span>09:41</span>
            <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
            <span>5G 100%</span>
          </div>

          {/* App Header */}
          <div className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrustLogo variant="emblem" size="xs" />
              <div>
                <div className="text-[11px] font-black leading-none">Trust Parent App</div>
                <div className="text-[9px] text-orange-100">Modern Public School & College</div>
              </div>
            </div>
            <Bell className="w-4 h-4 text-white" />
          </div>

          {/* Phone Scroll Content */}
          <div className="p-3 flex-1 overflow-y-auto space-y-3 bg-slate-100 text-xs">
            {/* Notification Alert Banner */}
            <div className="p-2.5 rounded-xl bg-orange-100 border border-orange-300 text-orange-950 flex items-start gap-2 animate-bounce-subtle">
              <Bell className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[11px]">नवी सूचना / New Meeting</strong>
                <p className="text-[10px] text-orange-900">
                  इयत्ता १० वी पालक सभा २८ ऑक्टोबर रोजी आयोजित केली आहे.
                </p>
              </div>
            </div>

            {/* Meeting Card */}
            {activeMeeting && (
              <div className="p-3 rounded-2xl bg-white shadow-xs border border-slate-200 space-y-2.5">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                  {activeMeeting.meetingType.replace('_', ' ')}
                </span>
                <h4 className="font-black text-xs text-slate-900 leading-snug">
                  {activeMeeting.title}
                </h4>

                <div className="space-y-1 text-[11px] text-slate-600">
                  <div>📅 <strong>तारीख:</strong> {activeMeeting.date}</div>
                  <div>⏰ <strong>वेळ:</strong> {activeMeeting.startTime} - {activeMeeting.endTime}</div>
                  <div>🏫 <strong>ठिकाण:</strong> {activeMeeting.venue}</div>
                  {activeMeeting.onlineMeetingUrl && (
                    <div className="text-blue-700 font-bold truncate">
                      🌐 <a href={activeMeeting.onlineMeetingUrl} target="_blank" rel="noreferrer">Google Meet Link</a>
                    </div>
                  )}
                </div>

                {/* RSVP Selector */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-700">आपली उपस्थिती नोंदवा (RSVP):</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('ATTENDING')}
                      className={`p-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        selectedStatus === 'ATTENDING'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      ✓ होय / Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('REQUEST_RESCHEDULE')}
                      className={`p-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        selectedStatus === 'REQUEST_RESCHEDULE'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      दुसरी वेळ द्यावी
                    </button>
                  </div>

                  <input
                    type="text"
                    value={parentNotes}
                    onChange={(e) => setParentNotes(e.target.value)}
                    placeholder="पालक सूचना / Remarks..."
                    className="w-full p-1.5 rounded-lg border border-slate-200 text-[10px] bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={handleParentConfirm}
                    className="w-full py-2 rounded-xl bg-orange-600 text-white font-extrabold text-[11px] hover:bg-orange-500 shadow-xs cursor-pointer"
                  >
                    {submitted ? '✓ RSVP पाठवले / Confirmed' : 'उपस्थिती निश्चित करा (Submit RSVP)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// SUBCOMPONENT: PRINTABLE OFFICIAL PTM CIRCULAR / NOTICE
// ==============================================================================
interface PrintableMeetingNoticeModalProps {
  meeting: ParentMeetingRecord;
  onClose: () => void;
}

const PrintableMeetingNoticeModal: React.FC<PrintableMeetingNoticeModalProps> = ({ meeting, onClose }) => {
  const inst = getInstitutionDetails(meeting.branchName);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col">
        {/* Header Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="font-bold text-xs flex items-center gap-2">
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Official Parent-Teacher Meeting Circular Letterhead</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 cursor-pointer"
            >
              Print Notice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div id="printable-ptm-circular" className="p-8 sm:p-10 space-y-6 text-slate-900 font-serif bg-white">
          {/* Institutional Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-between gap-4">
              <TrustLogo variant="crest" size="md" />
              <div className="text-center flex-1 space-y-0.5">
                <div className="text-[11px] font-sans font-bold tracking-widest text-orange-700 uppercase">
                  {inst.trustName}
                </div>
                <div className="text-[9px] font-sans text-slate-500">{inst.trustRegistration}</div>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-950 font-sans">
                  {inst.name}
                </h1>
                <div className="text-[10px] font-sans text-slate-600">
                  {inst.address}, {inst.city} - {inst.pincode} • Phone: {inst.phone}
                </div>
                <div className="text-[9px] font-sans font-bold text-slate-700">
                  {inst.affiliationNo} • {inst.udiseCode}
                </div>
              </div>
              <TrustLogo variant="emblem" size="md" />
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center space-y-1">
            <div className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white font-sans text-xs font-black uppercase tracking-wider">
              OFFICIAL PARENT-TEACHER MEETING CIRCULAR / पालक सभा परिपत्रक
            </div>
            <div className="flex items-center justify-between text-xs font-sans text-slate-600 pt-2 px-2">
              <span>Notice Ref: <strong>{meeting.meetingCode}</strong></span>
              <span>Date of Issue: <strong>{meeting.createdAt}</strong></span>
            </div>
          </div>

          {/* Circular Notice Body */}
          <div className="space-y-4 text-xs leading-relaxed text-justify">
            <p>
              <strong>प्रति, आदरणीय पालक,</strong>
            </p>
            <p>
              सस्नेह नमस्कार. आपल्या <strong>{inst.name}</strong> मधील <strong>{meeting.targetClasses.join(', ')}</strong> च्या विद्यार्थ्यांची प्रथम सत्र शैक्षणिक प्रगती, गुणपत्रिका वाटप, उपस्थिती व आगामी बोर्ड परीक्षा नियोजनाबाबत चर्चा करण्यासाठी विशेष पालक सभेचे आयोजन करण्यात आले आहे.
            </p>

            {/* Meeting Schedule Box */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-50/50 space-y-2 font-sans text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>📅 <strong>दिनांक (Date):</strong> {meeting.date}</div>
                <div>⏰ <strong>वेळ (Time):</strong> {meeting.startTime} ते {meeting.endTime}</div>
                <div className="col-span-2">🏫 <strong>ठिकाण (Venue):</strong> {meeting.venue}</div>
                {meeting.onlineMeetingUrl && (
                  <div className="col-span-2">🌐 <strong>ऑनलाईन लिंक (Online):</strong> {meeting.onlineMeetingUrl}</div>
                )}
                <div>👨‍🏫 <strong>वर्गशिक्षक / समन्वयक:</strong> {meeting.teacherInCharge}</div>
                <div>📞 <strong>संपर्क:</strong> {meeting.teacherPhone}</div>
              </div>
            </div>

            {/* Key Agenda */}
            <div className="space-y-1">
              <strong className="block text-slate-900 font-sans">सभेचे मुख्य विषय (Agenda Points):</strong>
              <ol className="list-decimal pl-5 space-y-1">
                {meeting.agenda.map((ag, i) => (
                  <li key={i}>{ag}</li>
                ))}
              </ol>
            </div>

            {meeting.notes && (
              <p className="text-[11px] text-slate-700 italic border-l-2 border-orange-600 pl-3">
                <strong>विशेष सूचना:</strong> {meeting.notes}
              </p>
            )}

            <p className="pt-2">
              सर्व पालकांनी वेळेवर उपस्थित राहून विद्यार्थ्यांच्या शैक्षणिक विकासात मोलाचे योगदान द्यावे ही नम्र विनंती.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex items-center justify-between text-xs font-sans">
            <div className="text-center">
              <div className="h-10" />
              <div className="font-bold border-t border-slate-800 pt-1">वर्गशिक्षक स्वाक्षरी</div>
              <div className="text-[10px] text-slate-500">{meeting.teacherInCharge}</div>
            </div>

            <div className="text-center">
              <div className="h-10" />
              <div className="font-bold border-t border-slate-800 pt-1">मुख्याध्यापक / प्राचार्य</div>
              <div className="text-[10px] text-slate-500">{inst.name}</div>
            </div>
          </div>

          {/* Tear-off Diary Slip */}
          <div className="pt-6 border-t-2 border-dashed border-slate-400 font-sans text-[11px] space-y-2">
            <div className="text-center font-bold text-slate-500 uppercase tracking-widest text-[9px]">
              - - - - - - - - - - - - - - - - - - - - कट करून डायरी मध्ये परत द्यावे (Tear-off Parent Acknowledgment Slip) - - - - - - - - - - - - - - - - - - - -
            </div>
            <div className="p-3 border border-slate-300 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span>विद्यार्थ्याचे नाव: ___________________________</span>
                <span>इयत्ता व तुकडी: <strong>{meeting.targetClasses[0]}</strong></span>
                <span>हजेरी क्र: ______</span>
              </div>
              <div className="flex items-center justify-between">
                <span>पालकांची उपस्थिती: [ ] होय, मी उपस्थित राहीन &nbsp;&nbsp; [ ] नाही &nbsp;&nbsp; [ ] गुगल मीट द्वारे</span>
                <span>पालकांची स्वाक्षरी: _________________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
