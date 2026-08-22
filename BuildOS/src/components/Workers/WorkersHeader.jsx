import React from 'react';
import { FiUsers, FiPlus } from 'react-icons/fi';

export function WorkersHeader({ totalWorkersCount, onAddWorkerClick }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
          <FiUsers className="text-[#7C3AED]" />
          Site Workforce Directory
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Total {totalWorkersCount} registered site personnel • 96% active attendance today
        </p>
      </div>

      <button
        type="button"
        onClick={onAddWorkerClick}
        className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
      >
        <FiPlus className="text-[#BEF264] text-base" />
        <span>Add New Worker</span>
      </button>
    </div>
  );
}

export default WorkersHeader;
