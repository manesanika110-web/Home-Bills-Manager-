import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/config';

export const FirebaseStatusBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  // If Firebase is configured, no banner is needed
  if (isFirebaseConfigured || dismissed) return null;

  return (
    <div
      role="alert"
      style={{
        backgroundColor: '#FEF2F2',
        borderBottom: '1px solid #FECACA',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: '#991B1B',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <AlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0 }} />
        <span>
          <strong>Firebase Configuration Required:</strong> Set your project credentials in <code>.env</code> to connect directly to Cloud Firestore.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#991B1B',
          display: 'flex',
          padding: '2px'
        }}
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  );
};
