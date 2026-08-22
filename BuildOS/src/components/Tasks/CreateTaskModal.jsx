import React from 'react';
import { FiX, FiMapPin } from 'react-icons/fi';

export function CreateTaskModal({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  availableAssignees,
  availableSites,
  taskCategoriesList,
  toIsoDate,
  formatFriendlyDate,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <h3 className="text-lg font-extrabold text-[#03020A]">Assign New Site Task</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer flex items-center justify-center">
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Task Title</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task title"
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Domain Category</label>
              <div className="relative">
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                >
                  {taskCategoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Personnel</label>
              <div className="relative">
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                >
                  {availableAssignees.map(w => (
                    <option key={w.name} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Construction Site</label>
            <div className="relative">
              <select
                value={newTask.site}
                onChange={(e) => setNewTask({ ...newTask, site: e.target.value })}
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none appearance-none cursor-pointer"
              >
                {availableSites.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <FiMapPin className="absolute right-3 top-3 text-purple-600 pointer-events-none text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Due Date</label>
              <div className="space-y-1.5">
                <input
                  type="date"
                  value={toIsoDate(newTask.dueDate)}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: formatFriendlyDate(e.target.value) })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-3 py-2 text-xs font-bold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                />
                <div className="flex items-center gap-1 flex-wrap">
                  {['Today', 'Tomorrow', 'In 3 Days', 'Next Week'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (preset === 'In 3 Days') {
                          const d = new Date();
                          d.setDate(d.getDate() + 3);
                          setNewTask({ ...newTask, dueDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
                        } else if (preset === 'Next Week') {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setNewTask({ ...newTask, dueDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
                        } else {
                          setNewTask({ ...newTask, dueDate: preset });
                        }
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                        newTask.dueDate === preset
                          ? 'bg-[#7C3AED] text-white shadow-sm'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer hover:bg-slate-200 transition-all">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md cursor-pointer transition-all">Create & Assign Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
