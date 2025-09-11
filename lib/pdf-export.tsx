// PDF export utility functions
export const exportToPDF = (
  data: any[],
  title: string,
  columns: { key: string; label: string; width?: string }[],
  filters?: Record<string, any>,
) => {
  if (!data || data.length === 0) {
    alert("No data to export")
    return
  }

  // Create HTML content for PDF
  const htmlContent = generatePDFHTML(data, title, columns, filters)

  // Create a new window for PDF generation
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow popups to export PDF")
    return
  }

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

const generatePDFHTML = (
  data: any[],
  title: string,
  columns: { key: string; label: string; width?: string }[],
  filters?: Record<string, any>,
) => {
  const currentDate = new Date().toLocaleDateString()
  const currentTime = new Date().toLocaleTimeString()

  // Generate filter summary
  const filterSummary =
    filters && Object.keys(filters).length > 0
      ? Object.entries(filters)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      : "No filters applied"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page {
          margin: 0.5in;
          size: letter;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        
        .header {
          border-bottom: 2px solid #dc2626;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #dc2626;
          font-size: 24px;
          margin: 0 0 10px 0;
          font-weight: 700;
        }
        
        .header-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        
        .report-meta {
          font-size: 11px;
          color: #666;
        }
        
        .filters-section {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 25px;
          border-left: 4px solid #dc2626;
        }
        
        .filters-title {
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 8px;
          font-size: 13px;
        }
        
        .filters-content {
          font-size: 11px;
          color: #555;
        }
        
        .summary-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 25px;
          padding: 15px;
          background-color: #fef2f2;
          border-radius: 6px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #dc2626;
          display: block;
        }
        
        .stat-label {
          font-size: 11px;
          color: #666;
          margin-top: 4px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background: white;
        }
        
        th {
          background-color: #dc2626;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 11px;
          vertical-align: top;
        }
        
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        tr:hover {
          background-color: #fef2f2;
        }
        
        .status-badge {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-active {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .call-type-outbound {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .call-type-inbound {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="header-info">
          <div class="report-meta">
            <strong>Generated:</strong> ${currentDate} at ${currentTime}
          </div>
          <div class="report-meta">
            <strong>Records:</strong> ${data.length}
          </div>
        </div>
      </div>
      
      <div class="filters-section">
        <div class="filters-title">Applied Filters</div>
        <div class="filters-content">${filterSummary}</div>
      </div>
      
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-number">${data.length}</span>
          <div class="stat-label">Total Records</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${new Date().toLocaleDateString()}</span>
          <div class="stat-label">Report Date</div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th style="${col.width ? `width: ${col.width}` : ""}">${col.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${columns
                .map((col) => {
                  let value = row[col.key] || ""

                  // Apply special formatting for certain fields
                  if (col.key.toLowerCase().includes("status")) {
                    const statusClass =
                      value.toLowerCase() === "active"
                        ? "status-active"
                        : value.toLowerCase() === "inactive"
                          ? "status-inactive"
                          : "status-pending"
                    value = `<span class="status-badge ${statusClass}">${value}</span>`
                  } else if (
                    col.key.toLowerCase().includes("call type") ||
                    col.key.toLowerCase().includes("calltype")
                  ) {
                    const typeClass = value.toLowerCase() === "outbound" ? "call-type-outbound" : "call-type-inbound"
                    value = `<span class="status-badge ${typeClass}">${value}</span>`
                  } else if (col.key.toLowerCase().includes("date")) {
                    try {
                      value = new Date(value).toLocaleDateString()
                    } catch (e) {
                      // Keep original value if date parsing fails
                    }
                  }

                  return `<td>${value}</td>`
                })
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="footer">
        <p>This report was generated from the Time Tracker Application</p>
        <p>© ${new Date().getFullYear()} EDSI - All rights reserved</p>
      </div>
    </body>
    </html>
  `
}

export const formatDateForPDF = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}
