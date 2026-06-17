import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { roadmapDataSchema, taskUpdateSchema } from '../lib/zod.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const phases = await prisma.roadmapPhase.findMany({
      where: { userId: req.userId },
      orderBy: { order: 'asc' },
      include: { milestones: { orderBy: { order: 'asc' }, include: { tasks: { orderBy: { order: 'asc' } } } } },
    });
    res.json({ phases });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { templateId, phases } = roadmapDataSchema.parse(req.body);

    await prisma.$transaction(async (tx) => {
      await tx.roadmapPhase.deleteMany({ where: { userId: req.userId } });

      if (phases && Array.isArray(phases)) {
        for (let i = 0; i < phases.length; i++) {
          const phase = phases[i];
          const createdPhase = await tx.roadmapPhase.create({
            data: {
              userId: req.userId!,
              templateId: templateId ?? null,
              title: phase.title,
              progressPercentage: phase.progressPercentage ?? 0,
              order: i,
            },
          });

          if (phase.milestones && Array.isArray(phase.milestones)) {
            for (let j = 0; j < phase.milestones.length; j++) {
              const ms = phase.milestones[j];
              const createdMs = await tx.milestone.create({
                data: {
                  phaseId: createdPhase.id,
                  title: ms.title,
                  isCompleted: ms.isCompleted ?? false,
                  order: j,
                },
              });

              if (ms.tasks && Array.isArray(ms.tasks)) {
                for (let k = 0; k < ms.tasks.length; k++) {
                  const task = ms.tasks[k];
                  await tx.task.create({
                    data: {
                      milestoneId: createdMs.id,
                      title: task.title,
                      status: task.status ?? 'pending',
                      duration: task.duration,
                      assignedDate: task.assignedDate,
                      order: k,
                      dependencies: task.dependencies ?? [],
                    },
                  });
                }
              }
            }
          }
        }
      }
    });

    res.json({ success: true });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/tasks/:taskId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = taskUpdateSchema.parse(req.body);
    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data: { status },
    });
    res.json({ task });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
