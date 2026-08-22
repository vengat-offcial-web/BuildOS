import React from 'react';
import { FiFolder, FiCheckCircle } from 'react-icons/fi';

export function ReportsHeader({ totalCompletedCount }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F0FDC2] text-[#3F6212] flex items-center justify-center text-xl shrink-0">
            <FiFolder />
          </div>
          Completed Projects Reports
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Executive audit archives and complete operational summaries for all finished site developments.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        <span className="bg-[#F0FDC2] text-[#3F6212] border border-lime-200 text-xs font-extrabold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <FiCheckCircle className="text-[#3F6212] text-sm" />
          <span>{totalCompletedCount} Completed {totalCompletedCount === 1 ? 'Site' : 'Sites'} Archived</span>
        </span>
      </div>
    </div>
  );
}

export default ReportsHeader;
