/**
 * Content Mongoose Model & Schema
 * Mind Nest - University Web Applications Assignment
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IContentDocument extends Document {
  title: string;
  description: string;
  category: 'Sleep' | 'Focus' | 'Anxiety Relief' | 'Mindfulness';
  type: 'audio' | 'video' | 'article';
  mediaUrl?: string;
  thumbnail: string;
  duration?: number;
  readTime?: string;
  isPreview: boolean;
  author: string;
  contentBody?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ContentSchema: Schema<IContentDocument> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a content title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a brief description'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Sleep', 'Focus', 'Anxiety Relief', 'Mindfulness'],
    },
    type: {
      type: String,
      required: [true, 'Content type is required (audio, video, article)'],
      enum: ['audio', 'video', 'article'],
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    },
    duration: {
      type: Number,
      default: 5,
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: 'Mind Nest Team',
    },
    contentBody: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ContentModel = mongoose.models.Content || mongoose.model<IContentDocument>('Content', ContentSchema);
