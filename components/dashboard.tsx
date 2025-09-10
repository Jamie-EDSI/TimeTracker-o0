"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Clock,
  FileText,
  Search,
  ChevronDown,
  Eye,
  UserPlus,
  BarChart3,
  Phone,
  Briefcase,
  Activity,
  Calendar,
  CheckCircle,
} from "lucide-react"
import { NewClientForm } from "./new-client-form"
import { ClientManagement } from "./client-management"
import { ActiveClientsReport } from "./active-clients-report"
import { CallLogReport } from "./call-log-report"
import { JobsPlacementsReport } from "./jobs-placements-report"

// Mock data for clients
const mockClients = [
  {
    id: "1",
    firstName: "Michael",
    lastName: "Davis",
    participantId: "2965144",
    program: "Job Readiness",
    status: "Inactive",
    enrollmentDate: "2023-01-15",
    phone: "484-555-0101",
    cellPhone: "484-555-0102",
    email: "michael.davis@email.com",
    address: "123 Main St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19101",
    dateOfBirth: "1985-03-20",
    ssn: "***-**-1234",
    emergencyContact: "Jane Davis",
    emergencyPhone: "484-555-0103",
    caseManager: "Smith, John",
    responsibleEC: "Johnson, Sarah",
    requiredHours: "40",
    caoNumber: "CAO123456",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    participantId: "2965145",
    program: "EARN",
    status: "Active",
    enrollmentDate: "2023-02-20",
    phone: "484-555-0201",
    cellPhone: "484-555-0202",
    email: "sarah.johnson@email.com",
    address: "456 Oak Ave",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19102",
    dateOfBirth: "1990-07-15",
    ssn: "***-**-5678",
    emergencyContact: "Mike Johnson",
    emergencyPhone: "484-555-0203",
    caseManager: "Brown, Lisa",
    responsibleEC: "Wilson, David",
    requiredHours: "35",
    caoNumber: "CAO123457",
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Wilson",
    participantId: "2965146",
    program: "Ex-Offender",
    status: "Active",
    enrollmentDate: "2023-03-10",
    phone: "484-555-0301",
    cellPhone: "484-555-0302",
    email: "robert.wilson@email.com",
    address: "789 Pine St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19103",
    dateOfBirth: "1988-11-30",
    ssn: "***-**-9012",
    emergencyContact: "Mary Wilson",
    emergencyPhone: "484-555-0303",
    caseManager: "Davis, Jennifer",
    responsibleEC: "Taylor, Michael",
    requiredHours: "30",
    caoNumber: "CAO123458",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Brown",
    participantId: "2965147",
    program: "YOUTH",
    status: "Active",
    enrollmentDate: "2023-04-05",
    phone: "484-555-0401",
    cellPhone: "484-555-0402",
    email: "emily.brown@email.com",
    address: "321 Elm Dr",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19104",
    dateOfBirth: "2001-05-12",
    ssn: "***-**-3456",
    emergencyContact: "Tom Brown",
    emergencyPhone: "484-555-0403",
    caseManager: "Miller, Robert",
    responsibleEC: "Anderson, Lisa",
    requiredHours: "25",
    caoNumber: "CAO123459",
  },
  {
    id: "5",
    firstName: "James",
    lastName: "Miller",
    participantId: "2965148",
    program: "Job Readiness",
    status: "Active",
    enrollmentDate: "2023-05-15",
    phone: "484-555-0501",
    cellPhone: "484-555-0502",
    email: "james.miller@email.com",
    address: "654 Maple Ave",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19105",
    dateOfBirth: "1992-09-08",
    ssn: "***-**-7890",
    emergencyContact: "Susan Miller",
    emergencyPhone: "484-555-0503",
    caseManager: "Garcia, Maria",
    responsibleEC: "Thompson, James",
    requiredHours: "40",
    caoNumber: "CAO123460",
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Garcia",
    participantId: "2965149",
    program: "EARN",
    status: "Active",
    enrollmentDate: "2023-06-01",
    phone: "484-555-0601",
    cellPhone: "484-555-0602",
    email: "lisa.garcia@email.com",
    address: "987 Cedar St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19106",
    dateOfBirth: "1987-12-25",
    ssn: "***-**-2468",
    emergencyContact: "Carlos Garcia",
    emergencyPhone: "484-555-0603",
    caseManager: "White, Kevin",
    responsibleEC: "Martinez, Ana",
    requiredHours: "35",
    caoNumber: "CAO123461",
  },
]

