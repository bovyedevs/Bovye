import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { learningProgressSchema } from '../lib/zod.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const progress = await prisma.learningProgress.findMany({
      where: { userId: req.userId },
    });
    res.json({ progress });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { trackId, resourceId, completed } = learningProgressSchema.parse(req.body);
    const progress = await prisma.learningProgress.upsert({
      where: { userId_trackId_resourceId: { userId: req.userId!, trackId, resourceId } },
      create: { userId: req.userId!, trackId, resourceId, completed },
      update: { completed },
    });
    res.status(201).json({ progress });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { trackId, resourceId, completed } = learningProgressSchema.parse(req.body);
    const progress = await prisma.learningProgress.upsert({
      where: { userId_trackId_resourceId: { userId: req.userId!, trackId, resourceId } },
      create: { userId: req.userId!, trackId, resourceId, completed },
      update: { completed },
    });
    res.json({ progress });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
