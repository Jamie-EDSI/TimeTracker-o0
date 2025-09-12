"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  Filter,
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react"

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

interface JobsPlacementsReportProps {
  onBack: () => void
  clients: Client[]
}

// Mock job placement data - in a real app, this would come from the database
const mockPlacements = [
  {
    id: "1",
    clientId: "1",
    clientName: "Sarah Johnson",
    participantId: "2965145",
    program: "EARN",
    jobTitle: "Administrative Assistant",
    employer: "ABC Corporation",
    startDate: "2023-10-15",
    hourlyWage: 18.5,
    hoursPerWeek: 40,
    placementType: "Full-time",
    status: "Active",
    caseManager: "Brown, Lisa",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Michael Davis",
    participantId: "2965146",
    program: "Job Readiness",
    jobTitle: "Warehouse Associate",
    employer: "XYZ Logistics",
    startDate: "2023-11-01",
    hourlyWage: 16.0,
    hoursPerWeek: 40,
    placementType: "Full-time",
    status: "Active",
    caseManager: "Smith, John",
  },
  {
    id: "3",
    clientId: "1",
    clientName: "Sarah Johnson",
    participantId: "2965145",
    program: "EARN",
    jobTitle: "Retail Associate",
    employer: "Local Store",
    startDate: "2023-08-01",
    hourlyWage: 15.0,
    hoursPerWeek: 25,
    placementType: "Part-time",
    status: "Completed",
    caseManager: "Brown, Lisa",
  },
]

export function JobsPlacementsReport({ onBack, clients }: JobsPlacementsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCaseManager, setSelectedCaseManager] = useState("all")

  // Apply filters
  const filteredPlacements = mockPlacements.filter((placement) => {
    const matchesSearch =
      searchTerm === "" ||
      placement.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.employer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgram = selectedProgram === "all" || placement.program === selectedProgram
    const matchesStatus = selectedStatus === "all" || placement.status === selectedStatus
    const matchesCaseManager = selectedCaseManager === "all" || placement.caseManager === selectedCaseManager

    return matchesSearch && matchesProgram && matchesStatus && matchesCaseManager
  })

  // Get unique values for filters
  const programs = [...new Set(mockPlacements.map((p) => p.program))].sort()
  const statuses = [...new Set(mockPlacements.map((p) => p.status))].sort()
  const caseManagers = [...new Set(mockPlacements.map((p) => p.caseManager))].sort()

  // Calculate statistics
  const totalPlacements = mockPlacements.length
  const activePlacements = mockPlacements.filter((p) => p.status === "Active").length
  const averageWage = mockPlacements.reduce((sum, p) => sum + p.hourlyWage, 0) / mockPlacements.length
  const totalClients = new Set(mockPlacements.map((p) => p.clientId)).size

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "terminated":
        return <Badge className="bg-red-100 text-red-800">Terminated</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPlacementTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return <Badge className="bg-purple-100 text-purple-800">Full-time</Badge>
      case "part-time":
        return <Badge className="bg-orange-100 text-orange-800">Part-time</Badge>
      case "temporary":
        return <Badge className="bg-yellow-100 text-yellow-800">Temporary</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
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
              <h1 className="text-2xl font-bold text-gray-900">Jobs & Placements Report</h1>
              <p className="text-gray-600">{filteredPlacements.length} job placements</p>
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
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Placements</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPlacements}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Placements</p>
                  <p className="text-2xl font-bold text-gray-900">{activePlacements}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Wage</p>
                  <p className="text-2xl font-bold text-gray-900">${averageWage.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients Placed</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
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
                  placeholder="Search placements..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                  setSelectedStatus("all")
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
            <CardTitle>Job Placements ({filteredPlacements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPlacements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No job placements found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Job Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Employer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Wage</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Hours/Week</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlacements.map((placement) => (
                      <tr key={placement.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{placement.clientName}</p>
                            <p className="text-sm text-gray-500">PID: {placement.participantId}</p>
                            <p className="text-sm text-gray-500">{placement.program}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{placement.jobTitle}</td>
                        <td className="py-3 px-4">{placement.employer}</td>
                        <td className="py-3 px-4">{new Date(placement.startDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-mono">${placement.hourlyWage.toFixed(2)}/hr</td>
                        <td className="py-3 px-4">{placement.hoursPerWeek}</td>
                        <td className="py-3 px-4">{getPlacementTypeBadge(placement.placementType)}</td>
                        <td className="py-3 px-4">{getStatusBadge(placement.status)}</td>
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
