import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle2, Circle, Loader2, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import type { RoadmapNode, NodeCategory } from '@/types/roadmap';

const categoryColors: Record<NodeCategory, { badgeBg: string; badgeText: string; accent: string; iconColor: string }> = {
  foundation: { badgeBg: 'bg-amber-500/10', badgeText: 'text-amber-600', accent: 'border-amber-500', iconColor: 'text-amber-500' },
  operations: { badgeBg: 'bg-sky-500/10', badgeText: 'text-sky-600', accent: 'border-sky-500', iconColor: 'text-sky-500' },
  product: { badgeBg: 'bg-emerald-500/10', badgeText: 'text-emerald-600', accent: 'border-emerald-500', iconColor: 'text-emerald-500' },
  engineering: { badgeBg: 'bg-blue-500/10', badgeText: 'text-blue-600', accent: 'border-blue-500', iconColor: 'text-blue-500' },
  growth: { badgeBg: 'bg-violet-500/10', badgeText: 'text-violet-600', accent: 'border-violet-500', iconColor: 'text-violet-500' },
  scale: { badgeBg: 'bg-fuchsia-500/10', badgeText: 'text-fuchsia-600', accent: 'border-fuchsia-500', iconColor: 'text-fuchsia-500' },
  legal: { badgeBg: 'bg-orange-500/10', badgeText: 'text-orange-600', accent: 'border-orange-500', iconColor: 'text-orange-500' },
  finance: { badgeBg: 'bg-green-500/10', badgeText: 'text-green-600', accent: 'border-green-500', iconColor: 'text-green-500' },
  hr: { badgeBg: 'bg-pink-500/10', badgeText: 'text-pink-600', accent: 'border-pink-500', iconColor: 'text-pink-500' },
  marketing: { badgeBg: 'bg-red-500/10', badgeText: 'text-red-600', accent: 'border-red-500', iconColor: 'text-red-500' },
  technology: { badgeBg: 'bg-indigo-500/10', badgeText: 'text-indigo-600', accent: 'border-indigo-500', iconColor: 'text-indigo-500' },
  'go-to-market': { badgeBg: 'bg-cyan-500/10', badgeText: 'text-cyan-600', accent: 'border-cyan-500', iconColor: 'text-cyan-500' },
  production: { badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-600', accent: 'border-yellow-500', iconColor: 'text-yellow-500' },
  sales: { badgeBg: 'bg-lime-500/10', badgeText: 'text-lime-600', accent: 'border-lime-500', iconColor: 'text-lime-500' },
  delivery: { badgeBg: 'bg-teal-500/10', badgeText: 'text-teal-600', accent: 'border-teal-500', iconColor: 'text-teal-500' },
};

export default function NodeDetailPanel({ node, onClose, onNavigate }: {
  node: RoadmapNode;
  onClose: () => void;
  onNavigate?: (nodeId: string) => void;
}) {
  const nodeStates = useRoadmapStore((s) => s.nodeStates);
  const toggleNodeSubtask = useRoadmapStore((s) => s.toggleNodeSubtask);
  const markNodeComplete = useRoadmapStore((s) => s.markNodeComplete);
  const colors = categoryColors[node.category];

  const state = nodeStates[node.id];
  const subtaskDone = state ? Object.values(state.subtaskStates).filter(Boolean).length : 0;
  const totalSubtasks = node.subtasks.length;
  const pct = totalSubtasks > 0 ? Math.round((subtaskDone / totalSubtasks) * 100) : 0;

  const dependencies = node.dependencies.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl overflow-hidden"
          >
            {/* Left accent bar - vertically centered */}
            <div
              className={cn('absolute left-0 w-[5px] rounded-r-full', colors.accent.replace('border-', 'bg-'))}
              style={{ top: '50%', transform: 'translateY(-50%)', height: '120px' }}
            />

            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
              <div className="flex items-center justify-between p-4 pl-6">
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full', colors.badgeBg, colors.badgeText)}>
                    {node.category.replace(/-/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-foreground/60" />
                </button>
              </div>
            </div>

            <div className="p-4 pl-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 57px)' }}>
            {/* Title */}
            <div>
              <h2 className="text-xl font-black text-foreground">{node.title}</h2>
              <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                {node.description}
              </p>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-foreground/50" />
                <span className="text-sm font-semibold text-foreground">{node.duration}</span>
              </div>
              {totalSubtasks > 0 && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={cn('h-4 w-4', state?.completed ? 'text-emerald-500' : 'text-foreground/50')} />
                  <span className="text-sm font-semibold text-foreground">{subtaskDone}/{totalSubtasks} done</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {totalSubtasks > 0 && (
              <div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', state?.completed ? 'bg-emerald-500' : colors.badgeBg.replace('/10', ''))}
                    style={{ width: `${pct}%`, backgroundColor: pct > 0 ? undefined : undefined }}
                  >
                    <div className={cn('h-full rounded-full', state?.completed ? 'bg-emerald-500' : 'bg-primary')} style={{ width: '100%' }} />
                  </div>
                </div>
                <p className="text-xs font-semibold text-foreground/80 mt-1 tabular-nums">{pct}% complete</p>
              </div>
            )}

            {/* Subtasks */}
            {node.subtasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                  Checklist
                </h3>
                <div className="space-y-1">
                  {node.subtasks.map((subtask) => {
                    const isDone = state?.subtaskStates[subtask.id] || false;
                    return (
                      <button
                        key={subtask.id}
                        onClick={() => toggleNodeSubtask(node.id, subtask.id)}
                        className={cn(
                          'flex items-start gap-3 w-full rounded-lg p-3 text-left transition-all duration-200',
                          isDone ? 'bg-emerald-500/5' : 'hover:bg-muted/40'
                        )}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-foreground/30" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            'text-sm font-medium',
                            isDone ? 'text-emerald-600 line-through' : 'text-foreground'
                          )}>
                            {subtask.title}
                          </p>
                          <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">
                            {subtask.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {dependencies && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                  Prerequisites
                </h3>
                <div className="space-y-1">
                  {node.dependencies.map((depId) => (
                    <button
                      key={depId}
                      onClick={() => onNavigate?.(depId)}
                      className="flex items-center gap-2 w-full rounded-lg p-2 text-left hover:bg-muted/40 transition-colors"
                    >
                      <Loader2 className="h-3.5 w-3.5 text-foreground/40" />
                      <span className="text-xs font-medium text-foreground/70 flex-1">
                        {depId}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-foreground/30" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {node.resources && node.resources.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                  Resources
                </h3>
                <div className="space-y-1">
                  {node.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full rounded-lg p-2 text-left hover:bg-muted/40 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-foreground/40" />
                      <span className="text-xs font-semibold text-primary">{resource.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            {!state?.completed && (
              <button
                onClick={() => markNodeComplete(node.id)}
                className={cn(
                  'w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]',
                  'bg-gradient-to-r',
                  colors.badgeBg.replace('/10', '-500'),
                  colors.badgeBg.replace('/10', '-600')
                )}
              >
                Mark as Complete
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
