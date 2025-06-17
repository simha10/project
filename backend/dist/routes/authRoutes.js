"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route
router.post('/login', (req, res) => authController_1.AuthController.login(req, res));
// Protected routes
router.post('/register', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)('SUPERADMIN', 'ADMIN'), (req, res) => authController_1.AuthController.register(req, res));
exports.default = router;
