// Category definitions, default list, icons, sections, and chart colors

export const CATEGORY_SECTIONS = [
  'Home Utilities',
  'Housing',
  'Education',
  'Daily Expenses',
  'Other Expenses'
];

export const DEFAULT_CATEGORIES = [
  // Home Utilities
  { id: 'Electricity', name: 'Electricity Bill', icon: '⚡', color: '#2563eb', section: 'Home Utilities' },
  { id: 'Gas', name: 'Gas Bill', icon: '🔥', color: '#ea580c', section: 'Home Utilities' },
  { id: 'Water', name: 'Water Bill', icon: '💧', color: '#0284c7', section: 'Home Utilities' },
  { id: 'Internet', name: 'Internet / Wi-Fi', icon: '🌐', color: '#4f46e5', section: 'Home Utilities' },
  { id: 'Mobile Recharge', name: 'Mobile Recharge', icon: '📱', color: '#db2777', section: 'Home Utilities' },

  // Housing
  { id: 'House Rent', name: 'House Rent', icon: '🏢', color: '#7c3aed', section: 'Housing' },
  { id: 'Maintenance', name: 'Maintenance', icon: '🏠', color: '#059669', section: 'Housing' },
  { id: 'Home Repairs', name: 'Home Repairs', icon: '🔧', color: '#d97706', section: 'Housing' },

  // Education
  { id: 'Education', name: 'School / Class Fees', icon: '🎓', color: '#0d9488', section: 'Education' },

  // Daily Expenses
  { id: 'Grocery', name: 'Grocery', icon: '🛒', color: '#65a30d', section: 'Daily Expenses' },
  { id: 'Medical', name: 'Medical Expenses', icon: '💊', color: '#dc2626', section: 'Daily Expenses' },

  // Other Expenses
  { id: 'Other', name: 'Other', icon: '📦', color: '#64748b', section: 'Other Expenses' }
];

export const PAYMENT_METHODS = [
  'UPI / GPay / PhonePe / Paytm',
  'Net Banking',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Cheque',
  'Auto Debit',
  'Other'
];

/**
 * Groups a list of categories into labeled sections in predefined order
 */
export const groupCategoriesBySection = (categories = []) => {
  const sectionsMap = {};

  CATEGORY_SECTIONS.forEach((sec) => {
    sectionsMap[sec] = [];
  });

  categories.forEach((cat) => {
    const sec = cat.section || 'Other Expenses';
    if (!sectionsMap[sec]) {
      sectionsMap[sec] = [];
    }
    sectionsMap[sec].push(cat);
  });

  const orderedSections = [
    ...CATEGORY_SECTIONS,
    ...Object.keys(sectionsMap).filter((k) => !CATEGORY_SECTIONS.includes(k))
  ];

  return orderedSections
    .filter((sec) => sectionsMap[sec] && sectionsMap[sec].length > 0)
    .map((sec) => ({
      section: sec,
      categories: sectionsMap[sec]
    }));
};

export const getCategoryMeta = (categoryIdOrName, customCategories = []) => {
  const all = [...DEFAULT_CATEGORIES, ...customCategories];
  const found = all.find(
    c => c.id.toLowerCase() === (categoryIdOrName || '').toLowerCase() ||
         c.name.toLowerCase() === (categoryIdOrName || '').toLowerCase()
  );
  if (found) return found;

  return {
    id: categoryIdOrName || 'Other',
    name: categoryIdOrName || 'Other',
    icon: '📋',
    color: '#10b981'
  };
};
