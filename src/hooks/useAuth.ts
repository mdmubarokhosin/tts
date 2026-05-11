'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as loginFn, register as registerFn, logout as logoutFn, type User } from '@/lib/auth';

export interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function getInitialAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false, isLoading: true };
  }
  const user = getCurrentUser();
  return { user, isAuthenticated: !!user, isLoading: false };
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(getInitialAuthState);

  useEffect(() => {
    const user = getCurrentUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = loginFn(email, password);
    if (result.success && result.user) {
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
    return result;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const result = registerFn(name, email, password);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutFn();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refresh = useCallback(() => {
    const user = getCurrentUser();
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refresh,
  };
}
