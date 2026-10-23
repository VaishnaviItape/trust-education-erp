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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle and Prominent Big Dropdowns */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={isSidebarVisible ? 'Collapse Sidebar' : 'Expand Sidebar'}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-600 hover:text-orange-600 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              {isSidebarVisible ? (
                <PanelLeftClose className="w-4.5 h-4.5 text-orange-600" />
              ) : (
                <PanelLeft className="w-4.5 h-4.5 text-slate-600" />
              )}
            </button>
          )}

          {/* 1. Big Trust & Branch Scope Selector */}
          <div className="relative flex items-center bg-white border-2 border-slate-200 hover:border-orange-400 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 rounded-xl px-3 py-1 shadow-2xs transition-all flex-1 max-w-[560px] min-w-[260px] sm:min-w-[420px]">
            <div className="w-8 h-8 rounded-lg bg-orange-100/90 text-orange-600 flex items-center justify-center shrink-0 mr-2.5">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none mb-0.5">
                Trust & Campus Scope
              </span>
              <select
                value={selectedBranch}
                onChange={(e) => onChangeBranch(e.target.value as any)}
                aria-label="Select Trust or Branch Scope"
                className="w-full appearance-none bg-transparent text-xs sm:text-sm font-extrabold text-slate-800 focus:outline-none cursor-pointer truncate"
              >
                <option value="ALL">🏛️ Trust: Zep Foundation (Combined - 15 Students)</option>
                <option value="SCHOOL">🏫 Branch: Modern Public School & Jr College (9 Students)</option>
                <option value="COLLEGE">🏨 Branch: Modern College of HM & Tech (6 Students)</option>
              </select>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* 2. Big Academic Year Selector */}
          <div className="relative flex items-center bg-white border-2 border-slate-200 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 rounded-xl px-3 py-1 shadow-2xs transition-all min-w-[170px] sm:min-w-[200px] shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 mr-2.5">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none mb-0.5">
                Academic Session
              </span>
              <select
                value={academicYear}
                onChange={(e) => onChangeAcademicYear(e.target.value)}
                aria-label="Select Academic Year"
                className="w-full appearance-none bg-transparent text-xs sm:text-sm font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              >
                {MasterStore.getYears().map((yr) => (
                  <option key={yr.id} value={yr.label}>
                    AY {yr.label} {yr.isCurrent ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Right: Theme Toggle, Fullscreen & Clean User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Black & White Mode (Dark / Light) Toggle Button */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light (White) Mode' : 'Switch to Dark (Black) Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
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
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-orange-600" />
              ) : (
                <Maximize className="w-4 h-4 text-slate-600 hover:text-slate-900" />
              )}
            </button>
          )}

          {/* Typography & Font Scaling Customization Button */}
          <button
            type="button"
            onClick={() => setShowFontModal(true)}
            title="Adjust Font Family & Interface Text Size"
            aria-label="Customize Font Family and Size"
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-orange-600 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Type className="w-4 h-4 text-slate-700 hover:text-orange-600" />
            <span className="hidden xl:inline text-[11px] font-bold text-slate-700">
              Font
            </span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {getInitials(currentUser.name)}
            </div>
            
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">
                {currentUser.email || 'Admin'}
              </span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ml-0.5"
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
        }}
      />
    </header>
  );
};
