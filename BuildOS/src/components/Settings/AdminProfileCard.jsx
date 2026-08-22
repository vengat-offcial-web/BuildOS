import React from 'react';
import { Card } from '../ui';
import { 
  FiUser, 
  FiAlertCircle, 
  FiCamera, 
  FiUpload, 
  FiTrash2, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiCheck, 
  FiSave 
} from 'react-icons/fi';
import profileFallback from '../../assets/profile.png';

export function AdminProfileCard({
  profileData,
  setProfileData,
  avatar,
  fileInputRef,
  handleFileChange,
  handleRemoveAvatar,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  errorMessage,
  savedSuccess,
  onSave
}) {
  return (
    <Card hover={false} className="max-w-2xl space-y-6">
      <h3 className="text-lg font-extrabold text-[#03020A] pb-3 border-b border-purple-100 flex items-center gap-2">
        <FiUser className="text-[#7C3AED]" />
        Director Profile & Password
      </h3>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl text-xs font-bold bg-[#FFE4E6] border border-[#FECDD3] text-[#9F1239] flex items-center gap-2">
          <FiAlertCircle className="text-base shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Clean Profile Picture Section */}
      <div className="bg-gradient-to-r from-purple-50/60 to-purple-100/30 p-5 rounded-3xl border border-purple-100/80 space-y-3">
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

          {/* Upload & Reset Buttons Only */}
          <div className="flex-1 space-y-2.5 text-center sm:text-left">
            <div>
              <h4 className="text-xs font-extrabold text-[#03020A]">{profileData.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{profileData.title}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
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
                className="dark-nav-pill px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiUpload className="text-xs text-[#BEF264]" />
                <span>Upload Image</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="px-4 py-2 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiTrash2 className="text-xs" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-4">
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

        {/* Security & Admin Password Fields */}
        <div className="pt-3 border-t border-purple-100 space-y-4">
          <div className="flex items-center gap-2">
            <FiLock className="text-[#7C3AED] text-sm" />
            <h4 className="text-xs font-extrabold text-[#03020A]">Change Admin Password</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                New Password <span className="text-slate-400 font-normal">(Leave blank to keep current)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 pr-10 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-600 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-2.5 pr-10 text-xs font-semibold text-[#03020A] outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="dark-nav-pill px-6 py-3 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all cursor-pointer flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <FiCheck className="text-sm text-[#BEF264]" />
                <span className="text-[#BEF264]">Profile Changes Saved!</span>
              </>
            ) : (
              <>
                <FiSave className="text-sm text-[#BEF264]" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default AdminProfileCard;
