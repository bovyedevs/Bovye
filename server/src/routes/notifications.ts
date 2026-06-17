import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const notificationCreateSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.string(),
  createdAt: z.string().optional(),
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ notifications });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = notificationCreateSchema.parse(req.body);
    const notification = await prisma.notification.create({
      data: { userId: req.userId!, ...data, createdAt: data.createdAt ?? new Date().toISOString() },
    });
    res.status(201).json({ notification });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id, userId: req.userId },
      data: { read: true },
    });
    res.json({ notification });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/read-all', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id, userId: req.userId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
