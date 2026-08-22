import React from 'react';
import { Card, Badge } from '../ui';
import { FiCheckCircle, FiEdit2 } from 'react-icons/fi';

export function MilestonesCard({ milestones, onOpenModal, onToggleStatus }) {
  return (
    <Card hover={false}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
        <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
          <FiCheckCircle className="text-[#7C3AED]" />
          Construction Milestones
        </h3>
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <FiEdit2 className="text-xs text-[#7C3AED]" />
          <span>Edit</span>
        </button>
      </div>
      <div className="space-y-3">
        {milestones.map((m, index) => (
          <div 
            key={index} 
            onClick={() => onToggleStatus(index)}
            className="bg-white/80 hover:bg-white p-4 rounded-2xl border border-white flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs group"
            title="Click to cycle milestone status & update project progress"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                m.status === 'Completed' ? 'bg-[#F0FDC2] text-[#3F6212]' : m.status === 'In Progress' ? 'bg-[#E9D5FF] text-[#6B21A8]' : 'bg-slate-100 text-slate-500'
              }`}>
                {m.status === 'Completed' ? <FiCheckCircle className="text-sm text-[#3F6212]" /> : index + 1}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${m.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#03020A]'}`}>{m.name}</h4>
                <p className="text-[11px] text-slate-500 font-semibold">{m.date}</p>
              </div>
            </div>
            <Badge variant={m.status === 'Completed' ? 'completed' : m.status === 'In Progress' ? 'in-progress' : 'pending'}>
              {m.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default MilestonesCard;
