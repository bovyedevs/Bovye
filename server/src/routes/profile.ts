import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { profileSchema, preferencesSchema } from '../lib/zod.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = profileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, email: true, name: true, role: true, startupType: true, company: true, industry: true, bio: true, skills: true, interests: true },
    });
    res.json({ user });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/preferences', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = preferencesSchema.parse(req.body);
    const profile = await prisma.profile.upsert({
      where: { userId: req.userId! },
      create: { userId: req.userId!, ...data },
      update: data,
    });
    res.json({ profile });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
