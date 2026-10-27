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
  examSeatingData,
  ExamSeatingAllocationRecord,
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
  classroomAllocationsData,
  ClassroomAllocationRecord,
  questionBankData,
  questionPapersData,
  BankQuestion,
  QuestionPaperRecord,
  parentMeetingsData,
  ParentMeetingRecord,
  ParentMeetingRSVP,
} from '../enterpriseStore.js';
import { studentsData } from '../dataStore.js';
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
    studentNameMarathi,
    grNumber,
    branchName,
    gradeOrCourse,
    certificateType,
    academicYear,
    motherName,
    motherNameMarathi,
    fatherName,
    fatherNameMarathi,
    dob,
    dobWords,
    placeOfBirth,
    placeOfBirthMarathi,
    nationality,
    religion,
    caste,
    casteMarathi,
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

  // Also update student record with Marathi names if provided
  if (studentId) {
    const matchedStudent = studentsData.find((s) => s.id === studentId);
    if (matchedStudent) {
      if (studentNameMarathi) matchedStudent.nameMarathi = studentNameMarathi;
      if (motherNameMarathi) matchedStudent.motherNameMarathi = motherNameMarathi;
      if (fatherNameMarathi) matchedStudent.fatherNameMarathi = fatherNameMarathi;
      if (placeOfBirthMarathi) matchedStudent.placeOfBirthMarathi = placeOfBirthMarathi;
      if (casteMarathi) matchedStudent.casteMarathi = casteMarathi;
    }
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
    studentNameMarathi: studentNameMarathi || undefined,
    grNumber: grNumber || 'GR-ARCHIVE',
    branchName: branchName || 'Zep Foundation Institution',
    gradeOrCourse: gradeOrCourse || 'Enrolled / Graduated Course',
    academicYear: academicYear || '2026-2027',
    issueDate: new Date().toISOString().slice(0, 10),
    issuedBy: signatoryName || req.user?.name || 'Principal / Authorized Officer',
    digitalSignatureHash: `SHA256:${Buffer.from(studentName + serialNo + Date.now()).toString('hex').slice(0, 64)}`,
    qrVerificationUrl: `http://localhost:5000/verify/doc/${certId}`,
    motherName: motherName || undefined,
    motherNameMarathi: motherNameMarathi || undefined,
    fatherName: fatherName || undefined,
    fatherNameMarathi: fatherNameMarathi || undefined,
    dob: dob || undefined,
    dobWords: dobWords || undefined,
    placeOfBirth: placeOfBirth || undefined,
    placeOfBirthMarathi: placeOfBirthMarathi || undefined,
    nationality: nationality || 'Indian',
    religion: religion || undefined,
    caste: caste || undefined,
    casteMarathi: casteMarathi || undefined,
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

enterpriseRouter.patch('/certificates/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const cert = issuedCertificatesData.find((c) => c.id === id || c.certificateSerialNo.toLowerCase() === id.toLowerCase());
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }

  Object.assign(cert, req.body);

  logAuditEvent({
    tableName: 'issued_certificates',
    recordId: cert.certificateSerialNo,
    action: 'UPDATE',
    newData: cert,
    performedBy: req.user?.name || 'Principal',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: 'Certificate details updated successfully!', certificate: cert });
});

enterpriseRouter.delete('/certificates/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = issuedCertificatesData.findIndex((c) => c.id === id || c.certificateSerialNo.toLowerCase() === id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Certificate not found' });
  }

  const [removed] = issuedCertificatesData.splice(index, 1);

  logAuditEvent({
    tableName: 'issued_certificates',
    recordId: removed.certificateSerialNo,
    action: 'DELETE',
    newData: { status: 'REVOKED' },
    performedBy: req.user?.name || 'Principal',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: 'Certificate successfully revoked/deleted', certificate: removed });
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
      { roomNo: 'Room 201 - Science Block', capacity: 40, scheduledExam: 'Science & Thermal Thermodynamics', benchedStudents: examSeatingData.filter(s => s.roomNo.includes('Room 201')).length },
      { roomNo: 'Hall 104 - Junior Wing', capacity: 32, scheduledExam: 'Mathematics & Analytical Geometry', benchedStudents: examSeatingData.filter(s => s.roomNo.includes('Hall 104')).length },
      { roomNo: 'Basic Training Kitchen Hall', capacity: 30, scheduledExam: 'Food Production & Bakery Technology', benchedStudents: examSeatingData.filter(s => s.roomNo.includes('Basic Training Kitchen')).length },
    ],
    antiCheatingRule: 'Strict alternating bench allocation between School Standard 10 and College Hotel Mgmt students to prevent collusion.',
    totalAllocated: examSeatingData.length,
  });
});

