import React from 'react';
import { FiCheckCircle, FiClock, FiShield, FiUserCheck } from 'react-icons/fi';

export function ReportsKpiOverview({ totalCompletedCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="glass-hero-lime p-6 rounded-[28px] space-y-2 border border-lime-200/60 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-[#3F6212]">
          <span>Archived Developments</span>
          <FiCheckCircle className="text-lg text-[#3F6212]" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#03020A]">{totalCompletedCount} Projects</h3>
        <p className="text-xs font-semibold text-[#3F6212] bg-white/80 px-2.5 py-0.5 rounded-full inline-block">
          100% Milestone Execution
        </p>
      </div>

      <div className="glass-card p-6 rounded-[28px] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Average Site Duration</span>
          <FiClock className="text-lg text-purple-600" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#03020A]">~176 Days</h3>
        <p className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">
          On-Time Handover Record
        </p>
      </div>

      <div className="glass-hero-purple p-6 rounded-[28px] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B21A8]">
          <span>Average Site Safety Index</span>
          <FiShield className="text-lg text-purple-700" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#03020A]">100% Score</h3>
        <p className="text-xs font-semibold text-[#6B21A8] bg-purple-200/60 px-2.5 py-0.5 rounded-full inline-block">
          Zero Incident Zero Delay
        </p>
      </div>

      <div className="glass-card p-6 rounded-[28px] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>QA & Inspection Status</span>
          <FiUserCheck className="text-lg text-[#3F6212]" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#03020A]">Verified & Signed</h3>
        <p className="text-xs font-semibold text-[#3F6212] bg-[#F0FDC2] px-2.5 py-0.5 rounded-full inline-block">
          Lead Engineer Approved
        </p>
      </div>
    </div>
  );
}

export default ReportsKpiOverview;
