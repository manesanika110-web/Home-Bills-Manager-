import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const { logout, currentUser } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-bill', label: 'Add Bill', icon: PlusCircle },
    { id: 'history', label: 'Bill History', icon: Receipt },
    { id: 'reports', label: 'Monthly Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="desktop-sidebar">
      <div>
        {/* Brand Logo */}
        <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <Logo inverted={true} size="normal" showTagline={true} />
        </div>

        {/* Navigation items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#15803D' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#A7F3D0',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ paddingLeft: '0.5rem' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#FFFFFF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {currentUser?.email || 'Home Owner'}
          </div>
        </div>

        <button
          onClick={logout}
          className="sidebar-logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            backgroundColor: 'transparent',
            color: '#cbd5e1',
            fontWeight: 500,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 0.2s'
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
