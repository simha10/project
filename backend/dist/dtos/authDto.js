"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDtoSchema = exports.RegisterDtoSchema = exports.UserRoleEnum = void 0;
const zod_1 = require("zod");
// Define the role enum values
exports.UserRoleEnum = zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']);
// Register DTO schema with strict role validation
exports.RegisterDtoSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(6),
    role: exports.UserRoleEnum,
    assignedWards: zod_1.z.array(zod_1.z.string()).optional()
});
// Login DTO schema
exports.LoginDtoSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
