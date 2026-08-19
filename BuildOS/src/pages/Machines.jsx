import React, { useState, useMemo } from 'react';
import { Card, Badge, ProgressBar } from '../components/ui';
import { 
  FiTruck, 
  FiPlus, 
  FiCpu, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiDroplet, 
  FiTool, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiX, 
  FiUser, 
  FiMapPin 
} from 'react-icons/fi';
import { FaTruckRampBox } from 'react-icons/fa6';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Machines() {
  const { machines, projects, workers, addMachine, updateMachine, deleteMachine } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';

  // Filter state
  const [statusFilter, setStatusFilter] = useState('All');

  // Register Modal State
  const [showModal, setShowModal] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: '',
    category: 'Heavy Equipment',
    site: '',
    operator: 'Unassigned',
    customSite: '',
    customOperator: ''
  });

  // Edit Telemetry Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    category: '',
    site: '',
    operator: '',
    customSite: '',
    customOperator: '',
    status: 'Operational',
    healthPct: 100,
    fuelLevel: '100%',
    fuelNum: 100,
    hoursUsed: '0 hrs'
  });

  // Delete / Decommission Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMachine, setDeletingMachine] = useState(null);

  // Extract unique active project names & worker names for select dropdowns
  const projectOptions = useMemo(() => {
    const names = (projects || []).map(p => p.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [projects]);

  const workerOptions = useMemo(() => {
    const names = (workers || []).map(w => w.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [workers]);

  // Handle Add Machine
  const handleAddMachine = (e) => {
    e.preventDefault();
    if (!newMachine.name.trim()) return;

    const finalSite = newMachine.site === 'OTHER' ? newMachine.customSite.trim() : (newMachine.site || projectOptions[0] || 'Marina Tower');
    const finalOperator = newMachine.operator === 'OTHER' ? newMachine.customOperator.trim() : (newMachine.operator || 'Unassigned');

    addMachine({
      name: newMachine.name.trim(),
      category: newMachine.category.trim() || 'Heavy Equipment',
      site: finalSite || 'Marina Tower',
      operator: finalOperator || 'Unassigned'
    });

    setNewMachine({ name: '', category: 'Heavy Equipment', site: '', operator: 'Unassigned', customSite: '', customOperator: '' });
    setShowModal(false);
  };

  // Open Edit Modal
  const handleOpenEditModal = (m) => {
    setEditingMachine(m);

    // Extract numeric fuel level if available (e.g., "85%" -> 85)
    let fuelVal = 100;
    if (typeof m.fuelLevel === 'string') {
      const parsed = parseInt(m.fuelLevel.replace(/\D/g, ''), 10);
      if (!isNaN(parsed)) fuelVal = parsed;
    } else if (typeof m.fuelLevel === 'number') {
      fuelVal = m.fuelLevel;
    }

    const siteMatch = projectOptions.includes(m.site);
    const operatorMatch = workerOptions.includes(m.operator);

    setEditForm({
      id: m.id,
      name: m.name || '',
      category: m.category || 'Heavy Equipment',
      site: siteMatch ? m.site : (m.site ? 'OTHER' : ''),
      operator: operatorMatch ? m.operator : (m.operator ? 'OTHER' : 'Unassigned'),
      customSite: siteMatch ? '' : (m.site || ''),
      customOperator: operatorMatch ? '' : (m.operator || ''),
      status: m.status || 'Operational',
      healthPct: m.healthPct !== undefined ? m.healthPct : 100,
      fuelLevel: `${fuelVal}%`,
      fuelNum: fuelVal,
      hoursUsed: m.hoursUsed || '0 hrs'
    });
    setShowEditModal(true);
  };

  // Submit Edit Telemetry Form
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    const finalSite = editForm.site === 'OTHER' ? editForm.customSite.trim() : (editForm.site || 'Marina Tower');
    const finalOperator = editForm.operator === 'OTHER' ? editForm.customOperator.trim() : (editForm.operator || 'Unassigned');

    updateMachine(editForm.id, {
      name: editForm.name.trim(),
      category: editForm.category.trim() || 'Heavy Equipment',
      site: finalSite || 'Marina Tower',
      operator: finalOperator || 'Unassigned',
      status: editForm.status || 'Operational',
      healthPct: Number(editForm.healthPct),
      fuelLevel: `${editForm.fuelNum}%`,
      hoursUsed: editForm.hoursUsed.trim() || '0 hrs'
    });

    setShowEditModal(false);
    setEditingMachine(null);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (m) => {
    setDeletingMachine(m);
    setShowDeleteModal(true);
  };

  // Confirm Delete / Decommission
  const handleConfirmDelete = () => {
    if (!deletingMachine) return;
    deleteMachine(deletingMachine.id);
    setShowDeleteModal(false);
    setDeletingMachine(null);
  };

  // Quick Action: Refill Fuel
  const handleQuickRefill = (m) => {
    updateMachine(m.id, {
      fuelLevel: '100%'
    });
  };

  // Quick Action: Service Complete
  const handleQuickService = (m) => {
    updateMachine(m.id, {
      healthPct: 100,
      status: 'Operational'
    });
  };

  // Filter machines based on search & status filter
  const filtered = machines.filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.site || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (m.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (m.operator || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-[#03020A] space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiTruck className="text-[#7C3AED]" />
            Heavy Equipment & Fleet Telemetry
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {machines.length} total machinery units • {machines.filter(x => x.status === 'Operational').length} active on job sites • {machines.filter(x => x.status === 'Maintenance Due').length} maintenance alert(s)
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

      {/* Filter Status Pills Bar */}
      <div className="glass-card p-4 rounded-[28px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <FiFilter className="text-purple-500" /> Filter Status:
          </span>
          {['All', 'Operational', 'Maintenance Due', 'Standby'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
        {filtered.map((m) => {
          const isOperational = m.status === 'Operational';
          const isMaintenance = m.status === 'Maintenance Due';

          return (
            <Card key={m.id} hover={true} className="space-y-4 relative group">
              {/* Card Header & Actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#03020A] text-[#BEF264] flex items-center justify-center text-xl shadow-md shrink-0">
                    <FaTruckRampBox />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#03020A]">{m.name}</h3>
                    <p className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
                      <FiCpu /> {m.category} • <FiMapPin className="inline text-slate-400" /> Site: {m.site}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={isOperational ? 'completed' : isMaintenance ? 'pending' : 'purple'}>
                    {m.status}
                  </Badge>

                  {/* Action Buttons: Edit & Decommission */}
                  <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
                    <button
                      type="button"
                      title="Edit Telemetry"
                      onClick={() => handleOpenEditModal(m)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#7C3AED] hover:bg-white transition-all cursor-pointer"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      type="button"
                      title="Decommission Equipment"
                      onClick={() => handleOpenDeleteModal(m)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 bg-white/80 rounded-2xl p-3.5 border border-white text-center">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Assigned Operator</p>
                  <p className="text-xs font-bold text-[#03020A] mt-0.5 truncate flex items-center justify-center gap-1">
                    <FiUser className="text-purple-500 shrink-0" /> {m.operator || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Fuel Level</p>
                  <p className="text-xs font-bold text-purple-700 mt-0.5">{m.fuelLevel || '100%'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Run Time</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{m.hoursUsed || '0 hrs'}</p>
                </div>
              </div>

              {/* Equipment Health Rating Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#03020A]">
                  <span>Equipment Health Rating</span>
                  <span className={m.healthPct > 80 ? 'text-emerald-600' : m.healthPct > 50 ? 'text-amber-600' : 'text-red-600'}>
                    {m.healthPct}%
                  </span>
                </div>
                <ProgressBar progress={m.healthPct} variant={m.healthPct > 80 ? 'lime' : 'purple'} size="sm" />
              </div>

              {/* Quick Telemetry Shortcut Buttons */}
              <div className="pt-2 border-t border-purple-50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickRefill(m)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FiDroplet className="text-purple-600" /> Refill Fuel (100%)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickService(m)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FiTool className="text-emerald-600" /> Complete Service
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* REGISTER MACHINE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#03020A]">Register Heavy Machinery</h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Equipment Model & Name *</label>
                <input
                  type="text"
                  required
                  value={newMachine.name}
                  onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                  placeholder="e.g. Caterpillar 320 Hydraulic Excavator"
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

              {/* Assigned Job Site (Live Select from Projects) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Job Site</label>
                <select
                  value={newMachine.site}
                  onChange={(e) => setNewMachine({ ...newMachine, site: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                >
                  <option value="">Select Project Site...</option>
                  {projectOptions.map(pName => (
                    <option key={pName} value={pName}>{pName}</option>
                  ))}
                  <option value="OTHER">+ Other Job Site...</option>
                </select>

                {newMachine.site === 'OTHER' && (
                  <input
                    type="text"
                    required
                    value={newMachine.customSite}
                    onChange={(e) => setNewMachine({ ...newMachine, customSite: e.target.value })}
                    placeholder="Enter site name..."
                    className="w-full mt-2 bg-white border border-purple-100 rounded-2xl px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                  />
                )}
              </div>

              {/* Assigned Operator (Live Select from Workers) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Operator</label>
                <select
                  value={newMachine.operator}
                  onChange={(e) => setNewMachine({ ...newMachine, operator: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                >
                  <option value="Unassigned">Unassigned</option>
                  {workerOptions.map(wName => (
                    <option key={wName} value={wName}>{wName}</option>
                  ))}
                  <option value="OTHER">+ Other Operator Name...</option>
                </select>

                {newMachine.operator === 'OTHER' && (
                  <input
                    type="text"
                    required
                    value={newMachine.customOperator}
                    onChange={(e) => setNewMachine({ ...newMachine, customOperator: e.target.value })}
                    placeholder="Enter operator name..."
                    className="w-full mt-2 bg-white border border-purple-100 rounded-2xl px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                  />
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md hover:bg-purple-800 cursor-pointer"
                >
                  Register Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TELEMETRY MODAL */}
      {showEditModal && editingMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 rounded-[32px] border border-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#03020A] flex items-center gap-2">
                  <FiEdit2 className="text-[#7C3AED]" /> Edit Equipment Telemetry
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Update live telemetry metrics, operator, and site assignments.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEditModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Equipment Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance Due">Maintenance Due</option>
                    <option value="Standby">Standby</option>
                  </select>
                </div>

                {/* Total Run Time */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Run Time Hours</label>
                  <input
                    type="text"
                    value={editForm.hoursUsed}
                    onChange={(e) => setEditForm({ ...editForm, hoursUsed: e.target.value })}
                    placeholder="e.g. 1,240 hrs"
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Site Select */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Job Site</label>
                  <select
                    value={editForm.site}
                    onChange={(e) => setEditForm({ ...editForm, site: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                  >
                    {projectOptions.map(pName => (
                      <option key={pName} value={pName}>{pName}</option>
                    ))}
                    <option value="OTHER">+ Other Job Site...</option>
                  </select>

                  {editForm.site === 'OTHER' && (
                    <input
                      type="text"
                      required
                      value={editForm.customSite}
                      onChange={(e) => setEditForm({ ...editForm, customSite: e.target.value })}
                      placeholder="Enter site name..."
                      className="w-full mt-2 bg-white border border-purple-100 rounded-2xl px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                    />
                  )}
                </div>

                {/* Operator Select */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Operator</label>
                  <select
                    value={editForm.operator}
                    onChange={(e) => setEditForm({ ...editForm, operator: e.target.value })}
                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none cursor-pointer"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {workerOptions.map(wName => (
                      <option key={wName} value={wName}>{wName}</option>
                    ))}
                    <option value="OTHER">+ Other Operator Name...</option>
                  </select>

                  {editForm.operator === 'OTHER' && (
                    <input
                      type="text"
                      required
                      value={editForm.customOperator}
                      onChange={(e) => setEditForm({ ...editForm, customOperator: e.target.value })}
                      placeholder="Enter operator name..."
                      className="w-full mt-2 bg-white border border-purple-100 rounded-2xl px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#A78BFA] outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Fuel Level & Health Sliders */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Fuel Level Percentage</span>
                    <span className="text-purple-700">{editForm.fuelNum}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editForm.fuelNum}
                    onChange={(e) => setEditForm({ ...editForm, fuelNum: Number(e.target.value) })}
                    className="w-full accent-[#7C3AED] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Equipment Health Rating</span>
                    <span className={editForm.healthPct > 80 ? 'text-emerald-600' : editForm.healthPct > 50 ? 'text-amber-600' : 'text-red-600'}>
                      {editForm.healthPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editForm.healthPct}
                    onChange={(e) => setEditForm({ ...editForm, healthPct: Number(e.target.value) })}
                    className="w-full accent-[#7C3AED] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)} 
                  className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white shadow-md hover:bg-purple-800 cursor-pointer"
                >
                  Save Telemetry Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DECOMMISSION / DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 border-b border-red-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-xl shrink-0">
                <FiAlertTriangle />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#03020A]">Decommission Machinery</h3>
                <p className="text-xs font-semibold text-slate-500">Confirm equipment removal from active fleet</p>
              </div>
            </div>

            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-2 text-xs">
              <p className="font-bold text-slate-800">
                Are you sure you want to decommission <strong className="text-red-700">{deletingMachine.name}</strong>?
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 font-semibold">
                <li>Job Site: <strong>{deletingMachine.site}</strong></li>
                <li>Assigned Operator: <strong>{deletingMachine.operator}</strong></li>
                <li>Status: <strong>{deletingMachine.status}</strong></li>
              </ul>
              <p className="text-[11px] text-slate-500 pt-1">
                This action will purge this equipment unit from active fleet tracking and log a permanent decommission activity trace.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <FiTrash2 /> Confirm Decommission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Machines;