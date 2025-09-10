"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  X,
} from "lucide-react"
import { NewClientForm } from "./new-client-form"
import { ClientProfile } from "./client-profile"

interface Client {
  id: string
  participantId: string
  firstName: string
  lastName: string
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
  pid: string
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  lastActivity?: string
  personal?: any
  contact?: any
  program?: any
  employment?: any
  additional?: any
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      participantId: "2965142",
      firstName: "Brian",
      lastName: "Allen",
      program: "Next Step Program",
      status: "Active",
      enrollmentDate: "2024-08-27",
      phone: "484-487-1097",
      cellPhone: "215-207-4497",
      email: "brianallen0488@gmail.com",
      address: "1348 Adair Rd",
      city: "Brookhaven",
      state: "Pennsylvania",
      zipCode: "19015",
      dateOfBirth: "1988-04-27",
      pid: "2965142",
      emergencyContact: "Ashley Allen",
      emergencyPhone: "484-485-0427",
      caseManager: "Clark, Brandon",
      responsibleEC: "Clark, Brandon",
      requiredHours: "20",
      caoNumber: "",
      createdAt: "2024-08-27T10:00:00Z",
      updatedAt: "2024-12-10T16:25:00Z",
      createdBy: "Clark, Brandon",
      lastActivity: "2024-12-10",
      personal: {
        firstName: "Brian",
        lastName: "Allen",
        dateOfBirth: "1988-04-27",
        pid: "2965142",
        gender: "Male",
        ethnicity: "Black or African American",
        race: "Black or African American",
        veteranStatus: "No",
        disabilityStatus: "No",
        status: "Active",
      },
      contact: {
        phone: "484-487-1097",
        email: "brianallen0488@gmail.com",
        address: "1348 Adair Rd",
        city: "Brookhaven",
        state: "Pennsylvania",
        zipCode: "19015",
        emergencyContactName: "Ashley Allen",
        emergencyContactPhone: "484-485-0427",
      },
      program: {
        program: "Next Step Program",
        caseManager: "Clark, Brandon",
        enrollmentDate: "2024-08-27",
        county: "Delaware County",
        location: "Delaware County 001, PA",
        notes: "Standard enrollment",
      },
      employment: {
        currentlyEmployed: "No",
        jobTitle: "",
        companyName: "",
        startDate: "",
        hourlyWage: "",
        hoursPerWeek: "",
      },
      additional: {
        education: "HS Diploma",
        criminalRecord: "Felony",
        childrenUnderAge6: "No",
        driversLicense: "No",
        housingIssue: "Stable",
        passedDrugTest: "N/A",
        snap: "No",
        tanf: "Yes",
      },
    },
    {
      id: "2",
      participantId: "3847291",
      firstName: "Sarah",
      lastName: "Johnson",
      program: "Career Development",
      status: "Active",
      enrollmentDate: "2024-09-15",
      phone: "610-555-0123",
      email: "sarah.johnson@email.com",
      address: "456 Oak Street",
      city: "Chester",
      state: "Pennsylvania",
      zipCode: "19013",
      dateOfBirth: "1992-03-15",
      pid: "3847291",
      emergencyContact: "Michael Johnson",
      emergencyPhone: "610-555-0124",
      caseManager: "Smith, Jennifer",
      responsibleEC: "Smith, Jennifer",
      requiredHours: "25",
      caoNumber: "CAO123",
      createdAt: "2024-09-15T09:30:00Z",
      updatedAt: "2024-12-10T14:15:00Z",
      createdBy: "Smith, Jennifer",
      lastActivity: "2024-12-09",
      personal: {
        firstName: "Sarah",
        lastName: "Johnson",
        dateOfBirth: "1992-03-15",
        pid: "3847291",
        gender: "Female",
        ethnicity: "Not Hispanic or Latino",
        race: "White",
        veteranStatus: "No",
        disabilityStatus: "Yes",
        status: "Active",
      },
      contact: {
        phone: "610-555-0123",
        email: "sarah.johnson@email.com",
        address: "456 Oak Street",
        city: "Chester",
        state: "Pennsylvania",
        zipCode: "19013",
        emergencyContactName: "Michael Johnson",
        emergencyContactPhone: "610-555-0124",
      },
      program: {
        program: "Career Development",
        caseManager: "Smith, Jennifer",
        enrollmentDate: "2024-09-15",
        county: "Delaware County",
        location: "Chester Office",
        notes: "Focused on administrative skills",
      },
      employment: {
        currentlyEmployed: "Yes",
        jobTitle: "Administrative Assistant",
        companyName: "Local Business Inc.",
        startDate: "2024-10-01",
        hourlyWage: "16.50",
        hoursPerWeek: "30",
      },
      additional: {
        education: "Some College",
        criminalRecord: "None",
        childrenUnderAge6: "Yes",
        driversLicense: "Yes",
        housingIssue: "Stable",
        passedDrugTest: "Passed",
        snap: "Yes",
        tanf: "No",
      },
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [clientsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.participantId.includes(searchTerm) ||
      client.pid.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesProgram = programFilter === "all" || client.program === programFilter

    return matchesSearch && matchesStatus && matchesProgram
  })

  // Pagination
  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)

  const handleAddClient = (clientData: Client) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setClients((prev) => [...prev, clientData])
      setShowNewClientForm(false)
      setIsLoading(false)

      // Show success message (in a real app, you'd use a toast notification)
      console.log("Client added successfully:", clientData)
    }, 1000)
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setIsEditing(false)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setIsEditing(true)
  }

  const handleSaveClient = (updatedData: Partial<Client>) => {
    if (selectedClient) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setClients((prev) =>
          prev.map((client) =>
            client.id === selectedClient.id
              ? { ...client, ...updatedData, updatedAt: new Date().toISOString() }
              : client,
          ),
        )
        setSelectedClient({ ...selectedClient, ...updatedData } as Client)
        setIsEditing(false)
        setIsLoading(false)

        // Show success message
        console.log("Client updated successfully:", updatedData)
      }, 1000)
    }
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setClients((prev) => prev.filter((client) => client.id !== clientId))
      if (selectedClient?.id === clientId) {
        setSelectedClient(null)
        setIsEditing(false)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  // If viewing a specific client
  if (selectedClient) {
    return (
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Client List
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedClient.firstName} {selectedClient.lastName}
              </h1>
              <p className="text-gray-600">
                PID: {selectedClient.participantId || selectedClient.pid} • {selectedClient.program}
              </p>
            </div>
            <Badge className={getStatusBadge(selectedClient.status)}>{selectedClient.status}</Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation controls */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md">
              <Button variant="ghost" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">1 of {clients.length}</span>
              <Button variant="ghost" size="sm" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action buttons */}
            {isEditing ? (
              <>
                <Button
                  onClick={() => handleSaveClient(selectedClient)}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => handleDeleteClient(selectedClient.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Client Profile */}
        <ClientProfile client={selectedClient} isEditing={isEditing} onDataChange={handleSaveClient} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage and track client information and progress</p>
        </div>
        <Button onClick={() => setShowNewClientForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, PID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="Next Step Program">Next Step Program</SelectItem>
                  <SelectItem value="Career Development">Career Development</SelectItem>
                  <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                  <SelectItem value="Skills Training">Skills Training</SelectItem>
                  <SelectItem value="EARN">EARN</SelectItem>
                  <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                  <SelectItem value="YOUTH">YOUTH</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstClient + 1}-{Math.min(indexOfLastClient, filteredClients.length)} of{" "}
          {filteredClients.length} clients
        </p>
        {filteredClients.length !== clients.length && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setProgramFilter("all")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Client Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>PID</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Case Manager</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {client.firstName} {client.lastName}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{client.participantId || client.pid}</TableCell>
                  <TableCell>{client.program}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(client.status)}>{client.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(client.enrollmentDate)}</TableCell>
                  <TableCell>{client.caseManager}</TableCell>
                  <TableCell>{client.lastActivity ? formatDate(client.lastActivity) : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* New Client Form Modal */}
      {showNewClientForm && <NewClientForm onClose={() => setShowNewClientForm(false)} onSubmit={handleAddClient} />}
    </div>
  )
}
