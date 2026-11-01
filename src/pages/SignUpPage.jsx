import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../firebase/authService';
import { Logo } from '../components/common/Logo';
import { BackgroundDecorations } from '../components/common/BackgroundDecorations';

export const SignUpPage = ({ onNavigateToLogin }) => {
  const { register, authError, setAuthError, isFirebaseConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Guarantee all fields are empty whenever this page opens
  useEffect(() => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLocalError('');
    setAuthError(null);
  }, []);

  const handleGoToLogin = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLocalError('');
    setAuthError(null);
    onNavigateToLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    if (!fullName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }

    if (!email || !password) {
      setLocalError('Please enter email and password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName.trim());
      // Required flow: Splash Screen -> Sign Up -> Login -> Dashboard
      // Sign out new registration so user explicitly logs in on Login page
      await logoutUser();
      // Wipe inputs completely
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLocalError('');
      // Navigate to Login screen with success confirmation
      onNavigateToLogin('Account created successfully! Please log in with your email and password.');
    } catch (err) {
      let msg = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try logging in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-screen-wrapper"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#E8F5E9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="phone-container"
        style={{
          width: '100%',
          maxWidth: '380px',
          minHeight: '620px',
          height: '86vh',
          maxHeight: '750px',
          backgroundColor: '#FFFFFF',
          borderRadius: '36px',
          border: '1.5px solid #CBD5E1',
          boxShadow: '0 25px 50px -12px rgba(6, 78, 50, 0.18)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem 1.75rem 2rem 1.75rem',
          boxSizing: 'border-box'
        }}
      >
        <BackgroundDecorations />

        {/* Top: Logo & Title */}
        <div style={{ zIndex: 1, textAlign: 'center', marginTop: '0.25rem' }}>
          <Logo layout="vertical" size="normal" showTagline={true} />
        </div>

        {/* Center: Sign Up Form matching Screen 3 */}
        <div style={{ zIndex: 1, width: '100%', margin: 'auto 0' }}>
          {!isFirebaseConfigured && !localError && !authError && (
            <div
              style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FCD34D',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                lineHeight: 1.35
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Firebase Configuration Required:</strong>
                <div style={{ marginTop: '2px' }}>
                  Please replace <code>YOUR_ACTUAL_API_KEY</code> with your real Firebase Project credentials in <code>.env</code> or <code>src/firebase.js</code> to create an account.
                </div>
              </div>
            </div>
          )}

          {(localError || authError) && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                border: '1px solid #FECACA',
                padding: '0.5rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Full Name */}
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0B4D33'
                }}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.9rem',
                  color: '#10251B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Email Address */}
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0B4D33'
                }}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.9rem',
                  color: '#10251B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0B4D33'
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                spellCheck="false"
                autoCorrect="off"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.9rem',
                  color: '#10251B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0B4D33'
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                spellCheck="false"
                autoCorrect="off"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.9rem',
                  color: '#10251B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.35rem',
                backgroundColor: '#0B4D33',
                color: '#FFFFFF',
                padding: '0.85rem',
                borderRadius: '14px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(11, 77, 51, 0.35)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#10251B' }}>
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={handleGoToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#15803D',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Login
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ zIndex: 1, height: '10px' }} />
      </div>
    </div>
  );
};
