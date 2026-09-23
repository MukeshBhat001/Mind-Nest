/**
 * Content Management Routes
 * /api/content
 */
import { Router } from 'express';
import { contentController } from '../controllers/contentController';
import { protect, requireAdmin, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public / Guest preview accessible with optional auth
router.get('/', optionalAuth, contentController.getAllContent);
router.get('/:id', optionalAuth, contentController.getContentById);

// Admin CRUD routes
router.post('/', protect, requireAdmin, contentController.createContent);
router.put('/:id', protect, requireAdmin, contentController.updateContent);
router.delete('/:id', protect, requireAdmin, contentController.deleteContent);

export default router;
