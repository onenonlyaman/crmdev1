import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Shield, Info, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CrmSettings() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState({ text: '', type: '' });
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ text: '', type: '' });
    setProfileLoading(true);

    const result = await updateProfile({ fullName, username, email });
    setProfileLoading(false);

    if (result.success) {
      setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
    } else {
      setProfileMessage({ text: result.error || 'Failed to update profile', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecurityMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setSecurityMessage({ text: 'Password must be at least 6 characters long', type: 'error' });
      return;
    }

    setSecurityLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setSecurityLoading(false);

    if (result.success) {
      setSecurityMessage({ text: 'Password updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecurityMessage({ text: result.error || 'Failed to update password', type: 'error' });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0a0a0a',
        fontFamily: 'Inter, sans-serif',
        color: '#f8f8f8',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: '60px',
          borderBottom: '1px solid #1c1c1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: '16px', fontWeight: 600 }}>System Settings</h1>
        <button
          onClick={logout}
          style={{
            background: 'rgba(224, 54, 54, 0.1)',
            border: '1px solid rgba(224, 54, 54, 0.2)',
            color: '#fca5a5',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(224, 54, 54, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(224, 54, 54, 0.1)')}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* TABS SIDEBAR */}
        <div
          style={{
            width: '200px',
            borderRight: '1px solid #1c1c1c',
            background: '#0f0f0f',
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'system', label: 'System Info', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isSelected ? 'rgba(163, 82, 204, 0.15)' : 'transparent',
                  color: isSelected ? '#a352cc' : '#7c7c7c',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#171717';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '600px' }}>
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Profile Details</h2>
                <p style={{ fontSize: '13px', color: '#7c7c7c', marginBottom: '24px' }}>
                  Update your identity settings and default email contact.
                </p>

                {profileMessage.text && (
                  <div
                    style={{
                      background: profileMessage.type === 'success' ? 'rgba(48, 166, 109, 0.1)' : 'rgba(224, 54, 54, 0.1)',
                      border: profileMessage.type === 'success' ? '1px solid rgba(48, 166, 109, 0.2)' : '1px solid rgba(224, 54, 54, 0.2)',
                      color: profileMessage.type === 'success' ? '#86efac' : '#fca5a5',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {profileMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                    {profileMessage.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>FULL NAMELabel</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Riaan Attar"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>USERNAME</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={inputStyle}
                      placeholder="Username for login"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. admin@vps.com"
                    />
                  </div>
                  <button type="submit" disabled={profileLoading} style={btnStyle}>
                    {profileLoading ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Security Settings</h2>
                <p style={{ fontSize: '13px', color: '#7c7c7c', marginBottom: '24px' }}>
                  Keep your administrator credential secure. Password updates apply instantly.
                </p>

                {securityMessage.text && (
                  <div
                    style={{
                      background: securityMessage.type === 'success' ? 'rgba(48, 166, 109, 0.1)' : 'rgba(224, 54, 54, 0.1)',
                      border: securityMessage.type === 'success' ? '1px solid rgba(48, 166, 109, 0.2)' : '1px solid rgba(224, 54, 54, 0.2)',
                      color: securityMessage.type === 'success' ? '#86efac' : '#fca5a5',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {securityMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                    {securityMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>CURRENT PASSWORD</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>NEW PASSWORD</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>CONFIRM NEW PASSWORD</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button type="submit" disabled={securityLoading} style={btnStyle}>
                    {securityLoading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* SYSTEM INFO TAB */}
            {activeTab === 'system' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>VPS System Information</h2>
                <p style={{ fontSize: '13px', color: '#7c7c7c', marginBottom: '24px' }}>
                  Metadata details about this specific VPS container and database connection.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#0f0f0f', padding: '20px', borderRadius: '8px', border: '1px solid #1c1c1c' }}>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#7c7c7c' }}>Instance Type</span>
                    <span style={{ fontWeight: 500 }}>Standalone VPS Deployment</span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#7c7c7c' }}>Operating System</span>
                    <span style={{ fontWeight: 500 }}>Linux/Ubuntu (VPS Target Container)</span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#7c7c7c' }}>Database Status</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#30a66d', fontWeight: 500 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30a66d' }} />
                      Connected (MySQL)
                    </span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#7c7c7c' }}>Authentication Mode</span>
                    <span style={{ fontWeight: 500 }}>Single-user Auth Token (JWT)</span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#7c7c7c' }}>Server Environment</span>
                    <span style={{ fontWeight: 500 }}>Production / Standalone Node</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  height: '40px',
  background: '#141414',
  border: '1px solid #222',
  borderRadius: '6px',
  padding: '0 14px',
  fontSize: '14px',
  color: '#f8f8f8',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const btnStyle = {
  width: 'fit-content',
  height: '38px',
  background: 'linear-gradient(135deg, #a352cc 0%, #7928ca 100%)',
  border: 'none',
  borderRadius: '6px',
  color: '#ffffff',
  padding: '0 24px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(163, 82, 204, 0.15)',
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #141414',
  fontSize: '13px',
};
