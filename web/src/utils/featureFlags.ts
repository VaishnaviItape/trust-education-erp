// Production Feature Flags & Module Visibility Engine
// Allows administrators to show or hide individual sidebar features and stage modules for production deployment.

import { DashboardTab } from '../components/Sidebar';

export type ProductionStatus = 'READY_PRODUCTION' | 'STAGED_BETA' | 'IN_DEVELOPMENT';

export interface FeatureModuleConfig {
  id: DashboardTab;
  name: string;
  category: 'MAIN' | 'OPERATIONS' | 'MORE';
  description: string;
  defaultEnabled: boolean;
  productionStatus: ProductionStatus;
  route: string;
  isProtected?: boolean; // Core modules that cannot be disabled to prevent total lockout
}

export const FEATURE_MODULE_REGISTRY: FeatureModuleConfig[] = [
  // 1. Core Primary Menu
  {
    id: 'OVERVIEW',
    name: 'Executive Overview',
    category: 'MAIN',
    description: 'Trust-wide executive dashboard with key academic, financial and campus metrics.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/overview',
    isProtected: true,
  },
  {
    id: 'STUDENTS',
    name: 'Students Directory & Admissions',
    category: 'MAIN',
    description: 'Comprehensive student roster, admission profiles, and school vs college segregation.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/students',
    isProtected: true,
  },
  {
    id: 'CERTIFICATES',
    name: 'Official Documents & LC Archive',
    category: 'MAIN',
    description: '3-tier document generator (LC, Bonafide, Character) and physical vault rack index.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/certificates',
  },
  {
    id: 'FEES',
    name: 'Fees & Financial Ledgers',
    category: 'MAIN',
    description: 'Student fee collection, installment ledgers, online UPI/Cash receipts, and outstanding dues.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/fees',
  },

  // 2. Daily Academic & Campus Operations
  {
    id: 'BIOMETRICS',
    name: 'Attendance & Hardware Biometrics',
    category: 'OPERATIONS',
    description: 'Student & faculty daily biometric punch sync, shift management, and RFID logs.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/biometrics',
  },
  {
    id: 'TIMETABLE',
    name: 'Timetable & Conflict Engine',
    category: 'OPERATIONS',
    description: 'Class schedule generator, teacher slot collision detector, and substitute allocation.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/timetable',
  },
  {
    id: 'EXAMS_OMR',
    name: 'Exams & OMR Computer Vision Studio',
    category: 'OPERATIONS',
    description: 'Exam scheduling, question paper generator, and automated bubble sheet OMR camera scanner.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/exams',
  },
  {
    id: 'ACADEMIC',
    name: 'Academics & Kitchen Labs',
    category: 'OPERATIONS',
    description: 'School curriculum syllabi, and College commercial kitchen lab practical batch rosters.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/academic',
  },
  {
    id: 'MASTERS',
    name: 'Academic & Global Masters Center',
    category: 'OPERATIONS',
    description: 'KakshaPlus-style centralized repository for standards, boards, mediums, subjects, and rooms.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/masters',
  },
  {
    id: 'HR_PAYROLL',
    name: 'Staff & Statutory Payroll',
    category: 'OPERATIONS',
    description: 'Staff directory, leave balance tracking, and monthly salary slips with PF/ESIC deductions.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/hr-payroll',
  },
  {
    id: 'COMMUNICATION',
    name: 'Notice Board & WhatsApp Alerts',
    category: 'OPERATIONS',
    description: 'Institutional digital notices, circulars, and automated WhatsApp parent notification queue.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/communication',
  },
  {
    id: 'BUS',
    name: 'School Bus & Live GPS Fleet',
    category: 'OPERATIONS',
    description: 'Live GPS vehicle location tracking, pickup stop checkpoints, and driver emergency hotline.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/bus',
  },

  // 3. Periodic & Auxiliary Modules
  {
    id: 'PROGRESSION',
    name: 'Annual Student Academic Progression',
    category: 'MORE',
    description: 'Year-end bulk promotion wizard, standard advancement, and pending fee carry-forward.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/progression',
  },
  {
    id: 'ACCOUNTING',
    name: 'Trust Central Double-Entry Accounting',
    category: 'MORE',
    description: 'Multi-branch cashbooks, journal entries, balance sheet audit, and fee concession vouchers.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/accounting',
  },
  {
    id: 'AUXILIARY',
    name: 'Campus Auxiliary (Hostel & Library)',
    category: 'MORE',
    description: 'Hostel room allocations, mess food subscription, and library book catalog indexing.',
    defaultEnabled: true,
    productionStatus: 'STAGED_BETA',
    route: '/dashboard/auxiliary',
  },
  {
    id: 'ENQUIRIES',
    name: 'Website Admission Inquiries',
    category: 'MORE',
    description: 'Leads received from public landing portal with admission pipeline conversion status.',
    defaultEnabled: true,
    productionStatus: 'READY_PRODUCTION',
    route: '/dashboard/enquiries',
  },
];

