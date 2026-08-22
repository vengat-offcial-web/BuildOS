import React from 'react';
import { Card } from '../ui';
import { FiDatabase, FiCheck, FiTrash2, FiRefreshCw } from 'react-icons/fi';

export function WorkspaceDataCard({
  projectsCount,
  workersCount,
  tasksCount,
  dataMessage,
  onClearData,
  onRestoreSample
}) {
  return (
    <Card hover={false} className="max-w-2xl space-y-5 border border-purple-100">
      <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
          <FiDatabase className="text-[#7C3AED]" />
          Workspace Data Mode & Reset
        </h3>
        <span className="text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
          {projectsCount === 0 ? 'Clean Slate Mode' : 'Demo Sample Mode'}
        </span>
      </div>

      {dataMessage && (
        <div className="p-3.5 rounded-2xl text-xs font-bold bg-[#F0FDC2] border border-[#BEF264] text-[#3F6212] flex items-center gap-2 animate-in fade-in">
          <FiCheck className="text-base shrink-0" />
          <span>{dataMessage}</span>
        </div>
      )}

      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
        <h4 className="text-xs font-extrabold text-[#03020A]">
          Current Roster Status: <span className="text-purple-700 font-extrabold">{projectsCount} Active Projects</span> | <span className="text-purple-700 font-extrabold">{workersCount} Personnel</span> | <span className="text-purple-700 font-extrabold">{tasksCount} Tasks</span>
        </h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Switch BuildOS from demo mock mode to clean slate mode. Clearing demo mock data allows you to start fresh with 100% real construction projects, real site engineers, real site tasks, and real materials.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onClearData}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FiTrash2 className="text-sm" />
          <span>Clear Demo Data & Start Fresh (Real Data Mode)</span>
        </button>

        <button
          type="button"
          onClick={onRestoreSample}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FiRefreshCw className="text-sm" />
          <span>Restore Default Sample Data</span>
        </button>
      </div>
    </Card>
  );
}

export default WorkspaceDataCard;
