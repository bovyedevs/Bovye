import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Trophy,
  Target,
  Coffee,
  Sunrise,
  Sunset,
  Star,
  ArrowRight,
  Brain,
  Compass,
  Zap,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskCard } from '@/components/roadmap/TaskCard';
import { PhaseTimeline } from '@/components/roadmap/PhaseTimeline';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { WeeklySummary } from '@/components/dashboard/WeeklySummary';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8
    },
  },
};

export default function FounderDashboard() {
  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;
  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const phases = useRoadmapStore((s) => s.phases);
  const activePhaseId = useRoadmapStore((s) => s.activePhaseId);
  const currentStreak = useRoadmapStore((s) => s.currentStreak);
  const xp = useRoadmapStore((s) => s.xp);
  const toggleTaskCompletion = useRoadmapStore((s) => s.toggleTaskCompletion);
  const setActivePhase = useRoadmapStore((s) => s.setActivePhase);
  const firstName = useProfileStore((s) => s.firstName);

  const activePhase = phases.find((p) => p.id === activePhaseId);

  useEffect(() => {
    if (!activePhaseId && phases.length > 0) {
      setActivePhase(phases[0].id);
    }
  }, [activePhaseId, phases, setActivePhase]);

  const allTasks = phases.flatMap((p) => p.milestones.flatMap((m) => m.tasks));
  const totalDone = allTasks.filter((t) => t.status === 'done').length;
  const totalTasks = allTasks.length;
  const completionPct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasks = activePhase
    ? activePhase.milestones
      .flatMap((m) => m.tasks)
      .filter((t) => t.status !== 'done' && (!t.assignedDate || t.assignedDate <= todayStr))
      .slice(0, 5)
    : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full pb-20 overflow-hidden"
    >
      {/* Premium Hero Section - Based on Image 1 */}
      <section className="relative pt-12 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Soft Background Orbs - Optimized blur for performance */}
        <div className="absolute top-0 right-0 w-[40%] h-[80%] bg-orange-400/5 blur-[80px] pointer-events-none transform-gpu" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-purple-400/5 blur-[80px] pointer-events-none transform-gpu" />
        <div className="flex items-center gap-2.5 text-muted-foreground/80 mb-1.5">
          <GreetingIcon className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide uppercase">
            {greeting.text}{firstName ? `, ${firstName}` : ''}
          </span>
        </div>
        <div className="max-w-4xl relative z-10">
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-white border border-border/60 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5 shadow-sm">
              <span className="text-red-500 text-xs">★</span> The Execution OS for Founders
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-foreground mb-6 leading-[0.95]"
          >
            You don't need more ideas.<br />
            You need to <span className="gradient-text italic">execute.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mb-10 leading-relaxed"
          >
            Bovye takes you from scattered idea to structured launch — with clarity, not chaos.
            Welcome back, <span className="text-foreground font-bold">{firstName || 'Founder'}</span>.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="btn-gradient h-14 px-10 rounded-2xl text-lg group">
              Resume Mission <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm font-bold text-muted-foreground/60 ml-2">
              Free · No credit card needed
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section - Based on Image 3 */}
      <section className="px-6 md:px-12 lg:px-20 mb-20">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-4">
            Dreaming is easy.
          </h2>

          <p className="text-lg text-muted-foreground font-medium italic">
            Execution is the hard part.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Too many ideas, zero clarity",
              desc: "You have 47 notes, 12 voice memos, and no idea which one to start with.",
              icon: Brain,
              color: "text-orange-500",
              bgColor: "bg-orange-500/10",
              glow: "#FF6B00",
              borderColor: "bg-orange-500",
            },
            {
              title: "No clear first step",
              desc: "You've googled 'how to start a startup' 200 times. Still paralyzed.",
              icon: Compass,
              color: "text-pink-500",
              bgColor: "bg-pink-500/10",
              glow: "#FF0080",
              borderColor: "bg-pink-500",
            },
            {
              title: "Execution paralysis",
              desc: "Motivation fades. Plans collect dust. Another month passes. Nothing ships.",
              icon: Zap,
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
              glow: "#9B00FF",
              borderColor: "bg-purple-500",
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={cn(
                "p-8 rounded-[2rem] border shadow-xl group relative overflow-hidden cursor-pointer transition-all duration-300",

                // Light
                "bg-white border-border/40 shadow-primary/5",

                // Dark
                "dark:bg-[#0f172a] dark:border-white/10 dark:shadow-black/20",

                // Hover
                "hover:-translate-y-1"
              )}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-20 transition-all duration-500"
                style={{ backgroundColor: feature.glow }}
              />

              {/* Top Border Animation */}
              <motion.div
                className={cn(
                  "absolute top-0 left-0 h-[2px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                  feature.borderColor
                )}
              />

              {/* Floating Icon */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                whileHover={{
                  rotate: 10,
                  scale: 1.12,
                }}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("h-7 w-7", feature.color)} />
              </motion.div>

              <h3 className="text-xl font-heading font-black mb-3 text-foreground tracking-tight leading-none relative z-10">
                {feature.title}
              </h3>

              <p className="text-muted-foreground font-medium leading-relaxed relative z-10">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Operational Dashboard - Current Stats */}
      <section className="px-6 md:px-12 lg:px-20 space-y-12">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-black tracking-tight text-foreground">
            Current Operations
          </h2>
          <span className="text-sm font-bold text-muted-foreground/60">{formatDate()}</span>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Current Streak"
            value={`${currentStreak} Days`}
            icon={Flame}
            trend="+2 from last week"
            accent="amber"
          />
          <StatCard
            title="XP Earned"
            value={xp.toLocaleString()}
            icon={Trophy}
            trend={`+${totalDone * 50} from completions`}
            accent="primary"
          />
          <StatCard
            title="Roadmap Progress"
            value={`${completionPct}%`}
            icon={Target}
            accent="emerald"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-black tracking-tight text-foreground">
                Active Roadmap
              </h3>
            </div>
            <GoalsWidget />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-heading font-black tracking-tight text-foreground">
              Velocity
            </h3>
            <WeeklySummary />
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tasks and Phase components here - kept but styled to match */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-black tracking-tight text-foreground">Today's Focus</h3>
              </div>
            </div>
            <div className="space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onAction={toggleTaskCompletion} />
                ))
              ) : (
                <div className="p-8 rounded-3xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center">
                  <Target className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-bold text-muted-foreground">Focus cleared for today.</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-black tracking-tight text-foreground">Current Phase</h3>
              </div>
            </div>
            {activePhase ? (
              <div
                className={cn(
                  "p-1 rounded-3xl border shadow-xl transition-colors duration-300",
                  "bg-white border-border/40 shadow-primary/5",
                  "dark:bg-[#0f172a] dark:border-white/10 dark:shadow-black/20"
                )}
              >
                <PhaseTimeline phase={activePhase} />
              </div>
            ) : (
              <div className="p-8 rounded-3xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-muted-foreground">Select a phase to track progress.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
