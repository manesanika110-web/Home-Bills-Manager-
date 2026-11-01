import React from 'react';

export const HouseLogo = ({
  size = 80,
  inverted = false,
  className = ''
}) => {
  const primaryDark = inverted ? '#FFFFFF' : '#0B4D33';
  const accentGreen = inverted ? '#4ADE80' : '#22C55E';
  const lightMint = inverted ? '#0B4D33' : '#FFFFFF';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* Chimney on the right slope */}
      <rect
        x="72"
        y="30"
        width="11"
        height="22"
        rx="2"
        fill={primaryDark}
      />
      <rect
        x="70"
        y="28"
        width="15"
        height="4"
        rx="1.5"
        fill={primaryDark}
      />

      {/* House Gable Roof */}
      <path
        d="M60 22 L24 52 L31 58 L60 34 L89 58 L96 52 Z"
        fill={primaryDark}
      />

      {/* House Body */}
      <path
        d="M34 54 H86 V90 H34 Z"
        fill={primaryDark}
      />

      {/* 4 Square Window Panes (2x2) */}
      <rect x="46" y="58" width="11" height="11" rx="1.5" fill={lightMint} />
      <rect x="63" y="58" width="11" height="11" rx="1.5" fill={lightMint} />
      <rect x="46" y="73" width="11" height="11" rx="1.5" fill={lightMint} />
      <rect x="63" y="73" width="11" height="11" rx="1.5" fill={lightMint} />

      {/* Wavy Green Grass Swoosh at Base */}
      <path
        d="M18 96 C30 84, 52 86, 68 94 C82 101, 102 96, 110 88 C102 99, 80 106, 62 98 C46 91, 30 94, 18 96 Z"
        fill={accentGreen}
      />
      {/* Lower wave accent with leaf tip */}
      <path
        d="M24 100 C38 90, 60 93, 76 101 C90 108, 106 102, 112 96 C104 104, 84 112, 68 105 C52 98, 36 100, 24 100 Z"
        fill="#16A34A"
      />
      {/* Small sprout leaf at bottom left of swoosh */}
      <path
        d="M20 94 C14 88, 18 80, 26 84 C26 92, 22 94, 20 94 Z"
        fill={accentGreen}
      />
    </svg>
  );
};

export const Logo = ({ size = 'normal', inverted = false, showTagline = true, layout = 'horizontal', className = '' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconPx = isLarge ? 85 : isSmall ? 32 : layout === 'vertical' ? 70 : 40;
  const textColor = inverted ? '#FFFFFF' : '#0B4D33';
  const subtitleColor = inverted ? '#A7F3D0' : '#15803D';

  if (layout === 'vertical') {
    return (
      <div className={`logo-container-vertical ${className}`} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HouseLogo size={iconPx} inverted={inverted} />
        <h1
          style={{
            margin: '0.65rem 0 0.2rem 0',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: isLarge ? '1.75rem' : '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: textColor,
            lineHeight: 1.15
          }}
        >
          Home Bills Manager
        </h1>
        {showTagline && (
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 600,
              color: subtitleColor,
              letterSpacing: '-0.01em'
            }}
          >
            Manage Your Home Bills Easily
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
      <HouseLogo size={iconPx} inverted={inverted} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: isSmall ? '1.1rem' : '1.3rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: textColor,
            lineHeight: 1.15
          }}
        >
          Home Bills <span style={{ color: inverted ? '#4ADE80' : '#15803D' }}>Manager</span>
        </span>
        {showTagline && !isSmall && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: subtitleColor,
              marginTop: '0.15rem',
              letterSpacing: '0.01em'
            }}
          >
            Manage Your Home Bills Easily
          </span>
        )}
      </div>
    </div>
  );
};
