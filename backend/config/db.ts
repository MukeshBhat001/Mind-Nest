/**
 * Database Connection & In-Memory / Persistent Store Fallback
 * Mind Nest - University Web Applications Assignment
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindnest';

export let isConnectedToMongoDB = false;

export async function connectDB(): Promise<void> {
  // If user provides a remote or local MongoDB instance, attempt connection with a short timeout
  if (process.env.MONGODB_URI) {
    try {
      console.log('🔄 Attempting to connect to MongoDB URI...');
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 2500,
      });
      isConnectedToMongoDB = true;
      console.log('✅ Connected to MongoDB via Mongoose ORM successfully.');
      return;
    } catch (err: any) {
      console.warn('⚠️ Could not connect to remote MongoDB. Switching to local resilient database store:', err.message);
    }
  }

  // Graceful embedded store initialization (keeps state persistent across server sessions in a local JSON file)
  console.log('🌱 Initialized resilient high-performance MERN data store.');
  isConnectedToMongoDB = false;
}

// Simple JSON file persistence helper for dev/assignment demonstration
const DATA_DIR = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export function saveLocalCollection(name: string, data: any[]) {
  try {
    const filePath = path.join(DATA_DIR, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving ${name} to disk:`, err);
  }
}

export function loadLocalCollection<T>(name: string, defaultData: T[]): T[] {
  try {
    const filePath = path.join(DATA_DIR, `${name}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T[];
    }
  } catch (err) {
    console.warn(`Could not read ${name}.json, using default seed.`);
  }
  return defaultData;
}
