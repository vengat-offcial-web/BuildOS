import React, { useState } from 'react';
import { Card, Badge, ProgressBar } from '../components/ui';
import { FiLayers, FiSearch, FiPlus } from 'react-icons/fi';
import { useData } from '../context/useData';

function Materials() {
  const { materials, addMaterialOrder } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [newOrder, setNewOrder] = useState({ name: '', quantity: '', site: '' });

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.name) return;

    addMaterialOrder(newOrder);
    setNewOrder({ name: '', quantity: '', site: '' });
    setShowOrderModal(false);
  };

  const filtered = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.siteAllocated.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

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

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
            <FiSearch className="text-sm" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search material by name or site..."
            className="w-full bg-white/90 border border-purple-100 text-xs font-semibold rounded-full pl-10 pr-4 py-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
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
              <Badge variant={mat.availablePct < 30 ? 'overdue' : mat.availablePct < 50 ? 'pending' : 'completed'}>
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

            <div className="pt-2">
              <ProgressBar
                progress={mat.availablePct}
                variant={mat.availablePct < 30 ? 'dark' : mat.availablePct > 80 ? 'lime' : 'purple'}
                size="sm"
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#03020A]">Order Site Materials</h3>
              <button type="button" onClick={() => setShowOrderModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Material Name</label>
                <input
                  type="text"
                  required
                  value={newOrder.name}
                  onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                  placeholder="e.g. Ready-Mix Concrete Grade 50"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order Quantity</label>
                <input
                  type="text"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                  placeholder="e.g. 250 cu.m"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Destination Site</label>
                <input
                  type="text"
                  value={newOrder.site}
                  onChange={(e) => setNewOrder({ ...newOrder, site: e.target.value })}
                  placeholder="e.g. Marina Tower"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowOrderModal(false)} className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md cursor-pointer">Dispatch Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;