import React from 'react';

const VARIANT_STYLES = {
  purple: 'glass-hero-purple',
  lime: 'glass-hero-lime',
  dark: 'bg-[#03020A] text-white border border-white/10 rounded-[28px] p-6 shadow-xl',
  default: ''
};

export function Card({ children, className = '', hover = true, variant = 'default' }) {
  const baseClasses = 'glass-card p-6 rounded-[28px] border border-white/90 shadow-[0_10px_30px_rgba(167,139,250,0.06)] relative overflow-hidden';
  const hoverClasses = hover ? 'glass-card-hover' : '';
  const variantClasses = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <div className={`${baseClasses} ${hoverClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