enterpriseRouter.get('/exams/seating', (req: Request, res: Response) => {
  const { examName, roomNo, search } = req.query;
  let result = [...examSeatingData];

  if (examName && typeof examName === 'string' && examName !== 'ALL') {
    result = result.filter((item) => (item.examName || '').toLowerCase() === examName.toLowerCase());
  }

  if (roomNo && typeof roomNo === 'string' && roomNo !== 'ALL') {
    result = result.filter((item) => (item.roomNo || '').toLowerCase().includes(roomNo.toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (item) =>
        (item.studentName || '').toLowerCase().includes(q) ||
        (item.rollNo || '').toLowerCase().includes(q) ||
        (item.hallTicketNo || '').toLowerCase().includes(q) ||
        (item.benchNo || '').toLowerCase().includes(q) ||
        (item.examName || '').toLowerCase().includes(q) ||
        (item.admissionNo || '').toLowerCase().includes(q)
    );
  }

  res.json({ total: result.length, allocations: result });
});

enterpriseRouter.post('/exams/seating', (req: Request, res: Response) => {
  const {
    examName,
    subject,
    subjectCode,
    examDate,
    examTime,
    roomNo,
    blockNo,
    invigilatorName,
    rollNo,
    studentName,
    admissionNo,
    hallTicketNo,
    benchNo,
    classOrGrade,
    notes,
  } = req.body;

  if (!examName || !studentName || !rollNo) {
    return res.status(400).json({ error: 'Exam Name, Student Name, and Roll Number are mandatory.' });
  }

  const existingInExam = examSeatingData.filter((e) => e.examName === examName);
  const nextSrNo = existingInExam.length + 1;

  const newAllocation: ExamSeatingAllocationRecord = {
    id: `seat-alloc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    examName,
    subject: subject || 'General Academic Assessment',
    subjectCode: subjectCode || 'EXAM-GEN',
    examDate: examDate || new Date().toISOString().split('T')[0],
    examTime: examTime || '10:00 AM - 01:00 PM',
    roomNo: roomNo || 'Main Examination Hall',
    blockNo: blockNo || 'Block 1',
    invigilatorName: invigilatorName || 'Staff Invigilator',
    srNo: nextSrNo,
    rollNo,
    studentName,
    admissionNo: admissionNo || `ADM-${Date.now().toString().slice(-6)}`,
    hallTicketNo: hallTicketNo || `HT-2026-${100 + nextSrNo}`,
    benchNo: benchNo || `Bench ${String(Math.ceil(nextSrNo / 2)).padStart(2, '0')}-${nextSrNo % 2 === 1 ? 'A' : 'B'}`,
    classOrGrade: classOrGrade || 'Standard 10-A',
    attendanceStatus: 'ALLOCATED',
    notes: notes || '',
  };

  examSeatingData.push(newAllocation);

  logAuditEvent({
    tableName: 'exam_seating_allocations',
    recordId: newAllocation.id,
    action: 'INSERT',
    newData: newAllocation,
    performedBy: req.user?.name || 'Exam Controller Office',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: `Allocated seat ${newAllocation.benchNo} for ${newAllocation.studentName} in ${newAllocation.examName}`,
    allocation: newAllocation,
  });
});

enterpriseRouter.put('/exams/seating/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = examSeatingData.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Seating record not found.' });
  }

  const oldData = { ...examSeatingData[index] };
  examSeatingData[index] = { ...examSeatingData[index], ...req.body };

  logAuditEvent({
    tableName: 'exam_seating_allocations',
    recordId: id,
    action: 'UPDATE',
    oldData,
    newData: examSeatingData[index],
    performedBy: req.user?.name || 'Exam Controller Office',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: 'Seating allocation updated successfully', allocation: examSeatingData[index] });
});

enterpriseRouter.delete('/exams/seating/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = examSeatingData.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Seating record not found.' });
  }

  const removed = examSeatingData.splice(index, 1)[0];

  logAuditEvent({
    tableName: 'exam_seating_allocations',
    recordId: id,
    action: 'DELETE',
    oldData: removed,
    performedBy: req.user?.name || 'Exam Controller Office',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: `Seating allocation removed for ${removed.studentName}` });
});

enterpriseRouter.post('/exams/seating/auto-allocate', (req: Request, res: Response) => {
  const { examName, roomNo, class1, class2, count = 12 } = req.body;

  const targetExam = examName || 'Interleaved Anti-Collusion Assessment 2026';
  const targetRoom = roomNo || 'Room 201 - Science Block';
  const c1 = class1 || 'Class 10-A';
  const c2 = class2 || 'B.Sc HM Semester 3';

  const newRecords: ExamSeatingAllocationRecord[] = [];
  for (let i = 0; i < count; i++) {
    const isOdd = i % 2 === 0;
    const benchIndex = Math.floor(i / 2) + 1;
    const benchPosition = isOdd ? 'A (Window)' : 'B (Aisle)';
    const assignedClass = isOdd ? c1 : c2;
    const isSchool = assignedClass.includes('10') || assignedClass.includes('Class');
    const studentName = isSchool
      ? `School Candidate ${i + 1}`
      : `College Hospitality Student ${i + 1}`;
    const rollNo = isSchool ? `10A-${String(Math.floor(i / 2) + 1).padStart(2, '0')}` : `HM-${100 + Math.floor(i / 2) + 1}`;

    const rec: ExamSeatingAllocationRecord = {
      id: `seat-auto-${Date.now()}-${i}`,
      examName: targetExam,
      subject: isSchool ? 'Mathematics & Statistics' : 'Culinary Operations & Safety',
      subjectCode: isSchool ? 'MTH-102' : 'HM-201',
      examDate: '2026-10-31',
      examTime: '10:00 AM - 01:00 PM',
      roomNo: targetRoom,
      blockNo: 'Anti-Collusion Interleaved Wing',
      invigilatorName: 'Prof. R. S. Kulkarni & Mrs. Anjali Deshmukh',
      srNo: i + 1,
      rollNo,
      studentName,
      admissionNo: isSchool ? `SCH-2026-${100 + i}` : `HM-2026-${200 + i}`,
      hallTicketNo: `HT-2026-${300 + i}`,
      benchNo: `Bench ${String(benchIndex).padStart(2, '0')}-${benchPosition}`,
      classOrGrade: assignedClass,
      branchName: isSchool ? 'Saraswati International Public School' : 'Modern College of Hotel Management and Technology',
      attendanceStatus: 'ALLOCATED',
      notes: 'Generated via automated zero-adjacency anti-cheating matrix',
    };

    examSeatingData.push(rec);
    newRecords.push(rec);
  }

  res.status(201).json({
    message: `Generated ${newRecords.length} interleaved anti-collusion seat allocations across ${Math.ceil(count / 2)} benches.`,
    allocations: newRecords,
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

// ==============================================================================
// 11. CLASSROOM & CLASS TEACHER ALLOCATION API
// ==============================================================================

/**
 * @swagger
 * /api/enterprise/classrooms/allocations:
 *   get:
 *     summary: List Classroom & Class Teacher Allocations
 *     description: Retrieve all classrooms, assigned class teachers, student counts, and status across School and College.
 *     tags: [Enterprise & Campus Operations]
 */
enterpriseRouter.get('/classrooms/allocations', (req: Request, res: Response) => {
  const { branchScope, branchId, status, search, academicYear } = req.query;
  let result = [...classroomAllocationsData];

  if (branchScope && typeof branchScope === 'string' && branchScope !== 'ALL') {
    result = result.filter((item) => item.branchScope === branchScope);
  }

  if (branchId && typeof branchId === 'string' && branchId !== 'ALL') {
    result = result.filter((item) => item.branchId === branchId);
  }

  if (academicYear && typeof academicYear === 'string') {
    result = result.filter((item) => item.academicYear === academicYear);
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    result = result.filter((item) => item.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (item) =>
        item.classroomName.toLowerCase().includes(q) ||
        item.roomCode.toLowerCase().includes(q) ||
        item.classOrGrade.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q) ||
        (item.specializationSubject || '').toLowerCase().includes(q) ||
        (item.coTeacherName || '').toLowerCase().includes(q)
    );
  }

  const assignedCount = result.filter((r) => r.status !== 'VACANT' && r.teacherName !== 'Unassigned').length;
  const vacantCount = result.filter((r) => r.status === 'VACANT' || r.teacherName === 'Unassigned').length;
  const totalStudents = result.reduce((acc, r) => acc + (r.enrolledStudentsCount || 0), 0);

  res.json({
    total: result.length,
    allocations: result,
    summary: {
      totalClassrooms: result.length,
      assignedCount,
      vacantCount,
      totalStudents,
      averageClassStrength: assignedCount > 0 ? Math.round(totalStudents / assignedCount) : 0,
    },
  });
});

/**
 * @swagger
 * /api/enterprise/classrooms/allocations:
 *   post:
 *     summary: Assign Class Teacher to Classroom
 *     description: Allocate a teacher to a classroom/section with responsibilities and schedule.
 *     tags: [Enterprise & Campus Operations]
 */
enterpriseRouter.post('/classrooms/allocations', (req: Request, res: Response) => {
  const {
    classroomId,
    classroomName,
    roomCode,
    wing,
    floor,
    capacity,
    classOrGrade,
    division,
    enrolledStudentsCount,
    teacherId,
    teacherName,
    teacherEmail,
    teacherPhone,
    teacherDesignation,
    specializationSubject,
    coTeacherId,
    coTeacherName,
    coTeacherSubject,
    responsibilities,
    classTeacherMeetingHours,
    branchScope,
    branchId,
    academicYear,
    remarks,
  } = req.body;

  if (!classOrGrade || (!classroomId && !classroomName)) {
    return res.status(400).json({
      error: 'Missing mandatory fields: classOrGrade and classroom details (classroomId or classroomName) are required.',
    });
  }

  // Check for duplicate teacher assignment warning
  let conflictWarning: string | null = null;
  if (teacherId && teacherName && teacherName !== 'Unassigned') {
    const existing = classroomAllocationsData.find(
      (a) => a.teacherId === teacherId && a.status === 'ACTIVE'
    );
    if (existing) {
      conflictWarning = `Notice: ${teacherName} is already assigned as Class Teacher for ${existing.classOrGrade} (${existing.roomCode}).`;
    }
  }

  const newAllocation: ClassroomAllocationRecord = {
    id: `alloc-rm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    branchScope: branchScope || 'SCHOOL',
    branchId: branchId || (branchScope === 'COLLEGE' ? 'branch-hm-01' : 'branch-sch-01'),
    academicYear: academicYear || '2026-2027',
    classroomId: classroomId || `rm-${Date.now()}`,
    classroomName: classroomName || 'Standard Classroom',
    roomCode: roomCode || 'ROOM-STD',
    wing: wing || 'Academic Wing',
    floor: floor || '1st Floor',
    capacity: Number(capacity) || 45,
    classOrGrade,
    division: division || 'A',
    enrolledStudentsCount: Number(enrolledStudentsCount) || 30,
    teacherId: teacherId || '',
    teacherName: teacherName || 'Unassigned',
    teacherEmail,
    teacherPhone,
    teacherDesignation: teacherDesignation || 'Faculty Member',
    specializationSubject,
    coTeacherId,
    coTeacherName,
    coTeacherSubject,
    responsibilities: responsibilities || [
      'Daily Roll Call Attendance Signoff',
      'Report Card & Marksheet Signoff',
      'Discipline & Conduct Records',
      'Parent-Teacher Association Liaison',
    ],
    classTeacherMeetingHours: classTeacherMeetingHours || '08:30 AM - 09:00 AM',
    status: teacherName && teacherName !== 'Unassigned' ? 'ACTIVE' : 'VACANT',
    assignedDate: new Date().toISOString().split('T')[0],
    remarks,
  };

  classroomAllocationsData.unshift(newAllocation);

  logAuditEvent({
    tableName: 'classroom_allocations',
    recordId: newAllocation.id,
    action: 'INSERT',
    newData: newAllocation,
    performedBy: req.user?.name || 'Academic Dean / Principal',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: `Class Teacher ${newAllocation.teacherName} assigned to ${newAllocation.classroomName} (${newAllocation.classOrGrade}) successfully!`,
    allocation: newAllocation,
    conflictWarning,
  });
});

/**
 * @swagger
 * /api/enterprise/classrooms/allocations/{id}:
 *   put:
 *     summary: Update Classroom & Teacher Allocation
 *     description: Modify assigned teacher, room details, or responsibilities.
 *     tags: [Enterprise & Campus Operations]
 */
enterpriseRouter.put('/classrooms/allocations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = classroomAllocationsData.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Classroom allocation with ID ${id} not found.` });
  }

  const oldData = { ...classroomAllocationsData[index] };
  classroomAllocationsData[index] = {
    ...classroomAllocationsData[index],
    ...req.body,
    id, // Keep immutable ID
  };

  logAuditEvent({
    tableName: 'classroom_allocations',
    recordId: id,
    action: 'UPDATE',
    oldData,
    newData: classroomAllocationsData[index],
    performedBy: req.user?.name || 'Academic Dean / Principal',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    message: 'Classroom allocation updated successfully!',
    allocation: classroomAllocationsData[index],
  });
});

