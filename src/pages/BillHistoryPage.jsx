import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  PlusCircle,
  Inbox,
  Calendar
} from 'lucide-react';
import { useBills } from '../context/BillsContext';
import { formatINR } from '../utils/currency';
import { formatDateDisplay, MONTH_NAMES, getAvailableYears } from '../utils/dateUtils';
import { getCategoryMeta, groupCategoriesBySection } from '../utils/categories';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const BillHistoryPage = ({ onNavigate }) => {
  const {
    bills,
    deleteBill,
    setBillToEdit,
    customCategories,
    allCategories,
    getBillDate
  } = useBills();

  // Search, filter & sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All'); // 'All' or 0-11
  const [yearFilter, setYearFilter] = useState('All'); // 'All' or number
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc, name-asc

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion modal state
  const [billToDelete, setBillToDelete] = useState(null);

  const availableYears = getAvailableYears();

  // Grouped categories by section (Home Utilities, Housing, Education, Daily Expenses, Other Expenses)
  const groupedCategories = useMemo(() => {
    return groupCategoriesBySection(allCategories);
  }, [allCategories]);

  // Filtered & sorted bills
  const filteredBills = useMemo(() => {
    return bills
      .filter((bill) => {
        // Search by name or notes
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchesName = (bill.name || '').toLowerCase().includes(q);
          const matchesNotes = (bill.notes || '').toLowerCase().includes(q);
          const matchesCat = (bill.category || '').toLowerCase().includes(q);
          if (!matchesName && !matchesNotes && !matchesCat) return false;
        }

        // Category filter
        if (categoryFilter !== 'All') {
          if ((bill.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
            return false;
          }
        }

        // Status filter
        if (statusFilter !== 'All') {
          if (bill.status !== statusFilter) return false;
        }

        // Month & Year filter
        const dateStr = getBillDate(bill);
        if (dateStr) {
          const [yStr, mStr] = dateStr.split('-');
          if (yearFilter !== 'All' && yStr !== String(yearFilter)) return false;
          if (monthFilter !== 'All' && String(parseInt(mStr, 10) - 1) !== String(monthFilter)) return false;
        } else if (monthFilter !== 'All' || yearFilter !== 'All') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(getBillDate(a) || 0).getTime();
        const dateB = new Date(getBillDate(b) || 0).getTime();
        const amtA = Number(a.amount) || 0;
        const amtB = Number(b.amount) || 0;

        switch (sortBy) {
          case 'date-asc':
            return dateA - dateB;
          case 'amount-desc':
            return amtB - amtA;
          case 'amount-asc':
            return amtA - amtB;
          case 'name-asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'date-desc':
          default:
            return dateB - dateA;
        }
      });
  }, [bills, searchTerm, categoryFilter, statusFilter, monthFilter, yearFilter, sortBy]);

  // Aggregate totals of filtered records
  const totalFilteredAmount = useMemo(() => {
    return filteredBills.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [filteredBills]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage) || 1;
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(start, start + itemsPerPage);
  }, [filteredBills, currentPage, itemsPerPage]);

  const handleEdit = (bill) => {
    setBillToEdit(bill);
    onNavigate('add-bill');
  };

  const handleDeleteConfirm = async () => {
    if (billToDelete) {
      await deleteBill(billToDelete.id);
      setBillToDelete(null);
    }
  };

  return (
    <div className="bill-history-page" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#0f172a'
          }}
        >
          Bill History
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
          Search, filter, and manage all your past and upcoming household bills
        </p>
      </div>

      {/* Filter and Search Bar matching Screen 4 */}
      <div
        className="filter-bar-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              placeholder="Search bills by name, category, or notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by category"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer',
              flex: '0 1 170px'
            }}
          >
            <option value="All">All Categories</option>
            {groupedCategories.map((group) => (
              <optgroup key={group.section} label={group.section}>
                {group.categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer',
              flex: '0 1 140px'
            }}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Month Filter */}
          <select
            value={monthFilter}
            onChange={(e) => {
              setMonthFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by month"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer',
              flex: '0 1 130px'
            }}
          >
            <option value="All">All Months</option>
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by year"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer',
              flex: '0 1 110px'
            }}
          >
            <option value="All">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort bills"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer',
              flex: '0 1 160px'
            }}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Bills Content Card */}
      <div
        className="history-table-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}
      >
        {filteredBills.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              color: '#64748b'
            }}
          >
            <Inbox size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>No bills found</h3>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
              No bills match your active search filters or date range.
            </p>
            <button
              onClick={() => onNavigate('add-bill')}
              style={{
                backgroundColor: '#16A34A',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1.25rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)'
              }}
            >
              + Add New Bill
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive-wrapper" style={{ overflowX: 'auto', width: '100%' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.9rem'
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#475569'
                    }}
                  >
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Bill Name</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Amount (₹)</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Date</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBills.map((bill) => {
                    const meta = getCategoryMeta(bill.category, customCategories);
                    const isPaid = bill.status === 'Paid';
                    const dateStr = getBillDate(bill);

                    return (
                      <tr
                        key={bill.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s'
                        }}
                        className="table-row-hover"
                      >
                        {/* Bill Name with Category Emoji */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                backgroundColor: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                flexShrink: 0
                              }}
                            >
                              {meta.icon}
                            </span>
                            <div>
                              <div style={{ fontWeight: 600, color: '#10251B' }}>{bill.name}</div>
                              {bill.notes && (
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{bill.notes}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '1rem 1.25rem', color: '#334155', fontWeight: 500 }}>
                          {meta.name}
                        </td>

                        {/* Amount */}
                        <td
                          style={{
                            padding: '1rem 1.25rem',
                            fontWeight: 700,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            color: '#10251B'
                          }}
                        >
                          {formatINR(bill.amount)}
                        </td>

                        {/* Date */}
                        <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>
                          {formatDateDisplay(dateStr)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: isPaid ? '#DCFCE7' : '#FFF7ED',
                              color: isPaid ? '#15803D' : '#F59E0B',
                              border: `1px solid ${isPaid ? '#86EFAC' : '#FED7AA'}`
                            }}
                          >
                            {bill.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(bill)}
                              title="Edit Bill"
                              aria-label={`Edit ${bill.name}`}
                              style={{
                                background: '#DCFCE7',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px',
                                color: '#15803D',
                                cursor: 'pointer',
                                display: 'flex'
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setBillToDelete(bill)}
                              title="Delete Bill"
                              aria-label={`Delete ${bill.name}`}
                              style={{
                                background: '#FEE2E2',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'flex'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary and Pagination Footer matching Screen 4 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                Total: <strong>{filteredBills.length} Bills</strong> | Total Amount:{' '}
                <strong style={{ color: '#15803D' }}>{formatINR(totalFilteredAmount)}</strong>
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      display: 'flex'
                    }}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', padding: '0 0.5rem' }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      display: 'flex'
                    }}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog before Deleting */}
      <ConfirmationModal
        isOpen={Boolean(billToDelete)}
        title="Delete Bill"
        message={`Are you sure you want to permanently delete "${billToDelete?.name}" (${formatINR(
          billToDelete?.amount || 0
        )})?`}
        confirmLabel="Yes, Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBillToDelete(null)}
      />
    </div>
  );
};
