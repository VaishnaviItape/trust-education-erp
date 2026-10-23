/**
 * DOMAIN MATHEMATICAL ENGINES FOR TRUSTEDU ERP
 * Contains pure, tested mathematical algorithms for financial ledgers,
 * statutory payroll deductions, OMR bubble evaluation, and timetable clash detection.
 */

// ==============================================================================
// 1. FEE CALCULATION & CONCESSION MATH
// ==============================================================================

export interface FeeCalculationParams {
  baseFee: number;
  categoryQuota?: 'GENERAL' | 'OBC' | 'SC_ST' | 'EWS' | 'MANAGEMENT';
  concessionApproved?: number;
  isLate?: boolean;
  daysLate?: number;
  lateFeePerDay?: number;
}

export interface FeeCalculationResult {
  baseFee: number;
  categoryDiscount: number;
  concessionDiscount: number;
  lateFee: number;
  netPayable: number;
}

export const calculateStudentFee = (params: FeeCalculationParams): FeeCalculationResult => {
  const {
    baseFee,
    categoryQuota = 'GENERAL',
    concessionApproved = 0,
    isLate = false,
    daysLate = 0,
    lateFeePerDay = 50,
  } = params;

  // Category percentage concession
  let categoryDiscountPercent = 0;
  if (categoryQuota === 'SC_ST') categoryDiscountPercent = 0.5; // 50% waiver
  else if (categoryQuota === 'EWS') categoryDiscountPercent = 0.3; // 30% waiver
  else if (categoryQuota === 'OBC') categoryDiscountPercent = 0.15; // 15% waiver

  const categoryDiscount = Math.round(baseFee * categoryDiscountPercent);
  const remainingAfterCategory = Math.max(0, baseFee - categoryDiscount);
  const concessionDiscount = Math.min(remainingAfterCategory, concessionApproved);

  const lateFee = isLate && daysLate > 0 ? daysLate * lateFeePerDay : 0;
  const netPayable = Math.max(0, remainingAfterCategory - concessionDiscount) + lateFee;

  return {
    baseFee,
    categoryDiscount,
    concessionDiscount,
    lateFee,
    netPayable,
  };
};

// ==============================================================================
// 2. DOUBLE-ENTRY ACCOUNTING LEDGER BALANCING
// ==============================================================================

export interface VoucherEntry {
  ledgerId: string;
  debit: number;
  credit: number;
}

export interface BalanceValidationResult {
  isBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  imbalance: number;
}

export const validateVoucherBalance = (entries: VoucherEntry[]): BalanceValidationResult => {
  if (!entries || entries.length === 0) {
    return { isBalanced: false, totalDebit: 0, totalCredit: 0, imbalance: 0 };
  }

  const totalDebit = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);

  // Use round to 2 decimal places to avoid floating point inaccuracies
  const roundedDebit = Math.round(totalDebit * 100) / 100;
  const roundedCredit = Math.round(totalCredit * 100) / 100;
  const imbalance = Math.abs(Math.round((roundedDebit - roundedCredit) * 100) / 100);

  return {
    isBalanced: imbalance === 0 && roundedDebit > 0,
    totalDebit: roundedDebit,
    totalCredit: roundedCredit,
    imbalance,
  };
};

// ==============================================================================
// 3. STATUTORY PAYROLL & DEDUCTION CALCULATION
// ==============================================================================

export interface PayrollInput {
  basicSalary: number;
  hra?: number;
  da?: number;
  specialAllowance?: number;
  workingDaysInMonth?: number;
  unpaidLeaveDays?: number;
  annualTaxableIncomeEstimate?: number;
  stateCode?: string; // e.g. 'MH' for Maharashtra
  month?: number; // 1-12
}

export interface PayrollBreakdown {
  grossSalary: number;
  earnedGross: number;
  lossOfPay: number;
  pfDeduction: number;
  esicDeduction: number;
  professionalTax: number;
  tdsDeduction: number;
  totalDeductions: number;
  netSalary: number;
}

