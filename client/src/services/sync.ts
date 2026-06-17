import { apiClient } from '@/lib/api';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useLearningStore } from '@/store/useLearningStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { ApiPhase, ApiGoal, ApiNotification, ApiLearningProgress } from '@/types/api';
import type { Goal } from '@/types/api';
import type { NotificationType } from '@/types/notification';

function toLocalPhase(api: ApiPhase) {
  return {
    id: api.id,
    title: api.title,
    progressPercentage: api.progressPercentage,
    milestones: api.milestones.map((ms) => ({
      id: ms.id,
      title: ms.title,
      isCompleted: ms.isCompleted,
      tasks: ms.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status as 'pending' | 'in-progress' | 'done' | 'skipped',
        duration: t.duration ?? '',
        assignedDate: t.assignedDate ?? undefined,
        order: t.order,
        dependencies: t.dependencies ?? [],
      })),
    })),
  };
}

function toLocalGoal(api: ApiGoal): Goal {
  return {
    id: api.id,
    title: api.title,
    description: api.description ?? '',
    deadline: api.deadline ?? '',
    priority: api.priority,
    completed: api.completed,
    linkedTaskIds: api.linkedTaskIds,
    createdAt: api.createdAt,
  };
}

function toLocalNotification(api: ApiNotification) {
  return {
    id: api.id,
    title: api.title,
    message: api.message,
    type: (api.type as NotificationType) || 'system',
    read: api.read,
    createdAt: api.createdAt,
  };
}

function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export async function hydrateProfile() {
  try {
    const { user } = await apiClient.get<{ user: any }>('/auth/me');
    if (!user) return;

    const parsed = parseName(user.name);
    const profile = user.profile;
    const currentProfile = useProfileStore.getState();

    // Only update basic info if not already set
    if (!currentProfile.firstName && !currentProfile.lastName) {
      useProfileStore.getState().updateBasicInfo({
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: user.email,
      });
    }

    // Update profile data, but don't overwrite existing non-null values with null
    const updateData: any = {};
    if (user.role !== null || currentProfile.role === null) {
      updateData.role = user.role;
    }
    if (user.startupType !== null || currentProfile.startupType === null) {
      updateData.startupType = user.startupType;
    }
    if (user.company !== null || currentProfile.company === '') {
      updateData.company = user.company || '';
    }
    if (user.industry !== null || currentProfile.industry === '') {
      updateData.industry = user.industry || '';
    }
    if (user.bio !== null || currentProfile.bio === '') {
      updateData.bio = user.bio || '';
    }
    if (user.skills && user.skills.length > 0) {
      updateData.skills = user.skills;
    }
    if (user.interests && user.interests.length > 0) {
      updateData.interests = user.interests;
    }
    useProfileStore.getState().updateProfile(updateData);

    useProfileStore.getState().updatePreferences({
      notificationTime: profile?.notificationTime || '09:00',
      theme: (profile?.theme as any) || 'system',
    });

    // Sync onboarding status with backend
    useProfileStore.getState().setOnboardingComplete(profile?.onboardingComplete || false);
  } catch (error) {
    console.error('Failed to hydrate profile:', error);
    // Offline: keep localStorage state
  }
}

export async function syncProfile(data: {
  name?: string;
  role?: string | null;
  startupType?: string | null;
  company?: string | null;
  industry?: string | null;
  bio?: string | null;
  skills?: string[];
  interests?: string[];
}) {
  try {
    await apiClient.patch('/profile', data);
  } catch (error) {
    console.error('Failed to sync profile:', error);
    // Keep local state
  }
}

export async function syncPreferences(data: {
  notificationTime?: string;
  theme?: string;
  onboardingComplete?: boolean;
}) {
  try {
    await apiClient.patch('/profile/preferences', data);
  } catch (error) {
    console.error('Failed to sync preferences:', error);
    // Keep local state
  }
}

export async function hydrateRoadmap() {
  try {
    const { phases } = await apiClient.get<{ phases: ApiPhase[] }>('/roadmap');
    const { goals } = await apiClient.get<{ goals: ApiGoal[] }>('/goals');
    if (phases.length > 0) {
      useRoadmapStore.setState({
        phases: phases.map(toLocalPhase),
        goals: goals.map(toLocalGoal),
        activePhaseId: phases[0]?.id ?? null,
      });
    } else if (goals.length > 0) {
      useRoadmapStore.setState({
        goals: goals.map(toLocalGoal),
      });
    }
  } catch {
    // Offline: keep localStorage persisted state
  }
}

