import React, { useEffect, useState } from 'react';

import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  Bus,
  FileQuestion,
  Globe,
  LogOut,
  UtensilsCrossed,
  TrendingUp,
  FileText,
  Scan,
  Fingerprint,
  Briefcase,
  Calendar,
  Package,
  Award,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp,
  Type,
  Sparkles,
  Compass,
  IdCard,
  X,
} from 'lucide-react';

import { UserProfile } from './LoginPage';
import { FeatureFlagService } from '../utils/featureFlags';
import { FontSettingsModal } from './FontSettingsModal';
import { TrustLogo } from './TrustLogo';
import { FontThemeService } from '../utils/fontTheme';

/* =========================================================
   DASHBOARD TABS
========================================================= */

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
  | 'TRIPS'
  | 'ENQUIRIES'
  | 'ID_CARDS'
  | 'REPORTS';

/* =========================================================
   TAB ROUTES
========================================================= */

export const TAB_ROUTE_MAP: Record<DashboardTab, string> = {
  OVERVIEW: '/dashboard/overview',
  STUDENTS: '/dashboard/students',
  PROGRESSION: '/dashboard/progression',
  ACCOUNTING: '/dashboard/accounting',
  FEES: '/dashboard/fees',
  HR_PAYROLL: '/dashboard/hr-payroll',
  EXAMS_OMR: '/dashboard/exams',
  CERTIFICATES: '/dashboard/certificates',
  ID_CARDS: '/dashboard/id-cards',
  BIOMETRICS: '/dashboard/biometrics',
  TIMETABLE: '/dashboard/timetable',
  ACADEMIC: '/dashboard/academic',
  MASTERS: '/dashboard/masters',
  FEATURE_FLAGS: '/dashboard/features',
  AUXILIARY: '/dashboard/auxiliary',
  COMMUNICATION: '/dashboard/communication',
  BUS: '/dashboard/bus',
  TRIPS: '/dashboard/trips',
  ENQUIRIES: '/dashboard/enquiries',
  REPORTS: '/dashboard/reports',
};

/* =========================================================
   GET TAB FROM URL
========================================================= */

export const getTabFromPathname = (
  pathname: string
): DashboardTab | null => {
  const clean =
    pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (
    clean === '/dashboard/reports' ||
    clean === '/reports' ||
    clean === '/analytics'
  ) {
    return 'REPORTS';
  }

  if (
    clean === '/dashboard/overview' ||
    clean === '/dashboard' ||
    clean === '/erp' ||
    clean === '/portal'
  ) {
    return 'OVERVIEW';
  }

  if (
    clean === '/dashboard/students' ||
    clean === '/students'
  ) {
    return 'STUDENTS';
  }

  if (
    clean === '/dashboard/progression' ||
    clean === '/progression'
  ) {
    return 'PROGRESSION';
  }

  if (
    clean === '/dashboard/accounting' ||
    clean === '/accounting'
  ) {
    return 'ACCOUNTING';
  }

  if (
    clean === '/dashboard/fees' ||
    clean === '/fees'
  ) {
    return 'FEES';
  }

  if (
    clean === '/dashboard/hr-payroll' ||
    clean === '/hr-payroll' ||
    clean === '/payroll' ||
    clean === '/hr'
  ) {
    return 'HR_PAYROLL';
  }

  if (
    clean === '/dashboard/exams' ||
    clean === '/exams' ||
    clean === '/omr'
  ) {
    return 'EXAMS_OMR';
  }

  if (
    clean === '/dashboard/certificates' ||
    clean === '/certificates' ||
    clean === '/documents' ||
    clean === '/lc'
  ) {
    return 'CERTIFICATES';
  }

  if (
    clean === '/dashboard/id-cards' ||
    clean === '/id-cards' ||
    clean === '/idcards' ||
    clean === '/cards' ||
    clean === '/id-card'
  ) {
    return 'ID_CARDS';
  }

  if (
    clean === '/dashboard/biometrics' ||
    clean === '/biometrics' ||
    clean === '/attendance'
  ) {
    return 'BIOMETRICS';
  }

  if (
    clean === '/dashboard/timetable' ||
    clean === '/timetable'
  ) {
    return 'TIMETABLE';
  }

  if (
    clean === '/dashboard/academic' ||
    clean === '/academic' ||
    clean === '/kitchen-labs'
  ) {
    return 'ACADEMIC';
  }

  if (
    clean === '/dashboard/masters' ||
    clean === '/masters' ||
    clean === '/admin/masters' ||
    clean === '/academic-masters'
  ) {
    return 'MASTERS';
  }

  if (
    clean === '/dashboard/features' ||
    clean === '/features' ||
    clean === '/modules' ||
    clean === '/dashboard/modules'
  ) {
    return 'FEATURE_FLAGS';
  }

  if (
    clean === '/dashboard/auxiliary' ||
    clean === '/auxiliary' ||
    clean === '/hostel' ||
    clean === '/library'
  ) {
    return 'AUXILIARY';
  }

  if (
    clean === '/dashboard/communication' ||
    clean === '/communication' ||
    clean === '/notices' ||
    clean === '/whatsapp' ||
    clean === '/dashboard/parent-meetings' ||
    clean === '/parent-meetings' ||
    clean === '/ptm'
  ) {
    return 'COMMUNICATION';
  }

  if (
    clean === '/dashboard/bus' ||
    clean === '/bus' ||
    clean === '/fleet'
  ) {
    return 'BUS';
  }

  if (
    clean === '/dashboard/trips' ||
    clean === '/trips' ||
    clean === '/tours' ||
    clean === '/excursions'
  ) {
    return 'TRIPS';
  }

  if (
    clean === '/dashboard/enquiries' ||
    clean === '/enquiries' ||
    clean === '/inquiries'
  ) {
    return 'ENQUIRIES';
  }

  for (const [tab, route] of Object.entries(
    TAB_ROUTE_MAP
  ) as [DashboardTab, string][]) {
    if (
      clean === route ||
      clean.startsWith(`${route}/`)
    ) {
      return tab;
    }
  }

  return null;
};

