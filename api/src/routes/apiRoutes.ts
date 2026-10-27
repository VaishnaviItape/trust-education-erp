import { Router, Request, Response } from 'express';
import { authRouter } from './authRoutes.js';
import { superadminRouter } from './superadminRoutes.js';
import { branchAdminRouter } from './branchAdminRoutes.js';
import { teacherRouter } from './teacherRoutes.js';
import { parentRouter } from './parentRoutes.js';
import { studentRouter } from './studentRoutes.js';
import { busDriverRouter } from './busDriverRoutes.js';
import { publicRouter } from './publicRoutes.js';
import {
  trustData,
  branchesData,
  studentsData,
  historicalAlumniData,
  feeReceiptsData,
  progressionHistoryData,
  calculateNextGrade,
  Student,
  FeeReceipt,
  StudentProgressionRecord,
} from '../dataStore.js';

import { enterpriseRouter } from './enterpriseRoutes.js';

export const apiRouter = Router();

// Mount modular enterprise and role routers
apiRouter.use('/enterprise', enterpriseRouter);
apiRouter.use('/', enterpriseRouter); // Also mount at root of /api for direct access (/api/cap, /api/accounting, etc.)
apiRouter.use('/auth', authRouter);
apiRouter.use('/superadmin', superadminRouter);
apiRouter.use('/branch-admin', branchAdminRouter);
apiRouter.use('/teacher', teacherRouter);
apiRouter.use('/parent', parentRouter);
apiRouter.use('/student', studentRouter);
apiRouter.use('/driver', busDriverRouter);
apiRouter.use('/', publicRouter);

// Backwards-compatibility routes for existing web and mobile frontends
apiRouter.get('/trust/overview', (_req: Request, res: Response) => {
  res.json({
    trust: trustData,
    branches: branchesData,
  });
});

apiRouter.get('/students', (req: Request, res: Response) => {
  const { branchId, search, status, batchYear, grNo } = req.query;
  const includeAlumni = (status && status !== 'ALL' && String(status).includes('ALUMNI')) || Boolean(batchYear);
  let result = includeAlumni ? [...studentsData, ...historicalAlumniData] : [...studentsData];

  if (branchId) {
    result = result.filter((s) => s.branchId === branchId);
  }

  if (status && status !== 'ALL') {
    result = result.filter((s) => s.status === status);
  }

  if (batchYear && batchYear !== 'ALL') {
    result = result.filter(
      (s) => s.passingYear === batchYear || (s.academicYear && s.academicYear.includes(String(batchYear)))
    );
  }

  if (grNo) {
    const gq = String(grNo).toLowerCase();
    result = result.filter((s) => s.grNumber && s.grNumber.toLowerCase().includes(gq));
  }

  if (search) {
    const q = String(search).toLowerCase();
    let matches = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        (s.grNumber && s.grNumber.toLowerCase().includes(q)) ||
        s.gradeOrSemester.toLowerCase().includes(q) ||
        (s.motherName && s.motherName.toLowerCase().includes(q)) ||
        (s.parentName && s.parentName.toLowerCase().includes(q)) ||
        (s.passingYear && s.passingYear.includes(q)) ||
        (s.academicYear && s.academicYear.includes(q)) ||
        (s.aadhaarNumber && s.aadhaarNumber.toLowerCase().includes(q)) ||
        (s.penNumber && s.penNumber.toLowerCase().includes(q)) ||
        (s.roleTag && s.roleTag.toLowerCase().includes(q)) ||
        (s.reasonForLeaving && s.reasonForLeaving.toLowerCase().includes(q))
    );
    // If not found in primary pool, check historical alumni archive
    if (matches.length === 0 && !includeAlumni) {
      const alumniMatches = historicalAlumniData.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          (s.grNumber && s.grNumber.toLowerCase().includes(q))
      );
      if (alumniMatches.length > 0) {
        matches = alumniMatches;
      }
    }
    result = matches;
  }

  res.json({
    total: result.length,
    students: result,
  });
});

