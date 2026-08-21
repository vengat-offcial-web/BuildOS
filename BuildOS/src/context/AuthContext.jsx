import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthContext } from './authContextInstance';
import useAuth from './useAuth';

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
        // Fallback for private browsing or storage quota errors
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => safeGetStorage('buildos_user', null));
    const [registeredWorkers, setRegisteredWorkers] = useState(() => {
        const saved = safeGetStorage('buildos_worker_accounts', null);
        if (saved && Array.isArray(saved) && saved.length > 0) {
            return saved;
        }
        return [
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
    });

    const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL).toLowerCase();
    const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    useEffect(() => {
        safeSetStorage('buildos_user', user);
    }, [user]);

    useEffect(() => {
        safeSetStorage('buildos_worker_accounts', registeredWorkers);
    }, [registeredWorkers]);

    const registerWorker = useCallback((workerData) => {
        const cleanEmail = (workerData.email || '').trim().toLowerCase();
        const password = workerData.password || '';
        const name = (workerData.name || '').trim();
        const tradeRole = workerData.tradeRole || workerData.role || 'Site Operations Worker';

        if (!cleanEmail || !password || !name) {
            return { success: false, error: 'Please enter your Name, Email, and Password.' };
        }

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

        setRegisteredWorkers(prev => [newWorkerAccount, ...prev]);

        // Auto login newly registered worker
        setUser(newWorkerAccount);
        safeSetStorage('buildos_user', newWorkerAccount);

        const profileKey = `buildos_worker_profile_${cleanEmail}`;
        safeSetStorage(profileKey, newWorkerAccount);

        return { success: true, role: 'worker', user: newWorkerAccount };
    }, [registeredWorkers]);

    const login = useCallback((email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();

        if (!cleanEmail || !password) {
            return { success: false, error: 'Please enter both email and password.' };
        }

        const savedAdminUser = safeGetStorage('buildos_admin_credentials', null);
        const adminEmail = (savedAdminUser?.email || envAdminEmail).toLowerCase();

        if (cleanEmail === adminEmail || cleanEmail === envAdminEmail) {
            const savedUser = safeGetStorage('buildos_user', null);
            const activePassword = savedAdminUser?.password || (savedUser && savedUser.role === 'admin' && savedUser.password) || envAdminPassword;

            if (password === activePassword) {
                const adminUser = savedUser ? { ...savedUser, role: 'admin', password: activePassword } : {
                    email: cleanEmail,
                    name: savedAdminUser?.name || 'VENGADESH V (Admin)',
                    role: 'admin',
                    title: savedAdminUser?.title || 'System Administrator',
                    avatar: savedAdminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    theme: 'dark',
                    password: activePassword
                };
                setUser(adminUser);
                safeSetStorage('buildos_admin_credentials', adminUser);
                safeSetStorage('buildos_user', adminUser);
                return { success: true, role: 'admin' };
            } else {
                return { success: false, error: 'Invalid password. Please check your admin credentials.' };
            }
        } else {
            const currentAccounts = safeGetStorage('buildos_worker_accounts', registeredWorkers);
            const existingWorker = (currentAccounts || []).find(w => w.email?.toLowerCase().trim() === cleanEmail);

            if (existingWorker) {
                const profileCache = safeGetStorage(`buildos_worker_profile_${cleanEmail}`, null);
                const activeAccount = profileCache ? { ...existingWorker, ...profileCache } : existingWorker;

                if (activeAccount.password === password || existingWorker.password === password) {
                    setUser(activeAccount);
                    return { success: true, role: 'worker' };
                } else {
                    return { success: false, error: 'Incorrect password for this worker account.' };
                }
            }

            return { success: false, error: 'No account found with this email address. Your worker account may have been removed by the Admin.' };
        }
    }, [envAdminEmail, envAdminPassword, registeredWorkers]);

    const logout = useCallback(() => {
        setUser(null);
        safeSetStorage('buildos_user', null);
    }, []);

    const deleteWorkerAccount = useCallback((identifier) => {
        if (!identifier) return;
        const targetStr = String(identifier).toLowerCase().trim();

        setRegisteredWorkers(prev => {
            const filtered = prev.filter(w => {
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
            safeSetStorage('buildos_worker_accounts', filtered);
            return filtered;
        });

        setUser(prevUser => {
            if (!prevUser || prevUser.role === 'admin') return prevUser;
            const nameMatch = prevUser.name && prevUser.name.toLowerCase().trim() === targetStr;
            const emailMatch = prevUser.email && prevUser.email.toLowerCase().trim() === targetStr;
            const partialMatch = prevUser.name && targetStr.includes(prevUser.name.toLowerCase().trim());

            if (nameMatch || emailMatch || partialMatch) {
                safeSetStorage('buildos_user', null);
                return null;
            }
            return prevUser;
        });
    }, []);

    const updateProfile = useCallback((updatedFields) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            const updated = { ...prevUser, ...updatedFields };
            const oldEmailClean = (prevUser.email || '').toLowerCase().trim();
            const newEmailClean = (updated.email || oldEmailClean).toLowerCase().trim();

            if (updated.role === 'admin' || oldEmailClean === envAdminEmail || newEmailClean === envAdminEmail) {
                safeSetStorage('buildos_admin_credentials', updated);
            }

            if (updated.role === 'worker') {
                const profileKey = `buildos_worker_profile_${oldEmailClean}`;
                safeSetStorage(profileKey, updated);
                if (oldEmailClean !== newEmailClean) {
                    safeSetStorage(`buildos_worker_profile_${newEmailClean}`, updated);
                }

                // Synchronize password and account details with registeredWorkers state & buildos_worker_accounts storage
                setRegisteredWorkers((prevAccounts) => {
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
                    safeSetStorage('buildos_worker_accounts', finalList);
                    return finalList;
                });
            }

            safeSetStorage('buildos_user', updated);
            return updated;
        });
        return { success: true };
    }, [envAdminEmail]);

    const contextValue = useMemo(() => ({
        user,
        login,
        registerWorker,
        logout,
        deleteWorkerAccount,
        updateProfile,
        registeredWorkers,
        adminCredentials: { email: envAdminEmail, password: envAdminPassword }
    }), [user, login, registerWorker, logout, deleteWorkerAccount, updateProfile, registeredWorkers, envAdminEmail, envAdminPassword]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { useAuth };
export default AuthProvider;