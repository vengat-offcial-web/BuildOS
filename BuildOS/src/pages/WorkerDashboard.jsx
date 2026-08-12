import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Badge } from '../components/ui';
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
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <PageHeader
                title={`Welcome back, ${user?.name || 'Worker'}!`}
                description="Worker Portal • Track your shift attendance, site assignments, and daily task safety."
                actionLabel={clockedIn ? "Clock Out of Shift" : "Clock In to Shift"}
                actionIcon={FiClock}
                onActionClick={() => setClockedIn(!clockedIn)}
            />

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <DashboardCard 
                    title="Shift Status" 
                    value={clockedIn ? "ON DUTY" : "OFF DUTY"} 
                    icon={FiUserCheck} 
                    trend={clockedIn ? "Clocked in at 08:00 AM" : "Not clocked in"} 
                />
                <DashboardCard 
                    title="Assigned Site" 
                    value="Metro Link - B4" 
                    icon={FiMapPin} 
                    trend="Supervisor: R. Sharma" 
                />
                <DashboardCard 
                    title="Tasks Today" 
                    value={`${tasks.filter(t => t.status === "Completed").length} / ${tasks.length}`} 
                    icon={FiCheckSquare} 
                    trend="50% Completed" 
                />
                <DashboardCard 
                    title="Safety Compliance" 
                    value="100%" 
                    icon={FiShield} 
                    trend="Zero Incidents" 
                />
            </div>

            {/* Shift & Weather Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Tasks Panel */}
                <Card className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <FiCheckSquare className="text-emerald-400 text-lg" />
                            <h3 className="text-base font-bold text-slate-100">My Daily Shift Checklist</h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                            {tasks.filter(t => t.status === "Completed").length} of {tasks.length} Done
                        </span>
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                                    task.status === "Completed"
                                        ? "bg-emerald-950/20 border-emerald-500/30 text-slate-400"
                                        : "bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-200"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                                        task.status === "Completed" 
                                            ? "bg-emerald-500 border-emerald-500 text-white" 
                                            : "border-slate-600 bg-slate-900"
                                    }`}>
                                        {task.status === "Completed" && <FiCheckCircle className="text-sm" />}
                                    </div>
                                    <span className={`text-sm font-medium ${task.status === "Completed" ? "line-through text-slate-500" : ""}`}>
                                        {task.text}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                    {task.urgent && task.status !== "Completed" && (
                                        <Badge variant="danger">URGENT</Badge>
                                    )}
                                    <Badge variant={task.status === "Completed" ? "success" : "warning"}>
                                        {task.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Worker Site & Safety Summary */}
                <div className="space-y-6">
                    <Card className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <FiShield className="text-blue-400 text-lg" />
                            <h3 className="text-base font-bold text-slate-100">PPE Safety Verification</h3>
                        </div>
                        <ul className="space-y-2.5 text-xs">
                            <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                                <span className="text-slate-300 font-medium">Safety Helmet (Hardhat)</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <FiCheckCircle /> Verified
                                </span>
                            </li>
                            <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                                <span className="text-slate-300 font-medium">Steel Toe Boots</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <FiCheckCircle /> Verified
                                </span>
                            </li>
                            <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                                <span className="text-slate-300 font-medium">High-Vis Reflective Vest</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <FiCheckCircle /> Verified
                                </span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/20 p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                                <FiSun className="text-xl" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-100">Site Weather Alert</h4>
                                <p className="text-xs text-slate-400">Chennai Zone • 31°C Clear</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            Stay hydrated during afternoon concrete pouring. Hydration station available at Block B entrance.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default WorkerDashboard;
