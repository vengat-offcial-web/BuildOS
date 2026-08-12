import React from 'react';

const variantStyles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    neutral: "bg-slate-800 text-slate-400 border-slate-700"
};

export const Badge = ({ children, variant = "info", dot = true, className = "" }) => {
    const style = variantStyles[variant] || variantStyles.info;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${style} ${className}`}>
            {dot && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
            {children}
        </span>
    );
};

export default Badge;
