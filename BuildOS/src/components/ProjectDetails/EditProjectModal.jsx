import React from 'react';
import { FiEdit2, FiX, FiCalendar, FiClock, FiSave } from 'react-icons/fi';

export function EditProjectModal({
  isOpen,
  onClose,
  editName,
  setEditName,
  editLocation,
  setEditLocation,
  editManager,
  setEditManager,
  editBudget,
  setEditBudget,
  editStartDate,
  setEditStartDate,
  editDeadline,
  setEditDeadline,
  editWorkers,
  setEditWorkers,
  showEngineerSuggestions,
  setShowEngineerSuggestions,
  filteredEngineers,
  setEngineerSearchQuery,
  formatToISOInputDate,
  formatToHumanReadableDate,
  calcEditDurationDays,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-4xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED]">
              <FiEdit2 className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#03020A]">Edit Project Details</h3>
              <p className="text-xs font-semibold text-slate-500">Update project name, location, site engineer & metrics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="Project Name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Location</label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="Site Location"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Site Engineer / Manager</label>
            <input
              type="text"
              value={editManager}
              onChange={(e) => {
                setEditManager(e.target.value);
                setEngineerSearchQuery(e.target.value);
                setShowEngineerSuggestions(true);
              }}
              onFocus={() => {
                setEngineerSearchQuery('');
                setShowEngineerSuggestions(true);
              }}
              className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="Enter or select Site Engineer Name"
              required
            />

            {/* Autocomplete Suggestions Dropdown */}
            {showEngineerSuggestions && filteredEngineers.length > 0 && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto p-1.5 animate-in fade-in duration-150">
                <div className="text-[10px] font-extrabold text-purple-700 px-3 py-1 uppercase tracking-wider flex items-center justify-between border-b border-purple-100/60 mb-1">
                  <span>Saved Site Engineers ({filteredEngineers.length})</span>
                  <button
                    type="button"
                    onClick={() => setShowEngineerSuggestions(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                {filteredEngineers.map((eng) => (
                  <button
                    key={eng.id || eng.name}
                    type="button"
                    onClick={() => {
                      setEditManager(eng.name);
                      setEngineerSearchQuery('');
                      setShowEngineerSuggestions(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                      editManager.toLowerCase().trim() === eng.name.toLowerCase().trim() ? 'bg-purple-50/80 border border-purple-200' : ''
                    }`}
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#03020A] group-hover:text-[#7C3AED] flex items-center gap-1.5">
                        {eng.name}
                        {editManager.toLowerCase().trim() === eng.name.toLowerCase().trim() && (
                          <span className="text-[9px] font-extrabold text-[#3F6212] bg-[#F0FDC2] px-1.5 py-0.5 rounded-md">Selected</span>
                        )}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">{eng.role}</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Budget Spent</label>
            <input
              type="text"
              value={editBudget}
              onChange={(e) => setEditBudget(e.target.value)}
              className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="Enter Budget Spent / Total Budget"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Project Start Date</span>
                <span className="text-[10px] text-[#7C3AED] font-extrabold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {editStartDate || 'Select Date'}
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C3AED]">
                  <FiCalendar className="text-sm" />
                </span>
                <input
                  type="date"
                  value={formatToISOInputDate(editStartDate)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditStartDate(val ? formatToHumanReadableDate(val) : '');
                  }}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Target Completion Date</span>
                <span className="text-[10px] text-[#7C3AED] font-extrabold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {editDeadline || 'Select Date'}
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C3AED]">
                  <FiCalendar className="text-sm" />
                </span>
                <input
                  type="date"
                  value={formatToISOInputDate(editDeadline)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditDeadline(val ? formatToHumanReadableDate(val) : '');
                  }}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {calcEditDurationDays !== null && (
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs font-bold text-purple-900">
              <span className="flex items-center gap-1.5">
                <FiClock className="text-[#7C3AED]" /> Calculated Report Execution Duration:
              </span>
              <span className="bg-[#7C3AED] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs">
                {calcEditDurationDays} Days
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Site Workers</label>
              <input
                type="number"
                value={editWorkers}
                onChange={(e) => setEditWorkers(e.target.value)}
                className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3 text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
                placeholder="Workers count"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-purple-100 text-xs font-bold text-slate-600 hover:bg-purple-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FiSave className="text-sm text-[#BEF264]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;
