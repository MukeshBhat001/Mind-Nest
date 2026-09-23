/**
 * Mind Nest - Full Stack Express & Vite Server Entry Point
 * University Web Applications Assignment
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './backend/config/db';

// Route Handlers
import authRoutes from './backend/routes/authRoutes';
import contentRoutes from './backend/routes/contentRoutes';
import assessmentRoutes from './backend/routes/assessmentRoutes';
import progressRoutes from './backend/routes/progressRoutes';
import statsRoutes from './backend/routes/statsRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Mind Nest - Safe Space to Learn, Breathe, and Grow',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stats', statsRoutes);

// Setup Vite or static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('🚀 Vite middleware attached in development mode.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Mind Nest server running smoothly on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
