// ==============================================================================
// Trust Education ERP - Event Circulars, Photo & Video Broadcasting Service
// Used by Superadmin / Trustee / Principal to publish event circulars, photos
// and videos directly to students' and parents' mobile apps.
// ==============================================================================

export interface EventPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

export interface EventVideo {
  id: string;
  title: string;
  url: string;
  embedType: 'YOUTUBE' | 'MP4' | 'REEL';
  thumbnailUrl?: string;
  duration?: string;
}

export interface EventBroadcast {
  id: string;
  title: string;
  category: 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'EXAMINATION' | 'CELEBRATION' | 'CULINARY';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  date: string;
  time: string;
  venue: string;
  branchScope: 'ALL' | 'SCHOOL' | 'COLLEGE';
  targetAudience: 'All Campuses (Students & Parents)' | 'School Students & Parents' | 'College Students (HM & Tech)' | 'Faculty & Staff';
  postedBy: string;
  postedRole: 'Trustee Board' | 'Principal' | 'Campus Administrator';
  description: string;
  coverImage: string;
  photos: EventPhoto[];
  videos: EventVideo[];
  urgent: boolean;
  publishedToMobile: boolean;
  whatsappSynced: boolean;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
}

const STORAGE_KEY = 'trust_erp_broadcast_events_v1';

export const INITIAL_BROADCAST_EVENTS: EventBroadcast[] = [
  {
    id: 'evt-dandiya-2026',
    title: '✨ Grand Navratri Dandiya Raas-Garba Utsav 2026',
    category: 'CULTURAL',
    status: 'COMPLETED',
    date: 'Oct 22, 2026',
    time: '06:30 PM - 10:30 PM',
    venue: 'Modern Public School Open Air Amphitheatre & Sports Ground, Bhose',
    branchScope: 'ALL',
    targetAudience: 'All Campuses (Students & Parents)',
    postedBy: 'Dr. Rajesh Patil (Trustee & Chairman)',
    postedRole: 'Trustee Board',
    description:
      'Zep Foundation Bhose successfully hosted the Grand Navratri Dandiya Raas 2026! Over 1,200 students from Modern Public School and Modern College of HM & Tech joined with families in traditional attire. Special congratulations to the Best Traditional Attire and Best Garba Steps prize winners! Photos and live video recap are now published below for all students & parents.',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    photos: [
      {
        id: 'p-dan-1',
        url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        caption: 'Students performing traditional Raas Garba in traditional Solapuri attire',
        uploadedAt: 'Oct 22, 09:15 PM',
      },
      {
        id: 'p-dan-2',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        caption: 'Illuminated campus amphitheatre with over 1,200 student and parent attendees',
        uploadedAt: 'Oct 22, 09:40 PM',
      },
      {
        id: 'p-dan-3',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        caption: 'Trustee & Principal felicitation ceremony with Best Dancer trophy presentation',
        uploadedAt: 'Oct 22, 10:10 PM',
      },
      {
        id: 'p-dan-4',
        url: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80',
        caption: 'Hospitality Management College student chef stall serving festive delicacies',
        uploadedAt: 'Oct 22, 10:25 PM',
      },
    ],
    videos: [
      {
        id: 'v-dan-1',
        title: 'Grand Dandiya Night 2026 Official Highlights & Drone Campus Reel',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        embedType: 'MP4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        duration: '03:45',
      },
    ],
    urgent: false,
    publishedToMobile: true,
    whatsappSynced: true,
    likesCount: 348,
    viewsCount: 1520,
    createdAt: '2026-10-22T22:30:00Z',
  },
  {
    id: 'evt-sports-tomorrow',
    title: '🏃‍♂️ Tomorrow: Annual Inter-Trust Athletic & Sports Championship 2026',
    category: 'SPORTS',
    status: 'UPCOMING',
    date: 'Tomorrow, Oct 24, 2026',
    time: '07:30 AM - 04:30 PM',
    venue: 'Modern Sports Complex, Solapur Highway Campus',
    branchScope: 'ALL',
    targetAudience: 'All Campuses (Students & Parents)',
    postedBy: 'Principal Sunita Kulkarni',
    postedRole: 'Principal',
    description:
      'Official Circular: All students from Std 5th to 12th and College semesters must report in proper sports uniform by 07:15 AM tomorrow. Bus fleet routes will pick up 30 minutes early. Track & Field, 100m sprint, Relay, Long Jump and Cricket tournament rounds begin after the flag march. Parents are cordially invited to cheer from the main pavilion!',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    photos: [
      {
        id: 'p-spo-1',
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        caption: 'Synthetic athletic track prepared for 100m sprint heats',
        uploadedAt: 'Today, 04:00 PM',
      },
      {
        id: 'p-spo-2',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        caption: 'Inter-house football ground ready for championship finals',
        uploadedAt: 'Today, 04:30 PM',
      },
    ],
    videos: [
      {
        id: 'v-spo-1',
        title: 'Sports Championship Guidelines & March-Past Rules Briefing',
        url: 'https://www.w3schools.com/html/movie.mp4',
        embedType: 'MP4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
        duration: '02:15',
      },
    ],
    urgent: true,
    publishedToMobile: true,
    whatsappSynced: true,
    likesCount: 215,
    viewsCount: 980,
    createdAt: '2026-10-23T08:00:00Z',
  },
  {
    id: 'evt-culinary-expo',
    title: '👨‍🍳 State MasterChef & French Patisserie Masterclass Live Expo',
    category: 'CULINARY',
    status: 'COMPLETED',
    date: 'Oct 19, 2026',
    time: '10:00 AM - 03:00 PM',
    venue: 'Advanced Bakery & Confectionery Lab 1, Modern College of HM & Tech',
    branchScope: 'COLLEGE',
    targetAudience: 'College Students (HM & Tech)',
    postedBy: 'Chef Vikram Salunkhe (HOD Hotel Management)',
    postedRole: 'Campus Administrator',
    description:
      'Guest MasterChef Demonstration: Celebrity Pastry Chef Alain Dubost conducted a 5-hour hands-on masterclass on artisanal sourdough bread sculpting and mirror-glaze entremets. All 1st, 2nd, and 3rd year B.Sc H&HA students received official course certificates.',
    coverImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    photos: [
      {
        id: 'p-cul-1',
        url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
        caption: 'Chef Alain demonstrating sourdough scoring and temperature control',
        uploadedAt: 'Oct 19, 12:30 PM',
      },
      {
        id: 'p-cul-2',
        url: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80',
        caption: 'Student display of hand-crafted Belgian chocolate entremets',
        uploadedAt: 'Oct 19, 02:45 PM',
      },
    ],
    videos: [],
    urgent: false,
    publishedToMobile: true,
    whatsappSynced: true,
    likesCount: 194,
    viewsCount: 740,
    createdAt: '2026-10-19T16:00:00Z',
  },
];