apiRouter.post('/students/admit', (req: Request, res: Response) => {
  const {
    branchId,
    name,
    nameMarathi,
    gender,
    gradeOrSemester,
    parentName,
    fatherName,
    fatherNameMarathi,
    motherName,
    motherNameMarathi,
    caste,
    casteMarathi,
    placeOfBirth,
    placeOfBirthMarathi,
    parentPhone,
    feeTotal,
    grNumber,
    admissionType,
    isExistingStudent,
    originalAdmissionYear,
    previousSchool,
    lastSchoolAttended,
    standardDivLeft,
    schoolLeavingDate,
    lcReceivedDate,
    reasonForLeaving,
    migrationUniversity,
    voluntarySubjectSpecial,
    previousProgress,
    previousConduct,
    previousLcNumber,
    progress,
    conduct,
    leavingDate,
    leavingGrade,
  } = req.body;

  if (!name || !branchId || !gradeOrSemester) {
    return res.status(400).json({ error: 'Missing required admission fields' });
  }

  const isSchool = branchId === 'branch-sch-01';
  const prefix = isSchool ? 'SCH' : 'HM';
  const newAdmissionNo = `${prefix}-2026-${String(studentsData.length + 101).padStart(3, '0')}`;

  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    branchId,
    admissionNo: newAdmissionNo,
    rollNo: `${gradeOrSemester.slice(0, 3)}-${studentsData.length + 1}`,
    name,
    nameMarathi: nameMarathi || undefined,
    gender: gender || 'MALE',
    gradeOrSemester,
    parentName: parentName || 'Guardian',
    fatherName: fatherName || parentName || undefined,
    fatherNameMarathi: fatherNameMarathi || undefined,
    motherName: motherName || undefined,
    motherNameMarathi: motherNameMarathi || undefined,
    caste: caste || undefined,
    casteMarathi: casteMarathi || undefined,
    placeOfBirth: placeOfBirth || undefined,
    placeOfBirthMarathi: placeOfBirthMarathi || undefined,
    grNumber: grNumber || undefined,
    parentPhone: parentPhone || '+91 99999 00000',
    feeTotal: Number(feeTotal) || (isSchool ? 36000 : 75000),
    feePaid: 0,
    feePending: Number(feeTotal) || (isSchool ? 36000 : 75000),
    attendancePercent: 100,
    kycStatus: 'PENDING',
    admissionType: admissionType || 'Fresh',
    isExistingStudent: isExistingStudent || false,
    originalAdmissionYear: originalAdmissionYear || undefined,
    previousSchool: previousSchool || lastSchoolAttended || undefined,
    lastSchoolAttended: previousSchool || lastSchoolAttended || undefined,
    standardDivLeft: standardDivLeft || undefined,
    schoolLeavingDate: schoolLeavingDate || undefined,
    lcReceivedDate: lcReceivedDate || undefined,
    reasonForLeaving: reasonForLeaving || undefined,
    migrationUniversity: migrationUniversity || undefined,
    voluntarySubjectSpecial: voluntarySubjectSpecial || undefined,
    previousProgress: previousProgress || undefined,
    previousConduct: previousConduct || undefined,
    previousLcNumber: previousLcNumber || undefined,
    progress: progress || previousProgress || 'Good',
    conduct: conduct || previousConduct || 'Good',
    leavingDate: leavingDate || undefined,
    leavingGrade: leavingGrade || undefined,
  };

  studentsData.unshift(newStudent);
  trustData.totalStudents += 1;

  res.status(201).json({
    message: 'Student admission successfully created!',
    student: newStudent,
  });
});

// Update Student Record (e.g. Marathi names, father/mother Marathi, place of birth)
apiRouter.patch('/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = studentsData.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  Object.assign(student, req.body);

  res.json({
    message: 'Student record updated successfully',
    student,
  });
});

apiRouter.put('/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = studentsData.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  Object.assign(student, req.body);

  res.json({
    message: 'Student record updated successfully',
    student,
  });
});

