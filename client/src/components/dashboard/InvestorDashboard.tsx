import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Star, Building2, TrendingUp, Users, ArrowRight, Search } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { useProfileStore } from '@/store/useProfileStore';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

interface FounderInfo {
  id: string;
  name: string;
  email: string;
  startupType: string | null;
  company: string | null;
  industry: string | null;
  bio: string | null;
  createdAt: string;
}

const industryAccents: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  'Technology': { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', iconBg: 'bg-violet-500/10' },
  'Healthcare': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', iconBg: 'bg-emerald-500/10' },
  'Finance': { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', iconBg: 'bg-sky-500/10' },
  'E-commerce': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', iconBg: 'bg-amber-500/10' },
};

function getAccent(industry: string | null) {
  if (!industry) return { bg: 'bg-muted/10', text: 'text-muted-foreground', border: 'border-border', iconBg: 'bg-muted/10' };
  return industryAccents[industry] || { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', iconBg: 'bg-primary/10' };
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: Sunrise };
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: Star };
  return { text: 'Good evening', icon: Sunset };
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

export default function InvestorDashboard() {
  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;
  const firstName = useProfileStore((s) => s.firstName);
  const [founders, setFounders] = useState<FounderInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ founders: FounderInfo[] }>('/users/founders')
      .then((res) => setFounders(res.founders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const industries = new Set(founders.map((f) => f.industry).filter(Boolean));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full p-4 md:p-6 lg:p-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-2.5 text-muted-foreground/80 mb-1.5">
          <GreetingIcon className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide uppercase">
            {greeting.text}{firstName ? `, ${firstName}` : ''}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
          Discover opportunities<span className="bg-gradient-to-r from-sky-500 to-sky-500/70 bg-clip-text text-transparent">.</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground/70">
          {formatDate()}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        <StatCard title="Startups" value={String(founders.length)} icon={Building2} accent="violet" />
        <StatCard title="Industries" value={String(industries.size)} icon={TrendingUp} accent="emerald" />
        <StatCard title="Founders" value={String(founders.length)} icon={Users} accent="sky" />
      </div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
              <Search className="h-3.5 w-3.5 text-sky-500" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Startup Pipeline
            </h2>
            {founders.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500/15 px-1.5 text-[11px] font-bold text-sky-500 tabular-nums">
                {founders.length}
              </span>
            )}
          </div>
          {founders.length > 3 && (
            <button className="text-xs font-semibold text-sky-500 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/10 mb-3">
              <Building2 className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">Loading startups...</p>
          </div>
        ) : founders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/[0.02] p-12 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 mb-3">
              <Building2 className="h-6 w-6 text-violet-500" />
            </div>
            <p className="text-sm font-semibold text-foreground/70">No startups yet</p>
            <p className="mt-1 text-xs text-muted-foreground/50">
              Startups will appear here as they join
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map((founder) => {
              const ac = getAccent(founder.industry);

              return (
                <motion.div
                  key={founder.id}
                  variants={itemVariants}
                  className="rounded-xl border border-border/60 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80"
                >
                  <div className={cn('p-5 bg-gradient-to-br from-card to-muted/[0.02]', ac.border.replace('border-', 'border-l-4').replace('200', '500/20').replace('800', '500/20'))}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0', ac.iconBg)}>
                        <span className={cn('text-sm font-bold', ac.text)}>
                          {founder.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {founder.company || founder.name}
                        </h3>
                        <p className={cn('text-xs font-medium truncate', ac.text)}>
                          {founder.industry || 'General'}
                        </p>
                      </div>
                    </div>

                    {founder.bio && (
                      <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2 mb-3">
                        {founder.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      {founder.startupType && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {founder.startupType}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground/50 font-medium">
                        {new Date(founder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
