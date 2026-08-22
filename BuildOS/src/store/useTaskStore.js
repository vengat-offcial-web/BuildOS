import { create } from 'zustand';
import { initialTasksData } from '../data';
import { useNotificationStore } from './useNotificationStore';

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

export const checkIsOverdue = (dueDateStr, status) => {
  if (status === 'Completed') return false;
  if (!dueDateStr) return false;

  const clean = dueDateStr.toLowerCase().trim();
  if (clean === 'today' || clean === 'tomorrow') return false;
  if (clean === 'yesterday') return true;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dueDateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      d.setHours(0, 0, 0, 0);
      return d < today;
    }

    const parsed = new Date(dueDateStr);
    if (!isNaN(parsed.getTime())) {
      parsed.setHours(0, 0, 0, 0);
      return parsed < today;
    }
  } catch {}

  return false;
};

const initialTasks = (() => {
  const saved = safeGetStorage('buildos_tasks', initialTasksData);
  return (saved || []).filter(t => !(t.site && t.site.toLowerCase().trim().includes('theme park')));
})();

export const useTaskStore = create((set, get) => ({
  tasks: initialTasks,

  get enrichedTasks() {
    return get().tasks.map(t => {
      if (t.status === 'Completed') {
        return { ...t, overdue: false };
      }
      const isOver = checkIsOverdue(t.dueDate, t.status);
      return {
        ...t,
        overdue: Boolean(t.overdue || isOver || t.status === 'Overdue')
      };
    });
  },

  get pendingTasksCount() {
    return get().enrichedTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  },

  get overdueTasksCount() {
    return get().enrichedTasks.filter(t => t.overdue).length;
  },

  addTask: (taskData) => {
    const isOver = checkIsOverdue(taskData.dueDate, taskData.status || 'Pending');
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      site: taskData.site || 'Marina Tower',
      assignee: taskData.assignee || 'General Team',
      category: taskData.category || 'General Operations',
      status: isOver ? 'Overdue' : (taskData.status || 'Pending'),
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || 'Tomorrow',
      overdue: isOver
    };

    set(state => {
      const updated = [newTask, ...state.tasks];
      safeSetStorage('buildos_tasks', updated);
      return { tasks: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Task Assigned: ${newTask.title}`, newTask.site, `Category: ${newTask.category} • Assignee: ${newTask.assignee}`, 'purple');

    notifStore.addNotification(
      `New Task Assigned: ${newTask.title}`,
      `Admin assigned new task '${newTask.title}' (${newTask.category}) to ${newTask.assignee} for site ${newTask.site}. Due: ${newTask.dueDate}`,
      "Task Assignment",
      "purple",
      "worker",
      null,
      newTask.assignee
    );

    return newTask;
  },

  toggleTaskStatus: (taskId) => {
    let updatedTask = null;

    set(state => {
      const updated = state.tasks.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          const isOver = checkIsOverdue(t.dueDate, nextStatus);
          const finalStatus = (nextStatus === 'Pending' && isOver) ? 'Overdue' : nextStatus;
          updatedTask = { ...t, status: finalStatus, overdue: finalStatus === 'Completed' ? false : isOver };
          return updatedTask;
        }
        return t;
      });
      safeSetStorage('buildos_tasks', updated);
      return { tasks: updated };
    });

    if (updatedTask) {
      const notifStore = useNotificationStore.getState();
      notifStore.logActivity(`Task Status Changed`, updatedTask.site, updatedTask.status, 'lime');

      if (updatedTask.status === 'Completed') {
        notifStore.addNotification(
          `Task Completed by Worker ✓`,
          `Worker ${updatedTask.assignee || 'Assigned Worker'} marked task '${updatedTask.title}' as COMPLETED for site ${updatedTask.site}.`,
          "Task Completion",
          "lime",
          "admin"
        );
      }
    }
  },

  deleteTask: (taskId) => {
    let deletedTask = null;

    set(state => {
      deletedTask = state.tasks.find(t => t.id === Number(taskId) || t.id === taskId);
      const remaining = state.tasks.filter(t => t.id !== Number(taskId) && t.id !== taskId);
      safeSetStorage('buildos_tasks', remaining);
      return { tasks: remaining };
    });

    const notifStore = useNotificationStore.getState();
    if (deletedTask) {
      notifStore.logActivity(`Task Removed: ${deletedTask.title}`, deletedTask.site || `ID #${taskId}`, 'Deleted from Site Roster', 'purple');
    } else {
      notifStore.logActivity(`Task Removed`, `ID #${taskId}`, 'Deleted', 'purple');
    }

    return deletedTask;
  },

  updateTask: (taskId, updatedFields) => {
    let targetTask = null;

    set(state => {
      const updated = state.tasks.map(t => {
        if (t.id === Number(taskId) || t.id === taskId) {
          const merged = { ...t, ...updatedFields };
          const isOver = checkIsOverdue(merged.dueDate, merged.status);

          merged.overdue = isOver;
          if (merged.status === 'Completed') {
            merged.overdue = false;
          } else if (isOver) {
            merged.status = 'Overdue';
          } else if (merged.status === 'Overdue' && !isOver) {
            merged.status = 'Pending';
          }

          targetTask = merged;
          return targetTask;
        }
        return t;
      });
      safeSetStorage('buildos_tasks', updated);
      return { tasks: updated };
    });

    if (targetTask) {
      const notifStore = useNotificationStore.getState();
      notifStore.logActivity(`Task Updated: ${targetTask.title}`, targetTask.site, `Status: ${targetTask.status}`, 'lime');
      if (targetTask.assignee) {
        notifStore.addNotification(
          `Task Details Updated: ${targetTask.title}`,
          `Admin updated task details for '${targetTask.title}' (${targetTask.status}, Priority: ${targetTask.priority}, Due: ${targetTask.dueDate})`,
          "Task Assignment",
          "purple",
          "worker",
          null,
          targetTask.assignee
        );
      }
    }
  },

  setTasks: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.tasks) : updater;
      safeSetStorage('buildos_tasks', updated);
      return { tasks: updated };
    });
  }
}));

export default useTaskStore;
