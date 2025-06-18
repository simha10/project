import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto, UserRole } from '../dtos/authDto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-token-with-at-least-32-characters-long';

export class AuthService {
  private static generateToken(user: any): string {
    return jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static async register(data: RegisterDto, currentUserRole: UserRole): Promise<{ user: any; token: string }> {
    // Check if current user has permission to register
    if (!['SUPERADMIN', 'ADMIN'].includes(currentUserRole)) {
      console.log('Error: Only SuperAdmin and Admin can register new users');
      throw new Error('Only SuperAdmin and Admin can register new users');
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (existingUser) {
      console.log('Error: Username already exists');
      throw new Error('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with validated role
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
        phoneNumber: data.phoneNumber
      }
    });

    // Generate token
    const token = this.generateToken(user);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token
      }
    });

    return { user, token };
  }

  static async login(data: LoginDto): Promise<{ user: any; token: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token
      }
    });

    return { user, token };
  }

  static async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 