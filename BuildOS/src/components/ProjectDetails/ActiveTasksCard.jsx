import React from 'react';
import { Card, Badge } from '../ui';
import { FiClock, FiEdit2, FiCheckCircle, FiCheckSquare } from 'react-icons/fi';

export function ActiveTasksCard({ tasks, projectManager, onOpenModal }) {
  return (
    <Card hover={false}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
        <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
          <FiClock className="text-[#7C3AED]" />
          Active Site Tasks Checklist
        </h3>
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <FiEdit2 className="text-xs text-[#7C3AED]" />
          <span>Edit</span>
        </button>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/60 text-center text-xs font-semibold text-slate-500">
            No active site tasks assigned to this project site yet. Click "Edit" to add a site task.
          </div>
        ) : (
          tasks.map((t, index) => (
            <div 
              key={t.id || index}
              className="bg-white/80 p-4 rounded-2xl border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                  t.status === "Completed" 
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white font-bold" 
                    : t.overdue || t.status === "Overdue"
                    ? "bg-rose-100 border-rose-300 text-rose-700 font-bold"
                    : "border-purple-200 bg-purple-50 text-[#7C3AED] font-bold"
                }`}>
                  {t.status === "Completed" ? <FiCheckCircle className="text-xs" /> : <FiCheckSquare className="text-xs" />}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-extrabold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#03020A]'}`}>
                    {t.title || t.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      Priority: {t.priority || 'Medium'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Assigned to: <strong className="text-purple-800 font-extrabold">{t.assignee || projectManager || 'Mathan'}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Badge variant={t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : t.overdue || t.status === 'Overdue' ? 'overdue' : 'pending'}>
                  {t.overdue || t.status === 'Overdue' ? 'Overdue' : t.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default ActiveTasksCard;
