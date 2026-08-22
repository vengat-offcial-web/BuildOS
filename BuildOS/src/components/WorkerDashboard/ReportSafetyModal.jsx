import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export function ReportSafetyModal({
  isOpen,
  onClose,
  safetyForm,
  setSafetyForm,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">
              <FiAlertTriangle />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#03020A]">Report Safety Hazard</h3>
              <p className="text-[11px] text-slate-500 font-medium">Alert Supervisor & Safety Officer</p>
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
            <label className="text-xs font-bold text-slate-700 block mb-1">Hazard Category</label>
            <select
              value={safetyForm.hazardType}
              onChange={(e) => setSafetyForm({ ...safetyForm, hazardType: e.target.value })}
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
            >
              <option value="Scaffolding Hazard">Unstable Scaffolding / Height Hazard</option>
              <option value="Equipment Failure">Equipment & Power Tool Defect</option>
              <option value="PPE Missing">Missing Safety Gear / PPE Issue</option>
              <option value="Electrical Hazard">Exposed Electrical Wiring</option>
              <option value="General Hazard">General Site Safety Obstruction</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hazard Description</label>
            <textarea
              rows="3"
              required
              value={safetyForm.description}
              onChange={(e) => setSafetyForm({ ...safetyForm, description: e.target.value })}
              placeholder="Describe the dangerous condition on site..."
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
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FiAlertTriangle className="text-white" />
              <span>Submit Safety Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportSafetyModal;
