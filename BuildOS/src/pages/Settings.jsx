import React, { useState, useRef } from 'react';
import { Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiShield, 
  FiSliders, 
  FiCheck, 
  FiCamera, 
  FiUpload, 
  FiTrash2, 
  FiLink, 
  FiImage 
} from 'react-icons/fi';
import profileFallback from '../assets/profile.png';

const PRESET_AVATARS = [
  { id: 'av1', label: 'Executive 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Executive 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Executive 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Executive 4', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Executive 5', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Executive 6', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' }
];

function Settings() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(user?.avatar || profileFallback);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || 'VENGADESH V',
    title: user?.title || 'Project Director & Site Overseer',
    email: user?.email || 'admin@buildos.com',
    phone: user?.phone || '+91 98765 43210',
    company: user?.company || 'BuildOS Construction Ltd'
  });

  const [notifications, setNotifications] = useState({
    siteAlerts: true,
    safetyIncidents: true,
    materialReorder: true,
    dailyDigest: false
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size exceeds 5MB limit. Please choose a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setAvatar(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(profileFallback);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({
        name: profileData.name,
        email: profileData.email,
        title: profileData.title,
        phone: profileData.phone,
        company: profileData.company,
        avatar: avatar
      });
    }
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
            Configure profile credentials, avatar picture, site notification triggers, and security controls.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm animate-in fade-in">
            <FiCheck className="text-sm" />
            <span>Profile and settings saved successfully!</span>
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
              type="button"
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
        <Card hover={false} className="max-w-2xl space-y-6">
          <h3 className="text-lg font-extrabold text-[#03020A] pb-3 border-b border-purple-100">
            Director Profile & Picture
          </h3>

          {/* Profile Picture Management Card */}
          <div className="bg-gradient-to-r from-purple-50/60 to-purple-100/30 p-5 rounded-3xl border border-purple-100/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#03020A]">
              <FiCamera className="text-[#7C3AED] text-sm" />
              <span>Admin Profile Picture</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative shrink-0 group">
                <img
                  src={avatar}
                  alt="Admin Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#7C3AED]/30 shadow-lg bg-white"
                  onError={(e) => { e.target.src = profileFallback; }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change Photo"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#03020A] text-[#BEF264] flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border-2 border-white"
                >
                  <FiCamera className="text-xs" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex-1 space-y-2.5 text-center sm:text-left">
                <div>
                  <h4 className="text-xs font-extrabold text-[#03020A]">{profileData.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{profileData.title}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {/* File Upload Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="dark-nav-pill px-3.5 py-2 rounded-full text-xs font-bold text-white shadow-xs hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FiUpload className="text-xs text-[#BEF264]" />
                    <span>Upload Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-3.5 py-2 rounded-full text-xs font-bold bg-white text-slate-700 border border-purple-100 hover:bg-purple-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FiLink className="text-xs text-purple-600" />
                    <span>Image URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3.5 py-2 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FiTrash2 className="text-xs" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Optional Custom URL Input */}
                {showUrlInput && (
                  <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2 pt-2 animate-in fade-in">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-purple-700 transition-all cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Presets Gallery */}
            <div className="pt-2 border-t border-purple-100/60">
              <label className="text-[11px] font-bold text-slate-600 block mb-2 flex items-center gap-1">
                <FiImage className="text-purple-500" /> Or Select From Avatar Presets:
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatar(preset.url)}
                    className={`relative rounded-full shrink-0 transition-all cursor-pointer p-0.5 ${
                      avatar === preset.url
                        ? 'ring-2 ring-[#7C3AED] scale-105 shadow-md'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {avatar === preset.url && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7C3AED] text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                className="dark-nav-pill px-6 py-3 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer flex items-center gap-2"
              >
                <FiCheck className="text-sm text-[#BEF264]" />
                <span>Save Profile Changes</span>
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