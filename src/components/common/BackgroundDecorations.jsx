import React from 'react';

export const BackgroundDecorations = () => {
  return (
    <div
      className="bg-decorations"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
      aria-hidden="true"
    >
      {/* Top Left Leaf Foliage */}
      <svg
        style={{
          position: 'absolute',
          top: '-15px',
          left: '-20px',
          width: '160px',
          height: '160px',
          opacity: 0.35
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M10 20 C35 5, 65 25, 50 60 C35 95, 5 70, 10 20 Z" fill="#86EFAC" />
        <path d="M30 10 C55 -5, 80 15, 70 45 C60 75, 25 50, 30 10 Z" fill="#BBF7D0" />
        <path d="M0 45 C25 35, 45 55, 30 85 C15 115, -15 85, 0 45 Z" fill="#4ADE80" />
        <path d="M50 35 C70 20, 90 40, 80 70 C70 95, 40 75, 50 35 Z" fill="#DCFCE7" />
      </svg>

      {/* Top Right Leaf Foliage */}
      <svg
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-20px',
          width: '150px',
          height: '150px',
          opacity: 0.35,
          transform: 'scaleX(-1)'
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M10 20 C35 5, 65 25, 50 60 C35 95, 5 70, 10 20 Z" fill="#86EFAC" />
        <path d="M30 10 C55 -5, 80 15, 70 45 C60 75, 25 50, 30 10 Z" fill="#BBF7D0" />
        <path d="M0 45 C25 35, 45 55, 30 85 C15 115, -15 85, 0 45 Z" fill="#4ADE80" />
      </svg>

      {/* Bottom Rolling Hills & Houses Silhouette */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '110px',
          opacity: 0.45
        }}
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Back Hill */}
        <path
          d="M0 70 Q90 30, 200 60 T400 50 L400 120 L0 120 Z"
          fill="#DCFCE7"
        />

        {/* Little houses silhouette on hills */}
        <g fill="#A7F3D0" opacity="0.7">
          {/* House 1 */}
          <path d="M45 62 L55 52 L65 62 V78 H45 Z" />
          <path d="M68 65 L76 58 L84 65 V76 H68 Z" />
          {/* Pine Tree */}
          <path d="M265 60 L272 50 L279 60 H265 Z" />
          <path d="M263 70 L272 58 L281 70 H263 Z" />
          <rect x="270" y="70" width="4" height="8" />
          {/* House 2 */}
          <path d="M288 64 L298 55 L308 64 V78 H288 Z" />
          <path d="M312 67 L320 60 L328 67 V77 H312 Z" />
        </g>

        {/* Front Hill */}
        <path
          d="M0 85 Q130 55, 260 85 T400 75 L400 120 L0 120 Z"
          fill="#BBF7D0"
          opacity="0.8"
        />
        <path
          d="M0 98 Q180 80, 400 95 L400 120 L0 120 Z"
          fill="#86EFAC"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};
