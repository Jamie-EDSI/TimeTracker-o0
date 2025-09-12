"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Download, FileText, Filter, Eye, Users, Calendar } from "lucide-react"
import { exportToExcel } from "../lib/excel-export"
import { exportToPDF } from "../lib/pdf-export"

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

interface ActiveClientsReportProps {
  onBack: () => void
  clients: Client[]
  onViewClient: (client: Client) => void
}

export function ActiveClientsReport({ onBack, clients, onViewClient }: ActiveClientsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [selectedCaseManager, setSelectedCaseManager] = useState("all")
  const [isExporting, setIsExporting] = useState(false)

  // Filter only active clients
  const activeClients = clients.filter((client) => client.status === "Active")

  // Apply additional filters
  const filteredClients = activeClients.filter((client) => {
    const matchesSearch =
      searchTerm === "" ||
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)

    const matchesProgram = selectedProgram === "all" || client.program === selectedProgram
    const matchesCaseManager = selectedCaseManager === "all" || client.caseManager === selectedCaseManager

    return matchesSearch && matchesProgram && matchesCaseManager
  })

  // Get unique programs and case managers for filter dropdowns
  const programs = [...new Set(activeClients.map((client) => client.program))].sort()
  const caseManagers = [...new Set(activeClients.map((client) => client.caseManager))].sort()

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      await exportToExcel(filteredClients, "Active_Clients_Report")
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(filteredClients, "Active Clients Report", "active-clients")
    } catch (error) {
      console.error("PDF export failed:", error)
      alert("PDF export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Active Clients Report</h1>
              <p className="text-gray-600">
                {filteredClients.length} of {activeClients.length} active clients
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              disabled={isExporting || filteredClients.length === 0}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Excel"}
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              disabled={isExporting || filteredClients.length === 0}
              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export PDF"}
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
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Programs</p>
                  <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Case Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{caseManagers.length}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients..."
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

              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedProgram("all")
                  setSelectedCaseManager("all")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Clients ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active clients found matching your criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Participant ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Case Manager</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Enrollment Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{client.participantId}</td>
                        <td className="py-3 px-4">{client.program}</td>
                        <td className="py-3 px-4">{client.caseManager}</td>
                        <td className="py-3 px-4">{new Date(client.enrollmentDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{getStatusBadge(client.status)}</td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => onViewClient(client)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
