import React, { useState } from 'react';
import { Globe, Lock, ArrowRight, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';

interface DemoDomainBarProps {
  currentUrl: string;
  onNavigateUrl: (url: string) => void;
  isLoggedIn: boolean;
  currentUserRole?: string;
  onLogout: () => void;
}

export const DemoDomainBar: React.FC<DemoDomainBarProps> = ({
  currentUrl,
  onNavigateUrl,
  isLoggedIn,
  currentUserRole,
  onLogout,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    onNavigateUrl(target);
  };

  const isErpDomain = currentUrl.includes('erp.zepfoundationbhose.org') || currentUrl.includes('erp.abceducationtrust.org') || currentUrl.includes('/erp');

  return (
    <div className="bg-white text-slate-700 border-b border-slate-200/90 text-xs py-2 px-3 sm:px-6 shadow-xs z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Domain Switching Quick Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            Domain Route:
          </span>

          <button
            onClick={() => {
              setInputUrl('https://zepfoundationbhose.org');
              onNavigateUrl('https://zepfoundationbhose.org');
            }}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              !isErpDomain
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <span>zepfoundationbhose.org</span>
            <span className="text-[10px] opacity-80">(Landing Page)</span>
          </button>

          <button
            onClick={() => {
              setInputUrl('https://erp.zepfoundationbhose.org');
              onNavigateUrl('https://erp.zepfoundationbhose.org');
            }}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              isErpDomain
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Lock className="w-3 h-3 text-white" />
            <span>erp.zepfoundationbhose.org</span>
            <span className="text-[10px] opacity-80">(ERP Portal)</span>
          </button>
        </div>

        {/* Center: Simulated Realistic Browser Address Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-lg w-full flex items-center">
          <div className="relative w-full flex items-center bg-slate-50 rounded-lg border border-slate-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all px-2.5 py-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Type https://zepfoundationbhose.org or https://erp.zepfoundationbhose.org"
              className="bg-transparent text-slate-800 text-xs w-full focus:outline-none font-mono placeholder-slate-400"
            />
            <button
              type="submit"
              title="Navigate to URL"
              className="p-1 hover:text-orange-600 transition-colors ml-1 text-slate-500"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right: Auth Status Indicator */}
        <div className="flex items-center gap-2 text-[11px]">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {currentUserRole === 'SUPERADMIN'
                  ? 'Superadmin (Trustee)'
                  : currentUserRole === 'BRANCH_ADMIN_SCHOOL'
                  ? 'Branch Admin (School)'
                  : 'Branch Admin (College)'}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-500 hover:text-red-600 hover:underline transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {isErpDomain ? 'Authentication Required' : 'Public Visitor Mode'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
