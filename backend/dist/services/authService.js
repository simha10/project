"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-token-with-at-least-32-characters-long';
class AuthService {
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    }
    static register(data, currentUserRole) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if current user has permission to register
            if (!['SUPERADMIN', 'ADMIN'].includes(currentUserRole)) {
                throw new Error('Only SuperAdmin and Admin can register new users');
            }
            // Check if username already exists
            const existingUser = yield prisma.user.findUnique({
                where: { username: data.username }
            });
            if (existingUser) {
                throw new Error('Username already exists');
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            // Create user with validated role
            const user = yield prisma.user.create({
                data: {
                    username: data.username,
                    password: hashedPassword,
                    role: data.role,
                    assignedWards: data.assignedWards || []
                }
            });
            // Generate token
            const token = this.generateToken(user);
            // Create session
            yield prisma.session.create({
                data: {
                    userId: user.id,
                    token
                }
            });
            return { user, token };
        });
    }
    static login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user
            const user = yield prisma.user.findUnique({
                where: { username: data.username }
            });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Verify password
            const validPassword = yield bcrypt_1.default.compare(data.password, user.password);
            if (!validPassword) {
                throw new Error('Invalid credentials');
            }
            // Generate token
            const token = this.generateToken(user);
            // Create session
            yield prisma.session.create({
                data: {
                    userId: user.id,
                    token
                }
            });
            return { user, token };
        });
    }
    static validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const user = yield prisma.user.findUnique({
                    where: { id: decoded.userId }
                });
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            }
            catch (error) {
                throw new Error('Invalid token');
            }
        });
    }
}
exports.AuthService = AuthService;
