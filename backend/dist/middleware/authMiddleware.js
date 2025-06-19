"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-token-with-at-least-32-characters-long';
// JWT Authentication Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
// RBAC Role Authorization Middleware
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
            return;
        }
        next();
    };
}
