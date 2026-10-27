// ==============================================================================
// Trust Education ERP - Educational Trips, Study Tours & Mobile Alerts Service
// Manages school & college educational excursions, itineraries, packing checklists,
// teacher coordinators, student digital parent consent slips, and real-time mobile push updates.
// ==============================================================================

export interface TripActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
}

export interface TripDayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  activities: TripActivity[];
  mealsProvided: string;
  nightStay: string;
}

export interface TripCoordinator {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
}

export interface TripEnrolledStudent {
  studentId: string;
  name: string;
  gradeOrSemester: string;
  rollNo: string;
  parentName: string;
  parentPhone: string;
  consentStatus: 'GRANTED' | 'PENDING' | 'DECLINED';
  consentGrantedAt?: string;
  feeStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  amountPaid: number;
  medicalNotes?: string;
  dietaryPreference: 'VEG' | 'JAIN' | 'NON_VEG';
}

export interface TripNotification {
  id: string;
  tripId: string;
  title: string;
  message: string;
  timestamp: string;
  location?: string;
  severity: 'INFO' | 'MILESTONE' | 'ALERT';
  sentBy: string;
}

export interface TripItem {
  id: string;
  title: string;
  destination: string;
  category: 'HERITAGE' | 'SCIENCE_ECO' | 'HOSPITALITY_INDUSTRIAL' | 'ADVENTURE';
  branchScope: 'SCHOOL' | 'COLLEGE' | 'ALL';
  targetClasses: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  durationNights: number;
  assemblyTime: string;
  assemblyPoint: string;
  departureTime: string;
  returnEta: string;
  costPerStudent: number;
  totalCapacity: number;
  status: 'PLANNING' | 'REGISTRATION_OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  coverImage: string;
  overview: string;
  itinerary: TripDayItinerary[];
  mandatoryPackingList: string[];
  prohibitedItems: string[];
  safetyGuidelines: string[];
  coordinators: TripCoordinator[];
  emergencyHelpline: string;
  medicalOfficer: string;
  hospitalTieUp: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  gpsTrackingActive: boolean;
  currentGpsStatus?: string;
  enrolledStudents: TripEnrolledStudent[];
  notifications: TripNotification[];
}

const STORAGE_KEY = 'trust_erp_trips_and_tours_v1';

