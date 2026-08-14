import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, ProgressBar, Card } from '../components/ui';
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiLayers,
  FiTruck,
  FiCheckSquare,
  FiEdit2,
  FiX,
  FiSave
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';
import { useData } from '../context/useData';
import AssignProject from './AssignProject';

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
  const [editWorkers, setEditWorkers] = useState('');
  const [editMachinery, setEditMachinery] = useState('');

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
    setEditBudget(project.budget || '$1.0M / $3.5M');
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
      workforceRequired: parseInt(editWorkers, 10) || 0,
      machineryCount: parseInt(editMachinery, 10) || 0
    });
    setIsEditing(false);
  };

  const projectMilestones = [
    { name: "Foundation & Excavation", status: "Completed", date: "Feb 2026" },
    { name: "Structural Superstructure", status: project && project.progress > 50 ? "Completed" : "In Progress", date: "May 2026" },
    { name: "Exterior Glass Panel Fitting", status: project && project.progress > 70 ? "In Progress" : "Pending", date: "Aug 2026" },
    { name: "Final MEP Inspection & Handover", status: project && project.progress === 100 ? "Completed" : "Pending", date: "Oct 2026" }
  ];

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
                <FiDollarSign className="text-purple-600" />
                {project.budget || "$1.0M / $3.5M"}
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
            <h3 className="text-lg font-extrabold text-[#03020A] mb-4 pb-3 border-b border-purple-100 flex items-center gap-2">
              <FiCheckCircle className="text-[#7C3AED]" />
              Construction Milestones
            </h3>
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
            <h3 className="text-lg font-extrabold text-[#03020A] mb-4 pb-3 border-b border-purple-100 flex items-center gap-2">
              <FiClock className="text-[#7C3AED]" />
              Active Site Tasks Checklist
            </h3>
            <div className="space-y-3">
              {tasks.slice(0, 4).map((t, index) => (
                <div key={index} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#03020A]">{t.title}</h4>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      Priority: {t.priority}
                    </span>
                  </div>
                  <Badge variant={t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'pending'}>
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
          <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-4xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Site Engineer / Manager</label>
                <input
                  type="text"
                  value={editManager}
                  onChange={(e) => setEditManager(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="e.g. Rajesh Kumar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Budget Spent</label>
                <input
                  type="text"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                  placeholder="e.g. $1.0M / $3.5M"
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
    </div>
  );
}

export default ProjectDetails;
