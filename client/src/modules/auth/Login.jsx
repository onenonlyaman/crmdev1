import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(circle at top right, #1a0f2e 0%, #080808 60%, #000000 100%)',
        fontFamily: 'Inter, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 15, 15, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* LOGO ICON */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a352cc 0%, #63259e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 8px 16px rgba(163, 82, 204, 0.25)',
          }}
        >
          <Shield size={22} color="#ffffff" />
        </div>

        {/* HEADER */}
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#f8f8f8', marginBottom: '8px', textAlign: 'center' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: '14px', color: '#7c7c7c', marginBottom: '32px', textAlign: 'center' }}>
          Sign in to your CRM control center
        </p>

        {/* ERROR DISPLAY */}
        {error && (
          <div
            style={{
              width: '100%',
              background: 'rgba(224, 54, 54, 0.1)',
              border: '1px solid rgba(224, 54, 54, 0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* USERNAME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf', letterSpacing: '0.02em' }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              style={{
                width: '100%',
                height: '42px',
                background: '#141414',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '0 16px',
                fontSize: '14px',
                color: '#f8f8f8',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a352cc';
                e.target.style.boxShadow = '0 0 0 2px rgba(163, 82, 204, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#222';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf', letterSpacing: '0.02em' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '42px',
                  background: '#141414',
                  border: '1px solid #222',
                  borderRadius: '8px',
                  padding: '0 44px 0 16px',
                  fontSize: '14px',
                  color: '#f8f8f8',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a352cc';
                  e.target.style.boxShadow = '0 0 0 2px rgba(163, 82, 204, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#222';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#7c7c7c',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              background: 'linear-gradient(135deg, #a352cc 0%, #7928ca 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(163, 82, 204, 0.2)',
              transition: 'opacity 0.2s, transform 0.1s',
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
