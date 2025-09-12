"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, FileSpreadsheet, FileText, Phone } from "lucide-react"
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

interface CallLogReportProps {
  onBack: () => void
  clients: Client[]
}

// Generate sample call log data
const generateCallLogData = (clients: Client[]) => {
  const callTypes = ["Outbound", "Inbound", "Missed"]
  const callReasons = [
    "Follow-up appointment",
    "Job placement update",
    "Document verification",
    "Program enrollment",
    "Case management check-in",
    "Employment verification",
    "Training reminder",
    "Benefits consultation",
  ]

  const callLogs = []

  clients.forEach((client) => {
    // Generate 2-5 call logs per client
    const numCalls = Math.floor(Math.random() * 4) + 2

    for (let i = 0; i < numCalls; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const callDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      callLogs.push({
        id: `call_${client.id}_${i}`,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        participantId: client.participantId,
        program: client.program,
        caseManager: client.caseManager,
        callDate: callDate.toISOString(),
        callType: callTypes[Math.floor(Math.random() * callTypes.length)],
        duration: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
        reason: callReasons[Math.floor(Math.random() * callReasons.length)],
        notes: `Call completed successfully. Client was ${Math.random() > 0.5 ? "responsive and engaged" : "cooperative and provided necessary information"}.`,
        phone: client.phone,
        status: client.status,
      })
    }
  })

  return callLogs.sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime())
}

export function CallLogReport({ onBack, clients }: CallLogReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})

  const callLogs = useMemo(() => generateCallLogData(clients), [clients])

  const filterOptions = [
    {
      key: "callType",
      label: "Call Type",
      type: "select" as const,
      options: ["Outbound", "Inbound", "Missed"],
      placeholder: "Select call type",
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
      key: "callDate",
      label: "Call Date",
      type: "dateRange" as const,
    },
    {
      key: "status",
      label: "Client Status",
      type: "select" as const,
      options: ["Active", "Inactive", "Pending"],
      placeholder: "Select status",
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
          log.caseManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.notes.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return

      if (key === "callType" || key === "program" || key === "caseManager" || key === "status") {
        filtered = filtered.filter((log) => log[key as keyof typeof log] === value)
      }

      if (key === "callDate_from") {
        filtered = filtered.filter((log) => new Date(log.callDate) >= new Date(value))
      }

      if (key === "callDate_to") {
        filtered = filtered.filter((log) => new Date(log.callDate) <= new Date(value))
      }
    })

    return filtered
  }, [callLogs, searchTerm, filters])

  const handleExportToExcel = () => {
    const exportData = filteredCallLogs.map((log) => ({
      "Client Name": log.clientName,
      "Participant ID": log.participantId,
      "Call Date": formatDateForExport(log.callDate),
      "Call Type": log.callType,
      "Duration (min)": log.duration,
      Program: log.program,
      "Case Manager": log.caseManager,
      Reason: log.reason,
      Phone: log.phone,
      Status: log.status,
      Notes: log.notes,
    }))

    const filename = `Call_Log_Report_${new Date().toISOString().split("T")[0]}`
    exportToExcel(exportData, filename, "Call Log")
  }

  const handleExportToPDF = () => {
    const pdfData = filteredCallLogs.map((log) => ({
      "Client Name": log.clientName,
      "Participant ID": log.participantId,
      "Call Date": log.callDate,
      "Call Type": log.callType,
      Duration: `${log.duration} min`,
      Reason: log.reason,
      "Case Manager": log.caseManager,
    }))

    const columns = [
      { key: "Client Name", label: "Client Name", width: "18%" },
      { key: "Participant ID", label: "PID", width: "10%" },
      { key: "Call Date", label: "Date", width: "12%" },
      { key: "Call Type", label: "Type", width: "10%" },
      { key: "Duration", label: "Duration", width: "10%" },
      { key: "Reason", label: "Reason", width: "25%" },
      { key: "Case Manager", label: "Case Manager", width: "15%" },
    ]

    exportToPDF(pdfData, "Call Log Report", columns, filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
  }

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case "Outbound":
        return "bg-blue-100 text-blue-800"
      case "Inbound":
        return "bg-green-100 text-green-800"
      case "Missed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate statistics
  const stats = {
    totalCalls: callLogs.length,
    outbound: callLogs.filter((c) => c.callType === "Outbound").length,
    inbound: callLogs.filter((c) => c.callType === "Inbound").length,
    missed: callLogs.filter((c) => c.callType === "Missed").length,
    avgDuration: Math.round(callLogs.reduce((sum, c) => sum + c.duration, 0) / callLogs.length),
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
        {/* Statistics Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
              <div className="text-sm text-gray-600">Total Calls</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.outbound}</div>
              <div className="text-sm text-gray-600">Outbound</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.inbound}</div>
              <div className="text-sm text-gray-600">Inbound</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.missed}</div>
              <div className="text-sm text-gray-600">Missed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.avgDuration}</div>
              <div className="text-sm text-gray-600">Avg Duration (min)</div>
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
                Call Log History ({filteredCallLogs.length} of {callLogs.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search call logs..."
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
                    <th className="text-left py-3 px-4">Call Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Reason</th>
                    <th className="text-left py-3 px-4">Case Manager</th>
                    <th className="text-left py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCallLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{log.clientName}</p>
                          <p className="text-sm text-gray-600">PID: {log.participantId}</p>
                          <p className="text-sm text-gray-600">{log.program}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{new Date(log.callDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.callDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCallTypeColor(log.callType)}`}
                        >
                          {log.callType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{log.duration} min</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{log.reason}</td>
                      <td className="py-3 px-4 text-sm">{log.caseManager}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{log.notes}</td>
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
                    Ready to export {filteredCallLogs.length} call log records
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
