import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useReportsController } from '../controllers/useReportsController';
import ReportModel from '../models/reportModel';
import {
  ReportsHeader,
  ReportsKpiOverview,
  ReportsSearchBar,
  CompletedProjectsGrid,
  DetailedReportView
} from '../components/Reports';

function Reports() {
  const outletContext = useOutletContext() || {};
  const navbarSearchTerm = outletContext.searchTerm || '';

  const {
    searchTerm,
    setSearchTerm,
    completedProjects,
    filteredCompletedProjects,
    selectedProject,
    openReportModal,
    closeReportModal,
    selectedReportDetails
  } = useReportsController();

  // Combine page-level search with top navigation search term if provided
  const activeSearch = searchTerm || navbarSearchTerm;

  const displayProjects = useMemo(() => {
    if (!activeSearch.trim()) return filteredCompletedProjects;
    return ReportModel.filterCompletedProjects(completedProjects, activeSearch);
  }, [completedProjects, filteredCompletedProjects, activeSearch]);

  const totalCompletedCount = completedProjects.length;

  // Render Detailed Report View when a project is selected
  if (selectedProject && selectedReportDetails) {
    return (
      <DetailedReportView
        selectedProject={selectedProject}
        selectedReportDetails={selectedReportDetails}
        onClose={closeReportModal}
      />
    );
  }

  // Default Completed Projects Roster View
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <ReportsHeader totalCompletedCount={totalCompletedCount} />

      {/* KPI Overview Strip */}
      <ReportsKpiOverview totalCompletedCount={totalCompletedCount} />

      {/* Filter & Search Bar */}
      <ReportsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        displayCount={displayProjects.length}
        totalCount={completedProjects.length}
      />

      {/* Completed Projects Grid */}
      <CompletedProjectsGrid
        projects={displayProjects}
        activeSearch={activeSearch}
        onClearSearch={() => setSearchTerm('')}
        onOpenReport={openReportModal}
      />
    </div>
  );
}

export default Reports;