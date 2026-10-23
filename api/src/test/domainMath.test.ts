import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStudentFee,
  validateVoucherBalance,
  calculateMonthlyPayroll,
  scoreOMRSheet,
  checkTimetableConflicts,
  runCAPSeatAllocation,
  ScheduledSlot,
} from '../services/domainMathService.js';

test('1. Fee Calculation Engine handles category quotas, concessions, and late fines', () => {
  // Scenario A: General student on time with no concession
  const genFee = calculateStudentFee({ baseFee: 36000, categoryQuota: 'GENERAL' });
  assert.equal(genFee.baseFee, 36000);
  assert.equal(genFee.categoryDiscount, 0);
  assert.equal(genFee.concessionDiscount, 0);
  assert.equal(genFee.lateFee, 0);
  assert.equal(genFee.netPayable, 36000);

  // Scenario B: SC/ST student with 50% waiver
  const scstFee = calculateStudentFee({ baseFee: 40000, categoryQuota: 'SC_ST' });
  assert.equal(scstFee.categoryDiscount, 20000);
  assert.equal(scstFee.netPayable, 20000);

  // Scenario C: OBC student with approved concession & late fees
  const obcFee = calculateStudentFee({
    baseFee: 50000,
    categoryQuota: 'OBC', // 15% discount = 7500, remaining = 42500
    concessionApproved: 5000, // remaining = 37500
    isLate: true,
    daysLate: 10,
    lateFeePerDay: 50, // 500 late fee
  });
  assert.equal(obcFee.categoryDiscount, 7500);
  assert.equal(obcFee.concessionDiscount, 5000);
  assert.equal(obcFee.lateFee, 500);
  assert.equal(obcFee.netPayable, 38000);
});

test('2. Double-Entry Accounting Balancer enforces SUM(Debits) === SUM(Credits)', () => {
  // Balanced Voucher
  const balancedResult = validateVoucherBalance([
    { ledgerId: 'bank', debit: 25000, credit: 0 },
    { ledgerId: 'fees-inc', debit: 0, credit: 25000 },
  ]);
  assert.equal(balancedResult.isBalanced, true);
  assert.equal(balancedResult.totalDebit, 25000);
  assert.equal(balancedResult.totalCredit, 25000);
  assert.equal(balancedResult.imbalance, 0);

  // Imbalanced Voucher
  const imbalancedResult = validateVoucherBalance([
    { ledgerId: 'bank', debit: 25000, credit: 0 },
    { ledgerId: 'fees-inc', debit: 0, credit: 20000 },
  ]);
  assert.equal(imbalancedResult.isBalanced, false);
  assert.equal(imbalancedResult.imbalance, 5000);

  // Empty or invalid input
  const emptyResult = validateVoucherBalance([]);
  assert.equal(emptyResult.isBalanced, false);
});

test('3. Statutory Payroll Engine calculates Gross, PF, ESIC, PT, TDS, and LOP', () => {
  // Case A: High-earning faculty (Gross > 21,000, no ESIC, PT Rs 200)
  const profPayroll = calculateMonthlyPayroll({
    basicSalary: 40000,
    hra: 15000,
    da: 5000,
    specialAllowance: 5000,
    workingDaysInMonth: 30,
    unpaidLeaveDays: 0,
    month: 10,
  });

  assert.equal(profPayroll.grossSalary, 65000);
  assert.equal(profPayroll.lossOfPay, 0);
  assert.equal(profPayroll.pfDeduction, 4800); // 12% of 40,000
  assert.equal(profPayroll.esicDeduction, 0); // Exceeds 21,000 threshold
  assert.equal(profPayroll.professionalTax, 200);
  assert.equal(profPayroll.tdsDeduction, 667);
  assert.equal(profPayroll.netSalary, 65000 - 4800 - 200 - 667);

  // Case B: February month Professional Tax (Rs 300)
  const febPayroll = calculateMonthlyPayroll({
    basicSalary: 30000,
    month: 2,
  });
  assert.equal(febPayroll.professionalTax, 300);

  // Case C: Unpaid leaves trigger Loss of Pay (LOP)
  const lopPayroll = calculateMonthlyPayroll({
    basicSalary: 30000,
    workingDaysInMonth: 30,
    unpaidLeaveDays: 3, // 3 days unpaid = 3000 LOP
  });
  assert.equal(lopPayroll.lossOfPay, 3000);
  assert.equal(lopPayroll.earnedGross, 27000);
  assert.equal(lopPayroll.pfDeduction, Math.round(27000 * 0.12)); // 12% of earned basic
});

