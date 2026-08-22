import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

export function MaterialsFilterBar({
  filteredCount,
  totalCount,
  categoryFilter,
  categoryStats,
  onCategoryFilterChange,
  onResetCategory
}) {
  return (
    <div className="glass-card p-4 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left Side: Showing items count & Reset button */}
      <div className="flex items-center gap-3 text-xs">
        <span className="font-semibold text-slate-500">
          Showing <strong className="text-[#7C3AED] font-extrabold">{filteredCount}</strong> of {totalCount} materials
        </span>

        {categoryFilter !== 'All' && (
          <button
            type="button"
            onClick={onResetCategory}
            className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <FiX className="text-xs" /> Reset
          </button>
        )}
      </div>

      {/* Right Side: Filter Category Dropdown */}
      <div className="flex items-center gap-3 flex-wrap self-end sm:self-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center text-sm font-extrabold">
            <FiFilter />
          </div>
          <span className="text-xs font-extrabold text-[#03020A]">Filter Category:</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="bg-white/90 border border-purple-100 text-xs font-bold text-[#03020A] rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm cursor-pointer hover:border-purple-200 transition-all min-w-[200px]"
        >
          <option value="All">All Categories ({totalCount} Items)</option>
          {Object.entries(categoryStats).map(([catName, count]) => (
            <option key={catName} value={catName}>
              {catName} ({count} Item{count !== 1 ? 's' : ''})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default MaterialsFilterBar;
