import React from 'react';
import { Card } from '../ui';
import { FiMapPin, FiCheckCircle, FiUserCheck, FiClock, FiEye } from 'react-icons/fi';
import ReportModel from '../../models/reportModel';

export function CompletedProjectCard({ project, onOpenReport }) {
  const daysTaken = ReportModel.calculateCompletionDays(project);
  const engineer = ReportModel.getProjectEngineer(project);

  return (
    <Card 
      hover={true} 
      className="flex flex-col justify-between space-y-5 rounded-[28px] border border-purple-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >
      {/* Accent Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7C3AED] to-[#BEF264]" />

      <div className="space-y-4 pt-1">
        {/* Top Row: Name & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#03020A] group-hover:text-[#7C3AED] transition-colors leading-snug">
              {project.name}
            </h3>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
              <FiMapPin className="text-[#7C3AED] shrink-0" />
              {project.location}
            </p>
          </div>

          <span className="shrink-0 bg-[#F0FDC2] text-[#3F6212] border border-lime-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle className="text-[#3F6212]" /> Completed
          </span>
        </div>

        {/* Project Description */}
        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          {project.description || "Fully constructed commercial site development completed with zero safety incidents."}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
              <FiUserCheck className="text-[#7C3AED]" /> Site Engineer
            </span>
            <p className="font-extrabold text-[#03020A] truncate" title={engineer}>
              {engineer}
            </p>
          </div>

          <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
              <FiClock className="text-[#7C3AED]" /> Completion Days
            </span>
            <p className="font-extrabold text-[#03020A]">
              {daysTaken} Days
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="pt-2 border-t border-purple-100/80">
        <button
          type="button"
          onClick={() => onOpenReport(project)}
          className="w-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group/btn"
        >
          <FiEye className="text-[#BEF264] text-sm group-hover/btn:scale-110 transition-transform" />
          <span>View Completed Site Report</span>
        </button>
      </div>
    </Card>
  );
}

export default CompletedProjectCard;
