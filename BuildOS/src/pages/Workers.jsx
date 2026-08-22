import React, { useState, useMemo } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';
import { useAuth } from '../context/useAuth';
import {
  WorkersHeader,
  WorkersFilterBar,
  WorkersGrid,
  AddWorkerModal,
  WorkerProfileModal,
  DeleteWorkerModal
} from '../components/Workers';

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

  const handleResetFilters = () => {
    setTradeFilter('All');
    if (outletContext.setSearchTerm) outletContext.setSearchTerm('');
  };

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
      <WorkersHeader
        totalWorkersCount={allWorkersList.length}
        onAddWorkerClick={() => setShowAddModal(true)}
      />

      {/* Filter Trade Bar */}
      <div className="glass-card p-4 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <WorkersFilterBar
          filteredCount={filteredWorkers.length}
          totalCount={allWorkersList.length}
          tradeFilter={tradeFilter}
          onTradeFilterChange={setTradeFilter}
          searchTerm={searchTerm}
          onResetFilters={handleResetFilters}
        />
        {/* Custom Trade Stats Dropdown Options rendered inside WorkersFilterBar styling */}
      </div>

      {/* Workers Roster Grid */}
      <WorkersGrid
        workers={filteredWorkers}
        onAcceptRegistration={(wId) => {
          acceptWorkerRegistration(wId);
          setToastMessage(`Worker accepted successfully!`);
          setTimeout(() => setToastMessage(''), 3000);
        }}
        onRejectRegistration={(wId) => {
          rejectWorkerRegistration(wId);
          setToastMessage(`Registration declined.`);
          setTimeout(() => setToastMessage(''), 3000);
        }}
        onRemoveClick={(w) => setWorkerToDelete(w)}
        onViewProfileClick={(w) => setSelectedWorkerProfile(w)}
        onResetFilters={handleResetFilters}
        onAddWorkerClick={() => setShowAddModal(true)}
      />

      {/* Modals */}
      <AddWorkerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newWorkerForm={newWorkerForm}
        setNewWorkerForm={setNewWorkerForm}
        projects={projects}
        onSubmit={handleAddWorkerSubmit}
      />

      <WorkerProfileModal
        isOpen={Boolean(selectedWorkerProfile)}
        onClose={() => setSelectedWorkerProfile(null)}
        selectedWorkerProfile={selectedWorkerProfile}
        onRemoveClick={(w) => {
          setSelectedWorkerProfile(null);
          setWorkerToDelete(w);
        }}
      />

      <DeleteWorkerModal
        isOpen={Boolean(workerToDelete)}
        onClose={() => setWorkerToDelete(null)}
        workerToDelete={workerToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default Workers;