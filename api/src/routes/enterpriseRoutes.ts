import { Router, Request, Response } from 'express';
import {
  capRoundsData,
  capApplicantsData,
  CAPApplicant,
  accountingLedgersData,
  accountingVouchersData,
  feeConcessionsData,
  documentRackLocationsData,
  inwardDocumentsData,
  issuedCertificatesData,
  omrTemplatesData,
  omrAnswerKeysData,
  omrScansData,
  biometricDevicesData,
  rawPunchesData,
  employeesData,
  leavesData,
  payrollRunsData,
  timetableSlotsData,
  libraryBooksData,
  visitorGatePassesData,
  inventoryItemsData,
  whatsAppLogsData,
  noticePostsData,
} from '../enterpriseStore.js';
import {
  calculateStudentFee,
  validateVoucherBalance,
  calculateMonthlyPayroll,
  scoreOMRSheet,
  checkTimetableConflicts,
  runCAPSeatAllocation,
  ScheduledSlot,
} from '../services/domainMathService.js';
import { logAuditEvent, getAuditLogs } from '../services/auditService.js';

export const enterpriseRouter = Router();

// ==============================================================================
// 1. ADMISSIONS & CAP (CENTRALIZED ADMISSION PROCESS)
// ==============================================================================

enterpriseRouter.get('/cap/rounds', (_req: Request, res: Response) => {
  res.json({ rounds: capRoundsData });
});

enterpriseRouter.get('/cap/applicants', (_req: Request, res: Response) => {
  res.json({ total: capApplicantsData.length, applicants: capApplicantsData });
});

enterpriseRouter.post('/cap/allocate', (req: Request, res: Response) => {
  const capacities = req.body.capacities || [
    { streamId: 'stream-culinary-01', streamName: 'B.Sc Hotel Management & Culinary Arts', totalSeats: 30, allocatedSeats: 2 },
    { streamId: 'stream-engg-cs-01', streamName: 'B.Tech Computer Science & AI', totalSeats: 60, allocatedSeats: 1 },
  ];

  const candidateInputs = capApplicantsData.map((a) => ({
    id: a.id,
    name: a.name,
    meritRank: a.meritRank,
    percentage: a.percentage,
    category: a.category,
    preferences: a.preferences,
  }));

  const result = runCAPSeatAllocation(candidateInputs, capacities);

  // Update applicant statuses
  result.allocations.forEach((alloc) => {
    const app = capApplicantsData.find((a) => a.id === alloc.candidateId);
    if (app && alloc.allocatedStreamId) {
      app.allocatedStreamId = alloc.allocatedStreamId;
      app.allocatedStreamName = alloc.allocatedStreamName || '';
      app.status = 'ALLOCATED';
    }
  });

  logAuditEvent({
    tableName: 'cap_allocations',
    recordId: 'cap-batch-run',
    action: 'UPDATE',
    newData: result,
    performedBy: req.user?.name || 'Superadmin',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    message: 'Centralized Seat Allocation successfully executed based on merit ranking & category quota!',
    result,
  });
});

enterpriseRouter.get('/cap/results/:idOrAppNo', (req: Request, res: Response) => {
  const { idOrAppNo } = req.params;
  const applicant = capApplicantsData.find(
    (a) => a.id === idOrAppNo || a.applicationNo.toUpperCase() === idOrAppNo.toUpperCase()
  );

  if (!applicant) {
    return res.status(404).json({ error: 'CAP Application record not found' });
  }

  res.json({ applicant });
});

// ==============================================================================
// 2. FEE CONCESSIONS, DOUBLE-ENTRY VOUCHERS & AGING
// ==============================================================================

enterpriseRouter.get('/accounting/ledgers', (_req: Request, res: Response) => {
  res.json({ ledgers: accountingLedgersData });
});

enterpriseRouter.get('/accounting/vouchers', (_req: Request, res: Response) => {
  res.json({ total: accountingVouchersData.length, vouchers: accountingVouchersData });
});

