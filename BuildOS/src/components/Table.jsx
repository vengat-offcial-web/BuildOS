import React from 'react';
import { Card, Badge, ProgressBar } from './ui';

const projects = [
  { project: "Mall Build", site: "Chennai", status: "Ongoing", progress: 80 },
  { project: "Hospital", site: "Madurai", status: "Completed", progress: 100 },
  { project: "Bridge", site: "Coimbatore", status: "Ongoing", progress: 65 },
  { project: "Apartment", site: "Trichy", status: "Pending", progress: 35 },
  { project: "School", site: "Salem", status: "Completed", progress: 100 },
  { project: "IT Park", site: "Chennai", status: "Ongoing", progress: 72 },
  { project: "Shopping Complex", site: "Erode", status: "Pending", progress: 28 },
  { project: "Factory", site: "Hosur", status: "Ongoing", progress: 55 },
  { project: "Office Tower", site: "Bangalore", status: "Completed", progress: 100 },
  { project: "Metro Station", site: "Chennai", status: "Ongoing", progress: 61 }
];

function getStatusVariant(status) {
  switch (status) {
    case "Completed":
      return "success";
    case "Ongoing":
      return "info";
    case "Pending":
    default:
      return "warning";
  }
}

function Table() {
  return (
    <Card hover={false}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Recent Projects Overview</h2>
          <p className="text-xs text-slate-400">Live operational status across construction sites</p>
        </div>
        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all">
          View All Projects
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Site Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Progress Meter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {projects.map((x, index) => (
              <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-200">{x.project}</td>
                <td className="py-3.5 px-4 text-slate-400">{x.site}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={getStatusVariant(x.status)}>
                    {x.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 min-w-[180px]">
                  <ProgressBar
                    progress={x.progress}
                    variant={x.progress === 100 ? "emerald" : "blue"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default Table;