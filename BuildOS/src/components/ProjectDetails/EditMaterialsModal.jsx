import React from 'react';
import { FiLayers, FiX, FiSearch, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';

export function EditMaterialsModal({
  isOpen,
  onClose,
  matSearchQuery,
  setMatSearchQuery,
  showMatSearchDropdown,
  setShowMatSearchDropdown,
  searchedMaterialCandidates,
  editAllocatedMaterials,
  onSelectSavedMaterial,
  onRemoveMaterial,
  onUpdateMaterialField,
  onAddBlankMaterial,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-[32px] p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
              <FiLayers className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#03020A]">Edit Material Stock Allocation</h3>
              <p className="text-xs font-semibold text-slate-500">Allocate saved inventory & automatically deduct stock</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Quick Search & Auto-Fill from Saved Materials Page */}
        <div className="relative shrink-0">
          <label className="block text-xs font-extrabold text-[#7C3AED] mb-1.5 flex items-center gap-1.5">
            <FiSearch className="text-xs" />
            <span>Search & Select from Saved Materials (Materials Page)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={matSearchQuery}
              onChange={(e) => {
                setMatSearchQuery(e.target.value);
                setShowMatSearchDropdown(true);
              }}
              onFocus={() => setShowMatSearchDropdown(true)}
              className="w-full bg-purple-50/50 border border-purple-200 text-xs font-semibold rounded-2xl p-3 pl-10 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="Search saved material by name or category..."
            />
            <FiSearch className="absolute left-3.5 top-3.5 text-purple-400 text-sm" />
          </div>

          {/* Autocomplete Search Dropdown */}
          {showMatSearchDropdown && searchedMaterialCandidates.length > 0 && (
            <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl max-h-52 overflow-y-auto p-1.5 animate-in fade-in duration-150">
              <div className="text-[10px] font-extrabold text-purple-700 px-3 py-1 uppercase tracking-wider flex items-center justify-between border-b border-purple-100/60 mb-1">
                <span>Saved Materials Inventory ({searchedMaterialCandidates.length})</span>
                <button
                  type="button"
                  onClick={() => setShowMatSearchDropdown(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
              {searchedMaterialCandidates.map((cand, idx) => {
                const isAlreadyAllocated = editAllocatedMaterials.some(m => m.name.toLowerCase().trim() === cand.name.toLowerCase().trim());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSavedMaterial(cand)}
                    disabled={isAlreadyAllocated}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isAlreadyAllocated ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'hover:bg-purple-50 group'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#03020A] group-hover:text-[#7C3AED]">{cand.name}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{cand.category} • Total Stock: {cand.totalStock}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      isAlreadyAllocated ? 'bg-slate-200 text-slate-500' : 'bg-purple-100 text-purple-700 group-hover:bg-[#7C3AED] group-hover:text-white'
                    }`}>
                      {isAlreadyAllocated ? 'Allocated' : '+ Add Allocation'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Form List */}
        <form onSubmit={onSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="space-y-3">
            {editAllocatedMaterials.map((m, idx) => (
              <div key={idx} className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-3 relative">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-xs font-extrabold">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveMaterial(idx)}
                    title="Delete Material Allocation"
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-100 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <FiTrash2 className="text-xs" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Material Name</label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => onUpdateMaterialField(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                      placeholder="e.g. Ready-Mix Concrete Grade 40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity Needed / Allocated</label>
                    <input
                      type="text"
                      value={m.quantity}
                      onChange={(e) => onUpdateMaterialField(idx, 'quantity', e.target.value)}
                      className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                      placeholder="e.g. 450 cu.m"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Allocation Status</label>
                    <select
                      value={m.status}
                      onChange={(e) => onUpdateMaterialField(idx, 'status', e.target.value)}
                      className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-xl p-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
                    >
                      <option value="Stocked">Stocked</option>
                      <option value="In Use">In Use</option>
                      <option value="Low Stock Alert">Low Stock Alert</option>
                      <option value="Reorder Required">Reorder Required</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddBlankMaterial}
            className="w-full py-3 border-2 border-dashed border-purple-200 hover:border-[#7C3AED] bg-purple-50/40 hover:bg-purple-50 text-[#7C3AED] text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiPlus className="text-sm" />
            <span>Add Custom Material</span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FiSave className="text-sm text-[#BEF264]" />
              <span>Save Allocation & Deduct Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMaterialsModal;
