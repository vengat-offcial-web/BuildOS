import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';
import AssignProject from './AssignProject';
import {
  ProjectDetailsHeader,
  ProjectDetailsHero,
  ProjectTabsNav,
  MilestonesCard,
  ActiveTasksCard,
  SiteTeamRosterCard,
  MaterialAllocationsCard,
  EditProjectModal,
  EditMilestonesModal,
  EditTasksModal,
  EditTeamModal,
  EditMaterialsModal,
  CancelProjectModal
} from '../components/ProjectDetails';

// Helper to parse any date format into YYYY-MM-DD for native HTML date input
const formatToISOInputDate = (dateStr) => {
  if (!dateStr) return '';
  const trimmed = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  try {
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        const d = String(parts[0]).padStart(2, '0');
        const m = String(parts[1]).padStart(2, '0');
        const y = parts[2];
        return `${y}-${m}-${d}`;
      }
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const dd = String(parsed.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch {}
  return '';
};

// Helper to convert ISO date YYYY-MM-DD to human readable "Feb 15, 2027"
const formatToHumanReadableDate = (isoStr) => {
  if (!isoStr) return '';
  try {
    const parsed = new Date(isoStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {}
  return isoStr;
};

function ProjectDetails() {
  const { id } = useParams();

  if (id === 'new' || id === 'create') {
    return <AssignProject />;
  }

  const navigate = useNavigate();
  const { getProjectById, updateProject, cancelProject, addTask, updateTask, deleteTask, workers, materials, tasks } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Modal States
  const [showCancelModal, setShowCancelModal] = useState(false);
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

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editMilestones, setEditMilestones] = useState([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTasks, setEditTasks] = useState([]);

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editAllocatedMaterials, setEditAllocatedMaterials] = useState([]);
  const [showMatSearchDropdown, setShowMatSearchDropdown] = useState(false);

  const project = getProjectById(id);

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

  const siteWorkers = useMemo(() => {
    return workers.filter(w => project && project.name && (w.site.toLowerCase().includes(project.name.toLowerCase()) || w.site.toLowerCase().includes(project.location.toLowerCase()))).slice(0, 4);
  }, [workers, project]);

  const projectTeamMembers = (project && Array.isArray(project.teamMembers))
    ? project.teamMembers
    : (siteWorkers.length > 0 ? siteWorkers : []);

  const defaultAllocatedMaterials = [
    { id: 1, name: "Ready-Mix Concrete Grade 40", quantity: "450 cu.m", status: "Stocked" },
    { id: 2, name: "TMT Rebar Steel 16mm", quantity: "18 Tons", status: "Stocked" },
    { id: 3, name: "Structural Double-Glazed Panels", quantity: "240 Units", status: "Low Stock Alert" }
  ];

  const projectAllocatedMaterials = useMemo(() => {
    const projNameClean = (project?.name || '').toLowerCase().trim();
    const projLocClean = (project?.location || '').toLowerCase().trim();

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

  const defaultMilestones = [
    { name: "Foundation & Excavation", status: "Completed", date: "Feb 2026" },
    { name: "Structural Superstructure", status: project && project.progress > 50 ? "Completed" : "In Progress", date: "May 2026" },
    { name: "Exterior Glass Panel Fitting", status: project && project.progress > 70 ? "In Progress" : "Pending", date: "Aug 2026" },
    { name: "Final MEP Inspection & Handover", status: project && project.progress === 100 ? "Completed" : "Pending", date: "Oct 2026" }
  ];

  const projectMilestones = (project && project.milestones && project.milestones.length > 0) ? project.milestones : defaultMilestones;

  const projectTasks = useMemo(() => {
    if (!project) return [];
    const projNameClean = (project.name || '').toLowerCase().trim();
    const projLocClean = (project.location || '').toLowerCase().trim();

    const matchingGlobalTasks = (tasks || []).filter(t => {
      if (!t) return false;
      const siteClean = (t.site || '').toLowerCase().trim();
      return (projNameClean && (siteClean.includes(projNameClean) || projNameClean.includes(siteClean))) ||
             (projLocClean && (siteClean.includes(projLocClean) || projLocClean.includes(siteClean)));
    });

    if (matchingGlobalTasks.length > 0) {
      return matchingGlobalTasks;
    }

    if (project.tasks && Array.isArray(project.tasks) && project.tasks.length > 0) {
      const globalTaskTitles = new Set((tasks || []).map(t => (t.title || t.name || '').toLowerCase().trim()));
      return project.tasks.filter(t => t && t.title && globalTaskTitles.has(t.title.toLowerCase().trim()));
    }

    return [];
  }, [project, tasks]);

  // Handlers for Team Modal
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

  // Handlers for Materials Modal
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

  // Handlers for Main Edit Modal
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

  // Handlers for Milestones Modal
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

  // Handlers for Tasks Modal
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

    const editedTaskIds = new Set(validTasks.filter(t => t.id).map(t => t.id));
    projectTasks.forEach(pt => {
      if (pt.id && !editedTaskIds.has(pt.id)) {
        if (deleteTask) deleteTask(pt.id);
      }
    });

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
      {/* Top Header & Navigation */}
      <ProjectDetailsHeader
        project={project}
        onBack={() => navigate('/projects')}
        onCancelClick={() => setShowCancelModal(true)}
      />

      {/* Hero Card */}
      <ProjectDetailsHero
        project={project}
        activeWorkersCount={activeWorkersCount}
        onEditClick={handleOpenEdit}
      />

      {/* Tabs Menu Navigation */}
      <ProjectTabsNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab 1: Milestones & Tasks */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MilestonesCard
            milestones={projectMilestones}
            onOpenModal={handleOpenMilestonesModal}
            onToggleStatus={handleToggleMilestoneStatus}
          />

          <ActiveTasksCard
            tasks={projectTasks}
            projectManager={project.manager}
            onOpenModal={handleOpenTasksModal}
          />
        </div>
      )}

      {/* Tab 2: Site Team Roster */}
      {activeTab === 'team' && (
        <SiteTeamRosterCard
          teamMembers={projectTeamMembers}
          isCancelled={project.status === 'Cancelled'}
          onOpenModal={handleOpenTeamModal}
        />
      )}

      {/* Tab 3: Materials & Equipment */}
      {activeTab === 'resources' && (
        <MaterialAllocationsCard
          materials={projectAllocatedMaterials}
          onOpenModal={handleOpenMaterialsModal}
        />
      )}

      {/* Modals */}
      <EditProjectModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        editName={editName}
        setEditName={setEditName}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        editManager={editManager}
        setEditManager={setEditManager}
        editBudget={editBudget}
        setEditBudget={setEditBudget}
        editStartDate={editStartDate}
        setEditStartDate={setEditStartDate}
        editDeadline={editDeadline}
        setEditDeadline={setEditDeadline}
        editWorkers={editWorkers}
        setEditWorkers={setEditWorkers}
        showEngineerSuggestions={showEngineerSuggestions}
        setShowEngineerSuggestions={setShowEngineerSuggestions}
        filteredEngineers={filteredEngineers}
        setEngineerSearchQuery={setEngineerSearchQuery}
        formatToISOInputDate={formatToISOInputDate}
        formatToHumanReadableDate={formatToHumanReadableDate}
        calcEditDurationDays={calcEditDurationDays}
        onSave={handleSaveEdit}
      />

      <EditMilestonesModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        editMilestones={editMilestones}
        onUpdateField={handleUpdateMilestoneField}
        onAddMilestone={handleAddMilestone}
        onRemoveMilestone={handleRemoveMilestone}
        onSave={handleSaveMilestones}
      />

      <EditTasksModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        editTasks={editTasks}
        onUpdateTaskField={handleUpdateTaskField}
        onRemoveTask={handleRemoveTask}
        onSave={handleSaveTasks}
      />

      <EditTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        workerSearchQuery={workerSearchQuery}
        setWorkerSearchQuery={setWorkerSearchQuery}
        showWorkerSearchDropdown={showWorkerSearchDropdown}
        setShowWorkerSearchDropdown={setShowWorkerSearchDropdown}
        searchedPersonnelCandidates={searchedPersonnelCandidates}
        editTeamMembers={editTeamMembers}
        onSelectSavedWorker={handleSelectSavedWorker}
        onRemoveTeamMember={handleRemoveTeamMember}
        onUpdateTeamMemberField={handleUpdateTeamMemberField}
        onSave={handleSaveTeam}
      />

      <EditMaterialsModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        matSearchQuery={matSearchQuery}
        setMatSearchQuery={setMatSearchQuery}
        showMatSearchDropdown={showMatSearchDropdown}
        setShowMatSearchDropdown={setShowMatSearchDropdown}
        searchedMaterialCandidates={searchedMaterialCandidates}
        editAllocatedMaterials={editAllocatedMaterials}
        onSelectSavedMaterial={handleSelectSavedMaterial}
        onRemoveMaterial={handleRemoveAllocatedMaterial}
        onUpdateMaterialField={handleUpdateAllocatedMaterialField}
        onAddBlankMaterial={handleAddBlankMaterial}
        onSave={handleSaveMaterials}
      />

      <CancelProjectModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        projectName={project.name}
        projectId={project.id}
        onConfirm={() => {
          cancelProject(project.id);
          setShowCancelModal(false);
          navigate('/projects');
        }}
      />
    </div>
  );
}

export default ProjectDetails;