test('4. OMR Computer Vision Scoring calculates positive marks and negative penalty', () => {
  const answerKey = {
    '1': 'A',
    '2': 'B',
    '3': 'C',
    '4': 'D',
  };

  const studentAnswers = {
    '1': 'A', // Correct (+1.0)
    '2': 'B', // Correct (+1.0)
    '3': 'D', // Wrong (-0.25)
    '4': null, // Blank (0)
  };

  const result = scoreOMRSheet({
    answerKey,
    studentAnswers,
    positiveMark: 1.0,
    negativeMark: 0.25,
  });

  assert.equal(result.totalQuestions, 4);
  assert.equal(result.attemptedCount, 3);
  assert.equal(result.correctCount, 2);
  assert.equal(result.wrongCount, 1);
  assert.equal(result.unattemptedCount, 1);
  assert.equal(result.totalScore, 1.75); // 2 - 0.25 = 1.75
  assert.equal(result.maxPossibleScore, 4.0);
  assert.equal(result.percentage, 43.8); // 1.75 / 4 = 43.75% -> 43.8%
});

test('5. Timetable Conflict Matrix detects teacher, room, and section collisions', () => {
  const existingSlots: ScheduledSlot[] = [
    {
      id: 'slot-1',
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '10:00',
      teacherId: 'teacher-sharma',
      teacherName: 'Dr. Sharma',
      roomId: 'room-101',
      roomName: 'Physics Lab 101',
      divisionId: 'div-10a',
      divisionName: 'Class 10-A',
      subject: 'Physics',
    },
  ];

  // Case A: Clash - Same teacher scheduled in another section at overlapping time
  const teacherClash = checkTimetableConflicts(existingSlots, {
    dayOfWeek: 'MONDAY',
    startTime: '09:30',
    endTime: '10:30',
    teacherId: 'teacher-sharma',
    roomId: 'room-202',
    divisionId: 'div-10b',
    subject: 'Chemistry',
  });
  assert.equal(teacherClash.hasConflict, true);
  assert.equal(teacherClash.conflicts[0].type, 'TEACHER_COLLISION');

  // Case B: Clash - Different teacher trying to use the same room at the same time
  const roomClash = checkTimetableConflicts(existingSlots, {
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    teacherId: 'teacher-patil',
    roomId: 'room-101',
    divisionId: 'div-10b',
    subject: 'Mathematics',
  });
  assert.equal(roomClash.hasConflict, true);
  assert.equal(roomClash.conflicts[0].type, 'ROOM_COLLISION');

  // Case C: No Clash - Different day or non-overlapping time
  const validSlot = checkTimetableConflicts(existingSlots, {
    dayOfWeek: 'MONDAY',
    startTime: '10:00',
    endTime: '11:00',
    teacherId: 'teacher-sharma',
    roomId: 'room-101',
    divisionId: 'div-10a',
    subject: 'Physics Practical',
  });
  assert.equal(validSlot.hasConflict, false);
});

test('6. CAP Centralized Seat Allocation respects merit rank and branch quotas', () => {
  const candidates = [
    {
      id: 'cand-1',
      name: 'Topper Candidate',
      meritRank: 1,
      percentage: 95.0,
      category: 'GENERAL' as const,
      preferences: ['stream-cs', 'stream-culinary'],
    },
    {
      id: 'cand-2',
      name: 'Second Candidate',
      meritRank: 2,
      percentage: 91.0,
      category: 'OBC' as const,
      preferences: ['stream-cs'],
    },
    {
      id: 'cand-3',
      name: 'Third Candidate',
      meritRank: 3,
      percentage: 82.0,
      category: 'GENERAL' as const,
      preferences: ['stream-cs'], // Wants CS, but capacity is only 1!
    },
  ];

  const capacities = [
    { streamId: 'stream-cs', streamName: 'B.Tech CS', totalSeats: 1, allocatedSeats: 0 },
    { streamId: 'stream-culinary', streamName: 'B.Sc Culinary Arts', totalSeats: 10, allocatedSeats: 0 },
  ];

  const result = runCAPSeatAllocation(candidates, capacities);

  assert.equal(result.allocatedCount, 1);
  assert.equal(result.waitlistedCount, 2);

  // Cand 1 got stream-cs (preference 1)
  assert.equal(result.allocations[0].status, 'ALLOCATED');
  assert.equal(result.allocations[0].allocatedStreamId, 'stream-cs');

  // Cand 2 wanted only stream-cs, which is now full -> WAITLISTED
  assert.equal(result.allocations[1].status, 'WAITLISTED');

  // Cand 3 wanted only stream-cs -> WAITLISTED
  assert.equal(result.allocations[2].status, 'WAITLISTED');
});
