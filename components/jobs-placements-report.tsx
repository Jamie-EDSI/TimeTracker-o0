"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Download,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Building,
  TrendingUp,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
}

interface JobsPlacementsReportProps {
  onBack: () => void
  onViewClient: (clientId: string) => void
  clients: Client[]
}

// Mock job placement data
const mockJobPlacements = [
  {
    id: "1",
    clientId: "2",
    clientName: "Johnson, Sarah",
    participantId: "2965145",
    program: "EARN",
    employerName: "ABC Manufacturing",
    jobTitle: "Production Assistant",
    industry: "Manufacturing",
    placementDate: "2024-01-10",
    hourlyWage: 16.5,
    hoursPerWeek: 40,
    placementType: "Full-time",
    evfEligible: true,
    evfAmount: 2500,
    retention30Day: "Retained",
    retention90Day: "Retained",
    retention180Day: "Pending",
    caseManager: "Brown, Lisa",
    status: "Active",
  },
  {
    id: "2",
    clientId: "3",
    clientName: "Wilson, Robert",
    participantId: "2965146",
    program: "Ex-Offender",
    employerName: "City Logistics",
    jobTitle: "Warehouse Associate",
    industry: "Transportation & Logistics",
    placementDate: "2024-01-08",
    hourlyWage: 15.0,
    hoursPerWeek: 35,
    placementType: "Full-time",
    evfEligible: true,
    evfAmount: 2000,
    retention30Day: "Retained",
    retention90Day: "Retained",
    retention180Day: "Retained",
    caseManager: "Davis, Jennifer",
    status: "Active",
  },
  {
    id: "3",
    clientId: "5",
    clientName: "Miller, James",
    participantId: "2965148",
    program: "Job Readiness",
    employerName: "Green Valley Restaurant",
    jobTitle: "Kitchen Assistant",
    industry: "Food Service",
    placementDate: "2023-12-15",
    hourlyWage: 14.0,
    hoursPerWeek: 30,
    placementType: "Part-time",
    evfEligible: false,
    evfAmount: 0,
    retention30Day: "Retained",
    retention90Day: "Not Retained",
    retention180Day: "Not Retained",
    caseManager: "Garcia, Maria",
    status: "Terminated",
  },
  {
    id: "4",
    clientId: "6",
    clientName: "Garcia, Lisa",
    participantId: "2965149",
    program: "EARN",
    employerName: "TechStart Solutions",
    jobTitle: "Data Entry Clerk",
    industry: "Technology",
    placementDate: "2024-01-05",
    hourlyWage: 18.0,
    hoursPerWeek: 40,
    placementType: "Full-time",
    evfEligible: true,
    evfAmount: 3000,
    retention30Day: "Retained",
    retention90Day: "Pending",
    retention180Day: "Pending",
    caseManager: "White, Kevin",
    status: "Active",
  },
  {
    id: "5",
    clientId: "4",
    clientName: "Brown, Emily",
    participantId: "2965147",
    program: "YOUTH",
    employerName: "Local Retail Store",
    jobTitle: "Sales Associate",
    industry: "Retail",
    placementDate: "2023-11-20",
    hourlyWage: 13.5,
    hoursPerWeek: 25,
    placementType: "Part-time",
    evfEligible: false,
    evfAmount: 0,
    retention30Day: "Retained",
    retention90Day: "Retained",
    retention180Day: "Retained",
    caseManager: "Miller, Robert",
    status: "Active",
  },
]

