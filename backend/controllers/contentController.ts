/**
 * Content Management Controller (Audio, Video, Articles)
 * Mind Nest - University Web Applications Assignment
 */
import { Response } from 'express';
import { dbContent } from '../models/dbAdapter';
import { AuthRequest } from '../middleware/authMiddleware';

export const contentController = {
  // GET /api/content
  async getAllContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, type, search } = req.query as {
        category?: string;
        type?: string;
        search?: string;
      };

      const isRegistered = !!req.user;
      const allItems = await dbContent.getAll({ category, type, search });

      // Guests can see all items in catalogue with metadata, but non-preview items are flagged
      const sanitized = allItems.map((item) => {
        if (!isRegistered && !item.isPreview) {
          return {
            ...item,
            isLockedForGuest: true,
            // Provide snippet for guests
            contentBody: item.contentBody ? item.contentBody.slice(0, 180) + '... (Sign up free to unlock full lesson)' : '',
            mediaUrl: undefined, // Hide stream URL from guest for premium items
          };
        }
        return {
          ...item,
          isLockedForGuest: false,
        };
      });

      res.status(200).json({
        success: true,
        count: sanitized.length,
        contents: sanitized,
      });
    } catch (err: any) {
      console.error('Fetch content error:', err);
      res.status(500).json({ success: false, message: 'Failed to load content catalogue.' });
    }
  },

  // GET /api/content/:id
  async getContentById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await dbContent.findById(id);

      if (!item) {
        res.status(404).json({ success: false, message: 'Mindfulness content not found.' });
        return;
      }

      const isRegistered = !!req.user;
      if (!isRegistered && !item.isPreview) {
        res.status(403).json({
          success: false,
          isLocked: true,
          message: 'This guided wellness exercise is exclusive to registered Mind Nest members. Please log in or create a free account to unlock it.',
          previewSnippet: {
            title: item.title,
            description: item.description,
            category: item.category,
            type: item.type,
            thumbnail: item.thumbnail,
          },
        });
        return;
      }

      res.status(200).json({ success: true, content: item });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Error retrieving lesson content.' });
    }
  },

  // POST /api/content (Admin CRUD - Create)
  async createContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description, category, type, mediaUrl, thumbnail, duration, readTime, isPreview, author, contentBody } = req.body;

      if (!title || !description || !category || !type) {
        res.status(400).json({
          success: false,
          message: 'Please provide required content fields: title, description, category, and type.',
        });
        return;
      }

      const newContent = await dbContent.create({
        title: title.trim(),
        description: description.trim(),
        category,
        type,
        mediaUrl: mediaUrl || '',
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
        duration: duration ? Number(duration) : 5,
        readTime: readTime || '4 min read',
        isPreview: Boolean(isPreview),
        author: author ? author.trim() : (req.user?.name || 'Mind Nest Lead Instructor'),
        contentBody: contentBody || '',
      });

      res.status(201).json({
        success: true,
        message: 'Mindfulness resource successfully published to library.',
        content: newContent,
      });
    } catch (err: any) {
      console.error('Create content error:', err);
      res.status(500).json({ success: false, message: 'Failed to create new wellness content.' });
    }
  },

  // PUT /api/content/:id (Admin CRUD - Update)
  async updateContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = await dbContent.update(id, updates);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Content resource not found for update.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Content updated successfully.',
        content: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to update content.' });
    }
  },

  // DELETE /api/content/:id (Admin CRUD - Delete)
  async deleteContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const removed = await dbContent.delete(id);

      if (!removed) {
        res.status(404).json({ success: false, message: 'Content item not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Content successfully deleted from Mind Nest library.',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to delete content.' });
    }
  },
};
