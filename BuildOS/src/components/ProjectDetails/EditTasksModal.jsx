import React from 'react';
import { FiClock, FiX, FiTrash2, FiSave } from 'react-icons/fi';

export function EditTasksModal({
  isOpen,
  onClose,
  editTasks,
  onUpdateTaskField,
  onRemoveTask,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-4xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
              <FiClock className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#03020A]">Edit Active Site Tasks</h3>
              <p className="text-xs font-semibold text-slate-500">Update task descriptions, priority levels & status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Form List */}
        <form onSubmit={onSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="space-y-3">
            {editTasks.map((t, idx) => (
              <div key={idx} className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-3 relative">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-xs font-extrabold">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveTask(idx)}
                    title="Delete Task"
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-100 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <FiTrash2 className="text-xs" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Description</label>
                    <input
                      type="text"
                      value={t.title}
                      onChange={(e) => onUpdateTaskField(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                      placeholder="e.g. Inspect rebar binding"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Priority</label>
                    <select
                      value={t.priority}
                      onChange={(e) => onUpdateTaskField(idx, 'priority', e.target.value)}
                      className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Status (Worker Updated)</label>
                    <div className="w-full bg-slate-100 border border-slate-200 text-xs font-extrabold rounded-xl px-3 py-2.5 text-slate-700 flex items-center justify-between select-none">
                      <span>{t.overdue || t.status === 'Overdue' ? 'Overdue' : (t.status || 'Pending')}</span>
                      <span className="text-[9px] font-extrabold uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-md">Read-Only</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FiSave className="text-sm text-[#BEF264]" />
              <span>Save Tasks</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTasksModal;
