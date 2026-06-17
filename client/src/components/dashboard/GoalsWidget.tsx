import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Calendar,
  Target,
  Trash2,
  CheckCircle,
  Circle,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import type { Goal } from '@/store/useRoadmapStore';

const priorityAccent: Record<Goal['priority'], {
  borderColor: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}> = {
  high: {
    borderColor: 'border-l-rose-500',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
  },
  medium: {
    borderColor: 'border-l-amber-500',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
  },
  low: {
    borderColor: 'border-l-slate-400',
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-500',
    badgeBg: 'bg-slate-500/10',
    badgeText: 'text-slate-500 dark:text-slate-400',
    badgeBorder: 'border-slate-200 dark:border-slate-700',
  },
};

function PriorityBadge({ priority }: { priority: Goal['priority'] }) {
  const ac = priorityAccent[priority];

  return (
    <span className={cn(
      'text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border',
      ac.badgeBg, ac.badgeText, ac.badgeBorder
    )}>
      {priority}
    </span>
  );
}

function AddGoalModal({ onClose }: { onClose: () => void }) {
  const addGoal = useRoadmapStore((s) => s.addGoal);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Goal['priority']>('medium');
  const [linkedTaskIds, setLinkedTaskIds] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      description: description.trim(),
      deadline,
      priority,
      linkedTaskIds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-xl border border-border/80 bg-card p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Add Goal</h3>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground/80 mb-1.5 block">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Launch MVP by Q2"
              className="h-10 text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground/80 mb-1.5 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does success look like?"
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground/80 mb-1.5 block">Deadline</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground/80 mb-1.5 block">Priority</label>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      'flex-1 rounded-lg border px-2 py-2 text-xs font-bold capitalize transition-all',
                      priority === p
                        ? 'border-primary bg-primary/[0.08] text-primary ring-1 ring-primary/20'
                        : 'border-border/60 text-muted-foreground/60 hover:border-primary/30'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground/80 mb-1.5 block">
              Link to Tasks
            </label>
            <p className="text-xs text-muted-foreground/50 mb-2">
              Enter task IDs separated by commas
            </p>
            <Input
              value={linkedTaskIds.join(', ')}
              onChange={(e) => setLinkedTaskIds(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g. t-101, t-102"
              className="h-10 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 h-10 text-sm font-semibold">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()} className="flex-1 h-10 text-sm font-bold btn-gradient rounded">
            Add Goal
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function GoalCard({ goal }: { goal: Goal }) {
  const toggleGoal = useRoadmapStore((s) => s.toggleGoal);
  const removeGoal = useRoadmapStore((s) => s.removeGoal);
  const phases = useRoadmapStore((s) => s.phases);
  const ac = priorityAccent[goal.priority];

  const linkedTasksCount = goal.linkedTaskIds.length;
  const completedLinkedTasks = goal.linkedTaskIds.filter((id) => {
    for (const p of phases) {
      for (const m of p.milestones) {
        if (m.tasks.find((t) => t.id === id && t.status === 'done')) return true;
      }
    }
    return false;
  }).length;

  const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
  const isOverdue = deadlineDate && deadlineDate < new Date() && !goal.completed;

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 p-4 rounded-xl border border-border/60 shadow-sm transition-all duration-200',
        'border-l-4', ac.borderColor,
        goal.completed && 'opacity-60'
      )}
    >
      <button
        onClick={() => toggleGoal(goal.id)}
        className="mt-0.5 flex-shrink-0 p-0.5 rounded-md hover:bg-muted/50 transition-colors"
      >
        {goal.completed ? (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={cn(
            'text-sm font-bold tracking-tight',
            goal.completed ? 'text-muted-foreground/60 line-through' : 'text-foreground'
          )}>
            {goal.title}
          </h4>
          <PriorityBadge priority={goal.priority} />
        </div>

        {goal.description && (
          <p className="text-xs text-muted-foreground/70 mb-2 leading-relaxed">
            {goal.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground/60">
          {goal.deadline && (
            <span className={cn(
              'flex items-center gap-1',
              isOverdue && 'text-destructive font-bold'
            )}>
              <Calendar className="h-3 w-3" />
              {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {isOverdue && ' · Overdue'}
            </span>
          )}
          {linkedTasksCount > 0 && (
            <span className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              {completedLinkedTasks}/{linkedTasksCount} tasks
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => removeGoal(goal.id)}
        className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function GoalsWidget() {
  const goals = useRoadmapStore((s) => s.goals);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeGoals = goals.filter((g) => !g.completed).slice(0, 3);
  const completedGoals = goals.filter((g) => g.completed).slice(0, 2);

  return (
    <>
      <div className="rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-gradient-to-r from-primary/[0.02] to-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Target className="h-3 w-3 text-primary" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
              Active Goals
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-bold text-primary hover:bg-primary/10"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>

        <div className="p-4">
          {activeGoals.length === 0 && completedGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                <Target className="h-6 w-6 text-primary/60" />
              </div>
              <p className="text-sm font-semibold text-foreground/70">No goals yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 text-xs font-bold text-primary hover:underline"
              >
                Set your first goal
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {activeGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <GoalCard key={goal.id} goal={goal} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {completedGoals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-border/40 pt-3 mt-3"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
                    Completed
                  </p>
                  <div className="space-y-2">
                    {completedGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </motion.div>
              )}

              {goals.length > 5 && (
                <p className="text-xs text-muted-foreground/50 text-center pt-1 font-medium">
                  + {goals.length - 5} more goals
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && <AddGoalModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </>
  );
}
