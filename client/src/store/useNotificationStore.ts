import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationItem } from '@/types/notification';
import { syncNotificationRead, syncNotificationMarkAllRead, syncNotificationDismiss } from '@/services/sync';

interface NotificationState {
  notifications: NotificationItem[];
}

interface NotificationActions {
  addNotification: (notification: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export type NotificationStore = NotificationState & NotificationActions;

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (notification) => {
        const newItem: NotificationItem = {
          ...notification,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newItem, ...state.notifications].slice(0, 50),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));

        syncNotificationRead(id);
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));

        syncNotificationMarkAllRead();
      },

      dismissNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));

        syncNotificationDismiss(id);
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'bovye-notifications',
    }
  )
);
