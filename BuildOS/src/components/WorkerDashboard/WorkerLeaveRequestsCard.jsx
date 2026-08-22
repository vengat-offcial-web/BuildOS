import React from 'react';
import { FiCalendar, FiTrash2, FiX } from 'react-icons/fi';

export function WorkerLeaveRequestsCard({
  leaveRequests,
  onApplyLeaveClick,
  onClearAllLeave,
  onDeleteSingleLeave
}) {
  return (
    <div className="glass-card p-6 rounded-[28px] border border-white space-y-4">
      <div className="flex items-center justify-between border-b border-purple-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
            <FiCalendar />
          </div>
          <h3 className="text-base font-extrabold text-[#03020A]">My Leave Requests</h3>
        </div>
        <div className="flex items-center gap-2">
          {leaveRequests && leaveRequests.length > 0 && (
            <button
              type="button"
              onClick={onClearAllLeave}
              className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer mr-1"
              title="Clear all leave records"
            >
              <FiTrash2 className="text-xs" /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={onApplyLeaveClick}
            className="text-[11px] font-extrabold text-[#7C3AED] hover:underline cursor-pointer"
          >
            + Apply
          </button>
        </div>
      </div>

      {leaveRequests && leaveRequests.length > 0 ? (
        <div className="space-y-2.5 text-xs">
          {leaveRequests.map((req) => (
            <div key={req.id} className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-1 relative group">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-[#03020A]">{req.reason}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    req.status === 'Approved'
                      ? 'bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]'
                      : req.status === 'Declined'
                      ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]'
                      : 'bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]'
                  }`}>
                    {req.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteSingleLeave(req)}
                    className="w-5 h-5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer"
                    title="Clear this leave record"
                  >
                    <FiX className="text-xs" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Date: <strong className="text-slate-700">{req.date}</strong></p>
              <p className="text-[10px] text-purple-600 font-semibold">Engineer: {req.engineer || 'R. Sharma (Site Engineer)'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center py-3 font-medium">No leave requests submitted yet.</p>
      )}
    </div>
  );
}

export default WorkerLeaveRequestsCard;
