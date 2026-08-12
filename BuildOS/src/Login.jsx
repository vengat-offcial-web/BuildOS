import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiShield, FiAlertCircle, FiUserCheck } from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';

function Login() {
    const { user, login, adminCredentials } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If user is already logged in, redirect them
    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/worker/dashboard', { replace: true });
            }
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const res = login(email, password);
            setLoading(false);

            if (res.success) {
                if (res.role === 'admin') {
                    navigate('/dashboard', { replace: true });
                } else {
                    navigate('/worker/dashboard', { replace: true });
                }
            } else {
                setError(res.error || 'Invalid credentials');
            }
        }, 400);
    };

    const handleQuickFill = (roleType) => {
        setError('');
        if (roleType === 'admin') {
            setEmail(adminCredentials.email || 'admin@gmail.com');
            setPassword(adminCredentials.password || '123456');
        } else {
            setEmail('worker@buildos.com');
            setPassword('worker123');
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-blue-500 selection:text-white">
            {/* Background Aesthetic Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Main Card */}
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80">
                    
                    {/* Header Logo */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-500/30 mb-4 ring-4 ring-blue-500/10">
                            <FaHelmetSafety />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Welcome to BuildOS
                        </h1>
                        <p className="text-sm text-slate-400 mt-1 font-medium">
                            Construction Operations System
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-shake">
                            <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FiMail className="text-lg" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@buildos.com"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FiLock className="text-lg" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-3 pl-10 pr-11 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <FiLogIn className="text-lg" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Credentials Assistant */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <FiShield className="text-blue-400" />
                            <span>Demo Role Autofill (.env configured)</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => handleQuickFill('admin')}
                                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition-all text-left group cursor-pointer"
                            >
                                <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-1">
                                    <span>Admin Role</span>
                                    <FiUserCheck className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono truncate">{adminCredentials.email || 'admin@gmail.com'}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Pass: {adminCredentials.password || '123456'}</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickFill('worker')}
                                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
                            >
                                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                                    <span>Worker Role</span>
                                    <FiUserCheck className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono truncate">worker@buildos.com</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Pass: worker123</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                    BuildOS Construction Management • Protected & Encrypted Session
                </p>
            </div>
        </div>
    );
}

export default Login;