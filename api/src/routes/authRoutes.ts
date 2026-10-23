import { Router, Request, Response } from 'express';
import { trustData } from '../dataStore.js';

export const authRouter = Router();

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'SUPERADMIN' | 'BRANCH_ADMIN_SCHOOL' | 'BRANCH_ADMIN_COLLEGE' | 'TEACHER' | 'ACCOUNTANT' | 'STUDENT';
  branchId?: string;
  branchName?: string;
}

export const registeredUsers: UserAccount[] = [
  {
    id: 'usr-01',
    name: 'Dr. Rajesh Patil',
    email: 'superadmin@trust.edu.in',
    password: 'demo123',
    role: 'SUPERADMIN',
    branchName: 'Trust Central Directorate (All Campuses)',
  },
  {
    id: 'usr-02',
    name: 'Principal Sunita Kulkarni',
    email: 'school.principal@trust.edu.in',
    password: 'demo123',
    role: 'BRANCH_ADMIN_SCHOOL',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
  },
  {
    id: 'usr-03',
    name: 'Director Chef Sanjeev Menon',
    email: 'college.director@trust.edu.in',
    password: 'demo123',
    role: 'BRANCH_ADMIN_COLLEGE',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
  },
  {
    id: 'usr-04',
    name: 'Mrs. Neha Kulkarni',
    email: 'teacher.neha@trust.edu.in',
    password: 'demo123',
    role: 'TEACHER',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
  },
  {
    id: 'usr-05',
    name: 'Chef Arvind Shinde',
    email: 'chef.arvind@trust.edu.in',
    password: 'demo123',
    role: 'TEACHER',
    branchId: 'branch-hm-01',
    branchName: 'Modern College Of Hotel Management And Technology Solapur',
  },
  {
    id: 'usr-06',
    name: 'Mr. Ramesh Accountant',
    email: 'accountant@trust.edu.in',
    password: 'demo123',
    role: 'ACCOUNTANT',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
  },
  {
    id: 'usr-07',
    name: 'Aarav Sharma',
    email: 'student.aarav@trust.edu.in',
    password: 'demo123',
    role: 'STUDENT',
    branchId: 'branch-sch-01',
    branchName: 'Modern Public School And Junior College Bhose',
  },
];

const nameMap: Record<string, string> = {
  SUPERADMIN: 'Dr. Rajesh Patil (Trust Chairman / President)',
  BRANCH_ADMIN_SCHOOL: 'Principal Sunita Kulkarni (School Admin)',
  BRANCH_ADMIN_COLLEGE: 'Director Chef Sanjeev Menon (College Admin)',
  TEACHER: 'Mrs. Neha Kulkarni (Senior Faculty)',
  ACCOUNTANT: 'Mr. Ramesh Accountant (Finance Officer)',
  PARENT: 'Ramesh Sharma (Parent of Aarav Sharma)',
  STUDENT: 'Kabir Verma (Hotel Mgmt Student)',
  BUS_DRIVER: 'Suresh Patil (Route #4 Driver)',
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create New User Account With Role
 *     description: Register a new staff or user with a dedicated role and campus scope.
 */
authRouter.post('/register', (req: Request, res: Response) => {
  const { name, email, password, role, branchId } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required' });
  }

  const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const normalizedRole = String(role).toUpperCase() as UserAccount['role'];
  const branchName = branchId === 'branch-hm-01'
    ? 'Modern College Of Hotel Management And Technology Solapur'
    : 'Modern Public School And Junior College Bhose';

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password,
    role: normalizedRole,
    branchId: branchId || (normalizedRole === 'BRANCH_ADMIN_COLLEGE' ? 'branch-hm-01' : 'branch-sch-01'),
    branchName: normalizedRole === 'SUPERADMIN' ? 'Trust Central Directorate (All Campuses)' : branchName,
  };

  registeredUsers.push(newUser);

  res.status(201).json({
    message: `Account created successfully for ${name} as ${normalizedRole}`,
    token: `demo-jwt-token-for-${newUser.role}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      branchId: newUser.branchId,
      branchName: newUser.branchName,
      trustName: trustData.name,
      allowedWebLogin: true,
      allowedMobileLogin: ['TEACHER', 'PARENT', 'STUDENT', 'BUS_DRIVER'].includes(newUser.role),
    },
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate User
 *     description: Login by credentials or role and obtain role-scoped credentials and permissions.
 */
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, role, branchId } = req.body;

  // 1. Try finding by email
  let matchedUser: UserAccount | undefined;
  if (email) {
    matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  }

  // 2. If no direct user found, check role or infer role from email
  const normalizedRole = matchedUser
    ? matchedUser.role
    : role
    ? String(role).toUpperCase()
    : email && String(email).toLowerCase().includes('teacher')
    ? 'TEACHER'
    : email && String(email).toLowerCase().includes('accountant')
    ? 'ACCOUNTANT'
    : email && String(email).toLowerCase().includes('college')
    ? 'BRANCH_ADMIN_COLLEGE'
    : email && String(email).toLowerCase().includes('school')
    ? 'BRANCH_ADMIN_SCHOOL'
    : email && String(email).toLowerCase().includes('student')
    ? 'STUDENT'
    : 'SUPERADMIN';

  const defaultBranchId = matchedUser?.branchId ||
    branchId ||
    (normalizedRole === 'BRANCH_ADMIN_SCHOOL' || normalizedRole === 'PARENT'
      ? 'branch-sch-01'
      : normalizedRole === 'BRANCH_ADMIN_COLLEGE' || normalizedRole === 'STUDENT'
      ? 'branch-hm-01'
      : undefined);

  const defaultBranchName = matchedUser?.branchName ||
    (normalizedRole === 'SUPERADMIN'
      ? 'Trust Central Directorate (All Campuses)'
      : defaultBranchId === 'branch-hm-01'
      ? 'Modern College Of Hotel Management And Technology Solapur'
      : 'Modern Public School And Junior College Bhose');

  const finalName = matchedUser
    ? matchedUser.name
    : nameMap[normalizedRole] || (email ? String(email).split('@')[0] : 'ERP User');

  res.json({
    message: 'Authentication successful',
    token: `demo-jwt-token-for-${normalizedRole}`,
    user: {
      id: matchedUser?.id || `usr-${Date.now()}`,
      name: finalName,
      email: email || `${normalizedRole.toLowerCase()}@trust.edu.in`,
      role: normalizedRole,
      branchId: defaultBranchId,
      branchName: defaultBranchName,
      trustName: trustData.name,
      allowedWebLogin: ['SUPERADMIN', 'BRANCH_ADMIN_SCHOOL', 'BRANCH_ADMIN_COLLEGE', 'TEACHER', 'ACCOUNTANT', 'STUDENT'].includes(
        normalizedRole
      ),
      allowedMobileLogin: ['TEACHER', 'PARENT', 'STUDENT', 'BUS_DRIVER'].includes(normalizedRole),
    },
  });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get Current Profile
 *     description: Retrieve active user context and permission boundaries.
 */
authRouter.get('/me', (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});