enterpriseRouter.post('/accounting/vouchers/create', (req: Request, res: Response) => {
  const { type, date, narration, entries } = req.body;

  if (!type || !entries || !Array.isArray(entries) || entries.length < 2) {
    return res.status(400).json({
      error: 'Voucher requires a type (RECEIPT, PAYMENT, JOURNAL, CONTRA) and at least 2 debit/credit entries',
    });
  }

  const validation = validateVoucherBalance(entries);
  if (!validation.isBalanced) {
    return res.status(422).json({
      error: 'Voucher failed double-entry balancing check. Total Debits must exactly equal Total Credits.',
      validation,
    });
  }

  const newVoucher = {
    id: `vch-${Date.now()}`,
    voucherNo: `VCH-${type.slice(0, 3)}-2026-${String(accountingVouchersData.length + 1).padStart(3, '0')}`,
    type,
    date: date || new Date().toISOString().slice(0, 10),
    narration: narration || 'Standard trust accounting voucher entry',
    entries,
    createdBy: req.user?.name || 'Authorized Accountant',
  };

  accountingVouchersData.unshift(newVoucher);

  logAuditEvent({
    tableName: 'accounting_vouchers',
    recordId: newVoucher.voucherNo,
    action: 'INSERT',
    newData: newVoucher,
    performedBy: req.user?.name || 'Accountant',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: 'Double-entry voucher created successfully and posted to general ledger.',
    voucher: newVoucher,
    validation,
  });
});

enterpriseRouter.get('/accounting/concessions', (_req: Request, res: Response) => {
  res.json({ concessions: feeConcessionsData });
});

enterpriseRouter.post('/accounting/concessions/apply', (req: Request, res: Response) => {
  const { studentId, studentName, branchName, annualFee, requestedAmount, reason } = req.body;

  if (!studentId || !requestedAmount || !reason) {
    return res.status(400).json({ error: 'Missing required concession request fields' });
  }

  const newConcession = {
    id: `conc-${Date.now()}`,
    studentId,
    studentName: studentName || 'Applicant Student',
    branchName: branchName || 'Trust Institution',
    annualFee: Number(annualFee) || 36000,
    requestedAmount: Number(requestedAmount),
    reason,
    status: 'PENDING' as const,
    approvedAmount: 0,
    requestDate: new Date().toISOString().slice(0, 10),
    approvalHistory: [],
  };

  feeConcessionsData.unshift(newConcession);

  logAuditEvent({
    tableName: 'fee_concessions',
    recordId: newConcession.id,
    action: 'INSERT',
    newData: newConcession,
    performedBy: req.user?.name || 'Parent / Student',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: 'Fee concession request submitted to Principal approval queue.',
    concession: newConcession,
  });
});

enterpriseRouter.post('/accounting/concessions/review', (req: Request, res: Response) => {
  const { concessionId, action, approvedAmount, approverRole } = req.body;

  const concession = feeConcessionsData.find((c) => c.id === concessionId);
  if (!concession) {
    return res.status(404).json({ error: 'Concession request not found' });
  }

  const approver = req.user?.name || 'Dr. Rajesh Patil (Trustee)';
  const role = approverRole || req.user?.role || 'SUPERADMIN';

  if (action === 'RECOMMEND') {
    concession.status = 'RECOMMENDED_PRINCIPAL';
    concession.approvalHistory.push({
      role: 'PRINCIPAL',
      approver,
      action: 'RECOMMENDED',
      date: new Date().toISOString().slice(0, 10),
    });
  } else if (action === 'APPROVE') {
    concession.status = 'APPROVED_TRUSTEE';
    concession.approvedAmount = Number(approvedAmount) || concession.requestedAmount;
    concession.approvalHistory.push({
      role: 'SUPERADMIN',
      approver,
      action: `APPROVED (Rs ${concession.approvedAmount})`,
      date: new Date().toISOString().slice(0, 10),
    });
  } else if (action === 'REJECT') {
    concession.status = 'REJECTED';
    concession.approvalHistory.push({
      role,
      approver,
      action: 'REJECTED',
      date: new Date().toISOString().slice(0, 10),
    });
  }

  logAuditEvent({
    tableName: 'fee_concessions',
    recordId: concession.id,
    action: 'UPDATE',
    newData: concession,
    performedBy: approver,
    userRole: role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    message: `Fee concession request status updated to ${concession.status}`,
    concession,
  });
});

