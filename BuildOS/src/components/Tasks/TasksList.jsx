import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import TaskCard from './TaskCard';

export function TasksList({ tasks, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 rounded-[28px] text-center space-y-3 border border-white">
        <FiCheckSquare className="text-4xl text-purple-300 mx-auto" />
        <h3 className="text-base font-extrabold text-[#03020A]">No Tasks Found</h3>
        <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
          No tasks match your current search, status, or category filter. Click "Create New Task" to add a task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default TasksList;
