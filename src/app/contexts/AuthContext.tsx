// AuthContext.tsx
'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkAuthStatus } from '@/api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  hasSubscription: boolean;
  userRole: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    hasSubscription: false,
    userRole: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setAuthState({
          isAuthenticated: authStatus.is_authenticated,
          hasSubscription: !!authStatus.subscription,
          userRole: authStatus.user_role, // Asumimos que el backend devuelve el rol del usuario
          loading: false,
        });
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthState({
          isAuthenticated: false,
          hasSubscription: false,
          userRole: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};