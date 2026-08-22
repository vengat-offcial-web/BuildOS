import React from 'react';
import { ProjectBentoCard } from '../ui';
import ProjectFilterPills from './ProjectFilterPills';
import NoProjectsFound from './NoProjectsFound';

export function FeaturedProjectsSection({
  projects,
  statusFilter,
  onStatusFilterChange,
  onExploreAll,
  onResetFilters
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#03020A] tracking-tight">Featured Construction Sites</h2>
          <p className="text-xs font-semibold text-slate-500">High priority active site developments</p>
        </div>

        <ProjectFilterPills
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          onExploreAll={onExploreAll}
        />
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, 4).map((proj) => (
            <ProjectBentoCard
              key={proj.id}
              id={proj.id}
              name={proj.name}
              location={proj.location}
              manager={proj.manager}
              progress={proj.progress}
              status={proj.status}
              deadline={proj.deadline}
              accent={proj.accent || 'purple'}
              iconType={proj.iconType || 'building'}
            />
          ))}
        </div>
      ) : (
        <NoProjectsFound onResetFilters={onResetFilters} />
      )}
    </div>
  );
}

export default FeaturedProjectsSection;