export const calculateMonthlyPayroll = (input: PayrollInput): PayrollBreakdown => {
  const basic = Math.max(0, input.basicSalary);
  const hra = Math.max(0, input.hra || 0);
  const da = Math.max(0, input.da || 0);
  const allowance = Math.max(0, input.specialAllowance || 0);

  const fullGross = basic + hra + da + allowance;
  const workingDays = input.workingDaysInMonth || 30;
  const unpaidDays = Math.max(0, input.unpaidLeaveDays || 0);

  // Loss of Pay (LOP) based on unpaid leaves
  const perDayPay = workingDays > 0 ? fullGross / workingDays : 0;
  const lossOfPay = Math.round(perDayPay * unpaidDays);
  const earnedGross = Math.max(0, fullGross - lossOfPay);

  // Provident Fund: 12% of basic (or earned basic)
  const earnedBasic = workingDays > 0 ? Math.max(0, basic - (basic / workingDays) * unpaidDays) : basic;
  const pfDeduction = Math.round(earnedBasic * 0.12);

  // ESIC: 0.75% of earned gross if earned gross is <= 21,000 per month
  let esicDeduction = 0;
  if (earnedGross <= 21000 && earnedGross > 0) {
    esicDeduction = Math.round(earnedGross * 0.0075);
  }

  // Professional Tax (Standard Maharashtra Slab):
  // Up to Rs 7,500: Nil
  // Rs 7,501 to Rs 10,000: Rs 175
  // Above Rs 10,000: Rs 200 (Rs 300 in February)
  let professionalTax = 0;
  if (earnedGross > 10000) {
    professionalTax = input.month === 2 ? 300 : 200;
  } else if (earnedGross > 7500) {
    professionalTax = 175;
  }

  // TDS estimate
  let tdsDeduction = 0;
  const annualEstimate = input.annualTaxableIncomeEstimate || earnedGross * 12;
  if (annualEstimate > 700000) {
    // Basic simplified slab over Rs 7L standard rebate
    const taxableOver7L = annualEstimate - 700000;
    tdsDeduction = Math.round((taxableOver7L * 0.1) / 12);
  }

  const totalDeductions = pfDeduction + esicDeduction + professionalTax + tdsDeduction;
  const netSalary = Math.max(0, earnedGross - totalDeductions);

  return {
    grossSalary: fullGross,
    earnedGross,
    lossOfPay,
    pfDeduction,
    esicDeduction,
    professionalTax,
    tdsDeduction,
    totalDeductions,
    netSalary,
  };
};

// ==============================================================================
// 4. OMR COMPUTER VISION BUBBLE SCORING
// ==============================================================================

export interface OMRScoringInput {
  answerKey: Record<string, string>; // e.g. {"1": "A", "2": "C", ...}
  studentAnswers: Record<string, string | null>; // e.g. {"1": "A", "2": "B", "3": null}
  positiveMark?: number; // default 1.0
  negativeMark?: number; // default 0.25
}

export interface OMRScoreResult {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  itemAnalysis: Array<{
    questionNo: string;
    correctOption: string;
    studentOption: string | null;
    status: 'CORRECT' | 'WRONG' | 'UNATTEMPTED';
    scoreAwarded: number;
  }>;
}

export const scoreOMRSheet = (input: OMRScoringInput): OMRScoreResult => {
  const { answerKey, studentAnswers, positiveMark = 1.0, negativeMark = 0.25 } = input;

  const questionKeys = Object.keys(answerKey);
  const totalQuestions = questionKeys.length;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const itemAnalysis: OMRScoreResult['itemAnalysis'] = [];

  for (const qNo of questionKeys) {
    const correctOpt = String(answerKey[qNo]).toUpperCase().trim();
    const studentOptRaw = studentAnswers[qNo];
    const studentOpt = studentOptRaw ? String(studentOptRaw).toUpperCase().trim() : null;

    if (!studentOpt || studentOpt === '' || studentOpt === 'BLANK') {
      unattemptedCount++;
      itemAnalysis.push({
        questionNo: qNo,
        correctOption: correctOpt,
        studentOption: null,
        status: 'UNATTEMPTED',
        scoreAwarded: 0,
      });
    } else if (studentOpt === correctOpt) {
      correctCount++;
      itemAnalysis.push({
        questionNo: qNo,
        correctOption: correctOpt,
        studentOption: studentOpt,
        status: 'CORRECT',
        scoreAwarded: positiveMark,
      });
    } else {
      wrongCount++;
      itemAnalysis.push({
        questionNo: qNo,
        correctOption: correctOpt,
        studentOption: studentOpt,
        status: 'WRONG',
        scoreAwarded: -negativeMark,
      });
    }
  }

  const rawScore = correctCount * positiveMark - wrongCount * negativeMark;
  const totalScore = Math.round(rawScore * 100) / 100;
  const maxPossibleScore = totalQuestions * positiveMark;
  const percentage = maxPossibleScore > 0 ? Math.round((Math.max(0, totalScore) / maxPossibleScore) * 1000) / 10 : 0;

  return {
    totalQuestions,
    attemptedCount: correctCount + wrongCount,
    correctCount,
    wrongCount,
    unattemptedCount,
    totalScore,
    maxPossibleScore,
    percentage,
    itemAnalysis,
  };
};

// ==============================================================================
// 5. TIMETABLE CLASH DETECTION MATRIX
// ==============================================================================

