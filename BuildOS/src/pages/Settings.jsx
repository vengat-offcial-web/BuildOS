import React from 'react';
import { PageHeader, Card, Badge } from '../components/ui';
import { FiUser, FiLock, FiSliders, FiBell, FiCpu, FiCheck } from 'react-icons/fi';

function Settings() {
  const handleSaveAll = () => {
    alert("Saved all settings changes");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="System Settings"
        description="Manage your administrator account, security preferences, and system notifications."
        actionLabel="Save All Changes"
        actionIcon={FiCheck}
        onActionClick={handleSaveAll}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Card */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-lg">
              <FiUser />
            </span>
            <h3 className="text-lg font-bold text-slate-100">User Profile</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Full Name</span>
              <span className="font-semibold text-slate-200">Vengadesh V</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Email Address</span>
              <span className="font-mono text-blue-400">vengat.offcl@buildos.com</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Role</span>
              <Badge variant="info" dot={false}>Administrator</Badge>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Phone</span>
              <span className="font-mono text-slate-300">+91 98010 10321</span>
            </div>
          </div>
          <button className="w-full bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
            Edit Profile
          </button>
        </Card>

        {/* Security Card */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-lg">
              <FiLock />
            </span>
            <h3 className="text-lg font-bold text-slate-100">Security & Password</h3>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button className="w-full bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
            Update Password
          </button>
        </Card>

        {/* Appearance & Preferences */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-lg">
              <FiSliders />
            </span>
            <h3 className="text-lg font-bold text-slate-100">Appearance & Region</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Color Theme</label>
              <select className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="dark">Dark Slate (Default System)</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Language</label>
              <select className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="en">English (US / UK)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications Card */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-lg">
              <FiBell />
            </span>
            <h3 className="text-lg font-bold text-slate-100">System Notifications</h3>
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800/60 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-600" />
              <span>Email Notifications for Critical Alerts</span>
            </label>
            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800/60 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-600" />
              <span>Project Milestone Delay Warnings</span>
            </label>
            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800/60 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-600" />
              <span>Daily Worker Attendance Reminders</span>
            </label>
            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800/60 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-600" />
              <span>Machinery Fuel & Maintenance Alerts</span>
            </label>
          </div>
        </Card>
      </div>

      {/* Application Meta Info */}
      <Card hover={false} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <FiCpu className="text-blue-400 text-sm" />
          <span><strong className="font-semibold text-slate-200">BuildOS Operating System</strong> • Version 1.0.0 (Production Release)</span>
        </div>
        <div>
          Last Updated: <span className="font-mono text-slate-300">12 Aug 2026</span>
        </div>
      </Card>
    </div>
  );
}

export default Settings;