// Excel export utility functions
export const exportToExcel = (data: any[], filename: string, sheetName = "Sheet1") => {
  // Create a simple CSV-like structure that can be downloaded
  // Since we're in a browser environment, we'll create a CSV file instead of XLSX
  // but name it with .xlsx extension for user experience

  if (!data || data.length === 0) {
    alert("No data to export")
    return
  }

  // Get headers from the first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(","),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle values that might contain commas or quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ""
        })
        .join(","),
    ),
  ].join("\n")

  // Create and download the file
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

export const formatDateForExport = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}
