import React from 'react';
import { FiClock, FiCalendar } from 'react-icons/fi';

export function WorkerHeroBanner({ userName, assignedProject, clockedIn, onClockToggle, onApplyLeaveClick }) {
  return (
    <div className="glass-hero-purple p-8 rounded-[32px] border border-white/90 shadow-[0_14px_36px_rgba(167,139,250,0.15)] relative overflow-hidden">
      {/* Ambient Graphic */}
      <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#03020A] tracking-tight">
            Welcome back, <span className="text-[#7C3AED]">{userName || 'Marcoo'}</span>!
          </h1>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            Worker Portal • Site Assigned: <strong className="text-[#03020A]">{assignedProject.name}</strong> • Engineer: <strong className="text-[#7C3AED]">{assignedProject.engineer}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Shift Clock In / Clock Out Button */}
          <button 
            type="button"
            onClick={onClockToggle}
            className="dark-nav-pill hover:bg-black text-white text-xs font-extrabold px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer"
          >
            <FiClock className="text-[#BEF264] text-sm" />
            <span>{clockedIn ? "Clock Out of Shift" : "Clock In to Shift"}</span>
          </button>

          {/* Leave Request Action Button */}
          <button 
            type="button"
            onClick={onApplyLeaveClick}
            className="bg-white/90 hover:bg-white text-[#03020A] border border-white/90 text-xs font-extrabold px-4 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FiCalendar className="text-[#7C3AED] text-sm" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerHeroBanner;
