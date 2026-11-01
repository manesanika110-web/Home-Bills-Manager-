import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  subscribeToAuthChanges
} from '../firebase/authService';
import { isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthChanges((user) => {
      // Open dashboard only after successful authentication in this session
      const isSessionAuth = typeof window !== 'undefined' && sessionStorage.getItem('home_bills_authenticated') === 'true';
      if (user && isSessionAuth) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    if (!isFirebaseConfigured) {
      const err = new Error('Firebase configuration missing or contains placeholder values. Please add your actual Firebase project credentials to .env or src/firebase.js.');
      setAuthError(err.message);
      throw err;
    }
    try {
      const cred = await loginWithEmail(email, password);
      // Mark as authenticated in this session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('home_bills_authenticated', 'true');
      }
      setCurrentUser(cred.user);
      return cred.user;
    } catch (err) {
      let message = err.message || 'Login failed.';
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        message = 'Invalid Firebase API Key. Please verify your API key in .env or src/firebase.js.';
      }
      setAuthError(message);
      throw err;
    }
  };

  const register = async (email, password, fullName = '') => {
    setAuthError(null);
    if (!isFirebaseConfigured) {
      const err = new Error('Firebase configuration missing or contains placeholder values. Please add your actual Firebase project credentials to .env or src/firebase.js.');
      setAuthError(err.message);
      throw err;
    }
    try {
      const cred = await registerWithEmail(email, password, fullName);
      return cred.user;
    } catch (err) {
      let message = err.message || 'Registration failed.';
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        message = 'Invalid Firebase API Key. Please verify your API key in .env or src/firebase.js.';
      }
      setAuthError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('home_bills_authenticated');
      }
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    currentUser,
    loading,
    isFirebaseConfigured,
    authError,
    setAuthError,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
