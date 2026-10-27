import React, { useState, useMemo } from 'react';
import {
  Printer,
  X,
  FileSpreadsheet,
  Download,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Tag,
  Layers,
  FileText,
} from 'lucide-react';
import { ExamSeatingAllocation } from '../types';
import { TrustLogo } from './TrustLogo';

interface PrintableExamSeatingModalProps {
  allocations: ExamSeatingAllocation[];
  initialExamName?: string;
  initialRoomNo?: string;
  onClose: () => void;
}

export const PrintableExamSeatingModal: React.FC<PrintableExamSeatingModalProps> = ({
  allocations,
  initialExamName = 'ALL',
  initialRoomNo = 'ALL',
  onClose,
}) => {
  const [selectedExam, setSelectedExam] = useState<string>(initialExamName);
  const [selectedRoom, setSelectedRoom] = useState<string>(initialRoomNo);
  const [printTemplate, setPrintTemplate] = useState<'CHART' | 'DESK_STICKERS' | 'ATTENDANCE_REGISTER'>('CHART');

  // Unique exams and rooms for filter dropdowns
  const examOptions = useMemo(() => {
    const set = new Set<string>();
    allocations.forEach((a) => {
      if (a.examName) set.add(a.examName);
    });
    return Array.from(set);
  }, [allocations]);

  const roomOptions = useMemo(() => {
    const set = new Set<string>();
    allocations.forEach((a) => {
      if (a.roomNo) set.add(a.roomNo);
    });
    return Array.from(set);
  }, [allocations]);

  // Filtered allocations based on selections
  const filteredAllocations = useMemo(() => {
    return allocations.filter((a) => {
      const matchExam = selectedExam === 'ALL' || a.examName === selectedExam;
      const matchRoom = selectedRoom === 'ALL' || a.roomNo === selectedRoom;
      return matchExam && matchRoom;
    });
  }, [allocations, selectedExam, selectedRoom]);

  // Determine current metadata
  const currentExamTitle = selectedExam !== 'ALL' ? selectedExam : (examOptions[0] || 'Term-End Examination (October 2026)');
  const sampleAllocation = filteredAllocations[0] || allocations[0];
  const examDate = sampleAllocation?.examDate || new Date().toISOString().split('T')[0];
  const examTime = sampleAllocation?.examTime || '10:00 AM - 01:00 PM (Morning Session)';
  const subjectName = sampleAllocation?.subject || 'Comprehensive Academic Assessment';
  const currentRoom = selectedRoom !== 'ALL' ? selectedRoom : 'All Examination Halls';
  const invigilator = sampleAllocation?.invigilatorName || 'Prof. R. S. Kulkarni & Room Invigilators';

  // Group by Room if "ALL" is selected, so each room can render with clear headers
  const roomsInSelection = useMemo(() => {
    const map = new Map<string, ExamSeatingAllocation[]>();
    filteredAllocations.forEach((item) => {
      const key = item.roomNo || 'Main Examination Hall';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return map;
  }, [filteredAllocations]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Sr No',
      'Roll No',
      'Student Name',
      'Exam Name',
      'Subject',
      'Date',
      'Time',
      'Room No',
      'Bench No',
      'Hall Ticket No',
      'Class',
      'Status',
    ];

    const rows = filteredAllocations.map((a, idx) => [
      a.srNo || idx + 1,
      `"${a.rollNo}"`,
      `"${a.studentName}"`,
      `"${a.examName}"`,
      `"${a.subject || ''}"`,
      `"${a.examDate || ''}"`,
      `"${a.examTime || ''}"`,
      `"${a.roomNo}"`,
      `"${a.benchNo}"`,
      `"${a.hallTicketNo}"`,
      `"${a.classOrGrade || ''}"`,
      `"${a.attendanceStatus || 'ALLOCATED'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const sanitizedExam = currentExamTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `Exam_Seating_Arrangement_${sanitizedExam}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto animate-scale-in flex flex-col max-h-[96vh]">
        
        {/* NON-PRINTABLE TOP CONTROLS */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  Official Exam Seating Arrangement Print Studio
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200">
                  A4 Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Standard format with Exam Name, Sr No, Roll No & Student Name for notice boards, doors & desks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Template Selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-0.5 flex text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setPrintTemplate('CHART')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  printTemplate === 'CHART'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Door / Notice Chart
              </button>
              <button
                type="button"
                onClick={() => setPrintTemplate('DESK_STICKERS')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  printTemplate === 'DESK_STICKERS'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Desk Stickers (स्लिप्स)
              </button>
              <button
                type="button"
                onClick={() => setPrintTemplate('ATTENDANCE_REGISTER')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  printTemplate === 'ATTENDANCE_REGISTER'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Attendance Register
              </button>
            </div>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>

            {/* Print Trigger */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document (Ctrl + P)</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NON-PRINTABLE FILTER CONTROLS BAR */}
        <div className="p-3.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Exam Filter:</span>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Examinations ({allocations.length})</option>
                {examOptions.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Room / Hall:</span>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Rooms ({roomOptions.length})</option>
                {roomOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredAllocations.length}</strong> candidate seats
          </div>
        </div>

        {/* PRINTABLE PREVIEW SCROLL CONTAINER */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200/50">
          {/* Printable Document Sheet (Only this element prints via #printable-seating-chart) */}
          <div
            id="printable-seating-chart"
            className="bg-white mx-auto shadow-md border border-slate-300 p-6 sm:p-8 max-w-[210mm] min-h-[297mm] text-slate-900 text-xs font-sans"
            style={{ boxSizing: 'border-box' }}
          >
            {/* ======================================================== */}
            {/* TEMPLATE 1: DOOR & NOTICE BOARD SEATING CHART */}
            {/* ======================================================== */}
            {printTemplate === 'CHART' && (
              <div className="space-y-6">
                {/* Official Letterhead Header */}
                <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrustLogo variant="emblem" size="xs" />
                    <span className="text-[11px] font-black tracking-widest uppercase text-slate-600">
                      ZEP EDUCATION TRUST, BHOSE (SOLAPUR)
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase font-serif">
                    SARASWATI INTERNATIONAL PUBLIC SCHOOL & IMPERIAL COLLEGE
                  </h1>
                  <div className="text-[10px] text-slate-600 font-medium tracking-wide">
                    Affiliated to Maharashtra State Board / MSBTE & Solapur University • Center Code: 1482 / AISHE: C-58914
                  </div>
                  <div className="inline-block mt-1 px-3 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded-sm uppercase tracking-wider">
                    CENTRAL EXAMINATION COMMITTEE • SEATING ARRANGEMENT & ATTENDANCE CHART
                  </div>
                </div>

                {/* Exam Particulars Banner (Highlighting the Exam Name) */}
                <div className="border border-slate-900 bg-slate-50/70 p-3.5 rounded-sm space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-300 pb-2">
                    <div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">EXAMINATION NAME</div>
                      <div className="text-base sm:text-lg font-black text-slate-900 uppercase">
                        {currentExamTitle}
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">ACADEMIC SESSION</div>
                      <div className="text-xs font-black text-slate-900">2026-2027 (FIRST HALF)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[9px] uppercase">Subject / Paper:</span>
                      <strong className="text-slate-900">{subjectName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[9px] uppercase">Date of Examination:</span>
                      <strong className="text-slate-900">{examDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[9px] uppercase">Exam Timing:</span>
                      <strong className="text-slate-900">{examTime}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[9px] uppercase">Room / Examination Hall:</span>
                      <strong className="text-slate-900">{currentRoom}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-700">
                    <div>
                      Invigilator In-Charge: <strong>{invigilator}</strong>
                    </div>
                    <div>
                      Total Candidates Benched: <strong>{filteredAllocations.length}</strong>
                    </div>
                  </div>
                </div>

                {/* Group by Room Tables */}
                {Array.from(roomsInSelection.entries()).map(([roomName, roomAllocations], roomIdx) => (
                  <div key={roomName} className={`space-y-2 ${roomIdx > 0 ? 'pt-4 border-t-2 border-dashed border-slate-300' : ''}`}>
                    <div className="flex items-center justify-between bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      <span>Hall / Room: {roomName}</span>
                      <span>Total Seats: {roomAllocations.length}</span>
                    </div>

                    {/* Standard Table with Sr No, Roll No, Student Name */}
                    <table className="w-full border-collapse border border-slate-900 text-[10px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-center">
                          <th className="border border-slate-900 px-2 py-1.5 w-10">Sr. No.</th>
                          <th className="border border-slate-900 px-2 py-1.5 w-20">Roll No.</th>
                          <th className="border border-slate-900 px-3 py-1.5 text-left">Student Name</th>
                          <th className="border border-slate-900 px-2 py-1.5 w-24">Hall Ticket No.</th>
                          <th className="border border-slate-900 px-2 py-1.5 w-20">Bench No.</th>
                          <th className="border border-slate-900 px-2 py-1.5 w-24">Class / Dept</th>
                          <th className="border border-slate-900 px-2 py-1.5 w-28">Candidate Signature</th>
                          <th className="border border-slate-900 px-1 py-1.5 w-10">Verify</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomAllocations.map((item, index) => (
                          <tr key={item.id} className="border-b border-slate-400 hover:bg-slate-50">
                            {/* Sr No */}
                            <td className="border border-slate-900 px-2 py-1.5 text-center font-mono font-bold text-slate-800">
                              {item.srNo || index + 1}
                            </td>
                            {/* Roll No */}
                            <td className="border border-slate-900 px-2 py-1.5 text-center font-mono font-black text-slate-900">
                              {item.rollNo}
                            </td>
                            {/* Student Name */}
                            <td className="border border-slate-900 px-3 py-1.5 font-bold text-slate-950 uppercase">
                              {item.studentName}
                            </td>
                            {/* Hall Ticket No */}
                            <td className="border border-slate-900 px-2 py-1.5 text-center font-mono text-slate-700">
                              {item.hallTicketNo}
                            </td>
                            {/* Bench No */}
                            <td className="border border-slate-900 px-2 py-1.5 text-center font-bold text-slate-900">
                              {item.benchNo}
                            </td>
                            {/* Class */}
                            <td className="border border-slate-900 px-2 py-1.5 text-center text-slate-700">
                              {item.classOrGrade}
                            </td>
                            {/* Candidate Signature Box */}
                            <td className="border border-slate-900 px-2 py-1.5 text-center text-slate-400 font-serif italic">
                              <span className="text-[9px] block border-b border-dotted border-slate-400 h-4"></span>
                            </td>
                            {/* Invigilator Checkbox */}
                            <td className="border border-slate-900 px-1 py-1.5 text-center font-mono">
                              <div className="w-3.5 h-3.5 border border-slate-600 mx-auto rounded-xs"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

                {/* Candidate Regulations & Notice */}
                <div className="border border-slate-300 p-2.5 rounded-sm bg-slate-50/50 text-[9px] text-slate-600 leading-tight space-y-1">
                  <div className="font-bold text-slate-800 uppercase tracking-wider">Notice for Candidates:</div>
                  <p>
                    1. Candidates must occupy their designated seats at least 15 minutes prior to the commencement of the exam.
                  </p>
                  <p>
                    2. No candidates will be permitted to enter the examination hall after 30 minutes from the start time.
                  </p>
                  <p>
                    3. Mobile phones, smartwatches, digital devices, and books/study material are strictly prohibited.
                  </p>
                  <p>
                    4. Hall Ticket and Valid Student ID Card must remain visible on the top-right corner of the desk throughout the assessment.
                  </p>
                </div>

                {/* Statutory Examination Authority Signatures */}
                <div className="pt-8 border-t border-slate-400 grid grid-cols-3 gap-6 text-center text-[10px] text-slate-800 font-bold">
                  <div className="space-y-8">
                    <div className="border-b border-slate-900 pb-1 h-8"></div>
                    <div>
                      <div>Room Invigilator / Supervisor</div>
                      <div className="text-[8px] text-slate-500 font-normal">Signature & Date</div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="border-b border-slate-900 pb-1 h-8"></div>
                    <div>
                      <div>Chief Examination Conductor</div>
                      <div className="text-[8px] text-slate-500 font-normal">Center Superintendent</div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="border-b border-slate-900 pb-1 h-8"></div>
                    <div>
                      <div>Controller of Examinations / Principal</div>
                      <div className="text-[8px] text-slate-500 font-normal">Official Seal & Signature</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TEMPLATE 2: DESK & BENCH STICKER SLIPS (DESK LABELS) */}
            {/* ======================================================== */}
            {printTemplate === 'DESK_STICKERS' && (
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-slate-400">
                  <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
                    EXAMINATION DESK & BENCH ALLOCATION STICKERS
                  </h2>
                  <p className="text-[10px] text-slate-600">
                    Exam: <strong>{currentExamTitle}</strong> • Cut along dashed lines and affix to each student desk
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {filteredAllocations.map((item, idx) => (
                    <div
                      key={item.id}
                      className="border-2 border-dashed border-slate-800 p-3 rounded-md bg-white space-y-2 relative"
                    >
                      {/* Top Bar */}
                      <div className="flex items-center justify-between border-b border-slate-300 pb-1 text-[9px] font-bold uppercase text-slate-600">
                        <span>ZEP EDUCATION TRUST</span>
                        <span>DESK SLIP #{item.srNo || idx + 1}</span>
                      </div>

                      {/* Exam Name */}
                      <div className="text-[10px] font-black text-slate-900 uppercase truncate">
                        {item.examName}
                      </div>

                      {/* Big Candidate Roll & Name */}
                      <div className="bg-slate-100 p-2 rounded-sm border border-slate-300">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">ROLL NO:</span>
                          <span className="text-lg font-black font-mono text-slate-950 tracking-wider">
                            {item.rollNo}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">STUDENT NAME:</span>
                          <span className="text-xs font-black text-slate-950 uppercase leading-snug block">
                            {item.studentName}
                          </span>
                        </div>
                      </div>

                      {/* Desk & Hall Details */}
                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div>
                          <span className="text-slate-500 block">Allocated Bench:</span>
                          <strong className="text-xs text-orange-700 font-black">{item.benchNo}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Hall / Room:</span>
                          <strong className="text-slate-900">{item.roomNo}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Hall Ticket:</span>
                          <strong className="font-mono text-slate-800">{item.hallTicketNo}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Class / Dept:</span>
                          <strong className="text-slate-800">{item.classOrGrade}</strong>
                        </div>
                      </div>

                      {/* Footer Aesthetic Barcode */}
                      <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[8px] font-mono text-slate-500">
                        <span>DATE: {item.examDate || examDate}</span>
                        <span>BARCODE: *{item.hallTicketNo}*</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TEMPLATE 3: ATTENDANCE & ANSWER BOOKLET REGISTER */}
            {/* ======================================================== */}
            {printTemplate === 'ATTENDANCE_REGISTER' && (
              <div className="space-y-5">
                <div className="border-b-2 border-slate-900 pb-2 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <TrustLogo variant="emblem" size="xs" />
                    <span className="text-[10px] font-bold uppercase text-slate-600">
                      ZEP EDUCATION TRUST • CONTROLLER OF EXAMINATIONS
                    </span>
                  </div>
                  <h2 className="text-lg font-black uppercase text-slate-900">
                    EXAMINATION HALL ATTENDANCE & ANSWER BOOKLET REGISTER
                  </h2>
                  <div className="text-[10px] font-medium text-slate-700">
                    Exam: <strong>{currentExamTitle}</strong> | Room: <strong>{currentRoom}</strong> | Date: <strong>{examDate}</strong>
                  </div>
                </div>

                <table className="w-full border-collapse border border-slate-900 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-center">
                      <th className="border border-slate-900 px-2 py-1.5 w-10">Sr.</th>
                      <th className="border border-slate-900 px-2 py-1.5 w-20">Roll No.</th>
                      <th className="border border-slate-900 px-3 py-1.5 text-left">Student Name</th>
                      <th className="border border-slate-900 px-2 py-1.5 w-20">Bench No.</th>
                      <th className="border border-slate-900 px-2 py-1.5 w-24">Answer Book Sl #</th>
                      <th className="border border-slate-900 px-2 py-1.5 w-16">Supplements</th>
                      <th className="border border-slate-900 px-2 py-1.5 w-24">Attendance</th>
                      <th className="border border-slate-900 px-2 py-1.5 w-28">Student Sign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllocations.map((item, index) => (
                      <tr key={item.id} className="border-b border-slate-400">
                        <td className="border border-slate-900 px-2 py-1.5 text-center font-mono font-bold">
                          {item.srNo || index + 1}
                        </td>
                        <td className="border border-slate-900 px-2 py-1.5 text-center font-mono font-black">
                          {item.rollNo}
                        </td>
                        <td className="border border-slate-900 px-3 py-1.5 font-bold uppercase">
                          {item.studentName}
                        </td>
                        <td className="border border-slate-900 px-2 py-1.5 text-center font-bold">
                          {item.benchNo}
                        </td>
                        <td className="border border-slate-900 px-2 py-1.5 text-center">
                          <span className="block border-b border-dotted border-slate-400 h-3 w-16 mx-auto"></span>
                        </td>
                        <td className="border border-slate-900 px-2 py-1.5 text-center">
                          <span className="block border-b border-dotted border-slate-400 h-3 w-8 mx-auto"></span>
                        </td>
                        <td className="border border-slate-900 px-2 py-1.5 text-center font-bold">
                          <span className="text-[9px] text-slate-500">[ P / A ]</span>
                        </td>
                        <td className="border border-slate-900 px-2 py-1.5 text-center">
                          <span className="block border-b border-dotted border-slate-400 h-4"></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Invigilator Certificate */}
                <div className="border border-slate-900 p-3 rounded-sm space-y-2 text-[10px] text-slate-800">
                  <div className="font-bold uppercase tracking-wider">Invigilator Certificate & Summary:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>Total Candidates Allocated: <strong>{filteredAllocations.length}</strong></div>
                    <div>Total Present: <strong>_______</strong></div>
                    <div>Total Absent: <strong>_______</strong></div>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <div>
                      <div>Invigilator Name: __________________________</div>
                      <div className="text-[9px] text-slate-500">Designation / Staff ID</div>
                    </div>
                    <div>
                      <div>Invigilator Signature: __________________________</div>
                      <div className="text-[9px] text-slate-500">Signed at end of exam session</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM MODAL BAR */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-3xl">
          <span className="text-xs text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Ctrl + P</kbd> to open system print dialog
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close Preview
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
