import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  modules: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    content: z.string(),
    duration: z.string().optional(),
  })),
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { mentorId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ courses });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/all', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        mentor: {
          select: { id: true, name: true, bio: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ courses });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = courseSchema.parse(req.body);
    const course = await prisma.course.create({
      data: {
        mentorId: req.userId!,
        title: data.title,
        description: data.description ?? null,
        modules: data.modules as any,
      },
    });
    res.status(201).json({ course });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });
    if (!course || course.mentorId !== req.userId) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const data = courseSchema.partial().parse(req.body);
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ course: updated });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });
    if (!course || course.mentorId !== req.userId) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
