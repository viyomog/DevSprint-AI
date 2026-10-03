import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client';

export interface User {
  id: number;
  full_name: string;
  email: string;
  target_role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, targetRole?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('devsprint_token') || localStorage.getItem('hiremind_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const userData = await apiRequest<User>('/auth/me');
          setUser(userData);
        } catch {
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('devsprint_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (full_name: string, email: string, password: string, target_role?: string) => {
    const res = await apiRequest<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password, target_role }),
    });
    localStorage.setItem('devsprint_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('devsprint_token');
    localStorage.removeItem('hiremind_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
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
