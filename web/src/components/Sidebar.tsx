import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  Bus,
  FileQuestion,
  Globe,
  LogOut,
  Shield,
  School,
  UtensilsCrossed,
  TrendingUp,
  FileText,
  Scan,
  Fingerprint,
  Briefcase,
  Calendar,
  Package,
  MessageSquare,
  Award,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp,
  Type,
} from 'lucide-react';
import { UserProfile } from './LoginPage';
import { FeatureFlagService } from '../utils/featureFlags';
import { FontSettingsModal } from './FontSettingsModal';
import { FontThemeService } from '../utils/fontTheme';

export type DashboardTab =
  | 'OVERVIEW'
  | 'STUDENTS'
  | 'PROGRESSION'
  | 'FEES'
  | 'ACCOUNTING'
  | 'CERTIFICATES'
  | 'EXAMS_OMR'
  | 'BIOMETRICS'
  | 'HR_PAYROLL'
  | 'TIMETABLE'
  | 'AUXILIARY'
  | 'COMMUNICATION'
  | 'ACADEMIC'
  | 'MASTERS'
  | 'FEATURE_FLAGS'
  | 'BUS'
  | 'ENQUIRIES';

export const TAB_ROUTE_MAP: Record<DashboardTab, string> = {
  OVERVIEW: '/dashboard/overview',
  STUDENTS: '/dashboard/students',
  PROGRESSION: '/dashboard/progression',
  ACCOUNTING: '/dashboard/accounting',
  FEES: '/dashboard/fees',
  HR_PAYROLL: '/dashboard/hr-payroll',
  EXAMS_OMR: '/dashboard/exams',
  CERTIFICATES: '/dashboard/certificates',
  BIOMETRICS: '/dashboard/biometrics',
  TIMETABLE: '/dashboard/timetable',
  ACADEMIC: '/dashboard/academic',
  MASTERS: '/dashboard/masters',
  FEATURE_FLAGS: '/dashboard/features',
  AUXILIARY: '/dashboard/auxiliary',
  COMMUNICATION: '/dashboard/communication',
  BUS: '/dashboard/bus',
  ENQUIRIES: '/dashboard/enquiries',
};

