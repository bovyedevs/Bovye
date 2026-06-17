import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatCardAccent = 'primary' | 'amber' | 'emerald' | 'violet' | 'rose' | 'sky';

const accentConfig: Record<StatCardAccent, {
  iconBg: string;
  iconColor: string;
  trendBg: string;
  trendText: string;
  shadowColor: string;
}> = {
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    trendBg: 'bg-primary/10',
    trendText: 'text-primary',
    shadowColor: 'shadow-primary/5',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    trendBg: 'bg-amber-500/10',
    trendText: 'text-amber-700',
    shadowColor: 'shadow-amber-500/10',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    trendBg: 'bg-emerald-500/10',
    trendText: 'text-emerald-700',
    shadowColor: 'shadow-emerald-500/10',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    trendBg: 'bg-violet-500/10',
    trendText: 'text-violet-700',
    shadowColor: 'shadow-violet-500/10',
  },
  rose: {
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    trendBg: 'bg-rose-500/10',
    trendText: 'text-rose-700',
    shadowColor: 'shadow-rose-500/10',
  },
  sky: {
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    trendBg: 'bg-rose-500/10',
    trendText: 'text-rose-700',
    shadowColor: 'shadow-rose-500/10',
  },
};

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  accent?: StatCardAccent;
}

export function StatCard({ title, value, icon: Icon, trend, accent = 'primary' }: StatCardProps) {
  const ac = accentConfig[accent];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card
       className={cn(
  'relative h-full overflow-hidden p-6 transition-all duration-300 will-change-transform',
  
  // Light mode
  'bg-white border border-border/40 shadow-xl',
  
  // Dark mode
  'dark:bg-[#0f172a] dark:border-white/10 dark:shadow-black/20',
  
  // Shared
  'rounded-[2rem]',
  ac.shadowColor,

  // Hover
  'hover:shadow-2xl hover:border-border/80 dark:hover:border-white/20'
)}
      >
        <div className="flex items-start justify-between mb-6">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
            ac.iconBg
          )}>
            <Icon className={cn('h-6 w-6 transition-colors duration-300', ac.iconColor)} />
          </div>
          {trend && (
            <Badge
              variant="default"
              className={cn(
                'inline-flex h-6 items-center border-0 px-2.5 text-[11px] font-bold rounded-full transition-colors',
                ac.trendBg, ac.trendText
              )}
            >
              {trend}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-muted-foreground/80 tracking-tight uppercase">
            {title}
          </p>
          <p className="text-4xl font-heading font-black tracking-tighter text-foreground leading-none tabular-nums">
            {value}
          </p>
        </div>
        
        {/* Subtle decorative element */}
        <div className={cn(
          "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-20 pointer-events-none rounded-full",
          ac.iconBg
        )} />
      </Card>
    </motion.div>
  );
}
