import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('cinesphere_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('cinesphere_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('cinesphere_user', JSON.stringify(res.data.data));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.',
      };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const res = await registerApi({ name, email, password, role });
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('cinesphere_user', JSON.stringify(res.data.data));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || `Registration failed: ${err.message}`,
      };
    }
  };

  // Instant login helper for placement presentation demos!
  const quickDemoLogin = async (role = 'admin') => {
    if (role === 'admin') {
      return await login('admin@cinesphere.com', 'admin123');
    } else {
      return await login('user@cinesphere.com', 'user123');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinesphere_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
