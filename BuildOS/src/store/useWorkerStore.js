import { create } from 'zustand';
import { initialWorkersData } from '../data';
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

const initialWorkers = (() => {
  const saved = safeGetStorage('buildos_workers', null);
  const list = (saved && Array.isArray(saved) && saved.length > 0) ? saved : initialWorkersData;
  return list.map(w => {
    if (!w) return w;
    const siteClean = (w.site || '').toLowerCase().trim();
    if (siteClean.includes('theme park')) {
      return {
        ...w,
        site: 'Not Assigned Yet',
        cancellationNotice: 'your assigned project was cancelled by admin',
        statusNote: 'your assigned project was cancelled by admin',
        siteStatus: 'Cancelled by Admin'
      };
    }
    return w;
  });
})();

export const useWorkerStore = create((set, get) => ({
  workers: initialWorkers,

  get totalWorkersCount() {
    return get().workers.length;
  },

  addWorker: (workerData) => {
    const newWorker = {
      id: Date.now(),
      name: workerData.name,
      trade: workerData.trade || 'General Construction Specialist',
      site: workerData.site || 'Not Assigned Yet',
      status: workerData.status || 'Off Duty',
      attendance: workerData.attendance || 'Absent',
      phone: workerData.phone || '',
      approvalStatus: workerData.approvalStatus || 'Pending Approval'
    };

    set(state => {
      const updated = [newWorker, ...state.workers];
      safeSetStorage('buildos_workers', updated);
      return { workers: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Worker Registered: ${newWorker.name}`, newWorker.site, 'Roster Updated', 'lime');

    if (newWorker.approvalStatus === 'Pending Approval') {
      notifStore.addNotification(
        `New Worker Registration: ${newWorker.name}`,
        `Worker ${newWorker.name} (${newWorker.trade}, Contact: ${newWorker.phone || 'N/A'}) registered a new account and requires Admin approval.`,
        "Worker Registration",
        "purple",
        "admin"
      );
    }

    return newWorker;
  },

  acceptWorkerRegistration: (identifier) => {
    let targetName = '';
    const idStr = String(identifier).toLowerCase().trim();
    const notifStore = useNotificationStore.getState();

    set(state => {
      const updatedWorkers = state.workers.map(w => {
        const isMatch = w.id === Number(identifier) ||
                        (w.name && w.name.toLowerCase().trim() === idStr) ||
                        (w.name && idStr.includes(w.name.toLowerCase().trim()));
        if (isMatch) {
          targetName = w.name;
          return { ...w, approvalStatus: 'Approved', status: 'Off Duty' };
        }
        return w;
      });
      safeSetStorage('buildos_workers', updatedWorkers);

      notifStore.setNotifications(prev => prev.filter(n => !(
        n.category === "Worker Registration" &&
        n.target === "admin" &&
        (targetName ? n.title.toLowerCase().includes(targetName.toLowerCase()) || n.message.toLowerCase().includes(targetName.toLowerCase()) : true)
      )));

      return { workers: updatedWorkers };
    });

    if (targetName) {
      notifStore.addNotification(
        "Worker Registration Accepted! ✓",
        `Admin accepted your worker account registration (${targetName}). You can now clock into shifts on your dashboard.`,
        "Worker Registration",
        "lime",
        "worker",
        null,
        targetName
      );
      notifStore.logActivity(`Worker Account Accepted: ${targetName}`, 'Site Roster', 'Account Approved', 'lime');
    }
  },

  rejectWorkerRegistration: (identifier) => {
    let targetName = '';
    const idStr = String(identifier).toLowerCase().trim();
    const notifStore = useNotificationStore.getState();

    set(state => {
      const updatedWorkers = state.workers.map(w => {
        const isMatch = w.id === Number(identifier) ||
                        (w.name && w.name.toLowerCase().trim() === idStr) ||
                        (w.name && idStr.includes(w.name.toLowerCase().trim()));
        if (isMatch) {
          targetName = w.name;
          return { ...w, approvalStatus: 'Declined', status: 'Off Duty' };
        }
        return w;
      });
      safeSetStorage('buildos_workers', updatedWorkers);

      notifStore.setNotifications(prev => prev.filter(n => !(
        n.category === "Worker Registration" &&
        n.target === "admin" &&
        (targetName ? n.title.toLowerCase().includes(targetName.toLowerCase()) || n.message.toLowerCase().includes(targetName.toLowerCase()) : true)
      )));

      return { workers: updatedWorkers };
    });

    if (targetName) {
      notifStore.addNotification(
        "Worker Registration Declined ✕",
        `Admin declined your registration request for ${targetName}. Please contact your site supervisor.`,
        "Worker Registration",
        "purple",
        "worker",
        null,
        targetName
      );
      notifStore.logActivity(`Worker Account Declined: ${targetName}`, 'Site Roster', 'Account Declined', 'purple');
    }
  },

  updateWorker: (id, updatedFields) => {
    set(state => {
      const updatedWorkers = state.workers.map(w => {
        if (w.id === Number(id) || w.name?.toLowerCase().trim() === String(id).toLowerCase().trim()) {
          const merged = { ...w, ...updatedFields };
          const siteClean = (merged.site || '').toLowerCase().trim();
          if (siteClean && siteClean !== 'not assigned yet' && siteClean !== 'unassigned' && siteClean !== 'cancelled by admin') {
            merged.cancellationNotice = null;
            merged.statusNote = null;
            merged.siteStatus = null;
          }
          return merged;
        }
        return w;
      });
      safeSetStorage('buildos_workers', updatedWorkers);
      return { workers: updatedWorkers };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Worker Updated: ${updatedFields.name || 'Worker'}`, updatedFields.site || 'Site', 'Details Saved', 'lime');
  },

  deleteWorker: (identifier) => {
    if (!identifier) return;
    const idStr = String(identifier).toLowerCase().trim();
    const idNum = Number(identifier);

    const deletedEmails = [];
    const deletedNames = [];

    set(state => {
      const filteredWorkers = state.workers.filter(w => {
        const matchId = w.id === identifier || w.id === idNum;
        const matchName = w.name && w.name.toLowerCase().trim() === idStr;
        const matchPartial = w.name && idStr.includes(w.name.toLowerCase().trim());
        if (matchId || matchName || matchPartial) {
          if (w.email) deletedEmails.push(w.email.toLowerCase().trim());
          if (w.name) deletedNames.push(w.name.toLowerCase().trim());
          return false;
        }
        return true;
      });
      safeSetStorage('buildos_workers', filteredWorkers);
      return { workers: filteredWorkers };
    });

    try {
      const savedAccounts = safeGetStorage('buildos_worker_accounts', []);
      if (Array.isArray(savedAccounts)) {
        const remainingAccounts = savedAccounts.filter(acc => {
          const accEmail = acc.email?.toLowerCase().trim();
          const accName = acc.name?.toLowerCase().trim();

          const isDeletedByEmail = Boolean(accEmail && (accEmail === idStr || deletedEmails.includes(accEmail)));
          const isDeletedByName = Boolean(accName && (accName === idStr || deletedNames.includes(accName) || idStr.includes(accName)));

          if (isDeletedByEmail || isDeletedByName) {
            if (accEmail) {
              try {
                localStorage.removeItem(`buildos_worker_profile_${accEmail}`);
              } catch {}
            }
            return false;
          }
          return true;
        });
        safeSetStorage('buildos_worker_accounts', remainingAccounts);
      }
    } catch {}

    try {
      const activeUser = safeGetStorage('buildos_user', null);
      if (activeUser && activeUser.role === 'worker') {
        const uEmail = activeUser.email?.toLowerCase().trim();
        const uName = activeUser.name?.toLowerCase().trim();
        if (uEmail === idStr || uName === idStr || (uEmail && deletedEmails.includes(uEmail)) || (uName && deletedNames.includes(uName))) {
          localStorage.removeItem('buildos_user');
        }
      }
    } catch {}

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Worker Permanently Deleted`, `Identifier: ${identifier}`, 'Purged from Application', 'purple');
    return { deletedEmails, deletedNames, idStr, idNum };
  },

  setWorkers: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.workers) : updater;
      safeSetStorage('buildos_workers', updated);
      return { workers: updated };
    });
  }
}));

export default useWorkerStore;
