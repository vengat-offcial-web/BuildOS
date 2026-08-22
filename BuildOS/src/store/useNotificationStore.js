import { create } from 'zustand';
import { initialActivityData, initialNotificationsData } from '../data';

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const useNotificationStore = create((set, get) => ({
  activityFeed: safeGetStorage('buildos_activity', initialActivityData),
  notifications: safeGetStorage('buildos_notifications', initialNotificationsData),

  logActivity: (title, site, status, badge = 'lime') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFeed = { time: timeStr, title, site, status, badge };
    set(state => {
      const updated = [newFeed, ...state.activityFeed.slice(0, 7)];
      safeSetStorage('buildos_activity', updated);
      return { activityFeed: updated };
    });
  },

  addNotification: (title, message, category = "Task Assignment", badge = "purple", target = "worker", leaveReqId = null, recipient = null) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just Now",
      category,
      unread: true,
      badge,
      target,
      leaveReqId,
      recipient
    };
    set(state => {
      const updated = [newNotif, ...state.notifications];
      safeSetStorage('buildos_notifications', updated);
      return { notifications: updated };
    });
  },

  markNotificationAsRead: (id) => {
    set(state => {
      const updated = state.notifications.map(n => n.id === id ? { ...n, unread: false } : n);
      safeSetStorage('buildos_notifications', updated);
      return { notifications: updated };
    });
  },

  markAllNotificationsAsRead: () => {
    set(state => {
      const updated = state.notifications.map(n => ({ ...n, unread: false }));
      safeSetStorage('buildos_notifications', updated);
      return { notifications: updated };
    });
  },

  clearNotifications: () => {
    set({ notifications: [] });
    safeSetStorage('buildos_notifications', []);
  },

  clearActivityFeed: () => {
    set({ activityFeed: [] });
    safeSetStorage('buildos_activity', []);
  },

  setNotifications: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.notifications) : updater;
      safeSetStorage('buildos_notifications', updated);
      return { notifications: updated };
    });
  },

  setActivityFeed: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.activityFeed) : updater;
      safeSetStorage('buildos_activity', updated);
      return { activityFeed: updated };
    });
  }
}));

export default useNotificationStore;
