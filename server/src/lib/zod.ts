import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const profileSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().nullable().optional(),
  startupType: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

export const preferencesSchema = z.object({
  notificationTime: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  onboardingComplete: z.boolean().optional(),
});

export const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  linkedTaskIds: z.array(z.string()).optional(),
});

export const taskUpdateSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'done', 'skipped']).optional(),
  title: z.string().min(1).optional(),
});

export const roadmapDataSchema = z.object({
  templateId: z.string().optional(),
  phases: z.array(z.any()).optional(),
});

export const toolkitSchema = z.object({
  category: z.enum(['idea', 'pitchDeck', 'funding', 'docs']),
  data: z.record(z.any()),
});

export const learningProgressSchema = z.object({
  trackId: z.string(),
  resourceId: z.string(),
  completed: z.boolean(),
});
