"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    mobileNumber: zod_1.z.string().min(10, "Mobile number is required"),
});
