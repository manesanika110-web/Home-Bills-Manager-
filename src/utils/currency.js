// Currency formatting utilities for INR (₹)

export const formatINR = (amount, includeDecimals = false) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  }).format(numericAmount);
};

export const formatCompactINR = (amount) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  if (numericAmount >= 10000000) {
    return `₹${(numericAmount / 10000000).toFixed(1)}Cr`;
  }
  if (numericAmount >= 100000) {
    return `₹${(numericAmount / 100000).toFixed(1)}L`;
  }
  if (numericAmount >= 1000) {
    return `₹${(numericAmount / 1000).toFixed(1)}k`;
  }
  return `₹${numericAmount}`;
};
