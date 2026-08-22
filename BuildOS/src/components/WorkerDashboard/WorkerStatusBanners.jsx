import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export function WorkerStatusBanners({ currentWorker, hasAssignedSite, assignedProjectName, matchedProjectStatus }) {
  const isPending = currentWorker && currentWorker.approvalStatus === 'Pending Approval';
  const isCancelled = (currentWorker?.cancellationNotice || currentWorker?.statusNote?.includes('cancelled') || matchedProjectStatus === 'Cancelled') && (!hasAssignedSite || assignedProjectName === 'not assigned on any project' || matchedProjectStatus === 'Cancelled');

  return (
    <>
      {/* Pending Approval Notice Banner */}
      {isPending && (
        <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-[28px] flex items-center gap-3 text-amber-900 shadow-sm animate-in fade-in duration-200">
          <FiAlertCircle className="text-amber-600 text-2xl shrink-0" />
          <div>
            <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">Account Registration Pending Admin Approval</h4>
            <p className="text-xs font-semibold text-amber-800 mt-0.5 leading-relaxed">
              Your worker registration request for <strong className="text-amber-950 font-bold">{currentWorker.name}</strong> has been submitted and is currently awaiting Admin approval. Once Admin accepts your registration from the Admin Portal, you will be authorized to clock into shifts.
            </p>
          </div>
        </div>
      )}

      {/* Project Cancelled Notice Banner */}
      {isCancelled && (
        <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-[28px] flex items-center gap-3.5 text-rose-900 shadow-sm animate-in fade-in duration-200">
          <FiAlertCircle className="text-rose-600 text-2xl shrink-0" />
          <div>
            <h4 className="text-xs font-extrabold text-rose-950 uppercase tracking-wider">Project Status Update</h4>
            <p className="text-xs font-bold text-rose-800 mt-0.5 leading-relaxed">
              <span className="bg-rose-100 border border-rose-300 px-3 py-1 rounded-full text-rose-900 font-extrabold inline-block mr-2">
                your assigned project was cancelled by admin
              </span>
              Please check with your site supervisor for new project assignment.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkerStatusBanners;
