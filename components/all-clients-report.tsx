"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FilterPanel } from "@/components/ui/filter-panel"
import { ArrowLeft, Search, Download, Eye, Filter } from "lucide-react"
import { exportToExcel } from "@/lib/excel-export"

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
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  isNew?: boolean
  createdAt?: string
  lastContact?: string
  lastModified?: string
  modifiedBy?: string
  educationLevel?: string
  graduationYear?: string
  schoolName?: string
  fieldOfStudy?: string
  educationNotes?: string
  currentlyEnrolled?: string
  gpa?: string
  certifications?: string
  licenses?: string
  industryCertifications?: string
  certificationStatus?: string
  certificationNotes?: string
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

interface AllClientsReportProps {
  onBack: () => void
  clients: Client[]
  onViewClient: (client: Client) => void
}

export function AllClientsReport({ onBack, clients, onViewClient }: AllClientsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    program: "",
    caseManager: "",
    status: "",
    enrollmentDateFrom: "",
    enrollmentDateTo: "",
  })

  // Get unique values for filter options
  const uniquePrograms = [...new Set(clients.map((client) => client.program))].sort()
  const uniqueCaseManagers = [...new Set(clients.map((client) => client.caseManager))].sort()
  const uniqueStatuses = [...new Set(clients.map((client) => client.status))].sort()

  // Create filter configuration
  const filterOptions = [
    {
      key: "program",
      label: "Program",
      type: "select" as const,
      options: uniquePrograms,
      placeholder: "Select program...",
    },
    {
      key: "caseManager",
      label: "Case Manager",
      type: "select" as const,
      options: uniqueCaseManagers,
      placeholder: "Select case manager...",
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: uniqueStatuses,
      placeholder: "Select status...",
    },
    {
      key: "enrollmentDate",
      label: "Enrollment Date",
      type: "dateRange" as const,
      placeholder: "Select date range...",
    },
  ]

  // Apply search and filters
  const filteredClients = clients.filter((client) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchLower) ||
        client.participantId.toLowerCase().includes(searchLower) ||
        client.program.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.toLowerCase().includes(searchLower) ||
        client.caseManager.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false
    }

    // Program filter
    if (activeFilters.program && client.program !== activeFilters.program) return false

    // Case Manager filter
    if (activeFilters.caseManager && client.caseManager !== activeFilters.caseManager) return false

    // Status filter
    if (activeFilters.status && client.status !== activeFilters.status) return false

    // Enrollment date filters
    if (activeFilters.enrollmentDateFrom) {
      const enrollmentDate = new Date(client.enrollmentDate)
      const fromDate = new Date(activeFilters.enrollmentDateFrom)
      if (enrollmentDate < fromDate) return false
    }

    if (activeFilters.enrollmentDateTo) {
      const enrollmentDate = new Date(client.enrollmentDate)
      const toDate = new Date(activeFilters.enrollmentDateTo)
      if (enrollmentDate > toDate) return false
    }

    return true
  })

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setActiveFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setActiveFilters({
      program: "",
      caseManager: "",
      status: "",
      enrollmentDateFrom: "",
      enrollmentDateTo: "",
    })
    setSearchTerm("")
  }

  const handleExport = () => {
    const exportData = filteredClients.map((client) => ({
      "Participant ID": client.participantId,
      "First Name": client.firstName,
      "Last Name": client.lastName,
      Program: client.program,
      Status: client.status,
      "Enrollment Date": client.enrollmentDate,
      Phone: client.phone,
      "Cell Phone": client.cellPhone || "",
      Email: client.email,
      Address: client.address,
      City: client.city,
      State: client.state,
      "ZIP Code": client.zipCode,
      "Date of Birth": client.dateOfBirth,
      "Emergency Contact": client.emergencyContact || "",
      "Emergency Phone": client.emergencyPhone || "",
      "Case Manager": client.caseManager,
      "Responsible EC": client.responsibleEC || "",
      "Required Hours": client.requiredHours || "",
      "CAO Number": client.caoNumber || "",
      "Last Contact": client.lastContact || "",
      "Last Modified": client.lastModified || "",
      "Modified By": client.modifiedBy || "",
    }))

    exportToExcel(exportData, "All_Clients_Report")
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  // Count active filters for display
  const activeFilterCount = Object.values(activeFilters).filter((value) => value && value !== "").length

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Clients Report</h1>
                <p className="text-gray-600">Complete overview of all clients in the system</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600">
                {filteredClients.length} clients
              </Badge>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className={`${showFilters ? "bg-blue-50 text-blue-700 border-blue-200" : ""}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">{activeFilterCount}</Badge>
                )}
              </Button>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                All Clients ({filteredClients.length})
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    • {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
                  </span>
                )}
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              filters={filterOptions}
              onFiltersChange={handleFiltersChange}
              activeFilters={activeFilters}
              onClearFilters={handleClearFilters}
            />
          )}

          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {searchTerm || activeFilterCount > 0 ? "No clients match your search criteria." : "No clients found."}
                </p>
                {(searchTerm || activeFilterCount > 0) && (
                  <Button onClick={handleClearFilters} variant="outline" size="sm">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                      client.isNew ? "ring-2 ring-green-200 bg-green-50" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        {client.isNew && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs animate-pulse">
                            New
                          </Badge>
                        )}
                        {getStatusBadge(client.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">PID:</span> {client.participantId}
                        </div>
                        <div>
                          <span className="font-medium">Program:</span> {client.program}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {client.phone}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {client.email}
                        </div>
                        <div>
                          <span className="font-medium">Case Manager:</span> {client.caseManager}
                        </div>
                        <div>
                          <span className="font-medium">Enrollment:</span> {formatDate(client.enrollmentDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button onClick={() => onViewClient(client)} size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
