"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpDown,
  Edit,
  Phone,
  CheckCircle,
  Loader2,
  X,
  Save,
  Trash2,
} from "lucide-react"
import { ClientProfile } from "./client-profile"

// Mock notes and activities
const initialMockClientData = {
  "1": {
    personalInfo: {
      firstName: "Brian",
      lastName: "Allen",
      middleName: "",
      dateOfBirth: "1988-04-27",
      gender: "Male",
      ethnicity: "Black or African American",
      race: "Black or African American",
      veteranStatus: "No",
      disabilityStatus: "No",
      ssn: "1293",
      participantId: "2965142",
      status: "Active",
    },
    contactInfo: {
      phone: "215-207-4497",
      email: "brianallen0488@gmail.com",
      address: "1348 Adair Rd",
      city: "Brookhaven",
      state: "Pennsylvania",
      zipCode: "19015",
    },
    programInfo: {
      program: "Next Step Program",
      caseManager: "Chester, District - 01",
      enrollmentDate: "2023-08-27",
      lastActivity: "2024-01-15",
      county: "Delaware County",
      location: "Delaware County 001, PA",
    },
    activities: [
      {
        id: "a1",
        type: "Phone Call",
        description: "Follow-up call regarding job interview preparation",
        author: "Chester, District - 01",
        timestamp: "2024-01-15 10:00 AM",
        outcome: "Positive",
      },
      {
        id: "a2",
        type: "In-Person Meeting",
        description: "Career counseling session - resume review",
        author: "Chester, District - 01",
        timestamp: "2024-01-12 2:00 PM",
        outcome: "Completed",
      },
      {
        id: "a3",
        type: "Email",
        description: "Sent job opportunity listings in client's area of interest",
        author: "Chester, District - 01",
        timestamp: "2024-01-10 9:30 AM",
        outcome: "Sent",
      },
    ],
    employment: [
      {
        id: "e1",
        jobTitle: "Warehouse Associate",
        companyName: "ABC Logistics Inc.",
        startDate: "2024-01-15",
        endDate: "",
        description:
          "Responsible for inventory management, order fulfillment, and maintaining warehouse organization. Operated forklifts and other warehouse equipment.",
        status: "Current",
        addedBy: "Chester, District - 01",
        addedDate: "2024-01-15 10:30 AM",
      },
      {
        id: "e2",
        jobTitle: "Retail Sales Associate",
        companyName: "QuickMart",
        startDate: "2023-06-01",
        endDate: "2023-12-31",
        description:
          "Provided customer service, handled cash transactions, and maintained store displays. Achieved monthly sales targets consistently.",
        status: "Completed",
        addedBy: "Chester, District - 01",
        addedDate: "2023-06-01 2:15 PM",
      },
    ],
    credentials: [
      {
        id: "c1",
        title: "Forklift Operator Certification",
        type: "Safety Certification",
        issuedBy: "OSHA Training Institute",
        issueDate: "2023-12-15",
        expirationDate: "2025-12-15",
        description:
          "Certified to operate Class 1, 2, and 3 forklifts in warehouse environments. Includes safety protocols and equipment maintenance training.",
        fileName: "forklift_cert_brian_allen.pdf",
        fileSize: "2.4 MB",
        uploadedBy: "Chester, District - 01",
        uploadedDate: "2024-01-10 9:15 AM",
        status: "Active",
      },
      {
        id: "c2",
        title: "Customer Service Excellence Certificate",
        type: "Professional Development",
        issuedBy: "National Retail Federation",
        issueDate: "2023-08-20",
        expirationDate: "",
        description:
          "Completed comprehensive customer service training program covering communication skills, conflict resolution, and sales techniques.",
        fileName: "customer_service_cert.pdf",
        fileSize: "1.8 MB",
        uploadedBy: "Chester, District - 01",
        uploadedDate: "2023-08-25 3:30 PM",
        status: "Active",
      },
    ],
  },
  "2": {
    personalInfo: {
      firstName: "Sarah",
      lastName: "Johnson",
      middleName: "",
      dateOfBirth: "1990-07-15",
      gender: "Female",
      ethnicity: "White",
      race: "White",
      veteranStatus: "No",
      disabilityStatus: "No",
      ssn: "4567",
      participantId: "2965143",
      status: "Active",
    },
    contactInfo: {
      phone: "484-555-0123",
      email: "sarah.johnson@email.com",
      address: "789 Pine Street",
      city: "Chester",
      state: "Pennsylvania",
      zipCode: "19013",
    },
    programInfo: {
      program: "Career Development",
      caseManager: "Smith, District - 02",
      enrollmentDate: "2023-09-15",
      lastActivity: "2024-01-14",
      county: "Delaware County",
      location: "Delaware County 002, PA",
    },
    activities: [
      {
        id: "a1",
        type: "Phone Call",
        description: "Career assessment and goal setting discussion",
        author: "Smith, District - 02",
        timestamp: "2024-01-14 11:00 AM",
        outcome: "Positive",
      },
    ],
    employment: [
      {
        id: "e1",
        jobTitle: "Administrative Assistant",
        companyName: "Local Government Office",
        startDate: "2024-01-10",
        endDate: "",
        description: "Administrative support and customer service duties",
        status: "Current",
        addedBy: "Smith, District - 02",
        addedDate: "2024-01-10 2:30 PM",
      },
    ],
    credentials: [
      {
        id: "c1",
        title: "Microsoft Office Specialist",
        type: "Professional Certification",
        issuedBy: "Microsoft",
        issueDate: "2023-11-20",
        expirationDate: "",
        description: "Certified in Microsoft Office Suite including Word, Excel, and PowerPoint",
        fileName: "ms_office_cert.pdf",
        fileSize: "1.2 MB",
        uploadedBy: "Smith, District - 02",
        uploadedDate: "2023-11-25 4:00 PM",
        status: "Active",
      },
    ],
  },
  "3": {
    personalInfo: {
      firstName: "Michael",
      lastName: "Davis",
      middleName: "",
      dateOfBirth: "1985-03-12",
      gender: "Male",
      ethnicity: "White",
      race: "White",
      veteranStatus: "No",
      disabilityStatus: "No",
      ssn: "7890",
      participantId: "2965144",
      status: "Inactive",
    },
    contactInfo: {
      phone: "484-555-0101",
      email: "michael.davis@email.com",
      address: "456 Oak Street",
      city: "Chester",
      state: "Pennsylvania",
      zipCode: "19013",
    },
    programInfo: {
      program: "Job Readiness",
      caseManager: "Smith, John",
      enrollmentDate: "2023-01-15",
      lastActivity: "2024-01-15",
      county: "Delaware County",
      location: "Delaware County 002, PA",
    },
    activities: [
      {
        id: "a1",
        type: "Phone Call",
        description: "Follow-up call regarding job interview preparation",
        author: "Smith, John",
        timestamp: "2024-01-15 10:00 AM",
        outcome: "Positive",
      },
      {
        id: "a2",
        type: "In-Person Meeting",
        description: "Career counseling session - resume review",
        author: "Smith, John",
        timestamp: "2024-01-12 2:00 PM",
        outcome: "Completed",
      },
      {
        id: "a3",
        type: "Email",
        description: "Sent job opportunity listings in client's area of interest",
        author: "Smith, John",
        timestamp: "2024-01-10 9:30 AM",
        outcome: "Sent",
      },
    ],
    employment: [
      {
        id: "e1",
        jobTitle: "Warehouse Associate",
        companyName: "ABC Logistics Inc.",
        startDate: "2024-01-15",
        endDate: "",
        description: "Responsible for inventory management, order fulfillment, and maintaining warehouse organization.",
        status: "Current",
        addedBy: "Smith, John",
        addedDate: "2024-01-15 10:30 AM",
      },
    ],
    credentials: [
      {
        id: "c1",
        title: "Forklift Operator Certification",
        type: "Safety Certification",
        issuedBy: "OSHA Training Institute",
        issueDate: "2023-12-15",
        expirationDate: "2025-12-15",
        description: "Certified to operate forklifts in warehouse environments.",
        fileName: "forklift_cert_michael_davis.pdf",
        fileSize: "2.1 MB",
        uploadedBy: "Smith, John",
        uploadedDate: "2024-01-10 9:15 AM",
        status: "Active",
      },
      {
        id: "c2",
        title: "Customer Service Excellence Certificate",
        type: "Professional Development",
        issuedBy: "National Retail Federation",
        issueDate: "2023-08-20",
        expirationDate: "",
        description: "Customer service training program completion certificate.",
        fileName: "customer_service_cert.pdf",
        fileSize: "1.5 MB",
        uploadedBy: "Smith, John",
        uploadedDate: "2023-08-25 3:30 PM",
        status: "Active",
      },
    ],
  },
}

