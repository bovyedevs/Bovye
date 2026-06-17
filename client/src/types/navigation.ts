import { LucideIcon } from 'lucide-react';

export interface NavLink {
  title: string;
  path: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  links: NavLink[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  initials: string;
}