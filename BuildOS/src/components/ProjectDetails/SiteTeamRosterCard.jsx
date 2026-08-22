import React from 'react';
import { Card } from '../ui';
import { FiUsers, FiEdit2 } from 'react-icons/fi';

export function SiteTeamRosterCard({ teamMembers, isCancelled, onOpenModal }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-purple-100 text-[#7C3AED]">
            <FiUsers className="text-base" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#03020A]">Assigned Site Personnel ({teamMembers.length})</h3>
            <p className="text-xs font-semibold text-slate-500">Site engineers, managers & active workforce leads</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] hover:text-purple-900 border border-purple-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <FiEdit2 className="text-xs text-[#7C3AED]" />
          <span>Edit Team</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.length === 0 ? (
          <div className="col-span-full glass-card p-8 rounded-3xl text-center space-y-2 border border-white">
            <FiUsers className="text-2xl text-[#7C3AED] mx-auto" />
            <p className="text-xs font-extrabold text-[#03020A]">No Site Personnel Assigned</p>
            <p className="text-[11px] text-slate-500 font-semibold">Click "Edit Team" above to add site engineers or workers to this project.</p>
          </div>
        ) : (
          teamMembers.map((mem, index) => (
            <Card key={index} hover={true} className="text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#E9D5FF] to-[#D9F99D] text-[#6B21A8] flex items-center justify-center font-extrabold text-lg mx-auto shadow-md border-2 border-white">
                {mem.name ? mem.name.charAt(0).toUpperCase() : 'W'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#03020A]">{mem.name}</h4>
                <p className="text-xs font-semibold text-purple-600">{mem.trade || mem.role || 'Site Engineer'}</p>
                {isCancelled && (
                  <div className="mt-1.5 bg-rose-50 border border-rose-200 p-1.5 rounded-xl">
                    <span className="text-[10px] font-extrabold text-rose-700 block">
                      your assigned project was cancelled by admin
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-medium text-slate-500 bg-purple-50 py-1 px-3 rounded-full">
                {mem.phone || mem.contact || '+91 98765 00000'}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default SiteTeamRosterCard;
