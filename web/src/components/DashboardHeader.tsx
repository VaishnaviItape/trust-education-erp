import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  PanelLeft,
  PanelLeftClose,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Type,
} from 'lucide-react';
import { UserProfile } from './LoginPage';
import { MasterStore } from '../utils/masterData';
import { FontSettingsModal } from './FontSettingsModal';
import { FontThemeService } from '../utils/fontTheme';
import { TrustLogo } from './TrustLogo';

interface DashboardHeaderProps {
  currentUser: UserProfile;
  academicYear: string;
  onChangeAcademicYear: (year: string) => void;
  selectedBranch: 'ALL' | 'SCHOOL' | 'COLLEGE';
  onChangeBranch: (branch: 'ALL' | 'SCHOOL' | 'COLLEGE') => void;
  activeTabTitle?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentUser,
  academicYear,
  onChangeAcademicYear,
  selectedBranch,
  onChangeBranch,
  activeTabTitle,
  isDarkMode = false,
  onToggleDarkMode,
  isFullscreen = false,
  onToggleFullscreen,
  isSidebarVisible = true,
  onToggleSidebar,
  onLogout,
}) => {
  // Font Family and Scaling Customization Modal State
  const [showFontModal, setShowFontModal] = useState(false);
  const [currentFontId, setCurrentFontId] = useState(() => FontThemeService.getFontFamily());
  const [currentSizeId, setCurrentSizeId] = useState(() => FontThemeService.getFontSize());
  const [currentScalePercent, setCurrentScalePercent] = useState(() => FontThemeService.getScalePercent());

  // Extract clean initials (e.g. "RP" for Dr. Rajesh Patil)
  const getInitials = (fullName: string) => {
    const clean = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0] || 'U').slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-xs px-3 sm:px-5 py-2 shrink-0 z-20 overflow-x-auto erp-header-scroll min-h-[54px] flex items-center">
      <div className="flex items-center justify-between gap-3 min-w-max w-full">
        {/* Left: Sidebar Toggle and Scope Dropdowns (shrink-0 inside min-w-max ensures ZERO overlapping) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={isSidebarVisible ? 'Collapse Sidebar' : 'Expand Sidebar'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              {isSidebarVisible ? (
                <PanelLeftClose className="w-4.5 h-4.5 text-orange-600" />
              ) : (
                <PanelLeft className="w-4.5 h-4.5 text-slate-600" />
              )}
            </button>
          )}

          {/* 1. Big Trust & Branch Scope Selector */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-orange-400 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100/50 rounded-xl px-2.5 py-1 shadow-2xs transition-all w-auto max-w-[360px] shrink-0">
            <div className="shrink-0 mr-2">
              <TrustLogo variant="emblem" size="xs" />
            </div>
            <div className="flex flex-col min-w-0 pr-5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                Trust & Campus Scope
              </span>
              <select
                value={selectedBranch}
                onChange={(e) => onChangeBranch(e.target.value as any)}
                aria-label="Select Trust or Branch Scope"
                className="w-full appearance-none bg-transparent text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer truncate"
              >
                <option value="ALL">🏛️ Zep Foundation (All Campuses)</option>
                <option value="SCHOOL">🏫 Modern Public School & Jr College</option>
                <option value="COLLEGE">🏨 Modern College of Hotel Management</option>
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* 2. Big Academic Year Selector */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100/50 rounded-xl px-2.5 py-1 shadow-2xs transition-all w-auto max-w-[220px] shrink-0">
            <div className="w-7 h-7 rounded-lg bg-amber-100/90 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mr-2">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 pr-5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                Academic Session
              </span>
              <select
                value={academicYear}
                onChange={(e) => onChangeAcademicYear(e.target.value)}
                aria-label="Select Academic Year"
                className="w-full appearance-none bg-transparent text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                {MasterStore.getYears().map((yr) => (
                  <option key={yr.id} value={yr.label}>
                    AY {yr.label} {yr.isCurrent ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Theme Toggle, Fullscreen & Clean User Profile (Never clipped or pushed off) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Black & White Mode (Dark / Light) Toggle Button */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light (White) Mode' : 'Switch to Dark (Black) Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>
          )}

          {/* Fullscreen Toggle Button */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Full Screen Mode (Esc)' : 'Enter Full Screen Mode'}
              aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-orange-600" />
              ) : (
                <Maximize className="w-4 h-4 text-slate-600 hover:text-slate-900" />
              )}
            </button>
          )}

          {/* Typography & Font Scaling Customization Button - ALWAYS visible on all screen sizes */}
          <button
            type="button"
            onClick={() => setShowFontModal(true)}
            title="Adjust Font Family & Interface Text Size"
            aria-label="Customize Font Family and Size"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-orange-400 hover:bg-orange-50/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-orange-600 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Type className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
              Font
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
              {currentScalePercent}%
            </span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {getInitials(currentUser.name)}
            </div>
            
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono leading-tight truncate max-w-[130px]">
                {currentUser.email || 'Admin'}
              </span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer shrink-0 ml-0.5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Font and Text Size Customization Modal */}
      <FontSettingsModal
        isOpen={showFontModal}
        onClose={() => setShowFontModal(false)}
        currentFontId={currentFontId}
        currentSizeId={currentSizeId}
        onApply={(fId, sId) => {
          setCurrentFontId(fId);
          setCurrentSizeId(sId);
          setCurrentScalePercent(FontThemeService.getScalePercent());
        }}
      />
    </header>
  );
};
