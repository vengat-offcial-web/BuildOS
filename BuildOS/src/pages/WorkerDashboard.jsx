import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/useData';
import {
  WorkerStatusBanners,
  WorkerHeroBanner,
  WorkerKpiGrid,
  WorkerDailyChecklistCard,
  WorkerLeaveRequestsCard,
  WorkerSafetyReportCard,
  ApplyLeaveModal,
  ReportSafetyModal,
  WorkerProjectDetailsModal
} from '../components/WorkerDashboard';

function WorkerDashboard() {
  const { user } = useAuth();
  const { 
    addNotification, 
    updateWorker, 
    workers, 
    projects, 
    tasks: globalTasks,
    toggleTaskStatus,
    leaveRequests, 
    addLeaveRequest, 
    deleteLeaveRequest 
  } = useData();

  // Check if current logged in worker is already clocked in from context roster
  const currentWorker = workers?.find(w => w.name?.toLowerCase().trim() === user?.name?.toLowerCase().trim());
  const [clockedIn, setClockedIn] = useState(() => currentWorker ? currentWorker.status === 'On Duty' : false);

  // Fallback tasks if no specific global task is assigned yet
  const [localTasks, setLocalTasks] = useState([
    { id: 'local-1', text: "Site inspection & quality check", status: "In Progress", urgent: true },
    { id: 'local-2', text: "Verify concrete curing strength log (Day 3)", status: "Pending", urgent: false },
    { id: 'local-3', text: "Safety gear & harness check before height work", status: "Pending", urgent: false },
    { id: 'local-4', text: "Submit daily shift log to supervisor", status: "Pending", urgent: false }
  ]);

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Dynamically evaluate assigned project from live projects roster
  const matchedProject = useMemo(() => {
    if (!user?.name) return null;
    const userNameClean = user.name.toLowerCase().trim();

    // 1. Check if user is manager or team member of a project in projects state
    const projByTeam = (projects || []).find(p => {
      if (p.manager && p.manager.toLowerCase().trim() === userNameClean) return true;
      if (p.teamMembers && Array.isArray(p.teamMembers)) {
        return p.teamMembers.some(m => m.name && m.name.toLowerCase().trim() === userNameClean);
      }
      return false;
    });
    if (projByTeam) return projByTeam;

    // 2. Check if currentWorker or user has an assigned site name that matches an existing project
    const siteName = (currentWorker?.site || user?.site || '').trim();
    if (siteName && siteName !== 'Not Assigned Yet' && siteName !== 'not assigned on any project') {
      const projBySite = (projects || []).find(p => p.name?.toLowerCase().trim() === siteName.toLowerCase().trim());
      if (projBySite) return projBySite;
      return {
        name: siteName,
        location: 'Site Location',
        manager: 'Site Lead Engineer',
        progress: 0,
        status: 'In Progress',
        deadline: 'TBD',
        description: siteName
      };
    }

    return null;
  }, [projects, user, currentWorker]);

  const hasAssignedSite = Boolean(matchedProject);

  const assignedProject = {
    name: hasAssignedSite ? matchedProject.name : "not assigned on any project",
    fullTitle: hasAssignedSite ? (matchedProject.description || matchedProject.name) : "No active project site assigned to your worker account yet",
    location: hasAssignedSite ? matchedProject.location : "Unassigned",
    engineer: hasAssignedSite ? (matchedProject.manager || "Site Lead") : "Not Assigned Yet",
    workerRole: currentWorker?.trade || user?.tradeRole || "Site Operations Worker",
    status: hasAssignedSite ? matchedProject.status : "Unassigned",
    completion: hasAssignedSite ? (matchedProject.progress || 0) : 0,
    deadline: hasAssignedSite ? (matchedProject.deadline || "N/A") : "N/A",
    shiftSchedule: "08:00 AM – 05:00 PM (General Shift)"
  };

  // Leave Request form state
  const [leaveForm, setLeaveForm] = useState({
    date: '',
    reason: 'Medical Leave',
    notes: ''
  });

  // Safety Report form state
  const [safetyForm, setSafetyForm] = useState({
    hazardType: 'Scaffolding Hazard',
    description: ''
  });

  const handleClockToggle = () => {
    if (currentWorker && currentWorker.approvalStatus === 'Pending Approval') {
      return;
    }

    const nextState = !clockedIn;
    setClockedIn(nextState);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const workerName = user?.name || 'Marcoo';

    // Sync worker status in context
    updateWorker(workerName, { 
      status: nextState ? 'On Duty' : 'Off Duty',
      attendance: nextState ? 'Present' : 'Absent'
    });

    // Dispatch notification to Admin Workers page & header bell
    addNotification(
      `Worker Shift ${nextState ? 'Clock In' : 'Clock Out'}`,
      `Worker ${workerName} (${assignedProject.workerRole}) clocked ${nextState ? 'IN to' : 'OUT of'} shift at ${timeStr} for site ${assignedProject.name}`,
      "Shift Check-In",
      nextState ? "lime" : "purple",
      "admin"
    );
  };

  // Evaluate worker's assigned tasks from global context
  const workerAssignedTasks = useMemo(() => {
    const workerNameClean = (user?.name || 'Marcoo').toLowerCase().trim();
    const siteNameClean = (assignedProject?.name || '').toLowerCase().trim();

    const matched = (globalTasks || []).filter(t => {
      const assigneeClean = (t.assignee || '').toLowerCase().trim();
      const taskSiteClean = (t.site || '').toLowerCase().trim();
      
      const matchesAssignee = assigneeClean && (
        assigneeClean === workerNameClean ||
        assigneeClean.includes(workerNameClean) ||
        workerNameClean.includes(assigneeClean) ||
        assigneeClean === 'general team' ||
        assigneeClean === 'all workers'
      );

      const matchesSite = siteNameClean && taskSiteClean && (
        taskSiteClean.includes(siteNameClean) ||
        siteNameClean.includes(taskSiteClean)
      );

      return matchesAssignee || matchesSite;
    });

    return matched.map(t => ({
      id: t.id,
      text: t.title || t.name,
      status: t.status,
      category: t.category || 'General Operations',
      urgent: t.priority === 'High' || t.overdue,
      isGlobal: true,
      site: t.site,
      dueDate: t.dueDate
    }));
  }, [globalTasks, user, assignedProject]);

  const displayTasks = useMemo(() => {
    if (workerAssignedTasks.length > 0) {
      return workerAssignedTasks;
    }
    return localTasks;
  }, [workerAssignedTasks, localTasks]);

  // Checklist Submission state
  const [checklistSubmitted, setChecklistSubmitted] = useState(false);

  const toggleTask = (id) => {
    const isGlobal = globalTasks && globalTasks.some(t => t.id === id);
    if (isGlobal) {
      toggleTaskStatus(id);
    } else {
      setLocalTasks(prev => prev.map(t => {
        if (t.id === id) {
          return { ...t, status: t.status === "Completed" ? "Pending" : "Completed" };
        }
        return t;
      }));
    }
  };

  const handleChecklistSubmit = () => {
    const workerName = user?.name || 'Marcoo';
    const doneCount = displayTasks.filter(t => t.status === "Completed").length;
    const totalCount = displayTasks.length;
    const isAllDone = doneCount === totalCount;

    setChecklistSubmitted(true);

    addNotification(
      `Shift Checklist Report Submitted ${isAllDone ? '✓' : ''}`,
      `Worker ${workerName} (${assignedProject.workerRole}) submitted daily shift checklist report (${doneCount}/${totalCount} Tasks Completed) for site ${assignedProject.name}.`,
      "Shift Report",
      isAllDone ? "lime" : "purple",
      "admin"
    );
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.date) return;

    const workerName = user?.name || 'Marcoo';

    addLeaveRequest({
      workerName,
      trade: assignedProject.workerRole,
      site: assignedProject.name,
      date: leaveForm.date,
      reason: leaveForm.reason,
      engineer: assignedProject.engineer,
      notes: leaveForm.notes
    });

    setShowLeaveModal(false);
    setLeaveForm({ date: '', reason: 'Medical Leave', notes: '' });
  };

  const handleSafetySubmit = (e) => {
    e.preventDefault();
    const workerName = user?.name || 'Marcoo';

    addNotification(
      `Safety Hazard Reported by ${workerName}`,
      `Worker ${workerName} reported safety hazard: ${safetyForm.hazardType} ("${safetyForm.description || 'Immediate inspection requested'}") for site ${assignedProject.name}.`,
      "Safety Alert",
      "purple",
      "admin"
    );

    setShowSafetyModal(false);
    setSafetyForm({ hazardType: 'Scaffolding Hazard', description: '' });
  };

  const completedCount = displayTasks.filter(t => t.status === "Completed").length;
  const progressPercent = displayTasks.length > 0 ? Math.round((completedCount / displayTasks.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Notice Banners */}
      <WorkerStatusBanners
        currentWorker={currentWorker}
        hasAssignedSite={hasAssignedSite}
        assignedProjectName={assignedProject.name}
        matchedProjectStatus={matchedProject?.status}
      />

      {/* Hero Welcome Banner */}
      <WorkerHeroBanner
        userName={user?.name}
        assignedProject={assignedProject}
        clockedIn={clockedIn}
        onClockToggle={handleClockToggle}
        onApplyLeaveClick={() => setShowLeaveModal(true)}
      />

      {/* Top KPI Grid */}
      <WorkerKpiGrid
        clockedIn={clockedIn}
        hasAssignedSite={hasAssignedSite}
        assignedProjectName={assignedProject.name}
        completedCount={completedCount}
        totalTasksCount={displayTasks.length}
        progressPercent={progressPercent}
        leaveRequests={leaveRequests}
        onOpenProjectModal={() => setShowProjectModal(true)}
      />

      {/* Tasks & Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Checklist Card */}
        <WorkerDailyChecklistCard
          displayTasks={displayTasks}
          completedCount={completedCount}
          onToggleTask={toggleTask}
          checklistSubmitted={checklistSubmitted}
          onSubmitChecklist={handleChecklistSubmit}
        />

        {/* Right Side: Leave Requests & Safety Alerts */}
        <div className="space-y-6">
          <WorkerLeaveRequestsCard
            leaveRequests={leaveRequests}
            onApplyLeaveClick={() => setShowLeaveModal(true)}
            onClearAllLeave={() => {
              leaveRequests.forEach(r => deleteLeaveRequest(r.id));
              setToastMessage('All leave records cleared.');
              setTimeout(() => setToastMessage(''), 3000);
            }}
            onDeleteSingleLeave={(req) => {
              deleteLeaveRequest(req.id);
              setToastMessage(`Cleared '${req.reason}' record.`);
              setTimeout(() => setToastMessage(''), 3000);
            }}
          />

          <WorkerSafetyReportCard
            onReportSafetyClick={() => setShowSafetyModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        engineerName={assignedProject.engineer}
        leaveForm={leaveForm}
        setLeaveForm={setLeaveForm}
        onSubmit={handleLeaveSubmit}
      />

      <ReportSafetyModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        safetyForm={safetyForm}
        setSafetyForm={setSafetyForm}
        onSubmit={handleSafetySubmit}
      />

      <WorkerProjectDetailsModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        hasAssignedSite={hasAssignedSite}
        assignedProject={assignedProject}
      />
    </div>
  );
}

export default WorkerDashboard;
