import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('buildos_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const envAdminEmail = (import.meta.env.ADMIN_EMAIL || import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
    const envAdminPassword = import.meta.env.ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSWORD || '123456';

    useEffect(() => {
        if (user) {
            localStorage.setItem('buildos_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('buildos_user');
        }
    }, [user]);

    const login = (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        
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
            const existingProfile = localStorage.getItem(profileKey);
            let profileData = {};
            try {
                if (existingProfile) profileData = JSON.parse(existingProfile);
            } catch {
                profileData = {};
            }

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
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('buildos_user');
    };

    const updateProfile = (updatedFields) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            const updated = { ...prevUser, ...updatedFields };
            if (updated.role === 'worker') {
                const profileKey = `buildos_worker_profile_${prevUser.email.toLowerCase()}`;
                localStorage.setItem(profileKey, JSON.stringify(updated));
            }
            localStorage.setItem('buildos_user', JSON.stringify(updated));
            return updated;
        });
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, adminCredentials: { email: envAdminEmail, password: envAdminPassword } }}>
            {children}
        </AuthContext.Provider>
    );
};

export { default as useAuth } from './useAuth';
export default AuthProvider;
