import React from 'react';
import { Card } from '../ui';
import { FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';

export function TimelineCard({ startDate, deadline, durationText, errors, onChange }) {
  return (
    <Card hover={false} className="space-y-4">
      <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
          <FiCalendar className="text-[#7C3AED]" />
          3. Project Timeline & Schedule
        </h3>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
          Required
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
            Target Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl py-3 px-4 text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
            Target Deadline <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => onChange('deadline', e.target.value)}
            className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 px-4 text-[#03020A] focus:ring-2 outline-none ${
              errors.deadline || errors.dateSequence ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
            }`}
          />
        </div>
      </div>

      {(errors.deadline || errors.dateSequence) && (
        <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
          <FiAlertCircle /> {errors.deadline || errors.dateSequence}
        </p>
      )}

      {durationText && (
        <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
          <span className="font-bold text-[#03020A] flex items-center gap-1.5">
            <FiClock className="text-[#7C3AED]" /> Estimated Duration:
          </span>
          <span className="font-extrabold text-[#7C3AED] bg-white px-3 py-1 rounded-full border border-purple-100 shadow-sm">
            {durationText.text}
          </span>
        </div>
      )}
    </Card>
  );
}

export default TimelineCard;
