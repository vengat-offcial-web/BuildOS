import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export function ReportsSearchBar({ searchTerm, onSearchChange, onClearSearch, displayCount, totalCount }) {
  return (
    <div className="glass-card p-4 rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-100">
      <div className="relative flex-1">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search completed project by name, location, or site engineer..."
          className="w-full pl-11 pr-4 py-2.5 bg-white/80 border border-purple-100 rounded-full text-xs font-semibold text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
          >
            <FiX />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
        <span>Showing {displayCount} of {totalCount} Completed Projects</span>
      </div>
    </div>
  );
}

export default ReportsSearchBar;
