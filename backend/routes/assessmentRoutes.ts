/**
 * Self-Assessment & Quiz Routes
 * /api/assessment
 */
import { Router } from 'express';
import { assessmentController } from '../controllers/assessmentController';
import { protect, requireAdmin, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Assessment templates (guest or member)
router.get('/quizzes', optionalAuth, assessmentController.getQuizzes);
router.get('/quizzes/:id', optionalAuth, assessmentController.getQuizById);

// Submit quiz (dynamic scoring, saves if logged in)
router.post('/submit', optionalAuth, assessmentController.submitQuiz);

// Member quiz history
router.get('/history', protect, assessmentController.getMyHistory);

// Admin aggregate reports
router.get('/admin/results', protect, requireAdmin, assessmentController.getAllResultsAdmin);

export default router;
