import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

function DashboardCard({
    title = "Metric",
    value = "00",
    icon: IconComponent,
    trend = "+4.5%"
}) {
    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xl group-hover:scale-110 transition-transform">
                    {IconComponent ? <IconComponent /> : <FiTrendingUp />}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {value}
                </h3>
            </div>
        </div>
    );
}

export default DashboardCard;