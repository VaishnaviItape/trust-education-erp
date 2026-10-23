import React, { useState } from 'react';
import { useTableSort, SortableTh } from './TableSort';
import {
  Fingerprint,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  Moon,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Send,
} from 'lucide-react';

export const BiometricsAttendanceModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'DEVICES' | 'STAFF_SHIFTS' | 'HOSTEL_CURFEW'>('DEVICES');

  // Hardware Biometric Devices
  const [devices, setDevices] = useState([
    {
      id: 'dev-01',
      name: 'Main Campus Gate Turnstile #1',
      branch: 'Modern Public School & Jr College Bhose',
      ip: '192.168.10.45:4370',
      protocol: 'MQTT Edge Stream',
      status: 'ONLINE',
      lastPing: '2 seconds ago',
      punchesToday: 412,
    },
    {
      id: 'dev-02',
      name: 'College Basic Training Kitchen Ingress',
      branch: 'Modern College of HM & Tech Solapur',
      ip: '192.168.20.12:4370',
      protocol: 'WebSocket Push',
      status: 'ONLINE',
      lastPing: '4 seconds ago',
      punchesToday: 188,
    },
    {
      id: 'dev-03',
      name: 'Boys Hostel Night Turnstile',
      branch: 'Trust Campus Residency',
      ip: '192.168.30.88:4370',
      protocol: 'ZK TCP Daemon',
      status: 'ONLINE',
      lastPing: '10 seconds ago',
      punchesToday: 94,
    },
  ]);

  // Staff Shift Calculation Records
  const [staffShifts, setStaffShifts] = useState([
    {
      id: 'staff-01',
      name: 'Principal Sunita Kulkarni',
      role: 'School Principal',
      inTime: '07:48 AM',
      outTime: '04:15 PM',
      totalHours: '8h 27m',
      status: 'ON_TIME',
      isLate: false,
      halfDay: false,
    },
    {
      id: 'staff-02',
      name: 'Chef Sanjeev Menon',
      role: 'Director & Executive Chef',
      inTime: '08:04 AM',
      outTime: '05:30 PM',
      totalHours: '9h 26m',
      status: 'WITHIN_GRACE',
      isLate: false,
      halfDay: false,
    },
    {
      id: 'staff-03',
      name: 'Priya Joshi',
      role: 'Accountant',
      inTime: '08:24 AM',
      outTime: '04:45 PM',
      totalHours: '8h 21m',
      status: 'LATE_MARK',
      isLate: true,
      halfDay: false,
    },
  ]);

  const {
    sortedData: sortedStaffShifts,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort(staffShifts, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  // Hostel Nightly Curfew
  const [curfewRecords, setCurfewRecords] = useState([
    { id: 'curf-01', studentName: 'Rohan Deshmukh', room: 'Tagore Block 102', punchTime: '09:12 PM', status: 'IN_ROOM' },
    { id: 'curf-02', studentName: 'Aditya More', room: 'Tagore Block 105', punchTime: '09:24 PM', status: 'IN_ROOM' },
    { id: 'curf-03', studentName: 'Nikhil Patil', room: 'Tagore Block 104', punchTime: 'UNACCOUNTED', status: 'ABSENT_ALERT' },
  ]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Hardware Biometrics & Attendance Engine
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                MQTT / Edge Stream
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Decoupled edge punch buffering, staff biometric shift calculation & nightly hostel curfew
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Edge Daemon Live
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('DEVICES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'DEVICES'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Biometric Hardware Devices ({devices.length})
        </button>
        <button
          onClick={() => setActiveSubTab('STAFF_SHIFTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'STAFF_SHIFTS'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Staff Biometric Shifts & Late Marks
        </button>
        <button
          onClick={() => setActiveSubTab('HOSTEL_CURFEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'HOSTEL_CURFEW'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Hostel Nightly Curfew (9:30 PM Cutoff)
        </button>
      </div>

      {/* TAB 1: BIOMETRIC DEVICES */}
      {activeSubTab === 'DEVICES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((dev) => (
            <div key={dev.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-600" /> {dev.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Ping: {dev.lastPing}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{dev.name}</h3>
                <div className="text-xs text-slate-500">{dev.branch}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                <div>IP/Port: <span className="text-orange-700 font-bold">{dev.ip}</span></div>
                <div>Protocol: {dev.protocol}</div>
                <div>Today's Punches: <span className="text-slate-900 font-bold">{dev.punchesToday}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Edge Buffer: Zero Drop</span>
                <button className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-3 h-3" /> Ping Device
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: STAFF BIOMETRIC SHIFT CALCULATIONS */}
      {activeSubTab === 'STAFF_SHIFTS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between text-xs text-slate-700 shadow-xs">
            <div>
              <strong>Shift Policy:</strong> 08:00 AM - 04:00 PM • Grace: 15 mins (Up to 08:15 AM) • 3 Late Marks = 0.5 Day Loss of Pay
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-bold border-b border-slate-200 shadow-2xs">
                <tr>
                  <SortableTh label="Sr. No." sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center p-3.5" />
                  <SortableTh label="Employee Name & Role" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Biometric In" sortKey="inTime" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Biometric Out" sortKey="outTime" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Total Duration" sortKey="totalHours" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="p-3.5" />
                  <SortableTh label="Shift Evaluation" sortKey="status" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="p-3.5 text-center" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedStaffShifts.map((s, index) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.role}</div>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 font-bold">{s.inTime}</td>
                    <td className="p-3.5 font-mono text-amber-700 font-bold">{s.outTime}</td>
                    <td className="p-3.5 font-mono text-slate-700">{s.totalHours}</td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          s.isLate
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOSTEL NIGHTLY CURFEW */}
      {activeSubTab === 'HOSTEL_CURFEW' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Moon className="w-4 h-4 text-amber-600" />
              <span><strong>Night Curfew Rules:</strong> Cutoff at 09:30 PM sharp. Missing students trigger automated warden SMS alert.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curfewRecords.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border space-y-3 shadow-xs ${
                  c.status === 'ABSENT_ALERT'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-white border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.studentName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'ABSENT_ALERT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">{c.room}</div>
                <div className="text-xs font-bold text-slate-700">Punch Logged: {c.punchTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