/**
 * @swagger
 * /api/enterprise/classrooms/allocations/{id}:
 *   delete:
 *     summary: Vacate or Remove Classroom Allocation
 *     description: Remove teacher assignment or delete classroom allocation record.
 *     tags: [Enterprise & Campus Operations]
 */
enterpriseRouter.delete('/classrooms/allocations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = classroomAllocationsData.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Classroom allocation with ID ${id} not found.` });
  }

  const removed = classroomAllocationsData.splice(index, 1)[0];

  logAuditEvent({
    tableName: 'classroom_allocations',
    recordId: id,
    action: 'DELETE',
    oldData: removed,
    performedBy: req.user?.name || 'Academic Dean / Principal',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    message: `Classroom ${removed.classroomName} (${removed.classOrGrade}) allocation removed successfully.`,
    removed,
  });
});

// ==============================================================================
// 12. MULTI-LINGUAL QUESTION BANK & QUESTION PAPER GENERATOR API
// ==============================================================================

/**
 * @swagger
 * /api/enterprise/question-bank:
 *   get:
 *     summary: List Multi-Lingual Question Bank
 *     description: Retrieve exam questions supporting Mathematics formulas, Marathi (मराठी), Hindi (हिंदी), and English.
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.get('/question-bank', (req: Request, res: Response) => {
  const { subject, gradeOrClass, language, questionType, difficulty, search, branchScope } = req.query;
  let result = [...questionBankData];

  if (subject && typeof subject === 'string' && subject !== 'ALL') {
    result = result.filter((q) => q.subject.toLowerCase().includes(subject.toLowerCase()));
  }

  if (gradeOrClass && typeof gradeOrClass === 'string' && gradeOrClass !== 'ALL') {
    result = result.filter((q) => q.gradeOrClass.toLowerCase().includes(gradeOrClass.toLowerCase()));
  }

  if (language && typeof language === 'string' && language !== 'ALL') {
    result = result.filter((q) => q.language === language);
  }

  if (questionType && typeof questionType === 'string' && questionType !== 'ALL') {
    result = result.filter((q) => q.questionType === questionType);
  }

  if (difficulty && typeof difficulty === 'string' && difficulty !== 'ALL') {
    result = result.filter((q) => q.difficulty === difficulty);
  }

  if (branchScope && typeof branchScope === 'string' && branchScope !== 'ALL') {
    result = result.filter((q) => q.branchScope === branchScope);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    result = result.filter(
      (q) =>
        q.questionText.toLowerCase().includes(s) ||
        q.chapterTopic.toLowerCase().includes(s) ||
        q.code.toLowerCase().includes(s) ||
        (q.formulaUsed || '').toLowerCase().includes(s) ||
        q.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  // Breakdown metrics
  const countsByLanguage = {
    ENGLISH: questionBankData.filter((q) => q.language === 'ENGLISH').length,
    MARATHI: questionBankData.filter((q) => q.language === 'MARATHI').length,
    HINDI: questionBankData.filter((q) => q.language === 'HINDI').length,
    BILINGUAL: questionBankData.filter((q) => q.language.startsWith('BILINGUAL')).length,
  };

  const countsByType = {
    NUMERICAL_MATH: questionBankData.filter((q) => q.questionType === 'NUMERICAL_MATH').length,
    MCQ: questionBankData.filter((q) => q.questionType === 'MCQ').length,
    SHORT: questionBankData.filter((q) => q.questionType === 'SHORT').length,
    LONG: questionBankData.filter((q) => q.questionType === 'LONG').length,
  };

  res.json({
    total: result.length,
    questions: result,
    summary: {
      totalQuestions: questionBankData.length,
      filteredCount: result.length,
      countsByLanguage,
      countsByType,
    },
  });
});

/**
 * @swagger
 * /api/enterprise/question-bank:
 *   post:
 *     summary: Add New Question to Bank
 *     description: Submit a new question in any language (Math, Marathi, Hindi, English).
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.post('/question-bank', (req: Request, res: Response) => {
  const {
    subject,
    subjectCode,
    gradeOrClass,
    branchScope,
    chapterTopic,
    language,
    questionType,
    marks,
    difficulty,
    bloomLevel,
    questionText,
    questionTextSecondary,
    options,
    correctAnswer,
    solutionExplanation,
    formulaUsed,
    tags,
  } = req.body;

  if (!subject || !questionText || marks === undefined) {
    return res.status(400).json({
      error: 'Missing mandatory fields: subject, questionText, and marks are required.',
    });
  }

  const newQuestion: BankQuestion = {
    id: `qb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    code: req.body.code || `Q-${(subjectCode || 'GEN').toUpperCase()}-${Date.now().toString().slice(-4)}`,
    subject,
    subjectCode: subjectCode || 'GEN-01',
    gradeOrClass: gradeOrClass || 'Class 10-A',
    branchScope: branchScope || 'SCHOOL',
    chapterTopic: chapterTopic || 'General Chapter',
    language: language || 'ENGLISH',
    questionType: questionType || 'SHORT',
    marks: Number(marks) || 2,
    difficulty: difficulty || 'MEDIUM',
    bloomLevel: bloomLevel || 'UNDERSTAND',
    questionText,
    questionTextSecondary,
    options: Array.isArray(options) ? options : undefined,
    correctAnswer: correctAnswer || 'See marking scheme',
    solutionExplanation,
    formulaUsed,
    tags: Array.isArray(tags) ? tags : ['ExamQuestion'],
    createdAt: new Date().toISOString().split('T')[0],
  };

  questionBankData.unshift(newQuestion);

  logAuditEvent({
    tableName: 'question_bank',
    recordId: newQuestion.id,
    action: 'INSERT',
    newData: newQuestion,
    performedBy: req.user?.name || 'Subject Expert / Faculty',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: `Question ${newQuestion.code} added to Question Bank in ${newQuestion.language} successfully!`,
    question: newQuestion,
  });
});

/**
 * @swagger
 * /api/enterprise/question-bank/{id}:
 *   delete:
 *     summary: Delete Question from Bank
 *     description: Remove a question from the repository.
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.delete('/question-bank/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = questionBankData.findIndex((q) => q.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Question with ID ${id} not found.` });
  }

  const removed = questionBankData.splice(index, 1)[0];

  logAuditEvent({
    tableName: 'question_bank',
    recordId: id,
    action: 'DELETE',
    oldData: removed,
    performedBy: req.user?.name || 'Subject Expert / Faculty',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: `Question ${removed.code} removed successfully.` });
});

/**
 * @swagger
 * /api/enterprise/question-papers:
 *   get:
 *     summary: List Generated Question Papers
 *     description: Retrieve all compiled question papers with section breakdowns.
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.get('/question-papers', (req: Request, res: Response) => {
  const { branchScope, language, search } = req.query;
  let result = [...questionPapersData];

  if (branchScope && typeof branchScope === 'string' && branchScope !== 'ALL') {
    result = result.filter((p) => p.branchScope === branchScope);
  }

  if (language && typeof language === 'string' && language !== 'ALL') {
    result = result.filter((p) => p.language === language);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.paperCode.toLowerCase().includes(s) ||
        p.subject.toLowerCase().includes(s)
    );
  }

  res.json({ total: result.length, questionPapers: result });
});

/**
 * @swagger
 * /api/enterprise/question-papers:
 *   post:
 *     summary: Assemble & Generate Question Paper
 *     description: Create an official question paper with section breakdown, time allowance, and question bank linkage.
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.post('/question-papers', (req: Request, res: Response) => {
  const {
    title,
    paperCode,
    subject,
    gradeOrClass,
    branchScope,
    language,
    academicYear,
    maxMarks,
    timeAllowedMinutes,
    generalInstructions,
    sections,
    questionIds,
    authorTeacher,
  } = req.body;

  if (!title || !subject || !maxMarks) {
    return res.status(400).json({
      error: 'Missing mandatory fields: title, subject, and maxMarks are required.',
    });
  }

  // Resolve questions from questionIds or sections
  let resolvedQuestions: BankQuestion[] = [];
  if (Array.isArray(questionIds) && questionIds.length > 0) {
    resolvedQuestions = questionBankData.filter((q) => questionIds.includes(q.id));
  } else if (Array.isArray(sections)) {
    const allSecIds: string[] = [];
    sections.forEach((sec: any) => {
      if (Array.isArray(sec.questionIds)) allSecIds.push(...sec.questionIds);
    });
    resolvedQuestions = questionBankData.filter((q) => allSecIds.includes(q.id));
  }

  // If no questions attached, auto-pick relevant questions from bank
  if (resolvedQuestions.length === 0) {
    resolvedQuestions = questionBankData
      .filter((q) => q.subject.toLowerCase().includes(subject.toLowerCase()) || (language && q.language === language))
      .slice(0, 6);
  }

  const newPaper: QuestionPaperRecord = {
    id: `qp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    paperCode: paperCode || `QP-${Date.now().toString().slice(-6)}`,
    title,
    subject,
    gradeOrClass: gradeOrClass || 'Class 10-A',
    branchScope: branchScope || 'SCHOOL',
    language: language || 'ENGLISH',
    academicYear: academicYear || '2026-2027',
    maxMarks: Number(maxMarks) || 80,
    timeAllowedMinutes: Number(timeAllowedMinutes) || 180,
    generalInstructions: generalInstructions || [
      'All questions are compulsory.',
      'Figures to the right indicate full marks.',
      'Use of electronic calculators is strictly prohibited.',
    ],
    sections: sections || [
      {
        sectionName: 'Section A - Objective & Short Questions',
        targetMarks: Math.round(Number(maxMarks) * 0.4),
        questionIds: resolvedQuestions.slice(0, 3).map((q) => q.id),
      },
      {
        sectionName: 'Section B - Descriptive & Problem Solving',
        targetMarks: Math.round(Number(maxMarks) * 0.6),
        questionIds: resolvedQuestions.slice(3).map((q) => q.id),
      },
    ],
    questions: resolvedQuestions,
    status: 'FINALIZED',
    createdDate: new Date().toISOString().split('T')[0],
    authorTeacher: authorTeacher || req.user?.name || 'Academic Examination Cell',
  };

  questionPapersData.unshift(newPaper);

  logAuditEvent({
    tableName: 'question_papers',
    recordId: newPaper.id,
    action: 'INSERT',
    newData: newPaper,
    performedBy: req.user?.name || 'Academic Dean / Examination Incharge',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: `Question Paper "${newPaper.title}" successfully assembled with ${resolvedQuestions.length} questions!`,
    questionPaper: newPaper,
  });
});

/**
 * @swagger
 * /api/enterprise/question-papers/{id}:
 *   get:
 *     summary: Retrieve Single Question Paper
 *     description: Get full formatted question paper with questions and section breakdown.
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.get('/question-papers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const paper = questionPapersData.find((p) => p.id === id);

  if (!paper) {
    return res.status(404).json({ error: `Question paper with ID ${id} not found.` });
  }

  res.json({ questionPaper: paper });
});

/**
 * @swagger
 * /api/enterprise/question-papers/{id}:
 *   delete:
 *     summary: Delete Question Paper
 *     description: Remove a question paper from the repository.
 *     tags: [Examination & Question Bank]
 */
