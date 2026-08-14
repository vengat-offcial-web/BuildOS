import React, { createContext, useContext, useState, useEffect } from 'react';

export const DataContext = createContext(null);

const initialProjectsData = [
  { id: 1, name: "Marina Tower", location: "Chennai", manager: "Rajesh Kumar", progress: 72, status: "In Progress", deadline: "Sep 15, 2026", accent: "purple", iconType: "building", budget: "$4.8M / $6.5M", description: "28-story commercial high-rise tower featuring luxury office spaces and subterranean parking." },
  { id: 2, name: "Metro Line Extension", location: "Coimbatore", manager: "Priya Sundaram", progress: 85, status: "In Progress", deadline: "Oct 10, 2026", accent: "lime", iconType: "truck", budget: "$12.2M / $14.0M", description: "8.4 km elevated rapid transit metro corridor including 4 station terminals." },
  { id: 3, name: "SkyView Luxury Apartments", location: "Madurai", manager: "Anand Verma", progress: 40, status: "In Progress", deadline: "Dec 20, 2026", accent: "purple", iconType: "hardhat", budget: "$3.1M / $5.0M", description: "Luxury residential complex comprising three 15-story towers." },
  { id: 4, name: "Apex Tech Park Phase 2", location: "Trichy", manager: "Kavitha R.", progress: 100, status: "Completed", deadline: "Jul 10, 2026", accent: "lime", iconType: "building", budget: "$8.0M / $8.0M", description: "State-of-the-art IT park campus with modern glass facade architecture." },
  { id: 5, name: "Green Valley Smart Township", location: "Salem", manager: "Suresh Babu", progress: 15, status: "Planning", deadline: "Jan 30, 2027", accent: "purple", iconType: "building", budget: "$1.5M / $9.0M", description: "Sustainable eco-friendly residential development project." },
  { id: 6, name: "Smart Industrial Hub", location: "Hosur", manager: "Vikram Sethu", progress: 65, status: "In Progress", deadline: "Nov 12, 2026", accent: "lime", iconType: "truck", budget: "$5.4M / $7.2M", description: "Automated logistics warehouse and manufacturing facility." }
];

const initialWorkersData = [
  { id: 1, name: "Muthu Kumar", trade: "Masonry Lead", site: "Marina Tower", status: "On Duty", attendance: "98%", safetyRating: "A+ Gold", phone: "+91 98765 11111" },
  { id: 2, name: "Karthik Raja", trade: "Steel Rebar Specialist", site: "Metro Line Extension", status: "On Duty", attendance: "96%", safetyRating: "A+ Gold", phone: "+91 98765 22222" },
  { id: 3, name: "Selvam P.", trade: "Heavy Crane Operator", site: "SkyView Apartments", status: "On Duty", attendance: "100%", safetyRating: "A+ Gold", phone: "+91 98765 33333" },
  { id: 4, name: "Anandan S.", trade: "Electrical Foreman", site: "Apex Tech Park", status: "On Duty", attendance: "95%", safetyRating: "A Silver", phone: "+91 98765 44444" },
  { id: 5, name: "Ramesh Babu", trade: "Concrete Pump Technician", site: "Green Valley Township", status: "Off Duty", attendance: "92%", safetyRating: "A Silver", phone: "+91 98765 55555" },
  { id: 6, name: "Ganesh K.", trade: "Scaffolding Inspector", site: "Marina Tower", status: "On Duty", attendance: "99%", safetyRating: "A+ Gold", phone: "+91 98765 66666" }
];

const initialMaterialsData = [
  { id: 1, name: "Ready-Mix Concrete Grade 40", category: "Concrete & Cement", totalStock: "1,200 cu.m", availablePct: 88, siteAllocated: "Marina Tower (450 cu.m)", status: "Stocked", unitCost: "$85/cu.m" },
  { id: 2, name: "TMT Rebar Steel 16mm", category: "Steel & Metals", totalStock: "45 Tons", availablePct: 92, siteAllocated: "Metro Line (18 Tons)", status: "Stocked", unitCost: "$650/Ton" },
  { id: 3, name: "Structural Double-Glazed Panels", category: "Facade & Glass", totalStock: "850 Units", availablePct: 35, siteAllocated: "Marina Tower (240 Units)", status: "Low Stock Alert", unitCost: "$210/Unit" },
  { id: 4, name: "High-Strength Autoclaved Bricks", category: "Masonry", totalStock: "50,000 Pcs", availablePct: 95, siteAllocated: "SkyView Apartments", status: "Stocked", unitCost: "$0.80/Pc" },
  { id: 5, name: "Portland Cement Bags (50kg)", category: "Concrete & Cement", totalStock: "200 Bags", availablePct: 20, siteAllocated: "Green Valley Township", status: "Reorder Required", unitCost: "$9.50/Bag" }
];

const initialMachinesData = [
  { id: 1, name: "Potain Tower Crane TC-80", category: "Heavy Crane", site: "Marina Tower", operator: "Selvam P.", status: "Operational", healthPct: 98, fuelLevel: "85%", hoursUsed: "1,240 hrs" },
  { id: 2, name: "CAT 320 Hydraulic Excavator", category: "Excavation", site: "Metro Line Extension", operator: "Mani K.", status: "Operational", healthPct: 94, fuelLevel: "60%", hoursUsed: "890 hrs" },
  { id: 3, name: "Schwing Stetter Concrete Pump", category: "Pumping", site: "SkyView Apartments", operator: "Dinesh V.", status: "Maintenance Due", healthPct: 78, fuelLevel: "40%", hoursUsed: "1,560 hrs" },
  { id: 4, name: "Komatsu D65 Crawler Bulldozer", category: "Earthmoving", site: "Green Valley Township", operator: "Sundar M.", status: "Operational", healthPct: 96, fuelLevel: "90%", hoursUsed: "620 hrs" }
];

