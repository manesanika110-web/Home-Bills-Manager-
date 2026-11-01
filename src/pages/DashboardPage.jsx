import React, { useState } from 'react';
import {
  Banknote,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Inbox
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
  CartesianGrid
} from 'recharts';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/common/StatCard';
import { useBills } from '../context/BillsContext';
import { formatINR, formatCompactINR } from '../utils/currency';
import { formatDateDisplay, MONTH_NAMES } from '../utils/dateUtils';
import { getCategoryMeta } from '../utils/categories';
import { BudgetAlertBanner } from '../components/budget/BudgetAlertBanner';
import { BudgetOverviewCard } from '../components/budget/BudgetOverviewCard';
import { BudgetModal } from '../components/budget/BudgetModal';

export const DashboardPage = ({ onNavigate }) => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const {
    selectedMonth,
    selectedYear,
    monthlyBills,
    monthlyStats,
    annualMonthlyTrend,
    recentBills,
    customCategories,
    getBillDate,
    setBillToEdit,
    error
  } = useBills();

  const monthName = MONTH_NAMES[selectedMonth];

  // Colors for Donut chart matching reference image
  const PIE_COLORS = [
    '#2563eb', // Blue (Electricity)
    '#f97316', // Orange (Gas)
    '#16a34a', // Green (Maintenance)
    '#ef4444', // Red/Coral (Others/Education)
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#eab308'  // Amber
  ];

  const handleEditBill = (bill) => {
    setBillToEdit(bill);
    onNavigate('add-bill');
  };

  return (
    <div className="dashboard-page" style={{ paddingBottom: '3rem' }}>
      <Header
        title="Dashboard"
        subtitle={`Summary and expense trends for ${monthName} ${selectedYear}`}
        showMonthYearPicker={true}
        onAddBillClick={() => {
          setBillToEdit(null);
          onNavigate('add-bill');
        }}
      />

      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '0.85rem 1.25rem',
            borderRadius: '14px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ fontWeight: 700 }}>Firestore Connection Alert:</span>
          <span>{error}</span>
        </div>
      )}

      {/* Monthly Budget Alert Banner (Warning at 80%, Red alert at 100%) */}
      <BudgetAlertBanner onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

      {/* Monthly Budget Overview Card */}
      <BudgetOverviewCard onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

      {/* 4 Stat Cards matching Screen 2 */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <StatCard
          title="Total Expenses"
          value={formatINR(monthlyStats.totalExpenses)}
          subtitle={`${monthName} ${selectedYear}`}
          icon={Banknote}
          variant="green"
        />

        <StatCard
          title="Total Bills"
          value={monthlyStats.totalBillsCount}
          subtitle="Recorded this month"
          icon={FileText}
          variant="blue"
        />

        <StatCard
          title="Paid Bills"
          value={monthlyStats.paidBillsCount}
          subtitle={`Paid: ${formatINR(monthlyStats.totalPaidAmount)}`}
          icon={CheckCircle2}
          variant="emerald"
        />

        <StatCard
          title="Pending Bills"
          value={monthlyStats.pendingBillsCount}
          subtitle={`Due: ${formatINR(monthlyStats.totalPendingAmount)}`}
          icon={Clock}
          variant="orange"
        />
      </div>

      {/* Charts Section */}
      <div
        className="charts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Category-wise Expenses Donut Chart */}
        <div
          className="chart-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column'
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
              Category-wise Expenses
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
              {monthName}
            </span>
          </div>

          {monthlyStats.categoryBreakdown.length === 0 ? (
            <div
              style={{
                flex: 1,
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8'
              }}
            >
              <Inbox size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No bills recorded for this month</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', minHeight: '240px' }}>
              <div style={{ flex: '1 1 180px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyStats.categoryBreakdown}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {monthlyStats.categoryBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatINR(value), 'Amount']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.85rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List matching Screen 2 in reference image */}
              <div
                style={{
                  flex: '1 1 180px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  paddingLeft: '0.5rem'
                }}
              >
                {monthlyStats.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: cat.color || PIE_COLORS[idx % PIE_COLORS.length],
                          flexShrink: 0
                        }}
                      />
                      <span style={{ color: '#334155', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.name}
                      </span>
                    </div>
                    <strong style={{ color: '#10251B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {formatINR(cat.amount)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Expense Trend Bar Chart */}
        <div
          className="chart-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column'
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
              Monthly Expense Trend
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
              {selectedYear}
            </span>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={annualMonthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(val) => formatCompactINR(val)}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatINR(value), 'Total Expense']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.85rem'
                  }}
                />
                <Bar dataKey="total" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bills List */}
      <div
        className="recent-bills-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
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
              Recent Transactions
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              Latest household bills added
            </p>
          </div>

          <button
            onClick={() => onNavigate('history')}
            style={{
              background: 'none',
              border: 'none',
              color: '#059669',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {recentBills.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: '#64748b'
            }}
          >
            <p style={{ margin: '0 0 1rem 0' }}>No bills recorded yet.</p>
            <button
              onClick={() => onNavigate('add-bill')}
              style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                padding: '0.65rem 1.25rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              + Record Your First Bill
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentBills.map((bill) => {
              const meta = getCategoryMeta(bill.category, customCategories);
              const isPaid = bill.status === 'Paid';
              const dateStr = getBillDate(bill);

              return (
                <div
                  key={bill.id}
                  onClick={() => handleEditBill(bill)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className="recent-bill-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                        {bill.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {meta.name} • {formatDateDisplay(dateStr)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          color: '#0f172a'
                        }}
                      >
                        {formatINR(bill.amount)}
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isPaid ? '#dcfce7' : '#fef3c7',
                          color: isPaid ? '#15803d' : '#b45309',
                          marginTop: '2px'
                        }}
                      >
                        {bill.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Setting / Updating Budget directly from Dashboard */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        initialMonth={selectedMonth}
        initialYear={selectedYear}
      />
    </div>
  );
};
