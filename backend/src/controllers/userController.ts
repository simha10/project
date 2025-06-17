import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { registerSchema } from '../dtos/userDto';

const prisma = new PrismaClient();

type UserRole = 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export class UserController {
  static async registerUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { username, password, role } = registerSchema.parse(req.body);
      const creatorRole = req.user.role;

      // Define role hierarchy and permissions
      const allowedByRole: Record<UserRole, UserRole[]> = {
        SUPERADMIN: ["SUPERADMIN", "ADMIN", "SUPERVISOR", "SURVEYOR"],
        ADMIN: ["SUPERVISOR", "SURVEYOR"],
        SUPERVISOR: [],
        SURVEYOR: [],
      };

      // Check if creator has permission to create the requested role
      if (!allowedByRole[creatorRole].includes(role)) {
        return res.status(403).json({ 
          success: false,
          message: 'You do not have permission to create users with this role' 
        });
      }

      // Check if username already exists
      const existingUser = await prisma.user.findUnique({ 
        where: { username } 
      });

      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Username already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });

    } catch (error) {
      next(error);
    }
  }
} 