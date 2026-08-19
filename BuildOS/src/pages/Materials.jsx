import React, { useState, useMemo } from 'react';
import { Card, Badge } from '../components/ui';
import { FiLayers, FiPlus, FiFilter } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Materials() {
  const { materials, addMaterialOrder } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [newOrder, setNewOrder] = useState({
    name: '',
    category: '',
    totalStock: '',
    siteAllocated: '',
    unitCost: '',
    status: 'Low Stock Alert'
  });

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.name.trim()) return;

    addMaterialOrder({
      name: newOrder.name,
      category: newOrder.category.trim() || 'Concrete & Cement',
      totalStock: newOrder.totalStock.trim() || '300 cum',
      siteAllocated: newOrder.siteAllocated.trim() || 'Hyper Mall (450 cu.m)',
      unitCost: newOrder.unitCost.trim() || '$85/cu.m',
      status: newOrder.status || 'Low Stock Alert'
    });

    setNewOrder({
      name: '',
      category: '',
      totalStock: '',
      siteAllocated: '',
      unitCost: '',
      status: 'Low Stock Alert'
    });
    setShowOrderModal(false);
  };

  const filtered = useMemo(() => {
    const seen = new Set();
    return (materials || []).filter(m => {
      if (!m || !m.name) return false;
      const key = m.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);

      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (m.siteAllocated && m.siteAllocated.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || 
                              (m.category && m.category.toLowerCase().includes(categoryFilter.toLowerCase()));
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, categoryFilter]);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
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
          onClick={() => setShowOrderModal(true)}
          className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-[#BEF264] text-base" />
          <span>New Material Order</span>
        </button>
      </div>

      {/* Filter Pills Bar */}
      <div className="glass-card p-4 rounded-[28px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <FiFilter className="text-purple-500" /> Filter Category:
          </span>
          {['All', 'Concrete', 'Steel', 'Facade', 'Masonry'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((mat) => (
          <Card key={mat.id} hover={true} className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  {mat.category}
                </span>
                <h3 className="text-sm font-extrabold text-[#03020A] mt-2">{mat.name}</h3>
              </div>
              <Badge variant={
                mat.status === 'Low Stock Alert' || mat.status === 'Reorder Required' || mat.availablePct < 30
                  ? 'overdue'
                  : mat.status === 'In Use' || (mat.availablePct >= 30 && mat.availablePct < 50)
                    ? 'pending'
                    : 'completed'
              }>
                {mat.status}
              </Badge>
            </div>

            <div className="bg-white/80 rounded-2xl p-3 border border-white space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Total On-Hand:</span>
                <span className="font-bold text-[#03020A]">{mat.totalStock}</span>
              </div>
              <div className="flex justify-between">
                <span>Allocated Site:</span>
                <span className="font-bold text-[#7C3AED]">{mat.siteAllocated}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Unit Cost:</span>
                <span className="font-bold text-slate-800">{mat.unitCost}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Modal Popup */}
      {showOrderModal && (
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
                onClick={() => setShowOrderModal(false)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Category & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Category Tag</label>
                  <input
                    type="text"
                    required
                    value={newOrder.category}
                    onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value })}
                    placeholder="Enter material category"
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Stock Alert Status</label>
                  <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all cursor-pointer"
                  >
                    <option value="Low Stock Alert">Low Stock Alert</option>
                    <option value="Stocked">Stocked</option>
                    <option value="In Use">In Use</option>
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
                  onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                  placeholder="Enter material name"
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
                    onChange={(e) => setNewOrder({ ...newOrder, totalStock: e.target.value })}
                    placeholder="Enter total stock on-hand"
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Estimated Unit Cost</label>
                  <input
                    type="text"
                    required
                    value={newOrder.unitCost}
                    onChange={(e) => setNewOrder({ ...newOrder, unitCost: e.target.value })}
                    placeholder="Enter unit cost"
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
                  onChange={(e) => setNewOrder({ ...newOrder, siteAllocated: e.target.value })}
                  placeholder="Enter allocated site & quantity"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-purple-100/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
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
      )}
    </div>
  );
}

export default Materials;