import React from 'react';

export const Card = ({ children, className = '', hover = true }) => {
    return (
        <div className={`bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl ${
            hover ? 'hover:border-slate-700/80 hover:shadow-blue-500/5 transition-all duration-300' : ''
        } ${className}`}>
            {children}
        </div>
    );
};

export default Card;
