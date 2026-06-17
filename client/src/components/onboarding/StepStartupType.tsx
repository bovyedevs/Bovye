import { motion } from 'framer-motion';
import { Code, Factory, ShoppingBag, Utensils, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/useProfileStore';
import { BUSINESS_PATHWAYS, type PathwayId } from '@/data/roadmapTemplates';

const iconMap: Record<string, typeof Code> = {
  Code,
  Factory,
  ShoppingBag,
  Utensils,
  Briefcase,
};

export function StepStartupType({ onNext }: { onNext: () => void }) {
  const profile = useProfileStore();
  const selectedType = profile.startupType;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">What type of business?</h3>
        <p className="text-sm text-muted-foreground">
          This determines your roadmap template and recommended toolkit setup.
        </p>
      </div>

      <div className="space-y-3">
        {BUSINESS_PATHWAYS.map((pathway, index) => {
          const Icon = iconMap[pathway.icon] || Code;
          const isSelected = selectedType === pathway.id;

          return (
            <motion.button
              key={pathway.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              type="button"
              onClick={() => profile.setStartupType(pathway.id as PathwayId)}
              className={cn(
                'group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200',
                'shadow-warm-sm hover:shadow-warm-md',
                isSelected
                  ? 'border-primary bg-primary/[0.04] ring-1 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 transition-colors duration-200',
                  isSelected
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  'text-sm font-semibold mb-0.5 transition-colors',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}>
                  {pathway.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pathway.description}
                </p>
              </div>
              {isSelected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary-foreground">✓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedType}
        className="h-11 px-8 text-sm font-semibold w-full"
      >
        Continue
      </Button>
    </div>
  );
}