export function Dashboard() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "newClient" | "clientManagement" | "activeClientsReport" | "callLogReport" | "jobsPlacementsReport"
  >("dashboard")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockClients>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results = mockClients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.participantId.includes(searchTerm) ||
        client.program.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId)
    setCurrentView("clientManagement")
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedClientId(null)
    clearSearch()
  }

  if (currentView === "newClient") {
    return <NewClientForm onBack={handleBackToDashboard} />
  }

  if (currentView === "clientManagement") {
    return <ClientManagement onBack={handleBackToDashboard} clients={mockClients} selectedClientId={selectedClientId} />
  }

  if (currentView === "activeClientsReport") {
    return <ActiveClientsReport onBack={handleBackToDashboard} onViewClient={handleViewClient} clients={mockClients} />
  }

  if (currentView === "callLogReport") {
    return <CallLogReport onBack={handleBackToDashboard} onViewClient={handleViewClient} clients={mockClients} />
  }

  if (currentView === "jobsPlacementsReport") {
    return <JobsPlacementsReport onBack={handleBackToDashboard} onViewClient={handleViewClient} clients={mockClients} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Top row with logo and applications dropdown */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-12 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  TimeTracker
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-base font-semibold">Applications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer py-3">
                  <div className="flex items-center w-full">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium">TimeTracker</div>
                      <div className="text-xs text-gray-500">Current Application</div>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-sm font-medium text-gray-600">Reports</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => setCurrentView("activeClientsReport")} className="cursor-pointer py-2">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-lg mr-2">
                      <BarChart3 className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Active Client Report</div>
                      <div className="text-xs text-gray-500">Comprehensive overview of active clients</div>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setCurrentView("callLogReport")} className="cursor-pointer py-2">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-lg mr-2">
                      <Phone className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Call Log Report</div>
                      <div className="text-xs text-gray-500">Recent case notes for each client</div>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setCurrentView("jobsPlacementsReport")}
                  className="cursor-pointer py-2"
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded-lg mr-2">
                      <Briefcase className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Jobs/Placements Report</div>
                      <div className="text-xs text-gray-500">Employment placements and EVF data</div>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer py-2 text-gray-600">
                  <Activity className="w-4 h-4 mr-3" />
                  <span>Other Applications...</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
          </div>
        </div>

        {/* Second row with main navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              🏠 Show the Desktop
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Dashboard
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCurrentView("dashboard")}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Main Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView("activeClientsReport")}>
                  <Users className="w-4 h-4 mr-2" />
                  Active Clients Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView("callLogReport")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Log Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView("jobsPlacementsReport")}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs/Placements Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={() => setCurrentView("newClient")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            ✨ Create New Client
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Smaller Report Cards */}
          <div className="space-y-4">
            {/* Active Clients Report - Smaller */}
            <Card className="border-l-4 border-l-green-500 bg-green-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-800 text-base">
                  <Users className="w-4 h-4" />
                  Active Clients Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-green-700 mb-2 text-sm">View comprehensive client data</p>
                <Button
                  onClick={() => setCurrentView("activeClientsReport")}
                  variant="outline"
                  size="sm"
                  className="w-full border-green-300 text-green-700 hover:bg-green-100"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Call Log Report - Smaller */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-base">
                  <Phone className="w-4 h-4" />
                  Call Log Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-blue-700 mb-2 text-sm">Recent case notes and communications</p>
                <Button
                  onClick={() => setCurrentView("callLogReport")}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Jobs/Placements Report - Smaller */}
            <Card className="border-l-4 border-l-purple-500 bg-purple-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-800 text-base">
                  <Briefcase className="w-4 h-4" />
                  Jobs/Placements Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-purple-700 mb-2 text-sm">Employment placements and EVF tracking</p>
                <Button
                  onClick={() => setCurrentView("jobsPlacementsReport")}
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Statistics Cards Above Search */}
          <div className="space-y-6">
            {/* Statistics Cards - Moved Above Search */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">6</div>
                  <div className="text-sm text-gray-600">Total Clients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-600">Active Today</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">43</div>
                  <div className="text-sm text-gray-600">Pending Actions</div>
                </CardContent>
              </Card>
            </div>

            {/* Search Section - Now Below Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {showSearchResults ? "Search Results" : "Search Client Directory"}
                  {showSearchResults && (
                    <Button variant="ghost" size="sm" onClick={clearSearch} className="ml-auto text-blue-600">
                      Clear
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showSearchResults && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="search-name">Name:</Label>
                        <Input
                          id="search-name"
                          placeholder="Enter client name"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        />
                      </div>
                      <div>
                        <Label htmlFor="search-pid">Participant Id:</Label>
                        <Input id="search-pid" placeholder="Enter participant ID" />
                      </div>
                      <div>
                        <Label htmlFor="search-ssn">SSN (Last 4):</Label>
                        <Input id="search-ssn" placeholder="Last 4 digits" maxLength={4} />
                      </div>
                      <div>
                        <Label htmlFor="records-per-page">Records/Page:</Label>
                        <Input id="records-per-page" defaultValue="25" />
                      </div>
                    </div>
                    <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </>
                )}

                {showSearchResults && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Found {searchResults.length} client(s)</p>
                    {searchResults.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 border-b pb-2">
                          <div>Name</div>
                          <div>PID</div>
                          <div>Program</div>
                          <div>Status</div>
                          <div>Actions</div>
                        </div>
                        {searchResults.map((client) => (
                          <div key={client.id} className="grid grid-cols-5 gap-2 text-sm items-center py-2 border-b">
                            <button
                              onClick={() => handleViewClient(client.id)}
                              className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {client.lastName}, {client.firstName}
                            </button>
                            <div>{client.participantId}</div>
                            <div>{client.program}</div>
                            <div>
                              <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                                {client.status}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewClient(client.id)}
                              className="hover:bg-blue-50"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No clients found matching your search.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Client Directory */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Directory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setCurrentView("clientManagement")}
                  variant="outline"
                  className="w-full justify-start hover:bg-blue-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View My Clients →
                </Button>
                <Button
                  onClick={() => setCurrentView("newClient")}
                  variant="outline"
                  className="w-full justify-start hover:bg-green-50"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  New Client
                </Button>
              </CardContent>
            </Card>

            {/* Quick Reports Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setCurrentView("activeClientsReport")}
                  variant="ghost"
                  className="w-full justify-start hover:bg-blue-50 text-blue-700"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Active Clients
                </Button>
                <Button
                  onClick={() => setCurrentView("callLogReport")}
                  variant="ghost"
                  className="w-full justify-start hover:bg-green-50 text-green-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Logs
                </Button>
                <Button
                  onClick={() => setCurrentView("jobsPlacementsReport")}
                  variant="ghost"
                  className="w-full justify-start hover:bg-purple-50 text-purple-700"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Placements
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Today, 2:30 PM</span>
                  </div>
                  <p>New client enrollment: Sarah Johnson</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Today, 1:15 PM</span>
                  </div>
                  <p>Case note added for Michael Davis</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Today, 11:45 AM</span>
                  </div>
                  <p>Employment placement: Robert Wilson</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
