"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  registerClient: (data: any) => Promise<void>;
  registerCompany: (data: any) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: any) => {
    const { access_token: accessToken } = await authService.login(data);
    if (!accessToken) {
      throw new Error('Login response did not include an access token');
    }
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    // Fetch full user profile (includes companyRole, company, etc.)
    await fetchUser();
    router.push('/dashboard');
  };

  const registerClient = async (data: any) => {
    await authService.registerClient(data);
    router.push('/auth/login?registered=true');
  };

  const registerCompany = async (data: any) => {
    await authService.registerCompany(data);
    router.push('/auth/login?registered=true');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, registerClient, registerCompany, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
