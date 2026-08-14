import React from 'react';
import DashboardCard from "./DashboardCard.jsx";
import { FiFolder, FiActivity, FiUsers, FiClock } from 'react-icons/fi';
import { useData } from '../context/useData';

export function DashboardCards({ items }) {
    const {
        totalProjectsCount = 0,
        activeProjectsCount = 0,
        totalWorkersCount = 0,
        pendingTasksCount = 0,
        overdueTasksCount = 0
    } = useData() || {};

    const defaultCards = [
        {
            id: 'total-projects',
            title: "Total Projects",
            value: String(totalProjectsCount),
            icon: FiFolder,
            subtitle: "+12% this month",
            badgeType: "lime",
            accentColor: "purple"
        },
        {
            id: 'active-projects',
            title: "Active Projects",
            value: String(activeProjectsCount),
            icon: FiActivity,
            subtitle: "3 nearing deadline",
            badgeType: "purple",
            accentColor: "lime"
        },
        {
            id: 'workers',
            title: "Workers",
            value: String(totalWorkersCount),
            icon: FiUsers,
            subtitle: "+8 this week",
            badgeType: "lime",
            accentColor: "purple"
        },
        {
            id: 'pending-tasks',
            title: "Pending Tasks",
            value: String(pendingTasksCount),
            icon: FiClock,
            subtitle: `${overdueTasksCount} overdue`,
            badgeType: "rose",
            accentColor: "dark"
        }
    ];

    const cardsToRender = items || defaultCards;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cardsToRender.map((card) => (
                <DashboardCard
                    key={card.id || card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    subtitle={card.subtitle}
                    badgeType={card.badgeType}
                    accentColor={card.accentColor}
                />
            ))}
        </div>
    );
}

// Backward compatibility export alias
export const Dashboardcards = DashboardCards;

export default DashboardCards;