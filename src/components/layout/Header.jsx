import React from 'react';
import { MONTH_NAMES, getAvailableYears } from '../../utils/dateUtils';
import { useBills } from '../../context/BillsContext';
import { Calendar, Plus } from 'lucide-react';

export const Header = ({ title, subtitle, showMonthYearPicker = true, onAddBillClick }) => {
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useBills();
  const availableYears = getAvailableYears();

  return (
    <div
      className="page-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {showMonthYearPicker && (
          <div
            className="month-year-selector"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.35rem 0.65rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              gap: '0.5rem'
            }}
          >
            <Calendar size={18} style={{ color: '#059669', flexShrink: 0 }} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              aria-label="Select reporting month"
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '0.5rem'
              }}
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            <span style={{ color: '#cbd5e1' }}>|</span>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Select reporting year"
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {onAddBillClick && (
          <button
            onClick={onAddBillClick}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#16A34A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.65rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
            }}
          >
            <Plus size={18} />
            <span>Add Bill</span>
          </button>
        )}
      </div>
    </div>
  );
};
