"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Download, FileText, Filter, Phone, Calendar, Clock, MessageSquare } from "lucide-react"

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

export function CallLogReport({ onBack, clients }: CallLogReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [selectedCaseManager, setSelectedCaseManager] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Generate call log entries from case notes
  const callLogs = clients
    .flatMap((client) =>
      (client.caseNotes || []).map((note) => ({
        id: note.id,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        participantId: client.participantId,
        program: client.program,
        caseManager: client.caseManager,
        note: note.note,
        date: note.date,
        author: note.author,
        phone: client.phone,
        status: client.status,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Apply filters
  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.note.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgram = selectedProgram === "all" || log.program === selectedProgram
    const matchesCaseManager = selectedCaseManager === "all" || log.caseManager === selectedCaseManager

    let matchesDate = true
    if (dateFilter !== "all") {
      const logDate = new Date(log.date)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0
          break
        case "week":
          matchesDate = daysDiff <= 7
          break
        case "month":
          matchesDate = daysDiff <= 30
          break
      }
    }

    return matchesSearch && matchesProgram && matchesCaseManager && matchesDate
  })

  // Get unique values for filters
  const programs = [...new Set(clients.map((client) => client.program))].sort()
  const caseManagers = [...new Set(clients.map((client) => client.caseManager))].sort()

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Call Log Report</h1>
              <p className="text-gray-600">{filteredLogs.length} communication records</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Communications</p>
                  <p className="text-2xl font-bold text-gray-900">{callLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      callLogs.filter((log) => {
                        const logDate = new Date(log.date)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return logDate >= weekAgo
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      callLogs.filter((log) => {
                        const logDate = new Date(log.date)
                        const today = new Date()
                        return logDate.toDateString() === today.toDateString()
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(callLogs.filter((log) => log.status === "Active").map((log) => log.clientId)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search communications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Programs</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>

              <select
                value={selectedCaseManager}
                onChange={(e) => setSelectedCaseManager(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Case Managers</option>
                {caseManagers.map((manager) => (
                  <option key={manager} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedProgram("all")
                  setSelectedCaseManager("all")
                  setDateFilter("all")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Log ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No communication records found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{log.clientName}</h3>
                          {getStatusBadge(log.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          PID: {log.participantId} • {log.program} • {log.phone}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{new Date(log.date).toLocaleDateString()}</div>
                        <div>{new Date(log.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3 mb-2">
                      <p className="text-sm text-gray-700">{log.note}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Case Manager: {log.caseManager}</span>
                      <span>Logged by: {log.author}</span>
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
