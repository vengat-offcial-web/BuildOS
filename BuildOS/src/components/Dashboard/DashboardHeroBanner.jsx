import React from 'react';
import DashboardDatePicker from './DashboardDatePicker';

export function DashboardHeroBanner({
  userName,
  selectedDate,
  isoDateInput,
  showDatePickerPopover,
  setShowDatePickerPopover,
  onCustomDateChange,
  onApplyPreset
}) {
  return (
    <div className="glass-hero-purple p-8 rounded-[32px] border border-white/90 shadow-[0_14px_36px_rgba(167,139,250,0.15)] relative z-20">
      {/* Ambient Glow Graphic */}
      <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-white/40 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#03020A] tracking-tight">
            Good Morning, <span className="text-[#7C3AED]">{userName}</span>
          </h1>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            Manage your construction projects, workers, materials and tasks from one place.
          </p>
        </div>

        <DashboardDatePicker
          selectedDate={selectedDate}
          isoDateInput={isoDateInput}
          showDatePickerPopover={showDatePickerPopover}
          setShowDatePickerPopover={setShowDatePickerPopover}
          onCustomDateChange={onCustomDateChange}
          onApplyPreset={onApplyPreset}
        />
      </div>
    </div>
  );
}

export default DashboardHeroBanner;
