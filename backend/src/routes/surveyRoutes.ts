import { Router } from 'express';
import { SurveyController } from '../controllers/surveyController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../dtos/authDto';

const router = Router();

// Survey sync endpoint - only accessible by SURVEYOR role
router.post(
  '/sync',
  authenticate,
  authorizeRoles('SURVEYOR'),
  (req, res) => SurveyController.syncSurvey(req, res)
);

export default router; 