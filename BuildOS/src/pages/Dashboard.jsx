import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardCards, Table } from '../components';
import {
  DashboardHeroBanner,
  FilterIndicatorBar,
  FeaturedProjectsSection
} from '../components/Dashboard';
import { useData } from '../context/useData';
import { useAuth } from '../context/AuthContext';

// Date formatting helpers
const formatFriendlyDate = (d = new Date()) => {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getTodayIsoString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const setSearchTerm = outletContext.setSearchTerm || (() => {});

  const { projects = [] } = useData() || {};

  const [statusFilter, setStatusFilter] = useState('All');

  // Date Picker State & Formatting
  const [selectedDate, setSelectedDate] = useState(() => formatFriendlyDate(new Date()));
  const [showDatePickerPopover, setShowDatePickerPopover] = useState(false);
  const [isoDateInput, setIsoDateInput] = useState(getTodayIsoString);

  const handleCustomDateChange = useCallback((e) => {
    const val = e.target.value;
    setIsoDateInput(val);
    if (val) {
      const parts = val.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        setSelectedDate(formatFriendlyDate(d));
      }
    }
  }, []);

  const handleApplyPreset = useCallback((presetType) => {
    const d = new Date();
    if (presetType === 'yesterday') {
      d.setDate(d.getDate() - 1);
    } else if (presetType === 'tomorrow') {
      d.setDate(d.getDate() + 1);
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setIsoDateInput(`${yyyy}-${mm}-${dd}`);
    setSelectedDate(formatFriendlyDate(d));
    setShowDatePickerPopover(false);
  }, []);

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
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter || (statusFilter === 'Pending' && p.status === 'Planning');
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleKpiCardClick = useCallback((filterTarget) => {
    if (filterTarget === 'Workers') {
      navigate('/workers');
    } else if (filterTarget === 'Pending Tasks' || filterTarget === 'Tasks') {
      navigate('/tasks', { state: { filterStatus: 'Pending' } });
    } else if (filterTarget) {
      setStatusFilter(filterTarget);
    }
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All');
  }, [setSearchTerm]);

  const handleExploreAll = useCallback(() => {
    navigate('/projects');
  }, [navigate]);

  const isFilteringActive = searchTerm.trim() !== '' || statusFilter !== 'All';
  const userName = user?.name ? user.name.split(' ')[0] : 'Vengadesh';

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Hero Banner & Integrated Date Picker */}
      <DashboardHeroBanner
        userName={userName}
        selectedDate={selectedDate}
        isoDateInput={isoDateInput}
        showDatePickerPopover={showDatePickerPopover}
        setShowDatePickerPopover={setShowDatePickerPopover}
        onCustomDateChange={handleCustomDateChange}
        onApplyPreset={handleApplyPreset}
      />

      {/* Interactive KPI Cards Section */}
      <DashboardCards onCardClick={handleKpiCardClick} />

      {/* Active Search & Filter Indicator Bar */}
      {isFilteringActive && (
        <FilterIndicatorBar
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          resultCount={filteredProjects.length}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Featured Projects Bento Section */}
      <FeaturedProjectsSection
        projects={filteredProjects}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExploreAll={handleExploreAll}
        onResetFilters={handleClearFilters}
      />

      {/* Projects Table Overview (Live Filtered) */}
      <Table projectsData={filteredProjects} />
    </div>
  );
}

export default Dashboard;