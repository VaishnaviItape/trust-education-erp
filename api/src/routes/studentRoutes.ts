import { Router, Request, Response } from 'express';
import {
  kitchenLabsData,
  gradesData,
  feeReceiptsData,
  internshipLogsData,
  chefKitData,
  studentsData,
  InternshipLog,
} from '../dataStore.js';

export const studentRouter = Router();

/**
 * @swagger
 * /api/student/kitchen-rosters:
 *   get:
 *     summary: View Practical Kitchen Rosters
 *     description: Access practical training schedules for Basic Training Kitchen (BTK), Bakery Lab, and Mock Restaurant.
 *     tags: [Students (College HM)]
 */
studentRouter.get('/kitchen-rosters', (_req: Request, res: Response) => {
  res.json({
    totalLabs: kitchenLabsData.length,
    rosters: kitchenLabsData.map((lab) => ({
      ...lab,
      dressCode: 'Full Chef Uniform, Toque Blanche (Chef Hat), Apron & Non-Slip Safety Shoes',
      mandatoryTools: '6-Piece Culinary Knife Set & Tasting Spoon',
    })),
  });
});

/**
 * @swagger
 * /api/student/grades/{studentId}:
 *   get:
 *     summary: View Academic & Culinary Practical Grades
 *     description: Detailed semester marksheets and practical kitchen assessment grades.
 *     tags: [Students (College HM)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-hm01
 */
studentRouter.get('/grades/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const studentGrades = gradesData.filter((g) => g.studentId === studentId);

  res.json({
    student: {
      id: student.id,
      name: student.name,
      rollNo: student.rollNo,
      course: student.gradeOrSemester,
      specialization: student.hotelSpecialization || 'Hotel & Hospitality Administration',
    },
    totalAssessments: studentGrades.length,
    grades: studentGrades,
  });
});

/**
 * @swagger
 * /api/student/fee-receipts/{studentId}:
 *   get:
 *     summary: View & Download College Fee Receipts
 *     description: Access digital fee receipts, transaction history, and payment methods.
 *     tags: [Students (College HM)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-hm01
 */
studentRouter.get('/fee-receipts/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const receipts = feeReceiptsData.filter((r) => r.studentId === studentId);

  res.json({
    student: {
      id: student.id,
      name: student.name,
      admissionNo: student.admissionNo,
      course: student.gradeOrSemester,
    },
    feeAccount: {
      totalFee: student.feeTotal,
      paidAmount: student.feePaid,
      pendingBalance: student.feePending,
    },
    totalReceipts: receipts.length,
    receipts,
  });
});

/**
 * @swagger
 * /api/student/internship-logs/{studentId}:
 *   get:
 *     summary: View Industrial Training (IT) Internship Logs
 *     description: Retrieve logs of hotel shifts, department rotations, and chef mentor ratings.
 *     tags: [Students (College HM)]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: stu-hm01
 */
studentRouter.get('/internship-logs/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = studentsData.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student not found with ID: ${studentId}` });
  }

  const logs = internshipLogsData.filter((l) => l.studentId === studentId);
  const totalHours = logs.reduce((sum, l) => sum + l.shiftHours, 0);

  res.json({
    studentName: student.name,
    rollNo: student.rollNo,
    trainingSummary: {
      totalShiftsLogged: logs.length,
      totalHoursCompleted: totalHours,
      targetRequirementHours: 720, // 20 weeks * 36 hrs
      completionPercent: Math.round((totalHours / 720) * 100),
    },
    logs,
  });
});

/**
 * @swagger
 * /api/student/internship-logs:
 *   post:
 *     summary: Submit Daily Industrial Training Shift Log
 *     description: Student logs daily hotel shifts, duties performed, and mentor guidance.
 *     tags: [Students (College HM)]
 */
studentRouter.post('/internship-logs', (req: Request, res: Response) => {
  const { studentId, date, hotelBrand, department, shiftHours, tasksCompleted, chefMentor, mentorFeedback } = req.body;

  if (!studentId || !hotelBrand || !department || !shiftHours || !tasksCompleted) {
    return res.status(400).json({
      error: 'Missing mandatory fields: studentId, hotelBrand, department, shiftHours, and tasksCompleted are required.',
    });
  }

  const student = studentsData.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const newLog: InternshipLog = {
    id: `log-${Date.now()}`,
    studentId: student.id,
    rollNo: student.rollNo,
    studentName: student.name,
    date: date || new Date().toISOString().split('T')[0],
    hotelBrand,
    department,
    shiftHours: Number(shiftHours),
    tasksCompleted,
    chefMentor: chefMentor || 'Executive Sous Chef',
    mentorFeedback: mentorFeedback || 'Completed shift duties satisfactorily.',
    verified: false,
  };

  internshipLogsData.unshift(newLog);

  res.status(201).json({
    message: 'Industrial training shift log submitted successfully!',
    log: newLog,
  });
});

/**
 * @swagger
 * /api/student/chef-kits:
 *   get:
 *     summary: View Issued Chef Kit & Knife Set Status
 *     description: Check inventory and issued kit details for hotel management students.
 *     tags: [Students (College HM)]
 */
studentRouter.get('/chef-kits', (_req: Request, res: Response) => {
  res.json({
    kits: chefKitData,
  });
});
