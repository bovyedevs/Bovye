import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/founders', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const founders = await prisma.user.findMany({
      where: { role: 'founder' },
      select: {
        id: true,
        name: true,
        email: true,
        startupType: true,
        company: true,
        industry: true,
        bio: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ founders });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
