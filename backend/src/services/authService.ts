import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto, UserRole } from '../dtos/authDto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-token-with-at-least-32-characters-long';

export class AuthService {
  private static generateToken(user: any): string {
    return jwt.sign(
      { userId: user.userId, role: user.role },
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
    const existingUser = await prisma.usersMaster.findFirst({
      where: { username: data.username }
    });

    if (existingUser) {
      console.log('Error: Username already exists');
      throw new Error('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.usersMaster.create({
      data: {
        username: data.username,
        password: hashedPassword,
        mobileNumber: data.mobileNumber
      }
    });

    // Fetch roleId from RolePermissionMaster
    const roleIdObj = await prisma.rolePermissionMaster.findFirst({
      where: { roleName: currentUserRole },
      select: { roleId: true }
    });
    if (!roleIdObj) throw new Error('Role not found');

    // Create UserRoleMapping entry
    await prisma.userRoleMapping.create({
      data: {
        userId: user.userId,
        roleId: roleIdObj.roleId
      }
    });

    // Generate token
    const token = this.generateToken({ userId: user.userId, role: currentUserRole });

    // Create session (adjust fields as per your Session model)
    await prisma.session.create({
      data: {
        userId: user.userId,
        loginTime: new Date(),
        logoutTime: new Date(),
        isActive: true
      }
    });

    return { user, token };
  }

  static async login(data: LoginDto): Promise<{ user: any; token: string }> {
    // Find user
    const user = await prisma.usersMaster.findFirst({
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

    // Fetch user's role
    const userRoleMapping = await prisma.userRoleMapping.findFirst({
      where: { userId: user.userId },
      include: { role: true }
    });
    const roleName = userRoleMapping?.role?.roleName || 'UNKNOWN';

    // Generate token
    const token = this.generateToken({ userId: user.userId, role: roleName });

    // Create session (adjust fields as per your Session model)
    await prisma.session.create({
      data: {
        userId: user.userId,
        loginTime: new Date(),
        logoutTime: new Date(),
        isActive: true
      }
    });

    return { user, token };
  }

  static async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      const user = await prisma.usersMaster.findUnique({
        where: { userId: decoded.userId }
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