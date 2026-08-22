import React from 'react';
import { Card } from '../ui';
import { FiFolder } from 'react-icons/fi';
import CompletedProjectCard from './CompletedProjectCard';

export function CompletedProjectsGrid({ projects, activeSearch, onClearSearch, onOpenReport }) {
  if (projects.length === 0) {
    return (
      <Card hover={false} className="py-16 text-center space-y-4 rounded-[32px] border border-dashed border-purple-200">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center text-2xl mx-auto">
          <FiFolder />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-extrabold text-[#03020A]">No Completed Projects Found</h3>
          <p className="text-xs font-semibold text-slate-500">
            {activeSearch ? `No completed project matches "${activeSearch}". Try clearing your search filter.` : 'There are currently no completed projects in the system.'}
          </p>
        </div>
        {activeSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="px-5 py-2 rounded-full bg-purple-100 text-[#7C3AED] hover:bg-purple-200 text-xs font-extrabold transition-colors cursor-pointer"
          >
            Clear Search Filter
          </button>
        )}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <CompletedProjectCard
          key={project.id}
          project={project}
          onOpenReport={onOpenReport}
        />
      ))}
    </div>
  );
}

export default CompletedProjectsGrid;
