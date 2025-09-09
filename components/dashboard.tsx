"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  Home,
  Users,
  UserPlus,
  Search,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Settings,
  Activity,
  Eye,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { NewClientForm } from "./new-client-form"
import { ClientManagement } from "./client-management"
import { ActiveClientsReport } from "./active-clients-report"
import { NavigationCard } from "./navigation-card"
import { InteractiveButton } from "./interactive-button"

// Mock client data for search functionality
const initialMockClientDatabase = [
  {
    id: "1",
    participantId: "2965142",
    firstName: "Brian",
    lastName: "Allen",
    fullName: "Allen, Brian",
    ssn: "1293",
    phone: "215-207-4497",
    email: "brianallen0488@gmail.com",
    program: "Next Step Program",
    status: "Active",
    lastActivity: "2024-01-15",
    enrollmentDate: "2023-08-27",
    caseManager: "Chester, District - 01",
  },
  {
    id: "2",
    participantId: "2965143",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Johnson, Sarah",
    ssn: "4567",
    phone: "484-555-0123",
    email: "sarah.johnson@email.com",
    program: "Career Development",
    status: "Active",
    lastActivity: "2024-01-14",
    enrollmentDate: "2023-09-15",
    caseManager: "Smith, District - 02",
  },
  {
    id: "3",
    participantId: "2965144",
    firstName: "Michael",
    lastName: "Davis",
    fullName: "Davis, Michael",
    ssn: "7890",
    phone: "610-555-0456",
    email: "m.davis@email.com",
    program: "Job Readiness",
    status: "Inactive",
    lastActivity: "2024-01-10",
    enrollmentDate: "2023-07-20",
    caseManager: "Johnson, District - 01",
  },
  {
    id: "4",
    participantId: "2753853",
    firstName: "Eric",
    lastName: "Alexander",
    fullName: "Alexander, Eric",
    ssn: "5678",
    phone: "484-555-0101",
    email: "eric.alexander@email.com",
    program: "Ex-Offender",
    status: "Active",
    lastActivity: "2024-01-16",
    enrollmentDate: "2023-02-15",
    caseManager: "Lewis, Jillian",
  },
  {
    id: "5",
    participantId: "6429415",
    firstName: "Heavyn",
    lastName: "Anderson",
    fullName: "Anderson, Heavyn",
    ssn: "9012",
    phone: "484-555-0103",
    email: "heavyn.anderson@email.com",
    program: "EARN",
    status: "Active",
    lastActivity: "2024-01-17",
    enrollmentDate: "2024-09-17",
    caseManager: "Chester, District",
  },
  {
    id: "6",
    participantId: "2643103",
    firstName: "Dayshon",
    lastName: "Andrews",
    fullName: "Andrews, Dayshon",
    ssn: "3456",
    phone: "484-555-0105",
    email: "dayshon.andrews@email.com",
    program: "EARN",
    status: "Active",
    lastActivity: "2024-01-18",
    enrollmentDate: "2024-07-18",
    caseManager: "Chester, District",
  },
]