export interface ScheduledSlot {
  id?: string;
  dayOfWeek: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  teacherId: string;
  teacherName?: string;
  roomId: string;
  roomName?: string;
  divisionId: string;
  divisionName?: string;
  subject: string;
}

export interface ClashResult {
  hasConflict: boolean;
  conflicts: Array<{
    type: 'TEACHER_COLLISION' | 'ROOM_COLLISION' | 'DIVISION_COLLISION';
    message: string;
    conflictingSlotA: ScheduledSlot;
    conflictingSlotB: ScheduledSlot;
  }>;
}

const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

const slotsOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
};

export const checkTimetableConflicts = (
  existingSlots: ScheduledSlot[],
  newSlot: ScheduledSlot
): ClashResult => {
  const conflicts: ClashResult['conflicts'] = [];

  for (const slot of existingSlots) {
    if (newSlot.id && slot.id === newSlot.id) continue; // Skip same slot if editing
    if (slot.dayOfWeek.toUpperCase() !== newSlot.dayOfWeek.toUpperCase()) continue;

    if (slotsOverlap(slot.startTime, slot.endTime, newSlot.startTime, newSlot.endTime)) {
      if (slot.teacherId === newSlot.teacherId) {
        conflicts.push({
          type: 'TEACHER_COLLISION',
          message: `Teacher is already booked for ${slot.subject} (${slot.startTime}-${slot.endTime}) in ${slot.divisionName || 'another section'}`,
          conflictingSlotA: slot,
          conflictingSlotB: newSlot,
        });
      }

      if (slot.roomId === newSlot.roomId) {
        conflicts.push({
          type: 'ROOM_COLLISION',
          message: `Room is already occupied by ${slot.divisionName || 'another class'} for ${slot.subject} (${slot.startTime}-${slot.endTime})`,
          conflictingSlotA: slot,
          conflictingSlotB: newSlot,
        });
      }

      if (slot.divisionId === newSlot.divisionId) {
        conflicts.push({
          type: 'DIVISION_COLLISION',
          message: `Division already has lecture for ${slot.subject} scheduled during ${slot.startTime}-${slot.endTime}`,
          conflictingSlotA: slot,
          conflictingSlotB: newSlot,
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};

// ==============================================================================
// 6. CAP (CENTRALIZED ADMISSION PROCESS) SEAT ALLOCATION
// ==============================================================================

export interface CAPCandidate {
  id: string;
  name: string;
  meritRank: number;
  percentage: number;
  category: 'GENERAL' | 'OBC' | 'SC' | 'ST';
  preferences: string[]; // List of stream IDs in order of preference
}

export interface StreamCapacity {
  streamId: string;
  streamName: string;
  totalSeats: number;
  allocatedSeats: number;
}

export interface CAPAllocationResult {
  allocatedCount: number;
  waitlistedCount: number;
  allocations: Array<{
    candidateId: string;
    candidateName: string;
    meritRank: number;
    allocatedStreamId: string | null;
    allocatedStreamName: string | null;
    preferenceMatched: number | null; // 1, 2, 3 or null
    status: 'ALLOCATED' | 'WAITLISTED';
  }>;
}

export const runCAPSeatAllocation = (
  candidates: CAPCandidate[],
  capacities: StreamCapacity[]
): CAPAllocationResult => {
  // Sort candidates strictly by merit rank ascending (rank 1 is highest priority)
  const sorted = [...candidates].sort((a, b) => a.meritRank - b.meritRank);
  const streamMap = new Map<string, StreamCapacity>();
  capacities.forEach((c) => streamMap.set(c.streamId, { ...c }));

  const allocations: CAPAllocationResult['allocations'] = [];
  let allocatedCount = 0;
  let waitlistedCount = 0;

  for (const candidate of sorted) {
    let allocated = false;

    for (let pIdx = 0; pIdx < candidate.preferences.length; pIdx++) {
      const preferredStreamId = candidate.preferences[pIdx];
      const stream = streamMap.get(preferredStreamId);

      if (stream && stream.allocatedSeats < stream.totalSeats) {
        stream.allocatedSeats++;
        allocations.push({
          candidateId: candidate.id,
          candidateName: candidate.name,
          meritRank: candidate.meritRank,
          allocatedStreamId: stream.streamId,
          allocatedStreamName: stream.streamName,
          preferenceMatched: pIdx + 1,
          status: 'ALLOCATED',
        });
        allocatedCount++;
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      allocations.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        meritRank: candidate.meritRank,
        allocatedStreamId: null,
        allocatedStreamName: null,
        preferenceMatched: null,
        status: 'WAITLISTED',
      });
      waitlistedCount++;
    }
  }

  return {
    allocatedCount,
    waitlistedCount,
    allocations,
  };
};
