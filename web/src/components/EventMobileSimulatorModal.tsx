import React, { useState } from 'react';
import {
  Smartphone,
  X,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Play,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { EventBroadcast, EventBroadcastService } from '../utils/eventBroadcastService';

interface EventMobileSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventId?: string;
}

export const EventMobileSimulatorModal: React.FC<EventMobileSimulatorModalProps> = ({
  isOpen,
  onClose,
  selectedEventId,
}) => {
  const [events, setEvents] = useState<EventBroadcast[]>(() => EventBroadcastService.getEvents());
  const [activeTab, setActiveTab] = useState<'FEED' | 'DETAIL'>('FEED');
  const [activeEvent, setActiveEvent] = useState<EventBroadcast | null>(() => {
    const all = EventBroadcastService.getEvents();
    if (selectedEventId) {
      const found = all.find((e) => e.id === selectedEventId);
      if (found) return found;
    }
    return all[0] || null;
  });
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [mobileRole, setMobileRole] = useState<'STUDENT' | 'PARENT'>('STUDENT');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [parentRsvp, setParentRsvp] = useState<'ATTENDING' | 'REQUEST_RESCHEDULE' | null>('ATTENDING');

  if (!isOpen) return null;

  const handleSelectEvent = (evt: EventBroadcast) => {
    setActiveEvent(evt);
    setActiveTab('DETAIL');
    setActivePhotoIdx(null);
  };

  const handleLike = (evtId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!likedMap[evtId]) {
      EventBroadcastService.likeEvent(evtId);
      setLikedMap((prev) => ({ ...prev, [evtId]: true }));
      setEvents(EventBroadcastService.getEvents());
      if (activeEvent && activeEvent.id === evtId) {
        setActiveEvent({ ...activeEvent, likesCount: activeEvent.likesCount + 1 });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl p-5 max-w-4xl w-full shadow-2xl border border-slate-700 flex flex-col md:flex-row gap-6 items-center justify-center relative">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer z-20"
          title="Close Simulator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Control Panel / Info */}
        <div className="md:w-5/12 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-orange-500 font-extrabold uppercase tracking-wider text-[11px]">
            <Smartphone className="w-4 h-4" />
            <span>Live Student Mobile App Simulator</span>
          </div>
          <h2 className="text-xl font-black text-white leading-tight">
            How Students & Parents See Your Circulars & Galleries
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every event circular, Dandiya notice, sports day schedule, photo album, and video recap published by the <strong>Trustee Board or Principal</strong> appears instantly inside the mobile app for <strong>over 1,200 enrolled students and parents</strong>.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Device Persona
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMobileRole('STUDENT')}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileRole === 'STUDENT'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span>👨‍🍳 Student App</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileRole('PARENT')}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileRole === 'PARENT'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span>👨‍👩‍👦 Parent App</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Push Notifications on event publish</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full-screen swipeable photo lightbox</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>In-app video reels & highlight player</span>
            </div>
          </div>
        </div>

        {/* Right: Phone Frame Simulator */}
        <div className="w-[320px] h-[640px] bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700 shrink-0">
          {/* Dynamic Island / Camera Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          </div>

          {/* Phone Status Bar */}
          <div className="h-9 px-6 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-bold z-30 shrink-0">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* App Header Bar */}
          <div className="bg-orange-600 px-4 py-2.5 text-white flex items-center justify-between shadow-md shrink-0 z-20">
            <div className="flex items-center gap-2">
              {activeTab === 'DETAIL' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('FEED');
                    setActivePhotoIdx(null);
                  }}
                  className="p-1 -ml-1 text-white hover:bg-orange-700 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h4 className="font-extrabold text-xs tracking-tight">Shree Saraswati Trust</h4>
                <p className="text-[9px] text-orange-200">
                  {mobileRole === 'STUDENT' ? 'Student Portal' : 'Parent Mobile App'}
                </p>
              </div>
            </div>
            <Bell className="w-3.5 h-3.5 text-white" />
          </div>

          {/* Push Notification Toast Simulator */}
          <div className="mx-3 mt-1.5 p-2 bg-slate-900/90 border border-orange-500/30 rounded-xl text-[10px] flex items-center gap-2 shadow-lg animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-white">Trustee Board Broadcast:</span>{' '}
              <span className="text-slate-300">New circular & event photos live!</span>
            </div>
          </div>

          {/* Phone Body (Scrollable Screen) */}
          <div className="flex-1 overflow-y-auto erp-table-scroll p-3 space-y-3 text-slate-900 bg-slate-100">
            {/* VIEW 1: FEED OF ALL EVENTS */}
            {activeTab === 'FEED' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <h5 className="font-black text-slate-900 tracking-tight text-xs flex items-center gap-1">
                    <span>🎉 Campus Events & Notices</span>
                  </h5>
                  <span className="text-[10px] text-slate-500 font-bold">{events.length} Live</span>
                </div>

                {/* When Persona is PARENT: Show PTM Meeting Notification Card with RSVP */}
                {mobileRole === 'PARENT' && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-md space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider">
                        🔔 New Parent Meeting Scheduled
                      </span>
                      <span className="text-[9px] font-bold text-orange-100">Class 10-A</span>
                    </div>

                    <div>
                      <h4 className="font-black text-xs leading-snug">
                        इयत्ता १० वी प्रथम सत्र निकाल व पालक सभा / Term 1 PTM
                      </h4>
                      <div className="mt-1 space-y-0.5 text-[10px] text-orange-100">
                        <div>📅 <strong>Date:</strong> 28 Oct 2026 • 10:30 AM</div>
                        <div>🏫 <strong>Venue:</strong> Room 102 & Google Meet</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/20 space-y-1.5">
                      <div className="text-[9px] font-bold text-orange-100">
                        Submit Attendance Confirmation (RSVP):
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setParentRsvp('ATTENDING')}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            parentRsvp === 'ATTENDING'
                              ? 'bg-white text-orange-800 shadow-xs'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {parentRsvp === 'ATTENDING' ? '✓ Attending (होय)' : '✓ Attending'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setParentRsvp('REQUEST_RESCHEDULE')}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            parentRsvp === 'REQUEST_RESCHEDULE'
                              ? 'bg-white text-orange-800 shadow-xs'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {parentRsvp === 'REQUEST_RESCHEDULE' ? '✓ Rescheduled' : 'Reschedule'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt)}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:border-orange-500 transition-all cursor-pointer group"
                  >
                    {/* Event Cover Image */}
                    <div className="h-32 w-full relative overflow-hidden bg-slate-800">
                      <img
                        src={evt.coverImage}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            evt.status === 'UPCOMING'
                              ? 'bg-amber-500 text-white'
                              : evt.status === 'ONGOING'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {evt.status}
                        </span>
                        {evt.urgent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                            Urgent
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <h6 className="font-extrabold text-xs leading-tight drop-shadow-md">
                          {evt.title}
                        </h6>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-2.5 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <Calendar className="w-3 h-3 text-orange-600" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {evt.venue.slice(0, 20)}...
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Photo Gallery Thumbnails Preview */}
                      {evt.photos.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-orange-600" />
                            <span className="text-[10px] font-bold text-slate-700">
                              {evt.photos.length} Event Photos
                            </span>
                          </div>
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {evt.photos.slice(0, 3).map((p, i) => (
                              <img
                                key={i}
                                src={p.url}
                                alt="thumb"
                                className="w-5 h-5 rounded-full object-cover border border-white"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Video clip banner */}
                      {evt.videos.length > 0 && (
                        <div className="px-2 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-800 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Film className="w-3 h-3 text-orange-600" /> Video Highlights Available
                          </span>
                          <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-mono">
                            Play
                          </span>
                        </div>
                      )}

                      {/* Footer: Likes & Read Notice */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => handleLike(evt.id, e)}
                          className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                            likedMap[evt.id] ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedMap[evt.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                          <span>{evt.likesCount}</span>
                        </button>
                        <span className="text-orange-600 font-extrabold flex items-center gap-0.5">
                          View Details & Gallery &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 2: FULL EVENT DETAILS & MEDIA GALLERY */}
            {activeTab === 'DETAIL' && activeEvent && (
              <div className="space-y-3 pb-4">
                {/* Cover Banner */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm bg-slate-900">
                  <img
                    src={activeEvent.coverImage}
                    alt={activeEvent.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-orange-600 rounded-full">
                      {activeEvent.category} • {activeEvent.status}
                    </span>
                    <h5 className="font-black text-sm mt-1 leading-snug drop-shadow-sm">
                      {activeEvent.title}
                    </h5>
                  </div>
                </div>

                {/* Event Schedule Info Pills */}
                <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 text-[10px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span><strong>Date:</strong> {activeEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span><strong>Time:</strong> {activeEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate"><strong>Venue:</strong> {activeEvent.venue}</span>
                  </div>
                </div>

                {/* Detailed Circular Content */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h6 className="font-extrabold text-[11px] text-slate-900">Official Notice & Circular</h6>
                  <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                    {activeEvent.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Issued By: {activeEvent.postedBy}</span>
                    <span className="text-orange-600 font-bold">{activeEvent.postedRole}</span>
                  </div>
                </div>

                {/* Video Clip Player */}
                {activeEvent.videos.length > 0 && (
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-orange-600" />
                      <h6 className="font-extrabold text-[11px] text-slate-900">Event Video Reel & Highlights</h6>
                    </div>
                    {activeEvent.videos.map((vid, i) => (
                      <div key={i} className="rounded-xl overflow-hidden bg-black border border-slate-300">
                        <video
                          src={vid.url}
                          controls
                          className="w-full h-36 object-contain"
                          poster={vid.thumbnailUrl}
                        />
                        <div className="p-2 bg-slate-900 text-white flex items-center justify-between text-[10px]">
                          <span className="font-bold truncate">{vid.title}</span>
                          {vid.duration && (
                            <span className="font-mono text-slate-400">{vid.duration}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Photo Gallery Grid */}
                {activeEvent.photos.length > 0 && (
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                        <h6 className="font-extrabold text-[11px] text-slate-900">
                          Photo Gallery ({activeEvent.photos.length})
                        </h6>
                      </div>
                      <span className="text-[9px] text-slate-400">Tap to expand</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {activeEvent.photos.map((p, idx) => (
                        <div
                          key={p.id}
                          onClick={() => setActivePhotoIdx(idx)}
                          className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group cursor-pointer"
                        >
                          <img
                            src={p.url}
                            alt={p.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                          <div className="absolute bottom-1 right-1 p-1 bg-black/60 rounded text-white">
                            <Maximize2 className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lightbox / Expanded Photo View */}
                    {activePhotoIdx !== null && activeEvent.photos[activePhotoIdx] && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-900 text-white space-y-2">
                        <div className="relative rounded-lg overflow-hidden h-44">
                          <img
                            src={activeEvent.photos[activePhotoIdx].url}
                            alt={activeEvent.photos[activePhotoIdx].caption}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setActivePhotoIdx(null)}
                            className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <p className="text-slate-300 font-medium">
                            {activeEvent.photos[activePhotoIdx].caption}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={activePhotoIdx === 0}
                              onClick={() => setActivePhotoIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))}
                              className="p-1 bg-slate-800 rounded disabled:opacity-40"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={activePhotoIdx === activeEvent.photos.length - 1}
                              onClick={() => setActivePhotoIdx((prev) => (prev !== null && prev < activeEvent.photos.length - 1 ? prev + 1 : prev))}
                              className="p-1 bg-slate-800 rounded disabled:opacity-40"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Like & WhatsApp Action Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleLike(activeEvent.id)}
                    className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[activeEvent.id] ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                    <span>{activeEvent.likesCount} Likes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const shareText = `*${activeEvent.title}*\n${activeEvent.date} at ${activeEvent.venue}\n${activeEvent.description}\nView photos & videos on Trust Mobile App!`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Mobile Tab Bar */}
          <div className="h-12 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[9px] text-slate-500 font-bold shrink-0">
            <div className="flex flex-col items-center text-orange-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Events</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </div>
            <div className="flex flex-col items-center">
              <Bell className="w-3.5 h-3.5" />
              <span>Notices</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
