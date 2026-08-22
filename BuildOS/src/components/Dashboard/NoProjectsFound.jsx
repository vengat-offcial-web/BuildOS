import React from 'react';
import { FiInbox } from 'react-icons/fi';

export function NoProjectsFound({ onResetFilters }) {
  return (
    <div className="glass-card p-8 text-center rounded-[28px] border border-white space-y-2">
      <FiInbox className="text-3xl text-purple-400 mx-auto" />
      <h3 className="text-sm font-bold text-[#03020A]">No projects match your search criteria</h3>
      <p className="text-xs text-slate-500">Try adjusting your search keywords or resetting the status filter.</p>
      <button
        type="button"
        onClick={onResetFilters}
        className="text-xs font-extrabold text-[#7C3AED] bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-full transition-all cursor-pointer mt-2 inline-block"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default NoProjectsFound;
