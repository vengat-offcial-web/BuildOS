import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export function FilterIndicatorBar({ searchTerm, statusFilter, resultCount, onClearFilters }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-purple-100 shadow-md flex items-center justify-between gap-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5 text-xs font-bold text-[#03020A]">
        <span className="p-1.5 rounded-lg bg-purple-100 text-[#7C3AED]">
          <FiSearch className="text-sm" />
        </span>
        <span>
          {searchTerm && <span>Filtering by "<strong className="text-[#7C3AED]">{searchTerm}</strong>" • </span>}
          {statusFilter !== 'All' && <span>Status: <strong className="text-purple-700">{statusFilter}</strong> • </span>}
          Found <span className="text-[#7C3AED] font-extrabold">{resultCount}</span> matching projects
        </span>
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        className="text-xs font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
      >
        <FiX className="text-sm" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
}

export default FilterIndicatorBar;
