// Institutional Academic & Global Masters for Zep Foundation Bhose
// Powers standard ID-based selections across School (Modern Public School) and College (Modern College of HM & Tech)

export type BranchScope = 'ALL' | 'SCHOOL' | 'COLLEGE';

export interface MasterBoard {
  id: string;
  name: string;
  code: string;
  branchScope: BranchScope;
  affiliationNo: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterMedium {
  id: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterStandard {
  id: string;
  name: string;
  code: string;
  branchScope: 'SCHOOL' | 'COLLEGE';
  courseCategory?: string; // e.g. "Primary", "Secondary", "Degree", "Diploma"
  boardId: string;
  mediumId: string;
  divisions: string[]; // e.g. ["A", "B", "C"]
  annualFeeEstimate: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterDivision {
  id: string;
  name: string;
  code: string;
  shift: 'MORNING' | 'AFTERNOON' | 'FULL_DAY';
  defaultRoom: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterSubject {
  id: string;
  name: string;
  code: string;
  type: 'THEORY' | 'PRACTICAL' | 'BOTH';
  branchScope: BranchScope;
  departmentId: string;
  maxMarks: number;
  passingMarks: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterClassroom {
  id: string;
  name: string;
  roomCode: string;
  type: 'CLASSROOM' | 'KITCHEN_LAB' | 'COMPUTER_LAB' | 'SCIENCE_LAB' | 'AUDITORIUM';
  branchScope: BranchScope;
  wing: string;
  floor: string;
  capacity: number;
  facilities: string[];
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  assignedClassGrade?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterDepartment {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  branchScope: BranchScope;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterDesignation {
  id: string;
  title: string;
  code: string;
  category: 'MANAGEMENT' | 'FACULTY' | 'ADMIN' | 'SUPPORT';
  branchScope: BranchScope;
  payGrade?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterTeacher {
  id: string;
  employeeCode: string;
  name: string;
  designationId: string;
  departmentId: string;
  branchScope: BranchScope;
  qualification: string;
  phone: string;
  email: string;
  assignedSubjectIds: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterStaff {
  id: string;
  staffCode: string;
  name: string;
  designationId: string;
  departmentId: string;
  branchScope: BranchScope;
  roleCategory: 'ADMINISTRATIVE' | 'ACCOUNTING' | 'TECHNICAL' | 'CUSTODIAL';
  phone: string;
  email: string;
  shift: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterOriginalDocument {
  id: string;
  title: string;
  code: string;
  branchScope: BranchScope;
  isMandatory: boolean;
  issuingAuthority: string;
  defaultRackCupboard: string;
  retentionYears: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterAcademicYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
}

export interface MasterCountry {
  id: string;
  name: string;
  isoCode: string;
  iso3: string;
  dialCode: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterState {
  id: string;
  name: string;
  code: string;
  countryId: string;
  capital: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterDistrict {
  id: string;
  name: string;
  code: string;
  stateId: string;
  division: string;
  isHeadquarterZone?: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

// ------------------------------------------------------------------------------------------------
// INITIAL PRE-POPULATED DATA
// ------------------------------------------------------------------------------------------------

export const INITIAL_BOARDS: MasterBoard[] = [
  {
    id: 'brd-mh-ssc',
    name: 'Maharashtra State Board of Secondary & Higher Secondary Education (Pune/Solapur Div)',
    code: 'MSBSHSE',
    branchScope: 'SCHOOL',
    affiliationNo: 'MSB-SOL-2018-091',
    state: 'Maharashtra',
    status: 'ACTIVE',
  },
  {
    id: 'brd-pah-su',
    name: 'Punyashlok Ahilyadevi Holkar Solapur University (PAHSU)',
    code: 'PAHSU',
    branchScope: 'COLLEGE',
    affiliationNo: 'PAHSU-AFF-COL-402',
    state: 'Maharashtra',
    status: 'ACTIVE',
  },
  {
    id: 'brd-msbte',
    name: 'Maharashtra State Board of Technical Education (MSBTE Mumbai)',
    code: 'MSBTE',
    branchScope: 'COLLEGE',
    affiliationNo: 'MSBTE-DIP-HM-088',
    state: 'Maharashtra',
    status: 'ACTIVE',
  },
  {
    id: 'brd-cbse',
    name: 'Central Board of Secondary Education (CBSE New Delhi)',
    code: 'CBSE',
    branchScope: 'SCHOOL',
    affiliationNo: 'CBSE-AFF-113042',
    state: 'All India',
    status: 'ACTIVE',
  },
];

export const INITIAL_MEDIUMS: MasterMedium[] = [
  { id: 'med-eng', name: 'English Medium', code: 'ENG', status: 'ACTIVE' },
  { id: 'med-mar', name: 'Marathi Medium (मराठी)', code: 'MAR', status: 'ACTIVE' },
  { id: 'med-semi', name: 'Semi-English Medium (Science/Maths in English)', code: 'SEMI-ENG', status: 'ACTIVE' },
  { id: 'med-hin', name: 'Hindi Medium (हिंदी)', code: 'HIN', status: 'ACTIVE' },
];

export const INITIAL_STANDARDS: MasterStandard[] = [
  // School Standards (Modern Public School & Junior College Bhose)
  {
    id: 'std-nur',
    name: 'Nursery (Pre-Primary)',
    code: 'NUR',
    branchScope: 'SCHOOL',
    courseCategory: 'Pre-Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 22000,
    status: 'ACTIVE',
  },
  {
    id: 'std-jrkg',
    name: 'Junior KG',
    code: 'JR-KG',
    branchScope: 'SCHOOL',
    courseCategory: 'Pre-Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 24000,
    status: 'ACTIVE',
  },
  {
    id: 'std-srkg',
    name: 'Senior KG',
    code: 'SR-KG',
    branchScope: 'SCHOOL',
    courseCategory: 'Pre-Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 26000,
    status: 'ACTIVE',
  },
  {
    id: 'std-01',
    name: 'Standard 1st',
    code: 'STD-1',
    branchScope: 'SCHOOL',
    courseCategory: 'Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B', 'C'],
    annualFeeEstimate: 32000,
    status: 'ACTIVE',
  },
  {
    id: 'std-02',
    name: 'Standard 2nd',
    code: 'STD-2',
    branchScope: 'SCHOOL',
    courseCategory: 'Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 32000,
    status: 'ACTIVE',
  },
  {
    id: 'std-03',
    name: 'Standard 3rd',
    code: 'STD-3',
    branchScope: 'SCHOOL',
    courseCategory: 'Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 34000,
    status: 'ACTIVE',
  },
  {
    id: 'std-04',
    name: 'Standard 4th',
    code: 'STD-4',
    branchScope: 'SCHOOL',
    courseCategory: 'Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 34000,
    status: 'ACTIVE',
  },
  {
    id: 'std-05',
    name: 'Standard 5th',
    code: 'STD-5',
    branchScope: 'SCHOOL',
    courseCategory: 'Upper Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-semi',
    divisions: ['A', 'B', 'C'],
    annualFeeEstimate: 36000,
    status: 'ACTIVE',
  },
  {
    id: 'std-06',
    name: 'Standard 6th',
    code: 'STD-6',
    branchScope: 'SCHOOL',
    courseCategory: 'Upper Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-semi',
    divisions: ['A', 'B', 'C'],
    annualFeeEstimate: 36000,
    status: 'ACTIVE',
  },
  {
    id: 'std-07',
    name: 'Standard 7th',
    code: 'STD-7',
    branchScope: 'SCHOOL',
    courseCategory: 'Upper Primary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-semi',
    divisions: ['A', 'B'],
    annualFeeEstimate: 36000,
    status: 'ACTIVE',
  },
  {
    id: 'std-08',
    name: 'Standard 8th',
    code: 'STD-8',
    branchScope: 'SCHOOL',
    courseCategory: 'Secondary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-semi',
    divisions: ['A', 'B'],
    annualFeeEstimate: 38000,
    status: 'ACTIVE',
  },
  {
    id: 'std-09',
    name: 'Standard 9th',
    code: 'STD-9',
    branchScope: 'SCHOOL',
    courseCategory: 'Secondary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-semi',
    divisions: ['A', 'B'],
    annualFeeEstimate: 40000,
    status: 'ACTIVE',
  },
  {
    id: 'std-10',
    name: 'Standard 10th (SSC Board Exam)',
    code: 'STD-10',
    branchScope: 'SCHOOL',
    courseCategory: 'Secondary',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-semi',
    divisions: ['A', 'B'],
    annualFeeEstimate: 42000,
    status: 'ACTIVE',
  },
  {
    id: 'std-11-sci',
    name: '11th Science (Junior College)',
    code: 'JC-11-SCI',
    branchScope: 'SCHOOL',
    courseCategory: 'Junior College',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 48000,
    status: 'ACTIVE',
  },
  {
    id: 'std-12-sci',
    name: '12th Science (HSC Board Exam)',
    code: 'JC-12-SCI',
    branchScope: 'SCHOOL',
    courseCategory: 'Junior College',
    boardId: 'brd-mh-ssc',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 52000,
    status: 'ACTIVE',
  },

  // College Courses & Semesters (Modern College Of Hotel Management And Technology Solapur)
  {
    id: 'crs-bhm-s1',
    name: 'B.Sc in Hospitality Studies - Semester 1',
    code: 'BHM-SEM-1',
    branchScope: 'COLLEGE',
    courseCategory: 'Undergraduate Degree',
    boardId: 'brd-pah-su',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 75000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-bhm-s2',
    name: 'B.Sc in Hospitality Studies - Semester 2',
    code: 'BHM-SEM-2',
    branchScope: 'COLLEGE',
    courseCategory: 'Undergraduate Degree',
    boardId: 'brd-pah-su',
    mediumId: 'med-eng',
    divisions: ['A', 'B'],
    annualFeeEstimate: 75000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-bhm-s3',
    name: 'B.Sc in Hospitality Studies - Semester 3',
    code: 'BHM-SEM-3',
    branchScope: 'COLLEGE',
    courseCategory: 'Undergraduate Degree',
    boardId: 'brd-pah-su',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 78000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-bhm-s4',
    name: 'B.Sc in Hospitality Studies - Semester 4 (5-Star Internship)',
    code: 'BHM-SEM-4',
    branchScope: 'COLLEGE',
    courseCategory: 'Undergraduate Degree',
    boardId: 'brd-pah-su',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 78000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-bhm-s5',
    name: 'B.Sc in Hospitality Studies - Semester 5',
    code: 'BHM-SEM-5',
    branchScope: 'COLLEGE',
    courseCategory: 'Undergraduate Degree',
    boardId: 'brd-pah-su',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 82000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-bhm-s6',
    name: 'B.Sc in Hospitality Studies - Semester 6',
    code: 'BHM-SEM-6',
    branchScope: 'COLLEGE',
    courseCategory: 'Undergraduate Degree',
    boardId: 'brd-pah-su',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 82000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-dip-bakery',
    name: 'Diploma in Bakery, Confectionery & Pastry Arts (Annual)',
    code: 'DIP-BAKERY',
    branchScope: 'COLLEGE',
    courseCategory: 'Professional Diploma',
    boardId: 'brd-msbte',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 65000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-cert-fnb',
    name: 'Certificate in Food & Beverage Operations & Mock Bar',
    code: 'CERT-FNB',
    branchScope: 'COLLEGE',
    courseCategory: 'Certificate Program',
    boardId: 'brd-msbte',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 45000,
    status: 'ACTIVE',
  },
  {
    id: 'crs-dip-culinary',
    name: 'Advanced Diploma in Culinary Arts & Continental Kitchen',
    code: 'DIP-CULINARY',
    branchScope: 'COLLEGE',
    courseCategory: 'Professional Diploma',
    boardId: 'brd-msbte',
    mediumId: 'med-eng',
    divisions: ['A'],
    annualFeeEstimate: 70000,
    status: 'ACTIVE',
  },
];

export const INITIAL_DIVISIONS: MasterDivision[] = [
  { id: 'div-a', name: 'Division A', code: 'A', shift: 'MORNING', defaultRoom: 'rm-sch-101', capacity: 45, status: 'ACTIVE' },
  { id: 'div-b', name: 'Division B', code: 'B', shift: 'MORNING', defaultRoom: 'rm-sch-102', capacity: 45, status: 'ACTIVE' },
  { id: 'div-c', name: 'Division C', code: 'C', shift: 'AFTERNOON', defaultRoom: 'rm-sch-201', capacity: 40, status: 'ACTIVE' },
  { id: 'div-d', name: 'Division D (Practical Special Batch)', code: 'D', shift: 'FULL_DAY', defaultRoom: 'lab-col-btk', capacity: 25, status: 'ACTIVE' },
];

export const INITIAL_SUBJECTS: MasterSubject[] = [
  // School Subjects
  { id: 'sub-sch-mat', name: 'Mathematics & Algebra', code: 'MAT-101', type: 'BOTH', branchScope: 'SCHOOL', departmentId: 'dept-sch-sci', maxMarks: 100, passingMarks: 35, status: 'ACTIVE' },
  { id: 'sub-sch-sci', name: 'General Science & Technology', code: 'SCI-102', type: 'BOTH', branchScope: 'SCHOOL', departmentId: 'dept-sch-sci', maxMarks: 100, passingMarks: 35, status: 'ACTIVE' },
  { id: 'sub-sch-eng', name: 'English (Higher Level)', code: 'ENG-103', type: 'THEORY', branchScope: 'SCHOOL', departmentId: 'dept-sch-sec', maxMarks: 100, passingMarks: 35, status: 'ACTIVE' },
  { id: 'sub-sch-mar', name: 'Marathi (प्रथम भाषा)', code: 'MAR-104', type: 'THEORY', branchScope: 'SCHOOL', departmentId: 'dept-sch-sec', maxMarks: 100, passingMarks: 35, status: 'ACTIVE' },
  { id: 'sub-sch-hin', name: 'Hindi (द्वितीय भाषा)', code: 'HIN-105', type: 'THEORY', branchScope: 'SCHOOL', departmentId: 'dept-sch-sec', maxMarks: 100, passingMarks: 35, status: 'ACTIVE' },
  { id: 'sub-sch-soc', name: 'Social Sciences & Civics', code: 'SOC-106', type: 'THEORY', branchScope: 'SCHOOL', departmentId: 'dept-sch-sec', maxMarks: 100, passingMarks: 35, status: 'ACTIVE' },
  { id: 'sub-sch-comp', name: 'Computer Applications & Coding', code: 'CMP-107', type: 'PRACTICAL', branchScope: 'SCHOOL', departmentId: 'dept-sch-sec', maxMarks: 50, passingMarks: 20, status: 'ACTIVE' },

  // College Hospitality & Hotel Management Subjects
  { id: 'sub-col-fp', name: 'Food Production Principles & Classical French Cookery', code: 'FP-201', type: 'BOTH', branchScope: 'COLLEGE', departmentId: 'dept-col-cul', maxMarks: 100, passingMarks: 40, status: 'ACTIVE' },
  { id: 'sub-col-bak', name: 'Bakery, Patisserie & Confectionery Science', code: 'BAK-202', type: 'BOTH', branchScope: 'COLLEGE', departmentId: 'dept-col-bak', maxMarks: 100, passingMarks: 40, status: 'ACTIVE' },
  { id: 'sub-col-fnb', name: 'Food & Beverage Service & Mocktail Mixology', code: 'FNB-203', type: 'BOTH', branchScope: 'COLLEGE', departmentId: 'dept-col-fnb', maxMarks: 100, passingMarks: 40, status: 'ACTIVE' },
  { id: 'sub-col-fo', name: 'Front Office Operations & Hotel Property PMS', code: 'FO-204', type: 'BOTH', branchScope: 'COLLEGE', departmentId: 'dept-col-fo', maxMarks: 100, passingMarks: 40, status: 'ACTIVE' },
  { id: 'sub-col-hk', name: 'Accommodation Operations & Housekeeping', code: 'HK-205', type: 'BOTH', branchScope: 'COLLEGE', departmentId: 'dept-col-fo', maxMarks: 100, passingMarks: 40, status: 'ACTIVE' },
  { id: 'sub-col-cost', name: 'Hotel Accounting, Costing & Inventory Control', code: 'FCL-206', type: 'THEORY', branchScope: 'COLLEGE', departmentId: 'dept-col-adm', maxMarks: 100, passingMarks: 40, status: 'ACTIVE' },
  { id: 'sub-col-haccp', name: 'HACCP, Hygiene & Food Safety Regulations', code: 'HAC-207', type: 'THEORY', branchScope: 'COLLEGE', departmentId: 'dept-col-cul', maxMarks: 50, passingMarks: 20, status: 'ACTIVE' },
];

export const INITIAL_CLASSROOMS: MasterClassroom[] = [
  // School Classrooms & Labs
  { id: 'rm-sch-101', name: 'Room 101 (Smart Interactive Board)', roomCode: 'SCH-101', type: 'CLASSROOM', branchScope: 'SCHOOL', wing: 'North Wing', floor: '1st Floor', capacity: 45, facilities: ['Digital Projector', 'CCTV Surveillance', 'PA System'], assignedTeacherId: 'tch-sch-02', assignedTeacherName: 'Rajendra Patil', assignedClassGrade: 'Class 7-A', status: 'ACTIVE' },
  { id: 'rm-sch-102', name: 'Room 102 (Smart Interactive Board)', roomCode: 'SCH-102', type: 'CLASSROOM', branchScope: 'SCHOOL', wing: 'North Wing', floor: '1st Floor', capacity: 45, facilities: ['Digital Projector', 'CCTV Surveillance', 'PA System'], assignedTeacherId: 'tch-sch-03', assignedTeacherName: 'Neha Joshi', assignedClassGrade: 'Class 8-A', status: 'ACTIVE' },
  { id: 'rm-sch-201', name: 'Room 201 (Senior Secondary Wing)', roomCode: 'SCH-201', type: 'CLASSROOM', branchScope: 'SCHOOL', wing: 'South Wing', floor: '2nd Floor', capacity: 50, facilities: ['Smart TV', 'Podium', 'Acoustic Ceiling'], assignedTeacherId: 'tch-sch-01', assignedTeacherName: 'Sunita Kulkarni', assignedClassGrade: 'Class 10-A', status: 'ACTIVE' },
  { id: 'rm-sch-sci', name: 'C.V. Raman Integrated Science Lab', roomCode: 'SCH-SCI-LAB', type: 'SCIENCE_LAB', branchScope: 'SCHOOL', wing: 'East Wing', floor: '2nd Floor', capacity: 40, facilities: ['Gas Burners', 'Microscopes', 'Fume Hood', 'Safety Showers'], assignedTeacherName: 'Unassigned', status: 'ACTIVE' },
  { id: 'rm-sch-comp', name: 'Alan Turing Computer Lab', roomCode: 'SCH-COMP-LAB', type: 'COMPUTER_LAB', branchScope: 'SCHOOL', wing: 'West Wing', floor: '1st Floor', capacity: 45, facilities: ['45 Core i5 Desktops', 'Fiber Optical Gigabit LAN', 'Online UPS Backup'], assignedTeacherName: 'Unassigned', status: 'ACTIVE' },

  // College Commercial Kitchens & Labs
  { id: 'lab-col-btk', name: 'Basic Training Kitchen (BTK)', roomCode: 'COL-BTK-01', type: 'KITCHEN_LAB', branchScope: 'COLLEGE', wing: 'Culinary Block', floor: 'Ground Floor', capacity: 24, facilities: ['24 Stainless Steel Workstations', 'Individual LPG Ranges', 'Knife Sharpening Station', 'Double Sink Units'], assignedTeacherId: 'tch-col-01', assignedTeacherName: 'Chef Anand Deshpande', assignedClassGrade: 'B.Sc H&HA Sem-1', status: 'ACTIVE' },
  { id: 'lab-col-qfk', name: 'Quantity Food Kitchen (QFK - Bulk Culinary)', roomCode: 'COL-QFK-02', type: 'KITCHEN_LAB', branchScope: 'COLLEGE', wing: 'Culinary Block', floor: 'Ground Floor', capacity: 30, facilities: ['Tilting Bratt Pan', 'Steam Jacketed Kettles', 'Commercial Deck Ovens', 'Walk-in Cold Storage'], assignedTeacherName: 'Unassigned', status: 'ACTIVE' },
  { id: 'lab-col-atk', name: 'Advance Training Kitchen (ATK - Ala-Carte)', roomCode: 'COL-ATK-03', type: 'KITCHEN_LAB', branchScope: 'COLLEGE', wing: 'Culinary Block', floor: '1st Floor', capacity: 20, facilities: ['Salamander Grills', 'Sous Vide Precision Cookers', 'Combi Steam Oven', 'Plating Pass Counter'], assignedTeacherName: 'Unassigned', status: 'ACTIVE' },
  { id: 'lab-col-bakery', name: 'European Bakery & Patisserie Studio', roomCode: 'COL-BAK-04', type: 'KITCHEN_LAB', branchScope: 'COLLEGE', wing: 'Culinary Block', floor: '1st Floor', capacity: 24, facilities: ['Dough Sheeter', 'Proving Chamber', 'Planetary Mixers', 'Granite Tempering Table'], assignedTeacherId: 'tch-col-02', assignedTeacherName: 'Chef Meera Jadhav', assignedClassGrade: 'Diploma in Bakery', status: 'ACTIVE' },
  { id: 'lab-col-mockbar', name: 'Training Restaurant & Mocktail Mixology Bar', roomCode: 'COL-BAR-05', type: 'CLASSROOM', branchScope: 'COLLEGE', wing: 'Hospitality Pavilion', floor: '1st Floor', capacity: 36, facilities: ['32 Cover Banquet Table Setup', 'Under-counter Glass Washer', 'Espresso Machine', 'Gueridon Flambé Cart'], assignedTeacherId: 'tch-col-03', assignedTeacherName: 'Prashant More', assignedClassGrade: 'B.Sc H&HA Sem-3', status: 'ACTIVE' },
  { id: 'rm-col-fo-suite', name: 'Front Desk & Fidelio PMS Simulation Suite', roomCode: 'COL-FO-06', type: 'COMPUTER_LAB', branchScope: 'COLLEGE', wing: 'Admin Complex', floor: 'Ground Floor', capacity: 25, facilities: ['Keycard Encoder', 'Touchscreen Point of Sale', 'OPERA Cloud Terminal'], assignedTeacherId: 'tch-col-04', assignedTeacherName: 'Kavita Solanke', assignedClassGrade: 'Front Office Diploma', status: 'ACTIVE' },
];

export const INITIAL_DEPARTMENTS: MasterDepartment[] = [
  // School Departments
  { id: 'dept-sch-pri', name: 'Primary Education Wing', code: 'DEPT-PRI', headOfDepartment: 'Sunita Kulkarni', branchScope: 'SCHOOL', email: 'primary@mpsbhose.edu.in', status: 'ACTIVE' },
  { id: 'dept-sch-sec', name: 'Secondary & High School Wing', code: 'DEPT-SEC', headOfDepartment: 'Rajendra Patil', branchScope: 'SCHOOL', email: 'secondary@mpsbhose.edu.in', status: 'ACTIVE' },
  { id: 'dept-sch-sci', name: 'Science & Mathematics Faculty', code: 'DEPT-SCI', headOfDepartment: 'Neha Joshi', branchScope: 'SCHOOL', email: 'science@mpsbhose.edu.in', status: 'ACTIVE' },
  { id: 'dept-sch-sports', name: 'Physical Education & Athletics', code: 'DEPT-SPT', headOfDepartment: 'Vikram Shinde', branchScope: 'SCHOOL', email: 'sports@mpsbhose.edu.in', status: 'ACTIVE' },

  // College Departments
  { id: 'dept-col-cul', name: 'Culinary Arts & Food Production', code: 'DEPT-FP', headOfDepartment: 'Chef Anand Deshpande', branchScope: 'COLLEGE', email: 'culinary@mchmtsolapur.edu.in', status: 'ACTIVE' },
  { id: 'dept-col-bak', name: 'Bakery, Pastry & Confectionery Arts', code: 'DEPT-BAK', headOfDepartment: 'Chef Meera Jadhav', branchScope: 'COLLEGE', email: 'bakery@mchmtsolapur.edu.in', status: 'ACTIVE' },
  { id: 'dept-col-fnb', name: 'Food & Beverage Service Operations', code: 'DEPT-FNB', headOfDepartment: 'Prashant More', branchScope: 'COLLEGE', email: 'fnb@mchmtsolapur.edu.in', status: 'ACTIVE' },
  { id: 'dept-col-fo', name: 'Rooms Division & Front Office Management', code: 'DEPT-FO', headOfDepartment: 'Kavita Solanke', branchScope: 'COLLEGE', email: 'frontoffice@mchmtsolapur.edu.in', status: 'ACTIVE' },
  { id: 'dept-col-adm', name: 'College Examination & Academic Cell', code: 'DEPT-ADM', headOfDepartment: 'Sanjay Shinde', branchScope: 'COLLEGE', email: 'academics@mchmtsolapur.edu.in', status: 'ACTIVE' },
];

export const INITIAL_DESIGNATIONS: MasterDesignation[] = [
  { id: 'desig-prin', title: 'Principal / Campus Director', code: 'PRIN', category: 'MANAGEMENT', branchScope: 'ALL', payGrade: 'Level 14', status: 'ACTIVE' },
  { id: 'desig-vprin', title: 'Vice Principal / Academic Dean', code: 'V-PRIN', category: 'MANAGEMENT', branchScope: 'ALL', payGrade: 'Level 12', status: 'ACTIVE' },
  { id: 'desig-hod', title: 'Head of Department / Senior Professor', code: 'HOD', category: 'FACULTY', branchScope: 'ALL', payGrade: 'Level 11', status: 'ACTIVE' },
  { id: 'desig-asst-prof', title: 'Assistant Professor / Senior Lecturer', code: 'ASST-PROF', category: 'FACULTY', branchScope: 'COLLEGE', payGrade: 'Level 10', status: 'ACTIVE' },
  { id: 'desig-chef-inst', title: 'Executive Chef Instructor (Culinary Master)', code: 'CHEF-INST', category: 'FACULTY', branchScope: 'COLLEGE', payGrade: 'Level 10', status: 'ACTIVE' },
  { id: 'desig-tgt', title: 'Trained Graduate Teacher (TGT Secondary)', code: 'TGT', category: 'FACULTY', branchScope: 'SCHOOL', payGrade: 'Level 8', status: 'ACTIVE' },
  { id: 'desig-prt', title: 'Primary Teacher (PRT Elementary)', code: 'PRT', category: 'FACULTY', branchScope: 'SCHOOL', payGrade: 'Level 6', status: 'ACTIVE' },
  { id: 'desig-acc', title: 'Chief Accountant & Trust Auditor', code: 'ACC-CHIEF', category: 'ADMIN', branchScope: 'ALL', payGrade: 'Level 9', status: 'ACTIVE' },
  { id: 'desig-reg', title: 'Registrar & Document Custodian', code: 'REGISTRAR', category: 'ADMIN', branchScope: 'ALL', payGrade: 'Level 9', status: 'ACTIVE' },
  { id: 'desig-lab-att', title: 'Lab Assistant & Kitchen Storekeeper', code: 'LAB-ATT', category: 'SUPPORT', branchScope: 'ALL', payGrade: 'Level 4', status: 'ACTIVE' },
];

export const INITIAL_TEACHERS: MasterTeacher[] = [
  // School Faculty (Modern Public School & Junior College Bhose)
  {
    id: 'tch-sch-01',
    employeeCode: 'TCH-MPS-001',
    name: 'Sunita Kulkarni',
    designationId: 'desig-prin',
    departmentId: 'dept-sch-pri',
    branchScope: 'SCHOOL',
    qualification: 'M.Sc (Physics), B.Ed, M.Phil',
    phone: '+91 98220 11001',
    email: 'sunita.kulkarni@mpsbhose.edu.in',
    assignedSubjectIds: ['sub-sch-sci'],
    status: 'ACTIVE',
  },
  {
    id: 'tch-sch-02',
    employeeCode: 'TCH-MPS-002',
    name: 'Rajendra Patil',
    designationId: 'desig-tgt',
    departmentId: 'dept-sch-sec',
    branchScope: 'SCHOOL',
    qualification: 'M.A (Marathi, History), B.Ed',
    phone: '+91 98220 11002',
    email: 'rajendra.patil@mpsbhose.edu.in',
    assignedSubjectIds: ['sub-sch-mar', 'sub-sch-soc'],
    status: 'ACTIVE',
  },
  {
    id: 'tch-sch-03',
    employeeCode: 'TCH-MPS-003',
    name: 'Neha Joshi',
    designationId: 'desig-tgt',
    departmentId: 'dept-sch-sci',
    branchScope: 'SCHOOL',
    qualification: 'M.Sc (Mathematics), B.Ed',
    phone: '+91 98220 11003',
    email: 'neha.joshi@mpsbhose.edu.in',
    assignedSubjectIds: ['sub-sch-mat'],
    status: 'ACTIVE',
  },
  {
    id: 'tch-sch-04',
    employeeCode: 'TCH-MPS-004',
    name: 'Vikram Shinde',
    designationId: 'desig-tgt',
    departmentId: 'dept-sch-sports',
    branchScope: 'SCHOOL',
    qualification: 'M.P.Ed (Athletics & Yoga)',
    phone: '+91 98220 11004',
    email: 'vikram.shinde@mpsbhose.edu.in',
    assignedSubjectIds: [],
    status: 'ACTIVE',
  },

  // College Faculty (Modern College Of Hotel Management And Technology Solapur)
  {
    id: 'tch-col-01',
    employeeCode: 'TCH-HM-101',
    name: 'Chef Anand Deshpande',
    designationId: 'desig-chef-inst',
    departmentId: 'dept-col-cul',
    branchScope: 'COLLEGE',
    qualification: 'BHM, 12 Yrs Taj Group 5-Star Executive Chef',
    phone: '+91 98230 44001',
    email: 'anand.deshpande@mchmtsolapur.edu.in',
    assignedSubjectIds: ['sub-col-fp', 'sub-col-haccp'],
    status: 'ACTIVE',
  },
  {
    id: 'tch-col-02',
    employeeCode: 'TCH-HM-102',
    name: 'Chef Meera Jadhav',
    designationId: 'desig-chef-inst',
    departmentId: 'dept-col-bak',
    branchScope: 'COLLEGE',
    qualification: 'Diploma in French Patisserie (Paris), Master Confectioner',
    phone: '+91 98230 44002',
    email: 'meera.jadhav@mchmtsolapur.edu.in',
    assignedSubjectIds: ['sub-col-bak'],
    status: 'ACTIVE',
  },
  {
    id: 'tch-col-03',
    employeeCode: 'TCH-HM-103',
    name: 'Prashant More',
    designationId: 'desig-asst-prof',
    departmentId: 'dept-col-fnb',
    branchScope: 'COLLEGE',
    qualification: 'M.Sc Hospitality Administration, Sommelier Certified',
    phone: '+91 98230 44003',
    email: 'prashant.more@mchmtsolapur.edu.in',
    assignedSubjectIds: ['sub-col-fnb'],
    status: 'ACTIVE',
  },
  {
    id: 'tch-col-04',
    employeeCode: 'TCH-HM-104',
    name: 'Kavita Solanke',
    designationId: 'desig-asst-prof',
    departmentId: 'dept-col-fo',
    branchScope: 'COLLEGE',
    qualification: 'MBA Tourism & Hotel Management, Opera Certified',
    phone: '+91 98230 44004',
    email: 'kavita.solanke@mchmtsolapur.edu.in',
    assignedSubjectIds: ['sub-col-fo', 'sub-col-hk'],
    status: 'ACTIVE',
  },
];

export const INITIAL_STAFF: MasterStaff[] = [
  {
    id: 'stf-01',
    staffCode: 'STF-TR-001',
    name: 'Sanjay Shinde',
    designationId: 'desig-reg',
    departmentId: 'dept-col-adm',
    branchScope: 'ALL',
    roleCategory: 'ADMINISTRATIVE',
    phone: '+91 98220 55111',
    email: 'sanjay.registrar@zepfoundation.org',
    shift: 'General (9:00 AM - 5:30 PM)',
    status: 'ACTIVE',
  },
  {
    id: 'stf-02',
    staffCode: 'STF-TR-002',
    name: 'Nilesh Gaikwad',
    designationId: 'desig-acc',
    departmentId: 'dept-col-adm',
    branchScope: 'ALL',
    roleCategory: 'ACCOUNTING',
    phone: '+91 98220 55222',
    email: 'accounts@zepfoundation.org',
    shift: 'General (9:00 AM - 5:30 PM)',
    status: 'ACTIVE',
  },
  {
    id: 'stf-03',
    staffCode: 'STF-TR-003',
    name: 'Anita Patil',
    designationId: 'desig-lab-att',
    departmentId: 'dept-sch-pri',
    branchScope: 'ALL',
    roleCategory: 'CUSTODIAL',
    phone: '+91 98220 55333',
    email: 'archive.custodian@zepfoundation.org',
    shift: 'Morning (8:00 AM - 4:30 PM)',
    status: 'ACTIVE',
  },
  {
    id: 'stf-04',
    staffCode: 'STF-TR-004',
    name: 'Ramesh Jadhav',
    designationId: 'desig-lab-att',
    departmentId: 'dept-col-cul',
    branchScope: 'COLLEGE',
    roleCategory: 'TECHNICAL',
    phone: '+91 98220 55444',
    email: 'kitchen.stores@mchmtsolapur.edu.in',
    shift: 'Early Morning (7:00 AM - 3:30 PM)',
    status: 'ACTIVE',
  },
];

export const INITIAL_ORIGINAL_DOCUMENTS: MasterOriginalDocument[] = [
  {
    id: 'doc-orig-lc',
    title: 'Original School / College Leaving Certificate (T.C. / L.C. with Counter Signature)',
    code: 'DOC-LC',
    branchScope: 'ALL',
    isMandatory: true,
    issuingAuthority: 'Head of Previous Institution / Education Inspector',
    defaultRackCupboard: 'C-01 (Fireproof Steel Archive)',
    retentionYears: 50,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-ssc',
    title: 'Original 10th / SSC Marksheet & Passing Certificate',
    code: 'DOC-SSC-MARKS',
    branchScope: 'ALL',
    isMandatory: true,
    issuingAuthority: 'Divisional Board (MSBSHSE / CBSE)',
    defaultRackCupboard: 'C-01 (Fireproof Steel Archive)',
    retentionYears: 10,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-hsc',
    title: 'Original 12th / HSC Marksheet & Passing Certificate',
    code: 'DOC-HSC-MARKS',
    branchScope: 'COLLEGE',
    isMandatory: true,
    issuingAuthority: 'Maharashtra State Board of Secondary & Higher Secondary Education',
    defaultRackCupboard: 'C-02 (College Vault)',
    retentionYears: 10,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-adh',
    title: 'Aadhaar Card Verified Photocopy (UIDAI Masked QR Verified)',
    code: 'DOC-AADHAAR',
    branchScope: 'ALL',
    isMandatory: true,
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    defaultRackCupboard: 'C-01 (Permanent File Folder)',
    retentionYears: 50,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-caste',
    title: 'Caste Certificate & Caste Validity Certificate (Trible/Social Welfare Dept)',
    code: 'DOC-CASTE-VAL',
    branchScope: 'ALL',
    isMandatory: false,
    issuingAuthority: 'Sub-Divisional Magistrate (SDM) / Caste Scrutiny Committee',
    defaultRackCupboard: 'C-03 (Reserved Quota Vault)',
    retentionYears: 10,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-ncl',
    title: 'Non-Creamy Layer Certificate (Current Financial Year Valid for OBC/VJNT/SBC)',
    code: 'DOC-NCL',
    branchScope: 'ALL',
    isMandatory: false,
    issuingAuthority: 'Tahsildar / Sub-Divisional Officer',
    defaultRackCupboard: 'C-03 (Reserved Quota Vault)',
    retentionYears: 5,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-dom',
    title: 'Domicile & Nationality Certificate (State of Maharashtra)',
    code: 'DOC-DOMICILE',
    branchScope: 'ALL',
    isMandatory: true,
    issuingAuthority: 'Competent Authority / Tahsildar / Executive Magistrate',
    defaultRackCupboard: 'C-01 (Permanent File Folder)',
    retentionYears: 20,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-med',
    title: 'Medical Fitness, Blood Group & Typhoid/Hepatitis Vaccination Certificate',
    code: 'DOC-MED-FIT',
    branchScope: 'COLLEGE',
    isMandatory: true,
    issuingAuthority: 'Registered Medical Practitioner (Civil Hospital / MBBS)',
    defaultRackCupboard: 'C-02 (Culinary Hygiene Dossier)',
    retentionYears: 5,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-mig',
    title: 'Migration Certificate (For Candidates from Other Board / Out-of-State University)',
    code: 'DOC-MIGRATION',
    branchScope: 'COLLEGE',
    isMandatory: false,
    issuingAuthority: 'Previous University / State Technical Board Registrar',
    defaultRackCupboard: 'C-02 (College Vault)',
    retentionYears: 10,
    status: 'ACTIVE',
  },
  {
    id: 'doc-orig-photo',
    title: 'Passport Size Photographs (Formal Attire with White Background, 4 Copies)',
    code: 'DOC-PHOTO',
    branchScope: 'ALL',
    isMandatory: true,
    issuingAuthority: 'Self Submitted',
    defaultRackCupboard: 'Student Dossier Envelope',
    retentionYears: 10,
    status: 'ACTIVE',
  },
];

export const INITIAL_ACADEMIC_YEARS: MasterAcademicYear[] = [
  { id: 'ay-2026-27', label: '2026-2027', startDate: '2026-06-01', endDate: '2027-05-31', isCurrent: true, status: 'ACTIVE' },
  { id: 'ay-2025-26', label: '2025-2026', startDate: '2025-06-01', endDate: '2026-05-31', isCurrent: false, status: 'COMPLETED' },
  { id: 'ay-2024-25', label: '2024-2025', startDate: '2024-06-01', endDate: '2025-05-31', isCurrent: false, status: 'COMPLETED' },
  { id: 'ay-2027-28', label: '2027-2028', startDate: '2027-06-01', endDate: '2028-05-31', isCurrent: false, status: 'UPCOMING' },
];

export const INITIAL_COUNTRIES: MasterCountry[] = [
  { id: 'cnt-in', name: 'India', isoCode: 'IN', iso3: 'IND', dialCode: '+91', currency: 'INR (₹)', status: 'ACTIVE' },
  { id: 'cnt-us', name: 'United States', isoCode: 'US', iso3: 'USA', dialCode: '+1', currency: 'USD ($)', status: 'ACTIVE' },
  { id: 'cnt-ae', name: 'United Arab Emirates', isoCode: 'AE', iso3: 'ARE', dialCode: '+971', currency: 'AED', status: 'ACTIVE' },
  { id: 'cnt-uk', name: 'United Kingdom', isoCode: 'GB', iso3: 'GBR', dialCode: '+44', currency: 'GBP (£)', status: 'ACTIVE' },
  { id: 'cnt-sg', name: 'Singapore', isoCode: 'SG', iso3: 'SGP', dialCode: '+65', currency: 'SGD ($)', status: 'ACTIVE' },
];

export const INITIAL_STATES: MasterState[] = [
  { id: 'st-mh', name: 'Maharashtra', code: 'MH', countryId: 'cnt-in', capital: 'Mumbai', status: 'ACTIVE' },
  { id: 'st-ka', name: 'Karnataka', code: 'KA', countryId: 'cnt-in', capital: 'Bengaluru', status: 'ACTIVE' },
  { id: 'st-ga', name: 'Goa', code: 'GA', countryId: 'cnt-in', capital: 'Panaji', status: 'ACTIVE' },
  { id: 'st-gj', name: 'Gujarat', code: 'GJ', countryId: 'cnt-in', capital: 'Gandhinagar', status: 'ACTIVE' },
  { id: 'st-mp', name: 'Madhya Pradesh', code: 'MP', countryId: 'cnt-in', capital: 'Bhopal', status: 'ACTIVE' },
  { id: 'st-dl', name: 'National Capital Territory of Delhi', code: 'DL', countryId: 'cnt-in', capital: 'New Delhi', status: 'ACTIVE' },
];

export const INITIAL_DISTRICTS: MasterDistrict[] = [
  { id: 'dst-sol', name: 'Solapur', code: 'SOL (MH-13)', stateId: 'st-mh', division: 'Pune Division', isHeadquarterZone: true, status: 'ACTIVE' },
  { id: 'dst-pun', name: 'Pune', code: 'PUN (MH-12)', stateId: 'st-mh', division: 'Pune Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-sng', name: 'Sangli', code: 'SNG (MH-10)', stateId: 'st-mh', division: 'Pune Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-str', name: 'Satara', code: 'STR (MH-11)', stateId: 'st-mh', division: 'Pune Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-klh', name: 'Kolhapur', code: 'KLH (MH-09)', stateId: 'st-mh', division: 'Pune Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-dhr', name: 'Dharashiv (Osmanabad)', code: 'DHR (MH-25)', stateId: 'st-mh', division: 'Marathwada Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-ltr', name: 'Latur', code: 'LTR (MH-24)', stateId: 'st-mh', division: 'Marathwada Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-ahd', name: 'Ahilyanagar (Ahmednagar)', code: 'AHD (MH-17)', stateId: 'st-mh', division: 'Nashik Division', isHeadquarterZone: false, status: 'ACTIVE' },
  { id: 'dst-mum', name: 'Mumbai City & Suburban', code: 'MUM (MH-01/02)', stateId: 'st-mh', division: 'Konkan Division', isHeadquarterZone: false, status: 'ACTIVE' },
];

// ------------------------------------------------------------------------------------------------
// LOCAL STORAGE PERSISTENCE HELPERS
// ------------------------------------------------------------------------------------------------

const STORAGE_KEYS = {
  BOARDS: 'trust_master_boards',
  MEDIUMS: 'trust_master_mediums',
  STANDARDS: 'trust_master_standards',
  DIVISIONS: 'trust_master_divisions',
  SUBJECTS: 'trust_master_subjects',
  CLASSROOMS: 'trust_master_classrooms',
  DEPARTMENTS: 'trust_master_departments',
  DESIGNATIONS: 'trust_master_designations',
  TEACHERS: 'trust_master_teachers',
  STAFF: 'trust_master_staff',
  DOCUMENTS: 'trust_master_documents',
  YEARS: 'trust_master_years',
  COUNTRIES: 'trust_master_countries',
  STATES: 'trust_master_states',
  DISTRICTS: 'trust_master_districts',
};

function loadStored<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const MasterStore = {
  getBoards: (): MasterBoard[] => loadStored(STORAGE_KEYS.BOARDS, INITIAL_BOARDS),
  saveBoards: (data: MasterBoard[]) => saveStored(STORAGE_KEYS.BOARDS, data),

  getMediums: (): MasterMedium[] => loadStored(STORAGE_KEYS.MEDIUMS, INITIAL_MEDIUMS),
  saveMediums: (data: MasterMedium[]) => saveStored(STORAGE_KEYS.MEDIUMS, data),

  getStandards: (): MasterStandard[] => loadStored(STORAGE_KEYS.STANDARDS, INITIAL_STANDARDS),
  saveStandards: (data: MasterStandard[]) => saveStored(STORAGE_KEYS.STANDARDS, data),

  getDivisions: (): MasterDivision[] => loadStored(STORAGE_KEYS.DIVISIONS, INITIAL_DIVISIONS),
  saveDivisions: (data: MasterDivision[]) => saveStored(STORAGE_KEYS.DIVISIONS, data),

  getSubjects: (): MasterSubject[] => loadStored(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
  saveSubjects: (data: MasterSubject[]) => saveStored(STORAGE_KEYS.SUBJECTS, data),

  getClassrooms: (): MasterClassroom[] => loadStored(STORAGE_KEYS.CLASSROOMS, INITIAL_CLASSROOMS),
  saveClassrooms: (data: MasterClassroom[]) => saveStored(STORAGE_KEYS.CLASSROOMS, data),

  getDepartments: (): MasterDepartment[] => loadStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS),
  saveDepartments: (data: MasterDepartment[]) => saveStored(STORAGE_KEYS.DEPARTMENTS, data),

  getDesignations: (): MasterDesignation[] => loadStored(STORAGE_KEYS.DESIGNATIONS, INITIAL_DESIGNATIONS),
  saveDesignations: (data: MasterDesignation[]) => saveStored(STORAGE_KEYS.DESIGNATIONS, data),

  getTeachers: (): MasterTeacher[] => loadStored(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS),
  saveTeachers: (data: MasterTeacher[]) => saveStored(STORAGE_KEYS.TEACHERS, data),

  getStaff: (): MasterStaff[] => loadStored(STORAGE_KEYS.STAFF, INITIAL_STAFF),
  saveStaff: (data: MasterStaff[]) => saveStored(STORAGE_KEYS.STAFF, data),

  getDocuments: (): MasterOriginalDocument[] => loadStored(STORAGE_KEYS.DOCUMENTS, INITIAL_ORIGINAL_DOCUMENTS),
  saveDocuments: (data: MasterOriginalDocument[]) => saveStored(STORAGE_KEYS.DOCUMENTS, data),

  getYears: (): MasterAcademicYear[] => loadStored(STORAGE_KEYS.YEARS, INITIAL_ACADEMIC_YEARS),
  saveYears: (data: MasterAcademicYear[]) => saveStored(STORAGE_KEYS.YEARS, data),

  getCountries: (): MasterCountry[] => loadStored(STORAGE_KEYS.COUNTRIES, INITIAL_COUNTRIES),
  saveCountries: (data: MasterCountry[]) => saveStored(STORAGE_KEYS.COUNTRIES, data),

  getStates: (): MasterState[] => loadStored(STORAGE_KEYS.STATES, INITIAL_STATES),
  saveStates: (data: MasterState[]) => saveStored(STORAGE_KEYS.STATES, data),

  getDistricts: (): MasterDistrict[] => loadStored(STORAGE_KEYS.DISTRICTS, INITIAL_DISTRICTS),
  saveDistricts: (data: MasterDistrict[]) => saveStored(STORAGE_KEYS.DISTRICTS, data),

  // Reset all to factory defaults
  resetToDefaults: () => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
