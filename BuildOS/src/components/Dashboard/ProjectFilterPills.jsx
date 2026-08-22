import React from 'react';
import { FiFilter, FiArrowRight } from 'react-icons/fi';

const STATUS_FILTERS = ['All', 'In Progress', 'Planning', 'Completed', 'Pending'];

export function ProjectFilterPills({ statusFilter, onStatusFilterChange, onExploreAll }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
        <FiFilter className="text-purple-500" /> Filter:
      </span>
      {STATUS_FILTERS.map((st) => (
        <button
          key={st}
          type="button"
          onClick={() => onStatusFilterChange(st)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
            statusFilter === st
              ? 'bg-[#7C3AED] text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
          }`}
        >
          {st}
        </button>
      ))}
      <button 
        type="button"
        onClick={onExploreAll}
        className="text-xs font-bold text-[#7C3AED] hover:text-[#581C87] flex items-center gap-1.5 bg-purple-100/60 hover:bg-purple-100 px-4 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ml-2"
      >
        <span>Explore All</span>
        <FiArrowRight className="text-xs" />
      </button>
    </div>
  );
}

export default ProjectFilterPills;
