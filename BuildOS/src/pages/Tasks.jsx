import React, { useState } from 'react';
import { Badge } from '../components/ui';
import { FiCheckSquare, FiPlus, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { useData } from '../context/useData';

function Tasks() {
  const { tasks, addTask, toggleTaskStatus, pendingTasksCount, overdueTasksCount } = useData();
  const [statusTab, setStatusTab] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({ title: '', site: '', priority: 'Medium', dueDate: '' });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    addTask(newTask);
    setNewTask({ title: '', site: '', priority: 'Medium', dueDate: '' });
    setShowModal(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (statusTab === 'All') return true;
    if (statusTab === 'Overdue') return t.overdue;
    return t.status === statusTab;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
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
          onClick={() => setShowModal(true)}
          className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-[#BEF264] text-base" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-100">
        {['All', 'In Progress', 'Pending', 'Completed', 'Overdue'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusTab(tab)}
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

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((t) => (
          <div 
            key={t.id}
            onClick={() => toggleTaskStatus(t.id)}
            className={`glass-card p-5 rounded-[24px] border transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
              t.overdue ? 'bg-rose-50/40 border-rose-200' : 'border-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${
                t.status === 'Completed' ? 'bg-[#F0FDC2] text-[#3F6212]' : t.overdue ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-[#7C3AED]'
              }`}>
                {t.overdue ? <FiAlertCircle /> : <FiCheckSquare />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className={`text-sm font-extrabold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#03020A]'}`}>
                    {t.title || t.name}
                  </h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {t.priority} Priority
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-3">
                  <span>Site: <strong className="text-[#03020A]">{t.site}</strong></span>
                  <span>• Assigned: <strong className="text-purple-700">{t.assignee}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-400">Target Date</p>
                <p className={`text-xs font-bold flex items-center gap-1 ${t.overdue ? 'text-rose-600' : 'text-[#03020A]'}`}>
                  <FiCalendar /> {t.dueDate}
                </p>
              </div>

              <Badge variant={t.status === 'Completed' ? 'completed' : t.overdue ? 'overdue' : t.status === 'In Progress' ? 'in-progress' : 'pending'}>
                {t.overdue ? 'Overdue' : t.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#03020A]">Assign New Site Task</h3>
              <button type="button" onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Inspect rebar binding on Floor 12"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Construction Site</label>
                <input
                  type="text"
                  value={newTask.site}
                  onChange={(e) => setNewTask({ ...newTask, site: e.target.value })}
                  placeholder="e.g. Marina Tower"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    placeholder="e.g. Tomorrow"
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md cursor-pointer">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;