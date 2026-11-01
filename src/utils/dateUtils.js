// Date manipulation and formatting utilities

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Returns YYYY-MM-DD for HTML input[type="date"]
export const getTodayDateInput = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Formats YYYY-MM-DD or ISO string or Firestore Timestamp to DD/MM/YYYY (as in screenshot "15/04/2025")
export const formatDateDisplay = (dateValue) => {
  if (!dateValue) return '—';
  
  let d;
  if (typeof dateValue === 'object' && dateValue.toDate) {
    // Firestore Timestamp
    d = dateValue.toDate();
  } else if (typeof dateValue === 'string') {
    // If YYYY-MM-DD
    const parts = dateValue.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    d = new Date(dateValue);
  } else {
    d = new Date(dateValue);
  }

  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Extracts { year, monthIndex (0-11) } from a bill's date
export const extractMonthYear = (dateValue) => {
  if (!dateValue) return null;
  if (typeof dateValue === 'object' && dateValue.toDate) {
    const d = dateValue.toDate();
    return { year: d.getFullYear(), month: d.getMonth() };
  }
  if (typeof dateValue === 'string') {
    const parts = dateValue.split('-');
    if (parts.length === 3) {
      return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) - 1 };
    }
  }
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return null;
  return { year: d.getFullYear(), month: d.getMonth() };
};

export const getAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 3; y <= currentYear + 2; y++) {
    years.push(y);
  }
  return years;
};
