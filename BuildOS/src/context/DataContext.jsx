import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialProjectsData,
  initialWorkersData,
  initialMaterialsData,
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

const deduplicateMaterials = (matList) => {
  if (!Array.isArray(matList)) return [];
  const seen = new Set();
  return matList.filter(item => {
    if (!item) return false;
    const key = (item.name || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => safeGetStorage('buildos_projects', initialProjectsData));
  const [workers, setWorkers] = useState(() => {
    const saved = safeGetStorage('buildos_workers', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return initialWorkersData;
  });
  const [materials, setMaterials] = useState(() => {
    const saved = safeGetStorage('buildos_materials', initialMaterialsData);
    const list = Array.isArray(saved) && saved.length > 0 ? saved : initialMaterialsData;
    return deduplicateMaterials(list);
  });
  const [tasks, setTasks] = useState(() => safeGetStorage('buildos_tasks', initialTasksData));
  const [activityFeed, setActivityFeed] = useState(() => safeGetStorage('buildos_activity', initialActivityData));
  const [notifications, setNotifications] = useState(() => safeGetStorage('buildos_notifications', initialNotificationsData));
  const [workerNotes, setWorkerNotes] = useState(() => safeGetStorage('buildos_worker_notes', initialWorkerNotesData));
  const [leaveRequests, setLeaveRequests] = useState(() => safeGetStorage('buildos_leave_requests', initialLeaveRequestsData));

  // Sync state changes to localStorage
  useEffect(() => { safeSetStorage('buildos_projects', projects); }, [projects]);
  useEffect(() => { safeSetStorage('buildos_workers', workers); }, [workers]);
  useEffect(() => { safeSetStorage('buildos_materials', materials); }, [materials]);
  useEffect(() => { safeSetStorage('buildos_tasks', tasks); }, [tasks]);
  useEffect(() => { safeSetStorage('buildos_activity', activityFeed); }, [activityFeed]);
  useEffect(() => { safeSetStorage('buildos_notifications', notifications); }, [notifications]);
  useEffect(() => { safeSetStorage('buildos_worker_notes', workerNotes); }, [workerNotes]);
  useEffect(() => { safeSetStorage('buildos_leave_requests', leaveRequests); }, [leaveRequests]);

  // Automatically purge Theme Park project and its connected details if present
  useEffect(() => {
    setProjects(prevProjects => {
      const themeParkExists = prevProjects.some(p => p.name && p.name.toLowerCase().trim().includes('theme park'));
      if (themeParkExists) {
        const cleaned = prevProjects.filter(p => !(p.name && p.name.toLowerCase().trim().includes('theme park')));
        safeSetStorage('buildos_projects', cleaned);
        return cleaned;
      }
      return prevProjects;
    });

    setTasks(prevTasks => {
      const cleanedTasks = prevTasks.filter(t => !(t.site && t.site.toLowerCase().trim().includes('theme park')));
      safeSetStorage('buildos_tasks', cleanedTasks);
      return cleanedTasks;
    });

    setMaterials(prevMaterials => {
      const cleanedMaterials = prevMaterials.filter(m => !(m.siteAllocated && m.siteAllocated.toLowerCase().trim().includes('theme park')));
      safeSetStorage('buildos_materials', cleanedMaterials);
      return cleanedMaterials;
    });

    setWorkers(prevWorkers => {
      const list = Array.isArray(prevWorkers) ? prevWorkers : initialWorkersData;
      let updated = false;
      const cleanedWorkers = list.map(w => {
        if (!w) return w;
        const siteClean = (w.site || '').toLowerCase().trim();
        if (siteClean.includes('theme park')) {
          updated = true;
          return {
            ...w,
            site: 'Not Assigned Yet',
            cancellationNotice: 'your assigned project was cancelled by admin',
            statusNote: 'your assigned project was cancelled by admin',
            siteStatus: 'Cancelled by Admin'
          };
        }
        return w;
      });
      if (updated) safeSetStorage('buildos_workers', cleanedWorkers);
      return updated ? cleanedWorkers : list;
    });
  }, []);

  // Automatically sync worker sites with assigned projects whenever projects or workers change & clear cancellation notices for assigned workers
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const activeProjectNames = new Set(
      projects.filter(p => p && p.status !== 'Cancelled').map(p => p.name?.toLowerCase().trim()).filter(Boolean)
    );

    const nameToProjectMap = {};
    projects.forEach(p => {
      if (!p.name || p.status === 'Cancelled') return;
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
      const list = Array.isArray(prevWorkers) ? prevWorkers : initialWorkersData;
      if (!list || list.length === 0) return list;
      let needsUpdate = false;
      const updated = list.map(w => {
        if (!w) return w;
        let newWorker = w;

        // Sync site from project manager / team assignment
        if (w.name) {
          const assignedProjName = nameToProjectMap[w.name.trim().toLowerCase()];
          if (assignedProjName && w.site !== assignedProjName) {
            needsUpdate = true;
            newWorker = { ...newWorker, site: assignedProjName };
          }
        }

        // Automatically clear cancellation notice if worker is assigned to an active project
        const siteClean = (newWorker.site || '').toLowerCase().trim();
        const isAssignedToActiveProject = siteClean && 
          siteClean !== 'not assigned yet' && 
          siteClean !== 'unassigned' && 
          siteClean !== 'cancelled by admin' &&
          activeProjectNames.has(siteClean);

        if (isAssignedToActiveProject && (newWorker.cancellationNotice || newWorker.statusNote || newWorker.siteStatus)) {
          needsUpdate = true;
          newWorker = {
            ...newWorker,
            cancellationNotice: null,
            statusNote: null,
            siteStatus: null
          };
        }

        return newWorker;
      });
      return needsUpdate ? updated : prevWorkers;
    });
  }, [projects]);

  // Automatically sync material site allocations with project state whenever materials change
  useEffect(() => {
    if (!materials || materials.length === 0 || !projects || projects.length === 0) return;

    setProjects(prevProjects => {
      let changed = false;

      const updatedProjects = prevProjects.map(proj => {
        if (!proj || !proj.name) return proj;
        const projNameClean = proj.name.toLowerCase().trim();
        const projLocClean = (proj.location || '').toLowerCase().trim();

        // Find all materials allocated to this project
        const matchingMaterials = materials.filter(m => {
          if (!m || !m.siteAllocated) return false;
          const siteAllocLower = m.siteAllocated.toLowerCase().trim();
          const cleanSiteName = siteAllocLower.split('(')[0].trim();
          return (projNameClean && siteAllocLower.includes(projNameClean)) || 
                 (projNameClean && cleanSiteName.includes(projNameClean)) ||
                 (cleanSiteName && projNameClean.includes(cleanSiteName)) ||
                 (projLocClean && siteAllocLower.includes(projLocClean));
        });

        if (matchingMaterials.length === 0) return proj;

        const currentAllocated = Array.isArray(proj.allocatedMaterials) ? [...proj.allocatedMaterials] : [];
        let projectChanged = false;

        matchingMaterials.forEach(m => {
          const match = m.siteAllocated.match(/\((.*?)\)/);
          const matQuantity = match ? match[1].trim() : (m.totalStock || '100 Units');
          const matStatus = m.status || 'Stocked';

          const existingIndex = currentAllocated.findIndex(
            alloc => alloc && alloc.name && alloc.name.toLowerCase().trim() === m.name.toLowerCase().trim()
          );

          if (existingIndex !== -1) {
            const existing = currentAllocated[existingIndex];
            if (existing.quantity !== matQuantity || existing.status !== matStatus) {
              currentAllocated[existingIndex] = {
                ...existing,
                quantity: matQuantity,
                status: matStatus
              };
              projectChanged = true;
            }
          } else {
            currentAllocated.push({
              id: m.id || Date.now(),
              name: m.name,
              quantity: matQuantity,
              status: matStatus
            });
            projectChanged = true;
          }
        });

        if (projectChanged) {
          changed = true;
          return { ...proj, allocatedMaterials: currentAllocated };
        }
        return proj;
      });

      return changed ? updatedProjects : prevProjects;
    });
  }, [materials]);

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

  const cancelProject = useCallback((id) => {
    const numId = Number(id);
    let cancelledProjName = '';
    let cancelledProjLoc = '';

    // 1. Find target project details and remove project from state
    setProjects(prevProjects => {
      const targetProj = prevProjects.find(p => p.id === numId || p.id === id);
      if (targetProj) {
        cancelledProjName = targetProj.name;
        cancelledProjLoc = targetProj.location;
      }
      const updated = prevProjects.filter(p => p.id !== numId && p.id !== id);
      safeSetStorage('buildos_projects', updated);
      return updated;
    });

    if (cancelledProjName) {
      const targetNameClean = cancelledProjName.toLowerCase().trim();

      // 2. Automatically remove all tasks linked to this cancelled project
      setTasks(prevTasks => {
        const remainingTasks = prevTasks.filter(t => {
          if (!t) return false;
          const taskSiteClean = (t.site || '').toLowerCase().trim();
          if (taskSiteClean && (taskSiteClean.includes(targetNameClean) || targetNameClean.includes(taskSiteClean))) {
            return false;
          }
          return true;
        });
        safeSetStorage('buildos_tasks', remainingTasks);
        return remainingTasks;
      });

      // 3. Automatically remove all material stock allocations linked to this cancelled project
      setMaterials(prevMaterials => {
        const remainingMaterials = prevMaterials.filter(m => {
          if (!m || !m.siteAllocated) return true;
          const matSiteClean = m.siteAllocated.toLowerCase().trim();
          if (matSiteClean.includes(targetNameClean) || targetNameClean.includes(matSiteClean)) {
            return false;
          }
          return true;
        });
        safeSetStorage('buildos_materials', remainingMaterials);
        return remainingMaterials;
      });

      // 4. Update workers assigned to this project: unassign site & attach cancellation notice
      setWorkers(prevWorkers => {
        const updatedWorkers = prevWorkers.map(w => {
          const workerSiteClean = (w.site || '').toLowerCase().trim();
          if (workerSiteClean && (workerSiteClean.includes(targetNameClean) || targetNameClean.includes(workerSiteClean))) {
            return {
              ...w,
              site: 'Not Assigned Yet',
              cancellationNotice: `your assigned project was cancelled by admin`,
              statusNote: `your assigned project was cancelled by admin`,
              siteStatus: `Cancelled by Admin`
            };
          }
          return w;
        });
        safeSetStorage('buildos_workers', updatedWorkers);
        return updatedWorkers;
      });

      // 5. Dispatch notification for workers
      addNotification(
        `Project Cancelled: ${cancelledProjName}`,
        `your assigned project was cancelled by admin. Associated site tasks and material allocations have been automatically removed.`,
        "Project Cancellation",
        "purple",
        "worker"
      );

      logActivity(`Project Cancelled & Auto-Purged: ${cancelledProjName}`, cancelledProjLoc || 'Site', 'Project, Tasks & Materials Cleared', 'purple');
    }
  }, [addNotification, logActivity]);

  const deleteProject = useCallback((id) => {
    cancelProject(id);
  }, [cancelProject]);

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
    setWorkers(prev => prev.map(w => {
      if (w.id === Number(id) || w.name?.toLowerCase().trim() === String(id).toLowerCase().trim()) {
        const merged = { ...w, ...updatedFields };
        const siteClean = (merged.site || '').toLowerCase().trim();
        if (siteClean && siteClean !== 'not assigned yet' && siteClean !== 'unassigned' && siteClean !== 'cancelled by admin') {
          merged.cancellationNotice = null;
          merged.statusNote = null;
          merged.siteStatus = null;
        }
        return merged;
      }
      return w;
    }));
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
    const nameClean = orderData.name?.trim();
    if (!nameClean) return null;

    const newMat = {
      id: Date.now(),
      name: nameClean,
      category: orderData.category?.trim() || "Concrete & Cement",
      totalStock: orderData.totalStock?.trim() || orderData.quantity?.trim() || "300 cum",
      availablePct: orderData.availablePct !== undefined ? Number(orderData.availablePct) : 100,
      siteAllocated: orderData.siteAllocated?.trim() || orderData.site?.trim() || "Hyper Mall (450 cu.m)",
      status: orderData.status?.trim() || "Low Stock Alert",
      unitCost: orderData.unitCost?.trim() || "$85/cu.m"
    };

    setMaterials(prev => {
      const cleanPrev = deduplicateMaterials(prev);
      const existingIndex = cleanPrev.findIndex(m => m.name.toLowerCase().trim() === nameClean.toLowerCase());

      if (existingIndex !== -1) {
        const updated = [...cleanPrev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...newMat,
          id: updated[existingIndex].id
        };
        return updated;
      } else {
        return [...cleanPrev, newMat];
      }
    });

    logActivity(`Material Dispatched: ${newMat.name}`, newMat.siteAllocated, 'Stock Updated', 'purple');
    return newMat;
  }, [logActivity]);

  const updateMaterial = useCallback((id, updatedFields) => {
    setMaterials(prev => {
      const updated = prev.map(m => {
        if (m.id === Number(id) || m.id === id || (m.name && m.name.toLowerCase().trim() === String(id).toLowerCase().trim())) {
          return { ...m, ...updatedFields };
        }
        return m;
      });
      safeSetStorage('buildos_materials', updated);
      return updated;
    });
    logActivity(`Material Updated`, `ID: ${id}`, 'Inventory Updated', 'purple');
  }, [logActivity]);

  const deleteMaterial = useCallback((idOrName) => {
    let removedName = '';
    setMaterials(prev => {
      const filtered = prev.filter(m => {
        if (!m) return false;
        const matchId = m.id === Number(idOrName) || m.id === idOrName;
        const matchName = m.name && m.name.toLowerCase().trim() === String(idOrName).toLowerCase().trim();
        if (matchId || matchName) {
          removedName = m.name;
          return false;
        }
        return true;
      });
      safeSetStorage('buildos_materials', filtered);
      return filtered;
    });

    // Also purge this material from all project allocations across the entire application
    setProjects(prevProjects => {
      const targetName = String(removedName || idOrName).toLowerCase().trim();
      const updatedProjects = prevProjects.map(p => {
        if (p.allocatedMaterials && Array.isArray(p.allocatedMaterials)) {
          const newAlloc = p.allocatedMaterials.filter(m => {
            const mName = m.name?.toLowerCase().trim();
            return mName !== targetName && m.id !== idOrName && m.id !== Number(idOrName);
          });
          if (newAlloc.length !== p.allocatedMaterials.length) {
            return { ...p, allocatedMaterials: newAlloc };
          }
        }
        return p;
      });
      safeSetStorage('buildos_projects', updatedProjects);
      return updatedProjects;
    });

    logActivity(`Material Removed Everywhere`, `ID/Name: ${idOrName}`, 'Purged from Inventory & Projects', 'purple');
  }, [logActivity]);