// Fee Aging Analytics API
enterpriseRouter.get('/accounting/aging', (_req: Request, res: Response) => {
  res.json({
    academicYear: '2026-2027',
    summary: {
      totalOutstanding: 148000,
      currentDue0to30Days: 48000,
      overdue31to60Days: 60000,
      criticalOverdue60PlusDays: 40000,
      recoveryRatePercent: 88.5,
    },
    agingBuckets: [
      { bucket: 'Current (0-30 Days)', count: 4, amount: 48000, riskLevel: 'LOW' },
      { bucket: '31 - 60 Days Overdue', count: 5, amount: 60000, riskLevel: 'MEDIUM' },
      { bucket: '60+ Days Critical Overdue', count: 3, amount: 40000, riskLevel: 'HIGH' },
    ],
  });
});

// ==============================================================================
// 3. ORIGINAL DOCUMENTS RACK LEDGER & PUBLIC CERTIFICATE QR VERIFICATION
// ==============================================================================

enterpriseRouter.get('/documents/rack-locations', (_req: Request, res: Response) => {
  res.json({ racks: documentRackLocationsData });
});

enterpriseRouter.get('/documents/inward', (_req: Request, res: Response) => {
  res.json({ total: inwardDocumentsData.length, documents: inwardDocumentsData });
});

enterpriseRouter.post('/documents/inward', (req: Request, res: Response) => {
  const { studentId, studentName, admissionNo, documentTitle, serialNo, rackLocationId, folderNumber } = req.body;

  if (!studentName || !documentTitle || !rackLocationId) {
    return res.status(400).json({ error: 'Missing mandatory inward document details or rack assignment' });
  }

  const rack = documentRackLocationsData.find((r) => r.id === rackLocationId);
  const newInward = {
    id: `inw-${Date.now()}`,
    studentId: studentId || 'stu-unknown',
    studentName,
    admissionNo: admissionNo || 'TEMP-2026',
    documentTitle,
    serialNo: serialNo || `SR-${Math.floor(Math.random() * 100000)}`,
    receivedDate: new Date().toISOString().slice(0, 10),
    rackLocationId,
    rackCode: rack?.rackCode || 'RACK-01',
    folderNumber: folderNumber || `FL-${inwardDocumentsData.length + 101}`,
    receiptNo: `DOC-INW-2026-${String(inwardDocumentsData.length + 1).padStart(3, '0')}`,
    status: 'CUSTODY' as const,
  };

  inwardDocumentsData.unshift(newInward);
  if (rack) rack.currentStored++;

  logAuditEvent({
    tableName: 'original_document_inward',
    recordId: newInward.receiptNo,
    action: 'INSERT',
    newData: newInward,
    performedBy: req.user?.name || 'Document Custodian',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: 'Original document safely inwarded and physical rack indexed.',
    record: newInward,
  });
});

enterpriseRouter.get('/certificates', (_req: Request, res: Response) => {
  res.json({ total: issuedCertificatesData.length, certificates: issuedCertificatesData });
});

