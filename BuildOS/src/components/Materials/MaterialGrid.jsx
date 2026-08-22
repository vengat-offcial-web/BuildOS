import React from 'react';
import MaterialCard from './MaterialCard';

export function MaterialGrid({ materials, onEdit, onDelete }) {
  if (!materials || materials.length === 0) {
    return (
      <div className="glass-card p-8 text-center rounded-[28px] border border-white space-y-2">
        <h3 className="text-sm font-bold text-[#03020A]">No materials found</h3>
        <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((mat) => (
        <MaterialCard
          key={mat.id}
          material={mat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MaterialGrid;
