"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NavigationCard } from "@/components/navigation-card"
import { ClientManagement } from "@/components/client-management"
import { NewClientForm } from "@/components/new-client-form"
import { ClientProfile } from "@/components/client-profile"
import { RecycleBin } from "@/components/recycle-bin"
import { AllClientsReport } from "@/components/all-clients-report"
import { ActiveClientsReport } from "@/components/active-clients-report"
import { CallLogReport } from "@/components/call-log-report"
import { JobsPlacementsReport } from "@/components/jobs-placements-report"
import { SupabaseStatusIndicator } from "@/components/supabase-status-indicator"
import { clientsApi } from "@/lib/supabase"
import {
  Search,
  Users,
  UserPlus,
  FileText,
  BarChart3,
  Phone,
  Briefcase,
  Archive,
  Eye,
  Database,
  Activity,
  TrendingUp,
  Clock,
  User,
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
  cellPhone?: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth: string
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  isNew?: boolean
  createdAt?: string
  lastContact?: string
  lastModified?: string
  modifiedBy?: string
  educationLevel?: string
  graduationYear?: string
  schoolName?: string
  fieldOfStudy?: string
  educationNotes?: string
  currentlyEnrolled?: string
  gpa?: string
  certifications?: string
  licenses?: string
  industryCertifications?: string
  certificationStatus?: string
  certificationNotes?: string
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setIsLoading(true)
      const clientsData = await clientsApi.getAll()

      // Transform Supabase data to component format
      const transformedClients = clientsData.map((client: any) => ({
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        participantId: client.participant_id,
        program: client.program,
        status: client.status,
        enrollmentDate: client.enrollment_date,
        phone: client.phone,
        cellPhone: client.cell_phone,
        email: client.email,
        address: client.address,
        city: client.city,
        state: client.state,
        zipCode: client.zip_code,
        dateOfBirth: client.date_of_birth,
        emergencyContact: client.emergency_contact,
        emergencyPhone: client.emergency_phone,
        caseManager: client.case_manager,
        responsibleEC: client.responsible_ec,
        requiredHours: client.required_hours?.toString(),
        caoNumber: client.cao_number,
        createdAt: client.created_at,
        lastContact: client.last_contact,
        lastModified: client.last_modified,
        modifiedBy: client.modified_by,
        educationLevel: client.education_level,
        graduationYear: client.graduation_year?.toString(),
        schoolName: client.school_name,
        fieldOfStudy: client.field_of_study,
        educationNotes: client.education_notes,
        currentlyEnrolled: client.currently_enrolled,
        gpa: client.gpa?.toString(),
        certifications: client.certifications,
        licenses: client.licenses,
        industryCertifications: client.industry_certifications,
        certificationStatus: client.certification_status,
        certificationNotes: client.certification_notes,
      }))

      setClients(transformedClients)
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientCreated = async (newClient: Client) => {
    // Mark as new for visual feedback
    const clientWithNewFlag = { ...newClient, isNew: true }
    setClients((prev) => [clientWithNewFlag, ...prev])

    // Remove the "new" flag after 5 seconds
    setTimeout(() => {
      setClients((prev) => prev.map((client) => (client.id === newClient.id ? { ...client, isNew: false } : client)))
    }, 5000)
  }

  const handleClientUpdated = (updatedClient: Client) => {
    setClients((prev) => prev.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
    setSelectedClient(updatedClient)
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setCurrentView("client-profile")
  }

  const filteredClients = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  // Render different views based on currentView state
  if (currentView === "client-management") {
    return (
      <ClientManagement
        onBack={() => setCurrentView("dashboard")}
        clients={clients}
        onViewClient={handleViewClient}
        onClientUpdated={handleClientUpdated}
        onReloadClients={loadClients}
      />
    )
  }

  if (currentView === "new-client") {
    return <NewClientForm onBack={() => setCurrentView("dashboard")} onClientCreated={handleClientCreated} />
  }

  if (currentView === "client-profile" && selectedClient) {
    return (
      <ClientProfile
        client={selectedClient}
        onBack={() => setCurrentView("dashboard")}
        onClientUpdated={handleClientUpdated}
      />
    )
  }

  if (currentView === "recycle-bin") {
    return <RecycleBin onBack={() => setCurrentView("dashboard")} onClientRestored={loadClients} />
  }

  if (currentView === "all-clients-report") {
    return (
      <AllClientsReport onBack={() => setCurrentView("dashboard")} clients={clients} onViewClient={handleViewClient} />
    )
  }

  if (currentView === "active-clients-report") {
    return (
      <ActiveClientsReport
        onBack={() => setCurrentView("dashboard")}
        clients={clients.filter((client) => client.status.toLowerCase() === "active")}
        onViewClient={handleViewClient}
      />
    )
  }

  if (currentView === "call-log-report") {
    return <CallLogReport onBack={() => setCurrentView("dashboard")} clients={clients} />
  }

  if (currentView === "jobs-placements-report") {
    return <JobsPlacementsReport onBack={() => setCurrentView("dashboard")} clients={clients} />
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            onClick={() => setCurrentView("dashboard")}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Show the Desktop
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Navigation */}
          <div className="space-y-6">
            {/* Client Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                  Client Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <NavigationCard
                  title="Manage Clients"
                  description="View, edit, and manage client information"
                  icon={<Users className="w-5 h-5" />}
                  onClick={() => setCurrentView("client-management")}
                />
                <NavigationCard
                  title="Add New Client"
                  description="Register a new client in the system"
                  icon={<UserPlus className="w-5 h-5" />}
                  onClick={() => setCurrentView("new-client")}
                />
                <NavigationCard
                  title="Recycle Bin"
                  description="View and restore deleted clients"
                  icon={<Archive className="w-5 h-5" />}
                  onClick={() => setCurrentView("recycle-bin")}
                />
              </CardContent>
            </Card>

            {/* Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-green-500" />
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <NavigationCard
                  title="All Clients Report"
                  description="Complete overview of all clients"
                  icon={<FileText className="w-5 h-5" />}
                  onClick={() => setCurrentView("all-clients-report")}
                />
                <NavigationCard
                  title="Active Clients Report"
                  description="View currently active clients"
                  icon={<Activity className="w-5 h-5" />}
                  onClick={() => setCurrentView("active-clients-report")}
                />
                <NavigationCard
                  title="Call Log Report"
                  description="Track client communications"
                  icon={<Phone className="w-5 h-5" />}
                  onClick={() => setCurrentView("call-log-report")}
                />
                <NavigationCard
                  title="Jobs & Placements"
                  description="Employment tracking and outcomes"
                  icon={<Briefcase className="w-5 h-5" />}
                  onClick={() => setCurrentView("jobs-placements-report")}
                />
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Search & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5 text-purple-500" />
                  Quick Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search clients by name, ID, program..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredClients.slice(0, 5).map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewClient(client)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {client.participantId} • {client.program}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(client.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredClients.length > 5 && (
                      <div className="text-center py-2 text-sm text-gray-500">
                        {filteredClients.length - 5} more results...
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dashboard Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">TimeTracker</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive client management with integrated reporting and Supabase database storage. All client
                  data is automatically synchronized across all features.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/50 rounded p-2">
                    <div className="font-medium text-blue-600">Supabase Integration</div>
                    <div className="text-gray-600">Real-time Database</div>
                  </div>
                  <div className="bg-white/50 rounded p-2">
                    <div className="font-medium text-green-600">Live Updates</div>
                    <div className="text-gray-600">Instant Sync</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Statistics & Status */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
                    <div className="text-sm text-gray-600">Total Clients</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {clients.filter((c) => c.status.toLowerCase() === "active").length}
                    </div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {clients.filter((c) => c.status.toLowerCase() === "pending").length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {clients.filter((c) => c.status.toLowerCase() === "inactive").length}
                    </div>
                    <div className="text-sm text-gray-600">Inactive</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="w-5 h-5 text-indigo-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SupabaseStatusIndicator />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients
                    .filter((client) => client.isNew)
                    .slice(0, 3)
                    .map((client) => (
                      <div key={client.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                        <User className="w-4 h-4 text-green-600" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">New client added</div>
                          <div className="text-xs text-gray-600">
                            {client.firstName} {client.lastName}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">New</Badge>
                      </div>
                    ))}
                  {clients.filter((client) => client.isNew).length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">No recent activity</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
