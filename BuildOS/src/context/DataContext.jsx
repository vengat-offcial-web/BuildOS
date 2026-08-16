import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialProjectsData,
  initialWorkersData,
  initialMaterialsData,
  initialMachinesData,
  initialTasksData,
  initialActivityData
} from '../data';

export const DataContext = createContext(null);

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
  } catch {
    // Fallback for quota or restricted browser environments
  }
};

export const initialNotificationsData = [
  {
    id: 1,
    title: "New Task Assigned by Admin",
    message: "Admin Rajesh Kumar assigned you a new task: 'Glass facade panel alignment on Floor 18' for Metro Link – B4",
    time: "10 mins ago",
    category: "Task Assignment",
    unread: true,
    badge: "purple"
  },
  {
    id: 2,
    title: "Assigned to Project Team",
    message: "Admin & Site Engineer R. Sharma assigned you to the Project Team for Metro Line Extension (Zone B4)",
    time: "1 hour ago",
    category: "Team Assignment",
    unread: true,
    badge: "lime"
  },
  {
    id: 3,
    title: "Site Safety Protocol Alert",
    message: "Mandatory morning safety briefing scheduled at Zone B4 hydration bay at 08:00 AM",
    time: "3 hours ago",
    category: "Site Alert",
    unread: false,
    badge: "lime"
  }
];

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => safeGetStorage('buildos_projects', initialProjectsData));
  const [workers, setWorkers] = useState(() => safeGetStorage('buildos_workers', initialWorkersData));
  const [materials, setMaterials] = useState(() => safeGetStorage('buildos_materials', initialMaterialsData));
  const [machines, setMachines] = useState(() => safeGetStorage('buildos_machines', initialMachinesData));
  const [tasks, setTasks] = useState(() => safeGetStorage('buildos_tasks', initialTasksData));
  const [activityFeed, setActivityFeed] = useState(() => safeGetStorage('buildos_activity', initialActivityData));
  const [notifications, setNotifications] = useState(() => safeGetStorage('buildos_notifications', initialNotificationsData));

  // Sync state changes to localStorage
  useEffect(() => { safeSetStorage('buildos_projects', projects); }, [projects]);
  useEffect(() => { safeSetStorage('buildos_workers', workers); }, [workers]);
  useEffect(() => { safeSetStorage('buildos_materials', materials); }, [materials]);
  useEffect(() => { safeSetStorage('buildos_machines', machines); }, [machines]);
  useEffect(() => { safeSetStorage('buildos_tasks', tasks); }, [tasks]);
  useEffect(() => { safeSetStorage('buildos_activity', activityFeed); }, [activityFeed]);
  useEffect(() => { safeSetStorage('buildos_notifications', notifications); }, [notifications]);

  // Helper log activity generator
  const logActivity = useCallback((title, site, status, badge = 'lime') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFeed = { time: timeStr, title, site, status, badge };
    setActivityFeed(prev => [newFeed, ...prev.slice(0, 7)]);
  }, []);

  // Notifications Handlers
  const addNotification = useCallback((title, message, category = "Task Assignment", badge = "purple") => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just Now",
      category,
      unread: true,
      badge
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Action Handlers
  const addProject = useCallback((projectData) => {
    const newProj = {
      id: Date.now(),
      name: projectData.name,
      location: projectData.location || 'Chennai',
      manager: projectData.manager || 'Rajesh Kumar',
      progress: 0,
      status: projectData.status || 'Planning',
      startDate: projectData.startDate || 'Aug 15, 2026',
      deadline: projectData.deadline || 'Feb 15, 2027',
      priority: projectData.priority || 'Medium',
      workforceRequired: projectData.workforceRequired || 25,
      accent: projectData.accent || (projectData.priority === 'Critical' || projectData.priority === 'High' ? 'purple' : 'lime'),
      iconType: 'building',
      budget: '₹1.5 Cr / ₹5.0 Cr',
      description: projectData.description || 'Newly registered construction project development site.'
    };
    setProjects(prev => [newProj, ...prev]);
    logActivity(`Project Assigned: ${newProj.name}`, newProj.location, 'Status: Planning', 'purple');

    // Notify Workers about team assignment
    addNotification(
      "Assigned to New Project Team",
      `Admin assigned team workers to new project '${newProj.name}' at ${newProj.location}. Lead Engineer: ${newProj.manager}`,
      "Team Assignment",
      "purple"
    );

    return newProj;
  }, [logActivity, addNotification]);

  const updateProject = useCallback((id, updatedFields) => {
    setProjects(prev => prev.map(p => p.id === Number(id) ? { ...p, ...updatedFields } : p));
    logActivity(`Project Updated`, `ID #${id}`, 'Changes Saved', 'lime');
  }, [logActivity]);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== Number(id)));
    logActivity(`Project Deleted`, `ID #${id}`, 'Removed', 'purple');
  }, [logActivity]);

  const getProjectById = useCallback((id) => {
    const numId = parseInt(id, 10);
    return projects.find(p => p.id === numId) || projects[0];
  }, [projects]);

  const addWorker = useCallback((workerData) => {
    const newWorker = {
      id: Date.now(),
      name: workerData.name,
      trade: workerData.trade || 'General Construction Specialist',
      site: workerData.site || 'Marina Tower',
      status: 'On Duty',
      attendance: '100%',
      safetyRating: 'A+ Gold',
      phone: workerData.phone || '+91 98765 00000'
    };
    setWorkers(prev => [newWorker, ...prev]);
    logActivity(`Worker Registered: ${newWorker.name}`, newWorker.site, 'Roster Updated', 'lime');
    return newWorker;
  }, [logActivity]);

  const updateWorker = useCallback((id, updatedFields) => {
    setWorkers(prev => prev.map(w => w.id === Number(id) ? { ...w, ...updatedFields } : w));
  }, []);

  const addMaterialOrder = useCallback((orderData) => {
    const newMat = {
      id: Date.now(),
      name: orderData.name,
      category: "General Construction",
      totalStock: orderData.quantity || "500 Units",
      availablePct: 100,
      siteAllocated: orderData.site || "Marina Tower",
      status: "Stocked",
      unitCost: "$120/Unit"
    };
    setMaterials(prev => [newMat, ...prev]);
    logActivity(`Material Dispatched: ${newMat.name}`, newMat.siteAllocated, 'Stock Updated', 'purple');
    return newMat;
  }, [logActivity]);

  const updateMaterial = useCallback((id, updatedFields) => {
    setMaterials(prev => prev.map(m => (m.id === Number(id) || m.name.toLowerCase() === String(id).toLowerCase()) ? { ...m, ...updatedFields } : m));
  }, []);

  const addMachine = useCallback((machineData) => {
    const newMac = {
      id: Date.now(),
      name: machineData.name,
      category: machineData.category || 'Heavy Equipment',
      site: machineData.site || 'Marina Tower',
      operator: machineData.operator || 'Unassigned',
      status: 'Operational',
      healthPct: 100,
      fuelLevel: '100%',
      hoursUsed: '0 hrs'
    };
    setMachines(prev => [newMac, ...prev]);
    logActivity(`Equipment Deployed: ${newMac.name}`, newMac.site, 'Fleet Active', 'lime');
    return newMac;
  }, [logActivity]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      site: taskData.site || 'Marina Tower',
      assignee: 'Vengadesh',
      status: 'Pending',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || 'Tomorrow',
      overdue: false
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity(`Task Assigned: ${newTask.title}`, newTask.site, 'Checklist Updated', 'purple');

    // Notify Workers about task assignment
    addNotification(
      "New Task Assigned by Admin",
      `Admin assigned new task: '${newTask.title}' for site ${newTask.site}`,
      "Task Assignment",
      "purple"
    );

    return newTask;
  }, [logActivity, addNotification]);

  const toggleTaskStatus = useCallback((taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        logActivity(`Task Status Changed`, t.site, nextStatus, 'lime');
        return { ...t, status: nextStatus, overdue: false };
      }
      return t;
    }));
  }, [logActivity]);

  // Derived Dynamic Counts
  const activeProjectsCount = useMemo(() => projects.filter(p => p.status === 'In Progress').length, [projects]);
  const pendingTasksCount = useMemo(() => tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length, [tasks]);
  const overdueTasksCount = useMemo(() => tasks.filter(t => t.overdue).length, [tasks]);

  const contextValue = useMemo(() => ({
    projects,
    workers,
    materials,
    machines,
    tasks,
    activityFeed,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    addWorker,
    updateWorker,
    addMaterialOrder,
    updateMaterial,
    addMachine,
    addTask,
    toggleTaskStatus,
    totalProjectsCount: projects.length,
    activeProjectsCount,
    totalWorkersCount: workers.length + 120, // offset for 128 realistic team
    pendingTasksCount,
    overdueTasksCount
  }), [
    projects,
    workers,
    materials,
    machines,
    tasks,
    activityFeed,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    addWorker,
    updateWorker,
    addMaterialOrder,
    updateMaterial,
    addMachine,
    addTask,
    toggleTaskStatus,
    activeProjectsCount,
    pendingTasksCount,
    overdueTasksCount
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
