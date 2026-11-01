import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'green', // green, blue, orange, emerald
  onClick,
  active = false
}) => {
  const variantStyles = {
    green: {
      bg: '#DCFCE7',
      iconColor: '#15803D',
      borderColor: '#86EFAC'
    },
    blue: {
      bg: '#EFF6FF',
      iconColor: '#2563EB',
      borderColor: '#BFDBFE'
    },
    orange: {
      bg: '#FFF7ED',
      iconColor: '#F59E0B',
      borderColor: '#FED7AA'
    },
    emerald: {
      bg: '#F0FDF4',
      iconColor: '#16A34A',
      borderColor: '#BBF7D0'
    }
  };

  const currentTheme = variantStyles[variant] || variantStyles.green;

  return (
    <div
      className={`stat-card ${active ? 'active' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.5rem 1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -2px rgba(6, 78, 50, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          backgroundColor: currentTheme.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.9rem',
          color: currentTheme.iconColor,
          transition: 'transform 0.2s ease'
        }}
        className="stat-icon-wrapper"
      >
        <Icon size={26} strokeWidth={2.4} />
      </div>

      <div
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#10251B',
          letterSpacing: '-0.025em',
          lineHeight: 1.15
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#64748B',
          marginTop: '0.4rem'
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#94A3B8',
            marginTop: '0.25rem'
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
