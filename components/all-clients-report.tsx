"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, FileSpreadsheet, FileText, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterPanel } from "@/components/ui/filter-panel"
import { exportToExcel, formatDateForExport } from "@/lib/excel-export"
import { exportToPDF } from "@/lib/pdf-export"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  cellPhone?: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth: string
  ssn?: string
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  isNew?: boolean
  createdAt?: string
  lastContact?: string
}

interface AllClientsReportProps {
  onBack: () => void
  clients: Client[]
  onViewClient?: (client: Client) => void
}

export function AllClientsReport({ onBack, clients, onViewClient }: AllClientsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: ["Active", "Inactive", "Pending"],
      placeholder: "Select status",
    },
    {
      key: "program",
      label: "Program",
      type: "select" as const,
      options: [
        "EARN",
        "Job Readiness",
        "YOUTH",
        "Ex-Offender",
        "Next Step Program",
        "Career Development",
        "Skills Training",
      ],
      placeholder: "Select program",
    },
    {
      key: "caseManager",
      label: "Case Manager",
      type: "select" as const,
      options: Array.from(new Set(clients.map((c) => c.caseManager).filter(Boolean))),
      placeholder: "Select case manager",
    },
    {
      key: "enrollmentDate",
      label: "Enrollment Date",
      type: "dateRange" as const,
    },
    {
      key: "lastContact",
      label: "Last Contact",
      type: "dateRange" as const,
    },
    {
      key: "city",
      label: "City",
      type: "text" as const,
      placeholder: "Enter city name",
    },
    {
      key: "state",
      label: "State",
      type: "text" as const,
      placeholder: "Enter state",
    },
  ]

  const filteredClients = useMemo(() => {
    let filtered = clients

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.caseManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return

      if (key === "status" || key === "program" || key === "caseManager") {
        filtered = filtered.filter((client) => client[key as keyof typeof client] === value)
      }

      if (key === "city" || key === "state") {
        filtered = filtered.filter((client) =>
          client[key as keyof typeof client]?.toLowerCase().includes(value.toLowerCase()),
        )
      }

      if (key === "enrollmentDate_from") {
        filtered = filtered.filter((client) => new Date(client.enrollmentDate) >= new Date(value))
      }

      if (key === "enrollmentDate_to") {
        filtered = filtered.filter((client) => new Date(client.enrollmentDate) <= new Date(value))
      }

      if (key === "lastContact_from") {
        filtered = filtered.filter((client) => client.lastContact && new Date(client.lastContact) >= new Date(value))
      }

      if (key === "lastContact_to") {
        filtered = filtered.filter((client) => client.lastContact && new Date(client.lastContact) <= new Date(value))
      }
    })

    return filtered
  }, [clients, searchTerm, filters])

  const handleExportToExcel = () => {
    const exportData = filteredClients.map((client) => ({
      "Client Name": `${client.firstName} ${client.lastName}`,
      "Participant ID": client.participantId,
      Status: client.status,
      Program: client.program,
      "Enrollment Date": formatDateForExport(client.enrollmentDate),
      "Case Manager": client.caseManager,
      "Last Contact": client.lastContact ? formatDateForExport(client.lastContact) : "N/A",
      Phone: client.phone,
      Email: client.email,
      City: client.city,
      State: client.state,
      "ZIP Code": client.zipCode,
      "Emergency Contact": client.emergencyContact || "N/A",
      "Emergency Phone": client.emergencyPhone || "N/A",
    }))

    const filename = `All_Clients_Report_${new Date().toISOString().split("T")[0]}`
    exportToExcel(exportData, filename, "All Clients")
  }

  const handleExportToPDF = () => {
    const pdfData = filteredClients.map((client) => ({
      "Client Name": `${client.firstName} ${client.lastName}`,
      "Participant ID": client.participantId,
      Status: client.status,
      Program: client.program,
      "Enrollment Date": client.enrollmentDate,
      "Case Manager": client.caseManager,
      Phone: client.phone,
      Email: client.email,
    }))

    const columns = [
      { key: "Client Name", label: "Client Name", width: "18%" },
      { key: "Participant ID", label: "PID", width: "10%" },
      { key: "Status", label: "Status", width: "8%" },
      { key: "Program", label: "Program", width: "15%" },
      { key: "Enrollment Date", label: "Enrolled", width: "10%" },
      { key: "Case Manager", label: "Case Manager", width: "15%" },
      { key: "Phone", label: "Phone", width: "12%" },
      { key: "Email", label: "Email", width: "12%" },
    ]

    exportToPDF(pdfData, "All Clients Report", columns, filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  // Calculate statistics
  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "Active").length,
    inactive: clients.filter((c) => c.status === "Inactive").length,
    pending: clients.filter((c) => c.status === "Pending").length,
    newThisMonth: clients.filter((c) => c.isNew).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">All Clients Report</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleExportToExcel} className="bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to Excel ({filteredClients.length})
            </Button>
            <Button onClick={handleExportToPDF} className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <div className="text-sm text-gray-600">Inactive</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filterOptions}
          onFiltersChange={setFilters}
          activeFilters={filters}
          onClearFilters={handleClearFilters}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                All Clients ({filteredClients.length} of {clients.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search all clients..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Participant ID</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Program</th>
                    <th className="text-left py-3 px-4">Enrollment Date</th>
                    <th className="text-left py-3 px-4">Case Manager</th>
                    <th className="text-left py-3 px-4">Last Contact</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          {client.firstName} {client.lastName}
                          {client.isNew && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{client.participantId}</td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(client.status)}>{client.status}</span>
                      </td>
                      <td className="py-3 px-4">{client.program}</td>
                      <td className="py-3 px-4">{new Date(client.enrollmentDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{client.caseManager}</td>
                      <td className="py-3 px-4">
                        {client.lastContact ? new Date(client.lastContact).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {client.city}, {client.state}
                      </td>
                      <td className="py-3 px-4">
                        {onViewClient && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewClient(client)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No clients match the current filters. Try adjusting your search criteria.
              </div>
            )}

            {/* Export Summary */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-orange-900">Export Summary</h3>
                  <p className="text-xs text-orange-700">
                    Ready to export {filteredClients.length} filtered client records across all statuses
                    {Object.keys(filters).length > 0 && " (filters applied)"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExportToExcel} size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <FileSpreadsheet className="w-3 h-3 mr-1" />
                    Excel
                  </Button>
                  <Button onClick={handleExportToPDF} size="sm" className="bg-red-600 hover:bg-red-700">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
