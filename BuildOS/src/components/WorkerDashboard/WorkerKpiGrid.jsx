import React from 'react';
import DashboardCard from '../DashboardCard';
import { FiUserCheck, FiMapPin, FiCheckSquare, FiFileText } from 'react-icons/fi';

export function WorkerKpiGrid({
  clockedIn,
  hasAssignedSite,
  assignedProjectName,
  completedCount,
  totalTasksCount,
  progressPercent,
  leaveRequests,
  onOpenProjectModal
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard 
        title="Shift Status" 
        value={clockedIn ? "ON DUTY" : "OFF DUTY"} 
        icon={FiUserCheck} 
        subtitle={clockedIn ? "Clocked in at 08:00 AM" : "Not clocked in"}
        badgeType={clockedIn ? "lime" : "rose"}
        accentColor={clockedIn ? "lime" : "dark"}
      />
      <div 
        onClick={onOpenProjectModal}
        className="cursor-pointer transition-transform hover:scale-[1.02]"
        title="Click to view assigned project details"
      >
        <DashboardCard 
          title="Assigned Site" 
          value={hasAssignedSite ? assignedProjectName : "Not Assigned"} 
          icon={FiMapPin} 
          subtitle={hasAssignedSite ? "Tap for Site Details →" : "No Active Site"}
          badgeType={hasAssignedSite ? "purple" : "yellow"}
          accentColor={hasAssignedSite ? "purple" : "dark"}
        />
      </div>
      <DashboardCard 
        title="Tasks Today" 
        value={`${completedCount} / ${totalTasksCount}`} 
        icon={FiCheckSquare} 
        subtitle={`${progressPercent}% Completed`}
        badgeType="lime"
        accentColor="lime"
      />
      <DashboardCard 
        title="Leave Status" 
        value={`${leaveRequests.length} Request`} 
        icon={FiFileText} 
        subtitle={leaveRequests[0]?.status || "No Pending Leaves"}
        badgeType="yellow"
        accentColor="dark"
      />
    </div>
  );
}

export default WorkerKpiGrid;
