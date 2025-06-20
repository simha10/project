import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { RegisterDtoSchema, loginSchema, UserRole } from '../dtos/authDto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = RegisterDtoSchema.parse(req.body);
      const currentUserRole = req.user?.role as UserRole;

      if (!currentUserRole) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await AuthService.register(validatedData, currentUserRole);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = loginSchema.parse(req.body);

      const user = await prisma.usersMaster.findFirst({
        where: { username }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const roleMapping = await prisma.userRoleMapping.findFirst({
        where: { userId: user.userId },
        select: { roleId: true }
      });

      if (!roleMapping) {
        return res.status(500).json({
          success: false,
          message: 'Role mapping not found for this user'
        });
      }

      const rolePermission = await prisma.rolePermissionMaster.findFirst({
        where: { roleId: roleMapping.roleId },
        select: { roleName: true }
      });

      if (!rolePermission) {
        return res.status(500).json({
          success: false,
          message: 'Role permission not found for this role'
        });
      }

      const token = jwt.sign(
        {
          userId: user.userId,
          role: rolePermission.roleName
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            userId: user.userId,
            username: user.username,
            role: rolePermission.roleName
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }
} 