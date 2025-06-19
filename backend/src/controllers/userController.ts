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
      console.log('RegisterUser called with body:', req.body);
      if (!req.user) {
        console.log('Unauthorized: No user in request');
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      let validatedData;
      try {
        validatedData = registerSchema.parse(req.body);
      } catch (validationError: any) {
        console.log('Validation error:', validationError.errors);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationError.errors
        });
      }

      const { username, password, role, phoneNumber } = validatedData;
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
        console.log('Forbidden: Insufficient permissions to create role:', role);
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
        console.log('Username already exists:', username);
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
          phoneNumber,
          createdById: req.user.id
        },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      console.log('User created successfully:', newUser);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });

    } catch (error) {
      console.error('Error in registerUser:', error);
      next(error);
    }
  }

  static async getCreatedUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const users = await prisma.user.findMany({
        where: {
          createdBy: {
            id: req.user.id
          }
        },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true
        }
      });

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error in getCreatedUsers:', error);
      next(error);
    }
  }
}
