"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, FileSpreadsheet, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterPanel } from "@/components/ui/filter-panel"
import { exportToExcel, formatDateForExport } from "@/lib/excel-export"
import { exportToPDF } from "@/lib/pdf-export"

interface CallLogReportProps {
  onBack: () => void
}

export function CallLogReport({ onBack }: CallLogReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})

  const callLogs = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      participantId: "2965145",
      callDate: "2023-11-15",
      callTime: "2:30 PM",
      callType: "Outbound",
      duration: "15 min",
      outcome: "Successful contact",
      notes: "Discussed job placement opportunities and upcoming interview",
      caseManager: "Brown, Lisa",
    },
    {
      id: "2",
      clientName: "Michael Davis",
      participantId: "2965146",
      callDate: "2023-11-14",
      callTime: "1:15 PM",
      callType: "Inbound",
      duration: "8 min",
      outcome: "Information provided",
      notes: "Client requested program information and schedule update",
      caseManager: "Smith, John",
    },
    {
      id: "3",
      clientName: "Emily Rodriguez",
      participantId: "2965147",
      callDate: "2023-11-13",
      callTime: "10:45 AM",
      callType: "Outbound",
      duration: "12 min",
      outcome: "Follow-up scheduled",
      notes: "Discussed training progress and next steps",
      caseManager: "Johnson, Mary",
    },
    {
      id: "4",
      clientName: "Robert Wilson",
      participantId: "2965148",
      callDate: "2023-11-12",
      callTime: "3:20 PM",
      callType: "Inbound",
      duration: "5 min",
      outcome: "No answer",
      notes: "Left voicemail regarding appointment reminder",
      caseManager: "Brown, Lisa",
    },
  ]

  const filterOptions = [
    {
      key: "callType",
      label: "Call Type",
      type: "select" as const,
      options: ["Inbound", "Outbound"],
      placeholder: "Select call type",
    },
    {
      key: "outcome",
      label: "Outcome",
      type: "select" as const,
      options: ["Successful contact", "Information provided", "Follow-up scheduled", "No answer", "Voicemail left"],
      placeholder: "Select outcome",
    },
    {
      key: "caseManager",
      label: "Case Manager",
      type: "select" as const,
      options: ["Brown, Lisa", "Smith, John", "Johnson, Mary"],
      placeholder: "Select case manager",
    },
    {
      key: "callDate",
      label: "Call Date",
      type: "dateRange" as const,
    },
    {
      key: "duration",
      label: "Duration (minutes)",
      type: "text" as const,
      placeholder: "e.g., 15 min",
    },
  ]

  const filteredCallLogs = useMemo(() => {
    let filtered = callLogs

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.caseManager.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return

      if (key === "callType" || key === "outcome" || key === "caseManager") {
        filtered = filtered.filter((log) => log[key as keyof typeof log] === value)
      }

      if (key === "duration") {
        filtered = filtered.filter((log) => log.duration.toLowerCase().includes(value.toLowerCase()))
      }

      if (key === "callDate_from") {
        filtered = filtered.filter((log) => new Date(log.callDate) >= new Date(value))
      }

      if (key === "callDate_to") {
        filtered = filtered.filter((log) => new Date(log.callDate) <= new Date(value))
      }
    })

    return filtered
  }, [searchTerm, filters])

  const handleExportToExcel = () => {
    const exportData = filteredCallLogs.map((log) => ({
      "Client Name": log.clientName,
      "Participant ID": log.participantId,
      "Call Date": formatDateForExport(log.callDate),
      "Call Time": log.callTime,
      "Call Type": log.callType,
      Duration: log.duration,
      Outcome: log.outcome,
      "Case Manager": log.caseManager,
      Notes: log.notes,
    }))

    const filename = `Call_Log_Report_Filtered_${new Date().toISOString().split("T")[0]}`
    exportToExcel(exportData, filename, "Call Logs")
  }

  const handleExportToPDF = () => {
    const pdfData = filteredCallLogs.map((log) => ({
      "Client Name": log.clientName,
      "Participant ID": log.participantId,
      "Call Date": log.callDate,
      "Call Type": log.callType,
      Duration: log.duration,
      Outcome: log.outcome,
      Notes: log.notes.length > 50 ? log.notes.substring(0, 50) + "..." : log.notes,
    }))

    const columns = [
      { key: "Client Name", label: "Client Name", width: "18%" },
      { key: "Participant ID", label: "PID", width: "12%" },
      { key: "Call Date", label: "Date", width: "12%" },
      { key: "Call Type", label: "Type", width: "10%" },
      { key: "Duration", label: "Duration", width: "10%" },
      { key: "Outcome", label: "Outcome", width: "15%" },
      { key: "Notes", label: "Notes", width: "23%" },
    ]

    exportToPDF(pdfData, "Call Log Report", columns, filters)
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
            <h1 className="text-2xl font-bold text-gray-900">Call Log Report</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleExportToExcel} className="bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to Excel ({filteredCallLogs.length})
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
                Call Logs ({filteredCallLogs.length} of {callLogs.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search calls..."
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
                    <th className="text-left py-3 px-4">Call Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Outcome</th>
                    <th className="text-left py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCallLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{log.clientName}</td>
                      <td className="py-3 px-4 font-mono">{log.participantId}</td>
                      <td className="py-3 px-4">{new Date(log.callDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.callType === "Outbound" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {log.callType}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.duration}</td>
                      <td className="py-3 px-4">{log.outcome}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={log.notes}>
                        {log.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCallLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No call logs match the current filters. Try adjusting your search criteria.
              </div>
            )}

            {/* Export Summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-green-900">Export Summary</h3>
                  <p className="text-xs text-green-700">
                    Ready to export {filteredCallLogs.length} filtered call log records
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
