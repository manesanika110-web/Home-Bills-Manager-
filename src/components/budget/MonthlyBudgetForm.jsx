import React, { useState, useEffect, useMemo } from 'react';
import {
  IndianRupee,
  Save,
  CheckCircle2,
  AlertOctagon,
  RotateCcw
} from 'lucide-react';
import { useBills } from '../../context/BillsContext';
import { MONTH_NAMES, getAvailableYears, extractMonthYear } from '../../utils/dateUtils';
import { formatINR } from '../../utils/currency';

export const MonthlyBudgetForm = ({
  initialMonth,
  initialYear,
  onSaved,
  showHeader = true
}) => {
  const {
    selectedMonth,
    selectedYear,
    bills,
    monthlyBudgets,
    getBudgetForMonth,
    setMonthBudget,
    DEFAULT_MONTHLY_BUDGET,
    getBillDate,
    showToast
  } = useBills();

  const availableYears = getAvailableYears();

  // Selected Month and Year for the form
  const [formMonth, setFormMonth] = useState(
    initialMonth !== undefined ? initialMonth : selectedMonth
  );
  const [formYear, setFormYear] = useState(
    initialYear !== undefined ? initialYear : selectedYear
  );

  // Budget input state
  const [amountInput, setAmountInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Update input whenever formMonth or formYear or monthlyBudgets changes
  useEffect(() => {
    const currentVal = getBudgetForMonth(formMonth, formYear);
    setAmountInput(String(currentVal));
    setErrorMsg('');
    setSuccessMsg('');
  }, [formMonth, formYear, monthlyBudgets]);

  // Check if current month has a custom saved budget
  const monthKey = `${formYear}-${String(formMonth + 1).padStart(2, '0')}`;
  const isCustomBudgetSaved = Boolean(
    monthlyBudgets && monthlyBudgets[monthKey] !== undefined && monthlyBudgets[monthKey] !== null
  );

  // Calculate total bills for the selected formMonth and formYear
  const formMonthExpenses = useMemo(() => {
    let total = 0;
    bills.forEach((b) => {
      const dateStr = getBillDate(b);
      const parsed = extractMonthYear(dateStr);
      if (parsed && parsed.month === formMonth && parsed.year === formYear) {
        total += Number(b.amount) || 0;
      }
    });
    return total;
  }, [bills, formMonth, formYear, getBillDate]);

  // Live calculation based on current input amount
  const liveBudgetNumber = Math.max(0, parseFloat(amountInput) || 0);
  const liveRemaining = liveBudgetNumber - formMonthExpenses;
  const liveUsagePercent = liveBudgetNumber > 0
    ? Math.round(((formMonthExpenses / liveBudgetNumber) * 100) * 10) / 10
    : 0;
  const isLiveWarning = liveUsagePercent >= 80 && liveUsagePercent < 100;
  const isLiveExceeded = liveUsagePercent >= 100;

  // Preset options specified in user prompt: ₹10,000, ₹20,000, ₹30,000
  const PRESET_AMOUNTS = [
    { label: '₹10,000 (Default)', value: 10000 },
    { label: '₹20,000', value: 20000 },
    { label: '₹30,000', value: 30000 },
    { label: '₹50,000', value: 50000 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount < 0) {
      setErrorMsg('Please enter a valid non-negative budget amount.');
      return;
    }

    if (numericAmount > 1000000000) {
      setErrorMsg('Budget limit exceeds allowable maximum.');
      return;
    }

    setIsSaving(true);
    try {
      await setMonthBudget(formMonth, formYear, numericAmount);
      setSuccessMsg(`Budget for ${MONTH_NAMES[formMonth]} ${formYear} saved successfully!`);
      if (onSaved) {
        onSaved({ month: formMonth, year: formYear, amount: numericAmount });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save monthly budget.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setAmountInput(String(DEFAULT_MONTHLY_BUDGET));
  };

  return (
    <div
      className="monthly-budget-form-container"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '1.75rem',
        boxShadow: '0 4px 16px -2px rgba(6, 78, 50, 0.05)'
      }}
    >
      {showHeader && (
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <IndianRupee size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: '#10251B'
                }}
              >
                Monthly Budget Settings
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Set custom spending limits per month. Months without a custom budget default to ₹10,000.
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            border: '1px solid #FECACA',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertOctagon size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          style={{
            backgroundColor: '#F0FDF4',
            color: '#166534',
            border: '1px solid #BBF7D0',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
        {/* Month & Year Selection Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* Month Selector */}
          <div>
            <label
              htmlFor="budget-form-month"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '0.4rem'
              }}
            >
              Select Month <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="budget-form-month"
                value={formMonth}
                onChange={(e) => setFormMonth(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Selector */}
          <div>
            <label
              htmlFor="budget-form-year"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '0.4rem'
              }}
            >
              Select Year <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              id="budget-form-year"
              value={formYear}
              onChange={(e) => setFormYear(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#1E293B',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Status Badge for Chosen Month */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            border: '1px solid #F1F5F9',
            fontSize: '0.825rem'
          }}
        >
          <span style={{ color: '#64748B' }}>
            Current Status for <strong>{MONTH_NAMES[formMonth]} {formYear}</strong>:
          </span>
          <span
            style={{
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isCustomBudgetSaved ? '#DCFCE7' : '#F1F5F9',
              color: isCustomBudgetSaved ? '#15803D' : '#64748B'
            }}
          >
            {isCustomBudgetSaved ? `Custom Budget Set: ${formatINR(getBudgetForMonth(formMonth, formYear))}` : 'Default Budget (₹10,000)'}
          </span>
        </div>

        {/* Quick Presets Buttons */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#475569' }}>
              Quick Preset Limits:
            </span>
            <button
              type="button"
              onClick={handleResetToDefault}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: 0
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Default (₹10,000)</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {PRESET_AMOUNTS.map((preset) => {
              const isSelected = liveBudgetNumber === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAmountInput(String(preset.value))}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    border: isSelected ? '1.5px solid #16A34A' : '1px solid #CBD5E1',
                    backgroundColor: isSelected ? '#DCFCE7' : '#FFFFFF',
                    color: isSelected ? '#15803D' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Budget Amount Input */}
        <div>
          <label
            htmlFor="budget-form-amount"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.4rem'
            }}
          >
            Monthly Budget Amount (₹) <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '1rem',
                pointerEvents: 'none'
              }}
            >
              ₹
            </div>
            <input
              id="budget-form-amount"
              type="number"
              min="0"
              step="100"
              placeholder="e.g. 10000, 20000, 30000"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.25rem',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '1.05rem',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#10251B',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            padding: '1rem',
            border: '1px solid #E2E8F0'
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Live Calculation Preview for {MONTH_NAMES[formMonth]} {formYear}</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                backgroundColor: isLiveExceeded ? '#FEE2E2' : isLiveWarning ? '#FEF3C7' : '#DCFCE7',
                color: isLiveExceeded ? '#DC2626' : isLiveWarning ? '#D97706' : '#15803D',
                fontWeight: 700
              }}
            >
              {isLiveExceeded ? 'Exceeds Limit' : isLiveWarning ? '80% Warning' : 'Within Budget'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.75rem',
              textAlign: 'center'
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem 0.5rem', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Total Bills</span>
              <strong style={{ fontSize: '0.95rem', color: '#10251B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {formatINR(formMonthExpenses)}
              </strong>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem 0.5rem', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Remaining</span>
              <strong
                style={{
                  fontSize: '0.95rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: liveRemaining >= 0 ? '#15803D' : '#DC2626'
                }}
              >
                {liveRemaining >= 0 ? formatINR(liveRemaining) : `- ${formatINR(Math.abs(liveRemaining))}`}
              </strong>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem 0.5rem', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Usage</span>
              <strong
                style={{
                  fontSize: '0.95rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: isLiveExceeded ? '#DC2626' : isLiveWarning ? '#D97706' : '#15803D'
                }}
              >
                {liveUsagePercent}%
              </strong>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.75rem',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
              transition: 'all 0.15s ease',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving Budget...' : `Save Budget for ${MONTH_NAMES[formMonth]}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
