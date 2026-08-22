import React from 'react';
import { FaBuilding } from 'react-icons/fa6';
import { FiEdit2, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi';
import { ProgressBar } from '../ui';

export function ProjectDetailsHero({ project, activeWorkersCount, onEditClick }) {
  if (!project) return null;

  return (
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
                  onClick={onEditClick}
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
  );
}

export default ProjectDetailsHero;
