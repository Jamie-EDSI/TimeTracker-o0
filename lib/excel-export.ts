import * as XLSX from "xlsx"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  email: string
  caseManager: string
  lastContact?: string
}

export const exportToExcel = async (clients: Client[], filename: string) => {
  // Prepare data for export
  const exportData = clients.map((client) => ({
    "First Name": client.firstName,
    "Last Name": client.lastName,
    "Participant ID": client.participantId,
    Program: client.program,
    Status: client.status,
    "Enrollment Date": new Date(client.enrollmentDate).toLocaleDateString(),
    Phone: client.phone,
    Email: client.email,
    "Case Manager": client.caseManager,
    "Last Contact": client.lastContact ? new Date(client.lastContact).toLocaleDateString() : "N/A",
  }))

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // Auto-size columns
  const columnWidths = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.max(key.length, 15),
  }))
  worksheet["!cols"] = columnWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clients")

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0]
  const finalFilename = `${filename}_${timestamp}.xlsx`

  // Write file
  XLSX.writeFile(workbook, finalFilename)
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