interface ClientManagementProps {
  onBack: () => void
  clients: any[]
  onUpdateClients: (clients: any[]) => void
  selectedClientId?: string | null
}

export function ClientManagement({ onBack, clients, onUpdateClients, selectedClientId }: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [sortField, setSortField] = useState<string>("lastName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [isEditing, setIsEditing] = useState(false)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [currentClientIndex, setCurrentClientIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [navigationLoading, setNavigationLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "profile">("list")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Handle initial client selection
  useEffect(() => {
    if (selectedClientId) {
      const clientIndex = filteredAndSortedClients.findIndex((client) => client.id === selectedClientId)
      if (clientIndex !== -1) {
        setCurrentClientIndex(clientIndex)
        setViewMode("profile")
      } else {
        // If client not found in filtered list, show error and go back to list
        console.error("Client not found:", selectedClientId)
        setViewMode("list")
      }
    }
  }, [selectedClientId])

  // Get unique programs for filter dropdown
  const programs = useMemo(() => {
    const uniquePrograms = [...new Set(clients.map((client) => client.program))]
    return uniquePrograms.sort()
  }, [clients])

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    const filtered = clients.filter((client) => {
      const matchesSearch =
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.participantId.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)

      const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesProgram = programFilter === "all" || client.program === programFilter

      return matchesSearch && matchesStatus && matchesProgram
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a]
      let bValue = b[sortField as keyof typeof b]

      // Handle date fields
      if (sortField === "enrollmentDate" || sortField === "createdAt") {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [searchTerm, statusFilter, programFilter, sortField, sortDirection, clients])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClients = filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage)

  // Get current client for profile view
  const currentClient = filteredAndSortedClients[currentClientIndex]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Inactive</Badge>
    }
  }

  const handleViewClient = async (clientId: string) => {
    setNavigationLoading(true)
    try {
      // Simulate API call delay for realistic loading experience
      await new Promise((resolve) => setTimeout(resolve, 500))

      const clientIndex = filteredAndSortedClients.findIndex((client) => client.id === clientId)
      if (clientIndex !== -1) {
        setCurrentClientIndex(clientIndex)
        setViewMode("profile")
      } else {
        throw new Error("Client not found")
      }
    } catch (error) {
      console.error("Error loading client:", error)
      alert("Error loading client record. Please try again.")
    } finally {
      setNavigationLoading(false)
    }
  }

  const handleNextClient = async () => {
    if (currentClientIndex < filteredAndSortedClients.length - 1) {
      setNavigationLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setCurrentClientIndex(currentClientIndex + 1)
      } finally {
        setNavigationLoading(false)
      }
    }
  }

  const handlePreviousClient = async () => {
    if (currentClientIndex > 0) {
      setNavigationLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setCurrentClientIndex(currentClientIndex - 1)
      } finally {
        setNavigationLoading(false)
      }
    }
  }

  const handleBackToList = () => {
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to go back?")) {
        return
      }
    }
    setViewMode("list")
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setEditingClientId(null)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditingClientId(currentClient?.id)
  }

  const handleSave = async () => {
    setSaveStatus("saving")
    setIsLoading(true)

    try {
      // Simulate API save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the client in the list
      const updatedClients = clients.map((client) =>
        client.id === currentClient.id
          ? {
              ...client,
              // Add any updated fields here
              updatedAt: new Date().toISOString(),
            }
          : client,
      )

      onUpdateClients(updatedClients)
      setIsEditing(false)
      setHasUnsavedChanges(false)
      setSaveStatus("saved")

      // Clear saved status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      console.error("Error saving client:", error)
      setSaveStatus("error")
      alert("Error saving client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        return
      }
    }
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setEditingClientId(null)
  }

  const handleDelete = async (clientId: string) => {
    setIsLoading(true)
    try {
      // Simulate API delete
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedClients = clients.filter((client) => client.id !== clientId)
      onUpdateClients(updatedClients)

      // If we deleted the current client, go back to list
      if (clientId === currentClient?.id) {
        setViewMode("list")
      }

      alert("Client deleted successfully")
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("Error deleting client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Breadcrumb logic
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: "Dashboard",
        onClick: onBack,
        isActive: false,
      },
    ]

    if (viewMode === "list") {
      breadcrumbs.push({
        label: `Client Management (${filteredAndSortedClients.length})`,
        onClick: () => {},
        isActive: true,
      })
    } else if (currentClient) {
      breadcrumbs.push(
        {
          label: "Client Management",
          onClick: handleBackToList,
          isActive: false,
        },
        {
          label: `${currentClient.firstName} ${currentClient.lastName}`,
          onClick: () => {},
          isActive: true,
        },
      )
    }

    return breadcrumbs
  }

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-lg font-medium">Loading client record...</span>
      </div>
    </div>
  )

  if (viewMode === "profile" && currentClient) {
    return (
      <>
        {navigationLoading && <LoadingOverlay />}
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            {/* Top row with logo */}
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center">
                <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-12 w-auto" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
            </div>

            {/* Navigation row - Repositioned layout */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleBackToList} disabled={navigationLoading}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Client List
                </Button>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentClient.firstName} {currentClient.lastName}
                  </h2>
                  {getStatusBadge(currentClient.status)}
                  {saveStatus === "saved" && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  )}
                </div>
              </div>

              {/* Repositioned Controls - Navigation and Edit buttons moved to the left of Delete */}
              <div className="flex items-center gap-4">
                {/* Navigation Controls */}
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousClient}
                    disabled={currentClientIndex === 0 || navigationLoading}
                    className="h-8 hover:bg-white"
                  >
                    {navigationLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </Button>
                  <span className="text-sm text-gray-700 px-3 py-1 bg-white rounded font-medium min-w-[80px] text-center">
                    {currentClientIndex + 1} of {filteredAndSortedClients.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextClient}
                    disabled={currentClientIndex === filteredAndSortedClients.length - 1 || navigationLoading}
                    className="h-8 hover:bg-white"
                  >
                    {navigationLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Edit Action Buttons */}
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Client
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="bg-white hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Delete Button - Now positioned on the far right */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Client Record</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {currentClient.firstName} {currentClient.lastName}? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(currentClient.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Client
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
              <nav className="flex items-center space-x-2 text-sm">
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
                    {breadcrumb.isActive ? (
                      <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                    ) : (
                      <button
                        onClick={breadcrumb.onClick}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {breadcrumb.label}
                      </button>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Client Profile Content */}
          <div className="p-6">
            <ClientProfile
              client={currentClient}
              isEditing={isEditing}
              onDataChange={() => setHasUnsavedChanges(true)}
            />
          </div>
        </div>
      </>
    )
  }

  // List View
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          {/* Top row with logo */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-12 w-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
              <Badge variant="secondary">{filteredAndSortedClients.length} clients</Badge>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
            <nav className="flex items-center space-x-2 text-sm">
              {getBreadcrumbs().map((breadcrumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
                  {breadcrumb.isActive ? (
                    <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                  ) : (
                    <button onClick={breadcrumb.onClick} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {breadcrumb.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Clients</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Name, ID, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="program">Program</Label>
                  <Select value={programFilter} onValueChange={setProgramFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="itemsPerPage">Items per Page</Label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger>
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
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedClients.length)} of{" "}
              {filteredAndSortedClients.length} clients
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="min-w-[150px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("lastName")}
                          className="h-auto p-0 font-semibold"
                        >
                          Name {getSortIcon("lastName")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("participantId")}
                          className="h-auto p-0 font-semibold"
                        >
                          PID {getSortIcon("participantId")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("status")}
                          className="h-auto p-0 font-semibold"
                        >
                          Status {getSortIcon("status")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("program")}
                          className="h-auto p-0 font-semibold"
                        >
                          Program {getSortIcon("program")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("enrollmentDate")}
                          className="h-auto p-0 font-semibold"
                        >
                          Enrollment Date {getSortIcon("enrollmentDate")}
                        </Button>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <button
                            onClick={() => handleViewClient(client.id)}
                            className="text-left text-blue-600 hover:text-blue-800 hover:underline"
                            disabled={navigationLoading}
                          >
                            {client.lastName}, {client.firstName}
                          </button>
                        </TableCell>
                        <TableCell>{client.participantId}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{client.program}</Badge>
                        </TableCell>
                        <TableCell>{new Date(client.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            {client.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                            {client.email && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">@</span>
                                <span className="truncate max-w-[120px]">{client.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewClient(client.id)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                              disabled={navigationLoading}
                            >
                              {navigationLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Footer */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Total: {filteredAndSortedClients.length} clients</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
