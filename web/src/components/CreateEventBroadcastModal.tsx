import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Film,
  Calendar,
  Clock,
  MapPin,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Smartphone,
  Share2,
} from 'lucide-react';
import { EventBroadcast, EventBroadcastService, EventPhoto } from '../utils/eventBroadcastService';

interface CreateEventBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventBroadcast) => void;
}

export const CreateEventBroadcastModal: React.FC<CreateEventBroadcastModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventBroadcast['category']>('CULTURAL');
  const [status, setStatus] = useState<EventBroadcast['status']>('COMPLETED');
  const [date, setDate] = useState('Oct 24, 2026');
  const [time, setTime] = useState('06:00 PM - 10:00 PM');
  const [venue, setVenue] = useState('Modern Campus Main Amphitheatre & Sports Ground, Bhose');
  const [branchScope, setBranchScope] = useState<EventBroadcast['branchScope']>('ALL');
  const [targetAudience, setTargetAudience] = useState<EventBroadcast['targetAudience']>(
    'All Campuses (Students & Parents)'
  );
  const [postedBy, setPostedBy] = useState('Dr. Rajesh Patil (Trustee & Chairman)');
  const [postedRole, setPostedRole] = useState<EventBroadcast['postedRole']>('Trustee Board');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80'
  );
  const [photos, setPhotos] = useState<Array<{ url: string; caption: string }>>([
    {
      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      caption: 'Traditional Garba round by students in Solapuri attire',
    },
    {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      caption: 'Campus stage lighting & student band performance',
    },
  ]);
  const [videoTitle, setVideoTitle] = useState('Dandiya Night Official Highlights Reel');
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [urgent, setUrgent] = useState(false);
  const [publishToMobile, setPublishToMobile] = useState(true);
  const [syncWhatsApp, setSyncWhatsApp] = useState(true);

  if (!isOpen) return null;

  // Preset quick fill for Dandiya
  const handleLoadDandiyaPreset = () => {
    setTitle('✨ Grand Navratri Dandiya Raas-Garba Utsav 2026');
    setCategory('CULTURAL');
    setStatus('COMPLETED');
    setDate('Oct 22, 2026');
    setTime('06:30 PM - 10:30 PM');
    setVenue('Modern Public School Open Air Amphitheatre, Bhose');
    setBranchScope('ALL');
    setTargetAudience('All Campuses (Students & Parents)');
    setPostedBy('Dr. Rajesh Patil (Trustee & Chairman)');
    setPostedRole('Trustee Board');
    setDescription(
      'Zep Foundation Bhose organized a grand Navratri Dandiya celebration for all students and parents of Modern Public School and Modern College of HM & Tech. Over 1,200 attendees took part with energetic music, dance competitions, and special prizes for Best Costume and Best Steps! Photos and video highlights are published below.'
    );
    setCoverImage('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80');
    setPhotos([
      {
        url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        caption: 'Students performing traditional Garba in colorfulSolapuri attire',
      },
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        caption: 'Festive amphitheatre lighting with parent and student attendees',
      },
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        caption: 'Trustee award ceremony and trophy presentation',
      },
      {
        url: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80',
        caption: 'Hotel Management student chef stall serving hot delicacies',
      },
    ]);
    setVideoTitle('Grand Dandiya Night 2026 Official Highlights & Drone Reel');
    setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
  };

  // Preset quick fill for Tomorrow's Event
  const handleLoadTomorrowEventPreset = () => {
    setTitle('🏃‍♂️ Tomorrow: Annual Inter-Trust Athletic & Sports Championship 2026');
    setCategory('SPORTS');
    setStatus('UPCOMING');
    setDate('Tomorrow, Oct 24, 2026');
    setTime('07:30 AM - 04:30 PM');
    setVenue('Modern Sports Complex & Athletic Ground, Solapur Highway Campus');
    setBranchScope('ALL');
    setTargetAudience('All Campuses (Students & Parents)');
    setPostedBy('Principal Sunita Kulkarni');
    setPostedRole('Principal');
    setDescription(
      'Official Circular: All students from Std 5th to 12th and College semesters must report in proper sports uniform by 07:15 AM tomorrow. Bus fleet routes will pick up 30 minutes early. Track & Field, 100m sprint, Relay, Long Jump and Cricket tournament rounds begin after the flag march. Parents are cordially invited to cheer from the main pavilion!'
    );
    setCoverImage('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80');
    setPhotos([
      {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        caption: 'Synthetic athletic track prepared for 100m sprint heats',
      },
      {
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        caption: 'Inter-house championship stadium ready for final games',
      },
    ]);
    setVideoTitle('Championship Rules & March-Past Guidelines');
    setVideoUrl('https://www.w3schools.com/html/movie.mp4');
    setUrgent(true);
  };

  const handleAddPhotoField = () => {
    setPhotos([...photos, { url: '', caption: '' }]);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handlePhotoChange = (idx: number, field: 'url' | 'caption', val: string) => {
    const updated = [...photos];
    updated[idx][field] = val;
    setPhotos(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const formattedPhotos: EventPhoto[] = photos
      .filter((p) => p.url.trim().length > 0)
      .map((p, i) => ({
        id: `p-${Date.now()}-${i}`,
        url: p.url.trim(),
        caption: p.caption || `Event photo ${i + 1}`,
        uploadedAt: 'Just now',
      }));

    const formattedVideos = videoUrl.trim()
      ? [
          {
            id: `v-${Date.now()}`,
            title: videoTitle || 'Event Video Recap',
            url: videoUrl.trim(),
            embedType: 'MP4' as const,
            duration: '02:30',
          },
        ]
      : [];

    const created = EventBroadcastService.addEvent({
      title,
      category,
      status,
      date,
      time,
      venue,
      branchScope,
      targetAudience,
      postedBy,
      postedRole,
      description,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      photos: formattedPhotos,
      videos: formattedVideos,
      urgent,
      publishedToMobile: publishToMobile,
      whatsappSynced: syncWhatsApp,
    });

    onEventCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Post Event Notice, Photo Gallery & Video Recap
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Instantly broadcast to all student & parent mobile apps and digital notice board
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Batch Fillers */}
        <div className="pt-3 pb-1 flex items-center gap-2 shrink-0 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={handleLoadDandiyaPreset}
            className="px-3 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition-colors cursor-pointer"
          >
            ✨ Dandiya Night Recap with Photos & Video
          </button>
          <button
            type="button"
            onClick={handleLoadTomorrowEventPreset}
            className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
          >
            🏃‍♂️ Tomorrow's Sports Day Notice
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-3 space-y-4 pr-1 text-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Navratri Dandiya Raas-Garba 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              >
                <option value="CULTURAL">Cultural & Festival</option>
                <option value="SPORTS">Sports & Athletics</option>
                <option value="CELEBRATION">Annual Gathering</option>
                <option value="CULINARY">Culinary & Hospitality</option>
                <option value="ACADEMIC">Academic Exhibition</option>
                <option value="EXAMINATION">Examinations & Circular</option>
              </select>
            </div>
          </div>

          {/* Status, Date, Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              >
                <option value="UPCOMING">Upcoming Notice (Countdown)</option>
                <option value="ONGOING">Live Ongoing Event</option>
                <option value="COMPLETED">Completed Gallery & Recap</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="text"
                placeholder="e.g. Tomorrow, Oct 24, 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                placeholder="e.g. 06:30 PM - 10:30 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution Scope</label>
              <select
                value={branchScope}
                onChange={(e) => setBranchScope(e.target.value as any)}
                className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              >
                <option value="ALL">All Campuses (Trust-wide)</option>
                <option value="SCHOOL">School (MPS & JC Bhose)</option>
                <option value="COLLEGE">College (MCHMT Solapur)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Venue / Campus Location</label>
            <input
              type="text"
              placeholder="e.g. Modern Campus Open Air Amphitheatre & Sports Ground, Bhose"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
            />
          </div>

          {/* Description / Circular Text */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Detailed Circular Notice / Event Recap Text *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Write the full event circular, instructions, or recap description for parents and students..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Cover / Banner Poster URL */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Event Cover / Poster Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 font-mono text-[11px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
              {coverImage && (
                <img
                  src={coverImage}
                  alt="preview"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              )}
            </div>
          </div>

          {/* Photo Gallery Uploader Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <ImageIcon className="w-4 h-4 text-orange-600" />
                <span>Event Photo Gallery ({photos.length} Photos)</span>
              </div>
              <button
                type="button"
                onClick={handleAddPhotoField}
                className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Another Photo
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {photos.map((photo, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-mono text-slate-400 font-bold text-[10px] w-4">{idx + 1}</span>
                  <input
                    type="url"
                    placeholder="Photo Image URL (https://...)"
                    value={photo.url}
                    onChange={(e) => handlePhotoChange(idx, 'url', e.target.value)}
                    className="flex-1 font-mono text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50"
                  />
                  <input
                    type="text"
                    placeholder="Photo caption (e.g. Dandiya dance rounds)"
                    value={photo.caption}
                    onChange={(e) => handlePhotoChange(idx, 'caption', e.target.value)}
                    className="flex-1 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50"
                  />
                  {photo.url && (
                    <img
                      src={photo.url}
                      alt="thumb"
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Video Highlights Section */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
              <Film className="w-4 h-4 text-orange-600" />
              <span>Event Video Reel & Highlights (MP4 or YouTube)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Video Title (e.g. Grand Dandiya Reel 2026)"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
              />
              <input
                type="url"
                placeholder="Video URL (https://...mp4 or YouTube)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Broadcast Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                checked={publishToMobile}
                onChange={(e) => setPublishToMobile(e.target.checked)}
                className="rounded text-orange-600"
              />
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>Push to Student Mobile App</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                checked={syncWhatsApp}
                onChange={(e) => setSyncWhatsApp(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Broadcast on WhatsApp</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="rounded text-rose-600"
              />
              <span>Urgent Priority Alert</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Event Circular & Gallery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
