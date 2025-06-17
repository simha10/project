import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { RegisterDtoSchema, LoginDtoSchema, UserRole } from '../dtos/authDto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../dtos/authDto';

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
      const { username, password, role } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({ 
        where: { username },
        select: {
          id: true,
          username: true,
          password: true,
          role: true
        }
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

      if (user.role !== role) {
        return res.status(403).json({ 
          success: false,
          message: 'Role mismatch for this user' 
        });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }
} 