import React, { useMemo } from 'react';
import {
  Download,
  Calendar,
  Banknote,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart2,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { useBills } from '../context/BillsContext';
import { formatINR, formatCompactINR } from '../utils/currency';
import { MONTH_NAMES, SHORT_MONTH_NAMES, getAvailableYears, formatDateDisplay } from '../utils/dateUtils';
import { exportBillsToCSV } from '../utils/csvExport';

export const ReportsPage = () => {
  const {
    monthlyBills,
    monthlyStats,
    previousMonthComparison,
    annualMonthlyTrend,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    getBillDate
  } = useBills();

  const availableYears = getAvailableYears();
  const currentMonthName = MONTH_NAMES[selectedMonth];

  const handleExport = () => {
    exportBillsToCSV(
      monthlyBills,
      `Home-Bills-${currentMonthName}-${selectedYear}.csv`
    );
  };

  // Comparison data for 2 months (Previous vs Current)
  const comparisonData = useMemo(() => {
    return [
      {
        month: previousMonthComparison.prevMonthName,
        Amount: previousMonthComparison.prevTotal,
        fill: '#94a3b8'
      },
      {
        month: SHORT_MONTH_NAMES[selectedMonth],
        Amount: monthlyStats.totalExpenses,
        fill: '#16a34a'
      }
    ];
  }, [previousMonthComparison, monthlyStats.totalExpenses, selectedMonth]);

  const PIE_COLORS = [
    '#2563eb', '#f97316', '#16a34a', '#ef4444', '#8b5cf6', '#06b6d4', '#eab308'
  ];

  return (
    <div className="reports-page" style={{ paddingBottom: '3rem' }}>
      {/* Top Header with Month/Year & Export CSV matching Screen 5 */}
      <div
        className="reports-header"
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
              color: '#0f172a'
            }}
          >
            Monthly Reports
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
            Detailed breakdown, month-over-month comparison, and CSV export
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Month/Year selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.4rem 0.75rem',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <Calendar size={18} style={{ color: '#059669' }} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              aria-label="Select month for report"
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
              aria-label="Select year for report"
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

          {/* Export CSV button matching Screen 5 */}
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#16A34A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards matching Screen 5: Total Amount, Paid Amount, Pending Amount */}
      <div
        className="reports-metrics-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Total Amount Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px -2px rgba(6, 78, 50, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Banknote size={26} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#10251B'
              }}
            >
              {formatINR(monthlyStats.totalExpenses)}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B' }}>
              Total Amount ({monthlyStats.totalBillsCount} Bills)
            </div>
          </div>
        </div>

        {/* Paid Amount Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px -2px rgba(6, 78, 50, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#F0FDF4',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#16A34A'
              }}
            >
              {formatINR(monthlyStats.totalPaidAmount)}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B' }}>
              Paid Amount ({monthlyStats.paidBillsCount} Paid)
            </div>
          </div>
        </div>

        {/* Pending Amount Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px -2px rgba(6, 78, 50, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#FFF7ED',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Clock size={26} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#F59E0B'
              }}
            >
              {formatINR(monthlyStats.totalPendingAmount)}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B' }}>
              Pending Amount ({monthlyStats.pendingBillsCount} Pending)
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid: Category-wise spending & Monthly Comparison */}
      <div
        className="reports-charts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Category-wise Spending Donut Chart */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <h3
            style={{
              margin: '0 0 1.25rem 0',
              fontSize: '1.1rem',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#0f172a'
            }}
          >
            Category-wise Spending
          </h3>

          {monthlyStats.categoryBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              No recorded bills for {currentMonthName} {selectedYear}
            </div>
          ) : (
            <div>
              <div style={{ width: '100%', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyStats.categoryBreakdown}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {monthlyStats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatINR(value), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Table / Breakdown */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                {monthlyStats.categoryBreakdown.map((item, idx) => {
                  const pct = monthlyStats.totalExpenses > 0
                    ? ((item.amount / monthlyStats.totalExpenses) * 100).toFixed(1)
                    : 0;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: item.color || PIE_COLORS[idx % PIE_COLORS.length]
                          }}
                        />
                        <span style={{ color: '#334155', fontWeight: 500 }}>{item.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{pct}%</span>
                        <strong style={{ color: '#0f172a' }}>{formatINR(item.amount)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#0f172a'
              }}
            >
              Monthly Comparison
            </h3>
            {previousMonthComparison.prevTotal > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: previousMonthComparison.isHigher ? '#dc2626' : '#16a34a'
                }}
              >
                {previousMonthComparison.isHigher ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>
                  {Math.abs(previousMonthComparison.percentChange)}% {previousMonthComparison.isHigher ? 'higher' : 'lower'} than {previousMonthComparison.prevMonthName}
                </span>
              </div>
            )}
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => formatCompactINR(val)} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val) => [formatINR(val), 'Total']} />
                <Bar dataKey="Amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>Difference vs {previousMonthComparison.prevMonthName}: </span>
              <strong style={{ color: previousMonthComparison.isHigher ? '#dc2626' : '#16a34a' }}>
                {previousMonthComparison.diff >= 0 ? '+' : ''}
                {formatINR(previousMonthComparison.diff)}
              </strong>
            </div>
            <div style={{ color: '#64748b' }}>
              Previous month total: <strong>{formatINR(previousMonthComparison.prevTotal)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Annual 12-Month Expense Summary Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#0f172a'
              }}
            >
              Annual Summary ({selectedYear})
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Full 12-month expense history for {selectedYear}
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Month</th>
                <th style={{ padding: '0.75rem 1rem' }}>Recorded Bills</th>
                <th style={{ padding: '0.75rem 1rem' }}>Paid Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Pending Amount</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Expense</th>
              </tr>
            </thead>
            <tbody>
              {annualMonthlyTrend.map((m) => {
                const isSelected = m.monthIndex === selectedMonth;
                return (
                  <tr
                    key={m.monthIndex}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                      fontWeight: isSelected ? 700 : 400
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem', color: isSelected ? '#059669' : '#0f172a' }}>
                      {MONTH_NAMES[m.monthIndex]} {isSelected && '(Selected)'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                      {m.count} bills
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#16a34a' }}>
                      {formatINR(m.paid)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#ea580c' }}>
                      {formatINR(m.pending)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      {formatINR(m.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
