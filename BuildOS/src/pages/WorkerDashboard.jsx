import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui';
import DashboardCard from '../components/DashboardCard';
import {
    FiClock,
    FiCheckSquare,
    FiMapPin,
    FiCheckCircle,
    FiShield,
    FiSun,
    FiUserCheck
} from 'react-icons/fi';

function WorkerDashboard() {
    const { user } = useAuth();
    const [clockedIn, setClockedIn] = useState(true);
    const [tasks, setTasks] = useState([
        { id: 1, text: "Site inspection at Zone B4 - Metro Rail Link", status: "In Progress", urgent: true },
        { id: 2, text: "Verify concrete curing strength log (Day 3)", status: "Pending", urgent: false },
        { id: 3, text: "Safety gear & harness check before height work", status: "Completed", urgent: false },
        { id: 4, text: "Submit daily excavator fuel log to supervisor", status: "Pending", urgent: false }
    ]);

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    const completedCount = tasks.filter(t => t.status === "Completed").length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="space-y-8 pb-8">
            {/* Hero Welcome Banner Card */}
            <div className="glass-hero-purple p-8 rounded-[32px] border border-white/90 shadow-[0_14px_36px_rgba(167,139,250,0.15)] relative overflow-hidden">
                {/* Ambient Graphic */}
                <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#03020A] tracking-tight">
                            Welcome back, <span className="text-[#7C3AED]">{user?.name || 'Marcoo'}</span>!
                        </h1>
                        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                            Worker Portal • Track your shift attendance, site assignments, and daily task safety.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button 
                            type="button"
                            onClick={() => setClockedIn(!clockedIn)}
                            className="dark-nav-pill hover:bg-black text-white text-xs font-extrabold px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer"
                        >
                            <FiClock className="text-[#BEF264] text-sm" />
                            <span>{clockedIn ? "Clock Out of Shift" : "Clock In to Shift"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Top KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard 
                    title="Shift Status" 
                    value={clockedIn ? "ON DUTY" : "OFF DUTY"} 
                    icon={FiUserCheck} 
                    subtitle={clockedIn ? "Clocked in at 08:00 AM" : "Not clocked in"}
                    badgeType={clockedIn ? "lime" : "rose"}
                    accentColor={clockedIn ? "lime" : "dark"}
                />
                <DashboardCard 
                    title="Assigned Site" 
                    value="Metro Link – B4" 
                    icon={FiMapPin} 
                    subtitle="Supervisor: R. Sharma"
                    badgeType="purple"
                    accentColor="purple"
                />
                <DashboardCard 
                    title="Tasks Today" 
                    value={`${completedCount} / ${tasks.length}`} 
                    icon={FiCheckSquare} 
                    subtitle={`${progressPercent}% Completed`}
                    badgeType="lime"
                    accentColor="lime"
                />
                <DashboardCard 
                    title="Safety Compliance" 
                    value="100%" 
                    icon={FiShield} 
                    subtitle="Zero Incidents"
                    badgeType="lime"
                    accentColor="dark"
                />
            </div>

            {/* Shift Tasks & Weather Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Shift Checklist Panel */}
                <div className="glass-card p-6 rounded-[28px] border border-white lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm shrink-0 font-bold">
                                <FiCheckSquare />
                            </div>
                            <h3 className="text-lg font-extrabold text-[#03020A] tracking-tight">My Daily Shift Checklist</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-purple-100/60 px-3 py-1 rounded-full">
                            {completedCount} of {tasks.length} Done
                        </span>
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                                    task.status === "Completed"
                                        ? "bg-[#F0FDC2]/40 border-[#BEF264] text-slate-500"
                                        : "bg-white/80 hover:bg-white border-white text-[#03020A] shadow-sm hover:shadow-md"
                                }`}
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                                        task.status === "Completed" 
                                            ? "bg-[#7C3AED] border-[#7C3AED] text-white" 
                                            : "border-purple-200 bg-white"
                                    }`}>
                                        {task.status === "Completed" && <FiCheckCircle className="text-sm" />}
                                    </div>
                                    <span className={`text-xs font-bold ${task.status === "Completed" ? "line-through text-slate-400 font-medium" : "text-[#03020A]"}`}>
                                        {task.text}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                    {task.urgent && task.status !== "Completed" && (
                                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]">
                                            URGENT
                                        </span>
                                    )}
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                        task.status === "Completed" 
                                            ? "bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]" 
                                            : "bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]"
                                    }`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Worker Site & Safety Summary */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-[28px] border border-white space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-purple-100 pb-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm shrink-0 font-bold">
                                <FiShield />
                            </div>
                            <h3 className="text-base font-extrabold text-[#03020A]">PPE Safety Verification</h3>
                        </div>
                        <ul className="space-y-2.5 text-xs">
                            <li className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-white shadow-xs">
                                <span className="text-[#03020A] font-bold">Safety Helmet (Hardhat)</span>
                                <span className="text-emerald-700 font-extrabold flex items-center gap-1 bg-[#F0FDC2] px-2.5 py-0.5 rounded-full border border-[#BEF264]">
                                    <FiCheckCircle className="text-xs" /> Verified
                                </span>
                            </li>
                            <li className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-white shadow-xs">
                                <span className="text-[#03020A] font-bold">Steel Toe Boots</span>
                                <span className="text-emerald-700 font-extrabold flex items-center gap-1 bg-[#F0FDC2] px-2.5 py-0.5 rounded-full border border-[#BEF264]">
                                    <FiCheckCircle className="text-xs" /> Verified
                                </span>
                            </li>
                            <li className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-white shadow-xs">
                                <span className="text-[#03020A] font-bold">High-Vis Reflective Vest</span>
                                <span className="text-emerald-700 font-extrabold flex items-center gap-1 bg-[#F0FDC2] px-2.5 py-0.5 rounded-full border border-[#BEF264]">
                                    <FiCheckCircle className="text-xs" /> Verified
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="glass-hero-lime p-6 rounded-[28px] border border-white/90 shadow-[0_10px_30px_rgba(190,242,100,0.15)] relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-2xl bg-[#03020A] text-[#BEF264]">
                                <FiSun className="text-xl" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-[#03020A]">Site Weather Alert</h4>
                                <p className="text-xs text-slate-600 font-semibold">Chennai Zone • 31°C Clear</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-3 leading-relaxed">
                            Stay hydrated during afternoon concrete pouring. Hydration station available at Block B entrance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkerDashboard;

