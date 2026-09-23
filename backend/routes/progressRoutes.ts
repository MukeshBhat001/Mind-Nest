/**
 * Member Progress & Tracking Routes
 * /api/progress
 */
import { Router } from 'express';
import { progressController } from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Member protected routes
router.get('/', protect, progressController.getProgress);
router.post('/session', protect, progressController.logSession);
router.post('/favorite/:contentId', protect, progressController.toggleFavorite);

export default router;
