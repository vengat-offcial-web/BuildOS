import React from 'react';
import { FiLayers, FiPlus } from 'react-icons/fi';

export function MaterialsHeader({ onOpenNewOrder }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
          <FiLayers className="text-[#7C3AED]" />
          Materials Stock & Logistics
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Real-time supply inventory, job-site allocations, and automated reorder triggers.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenNewOrder}
        className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
      >
        <FiPlus className="text-[#BEF264] text-base" />
        <span>New Material Order</span>
      </button>
    </div>
  );
}

export default MaterialsHeader;
