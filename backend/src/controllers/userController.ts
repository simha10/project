import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { registerSchema } from '../dtos/userDto';

const prisma = new PrismaClient();

type UserRole = 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: {
    userId: string;
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

      const { username, password, mobileNumber } = validatedData;
      const creatorRole = req.user.role;

      // Define role hierarchy and permissions
      const allowedByRole: Record<UserRole, UserRole[]> = {
        SUPERADMIN: ["SUPERADMIN", "ADMIN", "SUPERVISOR", "SURVEYOR"],
        ADMIN: ["SUPERVISOR", "SURVEYOR"],
        SUPERVISOR: [],
        SURVEYOR: [],
      };

      // Check if creator has permission to create the requested role
      if (!allowedByRole[creatorRole].includes(req.user.role)) {
        console.log('Forbidden: Insufficient permissions to create role:', req.user.role);
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create users with this role'
        });
      }

      // Check if username already exists
      const existingUser = await prisma.usersMaster.findFirst({
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
      const newUser = await prisma.usersMaster.create({
        data: {
          username,
          password: hashedPassword,
          mobileNumber,
        },
        select: {
          userId: true,
          username: true,
          isCreatedAt: true
        }
      });

      // After creating a user, fetch the roleId from RolePermissionMaster using the role name, then create a UserRoleMapping entry with userId and roleId
      const role = req.user.role;
      const roleId = await prisma.rolePermissionMaster.findFirst({
        where: { roleName: role },
        select: { roleId: true }
      });

      if (!roleId) {
        console.error('Role not found in RolePermissionMaster');
        return res.status(500).json({
          success: false,
          message: 'Role not found in RolePermissionMaster'
        });
      }

      await prisma.userRoleMapping.create({
        data: {
          userId: newUser.userId,
          roleId: roleId.roleId
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

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await prisma.usersMaster.findUnique({
        where: { userId: req.user.userId },
        select: {
          username: true,
          mobileNumber: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
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

      const users = await prisma.usersMaster.findMany({
        // If you want to filter by creator, add logic here if your schema supports it
        select: {
          userId: true,
          username: true,
          isCreatedAt: true
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
