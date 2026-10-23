import { Router, Request, Response } from 'express';
import {
  branchesData,
  studentsData,
  feeReceiptsData,
  trustData,
  Student,
  FeeReceipt,
} from '../dataStore.js';
import { enforceBranchIsolation } from '../middleware/authMiddleware.js';

export const branchAdminRouter = Router();

// Apply branch isolation middleware to all routes in branchAdminRouter
branchAdminRouter.use(enforceBranchIsolation);

/**
 * Helper to resolve the active branch for this isolated admin
 */
const getActiveBranchId = (req: Request): string => {
  return ((req.headers['x-branch-id'] as string) || (req.query.branchId as string) || req.body?.branchId || '') as string;
};

/**
 * @swagger
 * /api/branch-admin/overview:
 *   get:
 *     summary: Branch-Isolated Overview
 *     description: Dashboard stats strictly isolated to the admin's specific branch (School or College).
 *     tags: [Branch Admin (Isolated)]
 */
branchAdminRouter.get('/overview', (req: Request, res: Response) => {
  const branchId = getActiveBranchId(req);
  const branch = branchesData.find((b) => b.id === branchId);

  if (!branch) {
    return res.status(404).json({ error: `Branch not found with ID: ${branchId}` });
  }

  const branchStudents = studentsData.filter((s) => s.branchId === branchId);
  const collected = branchStudents.reduce((sum, s) => sum + s.feePaid, 0);
  const pending = branchStudents.reduce((sum, s) => sum + s.feePending, 0);
  const totalFee = branchStudents.reduce((sum, s) => sum + s.feeTotal, 0);
  const avgAttendance =
    branchStudents.length > 0
      ? Math.round(branchStudents.reduce((sum, s) => sum + s.attendancePercent, 0) / branchStudents.length)
      : 0;

  res.json({
    branch,
    isolationStatus: 'STRICT_BRANCH_ISOLATION_ENFORCED',
    accessLevel: 'WEB_LOGIN_ONLY',
    metrics: {
      totalStrength: branchStudents.length,
      annualTarget: branch.annualTarget,
      feesCollected: collected,
      feesPending: pending,
      totalFeeVolume: totalFee,
      collectionRatePercent: totalFee > 0 ? Math.round((collected / totalFee) * 100) : 0,
      averageAttendancePercent: avgAttendance,
    },
  });
});

/**
 * @swagger
 * /api/branch-admin/students:
 *   get:
 *     summary: Branch-Isolated Student Roster
 *     description: Retrieve students belonging solely to the authorized branch.
 *     tags: [Branch Admin (Isolated)]
 */
branchAdminRouter.get('/students', (req: Request, res: Response) => {
  const branchId = getActiveBranchId(req);
  const { search } = req.query;

  let branchStudents = studentsData.filter((s) => s.branchId === branchId);

  if (search) {
    const q = String(search).toLowerCase();
    branchStudents = branchStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.gradeOrSemester.toLowerCase().includes(q) ||
        (s.aadhaarNumber && s.aadhaarNumber.toLowerCase().includes(q)) ||
        (s.roleTag && s.roleTag.toLowerCase().includes(q))
    );
  }

  res.json({
    branchId,
    total: branchStudents.length,
    students: branchStudents,
  });
});

/**
 * @swagger
 * /api/branch-admin/students:
 *   post:
 *     summary: Admit Student into Branch
 *     description: Create a new admission strictly within this branch.
 *     tags: [Branch Admin (Isolated)]
 */