export const EventBroadcastService = {
  getEvents(): EventBroadcast[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load broadcast events from storage', err);
    }
    this.saveEvents(INITIAL_BROADCAST_EVENTS);
    return INITIAL_BROADCAST_EVENTS;
  },

  saveEvents(events: EventBroadcast[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      // Dispatch custom storage event for live reactive update across components
      window.dispatchEvent(new Event('trust_broadcast_events_updated'));
    } catch (err) {
      console.error('Failed to save broadcast events', err);
    }
  },

  addEvent(
    data: Omit<EventBroadcast, 'id' | 'createdAt' | 'likesCount' | 'viewsCount'>
  ): EventBroadcast {
    const events = this.getEvents();
    const newEvent: EventBroadcast = {
      ...data,
      id: `evt-${Date.now()}`,
      likesCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEvent, ...events];
    this.saveEvents(updated);
    return newEvent;
  },

  deleteEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    this.saveEvents(events);
  },

  addPhotosToEvent(id: string, photos: EventPhoto[]): void {
    const events = this.getEvents().map((e) => {
      if (e.id === id) {
        return {
          ...e,
          photos: [...e.photos, ...photos],
        };
      }
      return e;
    });
    this.saveEvents(events);
  },

  addVideoToEvent(id: string, video: EventVideo): void {
    const events = this.getEvents().map((e) => {
      if (e.id === id) {
        return {
          ...e,
          videos: [...e.videos, video],
        };
      }
      return e;
    });
    this.saveEvents(events);
  },

  likeEvent(id: string): void {
    const events = this.getEvents().map((e) => {
      if (e.id === id) {
        return { ...e, likesCount: e.likesCount + 1 };
      }
      return e;
    });
    this.saveEvents(events);
  },

  resetDefaults(): EventBroadcast[] {
    this.saveEvents(INITIAL_BROADCAST_EVENTS);
    return INITIAL_BROADCAST_EVENTS;
  },
};
