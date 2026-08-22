import React from 'react';
import { FiAlertTriangle, FiShield } from 'react-icons/fi';

export function WorkerSafetyReportCard({ onReportSafetyClick }) {
  return (
    <div className="glass-hero-lime p-6 rounded-[28px] border border-white/90 shadow-[0_10px_30px_rgba(190,242,100,0.15)] space-y-3 relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-[#03020A] text-[#BEF264]">
          <FiAlertTriangle className="text-xl" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-[#03020A]">Report Site Safety Hazard</h4>
          <p className="text-xs text-slate-600 font-semibold">Report scaffolding, PPE, or equipment issues</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReportSafetyClick}
        className="w-full dark-nav-pill hover:bg-black text-white text-xs font-extrabold py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
      >
        <FiShield className="text-[#BEF264] text-sm" />
        <span>Report Safety Issue</span>
      </button>
    </div>
  );
}

export default WorkerSafetyReportCard;
