import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateDisplay } from './dateUtils';

/**
 * Generates and downloads a PDF report containing all bill records and relevant totals
 * styled with the Home Bills Manager forest green palette.
 */
export const exportBillsToPDF = (bills = [], filename = `Home-Bills-Report-${new Date().toISOString().split('T')[0]}.pdf`) => {
  if (!bills || bills.length === 0) {
    throw new Error('No bill records found to export to PDF.');
  }

  // Calculate totals and statistics
  let totalAmount = 0;
  let totalPaidAmount = 0;
  let totalPendingAmount = 0;
  let paidCount = 0;
  let pendingCount = 0;

  bills.forEach((bill) => {
    const amt = Number(bill.amount) || 0;
    totalAmount += amt;
    if (bill.status === 'Paid') {
      totalPaidAmount += amt;
      paidCount++;
    } else {
      totalPendingAmount += amt;
      pendingCount++;
    }
  });

  // Create A4 Landscape PDF for optimal table readability
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Top Brand Header Banner (Forest Green #064E32)
  doc.setFillColor(6, 78, 50);
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('HOME BILLS MANAGER', 14, 11);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(167, 243, 208); // #A7F3D0 light mint
  doc.text('Comprehensive Household Bills & Expense Report', 14, 18);

  // Generation timestamp on right
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${dateStr}`, pageWidth - 14, 11, { align: 'right' });
  doc.setTextColor(167, 243, 208);
  doc.text(`Total Records: ${bills.length}`, pageWidth - 14, 18, { align: 'right' });

  // 2. Summary Statistics Box (Soft Mint #F0FDF4 background with #86EFAC border)
  const summaryBoxY = 31;
  const summaryBoxHeight = 19;
  const summaryBoxWidth = pageWidth - 28;

  doc.setFillColor(240, 253, 244); // #F0FDF4
  doc.setDrawColor(134, 239, 172); // #86EFAC
  doc.setLineWidth(0.4);
  doc.roundedRect(14, summaryBoxY, summaryBoxWidth, summaryBoxHeight, 2.5, 2.5, 'FD');

  // 4 Summary Columns inside box
  const colWidth = summaryBoxWidth / 4;

  const statItems = [
    { label: 'TOTAL EXPENSES', value: `Rs. ${totalAmount.toLocaleString('en-IN')}`, color: [16, 37, 27] },
    { label: 'TOTAL PAID', value: `Rs. ${totalPaidAmount.toLocaleString('en-IN')}`, color: [21, 128, 61], count: `${paidCount} Bills` },
    { label: 'TOTAL PENDING', value: `Rs. ${totalPendingAmount.toLocaleString('en-IN')}`, color: [217, 119, 6], count: `${pendingCount} Bills` },
    { label: 'RECORD COUNT', value: `${bills.length} Bills`, color: [6, 78, 50], count: `${paidCount} Paid • ${pendingCount} Due` }
  ];

  statItems.forEach((item, i) => {
    const xPos = 14 + (i * colWidth) + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // #64748B
    doc.text(item.label, xPos, summaryBoxY + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(item.color[0], item.color[1], item.color[2]);
    doc.text(item.value, xPos, summaryBoxY + 12.5);

    if (item.count) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(item.count, xPos, summaryBoxY + 16.5);
    }
  });

  // 3. Bill Records Table
  const tableHeaders = [
    '#',
    'Bill Name',
    'Category',
    'Amount (INR)',
    'Status',
    'Due Date',
    'Payment Date',
    'Payment Method',
    'Notes'
  ];

  const tableData = bills.map((bill, index) => [
    index + 1,
    bill.name || '—',
    bill.category || 'Other',
    `Rs. ${(Number(bill.amount) || 0).toLocaleString('en-IN')}`,
    bill.status || 'Pending',
    formatDateDisplay(bill.dueDate),
    bill.status === 'Paid' && bill.paymentDate ? formatDateDisplay(bill.paymentDate) : '—',
    bill.paymentMethod || '—',
    bill.notes || '—'
  ]);

  autoTable(doc, {
    startY: 55,
    head: [tableHeaders],
    body: tableData,
    foot: [
      [
        'Total',
        `${bills.length} Records`,
        '',
        `Rs. ${totalAmount.toLocaleString('en-IN')}`,
        `${paidCount} Paid / ${pendingCount} Due`,
        '',
        '',
        '',
        ''
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [6, 78, 50], // Forest green #064E32
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: 2.8
    },
    footStyles: {
      fillColor: [220, 252, 231], // #DCFCE7
      textColor: [6, 78, 50],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 2.8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [16, 37, 27],
      cellPadding: 2.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // #F8FAFC
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // #
      1: { cellWidth: 46 },                  // Bill Name
      2: { cellWidth: 32 },                  // Category
      3: { cellWidth: 26, halign: 'right' }, // Amount
      4: { cellWidth: 22, halign: 'center' }, // Status
      5: { cellWidth: 24, halign: 'center' }, // Due Date
      6: { cellWidth: 24, halign: 'center' }, // Payment Date
      7: { cellWidth: 36 },                  // Payment Method
      8: { cellWidth: 'auto' }               // Notes
    },
    didParseCell: (data) => {
      // Highlight status column
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'Paid') {
          data.cell.styles.textColor = [21, 128, 61]; // #15803D
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [217, 119, 6]; // #D97706
          data.cell.styles.fontStyle = 'bold';
        }
      }

      // Highlight amount column font weight
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawPage: (data) => {
      // Footer on every page
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // #94A3B8

      const footerText = 'Home Bills Manager • Secure Personal Household Bills Backup';
      doc.text(footerText, 14, pageHeight - 7);

      const pageNumberText = `Page ${data.pageNumber}`;
      doc.text(pageNumberText, pageWidth - 14, pageHeight - 7, { align: 'right' });
    },
    margin: { left: 14, right: 14, top: 12, bottom: 12 }
  });

  // Save the generated PDF
  doc.save(filename);
};
