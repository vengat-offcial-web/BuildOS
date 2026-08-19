import React, { useState } from 'react';
import { Badge } from '../components/ui';
import { FiCheckSquare, FiPlus, FiAlertCircle, FiCalendar, FiTrash2, FiUserCheck, FiMapPin } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Tasks() {
  const { tasks, addTask, toggleTaskStatus, deleteTask, pendingTasksCount, overdueTasksCount, workers, projects } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [statusTab, setStatusTab] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // Available worker assignees catalog
  const availableAssignees = React.useMemo(() => {
    const list = (workers || []).map(w => ({
      name: w.name,
      trade: w.trade || 'Site Specialist',
      site: w.site || ''
    }));
    // Include default site leads if list is short
    const defaultLeads = [
      { name: 'Rajesh Kumar', trade: 'Project Lead Engineer', site: 'Marina Tower' },
      { name: 'Latha M.', trade: 'Quality Control Lead', site: 'Marina Tower' },
      { name: 'Karthik R.', trade: 'Electrical Lead', site: 'Metro Line Extension' },
      { name: 'Anandan S.', trade: 'Senior Technician', site: 'Marina Tower' },
      { name: 'Ganesh K.', trade: 'Safety Officer', site: 'SkyView Apartments' },
      { name: 'Selvam P.', trade: 'Masonry Supervisor', site: 'Green Valley Township' }
    ];
    
    const combined = [...list];
    defaultLeads.forEach(dl => {
      if (!combined.some(c => c.name.toLowerCase().trim() === dl.name.toLowerCase().trim())) {
        combined.push(dl);
      }
    });
    return combined;
  }, [workers]);

  // Available construction sites catalog
  const availableSites = React.useMemo(() => {
    const projSites = (projects || []).map(p => p.name).filter(Boolean);
    const defaultSites = ['Marina Tower', 'Metro Line Extension', 'SkyView Apartments', 'Green Valley Township', 'Hyper Mall'];
    const merged = Array.from(new Set([...projSites, ...defaultSites]));
    return merged;
  }, [projects]);

  const [newTask, setNewTask] = useState({ 
    title: '', 
    site: availableSites[0] || 'Marina Tower', 
    assignee: availableAssignees[0]?.name || 'Rajesh Kumar', 
    priority: 'Medium', 
    dueDate: 'Tomorrow' 
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    addTask(newTask);
    setNewTask({ 
      title: '', 
      site: availableSites[0] || 'Marina Tower', 
      assignee: availableAssignees[0]?.name || 'Rajesh Kumar', 
      priority: 'Medium', 
      dueDate: 'Tomorrow' 
    });
    setShowModal(false);
  };

  const filteredTasks = tasks.filter(t => {
    const title = t.title || t.name || '';
    const site = t.site || '';
    const assignee = t.assignee || '';
    const matchesSearch = !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = statusTab === 'All' ? true : statusTab === 'Overdue' ? t.overdue : t.status === statusTab;
    return matchesSearch && matchesTab;
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
                  <span>• Assigned to: <strong className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{t.assignee || 'General Team'}</strong></span>
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

              {deleteTask && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(t.id);
                  }}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all cursor-pointer border border-rose-200 ml-1"
                  title="Delete Task"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              )}
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Personnel / Worker</label>
                <div className="relative">
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none appearance-none cursor-pointer"
                  >
                    {availableAssignees.map(w => (
                      <option key={w.name} value={w.name}>
                        {w.name} ({w.trade}{w.site ? ` • ${w.site}` : ''})
                      </option>
                    ))}
                  </select>
                  <FiUserCheck className="absolute right-3 top-3 text-purple-600 pointer-events-none text-xs" />
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
                <button type="submit" className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md cursor-pointer">Create & Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;