export function JobsPlacementsReport({ onBack, onViewClient, clients }: JobsPlacementsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgram, setFilterProgram] = useState("all")
  const [filterIndustry, setFilterIndustry] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterEVF, setFilterEVF] = useState("all")

  const filteredPlacements = mockJobPlacements.filter((placement) => {
    const matchesSearch =
      placement.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.participantId.includes(searchTerm) ||
      placement.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgram = filterProgram === "all" || placement.program === filterProgram
    const matchesIndustry = filterIndustry === "all" || placement.industry === filterIndustry
    const matchesStatus = filterStatus === "all" || placement.status === filterStatus
    const matchesEVF =
      filterEVF === "all" || (filterEVF === "eligible" ? placement.evfEligible : !placement.evfEligible)

    return matchesSearch && matchesProgram && matchesIndustry && matchesStatus && matchesEVF
  })

  const getRetentionIcon = (status: string) => {
    switch (status) {
      case "Retained":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Not Retained":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalEVFAmount = filteredPlacements.reduce((sum, placement) => sum + placement.evfAmount, 0)
  const averageWage =
    filteredPlacements.length > 0
      ? filteredPlacements.reduce((sum, placement) => sum + placement.hourlyWage, 0) / filteredPlacements.length
      : 0

  const exportToCSV = () => {
    const headers = [
      "Client Name",
      "Participant ID",
      "Program",
      "Employer",
      "Job Title",
      "Industry",
      "Placement Date",
      "Hourly Wage",
      "Hours/Week",
      "Placement Type",
      "EVF Eligible",
      "EVF Amount",
      "30-Day Retention",
      "90-Day Retention",
      "180-Day Retention",
      "Status",
      "Case Manager",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredPlacements.map((placement) =>
        [
          `"${placement.clientName}"`,
          placement.participantId,
          `"${placement.program}"`,
          `"${placement.employerName}"`,
          `"${placement.jobTitle}"`,
          `"${placement.industry}"`,
          placement.placementDate,
          placement.hourlyWage,
          placement.hoursPerWeek,
          `"${placement.placementType}"`,
          placement.evfEligible ? "Yes" : "No",
          placement.evfAmount,
          `"${placement.retention30Day}"`,
          `"${placement.retention90Day}"`,
          `"${placement.retention180Day}"`,
          `"${placement.status}"`,
          `"${placement.caseManager}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `jobs-placements-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-purple-600" />
              Jobs/Placements Report
            </h1>
          </div>
          <Button onClick={exportToCSV} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Placements</p>
                  <p className="text-2xl font-bold">{filteredPlacements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total EVF Amount</p>
                  <p className="text-2xl font-bold">${totalEVFAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Wage</p>
                  <p className="text-2xl font-bold">${averageWage.toFixed(2)}/hr</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Placements</p>
                  <p className="text-2xl font-bold">{filteredPlacements.filter((p) => p.status === "Active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search clients, employers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="program-filter">Program</Label>
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                    <SelectItem value="EARN">EARN</SelectItem>
                    <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                    <SelectItem value="YOUTH">YOUTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry-filter">Industry</Label>
                <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Transportation & Logistics">Transportation & Logistics</SelectItem>
                    <SelectItem value="Food Service">Food Service</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="evf-filter">EVF Eligibility</Label>
                <Select value={filterEVF} onValueChange={setFilterEVF}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="eligible">EVF Eligible</SelectItem>
                    <SelectItem value="not-eligible">Not EVF Eligible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterProgram("all")
                    setFilterIndustry("all")
                    setFilterStatus("all")
                    setFilterEVF("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Placements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Placement Details ({filteredPlacements.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Employer & Position</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Placement Date</TableHead>
                    <TableHead>Wage & Hours</TableHead>
                    <TableHead>EVF</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlacements.map((placement) => (
                    <TableRow key={placement.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{placement.clientName}</div>
                          <div className="text-sm text-gray-500">PID: {placement.participantId}</div>
                          <div className="text-sm text-gray-500">{placement.program}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            {placement.employerName}
                          </div>
                          <div className="text-sm text-gray-600">{placement.jobTitle}</div>
                          <div className="text-sm text-gray-500">{placement.placementType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{placement.industry}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {placement.placementDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />${placement.hourlyWage}/hr
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {placement.hoursPerWeek}hrs/week
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {placement.evfEligible ? (
                            <div>
                              <Badge className="bg-green-100 text-green-800 mb-1">Eligible</Badge>
                              <div className="text-sm font-medium">${placement.evfAmount.toLocaleString()}</div>
                            </div>
                          ) : (
                            <Badge variant="secondary">Not Eligible</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            {getRetentionIcon(placement.retention30Day)}
                            <span>30d: {placement.retention30Day}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {getRetentionIcon(placement.retention90Day)}
                            <span>90d: {placement.retention90Day}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {getRetentionIcon(placement.retention180Day)}
                            <span>180d: {placement.retention180Day}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(placement.status)}>{placement.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClient(placement.clientId)}
                          className="hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPlacements.length === 0 && (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No job placements found</p>
                <p className="text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
