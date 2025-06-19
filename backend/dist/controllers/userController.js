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
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userDto_1 = require("../dtos/userDto");
const prisma = new client_1.PrismaClient();
class UserController {
    static registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    validatedData = userDto_1.registerSchema.parse(req.body);
                }
                catch (validationError) {
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
                const allowedByRole = {
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
                const existingUser = yield prisma.user.findUnique({
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
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Create new user
                const newUser = yield prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword,
                        role,
                        phoneNumber
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
            }
            catch (error) {
                console.error('Error in registerUser:', error);
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
