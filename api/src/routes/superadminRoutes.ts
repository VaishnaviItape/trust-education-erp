import { Router, Request, Response } from 'express';
import {
  trustData,
  branchesData,
  studentsData,
  feeReceiptsData,
} from '../dataStore.js';

export const superadminRouter = Router();

/**
 * @swagger
 * /api/superadmin/overview:
 *   get:
 *     summary: Superadmin Consolidated Overview
 *     description: Master visibility over both School and College, seeing total fees collected, pending balances, and total student strength.
 *     tags: [Superadmin (Trustee / President)]
 */
superadminRouter.get('/overview', (_req: Request, res: Response) => {
  // Compute real-time aggregated metrics from live student store
  const totalStudents = studentsData.length;
  const totalCollected = studentsData.reduce((sum, s) => sum + s.feePaid, 0);
  const totalPending = studentsData.reduce((sum, s) => sum + s.feePending, 0);
  const totalRevenue = studentsData.reduce((sum, s) => sum + s.feeTotal, 0);

  // Synchronize trust overview
  trustData.totalStudents = totalStudents;
  trustData.totalCollected = totalCollected;
  trustData.totalPending = totalPending;
  trustData.totalRevenue = totalRevenue;

  res.json({
    trust: {
      ...trustData,
      collectionEfficiencyPercent: totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0,
    },
    systemStatus: {
      portalAccess: 'WEB_ONLY_MASTER',
      authorizedRoles: ['TRUSTEE', 'PRESIDENT', 'SUPERADMIN'],
      multiBranchSync: 'ACTIVE',
    },
  });
});

/**
 * @swagger
 * /api/superadmin/branches:
 *   get:
 *     summary: Multi-Branch Comparative Breakdown
 *     description: Compare School vs College performance side-by-side including strength, collection, and targets.
 *     tags: [Superadmin (Trustee / President)]
 */
superadminRouter.get('/branches', (_req: Request, res: Response) => {
  const branchBreakdown = branchesData.map((branch) => {
    const branchStudents = studentsData.filter((s) => s.branchId === branch.id);
    const collected = branchStudents.reduce((sum, s) => sum + s.feePaid, 0);
    const pending = branchStudents.reduce((sum, s) => sum + s.feePending, 0);
    const totalFee = branchStudents.reduce((sum, s) => sum + s.feeTotal, 0);

    return {
      ...branch,
      currentEnrollment: branchStudents.length,
      feesCollected: collected,
      feesPending: pending,
      totalFeeVolume: totalFee,
      collectionRatePercent: totalFee > 0 ? Math.round((collected / totalFee) * 100) : 0,
    };
  });

  res.json({
    branches: branchBreakdown,
  });
});

/**
 * @swagger
 * /api/superadmin/financial-ledger:
 *   get:
 *     summary: Master Financial Ledger
 *     description: Global audit of all fee transactions across School and College.
 *     tags: [Superadmin (Trustee / President)]
 */
superadminRouter.get('/financial-ledger', (req: Request, res: Response) => {
  const { paymentMode, branchId } = req.query;
  let ledger = [...feeReceiptsData];

  if (paymentMode) {
    ledger = ledger.filter((r) => r.paymentMode === String(paymentMode).toUpperCase());
  }

  if (branchId) {
    const branch = branchesData.find((b) => b.id === branchId);
    if (branch) {
      ledger = ledger.filter((r) => r.branchName.toLowerCase().includes(branch.name.toLowerCase()));
    }
  }

  const totalAmount = ledger.reduce((sum, r) => sum + r.amount, 0);

  res.json({
    totalTransactions: ledger.length,
    totalAmount,
    receipts: ledger,
  });
});

/**
 * @swagger
 * /api/superadmin/students:
 *   get:
 *     summary: Master Student Registry
 *     description: Search and view students across all Trust educational institutions.
 *     tags: [Superadmin (Trustee / President)]
 */
superadminRouter.get('/students', (req: Request, res: Response) => {
  const { branchId, search } = req.query;
  let result = [...studentsData];

  if (branchId) {
    result = result.filter((s) => s.branchId === branchId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.gradeOrSemester.toLowerCase().includes(q) ||
        (s.aadhaarNumber && s.aadhaarNumber.toLowerCase().includes(q)) ||
        (s.roleTag && s.roleTag.toLowerCase().includes(q))
    );
  }

  res.json({
    total: result.length,
    students: result,
  });
});
