import React from 'react';
import { FiCheck } from 'react-icons/fi';

export function FormActionBar({ submitting, onCancel }) {
  return (
    <div className="lg:col-span-2 glass-card p-6 rounded-[32px] border border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="text-xs font-semibold text-slate-500">
        Click <strong className="text-[#03020A]">Create & Assign Project</strong> to dispatch site parameters.
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none px-6 py-3.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-slate-700 border border-purple-100 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 sm:flex-none dark-nav-pill hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-extrabold shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {submitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FiCheck className="text-base text-[#BEF264]" />
              <span>Create & Assign Project</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FormActionBar;