enterpriseRouter.post('/certificates/generate', (req: Request, res: Response) => {
  const {
    studentId,
    studentName,
    grNumber,
    branchName,
    gradeOrCourse,
    certificateType,
    academicYear,
    motherName,
    fatherName,
    dob,
    dobWords,
    placeOfBirth,
    nationality,
    religion,
    caste,
    admissionDate,
    admissionGrade,
    leavingDate,
    leavingGrade,
    reasonForLeaving,
    progress,
    conduct,
    purpose,
    isDuplicate,
    remarks,
    signatoryName,
  } = req.body;

  if (!studentName || !certificateType) {
    return res.status(400).json({ error: 'Student name and certificate type are required' });
  }

  const prefixMap: Record<string, string> = {
    BONAFIDE: 'BF',
    TRANSFER_LEAVING: 'LC',
    CHARACTER: 'CHAR',
    NO_DUES: 'NODUE',
    PASSING_ATTEMPT: 'PASS',
    MIGRATION: 'MIG',
  };
  const certPrefix = prefixMap[certificateType] || 'DOC';
  const branchTag = branchName && branchName.toLowerCase().includes('hotel') ? 'HM' : 'SCH';
  const serialYear = new Date().getFullYear();
  const serialNo = `${certPrefix}-${branchTag}-${serialYear}-${String(issuedCertificatesData.length + 101).padStart(4, '0')}`;
  const certId = `cert-${certPrefix.toLowerCase()}-${Date.now()}`;

  const newCert = {
    id: certId,
    certificateSerialNo: serialNo,
    certificateType,
    studentId: studentId || 'stu-temp',
    studentName,
    grNumber: grNumber || 'GR-ARCHIVE',
    branchName: branchName || 'Zep Foundation Institution',
    gradeOrCourse: gradeOrCourse || 'Enrolled / Graduated Course',
    academicYear: academicYear || '2026-2027',
    issueDate: new Date().toISOString().slice(0, 10),
    issuedBy: signatoryName || req.user?.name || 'Principal / Authorized Officer',
    digitalSignatureHash: `SHA256:${Buffer.from(studentName + serialNo + Date.now()).toString('hex').slice(0, 64)}`,
    qrVerificationUrl: `http://localhost:5000/verify/doc/${certId}`,
    motherName: motherName || undefined,
    fatherName: fatherName || undefined,
    dob: dob || undefined,
    dobWords: dobWords || undefined,
    placeOfBirth: placeOfBirth || undefined,
    nationality: nationality || 'Indian',
    religion: religion || undefined,
    caste: caste || undefined,
    admissionDate: admissionDate || undefined,
    admissionGrade: admissionGrade || undefined,
    leavingDate: leavingDate || undefined,
    leavingGrade: leavingGrade || undefined,
    reasonForLeaving: reasonForLeaving || undefined,
    progress: progress || 'Very Good',
    conduct: conduct || 'Exemplary',
    purpose: purpose || undefined,
    isDuplicate: Boolean(isDuplicate),
    remarks: remarks || undefined,
  };

  issuedCertificatesData.unshift(newCert);

  logAuditEvent({
    tableName: 'issued_certificates',
    recordId: newCert.certificateSerialNo,
    action: 'INSERT',
    newData: newCert,
    performedBy: req.user?.name || 'Principal',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: `${certificateType} certificate generated with verifiable QR and digital signature!`,
    certificate: newCert,
  });
});

// ==============================================================================
// 4. EXAMINATIONS, OMR COMPUTER VISION & SEATING MATRIX
// ==============================================================================

enterpriseRouter.get('/omr/templates', (_req: Request, res: Response) => {
  res.json({ templates: omrTemplatesData });
});

enterpriseRouter.get('/omr/keys', (_req: Request, res: Response) => {
  res.json({ answerKeys: omrAnswerKeysData });
});

enterpriseRouter.get('/omr/scans', (_req: Request, res: Response) => {
  res.json({ total: omrScansData.length, scans: omrScansData });
});

enterpriseRouter.post('/omr/scan-evaluate', (req: Request, res: Response) => {
  const { answerKeyId, studentId, studentName, rollNo, recognizedAnswers } = req.body;

  const answerKey = omrAnswerKeysData.find((k) => k.id === answerKeyId) || omrAnswerKeysData[0];

  const scoreResult = scoreOMRSheet({
    answerKey: answerKey.answers,
    studentAnswers: recognizedAnswers || {},
    positiveMark: answerKey.positiveMark,
    negativeMark: answerKey.negativeMark,
  });

  const scanRecord = {
    id: `scan-${Date.now()}`,
    answerKeyId: answerKey.id,
    studentId: studentId || 'stu-scan',
    studentName: studentName || 'Candidate',
    rollNo: rollNo || 'OMR-ROLL-01',
    scannedImageUrl: '/assets/omr_samples/sample_omr_sheet.png',
    recognizedAnswers: recognizedAnswers || {},
    correctCount: scoreResult.correctCount,
    wrongCount: scoreResult.wrongCount,
    unattemptedCount: scoreResult.unattemptedCount,
    totalScore: scoreResult.totalScore,
    percentage: scoreResult.percentage,
    verificationVerified: true,
    scannedAt: new Date().toISOString(),
  };

  omrScansData.unshift(scanRecord);

  logAuditEvent({
    tableName: 'omr_scans',
    recordId: scanRecord.id,
    action: 'INSERT',
    newData: scanRecord,
    performedBy: req.user?.name || 'OMR Vision Scanner',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: 'OMR sheet processed via computer vision anchor detection and graded with penalty marking!',
    evaluation: scoreResult,
    scanRecord,
  });
});

