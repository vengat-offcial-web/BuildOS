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

    const envAdminEmail = (import.meta.env.ADMIN_EMAIL || import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
    const envAdminPassword = import.meta.env.ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSWORD || '123456';

    useEffect(() => {
        safeSetStorage('buildos_user', user);
    }, [user]);

    const login = useCallback((email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        
        if (!cleanEmail || !password) {
            return { success: false, error: 'Please enter both email and password.' };
        }

        if (cleanEmail === envAdminEmail && password === envAdminPassword) {
            const adminUser = {
                email: cleanEmail,
                name: 'VENGADESH V (Admin)',
                role: 'admin',
                title: 'System Administrator',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                theme: 'dark'
            };
            setUser(adminUser);
            return { success: true, role: 'admin' };
        } else {
            const profileKey = `buildos_worker_profile_${cleanEmail}`;
            const profileData = safeGetStorage(profileKey, {});

            const defaultName = cleanEmail.split('@')[0].toUpperCase();
            const workerUser = {
                email: profileData.email || cleanEmail,
                name: profileData.name || `Worker (${defaultName})`,
                role: 'worker',
                title: 'Site Operations Worker',
                theme: profileData.theme || 'dark',
                password: profileData.password || password
            };
            
            setUser(workerUser);
            return { success: true, role: 'worker' };
        }
    }, [envAdminEmail, envAdminPassword]);

    const logout = useCallback(() => {
        setUser(null);
        safeSetStorage('buildos_user', null);
    }, []);

    const updateProfile = useCallback((updatedFields) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            const updated = { ...prevUser, ...updatedFields };
            if (updated.role === 'worker') {
                const profileKey = `buildos_worker_profile_${prevUser.email.toLowerCase()}`;
                safeSetStorage(profileKey, updated);
            }
            safeSetStorage('buildos_user', updated);
            return updated;
        });
        return { success: true };
    }, []);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        updateProfile,
        adminCredentials: { email: envAdminEmail, password: envAdminPassword }
    }), [user, login, logout, updateProfile, envAdminEmail, envAdminPassword]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { useAuth };
export default AuthProvider;