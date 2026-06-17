import { motion } from 'framer-motion';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Phase } from '@/types/roadmap';

interface PhaseTimelineProps {
  phase: Phase;
}

interface MilestoneNodeProps {
  milestone: Phase['milestones'][0];
  position: 'left' | 'right';
  index: number;
  total: number;
}

function MilestoneNode({ milestone, position, index, total }: MilestoneNodeProps) {
  const isLast = index === total - 1;
  const completedTasks = milestone.tasks.filter((t) => t.status === 'done').length;
  const totalTasks = milestone.tasks.length;
  const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 280, damping: 22 }}
      className={cn(
        'relative flex items-start gap-4 md:gap-0',
        position === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'w-full md:w-[calc(50%-1.5rem)]',
          position === 'left' ? 'md:text-right' : 'md:text-left'
        )}
      >
        <div
          className={cn(
            'p-3.5 rounded-xl border transition-all duration-200 shadow-sm',
            'border-border/60 bg-gradient-to-br from-card to-muted/[0.02]',
            'hover:shadow-md hover:border-border/80',
            milestone.isCompleted && 'border-emerald-500/20 from-emerald-500/[0.02]'
          )}
        >
          <div className={cn(
            'flex items-center gap-2 mb-1.5',
            position === 'left' && 'md:flex-row-reverse'
          )}>
            {milestone.isCompleted
              ? <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              : <Circle className="h-4 w-4 text-primary/50 flex-shrink-0" />
            }
            <h4 className={cn(
              'text-sm font-bold tracking-tight',
              milestone.isCompleted
                ? 'text-foreground/70'
                : 'text-foreground'
            )}>
              {milestone.title}
            </h4>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-xs font-medium', milestone.isCompleted ? 'text-emerald-500/80' : 'text-muted-foreground/60')}>
              {completedTasks}/{totalTasks} tasks
            </span>
            {taskPct > 0 && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                taskPct === 100
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-primary/10 text-primary'
              )}>
                {taskPct}%
              </span>
            )}
          </div>

          {totalTasks > 0 && (
            <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  milestone.isCompleted
                    ? 'bg-emerald-500'
                    : taskPct > 0
                      ? 'bg-primary'
                      : 'bg-muted'
                )}
                style={{ width: `${taskPct}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-px" style={{ top: 0, bottom: 0 }}>
        <div className={cn(
          'z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background transition-colors',
          milestone.isCompleted ? 'bg-emerald-500' : 'bg-primary'
        )} />
        {!isLast && (
          <div className={cn(
            'flex-1 w-px mt-1.5 mb-1.5',
            milestone.isCompleted ? 'bg-emerald-500/30' : 'bg-border'
          )} />
        )}
      </div>

      <div className="md:hidden absolute left-[11px] top-0 bottom-0 flex flex-col items-center">
        <div className={cn(
          'z-10 h-2.5 w-2.5 rounded-full ring-2 ring-background transition-colors',
          milestone.isCompleted ? 'bg-emerald-500' : 'bg-primary'
        )} />
        {!isLast && (
          <div className={cn(
            'flex-1 w-px mt-1',
            milestone.isCompleted ? 'bg-emerald-500/30' : 'bg-border'
          )} />
        )}
      </div>

      <div className="hidden md:block w-[calc(50%-1.5rem)]" />
    </motion.div>
  );
}

export function PhaseTimeline({ phase }: PhaseTimelineProps) {
  const completedMilestones = phase.milestones.filter((m) => m.isCompleted).length;
  const totalMilestones = phase.milestones.length;

  return (
    <div className="rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/40 bg-gradient-to-r from-primary/[0.02] to-card">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <TrendingUp className="h-3 w-3 text-primary" />
            </div>
            <h3 className="text-xs font-bold tracking-tight text-foreground/80">
              {phase.title}
            </h3>
          </div>
          <span className="text-xs font-bold text-primary tabular-nums">
            {phase.progressPercentage}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
            style={{ width: `${phase.progressPercentage}%` }}
          />
        </div>
        {totalMilestones > 0 && (
          <p className="text-[11px] font-medium text-muted-foreground/50 mt-1.5">
            {completedMilestones} of {totalMilestones} milestones
          </p>
        )}
      </div>

      <div className="p-4 relative mt-2 space-y-0 md:space-y-3 pl-7 md:pl-4">
        {phase.milestones.map((milestone, index) => (
          <MilestoneNode
            key={milestone.id}
            milestone={milestone}
            position={index % 2 === 0 ? 'left' : 'right'}
            index={index}
            total={phase.milestones.length}
          />
        ))}
      </div>
    </div>
  );
}
