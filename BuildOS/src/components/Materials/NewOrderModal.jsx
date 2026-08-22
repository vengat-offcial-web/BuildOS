import React from 'react';
import { FiLayers, FiPlus } from 'react-icons/fi';

export function NewOrderModal({ isOpen, onClose, newOrder, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-[32px] border border-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED] text-lg font-bold">
              <FiLayers />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#03020A] tracking-tight">New Material Order</h3>
              <p className="text-xs font-semibold text-slate-500">Dispatch supply order & allocate site inventory</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Category & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Category Tag</label>
              <input
                type="text"
                required
                value={newOrder.category}
                onChange={(e) => onChange('category', e.target.value)}
                placeholder="e.g. Concrete & Cement"
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Stock Alert Status</label>
              <select
                value={newOrder.status}
                onChange={(e) => onChange('status', e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all cursor-pointer"
              >
                <option value="Low Stock Alert">Low Stock Alert</option>
                <option value="Stocked">Stocked</option>
                <option value="Reorder Required">Reorder Required</option>
              </select>
            </div>
          </div>

          {/* Material Name Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Material Name</label>
            <input
              type="text"
              required
              value={newOrder.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Ready-Mix Concrete Grade 40"
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
            />
          </div>

          {/* Total On-Hand & Unit Cost Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Total On-Hand</label>
              <input
                type="text"
                required
                value={newOrder.totalStock}
                onChange={(e) => onChange('totalStock', e.target.value)}
                placeholder="e.g. 1,200 cu.m"
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Estimated Unit Cost</label>
              <input
                type="text"
                required
                value={newOrder.unitCost}
                onChange={(e) => onChange('unitCost', e.target.value)}
                placeholder="e.g. $85/cu.m"
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
              />
            </div>
          </div>

          {/* Allocated Site Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Allocated Site</label>
            <input
              type="text"
              required
              value={newOrder.siteAllocated}
              onChange={(e) => onChange('siteAllocated', e.target.value)}
              placeholder="e.g. Marina Tower (450 cu.m)"
              className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-purple-100/60 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dark-nav-pill px-6 py-2.5 rounded-full text-xs font-extrabold text-white shadow-lg hover:bg-black transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiPlus className="text-[#BEF264] text-sm" />
              <span>Dispatch Material Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewOrderModal;
