import React from 'react';
import { Card } from '../ui';
import { FiFolder, FiMapPin, FiAlertCircle } from 'react-icons/fi';

const CITY_TAGS = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Hosur"];

export function ProjectInfoCard({ formData, errors, onChange, onCitySelect }) {
  return (
    <Card hover={false} className="space-y-5">
      <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
          <FiFolder className="text-[#7C3AED]" />
          1. Project Information
        </h3>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
          Required
        </span>
      </div>

      {/* Project Name */}
      <div>
        <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
          Project Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
            <FiFolder className="text-sm" />
          </span>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Marina Commercial Tower Phase 2"
            className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.name ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
            <FiAlertCircle /> {errors.name}
          </p>
        )}
      </div>

      {/* Project Location & Quick City Select */}
      <div>
        <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
          Project Location <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
            <FiMapPin className="text-sm" />
          </span>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="e.g. Chennai Central"
            className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.location ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
            }`}
          />
        </div>
        {errors.location && (
          <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
            <FiAlertCircle /> {errors.location}
          </p>
        )}

        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Select:</span>
          {CITY_TAGS.map(city => (
            <button
              key={city}
              type="button"
              onClick={() => onCitySelect(city)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                formData.location === city
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white/80 text-slate-600 border-purple-100 hover:bg-purple-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Scope / Description */}
      <div>
        <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
          Project Scope & Description <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe project specifications, floor height, specialized structures..."
          className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3.5 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all resize-none"
        />
      </div>
    </Card>
  );
}

export default ProjectInfoCard;
