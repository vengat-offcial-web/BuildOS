import { create } from 'zustand';
import { useNotificationStore } from './useNotificationStore';

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const initialLeaveRequestsData = [
  {
    id: 101,
    workerName: "Marcoo",
    trade: "Senior Structural Specialist",
    site: "Metro Link – B4",
    date: "2026-08-20",
    reason: "Personal Leave",
    status: "Pending Approval",
    engineer: "R. Sharma (Site Engineer)",
    notes: "Family function in hometown",
    submittedTime: "10 mins ago"
  }
];

export const useLeaveRequestStore = create((set, get) => ({
  leaveRequests: safeGetStorage('buildos_leave_requests', initialLeaveRequestsData),

  addLeaveRequest: (reqData) => {
    const newReq = {
      id: Date.now(),
      workerName: reqData.workerName || "Marcoo",
      trade: reqData.trade || "Senior Structural Specialist",
      site: reqData.site || "Metro Link – B4",
      date: reqData.date,
      reason: reqData.reason || "Medical Leave",
      status: "Pending Approval",
      engineer: reqData.engineer || "R. Sharma (Site Engineer)",
      notes: reqData.notes || "",
      submittedTime: "Just Now"
    };

    set(state => {
      const updated = [newReq, ...state.leaveRequests];
      safeSetStorage('buildos_leave_requests', updated);
      return { leaveRequests: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.addNotification(
      `Leave Request: ${newReq.workerName}`,
      `Worker ${newReq.workerName} (${newReq.trade}) requested ${newReq.reason} for ${newReq.date}. ${newReq.notes ? `Note: "${newReq.notes}"` : ''}`,
      "Leave Request",
      "purple",
      "admin",
      newReq.id
    );

    return newReq;
  },

  approveLeaveRequest: (reqId) => {
    const numId = Number(reqId);
    let approvedItem = null;
    const notifStore = useNotificationStore.getState();

    set(state => {
      const updatedReqs = state.leaveRequests.map(r => {
        if (r.id === numId) {
          approvedItem = { ...r, status: "Approved" };
          return approvedItem;
        }
        return r;
      });
      safeSetStorage('buildos_leave_requests', updatedReqs);

      notifStore.setNotifications(prev => prev.filter(n => !(
        n.leaveReqId === numId ||
        (n.category === "Leave Request" && n.target === "admin" && (approvedItem ? n.title.includes(approvedItem.workerName) : true))
      )));

      return { leaveRequests: updatedReqs };
    });

    if (approvedItem) {
      notifStore.addNotification(
        "Leave Request Approved! ✓",
        `Site Engineer R. Sharma approved your ${approvedItem.reason} request for ${approvedItem.date}.`,
        "Leave Request",
        "lime",
        "worker",
        numId,
        approvedItem.workerName
      );
      notifStore.logActivity(`Leave Approved: ${approvedItem.workerName}`, approvedItem.site, 'Status: Approved', 'lime');
    }
  },

  rejectLeaveRequest: (reqId) => {
    const numId = Number(reqId);
    let rejectedItem = null;
    const notifStore = useNotificationStore.getState();

    set(state => {
      const updatedReqs = state.leaveRequests.map(r => {
        if (r.id === numId) {
          rejectedItem = { ...r, status: "Declined" };
          return rejectedItem;
        }
        return r;
      });
      safeSetStorage('buildos_leave_requests', updatedReqs);

      notifStore.setNotifications(prev => prev.filter(n => !(
        n.leaveReqId === numId ||
        (n.category === "Leave Request" && n.target === "admin" && (rejectedItem ? n.title.includes(rejectedItem.workerName) : true))
      )));

      return { leaveRequests: updatedReqs };
    });

    if (rejectedItem) {
      notifStore.addNotification(
        "Leave Request Declined ✕",
        `Site Engineer R. Sharma declined your ${rejectedItem.reason} request for ${rejectedItem.date}. Please check with supervisor.`,
        "Leave Request",
        "purple",
        "worker",
        numId,
        rejectedItem.workerName
      );
      notifStore.logActivity(`Leave Declined: ${rejectedItem.workerName}`, rejectedItem.site, 'Status: Declined', 'purple');
    }
  },

  deleteLeaveRequest: (reqId) => {
    set(state => {
      const updated = state.leaveRequests.filter(r => r.id !== Number(reqId));
      safeSetStorage('buildos_leave_requests', updated);
      return { leaveRequests: updated };
    });
  },

  setLeaveRequests: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.leaveRequests) : updater;
      safeSetStorage('buildos_leave_requests', updated);
      return { leaveRequests: updated };
    });
  }
}));

export default useLeaveRequestStore;
