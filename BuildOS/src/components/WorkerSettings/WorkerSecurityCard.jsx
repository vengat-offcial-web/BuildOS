import React from 'react';
import { Card } from '../ui';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export function WorkerSecurityCard({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword
}) {
  return (
    <Card hover={false} className="space-y-5">
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
        <FiLock className="text-[#7C3AED] text-base" />
        <h3 className="text-base font-extrabold text-[#03020A]">Security & Password</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            New Password (Leave blank to keep current)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <FiLock className="text-sm" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-11 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-600 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <FiLock className="text-sm" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-white border border-purple-100 rounded-2xl py-2.5 pl-10 pr-4 text-[#03020A] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all shadow-xs"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WorkerSecurityCard;
