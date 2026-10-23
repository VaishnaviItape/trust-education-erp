/**
 * Client-Side Domain Math Utilities for Instant UI Previews
 */

export interface PayrollInput {
  basicSalary: number;
  hra?: number;
  da?: number;
  specialAllowance?: number;
  workingDaysInMonth?: number;
  unpaidLeaveDays?: number;
  month?: number;
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

  const perDayPay = workingDays > 0 ? fullGross / workingDays : 0;
  const lossOfPay = Math.round(perDayPay * unpaidDays);
  const earnedGross = Math.max(0, fullGross - lossOfPay);

  const earnedBasic = workingDays > 0 ? Math.max(0, basic - (basic / workingDays) * unpaidDays) : basic;
  const pfDeduction = Math.round(earnedBasic * 0.12);

  let esicDeduction = 0;
  if (earnedGross <= 21000 && earnedGross > 0) {
    esicDeduction = Math.round(earnedGross * 0.0075);
  }

  let professionalTax = 0;
  if (earnedGross > 10000) {
    professionalTax = input.month === 2 ? 300 : 200;
  } else if (earnedGross > 7500) {
    professionalTax = 175;
  }

  let tdsDeduction = 0;
  if (earnedGross * 12 > 700000) {
    tdsDeduction = Math.round(((earnedGross * 12 - 700000) * 0.1) / 12);
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

export interface ScheduledSlot {
  id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  teacherName?: string;
  roomId: string;
  roomName?: string;
  divisionId: string;
  divisionName?: string;
  subject: string;
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
) => {
  const conflicts: Array<{ type: string; message: string }> = [];

  for (const slot of existingSlots) {
    if (newSlot.id && slot.id === newSlot.id) continue;
    if (slot.dayOfWeek.toUpperCase() !== newSlot.dayOfWeek.toUpperCase()) continue;

    if (slotsOverlap(slot.startTime, slot.endTime, newSlot.startTime, newSlot.endTime)) {
      if (slot.teacherId === newSlot.teacherId) {
        conflicts.push({
          type: 'TEACHER_COLLISION',
          message: `Teacher is already booked for ${slot.subject} (${slot.startTime}-${slot.endTime}) in ${slot.divisionName || 'another section'}`,
        });
      }

      if (slot.roomId === newSlot.roomId) {
        conflicts.push({
          type: 'ROOM_COLLISION',
          message: `Room is already occupied by ${slot.divisionName || 'another class'} for ${slot.subject} (${slot.startTime}-${slot.endTime})`,
        });
      }

      if (slot.divisionId === newSlot.divisionId) {
        conflicts.push({
          type: 'DIVISION_COLLISION',
          message: `Division already has lecture for ${slot.subject} scheduled during ${slot.startTime}-${slot.endTime}`,
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};
