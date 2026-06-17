import { useEffect, useRef } from 'react';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { fireCelebration } from '@/lib/confetti';

export function MilestoneCelebration() {
  const completedRef = useRef(new Set<string>());
  const phases = useRoadmapStore((s) => s.phases);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const currentCompleted = new Set<string>();

    for (const phase of phases) {
      for (const milestone of phase.milestones) {
        if (milestone.isCompleted) {
          currentCompleted.add(milestone.id);
        }
      }
    }

    const prevCompleted = completedRef.current;

    for (const id of currentCompleted) {
      if (!prevCompleted.has(id)) {
        const milestoneTitle = phases
          .flatMap((p) => p.milestones)
          .find((m) => m.id === id)?.title ?? 'Milestone';

        fireCelebration();

        addNotification({
          title: 'Milestone Completed!',
          message: `You've completed "${milestoneTitle}"`,
          type: 'milestone',
        });
      }
    }

    completedRef.current = currentCompleted;
  }, [phases, addNotification]);

  return null;
}
