import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { 
  FiUsers,FiPlus,FiPhone,FiFilter,FiX,FiCheckCircle,FiUserCheck,FiMapPin,FiCalendar} from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Workers() {
  const { workers, addWorker } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [tradeFilter, setTradeFilter] = useState('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWorkerProfile, setSelectedWorkerProfile] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form states for New Worker
  const [newWorker, setNewWorker] = useState({ name: '', trade: '', site: '', phone: '' });

  // Ensure Mathan and key site workers are in list
  const defaultExtraWorkers = [
    { id: 901, name: "Mathan", trade: "Site Engineer", site: "Hyper Mall", status: "On Duty", attendance: "100%", phone: "896054050" }
  ];

  const allWorkersList = [...workers];
  if (!allWorkersList.some(w => w.name.toLowerCase() === 'mathan')) {
    allWorkersList.unshift(defaultExtraWorkers[0]);
  }

  // Submit Handler for New Worker
  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name) return;

    addWorker(newWorker);
    setNewWorker({ name: '', trade: '', site: '', phone: '' });
    setShowAddModal(false);
    setToastMessage(`Worker '${newWorker.name}' registered successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredWorkers = allWorkersList.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'All' || w.trade.includes(tradeFilter);
    return matchesSearch && matchesTrade;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#03020A] text-white border border-[#BEF264] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <FiCheckCircle className="text-[#BEF264] text-lg shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiUsers className="text-[#7C3AED]" />
            Site Workforce Directory
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-[#BEF264] text-base" />
          <span>Add New Worker</span>
        </button>
      </div>

      {/* Filter Pills Bar */}
      <div className="glass-card p-4 rounded-[28px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <FiFilter className="text-purple-500" /> Filter Trade:
          </span>
          {['All', 'Site Engineer', 'Masonry', 'Steel', 'Crane', 'Electrical'].map((tr) => (
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
        {filteredWorkers.map((w) => (
          <Card key={w.id} hover={true} className="space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E9D5FF] via-[#C4B5FD] to-[#F0FDC2] flex items-center justify-center font-extrabold text-[#6B21A8] text-lg border-2 border-white shadow-sm shrink-0">
                  {w.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#03020A]">{w.name}</h3>
                  <p className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-0.5">
                    <FaHelmet className="text-xs" />
                    {w.trade}
                  </p>
                </div>
              </div>
              <Badge variant={w.status === 'On Duty' ? 'completed' : 'pending'}>
                {w.status}
              </Badge>
            </div>

            {/* Middle Info Box with Contact Info replacing Safety Badge */}
            <div className="bg-white/80 rounded-2xl p-3 border border-white space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Assigned Site:</span>
                <span className="font-bold text-[#03020A]">{w.site}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Rate:</span>
                <span className="font-bold text-[#3F6212] bg-[#F0FDC2] px-2 py-0.5 rounded-full">{w.attendance || '100%'}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Info:</span>
                <span className="font-bold text-[#03020A]">{w.phone || '896054050'}</span>
              </div>
            </div>

            {/* Bottom Bar with View Profile */}
            <div className="pt-2 border-t border-purple-100 flex items-center justify-end text-xs">
              <button 
                type="button" 
                onClick={() => setSelectedWorkerProfile(w)}
                className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
              >
                View Profile
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* VIEW WORKER PROFILE DETAILS MODAL */}
      {selectedWorkerProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg p-6 rounded-[32px] border border-white shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#BEF264] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  {selectedWorkerProfile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-[#03020A]">{selectedWorkerProfile.name}</h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]">
                      {selectedWorkerProfile.status || 'On Duty'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-0.5">
                    <FaHelmet className="text-xs" />
                    {selectedWorkerProfile.trade}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorkerProfile(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            {/* Profile Information Grid */}
            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 p-3.5 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FiMapPin className="text-[#7C3AED]" /> Assigned Site
                  </span>
                  <p className="font-extrabold text-[#03020A] text-sm">{selectedWorkerProfile.site}</p>
                </div>

                <div className="bg-white/80 p-3.5 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FiUserCheck className="text-[#7C3AED]" /> Attendance Rate
                  </span>
                  <p className="font-extrabold text-[#3F6212] text-sm">{selectedWorkerProfile.attendance || '100%'}</p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Contact Info:</span>
                  <span className="font-extrabold text-[#03020A] text-sm">{selectedWorkerProfile.phone || '896054050'}</span>
                </div>

                <div className="flex justify-between items-center pt-1 pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Shift Schedule:</span>
                  <span className="font-bold text-slate-800">08:00 AM – 05:00 PM (General Shift)</span>
                </div>

                <div className="flex justify-between items-center pt-1 pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Authorized Supervisor:</span>
                  <span className="font-bold text-[#7C3AED]">Rajesh Kumar (Lead Site Director)</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-bold">Emergency Phone:</span>
                  <span className="font-bold text-slate-800">+91 98765 99999</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedWorkerProfile(null)}
                className="dark-nav-pill px-6 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW WORKER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#03020A]">Register New Worker</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 cursor-pointer">✕</button>
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

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer">Cancel</button>
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