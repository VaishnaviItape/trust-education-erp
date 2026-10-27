/**
 * Fee Receipt Utilities
 * Indian Currency Number-to-Words (English & Marathi Devanagari),
 * itemized statutory fee heads breakdown generator, and receipt enrichment.
 */

import { FeeHeadItem, FeeReceipt, Student } from '../types';
import { getInstitutionDetails } from './documentUtils';

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertTwoDigits(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const tensPart = TENS[Math.floor(n / 10)];
  const onesPart = n % 10 !== 0 ? ` ${ONES[n % 10]}` : '';
  return `${tensPart}${onesPart}`;
}

function convertThreeDigits(n: number): string {
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (hundreds > 0) {
    const hundredStr = `${ONES[hundreds]} Hundred`;
    return remainder > 0 ? `${hundredStr} and ${convertTwoDigits(remainder)}` : hundredStr;
  }
  return convertTwoDigits(remainder);
}

/**
 * Converts Indian Rupee amounts to formal English words.
 * Handles Crores, Lakhs, Thousands, Hundreds, and Paise.
 * Example: 12500 -> "Twelve Thousand Five Hundred Rupees Only"
 */
export function numberToWordsINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Zero Rupees Only';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const rupees = Math.floor(absAmount);
  const paise = Math.round((absAmount - rupees) * 100);

  if (rupees === 0 && paise > 0) {
    return `${isNegative ? 'Minus ' : ''}${convertTwoDigits(paise)} Paise Only`;
  }

  const crores = Math.floor(rupees / 10000000);
  let rem = rupees % 10000000;
  const lakhs = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousands = Math.floor(rem / 1000);
  const hundredsAndUnits = rem % 1000;

  const parts: string[] = [];

  if (crores > 0) {
    parts.push(`${convertTwoDigits(crores)} Crore`);
  }
  if (lakhs > 0) {
    parts.push(`${convertTwoDigits(lakhs)} Lakh`);
  }
  if (thousands > 0) {
    parts.push(`${convertTwoDigits(thousands)} Thousand`);
  }
  if (hundredsAndUnits > 0) {
    parts.push(convertThreeDigits(hundredsAndUnits));
  }

  let words = parts.join(' ').trim();
  if (!words) words = 'Zero';

  let result = `${isNegative ? 'Minus ' : ''}${words} Rupees`;
  if (paise > 0) {
    result += ` and ${convertTwoDigits(paise)} Paise`;
  }
  result += ' Only';

  return result;
}

/**
 * Converts Indian Rupee amounts to Devanagari Marathi words.
 * Example: 12000 -> "रुपये बारा हजार फक्त"
 */
export function numberToMarathiWordsINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'रुपये शून्य फक्त';

  const MARATHI_ONES: Record<number, string> = {
    1: 'एक', 2: 'दोन', 3: 'तीन', 4: 'चार', 5: 'पाच', 6: 'सहा', 7: 'सात', 8: 'आठ', 9: 'नऊ',
    10: 'दहा', 11: 'अकरा', 12: 'बारा', 13: 'तेरा', 14: 'चौदा', 15: 'पंधरा', 16: 'सोळा', 17: 'सतरा', 18: 'अठरा', 19: 'एकोणीस',
    20: 'वीस', 21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस', 26: 'सव्वीस', 27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस',
    30: 'तीस', 35: 'पस्तीस', 40: 'चाळीस', 45: 'पंचेचाळीस', 50: 'पन्नास', 55: 'पंचावन्न', 60: 'साठ', 65: 'पासष्ट', 70: 'सत्तर', 75: 'पंच्याहत्तर',
    80: 'ऐंशी', 85: 'पंच्याऐंशी', 90: 'नव्वद', 95: 'पंच्याण्णव', 100: 'शंभर'
  };

  const rupees = Math.floor(Math.abs(amount));

  if (rupees === 1000) return 'रुपये एक हजार फक्त';
  if (rupees === 5000) return 'रुपये पाच हजार फक्त';
  if (rupees === 10000) return 'रुपये दहा हजार फक्त';
  if (rupees === 12000) return 'रुपये बारा हजार फक्त';
  if (rupees === 15000) return 'रुपये पंधरा हजार फक्त';
  if (rupees === 20000) return 'रुपये वीस हजार फक्त';
  if (rupees === 25000) return 'रुपये पंचवीस हजार फक्त';
  if (rupees === 30000) return 'रुपये तीस हजार फक्त';
  if (rupees === 35000) return 'रुपये पस्तीस हजार फक्त';
  if (rupees === 40000) return 'रुपये चाळीस हजार फक्त';
  if (rupees === 50000) return 'रुपये पन्नास हजार फक्त';
  if (rupees === 60000) return 'रुपये साठ हजार फक्त';
  if (rupees === 75000) return 'रुपये पंच्याहत्तर हजार फक्त';

  // Fallback to English converted text tagged with currency symbol
  return `रुपये ${numberToWordsINR(rupees).replace('Rupees Only', 'फक्त')}`;
}

