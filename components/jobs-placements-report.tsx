"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, FileSpreadsheet, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterPanel } from "@/components/ui/filter-panel"
import { exportToExcel, formatDateForExport } from "@/lib/excel-export"
import { exportToPDF } from "@/lib/pdf-export"

interface JobsPlacementsReportProps {
  onBack: () => void
}

export function JobsPlacementsReport({ onBack }: JobsPlacementsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})

  const placements = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      participantId: "2965145",
      employer: "ABC Manufacturing",
      position: "Production Assistant",
      startDate: "2023-10-15",
      hourlyWage: "$16.50",
      status: "Active",
      hoursPerWeek: "40",
      caseManager: "Brown, Lisa",
      placementDate: "2023-10-10",
    },
    {
      id: "2",
      clientName: "Michael Davis",
      participantId: "2965146",
      employer: "Tech Solutions Inc",
      position: "Data Entry Clerk",
      startDate: "2023-09-20",
      hourlyWage: "$15.00",
      status: "Active",
      hoursPerWeek: "35",
      caseManager: "Smith, John",
      placementDate: "2023-09-15",
    },
    {
      id: "3",
      clientName: "Robert Wilson",
      participantId: "2965148",
      employer: "City Hospital",
      position: "Maintenance Assistant",
      startDate: "2023-11-01",
      hourlyWage: "$17.25",
      status: "Active",
      hoursPerWeek: "40",
      caseManager: "Johnson, Mary",
      placementDate: "2023-10-25",
    },
    {
      id: "4",
      clientName: "Emily Rodriguez",
      participantId: "2965147",
      employer: "Local Retail Store",
      position: "Sales Associate",
      startDate: "2023-08-15",
      hourlyWage: "$14.00",
      status: "Terminated",
      hoursPerWeek: "30",
      caseManager: "Johnson, Mary",
      placementDate: "2023-08-10",
    },
  ]

  const filterOptions = [
    {
      key: "employer",
      label: "Employer",
      type: "select" as const,
      options: ["ABC Manufacturing", "Tech Solutions Inc", "City Hospital", "Local Retail Store"],
      placeholder: "Select employer",
    },
    {
      key: "position",
      label: "Position Type",
      type: "text" as const,
      placeholder: "e.g., Assistant, Clerk",
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: ["Active", "Terminated", "On Hold"],
      placeholder: "Select status",
    },
    {
      key: "caseManager",
      label: "Case Manager",
      type: "select" as const,
      options: ["Brown, Lisa", "Smith, John", "Johnson, Mary"],
      placeholder: "Select case manager",
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "dateRange" as const,
    },
    {
      key: "wageRange",
      label: "Wage Range",
      type: "select" as const,
      options: ["$10-$15", "$15-$20", "$20+"],
      placeholder: "Select wage range",
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
          placement.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          placement.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          placement.caseManager.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return

      if (key === "employer" || key === "status" || key === "caseManager") {
        filtered = filtered.filter((placement) => placement[key as keyof typeof placement] === value)
      }

      if (key === "position") {
        filtered = filtered.filter((placement) => placement.position.toLowerCase().includes(value.toLowerCase()))
      }

      if (key === "wageRange") {
        filtered = filtered.filter((placement) => {
          const wage = Number.parseFloat(placement.hourlyWage.replace("$", ""))
          switch (value) {
            case "$10-$15":
              return wage >= 10 && wage <= 15
            case "$15-$20":
              return wage > 15 && wage <= 20
            case "$20+":
              return wage > 20
            default:
              return true
          }
        })
      }

      if (key === "startDate_from") {
        filtered = filtered.filter((placement) => new Date(placement.startDate) >= new Date(value))
      }

      if (key === "startDate_to") {
        filtered = filtered.filter((placement) => new Date(placement.startDate) <= new Date(value))
      }
    })

    return filtered
  }, [searchTerm, filters])

  const handleExportToExcel = () => {
    const exportData = filteredPlacements.map((placement) => ({
      "Client Name": placement.clientName,
      "Participant ID": placement.participantId,
      Employer: placement.employer,
      Position: placement.position,
      "Start Date": formatDateForExport(placement.startDate),
      "Hourly Wage": placement.hourlyWage,
      "Hours Per Week": placement.hoursPerWeek,
      Status: placement.status,
      "Case Manager": placement.caseManager,
      "Placement Date": formatDateForExport(placement.placementDate),
    }))

    const filename = `Jobs_Placements_Report_Filtered_${new Date().toISOString().split("T")[0]}`
    exportToExcel(exportData, filename, "Job Placements")
  }

  const handleExportToPDF = () => {
    const pdfData = filteredPlacements.map((placement) => ({
      "Client Name": placement.clientName,
      "Participant ID": placement.participantId,
      Employer: placement.employer,
      Position: placement.position,
      "Start Date": placement.startDate,
      "Hourly Wage": placement.hourlyWage,
      Status: placement.status,
    }))

    const columns = [
      { key: "Client Name", label: "Client Name", width: "18%" },
      { key: "Participant ID", label: "PID", width: "12%" },
      { key: "Employer", label: "Employer", width: "20%" },
      { key: "Position", label: "Position", width: "18%" },
      { key: "Start Date", label: "Start Date", width: "12%" },
      { key: "Hourly Wage", label: "Wage", width: "10%" },
      { key: "Status", label: "Status", width: "10%" },
    ]

    exportToPDF(pdfData, "Jobs & Placements Report", columns, filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
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
                    <th className="text-left py-3 px-4">Client Name</th>
                    <th className="text-left py-3 px-4">Participant ID</th>
                    <th className="text-left py-3 px-4">Employer</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">Hourly Wage</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlacements.map((placement) => (
                    <tr key={placement.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{placement.clientName}</td>
                      <td className="py-3 px-4 font-mono">{placement.participantId}</td>
                      <td className="py-3 px-4">{placement.employer}</td>
                      <td className="py-3 px-4">{placement.position}</td>
                      <td className="py-3 px-4">{new Date(placement.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{placement.hourlyWage}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            placement.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {placement.status}
                        </span>
                      </td>
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
                    Ready to export {filteredPlacements.length} filtered job placement records
                    {Object.keys(filters).length > 0 && " (filters applied)"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExportToExcel} size="sm" className="bg-purple-600 hover:bg-purple-700">
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
