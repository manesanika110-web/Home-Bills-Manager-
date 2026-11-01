import React from 'react';
import { LayoutDashboard, PlusCircle, Receipt, BarChart3, Settings } from 'lucide-react';
import { Logo } from '../common/Logo';

export const MobileNav = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: Receipt },
    { id: 'add-bill', label: 'Add Bill', icon: PlusCircle, isMain: true },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header
        className="mobile-top-bar"
        style={{
          display: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Logo size="small" showTagline={false} />
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="mobile-bottom-bar"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '0.4rem 0.5rem',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isMain) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-label="Add Bill"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#16A34A',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '46px',
                  height: '46px',
                  justifyContent: 'center',
                  marginTop: '-16px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)',
                  cursor: 'pointer'
                }}
              >
                <PlusCircle size={24} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                background: 'transparent',
                border: 'none',
                color: isActive ? '#15803D' : '#64748B',
                padding: '4px 8px',
                fontSize: '0.725rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
