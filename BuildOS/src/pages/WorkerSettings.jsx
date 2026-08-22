import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui';
import {
  FiSave,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import profileFallback from '../assets/profile.png';
import {
  WorkerProfilePictureCard,
  WorkerPersonalDetailsCard,
  WorkerSecurityCard
} from '../components/WorkerSettings';

function WorkerSettings() {
  const { user, updateProfile } = useAuth();

  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(user?.avatar || profileFallback);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [theme, setTheme] = useState(user?.theme || 'purple');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size exceeds 5MB limit. Please choose a smaller image.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(profileFallback);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Email cannot be empty.' });
      return;
    }

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const updatedData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: avatar,
        theme
      };

      if (password) {
        updatedData.password = password;
      }

      const res = updateProfile(updatedData);
      setLoading(false);

      if (res.success) {
        setMessage({ type: 'success', text: 'Worker profile and settings updated successfully!' });
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-8">
      <PageHeader
        title="Worker Profile & Settings"
        description="Update your personal information, email address, and security credentials."
        variant="purple"
      />

      {/* Notification Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border shadow-xs transition-all ${
          message.type === 'success'
            ? 'bg-[#F0FDC2] border-[#BEF264] text-[#3F6212]'
            : 'bg-[#FFE4E6] border-[#FECDD3] text-[#9F1239]'
        }`}>
          {message.type === 'success' ? (
            <FiCheckCircle className="text-base shrink-0" />
          ) : (
            <FiAlertCircle className="text-base shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Card */}
        <WorkerProfilePictureCard
          avatar={avatar}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleRemoveAvatar={handleRemoveAvatar}
          displayName={name || user?.name || 'Worker'}
          tradeRole={user?.tradeRole || user?.title || 'Site Specialist'}
        />

        {/* Personal Profile Details Card */}
        <WorkerPersonalDetailsCard
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
        />

        {/* Password Change Card */}
        <WorkerSecurityCard
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="dark-nav-pill px-6 py-3 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-black transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <FiSave className="text-sm text-[#BEF264]" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkerSettings;
