import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Package,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLearningStore, LEARNING_TRACKS } from '@/store/useLearningStore';

const trackIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'startup-101': GraduationCap,
  'fundraising': TrendingUp,
  'product': Package,
  'growth': BookOpen,
};

function ResourceItem({
  resource,
  onToggle,
}: {
  resource: { id: string; title: string; url: string; description: string; author: string; completed: boolean };
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 px-1 group">
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0"
        title={resource.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {resource.completed ? (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'text-sm font-medium inline-flex items-center gap-1.5 transition-colors',
            resource.completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground hover:text-primary'
          )}
        >
          {resource.title}
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
        </a>
        <p className="text-xs text-muted-foreground mt-0.5">
          {resource.description}
        </p>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
          by {resource.author}
        </p>
      </div>
    </div>
  );
}

function TrackCard({ track }: { track: typeof LEARNING_TRACKS[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleResource = useLearningStore((s) => s.toggleResource);

  const completedCount = track.resources.filter((r) => r.completed).length;
  const totalCount = track.resources.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const Icon = trackIcons[track.id] ?? BookOpen;

  return (
    <Card className="shadow-warm-sm overflow-hidden transition-all duration-200 hover:shadow-warm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              pct === 100
                ? 'bg-emerald-500/10'
                : 'bg-primary/10'
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                pct === 100 ? 'text-emerald-500' : 'text-primary'
              )}
            />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {track.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    pct === 100 ? 'bg-emerald-500' : 'bg-primary'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                {completedCount}/{totalCount} · {pct}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={cn(
              'text-xs font-semibold tabular-nums',
              pct === 100 ? 'text-emerald-500' : 'text-primary'
            )}
          >
            {pct}%
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 pb-4">
              <div className="mt-1">
                {track.resources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    onToggle={() => toggleResource(track.id, resource.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function LearningHub() {
  const tracks = useLearningStore((s) => s.tracks);
  const totalResources = tracks.reduce((a, t) => a + t.resources.length, 0);
  const totalCompleted = tracks.reduce(
    (a, t) => a + t.resources.filter((r) => r.completed).length,
    0
  );
  const overallPct = totalResources > 0 ? Math.round((totalCompleted / totalResources) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="min-h-full p-4 md:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Learning Hub<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated resources for every stage of your startup journey
        </p>
      </div>

      {/* Overall Progress */}
      <div className="mb-8 p-5 rounded-xl border border-border bg-card shadow-warm-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-primary tabular-nums">
            {totalCompleted}/{totalResources} resources
          </span>
        </div>
        <Progress value={overallPct} className="h-2.5" />
        <p className="text-xs text-muted-foreground mt-2">
          {overallPct === 100
            ? 'All tracks complete — you are a startup machine'
            : overallPct > 50
              ? 'Over halfway there — keep going'
              : 'Just getting started — the best founders never stop learning'}
        </p>
      </div>

      {/* Track Cards */}
      <div className="space-y-4">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </motion.div>
  );
}
