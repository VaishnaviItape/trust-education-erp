import React, { useState, useEffect } from 'react';
import {
  Bus,
  Navigation,
  Phone,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  Plus,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { BusRoute } from '../types';

interface BusFleetModuleProps {
  busRoute: BusRoute;
  onSimulateBusStep: () => void;
}

export const BusFleetModule: React.FC<BusFleetModuleProps> = ({
  busRoute,
  onSimulateBusStep,
}) => {
  const [stops, setStops] = useState(busRoute.stops);
  const [editingStop, setEditingStop] = useState<{ index: number; name: string; time: string; passed: boolean } | null>(null);
  const [deletingStop, setDeletingStop] = useState<{ index: number; name: string } | null>(null);

  useEffect(() => {
    setStops(busRoute.stops);
  }, [busRoute.stops]);
  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              School Transport Fleet
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live GPS Streaming Active
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Live School Bus Fleet Tracking</h2>
          <p className="text-xs text-slate-500">
            Real-time GPS coordinates, vehicle telemetry, and stop checkpoints for student safety.
          </p>
        </div>

        <button
          onClick={onSimulateBusStep}
          className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          Simulate Bus Movement Step
        </button>
      </div>

      {/* 2. Primary Telemetry & Driver Card */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Bus & Driver Info */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-slate-900 text-base">{busRoute.busNumber}</div>
              <div className="text-xs text-slate-500 font-semibold">{busRoute.routeName}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Driver:</span>
              <span className="font-bold text-slate-900">{busRoute.driverName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Driver Phone:</span>
              <a
                href={`tel:${busRoute.driverPhone}`}
                className="text-orange-600 font-bold flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3" />
                {busRoute.driverPhone}
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Trip Status:</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                {busRoute.activeTrip ? 'ON ROUTE (MORNING PICKUP)' : 'IDLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Live Speed & Telemetry */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Real-Time Vehicle Speed
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{busRoute.currentSpeed.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-500">km / h</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (busRoute.currentSpeed / 60) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500">Speed limit capped at 40 km/h in school zone</div>

          <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600 flex justify-between">
            <span>Lat: {busRoute.currentLat.toFixed(5)}</span>
            <span>Lng: {busRoute.currentLng.toFixed(5)}</span>
          </div>
        </div>

        {/* Card 3: Safety & Camera Feed Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Safety & CCTV Systems
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium">
              <span>Speed Governor:</span>
              <span className="font-bold text-emerald-700">Compliant (MH RTO)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 text-slate-700 font-medium">
              <span>Cabin CCTV:</span>
              <span className="font-bold text-slate-800">2 Cameras Online</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 text-slate-700 font-medium">
              <span>First Aid Kit:</span>
              <span className="font-bold text-slate-800">Inspected (Oct 2026)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Route Checkpoints & Stops Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-sm">
            Route Checkpoint Timeline & ETA
          </h3>
          <button
            type="button"
            onClick={() => {
              setEditingStop({
                index: stops.length,
                name: 'New Campus Checkpoint',
                time: '08:45 AM',
                passed: false,
              });
            }}
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Stop
          </button>
        </div>

        <div className="grid sm:grid-cols-5 gap-3">
          {stops.map((stop, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all text-xs ${
                stop.passed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50/70 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-400">Stop #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingStop({ index: idx, ...stop })}
                    className="p-0.5 rounded text-slate-400 hover:text-amber-700 hover:bg-amber-100/60 transition-colors cursor-pointer"
                    title="Edit Stop"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingStop({ index: idx, name: stop.name })}
                    className="p-0.5 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-100/60 transition-colors cursor-pointer"
                    title="Delete Stop"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {stop.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-0.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
                  )}
                </div>
              </div>
              <div className="font-bold truncate">{stop.name}</div>
              <div className="text-[11px] text-slate-500 mt-1">Scheduled: {stop.time}</div>
              <div
                className={`text-[10px] font-bold mt-2 uppercase ${
                  stop.passed ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {stop.passed ? 'Departed' : 'Upcoming'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Edit Stop */}
      {editingStop && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {editingStop.index < stops.length ? 'Edit Checkpoint Stop' : 'Add Checkpoint Stop'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStop(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingStop.index < stops.length) {
                  setStops((prev) =>
                    prev.map((s, i) => (i === editingStop.index ? { name: editingStop.name, time: editingStop.time, passed: editingStop.passed } : s))
                  );
                } else {
                  setStops((prev) => [...prev, { name: editingStop.name, time: editingStop.time, passed: editingStop.passed }]);
                }
                setEditingStop(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Stop / Landmark Name *</label>
                <input
                  type="text"
                  required
                  value={editingStop.name}
                  onChange={(e) => setEditingStop({ ...editingStop, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Scheduled Time (e.g. 08:15 AM) *</label>
                <input
                  type="text"
                  required
                  value={editingStop.time}
                  onChange={(e) => setEditingStop({ ...editingStop, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingStop.passed}
                    onChange={(e) => setEditingStop({ ...editingStop, passed: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-bold text-slate-700">Already Passed / Departed</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStop(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Stop</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Stop Confirmation */}
      {deletingStop && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Checkpoint Stop</h3>
                <p className="text-xs text-slate-500">Remove stop from bus route</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs">
              <div className="font-bold text-slate-900">{deletingStop.name}</div>
              <div className="text-rose-700 pt-1 text-[11px]">
                Are you sure you want to delete Stop #{deletingStop.index + 1} from this route?
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingStop(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStops((prev) => prev.filter((_, i) => i !== deletingStop.index));
                  setDeletingStop(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
