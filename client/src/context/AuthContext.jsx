import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm_token'));
  const [loading, setLoading] = useState(true);

  // Set up global axios authorization interceptor and response handlers
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Automatic logout on token expiration/invalidity
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Load profile on startup if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to load profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('crm_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(`${API_BASE}/api/auth/profile`, updates);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Profile update failed';
      return { success: false, error: errorMsg };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`${API_BASE}/api/auth/change-password`, { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Password update failed';
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
