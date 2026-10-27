import React, { useRef } from 'react';
import {
  Shield,
  Droplet,
  Phone,
  Calendar,
  GraduationCap,
  Building,
  Award,
  Bus,
  MapPin,
  Camera,
  Upload,
  User,
  QrCode,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Student, Employee } from '../types';
import {
  IdCardTheme,
  IdCardOrientation,
  IdCardSide,
  THEME_CONFIG,
  generateBarcodeSvgPattern,
  generateIdCardQrData,
  generateQrMatrix,
  readFileAsDataUrl,
} from '../utils/idCardUtils';
import { getInstitutionDetails } from '../utils/documentUtils';

export interface IdCardData {
  type: 'STUDENT' | 'STAFF';
  id: string;
  name: string;
  nameMarathi?: string;
  photoUrl?: string;
  primaryCode: string; // Roll No or Emp Code
  secondaryCode: string; // Admission/GR No or Dept
  badgeLabel: string; // Class 8-A or School Principal
  branchName: string;
  bloodGroup: string;
  dobOrJoinDate: string;
  dobOrJoinLabel: string; // "DOB" or "DOJ"
  emergencyPhone: string;
  validUpto: string;
  address?: string;
  busRoute?: string;
  busStop?: string;
  signatoryTitle: string;
  studentRef?: Student;
  staffRef?: Employee;
}

interface IdCardPreviewProps {
  cardData: IdCardData;
  orientation?: IdCardOrientation;
  theme?: IdCardTheme;
  side?: IdCardSide;
  onPhotoChange?: (newPhotoUrl: string) => void;
  isPrintMode?: boolean;
}

