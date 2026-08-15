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

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => safeGetStorage('buildos_projects', initialProjectsData));
  const [workers, setWorkers] = useState(() => safeGetStorage('buildos_workers', initialWorkersData));
  const [materials, setMaterials] = useState(() => safeGetStorage('buildos_materials', initialMaterialsData));
  const [machines, setMachines] = useState(() => safeGetStorage('buildos_machines', initialMachinesData));
  const [tasks, setTasks] = useState(() => safeGetStorage('buildos_tasks', initialTasksData));
  const [activityFeed, setActivityFeed] = useState(() => safeGetStorage('buildos_activity', initialActivityData));

  // Sync state changes to localStorage
  useEffect(() => { safeSetStorage('buildos_projects', projects); }, [projects]);
  useEffect(() => { safeSetStorage('buildos_workers', workers); }, [workers]);
  useEffect(() => { safeSetStorage('buildos_materials', materials); }, [materials]);
  useEffect(() => { safeSetStorage('buildos_machines', machines); }, [machines]);
  useEffect(() => { safeSetStorage('buildos_tasks', tasks); }, [tasks]);
  useEffect(() => { safeSetStorage('buildos_activity', activityFeed); }, [activityFeed]);

  // Helper log activity generator
  const logActivity = useCallback((title, site, status, badge = 'lime') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFeed = { time: timeStr, title, site, status, badge };
    setActivityFeed(prev => [newFeed, ...prev.slice(0, 7)]);
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
    return newProj;
  }, [logActivity]);

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

  const deductMaterialStock = useCallback((materialName, allocatedQuantityStr, projectName) => {
    setMaterials(prev => prev.map(mat => {
      if (mat.name.toLowerCase().trim() === materialName.toLowerCase().trim()) {
        const currentStockNum = parseFloat(mat.totalStock.replace(/,/g, '')) || 0;
        const allocNum = parseFloat(allocatedQuantityStr.replace(/,/g, '')) || 0;
        const unit = mat.totalStock.replace(/[\d,.\s]/g, '').trim() || 'Units';

        if (allocNum > 0 && currentStockNum >= allocNum) {
          const remainingStock = Math.max(0, currentStockNum - allocNum);
          const origStock = parseFloat(initialMaterialsData.find(m => m.name === mat.name)?.totalStock.replace(/,/g, '') || currentStockNum);
          const newPct = Math.max(0, Math.round((remainingStock / Math.max(origStock, 1)) * 100));
          const newStatus = remainingStock <= 0 ? "Reorder Required" : newPct < 40 ? "Low Stock Alert" : "Stocked";

          return {
            ...mat,
            totalStock: `${remainingStock.toLocaleString()} ${unit}`.trim(),
            availablePct: newPct,
            status: newStatus,
            siteAllocated: `${projectName || 'Site'} (${allocatedQuantityStr})`
          };
        }
      }
      return mat;
    }));
    logActivity(`Material Allocated: ${materialName}`, projectName || 'Site', `Allocated: ${allocatedQuantityStr}`, 'lime');
  }, [logActivity]);

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
    return newTask;
  }, [logActivity]);

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
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    addWorker,
    updateWorker,
    addMaterialOrder,
    updateMaterial,
    deductMaterialStock,
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
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    addWorker,
    updateWorker,
    addMaterialOrder,
    updateMaterial,
    deductMaterialStock,
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
