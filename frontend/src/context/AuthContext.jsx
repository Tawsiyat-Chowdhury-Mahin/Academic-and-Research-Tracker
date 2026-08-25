import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    // Check if user is stored in localStorage
    const savedUser = localStorage.getItem('academic_tracker_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('academic_tracker_user');
        localStorage.removeItem('academic_tracker_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      setUser(data.user);
      localStorage.setItem('academic_tracker_user', JSON.stringify(data.user));
      localStorage.setItem('academic_tracker_token', data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register account');
      }

      setUser(data.user);
      localStorage.setItem('academic_tracker_user', JSON.stringify(data.user));
      localStorage.setItem('academic_tracker_token', data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('academic_tracker_user');
    localStorage.removeItem('academic_tracker_token');
  };

  // Quick 1-click login for grading and teammates
  const quickDemoLogin = async (role = 'student') => {
    if (role === 'student') {
      return await login('demo@student.edu', 'password123');
    } else {
      return await login('faculty@uni.edu', 'faculty123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
