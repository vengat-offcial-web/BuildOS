import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, ProgressBar, Card } from '../components/ui';
import { FiArrowLeft,FiMapPin,FiCalendar,FiDollarSign,FiCheckCircle,FiClock,FiUsers,FiLayers,FiTruck,FiCheckSquare,FiEdit2,FiX,FiSave,FiPlus,FiTrash2,FiUserCheck
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';
import { useData } from '../context/useData';
import AssignProject from './AssignProject';
import { initialEngineersData } from '../data';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, updateProject, workers, materials, machines, tasks } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editManager, setEditManager] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editWorkers, setEditWorkers] = useState('');
  const [editMachinery, setEditMachinery] = useState('');
  const [showEngineerSuggestions, setShowEngineerSuggestions] = useState(false);

  const filteredEngineers = useMemo(() => {
    const term = (editManager || '').toLowerCase().trim();
    if (!term) return initialEngineersData;
    return initialEngineersData.filter(eng =>
      eng.name.toLowerCase().includes(term) ||
      eng.role.toLowerCase().includes(term)
    );
  }, [editManager]);

  // Milestone Edit Modal State
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editMilestones, setEditMilestones] = useState([]);

  // Guard for route collision
  if (id === 'new' || id === 'create') {
    return <AssignProject />;
  }

  const project = getProjectById(id);

  const siteWorkers = workers.filter(w => project && project.name && (w.site.toLowerCase().includes(project.name.toLowerCase()) || w.site.toLowerCase().includes(project.location.toLowerCase()))).slice(0, 4);

  const handleOpenEdit = () => {
    if (!project) return;
    setEditName(project.name || '');
    setEditManager(project.manager || '');
    const currentBudget = project.budget ? project.budget.replace(/^\$/, '₹') : '₹1.5 Cr / ₹5.0 Cr';
    setEditBudget(currentBudget);
    setEditDeadline(project.deadline || 'Feb 15, 2027');
    setEditWorkers(project.workforceRequired !== undefined && project.workforceRequired !== null ? String(project.workforceRequired) : String(siteWorkers.length || 4));
    setEditMachinery(project.machineryCount !== undefined && project.machineryCount !== null ? String(project.machineryCount) : String(machines.length || 4));
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProject(project.id, {
      name: editName.trim(),
      manager: editManager.trim(),
      budget: editBudget.trim(),
      deadline: editDeadline.trim(),
      workforceRequired: parseInt(editWorkers, 10) || 0,
      machineryCount: parseInt(editMachinery, 10) || 0
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
    const completedCount = validMilestones.filter(m => m.status === 'Completed').length;
    const calcProgress = validMilestones.length > 0 ? Math.round((completedCount / validMilestones.length) * 100) : (project ? project.progress : 0);
    updateProject(project.id, {
      milestones: validMilestones,
      progress: calcProgress
    });
    setIsMilestoneModalOpen(false);
  };

  // Task Edit Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTasks, setEditTasks] = useState([]);

  const defaultTasks = [
    { id: 1, title: "Glass facade panel alignment on Floor 18", priority: "High", status: "In Progress" },
    { id: 2, title: "Structural core concrete compression testing", priority: "High", status: "Completed" },
    { id: 3, title: "Track signaling cable laying Pier 42–48", priority: "High", status: "In Progress" },
    { id: 4, title: "Basement 2 main electrical transformer wiring", priority: "High", status: "Overdue" }
  ];

  const projectTasks = (project && project.tasks && project.tasks.length > 0) ? project.tasks : defaultTasks;

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

  const handleAddTask = () => {
    setEditTasks(prev => [
      ...prev,
      { title: "New On-Site Task Inspection", priority: "Medium", status: "Pending" }
    ]);
  };

  const handleRemoveTask = (index) => {
    setEditTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTasks = (e) => {
    e.preventDefault();
    const validTasks = editTasks.filter(t => t.title.trim() !== '');
    updateProject(project.id, {
      tasks: validTasks
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

  const activeWorkersCount = project.workforceRequired !== undefined && project.workforceRequired !== null ? project.workforceRequired : (siteWorkers.length || 4);
  const activeMachineryCount = project.machineryCount !== undefined && project.machineryCount !== null ? project.machineryCount : machines.length;

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
          <Badge variant={project.status === "Completed" ? "completed" : "in-progress"}>
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
              <p className="text-[10px] font-bold uppercase text-slate-400">Machinery</p>
              <p className="text-sm font-extrabold text-[#03020A] mt-0.5 flex items-center gap-1">
                <FiTruck className="text-purple-600" />
                {activeMachineryCount} Active
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
                <div key={index} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      m.status === 'Completed' ? 'bg-[#F0FDC2] text-[#3F6212]' : m.status === 'In Progress' ? 'bg-[#E9D5FF] text-[#6B21A8]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#03020A]">{m.name}</h4>
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
              {projectTasks.map((t, index) => (
                <div key={index} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#03020A]">{t.title}</h4>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      Priority: {t.priority}
                    </span>
                  </div>
                  <Badge variant={t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : t.status === 'Overdue' ? 'overdue' : 'pending'}>
                    {t.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Site Team Roster */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(siteWorkers.length > 0 ? siteWorkers : workers.slice(0, 4)).map((mem, index) => (
            <Card key={index} hover={true} className="text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#E9D5FF] to-[#D9F99D] text-[#6B21A8] flex items-center justify-center font-extrabold text-lg mx-auto shadow-md border-2 border-white">
                {mem.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#03020A]">{mem.name}</h4>
                <p className="text-xs font-semibold text-purple-600">{mem.trade}</p>
              </div>
              <p className="text-[11px] font-medium text-slate-500 bg-purple-50 py-1 px-3 rounded-full">
                {mem.phone}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Materials & Equipment */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card hover={false}>
            <h3 className="text-lg font-extrabold text-[#03020A] mb-4 pb-3 border-b border-purple-100 flex items-center gap-2">
              <FiLayers className="text-[#7C3AED]" />
              Material Stock Allocation
            </h3>
            <div className="space-y-4">
              {materials.slice(0, 3).map((mat, i) => (
                <div key={i} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#03020A]">{mat.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">Quantity: {mat.totalStock}</p>
                  </div>
                  <Badge variant={mat.status === 'Stocked' ? 'completed' : 'in-progress'}>{mat.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false}>
            <h3 className="text-lg font-extrabold text-[#03020A] mb-4 pb-3 border-b border-purple-100 flex items-center gap-2">
              <FiTruck className="text-[#7C3AED]" />
              Heavy Machinery On-Site
            </h3>
            <div className="space-y-4">
              {machines.slice(0, 3).map((mac, i) => (
                <div key={i} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#03020A]">{mac.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">Health: {mac.healthPct}%</p>
                  </div>
                  <Badge variant={mac.status === 'Operational' ? 'completed' : 'pending'}>{mac.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Edit Project Details Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
                  <FiEdit2 className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Project Details</h3>
                  <p className="text-xs font-semibold text-slate-500">Update project name, site engineer & metrics</p>
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

              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Site Engineer / Manager</label>
                <input
                  type="text"
                  value={editManager}
                  onChange={(e) => {
                    setEditManager(e.target.value);
                    setShowEngineerSuggestions(true);
                  }}
                  onFocus={() => setShowEngineerSuggestions(true)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="Enter or select Site Engineer Name"
                  required
                />

                {/* Autocomplete Suggestions Dropdown */}
                {showEngineerSuggestions && filteredEngineers.length > 0 && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 animate-in fade-in duration-150">
                    <div className="text-[10px] font-extrabold text-purple-700 px-3 py-1 uppercase tracking-wider flex items-center justify-between border-b border-purple-100/60 mb-1">
                      <span>Saved Site Engineers ({filteredEngineers.length})</span>
                      <button
                        type="button"
                        onClick={() => setShowEngineerSuggestions(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    {filteredEngineers.map((eng) => (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => {
                          setEditManager(eng.name);
                          setShowEngineerSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                      >
                        <div>
                          <p className="text-xs font-extrabold text-[#03020A] group-hover:text-[#7C3AED]">{eng.name}</p>
                          <p className="text-[10px] font-semibold text-slate-500">{eng.role}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Completion Date</label>
                <input
                  type="text"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="DD/MM/YYYY"
                />
              </div>

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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Active Machinery</label>
                  <input
                    type="number"
                    value={editMachinery}
                    onChange={(e) => setEditMachinery(e.target.value)}
                    className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                    placeholder="Machinery count"
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
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-[32px] p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
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
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-[32px] p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
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
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateTaskField(idx, 'status', e.target.value)}
                          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddTask}
                className="w-full py-3 border-2 border-dashed border-purple-200 hover:border-[#7C3AED] bg-purple-50/40 hover:bg-purple-50 text-[#7C3AED] text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiPlus className="text-sm" />
                <span>Add New Task</span>
              </button>

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
    </div>
  );
}

export default ProjectDetails;
