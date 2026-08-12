import React from 'react';

export const PageHeader = ({
    title,
    description,
    actionLabel,
    actionIcon: ActionIcon,
    onActionClick
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">{title}</h2>
                {description && <p className="text-sm text-slate-400">{description}</p>}
            </div>
            {actionLabel && (
                <button
                    onClick={onActionClick}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                    {ActionIcon && <ActionIcon className="text-lg" />}
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
};

export default PageHeader;
