import React from 'react';
import { useMachinesController } from '../controllers/useMachinesController';
import { PageHeader, FilterBar, Badge, Card } from '../components/ui';
import DashboardCard from '../components/DashboardCard';
import { FiTruck, FiTool, FiDroplet, FiCpu, FiPlus, FiAlertTriangle } from 'react-icons/fi';

function Machines() {
    const {
        searchTerm,
        setSearchTerm,
        allMachines,
        filteredMachines,
        alerts,
        getConditionVariant,
        handleAddMachine
    } = useMachinesController();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Machinery & Equipment"
                description="Monitor and manage heavy machinery, operators, and maintenance alerts."
                actionLabel="Add Machine"
                actionIcon={FiPlus}
                onActionClick={handleAddMachine}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <DashboardCard title="Running Machines" value="12" icon={FiTruck} trend="83% operational" />
                <DashboardCard title="In Maintenance" value="4" icon={FiTool} trend="Service active" />
                <DashboardCard title="Fuel Refill Due" value="2" icon={FiDroplet} trend="Urgent" />
                <DashboardCard title="Total Machines" value="18" icon={FiCpu} trend="Fleet total" />
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-3 text-amber-400 font-bold text-sm">
                    <FiAlertTriangle className="text-lg shrink-0" />
                    <h3>Today's Machinery Maintenance Alerts</h3>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                    {alerts.map((x, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl bg-slate-900/60 border border-amber-500/10">
                            {x.Alert1 && <p className="flex-1 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>{x.Alert1}</p>}
                            {x.Alert2 && <p className="flex-1 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>{x.Alert2}</p>}
                            {x.Alert3 && <p className="flex-1 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>{x.Alert3}</p>}
                        </div>
                    ))}
                </div>
            </div>

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search machine, type, site, or operator..."
                filteredCount={filteredMachines.length}
                totalCount={allMachines.length}
                itemLabel="equipment units"
            />

            <Card className="overflow-hidden p-0" hover={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
                                <th className="py-3.5 px-5">Machine Name</th>
                                <th className="py-3.5 px-5">Type</th>
                                <th className="py-3.5 px-5">Site Location</th>
                                <th className="py-3.5 px-5">Assigned Operator</th>
                                <th className="py-3.5 px-5">Operational Condition</th>
                                <th className="py-3.5 px-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredMachines.map((x, index) => (
                                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-5 font-semibold text-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                            <FiTruck />
                                        </div>
                                        {x.MachineName}
                                    </td>
                                    <td className="py-3.5 px-5 text-slate-400">{x.Type}</td>
                                    <td className="py-3.5 px-5 text-slate-300">{x.Site}</td>
                                    <td className="py-3.5 px-5 text-slate-300 font-medium">{x.Operator}</td>
                                    <td className="py-3.5 px-5">
                                        <Badge variant={getConditionVariant(x.Condition)}>
                                            {x.Condition}
                                        </Badge>
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
                                        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all">
                                            {x.Action || "Inspect"}
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

export default Machines;