import React from 'react';
import { FiMapPin, FiX, FiAlertCircle } from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';

export function WorkerProjectDetailsModal({
  isOpen,
  onClose,
  hasAssignedSite,
  assignedProject
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg p-6 rounded-[32px] border border-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#C4B5FD] flex items-center justify-center text-white text-lg shadow-md">
              <FiMapPin />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#03020A] tracking-tight">{assignedProject.name}</h3>
              <p className="text-xs text-purple-600 font-bold">{assignedProject.fullTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        {hasAssignedSite ? (
          <div className="space-y-4 text-xs font-medium text-slate-700">
            {/* Status & Location Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 p-3 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location / Zone</span>
                <p className="font-extrabold text-[#03020A]">{assignedProject.location}</p>
              </div>
              <div className="bg-white/80 p-3 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Site Engineer</span>
                <p className="font-extrabold text-[#7C3AED]">{assignedProject.engineer}</p>
              </div>
            </div>

            {/* Progress Bar & Schedule */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#03020A]">Overall Project Completion</span>
                <span className="font-extrabold text-[#7C3AED]">{assignedProject.completion}%</span>
              </div>
              <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#7C3AED] to-[#BEF264] h-full rounded-full" style={{ width: `${assignedProject.completion}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Target Deadline: <strong className="text-slate-700">{assignedProject.deadline}</strong></span>
                <span>Shift Hours: <strong className="text-slate-700">{assignedProject.shiftSchedule}</strong></span>
              </div>
            </div>

            {/* Worker Assigned Role by Site Engineer */}
            <div className="bg-[#F0FDC2]/60 border border-[#BEF264] p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold text-[#3F6212] uppercase tracking-wider block">Worker Assigned Role</span>
              <p className="font-extrabold text-[#03020A] text-sm flex items-center gap-2 pt-0.5">
                <FaHelmetSafety className="text-[#7C3AED] text-base" />
                <span>{assignedProject.workerRole}</span>
              </p>
              <p className="text-[11px] text-slate-600 font-semibold pt-1">
                Assigned & Authorized By: <strong className="text-[#7C3AED]">{assignedProject.engineer}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-center">
            <FiAlertCircle className="text-amber-600 text-2xl mx-auto" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950">No Project Site Assigned</h4>
            <p className="text-xs font-medium text-amber-800 leading-relaxed">
              You are currently not assigned to any active project site roster. Please contact the Admin to assign you to a project site (e.g. Marina Tower or Metro Line Extension).
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="dark-nav-pill px-6 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerProjectDetailsModal;
