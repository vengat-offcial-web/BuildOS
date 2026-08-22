import React from 'react';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { Badge } from '../ui';

export function ProjectDetailsHeader({ project, onBack, onCancelClick }) {
  if (!project) return null;

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="bg-white/80 hover:bg-white text-[#03020A] border border-purple-100 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
      >
        <FiArrowLeft className="text-sm text-[#7C3AED]" />
        <span>Back to Projects List</span>
      </button>

      <div className="flex items-center gap-2">
        {project.status !== "Cancelled" ? (
          <button
            type="button"
            onClick={onCancelClick}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Cancel this project"
          >
            <FiTrash2 className="text-xs text-rose-600" />
            <span>Cancel Project</span>
          </button>
        ) : (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold px-3 py-1 rounded-full">
            Project Cancelled
          </span>
        )}

        <Badge variant={project.status === "Completed" ? "completed" : project.status === "Cancelled" ? "overdue" : "in-progress"}>
          {project.status}
        </Badge>
        <span className="text-xs font-bold text-[#7C3AED] bg-purple-100/60 px-3 py-1 rounded-full">
          Site ID #PRJ-00{project.id}
        </span>
      </div>
    </div>
  );
}

export default ProjectDetailsHeader;
