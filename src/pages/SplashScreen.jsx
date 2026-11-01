import React, { useEffect } from 'react';
import { Logo } from '../components/common/Logo';
import { BackgroundDecorations } from '../components/common/BackgroundDecorations';
import { DottedSpinner } from '../components/common/DottedSpinner';

export const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="splash-screen-wrapper"
      onClick={onFinish}
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#E8F5E9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        cursor: 'pointer'
      }}
    >
      <div
        className="phone-container"
        style={{
          width: '100%',
          maxWidth: '380px',
          minHeight: '620px',
          height: '84vh',
          maxHeight: '750px',
          backgroundColor: '#FFFFFF',
          borderRadius: '36px',
          border: '1.5px solid #CBD5E1',
          boxShadow: '0 25px 50px -12px rgba(6, 78, 50, 0.18)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '3.5rem 1.75rem 3rem 1.75rem',
          boxSizing: 'border-box'
        }}
      >
        <BackgroundDecorations />

        {/* Top spacer */}
        <div style={{ zIndex: 1, height: '20px' }} />

        {/* Center: Logo, Title, Tagline */}
        <div style={{ zIndex: 1, textAlign: 'center', marginTop: '-20px' }}>
          <Logo layout="vertical" size="large" showTagline={true} />
        </div>

        {/* Bottom Loading Animation */}
        <div
          style={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1rem'
          }}
        >
          <DottedSpinner size={46} color="#15803D" />
        </div>
      </div>
    </div>
  );
};
