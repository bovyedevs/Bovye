export type NotificationType = 'milestone' | 'achievement' | 'reminder' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string; // ISO date
}
