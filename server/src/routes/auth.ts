import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { registerSchema, loginSchema } from '../lib/zod.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        startupType: true,
        company: true,
        industry: true,
        bio: true,
        skills: true,
        interests: true,
        createdAt: true,
      },
    });

    await prisma.profile.create({
      data: { userId: user.id },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' as const }
    );

    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    console.error('[SIGNUP ERROR]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' as const }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        startupType: user.startupType,
        company: user.company,
        industry: user.industry,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        startupType: true,
        company: true,
        industry: true,
        bio: true,
        skills: true,
        interests: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Auto-create profile if missing (common for Google login users)
    if (!user.profile) {
      user.profile = await prisma.profile.create({
        data: { userId: user.id },
      });
    }

    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sync', async (req, res) => {
  try {
    const { id, email, name } = req.body;

    let user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
          passwordHash: 'oauth-login', // Placeholder
        },
        include: { profile: true },
      });
      
      await prisma.profile.create({
        data: { userId: user.id },
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' as const }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        onboardingComplete: user.profile?.onboardingComplete || false,
      },
      token,
    });
  } catch (err) {
    console.error('[SYNC ERROR]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
