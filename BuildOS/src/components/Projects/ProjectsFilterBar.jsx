import React from 'react';
import { FiFilter } from 'react-icons/fi';

const STATUS_FILTERS = ['All', 'In Progress', 'Planning', 'Completed', 'Pending'];

export function ProjectsFilterBar({ filterStatus, onStatusFilterChange }) {
  return (
    <div className="glass-card p-4 rounded-[28px] flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto w-full">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <FiFilter className="text-purple-500" /> Filter:
        </span>
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onStatusFilterChange(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === st
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectsFilterBar;
