import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiGrid,
    FiSettings,
    FiLogOut,
    FiUser
} from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';

const workerMenuItems = [
    { name: "Dashboard", path: "/worker/dashboard", icon: FiGrid },
    { name: "Settings", path: "/worker/settings", icon: FiSettings }
];

function WorkerSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <aside className="w-full md:w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80 p-5 flex flex-col shrink-0 min-h-screen">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-8 px-2 pt-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30">
                    <FaHelmetSafety />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent tracking-wide">
                        BuildOS
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">Worker Portal</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-1.5">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                    <span>Worker Menu</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-500/30">
                        <FiUser className="text-[10px]" /> WORKER
                    </span>
                </p>

                {workerMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                                    isActive
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <IconComponent className={`text-lg shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span className="flex-1">{item.name}</span>
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Worker Info & Logout */}
            <div className="mt-auto pt-4 border-t border-slate-800/80 px-2 space-y-3">
                <div className="bg-slate-800/40 rounded-xl p-3 flex items-center gap-3 border border-slate-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                    <div className="text-xs min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{user?.name || 'Site Worker'}</p>
                        <p className="text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                >
                    <FiLogOut className="text-sm" />
                    <span>Logout Worker</span>
                </button>
            </div>
        </aside>
    );
}

export default WorkerSidebar;
