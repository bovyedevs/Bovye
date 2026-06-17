import type { Phase } from '@/types/roadmap';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

export const initialRoadmapData: Phase[] = [
  {
    id: 'phase-1',
    title: 'Idea Validation',
    progressPercentage: 33,
    milestones: [
      {
        id: 'ms-1-1',
        title: 'Problem Discovery',
        isCompleted: true,
        tasks: [
          { id: 't-101', title: 'Write problem statement', status: 'done', duration: '15 min', assignedDate: yesterdayStr, order: 1 },
          { id: 't-102', title: 'Interview 5 potential customers', status: 'done', duration: '2 hours', assignedDate: yesterdayStr, order: 2 },
        ],
      },
      {
        id: 'ms-1-2',
        title: 'Market Validation',
        isCompleted: false,
        tasks: [
          { id: 't-103', title: 'Define target customer segment', status: 'in-progress', duration: '25 min', assignedDate: yesterdayStr, order: 1 },
          { id: 't-104', title: 'Research top 3 competitors', status: 'done', duration: '45 min', assignedDate: todayStr, order: 2 },
          { id: 't-105', title: 'Draft lean canvas for product', status: 'pending', duration: '30 min', assignedDate: todayStr, order: 3 },
        ],
      },
      {
        id: 'ms-1-3',
        title: 'MVP Scope Definition',
        isCompleted: false,
        tasks: [
          { id: 't-106', title: 'Prioritize features by impact', status: 'pending', duration: '20 min', assignedDate: todayStr, order: 1 },
          { id: 't-107', title: 'Define core user journeys', status: 'pending', duration: '30 min', assignedDate: tomorrowStr, order: 2 },
          { id: 't-108', title: 'Create wireframe sketches', status: 'pending', duration: '1 hour', assignedDate: tomorrowStr, order: 3 },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'MVP Build',
    progressPercentage: 0,
    milestones: [
      {
        id: 'ms-2-1',
        title: 'Core Architecture',
        isCompleted: false,
        tasks: [
          { id: 't-201', title: 'Set up project repository', status: 'pending', duration: '20 min', assignedDate: tomorrowStr, order: 1 },
          { id: 't-202', title: 'Design database schema', status: 'pending', duration: '1 hour', order: 2 },
          { id: 't-203', title: 'Configure CI/CD pipeline', status: 'pending', duration: '45 min', order: 3 },
        ],
      },
      {
        id: 'ms-2-2',
        title: 'First User Testing',
        isCompleted: false,
        tasks: [
          { id: 't-204', title: 'Recruit 10 beta testers', status: 'pending', duration: '2 hours', order: 1 },
          { id: 't-205', title: 'Build feedback collection form', status: 'pending', duration: '30 min', order: 2 },
          { id: 't-206', title: 'Prepare demo environment', status: 'pending', duration: '1 hour', order: 3 },
        ],
      },
    ],
  },
];
