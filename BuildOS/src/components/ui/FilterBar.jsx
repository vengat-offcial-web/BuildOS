import React from 'react';
import { FiSearch } from 'react-icons/fi';

export function FilterBar({
    searchTerm = '',
    onSearchChange,
    placeholder = "Search...",
    totalCount = 0,
    filteredCount = 0,
    itemLabel = "items",
    variant = "glass"
}) {
    const isDark = variant === 'dark';

    const containerStyle = isDark
        ? "bg-slate-900/60 backdrop-blur-md border border-slate-800/80 text-slate-200"
        : "glass-card text-[#03020A] border border-white/90";

    const inputStyle = isDark
        ? "bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-400 focus:ring-blue-500/50"
        : "bg-white/90 border border-purple-100/80 text-[#03020A] placeholder-slate-400 focus:ring-[#A78BFA]/50";

    return (
        <div className={`${containerStyle} rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-400">
                    <FiSearch className="text-base" />
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className={`w-full ${inputStyle} text-xs font-semibold rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 transition-all`}
                />
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
                Showing <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-[#03020A]'}`}>{filteredCount}</span>
                {totalCount > 0 && <span> of {totalCount}</span>} {itemLabel}
            </div>
        </div>
    );
}

export default FilterBar;
