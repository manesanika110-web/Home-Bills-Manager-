import React from 'react';
import { Target, AlertTriangle, AlertOctagon, CheckCircle2, Sliders } from 'lucide-react';
import { useBills } from '../../context/BillsContext';
import { formatINR } from '../../utils/currency';
import { MONTH_NAMES } from '../../utils/dateUtils';

export const BudgetOverviewCard = ({ onOpenBudgetModal }) => {
  const {
    selectedMonth,
    selectedYear,
    budgetSummary
  } = useBills();

  const monthName = MONTH_NAMES[selectedMonth];
  const {
    budgetLimit,
    totalSpent,
    remainingAmount,
    usagePercentage,
    rawPercentage,
    isWarning,
    isExceeded,
    hasCustomBudget
  } = budgetSummary;

  // Determine theme colors based on spending percentage
  let statusTheme = {
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    barFill: '#16A34A',
    barBg: '#E2E8F0',
    statusLabel: 'Within Budget',
    statusIcon: CheckCircle2,
    statusColor: '#16A34A'
  };

  if (isExceeded) {
    statusTheme = {
      badgeBg: '#FEE2E2',
      badgeText: '#DC2626',
      barFill: '#DC2626',
      barBg: '#FEE2E2',
      statusLabel: 'Over Budget',
      statusIcon: AlertOctagon,
      statusColor: '#DC2626'
    };
  } else if (isWarning) {
    statusTheme = {
      badgeBg: '#FEF3C7',
      badgeText: '#D97706',
      barFill: '#F59E0B',
      barBg: '#FEF3C7',
      statusLabel: '80% Warning Limit',
      statusIcon: AlertTriangle,
      statusColor: '#D97706'
    };
  }

  const StatusIcon = statusTheme.statusIcon;
  const progressClamped = Math.min(Math.max(rawPercentage, 0), 100);

  return (
    <div
      className="budget-overview-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -2px rgba(6, 78, 50, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        marginBottom: '2rem'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: statusTheme.badgeBg,
              color: statusTheme.statusColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Target size={22} strokeWidth={2.4} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: '#10251B'
                }}
              >
                Monthly Budget Limit
              </h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  backgroundColor: statusTheme.badgeBg,
                  color: statusTheme.badgeText,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <StatusIcon size={12} strokeWidth={2.5} />
                <span>{statusTheme.statusLabel}</span>
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748B' }}>
              {monthName} {selectedYear} • {hasCustomBudget ? 'Custom Month Budget' : 'Default ₹10,000 Budget'}
            </p>
          </div>
        </div>

        {onOpenBudgetModal && (
          <button
            type="button"
            onClick={onOpenBudgetModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              border: '1px solid #86EFAC',
              borderRadius: '10px',
              padding: '0.55rem 0.95rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Set custom budget for this month"
          >
            <Sliders size={15} />
            <span>Set / Edit Budget</span>
          </button>
        )}
      </div>

      {/* 4-Item Stats Row */}
      <div
        className="budget-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '14px',
          border: '1px solid #F1F5F9',
          marginBottom: '1.25rem'
        }}
      >
        {/* Total Spent */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block' }}>
            Total Spent
          </span>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#10251B',
              marginTop: '0.15rem',
              display: 'block'
            }}
          >
            {formatINR(totalSpent)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>of {formatINR(budgetLimit)}</span>
        </div>

        {/* Remaining Amount */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block' }}>
            {remainingAmount >= 0 ? 'Remaining Budget' : 'Over Budget By'}
          </span>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: remainingAmount >= 0 ? '#15803D' : '#DC2626',
              marginTop: '0.15rem',
              display: 'block'
            }}
          >
            {remainingAmount >= 0 ? formatINR(remainingAmount) : `- ${formatINR(Math.abs(remainingAmount))}`}
          </span>
          <span style={{ fontSize: '0.75rem', color: remainingAmount >= 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
            {remainingAmount >= 0 ? 'Available to spend' : 'Limit exceeded'}
          </span>
        </div>

        {/* Budget Usage Percentage */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block' }}>
            Budget Usage
          </span>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: statusTheme.statusColor,
              marginTop: '0.15rem',
              display: 'block'
            }}
          >
            {usagePercentage}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {isExceeded ? 'Exceeded limit' : isWarning ? 'Approaching cap' : 'Safe zone'}
          </span>
        </div>

        {/* Monthly Budget Limit */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block' }}>
            Budget Limit
          </span>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#10251B',
              marginTop: '0.15rem',
              display: 'block'
            }}
          >
            {formatINR(budgetLimit)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {hasCustomBudget ? 'Custom set' : 'Default ₹10,000'}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>
            Spending Progress
          </span>
          <span style={{ fontWeight: 700, color: statusTheme.statusColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatINR(totalSpent)} / {formatINR(budgetLimit)} ({usagePercentage}%)
          </span>
        </div>

        {/* Progress bar container with milestone indicators */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '14px',
            backgroundColor: '#E2E8F0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          {/* Active Fill Bar */}
          <div
            style={{
              width: `${progressClamped}%`,
              height: '100%',
              backgroundColor: statusTheme.barFill,
              borderRadius: '10px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease'
            }}
          />
        </div>

        {/* Milestones beneath progress bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.45rem',
            fontSize: '0.75rem',
            color: '#64748B'
          }}
        >
          <span>₹0</span>
          <span style={{ color: usagePercentage >= 80 ? '#D97706' : '#94A3B8', fontWeight: 600 }}>
            80% Warning ({formatINR(budgetLimit * 0.8)})
          </span>
          <span style={{ color: usagePercentage >= 100 ? '#DC2626' : '#64748B', fontWeight: 700 }}>
            100% Cap ({formatINR(budgetLimit)})
          </span>
        </div>
      </div>
    </div>
  );
};
