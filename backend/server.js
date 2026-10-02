import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import actorRoutes from './routes/actorRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import tmdbRoutes from './routes/tmdbRoutes.js';
import { seedInitialDataIfEmpty } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection & Auto-Seed
connectDB().then(async () => {
  await seedInitialDataIfEmpty();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/tmdb', tmdbRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: '🎬 CineSphere API is running smoothly via Express',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// 404 Handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Serve frontend static build if present (Unified Express full-stack serving)
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // SPA fallback for all non-API GET routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('🎬 CineSphere Express Backend is active. To serve frontend directly from Express, run "npm run build" in frontend directory.');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🎬 CineSphere Express Server active on http://localhost:${PORT}`);
});

export default app;

