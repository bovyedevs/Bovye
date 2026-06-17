export type TaskStatus = 'pending' | 'in-progress' | 'done' | 'skipped';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  duration: string;
  assignedDate?: string;
  order: number;
  dependencies?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  tasks: Task[];
}

export interface Phase {
  id: string;
  title: string;
  progressPercentage: number;
  milestones: Milestone[];
}

export type NodeCategory =
  | 'foundation'
  | 'operations'
  | 'product'
  | 'engineering'
  | 'growth'
  | 'scale'
  | 'legal'
  | 'finance'
  | 'hr'
  | 'marketing'
  | 'technology'
  | 'go-to-market'
  | 'production'
  | 'sales'
  | 'delivery';

export interface NodeSubTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface RoadmapNode {
  id: string;
  title: string;
  category: NodeCategory;
  description: string;
  subtasks: NodeSubTask[];
  duration: string;
  column: number;
  row: number;
  dependencies: string[];
  resources?: { label: string; url: string }[];
}

export interface NodeConnection {
  from: string;
  to: string;
}

export interface BusinessPathway {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  nodes: RoadmapNode[];
  connections: NodeConnection[];
  columnLabels: string[];
}
