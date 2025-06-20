"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.RegisterDtoSchema = exports.UserRoleEnum = void 0;
const zod_1 = require("zod");
// Define the role enum values
exports.UserRoleEnum = zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']);
// Register DTO schema with strict role validation
exports.RegisterDtoSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(6),
    mobileNumber: zod_1.z.string().min(10).max(15),
});
// Login DTO schema
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
