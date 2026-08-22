import React from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';

export function CancelProjectModal({ isOpen, onClose, projectName, projectId, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600 font-extrabold text-base">
            <FiTrash2 className="text-xl text-rose-600" />
            <span>Cancel Construction Project</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <p className="font-semibold leading-relaxed">
            Are you sure you want to cancel <strong className="text-[#03020A]">{projectName}</strong> (Site ID #{projectId})?
          </p>
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl space-y-1.5 text-[#9F1239]">
            <p className="font-extrabold">Connected System Effects:</p>
            <ul className="list-disc list-inside space-y-1 font-medium">
              <li>Project status will update to <strong>Cancelled</strong>.</li>
              <li>Automatically removed from active Dashboard project cards and updated total project counts.</li>
              <li>Assigned workers will receive status alert: <span className="font-bold underline">"your assigned project was cancelled by admin"</span>.</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Keep Project Active
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FiTrash2 className="text-white" />
            <span>Confirm Cancel Project</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelProjectModal;
