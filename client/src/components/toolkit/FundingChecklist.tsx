import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToolkitStore } from '@/store/useToolkitStore';

function StageProgress({ total, checked }: { total: number; checked: number }) {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular-nums text-muted-foreground font-medium">
        {checked}/{total}
      </span>
      {pct === 100 && (
        <Check className="h-3 w-3 text-emerald-500" />
      )}
    </div>
  );
}

function FundingStageCard({
  stageId,
  label,
  description,
  items,
  isOpen,
  onToggle,
}: {
  stageId: string;
  label: string;
  description: string;
  items: { id: string; label: string; checked: boolean }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const toggleFundingItem = useToolkitStore((s) => s.toggleFundingItem);
  const checked = items.filter((i) => i.checked).length;

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              checked === items.length && items.length > 0
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {checked === items.length && items.length > 0 ? (
              <Check className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-foreground">{label}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StageProgress total={items.length} checked={checked} />
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border">
              <ul className="space-y-2 mt-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <label
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150',
                        item.checked
                          ? 'bg-muted/30'
                          : 'hover:bg-muted/20'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border transition-all duration-200',
                          item.checked
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-card'
                        )}
                      >
                        {item.checked && <Check className="h-3 w-3" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleFundingItem(stageId, item.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          'text-sm transition-colors',
                          item.checked
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'
                        )}
                      >
                        {item.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FundingChecklist() {
  const [openStage, setOpenStage] = useState<string>('pre-seed');
  const stages = useToolkitStore((s) => s.fundingChecklist.stages);

  const totalItems = stages.reduce((a, s) => a + s.items.length, 0);
  const totalChecked = stages.reduce(
    (a, s) => a + s.items.filter((i) => i.checked).length,
    0
  );
  const overallPct = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Funding Checklist</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Track readiness across Pre-Seed, Seed, and Series A stages
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {overallPct}%
          </span>
          <p className="text-xs text-muted-foreground">overall readiness</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Total Progress
          </span>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {totalChecked}/{totalItems} items
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {stages.map((stage) => (
          <FundingStageCard
            key={stage.id}
            stageId={stage.id}
            label={stage.label}
            description={stage.description}
            items={stage.items}
            isOpen={openStage === stage.id}
            onToggle={() =>
              setOpenStage(openStage === stage.id ? '' : stage.id)
            }
          />
        ))}
      </div>
    </div>
  );
}
