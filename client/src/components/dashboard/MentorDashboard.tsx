import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sunrise,
  Sunset,
  Star,
  BookOpen,
  Users,
  Clock,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
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

const categoryAccents: Record<string, { iconBg: string; iconColor: string; badgeBg: string; badgeText: string }> = {
  'Technology': { iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500', badgeBg: 'bg-violet-500/10', badgeText: 'text-violet-600 dark:text-violet-400' },
  'Business': { iconBg: 'bg-sky-500/10', iconColor: 'text-sky-500', badgeBg: 'bg-sky-500/10', badgeText: 'text-sky-600 dark:text-sky-400' },
  'Marketing': { iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500', badgeBg: 'bg-amber-500/10', badgeText: 'text-amber-600 dark:text-amber-400' },
  'Design': { iconBg: 'bg-rose-500/10', iconColor: 'text-rose-500', badgeBg: 'bg-rose-500/10', badgeText: 'text-rose-600 dark:text-rose-400' },
};

function getCategoryAccent(category: string | null) {
  if (!category) return { iconBg: 'bg-primary/10', iconColor: 'text-primary', badgeBg: 'bg-primary/10', badgeText: 'text-primary' };
  return categoryAccents[category] || { iconBg: 'bg-primary/10', iconColor: 'text-primary', badgeBg: 'bg-primary/10', badgeText: 'text-primary' };
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

export default function MentorDashboard() {
  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;
  const firstName = useProfileStore((s) => s.firstName);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    apiClient.get<{ courses: Course[] }>('/courses')
      .then((res) => setCourses(res.courses))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledStudents, 0);
  const totalCourses = courses.length;
  const avgDuration = courses.length > 0 ? `${Math.round(courses.reduce((sum, c) => sum + parseInt(c.duration || '0'), 0) / totalCourses)}h` : '0h';

  const handleDeleteCourse = (id: string) => {
    apiClient.del(`/courses/${id}`)
      .then(() => setCourses((prev) => prev.filter((c) => c.id !== id)))
      .catch(() => {});
  };

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
          Share your expertise<span className="bg-gradient-to-r from-violet-500 to-violet-500/70 bg-clip-text text-transparent">.</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground/70">
          {formatDate()}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        <StatCard title="Total Students" value={String(totalStudents)} icon={Users} accent="emerald" />
        <StatCard title="Courses Published" value={String(totalCourses)} icon={BookOpen} accent="violet" />
        <StatCard title="Avg. Duration" value={avgDuration} icon={Clock} accent="sky" />
      </div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
              <BookOpen className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Your Courses
            </h2>
            {courses.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/15 px-1.5 text-[11px] font-bold text-violet-500 tabular-nums">
                {courses.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-500 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            New Course
          </button>
        </div>

        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-border/60 bg-gradient-to-br from-card to-violet-500/[0.02] p-5 shadow-sm"
          >
            <h3 className="text-sm font-bold text-foreground mb-2">Create a Course</h3>
            <p className="text-xs text-muted-foreground/60">
              Course creation is coming soon. For now, browse your existing courses below.
            </p>
          </motion.div>
        )}

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
            <p className="text-sm font-semibold text-foreground/70">No courses yet</p>
            <p className="mt-1 text-xs text-muted-foreground/50">
              Create your first course to start teaching
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const ac = getCategoryAccent(course.category);

              return (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  className="rounded-xl border border-border/60 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80"
                >
                  <div className="p-5 bg-gradient-to-br from-card to-muted/[0.02]">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', ac.iconBg)}>
                        <BookOpen className={cn('h-5 w-5', ac.iconColor)} />
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground/50 hover:text-foreground transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-foreground truncate mb-1">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2 mb-3">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap text-[11px] font-medium">
                      {course.category && (
                        <span className={cn('px-2 py-0.5 rounded-full', ac.badgeBg, ac.badgeText)}>
                          {course.category}
                        </span>
                      )}
                      {course.duration && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground/60">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-muted-foreground/60">
                        <Users className="h-3 w-3" />
                        {course.enrolledStudents} students
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
              <MessageSquare className="h-3.5 w-3.5 text-sky-500" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Session Requests
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/[0.02] p-12 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 mb-3">
            <MessageSquare className="h-6 w-6 text-sky-500" />
          </div>
          <p className="text-sm font-semibold text-foreground/70">No pending requests</p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            Mentees can book 1:1 sessions once you open your calendar
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
