import React from 'react';
import { GraduationCap, Lock, Globe, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onGoToPortal: () => void;
  isLoggedIn: boolean;
  onGoToDashboard?: () => void;
  onGoToWebsite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoToPortal,
  isLoggedIn,
  onGoToDashboard,
  onGoToWebsite,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={onGoToWebsite}
            className="flex items-center gap-3 cursor-pointer select-none"
            title="Go to Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                Zep Foundation Bhose
                <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                  Est. 2005
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Modern Public School & Jr College Bhose &bull; Modern College of HM & Tech Solapur
              </p>
            </div>
          </div>

          {/* Center Links (Public Website) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-orange-600 transition-colors">
              About Trust
            </a>
            <a href="#campuses" className="hover:text-orange-600 transition-colors">
              Two Campuses
            </a>
            <a href="#admissions-form" className="hover:text-orange-600 transition-colors">
              Admissions 2026-27
            </a>
            <a href="#contact" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-orange-500" />
              Contact
            </a>
          </nav>

          {/* Right Portal Sign In CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onGoToPortal}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all transform hover:-translate-y-0.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-200" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
