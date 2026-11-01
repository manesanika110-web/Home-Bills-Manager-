import React from 'react';

export const DottedSpinner = ({ size = 44, color = '#15803D' }) => {
  const dotCount = 8;
  const radius = size * 0.38;
  const center = size / 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-block'
      }}
      role="progressbar"
      aria-label="Loading..."
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: dotCount }).map((_, i) => {
          const angle = (i * 360) / dotCount;
          const rad = (angle * Math.PI) / 180;
          const cx = center + radius * Math.cos(rad);
          const cy = center + radius * Math.sin(rad);
          const delay = (i * 0.12).toFixed(2);

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={size * 0.065}
              fill={color}
              style={{
                animation: `pulseDot 1s infinite ease-in-out`,
                animationDelay: `${delay}s`,
                transformOrigin: `${cx}px ${cy}px`
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
