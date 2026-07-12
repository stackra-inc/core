/**
 * @fileoverview useNotifications hook — collaboration notification management.
 * @module @stackra/collaboration/hooks
 * @category Hooks
 */

import { useState, useEffect, useCallback } from 'react';

import type { CollaborationNotification } from '@/interfaces/notification.interface';

/** localStorage key for persisting notifications. */
const STORAGE_KEY = 'collab:notifications';

/** Return type for the useNotifications hook. */
interface UseNotificationsReturn {
  /** All notifications (newest first). */
  notifications: CollaborationNotification[];

  /** Mark a single notification as read. */
  markRead: (id: string) => void;

  /** Mark all notifications as read. */
  markAllRead: () => void;

  /** Count of unread notifications. */
  unreadCount: number;

  /** Add a notification (used internally by other hooks). */
  addNotification: (
    notification: Omit<CollaborationNotification, 'id' | 'read' | 'createdAt'>
  ) => void;
}

/**
 * React hook for managing collaboration notifications.
 *
 * Listens for mention events, replies, and state changes. Persists
 * notifications to localStorage for cross-session persistence.
 *
 * @returns Notification state and actions.
 *
 * @example
 * ```tsx
 * function NotificationBell() {
 *   const { notifications, markAllRead, unreadCount } = useNotifications();
 *
 *   return (
 *     <div>
 *       <button onClick={markAllRead}>
 *         🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
 *       </button>
 *       {notifications.map((n) => (
 *         <div key={n.id} className={n.read ? 'opacity-50' : ''}>
 *           {n.message}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<CollaborationNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CollaborationNotification[]) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // localStorage unavailable
    }
  }, [notifications]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<CollaborationNotification, 'id' | 'read' | 'createdAt'>) => {
      const full: CollaborationNotification = {
        ...notification,
        id: Math.random().toString(36).slice(2, 10),
        read: false,
        createdAt: Date.now(),
      };
      setNotifications((prev) => [full, ...prev].slice(0, 50));
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, markRead, markAllRead, unreadCount, addNotification };
}
