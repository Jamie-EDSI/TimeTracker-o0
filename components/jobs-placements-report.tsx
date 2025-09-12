"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, FileSpreadsheet, FileText, Briefcase, TrendingUp } from "lucide-react"
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
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

interface JobsPlacementsReportProps {
  onBack: () => void
  clients: Client[]
}

// Generate sample job placement data
const generateJobPlacementData = (clients: Client[]) => {
  const jobTitles = [
    "Customer Service Representative",
    "Administrative Assistant",
    "Warehouse Associate",
    "Retail Sales Associate",
    "Food Service Worker",
    "Security Guard",
    "Data Entry Clerk",
    "Maintenance Technician",
    "Receptionist",
    "Delivery Driver",
    "Cashier",
    "Office Assistant",
  ]

  const companies = [
    "ABC Corporation",
    "XYZ Industries",
    "Global Solutions Inc",
    "Metro Services LLC",
    "City Hospital",
    "Downtown Retail",
    "Tech Solutions",
    "Manufacturing Plus",
    "Service Excellence",
    "Community Center",
    "Local Government",
    "Healthcare Partners",
  ]

  const placementStatuses = ["Placed", "Interview Scheduled", "Application Submitted", "Follow-up Required"]
  const salaryRanges = ["$12-15/hr", "$15-18/hr", "$18-22/hr", "$22-25/hr", "$25-30/hr", "$30-35/hr"]

  const placements = []

  // Generate placements for about 60% of active clients
  const activeClients = clients.filter((c) => c.status === "Active")
  const placementCount = Math.floor(activeClients.length * 0.6)

  for (let i = 0; i < placementCount; i++) {
    const client = activeClients[i % activeClients.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const placementDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    placements.push({
      id: `placement_${client.id}_${i}`,
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      participantId: client.participantId,
      program: client.program,
      caseManager: client.caseManager,
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      placementDate: placementDate.toISOString(),
      status: placementStatuses[Math.floor(Math.random() * placementStatuses.length)],
      salaryRange: salaryRanges[Math.floor(Math.random() * salaryRanges.length)],
      hoursPerWeek: Math.floor(Math.random() * 20) + 20, // 20-40 hours
      startDate: new Date(placementDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `Placement ${Math.random() > 0.5 ? "successful" : "in progress"}. Client ${Math.random() > 0.5 ? "very satisfied" : "meeting expectations"} with position.`,
      phone: client.phone,
      clientStatus: client.status,
    })
  }

  return placements.sort((a, b) => new Date(b.placementDate).getTime() - new Date(a.placementDate).getTime())
}

export function JobsPlacementsReport({ onBack, clients }: JobsPlacementsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})

  const placements = useMemo(() => generateJobPlacementData(clients), [clients])

  const filterOptions = [
    {
      key: "status",
      label: "Placement Status",
      type: "select" as const,
      options: ["Placed", "Interview Scheduled", "Application Submitted", "Follow-up Required"],
      placeholder: "Select placement status",
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
      key: "placementDate",
      label: "Placement Date",
      type: "dateRange" as const,
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "dateRange" as const,
    },
    {
      key: "company",
      label: "Company",
      type: "text" as const,
      placeholder: "Enter company name",
    },
  ]

  const filteredPlacements = useMemo(() => {
    let filtered = placements

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (placement) =>
          placement.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          placement.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          placement.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          placement.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          placement.caseManager.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return

      if (key === "status" || key === "program" || key === "caseManager") {
        filtered = filtered.filter((placement) => placement[key as keyof typeof placement] === value)
      }

      if (key === "company") {
        filtered = filtered.filter((placement) => placement.company.toLowerCase().includes(value.toLowerCase()))
      }

      if (key === "placementDate_from") {
        filtered = filtered.filter((placement) => new Date(placement.placementDate) >= new Date(value))
      }

      if (key === "placementDate_to") {
        filtered = filtered.filter((placement) => new Date(placement.placementDate) <= new Date(value))
      }

      if (key === "startDate_from") {
        filtered = filtered.filter((placement) => new Date(placement.startDate) >= new Date(value))
      }

      if (key === "startDate_to") {
        filtered = filtered.filter((placement) => new Date(placement.startDate) <= new Date(value))
      }
    })

    return filtered
  }, [placements, searchTerm, filters])

  const handleExportToExcel = () => {
    const exportData = filteredPlacements.map((placement) => ({
      "Client Name": placement.clientName,
      "Participant ID": placement.participantId,
      "Job Title": placement.jobTitle,
      Company: placement.company,
      "Placement Date": formatDateForExport(placement.placementDate),
      "Start Date": formatDateForExport(placement.startDate),
      Status: placement.status,
      "Salary Range": placement.salaryRange,
      "Hours/Week": placement.hoursPerWeek,
      Program: placement.program,
      "Case Manager": placement.caseManager,
      Phone: placement.phone,
      Notes: placement.notes,
    }))

    const filename = `Job_Placements_Report_${new Date().toISOString().split("T")[0]}`
    exportToExcel(exportData, filename, "Job Placements")
  }

  const handleExportToPDF = () => {
    const pdfData = filteredPlacements.map((placement) => ({
      "Client Name": placement.clientName,
      "Participant ID": placement.participantId,
      "Job Title": placement.jobTitle,
      Company: placement.company,
      "Placement Date": placement.placementDate,
      Status: placement.status,
      Salary: placement.salaryRange,
      "Case Manager": placement.caseManager,
    }))

    const columns = [
      { key: "Client Name", label: "Client Name", width: "15%" },
      { key: "Participant ID", label: "PID", width: "10%" },
      { key: "Job Title", label: "Job Title", width: "15%" },
      { key: "Company", label: "Company", width: "15%" },
      { key: "Placement Date", label: "Placed", width: "10%" },
      { key: "Status", label: "Status", width: "12%" },
      { key: "Salary", label: "Salary", width: "10%" },
      { key: "Case Manager", label: "Case Manager", width: "13%" },
    ]

    exportToPDF(pdfData, "Job Placements Report", columns, filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-green-100 text-green-800"
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Application Submitted":
        return "bg-yellow-100 text-yellow-800"
      case "Follow-up Required":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate statistics
  const stats = {
    totalPlacements: placements.length,
    placed: placements.filter((p) => p.status === "Placed").length,
    interviews: placements.filter((p) => p.status === "Interview Scheduled").length,
    applications: placements.filter((p) => p.status === "Application Submitted").length,
    followUps: placements.filter((p) => p.status === "Follow-up Required").length,
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
            <h1 className="text-2xl font-bold text-gray-900">Jobs & Placements Report</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleExportToExcel} className="bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to Excel ({filteredPlacements.length})
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
              <div className="text-2xl font-bold text-gray-900">{stats.totalPlacements}</div>
              <div className="text-sm text-gray-600">Total Placements</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.placed}</div>
              <div className="text-sm text-gray-600">Placed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.interviews}</div>
              <div className="text-sm text-gray-600">Interviews</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.applications}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.followUps}</div>
              <div className="text-sm text-gray-600">Follow-ups</div>
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
                Job Placements ({filteredPlacements.length} of {placements.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search placements..."
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
                    <th className="text-left py-3 px-4">Client</th>
                    <th className="text-left py-3 px-4">Job Details</th>
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Placement Date</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">Compensation</th>
                    <th className="text-left py-3 px-4">Case Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlacements.map((placement) => (
                    <tr key={placement.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{placement.clientName}</p>
                          <p className="text-sm text-gray-600">PID: {placement.participantId}</p>
                          <p className="text-sm text-gray-600">{placement.program}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{placement.jobTitle}</p>
                          <p className="text-sm text-gray-600">{placement.hoursPerWeek} hrs/week</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{placement.company}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(placement.status)}`}
                        >
                          {placement.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(placement.placementDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm">{new Date(placement.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-sm font-medium">{placement.salaryRange}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{placement.caseManager}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPlacements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No job placements match the current filters. Try adjusting your search criteria.
              </div>
            )}

            {/* Export Summary */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-purple-900">Export Summary</h3>
                  <p className="text-xs text-purple-700">
                    Ready to export {filteredPlacements.length} job placement records
                    {Object.keys(filters).length > 0 && " (filters applied)"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExportToExcel} size="sm" className="bg-green-600 hover:bg-green-700">
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
