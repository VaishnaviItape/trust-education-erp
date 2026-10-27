import React, { useState } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Building,
  CreditCard,
  QrCode,
  FileText,
  Calendar,
  User,
  Hash,
  Download,
} from 'lucide-react';
import { FeeReceipt, Student } from '../types';
import { getInstitutionDetails } from '../utils/documentUtils';
import { enrichFeeReceipt } from '../utils/feeReceiptUtils';
import { TrustLogo } from './TrustLogo';

interface PrintableFeeReceiptModalProps {
  receipt: FeeReceipt;
  student?: Student;
  onClose: () => void;
}

export const PrintableFeeReceiptModal: React.FC<PrintableFeeReceiptModalProps> = ({
  receipt: rawReceipt,
  student,
  onClose,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [receiptCopyType, setReceiptCopyType] = useState<'STUDENT' | 'OFFICE'>('STUDENT');

  // Enrich receipt with all student particulars, institutional letterhead, and fee head breakdowns
  const receipt = enrichFeeReceipt(rawReceipt, student);
  const inst = getInstitutionDetails(receipt.branchName);

  const copyReceiptNumber = () => {
    navigator.clipboard.writeText(receipt.receiptNo);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto animate-scale-in flex flex-col max-h-[96vh]">
        
        {/* Top Control Bar (Non-Printable) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">Official Fee Receipt Voucher</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Receipt #{receipt.receiptNo} &bull; {receipt.branchName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Toggle Button */}
            <div className="bg-white border border-slate-200 rounded-xl p-0.5 flex text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setReceiptCopyType('STUDENT')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  receiptCopyType === 'STUDENT'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Copy (मूळ)
              </button>
              <button
                type="button"
                onClick={() => setReceiptCopyType('OFFICE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  receiptCopyType === 'OFFICE'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Office Copy (संस्था)
              </button>
            </div>

            {/* Quick Copy Number */}
            <button
              type="button"
              onClick={copyReceiptNumber}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Receipt Number"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copySuccess ? 'Copied!' : 'Copy No'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Canvas Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/60">
          
          {/* Printable Voucher Paper */}
          <div
            id="printable-fee-receipt"
            className="bg-white rounded-2xl border-2 border-slate-800 shadow-xl p-6 sm:p-8 max-w-3xl mx-auto font-sans relative overflow-hidden print:border-none print:shadow-none print:p-0 print:m-0"
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <div className="w-[420px] h-[420px] rounded-full border-[18px] border-slate-900 flex items-center justify-center">
                <span className="text-4xl font-black text-center uppercase tracking-widest leading-relaxed">
                  ZEP FOUNDATION<br />BHOSE
                </span>
              </div>
            </div>

            {/* Official Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 relative">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">
                <span>Govt. Regd. Trust No: F-18452 (Solapur)</span>
                <span>ISO 9001:2015 Certified Educational Campus</span>
              </div>

              {/* Trust Name & Emblem */}
              <div className="flex items-center justify-center gap-3 my-1">
                <TrustLogo variant="emblem" size="md" />
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-black tracking-widest text-orange-700 uppercase font-sans">
                    {inst.trustName}
                  </div>
                  <div className="text-[10px] text-slate-600 font-serif font-medium">
                    (महाराष्ट्र सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अंतर्गत नोंदणीकृत संस्था)
                  </div>
                </div>
              </div>

              {/* Institution Main Title */}
              <h1 className="text-base sm:text-xl font-black uppercase text-slate-950 font-sans mt-1.5 tracking-tight">
                {inst.name}
              </h1>

              {/* Address & Contact Strip */}
              <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                <p>{inst.address}, {inst.city} - {inst.pincode}</p>
                <p className="font-mono text-slate-700">
                  Tel: {inst.phone} &bull; Email: {inst.email} &bull; Web: {inst.website}
                </p>
                <p className="font-bold text-slate-800 text-[10px]">
                  {inst.affiliationNo} &bull; {inst.udiseCode}
                </p>
              </div>

              {/* Receipt Title Ribbon */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="bg-slate-900 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <span>FEE PAYMENT RECEIPT / शुल्क पावती</span>
                </div>
                <div className="border border-slate-800 text-slate-900 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider bg-slate-50">
                  {receiptCopyType === 'STUDENT' ? 'STUDENT COPY / मूळ प्रत' : 'INSTITUTE AUDIT COPY / संस्था प्रत'}
                </div>
              </div>
            </div>

            {/* Receipt Meta Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-b border-slate-200 text-xs bg-slate-50/60 -mx-6 sm:-mx-8 px-6 sm:px-8">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipt Voucher No</span>
                <span className="font-mono font-black text-slate-900 text-sm tracking-tight">
                  {receipt.receiptNo}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Payment</span>
                <span className="font-bold text-slate-900">
                  {receipt.date} {receipt.time || ''}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Session</span>
                <span className="font-bold text-slate-900">
                  {receipt.academicYear || '2026-2027'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Installment / Term</span>
                <span className="font-bold text-orange-700">
                  {receipt.installmentNo}
                </span>
              </div>
            </div>

            {/* Student Particulars Matrix */}
            <div className="py-3 border-b border-slate-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Student Name:</span>
                  <span className="font-extrabold text-slate-900">
                    {receipt.studentName}
                    {receipt.studentNameMarathi && (
                      <span className="font-serif font-bold text-orange-950 ml-1.5">
                        ({receipt.studentNameMarathi})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">G.R. / Adm No:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {receipt.grNumber || receipt.admissionNo || receipt.studentId}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Class / Course:</span>
                  <span className="font-bold text-slate-900">
                    {receipt.standardOrGrade} {receipt.division ? `(Div ${receipt.division})` : ''}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Roll No / PRN:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {receipt.rollNo || 'N/A'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Parent / Guardian:</span>
                  <span className="font-medium text-slate-800">
                    {receipt.parentName || 'Parent / Guardian'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Parent Mobile:</span>
                  <span className="font-mono text-slate-800">
                    {receipt.parentPhone || '+91 98220 00000'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Payment Mode:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-[10px] font-black uppercase">
                      {receipt.paymentMode}
                    </span>
                    <span className="font-mono text-[11px] text-slate-600 font-normal">
                      Ref: {receipt.transactionReference || 'CASH-REC'}
                    </span>
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-semibold min-w-[110px]">Category / Quota:</span>
                  <span className="font-medium text-slate-800">
                    {receipt.category || 'General / Open'}
                  </span>
                </div>
              </div>
            </div>

            {/* ITEMISED FEE HEADS BREAKDOWN TABLE */}
            <div className="py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                  Itemized Fee Head Particulars / शुल्क तपशील
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Currency: INR (₹)</span>
              </div>

              <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-300 text-[11px]">
                    <th className="py-2 px-3 text-center w-12 border-r border-slate-300">Sr.</th>
                    <th className="py-2 px-3 border-r border-slate-300">
                      Fee Head Description / शुल्क शीर्षक
                    </th>
                    <th className="py-2 px-3 text-center w-28 border-r border-slate-300">
                      Schedule
                    </th>
                    <th className="py-2 px-3 text-right w-36">
                      Amount Paid (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {receipt.feeBreakdown && receipt.feeBreakdown.length > 0 ? (
                    receipt.feeBreakdown.map((head, idx) => (
                      <tr key={head.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <div className="font-bold text-slate-900">{head.headName}</div>
                          {head.headNameMarathi && (
                            <div className="text-[10px] text-slate-500 font-serif">
                              {head.headNameMarathi}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center border-r border-slate-200">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {head.category || 'TERM'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          ₹ {head.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-200">
                        1
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200">
                        <div className="font-bold text-slate-900">Composite Institutional & Tuition Fee</div>
                        <div className="text-[10px] text-slate-500 font-serif">शैक्षणिक व अध्यापन शुल्क</div>
                      </td>
                      <td className="py-2 px-3 text-center border-r border-slate-200">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          INSTALLMENT
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        ₹ {receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-black text-xs">
                    <td colSpan={3} className="py-2.5 px-3 text-right uppercase tracking-wider">
                      Total Amount Received / एकूण प्राप्त रक्कम:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-sm tracking-tight text-emerald-400">
                      ₹ {receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Statutory Amount in Words */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 text-xs space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-slate-500 font-bold min-w-[120px]">Amount in Words:</span>
                <span className="font-bold text-slate-950 uppercase tracking-wide">
                  {receipt.amountInWords || 'Twelve Thousand Rupees Only'}
                </span>
              </div>
              {receipt.amountInWordsMarathi && (
                <div className="flex items-start gap-2 pt-0.5">
                  <span className="text-slate-500 font-bold min-w-[120px]">अक्षरी रक्कम:</span>
                  <span className="font-serif font-bold text-orange-950">
                    {receipt.amountInWordsMarathi}
                  </span>
                </div>
              )}
            </div>

            {/* Financial Ledger Progress Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-3 bg-slate-100/70 border border-slate-200 rounded-xl text-center text-xs">
              <div className="p-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Annual Assessed Fee</div>
                <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                  ₹ {(receipt.totalAnnualFee || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-1.5 border-l border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Previously Paid</div>
                <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                  ₹ {(receipt.previouslyPaid || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-1.5 border-l border-slate-200 bg-emerald-50/60 rounded-lg">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Current Receipt</div>
                <div className="font-mono font-extrabold text-emerald-700 text-xs mt-0.5">
                  ₹ {receipt.amount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-1.5 border-l border-slate-200 bg-rose-50/60 rounded-lg">
                <div className="text-[10px] font-bold text-rose-800 uppercase">Remaining Balance</div>
                <div className="font-mono font-extrabold text-rose-700 text-xs mt-0.5">
                  ₹ {(receipt.remainingBalance || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Statutory Terms & Conditions */}
            <div className="text-[9px] text-slate-500 border-t border-slate-200 pt-2 space-y-0.5">
              <p>
                <strong>Important Notice:</strong> 1. Fees once paid are non-refundable and non-transferable under Trust Rule 14(B). 
                2. Cheque payments are subject to actual realization. 
                3. Please preserve this computer-generated receipt for future statutory reference and income tax rebate verification.
              </p>
            </div>

            {/* Signatures & Verification Strip */}
            <div className="pt-6 mt-3 border-t-2 border-slate-800 flex items-end justify-between text-xs font-sans gap-4">
              {/* Left: Scannable QR Code */}
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(
                    `ZEP FOUNDATION BHOSE | RECEIPT: ${receipt.receiptNo} | STUDENT: ${receipt.studentName} | AMOUNT: INR ${receipt.amount} | DATE: ${receipt.date}`
                  )}`}
                  alt="Official QR"
                  className="w-16 h-16 border border-slate-300 p-0.5 rounded-lg bg-white shadow-2xs"
                />
                <div className="text-[9px] text-slate-500">
                  <div className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Digital QR Verify
                  </div>
                  <div className="font-mono text-slate-600 truncate max-w-[130px]">
                    {receipt.receiptNo}
                  </div>
                  <div className="text-[8px] text-slate-400">Cryptographically Sealed</div>
                </div>
              </div>

              {/* Center: Depositor / Parent Signature */}
              <div className="text-center min-w-[120px]">
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 text-[10px] font-bold text-slate-700">
                  Depositor Signature
                </div>
              </div>

              {/* Center Right: Cashier / Accountant Signature */}
              <div className="text-center min-w-[130px]">
                <div className="h-6 flex items-center justify-center">
                  <span className="text-[9px] font-black uppercase text-emerald-700 border border-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50">
                    PAID & VERIFIED
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] font-bold text-slate-800">
                  Cashier / Accountant
                </div>
              </div>

              {/* Right: Principal / Trustee Signature & Official Seal */}
              <div className="text-center min-w-[150px]">
                <div className="h-6 flex items-center justify-center">
                  <span className="text-[8px] font-extrabold uppercase text-slate-600">
                    FOR ZEP FOUNDATION
                  </span>
                </div>
                <div className="border-t-2 border-slate-900 pt-1 text-[10px] font-black text-slate-950">
                  {inst.signatoryTitle}
                  <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                    Authorised Signatory
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white rounded-b-3xl flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px] font-medium hidden sm:block">
            Print Format: Standard A4 Single Sheet &bull; Verified Institution Ledger Transaction
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        </div>

      </div>

      {/* Scoped CSS for Printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-fee-receipt,
          #printable-fee-receipt * {
            visibility: visible !important;
          }
          #printable-fee-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: 2px solid #0f172a !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
};
