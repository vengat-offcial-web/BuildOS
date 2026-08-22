import React from 'react';
import { Card } from '../ui';
import { FiUserCheck, FiSearch, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export function SiteEngineerCard({ engineers, selectedEngineer, engineerSearch, errors, onSearchChange, onEngineerSelect }) {
  return (
    <Card hover={false} className="space-y-4">
      <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
          <FiUserCheck className="text-[#7C3AED]" />
          2. Designated Site Engineer
        </h3>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
          Required
        </span>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
          Select Site Engineer <span className="text-rose-500">*</span>
        </label>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
            <FiSearch className="text-sm" />
          </span>
          <input
            type="text"
            value={engineerSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search engineer by name or specialty..."
            className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.engineer ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
            }`}
          />
        </div>

        {errors.engineer && (
          <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
            <FiAlertCircle /> {errors.engineer}
          </p>
        )}
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {engineers.length > 0 ? (
          engineers.map(eng => {
            const isSelected = selectedEngineer?.id === eng.id;
            return (
              <div
                key={eng.id}
                onClick={() => onEngineerSelect(eng)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#F0FDC2]/60 border-[#BEF264] shadow-md scale-[1.01]'
                    : 'bg-white/80 border-purple-100 hover:bg-purple-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-tr ${eng.avatarBg} text-[#6B21A8] flex items-center justify-center font-extrabold text-xs border border-white shadow-sm shrink-0`}>
                    {eng.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#03020A] flex items-center gap-1.5">
                      {eng.name}
                      {isSelected && <FiCheckCircle className="text-[#3F6212]" />}
                    </h4>
                    <p className="text-[11px] font-bold text-purple-700">{eng.role}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{eng.phone}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full transition-all ${
                    isSelected ? 'bg-[#3F6212] text-white shadow-sm' : 'bg-purple-100 text-[#7C3AED]'
                  }`}>
                    {isSelected ? '✓ Assigned' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-xs font-semibold text-slate-400 text-center bg-white/60 rounded-2xl border border-purple-100">
            No matching site engineers found for "{engineerSearch}"
          </div>
        )}
      </div>
    </Card>
  );
}

export default SiteEngineerCard;
