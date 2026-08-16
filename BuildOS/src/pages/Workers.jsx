import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { 
  FiUsers, 
  FiPlus, 
  FiShield, 
  FiPhone, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiX,
  FiCheckCircle,
  FiSave
} from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Workers() {
  const { workers, addWorker, updateWorker, deleteWorker } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [tradeFilter, setTradeFilter] = useState('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form states for New Worker
  const [newWorker, setNewWorker] = useState({ name: '', trade: '', site: '', phone: '' });

  // Form state for Editing Worker
  const [editForm, setEditForm] = useState({
    name: '',
    trade: '',
    site: '',
    status: 'On Duty',
    attendance: '100%',
    safetyRating: 'A+ Gold',
    phone: ''
  });

  // Ensure Mathan and key site workers are in list
  const defaultExtraWorkers = [
    { id: 901, name: "Mathan", trade: "Site Engineer", site: "Hyper Mall", status: "On Duty", attendance: "100%", safetyRating: "A+ Gold", phone: "+91 98765 00000" }
  ];

  const allWorkersList = [...workers];
  if (!allWorkersList.some(w => w.name.toLowerCase() === 'mathan')) {
    allWorkersList.unshift(defaultExtraWorkers[0]);
  }

  // Open Edit Modal with worker data
  const handleOpenEditModal = (worker) => {
    setEditingWorker(worker);
    setEditForm({
      name: worker.name || '',
      trade: worker.trade || '',
      site: worker.site || '',
      status: worker.status || 'On Duty',
      attendance: worker.attendance || '100%',
      safetyRating: worker.safetyRating || 'A+ Gold',
      phone: worker.phone || '+91 98765 00000'
    });
  };

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

  // Submit Handler for Updating Worker
  const handleSaveEditWorker = (e) => {
    e.preventDefault();
    if (!editingWorker || !editForm.name) return;

    updateWorker(editingWorker.id, editForm);
    setEditingWorker(null);
    setToastMessage(`Worker '${editForm.name}' details updated successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handler for Deleting Worker
  const handleDeleteWorker = (workerId, workerName) => {
    if (window.confirm(`Are you sure you want to remove worker '${workerName}' from the roster?`)) {
      deleteWorker(workerId);
      setEditingWorker(null);
      setToastMessage(`Worker '${workerName}' removed from roster.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
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
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Total {allWorkersList.length + 120} registered site personnel • Manage & Edit Worker Profiles
          </p>
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#03020A]">{w.name}</h3>
                    {/* EDIT BUTTON NEXT TO WORKER NAME */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(w)}
                      title={`Edit ${w.name}'s details`}
                      className="p-1 rounded-lg bg-purple-100 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all cursor-pointer"
                    >
                      <FiEdit2 className="text-xs" />
                    </button>
                  </div>
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
                <span>Safety Badge:</span>
                <span className="font-bold text-purple-700 flex items-center gap-1">
                  <FiShield className="text-xs" /> {w.safetyRating || 'A+ Gold'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-semibold">
                <FiPhone className="text-purple-500" /> {w.phone || '+91 98765 00000'}
              </span>
              
              {/* EDIT DETAILS BUTTON AT BOTTOM OF CARD */}
              <button 
                type="button" 
                onClick={() => handleOpenEditModal(w)}
                className="dark-nav-pill px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm hover:bg-black transition-all cursor-pointer"
              >
                <FiEdit2 className="text-[#BEF264] text-xs" />
                <span>Edit Details</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* EDIT WORKER DETAILS MODAL */}
      {editingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg p-6 rounded-[32px] border border-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#C4B5FD] flex items-center justify-center text-white text-lg shadow-md">
                  <FiEdit2 />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#03020A]">Edit Worker Details</h3>
                  <p className="text-xs text-purple-600 font-bold">Modifying record for {editingWorker.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingWorker(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveEditWorker} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Trade Specialization / Role</label>
                  <input
                    type="text"
                    required
                    value={editForm.trade}
                    onChange={(e) => setEditForm({ ...editForm, trade: e.target.value })}
                    placeholder="e.g. Site Engineer, Masonry"
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Construction Site</label>
                  <input
                    type="text"
                    required
                    value={editForm.site}
                    onChange={(e) => setEditForm({ ...editForm, site: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duty Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Attendance Rate</label>
                  <input
                    type="text"
                    value={editForm.attendance}
                    onChange={(e) => setEditForm({ ...editForm, attendance: e.target.value })}
                    placeholder="100%"
                    className="w-full bg-white border border-purple-100 rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Safety Rating</label>
                  <select
                    value={editForm.safetyRating}
                    onChange={(e) => setEditForm({ ...editForm, safetyRating: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option value="A+ Gold">A+ Gold</option>
                    <option value="A Silver">A Silver</option>
                    <option value="A+ Platinum">A+ Platinum</option>
                    <option value="B Standard">B Standard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteWorker(editingWorker.id, editingWorker.name)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <FiTrash2 className="text-xs" />
                  <span>Remove Worker</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingWorker(null)}
                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="dark-nav-pill px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FiSave className="text-[#BEF264]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
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