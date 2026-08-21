import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, ProgressBar, Card } from '../components/ui';
import { FiArrowLeft,FiMapPin,FiCalendar,FiDollarSign,FiCheckCircle,FiClock,FiUsers,FiLayers,FiTruck,FiCheckSquare,FiEdit2,FiX,FiSave,FiPlus,FiTrash2,FiUserCheck,FiSearch
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';
import { useData } from '../context/useData';
import AssignProject from './AssignProject';

function ProjectDetails() {
  const { id } = useParams();

  if (id === 'new' || id === 'create') {
    return <AssignProject />;
  }

  const navigate = useNavigate();
  const { getProjectById, updateProject, cancelProject, toggleTaskStatus, addTask, updateTask, deleteTask, workers, materials, tasks } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Cancel Project Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editManager, setEditManager] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editWorkers, setEditWorkers] = useState('');

  const [showEngineerSuggestions, setShowEngineerSuggestions] = useState(false);
  const [engineerSearchQuery, setEngineerSearchQuery] = useState('');
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');
  const [matSearchQuery, setMatSearchQuery] = useState('');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editTeamMembers, setEditTeamMembers] = useState([]);
  const [showWorkerSearchDropdown, setShowWorkerSearchDropdown] = useState(false);

  const filteredEngineers = useMemo(() => {
    const activeEngineers = (workers || []).map((w, idx) => ({
      id: w.id || idx + 1,
      name: w.name,
      role: w.trade || 'Site Lead',
      phone: w.phone || '+91 98765 00000'
    }));

    const query = (engineerSearchQuery || '').toLowerCase().trim();
    if (!query || query === (editManager || '').toLowerCase().trim()) {
      return activeEngineers;
    }

    return activeEngineers.filter(eng =>
      eng.name.toLowerCase().includes(query) ||
      eng.role.toLowerCase().includes(query)
    );
  }, [engineerSearchQuery, editManager, workers]);

  // Combined catalog of saved personnel derived strictly from active workers
  const savedPersonnelCatalog = useMemo(() => {
    const combined = (workers || []).map(w => ({
      name: w.name,
      trade: w.trade || 'Site Member',
      phone: w.phone || '+91 98765 00000',
      type: (w.trade?.toLowerCase().includes('engineer') || w.trade?.toLowerCase().includes('lead') || w.trade?.toLowerCase().includes('director')) ? 'Engineer' : 'Site Worker'
    }));
    const seen = new Set();
    return combined.filter(item => {
      if (!item.name) return false;
      const key = item.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [workers]);

  const searchedPersonnelCandidates = useMemo(() => {
    const q = workerSearchQuery.toLowerCase().trim();
    if (!q) return savedPersonnelCatalog;
    return savedPersonnelCatalog.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.trade.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  }, [workerSearchQuery, savedPersonnelCatalog]);

  const searchedMaterialCandidates = useMemo(() => {
    const q = matSearchQuery.toLowerCase().trim();
    if (!q) return materials;
    return materials.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q)
    );
  }, [matSearchQuery, materials]);

  // Milestone Edit Modal State
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editMilestones, setEditMilestones] = useState([]);

  // Task Edit Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTasks, setEditTasks] = useState([]);

  // Material Edit Modal State
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editAllocatedMaterials, setEditAllocatedMaterials] = useState([]);
  const [showMatSearchDropdown, setShowMatSearchDropdown] = useState(false);

  const project = getProjectById(id);

  const siteWorkers = workers.filter(w => project && project.name && (w.site.toLowerCase().includes(project.name.toLowerCase()) || w.site.toLowerCase().includes(project.location.toLowerCase()))).slice(0, 4);

  const projectTeamMembers = (project && Array.isArray(project.teamMembers))
    ? project.teamMembers
    : (siteWorkers.length > 0 ? siteWorkers : []);

  const handleOpenTeamModal = () => {
    if (!project) return;
    const currentList = (project && Array.isArray(project.teamMembers))
      ? project.teamMembers
      : (siteWorkers.length > 0 ? siteWorkers : []);
    setEditTeamMembers(currentList.map(m => ({
      name: m.name || '',
      trade: m.trade || m.role || 'Site Engineer',
      phone: m.phone || m.contact || '+91 98765 00000'
    })));
    setWorkerSearchQuery('');
    setShowWorkerSearchDropdown(false);
    setIsTeamModalOpen(true);
  };

  const handleUpdateTeamMemberField = (index, field, value) => {
    setEditTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveTeamMember = (index) => {
    setEditTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBlankTeamMember = () => {
    setEditTeamMembers(prev => [...prev, { name: '', trade: 'Site Engineer', phone: '+91 98765 00000' }]);
  };

  const handleSelectSavedWorker = (candidate) => {
    const exists = editTeamMembers.some(m => m.name.toLowerCase().trim() === candidate.name.toLowerCase().trim());
    if (!exists) {
      setEditTeamMembers(prev => [...prev, {
        name: candidate.name,
        trade: candidate.trade,
        phone: candidate.phone
      }]);
    }
    setWorkerSearchQuery('');
    setShowWorkerSearchDropdown(false);
  };

  const handleSaveTeam = (e) => {
    e.preventDefault();
    const validTeam = editTeamMembers.filter(m => m.name.trim() !== '');
    updateProject(project.id, {
      teamMembers: validTeam,
      workforceRequired: validTeam.length > 0 ? validTeam.length : project.workforceRequired
    });
    setIsTeamModalOpen(false);
  };

  const defaultAllocatedMaterials = [
    { id: 1, name: "Ready-Mix Concrete Grade 40", quantity: "450 cu.m", status: "Stocked" },
    { id: 2, name: "TMT Rebar Steel 16mm", quantity: "18 Tons", status: "Stocked" },
    { id: 3, name: "Structural Double-Glazed Panels", quantity: "240 Units", status: "Low Stock Alert" }
  ];

  const projectAllocatedMaterials = useMemo(() => {
    const projNameClean = (project?.name || '').toLowerCase().trim();
    const projLocClean = (project?.location || '').toLowerCase().trim();

    // Live materials allocated to this site from global materials state
    const liveSiteMaterials = (materials || []).filter(m => {
      if (!m || !m.siteAllocated) return false;
      const siteAllocLower = m.siteAllocated.toLowerCase().trim();
      const cleanSiteName = siteAllocLower.split('(')[0].trim();
      return (projNameClean && siteAllocLower.includes(projNameClean)) || 
             (projNameClean && cleanSiteName.includes(projNameClean)) ||
             (cleanSiteName && projNameClean.includes(cleanSiteName)) ||
             (projLocClean && siteAllocLower.includes(projLocClean));
    }).map(m => {
      const match = m.siteAllocated.match(/\((.*?)\)/);
      const qty = match ? match[1].trim() : (m.totalStock || '100 Units');
      return {
        id: m.id,
        name: m.name,
        quantity: qty,
        status: m.status
      };
    });

    const currentAlloc = (project && project.allocatedMaterials && project.allocatedMaterials.length > 0)
      ? project.allocatedMaterials
      : [];

    const activeMaterialNames = new Set((materials || []).map(m => m.name?.toLowerCase().trim()));
    const validCurrentAlloc = currentAlloc.filter(m => m.name && activeMaterialNames.has(m.name.toLowerCase().trim()));

    const combinedMap = new Map();
    validCurrentAlloc.forEach(item => {
      if (item && item.name) combinedMap.set(item.name.toLowerCase().trim(), item);
    });
    liveSiteMaterials.forEach(item => {
      if (item && item.name) combinedMap.set(item.name.toLowerCase().trim(), item);
    });

    if (combinedMap.size === 0) {
      return defaultAllocatedMaterials.filter(m => activeMaterialNames.has(m.name.toLowerCase().trim()));
    }

    return Array.from(combinedMap.values());
  }, [project, materials]);

  const handleOpenMaterialsModal = () => {
    if (!project) return;
    const currentAlloc = (project.allocatedMaterials && project.allocatedMaterials.length > 0)
      ? project.allocatedMaterials
      : defaultAllocatedMaterials;
    setEditAllocatedMaterials(currentAlloc.map(m => ({
      name: m.name || '',
      quantity: m.quantity || m.totalStock || '100 Units',
      status: m.status || 'Stocked'
    })));
    setMatSearchQuery('');
    setShowMatSearchDropdown(false);
    setIsMaterialModalOpen(true);
  };

  const handleUpdateAllocatedMaterialField = (index, field, value) => {
    setEditAllocatedMaterials(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveAllocatedMaterial = (index) => {
    setEditAllocatedMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBlankMaterial = () => {
    setEditAllocatedMaterials(prev => [...prev, { name: '', quantity: '100 Units', status: 'Stocked' }]);
  };

  const handleSelectSavedMaterial = (candidate) => {
    const exists = editAllocatedMaterials.some(m => m.name.toLowerCase().trim() === candidate.name.toLowerCase().trim());
    if (!exists) {
      setEditAllocatedMaterials(prev => [...prev, {
        name: candidate.name,
        quantity: candidate.totalStock || '100 Units',
        status: candidate.status || 'Stocked'
      }]);
    }
    setMatSearchQuery('');
    setShowMatSearchDropdown(false);
  };

  const handleSaveMaterials = (e) => {
    e.preventDefault();
    const validAllocations = editAllocatedMaterials.filter(m => m.name.trim() !== '');
    updateProject(project.id, {
      allocatedMaterials: validAllocations
    });
    setIsMaterialModalOpen(false);
  };



  const calcEditDurationDays = useMemo(() => {
    if (!editStartDate || !editDeadline) return null;
    try {
      const start = new Date(editStartDate);
      const end = new Date(editDeadline);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : null;
      }
    } catch {}
    return null;
  }, [editStartDate, editDeadline]);

  const handleOpenEdit = () => {
    if (!project) return;
    setEditName(project.name || '');
    setEditLocation(project.location || '');
    setEditManager(project.manager || '');
    const currentBudget = project.budget ? project.budget.replace(/^\$/, '₹') : '₹1.5 Cr / ₹5.0 Cr';
    setEditBudget(currentBudget);
    setEditStartDate(project.startDate || 'Feb 15, 2026');
    setEditDeadline(project.deadline || 'Feb 15, 2027');
    setEditWorkers(project.workforceRequired !== undefined && project.workforceRequired !== null ? String(project.workforceRequired) : String(siteWorkers.length || 4));
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProject(project.id, {
      name: editName.trim(),
      location: editLocation.trim(),
      manager: editManager.trim(),
      budget: editBudget.trim(),
      startDate: editStartDate.trim(),
      deadline: editDeadline.trim(),
      workforceRequired: parseInt(editWorkers, 10) || 0
    });
    setIsEditing(false);
  };

  const defaultMilestones = [
    { name: "Foundation & Excavation", status: "Completed", date: "Feb 2026" },
    { name: "Structural Superstructure", status: project && project.progress > 50 ? "Completed" : "In Progress", date: "May 2026" },
    { name: "Exterior Glass Panel Fitting", status: project && project.progress > 70 ? "In Progress" : "Pending", date: "Aug 2026" },
    { name: "Final MEP Inspection & Handover", status: project && project.progress === 100 ? "Completed" : "Pending", date: "Oct 2026" }
  ];

  const projectMilestones = (project && project.milestones && project.milestones.length > 0) ? project.milestones : defaultMilestones;

  const handleOpenMilestonesModal = () => {
    setEditMilestones(JSON.parse(JSON.stringify(projectMilestones)));
    setIsMilestoneModalOpen(true);
  };

  const handleUpdateMilestoneField = (index, field, value) => {
    setEditMilestones(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddMilestone = () => {
    setEditMilestones(prev => [
      ...prev,
      { name: "New Construction Phase", status: "Pending", date: "Nov 2026" }
    ]);
  };

  const handleRemoveMilestone = (index) => {
    setEditMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveMilestones = (e) => {
    e.preventDefault();
    const validMilestones = editMilestones.filter(m => m.name.trim() !== '');
    updateProject(project.id, {
      milestones: validMilestones
    });
    setIsMilestoneModalOpen(false);
  };

  const handleToggleMilestoneStatus = (index) => {
    if (!project || !projectMilestones) return;
    const nextStatusMap = {
      'Pending': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Pending'
    };
    const updatedMilestones = projectMilestones.map((m, i) => {
      if (i === index) {
        const nextStatus = nextStatusMap[m.status] || 'Completed';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    updateProject(project.id, { milestones: updatedMilestones });
  };

  const projectTasks = useMemo(() => {
    if (!project) return [];
    const projNameClean = (project.name || '').toLowerCase().trim();
    const projLocClean = (project.location || '').toLowerCase().trim();

    // 1. Get live site tasks from global tasks context matching this project name or location
    const matchingGlobalTasks = (tasks || []).filter(t => {
      if (!t) return false;
      const siteClean = (t.site || '').toLowerCase().trim();
      return (projNameClean && (siteClean.includes(projNameClean) || projNameClean.includes(siteClean))) ||
             (projLocClean && (siteClean.includes(projLocClean) || projLocClean.includes(siteClean)));
    });

    if (matchingGlobalTasks.length > 0) {
      return matchingGlobalTasks;
    }

    // 2. If project.tasks is defined, filter out any task that was deleted from global tasks
    if (project.tasks && Array.isArray(project.tasks) && project.tasks.length > 0) {
      const globalTaskTitles = new Set((tasks || []).map(t => (t.title || t.name || '').toLowerCase().trim()));
      return project.tasks.filter(t => t && t.title && globalTaskTitles.has(t.title.toLowerCase().trim()));
    }

    return [];
  }, [project, tasks]);

  const handleOpenTasksModal = () => {
    setEditTasks(JSON.parse(JSON.stringify(projectTasks)));
    setIsTaskModalOpen(true);
  };

  const handleUpdateTaskField = (index, field, value) => {
    setEditTasks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveTask = (index) => {
    setEditTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTasks = (e) => {
    e.preventDefault();
    const validTasks = editTasks.filter(t => t.title.trim() !== '');

    // 1. Identify removed tasks and delete them from global tasks
    const editedTaskIds = new Set(validTasks.filter(t => t.id).map(t => t.id));
    projectTasks.forEach(pt => {
      if (pt.id && !editedTaskIds.has(pt.id)) {
        if (deleteTask) deleteTask(pt.id);
      }
    });

    // 2. Update existing tasks or add new tasks in global tasks context
    validTasks.forEach(t => {
      if (t.id) {
        if (updateTask) {
          updateTask(t.id, {
            title: t.title.trim(),
            priority: t.priority || 'Medium',
            status: t.status || 'Pending',
            assignee: t.assignee || project.manager || 'Mathan'
          });
        }
      } else {
        if (addTask) {
          addTask({
            title: t.title.trim(),
            site: project.name,
            priority: t.priority || 'Medium',
            status: t.status || 'Pending',
            assignee: t.assignee || project.manager || 'Mathan'
          });
        }
      }
    });

    // 3. Save tasks to project object state as well
    updateProject(project.id, {
      tasks: validTasks,
      siteTasks: validTasks
    });

    setIsTaskModalOpen(false);
  };

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-700">Project Not Found</h2>
        <button onClick={() => navigate('/projects')} className="mt-4 px-4 py-2 bg-[#7C3AED] text-white rounded-full text-xs font-bold">
          Back to Projects
        </button>
      </div>
    );
  }

  const activeWorkersCount = projectTeamMembers.length;

  return (
    <div className="space-y-8 pb-8">
      {/* Top Breadcrumb & Navigation Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="bg-white/80 hover:bg-white text-[#03020A] border border-purple-100 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="text-sm text-[#7C3AED]" />
          <span>Back to Projects List</span>
        </button>

        <div className="flex items-center gap-2">
          {project.status !== "Cancelled" ? (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Cancel this project"
            >
              <FiTrash2 className="text-xs text-rose-600" />
              <span>Cancel Project</span>
            </button>
          ) : (
            <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold px-3 py-1 rounded-full">
              Project Cancelled
            </span>
          )}

          <Badge variant={project.status === "Completed" ? "completed" : project.status === "Cancelled" ? "overdue" : "in-progress"}>
            {project.status}
          </Badge>
          <span className="text-xs font-bold text-[#7C3AED] bg-purple-100/60 px-3 py-1 rounded-full">
            Site ID #PRJ-00{project.id}
          </span>
        </div>
      </div>

      {/* Hero Project Card */}
      <div className="glass-hero-purple p-8 rounded-4xl border border-white/90 shadow-[0_14px_36px_rgba(167,139,250,0.15)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#7C3AED] flex items-center justify-center text-2xl shadow-md border border-white shrink-0">
                <FaBuilding />
              </div>
              <div>
                {/* Project Title with Hover Edit Icon */}
                <div className="group relative inline-flex items-center gap-2.5">
                  <h1 className="text-3xl font-extrabold text-[#03020A] tracking-tight">{project.name}</h1>
                  <button
                    type="button"
                    onClick={handleOpenEdit}
                    title="Edit Project Details"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-xl bg-white/90 hover:bg-white text-[#7C3AED] hover:text-purple-900 border border-purple-100/90 shadow-sm cursor-pointer flex items-center gap-1 text-xs font-extrabold"
                  >
                    <FiEdit2 className="text-xs text-[#7C3AED]" />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-xs font-bold text-purple-700 flex items-center gap-1.5 mt-0.5">
                  <FiMapPin /> {project.location} • Site Manager: {project.manager}
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed pt-1">
              {project.description || "Active construction site development project."}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-white grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm shrink-0">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Budget Spent</p>
              <p className="text-sm font-extrabold text-[#03020A] mt-0.5 flex items-center gap-1">
                <span className="text-purple-600 font-bold">₹</span>
                {project.budget ? project.budget.replace(/^\$/, '₹') : "₹1.5 Cr / ₹5.0 Cr"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Site Workers</p>
              <p className="text-sm font-extrabold text-[#03020A] mt-0.5 flex items-center gap-1">
                <FiUsers className="text-purple-600" />
                {activeWorkersCount} Assigned
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Target Date</p>
              <p className="text-sm font-extrabold text-[#03020A] mt-0.5 flex items-center gap-1">
                <FiCalendar className="text-purple-600" />
                {project.deadline}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Completion Progress */}
        <div className="mt-6 pt-6 border-t border-purple-200/60 max-w-3xl">
          <ProgressBar progress={project.progress} variant="purple" size="md" />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Milestones & Tasks', icon: FiCheckSquare },
          { id: 'team', label: 'Site Team & Personnel', icon: FiUsers },
          { id: 'resources', label: 'Materials & Equipment', icon: FiLayers }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#03020A] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
              }`}
            >
              <Icon className={activeTab === tab.id ? 'text-[#BEF264]' : 'text-purple-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Milestones & Tasks */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
              <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
                <FiCheckCircle className="text-[#7C3AED]" />
                Construction Milestones
              </h3>
              <button
                type="button"
                onClick={handleOpenMilestonesModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <FiEdit2 className="text-xs text-[#7C3AED]" />
                <span>Edit</span>
              </button>
            </div>
            <div className="space-y-3">
              {projectMilestones.map((m, index) => (
                <div 
                  key={index} 
                  onClick={() => handleToggleMilestoneStatus(index)}
                  className="bg-white/80 hover:bg-white p-4 rounded-2xl border border-white flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs group"
                  title="Click to cycle milestone status & update project progress"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      m.status === 'Completed' ? 'bg-[#F0FDC2] text-[#3F6212]' : m.status === 'In Progress' ? 'bg-[#E9D5FF] text-[#6B21A8]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {m.status === 'Completed' ? <FiCheckCircle className="text-sm text-[#3F6212]" /> : index + 1}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${m.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#03020A]'}`}>{m.name}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{m.date}</p>
                    </div>
                  </div>
                  <Badge variant={m.status === 'Completed' ? 'completed' : m.status === 'In Progress' ? 'in-progress' : 'pending'}>
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
              <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
                <FiClock className="text-[#7C3AED]" />
                Active Site Tasks Checklist
              </h3>
              <button
                type="button"
                onClick={handleOpenTasksModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <FiEdit2 className="text-xs text-[#7C3AED]" />
                <span>Edit</span>
              </button>
            </div>
            <div className="space-y-3">
              {projectTasks.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/60 text-center text-xs font-semibold text-slate-500">
                  No active site tasks assigned to this project site yet. Click "Edit" to add a site task.
                </div>
              ) : (
                projectTasks.map((t, index) => (
                  <div 
                    key={t.id || index}
                    className="bg-white/80 p-4 rounded-2xl border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                        t.status === "Completed" 
                          ? "bg-[#7C3AED] border-[#7C3AED] text-white font-bold" 
                          : t.overdue || t.status === "Overdue"
                          ? "bg-rose-100 border-rose-300 text-rose-700 font-bold"
                          : "border-purple-200 bg-purple-50 text-[#7C3AED] font-bold"
                      }`}>
                        {t.status === "Completed" ? <FiCheckCircle className="text-xs" /> : <FiCheckSquare className="text-xs" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-xs font-extrabold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#03020A]'}`}>
                          {t.title || t.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            Priority: {t.priority || 'Medium'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            Assigned to: <strong className="text-purple-800 font-extrabold">{t.assignee || project?.manager || 'Mathan'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Badge variant={t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : t.overdue || t.status === 'Overdue' ? 'overdue' : 'pending'}>
                        {t.overdue || t.status === 'Overdue' ? 'Overdue' : t.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Site Team Roster */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-purple-100 text-[#7C3AED]">
                <FiUsers className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#03020A]">Assigned Site Personnel ({projectTeamMembers.length})</h3>
                <p className="text-xs font-semibold text-slate-500">Site engineers, managers & active workforce leads</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenTeamModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <FiEdit2 className="text-xs text-[#7C3AED]" />
              <span>Edit Team</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectTeamMembers.length === 0 ? (
              <div className="col-span-full glass-card p-8 rounded-3xl text-center space-y-2 border border-white">
                <FiUsers className="text-2xl text-[#7C3AED] mx-auto" />
                <p className="text-xs font-extrabold text-[#03020A]">No Site Personnel Assigned</p>
                <p className="text-[11px] text-slate-500 font-semibold">Click "Edit Team" above to add site engineers or workers to this project.</p>
              </div>
            ) : (
              projectTeamMembers.map((mem, index) => (
                <Card key={index} hover={true} className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#E9D5FF] to-[#D9F99D] text-[#6B21A8] flex items-center justify-center font-extrabold text-lg mx-auto shadow-md border-2 border-white">
                    {mem.name ? mem.name.charAt(0).toUpperCase() : 'W'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#03020A]">{mem.name}</h4>
                    <p className="text-xs font-semibold text-purple-600">{mem.trade || mem.role || 'Site Engineer'}</p>
                    {project.status === 'Cancelled' && (
                      <div className="mt-1.5 bg-rose-50 border border-rose-200 p-1.5 rounded-xl">
                        <span className="text-[10px] font-extrabold text-rose-700 block">
                          your assigned project was cancelled by admin
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 bg-purple-50 py-1 px-3 rounded-full">
                    {mem.phone || mem.contact || '+91 98765 00000'}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Materials & Equipment */}
      {activeTab === 'resources' && (
        <div className="w-full space-y-6">
          <Card hover={false} className="w-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
              <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
                <FiLayers className="text-[#7C3AED]" />
                Material Stock Allocation
              </h3>
              <button
                type="button"
                onClick={handleOpenMaterialsModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <FiEdit2 className="text-xs text-[#7C3AED]" />
                <span>Edit</span>
              </button>
            </div>
            <div className="space-y-4">
              {projectAllocatedMaterials.map((mat, i) => (
                <div key={i} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#03020A]">{mat.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">Quantity: {mat.quantity || mat.totalStock}</p>
                  </div>
                  <Badge variant={mat.status === 'Stocked' ? 'completed' : mat.status === 'In Use' ? 'in-progress' : mat.status === 'Low Stock Alert' ? 'pending' : 'overdue'}>
                    {mat.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Edit Project Details Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-4xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
                  <FiEdit2 className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Project Details</h3>
                  <p className="text-xs font-semibold text-slate-500">Update project name, location, site engineer & metrics</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Project Name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Site Location"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Site Engineer / Manager</label>
                <input
                  type="text"
                  value={editManager}
                  onChange={(e) => {
                    setEditManager(e.target.value);
                    setEngineerSearchQuery(e.target.value);
                    setShowEngineerSuggestions(true);
                  }}
                  onFocus={() => {
                    setEngineerSearchQuery('');
                    setShowEngineerSuggestions(true);
                  }}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Enter or select Site Engineer Name"
                  required
                />

                {/* Autocomplete Suggestions Dropdown */}
                {showEngineerSuggestions && filteredEngineers.length > 0 && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto p-1.5 animate-in fade-in duration-150">
                    <div className="text-[10px] font-extrabold text-purple-700 px-3 py-1 uppercase tracking-wider flex items-center justify-between border-b border-purple-100/60 mb-1">
                      <span>Saved Site Engineers ({filteredEngineers.length})</span>
                      <button
                        type="button"
                        onClick={() => setShowEngineerSuggestions(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    {filteredEngineers.map((eng) => (
                      <button
                        key={eng.id || eng.name}
                        type="button"
                        onClick={() => {
                          setEditManager(eng.name);
                          setEngineerSearchQuery('');
                          setShowEngineerSuggestions(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                          editManager.toLowerCase().trim() === eng.name.toLowerCase().trim() ? 'bg-purple-50/80 border border-purple-200' : ''
                        }`}
                      >
                        <div>
                          <p className="text-xs font-extrabold text-[#03020A] group-hover:text-[#7C3AED] flex items-center gap-1.5">
                            {eng.name}
                            {editManager.toLowerCase().trim() === eng.name.toLowerCase().trim() && (
                              <span className="text-[9px] font-extrabold text-[#3F6212] bg-[#F0FDC2] px-1.5 py-0.5 rounded-md">Selected</span>
                            )}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500">{eng.role}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Budget Spent</label>
                <input
                  type="text"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Enter Budget Spent / Total Budget"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Start Date</label>
                  <input
                    type="text"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                    placeholder="e.g. Feb 15, 2026 or YYYY-MM-DD"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Completion Date</label>
                  <input
                    type="text"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                    placeholder="e.g. Feb 15, 2027 or YYYY-MM-DD"
                  />
                </div>
              </div>

              {calcEditDurationDays !== null && (
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs font-bold text-purple-900">
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-[#7C3AED]" /> Calculated Report Execution Duration:
                  </span>
                  <span className="bg-[#7C3AED] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs">
                    {calcEditDurationDays} Days
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Site Workers</label>
                  <input
                    type="number"
                    value={editWorkers}
                    onChange={(e) => setEditWorkers(e.target.value)}
                    className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                    placeholder="Workers count"
                    min="0"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="text-sm text-[#BEF264]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Construction Milestones Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-4xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
                  <FiCheckCircle className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Construction Milestones</h3>
                  <p className="text-xs font-semibold text-slate-500">Update milestone title, target date & status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Form List */}
            <form onSubmit={handleSaveMilestones} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="space-y-3">
                {editMilestones.map((m, idx) => (
                  <div key={idx} className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-3 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-xs font-extrabold">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        title="Delete Milestone"
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-100 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="text-xs" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Milestone Name</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleUpdateMilestoneField(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="e.g. Foundation & Excavation"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Date</label>
                        <input
                          type="text"
                          value={m.date}
                          onChange={(e) => handleUpdateMilestoneField(idx, 'date', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="e.g. Feb 2026"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                        <select
                          value={m.status}
                          onChange={(e) => handleUpdateMilestoneField(idx, 'status', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMilestone}
                className="w-full py-3 border-2 border-dashed border-purple-200 hover:border-[#7C3AED] bg-purple-50/40 hover:bg-purple-50 text-[#7C3AED] text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiPlus className="text-sm" />
                <span>Add New Milestone</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="text-sm text-[#BEF264]" />
                  <span>Save Milestones</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Active Site Tasks Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-4xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
                  <FiClock className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Active Site Tasks</h3>
                  <p className="text-xs font-semibold text-slate-500">Update task descriptions, priority levels & status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Form List */}
            <form onSubmit={handleSaveTasks} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="space-y-3">
                {editTasks.map((t, idx) => (
                  <div key={idx} className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-3 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-xs font-extrabold">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        title="Delete Task"
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-100 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="text-xs" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Description</label>
                        <input
                          type="text"
                          value={t.title}
                          onChange={(e) => handleUpdateTaskField(idx, 'title', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="e.g. Inspect rebar binding"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Priority</label>
                        <select
                          value={t.priority}
                          onChange={(e) => handleUpdateTaskField(idx, 'priority', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Status (Worker Updated)</label>
                        <div className="w-full bg-slate-100 border border-slate-200 text-xs font-extrabold rounded-xl px-3 py-2.5 text-slate-700 flex items-center justify-between select-none">
                          <span>{t.overdue || t.status === 'Overdue' ? 'Overdue' : (t.status || 'Pending')}</span>
                          <span className="text-[9px] font-extrabold uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-md">Read-Only</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="text-sm text-[#BEF264]" />
                  <span>Save Tasks</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Site Team Roster Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-[32px] p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
                  <FiUsers className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Site Team & Personnel</h3>
                  <p className="text-xs font-semibold text-slate-500">Add from saved workers or edit engineer details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Quick Search & Auto-Fill from Saved Personnel */}
            <div className="relative shrink-0">
              <label className="block text-xs font-extrabold text-[#7C3AED] mb-1.5 flex items-center gap-1.5">
                <FiSearch className="text-xs" />
                <span>Search & Add from Saved Workers / Engineers</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={workerSearchQuery}
                  onChange={(e) => {
                    setWorkerSearchQuery(e.target.value);
                    setShowWorkerSearchDropdown(true);
                  }}
                  onFocus={() => setShowWorkerSearchDropdown(true)}
                  className="w-full bg-purple-50/50 border border-purple-200 text-xs font-semibold rounded-2xl p-3 pl-10 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Search worker by name, trade or phone..."
                />
                <FiSearch className="absolute left-3.5 top-3.5 text-purple-400 text-sm" />
              </div>

              {/* Autocomplete Search Dropdown */}
              {showWorkerSearchDropdown && searchedPersonnelCandidates.length > 0 && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl max-h-52 overflow-y-auto p-1.5 animate-in fade-in duration-150">
                  <div className="text-[10px] font-extrabold text-purple-700 px-3 py-1 uppercase tracking-wider flex items-center justify-between border-b border-purple-100/60 mb-1">
                    <span>Saved Personnel Roster ({searchedPersonnelCandidates.length})</span>
                    <button
                      type="button"
                      onClick={() => setShowWorkerSearchDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  {searchedPersonnelCandidates.map((cand, idx) => {
                    const isAlreadyAdded = editTeamMembers.some(m => m.name.toLowerCase().trim() === cand.name.toLowerCase().trim());
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSavedWorker(cand)}
                        disabled={isAlreadyAdded}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isAlreadyAdded ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'hover:bg-purple-50 group'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xs font-extrabold shrink-0">
                            {cand.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[#03020A] group-hover:text-[#7C3AED]">{cand.name}</p>
                            <p className="text-[10px] font-semibold text-slate-500">{cand.trade} • {cand.phone}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                          isAlreadyAdded ? 'bg-slate-200 text-slate-500' : 'bg-purple-100 text-purple-700 group-hover:bg-[#7C3AED] group-hover:text-white'
                        }`}>
                          {isAlreadyAdded ? 'Added' : '+ Add Auto-Fill'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Form List */}
            <form onSubmit={handleSaveTeam} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="space-y-3">
                {editTeamMembers.map((m, idx) => (
                  <div key={idx} className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-3 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-xs font-extrabold">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(idx)}
                        title="Delete Member"
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-100 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="text-xs" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Site Member Name</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleUpdateTeamMemberField(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="Engineer or Worker Name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Role / Trade</label>
                        <input
                          type="text"
                          value={m.trade}
                          onChange={(e) => handleUpdateTeamMemberField(idx, 'trade', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="e.g. Masonry Lead / Engineer"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Info / Phone</label>
                        <input
                          type="text"
                          value={m.phone}
                          onChange={(e) => handleUpdateTeamMemberField(idx, 'phone', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="Phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-[#BEF264] font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="text-sm text-[#BEF264]" />
                  <span>Save Team Roster</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Stock Allocation Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-[32px] p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
                  <FiLayers className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Material Stock Allocation</h3>
                  <p className="text-xs font-semibold text-slate-500">Allocate saved inventory & automatically deduct stock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Quick Search & Auto-Fill from Saved Materials Page */}
            <div className="relative shrink-0">
              <label className="block text-xs font-extrabold text-[#7C3AED] mb-1.5 flex items-center gap-1.5">
                <FiSearch className="text-xs" />
                <span>Search & Select from Saved Materials (Materials Page)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={matSearchQuery}
                  onChange={(e) => {
                    setMatSearchQuery(e.target.value);
                    setShowMatSearchDropdown(true);
                  }}
                  onFocus={() => setShowMatSearchDropdown(true)}
                  className="w-full bg-purple-50/50 border border-purple-200 text-xs font-semibold rounded-2xl p-3 pl-10 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Search saved material by name or category..."
                />
                <FiSearch className="absolute left-3.5 top-3.5 text-purple-400 text-sm" />
              </div>

              {/* Autocomplete Search Dropdown */}
              {showMatSearchDropdown && searchedMaterialCandidates.length > 0 && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl max-h-52 overflow-y-auto p-1.5 animate-in fade-in duration-150">
                  <div className="text-[10px] font-extrabold text-purple-700 px-3 py-1 uppercase tracking-wider flex items-center justify-between border-b border-purple-100/60 mb-1">
                    <span>Saved Materials Inventory ({searchedMaterialCandidates.length})</span>
                    <button
                      type="button"
                      onClick={() => setShowMatSearchDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  {searchedMaterialCandidates.map((cand, idx) => {
                    const isAlreadyAllocated = editAllocatedMaterials.some(m => m.name.toLowerCase().trim() === cand.name.toLowerCase().trim());
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSavedMaterial(cand)}
                        disabled={isAlreadyAllocated}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isAlreadyAllocated ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'hover:bg-purple-50 group'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-extrabold text-[#03020A] group-hover:text-[#7C3AED]">{cand.name}</p>
                          <p className="text-[10px] font-semibold text-slate-500">{cand.category} • Total Stock: {cand.totalStock}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                          isAlreadyAllocated ? 'bg-slate-200 text-slate-500' : 'bg-purple-100 text-purple-700 group-hover:bg-[#7C3AED] group-hover:text-white'
                        }`}>
                          {isAlreadyAllocated ? 'Allocated' : '+ Add Allocation'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Form List */}
            <form onSubmit={handleSaveMaterials} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="space-y-3">
                {editAllocatedMaterials.map((m, idx) => (
                  <div key={idx} className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-3 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-xs font-extrabold">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllocatedMaterial(idx)}
                        title="Delete Material Allocation"
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-100 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="text-xs" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Material Name</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleUpdateAllocatedMaterialField(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="e.g. Ready-Mix Concrete Grade 40"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity Needed / Allocated</label>
                        <input
                          type="text"
                          value={m.quantity}
                          onChange={(e) => handleUpdateAllocatedMaterialField(idx, 'quantity', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                          placeholder="e.g. 450 cu.m / 45 Tons"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Allocation Status</label>
                        <select
                          value={m.status}
                          onChange={(e) => handleUpdateAllocatedMaterialField(idx, 'status', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
                        >
                          <option value="Stocked">Stocked</option>
                          <option value="In Use">In Use</option>
                          <option value="Low Stock Alert">Low Stock Alert</option>
                          <option value="Reorder Required">Reorder Required</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddBlankMaterial}
                className="w-full py-3 border-2 border-dashed border-purple-200 hover:border-[#7C3AED] bg-purple-50/40 hover:bg-purple-50 text-[#7C3AED] text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiPlus className="text-sm" />
                <span>Add Custom Material</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="text-sm text-[#BEF264]" />
                  <span>Save Allocation & Deduct Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Project Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-extrabold text-base">
                <FiTrash2 className="text-xl text-rose-600" />
                <span>Cancel Construction Project</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-semibold leading-relaxed">
                Are you sure you want to cancel <strong className="text-[#03020A]">{project.name}</strong> (Site ID #{project.id})?
              </p>
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl space-y-1.5 text-[#9F1239]">
                <p className="font-extrabold">Connected System Effects:</p>
                <ul className="list-disc list-inside space-y-1 font-medium">
                  <li>Project status will update to <strong>Cancelled</strong>.</li>
                  <li>Automatically removed from active Dashboard project cards and updated total project counts.</li>
                  <li>Assigned workers will receive status alert: <span className="font-bold underline">"your assigned project was cancelled by admin"</span>.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Keep Project Active
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelProject(project.id);
                  setShowCancelModal(false);
                  navigate('/projects');
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiTrash2 className="text-white" />
                <span>Confirm Cancel Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
