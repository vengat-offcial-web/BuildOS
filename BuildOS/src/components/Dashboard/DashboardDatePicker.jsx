import React from 'react';
import { FiCalendar, FiChevronDown, FiX } from 'react-icons/fi';

export function DashboardDatePicker({
  selectedDate,
  isoDateInput,
  showDatePickerPopover,
  setShowDatePickerPopover,
  onCustomDateChange,
  onApplyPreset
}) {
  return (
    <div className="relative shrink-0 flex items-center">
      {/* Click-outside backdrop */}
      {showDatePickerPopover && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDatePickerPopover(false)} 
        />
      )}

      {/* Interactive Calendar Date Button */}
      <button 
        type="button"
        onClick={() => setShowDatePickerPopover(!showDatePickerPopover)}
        className="bg-white/90 hover:bg-white text-[#03020A] border border-white/90 text-xs font-extrabold px-5 py-3 rounded-full transition-all flex items-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer group relative z-50"
        title="Click to select or change date"
      >
        <FiCalendar className="text-[#7C3AED] text-sm group-hover:scale-110 transition-transform" />
        <span>{selectedDate}</span>
        <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${showDatePickerPopover ? 'rotate-180 text-[#7C3AED]' : ''}`} />
      </button>

      {/* Interactive Date Picker Popover */}
      {showDatePickerPopover && (
        <div className="absolute top-full mt-2 right-0 z-50 w-72 bg-white/95 backdrop-blur-xl border border-purple-100 p-4 rounded-3xl shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
            <span className="text-xs font-extrabold text-[#03020A] flex items-center gap-1.5">
              <FiCalendar className="text-[#7C3AED]" /> Select Dashboard Date
            </span>
            <button 
              type="button"
              onClick={() => setShowDatePickerPopover(false)}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs flex items-center justify-center cursor-pointer"
            >
              <FiX />
            </button>
          </div>

          {/* Custom Date Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Custom Date</label>
            <input
              type="date"
              value={isoDateInput}
              onChange={onCustomDateChange}
              className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-[#03020A] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] cursor-pointer"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Quick Presets</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onApplyPreset('yesterday')}
                className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-extrabold transition-all text-center cursor-pointer"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset('today')}
                className="px-2.5 py-1.5 rounded-xl bg-[#7C3AED] text-white text-[11px] font-extrabold transition-all text-center cursor-pointer shadow-xs"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset('tomorrow')}
                className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-extrabold transition-all text-center cursor-pointer"
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400">Selected: {selectedDate}</span>
            <button
              type="button"
              onClick={() => setShowDatePickerPopover(false)}
              className="dark-nav-pill px-3.5 py-1.5 rounded-full text-[11px] font-extrabold text-white shadow-xs cursor-pointer hover:bg-black transition-all"
            >
              Done ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardDatePicker;