export async function syncTaskStatus(taskId: string, status: string) {
  try {
    await apiClient.patch(`/roadmap/tasks/${taskId}`, { status });
  } catch {
    // Task may not exist in DB yet — keep local optimistic update intact
  }
}

export async function syncFullRoadmap() {
  const state = useRoadmapStore.getState();
  try {
    await apiClient.put('/roadmap', {
      templateId: state.activeTemplate,
      phases: state.phases,
    });
  } catch {
    // Keep local state
  }
}

export async function syncGoalCreate(goal: { title: string; description?: string; deadline?: string; priority: string; linkedTaskIds: string[] }) {
  try {
    const { goal: apiGoal } = await apiClient.post<{ goal: ApiGoal }>('/goals', goal);
    const localGoal = toLocalGoal(apiGoal);
    useRoadmapStore.setState((s) => ({
      goals: [localGoal, ...s.goals],
    }));
  } catch {
    // Keep local goal that was already added
  }
}

export async function syncGoalUpdate(goalId: string, data: Record<string, unknown>) {
  try {
    const { goal: apiGoal } = await apiClient.patch<{ goal: ApiGoal }>(`/goals/${goalId}`, data);
    const localGoal = toLocalGoal(apiGoal);
    useRoadmapStore.setState((s) => ({
      goals: s.goals.map((g) => (g.id === goalId ? localGoal : g)),
    }));
  } catch {
    // Keep local update
  }
}

export async function syncGoalDelete(goalId: string) {
  try {
    await apiClient.del(`/goals/${goalId}`);
    useRoadmapStore.setState((s) => ({
      goals: s.goals.filter((g) => g.id !== goalId),
    }));
  } catch {
    // Revert delete — keep local goal
    await hydrateRoadmap();
  }
}

export async function hydrateNotifications() {
  try {
    const { notifications } = await apiClient.get<{ notifications: ApiNotification[] }>('/notifications');
    useNotificationStore.setState({
      notifications: notifications.map(toLocalNotification),
    });
  } catch {
    // Offline: keep localStorage
  }
}

export async function syncNotificationRead(id: string) {
  try {
    await apiClient.patch(`/notifications/${id}/read`, {});
    useNotificationStore.setState((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  } catch {
    // Keep local read state
  }
}

export async function syncNotificationMarkAllRead() {
  try {
    await apiClient.patch('/notifications/read-all', {});
    useNotificationStore.setState((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  } catch {
    // Keep local read state
  }
}

export async function syncNotificationDismiss(id: string) {
  try {
    await apiClient.del(`/notifications/${id}`);
    useNotificationStore.setState((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  } catch {
    // Keep local dismiss state
  }
}

export async function hydrateLearning() {
  try {
    const { progress } = await apiClient.get<{ progress: ApiLearningProgress[] }>('/learning');
    if (progress.length === 0) return;

    const completedMap = new Map<string, boolean>();
    for (const p of progress) {
      completedMap.set(`${p.trackId}:${p.resourceId}`, p.completed);
    }

    useLearningStore.setState((s) => ({
      tracks: s.tracks.map((track) => ({
        ...track,
        resources: track.resources.map((r) => {
          const key = `${track.id}:${r.id}`;
          return completedMap.has(key)
            ? { ...r, completed: completedMap.get(key)! }
            : r;
        }),
      })),
    }));
  } catch {
    // Offline: keep localStorage
  }
}

export async function syncLearningToggle(trackId: string, resourceId: string, completed: boolean) {
  try {
    await apiClient.post('/learning', { trackId, resourceId, completed });
  } catch {
    // Keep local toggle state
  }
}

export async function hydrateAllStores() {
  const setHydrating = useProfileStore.getState().setHydrating;
  setHydrating(true);
  try {
    await Promise.allSettled([
      hydrateProfile(),
      hydrateRoadmap(),
      hydrateNotifications(),
      hydrateLearning(),
    ]);
  } finally {
    setHydrating(false);
  }
}

export async function syncPathwaySelect(pathwayId: string) {
  try {
    await apiClient.patch('/profile', { startupType: pathwayId });
  } catch {
    // Keep local state
  }
}

export async function syncNodeState(nodeId: string, state: { completed: boolean; inProgress: boolean; subtaskStates: Record<string, boolean> }) {
  try {
    await apiClient.patch(`/roadmap/nodes/${nodeId}`, {
      completed: state.completed,
      inProgress: state.inProgress,
      subtaskStates: state.subtaskStates,
    });
  } catch {
    // Keep local state
  }
}
