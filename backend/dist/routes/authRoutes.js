"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Public route for login
router.post('/login', (req, res, next) => authController_1.AuthController.login(req, res, next));
exports.default = router;
