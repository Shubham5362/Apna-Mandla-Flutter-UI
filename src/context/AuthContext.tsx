import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.status === 401) {
          console.info('Session expired or unauthorized token. Clearing token.');
        } else {
          console.error('Failed to fetch user:', error);
        }
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials: any) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('token', data.token);
    const userData = await authApi.getMe();
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData: any) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
