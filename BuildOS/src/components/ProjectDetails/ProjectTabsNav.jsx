import React from 'react';
import { FiCheckSquare, FiUsers, FiLayers } from 'react-icons/fi';

const TABS = [
  { id: 'overview', label: 'Milestones & Tasks', icon: FiCheckSquare },
  { id: 'team', label: 'Site Team & Personnel', icon: FiUsers },
  { id: 'resources', label: 'Materials & Equipment', icon: FiLayers }
];

export function ProjectTabsNav({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-2 border-b border-purple-100 pb-3 overflow-x-auto">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-[#03020A] text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
            }`}
          >
            <Icon className={isActive ? 'text-[#BEF264]' : 'text-purple-500'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ProjectTabsNav;