apiRouter.post('/fees/collect', (req: Request, res: Response) => {
  const { studentId, amount, paymentMode } = req.body;

  if (!studentId || !amount) {
    return res.status(400).json({ error: 'studentId and amount are required.' });
  }

  const student = studentsData.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const payAmount = Number(amount);
  student.feePaid += payAmount;
  student.feePending = Math.max(0, student.feeTotal - student.feePaid);
  trustData.totalCollected += payAmount;
  trustData.totalPending = Math.max(0, trustData.totalPending - payAmount);

  const newReceipt: FeeReceipt = {
    id: `rcp-${Date.now()}`,
    receiptNo: `RCP-${student.admissionNo}-${String(feeReceiptsData.length + 1).padStart(3, '0')}`,
    studentId: student.id,
    studentName: student.name,
    branchName:
      student.branchId === 'branch-sch-01'
        ? 'Modern Public School And Junior College Bhose'
        : 'Modern College Of Hotel Management And Technology Solapur',
    amount: payAmount,
    paymentMode: paymentMode || 'UPI',
    date: new Date().toISOString().split('T')[0],
    installmentNo: 2,
    status: 'PAID',
  };

  feeReceiptsData.unshift(newReceipt);

  res.json({
    message: 'Fee payment recorded successfully!',
    receipt: newReceipt,
    studentBalance: {
      total: student.feeTotal,
      paid: student.feePaid,
      pending: student.feePending,
    },
  });
});

apiRouter.get('/fees/receipts', (_req: Request, res: Response) => {
  res.json({ receipts: feeReceiptsData });
});

// Student Promotion & Academic Year Carry-Forward Endpoint
apiRouter.post('/students/promote', (req: Request, res: Response) => {
  const { studentIds, studentId, fromYear, toYear, branchId, annualNewFee } = req.body;

  if (!fromYear || !toYear) {
    return res.status(400).json({ error: 'fromYear and toYear are mandatory parameters.' });
  }

  let targets: Student[] = [];

  if (studentId) {
    const single = studentsData.find((s) => s.id === studentId);
    if (!single) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found.` });
    }
    targets = [single];
  } else if (Array.isArray(studentIds) && studentIds.length > 0) {
    targets = studentsData.filter((s) => studentIds.includes(s.id));
  } else if (branchId) {
    targets = studentsData.filter((s) => s.branchId === branchId);
  } else {
    targets = [...studentsData];
  }

  if (targets.length === 0) {
    return res.status(400).json({ error: 'No matching students found to promote.' });
  }

  const createdRecords: StudentProgressionRecord[] = [];
  let promotedCount = 0;
  let graduatedCount = 0;

  for (const student of targets) {
    const { nextGrade, status } = calculateNextGrade(student.gradeOrSemester);
    const carriedPending = student.feePending;

    if (status === 'PROMOTED') {
      promotedCount++;
    } else {
      graduatedCount++;
    }

    const progRecord: StudentProgressionRecord = {
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: student.id,
      studentName: student.name,
      fromYear,
      toYear,
      fromGrade: student.gradeOrSemester,
      toGrade: nextGrade,
      pendingFeeCarriedForward: carriedPending,
      promotedDate: new Date().toISOString().split('T')[0],
      status,
    };

    progressionHistoryData.unshift(progRecord);
    createdRecords.push(progRecord);

    // Apply progression & carry forward pending balance to student
    student.gradeOrSemester = nextGrade;
    const baseNewFee = Number(annualNewFee) || student.feeTotal;
    student.feeTotal = baseNewFee + carriedPending;
    student.feePaid = 0; // New session starts with pending balance rolled forward
    student.feePending = student.feeTotal;
  }

  res.json({
    message: `Academic progression completed! ${promotedCount} student(s) promoted, ${graduatedCount} graduated/alumni with pending balances carried forward.`,
    promotedCount,
    graduatedCount,
    fromYear,
    toYear,
    records: createdRecords,
  });
});

// View Progression History for a specific student
apiRouter.get('/students/progression-history/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student with ID ${studentId} not found.` });
  }

  const history = progressionHistoryData.filter((p) => p.studentId === studentId);

  res.json({
    studentId: student.id,
    studentName: student.name,
    currentGrade: student.gradeOrSemester,
    currentPendingFee: student.feePending,
    totalProgressionEvents: history.length,
    history,
  });
});

// View all progression history records
apiRouter.get('/students/progression-history', (req: Request, res: Response) => {
  const { toYear, studentId } = req.query;
  let result = [...progressionHistoryData];

  if (toYear) {
    result = result.filter((p) => p.toYear === toYear);
  }
  if (studentId) {
    result = result.filter((p) => p.studentId === studentId);
  }

  res.json({
    total: result.length,
    history: result,
  });
});