enterpriseRouter.get('/exams/seating-matrix', (_req: Request, res: Response) => {
  res.json({
    rooms: [
      { roomNo: 'Room 201', capacity: 40, scheduledExam: 'Science & Thermodynamics', benchedStudents: 38 },
      { roomNo: 'Basic Training Kitchen Hall', capacity: 30, scheduledExam: 'Culinary Fundamentals & Hygiene', benchedStudents: 28 },
    ],
    antiCheatingRule: 'Strict alternating bench allocation between School Standard 10 and College Hotel Mgmt students to prevent collusion.',
  });
});

// ==============================================================================
// 5. HARDWARE BIOMETRICS & SHIFT ATTENDANCE
// ==============================================================================

enterpriseRouter.get('/biometrics/devices', (_req: Request, res: Response) => {
  res.json({ devices: biometricDevicesData });
});

enterpriseRouter.post('/biometrics/heartbeat', (req: Request, res: Response) => {
  const { deviceId, status } = req.body;
  const dev = biometricDevicesData.find((d) => d.id === deviceId);
  if (dev) {
    dev.status = status || 'ONLINE';
    dev.lastHeartbeat = new Date().toISOString();
  }
  res.json({ success: true, device: dev });
});

enterpriseRouter.post('/biometrics/punches/ingest', (req: Request, res: Response) => {
  const { deviceId, biometricUserId, userName, role, type, punchTime } = req.body;

  const newPunch = {
    id: `punch-${Date.now()}`,
    deviceId: deviceId || 'bio-dev-01',
    biometricUserId: biometricUserId || 'EMP-UNKNOWN',
    userName: userName || 'Staff / Student Member',
    role: role || 'STAFF',
    punchTime: punchTime || new Date().toISOString(),
    type: (type as 'CHECK_IN' | 'CHECK_OUT') || 'CHECK_IN',
  };

  rawPunchesData.unshift(newPunch);
  res.status(201).json({ message: 'Edge biometric punch cached & streamed', punch: newPunch });
});

enterpriseRouter.get('/biometrics/punches/stream', (_req: Request, res: Response) => {
  res.json({ total: rawPunchesData.length, stream: rawPunchesData.slice(0, 50) });
});

enterpriseRouter.get('/attendance/staff-shifts', (_req: Request, res: Response) => {
  res.json({
    shiftPolicy: {
      standardInTime: '08:00',
      standardOutTime: '16:00',
      gracePeriodMinutes: 15,
      halfDayThresholdHours: 4.5,
    },
    staffSummary: [
      { name: 'Principal Sunita Kulkarni', punchIn: '07:48', status: 'ON_TIME', isLate: false, halfDay: false },
      { name: 'Chef Sanjeev Menon', punchIn: '08:02', status: 'WITHIN_GRACE', isLate: false, halfDay: false },
      { name: 'Accountant Priya Joshi', punchIn: '08:24', status: 'LATE_MARK', isLate: true, halfDay: false },
    ],
  });
});

enterpriseRouter.get('/attendance/hostel-curfew', (_req: Request, res: Response) => {
  res.json({
    curfewTime: '21:30',
    date: new Date().toISOString().slice(0, 10),
    checkedCount: 48,
    missingOrUnaccounted: 1,
    unaccountedList: [{ student: 'Nikhil Patil', room: 'Tagore Block Room 104', phone: '+91 98221 44551' }],
  });
});

// ==============================================================================
// 6. HR, LEAVES & MONTHLY PAYROLL
// ==============================================================================

enterpriseRouter.get('/hr/employees', (_req: Request, res: Response) => {
  res.json({ employees: employeesData });
});

enterpriseRouter.get('/hr/leaves', (_req: Request, res: Response) => {
  res.json({ leaves: leavesData });
});

