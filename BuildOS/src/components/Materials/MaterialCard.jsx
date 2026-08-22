import React from 'react';
import { Card, Badge } from '../ui';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export function MaterialCard({ material, onEdit, onDelete }) {
  const isOverdueAlert = material.status === 'Low Stock Alert' || material.status === 'Reorder Required' || material.availablePct < 30;
  const isPendingAlert = material.availablePct >= 30 && material.availablePct < 50;

  const badgeVariant = isOverdueAlert ? 'overdue' : (isPendingAlert ? 'pending' : 'completed');

  return (
    <Card hover={true} className="space-y-4 relative group">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
            {material.category}
          </span>
          <h3 className="text-sm font-extrabold text-[#03020A] mt-2">{material.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={badgeVariant}>
            {material.status}
          </Badge>
          <button
            type="button"
            onClick={() => onEdit(material)}
            title="Edit material details"
            className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-100 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0"
          >
            <FiEdit2 className="text-xs text-[#7C3AED]" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(material.id)}
            title="Remove material from inventory"
            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0"
          >
            <FiTrash2 className="text-xs text-rose-600" />
          </button>
        </div>
      </div>

      <div className="bg-white/80 rounded-2xl p-3 border border-white space-y-2 text-xs font-medium text-slate-600">
        <div className="flex justify-between">
          <span>Total On-Hand:</span>
          <span className="font-bold text-[#03020A]">{material.totalStock}</span>
        </div>
        <div className="flex justify-between">
          <span>Allocated Site:</span>
          <span className="font-bold text-[#7C3AED]">{material.siteAllocated}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Unit Cost:</span>
          <span className="font-bold text-slate-800">{material.unitCost}</span>
        </div>
      </div>
    </Card>
  );
}

export default MaterialCard;
