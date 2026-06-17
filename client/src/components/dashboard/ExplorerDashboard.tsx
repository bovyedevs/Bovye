import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sunrise,
  Sunset,
  Star,
  BookOpen,
  TrendingUp,
  Compass,
  Lightbulb,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { useProfileStore } from '@/store/useProfileStore';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration: string | null;
  enrolledStudents: number;
  createdAt: string;
}

const topicAccents = [
  { bg: 'from-violet-500/[0.06] to-card', badgeBg: 'bg-violet-500/10', badgeText: 'text-violet-600 dark:text-violet-400', changeText: 'text-violet-500' },
  { bg: 'from-emerald-500/[0.06] to-card', badgeBg: 'bg-emerald-500/10', badgeText: 'text-emerald-600 dark:text-emerald-400', changeText: 'text-emerald-500' },
  { bg: 'from-sky-500/[0.06] to-card', badgeBg: 'bg-sky-500/10', badgeText: 'text-sky-600 dark:text-sky-400', changeText: 'text-sky-500' },
  { bg: 'from-amber-500/[0.06] to-card', badgeBg: 'bg-amber-500/10', badgeText: 'text-amber-600 dark:text-amber-400', changeText: 'text-amber-500' },
];

const trendingTopics = [
  { title: 'AI & Automation', change: '+24%', category: 'Technology' },
  { title: 'Sustainable Business', change: '+18%', category: 'ESG' },
  { title: 'No-Code Platforms', change: '+15%', category: 'Tools' },
  { title: 'Product-Led Growth', change: '+12%', category: 'Strategy' },
];

const discoveryPrompts = [
  {
    icon: Compass,
    title: 'Explore a New Industry',
    description: 'Step outside your comfort zone and learn how other industries operate.',
    accent: 'violet',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
  },
  {
    icon: Lightbulb,
    title: 'Read a Founder Story',
    description: 'Get inspired by real journeys from idea to exit.',
    accent: 'amber',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: Zap,
    title: 'Try a Micro-Lesson',
    description: 'Spend 10 minutes on a focused topic and level up your knowledge.',
    accent: 'emerald',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
];

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

export default function ExplorerDashboard() {
  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;
  const firstName = useProfileStore((s) => s.firstName);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ courses: Course[] }>('/courses')
      .then((res) => setCourses(res.courses))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          Explore the landscape<span className="bg-gradient-to-r from-amber-500 to-amber-500/70 bg-clip-text text-transparent">.</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground/70">
          {formatDate()}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        <StatCard title="Available Courses" value={loading ? '...' : String(courses.length)} icon={BookOpen} accent="violet" />
        <StatCard title="Trending Topics" value={String(trendingTopics.length)} icon={TrendingUp} accent="emerald" />
        <StatCard title="Discovery Paths" value={String(discoveryPrompts.length)} icon={Compass} accent="amber" />
      </div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Trending Now
            </h2>
          </div>
          <button className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1">
            All trends <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trendingTopics.map((topic, index) => {
            const ac = topicAccents[index % topicAccents.length];

            return (
              <motion.div
                key={topic.title}
                variants={itemVariants}
                className={cn(
                  'rounded-xl border border-border/60 shadow-sm p-4 transition-all duration-200',
                  'bg-gradient-to-br', ac.bg,
                  'hover:shadow-md hover:border-border/80'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full', ac.badgeBg, ac.badgeText)}>
                    {topic.category}
                  </span>
                  <span className={cn('text-xs font-bold', ac.changeText)}>
                    {topic.change}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {topic.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Compass className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Discover Something New
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {discoveryPrompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <motion.div
                key={prompt.title}
                variants={itemVariants}
                className={cn(
                  'group rounded-xl border border-border/60 shadow-sm cursor-pointer transition-all duration-200',
                  'bg-gradient-to-br from-card to-muted/[0.02]',
                  'hover:shadow-md hover:border-border/80 hover:-translate-y-0.5'
                )}
              >
                <div className="p-5">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg mb-3 transition-colors', prompt.iconBg, 'group-hover:opacity-80')}>
                    <Icon className={cn('h-5 w-5', prompt.iconColor)} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    {prompt.title}
                  </h3>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    {prompt.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
              <BookOpen className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Featured Courses
            </h2>
          </div>
          {courses.length > 3 && (
            <button className="text-xs font-semibold text-violet-500 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/10 mb-3">
              <BookOpen className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/[0.02] p-12 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 mb-3">
              <BookOpen className="h-6 w-6 text-violet-500" />
            </div>
            <p className="text-sm font-semibold text-foreground/70">No courses available yet</p>
            <p className="mt-1 text-xs text-muted-foreground/50">
              Check back soon for new learning content
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="rounded-xl border border-border/60 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80"
              >
                <div className="p-5 bg-gradient-to-br from-card to-muted/[0.02]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 mb-3">
                    <BookOpen className="h-5 w-5 text-violet-500" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground truncate mb-1">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground/60">
                    {course.category && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold">
                        {course.category}
                      </span>
                    )}
                    {course.duration && <span>{course.duration}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
