import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Phase, TaskStatus } from '@/types/roadmap';
import type { Goal } from '@/types/api';
import { initialRoadmapData } from './mockRoadmapData';
import { BUSINESS_PATHWAYS, type PathwayId } from '@/data/roadmapTemplates';
import { syncTaskStatus, syncGoalCreate, syncGoalUpdate, syncGoalDelete, syncFullRoadmap, syncPathwaySelect, syncNodeState } from '@/services/sync';

export type { Goal } from '@/types/api';

interface RoadmapState {
  phases: Phase[];
  activePhaseId: string | null;
  activeTemplate: string | null;
  selectedPathway: PathwayId | null;
  nodeStates: Record<string, { completed: boolean; inProgress: boolean; subtaskStates: Record<string, boolean> }>;
  currentStreak: number;
  xp: number;
  goals: Goal[];
}

interface RoadmapActions {
  toggleTaskCompletion: (taskId: string) => void;
  skipTask: (taskId: string) => void;
  setActivePhase: (phaseId: string) => void;
  loadTemplate: (templateId: string) => void;
  selectPathway: (pathwayId: PathwayId) => void;
  toggleNodeSubtask: (nodeId: string, subtaskId: string) => void;
  markNodeInProgress: (nodeId: string) => void;
  markNodeComplete: (nodeId: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed' | 'createdAt'>) => void;
  updateGoal: (goalId: string, data: Partial<Goal>) => void;
  removeGoal: (goalId: string) => void;
  toggleGoal: (goalId: string) => void;
  reorderTasks: (milestoneId: string, fromIndex: number, toIndex: number) => void;
}

type RoadmapStore = RoadmapState & RoadmapActions;

function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function recalculatePhase(phase: Phase): Phase {
  let totalTasks = 0;
  let doneTasks = 0;

  const updatedMilestones = phase.milestones.map((milestone) => {
    const allDone = milestone.tasks.length > 0 && milestone.tasks.every((t) => t.status === 'done');
    const milestoneDone = milestone.tasks.filter((t) => t.status === 'done').length;

    totalTasks += milestone.tasks.length;
    doneTasks += milestoneDone;

    return {
      ...milestone,
      isCompleted: allDone,
    };
  });

  return {
    ...phase,
    milestones: updatedMilestones,
    progressPercentage: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
  };
}

function isTaskBlocked(phase: Phase, taskId: string): boolean {
  for (const milestone of phase.milestones) {
    const task = milestone.tasks.find((t) => t.id === taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) continue;

    const allTaskIds = new Set(
      phase.milestones.flatMap((m) => m.tasks.map((t) => t.id))
    );

    for (const depId of task.dependencies) {
      if (!allTaskIds.has(depId)) continue;

      let depStatus: TaskStatus | undefined;
      for (const m of phase.milestones) {
        const dep = m.tasks.find((t) => t.id === depId);
        if (dep) {
          depStatus = dep.status;
          break;
        }
      }

      if (depStatus !== 'done') {
        return true;
      }
    }
  }

  return false;
}

function cycleStatus(current: TaskStatus): TaskStatus {
  if (current === 'pending') return 'in-progress';
  if (current === 'in-progress') return 'done';
  if (current === 'done') return 'skipped';
  return 'pending';
}

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      phases: initialRoadmapData,
      activePhaseId: initialRoadmapData[0]?.id ?? null,
      activeTemplate: null,
      selectedPathway: null,
      nodeStates: {},
      currentStreak: 12,
      xp: 1240,
      goals: [],

      toggleTaskCompletion: (taskId: string) => {
        let newStatus: TaskStatus | null = null;

        set((state) => {
          let foundOldStatus: TaskStatus | null = null;

          const updatedPhases = state.phases.map((phase) => {
            const task = phase.milestones
              .flatMap((m) => m.tasks)
              .find((t) => t.id === taskId);

            if (task && task.status === 'pending' && isTaskBlocked(phase, taskId)) {
              return phase;
            }

            const updatedMilestones = phase.milestones.map((milestone) => {
              const updatedTasks = milestone.tasks.map((task) => {
                if (task.id === taskId) {
                  const cycled = cycleStatus(task.status);
                  newStatus = cycled;
                  foundOldStatus = task.status;
                  return { ...task, status: cycled };
                }
                return task;
              });

              return { ...milestone, tasks: updatedTasks };
            });

            return { ...phase, milestones: updatedMilestones };
          });

          const recalculatedPhases = updatedPhases.map(recalculatePhase);

          let xpChange = 0;
          if (foundOldStatus === 'in-progress') xpChange += 50;
          if (foundOldStatus === 'done') xpChange -= 50;

          return {
            phases: recalculatedPhases,
            xp: Math.max(0, state.xp + xpChange),
          };
        });

        if (newStatus) {
          syncTaskStatus(taskId, newStatus);
        }
      },

