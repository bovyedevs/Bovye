import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { toolkitSchema } from '../lib/zod.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const toolkitData = await prisma.toolkitData.findMany({
      where: { userId: req.userId },
    });
    res.json({ toolkitData });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:category', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const category = req.params.category;
    if (!category) return res.status(400).json({ error: 'Category required' });
    const data = await prisma.toolkitData.findUnique({
      where: { userId_category: { userId: req.userId!, category } },
    });
    res.json({ toolkitData: data });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:category', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, data } = toolkitSchema.parse(req.body);
    const toolkitData = await prisma.toolkitData.upsert({
      where: { userId_category: { userId: req.userId!, category } },
      create: { userId: req.userId!, category, data },
      update: { data },
    });
    res.json({ toolkitData });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
