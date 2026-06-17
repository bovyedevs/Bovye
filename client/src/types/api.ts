export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
  startupType: string | null;
  company: string | null;
  industry: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  createdAt: string;
}

export interface ApiGoal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  linkedTaskIds: string[];
  createdAt: string;
}

export type Goal = Omit<ApiGoal, 'userId'> & {
  description: string;
  deadline: string;
};

export interface ApiNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface ApiTask {
  id: string;
  milestoneId: string;
  title: string;
  status: string;
  duration: string | null;
  assignedDate: string | null;
  order: number;
  dependencies: string[];
}

export interface ApiMilestone {
  id: string;
  phaseId: string;
  title: string;
  isCompleted: boolean;
  order: number;
  tasks: ApiTask[];
}

export interface ApiPhase {
  id: string;
  userId: string;
  templateId: string | null;
  title: string;
  progressPercentage: number;
  order: number;
  milestones: ApiMilestone[];
}

export interface ApiLearningProgress {
  id: string;
  userId: string;
  trackId: string;
  resourceId: string;
  completed: boolean;
}

export interface ApiToolkitData {
  id: string;
  userId: string;
  category: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export interface ApiResponse<T> {
  [key: string]: T | T[] | boolean | string;
}
