import React from 'react';
import { Card, Badge } from '../ui';
import { FiCheckCircle, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { FaHelmetSafety as FaHelmet } from 'react-icons/fa6';

export function WorkerCard({
  worker,
  onAcceptRegistration,
  onRejectRegistration,
  onRemoveClick,
  onViewProfileClick
}) {
  return (
    <Card hover={true} className="space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E9D5FF] via-[#C4B5FD] to-[#F0FDC2] flex items-center justify-center font-extrabold text-[#6B21A8] text-lg border-2 border-white shadow-sm shrink-0">
            {worker.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#03020A]">{worker.name}</h3>
            <p className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-0.5">
              <FaHelmet className="text-xs" />
              {worker.trade}
            </p>
          </div>
        </div>
        <div>
          {worker.approvalStatus === 'Pending Approval' ? (
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
              Pending Approval
            </span>
          ) : (
            <Badge variant={worker.status === 'On Duty' ? 'completed' : 'pending'}>
              {worker.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Pending Approval Admin Action Bar */}
      {worker.approvalStatus === 'Pending Approval' && (
        <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-amber-800">New Worker Request:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onRejectRegistration(worker.id)}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 cursor-pointer"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => onAcceptRegistration(worker.id)}
              className="dark-nav-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-xs hover:bg-black cursor-pointer flex items-center gap-1"
            >
              <FiCheckCircle className="text-[#BEF264]" /> Accept
            </button>
          </div>
        </div>
      )}

      {/* Middle Info Box */}
      <div className="bg-white/80 rounded-2xl p-3 border border-white space-y-2 text-xs font-medium text-slate-600">
        {(worker.cancellationNotice || worker.statusNote?.includes('cancelled')) && (!worker.site || worker.site === 'Not Assigned Yet' || worker.site === 'Unassigned' || worker.site === 'Cancelled by Admin') && (
          <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
            <FiAlertCircle className="text-rose-500 shrink-0 text-xs" />
            <span>your assigned project was cancelled by admin</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span>Assigned Site:</span>
          {(!worker.site || worker.site === 'Not Assigned Yet' || worker.site === 'Unassigned') ? (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Not Assigned Yet
            </span>
          ) : (
            <span className="font-bold text-[#03020A]">{worker.site}</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span>Attendance:</span>
          <span className={`font-extrabold px-2.5 py-0.5 rounded-full text-[11px] ${
            (worker.attendance === 'Present' || worker.status === 'On Duty') 
              ? 'text-[#3F6212] bg-[#F0FDC2] border border-[#BEF264]' 
              : 'text-rose-700 bg-rose-100 border border-rose-200'
          }`}>
            { (worker.attendance === 'Present' || worker.attendance === 'Absent') ? worker.attendance : (worker.status === 'On Duty' ? 'Present' : 'Absent') }
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Contact Info:</span>
          <span className="font-bold text-[#03020A]">{worker.phone || 'Not Provided'}</span>
        </div>
      </div>

      {/* Bottom Bar with Remove Worker & View Profile */}
      <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
        <button 
          type="button" 
          onClick={() => onRemoveClick(worker)}
          className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
          title="Remove Worker"
        >
          <FiTrash2 className="text-xs" /> Remove
        </button>

        <button 
          type="button" 
          onClick={() => onViewProfileClick(worker)}
          className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </Card>
  );
}

export default WorkerCard;
