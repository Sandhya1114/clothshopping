'use client';

import { createContext, useEffect, useState } from 'react';
import { getCurrentUser, login, signup } from '@/lib/api';

export const AuthContext = createContext(null);

const tokenKey = 'northstitch-auth-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        setIsReady(true);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (error) {
        window.localStorage.removeItem(tokenKey);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    }

    restoreSession();
  }, []);

  function persistAuth(authData) {
    window.localStorage.setItem(tokenKey, authData.token);
    setUser(authData.user);
  }

  async function signupUser(payload) {
    setIsAuthenticating(true);

    try {
      const response = await signup(payload);
      persistAuth(response);
      return response;
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function loginUser(payload) {
    setIsAuthenticating(true);

    try {
      const response = await login(payload);
      persistAuth(response);
      return response;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function logoutUser() {
    window.localStorage.removeItem(tokenKey);
    setUser(null);
  }

  const value = {
    user,
    isReady,
    isLoggedIn: Boolean(user),
    isAuthenticating,
    signupUser,
    loginUser,
    logoutUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
