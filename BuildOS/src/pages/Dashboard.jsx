import React, { useState, useMemo } from 'react';
import { FiCalendar, FiPlus, FiArrowRight, FiCheckCircle, FiSearch, FiX, FiFilter, FiInbox } from 'react-icons/fi';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardCards, Table, ProjectBentoCard } from '../components';
import { useData } from '../context/useData';

function Dashboard() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const setSearchTerm = outletContext.setSearchTerm || (() => {});

  const { projects = [] } = useData() || {};

  const [statusFilter, setStatusFilter] = useState('All');

  // Filter projects based on search input and status filter pill (excludes Cancelled projects)
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return projects.filter(p => {
      if (p.status === 'Cancelled') return false;
      const matchesSearch = !term || (
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.location && p.location.toLowerCase().includes(term)) ||
        (p.manager && p.manager.toLowerCase().includes(term)) ||
        (p.status && p.status.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleKpiCardClick = (filterTarget) => {
    if (filterTarget === 'Workers') {
      navigate('/workers');
    } else if (filterTarget) {
      setStatusFilter(filterTarget);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  const isFilteringActive = searchTerm.trim() !== '' || statusFilter !== 'All';

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner Card */}
      <div className="glass-hero-purple p-8 rounded-[32px] border border-white/90 shadow-[0_14px_36px_rgba(167,139,250,0.15)] relative overflow-hidden">
        {/* Ambient Glow Graphic */}
        <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#03020A] tracking-tight">
              Good Morning, <span className="text-[#7C3AED]">Vengadesh</span>
            </h1>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              Manage your construction projects, workers, materials and tasks from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              type="button"
              className="bg-white/80 hover:bg-white text-[#03020A] border border-white/90 text-xs font-bold px-4 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FiCalendar className="text-[#7C3AED] text-sm" />
              <span>Aug 14, 2026</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/projects/new')}
              className="dark-nav-pill hover:bg-black text-white text-xs font-extrabold px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer"
            >
              <FiPlus className="text-[#BEF264] text-sm" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive KPI Cards Section */}
      <DashboardCards onCardClick={handleKpiCardClick} />

      {/* Active Search & Filter Indicator Bar */}
      {isFilteringActive && (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-purple-100 shadow-md flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#03020A]">
            <span className="p-1.5 rounded-lg bg-purple-100 text-[#7C3AED]">
              <FiSearch className="text-sm" />
            </span>
            <span>
              {searchTerm && <span>Filtering by "<strong className="text-[#7C3AED]">{searchTerm}</strong>" • </span>}
              {statusFilter !== 'All' && <span>Status: <strong className="text-purple-700">{statusFilter}</strong> • </span>}
              Found <span className="text-[#7C3AED] font-extrabold">{filteredProjects.length}</span> matching projects
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <FiX className="text-sm" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* Bento Project Cards Showcase Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#03020A] tracking-tight">Featured Construction Sites</h2>
            <p className="text-xs font-semibold text-slate-500">High priority active site developments</p>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <FiFilter className="text-purple-500" /> Filter:
            </span>
            {['All', 'In Progress', 'Planning', 'Completed', 'Pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#7C3AED] text-white shadow-md'
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
                }`}
              >
                {st}
              </button>
            ))}
            <button 
              type="button"
              onClick={() => navigate('/projects')}
              className="text-xs font-bold text-[#7C3AED] hover:text-[#581C87] flex items-center gap-1.5 bg-purple-100/60 hover:bg-purple-100 px-4 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ml-2"
            >
              <span>Explore All</span>
              <FiArrowRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.slice(0, 4).map((proj) => (
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
          <div className="glass-card p-8 text-center rounded-[28px] border border-white space-y-2">
            <FiInbox className="text-3xl text-purple-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#03020A]">No projects match your search criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or resetting the status filter.</p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-extrabold text-[#7C3AED] bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-full transition-all cursor-pointer mt-2 inline-block"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Projects Table Overview (Live Filtered) */}
      <Table projectsData={filteredProjects} />
    </div>
  );
}

export default Dashboard;