const STORAGE_KEY = 'trust_feature_module_flags';
const EVENT_NAME = 'trust_feature_flags_updated';

export interface FeatureFlagsMap {
  [key: string]: boolean;
}

export const FeatureFlagService = {
  // Get all flags from storage, initializing with defaults if empty
  getFlags(): FeatureFlagsMap {
    if (typeof window === 'undefined') {
      const initial: FeatureFlagsMap = {};
      FEATURE_MODULE_REGISTRY.forEach((f) => {
        initial[f.id] = f.defaultEnabled;
      });
      return initial;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial: FeatureFlagsMap = {};
        FEATURE_MODULE_REGISTRY.forEach((f) => {
          initial[f.id] = f.defaultEnabled;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      const initial: FeatureFlagsMap = {};
      FEATURE_MODULE_REGISTRY.forEach((f) => {
        initial[f.id] = f.defaultEnabled;
      });
      return initial;
    }
  },

  // Check if a specific module is enabled
  isEnabled(moduleId: DashboardTab): boolean {
    const flags = this.getFlags();
    if (flags[moduleId] !== undefined) {
      return Boolean(flags[moduleId]);
    }
    const def = FEATURE_MODULE_REGISTRY.find((f) => f.id === moduleId);
    return def ? def.defaultEnabled : true;
  },

  // Toggle a single module
  setModuleEnabled(moduleId: DashboardTab, enabled: boolean): void {
    if (typeof window === 'undefined') return;
    const flags = this.getFlags();
    // Protect core features
    const moduleConfig = FEATURE_MODULE_REGISTRY.find((f) => f.id === moduleId);
    if (moduleConfig?.isProtected && !enabled) {
      return; // Cannot disable core protected module
    }

    flags[moduleId] = enabled;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { moduleId, enabled, flags } }));
  },

  // Apply a standard preset
  applyPreset(preset: 'ALL_ENABLED' | 'PRODUCTION_STABLE' | 'SCHOOL_ONLY' | 'COLLEGE_ONLY' | 'MINIMAL_CORE'): void {
    if (typeof window === 'undefined') return;
    const flags: FeatureFlagsMap = {};

    FEATURE_MODULE_REGISTRY.forEach((f) => {
      if (f.isProtected) {
        flags[f.id] = true;
        return;
      }

      switch (preset) {
        case 'ALL_ENABLED':
          flags[f.id] = true;
          break;
        case 'PRODUCTION_STABLE':
          flags[f.id] = f.productionStatus === 'READY_PRODUCTION';
          break;
        case 'SCHOOL_ONLY':
          // School-focused modules
          flags[f.id] = [
            'OVERVIEW',
            'STUDENTS',
            'CERTIFICATES',
            'FEES',
            'BIOMETRICS',
            'TIMETABLE',
            'EXAMS_OMR',
            'MASTERS',
            'COMMUNICATION',
            'BUS',
            'PROGRESSION',
            'ENQUIRIES',
          ].includes(f.id);
          break;
        case 'COLLEGE_ONLY':
          // College-focused modules (Kitchen labs, HR, Fees, Documents)
          flags[f.id] = [
            'OVERVIEW',
            'STUDENTS',
            'CERTIFICATES',
            'FEES',
            'BIOMETRICS',
            'TIMETABLE',
            'ACADEMIC',
            'MASTERS',
            'HR_PAYROLL',
            'COMMUNICATION',
            'ACCOUNTING',
          ].includes(f.id);
          break;
        case 'MINIMAL_CORE':
          flags[f.id] = ['OVERVIEW', 'STUDENTS', 'CERTIFICATES', 'FEES', 'MASTERS'].includes(f.id);
          break;
        default:
          flags[f.id] = true;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { flags } }));
  },

  // Subscribe to changes
  subscribe(callback: (flags: FeatureFlagsMap) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = (e: any) => {
      callback(e.detail?.flags || this.getFlags());
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },

  // Reset to factory defaults
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    const initial: FeatureFlagsMap = {};
    FEATURE_MODULE_REGISTRY.forEach((f) => {
      initial[f.id] = f.defaultEnabled;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { flags: initial } }));
  },
};
