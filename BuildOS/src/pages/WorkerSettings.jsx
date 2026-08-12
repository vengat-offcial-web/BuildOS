import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card } from '../components/ui';
import {
    FiUser,
    FiMail,
    FiLock,
    FiSun,
    FiSave,
    FiCheckCircle,
    FiAlertCircle,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';

function WorkerSettings() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [theme, setTheme] = useState(user?.theme || 'dark');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!name.trim()) {
            setMessage({ type: 'error', text: 'Name cannot be empty.' });
            return;
        }

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Email cannot be empty.' });
            return;
        }

        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const updatedData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                theme
            };

            if (password) {
                updatedData.password = password;
            }

            const res = updateProfile(updatedData);
            setLoading(false);

            if (res.success) {
                setMessage({ type: 'success', text: 'Worker profile and settings updated successfully!' });
                setPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        }, 300);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <PageHeader
                title="Worker Profile & Settings"
                description="Update your personal information, email address, password, and portal theme preferences."
            />

            {/* Notification Banner */}
            {message.text && (
                <div className={`p-4 rounded-xl text-sm flex items-start gap-3 border transition-all ${
                    message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                    {message.type === 'success' ? (
                        <FiCheckCircle className="text-lg shrink-0 mt-0.5" />
                    ) : (
                        <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Profile Details Card */}
                <Card className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FiUser className="text-emerald-400 text-lg" />
                        <h3 className="text-base font-bold text-slate-100">Personal Account Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Worker Name Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FiUser className="text-base" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Worker Email Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FiMail className="text-base" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="worker@buildos.com"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Password Change Card */}
                <Card className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FiLock className="text-emerald-400 text-lg" />
                        <h3 className="text-base font-bold text-slate-100">Security & Password</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                New Password (Leave blank to keep current)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FiLock className="text-base" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-11 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FiLock className="text-base" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Theme Preferences Card */}
                <Card className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FiSun className="text-emerald-400 text-lg" />
                        <h3 className="text-base font-bold text-slate-100">Theme Preference</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { id: 'dark', name: 'Dark Slate', border: 'border-blue-500' },
                            { id: 'emerald', name: 'Emerald', border: 'border-emerald-500' },
                            { id: 'indigo', name: 'Indigo Night', border: 'border-indigo-500' },
                            { id: 'teal', name: 'Teal Modern', border: 'border-teal-500' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTheme(t.id)}
                                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                                    theme === t.id
                                        ? `${t.border} bg-slate-800/90 text-white font-bold ring-2 ring-emerald-500/20`
                                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/50'
                                }`}
                            >
                                <p className="text-xs">{t.name}</p>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <FiSave className="text-base" />
                                <span>Save Settings</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default WorkerSettings;
