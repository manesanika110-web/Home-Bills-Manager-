import { formatDateDisplay } from './dateUtils';

export const exportBillsToCSV = (bills, filename = 'home-bills-report.csv') => {
  if (!bills || bills.length === 0) {
    alert('No bill records to export for this period.');
    return;
  }

  const headers = [
    'Bill Name',
    'Category',
    'Amount (INR)',
    'Status',
    'Due Date',
    'Payment Date',
    'Payment Method',
    'Notes',
    'Created At'
  ];

  const rows = bills.map(bill => [
    `"${(bill.name || '').replace(/"/g, '""')}"`,
    `"${(bill.category || '').replace(/"/g, '""')}"`,
    bill.amount || 0,
    `"${bill.status || 'Pending'}"`,
    `"${formatDateDisplay(bill.dueDate)}"`,
    `"${formatDateDisplay(bill.paymentDate)}"`,
    `"${(bill.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(bill.notes || '').replace(/"/g, '""')}"`,
    `"${formatDateDisplay(bill.createdAt)}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