/* =========================================================
   SIDEBAR PROPS
========================================================= */

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  onGoToWebsite: () => void;
  trustName?: string;
  newEnquiriesCount?: number;
  onCloseMobile?: () => void;
}

/* =========================================================
   SIDEBAR COMPONENT
========================================================= */

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onGoToWebsite,
  trustName = 'Zep Foundation',
  newEnquiriesCount,
  onCloseMobile,
}) => {
  /* ---------------------------------------------------------
     FONT SETTINGS
  --------------------------------------------------------- */

  const [showFontModal, setShowFontModal] =
    useState(false);

  const [currentFontId, setCurrentFontId] =
    useState(() =>
      FontThemeService.getFontFamily()
    );

  const [currentSizeId, setCurrentSizeId] =
    useState(() =>
      FontThemeService.getFontSize()
    );

  /* ---------------------------------------------------------
     USER ROLES
  --------------------------------------------------------- */

  const isSuperadmin =
    currentUser.role === 'SUPERADMIN';

  const isSchoolAdmin =
    currentUser.role === 'BRANCH_ADMIN_SCHOOL';

  const isCollegeAdmin =
    currentUser.role === 'BRANCH_ADMIN_COLLEGE';

  const isTeacher =
    currentUser.role === 'TEACHER';

  const isAccountant =
    currentUser.role === 'ACCOUNTANT';

  const isStudent =
    currentUser.role === 'STUDENT';

  const isLeadership =
    isSuperadmin ||
    isSchoolAdmin ||
    isCollegeAdmin;

  /* ---------------------------------------------------------
     MORE MODULE STATE
  --------------------------------------------------------- */

  const isMoreTab =
    activeTab === 'PROGRESSION' ||
    activeTab === 'ACCOUNTING' ||
    activeTab === 'AUXILIARY';

  const [isMoreOpen, setIsMoreOpen] =
    useState(isMoreTab);

  /* ---------------------------------------------------------
     FEATURE FLAGS
  --------------------------------------------------------- */

  const [featureFlags, setFeatureFlags] =
    useState(() =>
      FeatureFlagService.getFlags()
    );

  useEffect(() => {
    const unsub =
      FeatureFlagService.subscribe(
        (updatedFlags) => {
          setFeatureFlags({
            ...updatedFlags,
          });
        }
      );

    return () => unsub();
  }, []);

  useEffect(() => {
    if (isMoreTab) {
      setIsMoreOpen(true);
    }
  }, [isMoreTab]);

  /* =========================================================
     NAV ITEM TYPE
  ========================================================= */

  interface NavItem {
    id: DashboardTab;
    label: string;
    icon: React.ReactNode;
    show: boolean;
    group:
      | 'SYSTEM'
      | 'MAIN'
      | 'OPERATIONS'
      | 'MORE';
    badge?: string | number;
  }

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const navItems: NavItem[] = [
    /* =====================================================
       1. SYSTEM CONFIGURATION
    ===================================================== */

    {
      id: 'MASTERS',
      label: 'System Masters',
      badge: '27 Masters',
      icon: (
        <Layers className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher ||
        isAccountant,
      group: 'SYSTEM',
    },

    /* =====================================================
       2. MAIN
    ===================================================== */

    {
      id: 'OVERVIEW',
      label: 'Overview',
      icon: (
        <LayoutDashboard className="w-4 h-4" />
      ),
      show: isLeadership,
      group: 'MAIN',
    },

    {
      id: 'STUDENTS',
      label: 'Students',
      icon: (
        <Users className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher ||
        isAccountant,
      group: 'MAIN',
    },

    /* =====================================================
       3. DAILY OPERATIONS
    ===================================================== */

    {
      id: 'BIOMETRICS',
      label: 'Attendance',
      icon: (
        <Fingerprint className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher,
      group: 'OPERATIONS',
    },

    {
      id: 'TIMETABLE',
      label: 'Timetable',
      icon: (
        <Calendar className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher ||
        isStudent,
      group: 'OPERATIONS',
    },

    {
      id: 'ACADEMIC',

      label:
        isCollegeAdmin ||
        currentUser.branchId ===
          'branch-hm-01'
          ? 'Kitchen Labs'
          : 'Academics',

      icon:
        isCollegeAdmin ||
        currentUser.branchId ===
          'branch-hm-01' ? (
          <UtensilsCrossed className="w-4 h-4" />
        ) : (
          <BookOpen className="w-4 h-4" />
        ),

      show:
        isLeadership ||
        isTeacher ||
        isStudent,

      group: 'OPERATIONS',
    },

    {
      id: 'EXAMS_OMR',
      label: 'Exams & OMR',
      icon: (
        <Scan className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher,
      group: 'OPERATIONS',
    },

    {
      id: 'FEES',
      label: 'Fees & Ledger',
      icon: (
        <CreditCard className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isAccountant,
      group: 'OPERATIONS',
    },

    {
      id: 'CERTIFICATES',
      label: 'Documents & LC',
      icon: (
        <Award className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher ||
        isAccountant,
      group: 'OPERATIONS',
    },

    {
      id: 'ID_CARDS',
      label: 'ID Cards',
      icon: (
        <IdCard className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isTeacher ||
        isAccountant,
      group: 'OPERATIONS',
    },

    {
      id: 'HR_PAYROLL',
      label: 'Staff & Payroll',
      icon: (
        <Briefcase className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isAccountant,
      group: 'OPERATIONS',
    },

    {
      id: 'COMMUNICATION',
      label: 'Events & Notices',
      icon: (
        <Sparkles className="w-4 h-4" />
      ),
      show: true,
      group: 'OPERATIONS',
    },

    {
      id: 'BUS',
      label: 'School Bus',
      icon: (
        <Bus className="w-4 h-4" />
      ),
      show:
        isSuperadmin ||
        isSchoolAdmin,
      group: 'OPERATIONS',
    },

    {
      id: 'TRIPS',
      label: 'Trips & Tours',
      icon: (
        <Compass className="w-4 h-4" />
      ),
      show: true,
      group: 'OPERATIONS',
    },

    {
      id: 'REPORTS',
      label: 'Reports Center',
      icon: (
        <FileText className="w-4 h-4" />
      ),
      show:
        isLeadership ||
        isAccountant,
      group: 'OPERATIONS',
      badge: 'Audit',
    },

    {
      id: 'ENQUIRIES',
      label: 'Admission Enquiries',
      icon: (
        <FileQuestion className="w-4 h-4" />
      ),
      show:
        isSuperadmin ||
        isSchoolAdmin,
      group: 'OPERATIONS',

      badge:
        newEnquiriesCount &&
        newEnquiriesCount > 0
          ? `${newEnquiriesCount} New`
          : undefined,
    },

    /* =====================================================
       4. MORE MODULES
    ===================================================== */

    {
      id: 'PROGRESSION',
      label: 'Annual Progression',
      icon: (
        <TrendingUp className="w-4 h-4" />
      ),
      show: isLeadership,
      group: 'MORE',
    },

    {
      id: 'ACCOUNTING',
      label: 'Trust Accounting',
      icon: (
        <CreditCard className="w-4 h-4" />
      ),
      show:
        isSuperadmin ||
        isAccountant,
      group: 'MORE',
    },

    {
      id: 'AUXILIARY',
      label: 'Campus Auxiliary',
      icon: (
        <Package className="w-4 h-4" />
      ),
      show: isLeadership,
      group: 'MORE',
    },
  ];

  /* =========================================================
     FILTER ENABLED MODULES
  ========================================================= */

  const isModuleActive = (
    id: DashboardTab
  ) => featureFlags[id] !== false;

  const systemItems = navItems.filter(
    (item) =>
      item.show &&
      isModuleActive(item.id) &&
      item.group === 'SYSTEM'
  );

  const mainItems = navItems.filter(
    (item) =>
      item.show &&
      isModuleActive(item.id) &&
      item.group === 'MAIN'
  );

  const operationItems =
    navItems.filter(
      (item) =>
        item.show &&
        isModuleActive(item.id) &&
        item.group === 'OPERATIONS'
    );

  const moreItems = navItems.filter(
    (item) =>
      item.show &&
      isModuleActive(item.id) &&
      item.group === 'MORE'
  );

  /* =========================================================
     NAVIGATION LINK
  ========================================================= */

  const renderLink = (
    item: NavItem
  ) => {
    const isActive =
      activeTab === item.id;

    return (
      <a
        key={item.id}
        href={TAB_ROUTE_MAP[item.id]}
        onClick={(e) => {
          e.preventDefault();

          onSelectTab(item.id);

          if (onCloseMobile) {
            onCloseMobile();
          }
        }}
        className={`
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2
          rounded-xl
          text-xs
          font-semibold
          transition-all
          cursor-pointer
          relative
          group
          ${
            isActive
              ? `
                bg-orange-50
                text-orange-700
                font-bold
                border
                border-orange-200
                shadow-sm
                dark:bg-orange-950/60
                dark:text-orange-300
                dark:border-orange-800/60
              `
              : `
                text-slate-600
                hover:text-slate-900
                hover:bg-slate-100/80
                dark:text-slate-400
                dark:hover:text-slate-100
                dark:hover:bg-slate-800/60
              `
          }
        `}
      >
        {/* Active left border */}

        {isActive && (
          <span
            className="
              absolute
              left-0
              top-1.5
              bottom-1.5
              w-1
              bg-orange-600
              dark:bg-orange-500
              rounded-r-full
            "
          />
        )}

        {/* Icon */}

        <span
          className={`
            shrink-0
            transition-colors
            ${
              isActive
                ? `
                  text-orange-600
                  dark:text-orange-400
                `
                : `
                  text-slate-400
                  dark:text-slate-500
                  group-hover:text-slate-600
                  dark:group-hover:text-slate-300
                `
            }
          `}
        >
          {item.icon}
        </span>

        {/* Label */}

        <span className="truncate flex-1">
          {item.label}
        </span>

        {/* Badge */}

        {item.badge && (
          <span
            className={`
              text-[10px]
              font-bold
              px-1.5
              py-0.5
              rounded-full
              shrink-0
              ${
                item.badge === 'Audit'
                  ? `
                    bg-amber-100
                    text-amber-800
                    border
                    border-amber-200
                    dark:bg-amber-950
                    dark:text-amber-300
                  `
                  : item.badge ===
                    '27 Masters'
                  ? `
                    bg-orange-50
                    text-orange-700
                    border
                    border-orange-200
                    dark:bg-orange-950
                    dark:text-orange-300
                  `
                  : `
                    bg-rose-500
                    text-white
                  `
              }
            `}
          >
            {item.badge}
          </span>
        )}
      </a>
    );
  };

  /* =========================================================
     SIDEBAR UI
  ========================================================= */

  return (
    <aside
      className="
        w-64
        bg-white
        dark:bg-slate-900
        text-slate-800
        dark:text-slate-100
        flex
        flex-col
        h-full
        border-r
        border-slate-200
        dark:border-slate-800
        shrink-0
        select-none
        overflow-hidden
        transition-colors
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          p-3
          border-b
          border-slate-100
          dark:border-slate-800
          flex
          items-center
          justify-between
          gap-2
          bg-white
          dark:bg-slate-900
          shrink-0
        "
      >
        <div className="flex items-center gap-2 min-w-0">
          <TrustLogo
            variant="horizontal"
            size="sm"
            showSubtitle={true}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Font settings */}

          <button
            type="button"
            onClick={() =>
              setShowFontModal(true)
            }
            title="Adjust Font Family & Interface Text Size"
            aria-label="Customize Font Family and Size"
            className="
              p-1.5
              rounded-lg
              border
              border-slate-200
              dark:border-slate-700
              hover:border-orange-400
              hover:bg-orange-50
              dark:hover:bg-slate-800
              text-slate-500
              hover:text-orange-600
              dark:text-slate-400
              transition-colors
              cursor-pointer
            "
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {/* Mobile close */}

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              title="Close Sidebar"
              className="
                lg:hidden
                p-1.5
                rounded-lg
                border
                border-slate-200
                dark:border-slate-700
                text-slate-500
                hover:text-slate-800
                dark:text-slate-300
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition-colors
                cursor-pointer
              "
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div
        className="
          px-2.5
          py-2.5
          flex-1
          min-h-0
          overflow-y-auto
          space-y-4
        "
      >
        {/* =================================================
            SYSTEM MASTERS
        ================================================= */}

        {systemItems.length > 0 && (
          <div className="space-y-1">
            <div
              className="
                text-[10px]
                font-bold
                text-orange-600
                dark:text-orange-400
                uppercase
                tracking-wider
                px-3
                mb-1
              "
            >
              System
            </div>

            {systemItems.map(
              renderLink
            )}
          </div>
        )}

        {/* =================================================
            MAIN MENU
        ================================================= */}

        {mainItems.length > 0 && (
          <div className="space-y-0.5">
            <div
              className="
                text-[10px]
                font-bold
                text-slate-400
                dark:text-slate-500
                uppercase
                tracking-wider
                px-3
                mb-1
              "
            >
              Main Menu
            </div>

            {mainItems.map(renderLink)}
          </div>
        )}

        {/* =================================================
            OPERATIONS
        ================================================= */}

        {operationItems.length > 0 && (
          <div className="space-y-0.5">
            <div
              className="
                text-[10px]
                font-bold
                text-slate-400
                dark:text-slate-500
                uppercase
                tracking-wider
                px-3
                mb-1
              "
            >
              Operations
            </div>

            {operationItems.map(
              renderLink
            )}
          </div>
        )}

        {/* =================================================
            MORE MODULES
        ================================================= */}

        {moreItems.length > 0 && (
          <div
            className="
              space-y-1
              pt-2
              border-t
              border-slate-100
              dark:border-slate-800/80
            "
          >
            <button
              type="button"
              onClick={() =>
                setIsMoreOpen(
                  !isMoreOpen
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-3
                py-1.5
                text-[11px]
                font-bold
                text-slate-400
                hover:text-slate-600
                dark:text-slate-500
                dark:hover:text-slate-300
                uppercase
                tracking-wider
                rounded-lg
                hover:bg-slate-50
                dark:hover:bg-slate-800/40
                transition-colors
              "
            >
              <span>
                More Modules (
                {moreItems.length})
              </span>

              {isMoreOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {isMoreOpen && (
              <div className="space-y-0.5">
                {moreItems.map(
                  renderLink
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          BOTTOM UTILITIES
      ===================================================== */}

      <div
        className="
          p-2.5
          border-t
          border-slate-100
          dark:border-slate-800
          space-y-1
          bg-slate-50/80
          dark:bg-slate-900/80
          shrink-0
        "
      >
        {/* FEATURE FLAGS */}

        {isLeadership && (
          <a
            href="/dashboard/features"
            onClick={(e) => {
              e.preventDefault();

              onSelectTab(
                'FEATURE_FLAGS'
              );

              if (onCloseMobile) {
                onCloseMobile();
              }
            }}
            className={`
              w-full
              flex
              items-center
              justify-between
              px-3
              py-1.5
              rounded-xl
              text-xs
              font-semibold
              transition-colors
              cursor-pointer
              ${
                activeTab ===
                'FEATURE_FLAGS'
                  ? `
                    bg-orange-50
                    text-orange-700
                    font-bold
                    border
                    border-orange-200
                    dark:bg-orange-950/60
                    dark:text-orange-300
                  `
                  : `
                    text-slate-600
                    hover:text-slate-900
                    hover:bg-slate-100
                    dark:text-slate-400
                    dark:hover:text-slate-100
                    dark:hover:bg-slate-800
                  `
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-3.5 h-3.5 text-orange-600" />

              <span>
                Feature Flags
              </span>
            </div>

            <span
              className="
                text-[10px]
                font-bold
                px-1.5
                py-0.5
                rounded-md
                bg-orange-100
                text-orange-800
                dark:bg-orange-950
                dark:text-orange-300
              "
            >
              Deploy
            </span>
          </a>
        )}

        {/* PUBLIC WEBSITE */}

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoToWebsite();

            if (onCloseMobile) {
              onCloseMobile();
            }
          }}
          className="
            w-full
            flex
            items-center
            gap-2.5
            px-3
            py-1.5
            rounded-xl
            text-xs
            font-semibold
            text-slate-600
            hover:text-slate-900
            hover:bg-slate-100
            dark:text-slate-300
            dark:hover:text-white
            dark:hover:bg-slate-800
            transition-colors
            cursor-pointer
          "
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />

          <span>
            Public Portal
          </span>
        </a>

        {/* FONT SETTINGS */}

        <button
          type="button"
          onClick={() =>
            setShowFontModal(true)
          }
          title="Adjust Font Family & Interface Text Size"
          className="
            w-full
            flex
            items-center
            justify-between
            px-3
            py-1.5
            rounded-xl
            text-xs
            font-semibold
            text-slate-700
            hover:text-orange-700
            hover:bg-orange-50
            dark:text-slate-300
            dark:hover:text-white
            dark:hover:bg-slate-800
            transition-colors
            cursor-pointer
          "
        >
          <div className="flex items-center gap-2.5">
            <Type className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />

            <span className="font-bold">
              Font & Sizing
            </span>
          </div>

          <span
            className="
              text-[10px]
              font-bold
              px-1.5
              py-0.5
              rounded-md
              bg-orange-100
              text-orange-800
              dark:bg-orange-950
              dark:text-orange-300
            "
          >
            {FontThemeService.getScalePercent()}
            %
          </span>
        </button>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={onLogout}
          className="
            w-full
            flex
            items-center
            gap-2.5
            px-3
            py-1.5
            rounded-xl
            text-xs
            font-semibold
            text-rose-600
            hover:text-rose-700
            hover:bg-rose-50
            dark:text-rose-400
            dark:hover:text-rose-300
            dark:hover:bg-rose-950/30
            transition-colors
            cursor-pointer
          "
        >
          <LogOut className="w-3.5 h-3.5" />

          <span>
            Sign Out
          </span>
        </button>

        {/* DEVELOPER */}

        <div
          className="
            pt-2
            text-center
            text-[10px]
            text-slate-400
            dark:text-slate-500
            border-t
            border-slate-100
            dark:border-slate-800/80
          "
        >
          Developed by{' '}

          <span className="font-bold text-orange-600 dark:text-orange-400">
            Vishnu Software Solutions
          </span>
        </div>
      </div>

      {/* =====================================================
          FONT SETTINGS MODAL
      ===================================================== */}

      <FontSettingsModal
        isOpen={showFontModal}
        onClose={() =>
          setShowFontModal(false)
        }
        currentFontId={
          currentFontId
        }
        currentSizeId={
          currentSizeId
        }
        onApply={(
          fontId,
          sizeId
        ) => {
          setCurrentFontId(
            fontId
          );

          setCurrentSizeId(
            sizeId
          );
        }}
      />
    </aside>
  );
};