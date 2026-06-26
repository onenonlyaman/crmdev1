import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Shield, Info, LogOut, CheckCircle, AlertTriangle, Link as LinkIcon, RefreshCw, Trash2, Check, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

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

  // Integrations State
  const [integrations, setIntegrations] = useState([]);
  const [syncingProvider, setSyncingProvider] = useState('');
  const [integrationMessage, setIntegrationMessage] = useState({ text: '', type: '' });

  // Fetch connected integrations
  const fetchIntegrations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/integrations`);
      setIntegrations(response.data.integrations || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

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

  const handleConnect = (provider) => {
    window.location.href = `${API_BASE}/api/oauth/${provider}/login`;
  };

  const handleDisconnect = async (id) => {
    if (!window.confirm('Are you sure you want to disconnect this integration? This will remove token storage.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/integrations/${id}`);
      setIntegrationMessage({ text: 'Integration disconnected.', type: 'success' });
      fetchIntegrations();
    } catch (error) {
      setIntegrationMessage({ text: 'Failed to disconnect integration.', type: 'error' });
    }
  };

  const handleSync = async (provider) => {
    setSyncingProvider(provider);
    setIntegrationMessage({ text: '', type: '' });

    try {
      const response = await axios.post(`${API_BASE}/api/integrations/sync`, { provider });
      setIntegrationMessage({
        text: `Sync complete! Loaded ${response.data.job.recordsSynced} form(s) and target campaigns.`,
        type: 'success'
      });
      fetchIntegrations();
    } catch (error) {
      setIntegrationMessage({ text: 'Sync run failed.', type: 'error' });
    } finally {
      setSyncingProvider('');
    }
  };

  const getIntegration = (provider) => integrations.find(i => i.provider === provider);

  const googleInt = getIntegration('google');
  const metaInt = getIntegration('meta');

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
            { id: 'marketing', label: 'Marketing Ads', icon: LinkIcon },
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
          <div style={{ maxWidth: '680px' }}>
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
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf' }}>FULL NAME</label>
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

            {/* MARKETING ADS TAB */}
            {activeTab === 'marketing' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Marketing Lead Ads Integrations</h2>
                <p style={{ fontSize: '13px', color: '#7c7c7c', marginBottom: '24px' }}>
                  Connect external marketing platforms. Newly generated leads will automatically synchronize into your Leads database.
                </p>

                {integrationMessage.text && (
                  <div
                    style={{
                      background: integrationMessage.type === 'success' ? 'rgba(48, 166, 109, 0.1)' : 'rgba(224, 54, 54, 0.1)',
                      border: integrationMessage.type === 'success' ? '1px solid rgba(48, 166, 109, 0.2)' : '1px solid rgba(224, 54, 54, 0.2)',
                      color: integrationMessage.type === 'success' ? '#86efac' : '#fca5a5',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {integrationMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                    {integrationMessage.text}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* GOOGLE ADS PANEL */}
                  <div style={panelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f8f8f8', marginBottom: '4px' }}>Google Ads Lead Forms</h3>
                        <p style={{ fontSize: '12px', color: '#7c7c7c' }}>Collect leads from Google Search and Display network forms.</p>
                      </div>
                      {googleInt ? (
                        <span style={activeBadgeStyle}>
                          <Check size={12} /> Connected
                        </span>
                      ) : (
                        <span style={inactiveBadgeStyle}>Disconnected</span>
                      )}
                    </div>
                    
                    {googleInt && (
                      <div style={{ marginTop: '16px', fontSize: '13px', color: '#afafaf', background: '#0a0a0a', padding: '12px', borderRadius: '6px', border: '1px solid #1c1c1c' }}>
                        <div><strong>Account:</strong> {googleInt.accountName}</div>
                        <div style={{ marginTop: '6px' }}><strong>Sync Forms:</strong> {googleInt.config?.forms?.length || 0} active form mapping(s) detected.</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                      {googleInt ? (
                        <>
                          <button onClick={() => handleSync('google')} disabled={syncingProvider === 'google'} style={btnSecondaryStyle}>
                            <RefreshCw size={14} className={syncingProvider === 'google' ? 'animate-spin' : ''} />
                            Sync Campaigns & Forms
                          </button>
                          <button onClick={() => handleDisconnect(googleInt.id)} style={btnDangerStyle}>
                            <Trash2 size={14} />
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleConnect('google')} style={btnPrimaryStyle}>
                          <ExternalLink size={14} />
                          Connect Google Ads Account
                        </button>
                      )}
                    </div>
                  </div>

                  {/* META LEAD ADS PANEL */}
                  <div style={panelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f8f8f8', marginBottom: '4px' }}>Meta Lead Ads (Facebook & Instagram)</h3>
                        <p style={{ fontSize: '12px', color: '#7c7c7c' }}>Synchronize lead forms submitted on Facebook and Instagram Ads.</p>
                      </div>
                      {metaInt ? (
                        <span style={activeBadgeStyle}>
                          <Check size={12} /> Connected
                        </span>
                      ) : (
                        <span style={inactiveBadgeStyle}>Disconnected</span>
                      )}
                    </div>

                    {metaInt && (
                      <div style={{ marginTop: '16px', fontSize: '13px', color: '#afafaf', background: '#0a0a0a', padding: '12px', borderRadius: '6px', border: '1px solid #1c1c1c' }}>
                        <div><strong>Authorized User:</strong> {metaInt.accountName}</div>
                        <div style={{ marginTop: '6px' }}><strong>Target Forms:</strong> {metaInt.config?.forms?.length || 0} form mapping(s) loaded.</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                      {metaInt ? (
                        <>
                          <button onClick={() => handleSync('meta')} disabled={syncingProvider === 'meta'} style={btnSecondaryStyle}>
                            <RefreshCw size={14} className={syncingProvider === 'meta' ? 'animate-spin' : ''} />
                            Sync Pages & Forms
                          </button>
                          <button onClick={() => handleDisconnect(metaInt.id)} style={btnDangerStyle}>
                            <Trash2 size={14} />
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleConnect('meta')} style={btnPrimaryStyle}>
                          <ExternalLink size={14} />
                          Connect Meta Ads Account
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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

const panelStyle = {
  background: '#0f0f0f',
  border: '1px solid #1c1c1c',
  borderRadius: '8px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column'
};

const activeBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(48, 166, 109, 0.1)',
  border: '1px solid rgba(48, 166, 109, 0.2)',
  color: '#30a66d',
  fontSize: '11px',
  fontWeight: 500,
  padding: '3px 8px',
  borderRadius: '12px'
};

const inactiveBadgeStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#7c7c7c',
  fontSize: '11px',
  fontWeight: 500,
  padding: '3px 8px',
  borderRadius: '12px'
};

const btnPrimaryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'linear-gradient(135deg, #a352cc 0%, #7928ca 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(163, 82, 204, 0.15)'
};

const btnSecondaryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid #222',
  color: '#f8f8f8',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const btnDangerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(224, 54, 54, 0.1)',
  border: '1px solid rgba(224, 54, 54, 0.2)',
  color: '#fca5a5',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #141414',
  fontSize: '13px',
};
