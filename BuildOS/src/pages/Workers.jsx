import React from "react";
import { useWorkersController } from "../controllers/useWorkersController";
import { PageHeader, FilterBar, Badge, Card } from "../components/ui";
import DashboardCard from "../components/DashboardCard";
import { FiUsers, FiUserCheck, FiClock, FiUserX, FiPlus, FiUser } from 'react-icons/fi';

function Workers() {
    const {
        searchTerm,
        setSearchTerm,
        allWorkers,
        filteredWorkers,
        getStatusVariant,
        handleAddWorker
    } = useWorkersController();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Worker Management"
                description="Manage site personnel, roles, assignments, and attendance status."
                actionLabel="Add Worker"
                actionIcon={FiPlus}
                onActionClick={handleAddWorker}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <DashboardCard title="Total Workers" value="126" icon={FiUsers} trend="Registered" />
                <DashboardCard title="Present Today" value="118" icon={FiUserCheck} trend="93.6% attendance" />
                <DashboardCard title="On Leave" value="5" icon={FiClock} trend="Scheduled" />
                <DashboardCard title="Inactive / Offsite" value="3" icon={FiUserX} trend="Standby" />
            </div>

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search worker by name, role, or site..."
                filteredCount={filteredWorkers.length}
                totalCount={allWorkers.length}
                itemLabel="workers"
            />

            <Card className="overflow-hidden p-0" hover={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
                                <th className="py-3.5 px-5">Worker Name</th>
                                <th className="py-3.5 px-5">Role</th>
                                <th className="py-3.5 px-5">Site Location</th>
                                <th className="py-3.5 px-5">Contact Phone</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredWorkers.map((x, index) => (
                                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-5 font-semibold text-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
                                            <FiUser />
                                        </div>
                                        {x.Name}
                                    </td>
                                    <td className="py-3.5 px-5 text-slate-300 font-medium">{x.Role}</td>
                                    <td className="py-3.5 px-5 text-slate-400">{x.Site}</td>
                                    <td className="py-3.5 px-5 font-mono text-slate-400 text-xs">{x.Phone}</td>
                                    <td className="py-3.5 px-5">
                                        <Badge variant={getStatusVariant(x.Status)}>
                                            {x.Status}
                                        </Badge>
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
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

export default Workers;