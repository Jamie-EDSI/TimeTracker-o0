"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  UserPlus,
  Search,
  FileText,
  Calendar,
  Phone,
  Briefcase,
  BarChart3,
  Clock,
  Home,
  ChevronDown,
} from "lucide-react"
import { ClientProfile } from "./client-profile"
import { NewClientForm } from "./new-client-form"
import { ActiveClientsReport } from "./active-clients-report"
import { CallLogReport } from "./call-log-report"
import { JobsPlacementsReport } from "./jobs-placements-report"

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
}

const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return ""
  }
  if (typeof value === "object") {
    return JSON.stringify(value)
  }
  return String(value)
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "client-profile" | "new-client" | "active-clients" | "call-log" | "jobs-placements"
  >("dashboard")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchName, setSearchName] = useState("")
  const [searchParticipantId, setSearchParticipantId] = useState("")
  const [searchSSN, setSearchSSN] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("25")
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      participantId: "2965145",
      program: "EARN",
      status: "Active",
      enrollmentDate: "2023-02-20",
      phone: "484-555-0201",
      email: "sarah.johnson@email.com",
      address: "456 Oak Ave",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19102",
      dateOfBirth: "1990-07-15",
      emergencyContact: "Mike Johnson",
      emergencyPhone: "484-555-0203",
      caseManager: "Brown, Lisa",
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Davis",
      participantId: "2965146",
      program: "Job Readiness",
      status: "Active",
      enrollmentDate: "2023-03-15",
      phone: "215-555-0102",
      email: "michael.davis@email.com",
      address: "789 Pine St",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19103",
      dateOfBirth: "1985-12-03",
      emergencyContact: "Jennifer Davis",
      emergencyPhone: "215-555-0104",
      caseManager: "Smith, John",
    },
    {
      id: "3",
      firstName: "Emily",
      lastName: "Rodriguez",
      participantId: "2965147",
      program: "YOUTH",
      status: "Pending",
      enrollmentDate: "2023-04-01",
      phone: "267-555-0301",
      email: "emily.rodriguez@email.com",
      address: "321 Maple Dr",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19104",
      dateOfBirth: "2001-09-22",
      emergencyContact: "Carlos Rodriguez",
      emergencyPhone: "267-555-0302",
      caseManager: "Johnson, Mary",
    },
  ])

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setCurrentView("client-profile")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedClient(null)
  }

  const handleSaveClient = (updatedClient: Client) => {
    setClients((prevClients) => prevClients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
    setSelectedClient(updatedClient)
  }

  const handleClientCreated = (clientData: any) => {
    try {
      const newClient: Client = {
        id: Date.now().toString(),
        firstName: safeString(clientData.firstName),
        lastName: safeString(clientData.lastName),
        participantId: safeString(clientData.participantId),
        program: safeString(clientData.program),
        status: safeString(clientData.status),
        enrollmentDate: safeString(clientData.enrollmentDate),
        phone: safeString(clientData.phone),
        cellPhone: safeString(clientData.cellPhone),
        email: safeString(clientData.email),
        address: safeString(clientData.address),
        city: safeString(clientData.city),
        state: safeString(clientData.state),
        zipCode: safeString(clientData.zipCode),
        dateOfBirth: safeString(clientData.dateOfBirth),
        emergencyContact: safeString(clientData.emergencyContact),
        emergencyPhone: safeString(clientData.emergencyPhone),
        caseManager: safeString(clientData.caseManager),
        responsibleEC: safeString(clientData.responsibleEC),
        requiredHours: safeString(clientData.requiredHours),
        caoNumber: safeString(clientData.caoNumber),
        isNew: true,
      }

      setClients((prevClients) => [newClient, ...prevClients])
      setCurrentView("dashboard")
    } catch (error) {
      console.error("Error creating client:", error)
      setCurrentView("dashboard")
    }
  }

  const activeClients = clients.filter((client) => client.status === "Active")
  const pendingActions = clients.filter((client) => client.status === "Pending")

  if (currentView === "client-profile" && selectedClient) {
    return <ClientProfile client={selectedClient} onBack={handleBackToDashboard} onSave={handleSaveClient} />
  }

  if (currentView === "new-client") {
    return <NewClientForm onClientCreated={handleClientCreated} onCancel={handleBackToDashboard} />
  }

  if (currentView === "active-clients") {
    return <ActiveClientsReport onBack={handleBackToDashboard} />
  }

  if (currentView === "call-log") {
    return <CallLogReport onBack={handleBackToDashboard} />
  }

  if (currentView === "jobs-placements") {
    return <JobsPlacementsReport onBack={handleBackToDashboard} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">TimeTracker</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-900">Data Staff Desktop</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-blue-600">
            <Home className="w-4 h-4" />
            <span className="text-sm">Show the Desktop</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">Dashboard</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Reports */}
          <div className="col-span-3 space-y-4">
            {/* Active Client Report */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">{activeClients.length}</div>
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle className="text-sm text-blue-700">Active Today</CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-orange-600">{pendingActions.length}</div>
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <CardTitle className="text-sm text-orange-700">Pending Actions</CardTitle>
              </CardHeader>
            </Card>

            {/* Active Client Report Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Client Report
                </CardTitle>
                <p className="text-xs text-blue-600">Comprehensive overview of all currently active clients</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => setCurrentView("active-clients")}
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Call Log Report Card */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Log Report
                </CardTitle>
                <p className="text-xs text-green-600">Recent case notes and communications</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => setCurrentView("call-log")}
                  variant="outline"
                  size="sm"
                  className="w-full text-green-600 border-green-300 hover:bg-green-100"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Jobs/Placements Report Card */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Jobs/Placements Report
                </CardTitle>
                <p className="text-xs text-purple-600">Employment placements and EVF tracking</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => setCurrentView("jobs-placements")}
                  variant="outline"
                  size="sm"
                  className="w-full text-purple-600 border-purple-300 hover:bg-purple-100"
                >
                  View Report →
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Clients</span>
                  <span className="font-medium">{clients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Programs</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-green-600">+23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Placements</span>
                  <span className="font-medium text-blue-600">156</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Content */}
          <div className="col-span-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <div className="text-sm text-gray-600">Total Clients</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{activeClients.length}</div>
                  <div className="text-sm text-gray-600">Active Today</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{pendingActions.length}</div>
                  <div className="text-sm text-gray-600">Pending Actions</div>
                </CardContent>
              </Card>
            </div>

            {/* Create New Client Button */}
            <div className="text-center">
              <Button
                onClick={() => setCurrentView("new-client")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create New Client
              </Button>
            </div>

            {/* Search Client Directory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Client Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                  <Input
                    placeholder="Enter client name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participant Id:</label>
                  <Input
                    placeholder="Enter participant ID"
                    value={searchParticipantId}
                    onChange={(e) => setSearchParticipantId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SSN (Last 4):</label>
                  <Input
                    placeholder="Last 4 digits"
                    value={searchSSN}
                    onChange={(e) => setSearchSSN(e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Records/Page:</label>
                  <Input value={recordsPerPage} onChange={(e) => setRecordsPerPage(e.target.value)} className="w-20" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Quick Reports - moved to top */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setCurrentView("active-clients")}
                  variant="outline"
                  className="w-full justify-start text-blue-600"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Active Clients
                </Button>
                <Button
                  onClick={() => setCurrentView("call-log")}
                  variant="outline"
                  className="w-full justify-start text-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Logs
                </Button>
                <Button
                  onClick={() => setCurrentView("jobs-placements")}
                  variant="outline"
                  className="w-full justify-start text-purple-600"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Placements
                </Button>
              </CardContent>
            </Card>

            {/* Client Directory - moved to middle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Directory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  View My Clients →
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <UserPlus className="w-4 h-4 mr-2" />
                  New Client
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity - remains at bottom */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Today, 2:30 PM</p>
                      <p className="font-medium">New client enrollment: Sarah Johnson</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Today, 1:15 PM</p>
                      <p className="font-medium">Case note added for Michael Davis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Today, 11:45 AM</p>
                      <p className="font-medium">Employment placement: Robert Wilson</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
