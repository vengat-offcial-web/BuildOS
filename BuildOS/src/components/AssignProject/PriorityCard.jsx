import React from 'react';
import { Card } from '../ui';
import { FiFlag } from 'react-icons/fi';

const PRIORITY_OPTIONS = [
  { level: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200', activeColor: 'bg-slate-800 text-white' },
  { level: 'Medium', color: 'bg-purple-50 text-purple-700 border-purple-100', activeColor: 'bg-[#7C3AED] text-white' },
  { level: 'High', color: 'bg-amber-50 text-amber-800 border-amber-200', activeColor: 'bg-amber-500 text-white' },
  { level: 'Critical', color: 'bg-rose-50 text-rose-800 border-rose-200', activeColor: 'bg-rose-600 text-white' }
];

export function PriorityCard({ priority, onChange }) {
  return (
    <Card hover={false} className="space-y-4">
      <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
          <FiFlag className="text-[#7C3AED]" />
          5. Project Priority Level
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRIORITY_OPTIONS.map(p => (
          <button
            key={p.level}
            type="button"
            onClick={() => onChange('priority', p.level)}
            className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all text-center cursor-pointer shadow-sm ${
              priority === p.level ? `${p.activeColor} border-transparent scale-[1.02]` : p.color
            }`}
          >
            {p.level}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default PriorityCard;
