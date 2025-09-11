"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Eye,
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
  createdAt?: string
  lastContact?: string
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

// Simulated database operations
const saveClientToDatabase = async (client: Client): Promise<Client> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real application, this would make an API call to save to database
  console.log("Saving client to database:", client)

  // Return the client with database-generated fields
  return {
    ...client,
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
  }
}

const validateClientData = (clientData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Required field validation
  if (!clientData.firstName?.trim()) errors.push("First Name is required")
  if (!clientData.lastName?.trim()) errors.push("Last Name is required")
  if (!clientData.program?.trim()) errors.push("Program is required")

  // Email validation
  if (clientData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email.trim())) {
    errors.push("Please enter a valid email address")
  }

  // Phone validation
  if (clientData.phone?.trim() && !/^[\d\s\-$$$$]+$/.test(clientData.phone.trim())) {
    errors.push("Please enter a valid phone number")
  }

  // ZIP code validation
  if (clientData.zipCode?.trim() && !/^\d{5}(-\d{4})?$/.test(clientData.zipCode.trim())) {
    errors.push("Please enter a valid ZIP code")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "client-profile" | "new-client" | "active-clients" | "call-log" | "jobs-placements"
  >("dashboard")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [participantIdSearch, setParticipantIdSearch] = useState("")
  const [quickSearch, setQuickSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
      createdAt: "2023-02-20T10:00:00Z",
      lastContact: "2023-11-15T14:30:00Z",
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
      createdAt: "2023-03-15T09:00:00Z",
      lastContact: "2023-11-14T13:15:00Z",
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
      createdAt: "2023-04-01T11:00:00Z",
      lastContact: "2023-11-13T10:45:00Z",
    },
  ])

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setCurrentView("client-profile")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedClient(null)
  }

  const handleSaveClient = async (updatedClient: Client) => {
    try {
      setIsLoading(true)

      // Validate the updated client data
      const validation = validateClientData(updatedClient)
      if (!validation.isValid) {
        alert(`Validation errors:\n${validation.errors.join("\n")}`)
        return
      }

      // Save to database (simulated)
      const savedClient = await saveClientToDatabase(updatedClient)

      // Update local state
      setClients((prevClients) => prevClients.map((client) => (client.id === savedClient.id ? savedClient : client)))

      setSelectedClient(savedClient)
      setSuccessMessage(`Client ${savedClient.firstName} ${savedClient.lastName} has been successfully updated!`)
      setShowSuccessMessage(true)

      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    } catch (error) {
      console.error("Error updating client:", error)
      alert("There was an error updating the client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientCreated = async (clientData: any) => {
    try {
      setIsLoading(true)

      // Validate client data
      const validation = validateClientData(clientData)
      if (!validation.isValid) {
        alert(`Please correct the following errors:\n${validation.errors.join("\n")}`)
        return
      }

      // Create properly formatted client object
      const newClient: Client = {
        id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName: safeString(clientData.firstName).trim(),
        lastName: safeString(clientData.lastName).trim(),
        participantId: safeString(clientData.participantId),
        program: safeString(clientData.program),
        status: safeString(clientData.status) || "Active",
        enrollmentDate: safeString(clientData.enrollmentDate) || new Date().toISOString().split("T")[0],
        phone: safeString(clientData.phone).trim(),
        cellPhone: safeString(clientData.cellPhone).trim(),
        email: safeString(clientData.email).trim(),
        address: safeString(clientData.address).trim(),
        city: safeString(clientData.city).trim(),
        state: safeString(clientData.state).trim(),
        zipCode: safeString(clientData.zipCode).trim(),
        dateOfBirth: safeString(clientData.dateOfBirth),
        emergencyContact: safeString(clientData.emergencyContact).trim(),
        emergencyPhone: safeString(clientData.emergencyPhone).trim(),
        caseManager: safeString(clientData.caseManager).trim(),
        responsibleEC: safeString(clientData.responsibleEC).trim(),
        requiredHours: safeString(clientData.requiredHours).trim(),
        caoNumber: safeString(clientData.caoNumber).trim(),
        isNew: true,
      }

      // Save to database (simulated)
      const savedClient = await saveClientToDatabase(newClient)

      // Add to local state
      setClients((prevClients) => [savedClient, ...prevClients])

      // Clear search terms
      setParticipantIdSearch("")
      setQuickSearch("")

      // Show success message
      setSuccessMessage(
        `Client ${savedClient.firstName} ${savedClient.lastName} has been successfully created and added to the database! 
        Participant ID: ${savedClient.participantId}`,
      )
      setShowSuccessMessage(true)

      // Navigate back to dashboard
      setCurrentView("dashboard")

      // Clear success message after 7 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
        // Remove the "new" flag after showing success
        setClients((prevClients) =>
          prevClients.map((client) => (client.id === savedClient.id ? { ...client, isNew: false } : client)),
        )
      }, 7000)
    } catch (error) {
      console.error("Error creating client:", error)
      alert("There was an error creating the client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const activeClients = clients.filter((client) => client.status === "Active")
  const pendingActions = clients.filter((client) => client.status === "Pending")

  const getFilteredClients = () => {
    return clients.filter((client) => {
      if (quickSearch.trim()) {
        const searchLower = quickSearch.toLowerCase()
        return (
          `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchLower) ||
          client.participantId.toLowerCase().includes(searchLower) ||
          client.program.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.phone.toLowerCase().includes(searchLower) ||
          client.caseManager.toLowerCase().includes(searchLower)
        )
      }

      if (participantIdSearch.trim()) {
        return client.participantId.toLowerCase().includes(participantIdSearch.toLowerCase())
      }

      return false
    })
  }

  const filteredClients = quickSearch.trim() || participantIdSearch.trim() ? getFilteredClients() : []

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (currentView === "client-profile" && selectedClient) {
    return <ClientProfile client={selectedClient} onBack={handleBackToDashboard} onSave={handleSaveClient} />
  }

  if (currentView === "new-client") {
    return (
      <NewClientForm onClientCreated={handleClientCreated} onCancel={handleBackToDashboard} isLoading={isLoading} />
    )
  }

  if (currentView === "active-clients") {
    return <ActiveClientsReport onBack={handleBackToDashboard} clients={clients} onViewClient={handleViewClient} />
  }

  if (currentView === "call-log") {
    return <CallLogReport onBack={handleBackToDashboard} clients={clients} />
  }

  if (currentView === "jobs-placements") {
    return <JobsPlacementsReport onBack={handleBackToDashboard} clients={clients} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <div className="grid grid-cols-12 items-center">
            {/* Left - Logo */}
            <div className="col-span-3 flex justify-start">
              <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-10 w-auto" />
            </div>

            {/* Center - TimeTracker Title (aligned with Active Today position) */}
            <div className="col-span-6 flex justify-center">
              <div className="relative">
                {/* This div mimics the stats cards layout to align with Active Today */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div></div> {/* Empty space for Total Clients alignment */}
                  <div className="flex justify-center">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-wide whitespace-nowrap">TimeTracker</h1>
                  </div>
                  <div></div> {/* Empty space for Pending Actions alignment */}
                </div>
              </div>
            </div>

            {/* Right - Data Staff Desktop */}
            <div className="col-span-3 flex justify-end">
              <span className="text-sm font-medium text-gray-700">Data Staff Desktop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 01-1.414-1.414L10 11.414l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 whitespace-pre-line">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 01-1.414-1.414L10 11.414l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar - Dashboard text removed */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="grid grid-cols-12 items-center">
          {/* Left - Home Navigation */}
          <div className="col-span-3 flex justify-start">
            <div className="flex items-center gap-2 text-blue-600">
              <Home className="w-4 h-4" />
              <span className="text-sm">Show the Desktop</span>
            </div>
          </div>

          {/* Center - Empty space (Dashboard text removed) */}
          <div className="col-span-6 flex justify-center">{/* Dashboard title removed as requested */}</div>

          {/* Right - Empty space for balance */}
          <div className="col-span-3"></div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">Processing client data...</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Reports */}
          <div className="col-span-3">
            {/* Quick Stats */}
            <Card className="h-fit mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Clients</span>
                  <span className="font-medium">{clients.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Active Clients</span>
                  <span className="font-medium text-green-600">{activeClients.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Pending Actions</span>
                  <span className="font-medium text-orange-600">{pendingActions.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Active Programs</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-green-600">+{clients.filter((c) => c.isNew).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Placements</span>
                  <span className="font-medium text-blue-600">156</span>
                </div>
              </CardContent>
            </Card>

            {/* Report Cards - Elevated positioning */}
            <div className="space-y-4">
              {/* Active Client Report Card */}
              <Card className="bg-blue-50 border-blue-200 h-fit">
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
              <Card className="bg-green-50 border-green-200 h-fit">
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
              <Card className="bg-purple-50 border-purple-200 h-fit">
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
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-6">
            {/* Top Section - Stats Cards and Create Button */}
            <div className="space-y-6 mb-6">
              {/* Stats Cards - Reference point for alignment */}
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
                  disabled={isLoading}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : "Create New Client"}
                </Button>
              </div>
            </div>

            {/* Client Directory - Aligned with Active Client Report */}
            <div className="space-y-6">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Client Directory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Quick search clients..."
                      value={quickSearch}
                      onChange={(e) => setQuickSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Participant ID Search */}
                  <div className="relative">
                    <Input
                      placeholder="Search by Participant ID..."
                      value={participantIdSearch}
                      onChange={(e) => setParticipantIdSearch(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  {/* Search Results */}
                  {(quickSearch.trim() || participantIdSearch.trim()) && (
                    <div className="max-h-48 overflow-y-auto border rounded-md bg-gray-50">
                      {filteredClients.length > 0 ? (
                        <div className="p-2 space-y-2">
                          {filteredClients.slice(0, 5).map((client) => (
                            <div
                              key={client.id}
                              className={`flex items-center justify-between p-2 bg-white rounded border hover:bg-blue-50 cursor-pointer ${
                                client.isNew ? "ring-2 ring-green-200 bg-green-50" : ""
                              }`}
                              onClick={() => handleViewClient(client)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate">
                                    {client.firstName} {client.lastName}
                                  </p>
                                  {client.isNew && (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs animate-pulse">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  PID: {client.participantId} • {client.program}
                                </p>
                                <div className="flex items-center gap-2 mt-1">{getStatusBadge(client.status)}</div>
                              </div>
                              <Button size="sm" variant="ghost" className="ml-2">
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          {filteredClients.length > 5 && (
                            <div className="text-xs text-gray-500 text-center p-2">
                              Showing 5 of {filteredClients.length} results
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">No clients found</div>
                      )}
                    </div>
                  )}

                  {/* Directory Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        console.log("Viewing client list")
                      }}
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View My Clients →
                    </Button>
                    <Button
                      onClick={() => setCurrentView("new-client")}
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                      disabled={isLoading}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      New Client
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Overview */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Client Management System</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive client management with integrated reporting and database storage. All client data is
                    automatically synchronized across all features.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/50 rounded p-2">
                      <div className="font-medium text-blue-600">Database Integration</div>
                      <div className="text-gray-600">Secure & Reliable</div>
                    </div>
                    <div className="bg-white/50 rounded p-2">
                      <div className="font-medium text-green-600">Real-time Updates</div>
                      <div className="text-gray-600">Instant Sync</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Quick Reports */}
            <Card className="h-fit">
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
                  Active Clients ({activeClients.length})
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

            {/* Recent Activity */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  {clients
                    .filter((client) => client.createdAt)
                    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                    .slice(0, 3)
                    .map((client, index) => (
                      <div key={client.id} className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-600">
                            {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "Recently"}
                          </p>
                          <p className="font-medium">
                            {client.isNew ? "New client created: " : "Client enrolled: "}
                            {client.firstName} {client.lastName}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
