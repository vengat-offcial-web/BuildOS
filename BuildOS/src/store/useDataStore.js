import {
  initialProjectsData,
  initialWorkersData,
  initialMaterialsData,
  initialTasksData,
  initialActivityData,
  initialNotificationsData,
  initialWorkerNotesData
} from '../data';
import { useProjectStore } from './useProjectStore';
import { useWorkerStore } from './useWorkerStore';
import { useMaterialStore, deduplicateMaterials } from './useMaterialStore';
import { useTaskStore } from './useTaskStore';
import { useNotificationStore } from './useNotificationStore';
import { useWorkerNotesStore } from './useWorkerNotesStore';
import { useLeaveRequestStore } from './useLeaveRequestStore';

const initialLeaveRequestsData = [
  {
    id: 101,
    workerName: "Marcoo",
    trade: "Senior Structural Specialist",
    site: "Metro Link – B4",
    date: "2026-08-20",
    reason: "Personal Leave",
    status: "Pending Approval",
    engineer: "R. Sharma (Site Engineer)",
    notes: "Family function in hometown",
    submittedTime: "10 mins ago"
  }
];

export const useDataStore = () => {
  const projectStore = useProjectStore();
  const workerStore = useWorkerStore();
  const materialStore = useMaterialStore();
  const taskStore = useTaskStore();
  const notifStore = useNotificationStore();
  const notesStore = useWorkerNotesStore();
  const leaveStore = useLeaveRequestStore();

  const clearAllData = () => {
    projectStore.setProjects([]);
    workerStore.setWorkers([]);
    materialStore.setMaterials([]);
    taskStore.setTasks([]);
    notifStore.setActivityFeed([]);
    notifStore.setNotifications([]);
    notesStore.setWorkerNotes([]);
    leaveStore.setLeaveRequests([]);

    const keysToClear = [
      'buildos_projects',
      'buildos_workers',
      'buildos_materials',
      'buildos_tasks',
      'buildos_activity',
      'buildos_notifications',
      'buildos_worker_notes',
      'buildos_leave_requests'
    ];
    keysToClear.forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
  };

  const restoreSampleData = () => {
    const cleanMaterials = deduplicateMaterials(initialMaterialsData);
    projectStore.setProjects(initialProjectsData);
    workerStore.setWorkers(initialWorkersData);
    materialStore.setMaterials(cleanMaterials);
    taskStore.setTasks(initialTasksData);
    notifStore.setActivityFeed(initialActivityData);
    notifStore.setNotifications(initialNotificationsData);
    notesStore.setWorkerNotes(initialWorkerNotesData);
    leaveStore.setLeaveRequests(initialLeaveRequestsData);

    try {
      localStorage.setItem('buildos_projects', JSON.stringify(initialProjectsData));
      localStorage.setItem('buildos_workers', JSON.stringify(initialWorkersData));
      localStorage.setItem('buildos_materials', JSON.stringify(cleanMaterials));
      localStorage.setItem('buildos_tasks', JSON.stringify(initialTasksData));
      localStorage.setItem('buildos_activity', JSON.stringify(initialActivityData));
      localStorage.setItem('buildos_notifications', JSON.stringify(initialNotificationsData));
      localStorage.setItem('buildos_worker_notes', JSON.stringify(initialWorkerNotesData));
      localStorage.setItem('buildos_leave_requests', JSON.stringify(initialLeaveRequestsData));
    } catch {}
  };

  return {
    // State Slices
    projects: projectStore.enrichedProjects,
    workers: workerStore.workers,
    materials: materialStore.materials,
    tasks: taskStore.enrichedTasks,
    activityFeed: notifStore.activityFeed,
    notifications: notifStore.notifications,
    workerNotes: notesStore.workerNotes,
    leaveRequests: leaveStore.leaveRequests,

    // Metrics / Counts
    totalProjectsCount: projectStore.totalProjectsCount,
    activeProjectsCount: projectStore.activeProjectsCount,
    pendingProjectsCount: projectStore.pendingProjectsCount,
    totalWorkersCount: workerStore.totalWorkersCount,
    pendingTasksCount: taskStore.pendingTasksCount,
    overdueTasksCount: taskStore.overdueTasksCount,

    // Projects Actions
    addProject: projectStore.addProject,
    updateProject: projectStore.updateProject,
    deleteProject: projectStore.deleteProject,
    cancelProject: projectStore.cancelProject,
    getProjectById: projectStore.getProjectById,

    // Workers Actions
    addWorker: workerStore.addWorker,
    acceptWorkerRegistration: workerStore.acceptWorkerRegistration,
    rejectWorkerRegistration: workerStore.rejectWorkerRegistration,
    updateWorker: workerStore.updateWorker,
    deleteWorker: workerStore.deleteWorker,

    // Materials Actions
    addMaterialOrder: materialStore.addMaterialOrder,
    updateMaterial: materialStore.updateMaterial,
    deleteMaterial: materialStore.deleteMaterial,

    // Tasks Actions
    addTask: taskStore.addTask,
    toggleTaskStatus: taskStore.toggleTaskStatus,
    deleteTask: taskStore.deleteTask,
    updateTask: taskStore.updateTask,

    // Notifications & Feed Actions
    addNotification: notifStore.addNotification,
    markNotificationAsRead: notifStore.markNotificationAsRead,
    markAllNotificationsAsRead: notifStore.markAllNotificationsAsRead,
    clearNotifications: notifStore.clearNotifications,
    clearActivityFeed: notifStore.clearActivityFeed,
    logActivity: notifStore.logActivity,

    // Notes Actions
    addWorkerNote: notesStore.addWorkerNote,
    deleteWorkerNote: notesStore.deleteWorkerNote,
    togglePinNote: notesStore.togglePinNote,
    getWorkerNotes: notesStore.getWorkerNotes,

    // Leave Requests Actions
    addLeaveRequest: leaveStore.addLeaveRequest,
    approveLeaveRequest: leaveStore.approveLeaveRequest,
    rejectLeaveRequest: leaveStore.rejectLeaveRequest,
    deleteLeaveRequest: leaveStore.deleteLeaveRequest,

    // Reset & Restore
    clearAllData,
    restoreSampleData
  };
};

export default useDataStore;
