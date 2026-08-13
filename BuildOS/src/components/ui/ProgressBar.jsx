import React from 'react';

export const ProgressBar = ({
    progress = 0,
    showLabel = true,
    size = "md",
    variant = "blue",
    className = ""
}) => {
    const heightMap = {
        sm: "h-2",
        md: "h-2.5",
        lg: "h-3"
    };

    const gradientMap = {
        blue: "from-blue-600 to-indigo-500",
        emerald: "from-emerald-500 to-teal-400",
        indigo: "from-indigo-600 to-purple-500",
        multi: "from-blue-600 via-indigo-500 to-emerald-400"
    };

    const gradientClass = gradientMap[variant] || gradientMap.blue;
    const heightClass = heightMap[size] || heightMap.md;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`flex-1 bg-slate-800 ${heightClass} rounded-full overflow-hidden`}>
                <div
                    className={`h-full bg-linear-to-r ${gradientClass} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                ></div>
            </div>
            {showLabel && (
                <span className="text-xs font-mono font-semibold text-slate-300 w-10 text-right">
                    {progress}%
                </span>
            )}
        </div>
    );
};

export default ProgressBar;
