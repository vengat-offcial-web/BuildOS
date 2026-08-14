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
  FiCheckSquare
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';
import { useData } from '../context/useData';
import AssignProject from './AssignProject';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, workers, materials, machines, tasks } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Guard for route collision
  if (id === 'new' || id === 'create') {
    return <AssignProject />;
  }

  const project = getProjectById(id);

  const projectMilestones = [
    { name: "Foundation & Excavation", status: "Completed", date: "Feb 2026" },
    { name: "Structural Superstructure", status: project.progress > 50 ? "Completed" : "In Progress", date: "May 2026" },
    { name: "Exterior Glass Panel Fitting", status: project.progress > 70 ? "In Progress" : "Pending", date: "Aug 2026" },
    { name: "Final MEP Inspection & Handover", status: project.progress === 100 ? "Completed" : "Pending", date: "Oct 2026" }
  ];

  const siteWorkers = workers.filter(w => w.site.toLowerCase().includes(project.name.toLowerCase()) || w.site.toLowerCase().includes(project.location.toLowerCase())).slice(0, 4);

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
      <div className="glass-hero-purple p-8 rounded-[32px] border border-white/90 shadow-[0_14px_36px_rgba(167,139,250,0.15)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#7C3AED] flex items-center justify-center text-2xl shadow-md border border-white">
                <FaBuilding />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#03020A] tracking-tight">{project.name}</h1>
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
                {project.budget || "$4.8M / $6.5M"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Site Workers</p>
              <p className="text-sm font-extrabold text-[#03020A] mt-0.5 flex items-center gap-1">
                <FiUsers className="text-purple-600" />
                {siteWorkers.length || 4} Assigned
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Machinery</p>
              <p className="text-sm font-extrabold text-[#03020A] mt-0.5 flex items-center gap-1">
                <FiTruck className="text-purple-600" />
                {machines.length} Active
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E9D5FF] to-[#D9F99D] text-[#6B21A8] flex items-center justify-center font-extrabold text-lg mx-auto shadow-md border-2 border-white">
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
    </div>
  );
}

export default ProjectDetails;
