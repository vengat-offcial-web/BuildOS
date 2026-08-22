import React from 'react';
import { FiUsers, FiX } from 'react-icons/fi';

export function AddWorkerModal({
  isOpen,
  onClose,
  newWorkerForm,
  setNewWorkerForm,
  projects,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
              <FiUsers />
            </div>
            <h3 className="text-base font-extrabold text-[#03020A]">Register New Site Worker</h3>
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
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newWorkerForm.name}
              onChange={(e) => setNewWorkerForm({ ...newWorkerForm, name: e.target.value })}
              placeholder="e.g. Annamalai"
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Trade Specialization / Role</label>
            <input
              type="text"
              value={newWorkerForm.trade}
              onChange={(e) => setNewWorkerForm({ ...newWorkerForm, trade: e.target.value })}
              placeholder="e.g. Site Supervisor / Structural Lead"
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Construction Site</label>
            <select
              value={newWorkerForm.site}
              onChange={(e) => setNewWorkerForm({ ...newWorkerForm, site: e.target.value })}
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
            >
              <option value="Not Assigned Yet">Not Assigned Yet</option>
              {(projects || []).filter(p => p.status !== 'Cancelled').map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Phone / Contact Number</label>
            <input
              type="text"
              value={newWorkerForm.phone}
              onChange={(e) => setNewWorkerForm({ ...newWorkerForm, phone: e.target.value })}
              placeholder="e.g. 9198564253"
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
            />
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
              className="dark-nav-pill px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
            >
              Register Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWorkerModal;
