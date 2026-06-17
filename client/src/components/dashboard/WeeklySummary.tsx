import { useMemo } from 'react';
import { CalendarDays, TrendingUp, Flame, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRoadmapStore } from '@/store/useRoadmapStore';

export function WeeklySummary() {
  const phases = useRoadmapStore((s) => s.phases);
  const streak = useRoadmapStore((s) => s.currentStreak);

  const summary = useMemo(() => {
    const allTasks = phases.flatMap((p) => p.milestones.flatMap((m) => m.tasks));
    const doneTasks = allTasks.filter((t) => t.status === 'done');
    const completedThisWeek = doneTasks.length;
    const completedMilestones = phases
      .flatMap((p) => p.milestones)
      .filter((m) => m.isCompleted);
    const topMilestone = completedMilestones.length > 0
      ? completedMilestones[completedMilestones.length - 1]
      : null;
    const totalTasks = allTasks.length;
    const pendingTasks = allTasks.filter((t) => t.status === 'pending').length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'in-progress').length;

    return {
      completedThisWeek,
      xpEarned: completedThisWeek * 50,
      streak,
      topMilestone,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedMilestones: completedMilestones.length,
    };
  }, [phases, streak]);

  if (summary.completedThisWeek === 0 && summary.inProgressTasks === 0) {
    return null;
  }

  const stats = [
    {
      icon: TrendingUp,
      label: 'Completed',
      value: `${summary.completedThisWeek} task${summary.completedThisWeek !== 1 ? 's' : ''}`,
      subtext: `+${summary.xpEarned} XP this week`,
      accent: 'emerald',
      show: summary.completedThisWeek > 0,
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${streak} day${streak !== 1 ? 's' : ''}`,
      subtext: summary.inProgressTasks > 0
        ? `${summary.inProgressTasks} in progress`
        : `${summary.pendingTasks} remaining`,
      accent: 'amber',
      show: true,
    },
    {
      icon: Award,
      label: 'Latest milestone',
      value: summary.topMilestone?.title || '',
      subtext: `${summary.completedMilestones} milestone${summary.completedMilestones !== 1 ? 's' : ''} done`,
      accent: 'violet',
      show: !!summary.topMilestone,
    },
    {
      icon: Zap,
      label: 'Progress',
      value: `${summary.totalTasks > 0 ? Math.round((summary.completedThisWeek / summary.totalTasks) * 100) : 0}%`,
      subtext: `of ${summary.totalTasks} tasks`,
      accent: 'sky',
      show: summary.totalTasks > 0,
    },
  ].filter((s) => s.show);

  const accentClasses: Record<string, { bg: string; icon: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    violet: { bg: 'bg-violet-500/10', icon: 'text-violet-500', text: 'text-violet-600 dark:text-violet-400' },
    sky: { bg: 'bg-sky-500/10', icon: 'text-sky-500', text: 'text-sky-600 dark:text-sky-400' },
  };

  return (
    <div className="rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border/40 bg-gradient-to-r from-primary/[0.02] to-card">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <CalendarDays className="h-3 w-3 text-primary" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
          Activity
        </h3>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {stats.map((stat) => {
            const ac = accentClasses[stat.accent];
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="flex items-start gap-3">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0', ac.bg)}>
                  <Icon className={cn('h-4 w-4', ac.icon)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground/80 truncate">
                    {stat.value}
                  </p>
                  <p className={cn('text-[11px] font-medium', ac.text)}>
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
