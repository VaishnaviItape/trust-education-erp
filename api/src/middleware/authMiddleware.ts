import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: string;
  branchId?: string; // Optional for multi-branch superadmins
  trustName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const roleNames: Record<string, string> = {
  SUPERADMIN: 'Dr. Rajesh Patil (Trust Chairman)',
  BRANCH_ADMIN_SCHOOL: 'Principal Sunita Kulkarni',
  BRANCH_ADMIN_COLLEGE: 'Director Chef Sanjeev Menon',
  TEACHER: 'Chef Sanjeev Menon',
  STUDENT: 'Kabir Verma (Hotel Mgmt)',
  BUS_DRIVER: 'Suresh Patil (Bus Driver)',
  DRIVER: 'Suresh Patil (Bus Driver)',
};

/**
 * Parses authentication token / headers for demo and production.
 * Allows role specification via Authorization header (Bearer demo-jwt-token-for-ROLE)
 * or X-User-Role header for rapid developer and Swagger UI testing.
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const roleHeader = req.headers['x-user-role'] as string;
  const branchHeader = req.headers['x-branch-id'] as string;

  let role = roleHeader || 'SUPERADMIN';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const match = token.match(/demo-jwt-token-for-([A-Z_]+)/);
    if (match) {
      role = match[1];
    }
  }

  const defaultBranch = role.includes('SCHOOL')
    ? 'branch-sch-01'
    : role.includes('COLLEGE')
    ? 'branch-hm-01'
    : undefined;

  // Assign user context
  req.user = {
    id: `user-${role.toLowerCase()}`,
    name: roleNames[role] || 'Ramesh Sharma (Parent)',
    role,
    branchId: branchHeader || defaultBranch,
    trustName: 'Zep Foundation Bhose',
  };

  next();
};

/**
 * Strict branch isolation middleware:
 * Ensures Branch Admins cannot view or modify data of another branch.
 * If School Admin attempts to access College resources, or vice-versa, returns 403 Forbidden.
 */
export const enforceBranchIsolation = (req: Request, res: Response, next: NextFunction) => {
  const adminBranch = (req.headers['x-branch-id'] as string) || req.user?.branchId;
  const targetBranch = (req.query.branchId as string) || req.body?.branchId;

  if (!adminBranch && !targetBranch) {
    return res.status(400).json({
      error: 'Branch identification required. Please provide X-Branch-Id header or branchId parameter.',
    });
  }

  // If both are specified, ensure they strictly match
  if (adminBranch && targetBranch && adminBranch !== targetBranch) {
    return res.status(403).json({
      error: 'Access Denied: Strict branch isolation in effect. You cannot access ledgers or students of another branch.',
      adminBranch,
      attemptedBranch: targetBranch,
    });
  }

  next();
};
