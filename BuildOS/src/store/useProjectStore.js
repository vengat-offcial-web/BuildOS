import { create } from 'zustand';
import { initialProjectsData } from '../data';
import { useNotificationStore } from './useNotificationStore';
import { useTaskStore } from './useTaskStore';
import { useMaterialStore } from './useMaterialStore';
import { useWorkerStore } from './useWorkerStore';

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

const defaultProjectMilestonesMap = {
  "Marina Tower": [
    { name: "Foundation & Excavation", status: "Completed", date: "Feb 2026" },
    { name: "Structural Superstructure", status: "Completed", date: "May 2026" },
    { name: "Exterior Glass Panel Fitting", status: "In Progress", date: "Aug 2026" },
    { name: "Final MEP Inspection & Handover", status: "Pending", date: "Oct 2026" }
  ],
  "Metro Line Extension": [
    { name: "Viaduct Pier & Foundation Construction", status: "Completed", date: "Jan 2026" },
    { name: "Elevated Track Bed & Rail Laying", status: "Completed", date: "Apr 2026" },
    { name: "Station Terminal Canopy & Signaling", status: "In Progress", date: "Jul 2026" },
    { name: "Trial Run & Safety Inspection Certification", status: "Pending", date: "Oct 2026" }
  ],
  "SkyView Luxury Apartments": [
    { name: "Site Clearance & Deep Piling", status: "Completed", date: "Mar 2026" },
    { name: "Tower 1 & 2 Concrete Frame", status: "In Progress", date: "Jun 2026" },
    { name: "Plumbing & Electrical Rough-in", status: "Pending", date: "Sep 2026" },
    { name: "Interior Finishing & Elevator Fitment", status: "Pending", date: "Dec 2026" }
  ],
  "Apex Tech Park Phase 2": [
    { name: "Basement Excavation & Retaining Walls", status: "Completed", date: "Jan 2026" },
    { name: "Steel Skeleton & Decking", status: "Completed", date: "Mar 2026" },
    { name: "Glass Facade & HVAC System", status: "Completed", date: "May 2026" },
    { name: "Occupancy Certification & Handover", status: "Completed", date: "Jul 2026" }
  ],
  "Green Valley Smart Township": [
    { name: "Land Survey & Zone Layout", status: "Completed", date: "Apr 2026" },
    { name: "Underground Drainage & Water Piping", status: "Pending", date: "Aug 2026" },
    { name: "Road Sub-base & Paving", status: "Pending", date: "Nov 2026" },
    { name: "Solar Grid & Street Lighting Install", status: "Pending", date: "Jan 2027" }
  ],
  "Hyper Mall": [
    { name: "Foundation & Excavation", status: "Completed", date: "Feb 2026" },
    { name: "Structural Superstructure", status: "In Progress", date: "May 2026" },
    { name: "Exterior Glass Panel Fitting", status: "In Progress", date: "Aug 2026" }
  ],
  "Smart Industrial Hub": [
    { name: "Site Grading & Foundation Slab", status: "Completed", date: "Feb 2026" },
    { name: "Structural Steel Frame Assembly", status: "Completed", date: "May 2026" },
    { name: "Automated Conveyor & Electrical Fitment", status: "In Progress", date: "Aug 2026" },
    { name: "Safety & Logistics Trial Handover", status: "Pending", date: "Nov 2026" }
  ]
};

const initialProjects = (() => {
  const saved = safeGetStorage('buildos_projects', initialProjectsData);
  return (saved || []).filter(p => !(p.name && p.name.toLowerCase().trim().includes('theme park')));
})();

