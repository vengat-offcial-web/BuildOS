import React from 'react';
import { FiUsers } from 'react-icons/fi';
import WorkerCard from './WorkerCard';

export function WorkersGrid({
  workers,
  onAcceptRegistration,
  onRejectRegistration,
  onRemoveClick,
  onViewProfileClick,
  onResetFilters,
  onAddWorkerClick
}) {
  if (workers.length === 0) {
    return (
      <div className="glass-card p-8 rounded-[28px] text-center space-y-3 border border-white">
        <FiUsers className="text-3xl text-purple-400 mx-auto" />
        <h3 className="text-sm font-bold text-[#03020A]">No Workers Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No worker records matched your search query or trade filter. Try clearing your filters or adding a new worker to the directory.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-full text-xs font-extrabold bg-purple-100 text-[#7C3AED] hover:bg-purple-200 cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onAddWorkerClick}
            className="dark-nav-pill px-5 py-2 rounded-full text-xs font-extrabold text-white cursor-pointer"
          >
            + Add New Worker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workers.map((w) => (
        <WorkerCard
          key={w.id}
          worker={w}
          onAcceptRegistration={onAcceptRegistration}
          onRejectRegistration={onRejectRegistration}
          onRemoveClick={onRemoveClick}
          onViewProfileClick={onViewProfileClick}
        />
      ))}
    </div>
  );
}

export default WorkersGrid;
