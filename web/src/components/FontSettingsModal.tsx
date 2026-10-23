import React, { useState } from 'react';
import {
  Type,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  AVAILABLE_FONTS,
  AVAILABLE_FONT_SIZES,
  FontThemeService,
} from '../utils/fontTheme';

interface FontSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFontId: string;
  currentSizeId: string;
  onApply: (fontId: string, sizeId: string) => void;
}

export const FontSettingsModal: React.FC<FontSettingsModalProps> = ({
  isOpen,
  onClose,
  currentFontId,
  currentSizeId,
  onApply,
}) => {
  const [selectedFont, setSelectedFont] = useState(currentFontId);
  const [selectedSize, setSelectedSize] = useState(currentSizeId);

  if (!isOpen) return null;

  const handleSelectFont = (fontId: string) => {
    setSelectedFont(fontId);
    FontThemeService.applySettings(fontId, selectedSize);
    onApply(fontId, selectedSize);
  };

  const handleSelectSize = (sizeId: string) => {
    setSelectedSize(sizeId);
    FontThemeService.applySettings(selectedFont, sizeId);
    onApply(selectedFont, sizeId);
  };

  const handleReset = () => {
    const { font, size } = FontThemeService.resetToDefault();
    setSelectedFont(font.id);
    setSelectedSize(size.id);
    onApply(font.id, size.id);
  };

  const handleDecreaseSize = () => {
    const currentIndex = AVAILABLE_FONT_SIZES.findIndex((s) => s.id === selectedSize);
    if (currentIndex > 0) {
      handleSelectSize(AVAILABLE_FONT_SIZES[currentIndex - 1].id);
    }
  };

  const handleIncreaseSize = () => {
    const currentIndex = AVAILABLE_FONT_SIZES.findIndex((s) => s.id === selectedSize);
    if (currentIndex < AVAILABLE_FONT_SIZES.length - 1) {
      handleSelectSize(AVAILABLE_FONT_SIZES[currentIndex + 1].id);
    }
  };

  const currentFontObj =
    AVAILABLE_FONTS.find((f) => f.id === selectedFont) || AVAILABLE_FONTS[0];
  const currentSizeObj =
    AVAILABLE_FONT_SIZES.find((s) => s.id === selectedSize) || AVAILABLE_FONT_SIZES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="font-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 id="font-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                System Typography & Font Scaling
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust font family and interface text size. Changes update the entire ERP in real-time.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close typography settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          {/* 1. Font Size / Scale Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Interface Text Scaling (Font Size)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Current size: <strong>{currentSizeObj.label}</strong> ({currentSizeObj.sizePx}px root base)
                </p>
              </div>

              {/* Quick Stepper Buttons (A- / A+) */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleDecreaseSize}
                  disabled={selectedSize === AVAILABLE_FONT_SIZES[0].id}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  title="Decrease font size"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-slate-500" />
                  <span>A-</span>
                </button>
                <button
                  type="button"
                  onClick={handleIncreaseSize}
                  disabled={selectedSize === AVAILABLE_FONT_SIZES[AVAILABLE_FONT_SIZES.length - 1].id}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  title="Increase font size"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>A+</span>
                </button>
              </div>
            </div>

            {/* Size Level Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {AVAILABLE_FONT_SIZES.map((sz) => {
                const isSelected = sz.id === selectedSize;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => handleSelectSize(sz.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{sz.label.split(' ')[0]}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      {sz.scalePercent}% scale
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              Tip: Use <strong>Compact (85%)</strong> to fit maximum columns on laptop screens, or <strong>Large</strong> for high legibility.
            </p>
          </div>

          {/* 2. Font Family Selection Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Choose Font Name (Font Family)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Select your preferred typography. All titles, tables, forms, and buttons will adapt.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_FONTS.map((f) => {
                const isSelected = f.id === selectedFont;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectFont(f.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-sm font-extrabold text-slate-900 dark:text-white"
                        style={{ fontFamily: f.family }}
                      >
                        {f.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {f.category}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {f.description}
                    </p>
                    {/* Live Preview Sample */}
                    <div
                      className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 truncate"
                      style={{ fontFamily: f.family }}
                    >
                      AAFAN ALI A • STD 8 • Fee ₹38,000 • Verified
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Live Interactive ERP Component Preview */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Live ERP Interface Simulation
            </div>
            <div
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
              style={{ fontFamily: currentFontObj.family }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                    Student Roster
                  </span>
                  <h5 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    AAFAN ALI A
                  </h5>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Admission No: <strong>ADM-2026-000285</strong> &bull; Roll: <strong>01</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Aadhaar Verified
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs"
                  >
                    View Ledger
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                <div>Standard: <strong>STD 8 - Division A</strong></div>
                <div>Parent: <strong>Ali A & Taranum</strong></div>
                <div>Pending Fee: <strong className="text-rose-600 dark:text-rose-400">₹12,000</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 cursor-pointer transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
