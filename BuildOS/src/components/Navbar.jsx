import React, { useState } from 'react';
import { FiSearch, FiBell, FiX, FiCheckCircle, FiCheck, FiTrash2, FiFolder, FiCheckSquare } from 'react-icons/fi';
import { useData } from '../context/useData';
import { useAuth } from '../context/useAuth';

export function Navbar({
    searchValue,
    onSearchChange,
    placeholder = "Search Projects...",
    onNotificationClick,
    showSearch = true
}) {
    const { 
        notifications, 
        markNotificationAsRead, 
        markAllNotificationsAsRead, 
        clearNotifications, 
        leaveRequests, 
        approveLeaveRequest, 
        rejectLeaveRequest,
        workers,
        acceptWorkerRegistration,
        rejectWorkerRegistration
    } = useData();
    const { user } = useAuth();
    const [showDrawer, setShowDrawer] = useState(false);

    const isWorkerPortal = !showSearch;

    const visibleNotifications = notifications ? notifications.filter(n => {
        if (isWorkerPortal) {
            if (n.target !== 'worker') return false;
            if (n.recipient) {
                return user?.name && n.recipient.toLowerCase().trim() === user.name.toLowerCase().trim();
            }
            return true;
        }
        return !n.target || n.target === 'admin' || n.target === 'all';
    }) : [];

    const unreadCount = visibleNotifications.filter(n => n.unread).length;

    const handleBellClick = () => {
        if (onNotificationClick) {
            onNotificationClick();
        }
        setShowDrawer(prev => !prev);
    };

    const handleApproveLeave = (n) => {
        const matchingReq = leaveRequests && leaveRequests.find(r => r.id === n.leaveReqId || (r.workerName && n.title.includes(r.workerName)));
        const targetReqId = n.leaveReqId || matchingReq?.id || (leaveRequests && leaveRequests[0]?.id);
        if (targetReqId) {
            approveLeaveRequest(targetReqId);
        }
        markNotificationAsRead(n.id);
    };

    const handleDeclineLeave = (n) => {
        const matchingReq = leaveRequests && leaveRequests.find(r => r.id === n.leaveReqId || (r.workerName && n.title.includes(r.workerName)));
        const targetReqId = n.leaveReqId || matchingReq?.id || (leaveRequests && leaveRequests[0]?.id);
        if (targetReqId) {
            rejectLeaveRequest(targetReqId);
        }
        markNotificationAsRead(n.id);
    };

    const handleAcceptWorker = (n) => {
        acceptWorkerRegistration(n.title || n.message);
        markNotificationAsRead(n.id);
    };

    const handleRejectWorker = (n) => {
        rejectWorkerRegistration(n.title || n.message);
        markNotificationAsRead(n.id);
    };

    return (
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/80 px-6 py-4 flex items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">
            {/* Search Input Pill */}
            {showSearch ? (
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
            ) : (
                <div className="flex-1"></div>
            )}

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
                {/* Notification Trigger Pill */}
                <button 
                    type="button"
                    onClick={handleBellClick}
                    aria-label="Notifications"
                    className="relative p-2.5 rounded-full bg-white border border-purple-100 text-[#03020A] hover:bg-purple-50 transition-all shadow-sm group cursor-pointer"
                >
                    <FiBell className="text-lg text-slate-700 group-hover:text-[#7C3AED] transition-colors" />
                    {unreadCount > 0 && (
                        <>
                            <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ring-2 ring-white shadow-sm">
                                {unreadCount}
                            </span>
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#BEF264] ring-2 ring-white animate-pulse"></span>
                        </>
                    )}
                </button>

                {/* Notifications Popover Drawer */}
                {showDrawer && (
                    <div className="absolute top-12 right-0 z-50 w-80 sm:w-96 glass-card p-5 rounded-[28px] border border-white shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-sm">
                                    <FiBell />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-[#03020A] tracking-tight">Team Notifications</h3>
                                    <p className="text-[10px] text-purple-700 font-bold">{unreadCount} Unread Alerts</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => markAllNotificationsAsRead()}
                                        title="Mark all as read"
                                        className="text-[10px] font-bold text-[#7C3AED] hover:underline px-2 py-1 bg-purple-50 rounded-lg cursor-pointer"
                                    >
                                        Mark Read
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowDrawer(false)}
                                    className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
                                >
                                    <FiX className="text-xs" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                            {visibleNotifications.length > 0 ? (
                                visibleNotifications.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => markNotificationAsRead(n.id)}
                                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 relative ${
                                            n.unread
                                                ? "bg-white border-purple-200 shadow-md"
                                                : "bg-white/60 border-white/80 opacity-75 hover:opacity-100"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]">
                                                    {n.category}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
                                        </div>

                                    {(() => {
                                        const matchingReq = leaveRequests && leaveRequests.find(r => r.id === n.leaveReqId || (r.workerName && n.title.includes(r.workerName)));
                                        const status = n.actionTaken || n.status || matchingReq?.status || 'Pending Approval';

                                        return (
                                            <>
                                                <h4 className="text-xs font-extrabold text-[#03020A] tracking-tight">{n.title}</h4>
                                                <p className="text-[11px] text-slate-600 font-medium leading-snug">{n.message}</p>

                                                {n.category === 'Leave Request' && !isWorkerPortal && (
                                                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-purple-100/60 mt-1">
                                                        {status === 'Approved' ? (
                                                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264] flex items-center gap-1">
                                                                ✓ Approved by Admin
                                                            </span>
                                                        ) : status === 'Declined' ? (
                                                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] flex items-center gap-1">
                                                                ✕ Declined by Admin
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeclineLeave(n);
                                                                    }}
                                                                    className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                                                                >
                                                                    ✕ Decline
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleApproveLeave(n);
                                                                    }}
                                                                    className="dark-nav-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm hover:bg-black transition-all flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <FiCheck className="text-[#BEF264]" />
                                                                    <span>Approve</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {n.category === 'Worker Registration' && !isWorkerPortal && (
                                                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-purple-100/60 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRejectWorker(n);
                                                            }}
                                                            className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                                                        >
                                                            ✕ Decline
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAcceptWorker(n);
                                                            }}
                                                            className="dark-nav-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm hover:bg-black transition-all flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <FiCheck className="text-[#BEF264]" />
                                                            <span>Accept Worker</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-xs font-semibold text-slate-500 bg-white/60 rounded-2xl border border-purple-100">
                                    No notifications received yet.
                                </div>
                            )}
                        </div>

                        {/* Footer Clear Action */}
                        {visibleNotifications.length > 0 && (
                            <div className="pt-1 border-t border-purple-100 flex justify-between items-center text-[11px]">
                                <span className="text-slate-400 font-medium">{isWorkerPortal ? "Admin Dispatches" : "Worker Activity Alerts"}</span>
                                <button
                                    type="button"
                                    onClick={() => clearNotifications()}
                                    className="text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <FiTrash2 className="text-xs" /> Clear All
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

// Backward compatibility export alias
export const Nav = Navbar;

export default Navbar;