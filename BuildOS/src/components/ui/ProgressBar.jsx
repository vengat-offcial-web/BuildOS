import React from 'react';

const HEIGHTS = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

const GRADIENTS = {
  purple: 'bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#7C3AED]',
  lime: 'bg-gradient-to-r from-[#D9F99D] via-[#BEF264] to-[#84CC16]',
  emerald: 'bg-gradient-to-r from-[#A7F3D0] via-[#34D399] to-[#059669]',
  dark: 'bg-gradient-to-r from-[#03020A] to-[#3B0764]'
};

export function ProgressBar({ progress = 0, variant = 'purple', showLabel = true, size = 'md' }) {
  const selectedGradient = GRADIENTS[variant] || GRADIENTS.purple;
  const barHeight = HEIGHTS[size] || HEIGHTS.md;
  const clampedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-[#03020A]">
          <span>Progress</span>
          <span className="text-[#7C3AED] font-extrabold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200/70 rounded-full overflow-hidden p-0.5 ${barHeight} backdrop-blur-sm border border-white/50`}>
        <div
          className={`${barHeight} ${selectedGradient} rounded-full transition-all duration-500 shadow-sm`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
