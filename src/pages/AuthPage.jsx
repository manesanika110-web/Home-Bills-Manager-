import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignUpPage } from './SignUpPage';

export const AuthPage = ({ initialMode = 'signup' }) => {
  const [authMode, setAuthMode] = useState(initialMode);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNavigateToLogin = (msg = '') => {
    setSuccessMessage(msg || '');
    setAuthMode('login');
  };

  const handleNavigateToSignUp = () => {
    setSuccessMessage('');
    setAuthMode('signup');
  };

  if (authMode === 'login') {
    return (
      <LoginPage
        onNavigateToSignUp={handleNavigateToSignUp}
        successMessage={successMessage}
      />
    );
  }

  return (
    <SignUpPage
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
};
