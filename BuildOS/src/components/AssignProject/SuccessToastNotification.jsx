import React from 'react';
import { FiCheck } from 'react-icons/fi';

export function SuccessToastNotification() {
  return (
    <div className="fixed top-6 right-6 z-50 bg-[#F0FDC2] text-[#3F6212] border-2 border-[#BEF264] px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="w-8 h-8 rounded-full bg-[#3F6212] text-white flex items-center justify-center font-bold">
        <FiCheck className="text-lg" />
      </div>
      <div>
        <h4 className="text-sm font-extrabold">Project Successfully Assigned!</h4>
        <p className="text-xs font-semibold opacity-90">Added to Projects Roster with initial status set to Planning.</p>
      </div>
    </div>
  );
}

export default SuccessToastNotification;
