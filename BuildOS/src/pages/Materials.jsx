import React from 'react';
import { useMaterialsController } from '../controllers/useMaterialsController';
import { PageHeader, FilterBar, Badge, Card } from '../components/ui';
import DashboardCard from '../components/DashboardCard';
import { FiLayers, FiAlertTriangle, FiAlertOctagon, FiTruck, FiPlus, FiBox } from 'react-icons/fi';

function Materials() {
    const {
        searchTerm,
        setSearchTerm,
        allMaterials,
        filteredMaterials,
        getStatusVariant,
        handleAddMaterial
    } = useMaterialsController();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Materials Inventory"
                description="Monitor raw material stock levels, categories, and supplier deliveries."
                actionLabel="Add Material"
                actionIcon={FiPlus}
                onActionClick={handleAddMaterial}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <DashboardCard title="Total Materials" value="45" icon={FiLayers} trend="Cataloged" />
                <DashboardCard title="Low Stock Alerts" value="8" icon={FiAlertTriangle} trend="Action required" />
                <DashboardCard title="Out of Stock" value="3" icon={FiAlertOctagon} trend="Reorder placed" />
                <DashboardCard title="Active Suppliers" value="12" icon={FiTruck} trend="Verified" />
            </div>

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search material, category, or supplier..."
                filteredCount={filteredMaterials.length}
                totalCount={allMaterials.length}
                itemLabel="material items"
            />

            <Card className="overflow-hidden p-0" hover={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
                                <th className="py-3.5 px-5">Material Item</th>
                                <th className="py-3.5 px-5">Category</th>
                                <th className="py-3.5 px-5">Stock Quantity</th>
                                <th className="py-3.5 px-5">Unit</th>
                                <th className="py-3.5 px-5">Supplier Name</th>
                                <th className="py-3.5 px-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredMaterials.map((x, index) => (
                                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-5 font-semibold text-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                            <FiBox />
                                        </div>
                                        {x.Material}
                                    </td>
                                    <td className="py-3.5 px-5 text-slate-400">{x.Category}</td>
                                    <td className="py-3.5 px-5 font-mono font-semibold text-slate-200">{x.Stock}</td>
                                    <td className="py-3.5 px-5 text-slate-400">{x.Unit}</td>
                                    <td className="py-3.5 px-5 text-slate-300 font-medium">{x.Supplier}</td>
                                    <td className="py-3.5 px-5 text-right">
                                        <Badge variant={getStatusVariant(x.Status)}>
                                            {x.Status}
                                        </Badge>
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

export default Materials;