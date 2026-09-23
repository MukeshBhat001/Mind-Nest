/**
 * Admin Statistics & Metrics Route
 * /api/stats
 */
import { Router, Response } from 'express';
import { dbUsers, dbContent, dbAssessments } from '../models/dbAdapter';
import { protect, requireAdmin, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/overview', protect, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await dbUsers.getAll();
    const contents = await dbContent.getAll();
    const quizResults = await dbAssessments.getAllResults();

    const audioCount = contents.filter((c) => c.type === 'audio').length;
    const videoCount = contents.filter((c) => c.type === 'video').length;
    const articleCount = contents.filter((c) => c.type === 'article').length;
    const previewCount = contents.filter((c) => c.isPreview).length;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalMembers: users.filter((u) => u.role === 'member').length,
        totalAdmins: users.filter((u) => u.role === 'admin').length,
        totalContents: contents.length,
        audioCount,
        videoCount,
        articleCount,
        previewCount,
        totalQuizSubmissions: quizResults.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Could not aggregate system metrics.' });
  }
});

export default router;
