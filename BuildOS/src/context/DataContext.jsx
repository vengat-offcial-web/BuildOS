import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialProjectsData,
  initialWorkersData,
  initialMaterialsData,
  initialMachinesData,
  initialTasksData,
  initialActivityData,
  initialNotificationsData,
  initialWorkerNotesData
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

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => safeGetStorage('buildos_projects', initialProjectsData));
  const [workers, setWorkers] = useState(() => safeGetStorage('buildos_workers', initialWorkersData));
  const [materials, setMaterials] = useState(() => safeGetStorage('buildos_materials', initialMaterialsData));
  const [machines, setMachines] = useState(() => safeGetStorage('buildos_machines', initialMachinesData));
  const [tasks, setTasks] = useState(() => safeGetStorage('buildos_tasks', initialTasksData));
  const [activityFeed, setActivityFeed] = useState(() => safeGetStorage('buildos_activity', initialActivityData));
  const [notifications, setNotifications] = useState(() => safeGetStorage('buildos_notifications', initialNotificationsData));
  const [workerNotes, setWorkerNotes] = useState(() => safeGetStorage('buildos_worker_notes', initialWorkerNotesData));
  const [leaveRequests, setLeaveRequests] = useState(() => safeGetStorage('buildos_leave_requests', initialLeaveRequestsData));

  // Sync state changes to localStorage
  useEffect(() => { safeSetStorage('buildos_projects', projects); }, [projects]);
  useEffect(() => { safeSetStorage('buildos_workers', workers); }, [workers]);
  useEffect(() => { safeSetStorage('buildos_materials', materials); }, [materials]);
  useEffect(() => { safeSetStorage('buildos_machines', machines); }, [machines]);
  useEffect(() => { safeSetStorage('buildos_tasks', tasks); }, [tasks]);
  useEffect(() => { safeSetStorage('buildos_activity', activityFeed); }, [activityFeed]);
  useEffect(() => { safeSetStorage('buildos_notifications', notifications); }, [notifications]);
  useEffect(() => { safeSetStorage('buildos_worker_notes', workerNotes); }, [workerNotes]);
  useEffect(() => { safeSetStorage('buildos_leave_requests', leaveRequests); }, [leaveRequests]);

  // Helper log activity generator
  const logActivity = useCallback((title, site, status, badge = 'lime') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFeed = { time: timeStr, title, site, status, badge };
    setActivityFeed(prev => [newFeed, ...prev.slice(0, 7)]);
  }, []);

  // Notifications Handlers
  const addNotification = useCallback((title, message, category = "Task Assignment", badge = "purple", target = "worker", leaveReqId = null) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just Now",
      category,
      unread: true,
      badge,
      target,
      leaveReqId
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
      site: workerData.site || 'Not Assigned Yet',
      status: workerData.status || 'Off Duty',
      attendance: workerData.attendance || 'Absent',
      phone: workerData.phone || ''
    };
    setWorkers(prev => [newWorker, ...prev]);
    logActivity(`Worker Registered: ${newWorker.name}`, newWorker.site, 'Roster Updated', 'lime');
    return newWorker;
  }, [logActivity]);

  const updateWorker = useCallback((id, updatedFields) => {
    setWorkers(prev => prev.map(w => (w.id === Number(id) || w.name?.toLowerCase() === String(id).toLowerCase()) ? { ...w, ...updatedFields } : w));
    logActivity(`Worker Updated: ${updatedFields.name || 'Worker'}`, updatedFields.site || 'Site', 'Details Saved', 'lime');
  }, [logActivity]);

  const deleteWorker = useCallback((id) => {
    setWorkers(prev => prev.filter(w => w.id !== id && w.id !== Number(id) && w.name?.toLowerCase() !== String(id).toLowerCase()));
    logActivity(`Worker Removed`, `Worker #${id}`, 'Roster Updated', 'purple');
  }, [logActivity]);

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

  // Worker Notes & Chat Handlers
  const addWorkerNote = useCallback((noteData) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNote = {
      id: Date.now(),
      workerName: noteData.workerName || 'Mathan',
      text: noteData.text,
      category: noteData.category || 'General Note',
      senderRole: noteData.senderRole || 'admin',
      senderName: noteData.senderName || (noteData.senderRole === 'worker' ? noteData.workerName || 'Worker' : 'Rajesh Kumar (Project Director)'),
      time: `Today, ${timeStr}`,
      isUrgent: !!noteData.isUrgent,
      isPinned: false
    };
    setWorkerNotes(prev => [newNote, ...prev]);
    logActivity(`Worker Chat Note: ${newNote.workerName}`, 'Site Communication', `Note: ${newNote.category}`, newNote.isUrgent ? 'purple' : 'lime');
    
    // Trigger notification if sent by admin to worker or worker to admin
    if (noteData.senderRole === 'admin') {
      addNotification(
        `New Message from Site Admin`,
        `Admin sent note to ${newNote.workerName}: "${newNote.text.slice(0, 60)}..."`,
        "Worker Chat",
        "purple"
      );
    }
    return newNote;
  }, [logActivity, addNotification]);

  const deleteWorkerNote = useCallback((noteId) => {
    setWorkerNotes(prev => prev.filter(n => n.id !== Number(noteId)));
  }, []);

  const togglePinNote = useCallback((noteId) => {
    setWorkerNotes(prev => prev.map(n => n.id === Number(noteId) ? { ...n, isPinned: !n.isPinned } : n));
  }, []);

  const getWorkerNotes = useCallback((name) => {
    if (!name) return workerNotes;
    return workerNotes.filter(n => n.workerName?.toLowerCase() === name.toLowerCase());
  }, [workerNotes]);

  // Leave Request Handlers
  const addLeaveRequest = useCallback((reqData) => {
    const newReq = {
      id: Date.now(),
      workerName: reqData.workerName || "Marcoo",
      trade: reqData.trade || "Senior Structural Specialist",
      site: reqData.site || "Metro Link – B4",
      date: reqData.date,
      reason: reqData.reason || "Medical Leave",
      status: "Pending Approval",
      engineer: reqData.engineer || "R. Sharma (Site Engineer)",
      notes: reqData.notes || "",
      submittedTime: "Just Now"
    };
    setLeaveRequests(prev => [newReq, ...prev]);

    // Send notification to Admin
    addNotification(
      `Leave Request: ${newReq.workerName}`,
      `Worker ${newReq.workerName} (${newReq.trade}) requested ${newReq.reason} for ${newReq.date}. ${newReq.notes ? `Note: "${newReq.notes}"` : ''}`,
      "Leave Request",
      "purple",
      "admin",
      newReq.id
    );

    return newReq;
  }, [addNotification]);

  const approveLeaveRequest = useCallback((reqId) => {
    const numId = Number(reqId);
    let approvedItem = null;
    
    setLeaveRequests(prev => prev.map(r => {
      if (r.id === numId) {
        approvedItem = { ...r, status: "Approved" };
        return approvedItem;
      }
      return r;
    }));

    // Automatically remove the processed leave request notification from Admin's notification drawer
    setNotifications(prev => prev.filter(n => !(
      n.leaveReqId === numId || 
      (n.category === "Leave Request" && n.target === "admin" && (approvedItem ? n.title.includes(approvedItem.workerName) : true))
    )));

    if (approvedItem) {
      // Send notification directly to Worker Dashboard
      addNotification(
        "Leave Request Approved! ✓",
        `Site Engineer R. Sharma approved your ${approvedItem.reason} request for ${approvedItem.date}.`,
        "Leave Request",
        "lime",
        "worker",
        numId
      );
      logActivity(`Leave Approved: ${approvedItem.workerName}`, approvedItem.site, 'Status: Approved', 'lime');
    }
  }, [addNotification, logActivity]);

  const rejectLeaveRequest = useCallback((reqId) => {
    const numId = Number(reqId);
    let rejectedItem = null;
    
    setLeaveRequests(prev => prev.map(r => {
      if (r.id === numId) {
        rejectedItem = { ...r, status: "Declined" };
        return rejectedItem;
      }
      return r;
    }));

    // Automatically remove the processed leave request notification from Admin's notification drawer
    setNotifications(prev => prev.filter(n => !(
      n.leaveReqId === numId || 
      (n.category === "Leave Request" && n.target === "admin" && (rejectedItem ? n.title.includes(rejectedItem.workerName) : true))
    )));

    if (rejectedItem) {
      // Send notification directly to Worker Dashboard
      addNotification(
        "Leave Request Declined ✕",
        `Site Engineer R. Sharma declined your ${rejectedItem.reason} request for ${rejectedItem.date}. Please check with supervisor.`,
        "Leave Request",
        "purple",
        "worker",
        numId
      );
      logActivity(`Leave Declined: ${rejectedItem.workerName}`, rejectedItem.site, 'Status: Declined', 'purple');
    }
  }, [addNotification, logActivity]);

  const deleteLeaveRequest = useCallback((reqId) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== Number(reqId)));
  }, []);

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
    workerNotes,
    leaveRequests,
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
    deleteWorker,
    addMaterialOrder,
    updateMaterial,
    addMachine,
    addTask,
    toggleTaskStatus,
    addWorkerNote,
    deleteWorkerNote,
    togglePinNote,
    getWorkerNotes,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
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
    workerNotes,
    leaveRequests,
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
    deleteWorker,
    addMaterialOrder,
    updateMaterial,
    addMachine,
    addTask,
    toggleTaskStatus,
    addWorkerNote,
    deleteWorkerNote,
    togglePinNote,
    getWorkerNotes,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
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