      skipTask: (taskId: string) => {
        set((state) => {
          const updatedPhases = state.phases.map((phase) => {
            const updatedMilestones = phase.milestones.map((milestone) => {
              const updatedTasks = milestone.tasks.map((task) => {
                if (task.id === taskId && task.status !== 'done') {
                  return { ...task, status: 'skipped' as const };
                }
                return task;
              });

              return { ...milestone, tasks: updatedTasks };
            });

            return { ...phase, milestones: updatedMilestones };
          });

          return { phases: updatedPhases.map(recalculatePhase) };
        });

        syncTaskStatus(taskId, 'skipped');
      },

      setActivePhase: (phaseId: string) => {
        set((state) => {
          const exists = state.phases.some((p) => p.id === phaseId);
          if (!exists) return {};
          return { activePhaseId: phaseId };
        });
      },

      loadTemplate: (templateId: string) => {
        const pathway = BUSINESS_PATHWAYS.find((p) => p.id === templateId);
        if (!pathway) return;

        set({
          phases: [],
          activePhaseId: null,
          activeTemplate: templateId,
          selectedPathway: templateId as PathwayId,
          nodeStates: {},
        });

        syncFullRoadmap();
      },

      selectPathway: (pathwayId: PathwayId) => {
        const pathway = BUSINESS_PATHWAYS.find((p) => p.id === pathwayId);
        if (!pathway) return;

        set({
          selectedPathway: pathwayId,
          activeTemplate: pathwayId,
        });

        syncPathwaySelect(pathwayId);
      },

      toggleNodeSubtask: (nodeId: string, subtaskId: string) => {
        set((state) => {
          const current = state.nodeStates[nodeId] || { completed: false, inProgress: false, subtaskStates: {} };
          const newSubtaskStates = { ...current.subtaskStates, [subtaskId]: !current.subtaskStates[subtaskId] };

          const pathway = BUSINESS_PATHWAYS.find((p) => p.id === state.selectedPathway);
          const node = pathway?.nodes.find((n) => n.id === nodeId);
          const allDone = node ? node.subtasks.every((st) => newSubtaskStates[st.id]) : false;

          const newState = {
            completed: allDone,
            inProgress: !allDone && Object.values(newSubtaskStates).some(Boolean),
            subtaskStates: newSubtaskStates,
          };

          syncNodeState(nodeId, newState);

          return {
            nodeStates: { ...state.nodeStates, [nodeId]: newState },
            xp: state.xp + (allDone && !current.completed ? 50 : allDone === false && current.completed ? -50 : 0),
          };
        });
      },

      markNodeInProgress: (nodeId: string) => {
        set((state) => {
          const current = state.nodeStates[nodeId] || { completed: false, inProgress: false, subtaskStates: {} };
          const newState = { ...current, inProgress: true };
          syncNodeState(nodeId, newState);
          return { nodeStates: { ...state.nodeStates, [nodeId]: newState } };
        });
      },

      markNodeComplete: (nodeId: string) => {
        set((state) => {
          const current = state.nodeStates[nodeId] || { completed: false, inProgress: false, subtaskStates: {} };
          const pathway = BUSINESS_PATHWAYS.find((p) => p.id === state.selectedPathway);
          const node = pathway?.nodes.find((n) => n.id === nodeId);
          const allSubtaskStates = node ? Object.fromEntries(node.subtasks.map((st) => [st.id, true])) : {};
          const newState = { completed: true, inProgress: false, subtaskStates: allSubtaskStates };
          syncNodeState(nodeId, newState);
          return {
            nodeStates: { ...state.nodeStates, [nodeId]: newState },
            xp: state.xp + (!current.completed ? 50 : 0),
          };
        });
      },

      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: generateId(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [newGoal, ...state.goals] }));

        syncGoalCreate({
          title: goalData.title,
          description: goalData.description,
          deadline: goalData.deadline,
          priority: goalData.priority,
          linkedTaskIds: goalData.linkedTaskIds ?? [],
        });
      },

      updateGoal: (goalId, data) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, ...data } : g
          ),
        }));

        syncGoalUpdate(goalId, data);
      },

      removeGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
        }));

        syncGoalDelete(goalId);
      },

      toggleGoal: (goalId) => {
        const currentGoal = get().goals.find((g) => g.id === goalId);
        if (!currentGoal) return;

        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, completed: !g.completed } : g
          ),
        }));

        syncGoalUpdate(goalId, { completed: !currentGoal.completed });
      },

      reorderTasks: (milestoneId, fromIndex, toIndex) => {
        set((state) => {
          const updatedPhases = state.phases.map((phase) => {
            const milestone = phase.milestones.find((m) => m.id === milestoneId);
            if (!milestone) return phase;

            const tasks = [...milestone.tasks];
            const [moved] = tasks.splice(fromIndex, 1);
            tasks.splice(toIndex, 0, moved);

            const reorderedTasks = tasks.map((t, i) => ({ ...t, order: i + 1 }));

            const updatedMilestones = phase.milestones.map((m) =>
              m.id === milestoneId ? { ...m, tasks: reorderedTasks } : m
            );

            return { ...phase, milestones: updatedMilestones };
          });

          return { phases: updatedPhases.map(recalculatePhase) };
        });

        syncFullRoadmap();
      },
    }),
    {
      name: 'bovye-roadmap',
    }
  )
);