export const getTabFromPathname = (pathname: string): DashboardTab | null => {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (
    clean === '/dashboard/overview' ||
    clean === '/dashboard' ||
    clean === '/erp' ||
    clean === '/portal'
  ) {
    return 'OVERVIEW';
  }
  if (clean === '/dashboard/students' || clean === '/students') return 'STUDENTS';
  if (clean === '/dashboard/progression' || clean === '/progression') return 'PROGRESSION';
  if (clean === '/dashboard/accounting' || clean === '/accounting') return 'ACCOUNTING';
  if (clean === '/dashboard/fees' || clean === '/fees') return 'FEES';
  if (
    clean === '/dashboard/hr-payroll' ||
    clean === '/hr-payroll' ||
    clean === '/payroll' ||
    clean === '/hr'
  )
    return 'HR_PAYROLL';
  if (clean === '/dashboard/exams' || clean === '/exams' || clean === '/omr') return 'EXAMS_OMR';
  if (
    clean === '/dashboard/certificates' ||
    clean === '/certificates' ||
    clean === '/documents' ||
    clean === '/lc'
  )
    return 'CERTIFICATES';
  if (clean === '/dashboard/biometrics' || clean === '/biometrics' || clean === '/attendance')
    return 'BIOMETRICS';
  if (clean === '/dashboard/timetable' || clean === '/timetable') return 'TIMETABLE';
  if (clean === '/dashboard/academic' || clean === '/academic' || clean === '/kitchen-labs')
    return 'ACADEMIC';
  if (
    clean === '/dashboard/masters' ||
    clean === '/masters' ||
    clean === '/admin/masters' ||
    clean === '/academic-masters'
  )
    return 'MASTERS';
  if (
    clean === '/dashboard/features' ||
    clean === '/features' ||
    clean === '/modules' ||
    clean === '/dashboard/modules'
  )
    return 'FEATURE_FLAGS';
  if (
    clean === '/dashboard/auxiliary' ||
    clean === '/auxiliary' ||
    clean === '/hostel' ||
    clean === '/library'
  )
    return 'AUXILIARY';
  if (
    clean === '/dashboard/communication' ||
    clean === '/communication' ||
    clean === '/notices' ||
    clean === '/whatsapp'
  )
    return 'COMMUNICATION';
  if (clean === '/dashboard/bus' || clean === '/bus' || clean === '/fleet') return 'BUS';
  if (clean === '/dashboard/enquiries' || clean === '/enquiries' || clean === '/inquiries')
    return 'ENQUIRIES';

  for (const [tab, route] of Object.entries(TAB_ROUTE_MAP) as [DashboardTab, string][]) {
    if (clean === route || clean.startsWith(`${route}/`)) {
      return tab;
    }
  }

  return null;
};

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  onGoToWebsite: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onGoToWebsite,
}) => {
  const [showFontModal, setShowFontModal] = useState(false);
  const [currentFontId, setCurrentFontId] = useState(() => FontThemeService.getFontFamily());
  const [currentSizeId, setCurrentSizeId] = useState(() => FontThemeService.getFontSize());

  const isSuperadmin = currentUser.role === 'SUPERADMIN';
  const isSchoolAdmin = currentUser.role === 'BRANCH_ADMIN_SCHOOL';
  const isCollegeAdmin = currentUser.role === 'BRANCH_ADMIN_COLLEGE';
  const isTeacher = currentUser.role === 'TEACHER';
  const isAccountant = currentUser.role === 'ACCOUNTANT';
  const isStudent = currentUser.role === 'STUDENT';
  const isLeadership = isSuperadmin || isSchoolAdmin || isCollegeAdmin;

  const isMoreTab =
    activeTab === 'PROGRESSION' ||
    activeTab === 'ACCOUNTING' ||
    activeTab === 'AUXILIARY' ||
    activeTab === 'ENQUIRIES';

  const [isMoreOpen, setIsMoreOpen] = useState(isMoreTab);
  const [featureFlags, setFeatureFlags] = useState(() => FeatureFlagService.getFlags());

  useEffect(() => {
    const unsub = FeatureFlagService.subscribe((updatedFlags) => {
      setFeatureFlags({ ...updatedFlags });
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isMoreTab) {
      setIsMoreOpen(true);
    }
  }, [isMoreTab]);

  interface NavItem {
    id: DashboardTab;
    label: string;
    icon: React.ReactNode;
    show: boolean;
    group: 'MAIN' | 'ACADEMICS' | 'MORE';
  }

  const navItems: NavItem[] = [
    // 1. Primary Essential Menu
    {
      id: 'OVERVIEW',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      show: isLeadership,
      group: 'MAIN',
    },
    {
      id: 'STUDENTS',
      label: 'Students',
      icon: <Users className="w-4 h-4" />,
      show: isLeadership || isTeacher || isAccountant,
      group: 'MAIN',
    },
    {
      id: 'CERTIFICATES',
      label: 'Documents & LC',
      icon: <Award className="w-4 h-4" />,
      show: isLeadership || isTeacher || isAccountant,
      group: 'MAIN',
    },
    {
      id: 'FEES',
      label: 'Fees & Ledger',
      icon: <CreditCard className="w-4 h-4" />,
      show: isLeadership || isAccountant,
      group: 'MAIN',
    },

    // 2. Daily Academic & Campus Operations
    {
      id: 'BIOMETRICS',
      label: 'Attendance',
      icon: <Fingerprint className="w-4 h-4" />,
      show: isLeadership || isTeacher,
      group: 'ACADEMICS',
    },
    {
      id: 'TIMETABLE',
      label: 'Timetable',
      icon: <Calendar className="w-4 h-4" />,
      show: isLeadership || isTeacher || isStudent,
      group: 'ACADEMICS',
    },
    {
      id: 'EXAMS_OMR',
      label: 'Exams & OMR',
      icon: <Scan className="w-4 h-4" />,
      show: isLeadership || isTeacher,
      group: 'ACADEMICS',
    },
    {
      id: 'ACADEMIC',
      label:
        isCollegeAdmin || currentUser.branchId === 'branch-hm-01'
          ? 'Kitchen Labs'
          : 'Academics',
      icon:
        isCollegeAdmin || currentUser.branchId === 'branch-hm-01' ? (
          <UtensilsCrossed className="w-4 h-4" />
        ) : (
          <BookOpen className="w-4 h-4" />
        ),
      show: isLeadership || isTeacher || isStudent,
      group: 'ACADEMICS',
    },
    {
      id: 'MASTERS',
      label: 'Academic Masters',
      icon: <Layers className="w-4 h-4" />,
      show: isLeadership || isTeacher || isAccountant,
      group: 'ACADEMICS',
    },
    {
      id: 'HR_PAYROLL',
      label: 'Staff & Payroll',
      icon: <Briefcase className="w-4 h-4" />,
      show: isLeadership || isAccountant,
      group: 'ACADEMICS',
    },
    {
      id: 'COMMUNICATION',
      label: 'Notice Board',
      icon: <MessageSquare className="w-4 h-4" />,
      show: true,
      group: 'ACADEMICS',
    },
    {
      id: 'BUS',
      label: 'School Bus',
      icon: <Bus className="w-4 h-4" />,
      show: isSuperadmin || isSchoolAdmin,
      group: 'ACADEMICS',
    },

    // 3. Secondary / Periodic Tools (Cleanly grouped under More)
    {
      id: 'PROGRESSION',
      label: 'Annual Progression',
      icon: <TrendingUp className="w-4 h-4" />,
      show: isLeadership,
      group: 'MORE',
    },
    {
      id: 'ACCOUNTING',
      label: 'Trust Accounting',
      icon: <CreditCard className="w-4 h-4" />,
      show: isSuperadmin || isAccountant,
      group: 'MORE',
    },
    {
      id: 'AUXILIARY',
      label: 'Campus Auxiliary',
      icon: <Package className="w-4 h-4" />,
      show: isLeadership,
      group: 'MORE',
    },
    {
      id: 'ENQUIRIES',
      label: 'Admission Enquiries',
      icon: <FileQuestion className="w-4 h-4" />,
      show: isSuperadmin || isSchoolAdmin,
      group: 'MORE',
    },
  ];

  const isModuleActive = (id: DashboardTab) => featureFlags[id] !== false;

  const mainItems = navItems.filter((i) => i.show && isModuleActive(i.id) && i.group === 'MAIN');
  const academicItems = navItems.filter((i) => i.show && isModuleActive(i.id) && i.group === 'ACADEMICS');
  const moreItems = navItems.filter((i) => i.show && isModuleActive(i.id) && i.group === 'MORE');

  const renderLink = (item: NavItem) => {
    const isActive = activeTab === item.id;
    return (
      <a
        key={item.id}
        href={TAB_ROUTE_MAP[item.id]}
        onClick={(e) => {
          e.preventDefault();
          onSelectTab(item.id);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isActive
            ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/90 shadow-2xs dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        <span
          className={
            isActive
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-slate-400 dark:text-slate-500'
          }
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </a>
    );
  };

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 shrink-0 select-none overflow-hidden transition-colors">
      {/* 1. Brand Logo Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5 bg-white dark:bg-slate-900">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs shrink-0">
          <GraduationCap className="w-4.5 h-4.5" />
        </div>
        <div className="overflow-hidden">
          <div className="font-extrabold text-slate-900 dark:text-white text-xs tracking-tight truncate">
            TrustEdu ERP
          </div>
          <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
            Institutional Suite
          </div>
        </div>
      </div>

      {/* 2. Streamlined Navigation Links */}
      <div className="px-2.5 py-3 flex-1 space-y-4 overflow-y-auto">
        {/* Main Section */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1">
            Main Menu
          </div>
          {mainItems.map(renderLink)}
        </div>

        {/* Academics & Operations */}
        {academicItems.length > 0 && (
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1">
              Operations
            </div>
            {academicItems.map(renderLink)}
          </div>
        )}

        {/* More Tools (Collapsible to keep sidebar clean & uncluttered) */}
        {moreItems.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 uppercase tracking-wider rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span>More Modules ({moreItems.length})</span>
              {isMoreOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isMoreOpen && <div className="space-y-0.5 animate-fade-in">{moreItems.map(renderLink)}</div>}
          </div>
        )}
      </div>

      {/* 3. Bottom Utilities */}
      <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 space-y-0.5 bg-slate-50/60 dark:bg-slate-900/60">
        {isLeadership && (
          <a
            href="/dashboard/features"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('FEATURE_FLAGS');
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'FEATURE_FLAGS'
                ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/90 shadow-2xs dark:bg-orange-950/60 dark:text-orange-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-3.5 h-3.5 text-orange-600" />
              <span>Feature Flags</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
              Deploy
            </span>
          </a>
        )}

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoToWebsite();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Public Portal</span>
        </a>

        {/* Font & Scaling Customization Button */}
        <button
          type="button"
          onClick={() => setShowFontModal(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <span>Font & Sizing</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Aa
          </span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

        <div className="pt-2 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
          Developed by <span className="font-bold text-orange-600 dark:text-orange-400">Vishnu Software Solutions</span>
        </div>
      </div>

      <FontSettingsModal
        isOpen={showFontModal}
        onClose={() => setShowFontModal(false)}
        currentFontId={currentFontId}
        currentSizeId={currentSizeId}
        onApply={(fId, sId) => {
          setCurrentFontId(fId);
          setCurrentSizeId(sId);
        }}
      />
    </aside>
  );
};

