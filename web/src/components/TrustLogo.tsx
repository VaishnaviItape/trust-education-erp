import React from 'react';

export interface TrustLogoProps {
  variant?: 'emblem' | 'horizontal' | 'crest' | 'stacked';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  theme?: 'light' | 'dark' | 'color' | 'white';
  showSubtitle?: boolean;
}

/**
 * Official Institutional Logo for Zep Foundation Bhose (झेप फाउंडेशन भोस)
 * Symbolism:
 * - Soaring Falcon Wings (झेप - Soaring flight & boundless educational ambition)
 * - Open Book of Knowledge (विद्या व ज्ञान)
 * - Torch of Wisdom & Rising Sun (ज्ञानज्योत व उदित सूर्य)
 * - Interwoven 'Z' Monogram Core
 */
export const TrustLogo: React.FC<TrustLogoProps> = ({
  variant = 'emblem',
  size = 'md',
  className = '',
  theme = 'color',
  showSubtitle = true,
}) => {
  // Size mappings (pixel dimensions for emblem)
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 64,
    xl: 96,
    '2xl': 128,
  };

  const dim = sizeMap[size] || 40;

  // Render the pure vector SVG Emblem
  const renderEmblemSvg = () => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      role="img"
      aria-label="Zep Foundation Bhose Official Trust Logo"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="zfPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" /> {/* Deep Saffron Orange */}
          <stop offset="50%" stopColor="#F97316" /> {/* Vibrant Orange */}
          <stop offset="100%" stopColor="#D97706" /> {/* Warm Amber Gold */}
        </linearGradient>

        <linearGradient id="zfGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>

        <linearGradient id="zfFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" /> {/* Ruby Red base */}
          <stop offset="40%" stopColor="#EA580C" /> {/* Saffron */}
          <stop offset="85%" stopColor="#FBBF24" /> {/* Sun Yellow */}
          <stop offset="100%" stopColor="#FFFFFF" /> {/* Hot Tip */}
        </linearGradient>

        <linearGradient id="zfBookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <filter id="zfShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#9A3412" floodOpacity="0.25" />
        </filter>

        <filter id="zfGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Outer Concentric Medallion Rings */}
      <circle cx="100" cy="100" r="95" fill="url(#zfPrimaryGrad)" filter="url(#zfShadow)" />
      <circle cx="100" cy="100" r="88" fill="#1E293B" /> {/* Deep Institutional Navy */}
      <circle cx="100" cy="100" r="84" stroke="url(#zfGoldGrad)" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      <circle cx="100" cy="100" r="76" fill="#0F172A" />

      {/* 2. Radiant Sunrays behind the Emblem */}
      <g opacity="0.25" stroke="#FBBF24" strokeWidth="1.5">
        <line x1="100" y1="100" x2="100" y2="30" />
        <line x1="100" y1="100" x2="150" y2="50" />
        <line x1="100" y1="100" x2="168" y2="80" />
        <line x1="100" y1="100" x2="50" y2="50" />
        <line x1="100" y1="100" x2="32" y2="80" />
      </g>

      {/* 3. Soaring Falcon Wings (झेप - Soaring Ambition) */}
      {/* Left Soaring Wing */}
      <path
        d="M 100 125 
           C 75 110, 40 85, 34 50 
           C 45 62, 58 72, 72 78 
           C 55 64, 46 44, 42 32 
           C 56 46, 72 58, 88 66 
           C 72 52, 65 34, 62 22 
           C 80 40, 95 56, 100 78 Z"
        fill="url(#zfGoldGrad)"
        filter="url(#zfShadow)"
      />

      {/* Right Soaring Wing */}
      <path
        d="M 100 125 
           C 125 110, 160 85, 166 50 
           C 155 62, 142 72, 128 78 
           C 145 64, 154 44, 158 32 
           C 144 46, 128 58, 112 66 
           C 128 52, 135 34, 138 22 
           C 120 40, 105 56, 100 78 Z"
        fill="url(#zfGoldGrad)"
        filter="url(#zfShadow)"
      />

      {/* 4. Open Book of Knowledge (पाने व ज्ञान) */}
      <g filter="url(#zfShadow)">
        {/* Left Page */}
        <path
          d="M 100 148 
             C 80 138, 50 140, 36 150 
             C 42 135, 70 125, 100 134 Z"
          fill="url(#zfBookGrad)"
          stroke="#CBD5E1"
          strokeWidth="0.8"
        />
        {/* Left Page Thickness Line */}
        <path d="M 36 150 C 50 142, 80 140, 100 150" stroke="#94A3B8" strokeWidth="1" fill="none" />

        {/* Right Page */}
        <path
          d="M 100 148 
             C 120 138, 150 140, 164 150 
             C 158 135, 130 125, 100 134 Z"
          fill="url(#zfBookGrad)"
          stroke="#CBD5E1"
          strokeWidth="0.8"
        />
        {/* Right Page Thickness Line */}
        <path d="M 164 150 C 150 142, 120 140, 100 150" stroke="#94A3B8" strokeWidth="1" fill="none" />

        {/* Book Spine Center Marker */}
        <polygon points="98,133 102,133 101,154 99,154" fill="#EA580C" />
      </g>

      {/* 5. Central Eternal Flame of Wisdom (ज्ञानज्योत) */}
      <g filter="url(#zfGlow)">
        {/* Outer Flame */}
        <path
          d="M 100 60 
             C 92 75, 88 90, 93 106 
             C 95 112, 100 118, 100 118 
             C 100 118, 105 112, 107 106 
             C 112 90, 108 75, 100 60 Z"
          fill="url(#zfFlameGrad)"
        />
        {/* Inner Bright Flame Core */}
        <path
          d="M 100 78 
             C 96 88, 95 96, 97 104 
             C 98 108, 100 111, 100 111 
             C 100 111, 102 108, 103 104 
             C 105 96, 104 88, 100 78 Z"
          fill="#FFFBEB"
        />
      </g>

      {/* 6. Stylized "Z" Monogram Crest Inscription */}
      <path
        d="M 91 92 
           L 109 92 
           L 93 114 
           L 110 114"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* 7. Bottom Academic Laurel & Ribbon Stars */}
      <g fill="#F59E0B">
        <polygon points="100,166 102,172 108,172 103,176 105,182 100,178 95,182 97,176 92,172 98,172" />
        <polygon points="82,168 83,173 88,173 84,176 86,181 82,178 78,181 80,176 76,173 81,173" transform="scale(0.85) translate(14, 28)" />
        <polygon points="118,168 119,173 124,173 120,176 122,181 118,178 114,181 116,176 112,173 117,173" transform="scale(0.85) translate(18, 28)" />
      </g>
    </svg>
  );

  // Variant: Emblem Only
  if (variant === 'emblem') {
    return <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>{renderEmblemSvg()}</div>;
  }

  // Variant: Circular Official Crest with Latin & Marathi Inscription Ribbon
  if (variant === 'crest') {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {renderEmblemSvg()}
        {showSubtitle && (
          <div className="mt-2 text-center">
            <div className="text-[11px] font-black tracking-widest text-slate-900 uppercase">
              ZEP FOUNDATION BHOSE
            </div>
            <div className="text-[9px] font-bold text-orange-600 tracking-wider uppercase">
              विद्यया विन्दतेऽमृतम् • ESTD. 2005
            </div>
          </div>
        )}
      </div>
    );
  }

  // Variant: Stacked (Emblem on Top, Large Wordmark Below)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {renderEmblemSvg()}
        <div className="mt-2.5">
          <div className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base leading-none">
            Zep Foundation Bhose
          </div>
          {showSubtitle && (
            <div className="text-[10px] font-bold text-orange-600 mt-1 uppercase tracking-wider">
              Educational & Research Trust • Estd. 2005
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Variant Horizontal (Emblem + Wordmark Side-by-Side)
  const isWhite = theme === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {renderEmblemSvg()}
      <div className="overflow-hidden leading-tight text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-xs sm:text-sm truncate ${
              isWhite
                ? 'text-white'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            Zep Foundation
          </span>
          <span
            className={`hidden sm:inline-block text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border tracking-wider ${
              isWhite
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
            }`}
          >
            BHOSE
          </span>
        </div>
        {showSubtitle && (
          <div className="text-[10px] font-bold truncate flex items-center gap-1 mt-0.5">
            <span className={isWhite ? 'text-orange-400 font-extrabold' : 'text-orange-600 dark:text-orange-400'}>
              Education Trust
            </span>
            <span className={isWhite ? 'text-slate-500' : 'text-slate-300 dark:text-slate-600'}>•</span>
            <span className={isWhite ? 'text-slate-400 font-semibold' : 'text-slate-500 dark:text-slate-400 font-semibold'}>
              Estd. 2005
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrustLogo;