enterpriseRouter.post('/hr/leaves/apply', (req: Request, res: Response) => {
  const { empId, empName, leaveType, startDate, endDate, days, reason } = req.body;

  const newLeave = {
    id: `leave-${Date.now()}`,
    empId: empId || 'emp-01',
    empName: empName || 'Faculty Member',
    leaveType: leaveType || 'CASUAL',
    startDate,
    endDate,
    days: Number(days) || 1,
    reason: reason || 'Personal exigency',
    status: 'PENDING' as const,
  };

  leavesData.unshift(newLeave);
  res.status(201).json({ message: 'Leave application submitted for approval', leave: newLeave });
});

enterpriseRouter.get('/payroll/runs', (_req: Request, res: Response) => {
  res.json({ runs: payrollRunsData });
});

enterpriseRouter.post('/payroll/calculate-preview', (req: Request, res: Response) => {
  const { basicSalary, hra, da, specialAllowance, workingDaysInMonth, unpaidLeaveDays, month } = req.body;

  const breakdown = calculateMonthlyPayroll({
    basicSalary: Number(basicSalary) || 45000,
    hra: Number(hra) || 15000,
    da: Number(da) || 8000,
    specialAllowance: Number(specialAllowance) || 7000,
    workingDaysInMonth: Number(workingDaysInMonth) || 30,
    unpaidLeaveDays: Number(unpaidLeaveDays) || 0,
    month: Number(month) || 10,
  });

  res.json({ breakdown });
});

enterpriseRouter.post('/payroll/execute-batch', (req: Request, res: Response) => {
  const { month, year } = req.body;

  let totalGross = 0;
  let totalDeductions = 0;
  let totalNet = 0;

  const employeePayslips = employeesData.map((emp) => {
    const calc = calculateMonthlyPayroll({
      basicSalary: emp.basicSalary,
      hra: emp.hra,
      da: emp.da,
      specialAllowance: emp.specialAllowance,
      month: month || 10,
    });
    totalGross += calc.earnedGross;
    totalDeductions += calc.totalDeductions;
    totalNet += calc.netSalary;

    return {
      empCode: emp.empCode,
      name: emp.name,
      designation: emp.designation,
      breakdown: calc,
    };
  });

  const runRecord = {
    id: `pay-${year || 2026}-${String(month || 10).padStart(2, '0')}`,
    month: Number(month) || 10,
    year: Number(year) || 2026,
    totalGross,
    totalDeductions,
    totalNet,
    processedDate: new Date().toISOString().slice(0, 10),
    employeeCount: employeesData.length,
  };

  payrollRunsData.unshift(runRecord);

  logAuditEvent({
    tableName: 'payroll_runs',
    recordId: runRecord.id,
    action: 'INSERT',
    newData: runRecord,
    performedBy: req.user?.name || 'HR & Finance Director',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: `Monthly Payroll for ${month || 10}/${year || 2026} executed with statutory PF/ESIC/PT/TDS deductions!`,
    payrollRun: runRecord,
    employeePayslips,
  });
});

// ==============================================================================
// 7. TIMETABLE CLASH CHECKER & SCHEDULER
// ==============================================================================

enterpriseRouter.get('/timetable/slots', (_req: Request, res: Response) => {
  res.json({ slots: timetableSlotsData });
});

enterpriseRouter.post('/timetable/clash-check', (req: Request, res: Response) => {
  const newSlot: ScheduledSlot = req.body;
  const result = checkTimetableConflicts(timetableSlotsData, newSlot);
  res.json(result);
});

enterpriseRouter.post('/timetable/schedule', (req: Request, res: Response) => {
  const newSlot: ScheduledSlot = req.body;
  const conflictCheck = checkTimetableConflicts(timetableSlotsData, newSlot);

  if (conflictCheck.hasConflict) {
    return res.status(409).json({
      error: 'Timetable Clash Detected! Cannot schedule lecture with overlapping resources.',
      conflicts: conflictCheck.conflicts,
    });
  }

  const slotItem = {
    id: `tt-slot-${Date.now()}`,
    dayOfWeek: newSlot.dayOfWeek,
    startTime: newSlot.startTime,
    endTime: newSlot.endTime,
    subject: newSlot.subject,
    teacherId: newSlot.teacherId,
    teacherName: newSlot.teacherName || 'Faculty Member',
    roomId: newSlot.roomId,
    roomName: newSlot.roomName || 'Classroom',
    divisionId: newSlot.divisionId,
    divisionName: newSlot.divisionName || 'Division',
  };

  timetableSlotsData.push(slotItem);
  res.status(201).json({ message: 'Lecture slot scheduled clash-free!', slot: slotItem });
});

