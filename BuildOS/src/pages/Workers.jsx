import React, { useState, useMemo } from 'react';
import { Card, Badge } from '../components/ui';
import { 
  FiUsers, FiPlus, FiPhone, FiFilter, FiX, FiCheckCircle, FiUserCheck, FiMapPin, FiCalendar, FiTrash2, FiAlertCircle
} from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';
import { useAuth } from '../context/useAuth';

function Workers() {
  const { workers, addWorker, deleteWorker, acceptWorkerRegistration, rejectWorkerRegistration, projects } = useData();
  const { deleteWorkerAccount } = useAuth();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [tradeFilter, setTradeFilter] = useState('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({ name: '', trade: '', site: '', phone: '' });
  const [selectedWorkerProfile, setSelectedWorkerProfile] = useState(null);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [deletedWorkerIds, setDeletedWorkerIds] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddWorkerSubmit = (e) => {
    e.preventDefault();
    if (!newWorkerForm.name.trim()) return;

    addWorker({
      name: newWorkerForm.name.trim(),
      trade: newWorkerForm.trade.trim() || 'General Site Specialist',
      site: newWorkerForm.site.trim() || 'Not Assigned Yet',
      phone: newWorkerForm.phone.trim() || '+91 98765 00000',
      status: 'Off Duty',
      attendance: 'Absent',
      approvalStatus: 'Approved'
    });

    setToastMessage(`Worker '${newWorkerForm.name}' added successfully!`);
    setShowAddModal(false);
    setNewWorkerForm({ name: '', trade: '', site: '', phone: '' });
    setTimeout(() => setToastMessage(''), 4000);
  };

  const allWorkersList = useMemo(() => {
    const nameToProjectMap = {};
    (projects || []).forEach(p => {
      if (!p.name) return;
      if (p.manager) {
        nameToProjectMap[p.manager.trim().toLowerCase()] = p.name;
      }
      if (p.teamMembers && Array.isArray(p.teamMembers)) {
        p.teamMembers.forEach(m => {
          if (m.name) {
            nameToProjectMap[m.name.trim().toLowerCase()] = p.name;
          }
        });
      }
    });

    const filtered = (workers || []).filter(w => !deletedWorkerIds.includes(w.id) && !deletedWorkerIds.includes(w.name?.toLowerCase()));

    return filtered.map(w => {
      const assignedProjName = nameToProjectMap[w.name?.trim().toLowerCase()];
      if (assignedProjName) {
        return { ...w, site: assignedProjName };
      }
      return w;
    });
  }, [workers, projects, deletedWorkerIds]);

  // Dynamically derive trade stats with worker counts for the sleek dropdown filter
  const tradeStats = useMemo(() => {
    const counts = {};
    allWorkersList.forEach(w => {
      if (w.trade && w.trade.trim()) {
        const tr = w.trade.trim();
        counts[tr] = (counts[tr] || 0) + 1;
      }
    });
    return counts;
  }, [allWorkersList]);

  // Delete Handler for Worker
  const handleConfirmDelete = (w) => {
    if (!w) return;
    deleteWorker(w.id);
    deleteWorker(w.name);
    if (w.email) deleteWorker(w.email);
    if (deleteWorkerAccount) {
      deleteWorkerAccount(w.id);
      deleteWorkerAccount(w.name);
      if (w.email) deleteWorkerAccount(w.email);
    }
    setDeletedWorkerIds(prev => [...prev, w.id, w.name?.toLowerCase()]);
    setWorkerToDelete(null);
    if (selectedWorkerProfile?.id === w.id) {
      setSelectedWorkerProfile(null);
    }
    setToastMessage(`Worker '${w.name}' permanently deleted from the entire system!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredWorkers = allWorkersList.filter(w => {
    const matchesSearch = w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.site?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.trade?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'All' || 
                         w.trade?.toLowerCase() === tradeFilter.toLowerCase() ||
                         w.trade?.toLowerCase().includes(tradeFilter.toLowerCase());
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
            Total {allWorkersList.length} registered site personnel • 96% active attendance today
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

      {/* Filter Trade Bar - Sleek Glassmorphism Select Dropdown */}
      <div className="glass-card p-4 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Showing Workers count & Reset button */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-500">
            Showing <strong className="text-[#7C3AED] font-extrabold">{filteredWorkers.length}</strong> of {allWorkersList.length} workers
          </span>

          {(tradeFilter !== 'All' || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setTradeFilter('All');
                if (outletContext.setSearchTerm) outletContext.setSearchTerm('');
              }}
              className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <FiX className="text-xs" /> Reset Filters
            </button>
          )}
        </div>

        {/* Right Side: Filter Trade Dropdown */}
        <div className="flex items-center gap-3 flex-wrap self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center text-sm font-extrabold">
              <FiFilter />
            </div>
            <span className="text-xs font-extrabold text-[#03020A]">Filter Trade:</span>
          </div>

          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="bg-white/90 border border-purple-100 text-xs font-bold text-[#03020A] rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm cursor-pointer hover:border-purple-200 transition-all min-w-[200px]"
          >
            <option value="All">All Trades ({allWorkersList.length} Personnel)</option>
            {Object.entries(tradeStats).map(([tradeName, count]) => (
              <option key={tradeName} value={tradeName}>
                {tradeName} ({count} Worker{count !== 1 ? 's' : ''})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workers Roster Grid */}
      {filteredWorkers.length > 0 ? (
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
              <div>
                {w.approvalStatus === 'Pending Approval' ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                    Pending Approval
                  </span>
                ) : (
                  <Badge variant={w.status === 'On Duty' ? 'completed' : 'pending'}>
                    {w.status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Pending Approval Admin Action Bar */}
            {w.approvalStatus === 'Pending Approval' && (
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-amber-800">New Worker Request:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      rejectWorkerRegistration(w.id);
                      setToastMessage(`Registration declined for '${w.name}'.`);
                      setTimeout(() => setToastMessage(''), 3000);
                    }}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      acceptWorkerRegistration(w.id);
                      setToastMessage(`Worker '${w.name}' accepted successfully!`);
                      setTimeout(() => setToastMessage(''), 3000);
                    }}
                    className="dark-nav-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-xs hover:bg-black cursor-pointer flex items-center gap-1"
                  >
                    <FiCheckCircle className="text-[#BEF264]" /> Accept
                  </button>
                </div>
              </div>
            )}

            {/* Middle Info Box */}
            <div className="bg-white/80 rounded-2xl p-3 border border-white space-y-2 text-xs font-medium text-slate-600">
              {(w.cancellationNotice || w.statusNote?.includes('cancelled')) && (!w.site || w.site === 'Not Assigned Yet' || w.site === 'Unassigned' || w.site === 'Cancelled by Admin') && (
                <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
                  <FiAlertCircle className="text-rose-500 shrink-0 text-xs" />
                  <span>your assigned project was cancelled by admin</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Assigned Site:</span>
                {(!w.site || w.site === 'Not Assigned Yet' || w.site === 'Unassigned') ? (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Not Assigned Yet
                  </span>
                ) : (
                  <span className="font-bold text-[#03020A]">{w.site}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Attendance:</span>
                <span className={`font-extrabold px-2.5 py-0.5 rounded-full text-[11px] ${
                  (w.attendance === 'Present' || w.status === 'On Duty') 
                    ? 'text-[#3F6212] bg-[#F0FDC2] border border-[#BEF264]' 
                    : 'text-rose-700 bg-rose-100 border border-rose-200'
                }`}>
                  { (w.attendance === 'Present' || w.attendance === 'Absent') ? w.attendance : (w.status === 'On Duty' ? 'Present' : 'Absent') }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Contact Info:</span>
                <span className="font-bold text-[#03020A]">{w.phone || 'Not Provided'}</span>
              </div>
            </div>

            {/* Bottom Bar with Remove Worker & View Profile */}
            <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
              <button 
                type="button" 
                onClick={() => setWorkerToDelete(w)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                title="Remove Worker"
              >
                <FiTrash2 className="text-xs" /> Remove
              </button>

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
      ) : (
        <div className="glass-card p-8 rounded-[28px] text-center space-y-3 border border-white">
          <FiUsers className="text-3xl text-purple-400 mx-auto" />
          <h3 className="text-sm font-bold text-[#03020A]">No Workers Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No worker records matched your search query or trade filter. Try clearing your filters or adding a new worker to the directory.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setTradeFilter('All');
                if (outletContext.setSearchTerm) outletContext.setSearchTerm('');
              }}
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-purple-100 text-[#7C3AED] hover:bg-purple-200 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="dark-nav-pill px-5 py-2 rounded-full text-xs font-extrabold text-white cursor-pointer"
            >
              + Add New Worker
            </button>
          </div>
        </div>
      )}

      {/* REGISTER NEW WORKER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
                  <FiUsers />
                </div>
                <h3 className="text-base font-extrabold text-[#03020A]">Register New Site Worker</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddWorkerSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newWorkerForm.name}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, name: e.target.value })}
                  placeholder="e.g. Annamalai"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trade Specialization / Role</label>
                <input
                  type="text"
                  value={newWorkerForm.trade}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, trade: e.target.value })}
                  placeholder="e.g. Site Supervisor / Structural Lead"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Construction Site</label>
                <select
                  value={newWorkerForm.site}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, site: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                >
                  <option value="Not Assigned Yet">Not Assigned Yet</option>
                  {(projects || []).filter(p => p.status !== 'Cancelled').map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone / Contact Number</label>
                <input
                  type="text"
                  value={newWorkerForm.phone}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, phone: e.target.value })}
                  placeholder="e.g. 9198564253"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dark-nav-pill px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
                >
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <p className="font-extrabold text-[#03020A] text-sm">
                    {(!selectedWorkerProfile.site || selectedWorkerProfile.site === 'Not Assigned Yet' || selectedWorkerProfile.site === 'Unassigned') ? 'Not Assigned Yet' : selectedWorkerProfile.site}
                  </p>
                </div>

                <div className="bg-white/80 p-3.5 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FiUserCheck className="text-[#7C3AED]" /> Attendance Status
                  </span>
                  <p className={`font-extrabold text-sm ${
                    (selectedWorkerProfile.attendance === 'Present' || selectedWorkerProfile.status === 'On Duty')
                      ? 'text-[#3F6212]'
                      : 'text-rose-600'
                  }`}>
                    { (selectedWorkerProfile.attendance === 'Present' || selectedWorkerProfile.attendance === 'Absent')
                        ? selectedWorkerProfile.attendance
                        : (selectedWorkerProfile.status === 'On Duty' ? 'Present' : 'Absent') }
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Contact Info:</span>
                  <span className="font-extrabold text-[#03020A] text-sm">{selectedWorkerProfile.phone || 'Not Provided'}</span>
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
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const targetWorker = selectedWorkerProfile;
                  setSelectedWorkerProfile(null);
                  setWorkerToDelete(targetWorker);
                }}
                className="px-4 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiTrash2 className="text-xs" /> Remove Worker
              </button>

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

      {/* CONFIRMATION POP-UP ALERT FOR PERMANENTLY REMOVING WORKER */}
      {workerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-inner border border-rose-200">
              <FiTrash2 />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#03020A]">Permanently Delete Worker?</h3>
              <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="text-rose-600 font-extrabold">{workerToDelete.name}</strong> ({workerToDelete.trade})?
              </p>
              <p className="text-[11px] font-medium text-slate-500 mt-2 bg-rose-50 border border-rose-100 p-3 rounded-2xl text-rose-700">
                ⚠️ Once deleted, this worker will be completely removed from all project sites, team rosters, and workforce records across the application.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setWorkerToDelete(null)}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(workerToDelete)}
                className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiTrash2 className="text-xs" /> Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workers;