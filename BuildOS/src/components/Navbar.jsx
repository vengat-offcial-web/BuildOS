import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiLogOut, FiShield, FiUser } from 'react-icons/fi';
import profile from '../assets/profile.png';

function Nav() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const isAdmin = user?.role === 'admin';

    return (
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <FiSearch className="text-base" />
                </span>
                <input
                    type="text"
                    placeholder={isAdmin ? "Search projects, workers, materials..." : "Search my tasks, shift schedule..."}
                    className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Role Badge */}
                {isAdmin ? (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                        <FiShield className="text-xs" />
                        Admin Access
                    </span>
                ) : (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                        <FiUser className="text-xs" />
                        Worker Desk
                    </span>
                )}

                {/* Notification Trigger */}
                <button 
                    aria-label="Notifications"
                    className="relative p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all group"
                >
                    <FiBell className="text-lg text-slate-300 group-hover:text-white transition-colors" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900 animate-pulse"></span>
                </button>

                {/* User Profile Pill */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                    <div className="relative">
                        <img 
                            src={user?.avatar || profile} 
                            alt="profile" 
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40 bg-slate-800"
                        />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${isAdmin ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                    </div>

                    <div className="hidden sm:block text-left max-w-[150px]">
                        <p className="text-sm font-semibold text-slate-200 leading-tight truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400 font-medium truncate">{user?.title || user?.role}</p>
                    </div>

                    {/* Logout Button Icon */}
                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all ml-1 cursor-pointer"
                    >
                        <FiLogOut className="text-base" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Nav;