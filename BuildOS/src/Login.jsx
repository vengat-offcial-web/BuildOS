import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useData } from './context/useData';
import { 
    FiMail, 
    FiLock, 
    FiEye, 
    FiEyeOff, 
    FiLogIn, 
    FiUserPlus, 
    FiUser, 
    FiPhone, 
    FiBriefcase, 
    FiCheckCircle, 
    FiAlertCircle 
} from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';

function Login() {
    const { user, login, registerWorker } = useAuth();
    const { addWorker, addNotification } = useData();
    const navigate = useNavigate();

    // Mode state: 'signin' | 'register'
    const [mode, setMode] = useState('signin');

    // Sign In states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Registration states
    const [regName, setRegName] = useState('');
    const [regTrade, setRegTrade] = useState('Site Engineer');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // Shared UI states
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect logged in users
    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/worker/dashboard', { replace: true });
            }
        }
    }, [user, navigate]);

    // Handle Sign In Submit
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
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

    // Handle New Worker Registration Submit
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!regName.trim()) {
            setError('Please enter your Full Name.');
            return;
        }
        if (!regEmail.trim()) {
            setError('Please enter a valid Email Address.');
            return;
        }
        if (!regPhone.trim()) {
            setError('Please enter your Contact Number.');
            return;
        }
        if (!regPassword) {
            setError('Please choose a Password for your worker account.');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const res = registerWorker({
                name: regName,
                tradeRole: regTrade,
                email: regEmail,
                password: regPassword
            });

            setLoading(false);

            if (res.success) {
                // Register newly joined worker in DataContext roster so Admin can see them
                if (addWorker) {
                    addWorker({
                        name: regName,
                        trade: regTrade,
                        site: 'Not Assigned Yet',
                        status: 'Off Duty',
                        attendance: 'Absent',
                        phone: regPhone.trim()
                    });
                }

                // Notify Admin about the newly registered worker
                if (addNotification) {
                    addNotification(
                        `New Worker Registered: ${regName}`,
                        `Worker ${regName} (${regTrade}) registered a new account. Contact: ${regPhone.trim()}. Site: Not Assigned Yet.`,
                        "Worker Registration",
                        "lime",
                        "admin"
                    );
                }

                setSuccessMsg(`Account created for ${regName}! Redirecting to Worker Dashboard...`);

                setTimeout(() => {
                    navigate('/worker/dashboard', { replace: true });
                }, 800);
            } else {
                setError(res.error || 'Registration failed. Please try again.');
            }
        }, 500);
    };

    return (
        <div className="min-h-screen w-full bg-[#F5F5F7] text-[#03020A] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-[#C4B5FD]">
            {/* Background Pastel Glow Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-gradient-to-br from-[#E9D5FF]/50 via-[#C4B5FD]/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[10%] w-125 h-125 bg-gradient-to-tr from-[#F0FDC2]/60 via-[#E4F9A8]/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Main Glass Card */}
                <div className="glass-card p-7 sm:p-8 rounded-[36px] border border-white/90 shadow-[0_20px_50px_rgba(167,139,250,0.15)] space-y-6">
                    
                    {/* Header Logo */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/25 mb-3 ring-4 ring-white">
                            <FaHelmet />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#03020A]">
                            BuildOS Portal
                        </h1>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                            {mode === 'signin' ? 'Sign in to access your worker dashboard' : 'Create new worker account for site access'}
                        </p>
                    </div>

                    {/* Navigation Tabs (Sign In / Register) */}
                    <div className="p-1 rounded-full bg-slate-200/60 border border-white/80 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                setMode('signin');
                                setError('');
                                setSuccessMsg('');
                            }}
                            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                mode === 'signin'
                                    ? 'bg-white text-[#03020A] shadow-md'
                                    : 'text-slate-500 hover:text-[#03020A]'
                            }`}
                        >
                            <FiLogIn className={mode === 'signin' ? 'text-[#7C3AED]' : 'text-slate-400'} />
                            <span>Sign In</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setMode('register');
                                setError('');
                                setSuccessMsg('');
                            }}
                            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                mode === 'register'
                                    ? 'bg-[#7C3AED] text-white shadow-md'
                                    : 'text-slate-500 hover:text-[#03020A]'
                            }`}
                        >
                            <FiUserPlus className={mode === 'register' ? 'text-[#BEF264]' : 'text-slate-400'} />
                            <span>Register Account</span>
                        </button>
                    </div>

                    {/* Alert Banners */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
                            <FiAlertCircle className="text-base shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3.5 rounded-2xl bg-[#F0FDC2] border border-[#BEF264] text-[#3F6212] text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in duration-200">
                            <FiCheckCircle className="text-base shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* MODE A: SIGN IN FORM */}
                    {mode === 'signin' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                                        placeholder="Enter your email address"
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
                                        placeholder="Enter your password"
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

                            {/* Submit Sign In Button */}
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
                                        <span>Sign In to Worker Portal</span>
                                    </>
                                )}
                            </button>

                            {/* Toggle Link */}
                            <div className="pt-2 text-center text-xs font-medium text-slate-500">
                                Newly joined worker?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('register');
                                        setError('');
                                    }}
                                    className="font-extrabold text-[#7C3AED] hover:underline cursor-pointer"
                                >
                                    Create New Account
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* MODE B: NEW WORKER REGISTRATION FORM */
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                        <FiUser className="text-base" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full bg-white/90 border border-purple-100 rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Worker Role / Trade Specialization */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Worker Assigned Role / Trade <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                        <FaHelmet className="text-base" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={regTrade}
                                        onChange={(e) => setRegTrade(e.target.value)}
                                        placeholder="Enter your worker role"
                                        className="w-full bg-white/90 border border-purple-100 rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Contact Number <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                        <FiPhone className="text-base" />
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        value={regPhone}
                                        onChange={(e) => setRegPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="w-full bg-white/90 border border-purple-100 rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Email Address <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                        <FiMail className="text-base" />
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full bg-white/90 border border-purple-100 rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Set Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                                        <FiLock className="text-base" />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        placeholder="Create a password"
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

                            {/* Submit Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-3.5 px-4 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <FiUserPlus className="text-base text-[#BEF264]" />
                                        <span>Create New Worker Account</span>
                                    </>
                                )}
                            </button>

                            {/* Toggle Link */}
                            <div className="pt-2 text-center text-xs font-medium text-slate-500">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('signin');
                                        setError('');
                                    }}
                                    className="font-extrabold text-[#7C3AED] hover:underline cursor-pointer"
                                >
                                    Sign In Here
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Login;