import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import { BackgroundDecorations } from '../components/common/BackgroundDecorations';

export const LoginPage = ({ onNavigateToSignUp, successMessage = '' }) => {
  const { login, authError, setAuthError, isFirebaseConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Guarantee all fields are empty whenever this page opens
  useEffect(() => {
    setEmail('');
    setPassword('');
    setLocalError('');
    setAuthError(null);
  }, []);

  const handleGoToSignUp = () => {
    setEmail('');
    setPassword('');
    setLocalError('');
    setAuthError(null);
    onNavigateToSignUp();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Clean inputs upon successful authentication
      setEmail('');
      setPassword('');
      setLocalError('');
    } catch (err) {
      let msg = err.message || 'Login failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password.';
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
        <div style={{ zIndex: 1, textAlign: 'center', marginTop: '0.5rem' }}>
          <Logo layout="vertical" size="normal" showTagline={true} />
        </div>

        {/* Center: Login Form */}
        <div style={{ zIndex: 1, width: '100%', margin: 'auto 0' }}>
          {successMessage && !localError && !authError && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #86EFAC',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {!isFirebaseConfigured && !localError && !authError && (
            <div
              style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FCD34D',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                lineHeight: 1.35
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Firebase Configuration Required:</strong>
                <div style={{ marginTop: '2px' }}>
                  Please replace <code>YOUR_ACTUAL_API_KEY</code> with your real Firebase Project credentials in <code>.env</code> or <code>src/firebase.js</code> to enable login and Firestore sync.
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
                padding: '0.6rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Email Address with Person Icon */}
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
                  padding: '0.8rem 1rem 0.8rem 2.6rem',
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

            {/* Password with Lock Icon */}
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
                  padding: '0.8rem 2.6rem 0.8rem 2.6rem',
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

            {/* Login Button */}
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
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#10251B' }}>
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={handleGoToSignUp}
              style={{
                background: 'none',
                border: 'none',
                color: '#15803D',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ zIndex: 1, height: '10px' }} />
      </div>
    </div>
  );
};
