/**
 * Authentication & User Management Controller
 * Mind Nest - University Web Applications Assignment
 */
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbUsers } from '../models/dbAdapter';
import { AuthRequest, generateToken } from '../middleware/authMiddleware';

export const authController = {
  // POST /api/auth/register
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Please fill in all required fields (name, email, password).' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        return;
      }

      const existingUser = await dbUsers.findOneByEmail(email);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
        return;
      }

      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await dbUsers.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'member',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        bio: 'Mindfulness explorer on Mind Nest.',
      });

      const token = generateToken({
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully! Welcome to Mind Nest.',
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          bio: newUser.bio,
        },
      });
    } catch (err: any) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
  },

  // POST /api/auth/login
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Please provide both email and password.' });
        return;
      }

      const user = await dbUsers.findOneByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
        return;
      }

      const token = generateToken({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
  },

  // GET /api/auth/me
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
      }
      const user = await dbUsers.findById(req.user._id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      const { password, ...safeUser } = user;
      res.status(200).json({ success: true, user: safeUser });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Error retrieving profile.' });
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
      }

      const { name, bio, avatar } = req.body;
      const updates: any = {};
      if (name) updates.name = name.trim();
      if (bio !== undefined) updates.bio = bio;
      if (avatar) updates.avatar = avatar;

      const updated = await dbUsers.update(req.user._id, updates);
      if (!updated) {
        res.status(404).json({ success: false, message: 'User could not be updated.' });
        return;
      }

      const { password, ...safeUser } = updated;
      res.status(200).json({ success: true, message: 'Profile updated successfully!', user: safeUser });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
  },

  // GET /api/auth/users (Admin only)
  async getAllUsers(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await dbUsers.getAll();
      res.status(200).json({ success: true, users });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve user roster.' });
    }
  },

  // PUT /api/auth/users/:id/role (Admin only)
  async updateUserRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['member', 'admin'].includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role specified.' });
        return;
      }

      const updated = await dbUsers.update(id, { role });
      if (!updated) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'User role updated successfully.', user: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to update user role.' });
    }
  },

  // DELETE /api/auth/users/:id (Admin only)
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (req.user?._id === id) {
        res.status(400).json({ success: false, message: 'Administrators cannot delete their own active account.' });
        return;
      }

      const success = await dbUsers.delete(id);
      if (!success) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'User account removed.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
  },
};
