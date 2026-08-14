import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

export function Navbar({
    searchValue,
    onSearchChange,
    placeholder = "Search Projects...",
    onNotificationClick
}) {
    return (
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/80 px-6 py-4 flex items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            {/* Search Input Pill */}
            <div className="relative flex-1 max-w-md" role="search">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                    <FiSearch className="text-base" />
                </span>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search"
                    className="w-full bg-white/80 border border-purple-100/80 text-[#03020A] placeholder-slate-400 text-xs font-medium rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 focus:border-[#A78BFA] transition-all shadow-sm"
                />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notification Trigger Pill */}
                <button 
                    type="button"
                    onClick={onNotificationClick}
                    aria-label="Notifications"
                    className="relative p-2.5 rounded-full bg-white border border-purple-100 text-[#03020A] hover:bg-purple-50 transition-all shadow-sm group cursor-pointer"
                >
                    <FiBell className="text-lg text-slate-700 group-hover:text-[#7C3AED] transition-colors" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#BEF264] ring-2 ring-white animate-pulse"></span>
                </button>
            </div>
        </header>
    );
}

// Backward compatibility export alias
export const Nav = Navbar;

export default Navbar;