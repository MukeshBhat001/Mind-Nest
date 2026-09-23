/**
 * Universal Database Adapter
 * Seamlessly handles Mongoose ORM models if MongoDB is active,
 * or persistent local store if running in standalone dev mode.
 */
import {
  IUser,
  IContent,
  IQuizTemplate,
  IQuizResult,
  IProgress,
  initialUsers,
  initialContents,
  initialQuizzes,
  initialQuizResults,
  initialProgress,
} from '../data/seedData';
import { loadLocalCollection, saveLocalCollection, isConnectedToMongoDB } from '../config/db';
import { UserModel } from './User';
import { ContentModel } from './Content';
import { QuizResultModel } from './QuizResult';
import { ProgressModel } from './Progress';

// In-memory / persistent collections
let usersStore: IUser[] = loadLocalCollection<IUser>('users', initialUsers);
let contentStore: IContent[] = loadLocalCollection<IContent>('contents', initialContents);
let quizTemplatesStore: IQuizTemplate[] = loadLocalCollection<IQuizTemplate>('quizzes', initialQuizzes);
let quizResultsStore: IQuizResult[] = loadLocalCollection<IQuizResult>('quiz_results', initialQuizResults);
let progressStore: IProgress[] = loadLocalCollection<IProgress>('progress', initialProgress);

// ================= USER OPERATIONS =================
export const dbUsers = {
  async findOneByEmail(email: string): Promise<IUser | null> {
    if (isConnectedToMongoDB) {
      const u = await UserModel.findOne({ email: email.toLowerCase() }).lean();
      return u ? ({ ...u, _id: String(u._id) } as any) : null;
    }
    const found = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found ? { ...found } : null;
  },

  async findById(id: string): Promise<IUser | null> {
    if (isConnectedToMongoDB) {
      const u = await UserModel.findById(id).lean();
      return u ? ({ ...u, _id: String(u._id) } as any) : null;
    }
    const found = usersStore.find((u) => u._id === id);
    return found ? { ...found } : null;
  },

  async getAll(): Promise<Omit<IUser, 'password'>[]> {
    if (isConnectedToMongoDB) {
      const list = await UserModel.find().select('-password').lean();
      return list.map((u) => ({ ...u, _id: String(u._id) } as any));
    }
    return usersStore.map(({ password, ...rest }) => rest);
  },

  async create(user: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    const newUser: IUser = {
      ...user,
      _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };

    if (isConnectedToMongoDB) {
      const created = await UserModel.create(newUser);
      return { ...created.toObject(), _id: String(created._id) };
    }

    usersStore.push(newUser);
    saveLocalCollection('users', usersStore);
    return newUser;
  },

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (isConnectedToMongoDB) {
      const updated = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return updated ? ({ ...updated, _id: String(updated._id) } as any) : null;
    }

    const idx = usersStore.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    usersStore[idx] = { ...usersStore[idx], ...updates };
    saveLocalCollection('users', usersStore);
    return usersStore[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (isConnectedToMongoDB) {
      const res = await UserModel.findByIdAndDelete(id);
      return !!res;
    }
    const before = usersStore.length;
    usersStore = usersStore.filter((u) => u._id !== id);
    saveLocalCollection('users', usersStore);
    return usersStore.length < before;
  },
};

