import React from 'react';
import { FiCalendar, FiActivity } from 'react-icons/fi';

function Dashboard() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900/40 border border-blue-500/20 rounded-2xl p-6 mb-8 backdrop-blur-md">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        Live Dashboard Overview
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        Welcome Back, <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Vengadesh!</span> 👋
                    </h1>
                    <p className="text-sm text-slate-300 mt-1">
                        Here is the live operational summary for your active construction projects today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <FiCalendar className="text-blue-400" />
                        <span>Aug 12, 2026</span>
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <FiActivity />
                        <span>Live Activity</span>
                    </button>
                </div>
            </div>
            {/* Background Accent Decorative Glow */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}

export default Dashboard;