import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  CheckCircle,
  Plus,
  ArrowLeft,
  Calendar,
  IndianRupee,
  Tag,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useBills } from '../context/BillsContext';
import { getTodayDateInput } from '../utils/dateUtils';
import { PAYMENT_METHODS, groupCategoriesBySection, getCategoryMeta, CATEGORY_SECTIONS } from '../utils/categories';

export const AddBillPage = ({ onNavigate }) => {
  const {
    allCategories,
    addBill,
    updateBill,
    billToEdit,
    setBillToEdit,
    addCustomCategory
  } = useBills();

  const isEditing = Boolean(billToEdit);

  // Grouped categories by section (Home Utilities, Housing, Education, Daily Expenses, Other Expenses)
  const groupedCategories = useMemo(() => {
    return groupCategoriesBySection(allCategories);
  }, [allCategories]);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electricity Bill');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  // UI / Custom Category Modal states
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCatName, setCustomCatName] = useState('');
  const [customCatIcon, setCustomCatIcon] = useState('🏷️');
  const [customCatSection, setCustomCatSection] = useState('Other Expenses');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (billToEdit) {
      setName(billToEdit.name || '');
      const matched = getCategoryMeta(billToEdit.category, allCategories);
      setCategory(matched.name || billToEdit.category || 'Electricity Bill');
      setAmount(String(billToEdit.amount || ''));
      setDueDate(billToEdit.dueDate || '');
      setStatus(billToEdit.status || 'Pending');
      setPaymentDate(billToEdit.paymentDate || (billToEdit.status === 'Paid' ? getTodayDateInput() : ''));
      setPaymentMethod(billToEdit.paymentMethod || '');
      setNotes(billToEdit.notes || '');
    } else {
      resetForm();
    }
  }, [billToEdit, allCategories]);

  const resetForm = () => {
    setName('');
    setCategory('Electricity Bill');
    setAmount('');
    setDueDate(getTodayDateInput());
    setStatus('Pending');
    setPaymentDate('');
    setPaymentMethod('');
    setNotes('');
    setError('');
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Paid' && !paymentDate) {
      setPaymentDate(getTodayDateInput());
    } else if (newStatus === 'Pending') {
      setPaymentDate('');
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customCatName.trim()) return;
    const created = addCustomCategory(customCatName.trim(), customCatIcon, '#15803D', customCatSection);
    if (created) {
      setCategory(created.name);
      setCustomCatName('');
      setCustomCatSection('Other Expenses');
      setShowCustomModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Form validations
    if (!name.trim()) {
      setError('Please enter a bill name.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid positive bill amount in ₹.');
      return;
    }

    if (status === 'Paid' && !paymentDate) {
      setError('Please provide a payment date for paid bills.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        category,
        amount: numericAmount,
        dueDate: dueDate || '',
        status,
        paymentDate: status === 'Paid' ? (paymentDate || getTodayDateInput()) : '',
        paymentMethod: paymentMethod || '',
        notes: notes.trim()
      };

      if (isEditing) {
        await updateBill(billToEdit.id, payload);
        setSuccessMsg('Bill updated successfully!');
        setTimeout(() => {
          onNavigate('history');
        }, 1000);
      } else {
        await addBill(payload);
        setSuccessMsg('Bill added successfully!');
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save bill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-bill-container" style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Back button when editing */}
      {isEditing && (
        <button
          onClick={() => {
            setBillToEdit(null);
            onNavigate('history');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: '#059669',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem 0',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Bill History</span>
        </button>
      )}

      {/* Main Form Card matching Screen 3 */}
      <div
        className="form-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}
      >
        {/* Card Header */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
            }}
          >
            <Plus size={18} strokeWidth={3} />
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
              {isEditing ? 'Edit Bill Details' : 'Add New Bill'}
            </h2>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
              {isEditing ? 'Update the details for this bill record' : 'Record a household expense or upcoming payment'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Bill Name */}
            <div>
              <label
                htmlFor="bill-name"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
              >
                Bill Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="bill-name"
                type="text"
                placeholder="e.g. Gas Bill, Light Bill, Rent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Category Dropdown + Add Custom Button */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor="bill-category" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                  Category <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  + Add Custom Category
                </button>
              </div>

              <select
                id="bill-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {groupedCategories.map((group) => (
                  <optgroup key={group.section} label={group.section}>
                    {group.categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Amount & Due Date (Side by side on wider screens) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="bill-amount"
                  style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
                >
                  Amount (₹) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                      fontWeight: 700
                    }}
                  >
                    ₹
                  </span>
                  <input
                    id="bill-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.2rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bill-due-date"
                  style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
                >
                  Bill / Due Date
                </label>
                <input
                  id="bill-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Status Radio Buttons */}
            <div>
              <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                Status <span style={{ color: '#dc2626' }}>*</span>
              </span>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 500
                  }}
                >
                  <input
                    type="radio"
                    name="bill-status"
                    value="Paid"
                    checked={status === 'Paid'}
                    onChange={() => handleStatusChange('Paid')}
                    style={{ accentColor: '#059669', width: '18px', height: '18px' }}
                  />
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>● Paid</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 500
                  }}
                >
                  <input
                    type="radio"
                    name="bill-status"
                    value="Pending"
                    checked={status === 'Pending'}
                    onChange={() => handleStatusChange('Pending')}
                    style={{ accentColor: '#ea580c', width: '18px', height: '18px' }}
                  />
                  <span style={{ color: '#d97706', fontWeight: 600 }}>● Pending</span>
                </label>
              </div>
            </div>

            {/* Payment Date (Visible & Required when status is Paid) */}
            {status === 'Paid' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <label
                  htmlFor="bill-payment-date"
                  style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
                >
                  Payment Date <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  id="bill-payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #10b981',
                    backgroundColor: '#f0fdf4',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label
                htmlFor="bill-payment-method"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
              >
                Payment Method (Optional)
              </label>
              <select
                id="bill-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select payment method...</option>
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="bill-notes"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
              >
                Notes (Optional)
              </label>
              <textarea
                id="bill-notes"
                rows="3"
                placeholder="e.g. Monthly gas cylinder refill booking ref #8921"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button matching Screen 3 "💾 Save Bill" */}
            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: '1rem',
                backgroundColor: '#16A34A',
                color: '#ffffff',
                padding: '0.9rem',
                borderRadius: '14px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.15s ease',
                opacity: saving ? 0.7 : 1
              }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : isEditing ? 'Update Bill' : 'Save Bill'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Add Custom Category Inline Modal */}
      {showCustomModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', color: '#0f172a' }}>
              Add Custom Category
            </h3>
            <form onSubmit={handleAddCustom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pet Care, Gym Membership"
                  value={customCatName}
                  onChange={(e) => setCustomCatName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Section / Group
                </label>
                <select
                  value={customCatSection}
                  onChange={(e) => setCustomCatSection(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  {CATEGORY_SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Category Emoji Icon
                </label>
                <input
                  type="text"
                  maxLength="2"
                  value={customCatIcon}
                  onChange={(e) => setCustomCatIcon(e.target.value)}
                  style={{
                    width: '60px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
