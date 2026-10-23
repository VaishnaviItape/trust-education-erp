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
} from 'react-native';
import { syncEngine } from './src/offline/syncEngine';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeRole, setActiveRole] = useState<'PARENT' | 'STUDENT' | 'TEACHER' | 'DRIVER'>('PARENT');
  const [activeTab, setActiveTab] = useState<'HOME' | 'FEES' | 'BUS' | 'PROFILE'>('HOME');
  const [busActive, setBusActive] = useState(true);

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
});
