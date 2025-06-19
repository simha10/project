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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authDto_1 = require("../dtos/authDto");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const validatedData = authDto_1.RegisterDtoSchema.parse(req.body);
                const currentUserRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
                if (!currentUserRole) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const result = yield authService_1.AuthService.register(validatedData, currentUserRole);
                res.status(201).json(result);
            }
            catch (error) {
                if (error.name === 'ZodError') {
                    res.status(400).json({ error: error.errors });
                    return;
                }
                res.status(400).json({ error: error.message });
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, role } = authDto_1.loginSchema.parse(req.body);
                const user = yield prisma.user.findUnique({
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
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
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
                const token = jsonwebtoken_1.default.sign({
                    userId: user.id,
                    role: user.role
                }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
