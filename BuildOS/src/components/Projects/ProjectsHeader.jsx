import React from 'react';
import { FiFolder, FiPlus } from 'react-icons/fi';

export function ProjectsHeader({ onAssignNewProject }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
          <FiFolder className="text-[#7C3AED]" />
          Construction Projects Roster
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Manage, filter, and track site operations across all active developments.
        </p>
      </div>

      <button 
        type="button"
        onClick={onAssignNewProject}
        className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
      >
        <FiPlus className="text-[#BEF264] text-base" />
        <span>Assign New Project</span>
      </button>
    </div>
  );
}

export default ProjectsHeader;
