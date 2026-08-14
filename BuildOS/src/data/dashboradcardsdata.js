
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
export default defaultCards;