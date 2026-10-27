import { Employee } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-01',
    code: 'EMP-SCH-001',
    name: 'Sunita Kulkarni',
    nameMarathi: 'सुनिता कुलकर्णी',
    role: 'School Principal',
    dept: 'Academics & Administration',
    branch: 'Modern Public School & Jr College Bhose',
    branchId: 'branch-sch-01',
    email: 'principal.school@trustedu.org',
    phone: '+91 98221 00001',
    emergencyContact: '+91 98221 99001',
    bloodGroup: 'O+',
    dob: '1978-05-14',
    joinDate: '2018-06-01',
    validUpto: '2028-05-31',
    address: 'Plot 42, Vasant Vihar, Bhose, Pandharpur, Dist. Solapur - 413315',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '7823-1144-9902',
    pan: 'ABCDE1234F',
    basic: 45000,
    hra: 15000,
    da: 8000,
    special: 7000,
  },
  {
    id: 'emp-02',
    code: 'EMP-HM-002',
    name: 'Chef Sanjeev Menon',
    nameMarathi: 'शेफ संजीव मेनन',
    role: 'Director & Executive Chef',
    dept: 'Culinary Arts & Food Production',
    branch: 'Modern College of HM & Tech Solapur',
    branchId: 'branch-hm-01',
    email: 'director.hm@trustedu.org',
    phone: '+91 98221 00002',
    emergencyContact: '+91 98221 88002',
    bloodGroup: 'A+',
    dob: '1981-09-22',
    joinDate: '2019-06-15',
    validUpto: '2029-06-14',
    address: 'Flat 304, Royal Palms Enclave, Hotgi Road, Solapur - 413006',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '8912-3344-5501',
    pan: 'FGHIJ5678K',
    basic: 60000,
    hra: 20000,
    da: 10000,
    special: 15000,
  },
  {
    id: 'emp-03',
    code: 'EMP-ACC-003',
    name: 'Priya Joshi',
    nameMarathi: 'प्रिया जोशी',
    role: 'Senior Accountant & Bursar',
    dept: 'Finance & Accounts',
    branch: 'Trust Central Office',
    branchId: 'branch-sch-01',
    email: 'accounts@trustedu.org',
    phone: '+91 98221 00003',
    emergencyContact: '+91 98221 77003',
    bloodGroup: 'B+',
    dob: '1986-11-08',
    joinDate: '2020-08-10',
    validUpto: '2027-08-09',
    address: 'B-12, Datta Krupa Colony, Pandharpur, Solapur - 413304',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '5541-8899-2210',
    pan: 'KLMNO9012P',
    basic: 28000,
    hra: 9000,
    da: 4000,
    special: 3000,
  },
  {
    id: 'emp-04',
    code: 'EMP-SCH-004',
    name: 'Rajendra Deshmukh',
    nameMarathi: 'राजेन्द्र देशमुख',
    role: 'PGT Senior Mathematics Faculty',
    dept: 'Academics - Secondary Wing',
    branch: 'Modern Public School & Jr College Bhose',
    branchId: 'branch-sch-01',
    email: 'r.deshmukh@modernschoolbhose.org',
    phone: '+91 98221 00004',
    emergencyContact: '+91 98221 66004',
    bloodGroup: 'O-',
    dob: '1984-03-19',
    joinDate: '2021-06-01',
    validUpto: '2028-05-31',
    address: 'House No. 89, Shivaji Nagar, Bhose, Pandharpur - 413315',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '4412-9901-7723',
    pan: 'PQRSX3456Z',
    basic: 36000,
    hra: 11000,
    da: 5000,
    special: 4000,
  },
  {
    id: 'emp-05',
    code: 'EMP-HM-005',
    name: 'Ananya Roy',
    nameMarathi: 'अनन्या रॉय',
    role: 'Professor - Food & Beverage Management',
    dept: 'Culinary Arts & Hospitality Service',
    branch: 'Modern College of HM & Tech Solapur',
    branchId: 'branch-hm-01',
    email: 'ananya.roy@moderncollegehmtech.org',
    phone: '+91 98221 00005',
    emergencyContact: '+91 98221 55005',
    bloodGroup: 'AB+',
    dob: '1989-07-28',
    joinDate: '2022-01-15',
    validUpto: '2029-01-14',
    address: 'Penthouse 14, Orchid Towers, South Sadar Bazar, Solapur - 413003',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '6623-1189-4450',
    pan: 'UVWXY7890A',
    basic: 42000,
    hra: 14000,
    da: 7000,
    special: 6000,
  },
  {
    id: 'emp-06',
    code: 'EMP-SCH-006',
    name: 'Kavita Shinde',
    nameMarathi: 'कविता शिंदे',
    role: 'TGT Science & Laboratory Instructor',
    dept: 'Academics - Science Dept',
    branch: 'Modern Public School & Jr College Bhose',
    branchId: 'branch-sch-01',
    email: 'kavita.shinde@modernschoolbhose.org',
    phone: '+91 98221 00006',
    emergencyContact: '+91 98221 44006',
    bloodGroup: 'B+',
    dob: '1991-12-05',
    joinDate: '2022-06-10',
    validUpto: '2028-06-09',
    address: 'Sector 4, Near Ganpati Temple, Bhose, Pandharpur - 413315',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '3321-7788-9901',
    pan: 'BCDEF4567G',
    basic: 32000,
    hra: 10000,
    da: 4500,
    special: 3500,
  },
  {
    id: 'emp-07',
    code: 'EMP-FLEET-007',
    name: 'Balasaheb Shinde',
    nameMarathi: 'बाळासाहेब शिंदे',
    role: 'Fleet Manager & Senior Bus Supervisor',
    dept: 'Transport & Safety Services',
    branch: 'Modern Public School & Jr College Bhose',
    branchId: 'branch-sch-01',
    email: 'transport@trustedu.org',
    phone: '+91 98221 00007',
    emergencyContact: '+91 98221 33007',
    bloodGroup: 'O+',
    dob: '1975-04-18',
    joinDate: '2017-05-01',
    validUpto: '2027-04-30',
    address: 'Shinde Wasti, Near Bus Depot, Pandharpur, Solapur - 413304',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '9921-4455-8812',
    pan: 'CDEFG5678H',
    basic: 25000,
    hra: 7000,
    da: 3500,
    special: 2500,
  },
  {
    id: 'emp-08',
    code: 'EMP-HM-008',
    name: 'Vikramaditya Solanki',
    nameMarathi: 'विक्रमादित्य सोलंकी',
    role: 'HOD Front Office & Guest Relations',
    dept: 'Hospitality Administration',
    branch: 'Modern College of HM & Tech Solapur',
    branchId: 'branch-hm-01',
    email: 'v.solanki@moderncollegehmtech.org',
    phone: '+91 98221 00008',
    emergencyContact: '+91 98221 22008',
    bloodGroup: 'A-',
    dob: '1985-02-11',
    joinDate: '2020-11-01',
    validUpto: '2028-10-31',
    address: 'Suite 201, Green Acres, Jule Solapur, Solapur - 413004',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    aadhaarNumber: '4455-6677-8899',
    pan: 'DEFGH6789I',
    basic: 48000,
    hra: 16000,
    da: 8000,
    special: 8000,
  },
];

const LOCAL_STORAGE_KEY = 'trust_staff_employees';

export const StaffService = {
  getEmployees(): Employee[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored employees', e);
    }
    return INITIAL_EMPLOYEES;
  },

  saveEmployees(employees: Employee[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
    } catch (e) {
      console.warn('Failed to save employees to localStorage', e);
    }
  },

  updateEmployeePhoto(id: string, newPhotoUrl: string): Employee[] {
    const list = this.getEmployees();
    const updated = list.map((emp) =>
      emp.id === id ? { ...emp, profilePhotoUrl: newPhotoUrl } : emp
    );
    this.saveEmployees(updated);
    return updated;
  },

  updateEmployee(id: string, partial: Partial<Employee>): Employee[] {
    const list = this.getEmployees();
    const updated = list.map((emp) =>
      emp.id === id ? { ...emp, ...partial } : emp
    );
    this.saveEmployees(updated);
    return updated;
  },
};
