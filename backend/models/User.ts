/**
 * User Mongoose Model & Schema
 * Mind Nest - University Web Applications Assignment
 */
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'guest' | 'member' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must have at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['guest', 'member', 'admin'],
      default: 'member',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
    bio: {
      type: String,
      default: 'Mindfulness practitioner on Mind Nest.',
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password against bcrypt hash
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
