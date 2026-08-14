import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const BADGE_STYLES = {
    lime: "bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]",
    purple: "bg-[#E9D5FF] text-[#6B21A8] border border-[#D8B4FE]",
    yellow: "bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]",
    rose: "bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
};

const ICON_BG_STYLES = {
    purple: "bg-gradient-to-tr from-[#E9D5FF] to-[#C4B5FD] text-[#6B21A8]",
    lime: "bg-gradient-to-tr from-[#F0FDC2] to-[#D9F99D] text-[#3F6212]",
    dark: "bg-[#03020A] text-white"
};

export function DashboardCard({
    title = "Metric",
    value = "00",
    icon: IconComponent,
    subtitle = "+12% this month",
    badgeType = "lime",
    accentColor = "purple",
    className = ""
}) {
    const badgeStyle = BADGE_STYLES[badgeType] || BADGE_STYLES.lime;
    const iconBgStyle = ICON_BG_STYLES[accentColor] || ICON_BG_STYLES.purple;

    return (
        <div className={`glass-card glass-card-hover p-6 rounded-[28px] border border-white/90 shadow-[0_10px_30px_rgba(167,139,250,0.06)] flex flex-col justify-between group ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${iconBgStyle} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {IconComponent ? <IconComponent /> : <FiTrendingUp />}
                </div>
                {subtitle && (
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${badgeStyle}`}>
                        {subtitle}
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-[#03020A] tracking-tight group-hover:text-[#7C3AED] transition-colors">
                    {value}
                </h3>
            </div>
        </div>
    );
}

export default DashboardCard;