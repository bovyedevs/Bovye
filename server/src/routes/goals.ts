import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { goalSchema } from '../lib/zod.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ goals });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = goalSchema.parse(req.body);
    const goal = await prisma.goal.create({
      data: { userId: req.userId!, ...data, linkedTaskIds: data.linkedTaskIds ?? [] },
    });
    res.status(201).json({ goal });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const goal = await prisma.goal.update({
      where: { id: req.params.id, userId: req.userId },
      data: req.body,
    });
    res.json({ goal });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.goal.delete({ where: { id: req.params.id, userId: req.userId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