export const useProjectStore = create((set, get) => ({
  projects: initialProjects,

  get enrichedProjects() {
    const projects = get().projects;
    const taskStore = useTaskStore.getState();
    const enrichedTasks = taskStore.enrichedTasks;

    return projects.map(p => {
      if (!p) return p;
      if (p.status === 'Cancelled') return p;

      const pNameClean = (p.name || '').toLowerCase().trim();
      const pLocClean = (p.location || '').toLowerCase().trim();

      const siteTasks = enrichedTasks.filter(t => {
        if (!t || !t.site) return false;
        const siteClean = t.site.toLowerCase().trim();
        return (pNameClean && (siteClean.includes(pNameClean) || pNameClean.includes(siteClean))) ||
               (pLocClean && (siteClean.includes(pLocClean) || pLocClean.includes(siteClean)));
      });

      const milestones = (p.milestones && Array.isArray(p.milestones) && p.milestones.length > 0)
        ? p.milestones
        : (defaultProjectMilestonesMap[p.name] || [
            { name: "Foundation & Excavation", status: (p.progress || 0) > 50 ? "Completed" : "In Progress", date: "Feb 2026" },
            { name: "Structural Superstructure", status: (p.progress || 0) > 75 ? "Completed" : "In Progress", date: "May 2026" },
            { name: "Final Inspection & Handover", status: (p.progress || 0) === 100 ? "Completed" : "Pending", date: "Oct 2026" }
          ]);

      const totalMilestones = milestones.length;
      const completedMilestones = milestones.filter(m => m.status === 'Completed').length;

      const totalTasks = siteTasks.length;
      const completedTasks = siteTasks.filter(t => t.status === 'Completed').length;

      let calcProgress = p.progress;
      if (totalMilestones > 0 && totalTasks > 0) {
        if (completedMilestones === totalMilestones && completedTasks === totalTasks) {
          calcProgress = 100;
        } else {
          const milestoneRatio = completedMilestones / totalMilestones;
          const taskRatio = completedTasks / totalTasks;
          calcProgress = Math.min(100, Math.round(milestoneRatio * 60 + taskRatio * 40));
        }
      } else if (totalTasks > 0) {
        calcProgress = Math.min(100, Math.round((completedTasks / totalTasks) * 100));
      } else if (totalMilestones > 0) {
        calcProgress = Math.round((completedMilestones / totalMilestones) * 100);
      }

      let updatedStatus = p.status;
      let completedDate = p.completedDate;
      if (calcProgress === 100 && p.status !== 'Cancelled') {
        updatedStatus = 'Completed';
        if (!completedDate) {
          completedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } else if (calcProgress > 0 && calcProgress < 100 && p.status !== 'Cancelled' && p.status !== 'Planning') {
        updatedStatus = 'In Progress';
      }

      return {
        ...p,
        milestones,
        siteTasks,
        progress: calcProgress,
        status: updatedStatus,
        completedDate
      };
    });
  },

  get totalProjectsCount() {
    return get().enrichedProjects.filter(p => p.status !== 'Cancelled').length;
  },

  get activeProjectsCount() {
    return get().enrichedProjects.filter(p => p.status === 'In Progress').length;
  },

  get pendingProjectsCount() {
    return get().enrichedProjects.filter(p => p.status === 'Pending' || p.status === 'Planning').length;
  },

  addProject: (projectData) => {
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

    set(state => {
      const updated = [newProj, ...state.projects];
      safeSetStorage('buildos_projects', updated);
      return { projects: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Project Assigned: ${newProj.name}`, newProj.location, 'Status: Planning', 'purple');

    if (newProj.manager) {
      const mgrName = newProj.manager.trim().toLowerCase();
      const workerStore = useWorkerStore.getState();
      workerStore.setWorkers(prev => prev.map(w => (w.name && w.name.trim().toLowerCase() === mgrName) ? { ...w, site: newProj.name } : w));
    }

    notifStore.addNotification(
      "Assigned to New Project Team",
      `Admin assigned team workers to new project '${newProj.name}' at ${newProj.location}. Lead Engineer: ${newProj.manager}`,
      "Team Assignment",
      "purple"
    );

    return newProj;
  },

  updateProject: (id, updatedFields) => {
    let targetProjectName = '';
    set(state => {
      const updated = state.projects.map(p => {
        if (p.id === Number(id)) {
          const merged = { ...p, ...updatedFields };
          targetProjectName = merged.name;
          return merged;
        }
        return p;
      });
      safeSetStorage('buildos_projects', updated);
      return { projects: updated };
    });

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
        const workerStore = useWorkerStore.getState();
        workerStore.setWorkers(prev => prev.map(w => {
          if (w.name && namesToUpdate.has(w.name.trim().toLowerCase())) {
            return { ...w, site: projectName };
          }
          return w;
        }));
      }
    }

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Project Updated`, `ID #${id}`, 'Changes Saved', 'lime');
  },

  cancelProject: (id) => {
    const numId = Number(id);
    let cancelledProjName = '';
    let cancelledProjLoc = '';

    set(state => {
      const targetProj = state.projects.find(p => p.id === numId || p.id === id);
      if (targetProj) {
        cancelledProjName = targetProj.name;
        cancelledProjLoc = targetProj.location;
      }
      const updatedProjects = state.projects.filter(p => p.id !== numId && p.id !== id);
      safeSetStorage('buildos_projects', updatedProjects);
      return { projects: updatedProjects };
    });

    if (cancelledProjName) {
      const targetNameClean = cancelledProjName.toLowerCase().trim();

      const taskStore = useTaskStore.getState();
      taskStore.setTasks(prevTasks => prevTasks.filter(t => {
        if (!t) return false;
        const taskSiteClean = (t.site || '').toLowerCase().trim();
        return !(taskSiteClean && (taskSiteClean.includes(targetNameClean) || targetNameClean.includes(taskSiteClean)));
      }));

      const materialStore = useMaterialStore.getState();
      materialStore.setMaterials(prevMaterials => prevMaterials.filter(m => {
        if (!m || !m.siteAllocated) return true;
        const matSiteClean = m.siteAllocated.toLowerCase().trim();
        return !(matSiteClean.includes(targetNameClean) || targetNameClean.includes(matSiteClean));
      }));

      const workerStore = useWorkerStore.getState();
      workerStore.setWorkers(prevWorkers => prevWorkers.map(w => {
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
      }));

      const notifStore = useNotificationStore.getState();
      notifStore.addNotification(
        `Project Cancelled: ${cancelledProjName}`,
        `your assigned project was cancelled by admin. Associated site tasks and material allocations have been automatically removed.`,
        "Project Cancellation",
        "purple",
        "worker"
      );

      notifStore.logActivity(`Project Cancelled & Auto-Purged: ${cancelledProjName}`, cancelledProjLoc || 'Site', 'Project, Tasks & Materials Cleared', 'purple');
    }
  },

  deleteProject: (id) => {
    get().cancelProject(id);
  },

  getProjectById: (id) => {
    const numId = parseInt(id, 10);
    const enriched = get().enrichedProjects;
    return enriched.find(p => p.id === numId) || enriched[0];
  },

  setProjects: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.projects) : updater;
      safeSetStorage('buildos_projects', updated);
      return { projects: updated };
    });
  }
}));

export default useProjectStore;
