import React from 'react';
import { FiSearch } from 'react-icons/fi';

export const FilterBar = ({
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
    totalCount = 0,
    filteredCount = 0,
    itemLabel = "items"
}) => {
    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <FiSearch className="text-base" />
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
            </div>
            <div className="text-xs text-slate-400 font-medium">
                Showing <span className="font-semibold text-slate-200">{filteredCount}</span>
                {totalCount > 0 && <span> of {totalCount}</span>} {itemLabel}
            </div>
        </div>
    );
};

export default FilterBar;
