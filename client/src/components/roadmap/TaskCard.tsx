import { motion } from 'framer-motion';
import { CheckCircle, PlayCircle, Circle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task, TaskStatus } from '@/types/roadmap';

interface TaskCardProps {
  task: Task;
  onAction?: (taskId: string) => void;
  isBlocked?: boolean;
  dependencyTitle?: string;
}

const statusConfig: Record<TaskStatus, {
  icon: typeof CheckCircle;
  label: string;
  variant: 'default' | 'secondary';
  color: string;
  dotColor: string;
  borderColor: string;
  bgAccent: string;
  iconBg: string;
}> = {
  'done': {
    icon: CheckCircle,
    label: 'Done',
    variant: 'default',
    color: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    borderColor: 'border-l-emerald-500',
    bgAccent: 'from-emerald-500/[0.02]',
    iconBg: 'bg-emerald-500/10',
  },
  'in-progress': {
    icon: PlayCircle,
    label: 'In Progress',
    variant: 'default',
    color: 'text-primary',
    dotColor: 'bg-primary',
    borderColor: 'border-l-primary',
    bgAccent: 'from-primary/[0.03]',
    iconBg: 'bg-primary/10',
  },
  'pending': {
    icon: Circle,
    label: 'Pending',
    variant: 'secondary',
    color: 'text-muted-foreground/60',
    dotColor: 'bg-muted-foreground/40',
    borderColor: 'border-l-border',
    bgAccent: 'from-muted/[0.02]',
    iconBg: 'bg-muted/10',
  },
  'skipped': {
    icon: Circle,
    label: 'Skipped',
    variant: 'secondary',
    color: 'text-muted-foreground/40',
    dotColor: 'bg-muted-foreground/20',
    borderColor: 'border-l-border',
    bgAccent: 'from-muted/[0.01]',
    iconBg: 'bg-muted/5',
  },
};

const actionLabel: Record<TaskStatus, string> = {
  'pending': 'Start',
  'in-progress': 'Complete',
  'done': 'Reset',
  'skipped': 'Restore',
};

const actionButtonStyle: Record<TaskStatus, string> = {
  'pending': 'border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary',
  'in-progress': 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500',
  'done': 'border-border/50 text-muted-foreground/60 hover:border-primary/30 hover:text-primary',
  'skipped': 'border-border/50 text-muted-foreground/40 hover:border-primary/30 hover:text-primary',
};

export function TaskCard({ task, onAction, isBlocked, dependencyTitle }: TaskCardProps) {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;
  const isDone = task.status === 'done';

  return (
    <motion.div
      whileTap={onAction && !isBlocked ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div
        className={cn(
          'group relative flex items-center gap-4 p-4 rounded-xl border border-border/60 shadow-sm transition-all duration-200',
          'bg-gradient-to-r', config.bgAccent, 'to-card',
          'border-l-4', config.borderColor,
          'hover:shadow-md hover:border-border/80'
        )}
      >
        <div className={cn('flex-shrink-0', config.iconBg, 'rounded-lg p-1.5', config.color)}>
          {isBlocked ? (
            <Lock className="h-4 w-4 text-muted-foreground/40" />
          ) : (
            <StatusIcon className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm font-semibold transition-all duration-200',
              isDone
                ? 'text-muted-foreground/50 line-through'
                : isBlocked
                  ? 'text-muted-foreground/50'
                  : 'text-foreground'
            )}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('h-2 w-2 rounded-full', config.dotColor)} />
            <span className="text-xs text-muted-foreground/60 font-medium">
              {task.duration}
            </span>
          </div>
          {isBlocked && dependencyTitle && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-amber-500/80 font-medium">
              <Lock className="h-3 w-3" />
              Depends on: {dependencyTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge
            variant={config.variant}
            className={cn(
              'text-[11px] font-semibold',
              config.variant === 'secondary' && 'text-muted-foreground/60',
              isDone && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 font-bold'
            )}
          >
            {config.label}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={isBlocked && task.status === 'pending'}
            className={cn(
              'h-7 rounded-md px-3 text-xs font-semibold transition-all duration-200',
              isBlocked && task.status === 'pending'
                ? 'border-border/50 text-muted-foreground/30 cursor-not-allowed'
                : actionButtonStyle[task.status]
            )}
            onClick={() => onAction?.(task.id)}
          >
            {isBlocked && task.status === 'pending' ? (
              <Lock className="h-3 w-3" />
            ) : (
              actionLabel[task.status]
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
