import React from 'react';
import { useProjectsController } from '../controllers/useProjectsController';
import { PageHeader, FilterBar, Badge, ProgressBar, Card } from '../components/ui';
import { FiPlus } from 'react-icons/fi';

function Projects() {
    const {
        searchTerm,
        setSearchTerm,
        allProjects,
        filteredProjects,
        getStatusVariant,
        handleAddProject
    } = useProjectsController();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Projects Directory"
                description="Track construction project progress and manage daily site activities."
                actionLabel="Add Project"
                actionIcon={FiPlus}
                onActionClick={handleAddProject}
            />

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search projects or sites..."
                filteredCount={filteredProjects.length}
                totalCount={allProjects.length}
                itemLabel="projects"
            />

            <Card className="overflow-hidden p-0" hover={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
                                <th className="py-3.5 px-5">Project Name</th>
                                <th className="py-3.5 px-5">Site Location</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5">Completion Progress</th>
                                <th className="py-3.5 px-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredProjects.map((x, index) => (
                                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-4 px-5 font-semibold text-slate-100">{x.ProjectName}</td>
                                    <td className="py-4 px-5 text-slate-400">{x.Site}</td>
                                    <td className="py-4 px-5">
                                        <Badge variant={getStatusVariant(x.Status)}>
                                            {x.Status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-5 min-w-[200px]">
                                        <ProgressBar progress={x.Progress} variant="blue" />
                                    </td>
                                    <td className="py-4 px-5 text-right">
                                        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all">
                                            {x.Action || "View Details"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default Projects;