const initialTasksData = [
  { id: 1, title: "Glass facade panel alignment on Floor 18", site: "Marina Tower", assignee: "Rajesh Kumar", status: "In Progress", priority: "High", dueDate: "Today", overdue: false },
  { id: 2, title: "Structural core concrete compression testing", site: "Marina Tower", assignee: "Latha M.", status: "Completed", priority: "High", dueDate: "Aug 10, 2026", overdue: false },
  { id: 3, title: "Track signaling cable laying Pier 42-48", site: "Metro Line Extension", assignee: "Karthik R.", status: "In Progress", priority: "High", dueDate: "Aug 15, 2026", overdue: false },
  { id: 4, title: "Basement 2 main electrical transformer wiring", site: "Marina Tower", assignee: "Anandan S.", status: "Overdue", priority: "High", dueDate: "Aug 05, 2026", overdue: true },
  { id: 5, title: "Scaffolding safety inspection certification", site: "SkyView Apartments", assignee: "Ganesh K.", status: "Pending", priority: "Medium", dueDate: "Aug 18, 2026", overdue: false },
  { id: 6, title: "Perimeter boundary wall plastering check", site: "Green Valley Township", assignee: "Selvam P.", status: "Pending", priority: "Low", dueDate: "Aug 22, 2026", overdue: false }
];

const initialActivityData = [
  { time: "Just Now", title: "Live System Connected", site: "BuildOS Context API", status: "Operational", badge: "lime" },
  { time: "09:42 AM", title: "Concrete Pouring Completed", site: "Marina Tower — Slab 14", status: "Verified by Site Mgr", badge: "lime" },
  { time: "09:15 AM", title: "Tower Crane Telemetry Alert", site: "Metro Line Extension", status: "Inspection Scheduled", badge: "purple" },
  { time: "08:30 AM", title: "12 Ton Rebar Delivery Received", site: "SkyView Apartments", status: "Stock Updated", badge: "lime" },
  { time: "08:00 AM", title: "Morning Safety Briefing", site: "Apex Tech Park", status: "128 Workers Present", badge: "lime" }
];

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('buildos_projects');
      return saved ? JSON.parse(saved) : initialProjectsData;
    } catch {
      return initialProjectsData;
    }
  });

  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem('buildos_workers');
      return saved ? JSON.parse(saved) : initialWorkersData;
    } catch {
      return initialWorkersData;
    }
  });

  const [materials, setMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem('buildos_materials');
      return saved ? JSON.parse(saved) : initialMaterialsData;
    } catch {
      return initialMaterialsData;
    }
  });

  const [machines, setMachines] = useState(() => {
    try {
      const saved = localStorage.getItem('buildos_machines');
      return saved ? JSON.parse(saved) : initialMachinesData;
    } catch {
      return initialMachinesData;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('buildos_tasks');
      return saved ? JSON.parse(saved) : initialTasksData;
    } catch {
      return initialTasksData;
    }
  });

  const [activityFeed, setActivityFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('buildos_activity');
      return saved ? JSON.parse(saved) : initialActivityData;
    } catch {
      return initialActivityData;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('buildos_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('buildos_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('buildos_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('buildos_machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('buildos_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('buildos_activity', JSON.stringify(activityFeed));
  }, [activityFeed]);

  // Helper log generator
  const logActivity = (title, site, status, badge = 'lime') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFeed = { time: timeStr, title, site, status, badge };
    setActivityFeed(prev => [newFeed, ...prev.slice(0, 7)]);
  };

  // Actions
  const addProject = (projectData) => {
    const newProj = {
      id: projects.length + 1,
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
      budget: '$1.0M / $3.5M',
      description: projectData.description || 'Newly registered construction project development site.'
    };
    setProjects(prev => [newProj, ...prev]);
    logActivity(`Project Assigned: ${newProj.name}`, newProj.location, 'Status: Planning', 'purple');
    return newProj;
  };

  const getProjectById = (id) => {
    const numId = parseInt(id, 10);
    return projects.find(p => p.id === numId) || projects[0];
  };

  const addWorker = (workerData) => {
    const newWorker = {
      id: workers.length + 1,
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
  };

  const addMaterialOrder = (orderData) => {
    const newMat = {
      id: materials.length + 1,
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
  };

  const addMachine = (machineData) => {
    const newMac = {
      id: machines.length + 1,
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
  };

  const addTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
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
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        logActivity(`Task Status Changed`, t.site, nextStatus, 'lime');
        return { ...t, status: nextStatus, overdue: false };
      }
      return t;
    }));
  };

  // Derived Dynamic Counts
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const overdueTasksCount = tasks.filter(t => t.overdue).length;

  return (
    <DataContext.Provider value={{
      projects,
      workers,
      materials,
      machines,
      tasks,
      activityFeed,
      addProject,
      getProjectById,
      addWorker,
      addMaterialOrder,
      addMachine,
      addTask,
      toggleTaskStatus,
      totalProjectsCount: projects.length,
      activeProjectsCount,
      totalWorkersCount: workers.length + 120, // offset for 128 realistic team
      pendingTasksCount,
      overdueTasksCount
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
