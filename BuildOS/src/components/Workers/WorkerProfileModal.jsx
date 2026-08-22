import React from 'react';
import { FiX, FiMapPin, FiUserCheck, FiTrash2 } from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';

export function WorkerProfileModal({
  isOpen,
  onClose,
  selectedWorkerProfile,
  onRemoveClick
}) {
  if (!isOpen || !selectedWorkerProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg p-6 rounded-[32px] border border-white shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#BEF264] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              {selectedWorkerProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#03020A]">{selectedWorkerProfile.name}</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]">
                  {selectedWorkerProfile.status || 'On Duty'}
                </span>
              </div>
              <p className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-0.5">
                <FaHelmet className="text-xs" />
                {selectedWorkerProfile.trade}
              </p>
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

        {/* Profile Information Grid */}
        <div className="space-y-4 text-xs font-medium text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 p-3.5 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <FiMapPin className="text-[#7C3AED]" /> Assigned Site
              </span>
              <p className="font-extrabold text-[#03020A] text-sm">
                {(!selectedWorkerProfile.site || selectedWorkerProfile.site === 'Not Assigned Yet' || selectedWorkerProfile.site === 'Unassigned') ? 'Not Assigned Yet' : selectedWorkerProfile.site}
              </p>
            </div>

            <div className="bg-white/80 p-3.5 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <FiUserCheck className="text-[#7C3AED]" /> Attendance Status
              </span>
              <p className={`font-extrabold text-sm ${
                (selectedWorkerProfile.attendance === 'Present' || selectedWorkerProfile.status === 'On Duty')
                  ? 'text-[#3F6212]'
                  : 'text-rose-600'
              }`}>
                { (selectedWorkerProfile.attendance === 'Present' || selectedWorkerProfile.attendance === 'Absent')
                    ? selectedWorkerProfile.attendance
                    : (selectedWorkerProfile.status === 'On Duty' ? 'Present' : 'Absent') }
              </p>
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-purple-100 space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Contact Info:</span>
              <span className="font-extrabold text-[#03020A] text-sm">{selectedWorkerProfile.phone || 'Not Provided'}</span>
            </div>

            <div className="flex justify-between items-center pt-1 pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Shift Schedule:</span>
              <span className="font-bold text-slate-800">08:00 AM – 05:00 PM (General Shift)</span>
            </div>

            <div className="flex justify-between items-center pt-1 pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Authorized Supervisor:</span>
              <span className="font-bold text-[#7C3AED]">Rajesh Kumar (Lead Site Director)</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-bold">Emergency Phone:</span>
              <span className="font-bold text-slate-800">+91 98765 99999</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onRemoveClick(selectedWorkerProfile)}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FiTrash2 className="text-xs" /> Remove Worker
          </button>

          <button
            type="button"
            onClick={onClose}
            className="dark-nav-pill px-6 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileModal;