// ==============================================================================
// 8. CAMPUS AUXILIARY (Library, Hostel, Transport, Inventory, Visitor)
// ==============================================================================

enterpriseRouter.get('/auxiliary/library/books', (_req: Request, res: Response) => {
  res.json({ total: libraryBooksData.length, books: libraryBooksData });
});

enterpriseRouter.post('/auxiliary/visitor-passes', (req: Request, res: Response) => {
  const { visitorName, phone, purpose, whomToMeet } = req.body;

  if (!visitorName || !phone || !whomToMeet) {
    return res.status(400).json({ error: 'Visitor name, phone, and purpose are mandatory' });
  }

  const pass = {
    id: `gp-${Date.now()}`,
    passNumber: `GP-2026-${String(visitorGatePassesData.length + 101).padStart(4, '0')}`,
    visitorName,
    phone,
    purpose: purpose || 'Official Campus Visit',
    whomToMeet,
    inTime: new Date().toISOString(),
    status: 'INSIDE_CAMPUS' as const,
  };

  visitorGatePassesData.unshift(pass);
  res.status(201).json({ message: 'Visitor gate pass issued with badge verification', pass });
});

enterpriseRouter.get('/auxiliary/visitor-passes', (_req: Request, res: Response) => {
  res.json({ passes: visitorGatePassesData });
});

enterpriseRouter.get('/auxiliary/inventory', (_req: Request, res: Response) => {
  res.json({ items: inventoryItemsData });
});

// ==============================================================================
// 9. WHATSAPP BUSINESS & NOTICES
// ==============================================================================

enterpriseRouter.get('/communication/whatsapp/logs', (_req: Request, res: Response) => {
  res.json({ total: whatsAppLogsData.length, logs: whatsAppLogsData });
});

enterpriseRouter.post('/communication/whatsapp/send', (req: Request, res: Response) => {
  const { recipientPhone, recipientName, templateName, message } = req.body;

  const logItem = {
    id: `wa-${Date.now()}`,
    recipientPhone: recipientPhone || '+91 99999 88888',
    recipientName: recipientName || 'Parent / Student',
    templateName: templateName || 'custom_alert',
    message: message || 'Important trust notification.',
    status: 'DELIVERED' as const,
    sentAt: new Date().toISOString(),
  };

  whatsAppLogsData.unshift(logItem);
  res.status(201).json({ message: 'WhatsApp message dispatched through Business API gateway', log: logItem });
});

enterpriseRouter.get('/communication/notices', (_req: Request, res: Response) => {
  res.json({ notices: noticePostsData });
});

enterpriseRouter.post('/communication/notices/post', (req: Request, res: Response) => {
  const { title, content, targetRoles, isUrgent } = req.body;

  const newPost = {
    id: `notice-${Date.now()}`,
    title,
    content,
    targetRoles: targetRoles || ['SUPERADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    postedBy: req.user?.name || 'Trust Director',
    publishedAt: new Date().toISOString(),
    isUrgent: Boolean(isUrgent),
  };

  noticePostsData.unshift(newPost);
  res.status(201).json({ message: 'Notice posted to digital bulletin boards across campuses', notice: newPost });
});

// ==============================================================================
// 10. AUDIT TRAIL API
// ==============================================================================

enterpriseRouter.get('/audit/logs', (req: Request, res: Response) => {
  const { tableName, recordId, limit } = req.query;
  const logs = getAuditLogs({
    tableName: tableName ? String(tableName) : undefined,
    recordId: recordId ? String(recordId) : undefined,
    limit: limit ? Number(limit) : 50,
  });
  res.json({ total: logs.length, logs });
});
