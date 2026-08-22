import React, { useCallback } from 'react';
import { Card } from '../ui';
import { FiUsers, FiMinus, FiPlus, FiAlertCircle } from 'react-icons/fi';

export function WorkforceCard({ workforceRequired, errors, onChange }) {
  const handleDecrement = useCallback(() => {
    if (workforceRequired > 1) {
      onChange('workforceRequired', workforceRequired - 1);
    }
  }, [workforceRequired, onChange]);

  const handleIncrement = useCallback(() => {
    onChange('workforceRequired', workforceRequired + 1);
  }, [workforceRequired, onChange]);

  return (
    <Card hover={false} className="space-y-4">
      <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
          <FiUsers className="text-[#7C3AED]" />
          4. Workforce Requirement
        </h3>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
          Required
        </span>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
          Number of Workers Required <span className="text-rose-500">*</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-10 h-10 rounded-2xl bg-white border border-purple-100 text-[#03020A] hover:bg-purple-50 font-bold flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Decrease worker requirement"
          >
            <FiMinus />
          </button>

          <div className="flex-1 bg-white border border-purple-100 rounded-2xl py-2.5 px-4 text-center">
            <span className="text-base font-extrabold text-[#03020A]">{workforceRequired}</span>
            <span className="text-xs font-bold text-purple-700 ml-1.5">Workers</span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-10 h-10 rounded-2xl bg-white border border-purple-100 text-[#03020A] hover:bg-purple-50 font-bold flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Increase worker requirement"
          >
            <FiPlus />
          </button>
        </div>

        {errors.workers && (
          <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
            <FiAlertCircle /> {errors.workers}
          </p>
        )}
      </div>
    </Card>
  );
}

export default WorkforceCard;
