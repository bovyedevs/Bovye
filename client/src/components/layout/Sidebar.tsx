import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Wrench,
  Users,
  GraduationCap,
  ChevronLeft,
  LogOut,
  Settings,
  User,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { NavLink } from '@/types/navigation';
import { useProfileStore } from '@/store/useProfileStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { apiClient } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { ROLE_CONFIG, type UserRole } from '@/data/roleFeatures';
import BovyeLogo from './BovyeLogo';

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  roadmap: Map,
  toolkit: Wrench,
  community: Users,
  learning: GraduationCap,
  profile: User,
};

function getNavLinks(role: UserRole | null): NavLink[] {
  if (!role) return [];

  const config = ROLE_CONFIG[role];
  if (!config) return [];

  return config.navLinks.map((link) => ({
    title: link.title,
    path: link.path,
    icon: iconMap[link.id] || LayoutDashboard,
  }));
}

const sidebarVariants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 28,
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const linkVariants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  link: NavLink;
  active: boolean;
  isOpen: boolean;
  onClick: () => void;
}

function SidebarLink({
  link,
  active,
  isOpen,
  onClick,
}: SidebarLinkProps) {
  const Icon = link.icon;

  const linkContent = (
    <motion.div
      whileHover={{
        y: -4,
        transition: { duration: 0.22 },
      }}
      className="relative"
    >
      <Link
        to={link.path}
        onClick={onClick}
        className={cn(
          'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3',
          'transition-all duration-300',

          active
            ? 'bg-primary/[0.08]'
            : 'hover:bg-primary/[0.04]'
        )}
      >
        {/* HOVER GLOW */}
        <motion.div
          className={cn(
            'absolute -bottom-16 -right-16 h-32 w-32 rounded-full blur-[50px]',
            'pointer-events-none opacity-0 transition-opacity duration-500',
            'bg-primary/30',
            'group-hover:opacity-20',
            active && 'opacity-20'
          )}
        />

        {/* LEFT ACCENT BAR */}
        <motion.div
          layoutId="sidebar-accent-bar"
          className={cn(
            'absolute left-0 top-4 bottom-4 w-[3px] rounded-full',
            'bg-primary shadow-[0_0_14px_rgba(99,102,241,0.7)]',
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
          )}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* ACTIVE BACKGROUND */}
        {active && (
          <motion.div
            layoutId="sidebar-active-bg"
            className={cn(
              'absolute inset-0 rounded-2xl',
              'bg-gradient-to-r from-primary/[0.10] to-primary/[0.03]'
            )}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 26,
            }}
          />
        )}

        {/* ICON */}
        <motion.div
          whileHover={{
            rotate: 5,
            scale: 1.05,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 18,
          }}
          className={cn(
            'relative z-10 flex h-11 w-11 items-center justify-center rounded-xl',
            'transition-all duration-300',

            active
              ? 'bg-primary/15 text-primary'
              : 'bg-primary/[0.06] text-muted-foreground group-hover:text-primary'
          )}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </motion.div>

        {/* TEXT */}
        <div className="relative z-10 flex flex-col">
          <span
            className={cn(
              'text-sm tracking-tight transition-colors duration-300',

              active
                ? 'font-semibold text-foreground'
                : 'font-medium text-muted-foreground group-hover:text-foreground'
            )}
          >
            {link.title}
          </span>

          {/* SMALL UNDERLINE */}
          <motion.div
            animate={{
              width: active ? '100%' : '0%',
              opacity: active ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="mt-1 h-[2px] rounded-full bg-primary/70"
          />
        </div>

        {/* RIGHT LIGHT */}
        <div
          className={cn(
            'absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full',
            'bg-primary/10 blur-2xl',
            'opacity-0 transition-all duration-500',
            'group-hover:opacity-100',
            active && 'opacity-100'
          )}
        />
      </Link>
    </motion.div>
  );

  if (isOpen) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {linkContent}
        </TooltipTrigger>

        <TooltipContent side="right" sideOffset={10}>
          {link.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

export function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const profile = useProfileStore();
  const setAuth = useProfileStore((s) => s.setAuth);

  const displayName = profile.firstName
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : 'Founder';

  const displayInitials =
    profile.firstName && profile.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : 'BO';

  const displayRole = profile.role
    ? profile.role.charAt(0).toUpperCase() +
    profile.role.slice(1)
    : 'Startup Founder';

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (isOpen) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      apiClient.clearToken();

      profile.resetOnboarding();

      setAuth({
        isAuthenticated: false,
        authToken: null,
        userId: null,
      });

      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);

      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col overflow-hidden',

          // glass
          'bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60',

          // dark
          'dark:bg-[#081018]/80 dark:supports-[backdrop-filter]:bg-[#081018]/70',

          // shadows
          'shadow-[0_8px_40px_rgba(0,0,0,0.08)]',
          'dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)]',

          // top lighting
          'before:absolute before:inset-0 before:pointer-events-none',
          'before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_30%)]',
          'dark:before:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_30%)]',

          // bottom glow
          'after:absolute after:bottom-[-120px] after:left-1/2 after:h-[240px] after:w-[240px]',
          'after:-translate-x-1/2 after:rounded-full after:bg-primary/10',
          'after:blur-3xl after:opacity-50 after:pointer-events-none',

          'md:sticky md:top-0 md:translate-x-0',
          !isOpen && 'hidden md:flex'
        )}  
      >
        {/* HEADER */}
        <div className="relative flex h-16 items-center justify-between border-b border-white/10 px-4">
          <BovyeLogo />

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            onClick={onClose}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-6">
          <ul className="space-y-3">
            {getNavLinks(profile.role).map((link) => {
              const active = isActive(link.path);

              return (
                <motion.li
                  key={link.path}
                  variants={linkVariants}
                >
                  <SidebarLink
                    link={link}
                    active={active}
                    isOpen={isOpen}
                    onClick={handleLinkClick}
                  />
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-3 backdrop-blur-xl">
          {/* USER */}
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/40 p-3 dark:bg-white/[0.03]">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {displayInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {displayRole}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            {/* SETTINGS */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1"
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'group relative h-10 w-full overflow-hidden rounded-xl',
                  'text-muted-foreground transition-all duration-300',
                  'hover:border-primary/15',
                  'hover:bg-primary/[0.06]',
                  'hover:text-primary'
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <motion.div
                  whileHover={{ rotate: 40 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-10"
                >
                  <Settings className="h-4 w-4" />
                </motion.div>

                <span className="relative z-10 text-xs font-medium">
                  Settings
                </span>
              </Button>
            </motion.div>

            {/* LOGOUT */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={cn(
                  'group relative h-10 w-20 overflow-hidden rounded-xl px-3',
                  'text-muted-foreground transition-all duration-300 bg-red-500',
                  'hover:border-destructive/20',
                  'hover:bg-destructive/10 hover:text-destructive'
                )}
              >
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <LogOut className="h-4 w-4" />
                </motion.div>

              </Button>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}