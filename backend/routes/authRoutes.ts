/**
 * Authentication & User Routes
 * /api/auth
 */
import { Router } from 'express';
import { authController } from '../controllers/authController';
import { protect, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Member routes
router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);

// Admin Protected routes
router.get('/users', protect, requireAdmin, authController.getAllUsers);
router.put('/users/:id/role', protect, requireAdmin, authController.updateUserRole);
router.delete('/users/:id', protect, requireAdmin, authController.deleteUser);

export default router;
