import React from 'react';
import { FiCheckSquare, FiPlus } from 'react-icons/fi';

export function TasksHeader({ pendingTasksCount, overdueTasksCount, onCreateTaskClick }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
          <FiCheckSquare className="text-[#7C3AED]" />
          Site Tasks & Milestone Checklist
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          {pendingTasksCount} pending site tasks • {overdueTasksCount} overdue actions requiring immediate manager review
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateTaskClick}
        className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
      >
        <FiPlus className="text-[#BEF264] text-base" />
        <span>Create New Task</span>
      </button>
    </div>
  );
}

export default TasksHeader;
