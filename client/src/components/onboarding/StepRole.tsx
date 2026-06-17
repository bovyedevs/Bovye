import { Briefcase, TrendingUp, GraduationCap, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useProfileStore, type UserRole } from '@/store/useProfileStore';

const roles: { id: UserRole; label: string; description: string; icon: typeof Briefcase }[] = [
  {
    id: 'founder',
    label: 'Founder',
    description: 'Building a startup from the ground up. Need structure, tools, and execution frameworks.',
    icon: Briefcase,
  },
  {
    id: 'investor',
    label: 'Investor',
    description: 'Evaluating and funding promising startups. Track portfolio and due diligence.',
    icon: TrendingUp,
  },
  {
    id: 'mentor',
    label: 'Mentor',
    description: 'Guiding founders with experience. Share knowledge and review progress.',
    icon: GraduationCap,
  },
  {
    id: 'explorer',
    label: 'Explorer',
    description: 'Curious about startups. Learning the landscape before committing to a path.',
    icon: Eye,
  },
];

const accentConfig = {
  founder: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    glow: 'bg-primary/10',
    border: 'hover:border-primary/30',
  },
  investor: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    glow: 'bg-emerald-500/10',
    border: 'hover:border-emerald-500/30',
  },
  mentor: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    glow: 'bg-amber-500/10',
    border: 'hover:border-amber-500/30',
  },
  explorer: {
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    glow: 'bg-violet-500/10',
    border: 'hover:border-violet-500/30',
  },
};

export function StepRole({ onNext }: { onNext: () => void }) {
  const profile = useProfileStore();
  const selectedRole = profile.role;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          What&apos;s your role?
        </h3>

        <p className="text-sm text-muted-foreground">
          Select the one that best describes what you do. You can change this later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          const ac = accentConfig[role.id];

          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => profile.setRole(role.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="h-full text-left"
            >
              <div
                className={cn(
                  'group relative h-full overflow-hidden rounded-[2rem] border p-6',
                  'transition-all duration-300 will-change-transform',

                  // light mode
                  'bg-white border-border/40 shadow-xl',

                  // dark mode
                  'dark:bg-[#0f172a] dark:border-white/10 dark:shadow-black/20',

                  // hover
                  'hover:shadow-2xl dark:hover:border-white/20',

                  ac.border,

                  isSelected &&
                    'border-primary ring-1 ring-primary/20 bg-primary/[0.03]'
                )}
              >
                {/* TOP */}
                <div className="mb-5 flex items-start justify-between">
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
                      ac.iconBg
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6 transition-colors duration-300',
                        ac.iconColor
                      )}
                    />
                  </motion.div>

                  {/* active indicator */}
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-all duration-300',
                      isSelected
                        ? 'bg-primary shadow-[0_0_14px_rgba(99,102,241,0.9)]'
                        : 'bg-muted'
                    )}
                  />
                </div>

                {/* CONTENT */}
                <div className="space-y-2">
                  <h4
                    className={cn(
                      'text-base font-bold tracking-tight transition-colors duration-300',
                      isSelected
                        ? 'text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {role.label}
                  </h4>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>
                </div>

                {/* GLOW EFFECT */}
                <div
                  className={cn(
                    'absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-300',
                    ac.glow,
                    'group-hover:scale-125 group-hover:opacity-30'
                  )}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedRole}
        className="h-11 px-8 text-sm btn-gradient rounded font-semibold w-full"
      >
        Continue
      </Button>
    </div>
  );
}