"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const surveyController_1 = require("../controllers/surveyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Survey sync endpoint - only accessible by SURVEYOR role
router.post('/sync', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SURVEYOR'), (req, res) => surveyController_1.SurveyController.syncSurvey(req, res));
exports.default = router;
