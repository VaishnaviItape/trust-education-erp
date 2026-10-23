import { Router, Request, Response } from 'express';
import {
  studentsData,
  attendanceData,
  feeReceiptsData,
  homeworkData,
  photoAlbumsData,
  busRouteData,
  trustData,
  FeeReceipt,
} from '../dataStore.js';

export const parentRouter = Router();

/**
 * @swagger
 * /api/parent/attendance/{studentId}:
 *   get:
 *     summary: Track Child's Daily & Monthly Attendance
 *     description: Retrieve child's cumulative attendance percentage, present/absent days, and recent daily logs.
 *     tags: [Parents (School)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-s01
 */
parentRouter.get('/attendance/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const logs = attendanceData.filter((a) => a.studentId === studentId);
  const totalDays = logs.length;
  const presentDays = logs.filter((a) => a.status === 'PRESENT').length;
  const absentDays = logs.filter((a) => a.status === 'ABSENT').length;
  const lateDays = logs.filter((a) => a.status === 'LATE').length;

  res.json({
    student: {
      id: student.id,
      name: student.name,
      admissionNo: student.admissionNo,
      grade: student.gradeOrSemester,
      parentName: student.parentName,
    },
    attendanceStats: {
      attendancePercent: student.attendancePercent,
      totalWorkingDays: totalDays || 22,
      presentDays: presentDays || 21,
      absentDays,
      lateDays,
      status: student.attendancePercent >= 75 ? 'GOOD_STANDING' : 'ATTENDANCE_WARNING',
    },
    recentDailyLogs: logs,
  });
});

/**
 * @swagger
 * /api/parent/fees/{studentId}:
 *   get:
 *     summary: View Student Fee Ledger & Balance
 *     description: Detailed breakdown of annual school fees, paid installments, and remaining pending balance.
 *     tags: [Parents (School)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-s01
 */
parentRouter.get('/fees/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const studentReceipts = feeReceiptsData.filter((r) => r.studentId === studentId);

  res.json({
    student: {
      id: student.id,
      name: student.name,
      admissionNo: student.admissionNo,
      grade: student.gradeOrSemester,
    },
    financialSummary: {
      totalAnnualFee: student.feeTotal,
      totalPaid: student.feePaid,
      pendingBalance: student.feePending,
      paymentStatus: student.feePending === 0 ? 'FULLY_PAID' : 'PARTIAL_PENDING',
      nextInstallmentDueDate: '2026-11-15',
    },
    receipts: studentReceipts,
  });
});

/**
 * @swagger
 * /api/parent/fees/pay-upi:
 *   post:
 *     summary: Pay School Fees via UPI
 *     description: Instant digital UPI payment processing with instant receipt generation and balance deduction.
 *     tags: [Parents (School)]
 */
parentRouter.post('/fees/pay-upi', (req: Request, res: Response) => {
  const { studentId, amount, upiId, transactionRef } = req.body;

  if (!studentId || !amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Valid studentId and a positive amount are required.' });
  }

  const student = studentsData.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const payAmount = Number(amount);
  const upiRef = transactionRef || `UPI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Update student balances
  student.feePaid += payAmount;
  student.feePending = Math.max(0, student.feeTotal - student.feePaid);

  // Synchronize Trust aggregate totals
  trustData.totalCollected += payAmount;
  trustData.totalPending = Math.max(0, trustData.totalPending - payAmount);

  // Generate official digital receipt
  const newReceipt: FeeReceipt = {
    id: `rcp-${Date.now()}`,
    receiptNo: `RCP-UPI-${student.admissionNo}-${String(feeReceiptsData.length + 1).padStart(3, '0')}`,
    studentId: student.id,
    studentName: student.name,
    branchName: 'Modern Public School And Junior College Bhose',
    amount: payAmount,
    paymentMode: 'UPI',
    date: new Date().toISOString().split('T')[0],
    installmentNo: studentReceiptCount(student.id) + 1,
    status: 'PAID',
  };

  feeReceiptsData.unshift(newReceipt);

  res.status(201).json({
    message: 'UPI Fee payment successful! Instant digital receipt generated.',
    paymentStatus: 'SUCCESS',
    upiReference: upiRef,
    payerUpiId: upiId || 'parent@okhdfcbank',
    receipt: newReceipt,
    updatedAccount: {
      totalFee: student.feeTotal,
      totalPaid: student.feePaid,
      remainingPending: student.feePending,
    },
  });
});

function studentReceiptCount(studentId: string): number {
  return feeReceiptsData.filter((r) => r.studentId === studentId).length;
}

/**
 * @swagger
 * /api/parent/homework/{studentId}:
 *   get:
 *     summary: View Child's Homework & Submissions
 *     description: Retrieve homework assignments given to the student's class.
 *     tags: [Parents (School)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-s01
 */
parentRouter.get('/homework/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const childHomework = homeworkData.filter((h) =>
    h.classOrBatch.toLowerCase().includes(student.gradeOrSemester.toLowerCase())
  );

  res.json({
    studentName: student.name,
    grade: student.gradeOrSemester,
    totalAssignments: childHomework.length,
    homework: childHomework,
  });
});

/**
 * @swagger
 * /api/parent/albums:
 *   get:
 *     summary: View School Photo Albums & Memories
 *     description: Explore event galleries such as Sports Day, Science Exhibition, and Annual Day.
 *     tags: [Parents (School)]
 */
parentRouter.get('/albums', (req: Request, res: Response) => {
  const { branchId } = req.query;
  let albums = [...photoAlbumsData];

  if (branchId) {
    albums = albums.filter((a) => a.branchId === branchId);
  }

  res.json({
    totalAlbums: albums.length,
    albums,
  });
});

/**
 * @swagger
 * /api/parent/bus-live/{studentId}:
 *   get:
 *     summary: Live School Bus GPS Tracking
 *     description: Track the school bus in real-time with GPS coordinates, live speed, driver contact, and stop ETAs.
 *     tags: [Parents (School)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-s01
 */
parentRouter.get('/bus-live/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const nextStop = busRouteData.stops.find((s) => !s.passed) || busRouteData.stops[busRouteData.stops.length - 1];

  res.json({
    studentId,
    studentName: student.name,
    liveTracking: {
      routeId: busRouteData.id,
      routeName: busRouteData.routeName,
      busNumber: busRouteData.busNumber,
      driverName: busRouteData.driverName,
      driverPhone: busRouteData.driverPhone,
      currentLatitude: busRouteData.currentLat,
      currentLongitude: busRouteData.currentLng,
      currentSpeedKmH: busRouteData.currentSpeed,
      isTripActive: busRouteData.activeTrip,
      nextStop: nextStop ? nextStop.name : 'Trust Main Campus',
      estimatedTimeToNextStop: '6-8 mins',
      allStops: busRouteData.stops,
    },
  });
});
