import React, { useState } from 'react';
import { Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { FiSettings, FiUser, FiBell, FiShield, FiSliders, FiCheck } from 'react-icons/fi';

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Vengadesh',
    title: 'Project Director & Site Overseer',
    email: user?.email || 'admin@buildos.com',
    phone: '+91 98765 43210',
    company: 'BuildOS Construction Ltd'
  });

  const [notifications, setNotifications] = useState({
    siteAlerts: true,
    safetyIncidents: true,
    materialReorder: true,
    dailyDigest: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiSettings className="text-[#7C3AED]" />
            BuildOS System & Portal Settings
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Configure profile credentials, site notification triggers, and security controls.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <FiCheck className="text-sm" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'Admin Profile', icon: FiUser },
          { id: 'notifications', label: 'Site Alerts', icon: FiBell },
          { id: 'security', label: 'Security & Access', icon: FiShield },
          { id: 'theme', label: 'Design Identity', icon: FiSliders }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#03020A] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#03020A]'
              }`}
            >
              <Icon className={activeTab === t.id ? 'text-[#BEF264]' : 'text-purple-500'} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card hover={false} className="max-w-2xl">
          <h3 className="text-lg font-extrabold text-[#03020A] mb-4 pb-3 border-b border-purple-100">
            Director Profile Details
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Direct Phone</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Entity</label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="dark-nav-pill px-6 py-3 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <Card hover={false} className="max-w-2xl space-y-4">
          <h3 className="text-lg font-extrabold text-[#03020A] pb-3 border-b border-purple-100">
            Notification & Alarm Triggers
          </h3>

          <div className="space-y-3">
            {[
              { key: 'siteAlerts', title: 'High Priority Site Telemetry Alerts', desc: 'Instant push notification when machinery telemetry detects error' },
              { key: 'safetyIncidents', title: 'Safety Audit & Incident Reporting', desc: 'Real-time alert when safety officer files site audit' },
              { key: 'materialReorder', title: 'Material Low Stock Warning', desc: 'Trigger alert when cement or steel inventory drops below 25%' }
            ].map(item => (
              <div key={item.key} className="bg-white/80 p-4 rounded-2xl border border-white flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#03020A]">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                  className="w-5 h-5 accent-[#7C3AED] rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Theme Palette Reference */}
      {activeTab === 'theme' && (
        <Card hover={false} className="max-w-2xl space-y-4">
          <h3 className="text-lg font-extrabold text-[#03020A] pb-3 border-b border-purple-100">
            BuildOS Visual Theme Palette
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#E9D5FF] text-[#6B21A8] font-bold text-xs space-y-1 text-center shadow-sm">
              <span>Primary Lavender</span>
              <p className="text-[10px] opacity-80">#E9D5FF</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#7C3AED] text-white font-bold text-xs space-y-1 text-center shadow-sm">
              <span>Purple Accent</span>
              <p className="text-[10px] opacity-80">#7C3AED</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#BEF264] text-[#3F6212] font-bold text-xs space-y-1 text-center shadow-sm">
              <span>Pastel Lime</span>
              <p className="text-[10px] opacity-80">#BEF264</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#03020A] text-white font-bold text-xs space-y-1 text-center shadow-sm">
              <span>Near-Black Pill</span>
              <p className="text-[10px] opacity-80">#03020A</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Settings;