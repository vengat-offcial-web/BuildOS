import React from 'react';
import { ProjectBentoCard } from '../ui';
import { FiFolder } from 'react-icons/fi';

export function ProjectsGrid({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="glass-card p-8 text-center rounded-[28px] border border-white space-y-2">
        <FiFolder className="text-3xl text-purple-400 mx-auto" />
        <h3 className="text-sm font-bold text-[#03020A]">No projects match your criteria</h3>
        <p className="text-xs text-slate-500">Try adjusting your search terms or status filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((proj) => (
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
  );
}

export default ProjectsGrid;
