/**
 * JWT Authentication & Role Authorization Middleware
 * Mind Nest - University Web Applications Assignment
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbUsers } from '../models/dbAdapter';

const JWT_SECRET = process.env.JWT_SECRET || 'mindnest_jwt_super_secret_session_key_2026';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'guest' | 'member' | 'admin';
    avatar?: string;
  };
}

export function generateToken(payload: { _id: string; email: string; role: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please log in to access this feature.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; email: string; role: string; name: string };
    const user = await dbUsers.findById(decoded._id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      return;
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token. Please log in again.' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    return;
  }
  next();
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; email: string; role: string; name: string };
      const user = await dbUsers.findById(decoded._id);
      if (user) {
        req.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
      }
    } catch {
      // Guest fallback, proceed without error
    }
  }
  next();
}
