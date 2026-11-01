import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  const bgColor = isError ? '#fef2f2' : isWarning ? '#fffbeb' : '#f0fdf4';
  const textColor = isError ? '#991b1b' : isWarning ? '#92400e' : '#166534';
  const borderColor = isError ? '#fecaca' : isWarning ? '#fde68a' : '#bbf7d0';
  const Icon = isError ? AlertCircle : isWarning ? AlertCircle : CheckCircle2;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '0.875rem 1.25rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        maxWidth: '420px',
        animation: 'slideUpFade 0.25s ease forwards'
      }}
    >
      <Icon size={20} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex'
          }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
