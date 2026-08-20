import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiGrid,
    FiSettings,
    FiLogOut,
    FiUser,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';
import profile from '../assets/profile.png';

const workerMenuItems = [
    { name: "Dashboard", path: "/worker/dashboard", icon: FiGrid },
    { name: "Settings", path: "/worker/settings", icon: FiSettings }
];

export function WorkerSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-purple-100 z-30 sticky top-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center text-white text-lg shadow-md shadow-purple-500/20">
                        <FaHelmetSafety />
                    </div>
                    <div>
                        <span className="text-lg font-extrabold text-[#03020A] tracking-tight">BuildOS</span>
                        <span className="text-[10px] block text-[#7C3AED] font-bold">Worker Portal</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-expanded={mobileOpen}
                    aria-label="Toggle Navigation Menu"
                    className="p-2 rounded-xl bg-[#03020A] text-[#BEF264] hover:bg-black transition-all cursor-pointer"
                >
                    {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>
            </div>

            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-35 md:hidden transition-opacity duration-300"
                />
            )}

            {/* Sticky Sidebar Navigation Component */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-40 w-72 md:w-64 h-screen p-4 flex flex-col shrink-0 transition-transform duration-300
                bg-white/70 backdrop-blur-xl border-r border-white/80 shadow-[10px_0_30px_rgba(139,92,246,0.05)]
                ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="flex-1 flex flex-col space-y-4 min-h-0">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between px-2 pt-1 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/25">
                                <FaHelmetSafety />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-1.5">
                                    BuildOS
                                </h2>
                                <p className="text-[11px] text-[#7C3AED] font-bold">Worker Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Full Height Floating Black Navigation Bento Container */}
                    <div className="bg-[#03020A] text-white rounded-3xl p-3 shadow-xl shadow-black/10 border border-white/10 flex-1 flex flex-col justify-between min-h-0 overflow-y-auto">
                        <nav aria-label="Worker Navigation" className="space-y-1">
                            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                                <span>Worker Menu</span>
                                <span className="bg-[#BEF264]/20 text-[#BEF264] text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider border border-[#BEF264]/30 flex items-center gap-1">
                                    <FiUser className="text-[9px]" /> WORKER
                                </span>
                            </div>

                            {workerMenuItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${isActive
                                                ? "bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] text-white shadow-md shadow-purple-500/30 font-bold scale-[1.02]"
                                                : "text-slate-300 hover:text-white hover:bg-white/10"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'text-slate-400'}`}>
                                                    <IconComponent className="text-base" />
                                                </div>
                                                <span className="flex-1">{item.name}</span>
                                                {isActive && (
                                                    <span className="w-2 h-2 rounded-full bg-[#BEF264]"></span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* Integrated Profile Footer at bottom of full-height Bento Container */}
                        <div className="pt-3 mt-4 border-t border-white/15 flex items-center justify-between gap-2 px-1 shrink-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative shrink-0">
                                    <img
                                        src={user?.avatar || profile}
                                        alt="Worker avatar"
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C4B5FD] bg-purple-100 shadow-sm"
                                        onError={(e) => { e.target.src = profile; }}
                                    />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#03020A] bg-[#BEF264]"></span>
                                </div>
                                <div className="text-xs min-w-0">
                                    <p className="font-extrabold text-white leading-tight truncate text-[11px]">
                                        {user?.name || 'Marcoo'}
                                    </p>
                                    <p className="text-[10px] text-[#BEF264] font-bold truncate">
                                        Site Specialist
                                    </p>
                                </div>
                            </div>

                            {/* Sign Out Action */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Logout Worker"
                                aria-label="Logout Worker"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-white/10 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                            >
                                <FiLogOut className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default WorkerSidebar;

