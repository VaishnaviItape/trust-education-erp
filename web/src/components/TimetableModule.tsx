import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Plus,
  ShieldAlert,
  Sparkles,
  DoorOpen,
} from 'lucide-react';
import { checkTimetableConflicts } from '../utils/domainMath';
import { ClassTeacherAllocationStudio } from './ClassTeacherAllocationStudio';

export const TimetableModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GRID' | 'LESSON_PLANS' | 'CLASS_TEACHERS'>('GRID');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [clashError, setClashError] = useState<string | null>(null);

  // Scheduled Slots
  const [slots, setSlots] = useState([
    {
      id: 'tt-1',
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Physics & Thermodynamics',
      teacherId: 'emp-01',
      teacherName: 'Principal Sunita Kulkarni',
      roomId: 'room-301',
      roomName: 'Science Lab 301',
      divisionId: 'div-7a',
      divisionName: 'Class 7-A',
    },
    {
      id: 'tt-2',
      dayOfWeek: 'MONDAY',
      startTime: '10:00',
      endTime: '12:00',
      subject: 'Continental Cooking Practical',
      teacherId: 'emp-02',
      teacherName: 'Chef Sanjeev Menon',
      roomId: 'room-btk',
      roomName: 'Basic Training Kitchen',
      divisionId: 'div-hm-sem3',
      divisionName: 'B.Sc H&HA Sem 3',
    },
    {
      id: 'tt-3',
      dayOfWeek: 'TUESDAY',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'English Literature & Communication',
      teacherId: 'emp-01',
      teacherName: 'Principal Sunita Kulkarni',
      roomId: 'room-301',
      roomName: 'Classroom 301',
      divisionId: 'div-7a',
      divisionName: 'Class 7-A',
    },
  ]);

  // Form State for new slot
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Chemistry',
    teacherId: 'emp-01',
    teacherName: 'Principal Sunita Kulkarni',
    roomId: 'room-202',
    roomName: 'Room 202',
    divisionId: 'div-7b',
    divisionName: 'Class 7-B',
  });

  // Lesson Plans
  const [lessonPlans, setLessonPlans] = useState([
    {
      id: 'lp-01',
      date: '2026-10-21',
      teacher: 'Chef Sanjeev Menon',
      subject: 'Culinary Sciences',
      topic: 'Mother Sauces: Hollandaise & Bearnaise Emulsion Stability',
      status: 'COMPLETED',
      reflection: 'Students achieved successful warm emulsion without curdling. 2 groups needed temperature regulation feedback.',
    },
    {
      id: 'lp-02',
      date: '2026-10-22',
      teacher: 'Principal Sunita Kulkarni',
      subject: 'Physics',
      topic: 'Law of Conservation of Energy & Kinetic Oscillations',
      status: 'SCHEDULED',
      reflection: 'Planned lab demo using pendulum bob sensors.',
    },
  ]);

  const handleScheduleSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setClashError(null);

    // Call domain math conflict detector
    const conflictResult = checkTimetableConflicts(slots, newSlot);

    if (conflictResult.hasConflict) {
      setClashError(conflictResult.conflicts[0].message);
      return;
    }

    const createdSlot = {
      ...newSlot,
      id: `tt-${Date.now()}`,
    };

    setSlots([...slots, createdSlot]);
    setShowScheduleModal(false);
  };

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Timetable, Classrooms & Teacher Diaries
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                Zero Clash Collision Engine
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Interactive grid scheduler enforcing zero overlapping bookings for teachers, rooms, and sections
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setClashError(null);
            setShowScheduleModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Schedule Lecture Slot
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('GRID')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'GRID'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Weekly Timetable Grid
        </button>
        <button
          onClick={() => setActiveTab('LESSON_PLANS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'LESSON_PLANS'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Lesson Plans & Teacher Diaries ({lessonPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('CLASS_TEACHERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'CLASS_TEACHERS'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <DoorOpen className="w-3.5 h-3.5 text-orange-600" />
          Class Teacher & Room Allocations
        </button>
      </div>

      {/* TAB 1: WEEKLY TIMETABLE GRID */}
      {activeTab === 'GRID' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((day) => {
              const daySlots = slots.filter((s) => s.dayOfWeek === day);
              return (
                <div key={day} className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-orange-700 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>{day}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{daySlots.length} Slots</span>
                  </div>

                  <div className="space-y-2.5">
                    {daySlots.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 font-mono">No lectures</div>
                    ) : (
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-orange-300 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-orange-700 font-bold">
                            <span>{slot.startTime} - {slot.endTime}</span>
                            <span className="text-slate-500">{slot.roomName}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900">{slot.subject}</div>
                          <div className="text-[11px] text-slate-600">{slot.teacherName}</div>
                          <div className="text-[10px] font-bold text-amber-700">{slot.divisionName}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LESSON PLANS */}
      {activeTab === 'LESSON_PLANS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonPlans.map((lp) => (
            <div key={lp.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-700 font-mono">{lp.date}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lp.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {lp.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{lp.topic}</h4>
              <div className="text-xs text-slate-500">{lp.teacher} • {lp.subject}</div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900">Teacher Diary Reflection: </strong>
                {lp.reflection}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CLASSROOM & CLASS TEACHER ALLOCATION STUDIO */}
      {activeTab === 'CLASS_TEACHERS' && (
        <div className="pt-2">
          <ClassTeacherAllocationStudio />
        </div>
      )}

      {/* SCHEDULE MODAL WITH CLASH DETECTION */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" /> Schedule Lecture Slot
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            {clashError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Clash Conflict Detected:</strong>
                  <div>{clashError}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleScheduleSlot} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Day of Week</label>
                <select
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Faculty / Teacher</label>
                  <select
                    value={newSlot.teacherId}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        teacherId: e.target.value,
                        teacherName:
                          e.target.value === 'emp-01'
                            ? 'Principal Sunita Kulkarni'
                            : 'Chef Sanjeev Menon',
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="emp-01">Principal Sunita Kulkarni</option>
                    <option value="emp-02">Chef Sanjeev Menon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Room / Lab</label>
                  <select
                    value={newSlot.roomId}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        roomId: e.target.value,
                        roomName: e.target.value === 'room-301' ? 'Science Lab 301' : 'Room 202',
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="room-301">Science Lab 301</option>
                    <option value="room-202">Room 202</option>
                    <option value="room-btk">Basic Training Kitchen</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  Check Clashes & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
