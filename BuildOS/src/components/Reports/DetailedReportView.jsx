import React from 'react';
import { Card } from '../ui';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiUserCheck,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiPhone,
  FiAlertCircle,
  FiLayers,
  FiClipboard,
  FiTag
} from 'react-icons/fi';

export function DetailedReportView({ selectedProject, selectedReportDetails, onClose }) {
  if (!selectedProject || !selectedReportDetails) return null;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-purple-100 text-xs font-extrabold text-[#03020A] hover:bg-[#7C3AED] hover:text-white transition-all shadow-sm cursor-pointer group shrink-0 self-start sm:self-auto"
        >
          <FiArrowLeft className="text-purple-600 group-hover:text-white text-sm transition-colors" />
          <span>Back to Completed Projects Roster</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold bg-[#F0FDC2] text-[#3F6212] px-3.5 py-1.5 rounded-full border border-lime-200 inline-flex items-center gap-1.5">
            <FiCheckCircle className="text-[#3F6212]" /> 100% Completed Audit
          </span>
        </div>
      </div>

      {/* Project Hero Banner */}
      <div className="glass-hero-purple p-6 md:p-8 rounded-[32px] border border-purple-100 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
          <FiMapPin className="text-[#7C3AED]" />
          <span>{selectedProject.location} Development Site</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight">
          {selectedProject.name}
        </h1>

        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
          {selectedProject.description || "Executive completed site audit record documenting worked team members, site engineer oversight, duration, and material consumption."}
        </p>
      </div>

      {/* Executive Metrics Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-[28px] space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
            <FiUserCheck className="text-[#7C3AED]" /> Site Engineer
          </span>
          <h3 className="text-xl font-extrabold text-[#03020A] truncate">
            {selectedReportDetails.engineer}
          </h3>
          <p className="text-[11px] font-semibold text-slate-500">Lead Operations Overseer</p>
        </div>

        <div className="glass-hero-lime p-6 rounded-[28px] space-y-1.5 border border-lime-200/80">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3F6212] flex items-center gap-1">
            <FiClock className="text-[#3F6212]" /> Completion Days
          </span>
          <h3 className="text-xl font-extrabold text-[#03020A]">
            {selectedReportDetails.completionDays} Days
          </h3>
          <p className="text-[11px] font-semibold text-[#3F6212]">Total Execution Duration</p>
        </div>

        <div className="glass-card p-6 rounded-[28px] space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
            <FiUsers className="text-[#7C3AED]" /> Worked Team Roster
          </span>
          <h3 className="text-xl font-extrabold text-[#03020A]">
            {selectedReportDetails.teamMembers.length} Members
          </h3>
          <p className="text-[11px] font-semibold text-slate-500">Assigned Personnel</p>
        </div>

        <div className="glass-card p-6 rounded-[28px] space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
            <FiDollarSign className="text-[#7C3AED]" /> Project Budget
          </span>
          <h3 className="text-xl font-extrabold text-[#03020A]">
            {selectedProject.budget || "₹8.0 Cr / ₹8.0 Cr"}
          </h3>
          <p className="text-[11px] font-semibold text-purple-700">Fully Accounted</p>
        </div>
      </div>

      {/* Section 1: Worked Team Members Roster */}
      <Card hover={false} className="space-y-4 rounded-[28px] border border-purple-100">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
            <FiUsers className="text-[#7C3AED]" /> Worked Team Members & Personnel Roster
          </h3>
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            {selectedReportDetails.teamMembers.length} Assigned Members
          </span>
        </div>

        {selectedReportDetails.teamMembers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-purple-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-purple-50/60 border-b border-purple-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Assigned Role / Trade</th>
                  <th className="py-3 px-4">Contact Number</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 font-semibold text-slate-700">
                {selectedReportDetails.teamMembers.map((member, idx) => (
                  <tr key={member.id || idx} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-[#03020A] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xs font-extrabold shrink-0">
                        {member.name ? member.name.charAt(0) : 'W'}
                      </div>
                      <span>{member.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-purple-900 font-bold">{member.role}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <FiPhone className="text-slate-400" /> {member.phone || '+91 98765 00000'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-extrabold bg-[#F0FDC2] text-[#3F6212] border border-lime-200 px-3 py-1 rounded-full inline-block">
                        {member.status || 'Assigned'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
            <FiAlertCircle className="text-slate-400 text-base" />
            <span>No team members recorded for this completed project.</span>
          </div>
        )}
      </Card>

      {/* Section 2: Site Materials Spent Audit */}
      <Card hover={false} className="space-y-4 rounded-[28px] border border-purple-100">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
            <FiLayers className="text-[#7C3AED]" /> Site Materials Spent & Consumption Audit
          </h3>
          <span className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] px-3 py-1 rounded-full">
            {selectedReportDetails.materialsSpent.length} Allocated Items
          </span>
        </div>

        {selectedReportDetails.materialsSpent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedReportDetails.materialsSpent.map((mat, idx) => (
              <div key={mat.id || idx} className="bg-white p-4 rounded-2xl border border-purple-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-[#03020A]">{mat.name}</p>
                  <p className="text-xs font-bold text-purple-700">Spent: {mat.quantity}</p>
                </div>
                <span className="text-[10px] font-extrabold bg-[#F0FDC2] text-[#3F6212] border border-lime-200 px-3 py-1 rounded-full shrink-0">
                  {mat.status || 'Utilized'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
            <FiAlertCircle className="text-slate-400 text-base" />
            <span>No materials allocated or spent for this completed site.</span>
          </div>
        )}
      </Card>

      {/* Section 3: Completed Tasks Log */}
      <Card hover={false} className="space-y-4 rounded-[28px] border border-purple-100">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
            <FiClipboard className="text-[#7C3AED]" /> Site Tasks & QA Clearances Log
          </h3>
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            {selectedReportDetails.completedTasks.length} Logged Tasks
          </span>
        </div>

        {selectedReportDetails.completedTasks.length > 0 ? (
          <div className="space-y-3">
            {selectedReportDetails.completedTasks.map((task, idx) => (
              <div key={task.id || idx} className="bg-white p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F0FDC2] text-[#3F6212] flex items-center justify-center text-sm shrink-0 font-bold">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#03020A]">{task.title || task.name}</p>
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                      <FiTag className="text-[#7C3AED]" /> {task.category || 'Site Milestone'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold text-[#3F6212] bg-[#F0FDC2] border border-lime-200 px-3 py-1 rounded-full shrink-0">
                  {task.completedDate || task.status || 'Completed'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
            <FiAlertCircle className="text-slate-400 text-base" />
            <span>No site tasks logged for this completed project.</span>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DetailedReportView;
