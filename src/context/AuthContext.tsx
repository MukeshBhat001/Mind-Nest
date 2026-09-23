/**
 * Authentication Context & State Provider
 * Mind Nest - University Web Applications Assignment
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'guest' | 'member' | 'admin';
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  isAdmin: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mindnest_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile on startup if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('mindnest_token');
          setToken(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem('mindnest_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.login(credentials);
      if (res.success && res.token) {
        localStorage.setItem('mindnest_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch {
      return { success: false, message: 'Server communication error during login.' };
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await api.register(data);
      if (res.success && res.token) {
        localStorage.setItem('mindnest_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch {
      return { success: false, message: 'Server communication error during registration.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('mindnest_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const isAdmin = user?.role === 'admin';
  const isMember = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
