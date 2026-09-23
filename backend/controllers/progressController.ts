/**
 * Member Progress & Activity Tracking Controller
 * Mind Nest - University Web Applications Assignment
 */
import { Response } from 'express';
import { dbProgress, dbContent } from '../models/dbAdapter';
import { AuthRequest } from '../middleware/authMiddleware';

export const progressController = {
  // GET /api/progress
  async getProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const progress = await dbProgress.getByUserId(req.user._id);

      // Populate favorite items details
      const allContent = await dbContent.getAll();
      const favoriteItems = allContent.filter((c) => progress.favorites.includes(c._id));

      res.status(200).json({
        success: true,
        progress: {
          ...progress,
          favoriteItems,
        },
      });
    } catch (err: any) {
      console.error('Get progress error:', err);
      res.status(500).json({ success: false, message: 'Could not load member progress.' });
    }
  },

  // POST /api/progress/session
  async logSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Please log in to record session progress.' });
        return;
      }

      const { contentId, contentTitle, contentType, durationMinutes } = req.body;

      if (!contentId || !contentTitle || !contentType) {
        res.status(400).json({ success: false, message: 'Missing session information.' });
        return;
      }

      const updatedProgress = await dbProgress.logSession(
        req.user._id,
        contentId,
        contentTitle,
        contentType,
        Number(durationMinutes) || 5
      );

      res.status(200).json({
        success: true,
        message: 'Mindfulness session recorded successfully! Keep up your streak.',
        progress: updatedProgress,
      });
    } catch (err: any) {
      console.error('Session log error:', err);
      res.status(500).json({ success: false, message: 'Could not record mindfulness session.' });
    }
  },

  // POST /api/progress/favorite/:contentId
  async toggleFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Please log in to save exercises to your favorites.' });
        return;
      }

      const { contentId } = req.params;
      const content = await dbContent.findById(contentId);
      if (!content) {
        res.status(404).json({ success: false, message: 'Content item not found.' });
        return;
      }

      const updatedFavorites = await dbProgress.toggleFavorite(req.user._id, contentId);
      const isFavorited = updatedFavorites.includes(contentId);

      res.status(200).json({
        success: true,
        isFavorited,
        favorites: updatedFavorites,
        message: isFavorited ? 'Added to your personal favorites.' : 'Removed from your favorites.',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to update favorites.' });
    }
  },
};
