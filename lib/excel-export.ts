export const exportToExcel = (data: any[], filename: string, sheetName?: string) => {
  console.log(`Exporting ${data.length} records to Excel:`, filename)
  console.log("Data:", data)

  // In a real application, you would use a library like xlsx or exceljs
  // For now, we'll simulate the export by creating a CSV download
  const csvContent = convertToCSV(data)
  downloadCSV(csvContent, filename)
}

export const formatDateForExport = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const convertToCSV = (data: any[]) => {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(","))

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Escape commas and quotes in CSV
      return typeof value === "string" && (value.includes(",") || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value
    })
    csvRows.push(values.join(","))
  }

  return csvRows.join("\n")
}

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const formatPhoneForExport = (phone: string): string => {
  if (!phone) return "N/A"

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Format as (XXX) XXX-XXXX if 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return phone
}
