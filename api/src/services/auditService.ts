export interface AuditLogEntry {
  id: string;
  tableName: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  oldData?: any;
  newData?: any;
  performedBy: string;
  userRole?: string;
  ipAddress: string;
  timestamp: string;
}

// Append-only in-memory audit store
const auditLogs: AuditLogEntry[] = [
  {
    id: 'audit-001',
    tableName: 'fee_payments',
    recordId: 'rcp-init-01',
    action: 'INSERT',
    newData: { receiptNo: 'RCP-SCH-2026-0001', amount: 24000, student: 'Aarav Sharma' },
    performedBy: 'Accountant Priya Joshi',
    userRole: 'ACCOUNTANT',
    ipAddress: '192.168.1.102',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'audit-002',
    tableName: 'fee_concessions',
    recordId: 'conc-001',
    action: 'UPDATE',
    oldData: { status: 'PENDING' },
    newData: { status: 'APPROVED_TRUSTEE', approvedAmount: 5000 },
    performedBy: 'Dr. Rajesh Patil (Trustee)',
    userRole: 'SUPERADMIN',
    ipAddress: '10.0.0.1',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export const logAuditEvent = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry => {
  const newLog: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };
  auditLogs.unshift(newLog);
  return newLog;
};

export const getAuditLogs = (filter?: { tableName?: string; recordId?: string; limit?: number }): AuditLogEntry[] => {
  let logs = [...auditLogs];
  if (filter?.tableName) {
    logs = logs.filter((l) => l.tableName.toLowerCase() === filter.tableName?.toLowerCase());
  }
  if (filter?.recordId) {
    logs = logs.filter((l) => l.recordId === filter.recordId);
  }
  return logs.slice(0, filter?.limit || 100);
};
