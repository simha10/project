import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Public route for login
router.post('/login', (req: Request, res: Response, next: NextFunction) => 
  AuthController.login(req, res, next)
);

export default router;
