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
  const [workers, setWorkers] = useState(() => {
    const saved = safeGetStorage('buildos_workers', null);
    if (saved && Array.isArray(saved)) return saved;
    return initialWorkersData;
  });
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

  // Automatically sync worker sites with assigned projects whenever projects or workers change
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const nameToProjectMap = {};
    projects.forEach(p => {
      if (!p.name) return;
      if (p.manager) {
        nameToProjectMap[p.manager.trim().toLowerCase()] = p.name;
      }
      if (p.teamMembers && Array.isArray(p.teamMembers)) {
        p.teamMembers.forEach(m => {
          if (m.name) {
            nameToProjectMap[m.name.trim().toLowerCase()] = p.name;
          }
        });
      }
    });

    setWorkers(prevWorkers => {
      if (!prevWorkers || prevWorkers.length === 0) return prevWorkers;
      let needsUpdate = false;
      const updated = prevWorkers.map(w => {
        if (!w.name) return w;
        const assignedProjName = nameToProjectMap[w.name.trim().toLowerCase()];
        if (assignedProjName && w.site !== assignedProjName) {
          needsUpdate = true;
          return { ...w, site: assignedProjName };
        }
        return w;
      });
      return needsUpdate ? updated : prevWorkers;
    });
  }, [projects]);

  // Helper log activity generator
  const logActivity = useCallback((title, site, status, badge = 'lime') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFeed = { time: timeStr, title, site, status, badge };
    setActivityFeed(prev => [newFeed, ...prev.slice(0, 7)]);
  }, []);

  // Notifications Handlers
  const addNotification = useCallback((title, message, category = "Task Assignment", badge = "purple", target = "worker", leaveReqId = null, recipient = null) => {
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

  const clearActivityFeed = useCallback(() => {
    setActivityFeed([]);
    safeSetStorage('buildos_activity', []);
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

    // Automatically sync site for manager
    if (newProj.manager) {
      const mgrName = newProj.manager.trim().toLowerCase();
      setWorkers(prev => prev.map(w => (w.name && w.name.trim().toLowerCase() === mgrName) ? { ...w, site: newProj.name } : w));
    }

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
    let targetProjectName = '';
    setProjects(prev => prev.map(p => {
      if (p.id === Number(id)) {
        const updated = { ...p, ...updatedFields };
        targetProjectName = updated.name;
        return updated;
      }
      return p;
    }));

    // Automatically sync assigned site for manager and team members
    const projectName = updatedFields.name || targetProjectName;
    if (projectName) {
      const namesToUpdate = new Set();
      if (updatedFields.manager) {
        namesToUpdate.add(updatedFields.manager.trim().toLowerCase());
      }
      if (updatedFields.teamMembers && Array.isArray(updatedFields.teamMembers)) {
        updatedFields.teamMembers.forEach(m => {
          if (m.name) namesToUpdate.add(m.name.trim().toLowerCase());
        });
      }

      if (namesToUpdate.size > 0) {
        setWorkers(prev => prev.map(w => {
          if (w.name && namesToUpdate.has(w.name.trim().toLowerCase())) {
            return { ...w, site: projectName };
          }
          return w;
        }));
      }
    }

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
      phone: workerData.phone || '',
      approvalStatus: workerData.approvalStatus || 'Pending Approval'
    };
    setWorkers(prev => [newWorker, ...prev]);
    logActivity(`Worker Registered: ${newWorker.name}`, newWorker.site, 'Roster Updated', 'lime');

    if (newWorker.approvalStatus === 'Pending Approval') {
      addNotification(
        `New Worker Registration: ${newWorker.name}`,
        `Worker ${newWorker.name} (${newWorker.trade}, Contact: ${newWorker.phone || 'N/A'}) registered a new account and requires Admin approval.`,
        "Worker Registration",
        "purple",
        "admin"
      );
    }

    return newWorker;
  }, [logActivity, addNotification]);

  const acceptWorkerRegistration = useCallback((identifier) => {
    let targetName = '';
    const idStr = String(identifier).toLowerCase().trim();

    setWorkers(prev => prev.map(w => {
      const isMatch = w.id === Number(identifier) || 
                      (w.name && w.name.toLowerCase().trim() === idStr) || 
                      (w.name && idStr.includes(w.name.toLowerCase().trim()));
      if (isMatch) {
        targetName = w.name;
        return { ...w, approvalStatus: 'Approved', status: 'Off Duty' };
      }
      return w;
    }));

    // Remove notification from Admin drawer
    setNotifications(prev => prev.filter(n => !(
      n.category === "Worker Registration" && 
      n.target === "admin" && 
      (targetName ? n.title.toLowerCase().includes(targetName.toLowerCase()) || n.message.toLowerCase().includes(targetName.toLowerCase()) : true)
    )));

    if (targetName) {
      addNotification(
        "Worker Registration Accepted! ✓",
        `Admin accepted your worker account registration (${targetName}). You can now clock into shifts on your dashboard.`,
        "Worker Registration",
        "lime",
        "worker",
        null,
        targetName
      );
      logActivity(`Worker Account Accepted: ${targetName}`, 'Site Roster', 'Account Approved', 'lime');
    }
  }, [addNotification, logActivity]);

  const rejectWorkerRegistration = useCallback((identifier) => {
    let targetName = '';
    const idStr = String(identifier).toLowerCase().trim();

    setWorkers(prev => prev.map(w => {
      const isMatch = w.id === Number(identifier) || 
                      (w.name && w.name.toLowerCase().trim() === idStr) || 
                      (w.name && idStr.includes(w.name.toLowerCase().trim()));
      if (isMatch) {
        targetName = w.name;
        return { ...w, approvalStatus: 'Declined', status: 'Off Duty' };
      }
      return w;
    }));

    // Remove notification from Admin drawer
    setNotifications(prev => prev.filter(n => !(
      n.category === "Worker Registration" && 
      n.target === "admin" && 
      (targetName ? n.title.toLowerCase().includes(targetName.toLowerCase()) || n.message.toLowerCase().includes(targetName.toLowerCase()) : true)
    )));

    if (targetName) {
      addNotification(
        "Worker Registration Declined ✕",
        `Admin declined your registration request for ${targetName}. Please contact your site supervisor.`,
        "Worker Registration",
        "purple",
        "worker",
        null,
        targetName
      );
      logActivity(`Worker Account Declined: ${targetName}`, 'Site Roster', 'Account Declined', 'purple');
    }
  }, [addNotification, logActivity]);

  const updateWorker = useCallback((id, updatedFields) => {
    setWorkers(prev => prev.map(w => (w.id === Number(id) || w.name?.toLowerCase() === String(id).toLowerCase()) ? { ...w, ...updatedFields } : w));
    logActivity(`Worker Updated: ${updatedFields.name || 'Worker'}`, updatedFields.site || 'Site', 'Details Saved', 'lime');
  }, [logActivity]);

  const deleteWorker = useCallback((identifier) => {
    if (!identifier) return;
    const idStr = String(identifier).toLowerCase().trim();
    const idNum = Number(identifier);

    const deletedEmails = [];
    const deletedNames = [];

    setWorkers(prev => {
      const filtered = prev.filter(w => {
        const matchId = w.id === identifier || w.id === idNum;
        const matchName = w.name && w.name.toLowerCase().trim() === idStr;
        const matchPartial = w.name && idStr.includes(w.name.toLowerCase().trim());
        if (matchId || matchName || matchPartial) {
          if (w.email) deletedEmails.push(w.email.toLowerCase().trim());
          if (w.name) deletedNames.push(w.name.toLowerCase().trim());
          return false;
        }
        return true;
      });
      safeSetStorage('buildos_workers', filtered);
      return filtered;
    });

    // Also purge matching login accounts from buildos_worker_accounts & clear worker profile cache
    try {
      const savedAccounts = safeGetStorage('buildos_worker_accounts', []);
      if (Array.isArray(savedAccounts)) {
        const remainingAccounts = savedAccounts.filter(acc => {
          const accEmail = acc.email?.toLowerCase().trim();
          const accName = acc.name?.toLowerCase().trim();

          const isDeletedByEmail = Boolean(accEmail && (accEmail === idStr || deletedEmails.includes(accEmail)));
          const isDeletedByName = Boolean(accName && (accName === idStr || deletedNames.includes(accName) || idStr.includes(accName)));

          if (isDeletedByEmail || isDeletedByName) {
            if (accEmail) {
              try {
                localStorage.removeItem(`buildos_worker_profile_${accEmail}`);
              } catch {}
            }
            return false;
          }
          return true;
        });
        safeSetStorage('buildos_worker_accounts', remainingAccounts);
      }
    } catch {}

    // Clear session if logged in user is this deleted worker
    try {
      const activeUser = safeGetStorage('buildos_user', null);
      if (activeUser && activeUser.role === 'worker') {
        const uEmail = activeUser.email?.toLowerCase().trim();
        const uName = activeUser.name?.toLowerCase().trim();
        if (uEmail === idStr || uName === idStr || (uEmail && deletedEmails.includes(uEmail)) || (uName && deletedNames.includes(uName))) {
          localStorage.removeItem('buildos_user');
        }
      }
    } catch {}

    // Remove worker from project team assignments across the whole project
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(p => {
        let changed = false;
        let newMembers = p.teamMembers;
        if (p.teamMembers && Array.isArray(p.teamMembers)) {
          newMembers = p.teamMembers.filter(m => {
            const mName = m.name?.toLowerCase().trim();
            return mName !== idStr && m.id !== idNum && m.id !== identifier;
          });
          if (newMembers.length !== p.teamMembers.length) changed = true;
        }
        let newManager = p.manager;
        if (p.manager && p.manager.toLowerCase().trim() === idStr) {
          newManager = 'Unassigned';
          changed = true;
        }
        return changed ? { ...p, teamMembers: newMembers, manager: newManager } : p;
      });
      safeSetStorage('buildos_projects', updatedProjects);
      return updatedProjects;
    });

    logActivity(`Worker Permanently Deleted`, `Identifier: ${identifier}`, 'Purged from Application', 'purple');
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
    acceptWorkerRegistration,
    rejectWorkerRegistration,
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
    clearActivityFeed,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    addWorker,
    acceptWorkerRegistration,
    rejectWorkerRegistration,
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
