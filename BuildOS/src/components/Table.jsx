import React from 'react';
import { Card, Badge, ProgressBar } from './ui';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiUserCheck, FiInbox } from 'react-icons/fi';
import { useData } from '../context/useData';

function getStatusVariant(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed') return 'completed';
  if (s === 'in progress' || s === 'in-progress') return 'in-progress';
  if (s === 'overdue') return 'overdue';
  return 'pending';
}

export function Table({ projectsData, title = "Active Construction Projects", subtitle = "Real-time status tracking across job sites" }) {
  const navigate = useNavigate();
  const { projects: contextProjects = [] } = useData() || {};

  const projectList = projectsData || contextProjects;
  const displayedProjects = projectList.slice(0, 6);

  return (
    <Card hover={false} className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-100">
        <div>
          <h2 className="text-xl font-extrabold text-[#03020A] tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
        </div>
        <button 
          type="button"
          onClick={() => navigate('/projects')}
          className="dark-nav-pill px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer shadow-md"
        >
          <span>View All Projects</span>
          <FiArrowRight className="text-xs text-[#BEF264]" />
        </button>
      </div>

      {displayedProjects.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <FiInbox className="text-3xl mx-auto text-purple-300" />
          <p className="text-sm font-semibold text-slate-500">No active construction projects available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-purple-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Site Engineer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 min-w-[160px]">Progress</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 text-slate-700 font-medium">
              {displayedProjects.map((x) => (
                <tr 
                  key={x.id} 
                  className="hover:bg-purple-50/50 transition-colors group cursor-pointer" 
                  onClick={() => navigate(`/projects/${x.id}`)}
                >
                  <td className="py-3.5 px-4 font-bold text-[#03020A] group-hover:text-[#7C3AED] transition-colors">
                    {x.name || x.project}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <FiMapPin className="text-purple-400" />
                      {x.location || x.site || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FiUserCheck className="text-purple-500" />
                      {x.manager || 'Unassigned'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusVariant(x.status)}>
                      {x.status || 'Pending'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <ProgressBar
                      progress={x.progress || 0}
                      variant={x.progress === 100 ? "lime" : "purple"}
                      size="sm"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${x.id}`);
                      }}
                      className="text-xs font-bold text-[#7C3AED] hover:text-[#581C87] bg-purple-100/60 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default Table;