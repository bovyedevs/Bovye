import { motion } from 'framer-motion';
import { Code, Factory, ShoppingBag, Utensils, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUSINESS_PATHWAYS, type PathwayId } from '@/data/roadmapTemplates';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Factory,
  ShoppingBag,
  Utensils,
  Briefcase,
};

const colorConfig: Record<string, { gradient: string; border: string; iconBg: string; iconColor: string; badgeBg: string; badgeText: string; hoverBorder: string }> = {
  primary: {
    gradient: 'from-primary/10 to-primary/5',
    border: 'border-primary/20',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
    badgeBg: 'bg-primary/10',
    badgeText: 'text-primary',
    hoverBorder: 'hover:border-primary/50',
  },
  amber: {
    gradient: 'from-amber-500/10 to-amber-500/5',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600',
    hoverBorder: 'hover:border-amber-500/50',
  },
  emerald: {
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-500/50',
  },
  rose: {
    gradient: 'from-rose-500/10 to-rose-500/5',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-500',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600',
    hoverBorder: 'hover:border-rose-500/50',
  },
  violet: {
    gradient: 'from-violet-500/10 to-violet-500/5',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-500',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-600',
    hoverBorder: 'hover:border-violet-500/50',
  },
};

const categoryColorMap: Record<string, string> = {
  foundation: 'bg-amber-500/10 text-amber-600',
  operations: 'bg-sky-500/10 text-sky-600',
  product: 'bg-emerald-500/10 text-emerald-600',
  engineering: 'bg-blue-500/10 text-blue-600',
  growth: 'bg-violet-500/10 text-violet-600',
  scale: 'bg-fuchsia-500/10 text-fuchsia-600',
  legal: 'bg-orange-500/10 text-orange-600',
  finance: 'bg-green-500/10 text-green-600',
  hr: 'bg-pink-500/10 text-pink-600',
  marketing: 'bg-red-500/10 text-red-600',
  technology: 'bg-indigo-500/10 text-indigo-600',
  'go-to-market': 'bg-cyan-500/10 text-cyan-600',
  production: 'bg-yellow-500/10 text-yellow-600',
  sales: 'bg-lime-500/10 text-lime-600',
  delivery: 'bg-teal-500/10 text-teal-600',
};

export default function PathwaySelector({ onSelect, onBack, selectedPathway }: {
  onSelect: (id: PathwayId) => void;
  onBack?: () => void;
  selectedPathway?: PathwayId | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="min-h-full p-4 md:p-6 lg:p-8"
    >
      <div className="mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
          Choose Your Pathway<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the business type that matches your venture to get a tailored roadmap.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESS_PATHWAYS.map((pathway, index) => {
          const Icon = iconMap[pathway.icon] || Code;
          const colors = colorConfig[pathway.color] || colorConfig.primary;
          const isSelected = selectedPathway === pathway.id;

          const uniqueCategories = new Set(pathway.nodes.map((n) => n.category));

          return (
            <motion.button
              key={pathway.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 280, damping: 22 }}
              onClick={() => onSelect(pathway.id)}
              className={cn(
                'group flex flex-col rounded-xl border p-5 text-left transition-all duration-200',
                'shadow-warm-sm hover:-translate-y-0.5 hover:shadow-warm-md',
                colors.gradient,
                isSelected
                  ? cn('ring-2', colors.border.replace('/20', '/60'))
                  : cn('bg-card', colors.border, colors.hoverBorder)
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', colors.iconBg)}>
                  <Icon className={cn('h-6 w-6', colors.iconColor)} />
                </div>
                {isSelected && (
                  <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', colors.iconBg)}>
                    <span className={cn('text-xs font-bold', colors.iconColor)}>✓</span>
                  </div>
                )}
              </div>

              <h3 className={cn('text-lg font-bold mb-1 transition-colors', isSelected ? colors.iconColor : 'text-foreground group-hover:text-primary')}>
                {pathway.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                {pathway.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">
                    {pathway.nodes.length} steps
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {pathway.columnLabels.length} phases
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {Array.from(uniqueCategories).slice(0, 4).map((cat) => (
                    <span
                      key={cat}
                      className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', categoryColorMap[cat] || 'bg-muted text-muted-foreground')}
                    >
                      {cat.replace(/-/g, ' ')}
                    </span>
                  ))}
                  {uniqueCategories.size > 4 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      +{uniqueCategories.size - 4}
                    </span>
                  )}
                </div>

                <div className={cn('flex items-center gap-1 text-xs font-bold pt-2 border-t transition-colors', isSelected ? colors.badgeText : 'text-muted-foreground group-hover:text-primary', colors.border)}>
                  {isSelected ? 'View Roadmap' : 'Select Pathway'}
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
