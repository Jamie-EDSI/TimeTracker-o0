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
  TrendingUp,
} from "lucide-react"
import { NewClientForm } from "./new-client-form"
import { ClientManagement } from "./client-management"
import { ActiveClientsReport } from "./active-clients-report"
import { CallLogReport } from "./call-log-report"
import { JobsPlacementsReport } from "./jobs-placements-report"

// Mock data for clients
const initialMockClients = [
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
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    createdBy: "System Admin",
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
    createdAt: "2023-02-20T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    createdBy: "System Admin",
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
    createdAt: "2023-03-10T11:30:00Z",
    updatedAt: "2024-01-13T13:20:00Z",
    createdBy: "System Admin",
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
    createdAt: "2023-04-05T14:20:00Z",
    updatedAt: "2024-01-12T10:15:00Z",
    createdBy: "System Admin",
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
    createdAt: "2023-05-15T08:45:00Z",
    updatedAt: "2024-01-11T15:30:00Z",
    createdBy: "System Admin",
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
    createdAt: "2023-06-01T12:00:00Z",
    updatedAt: "2024-01-10T17:45:00Z",
    createdBy: "System Admin",
  },
]

export function Dashboard() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "newClient" | "clientManagement" | "activeClientsReport" | "callLogReport" | "jobsPlacementsReport"
  >("dashboard")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof initialMockClients>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [clients, setClients] = useState(initialMockClients)
  const [recentlyAddedClientId, setRecentlyAddedClientId] = useState<string | null>(null)

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results = clients.filter(
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
    console.log("Navigating to client:", clientId)
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
    // Clear the recently added client highlight after returning to dashboard
    if (recentlyAddedClientId) {
      setTimeout(() => setRecentlyAddedClientId(null), 5000)
    }
  }

  const transformNewClientToStandardFormat = (newClientData: any) => {
    // Transform the new client form data to match the standard client format
    return {
      id: newClientData.id,
      firstName: newClientData.personal?.firstName || newClientData.firstName,
      lastName: newClientData.personal?.lastName || newClientData.lastName,
      participantId: newClientData.participantId,
      program: newClientData.program?.program || newClientData.program,
      status: newClientData.personal?.status || newClientData.status || "Active",
      enrollmentDate: newClientData.program?.enrollmentDate || newClientData.enrollmentDate,
      phone: newClientData.contact?.phone || newClientData.phone,
      cellPhone: newClientData.contact?.phone || newClientData.cellPhone || newClientData.phone,
      email: newClientData.contact?.email || newClientData.email,
      address: newClientData.contact?.address || newClientData.address || "",
      city: newClientData.contact?.city || newClientData.city || "",
      state: newClientData.contact?.state || newClientData.state || "",
      zipCode: newClientData.contact?.zipCode || newClientData.zipCode || "",
      dateOfBirth: newClientData.personal?.dateOfBirth || newClientData.dateOfBirth,
      ssn: newClientData.personal?.ssn || newClientData.ssn,
      emergencyContact: newClientData.contact?.emergencyContactName || newClientData.emergencyContact || "",
      emergencyPhone: newClientData.contact?.emergencyContactPhone || newClientData.emergencyPhone || "",
      caseManager: newClientData.program?.caseManager || newClientData.caseManager,
      responsibleEC: newClientData.responsibleEC || "Current User",
      requiredHours: newClientData.employment?.hoursPerWeek || newClientData.requiredHours || "40",
      caoNumber: newClientData.caoNumber || "",
      createdAt: newClientData.createdAt,
      updatedAt: newClientData.updatedAt,
      createdBy: newClientData.createdBy,
      // Additional fields for comprehensive data
      gender: newClientData.personal?.gender,
      ethnicity: newClientData.personal?.ethnicity,
      race: newClientData.personal?.race,
      veteranStatus: newClientData.personal?.veteranStatus,
      disabilityStatus: newClientData.personal?.disabilityStatus,
      employment: newClientData.employment,
      additional: newClientData.additional,
    }
  }

  const handleClientCreated = (newClient: any) => {
    console.log("New client created:", newClient)

    // Transform the new client data to match the standard format
    const standardizedClient = transformNewClientToStandardFormat(newClient)

    // Add the new client to the beginning of the clients list (most recent first)
    setClients((prevClients) => {
      const updatedClients = [standardizedClient, ...prevClients]
      console.log("Updated clients list:", updatedClients)
      return updatedClients
    })

    // Set the recently added client ID for highlighting
    setRecentlyAddedClientId(newClient.id)

    // Show success message in console (in real app, this might be a toast notification)
    console.log(
      `Client ${standardizedClient.firstName} ${standardizedClient.lastName} successfully added to active client list`,
    )

    // Optionally navigate to the new client's record
    setSelectedClientId(newClient.id)
    setCurrentView("clientManagement")
  }

  const handleUpdateClients = (updatedClients: any[]) => {
    setClients(updatedClients)
  }

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Inactive</Badge>
    }
  }

  // Calculate real-time statistics
  const activeClientsCount = clients.filter((c) => c.status === "Active").length
  const totalClientsCount = clients.length

  if (currentView === "newClient") {
    return <NewClientForm onClose={handleBackToDashboard} onClientCreated={handleClientCreated} />
  }

  if (currentView === "clientManagement") {
    return (
      <ClientManagement
        onBack={handleBackToDashboard}
        clients={clients}
        onUpdateClients={handleUpdateClients}
        selectedClientId={selectedClientId}
      />
    )
  }

  if (currentView === "activeClientsReport") {
    return <ActiveClientsReport onBack={handleBackToDashboard} onViewClient={handleViewClient} clients={clients} />
  }

  if (currentView === "callLogReport") {
    return <CallLogReport onBack={handleBackToDashboard} onViewClient={handleViewClient} clients={clients} />
  }

  if (currentView === "jobsPlacementsReport") {
    return <JobsPlacementsReport onBack={handleBackToDashboard} onViewClient={handleViewClient} clients={clients} />
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
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Success notification for recently added client */}
        {recentlyAddedClientId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Client Successfully Added!</p>
                <p className="text-green-700 text-sm">
                  The new client has been added to your active client list and is now available in all reports.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Cards with matching colors and Quick Stats */}
          <div className="space-y-4">
            {/* Statistics Cards - Smaller with real-time data */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-blue-50 border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-blue-600">{activeClientsCount}</p>
                      <p className="text-xs text-blue-600">Active Today</p>
                    </div>
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-l-4 border-l-orange-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-orange-600">43</p>
                      <p className="text-xs text-orange-600">Pending Actions</p>
                    </div>
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Clients Report - Larger fonts */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-600 text-base">
                  <Users className="w-4 h-4" />
                  Active Client Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-blue-600 mb-2 text-sm">
                  Comprehensive overview of all {activeClientsCount} currently active clients
                </p>
                <Button
                  onClick={() => setCurrentView("activeClientsReport")}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-100 text-sm py-2"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Call Log Report - Larger fonts */}
            <Card className="border-l-4 border-l-green-500 bg-green-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-600 text-base">
                  <Phone className="w-4 h-4" />
                  Call Log Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-green-600 mb-2 text-sm">Recent case notes and communications</p>
                <Button
                  onClick={() => setCurrentView("callLogReport")}
                  variant="outline"
                  size="sm"
                  className="w-full border-green-300 text-green-600 hover:bg-green-100 text-sm py-2"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Jobs/Placements Report - Larger fonts */}
            <Card className="border-l-4 border-l-purple-500 bg-purple-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-600 text-base">
                  <Briefcase className="w-4 h-4" />
                  Jobs/Placements Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-purple-600 mb-2 text-sm">Employment placements and EVF tracking</p>
                <Button
                  onClick={() => setCurrentView("jobsPlacementsReport")}
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-100 text-sm py-2"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats Card - Updated with real-time data */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Total Clients</span>
                    <Badge variant="secondary" className="text-xs">
                      {totalClientsCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Active Programs</span>
                    <Badge variant="secondary" className="text-xs">
                      {[...new Set(clients.map((c) => c.program))].length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">This Month</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      +
                      {
                        clients.filter((c) => {
                          const createdDate = new Date(c.createdAt || c.enrollmentDate)
                          const thisMonth = new Date()
                          return (
                            createdDate.getMonth() === thisMonth.getMonth() &&
                            createdDate.getFullYear() === thisMonth.getFullYear()
                          )
                        }).length
                      }
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Placements</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">156</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Statistics Cards Above Search */}
          <div className="space-y-6">
            {/* Statistics Cards - Updated with real-time data */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{totalClientsCount}</div>
                  <div className="text-sm text-gray-600">Total Clients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{activeClientsCount}</div>
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

            {/* Create New Client Button - Positioned above Search */}
            <div className="flex justify-center">
              <Button
                onClick={() => setCurrentView("newClient")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create New Client
              </Button>
            </div>

            {/* Search Section - Now Below Create Button */}
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
                        <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-500 border-b pb-2">
                          <div>Name</div>
                          <div>Status</div>
                          <div>PID</div>
                          <div>Program</div>
                          <div>Actions</div>
                        </div>
                        {searchResults.map((client) => (
                          <div
                            key={client.id}
                            className={`grid grid-cols-6 gap-2 text-sm items-center py-2 border-b ${
                              client.id === recentlyAddedClientId ? "bg-green-50 border-green-200" : ""
                            }`}
                          >
                            <button
                              onClick={() => handleViewClient(client.id)}
                              className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {client.lastName}, {client.firstName}
                              {client.id === recentlyAddedClientId && (
                                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">New</Badge>
                              )}
                            </button>
                            <div>{getStatusBadge(client.status)}</div>
                            <div>{client.participantId}</div>
                            <div>{client.program}</div>
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
                  View My Clients ({totalClientsCount}) →
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
                  className="w-full justify-start hover:bg-blue-50 text-blue-600"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Active Clients ({activeClientsCount})
                </Button>
                <Button
                  onClick={() => setCurrentView("callLogReport")}
                  variant="ghost"
                  className="w-full justify-start hover:bg-green-50 text-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Logs
                </Button>
                <Button
                  onClick={() => setCurrentView("jobsPlacementsReport")}
                  variant="ghost"
                  className="w-full justify-start hover:bg-purple-50 text-purple-600"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Placements
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity - Updated to show recent client additions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clients
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || b.enrollmentDate).getTime() -
                      new Date(a.createdAt || a.enrollmentDate).getTime(),
                  )
                  .slice(0, 3)
                  .map((client, index) => (
                    <div key={client.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(client.createdAt || client.enrollmentDate).toLocaleDateString()}
                        </span>
                        {client.id === recentlyAddedClientId && (
                          <Badge className="bg-green-100 text-green-800 text-xs">New</Badge>
                        )}
                      </div>
                      <p>
                        {index === 0 && client.id === recentlyAddedClientId
                          ? "New client created: "
                          : "Client enrollment: "}
                        {client.firstName} {client.lastName}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
