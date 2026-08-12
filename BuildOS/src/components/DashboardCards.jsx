import React from 'react';
import DashboardCard from "./DashboardCard.jsx";
import { FiFolder, FiUsers, FiLayers, FiTruck } from 'react-icons/fi';

const dashboardCards = [
    {
        title: "Total Projects",
        value: "24",
        icon: FiFolder,
        trend: "12 active"
    },
    {
        title: "Active Workers",
        value: "368",
        icon: FiUsers,
        trend: "94% present"
    },
    {
        title: "Materials Stock",
        value: "82%",
        icon: FiLayers,
        trend: "Good availability"
    },
    {
        title: "Machines Running",
        value: "15 / 18",
        icon: FiTruck,
        trend: "83% operational"
    }
];

function Dashboardcards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {dashboardCards.map((card, index) => (
                <DashboardCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    trend={card.trend}
                />
            ))}
        </div>
    );
}

export default Dashboardcards;