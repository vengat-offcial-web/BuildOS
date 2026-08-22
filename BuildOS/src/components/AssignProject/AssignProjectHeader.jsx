import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';

export function AssignProjectHeader({ onBack }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED] hover:text-[#581C87] bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-purple-100 mb-3 shadow-sm transition-all cursor-pointer"
        >
          <FiArrowLeft className="text-sm" />
          <span>Back to Projects Roster</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
          <FaBuilding className="text-[#7C3AED]" />
          Assign New Construction Project
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Dispatch a new job site development by entering project specs, engineer allocation, timeline, and workforce parameters.
        </p>
      </div>

      <span className="self-start sm:self-center text-xs font-extrabold bg-[#E9D5FF] text-[#6B21A8] px-3.5 py-1.5 rounded-full border border-[#D8B4FE]">
        Status: Planning
      </span>
    </div>
  );
}

export default AssignProjectHeader;
