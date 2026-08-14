import React from 'react';

const VARIANTS = {
  completed: 'badge-completed text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  success: 'badge-completed text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  'in-progress': 'badge-in-progress text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  info: 'badge-in-progress text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  pending: 'badge-pending text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  warning: 'badge-pending text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  overdue: 'badge-overdue text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
  danger: 'badge-overdue text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm',
};

export function Badge({ children, variant = 'info', className = '' }) {
  const normalizedVariant = String(variant).toLowerCase().replace(/\s+/g, '-');
  const badgeStyle = VARIANTS[normalizedVariant] || VARIANTS.info;

  return (
    <span className={`${badgeStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {children}
    </span>
  );
}

export default Badge;
