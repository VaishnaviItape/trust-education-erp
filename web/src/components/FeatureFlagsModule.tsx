import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  RotateCcw,
  Search,
  Check,
  ChevronRight,
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  Bus,
  FileQuestion,
  TrendingUp,
  Award,
  Scan,
  Fingerprint,
  Briefcase,
  Calendar,
  Package,
  MessageSquare,
  Layers,
  UtensilsCrossed,
  Info,
  Layers2,
  ExternalLink,
} from 'lucide-react';
import { DashboardTab } from './Sidebar';
import {
  FeatureFlagService,
  FEATURE_MODULE_REGISTRY,
  FeatureModuleConfig,
  FeatureFlagsMap,
} from '../utils/featureFlags';

export const FeatureFlagsModule: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlagsMap>(() => FeatureFlagService.getFlags());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState<'ALL' | 'ACTIVE' | 'HIDDEN'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to feature flag updates across other components or windows
    const unsubscribe = FeatureFlagService.subscribe((updatedFlags) => {
      setFlags({ ...updatedFlags });
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggle = (moduleId: DashboardTab, currentEnabled: boolean) => {
    const config = FEATURE_MODULE_REGISTRY.find((m) => m.id === moduleId);
    if (config?.isProtected && currentEnabled) {
      showToast(`'${config.name}' is a protected core module and cannot be disabled.`);
      return;
    }

    const nextState = !currentEnabled;
    FeatureFlagService.setModuleEnabled(moduleId, nextState);
    setFlags(FeatureFlagService.getFlags());
    showToast(`${config?.name || moduleId} is now ${nextState ? 'VISIBLE in' : 'HIDDEN from'} the sidebar.`);
  };

  const handleApplyPreset = (
    preset: 'ALL_ENABLED' | 'PRODUCTION_STABLE' | 'SCHOOL_ONLY' | 'COLLEGE_ONLY' | 'MINIMAL_CORE',
    label: string
  ) => {
    FeatureFlagService.applyPreset(preset);
    setFlags(FeatureFlagService.getFlags());
    showToast(`Preset Applied: ${label}`);
  };

  const handleReset = () => {
    if (window.confirm('Reset all feature flags to institutional default configuration?')) {
      FeatureFlagService.resetToDefaults();
      setFlags(FeatureFlagService.getFlags());
      showToast('All module visibility flags reset to default.');
    }
  };

  // Icon mapping
  const getModuleIcon = (id: DashboardTab) => {
    switch (id) {
      case 'OVERVIEW':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'STUDENTS':
        return <Users className="w-4 h-4" />;
      case 'CERTIFICATES':
        return <Award className="w-4 h-4" />;
      case 'FEES':
        return <CreditCard className="w-4 h-4" />;
      case 'BIOMETRICS':
        return <Fingerprint className="w-4 h-4" />;
      case 'TIMETABLE':
        return <Calendar className="w-4 h-4" />;
      case 'EXAMS_OMR':
        return <Scan className="w-4 h-4" />;
      case 'ACADEMIC':
        return <BookOpen className="w-4 h-4" />;
      case 'MASTERS':
        return <Layers className="w-4 h-4" />;
      case 'HR_PAYROLL':
        return <Briefcase className="w-4 h-4" />;
      case 'COMMUNICATION':
        return <MessageSquare className="w-4 h-4" />;
      case 'BUS':
        return <Bus className="w-4 h-4" />;
      case 'PROGRESSION':
        return <TrendingUp className="w-4 h-4" />;
      case 'ACCOUNTING':
        return <CreditCard className="w-4 h-4" />;
      case 'AUXILIARY':
        return <Package className="w-4 h-4" />;
      case 'ENQUIRIES':
        return <FileQuestion className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  // Calculated Stats
  const totalModules = FEATURE_MODULE_REGISTRY.length;
  const activeCount = useMemo(() => {
    return FEATURE_MODULE_REGISTRY.filter((m) => flags[m.id] !== false).length;
  }, [flags]);
  const hiddenCount = totalModules - activeCount;

  // Filtered List
  const filteredModules = useMemo(() => {
    return FEATURE_MODULE_REGISTRY.filter((m) => {
      const isEnabled = flags[m.id] !== false;
      if (filterView === 'ACTIVE' && !isEnabled) return false;
      if (filterView === 'HIDDEN' && isEnabled) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.route.toLowerCase().includes(q)
      );
    });
  }, [flags, filterView, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Card with Live Status */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Production Feature Flags & Module Visibility Control
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  Deploy Manager
                </span>
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Hide incomplete or unneeded features from the navigation sidebar for production rollout, or enable full experimental suites.
              </p>
            </div>
          </div>
        </div>

        {/* Global Reset Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset flags to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Presets Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Quick Deployment Presets:</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Click to apply an instant module visibility profile
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('ALL_ENABLED', 'Full Suite (All 16 Enabled)')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-all cursor-pointer"
          >
            Full Enterprise Suite (16 Active)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('PRODUCTION_STABLE', 'Production Stable Only')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Production Stable Only
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('SCHOOL_ONLY', 'Modern Public School Essentials')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            School Essentials
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('COLLEGE_ONLY', 'Modern College Hospitality Essentials')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            College Hospitality Essentials
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('MINIMAL_CORE', 'Minimal Core Safe Mode')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Minimalist Core Mode
          </button>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search module name, route or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800 transition-all"
          />
        </div>

        {/* Visibility Filter Tabs */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterView('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterView === 'ALL'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Modules ({totalModules})
          </button>
          <button
            type="button"
            onClick={() => setFilterView('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterView === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Active in Sidebar ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterView('HIDDEN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterView === 'HIDDEN'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Hidden / Inactive ({hiddenCount})
          </button>
        </div>
      </div>

      {/* 4. Grid of Modular Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredModules.map((module) => {
          const isEnabled = flags[module.id] !== false;
          return (
            <div
              key={module.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                isEnabled
                  ? 'border-slate-200/90 hover:border-orange-200'
                  : 'border-slate-200/60 opacity-80 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Card Top Row: Icon, Name & Toggle Switch */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        isEnabled
                          ? 'bg-orange-50 text-orange-600 border border-orange-200/80 shadow-2xs'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {getModuleIcon(module.id)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {module.name}
                      </h3>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        {module.route}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(module.id, isEnabled)}
                    disabled={module.isProtected}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      module.isProtected
                        ? 'opacity-60 cursor-not-allowed bg-orange-600'
                        : isEnabled
                        ? 'bg-orange-600'
                        : 'bg-slate-300'
                    }`}
                    title={
                      module.isProtected
                        ? 'Core system module (cannot be disabled)'
                        : isEnabled
                        ? 'Click to hide this module from sidebar'
                        : 'Click to make this module visible in sidebar'
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Module Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {module.description}
                </p>
              </div>

              {/* Card Footer: Category, Readiness & Status Pill */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                    {module.category === 'MAIN'
                      ? 'Main Menu'
                      : module.category === 'OPERATIONS'
                      ? 'Operations'
                      : 'More Drawer'}
                  </span>
                  {module.isProtected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] border border-amber-200">
                      <Shield className="w-3 h-3 text-amber-600" />
                      Core Protected
                    </span>
                  )}
                </div>

                <div>
                  {isEnabled ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                      <Eye className="w-3 h-3 text-emerald-600" />
                      Live in Sidebar
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[10px]">
                      <EyeOff className="w-3 h-3 text-slate-400" />
                      Hidden from Sidebar
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Production Notice Box */}
      <div className="bg-orange-50/70 border border-orange-200/90 rounded-3xl p-5 text-xs text-orange-900 space-y-2">
        <div className="font-extrabold flex items-center gap-2 text-orange-800 text-sm">
          <Info className="w-4 h-4 text-orange-600" />
          <span>How Module Visibility Works in Production</span>
        </div>
        <p className="leading-relaxed text-orange-800/90">
          When a module is toggled <strong>Hidden</strong>, it is immediately removed from the navigation sidebar for all faculty, teachers, students and branch operators. Institutional Superadmins can still access any module for testing by clicking its direct route, ensuring seamless staging prior to full institutional launch.
        </p>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slide-up border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