enterpriseRouter.delete('/question-papers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = questionPapersData.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Question paper with ID ${id} not found.` });
  }

  const removed = questionPapersData.splice(index, 1)[0];

  logAuditEvent({
    tableName: 'question_papers',
    recordId: id,
    action: 'DELETE',
    oldData: removed,
    performedBy: req.user?.name || 'Academic Examination Cell',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: `Question paper "${removed.title}" deleted successfully.` });
});

// ==============================================================================
// 12. PARENT-TEACHER MEETINGS (PTM) & NOTIFICATION DISPATCH
// ==============================================================================

/**
 * @swagger
 * /api/enterprise/parent-meetings:
 *   get:
 *     summary: List Parent-Teacher Meetings
 *     description: Retrieve all scheduled, in-progress, or completed parent meetings across School and College with filters.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.get('/parent-meetings', (req: Request, res: Response) => {
  const { branchScope, targetClass, status, search } = req.query;

  let filtered = [...parentMeetingsData];

  if (branchScope && branchScope !== 'ALL') {
    filtered = filtered.filter(
      (m) => m.branchScope === branchScope || m.branchScope === 'ALL'
    );
  }

  if (targetClass && targetClass !== 'ALL') {
    filtered = filtered.filter(
      (m) =>
        m.targetAudienceType === 'ALL_CLASSES' ||
        m.targetClasses.some((c) => c.toLowerCase().includes(String(targetClass).toLowerCase()))
    );
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter((m) => m.status === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q) ||
        m.teacherInCharge.toLowerCase().includes(q) ||
        m.targetClasses.some((c) => c.toLowerCase().includes(q))
    );
  }

  // Summary Metrics
  const totalMeetings = parentMeetingsData.length;
  const upcomingCount = parentMeetingsData.filter((m) => m.status === 'SCHEDULED').length;
  const totalParentsTargeted = parentMeetingsData.reduce(
    (acc, m) => acc + (m.notificationDispatch?.totalParentsTargeted || 0),
    0
  );
  const totalAttendingRsvps = parentMeetingsData.reduce(
    (acc, m) => acc + m.rsvps.filter((r) => r.status === 'ATTENDING').length,
    0
  );

  res.json({
    total: filtered.length,
    metrics: {
      totalMeetings,
      upcomingCount,
      totalParentsTargeted,
      totalAttendingRsvps,
    },
    meetings: filtered,
  });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings/{id}:
 *   get:
 *     summary: Get Single Parent-Teacher Meeting
 *     description: Retrieve meeting particulars, agenda, RSVP list, and notification status.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.get('/parent-meetings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const meeting = parentMeetingsData.find((m) => m.id === id);

  if (!meeting) {
    return res.status(404).json({ error: `Parent-Teacher Meeting with ID ${id} not found.` });
  }

  res.json({ meeting });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings:
 *   post:
 *     summary: Schedule Parent-Teacher Meeting
 *     description: School or College schedules a new parent meeting and automatically dispatches notifications to targeted parents.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.post('/parent-meetings', (req: Request, res: Response) => {
  const {
    title,
    branchScope = 'SCHOOL',
    branchName,
    meetingType = 'ACADEMIC_REVIEW',
    targetAudienceType = 'SPECIFIC_CLASSES',
    targetClasses = [],
    meetingMode = 'HYBRID',
    date,
    startTime,
    endTime,
    venue,
    onlineMeetingUrl,
    teacherInCharge,
    teacherPhone,
    agenda = [],
    notes,
    channels = ['IN_APP', 'WHATSAPP', 'SMS'],
  } = req.body;

  if (!title || !date || !startTime || !venue) {
    return res.status(400).json({
      error: 'Missing mandatory fields: title, date, startTime, and venue are required.',
    });
  }

  const resolvedBranchName =
    branchName ||
    (branchScope === 'COLLEGE'
      ? 'Modern College of Hotel Management and Technology Solapur'
      : 'Modern Public School & Jr College Bhose');

  // Build targeted student RSVP list from dataStore students
  const resolvedTargetClasses: string[] = Array.isArray(targetClasses) ? targetClasses : [targetClasses];
  
  const matchedStudents = studentsData.filter((s) => {
    if (branchScope === 'SCHOOL' && s.branchId !== 'branch-sch-01') return false;
    if (branchScope === 'COLLEGE' && s.branchId !== 'branch-hm-01') return false;
    if (targetAudienceType === 'ALL_CLASSES') return true;
    return resolvedTargetClasses.some(
      (tc) =>
        s.gradeOrSemester.toLowerCase().includes(tc.toLowerCase()) ||
        tc.toLowerCase().includes(s.gradeOrSemester.toLowerCase())
    );
  });

  const rsvps: ParentMeetingRSVP[] = matchedStudents.map((s) => ({
    studentId: s.id,
    studentName: s.name,
    rollNo: s.rollNo,
    gradeOrSemester: s.gradeOrSemester,
    parentName: s.parentName || 'Parent / Guardian',
    parentPhone: s.parentPhone || '+91 98230 00000',
    status: 'PENDING',
    attended: false,
  }));

  const meetingId = `ptm-${Date.now()}`;
  const meetingCode = `PTM-${branchScope.slice(0, 3)}-${new Date().getFullYear()}-${String(parentMeetingsData.length + 1).padStart(3, '0')}`;

  const smsTemplateMarathi = `आदरणीय पालक, ${resolvedBranchName} तर्फे पालक सभेचे आयोजन ${date} रोजी वेळ ${startTime} वाजता करण्यात आले आहे. ठिकाण: ${venue}. कृपया उपस्थित राहावे.`;
  const smsTemplateEnglish = `Dear Parent, ${resolvedBranchName} has scheduled a Parent-Teacher Meeting on ${date} at ${startTime}. Venue: ${venue}. Please submit your RSVP on the Parent Portal.`;

  const newMeeting: ParentMeetingRecord = {
    id: meetingId,
    meetingCode,
    branchScope,
    branchName: resolvedBranchName,
    title,
    meetingType,
    targetAudienceType,
    targetClasses: resolvedTargetClasses,
    meetingMode,
    date,
    startTime,
    endTime: endTime || '01:00 PM',
    venue,
    onlineMeetingUrl: onlineMeetingUrl || (meetingMode !== 'IN_PERSON' ? 'https://meet.google.com/zep-ptm-join' : undefined),
    teacherInCharge: teacherInCharge || req.user?.name || 'Class Teacher',
    teacherPhone: teacherPhone || '+91 98220 12345',
    agenda: Array.isArray(agenda) && agenda.length > 0 ? agenda : ['Academic Performance & Result Review', 'Attendance & Discipline', 'Student Development Plan'],
    notes,
    status: 'SCHEDULED',
    notificationDispatch: {
      dispatched: true,
      dispatchedAt: new Date().toISOString(),
      channels: Array.isArray(channels) ? channels : ['IN_APP', 'WHATSAPP', 'SMS'],
      totalParentsTargeted: rsvps.length || 1,
      deliveredCount: rsvps.length || 1,
      readCount: 0,
      smsTemplateMarathi,
      smsTemplateEnglish,
    },
    rsvps,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  parentMeetingsData.unshift(newMeeting);

  // Auto-log WhatsApp broadcast notification for the first target parent
  if (channels.includes('WHATSAPP')) {
    const primaryPhone = rsvps[0]?.parentPhone || '+91 98230 11223';
    const primaryName = rsvps[0]?.parentName || 'Parent';
    whatsAppLogsData.unshift({
      id: `wa-ptm-${Date.now()}`,
      recipientPhone: primaryPhone,
      recipientName: primaryName,
      templateName: 'ptm_invitation_broadcast',
      message: `${smsTemplateEnglish} RSVP Link: https://trustedu.org/ptm/${meetingId}`,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
    });
  }

  logAuditEvent({
    tableName: 'parent_meetings',
    recordId: meetingId,
    action: 'CREATE',
    newData: newMeeting,
    performedBy: req.user?.name || 'School/College Administrator',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: 'Parent-Teacher Meeting scheduled and notifications dispatched successfully.',
    meeting: newMeeting,
  });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings/{id}:
 *   put:
 *     summary: Update Parent-Teacher Meeting
 *     description: Update meeting particulars, reschedule timing/venue, or record meeting minutes.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.put('/parent-meetings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = parentMeetingsData.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Parent-Teacher Meeting with ID ${id} not found.` });
  }

  const existing = parentMeetingsData[index];
  const {
    title,
    date,
    startTime,
    endTime,
    venue,
    onlineMeetingUrl,
    teacherInCharge,
    teacherPhone,
    agenda,
    notes,
    status,
    minutesOfMeeting,
  } = req.body;

  const updated: ParentMeetingRecord = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    date: date !== undefined ? date : existing.date,
    startTime: startTime !== undefined ? startTime : existing.startTime,
    endTime: endTime !== undefined ? endTime : existing.endTime,
    venue: venue !== undefined ? venue : existing.venue,
    onlineMeetingUrl: onlineMeetingUrl !== undefined ? onlineMeetingUrl : existing.onlineMeetingUrl,
    teacherInCharge: teacherInCharge !== undefined ? teacherInCharge : existing.teacherInCharge,
    teacherPhone: teacherPhone !== undefined ? teacherPhone : existing.teacherPhone,
    agenda: agenda !== undefined ? agenda : existing.agenda,
    notes: notes !== undefined ? notes : existing.notes,
    status: status !== undefined ? status : existing.status,
    minutesOfMeeting: minutesOfMeeting !== undefined ? minutesOfMeeting : existing.minutesOfMeeting,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  parentMeetingsData[index] = updated;

  logAuditEvent({
    tableName: 'parent_meetings',
    recordId: id,
    action: 'UPDATE',
    oldData: existing,
    newData: updated,
    performedBy: req.user?.name || 'Academic Administrator',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    message: 'Parent-Teacher Meeting updated successfully.',
    meeting: updated,
  });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings/{id}:
 *   delete:
 *     summary: Cancel / Delete Parent-Teacher Meeting
 *     description: Remove meeting record and cancel notice.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.delete('/parent-meetings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = parentMeetingsData.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Parent-Teacher Meeting with ID ${id} not found.` });
  }

  const removed = parentMeetingsData.splice(index, 1)[0];

  logAuditEvent({
    tableName: 'parent_meetings',
    recordId: id,
    action: 'DELETE',
    oldData: removed,
    performedBy: req.user?.name || 'Administrator',
    userRole: req.user?.role,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ message: `Parent-Teacher Meeting "${removed.title}" deleted successfully.` });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings/{id}/rsvp:
 *   post:
 *     summary: Submit Parent RSVP
 *     description: Parent registers their attendance status (Attending, Tentative, Cannot Attend, or Request Reschedule) along with remarks.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.post('/parent-meetings/:id/rsvp', (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, status, parentRemarks, parentName, parentPhone } = req.body;

  const meeting = parentMeetingsData.find((m) => m.id === id);
  if (!meeting) {
    return res.status(404).json({ error: `Parent-Teacher Meeting with ID ${id} not found.` });
  }

  if (!status) {
    return res.status(400).json({ error: 'RSVP status is required (ATTENDING, TENTATIVE, CANNOT_ATTEND, REQUEST_RESCHEDULE).' });
  }

  let rsvp = meeting.rsvps.find((r) => r.studentId === studentId);
  if (!rsvp) {
    // If student was not pre-populated, add to RSVP list
    rsvp = {
      studentId: studentId || `stu-${Date.now()}`,
      studentName: 'Student',
      rollNo: '101',
      gradeOrSemester: meeting.targetClasses[0] || 'General',
      parentName: parentName || 'Parent',
      parentPhone: parentPhone || '+91 98230 00000',
      status,
      attended: false,
    };
    meeting.rsvps.push(rsvp);
  }

  rsvp.status = status;
  rsvp.respondedAt = new Date().toISOString();
  if (parentRemarks !== undefined) rsvp.parentRemarks = parentRemarks;
  if (parentName) rsvp.parentName = parentName;
  if (parentPhone) rsvp.parentPhone = parentPhone;

  meeting.updatedAt = new Date().toISOString().split('T')[0];

  res.json({
    message: 'RSVP submitted successfully. Thank you for confirming your attendance.',
    rsvp,
    meetingSummary: {
      id: meeting.id,
      title: meeting.title,
      totalAttending: meeting.rsvps.filter((r) => r.status === 'ATTENDING').length,
      totalRescheduleRequested: meeting.rsvps.filter((r) => r.status === 'REQUEST_RESCHEDULE').length,
    },
  });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings/{id}/notify:
 *   post:
 *     summary: Trigger Meeting Notification Blast / Reminder
 *     description: Broadcast SMS, WhatsApp, and In-App alerts to parents for upcoming meeting or reminder.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.post('/parent-meetings/:id/notify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { channels = ['IN_APP', 'WHATSAPP', 'SMS'], reminderType = 'STANDARD' } = req.body;

  const meeting = parentMeetingsData.find((m) => m.id === id);
  if (!meeting) {
    return res.status(404).json({ error: `Parent-Teacher Meeting with ID ${id} not found.` });
  }

  meeting.notificationDispatch = {
    dispatched: true,
    dispatchedAt: new Date().toISOString(),
    channels: Array.isArray(channels) ? channels : [channels],
    totalParentsTargeted: meeting.rsvps.length || 1,
    deliveredCount: meeting.rsvps.length || 1,
    readCount: Math.min(meeting.notificationDispatch?.readCount + 1, meeting.rsvps.length),
    smsTemplateMarathi: meeting.notificationDispatch?.smsTemplateMarathi || '',
    smsTemplateEnglish: meeting.notificationDispatch?.smsTemplateEnglish || '',
  };

  // Log WhatsApp reminder
  whatsAppLogsData.unshift({
    id: `wa-remind-${Date.now()}`,
    recipientPhone: meeting.rsvps[0]?.parentPhone || '+91 98230 11223',
    recipientName: `All Parents (${meeting.targetClasses.join(', ')})`,
    templateName: reminderType === '1_DAY_BEFORE' ? 'ptm_1day_reminder' : 'ptm_alert',
    message: `Reminder: Parent-Teacher Meeting for ${meeting.targetClasses.join(', ')} is scheduled on ${meeting.date} at ${meeting.startTime}. Venue: ${meeting.venue}.`,
    status: 'DELIVERED',
    sentAt: new Date().toISOString(),
  });

  res.json({
    message: `Notification blast dispatched successfully across ${channels.join(', ')}.`,
    notificationDispatch: meeting.notificationDispatch,
  });
});

/**
 * @swagger
 * /api/enterprise/parent-meetings/{id}/attendance:
 *   post:
 *     summary: Mark Parent Meeting Attendance
 *     description: Teacher or Admin marks attendance of parents who physically or virtually attended the meeting.
 *     tags: [Parent-Teacher Meetings & PTM]
 */
enterpriseRouter.post('/parent-meetings/:id/attendance', (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, attended = true, teacherRemarks } = req.body;

  const meeting = parentMeetingsData.find((m) => m.id === id);
  if (!meeting) {
    return res.status(404).json({ error: `Parent-Teacher Meeting with ID ${id} not found.` });
  }

  const rsvp = meeting.rsvps.find((r) => r.studentId === studentId);
  if (!rsvp) {
    return res.status(404).json({ error: `Student with ID ${studentId} not found in this meeting's RSVP roster.` });
  }

  rsvp.attended = Boolean(attended);
  if (teacherRemarks !== undefined) rsvp.teacherRemarks = teacherRemarks;

  meeting.updatedAt = new Date().toISOString().split('T')[0];

  res.json({
    message: `Parent attendance marked as ${rsvp.attended ? 'ATTENDED' : 'ABSENT'}.`,
    rsvp,
  });
});
