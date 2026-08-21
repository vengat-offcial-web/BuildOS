import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, Badge } from '../components/ui';
import { 
  FiCheckCircle, 
  FiClock, 
  FiUsers, 
  FiMapPin, 
  FiSearch, 
  FiEye, 
  FiBarChart2, 
  FiShield, 
  FiUserCheck, 
  FiX, 
  FiLayers, 
  FiCalendar,
  FiFolder,
  FiDollarSign,
  FiPhone,
  FiClipboard,
  FiTag
} from 'react-icons/fi';
import { useReportsController } from '../controllers/useReportsController';
import ReportModel from '../models/reportModel';

function Reports() {
  const outletContext = useOutletContext() || {};
  const navbarSearchTerm = outletContext.searchTerm || '';

  const {
    searchTerm,
    setSearchTerm,
    completedProjects,
    filteredCompletedProjects,
    selectedProject,
    isModalOpen,
    openReportModal,
    closeReportModal,
    selectedReportDetails
  } = useReportsController();

  // Combine page-level search with top navigation search term if provided
  const activeSearch = searchTerm || navbarSearchTerm;

  const displayProjects = React.useMemo(() => {
    if (!activeSearch.trim()) return filteredCompletedProjects;
    return ReportModel.filterCompletedProjects(completedProjects, activeSearch);
  }, [completedProjects, filteredCompletedProjects, activeSearch]);

  // Aggregate stats across completed projects
  const totalCompletedCount = completedProjects.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0">
              <FiFolder />
            </div>
            Completed Projects Reports
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Executive audit archives and complete operational summaries for all finished site developments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <FiCheckCircle className="text-emerald-600 text-sm" />
            <span>{totalCompletedCount} Completed {totalCompletedCount === 1 ? 'Site' : 'Sites'} Archived</span>
          </span>
        </div>
      </div>

      {/* KPI Overview Strip for Completed Sites */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-hero-lime p-6 rounded-[28px] space-y-2 border border-emerald-200/60 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[#3F6212]">
            <span>Archived Developments</span>
            <FiCheckCircle className="text-lg text-emerald-700" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">{totalCompletedCount} Projects</h3>
          <p className="text-xs font-semibold text-[#15803D] bg-white/80 px-2.5 py-0.5 rounded-full inline-block">
            100% Milestone Execution
          </p>
        </div>

        <div className="glass-card p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Average Site Duration</span>
            <FiClock className="text-lg text-purple-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">~176 Days</h3>
          <p className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">
            On-Time Handover Record
          </p>
        </div>

        <div className="glass-hero-purple p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B21A8]">
            <span>Average Site Safety Index</span>
            <FiShield className="text-lg text-purple-700" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">100% Score</h3>
          <p className="text-xs font-semibold text-[#6B21A8] bg-purple-200/60 px-2.5 py-0.5 rounded-full inline-block">
            Zero Incident Zero Delay
          </p>
        </div>

        <div className="glass-card p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>QA & Inspection Status</span>
            <FiUserCheck className="text-lg text-emerald-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">Verified & Signed</h3>
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
            Lead Engineer Approved
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-100">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search completed project by name, location, or site engineer..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/80 border border-purple-100 rounded-full text-xs font-semibold text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
          <span>Showing {displayProjects.length} of {completedProjects.length} Completed Projects</span>
        </div>
      </div>

      {/* Completed Projects Roster Grid */}
      {displayProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => {
            const daysTaken = ReportModel.calculateCompletionDays(project);
            const engineer = ReportModel.getProjectEngineer(project);

            return (
              <Card 
                key={project.id} 
                hover={true} 
                className="flex flex-col justify-between space-y-5 rounded-[28px] border border-purple-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

                <div className="space-y-4 pt-1">
                  {/* Top Row: Name & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#03020A] group-hover:text-[#7C3AED] transition-colors leading-snug">
                        {project.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
                        <FiMapPin className="text-purple-600 shrink-0" />
                        {project.location}
                      </p>
                    </div>

                    <Badge variant="success" className="shrink-0 bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold px-3 py-1">
                      <FiCheckCircle className="mr-1 text-emerald-700" /> Completed
                    </Badge>
                  </div>

                  {/* Project Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    {project.description || "Fully constructed commercial site development completed with zero safety incidents."}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100/60 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                        <FiUserCheck className="text-purple-600" /> Site Engineer
                      </span>
                      <p className="font-extrabold text-[#03020A] truncate" title={engineer}>
                        {engineer}
                      </p>
                    </div>

                    <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/60 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                        <FiClock className="text-emerald-600" /> Completion Days
                      </span>
                      <p className="font-extrabold text-[#03020A]">
                        {daysTaken} Days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2 border-t border-purple-100/80">
                  <button
                    type="button"
                    onClick={() => openReportModal(project)}
                    className="w-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group/btn"
                  >
                    <FiEye className="text-[#BEF264] text-sm group-hover/btn:scale-110 transition-transform" />
                    <span>View Completed Site Report</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
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
              onClick={() => setSearchTerm('')}
              className="px-5 py-2 rounded-full bg-purple-100 text-[#7C3AED] hover:bg-purple-200 text-xs font-extrabold transition-colors cursor-pointer"
            >
              Clear Search Filter
            </button>
          )}
        </Card>
      )}

      {/* Completed Project Detailed Report Modal */}
      {isModalOpen && selectedProject && selectedReportDetails && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Click to Close */}
          <div className="fixed inset-0" onClick={closeReportModal} />

          <div className="relative bg-white w-full max-w-4xl rounded-[36px] shadow-2xl border border-purple-100 overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Banner */}
            <div className="bg-gradient-to-r from-[#03020A] via-purple-950 to-[#03020A] text-white p-6 md:p-8 relative">
              <button
                type="button"
                onClick={closeReportModal}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>

              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-extrabold px-3.5 py-1 rounded-full flex items-center gap-1.5">
                    <FiCheckCircle /> Completed Site Audit Report
                  </span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <FiMapPin className="text-[#BEF264]" /> {selectedProject.location}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {selectedProject.name}
                </h2>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {selectedProject.description || "Executive site completion audit documenting team roster, material usage, and execution duration."}
                </p>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
              {/* Executive Metrics Overview Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-purple-700 flex items-center gap-1">
                    <FiUserCheck className="text-purple-600" /> Site Engineer
                  </span>
                  <p className="text-sm font-extrabold text-[#03020A] truncate">
                    {selectedReportDetails.engineer}
                  </p>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 flex items-center gap-1">
                    <FiClock className="text-emerald-600" /> Duration Taken
                  </span>
                  <p className="text-sm font-extrabold text-[#03020A]">
                    {selectedReportDetails.completionDays} Days
                  </p>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-blue-700 flex items-center gap-1">
                    <FiUsers className="text-blue-600" /> Team Size
                  </span>
                  <p className="text-sm font-extrabold text-[#03020A]">
                    {selectedReportDetails.teamMembers.length} Members
                  </p>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-800 flex items-center gap-1">
                    <FiDollarSign className="text-amber-600" /> Total Budget
                  </span>
                  <p className="text-sm font-extrabold text-[#03020A]">
                    {selectedProject.budget || "₹8.0 Cr / ₹8.0 Cr"}
                  </p>
                </div>
              </div>

              {/* Section 1: Worked Team Members Roster */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                    <FiUsers className="text-[#7C3AED]" /> Worked Team Members & Site Lead Roster
                  </h3>
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    {selectedReportDetails.teamMembers.length} Personnel Assigned
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-purple-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-50/80 border-b border-purple-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Member Name</th>
                        <th className="py-3 px-4">Assigned Role / Trade</th>
                        <th className="py-3 px-4">Contact Number</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100/60 font-semibold text-slate-700">
                      {selectedReportDetails.teamMembers.map((member, idx) => (
                        <tr key={member.id || idx} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-extrabold text-[#03020A] flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xs font-extrabold shrink-0">
                              {member.name ? member.name.charAt(0) : 'W'}
                            </div>
                            <span>{member.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-purple-900 font-bold">{member.role}</td>
                          <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1 mt-1">
                            <FiPhone className="text-slate-400" /> {member.phone}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full inline-block">
                              {member.status || 'Completed Assignment'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Materials Spent Audit */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                    <FiLayers className="text-[#7C3AED]" /> Materials Spent & Stock Consumption Audit
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    100% Fully Utilized
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedReportDetails.materialsSpent.map((mat, idx) => (
                    <div key={mat.id || idx} className="bg-white p-4 rounded-2xl border border-purple-100 flex items-center justify-between shadow-sm hover:border-purple-200 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-[#03020A]">{mat.name}</p>
                        <p className="text-[11px] font-bold text-purple-700">Spent: {mat.quantity}</p>
                      </div>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                        {mat.status || 'Fully Utilized'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Completed Tasks & QA Clearances */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                    <FiClipboard className="text-[#7C3AED]" /> Completed Tasks & QA Clearances Log
                  </h3>
                  <span className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] px-3 py-1 rounded-full">
                    All Tasks Passed Inspection
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedReportDetails.completedTasks.map((task, idx) => (
                    <div key={task.id || idx} className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0">
                          <FiCheckCircle />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#03020A]">{task.title}</p>
                          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                            <FiTag className="text-purple-500" /> {task.category || 'General Operations'}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                        {task.completedDate || 'Completed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-purple-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-6 py-2.5 rounded-full bg-[#03020A] hover:bg-[#7C3AED] text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
              >
                Close Report View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;