/**
 * EMBEDDED SQLITE / WATERMELONDB LOCAL OFFLINE SCHEMA FOR TRUSTEDU MOBILE
 * Allows zero-latency reading and mutations in offline campus zones (basement labs, rural bus routes).
 */

export interface OfflineStudent {
  id: string;
  branchId: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  grade: string;
  feePending: number;
  syncedAt: number;
}

export interface OfflinePunch {
  id: string;
  deviceId: string;
  biometricUserId: string;
  punchType: 'CHECK_IN' | 'CHECK_OUT';
  punchTimestamp: string;
  syncStatus: 'PENDING_SYNC' | 'SYNCED' | 'FAILED';
}

export interface OfflineAttendance {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  markedBy: string;
  syncStatus: 'PENDING_SYNC' | 'SYNCED' | 'FAILED';
}

export interface OfflineFeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMode: string;
  date: string;
  cachedOffline: boolean;
}

export interface OfflineBusCoordinate {
  routeId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
  synced: boolean;
}

export interface SyncMutation {
  id: string;
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  clientTimestamp: number;
  retryCount: number;
  status: 'QUEUED' | 'IN_FLIGHT' | 'COMPLETED' | 'CONFLICT_RESOLVED';
}

/**
 * SQLite Table Creation DDL for embedded mobile database (SQLite / WatermelonDB)
 */
export const SQLITE_OFFLINE_DDL = `
CREATE TABLE IF NOT EXISTS offline_students (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  admission_no TEXT NOT NULL,
  roll_no TEXT,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  fee_pending REAL DEFAULT 0,
  synced_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS offline_punches (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  biometric_user_id TEXT NOT NULL,
  punch_type TEXT NOT NULL,
  punch_timestamp TEXT NOT NULL,
  sync_status TEXT DEFAULT 'PENDING_SYNC'
);

CREATE TABLE IF NOT EXISTS offline_attendances (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  marked_by TEXT NOT NULL,
  sync_status TEXT DEFAULT 'PENDING_SYNC'
);

CREATE TABLE IF NOT EXISTS offline_fee_receipts (
  id TEXT PRIMARY KEY,
  receipt_no TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_mode TEXT NOT NULL,
  date TEXT NOT NULL,
  cached_offline INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sync_mutation_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  client_timestamp INTEGER NOT NULL,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'QUEUED'
);
`;
