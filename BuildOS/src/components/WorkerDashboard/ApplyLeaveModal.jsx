import React from 'react';
import { FiCalendar, FiX, FiSend } from 'react-icons/fi';

export function ApplyLeaveModal({
  isOpen,
  onClose,
  engineerName,
  leaveForm,
  setLeaveForm,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
              <FiCalendar />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#03020A]">Apply for Leave</h3>
              <p className="text-[11px] text-slate-500 font-medium">Recipient: <strong className="text-[#7C3AED]">{engineerName}</strong></p>
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Leave Date</label>
            <input
              type="date"
              required
              value={leaveForm.date}
              onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Leave</label>
            <select
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
            >
              <option value="Medical Leave">Medical Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Family Emergency">Family Emergency</option>
              <option value="Scheduled Rest Day">Scheduled Rest Day</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Additional Notes (Optional)</label>
            <textarea
              rows="3"
              value={leaveForm.notes}
              onChange={(e) => setLeaveForm({ ...leaveForm, notes: e.target.value })}
              placeholder="Provide brief details for Site Engineer..."
              className="w-full bg-white border border-purple-100 rounded-2xl p-3 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dark-nav-pill px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FiSend className="text-[#BEF264]" />
              <span>Send to Site Engineer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeaveModal;
