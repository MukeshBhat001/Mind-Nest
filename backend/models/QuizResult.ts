/**
 * QuizResult Mongoose Model & Schema
 * Mind Nest - University Web Applications Assignment
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizResultDocument extends Document {
  userId: string;
  userEmail: string;
  quizId: string;
  quizTitle: string;
  totalScore: number;
  maxScore: number;
  stressLevel: string;
  recommendations: string[];
  recommendedCategory: string;
  createdAt: Date;
}

export const QuizResultSchema: Schema<IQuizResultDocument> = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
    quizTitle: {
      type: String,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    stressLevel: {
      type: String,
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    recommendedCategory: {
      type: String,
      default: 'Mindfulness',
    },
  },
  {
    timestamps: true,
  }
);

export const QuizResultModel = mongoose.models.QuizResult || mongoose.model<IQuizResultDocument>('QuizResult', QuizResultSchema);