export function Dashboard() {
  const [searchForm, setSearchForm] = useState({
    name: "",
    participantId: "",
    ssn: "",
    recordsPerPage: "10",
  })

  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [showClientManagement, setShowClientManagement] = useState(false)
  const [showActiveClientsReport, setShowActiveClientsReport] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [mockClientDatabase, setMockClientDatabase] = useState(initialMockClientDatabase)
  const [recentlyCreatedClient, setRecentlyCreatedClient] = useState<any>(null)
  const [showClientCreatedNotification, setShowClientCreatedNotification] = useState(false)

  // Real-time search results based on form inputs
  const searchResults = useMemo(() => {
    const hasSearchTerms = searchForm.name.trim() || searchForm.participantId.trim() || searchForm.ssn.trim()

    if (!hasSearchTerms) {
      return []
    }

    return mockClientDatabase.filter((client) => {
      const nameMatch = searchForm.name.trim()
        ? client.fullName.toLowerCase().includes(searchForm.name.toLowerCase()) ||
          client.firstName.toLowerCase().includes(searchForm.name.toLowerCase()) ||
          client.lastName.toLowerCase().includes(searchForm.name.toLowerCase())
        : true

      const pidMatch = searchForm.participantId.trim() ? client.participantId.includes(searchForm.participantId) : true

      const ssnMatch = searchForm.ssn.trim() ? client.ssn.includes(searchForm.ssn) : true

      return nameMatch && pidMatch && ssnMatch
    })
  }, [searchForm.name, searchForm.participantId, searchForm.ssn, mockClientDatabase])

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchPerformed(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSearching(false)
    setShowSearchResults(true)
  }

  const handleClearSearch = () => {
    setSearchForm({
      name: "",
      participantId: "",
      ssn: "",
      recordsPerPage: searchForm.recordsPerPage,
    })
    setShowSearchResults(false)
    setSearchPerformed(false)
  }

  const handleViewClient = (clientId: string) => {
    console.log("Viewing client:", clientId)
    // Navigate to client profile - in a real app, this would route to the client detail page
    setShowClientManagement(true)
  }

  const handleNewClientSave = (clientData: any) => {
    console.log("New client created:", clientData)

    // Add the new client to our mock database
    setMockClientDatabase((prev) => [clientData, ...prev])

    // Set recently created client for notification
    setRecentlyCreatedClient(clientData)
    setShowClientCreatedNotification(true)

    // Close the form
    setShowNewClientForm(false)

    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowClientCreatedNotification(false)
      setRecentlyCreatedClient(null)
    }, 5000)
  }

  // Check if search has any terms
  const hasSearchTerms = searchForm.name.trim() || searchForm.participantId.trim() || searchForm.ssn.trim()

  // Paginate results
  const recordsPerPage = Number.parseInt(searchForm.recordsPerPage)
  const paginatedResults = searchResults.slice(0, recordsPerPage)

  // Breadcrumb logic with dropdown options
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: "Dashboard",
        href: "#",
        isActive: false,
        dropdownItems: [
          { label: "Overview", icon: Home, action: () => console.log("Navigate to overview") },
          { label: "Reports", icon: BarChart3, action: () => console.log("Navigate to reports") },
          { label: "Active Clients Report", icon: Users, action: () => setShowActiveClientsReport(true) },
          { label: "Recent Activities", icon: Activity, action: () => console.log("Navigate to activities") },
          { label: "System Settings", icon: Settings, action: () => console.log("Navigate to settings") },
        ],
      },
    ]

    if (showClientManagement) {
      breadcrumbs.push({
        label: "Client Management",
        href: "#",
        isActive: true,
        dropdownItems: [
          { label: "All Clients", icon: Users, action: () => console.log("Show all clients") },
          { label: "Active Clients", icon: Users, action: () => console.log("Show active clients") },
          { label: "Inactive Clients", icon: Users, action: () => console.log("Show inactive clients") },
          { label: "Client Reports", icon: BarChart3, action: () => console.log("Show client reports") },
        ],
      })
    } else if (showNewClientForm) {
      breadcrumbs.push({
        label: "Create New Client",
        href: "#",
        isActive: true,
        dropdownItems: [
          { label: "Client Form", icon: UserPlus, action: () => console.log("Client form") },
          { label: "Import Clients", icon: FileText, action: () => console.log("Import clients") },
          { label: "Client Templates", icon: FileText, action: () => console.log("Client templates") },
        ],
      })
    } else if (showActiveClientsReport) {
      breadcrumbs.push({
        label: "Active Clients Report",
        href: "#",
        isActive: true,
        dropdownItems: [
          { label: "Export Report", icon: FileText, action: () => console.log("Export report") },
          { label: "Print Report", icon: FileText, action: () => console.log("Print report") },
          { label: "Report Settings", icon: Settings, action: () => console.log("Report settings") },
        ],
      })
    } else {
      breadcrumbs[0].isActive = true
    }

    return breadcrumbs
  }

  if (showClientManagement) {
    return <ClientManagement onBack={() => setShowClientManagement(false)} />
  }

  if (showActiveClientsReport) {
    return <ActiveClientsReport onBack={() => setShowActiveClientsReport(false)} onViewClient={handleViewClient} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client Created Notification */}
      {showClientCreatedNotification && recentlyCreatedClient && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900">Client Created Successfully!</h4>
              <p className="text-sm text-green-700 mt-1">
                {recentlyCreatedClient.firstName} {recentlyCreatedClient.lastName} has been added to the system.
              </p>
              <p className="text-xs text-green-600 mt-1">PID: {recentlyCreatedClient.participantId}</p>
            </div>
            <button
              onClick={() => setShowClientCreatedNotification(false)}
              className="flex-shrink-0 text-green-400 hover:text-green-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        {/* Top row with logo and navigation */}
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left side - New EDSI Logo */}
          <div className="flex items-center">
            <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-12 w-auto" />
          </div>

          {/* Center - Application Selector */}
          <div className="flex-1 max-w-xs mx-8">
            <Select defaultValue="timetracker">
              <SelectTrigger>
                <SelectValue placeholder="Jump to Applications..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timetracker">TimeTracker</SelectItem>
                <SelectItem value="other">Other Applications...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right side - Title and Navigation */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/manage-account" className="text-blue-600 hover:underline">
                Manage Account
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/logout" className="text-blue-600 hover:underline">
                Log Out
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/help" className="text-blue-600 hover:underline">
                Help
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/about" className="text-blue-600 hover:underline">
                About
              </Link>
            </div>
          </div>
        </div>

        {/* Second row with Show Desktop button aligned to left */}
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Show the Desktop
            </Button>
          </div>
        </div>

        {/* Breadcrumb Navigation with Dropdowns */}
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((breadcrumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
                {breadcrumb.isActive ? (
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                    {breadcrumb.dropdownItems && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {breadcrumb.dropdownItems.map((item, itemIndex) => (
                            <DropdownMenuItem key={itemIndex} onClick={item.action} className="cursor-pointer">
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        if (breadcrumb.label === "Dashboard") {
                          setShowClientManagement(false)
                          setShowNewClientForm(false)
                          setShowActiveClientsReport(false)
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {breadcrumb.label}
                    </button>
                    {breadcrumb.dropdownItems && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {breadcrumb.dropdownItems.map((item, itemIndex) => (
                            <DropdownMenuItem key={itemIndex} onClick={item.action} className="cursor-pointer">
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-6 p-6">
        {/* Left Sidebar - Reports */}
        <div className="w-80 space-y-4">
          {/* Unapproved Terminations */}
          <NavigationCard
            title="Unapproved Terminations"
            description="36 unapproved terminations need review"
            icon={AlertTriangle}
            variant="warning"
            onClick={() => console.log("Navigate to Unapproved Terminations Report")}
          />

          {/* Active Clients Report */}
          <NavigationCard
            title="Active Clients Report"
            description="View comprehensive client data"
            icon={Users}
            variant="success"
            onClick={() => setShowActiveClientsReport(true)}
          />
        </div>

        {/* Center Content */}
        <div className="flex-1 space-y-6">
          {/* Prominent Create New Client Button */}
          <div className="flex justify-center">
            <InteractiveButton
              variant="primary"
              size="lg"
              icon={UserPlus}
              onClick={() => setShowNewClientForm(true)}
              className="px-8 py-4"
            >
              Create New Client
            </InteractiveButton>
          </div>

          {/* Search Results Section */}
          {(showSearchResults || (hasSearchTerms && searchResults.length > 0)) && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Results
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No clients found matching your search criteria.</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search terms or clearing the search to start over.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-blue-800">
                        Found {searchResults.length} client{searchResults.length !== 1 ? "s" : ""}
                        {paginatedResults.length < searchResults.length &&
                          ` (showing first ${paginatedResults.length})`}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">PID</TableHead>
                            <TableHead className="font-semibold">Program</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedResults.map((client) => (
                            <TableRow key={client.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{client.fullName}</TableCell>
                              <TableCell>{client.participantId}</TableCell>
                              <TableCell>{client.program}</TableCell>
                              <TableCell>
                                <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                                  {client.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewClient(client.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => console.log("Navigate to Total Clients")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold">{mockClientDatabase.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => console.log("Navigate to Active Today")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => console.log("Navigate to Pending Actions")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Actions</p>
                    <p className="text-2xl font-bold">43</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Client Directory */}
        <div className="w-80">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-800 bg-gray-200 px-3 py-1 rounded">
                Client Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Action Buttons - Stacked vertically */}
              <div className="space-y-3 mb-4">
                <Button
                  size="lg"
                  className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  onClick={() => setShowClientManagement(true)}
                >
                  <Users className="w-5 h-5" />
                  View My Clients
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  onClick={() => setShowNewClientForm(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  New Client
                </Button>
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Search Client Directory</h3>
                  {hasSearchTerms && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      <Search className="w-3 h-3" />
                      {searchResults.length} found
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name:
                    </Label>
                    <Input
                      id="name"
                      value={searchForm.name}
                      onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                      className="mt-1"
                      placeholder="Enter first or last name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="participantId" className="text-sm font-medium">
                      Participant Id:
                    </Label>
                    <Input
                      id="participantId"
                      value={searchForm.participantId}
                      onChange={(e) => setSearchForm({ ...searchForm, participantId: e.target.value })}
                      className="mt-1"
                      placeholder="Enter participant ID"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ssn" className="text-sm font-medium">
                      SSN (Last 4):
                    </Label>
                    <Input
                      id="ssn"
                      value={searchForm.ssn}
                      onChange={(e) => setSearchForm({ ...searchForm, ssn: e.target.value })}
                      maxLength={4}
                      className="mt-1"
                      placeholder="Last 4 digits"
                    />
                  </div>

                  <div>
                    <Label htmlFor="records" className="text-sm font-medium">
                      Records/Page:
                    </Label>
                    <Select
                      value={searchForm.recordsPerPage}
                      onValueChange={(value) => setSearchForm({ ...searchForm, recordsPerPage: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="flex-1" disabled={!hasSearchTerms || isSearching}>
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                    {hasSearchTerms && (
                      <Button variant="outline" size="sm" onClick={handleClearSearch} className="px-3 bg-transparent">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Real-time search feedback */}
                  {hasSearchTerms && !isSearching && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {searchResults.length === 0 ? (
                        <span className="text-orange-600">No matches found</span>
                      ) : (
                        <span className="text-green-600">
                          {searchResults.length} client{searchResults.length !== 1 ? "s" : ""} match
                          {searchResults.length === 1 ? "es" : ""} your criteria
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showNewClientForm && <NewClientForm onClose={() => setShowNewClientForm(false)} onSave={handleNewClientSave} />}
    </div>
  )
}
