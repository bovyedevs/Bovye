import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import goalsRoutes from './routes/goals.js';
import roadmapRoutes from './routes/roadmap.js';
import toolkitRoutes from './routes/toolkit.js';
import notificationsRoutes from './routes/notifications.js';
import learningRoutes from './routes/learning.js';
import usersRoutes from './routes/users.js';
import coursesRoutes from './routes/courses.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-this-to-a-secure-random-string-in-production') {
  console.error('CRITICAL: JWT_SECRET must be set to a secure random string in .env');
  process.exit(1);
}

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost') === false && !process.env.DATABASE_URL.includes('supabase')) {
  console.warn('WARNING: DATABASE_URL may not be configured correctly');
}

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Relaxed for development
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000, // Relaxed for development
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

app.use(generalLimiter);
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/toolkit', toolkitRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/courses', coursesRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Bovye server running on http://localhost:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the other process or change PORT in .env`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});
