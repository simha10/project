"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Test route to verify userRoutes is loaded
router.get('/test', (req, res) => {
    res.json({ message: 'User routes are working' });
});
// Protected routes - only accessible by SUPERADMIN and ADMIN
router.post('/register', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SUPERADMIN', 'ADMIN'), (req, res, next) => userController_1.UserController.registerUser(req, res, next));
exports.default = router;