const checkIsOverdue = (dueDateStr, status) => {
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

  const addTask = useCallback((taskData) => {
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
    setTasks(prev => [newTask, ...prev]);
    logActivity(`Task Assigned: ${newTask.title}`, newTask.site, `Category: ${newTask.category} • Assignee: ${newTask.assignee}`, 'purple');

    // Notify Workers about task assignment
    addNotification(
      `New Task Assigned: ${newTask.title}`,
      `Admin assigned new task '${newTask.title}' (${newTask.category}) to ${newTask.assignee} for site ${newTask.site}. Due: ${newTask.dueDate}`,
      "Task Assignment",
      "purple",
      "worker",
      null,
      newTask.assignee
    );

    return newTask;
  }, [logActivity, addNotification]);

  const toggleTaskStatus = useCallback((taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        const isOver = checkIsOverdue(t.dueDate, nextStatus);
        const finalStatus = (nextStatus === 'Pending' && isOver) ? 'Overdue' : nextStatus;
        logActivity(`Task Status Changed`, t.site, finalStatus, 'lime');
        return { ...t, status: finalStatus, overdue: finalStatus === 'Completed' ? false : isOver };
      }
      return t;
    }));
  }, [logActivity]);

  const deleteTask = useCallback((taskId) => {
    let deletedTask = null;

    setTasks(prev => {
      deletedTask = prev.find(t => t.id === Number(taskId) || t.id === taskId);
      const remaining = prev.filter(t => t.id !== Number(taskId) && t.id !== taskId);
      safeSetStorage('buildos_tasks', remaining);
      return remaining;
    });

    // Purge deleted task from project.tasks in projects state
    setProjects(prevProjects => {
      let changed = false;
      const updatedProjects = prevProjects.map(p => {
        if (!p || !p.tasks || !Array.isArray(p.tasks)) return p;
        const targetTitleClean = (deletedTask?.title || deletedTask?.name || '').toLowerCase().trim();
        const filteredTasks = p.tasks.filter(t => {
          const titleClean = (t.title || t.name || '').toLowerCase().trim();
          if (t.id === Number(taskId) || t.id === taskId || (targetTitleClean && titleClean === targetTitleClean)) {
            changed = true;
            return false;
          }
          return true;
        });
        return { ...p, tasks: filteredTasks };
      });
      if (changed) safeSetStorage('buildos_projects', updatedProjects);
      return changed ? updatedProjects : prevProjects;
    });

    if (deletedTask) {
      logActivity(`Task Removed: ${deletedTask.title}`, deletedTask.site || `ID #${taskId}`, 'Deleted from Site Roster', 'purple');
    } else {
      logActivity(`Task Removed`, `ID #${taskId}`, 'Deleted', 'purple');
    }
  }, [logActivity]);

  const updateTask = useCallback((taskId, updatedFields) => {
    let targetTask = null;
    setTasks(prev => prev.map(t => {
      if (t.id === Number(taskId) || t.id === taskId) {
        const merged = { ...t, ...updatedFields };
        const isOver = checkIsOverdue(merged.dueDate, merged.status);

        merged.overdue = isOver;
        if (merged.status === 'Completed') {
          merged.overdue = false;
        } else if (isOver) {
          merged.status = 'Overdue';
        } else if (merged.status === 'Overdue' && !isOver) {
          // Date was postponed to a future date! Clear Overdue status back to Pending
          merged.status = 'Pending';
        }

        targetTask = merged;
        return targetTask;
      }
      return t;
    }));

    if (targetTask) {
      logActivity(`Task Updated: ${targetTask.title}`, targetTask.site, `Status: ${targetTask.status}`, 'lime');
      if (targetTask.assignee) {
        addNotification(
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
  }, [logActivity, addNotification]);

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

  // Derived Dynamic Tasks & Counts
  const enrichedTasks = useMemo(() => {
    return tasks.map(t => {
      if (t.status === 'Completed') {
        return { ...t, overdue: false };
      }
      const isOver = checkIsOverdue(t.dueDate, t.status);
      return {
        ...t,
        overdue: Boolean(t.overdue || isOver || t.status === 'Overdue')
      };
    });
  }, [tasks]);

  const activeProjectsCount = useMemo(() => projects.filter(p => p.status === 'In Progress').length, [projects]);
  const pendingProjectsCount = useMemo(() => projects.filter(p => p.status === 'Pending' || p.status === 'Planning').length, [projects]);
  const nonCancelledProjectsCount = useMemo(() => projects.filter(p => p.status !== 'Cancelled').length, [projects]);
  const pendingTasksCount = useMemo(() => enrichedTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length, [enrichedTasks]);
  const overdueTasksCount = useMemo(() => enrichedTasks.filter(t => t.overdue).length, [enrichedTasks]);

  const contextValue = useMemo(() => ({
    projects,
    workers,
    materials,
    tasks: enrichedTasks,
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
    cancelProject,
    getProjectById,
    addWorker,
    acceptWorkerRegistration,
    rejectWorkerRegistration,
    updateWorker,
    deleteWorker,
    addMaterialOrder,
    updateMaterial,
    deleteMaterial,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    addWorkerNote,
    deleteWorkerNote,
    togglePinNote,
    getWorkerNotes,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
    totalProjectsCount: nonCancelledProjectsCount,
    activeProjectsCount,
    pendingProjectsCount,
    totalWorkersCount: workers.length,
    pendingTasksCount,
    overdueTasksCount
  }), [
    projects,
    workers,
    materials,
    enrichedTasks,
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
    cancelProject,
    getProjectById,
    addWorker,
    acceptWorkerRegistration,
    rejectWorkerRegistration,
    updateWorker,
    deleteWorker,
    addMaterialOrder,
    updateMaterial,
    deleteMaterial,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    addWorkerNote,
    deleteWorkerNote,
    togglePinNote,
    getWorkerNotes,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
    nonCancelledProjectsCount,
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
