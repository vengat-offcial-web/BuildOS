import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/useData';
import profileFallback from '../assets/profile.png';
import {
  SettingsHeader,
  AdminProfileCard,
  WorkspaceDataCard
} from '../components/Settings';

function Settings() {
  const { user, updateProfile } = useAuth();
  const { clearAllData, restoreSampleData, projects = [], workers = [], tasks = [] } = useData() || {};
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [dataMessage, setDataMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(user?.avatar || profileFallback);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'VENGADESH V',
    title: user?.title || 'Project Director & Site Overseer',
    email: user?.email || 'admin@gmail.com',
    phone: user?.phone || '+91 98765 43210',
    company: user?.company || 'BuildOS Construction Ltd'
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all demo mock data? This will set BuildOS to a clean slate so you can enter your real construction projects, engineers, and site tasks.")) {
      clearAllData && clearAllData();
      setDataMessage('Demo mock data cleared! BuildOS is now set to a 100% Clean Slate for real data entry.');
      setTimeout(() => setDataMessage(''), 4500);
    }
  };

  const handleRestoreSample = () => {
    if (window.confirm("Restore default demo sample data?")) {
      restoreSampleData && restoreSampleData();
      setDataMessage('Default demo sample data restored successfully!');
      setTimeout(() => setDataMessage(''), 4500);
    }
  };

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

  const handleRemoveAvatar = () => {
    setAvatar(profileFallback);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password && password !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    if (updateProfile) {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        title: profileData.title,
        phone: profileData.phone,
        company: profileData.company,
        avatar: avatar
      };
      if (password) {
        updateData.password = password;
      }
      updateProfile(updateData);
    }

    setPassword('');
    setConfirmPassword('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <SettingsHeader savedSuccess={savedSuccess} />

      {/* Admin Profile & Security Card */}
      <AdminProfileCard
        profileData={profileData}
        setProfileData={setProfileData}
        avatar={avatar}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleRemoveAvatar={handleRemoveAvatar}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        errorMessage={errorMessage}
        savedSuccess={savedSuccess}
        onSave={handleSave}
      />

      {/* System Data & Production Workspace Mode Card */}
      <WorkspaceDataCard
        projectsCount={(projects || []).length}
        workersCount={(workers || []).length}
        tasksCount={(tasks || []).length}
        dataMessage={dataMessage}
        onClearData={handleClearData}
        onRestoreSample={handleRestoreSample}
      />
    </div>
  );
}

export default Settings;