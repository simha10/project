import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Protected routes - only accessible by SUPERADMIN and ADMIN
router.post(
  '/register',
  authenticate,
  authorizeRoles('SUPERADMIN', 'ADMIN'),
  (req, res, next) => UserController.registerUser(req, res, next)
);

export default router; 