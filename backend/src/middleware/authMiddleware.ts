import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../dtos/authDto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-token-with-at-least-32-characters-long';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
        [key: string]: any;
      };
    }
  }
}

// JWT Authentication Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// RBAC Role Authorization Middleware
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: No user found' });
      return;
    }
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
      return;
    }
    next();
  };
} 