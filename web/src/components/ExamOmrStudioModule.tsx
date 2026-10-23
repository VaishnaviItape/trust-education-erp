import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Scan,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  Camera,
  Layers,
  Award,
  Hash,
} from 'lucide-react';
import { useTableSort, SortableTh } from './TableSort';

export const ExamOmrStudioModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'OMR_SCANNER' | 'ANSWER_KEYS' | 'ONLINE_EXAM' | 'SEATING'>('OMR_SCANNER');
  const [selectedScanModal, setSelectedScanModal] = useState<any | null>(null);

  // OMR Answer Key
  const [answerKey, setAnswerKey] = useState<Record<string, string>>({
    '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
    '6': 'B', '7': 'C', '8': 'A', '9': 'D', '10': 'B',
  });
  const [positiveMark, setPositiveMark] = useState(1.0);
  const [negativeMark, setNegativeMark] = useState(0.25);

  // Scanned OMR Records
  const [scans, setScans] = useState([
    {
      id: 'scan-01',
      studentName: 'Aarav Sharma',
      rollNo: '7A-01',
      subject: 'Science & Thermal Thermodynamics',
      setCode: 'SET_A',
      recognizedAnswers: {
        '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
        '6': 'B', '7': 'C', '8': 'C', '9': 'D', '10': 'B',
      },
      correctCount: 9,
      wrongCount: 1,
      unattemptedCount: 0,
      score: 8.75, // 9 - 0.25
      maxScore: 10,
      percentage: 87.5,
      confidenceScore: 99.2,
    },
    {
      id: 'scan-02',
      studentName: 'Ananya Patel',
      rollNo: '7A-02',
      subject: 'Science & Thermal Thermodynamics',
      setCode: 'SET_A',
      recognizedAnswers: {
        '1': 'A', '2': 'C', '3': 'B', '4': 'D', '5': 'A',
        '6': 'B', '7': 'C', '8': 'A', '9': 'D', '10': 'B',
      },
      correctCount: 10,
      wrongCount: 0,
      unattemptedCount: 0,
      score: 10.0,
      maxScore: 10,
      percentage: 100.0,
      confidenceScore: 99.8,
    },
  ]);

  // Online Exam Sample Question (with Math & Formula)
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});

  const {
    sortedData: sortedScans,
    sortKey: scanSortKey,
    sortDirection: scanSortDir,
    handleSort: handleScanSort,
  } = useTableSort(scans);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Examinations, Online Tests & OMR Computer Vision
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                AI Vision + Anchors
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Corner alignment anchors, answer keys with +/- marks, scanned bubble verification modal & seating matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('OMR_SCANNER')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Scan OMR Batch
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'OMR_SCANNER', label: 'OMR Vision Scanner & Results' },
          { id: 'ANSWER_KEYS', label: 'Answer Key & Penalty Marking' },
          { id: 'ONLINE_EXAM', label: 'Online Test Engine (LaTeX Math)' },
          { id: 'SEATING', label: 'Conflict-Free Seating Matrix' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === t.id
                ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: OMR COMPUTER VISION SCANNER */}
      {activeSubTab === 'OMR_SCANNER' && (
        <div className="space-y-4">
          {/* Visual Sheet Anchor Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wider">
                OMR Corner Anchor Specification
              </span>
              <h3 className="text-base font-bold text-slate-900">
                4-Corner Fiducial Anchor Computer Vision Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                TrustEdu ERP prints high-contrast black square fiducial markers at all four corners of every
                OMR sheet. When teachers photograph sheets via mobile camera or flatbed scanner, the backend
                auto-corrects skew, perspective, and optical distortion before thresholding bubble darkness.
              </p>
            </div>

            {/* Visual Mini OMR Sheet Graphic */}
            <div className="w-48 h-32 rounded-2xl bg-white border-2 border-slate-300 p-2 relative shadow-inner shrink-0 flex flex-col justify-between">
              {/* 4 Corner Anchors */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-slate-900"></div>
              <div className="absolute top-1 right-1 w-3 h-3 bg-slate-900"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 bg-slate-900"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-slate-900"></div>

              <div className="text-[8px] font-bold text-slate-800 text-center uppercase tracking-tighter">
                TrustEdu OMR - 100 Q
              </div>

              <div className="space-y-1 my-auto">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[7px] font-mono text-slate-600">Q1</span>
                  <div className="w-2 h-2 rounded-full border border-slate-800 bg-slate-900"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[7px] font-mono text-slate-600">Q2</span>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800 bg-slate-900"></div>
                  <div className="w-2 h-2 rounded-full border border-slate-800"></div>
                </div>
              </div>

              <div className="text-[6px] text-center text-slate-400 font-mono">
                FIDUCIAL ALIGNED • 300 DPI
              </div>
            </div>
          </div>

          {/* Scanned Results Table */}
          <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recognized OMR Scans & Auto-Scoring
              </h3>
            </div>
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="rollNo" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" className="w-12" />
                    <SortableTh label="Candidate / Roll" sortKey="studentName" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} />
                    <SortableTh label="Subject & Set" sortKey="subject" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} />
                    <SortableTh label="Correct" sortKey="correctCount" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" />
                    <SortableTh label="Wrong (-0.25)" sortKey="wrongCount" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" />
                    <SortableTh label="Computed Score" sortKey="score" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="right" />
                    <SortableTh label="AI Confidence" sortKey="confidenceScore" currentKey={scanSortKey} direction={scanSortDir} onSort={handleScanSort} align="center" />
                    <th className="p-3.5 text-center">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedScans.map((s, index) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{s.studentName}</div>
                        <div className="text-[10px] font-mono text-orange-600">{s.rollNo}</div>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        {s.subject} ({s.setCode})
                      </td>
                      <td className="p-3.5 text-center text-emerald-700 font-bold font-mono">
                        {s.correctCount}
                      </td>
                      <td className="p-3.5 text-center text-rose-700 font-bold font-mono">
                        {s.wrongCount}
                      </td>
                      <td className="p-3.5 text-right font-black text-slate-900 font-mono">
                        {s.score} / {s.maxScore} ({s.percentage}%)
                      </td>
                      <td className="p-3.5 text-center text-slate-600 font-mono">
                        {s.confidenceScore}%
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setSelectedScanModal(s)}
                          className="flex items-center gap-1 mx-auto px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Bubbles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ANSWER KEYS & PENALTY MARKING */}
      {activeSubTab === 'ANSWER_KEYS' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Master Answer Key & Scoring Policy</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Positive Marks per Correct Answer
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={positiveMark}
                  onChange={(e) => setPositiveMark(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-emerald-700 font-bold font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Negative Penalty per Wrong Answer
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={negativeMark}
                  onChange={(e) => setNegativeMark(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-rose-700 font-bold font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-700 mb-2">Question-by-Question Key (1 - 10):</div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {Object.keys(answerKey).map((qNo) => (
                  <div key={qNo} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-mono">Q{qNo}</div>
                    <div className="text-sm font-black text-orange-600 font-mono mt-0.5">
                      {answerKey[qNo]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ONLINE EXAM ENGINE WITH MATHEMATICAL EQUATIONS */}
      {activeSubTab === 'ONLINE_EXAM' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                Time-Limited Online Test
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Thermodynamics & Food Chemistry Midterm Exam
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-mono text-xs font-bold text-orange-700 border border-slate-200">
              ⏱ 42:15 Remaining
            </div>
          </div>

          {/* MathLive / KaTeX equation sample */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-500">QUESTION 1:</div>
              <div className="text-sm font-medium text-slate-800">
                In thermal pastry baking, calculate the heat required using the specific heat capacity formula:
              </div>

              {/* KaTeX Styled Equation Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center font-mono text-amber-900 text-sm">
                {"\\( Q = m \\cdot c \\cdot \\Delta T \\) \u00A0\u00A0 where \u00A0\u00A0 \\( \\Delta T = T_{oven} - T_{ambient} \\)"}
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { opt: 'A', text: 'Q represents thermal energy absorbed in Joules (J)' },
                  { opt: 'B', text: 'Q represents pressure in atmospheres (atm)' },
                  { opt: 'C', text: 'Q represents chemical acidity pH' },
                  { opt: 'D', text: 'None of the above' },
                ].map((choice) => (
                  <label
                    key={choice.opt}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer text-xs text-slate-800 transition-colors shadow-2xs"
                  >
                    <input
                      type="radio"
                      name="q1"
                      checked={examAnswers['1'] === choice.opt}
                      onChange={() => setExamAnswers({ ...examAnswers, '1': choice.opt })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-bold text-orange-600 font-mono">({choice.opt})</span>
                    <span>{choice.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CONFLICT-FREE SEATING MATRIX */}
      {activeSubTab === 'SEATING' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Automated Anti-Collusion Seating Matrix</h3>
          <p className="text-xs text-slate-500">
            Enforces zero adjacent roll numbers by interleaving School Standard 10 and College Hotel Management students.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { bench: 'Bench 1A', student: 'Aarav Sharma (School 7A)', color: 'text-orange-600' },
              { bench: 'Bench 1B', student: 'Kabir Verma (College HM)', color: 'text-amber-700' },
              { bench: 'Bench 2A', student: 'Ananya Patel (School 7A)', color: 'text-orange-600' },
              { bench: 'Bench 2B', student: 'Pooja Kulkarni (College HM)', color: 'text-amber-700' },
            ].map((b, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">{b.bench}</div>
                <div className={`text-xs font-bold ${b.color}`}>{b.student}</div>
                <div className="text-[10px] font-mono text-slate-400">Hall Ticket #HT-{idx + 101}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSPECT BUBBLES VISUAL VERIFICATION MODAL */}
      {selectedScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scan className="w-4 h-4 text-orange-600" /> OMR Bubble Recognition Inspector
              </h3>
              <button onClick={() => setSelectedScanModal(null)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Candidate: <strong>{selectedScanModal.studentName}</strong> • Roll: {selectedScanModal.rollNo} • Score: {selectedScanModal.score}/{selectedScanModal.maxScore}
            </div>

            {/* Bubble grid showing recognized values vs answer key */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {Object.keys(selectedScanModal.recognizedAnswers).map((qNo) => {
                const rec = selectedScanModal.recognizedAnswers[qNo];
                const key = answerKey[qNo];
                const isCorrect = rec === key;

                return (
                  <div
                    key={qNo}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500">Q{qNo}:</span>
                      <span className="font-bold text-slate-900">Marked: [{rec}]</span>
                      <span className="text-slate-500">• Key: [{key}]</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? '+1.0 Correct' : '-0.25 Penalty'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedScanModal(null)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer border border-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