branchAdminRouter.post('/students', (req: Request, res: Response) => {
  const branchId = getActiveBranchId(req);
  const { name, gender, gradeOrSemester, parentName, parentPhone, feeTotal, hotelSpecialization } = req.body;

  if (!name || !gradeOrSemester) {
    return res.status(400).json({ error: 'Missing mandatory fields: name and gradeOrSemester are required.' });
  }

  const isSchool = branchId === 'branch-sch-01';
  const prefix = isSchool ? 'SCH' : 'HM';
  const newAdmissionNo = `${prefix}-2026-${String(studentsData.length + 101).padStart(3, '0')}`;

  const defaultFee = isSchool ? 36000 : 75000;
  const total = Number(feeTotal) || defaultFee;

  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    branchId,
    admissionNo: newAdmissionNo,
    rollNo: `${gradeOrSemester.slice(0, 3)}-${studentsData.length + 1}`,
    name,
    gender: gender || 'MALE',
    gradeOrSemester,
    parentName: parentName || 'Parent / Guardian',
    parentPhone: parentPhone || '+91 99000 00000',
    feeTotal: total,
    feePaid: 0,
    feePending: total,
    attendancePercent: 100,
    kycStatus: 'VERIFIED',
    ...(hotelSpecialization ? { hotelSpecialization } : {}),
  };

  studentsData.unshift(newStudent);
  trustData.totalStudents += 1;

  res.status(201).json({
    message: 'Student admitted successfully within branch isolation boundaries.',
    student: newStudent,
  });
});

/**
 * @swagger
 * /api/branch-admin/fees:
 *   get:
 *     summary: Branch-Isolated Fee Ledger
 *     description: Retrieve financial receipts strictly for students enrolled in this branch.
 *     tags: [Branch Admin (Isolated)]
 */
branchAdminRouter.get('/fees', (req: Request, res: Response) => {
  const branchId = getActiveBranchId(req);
  const branch = branchesData.find((b) => b.id === branchId);

  // Filter receipts matching branch name or student IDs belonging to branch
  const branchStudentIds = new Set(studentsData.filter((s) => s.branchId === branchId).map((s) => s.id));
  const branchReceipts = feeReceiptsData.filter(
    (r) => branchStudentIds.has(r.studentId) || (branch && r.branchName.toLowerCase().includes(branch.name.toLowerCase()))
  );

  const totalCollected = branchReceipts.reduce((sum, r) => sum + r.amount, 0);

  res.json({
    branchId,
    branchName: branch?.name,
    isolationNotice: 'Cross-branch financial ledger viewing is strictly prohibited.',
    totalTransactions: branchReceipts.length,
    totalCollected,
    receipts: branchReceipts,
  });
});

/**
 * @swagger
 * /api/branch-admin/fees/collect:
 *   post:
 *     summary: Collect Branch Fee
 *     description: Record fee payment for a student strictly within this branch.
 *     tags: [Branch Admin (Isolated)]
 */
branchAdminRouter.post('/fees/collect', (req: Request, res: Response) => {
  const branchId = getActiveBranchId(req);
  const { studentId, amount, paymentMode } = req.body;

  if (!studentId || !amount) {
    return res.status(400).json({ error: 'studentId and amount are required.' });
  }

  const student = studentsData.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  // Branch isolation check on student
  if (student.branchId !== branchId) {
    return res.status(403).json({
      error: 'Access Denied: Cannot modify financials for student of another branch.',
      adminBranch: branchId,
      studentBranch: student.branchId,
    });
  }

  const payAmount = Number(amount);
  student.feePaid += payAmount;
  student.feePending = Math.max(0, student.feeTotal - student.feePaid);

  const branch = branchesData.find((b) => b.id === branchId);
  const newReceipt: FeeReceipt = {
    id: `rcp-${Date.now()}`,
    receiptNo: `RCP-${student.admissionNo}-${String(feeReceiptsData.length + 1).padStart(3, '0')}`,
    studentId: student.id,
    studentName: student.name,
    branchName: branch ? branch.name : 'Trust Institution',
    amount: payAmount,
    paymentMode: paymentMode || 'UPI',
    date: new Date().toISOString().split('T')[0],
    installmentNo: 2,
    status: 'PAID',
  };

  feeReceiptsData.unshift(newReceipt);

  res.json({
    message: 'Branch fee payment recorded successfully.',
    receipt: newReceipt,
    studentBalance: {
      total: student.feeTotal,
      paid: student.feePaid,
      pending: student.feePending,
    },
  });
});
