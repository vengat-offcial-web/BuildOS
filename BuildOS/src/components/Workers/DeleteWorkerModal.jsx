import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

export function DeleteWorkerModal({
  isOpen,
  onClose,
  workerToDelete,
  onConfirmDelete
}) {
  if (!isOpen || !workerToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-inner border border-rose-200">
          <FiTrash2 />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-[#03020A]">Permanently Delete Worker?</h3>
          <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
            Are you sure you want to delete <strong className="text-rose-600 font-extrabold">{workerToDelete.name}</strong> ({workerToDelete.trade})?
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-2 bg-rose-50 border border-rose-100 p-3 rounded-2xl text-rose-700">
            ⚠️ Once deleted, this worker will be completely removed from all project sites, team rosters, and workforce records across the application.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirmDelete(workerToDelete)}
            className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FiTrash2 className="text-xs" /> Yes, Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteWorkerModal;
