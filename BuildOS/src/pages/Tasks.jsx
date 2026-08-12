import React from 'react';
import { useTasksController } from '../controllers/useTasksController';
import { PageHeader, FilterBar, Badge, ProgressBar, Card } from '../components/ui';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';

function Tasks() {
    const {
        searchTerm,
        setSearchTerm,
        projectProgress,
        allTableTasks,
        filteredTasks,
        getPriorityVariant,
        getTaskStatusVariant,
        handleAddTask
    } = useTasksController();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Daily Construction Tasks"
                description="Track daily activities, site assignments, priority schedules, and progress."
                actionLabel="Add Task"
                actionIcon={FiPlus}
                onActionClick={handleAddTask}
            />

            <Card hover={false}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xl">
                            <FiCheckCircle />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-100">Today's Total Work Completion</h3>
                            <p className="text-xs text-slate-400">12 / 20 Tasks Completed</p>
                        </div>
                    </div>
                    <span className="text-xl font-extrabold text-blue-400 font-mono">60%</span>
                </div>
                <ProgressBar progress={60} showLabel={false} size="lg" variant="multi" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectProgress.map((x, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-200">{x.name}</span>
                            <span className="text-xs font-mono font-bold text-blue-400">{x.progress}%</span>
                        </div>
                        <ProgressBar progress={x.progress} showLabel={false} size="sm" variant="blue" />
                    </Card>
                ))}
            </div>

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search task, project, or assignee..."
                filteredCount={filteredTasks.length}
                totalCount={allTableTasks.length}
                itemLabel="task items"
            />

            <Card className="overflow-hidden p-0" hover={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
                                <th className="py-3.5 px-5">Task ID</th>
                                <th className="py-3.5 px-5">Task Title</th>
                                <th className="py-3.5 px-5">Project</th>
                                <th className="py-3.5 px-5">Assigned Person</th>
                                <th className="py-3.5 px-5">Priority</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5 text-right">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredTasks.map((x, index) => (
                                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-400">#{x.id}</td>
                                    <td className="py-3.5 px-5 font-semibold text-slate-100">{x.task}</td>
                                    <td className="py-3.5 px-5 text-slate-400">{x.project}</td>
                                    <td className="py-3.5 px-5 text-slate-300 font-medium">{x.assigned}</td>
                                    <td className="py-3.5 px-5">
                                        <Badge variant={getPriorityVariant(x.priority)} dot={false}>
                                            {x.priority}
                                        </Badge>
                                    </td>
                                    <td className="py-3.5 px-5">
                                        <Badge variant={getTaskStatusVariant(x.status)}>
                                            {x.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3.5 px-5 text-right font-mono text-xs text-slate-400">{x.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default Tasks;