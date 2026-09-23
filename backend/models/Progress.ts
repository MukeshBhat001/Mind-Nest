/**
 * Progress Mongoose Model & Schema
 * Mind Nest - University Web Applications Assignment
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionLogDocument {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'audio' | 'video' | 'article' | 'breathing';
  completedAt: Date;
  durationMinutes: number;
}

export interface IProgressDocument extends Document {
  userId: string;
  favorites: string[];
  completedLessons: string[];
  sessionLogs: ISessionLogDocument[];
  currentStreak: number;
  lastActiveDate: string;
}

const SessionLogSchema = new Schema({
  id: { type: String, required: true },
  contentId: { type: String, required: true },
  contentTitle: { type: String, required: true },
  contentType: { type: String, enum: ['audio', 'video', 'article', 'breathing'], required: true },
  completedAt: { type: Date, default: Date.now },
  durationMinutes: { type: Number, default: 5 },
});

export const ProgressSchema: Schema<IProgressDocument> = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    favorites: {
      type: [String],
      default: [],
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    sessionLogs: {
      type: [SessionLogSchema],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

export const ProgressModel = mongoose.models.Progress || mongoose.model<IProgressDocument>('Progress', ProgressSchema);