export const INITIAL_TRIPS: TripItem[] = [
  {
    id: 'trip-sch-01',
    title: 'Heritage & Flora Study Tour: Raigad Fort, Pratapgad & Mahabaleshwar',
    destination: 'Raigad Fort, Pratapgad & Mahabaleshwar, Maharashtra',
    category: 'HERITAGE',
    branchScope: 'SCHOOL',
    targetClasses: ['Class 8-A', 'Class 8-B', 'Class 9-A', 'Class 10-A', 'Class 7-A'],
    startDate: '2026-11-12',
    endDate: '2026-11-14',
    durationDays: 3,
    durationNights: 2,
    assemblyTime: '05:30 AM',
    assemblyPoint: 'Modern Public School Main Gate 1, Bhose Campus',
    departureTime: '06:00 AM Sharp',
    returnEta: 'Nov 14, 08:30 PM',
    costPerStudent: 3800,
    totalCapacity: 50,
    status: 'IN_PROGRESS',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    overview:
      'An inspiring 3-day experiential study expedition for middle & high school scholars combining Maratha Empire architectural history, botanical flora observation, and strawberry agro-processing at Mahabaleshwar.',
    itinerary: [
      {
        dayNumber: 1,
        date: 'Day 1 • Nov 12, 2026',
        title: 'Campus Departure, Satara Breakfast & Raigad Fort Coronation Capital Trek',
        activities: [
          {
            id: 'act-1',
            time: '05:30 AM',
            title: 'Reporting & Identity Verification',
            description: 'Students arrive at Bhose campus. Faculty roll call and baggage tags attached.',
            location: 'School Gate 1',
          },
          {
            id: 'act-2',
            time: '06:00 AM',
            title: 'Departure by AC Luxury Coach',
            description: 'Departure via Pandharpur - Satara highway with onboard safety briefing.',
            location: 'Bhose Highway',
          },
          {
            id: 'act-3',
            time: '09:00 AM',
            title: 'Hygienic Breakfast Stop',
            description: 'Hot poha, idli-sambar, fresh bananas, and packaged mineral water.',
            location: 'Highway Plaza Satara',
          },
          {
            id: 'act-4',
            time: '01:30 PM',
            title: 'Raigad Fort Ascent & Ropeway',
            description: 'Ascend to Chhatrapati Shivaji Maharaj Coronation capital via aerial ropeway with certified guides.',
            location: 'Raigad Fort Base',
          },
          {
            id: 'act-5',
            time: '07:30 PM',
            title: 'Hotel Check-in & Evening Reflection',
            description: 'Check-in at Hotel Green Valley Mahabaleshwar. Warm dinner & room allocation.',
            location: 'Hotel Green Valley',
          },
        ],
        mealsProvided: 'Breakfast, Packed Lunch at Raigad MTDC, Buffet Dinner at Hotel',
        nightStay: 'Hotel Green Valley, Mahabaleshwar (Triple sharing AC rooms with separate wings for boys and girls)',
      },
      {
        dayNumber: 2,
        date: 'Day 2 • Nov 13, 2026',
        title: 'Mahabaleshwar Botanical Forest Study, Mapro Agro-Park & Lake',
        activities: [
          {
            id: 'act-6',
            time: '07:30 AM',
            title: 'Morning Nature Walk & Bird Watching',
            description: 'Guided biodiversity walk through evergreen Western Ghats forest.',
            location: 'Lingmala Forest Track',
          },
          {
            id: 'act-7',
            time: '11:00 AM',
            title: 'Mapro Food Processing & Strawberry Farming Study',
            description: 'Educational walkthrough on fruit jam production, cold storage, and hydroponic greenhouse.',
            location: 'Mapro Garden Panchgani',
          },
          {
            id: 'act-8',
            time: '04:00 PM',
            title: 'Venna Lake Boating & Environmental Study',
            description: 'Water reservoir conservation study followed by leisure boating with life-jackets.',
            location: 'Venna Lake',
          },
          {
            id: 'act-9',
            time: '08:00 PM',
            title: 'Campfire & Cultural Talent Evening',
            description: 'Interactive quiz on Maratha history and student cultural performances.',
            location: 'Hotel Amphitheatre',
          },
        ],
        mealsProvided: 'Buffet Breakfast, Lunch at Mapro, Evening High Tea, Gala Dinner',
        nightStay: 'Hotel Green Valley, Mahabaleshwar',
      },
      {
        dayNumber: 3,
        date: 'Day 3 • Nov 14, 2026',
        title: 'Pratapgad Fort Historical Exploration & Return Journey to Bhose',
        activities: [
          {
            id: 'act-10',
            time: '08:30 AM',
            title: 'Pratapgad Fort Heritage Tour',
            description: 'Bhavani Temple, Afzal Khan tomb site, and strategic hill architecture study.',
            location: 'Pratapgad Fort',
          },
          {
            id: 'act-11',
            time: '01:30 PM',
            title: 'Traditional Maharashtrian Lunch',
            description: 'Pithla bhakri, fresh dal, rice, and jaggery dessert at heritage restaurant.',
            location: 'Poladpur Foothills',
          },
          {
            id: 'act-12',
            time: '04:30 PM',
            title: 'Commence Return Journey',
            description: 'Coach departs for Bhose with GPS live tracking shared with all parents.',
            location: 'Satara-Solapur Highway',
          },
          {
            id: 'act-13',
            time: '08:30 PM',
            title: 'Safe Arrival at Bhose School Campus',
            description: 'Parents assemble at main gate for safe student handover and dismissal.',
            location: 'School Gate 1',
          },
        ],
        mealsProvided: 'Buffet Breakfast, Traditional Lunch, Evening Snacks & Juice',
        nightStay: 'Return to Parents / Home',
      },
    ],
    mandatoryPackingList: [
      'Official School Identity Card (Mandatory: Must wear badge around neck throughout the tour)',
      '2 sets of casual comfortable clothes (T-shirts & cotton trousers) + 1 School Sports Tracksuit',
      '1 pair of sturdy walking / trekking sports shoes with grip + 2 pairs of fresh cotton socks',
      'Personal reusable water bottle (Minimum 1 litre capacity)',
      'Light woollen sweater or windcheater jacket (Night temperature drops to 13°C - 15°C in Mahabaleshwar)',
      'Personal toiletries kit: toothbrush, paste, small bathing soap, face towel, and hand sanitizer',
      'Sun cap, UV sunglasses, and small fold-up umbrella',
      'Prescription medicines (if any) clearly labelled in pouch with doctor prescription and parent note',
      'Small student notebook and ballpoint pen for field observations and project diary',
    ],
    prohibitedItems: [
      'Gold jewelry, diamond rings, expensive necklaces or expensive watches (Strictly Prohibited)',
      'Large amounts of cash (Maximum pocket money allowed: ₹ 500 for souvenirs)',
      'Portable video gaming devices, iPads, or expensive gadgets (School will not be liable for loss)',
      'Sharp metal objects, scissors, blades, Swiss knives, or matchboxes/lighters',
      'Outside perishable fast food packets or glass beverage bottles',
    ],
    safetyGuidelines: [
      'Buddy System Enforced: Every student is assigned a tour buddy. Students must stay together at all times and never wander alone.',
      'Roll-Call Protocol: Mandatory headcount at every boarding, de-boarding, meal halt, and hotel check-in/out.',
      'Emergency Health Protocol: Accompanying Registered Medical Doctor carries high-altitude first-aid kit, nebulizer, and ORS.',
      'Strict Curfew: Students must be inside their allocated hotel rooms by 09:30 PM. No room hopping permitted after curfew.',
      'Live GPS Beacon: Tour bus location is permanently synced with the School Transport Control Room and Parent Mobile App.',
    ],
    coordinators: [
      {
        id: 'coord-1',
        name: 'Prof. Sachin Kulkarni',
        role: 'Tour Director & Senior Faculty (Lead In-Charge)',
        phone: '+91 98224 55112',
        email: 'sachin.kulkarni@modernschool.edu.in',
      },
      {
        id: 'coord-2',
        name: 'Mrs. Anjali Deshmukh',
        role: 'Lady Student Welfare & Escort Officer',
        phone: '+91 98221 66778',
        email: 'anjali.deshmukh@modernschool.edu.in',
      },
      {
        id: 'coord-3',
        name: 'Dr. R. K. Patil, MD',
        role: 'Accompanying Medical Officer & First Aid Lead',
        phone: '+91 94230 11990',
        email: 'medical.care@zepfoundation.org',
      },
    ],
    emergencyHelpline: '1800-202-6000 (24x7 Trust Control Room)',
    medicalOfficer: 'Dr. R. K. Patil, MD (+91 94230 11990)',
    hospitalTieUp: 'Satara District Civil Hospital & Mahabaleshwar Rural Hospital (Pre-notified)',
    busNumber: 'MH-12-TR-9901 (Air Suspended 45-Seater Volvo Luxury Coach)',
    driverName: 'Mr. Ramesh Pawar (Govt Heavy Vehicle Certified, 18 yrs exp)',
    driverPhone: '+91 97654 32100',
    gpsTrackingActive: true,
    currentGpsStatus: 'Satara Highway Km 84 • Moving steadily at 58 km/h • Smooth transit',
    enrolledStudents: [
      {
        studentId: 'stu-s01',
        name: 'Aarav Sharma',
        gradeOrSemester: 'Class 7-A',
        rollNo: '7A-01',
        parentName: 'Rajesh Sharma',
        parentPhone: '+91 98221 44556',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 20, 2026 • 11:30 AM',
        feeStatus: 'PAID',
        amountPaid: 3800,
        medicalNotes: 'None. Fit for trekking.',
        dietaryPreference: 'VEG',
      },
      {
        studentId: 'stu-s02',
        name: 'Ananya Patil',
        gradeOrSemester: 'Class 8-A',
        rollNo: '8A-12',
        parentName: 'Suresh Patil',
        parentPhone: '+91 98220 11223',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 21, 2026 • 04:15 PM',
        feeStatus: 'PAID',
        amountPaid: 3800,
        medicalNotes: 'Carries personal asthma inhaler in backpack for cool morning air.',
        dietaryPreference: 'VEG',
      },
      {
        studentId: 'stu-s03',
        name: 'Rohan Deshmukh',
        gradeOrSemester: 'Class 9-A',
        rollNo: '9A-05',
        parentName: 'Vikas Deshmukh',
        parentPhone: '+91 98230 99887',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 21, 2026 • 07:00 PM',
        feeStatus: 'PAID',
        amountPaid: 3800,
        medicalNotes: 'Vegetarian. No food allergies.',
        dietaryPreference: 'VEG',
      },
      {
        studentId: 'stu-s04',
        name: 'Tanvi Kulkarni',
        gradeOrSemester: 'Class 9-A',
        rollNo: '9A-08',
        parentName: 'Milind Kulkarni',
        parentPhone: '+91 98231 66778',
        consentStatus: 'PENDING',
        feeStatus: 'PARTIAL',
        amountPaid: 2000,
        medicalNotes: 'Mild motion sickness on ghat sections. Seated near window.',
        dietaryPreference: 'JAIN',
      },
      {
        studentId: 'stu-s05',
        name: 'Vihaan Joshi',
        gradeOrSemester: 'Class 8-A',
        rollNo: '8A-22',
        parentName: 'Prakash Joshi',
        parentPhone: '+91 98225 33445',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 22, 2026 • 09:10 AM',
        feeStatus: 'PAID',
        amountPaid: 3800,
        medicalNotes: 'All clear. Prefers vegetarian food.',
        dietaryPreference: 'VEG',
      },
      {
        studentId: 'stu-s06',
        name: 'Siddhi Pawar',
        gradeOrSemester: 'Class 10-A',
        rollNo: '10A-14',
        parentName: 'Mahesh Pawar',
        parentPhone: '+91 98232 55667',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 22, 2026 • 02:40 PM',
        feeStatus: 'PAID',
        amountPaid: 3800,
        medicalNotes: 'First Aid team member.',
        dietaryPreference: 'VEG',
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        tripId: 'trip-sch-01',
        title: '📢 Tour Bus Departed Bhose Campus on Schedule',
        message:
          'Tour Bus MH-12-TR-9901 has departed Bhose school campus safely at 06:15 AM. All 42 students boarded after biometric verification. First scheduled halt is Satara for breakfast.',
        timestamp: 'Today, 06:15 AM',
        location: 'Bhose Campus Gate 1',
        severity: 'MILESTONE',
        sentBy: 'Prof. Sachin Kulkarni (Tour Director)',
      },
      {
        id: 'notif-2',
        tripId: 'trip-sch-01',
        title: '🥪 Satara Breakfast Halt Completed Safely',
        message:
          'Students have enjoyed a hot hygienic breakfast (poha, idli-sambar, fresh bananas) at Highway Plaza Satara. All children are hydrated and in high spirits. Coach resuming journey toward Raigad base.',
        timestamp: 'Today, 09:30 AM',
        location: 'Highway Plaza, Satara Bypass',
        severity: 'INFO',
        sentBy: 'Mrs. Anjali Deshmukh (Lady Escort)',
      },
      {
        id: 'notif-3',
        tripId: 'trip-sch-01',
        title: '🏰 Raigad Fort Ascent via Ropeway Commenced',
        message:
          'We have arrived at the base of Raigad Fort. Students are boarding the aerial ropeway in supervised groups of 4 with certified instructors. Weather is clear and pleasant (24°C).',
        timestamp: 'Today, 01:45 PM',
        location: 'Raigad Ropeway Base Station',
        severity: 'MILESTONE',
        sentBy: 'Prof. Sachin Kulkarni (Tour Director)',
      },
      {
        id: 'notif-4',
        tripId: 'trip-sch-01',
        title: '🏨 Hotel Check-In & Room Allocation Complete',
        message:
          'All students have arrived safely at Hotel Green Valley, Mahabaleshwar. Children are settled in their allocated rooms. Dinner will be served in the banquet hall at 08:00 PM followed by student roll call.',
        timestamp: 'Today, 07:15 PM',
        location: 'Hotel Green Valley, Mahabaleshwar',
        severity: 'MILESTONE',
        sentBy: 'Prof. Sachin Kulkarni (Tour Director)',
      },
    ],
  },
  {
    id: 'trip-hm-01',
    title: 'Luxury Hospitality & Viticulture Study Tour: Sula & Radisson Blu, Nashik',
    destination: 'Nashik Wine Valley & 5-Star Luxury Resort, Maharashtra',
    category: 'HOSPITALITY_INDUSTRIAL',
    branchScope: 'COLLEGE',
    targetClasses: ['B.Sc H&HA Semester 4', 'B.Sc H&HA Semester 6', 'Diploma in Bakery Sem 2'],
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    durationDays: 2,
    durationNights: 1,
    assemblyTime: '06:00 AM',
    assemblyPoint: 'Modern College of Hotel Management Campus, Solapur',
    departureTime: '06:30 AM',
    returnEta: 'Nov 29, 09:00 PM',
    costPerStudent: 5200,
    totalCapacity: 40,
    status: 'REGISTRATION_OPEN',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    overview:
      'A professional industry exposure expedition for hotel management scholars. Features backstage kitchen operations tour of Radisson Blu, commercial bakery production line, and grape viticulture & sommelier science masterclass at Sula Vineyards.',
    itinerary: [
      {
        dayNumber: 1,
        date: 'Day 1 • Nov 28, 2026',
        title: 'Transit to Nashik, Sula Processing Plant & Masterclass',
        activities: [
          {
            id: 'act-hm-1',
            time: '06:30 AM',
            title: 'Departure from Solapur HM Campus',
            description: 'Direct AC coach transit with beverage service management briefing.',
            location: 'Solapur Campus',
          },
          {
            id: 'act-hm-2',
            time: '01:00 PM',
            title: 'Viticulture Production Line & Fermentation Cellars Tour',
            description: 'Industrial study of barrel aging cellars, bottling machinery, and quality assurance labs.',
            location: 'Sula Vineyards Nashik',
          },
          {
            id: 'act-hm-3',
            time: '04:30 PM',
            title: 'Sommelier Sensory Tasting & Table Service Workshop',
            description: 'Professional pairing workshop conducted by certified Master Sommelier.',
            location: 'The Tasting Room, Sula',
          },
        ],
        mealsProvided: 'Breakfast Pack, Italian Vineyard Lunch, 4-Course Continental Dinner',
        nightStay: 'Radisson Blu Hotel & Spa Nashik (Executive Twin Rooms)',
      },
      {
        dayNumber: 2,
        date: 'Day 2 • Nov 29, 2026',
        title: '5-Star Hotel Back-of-House Tour & Executive Chef Kitchen Interaction',
        activities: [
          {
            id: 'act-hm-4',
            time: '08:30 AM',
            title: 'Back-of-House Laundry & Housekeeping Inspection',
            description: 'Industrial steam press, chemical store, and Linen inventory SOP masterclass.',
            location: 'Radisson Blu BOH',
          },
          {
            id: 'act-hm-5',
            time: '11:00 AM',
            title: 'Live Commercial Main Kitchen & Banquet Operations',
            description: 'Interaction with Executive Chef on bulk culinary cost control and HACCP hygiene standards.',
            location: 'Main Kitchen Galley',
          },
          {
            id: 'act-hm-6',
            time: '04:00 PM',
            title: 'Commence Return Transit to Solapur',
            description: 'Debriefing session and certificate of industrial completion presentation.',
            location: 'Return Coach',
          },
        ],
        mealsProvided: 'International Breakfast Buffet, Executive Buffet Lunch, High Tea Pack',
        nightStay: 'Return to Solapur Campus',
      },
    ],
    mandatoryPackingList: [
      'Official College Chef Uniform (Blazon Jacket, Chef Cap, Apron & Checkered Trousers)',
      'Black Formal Leather Oxford Shoes (Polished)',
      'College Identity Card with barcode badge',
      'Professional Chef Knife Kit (In secure protective roll bag with luggage tag)',
      'Formal Western Attire for 5-star hotel banquet walkthrough',
      'Laptop / iPad for food costing notes and sommelier presentation logs',
    ],
    prohibitedItems: [
      'Casual beachwear, slippers or round neck tees inside resort partner premises',
      'Alcohol consumption or smoking (Zero tolerance, disciplinary de-registration)',
      'Unsupervised exit from resort boundary after 08:00 PM',
    ],
    safetyGuidelines: [
      'Professional Hospitality Code of Conduct: Students represent Modern College of HM.',
      'Kitchen Safety SOP: Closed slip-resistant shoes required in all galley areas.',
      'Emergency Contact: Lead faculty reachable 24x7 during resort stay.',
    ],
    coordinators: [
      {
        id: 'coord-hm-1',
        name: 'Chef Vikram Salunkhe',
        role: 'Head of Culinary Arts & Industrial Tour Lead',
        phone: '+91 98220 33441',
        email: 'vikram.salunkhe@modernhm.edu.in',
      },
      {
        id: 'coord-hm-2',
        name: 'Prof. Meera Nair',
        role: 'Associate Professor, Food & Beverage Service',
        phone: '+91 98225 77112',
        email: 'meera.nair@modernhm.edu.in',
      },
    ],
    emergencyHelpline: '1800-202-6000 (Zep Foundation Control)',
    medicalOfficer: 'First Aid Certified Escort Faculty',
    hospitalTieUp: 'Apollo Hospital Nashik (Emergency Wing Pre-registered)',
    busNumber: 'MH-14-HM-0418 (AC Deluxe Highway Cruiser)',
    driverName: 'Mr. Santosh Jadhav',
    driverPhone: '+91 98901 22334',
    gpsTrackingActive: false,
    enrolledStudents: [
      {
        studentId: 'stu-hm01',
        name: 'Manish Rawat',
        gradeOrSemester: 'B.Sc H&HA Semester 5',
        rollNo: 'BHM-505',
        parentName: 'Devendra Rawat',
        parentPhone: '+91 99220 99887',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 19, 2026 • 03:00 PM',
        feeStatus: 'PAID',
        amountPaid: 5200,
        medicalNotes: 'None',
        dietaryPreference: 'NON_VEG',
      },
      {
        studentId: 'stu-hm02',
        name: 'Neha Chawla',
        gradeOrSemester: 'B.Sc H&HA Semester 1',
        rollNo: 'BHM-102',
        parentName: 'Harish Chawla',
        parentPhone: '+91 99221 88776',
        consentStatus: 'GRANTED',
        consentGrantedAt: 'Oct 20, 2026 • 01:20 PM',
        feeStatus: 'PAID',
        amountPaid: 5200,
        medicalNotes: 'None',
        dietaryPreference: 'VEG',
      },
    ],
    notifications: [
      {
        id: 'notif-hm-1',
        tripId: 'trip-hm-01',
        title: '📋 Registrations Open for Nashik Hospitality Tour',
        message:
          'Registrations are now open for B.Sc H&HA and Bakery scholars. Total 40 seats allocated on first-come-first-served basis with digital parent permission.',
        timestamp: 'Oct 18, 2026',
        severity: 'INFO',
        sentBy: 'Chef Vikram Salunkhe (Tour Lead)',
      },
    ],
  },
  {
    id: 'trip-sch-02',
    title: 'Regional Science Centre, Planetarium & Siddheshwar Lake Eco-Study',
    destination: 'Solapur Regional Science Park & Wetland Sanctuary',
    category: 'SCIENCE_ECO',
    branchScope: 'SCHOOL',
    targetClasses: ['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B'],
    startDate: '2026-12-05',
    endDate: '2026-12-05',
    durationDays: 1,
    durationNights: 0,
    assemblyTime: '08:00 AM',
    assemblyPoint: 'School Assembly Quadrangle, Bhose',
    departureTime: '08:30 AM',
    returnEta: 'Dec 05, 05:30 PM',
    costPerStudent: 650,
    totalCapacity: 80,
    status: 'PLANNING',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    overview:
      'A full-day interactive STEM excursion for junior school students featuring 3D Planetarium astronomy dome show, physics fun-mirror gallery, robotics laboratory demo, and aquatic wetland bird watching at historic Siddheshwar lake.',
    itinerary: [
      {
        dayNumber: 1,
        date: 'Dec 05, 2026',
        title: 'Single-Day STEM Science Park & Wetland Field Trip',
        activities: [
          {
            id: 'act-sc-1',
            time: '08:00 AM',
            title: 'School Assembly & Boarding',
            description: 'Departure by trust school buses with faculty escorts.',
            location: 'Bhose Campus',
          },
          {
            id: 'act-sc-2',
            time: '10:00 AM',
            title: '3D Planetarium Dome Space Odyssey',
            description: 'Interactive presentation on Solar System, ISRO Gaganyaan mission & constellations.',
            location: 'Solapur Planetarium',
          },
          {
            id: 'act-sc-3',
            time: '01:00 PM',
            title: 'Lunch in Science Park Lawns',
            description: 'Fresh lunch packs, juice, and fruit provided by trust catering service.',
            location: 'Science Park Amphitheatre',
          },
          {
            id: 'act-sc-4',
            time: '02:30 PM',
            title: 'Siddheshwar Lake Wetland Ecology Study',
            description: 'Binoculars session observing migratory Siberian ducks and water pH testing workshop.',
            location: 'Siddheshwar Lake West Bund',
          },
          {
            id: 'act-sc-5',
            time: '05:30 PM',
            title: 'Safe Return & Handover to Parents',
            description: 'Bus arrives back at Bhose school gate.',
            location: 'Bhose School Gate',
          },
        ],
        mealsProvided: 'Morning Snack, Packed Balanced Lunch Box, Evening Fruity Drink & Biscuit',
        nightStay: 'Single-Day Excursion (Return same evening)',
      },
    ],
    mandatoryPackingList: [
      'School Uniform with clean ID Card',
      'Full water bottle (reusable)',
      'Sun cap and small notebook with pen',
      'No personal electronics needed',
    ],
    prohibitedItems: [
      'Expensive watches or jewelry',
      'Smartphones or gaming consoles',
      'More than ₹ 100 pocket money',
    ],
    safetyGuidelines: [
      '1 teacher escort per 15 students strictly maintained.',
      'Life jackets must be worn during lake jetty observation.',
      'Students must remain within faculty sight at all times.',
    ],
    coordinators: [
      {
        id: 'coord-sc-1',
        name: 'Mr. Deepak Shinde',
        role: 'Science Dept Coordinator',
        phone: '+91 98223 88990',
        email: 'deepak.shinde@modernschool.edu.in',
      },
    ],
    emergencyHelpline: '1800-202-6000',
    medicalOfficer: 'School First Aid Team',
    hospitalTieUp: 'Solapur City Hospital',
    busNumber: 'Bus #03 & Bus #04 (Trust School Fleet)',
    driverName: 'Mr. Suresh Gaikwad',
    driverPhone: '+91 97654 32100',
    gpsTrackingActive: false,
    enrolledStudents: [],
    notifications: [],
  },
];

