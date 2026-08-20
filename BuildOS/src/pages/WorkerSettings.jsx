import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card } from '../components/ui';
import {
    FiUser,
    FiMail,
    FiLock,
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
    const [theme, setTheme] = useState(user?.theme || 'purple');
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
        <div className="space-y-6 max-w-4xl pb-8">
            <PageHeader
                title="Worker Profile & Settings"
                description="Update your personal information, email address, and security credentials."
                variant="purple"
            />

            {/* Notification Banner */}
            {message.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border shadow-xs transition-all ${
                    message.type === 'success'
                        ? 'bg-[#F0FDC2] border-[#BEF264] text-[#3F6212]'
                        : 'bg-[#FFE4E6] border-[#FECDD3] text-[#9F1239]'
                }`}>
                    {message.type === 'success' ? (
                        <FiCheckCircle className="text-base shrink-0" />
                    ) : (
                        <FiAlertCircle className="text-base shrink-0" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Profile Details Card */}
                <Card hover={false} className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
                        <FiUser className="text-[#7C3AED] text-base" />
                        <h3 className="text-base font-extrabold text-[#03020A]">Personal Account Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Worker Name Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                    <FiUser className="text-sm" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-4 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Worker Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                    <FiMail className="text-sm" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="worker@buildos.com"
                                    className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-4 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Password Change Card */}
                <Card hover={false} className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
                        <FiLock className="text-[#7C3AED] text-base" />
                        <h3 className="text-base font-extrabold text-[#03020A]">Security & Password</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                New Password (Leave blank to keep current)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                    <FiLock className="text-sm" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-11 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-600 cursor-pointer"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                    <FiLock className="text-sm" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-4 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="dark-nav-pill px-6 py-3 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <FiSave className="text-sm text-[#BEF264]" />
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

