import React, { useState } from 'react';
import {
  User,
  Database,
  Trash2,
  Plus,
  Download,
  FileDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBills } from '../context/BillsContext';
import { exportBillsToCSV } from '../utils/csvExport';
import { exportBillsToPDF } from '../utils/pdfExport';
import { MonthlyBudgetForm } from '../components/budget/MonthlyBudgetForm';
import { CATEGORY_SECTIONS } from '../utils/categories';

export const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const {
    bills,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    showToast
  } = useBills();

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [newCatSection, setNewCatSection] = useState('Other Expenses');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCustomCategory(newCatName.trim(), newCatIcon, '#15803D', newCatSection);
    setNewCatName('');
    setNewCatSection('Other Expenses');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bills, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `home-bills-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON backup exported successfully!');
  };

  const handleExportAllCSV = () => {
    exportBillsToCSV(bills, `all-home-bills-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    try {
      if (!bills || bills.length === 0) {
        showToast('No bill records found to export to PDF.', 'error');
        return;
      }
      exportBillsToPDF(bills);
      showToast('PDF report downloaded successfully! 📄');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PDF: ' + err.message, 'error');
    }
  };

  return (
    <div className="settings-page" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#0f172a'
          }}
        >
          Settings & Configuration
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
          Manage your account, categories, Firebase sync, and data backups
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* User Account Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Account Details</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Authenticated owner session</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Email Address</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {currentUser?.email || 'Authenticated Owner'}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Database Storage</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803D', marginTop: '0.2rem' }}>
                Cloud Firestore (Live Sync)
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Monthly Budget Settings Form Card */}
        <MonthlyBudgetForm showHeader={true} />

        {/* Custom Categories Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Manage Custom Categories</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Add or delete specialized bill categories</span>
            </div>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              maxLength="2"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              placeholder="🏷️"
              style={{
                width: '54px',
                textAlign: 'center',
                fontSize: '1.2rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                padding: '0.5rem'
              }}
            />
            <input
              type="text"
              placeholder="New category name (e.g. Gym, Pet Food)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              style={{
                flex: '1 1 200px',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem'
              }}
            />
            <select
              value={newCatSection}
              onChange={(e) => setNewCatSection(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.875rem',
                color: '#334155',
                cursor: 'pointer'
              }}
              title="Select section"
            >
              {CATEGORY_SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#16A34A',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
              }}
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </form>

          {/* List of Custom Categories */}
          {customCategories.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No custom categories added yet. You are using the standard household default categories.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {customCategories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#f1f5f9',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#334155'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <button
                    onClick={() => removeCustomCategory(cat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 0
                    }}
                    title="Remove custom category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Backup & Sample Data Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>
            Data Backup & Tools
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>
            Export all records in CSV, JSON, or PDF formats
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={handleExportAllCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Export All to CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={handleExportPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Download formatted PDF report with all bills and totals"
            >
              <FileDown size={16} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