type TripListener = (trips: TripItem[]) => void;

class TripServiceImpl {
  private trips: TripItem[] = [];
  private listeners: TripListener[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.trips = JSON.parse(stored);
      } else {
        this.trips = [...INITIAL_TRIPS];
        this.saveToStorage();
      }
    } catch {
      this.trips = [...INITIAL_TRIPS];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.trips));
    } catch {
      // ignore
    }
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener([...this.trips]);
    }
  }

  public subscribe(listener: TripListener): () => void {
    this.listeners.push(listener);
    listener([...this.trips]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getTrips(): TripItem[] {
    return [...this.trips];
  }

  public getTripById(id: string): TripItem | undefined {
    return this.trips.find((t) => t.id === id);
  }

  public addTrip(newTrip: Omit<TripItem, 'id' | 'enrolledStudents' | 'notifications'>): TripItem {
    const trip: TripItem = {
      ...newTrip,
      id: `trip-${Date.now()}`,
      enrolledStudents: [],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          tripId: `trip-${Date.now()}`,
          title: `🎒 New Educational Tour Announced: ${newTrip.title}`,
          message: `The school has announced a new study tour to ${newTrip.destination}. Check full itinerary, packing checklist and submit digital parent consent.`,
          timestamp: 'Just Now',
          severity: 'INFO',
          sentBy: 'Campus Principal & Trust Management',
        },
      ],
    };
    this.trips = [trip, ...this.trips];
    this.saveToStorage();
    return trip;
  }

  public updateTrip(id: string, updates: Partial<TripItem>): TripItem | null {
    const idx = this.trips.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.trips[idx] = { ...this.trips[idx], ...updates };
    this.saveToStorage();
    return this.trips[idx];
  }

  public deleteTrip(id: string): boolean {
    const lenBefore = this.trips.length;
    this.trips = this.trips.filter((t) => t.id !== id);
    if (this.trips.length !== lenBefore) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Broadcast real-time push alert to Parents Mobile App
  public broadcastNotification(
    tripId: string,
    notification: { title: string; message: string; location?: string; severity?: 'INFO' | 'MILESTONE' | 'ALERT'; sentBy: string }
  ): TripNotification | null {
    const trip = this.trips.find((t) => t.id === tripId);
    if (!trip) return null;

    const notif: TripNotification = {
      id: `notif-${Date.now()}`,
      tripId,
      title: notification.title,
      message: notification.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: notification.location,
      severity: notification.severity || 'INFO',
      sentBy: notification.sentBy,
    };

    trip.notifications = [notif, ...trip.notifications];
    if (notification.location) {
      trip.currentGpsStatus = `${notification.location} • Update sent to all parents`;
    }
    this.saveToStorage();
    return notif;
  }

  // Parent grants digital consent for their ward
  public grantDigitalConsent(tripId: string, studentId: string, parentName: string): boolean {
    const trip = this.trips.find((t) => t.id === tripId);
    if (!trip) return false;

    const stu = trip.enrolledStudents.find((s) => s.studentId === studentId);
    if (stu) {
      stu.consentStatus = 'GRANTED';
      stu.consentGrantedAt = `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // If student not already in roster, add them
      trip.enrolledStudents.push({
        studentId,
        name: 'Aarav Sharma',
        gradeOrSemester: 'Class 7-A',
        rollNo: '7A-01',
        parentName,
        parentPhone: '+91 98221 44556',
        consentStatus: 'GRANTED',
        consentGrantedAt: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        feeStatus: 'PAID',
        amountPaid: trip.costPerStudent,
        dietaryPreference: 'VEG',
      });
    }

    this.saveToStorage();
    return true;
  }

  public resetToDefaults() {
    this.trips = [...INITIAL_TRIPS];
    this.saveToStorage();
  }
}

export const TripService = new TripServiceImpl();
