import React from 'react'
import "../Css/settings.css"
function Settings() {
  return (
    <div className='settings'>
        <div className='settings-header'>
            <h2>Settings</h2>
            <p>Manage your account and application preferences.</p>

        </div>
        <div className='settings-card profile-box'>
            <h3>Profile</h3>
            <div className='profile-details'>
                <p><strong>Name :</strong>Vengadesh V</p>
                <p><strong>Email :</strong> vengat.offcl@constructos.com</p>
                <p><strong>Role :</strong>Administrator</p>
                <p><strong>Phone :</strong> +91980101032</p>
            </div>

            <button>Edit Profile</button>

        </div>
        <div className='settings-card security-box'>
            <h3>Security</h3>
            <div className='security-inputs'>
                <input type="password" placeholder='Current Password' />
                <input type="password" placeholder='New Password' />
                <input type="password" placeholder='Confirm Password' />
            </div>

            <button>Change Password</button>
        </div>
        <div className='settings-card appearance-box'>
            <h3>Appearance</h3>
            <div className='appearance-options'>
                <label>Theme</label>
                <select>
                    <option value="">Light</option>
                    <option value="">Dark</option>
                </select>

                <label>Language</label>
                <select>
                    <option value="">English</option>
                </select>
            </div>
        </div>
        <div className='settings-card notification-box'>
             <h3>Notifications</h3>
             <div className='notification-options'>
                  <label><input type="checkbox" />Email Notifications</label>
                  <label><input type="checkbox" />Project Alerts</label>
                  <label><input type="checkbox" />Task Reminders</label>
                  <label><input type="checkbox" name="" id="" />Machine Maintenance Alerts</label>
             </div>
        </div>
        <div className='settings-card application-box'>
            <h3>Application</h3>
            <div className='application-details'>
                <p><strong>Version :</strong> ConstructOS v1.0</p>
                <p><strong>Last Updated :</strong>02 Aug 2026</p>

            </div>

        </div>
        <div className='save-btn'>
            <button>Save Changes</button>

        </div>
    </div>
  )
}

export default Settings