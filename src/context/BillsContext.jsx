import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeUserBills,
  createBill,
  updateBillRecord,
  deleteBillRecord,
  subscribeUserSettings,
  saveUserCustomCategories,
  saveUserMonthlyBudget
} from '../firebase/firestoreService';
import { DEFAULT_CATEGORIES, getCategoryMeta } from '../utils/categories';
import { extractMonthYear, SHORT_MONTH_NAMES, MONTH_NAMES } from '../utils/dateUtils';
import { formatINR } from '../utils/currency';

export const DEFAULT_MONTHLY_BUDGET = 10000;

const BillsContext = createContext();

export const useBills = () => useContext(BillsContext);

export const BillsProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active filter states
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  // Custom categories state from Firestore
  const [customCategories, setCustomCategories] = useState([]);

  // Monthly budgets state from Firestore: { 'YYYY-MM': number }
  const [monthlyBudgets, setMonthlyBudgets] = useState({});

  // State for editing a bill
  const [billToEdit, setBillToEdit] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Subscribe to real-time bills for authenticated user from Firestore
  useEffect(() => {
    if (!currentUser) {
      setBills([]);
      setMonthlyBudgets({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribeBills = subscribeUserBills(
      currentUser.uid,
      (data) => {
        setBills(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore bills subscription error:', err);
        setError(err.message || 'Failed to load real-time bills from Firestore.');
        setLoading(false);
      }
    );

    // Subscribe to user custom categories & monthly budgets from Firestore
    const unsubscribeSettings = subscribeUserSettings(
      currentUser.uid,
      (data) => {
        if (data) {
          if (Array.isArray(data.customCategories)) {
            setCustomCategories(data.customCategories);
          }
          if (data.monthlyBudgets) {
            setMonthlyBudgets(data.monthlyBudgets);
          }
        }
      },
      (err) => {
        console.warn('Could not sync user settings from Firestore:', err);
      }
    );

    return () => {
      unsubscribeBills();
      unsubscribeSettings();
    };
  }, [currentUser]);

  // Save custom categories to Firestore
  const addCustomCategory = async (name, icon = '🏷️', color = '#15803D', section = 'Other Expenses') => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = [...DEFAULT_CATEGORIES, ...customCategories].some(
      c => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showToast('A category with this name already exists', 'error');
      return;
    }
    const newCat = {
      id: trimmed,
      name: trimmed,
      icon,
      color,
      section: section || 'Other Expenses',
      isCustom: true
    };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    if (currentUser) {
      try {
        await saveUserCustomCategories(currentUser.uid, updated);
      } catch (err) {
        console.error('Failed to save category to Firestore:', err);
      }
    }
    showToast(`Added custom category "${trimmed}"`);
    return newCat;
  };

  const removeCustomCategory = async (id) => {
    const updated = customCategories.filter(c => c.id !== id);
    setCustomCategories(updated);
    if (currentUser) {
      try {
        await saveUserCustomCategories(currentUser.uid, updated);
      } catch (err) {
        console.error('Failed to delete category from Firestore:', err);
      }
    }
    showToast('Custom category removed');
  };

  const allCategories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...customCategories];
  }, [customCategories]);

  // Helper to determine the reporting date of a bill
  const getBillDate = (bill) => {
    return bill.paymentDate || bill.dueDate || (bill.createdAt ? bill.createdAt.split('T')[0] : '');
  };

  // Bills filtered for the selected month and year
  const monthlyBills = useMemo(() => {
    return bills.filter(bill => {
      const dateStr = getBillDate(bill);
      const parsed = extractMonthYear(dateStr);
      if (!parsed) return false;
      return parsed.month === selectedMonth && parsed.year === selectedYear;
    });
  }, [bills, selectedMonth, selectedYear]);

  // Dashboard & Reports Statistics for Selected Month
  const monthlyStats = useMemo(() => {
    let totalExpenses = 0;
    let totalPaidAmount = 0;
    let totalPendingAmount = 0;
    let paidBillsCount = 0;
    let pendingBillsCount = 0;

    monthlyBills.forEach(b => {
      const amt = Number(b.amount) || 0;
      totalExpenses += amt;
      if (b.status === 'Paid') {
        totalPaidAmount += amt;
        paidBillsCount++;
      } else {
        totalPendingAmount += amt;
        pendingBillsCount++;
      }
    });

    // Category breakdown for selected month
    const categoryMap = {};
    monthlyBills.forEach(b => {
      const catMeta = getCategoryMeta(b.category, customCategories);
      const catName = catMeta.name;
      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          amount: 0,
          color: catMeta.color,
          icon: catMeta.icon,
          count: 0
        };
      }
      categoryMap[catName].amount += Number(b.amount) || 0;
      categoryMap[catName].count += 1;
    });

    const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.amount - a.amount);

    return {
      totalExpenses,
      totalBillsCount: monthlyBills.length,
      paidBillsCount,
      pendingBillsCount,
      totalPaidAmount,
      totalPendingAmount,
      categoryBreakdown
    };
  }, [monthlyBills, customCategories]);

  // Get budget for any specific month & year (returns custom budget or DEFAULT_MONTHLY_BUDGET)
  const getBudgetForMonth = React.useCallback((month, year) => {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (monthlyBudgets && monthlyBudgets[monthKey] !== undefined && monthlyBudgets[monthKey] !== null) {
      return Number(monthlyBudgets[monthKey]);
    }
    return DEFAULT_MONTHLY_BUDGET;
  }, [monthlyBudgets]);

  // Active monthly budget for currently selected month/year
  const currentMonthlyBudget = useMemo(() => {
    return getBudgetForMonth(selectedMonth, selectedYear);
  }, [getBudgetForMonth, selectedMonth, selectedYear]);

  // Automatic budget calculations for selected month
  const budgetSummary = useMemo(() => {
    const totalSpent = monthlyStats.totalExpenses;
    const budgetLimit = currentMonthlyBudget;
    const remainingAmount = budgetLimit - totalSpent;
    const rawPercentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
    const usagePercentage = Math.round(rawPercentage * 10) / 10;
    const isWarning = rawPercentage >= 80 && rawPercentage < 100;
    const isExceeded = rawPercentage >= 100;
    const status = isExceeded ? 'danger' : isWarning ? 'warning' : 'normal';
    const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    const hasCustomBudget = Boolean(
      monthlyBudgets && monthlyBudgets[monthKey] !== undefined && monthlyBudgets[monthKey] !== null
    );

    return {
      budgetLimit,
      totalSpent,
      remainingAmount,
      usagePercentage,
      rawPercentage,
      isWarning,
      isExceeded,
      status,
      hasCustomBudget
    };
  }, [monthlyStats.totalExpenses, currentMonthlyBudget, monthlyBudgets, selectedMonth, selectedYear]);

  // Set or update budget for a month & year in Firestore
  const setMonthBudget = async (month, year, amount) => {
    const numeric = Math.max(0, parseFloat(amount) || 0);
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const updated = { ...monthlyBudgets, [monthKey]: numeric };
    setMonthlyBudgets(updated);

    if (currentUser) {
      try {
        await saveUserMonthlyBudget(currentUser.uid, monthKey, numeric);
        showToast(`Budget for ${MONTH_NAMES[month]} ${year} set to ${formatINR(numeric)}! 🎯`);
      } catch (err) {
        console.error('Failed to save monthly budget:', err);
        showToast('Failed to save budget: ' + err.message, 'error');
        throw err;
      }
    } else {
      showToast(`Budget for ${MONTH_NAMES[month]} ${year} set to ${formatINR(numeric)}!`);
    }
  };

  // Previous month comparison
  const previousMonthComparison = useMemo(() => {
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

    let prevTotal = 0;
    let prevPaid = 0;
    let prevCount = 0;

    bills.forEach(bill => {
      const dateStr = getBillDate(bill);
      const parsed = extractMonthYear(dateStr);
      if (parsed && parsed.month === prevMonth && parsed.year === prevYear) {
        const amt = Number(bill.amount) || 0;
        prevTotal += amt;
        if (bill.status === 'Paid') prevPaid += amt;
        prevCount++;
      }
    });

    const diff = monthlyStats.totalExpenses - prevTotal;
    const percentChange = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : (monthlyStats.totalExpenses > 0 ? 100 : 0);

    return {
      prevMonthName: SHORT_MONTH_NAMES[prevMonth],
      prevYear,
      prevTotal,
      prevPaid,
      prevCount,
      diff,
      percentChange,
      isHigher: diff > 0
    };
  }, [bills, selectedMonth, selectedYear, monthlyStats.totalExpenses]);

  // Monthly Expense Trend (all 12 months of selectedYear)
  const annualMonthlyTrend = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      monthIndex: i,
      month: SHORT_MONTH_NAMES[i],
      total: 0,
      paid: 0,
      pending: 0,
      count: 0
    }));

    bills.forEach(bill => {
      const dateStr = getBillDate(bill);
      const parsed = extractMonthYear(dateStr);
      if (parsed && parsed.year === selectedYear) {
        const amt = Number(bill.amount) || 0;
        monthlyData[parsed.month].total += amt;
        monthlyData[parsed.month].count += 1;
        if (bill.status === 'Paid') {
          monthlyData[parsed.month].paid += amt;
        } else {
          monthlyData[parsed.month].pending += amt;
        }
      }
    });

    return monthlyData;
  }, [bills, selectedYear]);

  // Recent 5 bills across all records
  const recentBills = useMemo(() => {
    return [...bills]
      .sort((a, b) => {
        const dateA = new Date(getBillDate(a) || 0).getTime();
        const dateB = new Date(getBillDate(b) || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [bills]);

  // CRUD actions in Firestore
  const addBill = async (billData) => {
    if (!currentUser) throw new Error('Authentication required to save bill.');
    const newId = await createBill(billData, currentUser.uid);
    showToast('Bill saved to Firestore! 🎉');
    return newId;
  };

  const updateBill = async (billId, billData) => {
    if (!currentUser) throw new Error('Authentication required to update bill.');
    await updateBillRecord(billId, billData, currentUser.uid);
    showToast('Bill updated in Firestore!');
    setBillToEdit(null);
  };

  const deleteBill = async (billId) => {
    if (!currentUser) throw new Error('Authentication required to delete bill.');
    await deleteBillRecord(billId, currentUser.uid);
    showToast('Bill deleted from Firestore.');
  };

  const value = {
    bills,
    loading,
    error,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    monthlyBills,
    monthlyStats,
    previousMonthComparison,
    annualMonthlyTrend,
    recentBills,
    allCategories,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    billToEdit,
    setBillToEdit,
    addBill,
    updateBill,
    deleteBill,
    toast,
    showToast,
    getBillDate,
    // Monthly Budget Limit features
    DEFAULT_MONTHLY_BUDGET,
    monthlyBudgets,
    currentMonthlyBudget,
    budgetSummary,
    getBudgetForMonth,
    setMonthBudget
  };

  return <BillsContext.Provider value={value}>{children}</BillsContext.Provider>;
};
