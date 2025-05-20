import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { usersApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, isAdmin: boolean) => Promise<boolean>;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await usersApi.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // If token is invalid, clear it
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // If there's an error (like 401), clear the token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersApi.register(name, email, isAdmin);
      
      if (response.success) {
        setUser(response.data);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersApi.login(email);
      
      if (response.success) {
        setUser(response.data);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await usersApi.logout();
      // Always clear the token and user state, even if the API call fails
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear the token on error
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};