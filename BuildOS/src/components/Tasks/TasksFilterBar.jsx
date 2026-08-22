import React from 'react';
import { FiTag } from 'react-icons/fi';

const STATUS_TABS = ['All', 'In Progress', 'Pending', 'Completed', 'Overdue'];

export function TasksFilterBar({
  statusTab,
  onStatusTabChange,
  overdueTasksCount,
  categoryFilter,
  onCategoryFilterChange,
  taskCategoriesList
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100 pb-3">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onStatusTabChange(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              statusTab === tab
                ? 'bg-[#03020A] text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
            }`}
          >
            {tab} {tab === 'Overdue' && <span className="ml-1 text-[#FECDD3] font-extrabold">({overdueTasksCount})</span>}
          </button>
        ))}
      </div>

      {/* Category Filter Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <FiTag className="text-purple-600 text-xs" />
        <span className="text-xs font-extrabold text-slate-700">Domain Category:</span>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="bg-white/90 border border-purple-200 text-[#03020A] text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm outline-none cursor-pointer hover:border-purple-400 transition-all"
        >
          <option value="All Categories">All Categories</option>
          {taskCategoriesList.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TasksFilterBar;
