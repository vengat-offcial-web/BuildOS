import React from 'react';
import { Card, Badge } from '../ui';
import { FiLayers, FiEdit2 } from 'react-icons/fi';

export function MaterialAllocationsCard({ materials, onOpenModal }) {
  return (
    <div className="w-full space-y-6">
      <Card hover={false} className="w-full">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
          <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
            <FiLayers className="text-[#7C3AED]" />
            Material Stock Allocation
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
        <div className="space-y-4">
          {materials.map((mat, i) => (
            <div key={i} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#03020A]">{mat.name}</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Quantity: {mat.quantity || mat.totalStock}</p>
              </div>
              <Badge variant={mat.status === 'Stocked' ? 'completed' : mat.status === 'In Use' ? 'in-progress' : mat.status === 'Low Stock Alert' ? 'pending' : 'overdue'}>
                {mat.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default MaterialAllocationsCard;
