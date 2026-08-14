import React, { useState } from 'react';
import { ProjectBentoCard } from '../components/ui';
import { FiSearch, FiPlus, FiFilter, FiFolder } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';

function Projects() {
  const navigate = useNavigate();
  const { projects } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiFolder className="text-[#7C3AED]" />
            Construction Projects Roster
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage, filter, and track site operations across all active developments.
          </p>
        </div>

        <button 
          onClick={() => navigate('/projects/new')}
          className="dark-nav-pill px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer shrink-0"
        >
          <FiPlus className="text-[#BEF264] text-base" />
          <span>Assign New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
            <FiSearch className="text-sm" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name or city..."
            className="w-full bg-white/90 border border-purple-100 text-xs font-semibold rounded-full pl-10 pr-4 py-2.5 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <FiFilter className="text-purple-500" /> Filter:
          </span>
          {['All', 'In Progress', 'Planning', 'Completed', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
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
    </div>
  );
}

export default Projects;