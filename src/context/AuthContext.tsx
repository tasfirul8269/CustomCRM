import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface Permission {
  resource: string;
  access: 'read' | 'write';
}

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'admin' | 'moderator';
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (resource: string, access?: 'read' | 'write') => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Try to get user data from localStorage first
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Fallback: decode token (not ideal but works for now)
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: decoded.id,
              name: decoded.name || 'unknown',
              email: decoded.email || 'unknown',
              profileImage: decoded.profileImage,
              role: decoded.role,
              permissions: decoded.permissions || []
            });
          }
        } catch (error) {
          console.error('Failed to load user from token', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (resource: string, access: 'read' | 'write' = 'read'): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.role === 'moderator') {
      const permission = user.permissions.find(p => p.resource === resource);
      if (permission) {
        // If user has write access, they can also read
        return permission.access === 'write' || 
               (access === 'read' && permission.access === 'read');
      }
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}; 