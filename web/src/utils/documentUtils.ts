/**
 * Document & Certificate Utilities
 * Statutory date-to-words conversion and institutional letterhead metadata.
 */

const ONES_WORDS = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS_WORDS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

const ORDINALS = [
  '', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
  'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth',
  'Twenty-First', 'Twenty-Second', 'Twenty-Third', 'Twenty-Fourth', 'Twenty-Fifth', 'Twenty-Sixth', 'Twenty-Seventh', 'Twenty-Eighth', 'Twenty-Ninth', 'Thirtieth',
  'Thirty-First'
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 20) return ONES_WORDS[num];
  if (num < 100) {
    const tens = TENS_WORDS[Math.floor(num / 10)];
    const ones = num % 10 !== 0 ? ` ${ONES_WORDS[num % 10]}` : '';
    return `${tens}${ones}`;
  }
  if (num < 1000) {
    const hundreds = `${ONES_WORDS[Math.floor(num / 100)]} Hundred`;
    const remainder = num % 100 !== 0 ? ` and ${numberToWords(num % 100)}` : '';
    return `${hundreds}${remainder}`;
  }
  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    if (thousands === 1 && remainder < 100) {
      // e.g. 1998 -> "Nineteen Ninety-Eight"
      const century = Math.floor(num / 100);
      const dec = num % 100;
      return `${numberToWords(century)} ${numberToWords(dec)}`;
    }
    if (thousands === 2 && remainder < 100) {
      // e.g. 2004 -> "Two Thousand Four"
      const rest = remainder !== 0 ? ` ${numberToWords(remainder)}` : '';
      return `Two Thousand${rest}`;
    }
    const thStr = `${numberToWords(thousands)} Thousand`;
    const rest = remainder !== 0 ? ` ${numberToWords(remainder)}` : '';
    return `${thStr}${rest}`;
  }
  return num.toString();
}

/**
 * Converts a date string (YYYY-MM-DD or DD/MM/YYYY) into statutory legal words format.
 * Example: "2000-05-18" -> "Eighteenth May Two Thousand"
 */
export function formatDobInWords(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    let year = 0;
    let month = 0;
    let day = 0;

    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      }
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }

    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return dateStr;
    }

    const dayWord = ORDINALS[day] || `${day}th`;
    const monthWord = MONTHS[month - 1] || '';

    let yearWord = '';
    if (year === 2000) {
      yearWord = 'Two Thousand';
    } else if (year > 2000 && year < 2100) {
      const rem = year - 2000;
      yearWord = `Two Thousand ${numberToWords(rem)}`;
    } else if (year >= 1900 && year < 2000) {
      const rem = year - 1900;
      yearWord = `Nineteen ${numberToWords(rem)}`;
    } else {
      yearWord = numberToWords(year);
    }

    return `${dayWord} ${monthWord} ${yearWord}`.trim();
  } catch {
    return dateStr;
  }
}

/**
 * Official Institutional Meta Configuration
 */
export interface InstitutionMeta {
  trustName: string;
  trustRegistration: string;
  name: string;
  shortName: string;
  tagline: string;
  affiliationNo: string;
  boardOrUniversity: string;
  udiseCode: string;
  indexNo: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  signatoryTitle: string;
  sealText: string;
}

export function getInstitutionDetails(institutionName?: string): InstitutionMeta {
  const isHotelMgmt =
    institutionName &&
    (institutionName.toLowerCase().includes('hotel') ||
      institutionName.toLowerCase().includes('technology') ||
      institutionName.toLowerCase().includes('solapur') ||
      institutionName.toLowerCase().includes('imperial') ||
      institutionName.toLowerCase().includes('college'));

  if (isHotelMgmt) {
    return {
      trustName: 'ZEP FOUNDATION BHOSE',
      trustRegistration: 'Regd. Under Bombay Public Trust Act 1950 • Reg. No. F-18452 (Solapur)',
      name: 'MODERN COLLEGE OF HOTEL MANAGEMENT AND TECHNOLOGY SOLAPUR',
      shortName: 'Modern College of HM & Tech Solapur',
      tagline: 'Center of Excellence in Hospitality, Tourism & Technology Administration',
      affiliationNo: 'MSBTE / University Affiliation No: MSBTE/ENG/HM-4412/SOLAPUR',
      boardOrUniversity: 'Affiliated to Maharashtra State Board of Technical Education & Punyashlok Ahilyadevi Holkar Solapur University',
      udiseCode: 'AISHE Code: C-58914',
      indexNo: 'College Code: 1482',
      address: 'Old Pune-Solapur Highway, Near Hotgi Road, Solapur',
      city: 'Solapur, Maharashtra',
      pincode: '413006',
      phone: '+91 217 260 8800',
      email: 'admissions@moderncollegehmtech.org',
      website: 'www.moderncollegehmtech.org',
      signatoryTitle: 'Director / Head of Institute',
      sealText: 'MODERN COLLEGE OF HOTEL MGMT & TECH ★ OFFICIAL SEAL ★ SOLAPUR',
    };
  }

  return {
    trustName: 'ZEP FOUNDATION BHOSE',
    trustRegistration: 'Regd. Under Bombay Public Trust Act 1950 • Reg. No. F-18452 (Solapur)',
    name: 'MODERN PUBLIC SCHOOL AND JUNIOR COLLEGE BHOSE',
    shortName: 'Modern Public School & Jr College Bhose',
    tagline: 'Empowering Young Minds with Wisdom, Character & Innovation',
    affiliationNo: 'CBSE / Maharashtra State Board Affiliation No: 27301402801',
    boardOrUniversity: 'Affiliated to CBSE & Maharashtra State Board of Secondary & Higher Secondary Education',
    udiseCode: 'U-DISE+ Code: 27301402801',
    indexNo: 'School & Junior College Index: 24.08.012',
    address: 'Modern Educational Campus, At/Post Bhose, Tal. Pandharpur / Miraj',
    city: 'Bhose, Dist. Solapur, Maharashtra',
    pincode: '413315',
    phone: '+91 2186 250 100',
    email: 'principal@modernschoolbhose.org',
    website: 'www.modernschoolbhose.org',
    signatoryTitle: 'Principal / Head of Institution',
    sealText: 'MODERN PUBLIC SCHOOL AND JUNIOR COLLEGE ★ SEAL OF EXCELLENCE ★ BHOSE',
  };
}
