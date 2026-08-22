import { create } from 'zustand';

const safeGetStorage = (key, fallback = null) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

const safeSetStorage = (key, value) => {
    try {
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch {
        // Storage quota / private mode fallback
    }
};

const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL).toLowerCase();
const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

const defaultWorkers = [
    {
        email: 'marcoo@buildos.com',
        password: '123',
        name: 'Marcoo',
        tradeRole: 'Senior Structural Specialist',
        role: 'worker',
        title: 'Senior Structural Specialist',
        site: 'Metro Link – B4'
    }
];

export const useAuthStore = create((set, get) => ({
    user: (() => {
        // Clean up any legacy admin credentials stored in localStorage
        try {
            localStorage.removeItem('buildos_admin_credentials');
        } catch { }

        const saved = safeGetStorage('buildos_user', null);
        if (saved) {
            delete saved.password;
            if (saved.role === 'admin') {
                return {
                    ...saved,
                    email: envAdminEmail
                };
            }
        }
        return saved;
    })(),
    registeredWorkers: (() => {
        const saved = safeGetStorage('buildos_worker_accounts', null);
        if (saved && Array.isArray(saved) && saved.length > 0) return saved;
        return defaultWorkers;
    })(),
    adminCredentials: { email: envAdminEmail, password: envAdminPassword },

    login: (email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        if (!cleanEmail || !password) {
            return { success: false, error: 'Please enter both email and password.' };
        }

        if (cleanEmail === envAdminEmail) {
            if (password === envAdminPassword) {
                const savedUser = safeGetStorage('buildos_user', null);
                const savedAdminProfile = safeGetStorage('buildos_admin_profile', null);

                const adminUser = {
                    name: savedAdminProfile?.name || (savedUser?.role === 'admin' ? savedUser.name : null) || 'VENGADESH V (Admin)',
                    role: 'admin',
                    email: envAdminEmail,
                    title: savedAdminProfile?.title || (savedUser?.role === 'admin' ? savedUser.title : null) || 'System Administrator',
                    avatar: savedAdminProfile?.avatar || (savedUser?.role === 'admin' ? savedUser.avatar : null) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    theme: savedAdminProfile?.theme || (savedUser?.role === 'admin' ? savedUser.theme : null) || 'dark',
                    phone: savedAdminProfile?.phone || (savedUser?.role === 'admin' ? savedUser.phone : null) || '',
                    company: savedAdminProfile?.company || (savedUser?.role === 'admin' ? savedUser.company : null) || ''
                };

                set({ user: adminUser });

                // Remove legacy credentials key from localStorage
                try {
                    localStorage.removeItem('buildos_admin_credentials');
                } catch { }

                // Save active session in localStorage WITHOUT email or password for admin
                const storageUser = {
                    name: adminUser.name,
                    role: 'admin',
                    title: adminUser.title,
                    avatar: adminUser.avatar,
                    theme: adminUser.theme,
                    phone: adminUser.phone,
                    company: adminUser.company
                };
                safeSetStorage('buildos_user', storageUser);

                return { success: true, role: 'admin' };
            } else {
                return { success: false, error: 'Invalid password. Please check your admin credentials.' };
            }
        } else {
            const registeredWorkers = get().registeredWorkers;
            const currentAccounts = safeGetStorage('buildos_worker_accounts', registeredWorkers);
            const existingWorker = (currentAccounts || []).find(w => w.email?.toLowerCase().trim() === cleanEmail);

            if (existingWorker) {
                const profileCache = safeGetStorage(`buildos_worker_profile_${cleanEmail}`, null);
                const activeAccount = profileCache ? { ...existingWorker, ...profileCache } : existingWorker;

                if (activeAccount.password === password || existingWorker.password === password) {
                    const sessionWorker = { ...activeAccount };
                    delete sessionWorker.password;
                    set({ user: sessionWorker });
                    safeSetStorage('buildos_user', sessionWorker);
                    return { success: true, role: 'worker' };
                } else {
                    return { success: false, error: 'Incorrect password for this worker account.' };
                }
            }

            return { success: false, error: 'No account found with this email address. Your worker account may have been removed by the Admin.' };
        }
    },

    registerWorker: (workerData) => {
        const cleanEmail = (workerData.email || '').trim().toLowerCase();
        const password = workerData.password || '';
        const name = (workerData.name || '').trim();
        const tradeRole = workerData.tradeRole || workerData.role || 'Site Operations Worker';

        if (!cleanEmail || !password || !name) {
            return { success: false, error: 'Please enter your Name, Email, and Password.' };
        }

        const registeredWorkers = get().registeredWorkers;
        if (registeredWorkers.some(w => w.email === cleanEmail)) {
            return { success: false, error: 'An account with this email address already exists. Please Sign In.' };
        }

        const newWorkerAccount = {
            email: cleanEmail,
            password: password,
            name: name,
            tradeRole: tradeRole,
            role: 'worker',
            title: tradeRole,
            site: 'Not Assigned Yet',
            theme: 'dark'
        };

        const updatedList = [newWorkerAccount, ...registeredWorkers];
        const sessionWorker = { ...newWorkerAccount };
        delete sessionWorker.password;

        set({ registeredWorkers: updatedList, user: sessionWorker });
        safeSetStorage('buildos_worker_accounts', updatedList);
        safeSetStorage('buildos_user', sessionWorker);

        const profileKey = `buildos_worker_profile_${cleanEmail}`;
        safeSetStorage(profileKey, newWorkerAccount);

        return { success: true, role: 'worker', user: sessionWorker };
    },

    logout: () => {
        set({ user: null });
        safeSetStorage('buildos_user', null);
        try {
            localStorage.removeItem('buildos_admin_credentials');
        } catch { }
    },

    deleteWorkerAccount: (identifier) => {
        if (!identifier) return;
        const targetStr = String(identifier).toLowerCase().trim();

        const currentWorkers = get().registeredWorkers;
        const filteredWorkers = currentWorkers.filter(w => {
            const nameMatch = w.name && w.name.toLowerCase().trim() === targetStr;
            const emailMatch = w.email && w.email.toLowerCase().trim() === targetStr;
            const partialMatch = w.name && targetStr.includes(w.name.toLowerCase().trim());
            if (nameMatch || emailMatch || partialMatch) {
                if (w.email) {
                    try {
                        localStorage.removeItem(`buildos_worker_profile_${w.email.toLowerCase()}`);
                    } catch { }
                }
                return false;
            }
            return true;
        });

        safeSetStorage('buildos_worker_accounts', filteredWorkers);

        const prevUser = get().user;
        let newUser = prevUser;
        if (prevUser && prevUser.role !== 'admin') {
            const nameMatch = prevUser.name && prevUser.name.toLowerCase().trim() === targetStr;
            const emailMatch = prevUser.email && prevUser.email.toLowerCase().trim() === targetStr;
            const partialMatch = prevUser.name && targetStr.includes(prevUser.name.toLowerCase().trim());

            if (nameMatch || emailMatch || partialMatch) {
                safeSetStorage('buildos_user', null);
                newUser = null;
            }
        }

        set({ registeredWorkers: filteredWorkers, user: newUser });
    },

    updateProfile: (updatedFields) => {
        const prevUser = get().user;
        if (!prevUser) return { success: false };

        const updated = { ...prevUser, ...updatedFields };
        delete updated.password;

        if (updated.role === 'admin') {
            const adminProfileToSave = {
                name: updated.name,
                title: updated.title,
                avatar: updated.avatar,
                phone: updated.phone,
                company: updated.company,
                theme: updated.theme
            };
            safeSetStorage('buildos_admin_profile', adminProfileToSave);

            try {
                localStorage.removeItem('buildos_admin_credentials');
            } catch { }

            // Save active user session WITHOUT email or password for admin
            const storageUser = {
                role: 'admin',
                ...adminProfileToSave
            };
            safeSetStorage('buildos_user', storageUser);
        } else {
            const oldEmailClean = (prevUser.email || '').toLowerCase().trim();
            const newEmailClean = (updated.email || oldEmailClean).toLowerCase().trim();

            const profileKey = `buildos_worker_profile_${oldEmailClean}`;
            safeSetStorage(profileKey, updated);
            if (oldEmailClean !== newEmailClean) {
                safeSetStorage(`buildos_worker_profile_${newEmailClean}`, updated);
            }

            const prevAccounts = get().registeredWorkers;
            const currentAccounts = Array.isArray(prevAccounts) && prevAccounts.length > 0
                ? prevAccounts
                : safeGetStorage('buildos_worker_accounts', []);

            let matchFound = false;
            const updatedList = (currentAccounts || []).map(acc => {
                const accEmail = (acc.email || '').toLowerCase().trim();
                if (accEmail === oldEmailClean || accEmail === newEmailClean) {
                    matchFound = true;
                    return { ...acc, ...updatedFields };
                }
                return acc;
            });

            const finalList = matchFound ? updatedList : [updated, ...updatedList];
            set({ registeredWorkers: finalList });
            safeSetStorage('buildos_worker_accounts', finalList);
            safeSetStorage('buildos_user', updated);
        }

        set({ user: updated });
        return { success: true };
    }
}));

export default useAuthStore;
