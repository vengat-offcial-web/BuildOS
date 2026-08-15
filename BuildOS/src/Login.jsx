import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { FaHelmetSafety } from 'react-icons/fa6';

function Login() {
    const { user, login } = useAuth();
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

    return (
        <div className="min-h-screen w-full bg-[#F5F5F7] text-[#03020A] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-[#C4B5FD]">
            {/* Background Pastel Glow Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-linear-to-br from-[#E9D5FF]/50 via-[#C4B5FD]/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[10%] w-125 h-125 bg-linear-to-tr from-[#F0FDC2]/60 via-[#E4F9A8]/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Main Glass Card */}
                <div className="glass-card p-8 rounded-[36px] border border-white/90 shadow-[0_20px_50px_rgba(167,139,250,0.15)]">
                    
                    {/* Header Logo */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/25 mb-4 ring-4 ring-white">
                            <FaHelmetSafety />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#03020A]">
                            Welcome to BuildOS
                        </h1>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-3">
                            <FiAlertCircle className="text-base shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                    <FiMail className="text-base" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter the mail"
                                    className="w-full bg-white/90 border border-purple-100 rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                    <FiLock className="text-base" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/90 border border-purple-100 rounded-2xl py-3 pl-10 pr-11 text-[#03020A] placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#03020A] transition-colors"
                                >
                                    {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 px-4 rounded-full dark-nav-pill hover:bg-black text-white font-extrabold text-xs shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <FiLogIn className="text-base text-[#BEF264]" />
                                    <span>Sign In to BuildOS</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;