export const IdCardPreview: React.FC<IdCardPreviewProps> = ({
  cardData,
  orientation = 'PORTRAIT',
  theme = 'NAVY',
  side = 'FRONT',
  onPhotoChange,
  isPrintMode = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const themeObj = THEME_CONFIG[theme] || THEME_CONFIG.NAVY;
  const inst = getInstitutionDetails(cardData.branchName);

  const barcodePattern = generateBarcodeSvgPattern(cardData.secondaryCode || cardData.primaryCode);
  const qrData = generateIdCardQrData({
    type: cardData.type,
    idNumber: cardData.primaryCode,
    name: cardData.name,
    roleOrGrade: cardData.badgeLabel,
    branchName: inst.shortName,
    bloodGroup: cardData.bloodGroup,
    emergencyPhone: cardData.emergencyPhone,
    validUpto: cardData.validUpto,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoChange) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        onPhotoChange(dataUrl);
      } catch (err: any) {
        alert(err.message || 'Failed to read image');
      }
    }
  };

  const defaultPhoto =
    cardData.type === 'STUDENT'
      ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';

  const [photoError, setPhotoError] = React.useState(false);
  const photo = cardData.photoUrl || defaultPhoto;

  // Render High-Precision Vector QR Code (Zero Network Latency, Instant 300+ DPI Print Sharpness)
  const qrMatrix = React.useMemo(() => generateQrMatrix(qrData), [qrData]);
  const renderQrSvg = (sizeClass = 'w-10 h-10') => (
    <div
      className={`${sizeClass} border border-slate-300 p-0.5 rounded bg-white shrink-0 shadow-2xs`}
      title="Verified Security QR Code"
    >
      <svg viewBox="0 0 25 25" className="w-full h-full" shapeRendering="crispEdges">
        {qrMatrix.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" />
            ) : null
          )
        )}
      </svg>
    </div>
  );

  // Render SVG Barcode
  const renderBarcodeSvg = (height = 24) => {
    let currentX = 2;
    return (
      <svg
        viewBox="0 0 160 30"
        className="w-full h-auto max-h-7"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {barcodePattern.map((width, idx) => {
          const isBar = idx % 2 === 0;
          const x = currentX;
          currentX += width * 2;
          return isBar ? (
            <rect key={idx} x={x} y="0" width={width * 1.5} height={height} fill="#1e293b" />
          ) : null;
        })}
      </svg>
    );
  };

  /* ========================================================================= */
  /* 1. PORTRAIT - FRONT SIDE                                                  */
  /* ========================================================================= */
  const renderPortraitFront = () => (
    <div
      className={`relative w-[310px] h-[495px] bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${themeObj.cardBorder} flex flex-col select-none print:shadow-none print:rounded-lg print:border-slate-400`}
      style={{
        boxSizing: 'border-box',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
      }}
    >
      {/* Background Guilloche Watermark Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#94a3b8_0.75px,transparent_0.75px)] [background-size:8px_8px]"
        aria-hidden="true"
      />

      {/* Top Lanyard Slot */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20 print:hidden">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full border border-slate-400 shadow-inner" />
      </div>

      {/* Header Banner */}
      <div
        className={`bg-gradient-to-br ${themeObj.headerGradient} text-white pt-3 pb-2.5 px-3 text-center relative shadow-sm shrink-0`}
        style={{
          backgroundColor: themeObj.headerBg,
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        {/* Subtle Decorative Golden Arc */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
            <GraduationCap className="w-3 h-3" />
          </div>
          <span className="text-[9px] font-black tracking-widest uppercase text-amber-300">
            ZEP EDUCATION TRUST
          </span>
        </div>

        <h3 className="font-extrabold text-[12px] leading-tight uppercase tracking-tight text-white line-clamp-2 px-1">
          {inst.name}
        </h3>
        <p className="text-[8px] text-slate-300 font-mono tracking-tight mt-0.5 line-clamp-1">
          {inst.udiseCode} &bull; {inst.city}
        </p>

        {/* Card Category Badge */}
        <div className="inline-block mt-1.5">
          <span
            className={`px-3 py-0.5 rounded-full text-[8.5px] font-black tracking-wider uppercase shadow-xs ${themeObj.badgeBg}`}
          >
            {cardData.type === 'STUDENT' ? 'Student Identity Card' : 'Staff Identity Card'}
          </span>
        </div>
      </div>

      {/* Body: Photo & Identity Information */}
      <div className="p-3 flex-1 flex flex-col items-center justify-between z-10 text-slate-800">
        {/* Photo Container with Live Upload Trigger */}
        <div className="relative group -mt-0.5 mb-1">
          <div
            className={`w-22 h-26 rounded-xl p-0.5 bg-gradient-to-b from-amber-300 via-slate-200 to-amber-400 shadow-md ring-2 ${themeObj.ringColor}/30 overflow-hidden relative`}
          >
            {photo && !photoError ? (
              <img
                src={photo}
                alt={cardData.name}
                onError={() => setPhotoError(true)}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                <User className="w-10 h-10 text-slate-300" />
                <span className="text-[8px] font-bold mt-1 text-slate-500 uppercase">
                  {cardData.name.slice(0, 2)}
                </span>
              </div>
            )}
            {/* Holographic Security Overlay Seal */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-xs border border-white">
              <Shield className="w-3 h-3" />
            </div>
          </div>

          {/* Change Photo Hover Trigger */}
          {onPhotoChange && !isPrintMode && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/70 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
              title="Click to Upload / Change Photo"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-bold">Change Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Cardholder Name & Class/Designation */}
        <div className="text-center w-full px-1">
          <h4 className="font-extrabold text-[13px] leading-tight text-slate-900 tracking-tight uppercase line-clamp-1">
            {cardData.name}
          </h4>
          {cardData.nameMarathi && (
            <div className="text-[10px] font-bold text-amber-800 mt-0.5 font-serif line-clamp-1">
              {cardData.nameMarathi}
            </div>
          )}
          <div className="inline-block mt-1">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${themeObj.accentBg}`}
            >
              {cardData.badgeLabel}
            </span>
          </div>
        </div>

        {/* Particulars Grid */}
        <div className="w-full bg-slate-50/90 rounded-xl p-2 border border-slate-200/80 text-[10px] space-y-1 shadow-2xs my-1">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                {cardData.type === 'STUDENT' ? 'Roll No' : 'Emp ID'}
              </span>
              <span className="font-extrabold text-slate-900 font-mono">
                {cardData.primaryCode}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                {cardData.type === 'STUDENT' ? 'GR / Adm No' : 'Department'}
              </span>
              <span className="font-extrabold text-slate-900 font-mono truncate block">
                {cardData.secondaryCode}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                Blood Group
              </span>
              <span className="font-extrabold text-rose-600 flex items-center gap-0.5">
                <Droplet className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                {cardData.bloodGroup || 'O+'}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                {cardData.dobOrJoinLabel}
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {cardData.dobOrJoinDate || '2013-05-18'}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-1 flex items-center justify-between text-[8.5px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Phone className="w-2.5 h-2.5 text-slate-400" />
              {cardData.emergencyPhone}
            </span>
            <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 font-mono">
              Valid: {cardData.validUpto}
            </span>
          </div>
        </div>

        {/* Footer: Scannable QR & Authorised Signature */}
        <div className="w-full flex items-center justify-between pt-1 border-t border-slate-200 mt-auto">
          {/* Scannable Vector QR Code */}
          <div className="flex items-center gap-1.5 shrink-0">
            {renderQrSvg('w-10 h-10')}
            <div className="text-[7px] text-slate-400 font-mono leading-tight">
              <div className="font-bold text-slate-700 uppercase">OFFICIAL ID</div>
              <div>VERIFIED</div>
            </div>
          </div>

          {/* Authorised Signature & Seal */}
          <div className="text-center min-w-[90px] shrink-0">
            <div className="h-4 flex items-center justify-center">
              <span className="text-[8.5px] font-script font-serif italic text-blue-900 font-bold opacity-85">
                S. Kulkarni
              </span>
            </div>
            <div className="border-t border-slate-400 pt-0.5 text-[8px] font-black text-slate-900 uppercase">
              {cardData.signatoryTitle || 'Principal'}
            </div>
            <div className="text-[6.5px] text-slate-400 uppercase tracking-tighter">
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>

      {/* Hologram Bottom Border Strip */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-600 shrink-0" />
    </div>
  );

  /* ========================================================================= */
  /* 2. PORTRAIT - BACK SIDE                                                   */
  /* ========================================================================= */
  const renderPortraitBack = () => (
    <div
      className={`relative w-[310px] h-[495px] bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${themeObj.cardBorder} flex flex-col justify-between p-3.5 select-none print:shadow-none print:rounded-lg print:border-slate-400`}
      style={{
        boxSizing: 'border-box',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
      }}
    >
      {/* Top Lanyard Slot */}
      <div className="w-10 h-1.5 bg-slate-300 rounded-full border border-slate-400 shadow-inner mx-auto mb-1 print:hidden" />

      {/* Back Header */}
      <div className="text-center border-b border-slate-200 pb-1.5">
        <div className="flex items-center justify-center gap-1.5 text-slate-800">
          <Building className="w-3.5 h-3.5 text-amber-600" />
          <h4 className="font-black text-[11px] uppercase tracking-wide">
            Terms & Emergency Directives
          </h4>
        </div>
        <div className="text-[8px] text-slate-400 uppercase font-mono">
          नियम, अटी व आपत्कालीन संपर्क
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-1 text-[8.5px] text-slate-600 leading-snug my-1 bg-slate-50 p-2 rounded-xl border border-slate-200/70">
        <p className="flex items-start gap-1">
          <span className="font-bold text-amber-600">1.</span>
          <span>This card is the property of Zep Foundation Bhose and is non-transferable.</span>
        </p>
        <p className="flex items-start gap-1">
          <span className="font-bold text-amber-600">2.</span>
          <span>Cardholder must wear and present this card upon entering the campus premises.</span>
        </p>
        <p className="flex items-start gap-1">
          <span className="font-bold text-amber-600">3.</span>
          <span>Loss of this card must be immediately reported to the Administration Office.</span>
        </p>
        <p className="flex items-start gap-1">
          <span className="font-bold text-amber-600">4.</span>
          <span>Found cards should be deposited at the Main Campus Security Post.</span>
        </p>
      </div>

      {/* Residential & Transport Info */}
      <div className="space-y-1.5 text-[9px]">
        {cardData.address && (
          <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200/60">
            <div className="font-bold text-amber-950 text-[8.5px] uppercase flex items-center gap-1 mb-0.5">
              <MapPin className="w-2.5 h-2.5 text-amber-600" />
              <span>Residential Address:</span>
            </div>
            <p className="text-slate-700 leading-tight line-clamp-2">{cardData.address}</p>
          </div>
        )}

        {cardData.type === 'STUDENT' && cardData.busRoute && (
          <div className="bg-blue-50/70 p-1.5 rounded-lg border border-blue-200/60 flex items-center justify-between text-[8.5px]">
            <span className="text-blue-900 font-bold flex items-center gap-1">
              <Bus className="w-3 h-3 text-blue-600" />
              Route: {cardData.busRoute}
            </span>
            <span className="text-slate-600 font-medium">Stop: {cardData.busStop || 'Main Gate'}</span>
          </div>
        )}
      </div>

      {/* Institutional Campus Contact Footer */}
      <div className="space-y-1 text-center border-t border-slate-200 pt-2 text-[8px] text-slate-500">
        <div className="font-extrabold text-slate-900 text-[9px] uppercase">{inst.name}</div>
        <div className="line-clamp-1">{inst.address}</div>
        <div className="font-mono text-slate-700 font-bold">
          Tel: {inst.phone} &bull; Web: {inst.website}
        </div>
      </div>

      {/* Barcode & Return Instructions */}
      <div className="mt-1 text-center bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        {renderBarcodeSvg(18)}
        <div className="text-[7.5px] font-mono font-bold tracking-widest text-slate-600 mt-0.5">
          *{cardData.secondaryCode || cardData.primaryCode}*
        </div>
        <div className="text-[6.5px] text-slate-400 uppercase mt-0.5">
          Scan for Institutional Access Verification
        </div>
      </div>
    </div>
  );

  /* ========================================================================= */
  /* 3. LANDSCAPE - FRONT SIDE                                                 */
  /* ========================================================================= */
  const renderLandscapeFront = () => (
    <div
      className={`relative w-[495px] h-[310px] bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${themeObj.cardBorder} flex flex-col select-none print:shadow-none print:rounded-lg print:border-slate-400`}
      style={{
        boxSizing: 'border-box',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
      }}
    >
      {/* Background Watermark Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#94a3b8_0.75px,transparent_0.75px)] [background-size:8px_8px]"
        aria-hidden="true"
      />

      {/* Top Banner */}
      <div
        className={`bg-gradient-to-r ${themeObj.headerGradient} text-white px-4 py-2 flex items-center justify-between relative shadow-sm shrink-0`}
        style={{
          backgroundColor: themeObj.headerBg,
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase text-amber-300 tracking-wider">
              ZEP EDUCATION TRUST
            </div>
            <h3 className="font-extrabold text-[12px] uppercase leading-tight text-white line-clamp-1">
              {inst.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${themeObj.badgeBg}`}
          >
            {cardData.type === 'STUDENT' ? 'Student ID' : 'Staff ID'}
          </span>
          <div className="text-[8px] text-slate-300 font-mono mt-0.5">
            Valid: {cardData.validUpto}
          </div>
        </div>
      </div>

      {/* Golden Accent Ribbon */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shrink-0" />

      {/* Landscape Main Content Body */}
      <div className="p-3.5 flex-1 flex items-center gap-4 z-10 text-slate-800">
        {/* Left: Photo with Upload Trigger */}
        <div className="relative group shrink-0">
          <div
            className={`w-28 h-32 rounded-xl p-0.5 bg-gradient-to-b from-amber-300 via-slate-200 to-amber-400 shadow-md ring-2 ${themeObj.ringColor}/30 overflow-hidden relative`}
          >
            {photo && !photoError ? (
              <img
                src={photo}
                alt={cardData.name}
                onError={() => setPhotoError(true)}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                <User className="w-12 h-12 text-slate-300" />
                <span className="text-[9px] font-bold mt-1 text-slate-500 uppercase">
                  {cardData.name.slice(0, 2)}
                </span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-xs border border-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          {onPhotoChange && !isPrintMode && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/70 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-bold">Change</span>
            </button>
          )}
        </div>

        {/* Center: Information Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-[15px] text-slate-900 leading-tight uppercase truncate">
                {cardData.name}
              </h4>
              {cardData.nameMarathi && (
                <span className="text-[11px] font-bold text-amber-800 font-serif">
                  ({cardData.nameMarathi})
                </span>
              )}
            </div>

            <div className="inline-block mt-1">
              <span
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold uppercase border ${themeObj.accentBg}`}
              >
                {cardData.badgeLabel}
              </span>
            </div>
          </div>

          {/* 4-column details grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 bg-slate-50/90 p-2 rounded-xl border border-slate-200/80 text-[10px] my-1">
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                {cardData.type === 'STUDENT' ? 'Roll No' : 'Emp ID'}
              </span>
              <span className="font-extrabold text-slate-900 font-mono">
                {cardData.primaryCode}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                {cardData.type === 'STUDENT' ? 'Admission / GR' : 'Department'}
              </span>
              <span className="font-extrabold text-slate-900 font-mono truncate block">
                {cardData.secondaryCode}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                Blood Group
              </span>
              <span className="font-extrabold text-rose-600 flex items-center gap-0.5">
                <Droplet className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                {cardData.bloodGroup || 'O+'}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">
                Emergency Contact
              </span>
              <span className="font-mono font-bold text-slate-800 text-[9.5px]">
                {cardData.emergencyPhone}
              </span>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="pt-0.5">
            {renderBarcodeSvg(16)}
          </div>
        </div>

        {/* Right: Scannable Vector QR & Signature */}
        <div className="shrink-0 flex flex-col items-center justify-between h-full border-l border-slate-200 pl-3">
          {renderQrSvg('w-13 h-13')}

          <div className="text-center">
            <div className="h-5 flex items-center justify-center">
              <span className="text-[9px] font-script font-serif italic text-blue-900 font-bold opacity-85">
                S. Kulkarni
              </span>
            </div>
            <div className="border-t border-slate-400 pt-0.5 text-[8px] font-black text-slate-900 uppercase">
              {cardData.signatoryTitle || 'Principal'}
            </div>
            <div className="text-[6.5px] text-slate-400 uppercase">Seal & Sign</div>
          </div>
        </div>
      </div>

      {/* Hologram Bottom Border Strip */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-600 shrink-0" />
    </div>
  );

  /* ========================================================================= */
  /* 4. LANDSCAPE - BACK SIDE                                                  */
  /* ========================================================================= */
  const renderLandscapeBack = () => (
    <div
      className={`relative w-[495px] h-[310px] bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${themeObj.cardBorder} flex flex-col justify-between p-4 select-none print:shadow-none print:rounded-lg print:border-slate-400`}
      style={{
        boxSizing: 'border-box',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
      }}
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-600" />
          <h4 className="font-black text-[12px] uppercase tracking-wide text-slate-900">
            Terms of Use & Campus Directives
          </h4>
        </div>
        <span className="text-[9px] font-mono text-slate-400 uppercase">
          ZEP FOUNDATION BHOSE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-1">
        {/* Left column: Terms */}
        <div className="space-y-1 text-[8.5px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <p>• This credential is institutional property and strictly non-transferable.</p>
          <p>• Must be displayed while on campus and during official travel or exams.</p>
          <p>• Report loss immediately to campus security or the administrative office.</p>
          <p>• If found, return to: Campus Security Post, {inst.city}.</p>
        </div>

        {/* Right column: Residential & Emergency */}
        <div className="space-y-2 text-[9px]">
          {cardData.address && (
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200/60">
              <span className="font-bold text-amber-950 text-[8.5px] uppercase block mb-0.5">
                Residential Address:
              </span>
              <p className="text-slate-700 leading-tight line-clamp-3">{cardData.address}</p>
            </div>
          )}

          {cardData.type === 'STUDENT' && cardData.busRoute && (
            <div className="bg-blue-50/70 p-1.5 rounded-lg border border-blue-200/60 flex items-center justify-between text-[8.5px]">
              <span className="text-blue-900 font-bold flex items-center gap-1">
                <Bus className="w-3 h-3 text-blue-600" />
                Bus Route: {cardData.busRoute}
              </span>
              <span className="text-slate-600">Stop: {cardData.busStop || 'Main Gate'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[8.5px] text-slate-600">
        <div>
          <div className="font-extrabold text-slate-900 uppercase text-[9px]">{inst.name}</div>
          <div className="text-slate-500">{inst.address} &bull; Tel: {inst.phone}</div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold text-slate-800">Web: {inst.website}</div>
          <div className="text-[7.5px] text-emerald-700 font-bold">Authorized Digital PVC Record</div>
        </div>
      </div>
    </div>
  );

  /**
   * Universal Card Wrapper:
   * On-screen: full comfortable preview (310px x 495px portrait, 495px x 310px landscape).
   * In print / isPrintMode: exact CR-80 physical PVC card standard dimensions (54mm x 86mm / 86mm x 54mm)
   * with zero overflow clipping.
   */
  const wrapCard = (cardJsx: React.ReactNode, isPortrait: boolean) => (
    <div
      className={`id-card-print-card-wrapper ${
        isPortrait ? 'id-card-portrait-card-wrapper' : 'id-card-landscape-card-wrapper'
      }`}
      style={
        isPrintMode
          ? {
              width: isPortrait ? '54mm' : '86mm',
              height: isPortrait ? '86mm' : '54mm',
              overflow: 'hidden',
              display: 'inline-block',
              position: 'relative',
              boxSizing: 'border-box',
            }
          : undefined
      }
    >
      <div
        className={`id-card-print-card ${
          isPortrait ? 'id-card-portrait-card' : 'id-card-landscape-card'
        }`}
        style={
          isPrintMode
            ? {
                width: isPortrait ? '310px' : '495px',
                height: isPortrait ? '495px' : '310px',
                transform: 'scale(0.658)',
                transformOrigin: 'top left',
              }
            : undefined
        }
      >
        {cardJsx}
      </div>
    </div>
  );

  return (
    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-6 print:gap-4 print:flex-row">
      {/* Front View */}
      {(side === 'FRONT' || side === 'BOTH') && (
        <div className="relative">
          {wrapCard(
            orientation === 'PORTRAIT' ? renderPortraitFront() : renderLandscapeFront(),
            orientation === 'PORTRAIT'
          )}
        </div>
      )}

      {/* Back View */}
      {(side === 'BACK' || side === 'BOTH') && (
        <div className="relative">
          {wrapCard(
            orientation === 'PORTRAIT' ? renderPortraitBack() : renderLandscapeBack(),
            orientation === 'PORTRAIT'
          )}
        </div>
      )}
    </div>
  );
};
