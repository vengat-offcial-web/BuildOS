import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, ProgressBar } from './index';
import { FiMapPin, FiUserCheck, FiCalendar, FiArrowUpRight } from 'react-icons/fi';
import { FaBuilding, FaHelmetSafety, FaTruckRampBox } from 'react-icons/fa6';

function getStatusVariant(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'completed') return 'completed';
  if (s === 'in progress' || s === 'in-progress') return 'in-progress';
  if (s === 'overdue') return 'overdue';
  return 'pending';
}

function renderIcon(iconType) {
  switch (iconType) {
    case "hardhat":
      return <FaHelmetSafety className="text-[#7C3AED] text-2xl" />;
    case "truck":
      return <FaTruckRampBox className="text-[#7C3AED] text-2xl" />;
    case "building":
    default:
      return <FaBuilding className="text-[#7C3AED] text-2xl" />;
  }
}

export function ProjectBentoCard({
  id = 1,
  name = "Marina Tower",
  location = "Chennai",
  manager = "Rajesh Kumar",
  progress = 72,
  status = "In Progress",
  deadline = "Sep 15, 2026",
  accent = "purple",
  iconType = "building"
}) {
  const navigate = useNavigate();

  const statusVariant = getStatusVariant(status);
  const cardBg = accent === "lime" ? "glass-hero-lime" : accent === "purple" ? "glass-hero-purple" : "glass-card";

  return (
    <div 
      onClick={() => navigate(`/projects/${id}`)}
      className={`${cardBg} p-6 rounded-32pxl border border-white/90 shadow-[0_12px_32px_rgba(167,139,250,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(139,92,246,0.18)] cursor-pointer group flex flex-col justify-between relative overflow-hidden`}
    >
      {/* Background Decorative Graphic Accent */}
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/40 rounded-full blur-xl pointer-events-none"></div>

      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md shadow-purple-500/10 border border-white">
            {renderIcon(iconType)}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant}>{status}</Badge>
            <div className="w-8 h-8 rounded-full bg-[#03020A] text-white flex items-center justify-center group-hover:bg-[#7C3AED] transition-colors shadow-sm">
              <FiArrowUpRight className="text-sm" />
            </div>
          </div>
        </div>

        {/* Project Title & Location */}
        <h3 className="text-base md:text-lg font-extrabold text-[#03020A] tracking-tight group-hover:text-[#7C3AED] transition-colors mb-1">
          {name}
        </h3>
        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-4">
          <FiMapPin className="text-[#7C3AED]" />
          {location}
        </p>

        {/* Manager & Deadline Badges */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2.5 border border-white/80">
            <p className="text-[10px] font-bold uppercase text-slate-400">Site Engineer</p>
            <p className="text-xs font-bold text-[#03020A] truncate flex items-center gap-1 mt-0.5">
              <FiUserCheck className="text-purple-600 text-xs shrink-0" />
              <span className="truncate">{manager}</span>
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2.5 border border-white/80">
            <p className="text-[10px] font-bold uppercase text-slate-400">Target Deadline</p>
            <p className="text-xs font-bold text-[#03020A] truncate flex items-center gap-1 mt-0.5">
              <FiCalendar className="text-purple-600 text-xs shrink-0" />
              <span className="truncate">{deadline}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Component */}
      <div className="pt-2 border-t border-purple-200/50">
        <ProgressBar progress={progress} variant={progress === 100 ? "lime" : "purple"} size="sm" />
      </div>
    </div>
  );
}

export default ProjectBentoCard;