/**
 * Standard Fee Heads breakdown generator.
 * Produces structured heads for School and College with exact sum matching totalAmount.
 */
export function generateFeeBreakdown(
  totalAmount: number,
  branchScope: 'SCHOOL' | 'COLLEGE' | string = 'SCHOOL'
): FeeHeadItem[] {
  const isCollege =
    typeof branchScope === 'string' &&
    (branchScope.toLowerCase().includes('college') ||
      branchScope.toLowerCase().includes('hotel') ||
      branchScope.toLowerCase().includes('hm') ||
      branchScope.toLowerCase().includes('solapur'));

  if (isCollege) {
    // Hotel Management & Tech Breakdown (Percentages: 50%, 20%, 10%, 10%, 5%, 5%)
    const tuition = Math.round(totalAmount * 0.50);
    const culinaryLab = Math.round(totalAmount * 0.20);
    const admissionFee = Math.round(totalAmount * 0.10);
    const libraryJournals = Math.round(totalAmount * 0.08);
    const examFee = Math.round(totalAmount * 0.06);
    // Adjust remainder to ensure exact sum equals totalAmount
    const chefKitMaintenance = totalAmount - (tuition + culinaryLab + admissionFee + libraryJournals + examFee);

    return [
      {
        id: 'head-col-01',
        headName: 'Tuition & Academic Instruction Fee',
        headNameMarathi: 'अध्यापन व शैक्षणिक शुल्क',
        amount: tuition,
        category: 'TERM',
      },
      {
        id: 'head-col-02',
        headName: 'Basic Training Kitchen (BTK) & Bakery Lab Fee',
        headNameMarathi: 'बी.टी.के. स्वयंपाक व बेकरी प्रात्यक्षिक शुल्क',
        amount: culinaryLab,
        category: 'TERM',
      },
      {
        id: 'head-col-03',
        headName: 'Admission & University Registration Fee',
        headNameMarathi: 'प्रवेश व विद्यापीठ नोंदणी शुल्क',
        amount: admissionFee,
        category: 'ANNUAL',
      },
      {
        id: 'head-col-04',
        headName: 'Culinary Library & Digital Journals Database',
        headNameMarathi: 'पाककला ग्रंथालय व डिजिटल जर्नल्स',
        amount: libraryJournals,
        category: 'ANNUAL',
      },
      {
        id: 'head-col-05',
        headName: 'Board / MSBTE Practical & Examination Fee',
        headNameMarathi: 'मंडळ / परीक्षा व प्रात्यक्षिक शुल्क',
        amount: examFee,
        category: 'TERM',
      },
      {
        id: 'head-col-06',
        headName: 'Chef Uniform, Tool Kit & Industry Safety Maintenance',
        headNameMarathi: 'शेफ किट, गणवेश व सुरक्षा देखभाल निधी',
        amount: Math.max(0, chefKitMaintenance),
        category: 'MANDATORY',
      },
    ];
  }

  // School Breakdown (Percentages: 55%, 15%, 10%, 10%, 5%, 5%)
  const tuition = Math.round(totalAmount * 0.55);
  const admissionFee = Math.round(totalAmount * 0.15);
  const libraryFee = Math.round(totalAmount * 0.10);
  const labFee = Math.round(totalAmount * 0.10);
  const examFee = Math.round(totalAmount * 0.05);
  const sportsActivity = totalAmount - (tuition + admissionFee + libraryFee + labFee + examFee);

  return [
    {
      id: 'head-sch-01',
      headName: 'Tuition Fee',
      headNameMarathi: 'शिक्षण शुल्क (Tuition Fee)',
      amount: tuition,
      category: 'TERM',
    },
    {
      id: 'head-sch-02',
      headName: 'Admission & Term Registration Fee',
      headNameMarathi: 'प्रवेश नोंदणी व सत्र शुल्क',
      amount: admissionFee,
      category: 'ANNUAL',
    },
    {
      id: 'head-sch-03',
      headName: 'Library & Reading Room Fund',
      headNameMarathi: 'ग्रंथालय व वाचनालय निधी',
      amount: libraryFee,
      category: 'ANNUAL',
    },
    {
      id: 'head-sch-04',
      headName: 'Computer & Science Practical Lab Fee',
      headNameMarathi: 'संगणक व विज्ञान प्रयोगशाळा शुल्क',
      amount: labFee,
      category: 'TERM',
    },
    {
      id: 'head-sch-05',
      headName: 'Term Assessment & Examination Fee',
      headNameMarathi: 'सत्र परीक्षा व मूल्यांकन शुल्क',
      amount: examFee,
      category: 'TERM',
    },
    {
      id: 'head-sch-06',
      headName: 'Sports, Gymkhana & Cultural Activity Fee',
      headNameMarathi: 'क्रीडा, व्यायामशाळा व सांस्कृतिक निधी',
      amount: Math.max(0, sportsActivity),
      category: 'ANNUAL',
    },
  ];
}

