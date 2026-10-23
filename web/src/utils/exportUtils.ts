/**
 * High-reliability Export Utilities for Trust Education ERP
 * Supports:
 * 1. Export to Excel (.csv / .xls with UTF-8 BOM for Microsoft Excel)
 * 2. Export to PDF (Official Trust Letterhead, KPI Summary, and Printable/Saveable PDF document)
 */

export interface ExportColumn {
  header: string;
  key: string;
}

export interface PdfExportOptions {
  title: string;
  subtitle: string;
  summaryMetrics?: { label: string; value: string | number; color?: string }[];
  columns: string[];
  rows: (string | number)[][];
  fileName?: string;
}

/**
 * Exports data to Microsoft Excel-compatible CSV with UTF-8 BOM
 */
export function exportToExcel(
  columns: ExportColumn[],
  rows: Record<string, any>[],
  fileName: string = 'Trust_Export'
) {
  // Add UTF-8 BOM for Microsoft Excel compatibility
  const BOM = '\uFEFF';

  // Format headers
  const headerLine = columns.map((c) => escapeCsvValue(c.header)).join(',');

  // Format data lines
  const dataLines = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col.key];
        return escapeCsvValue(val !== undefined && val !== null ? String(val) : '');
      })
      .join(',')
  );

  const csvContent = BOM + [headerLine, ...dataLines].join('\r\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName.replace(/\s+/g, '_')}_${formatDateForFileName()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escapes CSV special characters: quotes, commas, and newlines
 */
function escapeCsvValue(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/**
 * Exports data to high-resolution Printable / Save-as-PDF document with Trust Letterhead
 */
export function exportToPdf(options: PdfExportOptions) {
  const { title, subtitle, summaryMetrics, columns, rows, fileName = 'Trust_Report' } = options;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate and download the PDF report.');
    return;
  }

  const generatedTime = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const summaryHtml = summaryMetrics && summaryMetrics.length > 0
    ? `
      <div class="summary-container">
        ${summaryMetrics
          .map(
            (m) => `
          <div class="summary-card">
            <div class="summary-label">${m.label}</div>
            <div class="summary-value" style="color: ${m.color || '#ea580c'};">${m.value}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `
    : '';

  const tableHeadersHtml = columns.map((col) => `<th>${col}</th>`).join('');

  const tableRowsHtml = rows
    .map(
      (row, idx) => `
      <tr class="${idx % 2 === 0 ? 'even-row' : ''}">
        ${row.map((cell) => `<td>${cell !== undefined && cell !== null ? cell : '-'}</td>`).join('')}
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${fileName}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 12mm 10mm 15mm 10mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 20px;
          background: #ffffff;
          font-size: 11px;
        }
        .header {
          border-bottom: 3px double #ea580c;
          padding-bottom: 14px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .brand-title {
          font-size: 20px;
          font-weight: 900;
          color: #ea580c;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .brand-sub {
          font-size: 10px;
          color: #64748b;
          margin-top: 3px;
          font-weight: 600;
        }
        .report-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 6px;
        }
        .report-subtitle {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }
        .badge {
          display: inline-block;
          background: #ffedd5;
          color: #c2410c;
          font-size: 9px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .meta-box {
          text-align: right;
          font-size: 10px;
          color: #64748b;
        }
        .summary-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }
        .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }
        .summary-label {
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 700;
          color: #64748b;
        }
        .summary-value {
          font-size: 16px;
          font-weight: 900;
          margin-top: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        th {
          background-color: #0f172a;
          color: #ffffff;
          font-weight: 700;
          text-align: left;
          padding: 7px 8px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td {
          padding: 6px 8px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        .even-row {
          background-color: #f8fafc;
        }
        .footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
        }
        .no-print-bar {
          background: #ea580c;
          color: white;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: -20px -20px 20px -20px;
          font-weight: 700;
        }
        .btn-print {
          background: #ffffff;
          color: #ea580c;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-weight: 800;
          cursor: pointer;
          font-size: 11px;
        }
        @media print {
          .no-print-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-bar">
        <span>📄 Trust Official PDF Document Preview</span>
        <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="brand-title">Zep Foundation Bhose</div>
          <div class="brand-sub">Registered Public Education Trust &bull; Regn. No. F-18452/SOLAPUR &bull; Est. 2005</div>
          <div class="report-title">${title}</div>
          <div class="report-subtitle">${subtitle}</div>
        </div>
        <div class="meta-box">
          <span class="badge">Official Trust Record</span>
          <div style="margin-top: 6px;">Generated: ${generatedTime}</div>
          <div>Records Exported: <strong>${rows.length}</strong></div>
        </div>
      </div>

      ${summaryHtml}

      <table>
        <thead>
          <tr>${tableHeadersHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>Trust Education ERP &bull; Confidential Administrative Report</span>
        <span>Authorized System Signature &bull; Page 1 of 1</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function formatDateForFileName(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
