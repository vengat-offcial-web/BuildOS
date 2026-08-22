import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

export function DeleteTaskModal({ isOpen, onClose, deletingTask, onConfirm }) {
  if (!isOpen || !deletingTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-sm p-6 rounded-[32px] border border-white shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto font-bold">
          <FiTrash2 />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#03020A]">Delete Site Task?</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
            Are you sure you want to delete <strong className="text-rose-600">"{deletingTask.title || deletingTask.name}"</strong>? This will remove it from all site checklists.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