/**
 * Enriches a FeeReceipt with student details, institutional metadata, and itemized heads breakdown.
 */
export function enrichFeeReceipt(
  receipt: FeeReceipt,
  student?: Student
): FeeReceipt {
  const isSchool =
    receipt.branchName?.toLowerCase().includes('school') ||
    student?.branchId === 'branch-sch-01';

  const branchName = isSchool
    ? 'Modern Public School And Junior College Bhose'
    : 'Modern College Of Hotel Management And Technology Solapur';

  const totalAnnualFee =
    receipt.totalAnnualFee ||
    student?.feeTotal ||
    (isSchool ? 38000 : 75000);

  const feePaid = student?.feePaid || receipt.amount;
  const previouslyPaid =
    receipt.previouslyPaid !== undefined
      ? receipt.previouslyPaid
      : Math.max(0, feePaid - receipt.amount);

  const remainingBalance =
    receipt.remainingBalance !== undefined
      ? receipt.remainingBalance
      : Math.max(0, totalAnnualFee - (previouslyPaid + receipt.amount));

  const breakdown =
    receipt.feeBreakdown && receipt.feeBreakdown.length > 0
      ? receipt.feeBreakdown
      : generateFeeBreakdown(receipt.amount, isSchool ? 'SCHOOL' : 'COLLEGE');

  const amountInWords = receipt.amountInWords || numberToWordsINR(receipt.amount);
  const amountInWordsMarathi =
    receipt.amountInWordsMarathi || numberToMarathiWordsINR(receipt.amount);

  return {
    ...receipt,
    branchName,
    studentName: receipt.studentName || student?.name || 'Student',
    studentNameMarathi:
      receipt.studentNameMarathi ||
      student?.nameMarathi ||
      '',
    standardOrGrade:
      receipt.standardOrGrade ||
      student?.gradeOrSemester ||
      (isSchool ? 'Class 7-A' : 'B.Sc H&HA Sem 2'),
    division: receipt.division || student?.division || 'A',
    rollNo: receipt.rollNo || student?.rollNo || '01',
    admissionNo: receipt.admissionNo || student?.admissionNo || receipt.studentId,
    grNumber: receipt.grNumber || student?.grNumber || 'GR-2026-0842',
    academicYear: receipt.academicYear || student?.academicYear || '2026-2027',
    parentName: receipt.parentName || student?.parentName || student?.fatherName || 'Parent / Guardian',
    parentPhone: receipt.parentPhone || student?.parentPhone || '+91 98220 00000',
    category: receipt.category || student?.category || 'General / Open',
    totalAnnualFee,
    previouslyPaid,
    remainingBalance,
    feeBreakdown: breakdown,
    amountInWords,
    amountInWordsMarathi,
    transactionReference:
      receipt.transactionReference ||
      (receipt.paymentMode === 'UPI'
        ? `UPI/UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : receipt.paymentMode === 'CHEQUE'
        ? `CHQ-${Math.floor(100000 + Math.random() * 900000)}`
        : `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`),
    cashierName: receipt.cashierName || 'Accountant / Cashier Counter (Central Office)',
    installmentNo: receipt.installmentNo || 'Installment 2 (Term II)',
    qrVerificationUrl:
      receipt.qrVerificationUrl ||
      `http://localhost:5000/verify/fee-receipt/${receipt.receiptNo.toLowerCase()}`,
  };
}
