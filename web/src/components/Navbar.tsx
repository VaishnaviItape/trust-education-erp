import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  Globe,
  Lock,
  ShieldCheck,
  ArrowRight,
  Search,
  Menu,
  X,
  FileQuestion,
  ChevronDown,
  Sparkles,
  School,
  UtensilsCrossed,
  Award,
} from 'lucide-react';
import { TrustLogo } from './TrustLogo';

interface NavbarProps {
  onGoToPortal: () => void;
  isLoggedIn: boolean;
  onGoToDashboard?: () => void;
  onGoToWebsite?: () => void;
  onGoToInquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoToPortal,
  isLoggedIn,
  onGoToDashboard,
  onGoToWebsite,
  onGoToInquiry,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [language, setLanguage] = useState<'EN' | 'MR'>('EN');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Sequential ScrollSpy: dynamically tracks which section is in view as the user scrolls
  useEffect(() => {
    const sectionIds = [
      'home',
      'campuses',
      'popular-courses',
      'upcoming-events',
      'testimonials',
      'recent-news',
      'contact-footer',
    ];

    const updateActiveSection = () => {
      const offset = 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      setActiveSection('home');
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    const container = document.getElementById('website-scroll-container');
    if (container) {
      container.addEventListener('scroll', updateActiveSection, { passive: true });
    }

    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      if (container) {
        container.removeEventListener('scroll', updateActiveSection);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveSection(id);
    if (id === 'home') {
      if (onGoToWebsite) onGoToWebsite();
      const el = document.getElementById('home');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const container = document.getElementById('website-scroll-container');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-2xl bg-[#0b101b]"
      style={{ backgroundColor: '#0b101b' }}
    >
      {/* 1. TOP UTILITY BAR (Black / Deep Slate Strip) */}
      <div
        className="bg-[#080d17] text-slate-300 text-[11px] font-medium border-b border-slate-800/80 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#080d17' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-9">
          {/* Left: Contact Info & Trust Reg */}
          <div className="flex items-center gap-4 sm:gap-6 truncate">
            <a
              href="tel:+9102172608800"
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-orange-500 shrink-0" />
              <span>+91 (0217) 260-8800</span>
            </a>
            <a
              href="mailto:admissions@zepfoundationbhose.org"
              className="hidden sm:flex items-center gap-1.5 hover:text-orange-400 transition-colors"
            >
              <Mail className="w-3 h-3 text-orange-500 shrink-0" />
              <span>admissions@zepfoundationbhose.org</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-slate-400 border-l border-slate-800 pl-4">
              <span>Reg. No:</span>
              <strong className="text-slate-300 font-mono">MH/EDU/TR-18452/SOLAPUR</strong>
            </span>
          </div>

          {/* Right: Language, Quick Portal Login & Registration Pill */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 text-[11px] text-slate-300">
              <Globe className="w-3 h-3 text-orange-500" />
              <button
                type="button"
                onClick={() => setLanguage(language === 'EN' ? 'MR' : 'EN')}
                className="hover:text-white transition-colors cursor-pointer font-bold"
                title="Toggle language"
              >
                {language === 'EN' ? 'English (EN)' : 'मराठी (MR)'}
              </button>
            </div>

            <span className="text-slate-700">|</span>

            {/* Direct Staff & Parent Login Link */}
            <button
              type="button"
              onClick={isLoggedIn ? onGoToDashboard : onGoToPortal}
              className="hover:text-orange-400 transition-colors font-bold cursor-pointer"
            >
              {isLoggedIn ? 'Dashboard' : 'Portal Login'}
            </button>

            {/* Admission Open Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admissions 2026-27</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR (Deep Institutional Charcoal Navy) */}
      <div
        className="bg-[#0c1220] border-b border-slate-800/90 text-white px-4 sm:px-6 lg:px-8 shadow-md"
        style={{ backgroundColor: '#0c1220' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px]">
          {/* Brand Logo & Name */}
          <div
            onClick={onGoToWebsite}
            className="flex items-center gap-3 cursor-pointer select-none py-1 group"
            title="Zep Foundation Bhose"
          >
            <TrustLogo variant="horizontal" size="md" theme="white" />
          </div>

          {/* Center Desktop Navigation Links (Sequential Flow) */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-bold tracking-wider uppercase text-white">
            {/* 1. HOME */}
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className={`transition-colors py-2 flex items-center gap-1 relative font-extrabold cursor-pointer tracking-wider ${
                activeSection === 'home'
                  ? 'text-orange-500'
                  : 'text-white hover:text-orange-400'
              }`}
            >
              <span>HOME</span>
              {activeSection === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* 2. OUR INSTITUTES */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('campuses')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => scrollToSection('campuses')}
                className={`transition-colors py-2 flex items-center gap-1.5 cursor-pointer font-bold tracking-wider relative ${
                  activeSection === 'campuses'
                    ? 'text-orange-500 font-extrabold'
                    : 'text-white hover:text-orange-400'
                }`}
              >
                <span>OUR INSTITUTES</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 transition-colors" />
                {activeSection === 'campuses' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>

              {activeDropdown === 'campuses' && (
                <div
                  className="absolute top-full left-0 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl animate-fade-in text-left normal-case z-50"
                  style={{ backgroundColor: '#0f172a' }}
                >
                  <button
                    type="button"
                    onClick={() => scrollToSection('campuses')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Modern Public School & Junior College</div>
                      <div className="text-[10px] text-slate-400">Bhose, Pandharpur • CBSE & State Board</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('campuses')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Modern College Of Hotel Management</div>
                      <div className="text-[10px] text-slate-400">Solapur City • B.Sc Degree & Culinary Arts</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. COURSES & DEGREES */}
            <button
              type="button"
              onClick={() => scrollToSection('popular-courses')}
              className={`transition-colors py-2 cursor-pointer font-bold tracking-wider relative ${
                activeSection === 'popular-courses'
                  ? 'text-orange-500 font-extrabold'
                  : 'text-white hover:text-orange-400'
              }`}
            >
              <span>COURSES & DEGREES</span>
              {activeSection === 'popular-courses' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* 4. EVENTS */}
            <button
              type="button"
              onClick={() => scrollToSection('upcoming-events')}
              className={`transition-colors py-2 cursor-pointer font-bold tracking-wider relative ${
                activeSection === 'upcoming-events'
                  ? 'text-orange-500 font-extrabold'
                  : 'text-white hover:text-orange-400'
              }`}
            >
              <span>EVENTS</span>
              {activeSection === 'upcoming-events' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* 5. REVIEWS */}
            <button
              type="button"
              onClick={() => scrollToSection('testimonials')}
              className={`transition-colors py-2 cursor-pointer font-bold tracking-wider relative ${
                activeSection === 'testimonials'
                  ? 'text-orange-500 font-extrabold'
                  : 'text-white hover:text-orange-400'
              }`}
            >
              <span>REVIEWS</span>
              {activeSection === 'testimonials' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* 6. NEWS */}
            <button
              type="button"
              onClick={() => scrollToSection('recent-news')}
              className={`transition-colors py-2 cursor-pointer font-bold tracking-wider relative ${
                activeSection === 'recent-news'
                  ? 'text-orange-500 font-extrabold'
                  : 'text-white hover:text-orange-400'
              }`}
            >
              <span>NEWS</span>
              {activeSection === 'recent-news' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* 7. CONTACT */}
            <button
              type="button"
              onClick={() => scrollToSection('contact-footer')}
              className={`transition-colors py-2 cursor-pointer font-bold tracking-wider relative ${
                activeSection === 'contact-footer'
                  ? 'text-orange-500 font-extrabold'
                  : 'text-white hover:text-orange-400'
              }`}
            >
              <span>CONTACT</span>
              {activeSection === 'contact-footer' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Buttons: Social, Search, Apply Now & Portal */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => scrollToSection('search-programs')}
              className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              title="Search Courses & Degrees"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Primary Orange "Apply Now" Button */}
            {onGoToInquiry ? (
              <button
                type="button"
                onClick={onGoToInquiry}
                className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>APPLY NOW</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => scrollToSection('admissions-inquiry-box')}
                className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>APPLY NOW</span>
              </button>
            )}

            {/* ERP Portal / Sign In Button */}
            <button
              type="button"
              onClick={isLoggedIn ? onGoToDashboard : onGoToPortal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              {isLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Dashboard</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">ERP Login</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Website Navigation Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
            {/* Semi-transparent Backdrop Overlay with Blur */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Sidebar Drawer Content */}
            <div
              className="relative w-80 max-w-[85vw] h-full z-10 shadow-2xl flex flex-col border-l border-slate-800 text-slate-200 animate-slide-left overflow-y-auto"
              style={{ backgroundColor: '#0c1220' }}
            >
              {/* Header: Trust Logo & Close Button */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#080d17]">
                <TrustLogo variant="horizontal" size="sm" theme="white" showSubtitle={true} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Close Sidebar Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sequential Section Links matching Navbar */}
              <div className="p-4 flex-1 space-y-1 text-xs font-bold tracking-wide overflow-y-auto">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-2">
                  Sequential Navigation
                </div>

                <button
                  type="button"
                  onClick={() => scrollToSection('home')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'home'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Home</span>
                  {activeSection === 'home' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'campuses'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Our Institutes (Bhose & Solapur)</span>
                  {activeSection === 'campuses' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('popular-courses')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'popular-courses'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Courses & Academic Degrees</span>
                  {activeSection === 'popular-courses' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('upcoming-events')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'upcoming-events'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Upcoming Events</span>
                  {activeSection === 'upcoming-events' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('testimonials')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'testimonials'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Reviews & What People Say</span>
                  {activeSection === 'testimonials' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('recent-news')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'recent-news'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Recent News</span>
                  {activeSection === 'recent-news' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('contact-footer')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    activeSection === 'contact-footer'
                      ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <span>Campus Contacts</span>
                  {activeSection === 'contact-footer' && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />}
                </button>

                {/* Admission Form Action Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('admissions-inquiry-box')}
                    className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-between shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    <span>Online Admission Form 2026-27</span>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>

              {/* Bottom Quick Contact & Portal Action */}
              <div className="p-4 border-t border-slate-800 bg-[#080d17] space-y-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isLoggedIn && onGoToDashboard) {
                      onGoToDashboard();
                    } else {
                      onGoToPortal();
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer text-xs"
                >
                  {isLoggedIn ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open ERP Dashboard</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>ERP Portal Login</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>+91 98220 00000 / +91 94220 00000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>office@zeptrust.org</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};