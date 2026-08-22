import React from 'react';
import { FiSettings, FiCheck } from 'react-icons/fi';

export function SettingsHeader({ savedSuccess }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
          <FiSettings className="text-[#7C3AED]" />
          BuildOS Admin Profile Settings
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Manage your admin profile details, profile picture, and login password credentials.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm animate-in fade-in">
          <FiCheck className="text-sm" />
          <span>Profile credentials and settings saved!</span>
        </div>
      )}
    </div>
  );
}

export default SettingsHeader;
