import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
} from 'react-native';
import { syncEngine } from './src/offline/syncEngine';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeRole, setActiveRole] = useState<'PARENT' | 'STUDENT' | 'TEACHER' | 'DRIVER'>('PARENT');
  const [activeTab, setActiveTab] = useState<'HOME' | 'FEES' | 'BUS' | 'PROFILE'>('HOME');
  const [busActive, setBusActive] = useState(true);

  // Campus Events & Media Broadcast State
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [mobileEvents, setMobileEvents] = useState([
    {
      id: 'evt-dandiya',
      title: '✨ Grand Navratri Dandiya Raas-Garba 2026',
      status: 'COMPLETED',
      statusLabel: 'Photos & Video Live',
      date: 'Oct 22, 2026 • 06:30 PM',
      venue: 'Modern Public School Amphitheatre, Bhose',
      desc: 'Zep Foundation Bhose organized a grand Navratri Dandiya celebration for over 1,200 students and parents! Photos and official video reel highlights are now available below.',
      cover: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      photoCount: 4,
      videoTitle: 'Grand Dandiya Night 2026 Official Highlights & Drone Reel',
      photos: [
        { url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', caption: 'Traditional Garba round by students in Solapuri attire' },
        { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', caption: 'Illuminated campus amphitheatre with 1,200 attendees' },
        { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', caption: 'Trustee award ceremony & Best Dancer trophy presentation' },
      ],
      likes: 348,
    },
    {
      id: 'evt-sports',
      title: '🏃‍♂️ Tomorrow: Annual Inter-Trust Sports Championship',
      status: 'UPCOMING',
      statusLabel: 'Tomorrow at 07:30 AM',
      date: 'Tomorrow, Oct 24 • 07:30 AM',
      venue: 'Modern Sports Complex, Solapur Highway Campus',
      desc: 'All students must report in proper sports uniform by 07:15 AM tomorrow. Bus fleet routes will pick up 30 minutes early. Parents are cordially invited to cheer from the main pavilion!',
      cover: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      photoCount: 2,
      videoTitle: 'Sports Meet Guidelines & March-Past Rules Briefing',
      photos: [
        { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', caption: 'Synthetic athletic track prepared for 100m sprint heats' },
        { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', caption: 'Inter-house football ground ready for championship finals' },
      ],
      likes: 215,
    },
  ]);

  // Educational Tours & Excursions State
  const [selectedTripModal, setSelectedTripModal] = useState<any | null>(null);
  const [activeTripTab, setActiveTripTab] = useState<'NOTIFS' | 'ITINERARY' | 'PACKING' | 'SAFETY' | 'CONSENT'>('NOTIFS');
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({
    0: true, // ID card
    1: true, // Clothes
    2: true, // Shoes
    3: true, // Water bottle
    4: true, // Jacket
  });
  const [parentConsentGranted, setParentConsentGranted] = useState<boolean>(true);

  const parentTrip = {
    id: 'trip-sch-01',
    title: '🎒 Heritage & Flora Study Tour: Raigad Fort, Pratapgad & Mahabaleshwar',
    destination: 'Raigad Fort & Mahabaleshwar, Maharashtra',
    dates: 'Nov 12 - Nov 14, 2026 (3 Days / 2 Nights)',
    status: 'LIVE_ON_TOUR',
    statusLabel: 'Live on Tour • Satara Highway',
    assemblyTime: '05:30 AM',
    assemblyPoint: 'School Main Gate 1, Bhose Campus',
    returnEta: 'Nov 14, 08:30 PM',
    cost: '₹ 3,800 (Paid)',
    busInfo: 'MH-12-TR-9901 • Driver: Ramesh Pawar (+91 97654 32100)',
    coordinators: [
      { name: 'Prof. Sachin Kulkarni', role: 'Tour Director (Lead)', phone: '+91 98224 55112' },
      { name: 'Mrs. Anjali Deshmukh', role: 'Lady Student Escort', phone: '+91 98221 66778' },
      { name: 'Dr. R. K. Patil, MD', role: 'Escort Medical Doctor', phone: '+91 94230 11990' },
    ],
    emergencyHelpline: '1800-202-6000 (24x7 Trust Helpline)',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    latestNotification: {
      title: '🏨 Hotel Check-In & Room Allocation Complete',
      message: 'All students have arrived safely at Hotel Green Valley, Mahabaleshwar. Children are in rooms; hot buffet dinner at 08:00 PM.',
      timestamp: 'Today, 07:15 PM',
      location: 'Hotel Green Valley, Mahabaleshwar',
    },
    notifications: [
      {
        id: 'n4',
        title: '🏨 Hotel Check-In & Room Allocation Complete',
        message: 'All students have arrived safely at Hotel Green Valley, Mahabaleshwar. Children are settled in rooms; dinner will be served at 08:00 PM.',
        time: 'Today, 07:15 PM',
        location: 'Hotel Green Valley, Mahabaleshwar',
        severity: 'MILESTONE',
      },
      {
        id: 'n3',
        title: '🏰 Raigad Fort Ascent via Ropeway Commenced',
        message: 'Arrived at Raigad Fort base. Students boarding the aerial ropeway in supervised groups of 4 with safety harnesses.',
        time: 'Today, 01:45 PM',
        location: 'Raigad Ropeway Base Station',
        severity: 'MILESTONE',
      },
      {
        id: 'n2',
        title: '🥪 Satara Breakfast Halt Completed Safely',
        message: 'Students enjoyed fresh hot breakfast (poha, idli-sambar, fresh bananas) at Highway Plaza Satara. All children well hydrated and happy.',
        time: 'Today, 09:30 AM',
        location: 'Highway Plaza Satara',
        severity: 'INFO',
      },
      {
        id: 'n1',
        title: '📢 Tour Bus Departed Bhose Campus on Schedule',
        message: 'Tour Bus MH-12-TR-9901 departed Bhose campus safely at 06:15 AM with all 42 scholars onboard after headcount.',
        time: 'Today, 06:15 AM',
        location: 'Bhose School Gate 1',
        severity: 'MILESTONE',
      },
    ],
    itinerary: [
      {
        day: 'Day 1 • Nov 12',
        title: 'Departure, Satara Breakfast & Raigad Fort Coronation Capital',
        details: '05:30 AM Assembly at Bhose -> 06:00 AM Departure -> 09:00 AM Breakfast at Satara -> 01:30 PM Raigad Fort Ropeway Trek -> 07:30 PM Check-in Hotel Green Valley Mahabaleshwar.',
        meals: 'Breakfast, Packed MTDC Lunch, Buffet Dinner',
        stay: 'Hotel Green Valley, Mahabaleshwar',
      },
      {
        day: 'Day 2 • Nov 13',
        title: 'Western Ghats Forest Walk, Mapro Agro-Park & Venna Lake',
        details: '07:30 AM Guided forest biodiversity walk -> 11:00 AM Mapro food processing and strawberry farm study -> 04:00 PM Venna Lake boating with life-jackets -> 08:00 PM Campfire & cultural quiz.',
        meals: 'Buffet Breakfast, Mapro Lunch, Gala Dinner',
        stay: 'Hotel Green Valley, Mahabaleshwar',
      },
      {
        day: 'Day 3 • Nov 14',
        title: 'Pratapgad Fort Heritage Tour & Safe Return to Bhose',
        details: '08:30 AM Pratapgad Fort architectural walkthrough -> 01:30 PM Traditional Maharashtrian lunch -> 04:30 PM Return transit -> 08:30 PM Safe handover at Bhose School Gate 1.',
        meals: 'Breakfast, Poladpur Lunch, High Tea Pack',
        stay: 'Return to Parents / Home',
      },
    ],
    packingChecklist: [
      'Official School Identity Card (Mandatory to wear badge around neck)',
      '2 sets of casual comfortable clothes + 1 School Sports Tracksuit',
      '1 pair of sturdy trekking sports shoes with cotton socks',
      'Personal reusable water bottle (1 Litre capacity)',
      'Light woollen sweater or windcheater (Night temp drops to 14°C)',
      'Personal toiletries: toothbrush, paste, soap, face towel, sanitizer',
      'Sun cap, sunglasses, and small fold-up umbrella',
      'Prescription medicines with parent dosage note',
      'Student field observation notebook & pen',
    ],
    prohibitedItems: [
      'Gold jewelry, diamond rings, or expensive watches',
      'Large cash (>₹ 500 pocket money strictly prohibited)',
      'iPads, video games, or expensive gadgets',
      'Sharp metal objects, scissors, or lighters',
    ],
  };

  // Offline-First Synchronization States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [queueCount, setQueueCount] = useState<number>(2);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((qLen, online) => {
      setQueueCount(qLen);
      setIsOnline(online);
    });
    return unsubscribe;
  }, []);

  if (showSplash) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#EA580C" />
        <View style={styles.splashContent}>
          <View style={styles.splashLogoContainer}>
            <Text style={styles.splashLogoIcon}>🎓</Text>
          </View>
          <Text style={styles.splashSubtitle}>INTEGRATED CLOUD ERP</Text>
          <Text style={styles.splashTitle}>Shree Saraswati Trust</Text>
          <Text style={styles.splashDesc}>
            Saraswati School &bull; Hotel Management College
          </Text>

          <View style={styles.splashLoader}>
            <View style={styles.splashLoaderBar} />
          </View>

          <TouchableOpacity
            style={styles.splashButton}
            onPress={() => setShowSplash(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.splashButtonText}>Enter Mobile App &rarr;</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#EA580C" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTrust}>Shree Saraswati Trust</Text>
          <Text style={styles.headerTitle}>
            {activeRole === 'PARENT' && 'Parent Mobile Portal'}
            {activeRole === 'STUDENT' && 'Student Culinary Portal'}
            {activeRole === 'TEACHER' && 'Faculty Attendance Marker'}
            {activeRole === 'DRIVER' && 'Bus Driver GPS Console'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.replayButton}
          onPress={() => setShowSplash(true)}
        >
          <Text style={styles.replayButtonText}>✨ Demo Splash</Text>
        </TouchableOpacity>
      </View>

      {/* Demo Role Switcher Bar */}
      <View style={styles.roleBar}>
        {(['PARENT', 'STUDENT', 'TEACHER', 'DRIVER'] as const).map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.roleTab, activeRole === role && styles.roleTabActive]}
            onPress={() => {
              setActiveRole(role);
              setActiveTab('HOME');
            }}
          >
            <Text style={[styles.roleTabText, activeRole === role && styles.roleTabTextActive]}>
              {role === 'PARENT' && '👨‍👩‍👦 Parent'}
              {role === 'STUDENT' && '👨‍🍳 Student'}
              {role === 'TEACHER' && '👩‍🏫 Teacher'}
              {role === 'DRIVER' && '🚌 Driver'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Offline-First Synchronization Status Bar */}
      <View style={{ backgroundColor: isOnline ? '#064E3B' : '#7F1D1D', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
            {isOnline ? '🟢 ONLINE (CRDT Delta Sync)' : '🔴 OFFLINE ZONE (Local SQLite)'}
          </Text>
          {queueCount > 0 && (
            <View style={{ backgroundColor: '#F97316', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10, marginLeft: 6 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>{queueCount} Queued</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => syncEngine.toggleNetworkConnectivity()}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
              {isOnline ? 'Cut Wifi' : 'Go Online'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowScanner(true)}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: queueCount > 0 ? 6 : 0 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>📷 Barcode</Text>
          </TouchableOpacity>

          {queueCount > 0 && (
            <TouchableOpacity
              onPress={async () => {
                setSyncStatusMsg('Replaying local SQLite mutations to server...');
                const res = await syncEngine.triggerBackgroundSync();
                setSyncStatusMsg(`Successfully synced ${res.syncedCount} changes!`);
                setTimeout(() => setSyncStatusMsg(null), 3000);
              }}
              style={{ backgroundColor: '#F97316', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>⚡ Sync</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {syncStatusMsg && (
        <View style={{ backgroundColor: '#D1FAE5', padding: 6, alignItems: 'center' }}>
          <Text style={{ color: '#065F46', fontSize: 11, fontWeight: '700' }}>✔ {syncStatusMsg}</Text>
        </View>
      )}

      {/* Barcode Scanner Modal Simulator */}
      {showScanner && (
        <Modal transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ backgroundColor: '#0F172A', borderRadius: 20, padding: 20, width: '100%', maxWidth: 360, borderWidth: 1, borderColor: '#334155' }}>
              <Text style={{ color: '#F97316', fontSize: 14, fontWeight: '800', textAlign: 'center' }}>
                📷 Camera Barcode & QR Scanner
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 16 }}>
                Scan ISBN book code, hall ticket barcode, or visitor gate pass badge
              </Text>

              <View style={{ height: 140, borderWidth: 2, borderColor: '#F97316', borderStyle: 'dashed', borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', marginBottom: 16 }}>
                <Text style={{ color: '#38BDF8', fontSize: 24 }}>[ ☵ ☵ ☵ ]</Text>
                <Text style={{ color: '#64748B', fontSize: 10, marginTop: 8 }}>Target barcode in viewfinder</Text>
              </View>

              <View style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    setScannedResult('Scanned: LIB-BK-1001 (The C Programming Language)');
                    syncEngine.enqueueMutation('library_circulations', 'INSERT', { barcode: 'LIB-BK-1001', borrower: 'Aarav Sharma' });
                    setShowScanner(false);
                  }}
                  style={{ backgroundColor: '#1E293B', padding: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: '#E2E8F0', fontSize: 11, fontWeight: '700' }}>📚 Test Library Book Barcode (LIB-BK-1001)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setScannedResult('Scanned: Hall Ticket #HT-7A01 Verified for Exam Hall');
                    syncEngine.enqueueMutation('exam_attendance', 'INSERT', { hallTicket: 'HT-7A01', verified: true });
                    setShowScanner(false);
                  }}
                  style={{ backgroundColor: '#1E293B', padding: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: '#E2E8F0', fontSize: 11, fontWeight: '700' }}>🎫 Test Admit Card Barcode (HT-7A01)</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setShowScanner(false)}
                style={{ marginTop: 16, backgroundColor: '#334155', padding: 10, borderRadius: 10, alignItems: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Cancel Scanner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {scannedResult && (
        <View style={{ backgroundColor: '#EFF6FF', padding: 8, borderBottomWidth: 1, borderColor: '#BFDBFE', alignItems: 'center' }}>
          <Text style={{ color: '#1E40AF', fontSize: 11, fontWeight: '700' }}>📷 {scannedResult}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= VIEW 1: PARENT PORTAL (SCHOOL) ================= */}
        {activeRole === 'PARENT' && (
          <View style={styles.section}>
            {/* Student Card */}
            <View style={styles.studentCard}>
              <View style={styles.studentAvatar}>
                <Text style={styles.avatarText}>AS</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>Master Aarav Sharma</Text>
                <Text style={styles.studentDetails}>Class 7-A &bull; Roll #01 &bull; CBSE</Text>
                <Text style={styles.schoolName}>Saraswati International Public School</Text>
              </View>
            </View>

            {/* Attendance & Performance Grid */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValueEmerald}>94%</Text>
                <Text style={styles.kpiLabel}>Attendance</Text>
                <Text style={styles.kpiSub}>Present today: Yes ✅</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValueRose}>₹ 12,000</Text>
                <Text style={styles.kpiLabel}>Fee Pending</Text>
                <Text style={styles.kpiSub}>Due: 15th Nov 2026</Text>
              </View>
            </View>

            {/* Pay Fee Via UPI Button */}
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => alert('Opening UPI Apps: GPay / PhonePe / Paytm... Instant 0% charge payment to Trust Bank Account!')}
              activeOpacity={0.85}
            >
              <Text style={styles.payButtonText}>⚡ Pay ₹ 12,000 via UPI (GPay/PhonePe)</Text>
            </TouchableOpacity>

            {/* Live Bus Tracking Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🚌 Live School Bus Tracker</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE GPS</Text>
                </View>
              </View>
              <Text style={styles.busRouteName}>Route #4: City Center &rarr; Green Valley</Text>
              <Text style={styles.busInfo}>Bus MH-12-TR-4421 &bull; Driver: Suresh (+91 97654 32100)</Text>

              <View style={styles.busAlertBox}>
                <Text style={styles.busAlertText}>
                  📍 Bus is approaching your stop (Lotus Heights) in approx 6 mins!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.trackMapButton}
                onPress={() => alert('Opening Full-Screen Map with GPS marker moving live!')}
              >
                <Text style={styles.trackMapButtonText}>Open Live GPS Map View &rarr;</Text>
              </TouchableOpacity>
            </View>

            {/* Homework Diary */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📚 Today's Homework Diary</Text>
              <View style={styles.homeworkItem}>
                <Text style={styles.hwSubject}>Mathematics (Algebra)</Text>
                <Text style={styles.hwText}>Complete Exercise 7.2 Questions 1 to 8 in notebook.</Text>
                <Text style={styles.hwDue}>Due Tomorrow &bull; Teacher: Mrs. Kulkarni</Text>
              </View>
              <View style={styles.homeworkItem}>
                <Text style={styles.hwSubject}>Science (Physics)</Text>
                <Text style={styles.hwText}>Read Chapter 5: Motion and Friction. Worksheet attached.</Text>
                <Text style={styles.hwDue}>Due Friday &bull; PDF Worksheet (1.2 MB)</Text>
              </View>
            </View>

            {/* Campus Events, Photo Gallery & Video Circulars */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🎉 Campus Events, Photos & Videos</Text>
                <View style={[styles.liveBadge, { backgroundColor: '#FFEDD5' }]}>
                  <Text style={[styles.liveBadgeText, { color: '#C2410C' }]}>CIRCULARS LIVE</Text>
                </View>
              </View>

              {mobileEvents.map((evt) => (
                <TouchableOpacity
                  key={evt.id}
                  style={styles.eventItemCard}
                  onPress={() => setSelectedEventModal(evt)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: evt.cover }} style={styles.eventCoverImage} />
                  <View style={styles.eventContent}>
                    <View style={styles.eventTagRow}>
                      <View style={[styles.eventBadge, evt.status === 'UPCOMING' ? styles.eventBadgeUpcoming : styles.eventBadgeDone]}>
                        <Text style={styles.eventBadgeText}>{evt.statusLabel}</Text>
                      </View>
                      <Text style={styles.eventLikesText}>❤️ {evt.likes}</Text>
                    </View>
                    <Text style={styles.eventItemTitle}>{evt.title}</Text>
                    <Text style={styles.eventItemDate}>📍 {evt.venue.slice(0, 32)}...</Text>
                    <View style={styles.eventMediaStrip}>
                      <Text style={styles.eventMediaTag}>📷 {evt.photoCount} Photos</Text>
                      <Text style={styles.eventMediaTag}>🎬 Video Reel</Text>
                      <Text style={[styles.eventMediaTag, { color: '#EA580C', fontWeight: '800' }]}>View Gallery &rarr;</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Educational Trips, Study Tours & Live Parent Alerts Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🎒 Educational Study Tour (Live Updates)</Text>
                <View style={[styles.liveBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.liveBadgeText, { color: '#15803D' }]}>LIVE ON TOUR</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.eventItemCard}
                onPress={() => {
                  setSelectedTripModal(parentTrip);
                  setActiveTripTab('NOTIFS');
                }}
                activeOpacity={0.85}
              >
                <Image source={{ uri: parentTrip.cover }} style={styles.eventCoverImage} />
                <View style={styles.eventContent}>
                  <View style={styles.eventTagRow}>
                    <View style={[styles.eventBadge, { backgroundColor: '#FFEDD5' }]}>
                      <Text style={[styles.eventBadgeText, { color: '#C2410C' }]}>Nov 12 - 14 &bull; 3 Days</Text>
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>✅ Consent Granted</Text>
                  </View>

                  <Text style={styles.eventItemTitle}>{parentTrip.title}</Text>
                  <Text style={styles.eventItemDate}>📍 {parentTrip.destination}</Text>

                  {/* Latest Real-Time Broadcast Notification Banner */}
                  <View style={{ backgroundColor: '#FFF7ED', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#FED7AA', marginVertical: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#C2410C' }}>🔔 LATEST TEACHER PUSH</Text>
                      <Text style={{ fontSize: 9, color: '#9A3412', fontWeight: '700' }}>{parentTrip.latestNotification.timestamp}</Text>
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#431407' }}>
                      {parentTrip.latestNotification.title}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#7C2D12', marginTop: 2 }} numberOfLines={2}>
                      {parentTrip.latestNotification.message}
                    </Text>
                  </View>

                  {/* Summary Status Strip */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    <Text style={[styles.eventMediaTag, { backgroundColor: '#F1F5F9' }]}>📋 Itinerary (3D/2N)</Text>
                    <Text style={[styles.eventMediaTag, { backgroundColor: '#F1F5F9' }]}>🎒 Packing Check (9)</Text>
                    <Text style={[styles.eventMediaTag, { backgroundColor: '#F1F5F9' }]}>🚌 Bus GPS Live</Text>
                    <Text style={[styles.eventMediaTag, { color: '#EA580C', fontWeight: '800' }]}>View Full Dossier &rarr;</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= VIEW 2: STUDENT PORTAL (COLLEGE HOTEL MGMT) ================= */}
        {activeRole === 'STUDENT' && (
          <View style={styles.section}>
            {/* Student Card */}
            <View style={styles.studentCard}>
              <View style={[styles.studentAvatar, { backgroundColor: '#F97316' }]}>
                <Text style={styles.avatarText}>KV</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>Kabir Verma (Culinary Arts)</Text>
                <Text style={styles.studentDetails}>B.Sc H&HA Semester 3 &bull; Roll: BHM-301</Text>
                <Text style={styles.schoolName}>Imperial College of Hotel Management</Text>
              </View>
            </View>

            {/* Today's Practical Kitchen Lab */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>👨‍🍳 Today's Practical Kitchen Schedule</Text>
                <View style={[styles.liveBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.liveBadgeText, { color: '#92400E' }]}>09:00 AM</Text>
                </View>
              </View>
              <Text style={styles.labName}>Basic Training Kitchen (BTK) - Batch A</Text>
              <Text style={styles.labMenu}>
                Menu: Classic French Brown Stock, Espagnole Mother Sauce & Rosemary Herb Roasting.
              </Text>
              <Text style={styles.labChef}>Executive Chef: Chef Sanjeev Menon</Text>
            </View>

            {/* 5-Star Hotel Internship (IT) Status */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏨 5-Star Industrial Training (IT)</Text>
              <View style={styles.internshipCard}>
                <Text style={styles.hotelTitle}>Taj Lands End, Bandra, Mumbai</Text>
                <Text style={styles.hotelDept}>Department: Food Production (Main Gourmet Kitchen)</Text>
                <Text style={styles.hotelMentor}>Mentor: Chef Vikramaditya (Sous Chef)</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreText}>Monthly Performance Rating:</Text>
                  <Text style={styles.scoreValue}>⭐ 9.4 / 10</Text>
                </View>
              </View>
            </View>

            {/* Digital Student ID Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🪪 Digital Student ID Card</Text>
              <View style={styles.idCardBox}>
                <Text style={styles.idTrust}>SHREE SARASWATI TRUST</Text>
                <Text style={styles.idCollege}>Imperial Hotel Management College</Text>
                <Text style={styles.idName}>KABIR VERMA</Text>
                <Text style={styles.idNumber}>ENROLL: HM-2026-101</Text>
                <Text style={styles.qrCodeGraphic}>[ QR CODE: VERIFIED ACTIVE ]</Text>
              </View>
            </View>

            {/* Campus Events, Photo Gallery & Video Circulars */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🎉 Campus Events, Photos & Videos</Text>
                <View style={[styles.liveBadge, { backgroundColor: '#FFEDD5' }]}>
                  <Text style={[styles.liveBadgeText, { color: '#C2410C' }]}>CIRCULARS LIVE</Text>
                </View>
              </View>

              {mobileEvents.map((evt) => (
                <TouchableOpacity
                  key={evt.id}
                  style={styles.eventItemCard}
                  onPress={() => setSelectedEventModal(evt)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: evt.cover }} style={styles.eventCoverImage} />
                  <View style={styles.eventContent}>
                    <View style={styles.eventTagRow}>
                      <View style={[styles.eventBadge, evt.status === 'UPCOMING' ? styles.eventBadgeUpcoming : styles.eventBadgeDone]}>
                        <Text style={styles.eventBadgeText}>{evt.statusLabel}</Text>
                      </View>
                      <Text style={styles.eventLikesText}>❤️ {evt.likes}</Text>
                    </View>
                    <Text style={styles.eventItemTitle}>{evt.title}</Text>
                    <Text style={styles.eventItemDate}>📍 {evt.venue.slice(0, 32)}...</Text>
                    <View style={styles.eventMediaStrip}>
                      <Text style={styles.eventMediaTag}>📷 {evt.photoCount} Photos</Text>
                      <Text style={styles.eventMediaTag}>🎬 Video Reel</Text>
                      <Text style={[styles.eventMediaTag, { color: '#EA580C', fontWeight: '800' }]}>View Gallery &rarr;</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Educational Trips, Study Tours & Live Parent Alerts Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🎒 Educational Study Tour (Live Updates)</Text>
                <View style={[styles.liveBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.liveBadgeText, { color: '#15803D' }]}>LIVE ON TOUR</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.eventItemCard}
                onPress={() => {
                  setSelectedTripModal(parentTrip);
                  setActiveTripTab('NOTIFS');
                }}
                activeOpacity={0.85}
              >
                <Image source={{ uri: parentTrip.cover }} style={styles.eventCoverImage} />
                <View style={styles.eventContent}>
                  <View style={styles.eventTagRow}>
                    <View style={[styles.eventBadge, { backgroundColor: '#FFEDD5' }]}>
                      <Text style={[styles.eventBadgeText, { color: '#C2410C' }]}>Nov 12 - 14 &bull; 3 Days</Text>
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>✅ Consent Granted</Text>
                  </View>

                  <Text style={styles.eventItemTitle}>{parentTrip.title}</Text>
                  <Text style={styles.eventItemDate}>📍 {parentTrip.destination}</Text>

                  {/* Latest Real-Time Broadcast Notification Banner */}
                  <View style={{ backgroundColor: '#FFF7ED', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#FED7AA', marginVertical: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#C2410C' }}>🔔 LATEST TEACHER PUSH</Text>
                      <Text style={{ fontSize: 9, color: '#9A3412', fontWeight: '700' }}>{parentTrip.latestNotification.timestamp}</Text>
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#431407' }}>
                      {parentTrip.latestNotification.title}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#7C2D12', marginTop: 2 }} numberOfLines={2}>
                      {parentTrip.latestNotification.message}
                    </Text>
                  </View>

                  {/* Summary Status Strip */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    <Text style={[styles.eventMediaTag, { backgroundColor: '#F1F5F9' }]}>📋 Itinerary (3D/2N)</Text>
                    <Text style={[styles.eventMediaTag, { backgroundColor: '#F1F5F9' }]}>🎒 Packing Check (9)</Text>
                    <Text style={[styles.eventMediaTag, { backgroundColor: '#F1F5F9' }]}>🚌 Bus GPS Live</Text>
                    <Text style={[styles.eventMediaTag, { color: '#EA580C', fontWeight: '800' }]}>View Full Dossier &rarr;</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= VIEW 3: TEACHER PORTAL ================= */}
        {activeRole === 'TEACHER' && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚡ 30-Second Mobile Attendance</Text>
              <Text style={styles.subText}>Class 7-A &bull; 30 Students Enrolled</Text>

              <TouchableOpacity
                style={styles.markButton}
                onPress={() => alert('Attendance Saved! 28 Present, 2 Absent. Absentee SMS alerts dispatched!')}
              >
                <Text style={styles.markButtonText}>Mark All Present & Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= VIEW 4: DRIVER PORTAL ================= */}
        {activeRole === 'DRIVER' && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚌 Bus Driver Live GPS Console</Text>
              <Text style={styles.subText}>Route #4 &bull; Bus MH-12-TR-4421</Text>

              <TouchableOpacity
                style={[styles.tripButton, busActive ? styles.tripButtonStop : styles.tripButtonStart]}
                onPress={() => setBusActive(!busActive)}
              >
                <Text style={styles.tripButtonText}>
                  {busActive ? '🛑 STOP CURRENT ROUTE TRIP' : '▶ START MORNING ROUTE TRIP'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.gpsStatus}>
                GPS Status: {busActive ? 'Broadcasting live coordinates every 5s' : 'Idle'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Event Details & Photo Lightbox Modal */}
      {selectedEventModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedEventModal(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '85%', padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={[styles.eventBadge, selectedEventModal.status === 'UPCOMING' ? styles.eventBadgeUpcoming : styles.eventBadgeDone]}>
                  <Text style={styles.eventBadgeText}>{selectedEventModal.statusLabel}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedEventModal(null)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F1F5F9', borderRadius: 20 }}>
                  <Text style={{ fontWeight: '800', color: '#64748B', fontSize: 12 }}>✕ Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView>
                <Image source={{ uri: selectedEventModal.cover }} style={{ width: '100%', height: 160, borderRadius: 16, marginBottom: 12 }} />
                <Text style={{ fontSize: 17, fontWeight: '900', color: '#0F172A', marginBottom: 6 }}>{selectedEventModal.title}</Text>
                <Text style={{ fontSize: 12, color: '#EA580C', fontWeight: '700', marginBottom: 2 }}>📅 {selectedEventModal.date}</Text>
                <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 12 }}>📍 {selectedEventModal.venue}</Text>
                
                <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 16 }}>{selectedEventModal.desc}</Text>

                {/* Photo Gallery Grid */}
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>📷 Event Photo Gallery ({selectedEventModal.photos?.length || 0})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  {selectedEventModal.photos?.map((p: any, idx: number) => (
                    <View key={idx} style={{ marginRight: 10, width: 140 }}>
                      <Image source={{ uri: p.url }} style={{ width: 140, height: 100, borderRadius: 12, marginBottom: 4 }} />
                      <Text style={{ fontSize: 10, color: '#64748B' }} numberOfLines={2}>{p.caption}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Video Clip */}
                {selectedEventModal.videoTitle && (
                  <View style={{ padding: 12, backgroundColor: '#FFF7ED', borderRadius: 14, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#C2410C' }}>🎬 {selectedEventModal.videoTitle}</Text>
                    <Text style={{ fontSize: 11, color: '#9A3412', marginTop: 2 }}>High-definition campus drone & dance reel available</Text>
                    <TouchableOpacity
                      onPress={() => alert('Playing Video Reel: Grand Dandiya Night 2026 highlights playing in HD!')}
                      style={{ marginTop: 8, backgroundColor: '#EA580C', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>▶ Play Event Video Reel</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => {
                    alert(`Sharing to WhatsApp: ${selectedEventModal.title} - Photos & Videos live on Trust Mobile App!`);
                  }}
                  style={{ backgroundColor: '#059669', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>💬 Share on WhatsApp</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Educational Tour & Study Trip Dossier Modal */}
      {selectedTripModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedTripModal(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', padding: 20 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#DCFCE7', borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#15803D' }}>LIVE ON TOUR</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>{selectedTripModal.dates}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedTripModal(null)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F1F5F9', borderRadius: 20 }}>
                  <Text style={{ fontWeight: '800', color: '#64748B', fontSize: 12 }}>✕ Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cover & Title */}
                <Image source={{ uri: selectedTripModal.cover }} style={{ width: '100%', height: 140, borderRadius: 16, marginBottom: 10 }} />
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 2 }}>{selectedTripModal.title}</Text>
                <Text style={{ fontSize: 11, color: '#EA580C', fontWeight: '700', marginBottom: 6 }}>📍 {selectedTripModal.destination}</Text>
                <Text style={{ fontSize: 11, color: '#475569', marginBottom: 12 }}>
                  Assembly: <strong>{selectedTripModal.assemblyTime}</strong> at {selectedTripModal.assemblyPoint} &bull; Cost: <strong style={{ color: '#16A34A' }}>{selectedTripModal.cost}</strong>
                </Text>

                {/* Sub-Tabs Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 6 }}>
                  <TouchableOpacity
                    onPress={() => setActiveTripTab('NOTIFS')}
                    style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: activeTripTab === 'NOTIFS' ? '#FFEDD5' : '#F1F5F9', marginRight: 6 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: activeTripTab === 'NOTIFS' ? '#C2410C' : '#475569' }}>
                      🔔 Live Alerts ({selectedTripModal.notifications?.length || 0})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveTripTab('ITINERARY')}
                    style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: activeTripTab === 'ITINERARY' ? '#FFEDD5' : '#F1F5F9', marginRight: 6 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: activeTripTab === 'ITINERARY' ? '#C2410C' : '#475569' }}>
                      📋 Itinerary
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveTripTab('PACKING')}
                    style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: activeTripTab === 'PACKING' ? '#FFEDD5' : '#F1F5F9', marginRight: 6 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: activeTripTab === 'PACKING' ? '#C2410C' : '#475569' }}>
                      🎒 Packing Checklist
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveTripTab('SAFETY')}
                    style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: activeTripTab === 'SAFETY' ? '#FFEDD5' : '#F1F5F9', marginRight: 6 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: activeTripTab === 'SAFETY' ? '#C2410C' : '#475569' }}>
                      👨‍🏫 Teachers & Help
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveTripTab('CONSENT')}
                    style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: activeTripTab === 'CONSENT' ? '#FFEDD5' : '#F1F5F9', marginRight: 6 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: activeTripTab === 'CONSENT' ? '#C2410C' : '#475569' }}>
                      📝 Consent Slip
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {/* TAB 1: LIVE NOTIFICATIONS */}
                {activeTripTab === 'NOTIFS' && (
                  <View style={{ marginBottom: 16, gap: 10 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>
                      📡 Real-Time Faculty Updates to Parents
                    </Text>
                    {selectedTripModal.notifications?.map((n: any) => (
                      <View key={n.id} style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 8 }}>{n.title}</Text>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#EA580C' }}>{n.time}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: '#334155', lineHeight: 16 }}>{n.message}</Text>
                        <Text style={{ fontSize: 9, color: '#94A3B8', marginTop: 4 }}>📍 {n.location}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* TAB 2: ITINERARY */}
                {activeTripTab === 'ITINERARY' && (
                  <View style={{ marginBottom: 16, gap: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>
                      📅 Day-by-Day Educational Schedule
                    </Text>
                    {selectedTripModal.itinerary?.map((item: any, idx: number) => (
                      <View key={idx} style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 12, fontWeight: '900', color: '#EA580C' }}>{item.day}: {item.title}</Text>
                        <Text style={{ fontSize: 11, color: '#334155', marginTop: 4, lineHeight: 16 }}>{item.details}</Text>
                        <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 10, color: '#16A34A', fontWeight: '700' }}>🍽️ {item.meals}</Text>
                          <Text style={{ fontSize: 10, color: '#0284C7', fontWeight: '700' }}>🏨 {item.stay}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* TAB 3: PACKING CHECKLIST */}
                {activeTripTab === 'PACKING' && (
                  <View style={{ marginBottom: 16, gap: 12 }}>
                    <View style={{ backgroundColor: '#EFF6FF', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#1E40AF' }}>
                        🎒 Interactive Packing List (Tap item to check off):
                      </Text>
                    </View>

                    <View style={{ gap: 6 }}>
                      {selectedTripModal.packingChecklist?.map((item: string, idx: number) => {
                        const isPacked = Boolean(packedItems[idx]);
                        return (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => setPackedItems({ ...packedItems, [idx]: !isPacked })}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 10,
                              borderRadius: 10,
                              backgroundColor: isPacked ? '#F0FDF4' : '#FFFFFF',
                              borderWidth: 1,
                              borderColor: isPacked ? '#86EFAC' : '#E2E8F0',
                            }}
                          >
                            <Text style={{ fontSize: 14, marginRight: 8 }}>{isPacked ? '✅' : '⬜'}</Text>
                            <Text
                              style={{
                                fontSize: 11,
                                color: isPacked ? '#166534' : '#1E293B',
                                fontWeight: isPacked ? '700' : '500',
                                textDecorationLine: isPacked ? 'line-through' : 'none',
                                flex: 1,
                              }}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Prohibited Items Alert */}
                    <View style={{ backgroundColor: '#FFF1F2', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FECDD3', marginTop: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#9F1239', marginBottom: 4 }}>
                        ⛔ Strictly Prohibited Items:
                      </Text>
                      {selectedTripModal.prohibitedItems?.map((p: string, idx: number) => (
                        <Text key={idx} style={{ fontSize: 10, color: '#881337', marginTop: 2 }}>
                          &bull; {p}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* TAB 4: TEACHERS & SAFETY */}
                {activeTripTab === 'SAFETY' && (
                  <View style={{ marginBottom: 16, gap: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>
                      👨‍🏫 Faculty Escorts & Emergency Contacts
                    </Text>

                    {selectedTripModal.coordinators?.map((c: any, idx: number) => (
                      <View key={idx} style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{c.name}</Text>
                          <Text style={{ fontSize: 10, color: '#64748B' }}>{c.role}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => alert(`Calling ${c.name} at ${c.phone}...`)}
                          style={{ backgroundColor: '#EA580C', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>📞 Call</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5' }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#991B1B' }}>
                        🚨 24x7 Emergency Trust Helpline
                      </Text>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: '#DC2626', marginTop: 2 }}>
                        {selectedTripModal.emergencyHelpline}
                      </Text>
                      <Text style={{ fontSize: 10, color: '#7F1D1D', marginTop: 2 }}>
                        Hospital Tie-Up: Satara Civil Hospital & Mahabaleshwar Rural Care
                      </Text>
                    </View>
                  </View>
                )}

                {/* TAB 5: CONSENT SLIP */}
                {activeTripTab === 'CONSENT' && (
                  <View style={{ marginBottom: 16, gap: 12 }}>
                    <View style={{ backgroundColor: '#F0FDF4', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#BBF7D0' }}>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: '#166534', marginBottom: 4 }}>
                        {parentConsentGranted ? '✅ Digital Parent Consent Confirmed' : '⏳ Parent Permission Pending'}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#14532D', lineHeight: 16 }}>
                        "I, Rajesh Sharma (Father of Master Aarav Sharma, Class 7-A, Roll #01), hereby grant digital permission for my ward to participate in the Raigad & Mahabaleshwar Study Tour under school faculty escort."
                      </Text>
                      <Text style={{ fontSize: 10, color: '#15803D', fontWeight: '700', marginTop: 6 }}>
                        Timestamp: Oct 20, 2026 • 11:30 AM • Stored in Trust General Register
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setParentConsentGranted(!parentConsentGranted);
                        alert(
                          !parentConsentGranted
                            ? 'Digital Consent Granted! Record saved in School Ledger.'
                            : 'Consent revoked for demo preview.'
                        );
                      }}
                      style={{
                        backgroundColor: parentConsentGranted ? '#059669' : '#EA580C',
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>
                        {parentConsentGranted ? '✓ Digital Consent Signed & Verified' : '📝 Tap to Grant Digital Permission'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Bottom WhatsApp Share */}
                <TouchableOpacity
                  onPress={() => alert(`Sharing Tour Details: ${selectedTripModal.title} with family on WhatsApp!`)}
                  style={{ backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>💬 Share Tour Details on WhatsApp</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  splashLogoContainer: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  splashLogoIcon: {
    fontSize: 48,
  },
  splashSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFEDD5',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  splashDesc: {
    fontSize: 13,
    color: '#FFEDD5',
    textAlign: 'center',
    marginBottom: 24,
  },
  splashLoader: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 28,
  },
  splashLoaderBar: {
    width: '85%',
    height: '100%',
    backgroundColor: '#FEF08A',
    borderRadius: 10,
  },
  splashButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  splashButtonText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '800',
  },

  // Main Header
  header: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTrust: {
    color: '#FFEDD5',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  replayButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  replayButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Role Tab Bar
  roleBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#EA580C',
    fontWeight: '800',
  },

  scrollContent: {
    padding: 16,
  },
  section: {
    gap: 16,
  },

  // Student Profile Card
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  studentDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  schoolName: {
    fontSize: 11,
    color: '#EA580C',
    fontWeight: '700',
    marginTop: 2,
  },

  // KPI Row
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiValueEmerald: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
  },
  kpiValueRose: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E11D48',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },

  // Pay Button
  payButton: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  liveBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveBadgeText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '800',
  },
  busRouteName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  busInfo: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  busAlertBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
  },
  busAlertText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9A3412',
  },
  trackMapButton: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackMapButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Homework
  homeworkItem: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  hwSubject: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
  },
  hwText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  hwDue: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },

  // Hotel Mgmt
  labName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  labMenu: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  labChef: {
    fontSize: 11,
    color: '#EA580C',
    fontWeight: '700',
    marginTop: 6,
  },
  internshipCard: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hotelTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
  },
  hotelDept: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
  },
  hotelMentor: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78350F',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },

  // ID Card
  idCardBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  idTrust: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  idCollege: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  idName: {
    color: '#FEF08A',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
  },
  idNumber: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  qrCodeGraphic: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: 1,
  },

  // Teacher / Driver Buttons
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  markButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  markButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tripButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  tripButtonStart: {
    backgroundColor: '#059669',
  },
  tripButtonStop: {
    backgroundColor: '#E11D48',
  },
  tripButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  gpsStatus: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  // Events & Media Broadcast Styles
  eventItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 12,
  },
  eventCoverImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#0F172A',
  },
  eventContent: {
    padding: 12,
  },
  eventTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  eventBadgeUpcoming: {
    backgroundColor: '#FEF3C7',
  },
  eventBadgeDone: {
    backgroundColor: '#E0E7FF',
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
    textTransform: 'uppercase',
  },
  eventLikesText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  eventItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  eventItemDate: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  eventMediaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  eventMediaTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginRight: 6,
  },
});
