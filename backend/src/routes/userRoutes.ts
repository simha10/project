import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Test route to verify userRoutes is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working' });
});

// Protected routes - only accessible by SUPERADMIN and ADMIN
router.post(
  '/register',
  authenticate,
  authorizeRoles('SUPERADMIN', 'ADMIN'),
  (req, res, next) => UserController.registerUser(req, res, next)
);

export default router;
