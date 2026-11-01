import React from 'react';
import { AlertTriangle, AlertOctagon, Settings } from 'lucide-react';
import { useBills } from '../../context/BillsContext';
import { formatINR } from '../../utils/currency';
import { MONTH_NAMES } from '../../utils/dateUtils';

export const BudgetAlertBanner = ({ onOpenBudgetModal }) => {
  const { selectedMonth, selectedYear, budgetSummary } = useBills();

  if (!budgetSummary || (!budgetSummary.isWarning && !budgetSummary.isExceeded)) {
    return null;
  }

  const monthName = MONTH_NAMES[selectedMonth];
  const isExceeded = budgetSummary.isExceeded;

  // Visual styles strictly matching the existing design theme
  const bannerStyles = isExceeded
    ? {
        bg: '#FEF2F2',
        border: '#FECACA',
        textDark: '#991B1B',
        textMuted: '#B91C1C',
        badgeBg: '#FEE2E2',
        badgeText: '#991B1B',
        btnBg: '#DC2626',
        btnText: '#FFFFFF',
        btnHover: '#B91C1C',
        icon: AlertOctagon,
        iconColor: '#DC2626'
      }
    : {
        bg: '#FFFBEB',
        border: '#FDE68A',
        textDark: '#92400E',
        textMuted: '#B45309',
        badgeBg: '#FEF3C7',
        badgeText: '#92400E',
        btnBg: '#D97706',
        btnText: '#FFFFFF',
        btnHover: '#B45309',
        icon: AlertTriangle,
        iconColor: '#D97706'
      };

  const Icon = bannerStyles.icon;

  return (
    <div
      role="alert"
      className="budget-alert-banner"
      style={{
        backgroundColor: bannerStyles.bg,
        border: `1.5px solid ${bannerStyles.border}`,
        borderRadius: '18px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 320px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: bannerStyles.badgeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: bannerStyles.iconColor,
            flexShrink: 0
          }}
        >
          <Icon size={24} strokeWidth={2.4} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: '1rem',
                color: bannerStyles.textDark
              }}
            >
              {isExceeded
                ? `🚨 Monthly Budget Exceeded (${budgetSummary.usagePercentage}%)`
                : `⚠️ Budget Alert: 80% Limit Reached (${budgetSummary.usagePercentage}%)`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: '6px',
                backgroundColor: bannerStyles.badgeBg,
                color: bannerStyles.badgeText
              }}
            >
              {monthName} {selectedYear}
            </span>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: bannerStyles.textMuted,
              lineHeight: 1.45
            }}
          >
            {isExceeded ? (
              <>
                You have spent <strong>{formatINR(budgetSummary.totalSpent)}</strong> of your{' '}
                <strong>{formatINR(budgetSummary.budgetLimit)}</strong> limit. You are over budget by{' '}
                <strong style={{ textDecoration: 'underline' }}>
                  {formatINR(Math.abs(budgetSummary.remainingAmount))}
                </strong>
                .
              </>
            ) : (
              <>
                You have spent <strong>{formatINR(budgetSummary.totalSpent)}</strong> of your{' '}
                <strong>{formatINR(budgetSummary.budgetLimit)}</strong> monthly budget. You have{' '}
                <strong>{formatINR(budgetSummary.remainingAmount)}</strong> remaining.
              </>
            )}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onOpenBudgetModal && (
          <button
            type="button"
            onClick={onOpenBudgetModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: bannerStyles.btnBg,
              color: bannerStyles.btnText,
              border: 'none',
              borderRadius: '10px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Settings size={16} />
            <span>Adjust Budget</span>
          </button>
        )}
      </div>
    </div>
  );
};
