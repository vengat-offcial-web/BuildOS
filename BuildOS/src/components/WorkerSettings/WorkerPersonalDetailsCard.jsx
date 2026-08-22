import React from 'react';
import { Card } from '../ui';
import { FiUser, FiMail } from 'react-icons/fi';

export function WorkerPersonalDetailsCard({ name, setName, email, setEmail }) {
  return (
    <Card hover={false} className="space-y-5">
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
        <FiUser className="text-[#7C3AED] text-base" />
        <h3 className="text-base font-extrabold text-[#03020A]">Personal Account Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Worker Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <FiUser className="text-sm" />
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-4 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Worker Email Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <FiMail className="text-sm" />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="worker@buildos.com"
              className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-4 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WorkerPersonalDetailsCard;
