import React, { useState } from 'react';
import {
  Printer,
  X,
  CreditCard,
  ShieldCheck,
  RotateCw,
  Sliders,
  Palette,
  Camera,
  Upload,
  Sparkles,
  Download,
  Image as ImageIcon,
  FileText,
  Scissors,
} from 'lucide-react';
import {
  IdCardPreview,
  IdCardData,
} from './IdCardPreview';
import {
  IdCardTheme,
  IdCardOrientation,
  IdCardSide,
  THEME_CONFIG,
  PRESET_PHOTOS,
  readFileAsDataUrl,
} from '../utils/idCardUtils';

interface IdCardModalProps {
  cardData: IdCardData;
  isOpen: boolean;
  onClose: () => void;
  onPhotoUpdated?: (cardId: string, newPhotoUrl: string) => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  cardData: initialCardData,
  isOpen,
  onClose,
  onPhotoUpdated,
}) => {
  const [cardData, setCardData] = useState<IdCardData>(initialCardData);
  const [orientation, setOrientation] = useState<IdCardOrientation>('PORTRAIT');
  const [theme, setTheme] = useState<IdCardTheme>(
    initialCardData.branchName.toLowerCase().includes('hotel') ? 'BURGUNDY' : 'NAVY'
  );
  const [side, setSide] = useState<IdCardSide>('BOTH');
  const [printFormat, setPrintFormat] = useState<'A4_SHEET' | 'PVC_CARD'>('A4_SHEET');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Sync if initialCardData prop changes
  React.useEffect(() => {
    setCardData(initialCardData);
    if (initialCardData.branchName.toLowerCase().includes('hotel')) {
      setTheme('BURGUNDY');
    }
  }, [initialCardData]);

  if (!isOpen) return null;

  const handlePhotoChange = (newPhotoUrl: string) => {
    setCardData((prev) => ({ ...prev, photoUrl: newPhotoUrl }));
    if (onPhotoUpdated) {
      onPhotoUpdated(cardData.id, newPhotoUrl);
    }
  };

  const handleUploadFromDisk = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        handlePhotoChange(dataUrl);
        setShowPhotoPicker(false);
      } catch (err: any) {
        alert(err.message || 'Failed to read image');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:m-0 print:bg-transparent print:static print:overflow-visible">
      {/* Modal Dialog Box */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[96vh] flex flex-col my-auto overflow-hidden animate-scale-in print:shadow-none print:border-none print:max-h-none print:overflow-visible print:w-full print:m-0 print:p-0 print:static">
        
        {/* Modal Top Bar (Non-Printable) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  {cardData.type === 'STUDENT' ? 'Student Identity Card' : 'Staff Identity Card'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {cardData.name} &bull; {cardData.badgeLabel} &bull; {cardData.primaryCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print ID Card</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Controls Ribbon (Non-Printable) */}
        <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs print:hidden">
          {/* Orientation Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Orientation:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setOrientation('PORTRAIT')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  orientation === 'PORTRAIT'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Portrait (Vertical)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('LANDSCAPE')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  orientation === 'LANDSCAPE'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Landscape (Horizontal)
              </button>
            </div>
          </div>

          {/* Sides Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Sides:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setSide('FRONT')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  side === 'FRONT'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Front Only
              </button>
              <button
                type="button"
                onClick={() => setSide('BACK')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  side === 'BACK'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Back Only
              </button>
              <button
                type="button"
                onClick={() => setSide('BOTH')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  side === 'BOTH'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Both Sides
              </button>
            </div>
          </div>

          {/* Print Format / Paper Target */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Print Target:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPrintFormat('A4_SHEET')}
                title="Print on standard A4 paper with cutting and fold guidelines"
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  printFormat === 'A4_SHEET'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4 Sheet + Cut Marks
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('PVC_CARD')}
                title="Direct CR-80 card size for PVC card printers"
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  printFormat === 'PVC_CARD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Direct PVC Card
              </button>
            </div>
          </div>

          {/* Theme Colors */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Theme:</span>
            <div className="flex items-center gap-1.5">
              {(Object.keys(THEME_CONFIG) as IdCardTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  title={THEME_CONFIG[t].name}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    theme === t ? 'scale-125 border-amber-500 ring-2 ring-amber-300' : 'border-white hover:scale-110 shadow-xs'
                  }`}
                  style={{ backgroundColor: THEME_CONFIG[t].headerBg }}
                />
              ))}
            </div>
          </div>

          {/* Change Photo Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPhotoPicker((prev) => !prev)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-amber-600" />
              <span>Change Photo</span>
            </button>

            {/* Photo Selector Popover */}
            {showPhotoPicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 animate-scale-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-extrabold text-xs text-slate-900">Select or Upload Photo</span>
                  <button
                    type="button"
                    onClick={() => setShowPhotoPicker(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Upload from Local Device */}
                <label className="flex items-center justify-center gap-2 w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl font-bold text-xs text-slate-700 cursor-pointer mb-3 transition-colors">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Upload from Computer / Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadFromDisk}
                  />
                </label>

                {/* Sample Preset Avatars */}
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  Preset Sample Portraits:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_PHOTOS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        handlePhotoChange(p.url);
                        setShowPhotoPicker(false);
                      }}
                      title={p.label}
                      className="group relative rounded-lg overflow-hidden border border-slate-200 hover:border-amber-500 hover:scale-105 transition-all aspect-square cursor-pointer"
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Center: ID Card Display & Print Container */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-100/70 min-h-[360px] print:p-0 print:m-0 print:bg-transparent print:overflow-visible print:block">
          <div id="printable-id-card-modal" className="id-card-printable-area w-full flex flex-col items-center">
            
            {/* Sheet Top Attribution (Printed when A4 Sheet format is active) */}
            {printFormat === 'A4_SHEET' && (
              <div className="hidden print:block w-full max-w-[190mm] text-center border-b border-slate-300 pb-2 mb-4">
                <div className="font-extrabold text-[11px] uppercase text-slate-900 tracking-wider flex items-center justify-center gap-2">
                  <span>ZEP EDUCATION TRUST</span>
                  <span>&bull;</span>
                  <span>OFFICIAL CR-80 PVC IDENTITY CARD PRINT MASTER</span>
                </div>
                <div className="text-[8.5px] text-slate-600 font-mono mt-0.5">
                  {cardData.type === 'STUDENT' ? 'Student ID Record' : 'Staff ID Record'} &bull; {cardData.name} &bull; {cardData.badgeLabel} &bull; Code: {cardData.primaryCode} &bull; Valid: {cardData.validUpto}
                </div>
              </div>
            )}

            {/* Card Frame with Cutting Guidelines */}
            <div className={`relative ${printFormat === 'A4_SHEET' ? 'p-2 sm:p-3 border border-dashed border-slate-300 sm:border-slate-300 rounded-2xl bg-white/40 print:p-1.5 print:border-dashed print:border-slate-400 print:bg-transparent' : ''}`}>
              {/* Cutting Guideline Mark */}
              {printFormat === 'A4_SHEET' && (
                <div className="hidden print:flex items-center justify-between text-[7px] text-slate-500 font-mono mb-1 px-1">
                  <span className="flex items-center gap-1">
                    <Scissors className="w-2.5 h-2.5" />
                    <span>Cut along outer boundary line</span>
                  </span>
                  {side === 'BOTH' && (
                    <span>&bull; Fold along center spine for double-sided lamination</span>
                  )}
                </div>
              )}

              <IdCardPreview
                cardData={cardData}
                orientation={orientation}
                theme={theme}
                side={side}
                onPhotoChange={handlePhotoChange}
              />
            </div>

            {/* Sheet Bottom Footer (Printed when A4 Sheet format is active) */}
            {printFormat === 'A4_SHEET' && (
              <div className="hidden print:block w-full max-w-[190mm] text-center border-t border-slate-300 pt-2 mt-4 text-[7.5px] text-slate-400 font-mono">
                Standard CR-80 PVC Dimensions (85.60 mm × 53.98 mm) &bull; Crop along dashed guidelines &bull; Cryptographically Verified Institutional Record
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer (Non-Printable) */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          <div className="text-slate-500 text-[11px] font-medium hidden sm:block">
            Print Format: Standard CR-80 PVC Size (85.60 mm × 53.98 mm) &bull; High Resolution 300+ DPI
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official ID Card</span>
            </button>
          </div>
        </div>

      </div>

      {/* Scoped CSS for ID Card Print Precision */}
      <style>{`
        @media print {
          @page {
            size: ${printFormat === 'PVC_CARD' ? (orientation === 'PORTRAIT' ? '54mm 86mm' : '86mm 54mm') : 'A4 portrait'};
            margin: ${printFormat === 'PVC_CARD' ? '0mm' : '8mm'};
          }
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-id-card-modal,
          #printable-id-card-modal * {
            visibility: visible !important;
          }
          #printable-id-card-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }
          .id-card-portrait-card-wrapper {
            width: 54mm !important;
            height: 86mm !important;
            min-width: 54mm !important;
            min-height: 86mm !important;
            max-width: 54mm !important;
            max-height: 86mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            display: inline-block !important;
            position: relative !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .id-card-landscape-card-wrapper {
            width: 86mm !important;
            height: 54mm !important;
            min-width: 86mm !important;
            min-height: 54mm !important;
            max-width: 86mm !important;
            max-height: 54mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            display: inline-block !important;
            position: relative !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .id-card-portrait-card {
            width: 310px !important;
            height: 495px !important;
            min-width: 310px !important;
            min-height: 495px !important;
            transform: scale(0.658) !important;
            transform-origin: top left !important;
            box-shadow: none !important;
            border-radius: 4px !important;
          }
          .id-card-landscape-card {
            width: 495px !important;
            height: 310px !important;
            min-width: 495px !important;
            min-height: 310px !important;
            transform: scale(0.658) !important;
            transform-origin: top left !important;
            box-shadow: none !important;
            border-radius: 4px !important;
          }
          .id-card-print-card,
          #printable-id-card-modal,
          #printable-id-card-modal * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};
