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
                const { username, password, mobileNumber } = validatedData;
                const creatorRole = req.user.role;
                // Define role hierarchy and permissions
                const allowedByRole = {
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
                const existingUser = yield prisma.usersMaster.findFirst({
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
                const newUser = yield prisma.usersMaster.create({
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
                const roleId = yield prisma.rolePermissionMaster.findFirst({
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
                yield prisma.userRoleMapping.create({
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
            }
            catch (error) {
                console.error('Error in registerUser:', error);
                next(error);
            }
        });
    }
    static getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                const user = yield prisma.usersMaster.findUnique({
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
            }
            catch (error) {
                console.error('Error in getProfile:', error);
                next(error);
            }
        });
    }
    static getCreatedUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                const users = yield prisma.usersMaster.findMany({
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
            }
            catch (error) {
                console.error('Error in getCreatedUsers:', error);
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
