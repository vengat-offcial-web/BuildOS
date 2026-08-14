import React from 'react';

const BUTTON_VARIANTS = {
  purple: 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] shadow-purple-500/25',
  emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
  dark: 'bg-[#03020A] hover:bg-black text-[#BEF264] shadow-black/20',
  blue: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'
};

export function PageHeader({
    title,
    description,
    actionLabel,
    actionIcon: ActionIcon,
    onActionClick,
    variant = 'purple'
}) {
    const buttonStyle = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.purple;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-extrabold text-[#03020A] tracking-tight">{title}</h2>
                {description && <p className="text-xs font-semibold text-slate-500 mt-0.5">{description}</p>}
            </div>
            {actionLabel && (
                <button
                    type="button"
                    onClick={onActionClick}
                    className={`${buttonStyle} text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0`}
                >
                    {ActionIcon && <ActionIcon className="text-base" />}
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
}

export default PageHeader;
