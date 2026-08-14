import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { FiUsers, FiSearch, FiPlus, FiShield, FiPhone } from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';
import { useData } from '../context/useData';

function Workers() {
  const { workers, addWorker } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const [newWorker, setNewWorker] = useState({ name: '', trade: '', site: '', phone: '' });

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name) return;

    addWorker(newWorker);
    setNewWorker({ name: '', trade: '', site: '', phone: '' });
    setShowModal(false);
  };

  const filtered = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'All' || w.trade.includes(tradeFilter);
    return matchesSearch && matchesTrade;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiUsers className="text-[#7C3AED]" />
            Site Workforce Directory
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Total {workers.length + 120} registered site personnel • 96% active attendance today
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-[#BEF264] text-base" />
          <span>Add New Worker</span>
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
            placeholder="Search worker by name or site..."
            className="w-full bg-white/90 border border-purple-100 text-xs font-semibold rounded-full pl-10 pr-4 py-2.5 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Masonry', 'Steel', 'Crane', 'Electrical'].map((tr) => (
            <button
              key={tr}
              type="button"
              onClick={() => setTradeFilter(tr)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                tradeFilter === tr
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((w) => (
          <Card key={w.id} hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E9D5FF] via-[#C4B5FD] to-[#F0FDC2] flex items-center justify-center font-extrabold text-[#6B21A8] text-lg border-2 border-white shadow-sm">
                  {w.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#03020A]">{w.name}</h3>
                  <p className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-0.5">
                    <FaHelmetSafety className="text-xs" />
                    {w.trade}
                  </p>
                </div>
              </div>
              <Badge variant={w.status === 'On Duty' ? 'completed' : 'pending'}>
                {w.status}
              </Badge>
            </div>

            <div className="bg-white/80 rounded-2xl p-3 border border-white space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Assigned Site:</span>
                <span className="font-bold text-[#03020A]">{w.site}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Rate:</span>
                <span className="font-bold text-[#3F6212] bg-[#F0FDC2] px-2 py-0.5 rounded-full">{w.attendance}</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Badge:</span>
                <span className="font-bold text-purple-700 flex items-center gap-1">
                  <FiShield className="text-xs" /> {w.safetyRating}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-semibold">
                <FiPhone className="text-purple-500" /> {w.phone}
              </span>
              <button type="button" className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer">
                View Profile
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Adding Worker */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#03020A]">Register New Worker</h3>
              <button type="button" onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddWorker} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trade Specialization</label>
                <input
                  type="text"
                  value={newWorker.trade}
                  onChange={(e) => setNewWorker({ ...newWorker, trade: e.target.value })}
                  placeholder="e.g. Heavy Equipment Mechanic"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Construction Site</label>
                <input
                  type="text"
                  value={newWorker.site}
                  onChange={(e) => setNewWorker({ ...newWorker, site: e.target.value })}
                  placeholder="e.g. Marina Tower"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md cursor-pointer">Register Worker</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workers;