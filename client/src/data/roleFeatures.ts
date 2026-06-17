export type UserRole = 'founder' | 'investor' | 'mentor' | 'explorer';

export interface RoleNavConfig {
  id: string;
  title: string;
  path: string;
}

export interface RoleConfig {
  label: string;
  tagline: string;
  description: string;
  dashboardGreeting: string;
  navLinks: RoleNavConfig[];
  features: string[];
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  founder: {
    label: 'Founder',
    tagline: 'Build. Execute. Scale.',
    description: 'You are building a startup from the ground up.',
    dashboardGreeting: 'Build your startup',
    navLinks: [
      { id: 'dashboard', title: 'Dashboard', path: '/' },
      { id: 'roadmap', title: 'Roadmap', path: '/roadmap' },
      { id: 'toolkit', title: 'Toolkit', path: '/toolkit' },
      { id: 'community', title: 'Community', path: '/community' },
      { id: 'learning', title: 'Learning Hub', path: '/learning-hub' },
      { id: 'profile', title: 'Profile', path: '/profile' },
    ],
    features: ['roadmap', 'toolkit', 'goals', 'streak', 'xp'],
  },
  investor: {
    label: 'Investor',
    tagline: 'Discover. Evaluate. Invest.',
    description: 'You track and evaluate promising startups.',
    dashboardGreeting: 'Discover opportunities',
    navLinks: [
      { id: 'dashboard', title: 'Dashboard', path: '/' },
      { id: 'community', title: 'Startups', path: '/community' },
      { id: 'learning', title: 'Learning Hub', path: '/learning-hub' },
      { id: 'profile', title: 'Profile', path: '/profile' },
    ],
    features: ['company-directory', 'portfolio-tracker', 'analytics'],
  },
  mentor: {
    label: 'Mentor',
    tagline: 'Guide. Teach. Impact.',
    description: 'You share experience and guide founders.',
    dashboardGreeting: 'Share your expertise',
    navLinks: [
      { id: 'dashboard', title: 'Dashboard', path: '/' },
      { id: 'community', title: 'Community', path: '/community' },
      { id: 'learning', title: 'Learning Hub', path: '/learning-hub' },
      { id: 'profile', title: 'Profile', path: '/profile' },
    ],
    features: ['courses', 'mentee-requests', 'sessions'],
  },
  explorer: {
    label: 'Explorer',
    tagline: 'Learn. Discover. Decide.',
    description: 'You are exploring the startup landscape.',
    dashboardGreeting: 'Explore the landscape',
    navLinks: [
      { id: 'dashboard', title: 'Dashboard', path: '/' },
      { id: 'community', title: 'Community', path: '/community' },
      { id: 'learning', title: 'Learning Hub', path: '/learning-hub' },
      { id: 'profile', title: 'Profile', path: '/profile' },
    ],
    features: ['learning', 'discover', 'trends'],
  },
};
