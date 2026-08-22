import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';
import {
  ProjectsHeader,
  ProjectsFilterBar,
  ProjectsGrid
} from '../components/Projects';

function Projects() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const { projects } = useData();
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredProjects = (projects || []).filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <ProjectsHeader onAssignNewProject={() => navigate('/projects/new')} />

      {/* Filter Pills Bar */}
      <ProjectsFilterBar
        filterStatus={filterStatus}
        onStatusFilterChange={setFilterStatus}
      />

      {/* Projects Bento Grid */}
      <ProjectsGrid projects={filteredProjects} />
    </div>
  );
}

export default Projects;