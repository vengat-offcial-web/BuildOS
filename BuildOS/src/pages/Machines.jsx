import React, { useState } from 'react';
import { Card, Badge, ProgressBar } from '../components/ui';
import { FiTruck, FiPlus, FiCpu, FiFilter } from 'react-icons/fi';
import { FaTruckRampBox } from 'react-icons/fa6';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Machines() {
  const { machines, addMachine } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const [newMachine, setNewMachine] = useState({ name: '', category: '', site: '', operator: '' });

  const handleAddMachine = (e) => {
    e.preventDefault();
    if (!newMachine.name) return;

    addMachine(newMachine);
    setNewMachine({ name: '', category: '', site: '', operator: '' });
    setShowModal(false);
  };

  const filtered = machines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiTruck className="text-[#7C3AED]" />
            Heavy Equipment & Fleet Telemetry
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {machines.length} total machinery units • {machines.filter(x => x.status === 'Operational').length} active on job sites
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-[#BEF264] text-base" />
          <span>Register Equipment</span>
        </button>
      </div>

      {/* Filter Pills Bar */}
      <div className="glass-card p-4 rounded-[28px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <FiFilter className="text-purple-500" /> Filter Status:
          </span>
          {['All', 'Operational', 'Maintenance Due'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Machinery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((m) => (
          <Card key={m.id} hover={true} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#03020A] text-[#BEF264] flex items-center justify-center text-xl shadow-md shrink-0">
                  <FaTruckRampBox />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#03020A]">{m.name}</h3>
                  <p className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
                    <FiCpu /> {m.category} • Site: {m.site}
                  </p>
                </div>
              </div>
              <Badge variant={m.status === 'Operational' ? 'completed' : 'pending'}>
                {m.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-white/80 rounded-2xl p-3.5 border border-white text-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Assigned Operator</p>
                <p className="text-xs font-bold text-[#03020A] mt-0.5 truncate">{m.operator}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Fuel Level</p>
                <p className="text-xs font-bold text-purple-700 mt-0.5">{m.fuelLevel}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Total Run Time</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{m.hoursUsed}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#03020A]">
                <span>Equipment Health Rating</span>
                <span className="text-[#7C3AED]">{m.healthPct}%</span>
              </div>
              <ProgressBar progress={m.healthPct} variant={m.healthPct > 90 ? 'lime' : 'purple'} size="sm" />
            </div>
          </Card>
        ))}
      </div>

      {/* Add Machine Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#03020A]">Register Heavy Machinery</h3>
              <button type="button" onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Equipment Model & Name</label>
                <input
                  type="text"
                  required
                  value={newMachine.name}
                  onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                  placeholder="e.g. JCB 3DX Backhoe Loader"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Equipment Category</label>
                <input
                  type="text"
                  value={newMachine.category}
                  onChange={(e) => setNewMachine({ ...newMachine, category: e.target.value })}
                  placeholder="e.g. Earthmoving & Loading"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Job Site</label>
                <input
                  type="text"
                  value={newMachine.site}
                  onChange={(e) => setNewMachine({ ...newMachine, site: e.target.value })}
                  placeholder="e.g. Marina Tower"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md cursor-pointer">Register Machine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Machines;