// ================= CONTENT CRUD OPERATIONS =================
export const dbContent = {
  async getAll(filters?: { category?: string; type?: string; search?: string; isPreview?: boolean }): Promise<IContent[]> {
    if (isConnectedToMongoDB) {
      const query: any = {};
      if (filters?.category && filters.category !== 'All') query.category = filters.category;
      if (filters?.type && filters.type !== 'All') query.type = filters.type;
      if (filters?.isPreview !== undefined) query.isPreview = filters.isPreview;
      if (filters?.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
        ];
      }
      const list = await ContentModel.find(query).sort({ createdAt: -1 }).lean();
      return list.map((item) => ({ ...item, _id: String(item._id) } as any));
    }

    let items = [...contentStore];
    if (filters?.category && filters.category !== 'All') {
      items = items.filter((i) => i.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters?.type && filters.type !== 'All') {
      items = items.filter((i) => i.type.toLowerCase() === filters.type?.toLowerCase());
    }
    if (filters?.isPreview !== undefined) {
      items = items.filter((i) => i.isPreview === filters.isPreview);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findById(id: string): Promise<IContent | null> {
    if (isConnectedToMongoDB) {
      const item = await ContentModel.findById(id).lean();
      return item ? ({ ...item, _id: String(item._id) } as any) : null;
    }
    const found = contentStore.find((c) => c._id === id);
    return found ? { ...found } : null;
  },

  async create(content: Omit<IContent, '_id' | 'createdAt'>): Promise<IContent> {
    const newContent: IContent = {
      ...content,
      _id: 'cnt_' + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };

    if (isConnectedToMongoDB) {
      const doc = await ContentModel.create(newContent);
      return { ...doc.toObject(), _id: String(doc._id) };
    }

    contentStore.unshift(newContent);
    saveLocalCollection('contents', contentStore);
    return newContent;
  },

  async update(id: string, updates: Partial<IContent>): Promise<IContent | null> {
    if (isConnectedToMongoDB) {
      const updated = await ContentModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return updated ? ({ ...updated, _id: String(updated._id) } as any) : null;
    }

    const idx = contentStore.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    contentStore[idx] = { ...contentStore[idx], ...updates };
    saveLocalCollection('contents', contentStore);
    return contentStore[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (isConnectedToMongoDB) {
      const res = await ContentModel.findByIdAndDelete(id);
      return !!res;
    }

    const before = contentStore.length;
    contentStore = contentStore.filter((c) => c._id !== id);
    saveLocalCollection('contents', contentStore);
    return contentStore.length < before;
  },
};

// ================= QUIZ & ASSESSMENT OPERATIONS =================
export const dbAssessments = {
  async getQuizzes(forGuest = false): Promise<IQuizTemplate[]> {
    if (forGuest) {
      return quizTemplatesStore.filter((q) => q.isPreview);
    }
    return quizTemplatesStore;
  },

  async getQuizById(quizId: string): Promise<IQuizTemplate | null> {
    return quizTemplatesStore.find((q) => q._id === quizId) || null;
  },

  async saveQuizResult(result: Omit<IQuizResult, '_id' | 'date'>): Promise<IQuizResult> {
    const newResult: IQuizResult = {
      ...result,
      _id: 'qres_' + Date.now() + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString(),
    };

    if (isConnectedToMongoDB) {
      const created = await QuizResultModel.create(newResult);
      return { ...created.toObject(), _id: String(created._id) };
    }

    quizResultsStore.unshift(newResult);
    saveLocalCollection('quiz_results', quizResultsStore);
    return newResult;
  },

  async getUserResults(userId: string): Promise<IQuizResult[]> {
    if (isConnectedToMongoDB) {
      const list = await QuizResultModel.find({ userId }).sort({ createdAt: -1 }).lean();
      return list.map((item) => ({ ...item, _id: String(item._id) } as any));
    }
    return quizResultsStore.filter((r) => r.userId === userId);
  },

  async getAllResults(): Promise<IQuizResult[]> {
    if (isConnectedToMongoDB) {
      const list = await QuizResultModel.find().sort({ createdAt: -1 }).lean();
      return list.map((item) => ({ ...item, _id: String(item._id) } as any));
    }
    return quizResultsStore;
  },
};

// ================= PROGRESS & USER HISTORY =================
export const dbProgress = {
  async getByUserId(userId: string): Promise<IProgress> {
    if (isConnectedToMongoDB) {
      let prog = await ProgressModel.findOne({ userId }).lean();
      if (!prog) {
        const created = await ProgressModel.create({
          userId,
          favorites: [],
          completedLessons: [],
          sessionLogs: [],
          currentStreak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
        });
        prog = created.toObject();
      }
      return { ...prog, _id: String(prog._id) } as any;
    }

    let userProg = progressStore.find((p) => p.userId === userId);
    if (!userProg) {
      userProg = {
        _id: 'prg_' + Date.now(),
        userId,
        favorites: [],
        completedLessons: [],
        sessionLogs: [],
        currentStreak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      progressStore.push(userProg);
      saveLocalCollection('progress', progressStore);
    }
    return userProg;
  },

  async toggleFavorite(userId: string, contentId: string): Promise<string[]> {
    const prog = await this.getByUserId(userId);
    const hasFav = prog.favorites.includes(contentId);
    const newFavorites = hasFav
      ? prog.favorites.filter((id) => id !== contentId)
      : [...prog.favorites, contentId];

    if (isConnectedToMongoDB) {
      await ProgressModel.findOneAndUpdate({ userId }, { favorites: newFavorites });
      return newFavorites;
    }

    prog.favorites = newFavorites;
    saveLocalCollection('progress', progressStore);
    return newFavorites;
  },

  async logSession(
    userId: string,
    contentId: string,
    contentTitle: string,
    contentType: 'audio' | 'video' | 'article' | 'breathing',
    durationMinutes: number
  ): Promise<IProgress> {
    const prog = await this.getByUserId(userId);
    const today = new Date().toISOString().split('T')[0];

    // Calculate streak
    let streak = prog.currentStreak || 1;
    if (prog.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (prog.lastActiveDate === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
    }

    const newLog = {
      id: 'log_' + Date.now(),
      contentId,
      contentTitle,
      contentType,
      completedAt: new Date().toISOString(),
      durationMinutes: durationMinutes || 5,
    };

    const completed = prog.completedLessons.includes(contentId)
      ? prog.completedLessons
      : [...prog.completedLessons, contentId];

    const updatedLogs = [newLog, ...prog.sessionLogs];

    if (isConnectedToMongoDB) {
      const updated = await ProgressModel.findOneAndUpdate(
        { userId },
        {
          sessionLogs: updatedLogs,
          completedLessons: completed,
          currentStreak: streak,
          lastActiveDate: today,
        },
        { new: true }
      ).lean();
      return { ...updated, _id: String(updated?._id) } as any;
    }

    prog.sessionLogs = updatedLogs;
    prog.completedLessons = completed;
    prog.currentStreak = streak;
    prog.lastActiveDate = today;
    saveLocalCollection('progress', progressStore);
    return prog;
  },
};
