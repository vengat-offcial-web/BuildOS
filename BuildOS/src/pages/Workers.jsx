import React, { useState } from 'react';
import { Card, Badge } from '../components/ui';
import { 
  FiUsers, 
  FiPlus, 
  FiShield, 
  FiPhone, 
  FiFilter, 
  FiMessageSquare, 
  FiSend, 
  FiBookmark, 
  FiTrash2, 
  FiAlertCircle, 
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';

function Workers() {
  const { workers, addWorker, workerNotes, addWorkerNote, deleteWorkerNote, togglePinNote } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const [tradeFilter, setTradeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [newWorker, setNewWorker] = useState({ name: '', trade: '', site: '', phone: '' });
  const [chatNoteText, setChatNoteText] = useState('');
  const [chatCategory, setChatCategory] = useState('Site Instruction');
  const [isUrgentNote, setIsUrgentNote] = useState(false);

  // Ensure Mathan and initial key site workers are present in display
  const defaultExtraWorkers = [
    { id: 901, name: "Mathan", trade: "Site Engineer", site: "Hyper Mall", status: "On Duty", attendance: "100%", safetyRating: "A+ Gold", phone: "+91 98765 00000" }
  ];

  const allWorkersList = [...workers];
  if (!allWorkersList.some(w => w.name.toLowerCase() === 'mathan')) {
    allWorkersList.unshift(defaultExtraWorkers[0]);
  }

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name) return;

    addWorker(newWorker);
    setNewWorker({ name: '', trade: '', site: '', phone: '' });
    setShowModal(false);
    setToastMessage(`Worker '${newWorker.name}' registered successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSendChatNote = (e) => {
    e.preventDefault();
    if (!chatNoteText.trim() || !selectedWorker) return;

    addWorkerNote({
      workerName: selectedWorker.name,
      text: chatNoteText.trim(),
      category: chatCategory,
      senderRole: 'admin',
      senderName: 'Rajesh Kumar (Project Director)',
      isUrgent: isUrgentNote
    });

    setChatNoteText('');
    setIsUrgentNote(false);
    setToastMessage(`Note sent directly to ${selectedWorker.name}'s Worker Portal!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredWorkers = allWorkersList.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'All' || w.trade.includes(tradeFilter);
    return matchesSearch && matchesTrade;
  });

  // Filter notes for the open worker chat modal
  const selectedWorkerNotes = selectedWorker 
    ? workerNotes.filter(n => n.workerName?.toLowerCase() === selectedWorker.name.toLowerCase())
    : [];

  const tabFilteredNotes = selectedWorkerNotes.filter(n => {
    if (activeTab === 'Instructions') return n.category === 'Site Instruction' || n.category === 'Task Instruction';
    if (activeTab === 'Urgent') return n.isUrgent || n.isPinned;
    return true;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Toast Banner */}
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
            Site Workforce Directory & Chat Notes
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Total {allWorkersList.length + 120} registered site personnel • Direct Admin-Worker Communication Enabled
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
        {filteredWorkers.map((w) => {
          const notesCount = workerNotes.filter(n => n.workerName?.toLowerCase() === w.name.toLowerCase()).length;
          return (
            <Card key={w.id} hover={true} className="space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E9D5FF] via-[#C4B5FD] to-[#F0FDC2] flex items-center justify-center font-extrabold text-[#6B21A8] text-lg border-2 border-white shadow-sm">
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
                
                <div className="flex items-center gap-2">
                  {/* Chat & Notes Action Button */}
                  <button 
                    type="button" 
                    onClick={() => setSelectedWorker(w)}
                    className="dark-nav-pill px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm hover:bg-black transition-all cursor-pointer"
                  >
                    <FiMessageSquare className="text-[#BEF264] text-xs" />
                    <span>Chat Note</span>
                    {notesCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#BEF264] text-[#03020A] text-[9px] font-black flex items-center justify-center">
                        {notesCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* WORKER CHAT & NOTES MODAL DRAWER */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-2xl p-6 rounded-[32px] border border-white shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#BEF264] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-[#03020A]">{selectedWorker.name}</h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]">
                      {selectedWorker.status || 'On Duty'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-purple-700 flex items-center gap-2 mt-0.5">
                    <span>{selectedWorker.trade}</span> • 
                    <span>Site: <strong>{selectedWorker.site}</strong></span> • 
                    <span className="flex items-center gap-0.5"><FiShield className="text-xs" /> {selectedWorker.safetyRating || 'A+ Gold'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                {['All', 'Instructions', 'Urgent'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-white/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    {tab === 'All' ? 'All Messages & Notes' : tab}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {tabFilteredNotes.length} Note{tabFilteredNotes.length !== 1 ? 's' : ''} recorded
              </span>
            </div>

            {/* Scrollable Conversation / Notes Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px]">
              {tabFilteredNotes.length > 0 ? (
                tabFilteredNotes.map((note) => {
                  const isAdmin = note.senderRole === 'admin';
                  return (
                    <div 
                      key={note.id} 
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        note.isUrgent 
                          ? 'bg-rose-50/80 border-rose-200' 
                          : isAdmin 
                            ? 'bg-purple-50/80 border-purple-100' 
                            : 'bg-white/90 border-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            isAdmin ? 'bg-[#7C3AED] text-white' : 'bg-[#03020A] text-[#BEF264]'
                          }`}>
                            {isAdmin ? 'ADMIN / ENGINEER' : 'WORKER'}
                          </span>
                          <span className="text-xs font-extrabold text-[#03020A]">{note.senderName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {note.isUrgent && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1">
                              <FiAlertCircle /> URGENT
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-400">{note.time}</span>
                          
                          <button
                            type="button"
                            onClick={() => togglePinNote(note.id)}
                            title={note.isPinned ? 'Unpin note' : 'Pin note'}
                            className={`p-1 rounded-lg transition-all cursor-pointer ${
                              note.isPinned ? 'text-amber-500 bg-amber-100' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <FiBookmark className="text-xs" />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteWorkerNote(note.id)}
                            title="Delete note"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/60 p-2.5 rounded-xl border border-white/80">
                        {note.text}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-0.5">
                        <span className="bg-white/80 px-2 py-0.5 rounded-full border border-purple-100 text-purple-700">
                          Tag: {note.category}
                        </span>
                        <span>Synced to Worker Portal</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 space-y-2">
                  <FiMessageSquare className="text-3xl text-purple-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">No chat notes recorded yet for {selectedWorker.name}.</p>
                  <p className="text-[11px] text-slate-400">Use the input box below to send direct site instructions or supervisor notes.</p>
                </div>
              )}
            </div>

            {/* Direct Input Form for Admin */}
            <form onSubmit={handleSendChatNote} className="space-y-3 pt-3 border-t border-purple-100 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={chatCategory}
                  onChange={(e) => setChatCategory(e.target.value)}
                  className="bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  <option value="Site Instruction">Site Instruction</option>
                  <option value="Task Instruction">Task Instruction</option>
                  <option value="Supervisor Note">Supervisor Note</option>
                  <option value="Safety Briefing">Safety Briefing</option>
                </select>

                <label className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isUrgentNote}
                    onChange={(e) => setIsUrgentNote(e.target.checked)}
                    className="accent-rose-600 rounded"
                  />
                  <span>Mark Urgent</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={chatNoteText}
                  onChange={(e) => setChatNoteText(e.target.value)}
                  placeholder={`Write direct note or instruction to ${selectedWorker.name}...`}
                  className="flex-1 bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  type="submit"
                  className="dark-nav-pill px-5 py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-md hover:bg-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <FiSend className="text-[#BEF264]" />
                  <span>Send Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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