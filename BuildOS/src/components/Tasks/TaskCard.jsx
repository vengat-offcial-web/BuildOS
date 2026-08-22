import React from 'react';
import { Badge } from '../ui';
import { 
  FiCheckSquare, 
  FiAlertCircle, 
  FiCalendar, 
  FiEdit2, 
  FiTrash2, 
  FiShield, 
  FiLayers, 
  FiZap, 
  FiCheckCircle, 
  FiClipboard 
} from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';

export const getCategoryBadgeProps = (catName = '') => {
  const c = catName.toLowerCase();
  if (c.includes('safety')) {
    return { icon: FiShield, style: 'bg-amber-50 text-amber-900 border-amber-200' };
  }
  if (c.includes('concrete') || c.includes('pouring')) {
    return { icon: FiLayers, style: 'bg-blue-50 text-blue-900 border-blue-200' };
  }
  if (c.includes('electrical') || c.includes('wiring')) {
    return { icon: FiZap, style: 'bg-yellow-50 text-yellow-900 border-yellow-300' };
  }
  if (c.includes('scaffold') || c.includes('structure')) {
    return { icon: FaHelmetSafety, style: 'bg-indigo-50 text-indigo-900 border-indigo-200' };
  }
  if (c.includes('quality') || c.includes('qa')) {
    return { icon: FiCheckCircle, style: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
  }
  return { icon: FiClipboard, style: 'bg-purple-50 text-purple-900 border-purple-200' };
};

export function TaskCard({ task, onEdit, onDelete }) {
  const catProps = getCategoryBadgeProps(task.category);
  const CatIcon = catProps.icon;

  return (
    <div 
      className={`glass-card p-5 rounded-[24px] border transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        task.overdue ? 'bg-rose-50/40 border-rose-200' : 'border-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${
          task.status === 'Completed' ? 'bg-[#F0FDC2] text-[#3F6212]' : task.overdue ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-[#7C3AED]'
        }`}>
          {task.overdue ? <FiAlertCircle /> : <FiCheckSquare />}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm font-extrabold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#03020A]'}`}>
              {task.title || task.name}
            </h3>
            
            {/* Priority Badge */}
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
              task.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {task.priority} Priority
            </span>

            {/* Domain Category Badge */}
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${catProps.style}`}>
              <CatIcon className="text-[10px]" />
              <span>{task.category || 'General Operations'}</span>
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-3">
            <span>Site: <strong className="text-[#03020A]">{task.site}</strong></span>
            <span>• Assigned to: <strong className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{task.assignee || 'General Team'}</strong></span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-slate-400">Target Date</p>
          <p className={`text-xs font-bold flex items-center gap-1 ${task.overdue ? 'text-rose-600' : 'text-[#03020A]'}`}>
            <FiCalendar /> {task.dueDate}
          </p>
        </div>

        <div title="Task status is updated directly by assigned worker via Worker Dashboard">
          <Badge variant={task.status === 'Completed' ? 'completed' : task.overdue ? 'overdue' : task.status === 'In Progress' ? 'in-progress' : 'pending'}>
            {task.overdue ? 'Overdue' : task.status}
          </Badge>
        </div>

        {/* Edit Task Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-all cursor-pointer border border-purple-200 ml-1"
          title="Edit Task Details"
        >
          <FiEdit2 className="text-xs" />
        </button>

        {/* Delete Task Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all cursor-pointer border border-rose-200"
          title="Delete Task"
        >
          <FiTrash2 className="text-xs" />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
