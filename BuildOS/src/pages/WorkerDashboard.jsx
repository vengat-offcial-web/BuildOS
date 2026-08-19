import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/useData';
import DashboardCard from '../components/DashboardCard';
import {
    FiClock,
    FiCheckSquare,
    FiMapPin,
    FiCheckCircle,
    FiShield,
    FiSun,
    FiUserCheck,
    FiCalendar,
    FiAlertTriangle,
    FiSend,
    FiX,
    FiTrash2,
    FiFileText,
    FiMessageSquare,
    FiAlertCircle
} from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';

function WorkerDashboard() {
    const { user } = useAuth();
    const { 
        notifications,
        addNotification, 
        markNotificationAsRead,
        updateWorker, 
        workers, 
        projects, 
        tasks: globalTasks,
        toggleTaskStatus,
        leaveRequests, 
        addLeaveRequest, 
        deleteLeaveRequest, 
        workerNotes, 
        addWorkerNote, 
        deleteWorkerNote 
    } = useData();

    // Automatically trigger notification toast banner when worker logs in / visits dashboard if a new task was assigned
    React.useEffect(() => {
        if (!user?.name || !notifications || !Array.isArray(notifications)) return;

        const userNameClean = user.name.toLowerCase().trim();

        // Find unread notification targeted specifically to this logged-in worker
        const latestTaskNotif = notifications.find(n => {
            if (!n || !n.unread) return false;
            if (n.target !== 'worker') return false;
            if (n.recipient && n.recipient.toLowerCase().trim() === userNameClean) {
                return true;
            }
            return false;
        });

        if (latestTaskNotif) {
            setToastMessage(`🔔 ${latestTaskNotif.title}: ${latestTaskNotif.message}`);
            // Auto mark as read after worker sees the notification toast
            const timer = setTimeout(() => {
                markNotificationAsRead(latestTaskNotif.id);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [user, notifications, markNotificationAsRead]);

    // Check if current logged in worker is already clocked in from context roster
    const currentWorker = workers?.find(w => w.name?.toLowerCase().trim() === user?.name?.toLowerCase().trim());
    const [clockedIn, setClockedIn] = useState(() => currentWorker ? currentWorker.status === 'On Duty' : false);

    // Fallback tasks if no specific global task is assigned yet
    const [localTasks, setLocalTasks] = useState([
        { id: 'local-1', text: "Site inspection & quality check", status: "In Progress", urgent: true },
        { id: 'local-2', text: "Verify concrete curing strength log (Day 3)", status: "Pending", urgent: false },
        { id: 'local-3', text: "Safety gear & harness check before height work", status: "Pending", urgent: false },
        { id: 'local-4', text: "Submit daily shift log to supervisor", status: "Pending", urgent: false }
    ]);

    // Modals state
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showSafetyModal, setShowSafetyModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatRecipient, setChatRecipient] = useState("Rajesh Kumar (Lead Structural Engineer)");
    const [workerChatInput, setWorkerChatInput] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    // Dynamically evaluate assigned project from live projects roster
    const matchedProject = useMemo(() => {
        if (!user?.name) return null;
        const userNameClean = user.name.toLowerCase().trim();

        // 1. Check if user is manager or team member of a project in projects state
        const projByTeam = (projects || []).find(p => {
            if (p.manager && p.manager.toLowerCase().trim() === userNameClean) return true;
            if (p.teamMembers && Array.isArray(p.teamMembers)) {
                return p.teamMembers.some(m => m.name && m.name.toLowerCase().trim() === userNameClean);
            }
            return false;
        });
        if (projByTeam) return projByTeam;

        // 2. Check if currentWorker or user has an assigned site name that matches an existing project
        const siteName = (currentWorker?.site || user?.site || '').trim();
        if (siteName && siteName !== 'Not Assigned Yet' && siteName !== 'not assigned on any project') {
            const projBySite = (projects || []).find(p => p.name?.toLowerCase().trim() === siteName.toLowerCase().trim());
            if (projBySite) return projBySite;
            return {
                name: siteName,
                location: 'Site Location',
                manager: 'Site Lead Engineer',
                progress: 0,
                status: 'In Progress',
                deadline: 'TBD',
                description: siteName
            };
        }

        return null;
    }, [projects, user, currentWorker]);

    const hasAssignedSite = Boolean(matchedProject);

    const assignedProject = {
        name: hasAssignedSite ? matchedProject.name : "not assigned on any project",
        fullTitle: hasAssignedSite ? (matchedProject.description || matchedProject.name) : "No active project site assigned to your worker account yet",
        location: hasAssignedSite ? matchedProject.location : "Unassigned",
        engineer: hasAssignedSite ? (matchedProject.manager || "Site Lead") : "Not Assigned Yet",
        workerRole: currentWorker?.trade || user?.tradeRole || "Site Operations Worker",
        status: hasAssignedSite ? matchedProject.status : "Unassigned",
        completion: hasAssignedSite ? (matchedProject.progress || 0) : 0,
        deadline: hasAssignedSite ? (matchedProject.deadline || "N/A") : "N/A",
        shiftSchedule: "08:00 AM – 05:00 PM (General Shift)"
    };

    // Leave Request form state
    const [leaveForm, setLeaveForm] = useState({
        date: '',
        reason: 'Medical Leave',
        notes: ''
    });

    // Safety Report form state
    const [safetyForm, setSafetyForm] = useState({
        hazardType: 'Scaffolding Hazard',
        description: ''
    });

    const handleClockToggle = () => {
        if (currentWorker && currentWorker.approvalStatus === 'Pending Approval') {
            setToastMessage('Account Pending Approval! You cannot clock in until Admin accepts your registration.');
            setTimeout(() => setToastMessage(''), 4000);
            return;
        }

        const nextState = !clockedIn;
        setClockedIn(nextState);

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const workerName = user?.name || 'Marcoo';

        // Sync worker status in context
        updateWorker(workerName, { 
            status: nextState ? 'On Duty' : 'Off Duty',
            attendance: nextState ? 'Present' : 'Absent'
        });

        // Dispatch notification to Admin Workers page & header bell
        addNotification(
            `Worker Shift ${nextState ? 'Clock In' : 'Clock Out'}`,
            `Worker ${workerName} (Site Specialist) clocked ${nextState ? 'IN to' : 'OUT of'} shift at ${timeStr} for Metro Link – B4`,
            "Shift Check-In",
            nextState ? "lime" : "purple",
            "admin"
        );

        setToastMessage(`Clocked ${nextState ? 'IN' : 'OUT'}! Notification sent to Admin Workers page.`);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // Evaluate worker's assigned tasks from global context
    const workerAssignedTasks = useMemo(() => {
        const workerNameClean = (user?.name || 'Marcoo').toLowerCase().trim();
        const siteNameClean = (assignedProject?.name || '').toLowerCase().trim();

        // Tasks specifically assigned to this worker or matching their assigned site
        const matched = (globalTasks || []).filter(t => {
            const assigneeClean = (t.assignee || '').toLowerCase().trim();
            const taskSiteClean = (t.site || '').toLowerCase().trim();
            
            const matchesAssignee = assigneeClean && (
                assigneeClean === workerNameClean ||
                assigneeClean.includes(workerNameClean) ||
                workerNameClean.includes(assigneeClean) ||
                assigneeClean === 'general team' ||
                assigneeClean === 'all workers'
            );

            const matchesSite = siteNameClean && taskSiteClean && (
                taskSiteClean.includes(siteNameClean) ||
                siteNameClean.includes(taskSiteClean)
            );

            return matchesAssignee || matchesSite;
        });

        return matched.map(t => ({
            id: t.id,
            text: t.title || t.name,
            status: t.status,
            category: t.category || 'General Operations',
            urgent: t.priority === 'High' || t.overdue,
            isGlobal: true,
            site: t.site,
            dueDate: t.dueDate
        }));
    }, [globalTasks, user, assignedProject]);

    const displayTasks = useMemo(() => {
        if (workerAssignedTasks.length > 0) {
            return workerAssignedTasks;
        }
        return localTasks;
    }, [workerAssignedTasks, localTasks]);

    // Checklist Submission state
    const [checklistSubmitted, setChecklistSubmitted] = useState(false);

    const toggleTask = (id) => {
        const isGlobal = globalTasks && globalTasks.some(t => t.id === id);
        if (isGlobal) {
            toggleTaskStatus(id);
        } else {
            setLocalTasks(prev => prev.map(t => {
                if (t.id === id) {
                    return { ...t, status: t.status === "Completed" ? "Pending" : "Completed" };
                }
                return t;
            }));
        }
    };

    const handleChecklistSubmit = () => {
        const workerName = user?.name || 'Marcoo';
        const doneCount = displayTasks.filter(t => t.status === "Completed").length;
        const totalCount = displayTasks.length;
        const isAllDone = doneCount === totalCount;

        setChecklistSubmitted(true);

        // Send professional daily shift report notification to Admin
        addNotification(
            `Shift Checklist Report Submitted ${isAllDone ? '✓' : ''}`,
            `Worker ${workerName} (${assignedProject.workerRole}) submitted daily shift checklist report (${doneCount}/${totalCount} Tasks Completed) for site ${assignedProject.name}.`,
            "Shift Report",
            isAllDone ? "lime" : "purple",
            "admin"
        );

        setToastMessage(`Daily shift checklist (${doneCount}/${totalCount} Done) submitted to Admin Workers Page!`);
        setTimeout(() => setToastMessage(''), 4000);
    };

    const handleLeaveSubmit = (e) => {
        e.preventDefault();
        if (!leaveForm.date) return;

        const workerName = user?.name || 'Marcoo';

        addLeaveRequest({
            workerName,
            trade: assignedProject.workerRole,
            site: assignedProject.name,
            date: leaveForm.date,
            reason: leaveForm.reason,
            engineer: assignedProject.engineer,
            notes: leaveForm.notes
        });

        setShowLeaveModal(false);
        setLeaveForm({ date: '', reason: 'Medical Leave', notes: '' });

        setToastMessage('Leave request sent! Dispatched to Admin Workers page for approval.');
        setTimeout(() => setToastMessage(''), 4000);
    };

    const handleSafetySubmit = (e) => {
        e.preventDefault();
        setShowSafetyModal(false);
        setSafetyForm({ hazardType: 'Scaffolding Hazard', description: '' });

        setToastMessage('Safety issue reported to Site Safety Officer & Supervisor!');
        setTimeout(() => setToastMessage(''), 4000);
    };

    const handleSendWorkerChatMessage = (e) => {
        e.preventDefault();
        if (!workerChatInput.trim()) return;

        const workerName = user?.name || 'Marcoo';

        addWorkerNote({
            workerName: workerName,
            text: workerChatInput.trim(),
            category: 'Worker Direct Chat',
            senderRole: 'worker',
            senderName: workerName
        });

        // Send notification to Admin
        addNotification(
            `New Message from Worker: ${workerName}`,
            `Worker ${workerName} sent message to ${chatRecipient}: "${workerChatInput.trim().slice(0, 60)}..."`,
            "Worker Chat",
            "purple",
            "admin"
        );

        setWorkerChatInput('');
        setToastMessage(`Message sent to Admin (${chatRecipient.split(' ')[0]})!`);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const completedCount = displayTasks.filter(t => t.status === "Completed").length;
    const progressPercent = displayTasks.length > 0 ? Math.round((completedCount / displayTasks.length) * 100) : 0;

    return (
        <div className="space-y-8 pb-8">
            {/* Toast Notification Banner */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 bg-[#03020A] text-white border border-[#BEF264] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
                    <FiCheckCircle className="text-[#BEF264] text-lg shrink-0" />
                    <span className="text-xs font-bold">{toastMessage}</span>
                </div>
            )}

            {/* Pending Approval Notice Banner */}
            {currentWorker && currentWorker.approvalStatus === 'Pending Approval' && (
                <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-[28px] flex items-center gap-3 text-amber-900 shadow-sm animate-in fade-in duration-200">
                    <FiAlertCircle className="text-amber-600 text-2xl shrink-0" />
                    <div>
                        <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">Account Registration Pending Admin Approval</h4>
                        <p className="text-xs font-semibold text-amber-800 mt-0.5 leading-relaxed">
                            Your worker registration request for <strong className="text-amber-950 font-bold">{currentWorker.name}</strong> has been submitted and is currently awaiting Admin approval. Once Admin accepts your registration from the Admin Portal, you will be authorized to clock into shifts.
                        </p>
                    </div>
                </div>
            )}

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
                            Worker Portal • Site Assigned: <strong className="text-[#03020A]">{assignedProject.name}</strong> • Engineer: <strong className="text-[#7C3AED]">{assignedProject.engineer}</strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {/* Feature 1: Shift Clock In / Clock Out Button */}
                        <button 
                            type="button"
                            onClick={handleClockToggle}
                            className="dark-nav-pill hover:bg-black text-white text-xs font-extrabold px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer"
                        >
                            <FiClock className="text-[#BEF264] text-sm" />
                            <span>{clockedIn ? "Clock Out of Shift" : "Clock In to Shift"}</span>
                        </button>

                        {/* Feature 2: Leave Request Action Button */}
                        <button 
                            type="button"
                            onClick={() => setShowLeaveModal(true)}
                            className="bg-white/90 hover:bg-white text-[#03020A] border border-white/90 text-xs font-extrabold px-4 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                            <FiCalendar className="text-[#7C3AED] text-sm" />
                            <span>Apply Leave</span>
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
                <div 
                    onClick={() => setShowProjectModal(true)}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    title="Click to view assigned project details"
                >
                    <DashboardCard 
                        title="Assigned Site" 
                        value={hasAssignedSite ? assignedProject.name : "not assigned on any project"} 
                        icon={FiMapPin} 
                        subtitle={hasAssignedSite ? "Tap for Site Details →" : "No Active Site"}
                        badgeType={hasAssignedSite ? "purple" : "yellow"}
                        accentColor={hasAssignedSite ? "purple" : "dark"}
                    />
                </div>
                <DashboardCard 
                    title="Tasks Today" 
                    value={`${completedCount} / ${displayTasks.length}`} 
                    icon={FiCheckSquare} 
                    subtitle={`${progressPercent}% Completed`}
                    badgeType="lime"
                    accentColor="lime"
                />
                <DashboardCard 
                    title="Leave Status" 
                    value={`${leaveRequests.length} Request`} 
                    icon={FiFileText} 
                    subtitle={leaveRequests[0]?.status || "No Pending Leaves"}
                    badgeType="yellow"
                    accentColor="dark"
                />
            </div>

            {/* Shift Tasks & Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feature 2: Daily Shift Tasks Checklist */}
                <div className="glass-card p-6 rounded-[28px] border border-white lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm shrink-0 font-bold">
                                <FiCheckSquare />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-[#03020A] tracking-tight">My Daily Shift Checklist</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Tap task to mark completed or pending</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] border border-[#BEF264] px-3 py-1 rounded-full">
                            {completedCount} of {displayTasks.length} Done
                        </span>
                    </div>

                    <div className="space-y-3">
                        {displayTasks.map((task) => (
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
                                    {task.category && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                                            {task.category}
                                        </span>
                                    )}
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

                    {/* Submit Daily Shift Checklist Action Footer */}
                    <div className="pt-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                            <FiCheckCircle className={checklistSubmitted ? "text-[#3F6212]" : "text-purple-500"} />
                            <span>{checklistSubmitted ? "Report Dispatched to Admin Workers Page" : "Submit once shift tasks are ready for supervisor review"}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleChecklistSubmit}
                            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 ${
                                checklistSubmitted
                                    ? "bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]"
                                    : "dark-nav-pill text-white hover:bg-black"
                            }`}
                        >
                            <FiSend className={checklistSubmitted ? "text-[#3F6212]" : "text-[#BEF264]"} />
                            <span>{checklistSubmitted ? "Report Submitted ✓" : "Submit Shift Checklist"}</span>
                        </button>
                    </div>
                </div>

                {/* Right Side: Leave Requests & Safety Alerts */}
                <div className="space-y-6">

                    {/* Feature 3: Submitted Leave Requests Summary Card */}
                    <div className="glass-card p-6 rounded-[28px] border border-white space-y-4">
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
                                    <FiCalendar />
                                </div>
                                <h3 className="text-base font-extrabold text-[#03020A]">My Leave Requests</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {leaveRequests && leaveRequests.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            leaveRequests.forEach(r => deleteLeaveRequest(r.id));
                                            setToastMessage('All leave records cleared.');
                                            setTimeout(() => setToastMessage(''), 3000);
                                        }}
                                        className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer mr-1"
                                        title="Clear all leave records"
                                    >
                                        <FiTrash2 className="text-xs" /> Clear
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowLeaveModal(true)}
                                    className="text-[11px] font-extrabold text-[#7C3AED] hover:underline cursor-pointer"
                                >
                                    + Apply
                                </button>
                            </div>
                        </div>

                        {leaveRequests && leaveRequests.length > 0 ? (
                            <div className="space-y-2.5 text-xs">
                                {leaveRequests.map((req) => (
                                    <div key={req.id} className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-1 relative group">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-extrabold text-[#03020A]">{req.reason}</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                                    req.status === 'Approved'
                                                        ? 'bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]'
                                                        : req.status === 'Declined'
                                                        ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]'
                                                        : 'bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]'
                                                }`}>
                                                    {req.status}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        deleteLeaveRequest(req.id);
                                                        setToastMessage(`Cleared '${req.reason}' record.`);
                                                        setTimeout(() => setToastMessage(''), 3000);
                                                    }}
                                                    className="w-5 h-5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer"
                                                    title="Clear this leave record"
                                                >
                                                    <FiX className="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium">Date: <strong className="text-slate-700">{req.date}</strong></p>
                                        <p className="text-[10px] text-purple-600 font-semibold">Engineer: {req.engineer || 'R. Sharma (Site Engineer)'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 text-center py-3 font-medium">No leave requests submitted yet.</p>
                        )}
                    </div>

                    {/* Feature 4: Report Safety Issue Action Card */}
                    <div className="glass-hero-lime p-6 rounded-[28px] border border-white/90 shadow-[0_10px_30px_rgba(190,242,100,0.15)] space-y-3 relative overflow-hidden">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-[#03020A] text-[#BEF264]">
                                <FiAlertTriangle className="text-xl" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-[#03020A]">Report Site Safety Hazard</h4>
                                <p className="text-xs text-slate-600 font-semibold">Report scaffolding, PPE, or equipment issues</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowSafetyModal(true)}
                            className="w-full dark-nav-pill hover:bg-black text-white text-xs font-extrabold py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                        >
                            <FiShield className="text-[#BEF264] text-sm" />
                            <span>Report Safety Issue</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature 3 MODAL: Leave Request to Project Site Engineer */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
                                    <FiCalendar />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-[#03020A]">Apply for Leave</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Recipient: <strong className="text-[#7C3AED]">{assignedProject.engineer}</strong></p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLeaveModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleLeaveSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Leave Date</label>
                                <input
                                    type="date"
                                    required
                                    value={leaveForm.date}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
                                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Leave</label>
                                <select
                                    value={leaveForm.reason}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                                >
                                    <option value="Medical Leave">Medical Leave</option>
                                    <option value="Personal Leave">Personal Leave</option>
                                    <option value="Family Emergency">Family Emergency</option>
                                    <option value="Scheduled Rest Day">Scheduled Rest Day</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Additional Notes (Optional)</label>
                                <textarea
                                    rows="3"
                                    value={leaveForm.notes}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, notes: e.target.value })}
                                    placeholder="Provide brief details for Site Engineer..."
                                    className="w-full bg-white border border-purple-100 rounded-2xl p-3 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                                ></textarea>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLeaveModal(false)}
                                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="dark-nav-pill px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <FiSend className="text-[#BEF264]" />
                                    <span>Send to Site Engineer</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Feature 4 MODAL: Report Safety Issue */}
            {showSafetyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card w-full max-w-md p-6 rounded-[32px] border border-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">
                                    <FiAlertTriangle />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-[#03020A]">Report Safety Hazard</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Alert Supervisor & Safety Officer</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSafetyModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSafetySubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Hazard Category</label>
                                <select
                                    value={safetyForm.hazardType}
                                    onChange={(e) => setSafetyForm({ ...safetyForm, hazardType: e.target.value })}
                                    className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                                >
                                    <option value="Scaffolding Hazard">Unstable Scaffolding / Height Hazard</option>
                                    <option value="Equipment Failure">Equipment & Power Tool Defect</option>
                                    <option value="PPE Missing">Missing Safety Gear / PPE Issue</option>
                                    <option value="Electrical Hazard">Exposed Electrical Wiring</option>
                                    <option value="General Hazard">General Site Safety Obstruction</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Hazard Description</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={safetyForm.description}
                                    onChange={(e) => setSafetyForm({ ...safetyForm, description: e.target.value })}
                                    placeholder="Describe the dangerous condition on site..."
                                    className="w-full bg-white border border-purple-100 rounded-2xl p-3 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                                ></textarea>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSafetyModal(false)}
                                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <FiAlertTriangle className="text-white" />
                                    <span>Submit Safety Alert</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Feature MODAL: Assigned Site Project Details */}
            {showProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card w-full max-w-lg p-6 rounded-[32px] border border-white shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#C4B5FD] flex items-center justify-center text-white text-lg shadow-md">
                                    <FiMapPin />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-[#03020A] tracking-tight">{assignedProject.name}</h3>
                                    <p className="text-xs text-purple-600 font-bold">{assignedProject.fullTitle}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowProjectModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
                            >
                                <FiX />
                            </button>
                        </div>

                        {hasAssignedSite ? (
                            <div className="space-y-4 text-xs font-medium text-slate-700">
                                {/* Status & Location Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/80 p-3 rounded-2xl border border-purple-100 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location / Zone</span>
                                        <p className="font-extrabold text-[#03020A]">{assignedProject.location}</p>
                                    </div>
                                    <div className="bg-white/80 p-3 rounded-2xl border border-purple-100 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Site Engineer</span>
                                        <p className="font-extrabold text-[#7C3AED]">{assignedProject.engineer}</p>
                                    </div>
                                </div>

                                {/* Progress Bar & Schedule */}
                                <div className="bg-white/80 p-4 rounded-2xl border border-purple-100 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#03020A]">Overall Project Completion</span>
                                        <span className="font-extrabold text-[#7C3AED]">{assignedProject.completion}%</span>
                                    </div>
                                    <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#7C3AED] to-[#BEF264] h-full rounded-full" style={{ width: `${assignedProject.completion}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                                        <span>Target Deadline: <strong className="text-slate-700">{assignedProject.deadline}</strong></span>
                                        <span>Shift Hours: <strong className="text-slate-700">{assignedProject.shiftSchedule}</strong></span>
                                    </div>
                                </div>

                                {/* Worker Assigned Role by Site Engineer */}
                                <div className="bg-[#F0FDC2]/60 border border-[#BEF264] p-4 rounded-2xl space-y-1">
                                    <span className="text-[10px] font-extrabold text-[#3F6212] uppercase tracking-wider block">Worker Assigned Role</span>
                                    <p className="font-extrabold text-[#03020A] text-sm flex items-center gap-2 pt-0.5">
                                        <FaHelmetSafety className="text-[#7C3AED] text-base" />
                                        <span>{assignedProject.workerRole}</span>
                                    </p>
                                    <p className="text-[11px] text-slate-600 font-semibold pt-1">
                                        Assigned & Authorized By: <strong className="text-[#7C3AED]">{assignedProject.engineer}</strong>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-center">
                                <FiAlertCircle className="text-amber-600 text-2xl mx-auto" />
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950">No Project Site Assigned</h4>
                                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                                    You are currently not assigned to any active project site roster. Please contact the Admin to assign you to a project site (e.g. Marina Tower or Metro Line Extension).
                                </p>
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowProjectModal(false)}
                                className="dark-nav-pill px-6 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkerDashboard;


