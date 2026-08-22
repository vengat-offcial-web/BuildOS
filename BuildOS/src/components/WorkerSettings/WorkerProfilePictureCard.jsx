import React from 'react';
import { Card } from '../ui';
import { FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi';
import profileFallback from '../../assets/profile.png';

export function WorkerProfilePictureCard({
  avatar,
  fileInputRef,
  handleFileChange,
  handleRemoveAvatar,
  displayName,
  tradeRole
}) {
  return (
    <Card hover={false} className="space-y-4">
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
        <FiCamera className="text-[#7C3AED] text-base" />
        <h3 className="text-base font-extrabold text-[#03020A]">Worker Profile Picture</h3>
      </div>

      <div className="bg-gradient-to-r from-purple-50/60 to-purple-100/30 p-5 rounded-3xl border border-purple-100/80">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Preview */}
          <div className="relative shrink-0 group">
            <img
              src={avatar}
              alt="Worker Avatar Preview"
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

          {/* Upload & Reset Buttons */}
          <div className="flex-1 space-y-2.5 text-center sm:text-left">
            <div>
              <h4 className="text-xs font-extrabold text-[#03020A]">{displayName}</h4>
              <p className="text-[11px] text-[#7C3AED] font-bold">{tradeRole}</p>
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
    </Card>
  );
}

export default WorkerProfilePictureCard;
