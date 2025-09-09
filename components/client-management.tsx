"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  User,
  Plus,
  Activity,
  Edit,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Phone,
  Mail,
  ChevronDown,
  Users,
  BarChart3,
  Settings,
  Home,
  Clock,
  Download,
  Eye,
  Award,
  Calendar,
  Trash2,
} from "lucide-react"

// Mock notes and activities
const initialMockClientData = {
  "1": {
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
      {
        id: "c3",
        title: "High School Diploma",
        type: "Education",
        issuedBy: "Chester High School",
        issueDate: "2006-06-15",
        expirationDate: "",
        description: "High school diploma with focus on general studies and vocational training.",
        fileName: "hs_diploma_scan.pdf",
        fileSize: "3.1 MB",
        uploadedBy: "Chester, District - 01",
        uploadedDate: "2023-08-27 11:00 AM",
        status: "Active",
      },
    ],
  },
}

interface ClientManagementProps {
  onBack: () => void
  clients?: any[]
  onUpdateClients?: (clients: any[]) => void
  selectedClientId?: string | null // Add this prop
}

export function ClientManagement({ onBack, clients = [], onUpdateClients, selectedClientId }: ClientManagementProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(selectedClientId || null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: "Phone Call",
    description: "",
    outcome: "",
  })
  const [showAddEmployment, setShowAddEmployment] = useState(false)
  const [newEmployment, setNewEmployment] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
  })
  const [showAddCredential, setShowAddCredential] = useState(false)
  const [newCredential, setNewCredential] = useState({
    title: "",
    type: "Professional Certification",
    issuedBy: "",
    issueDate: "",
    expirationDate: "",
    description: "",
    fileName: "",
    fileSize: "",
  })
  const [clientData, setClientData] = useState(initialMockClientData)

  // Add this useEffect after the state declarations
  useEffect(() => {
    if (selectedClientId) {
      setSelectedClient(selectedClientId)
    }
  }, [selectedClientId])

  // Replace the mockClients usage with the passed clients data
  const mockClients =
    clients.length > 0
      ? clients
      : [
          {
            id: "1",
            participantId: "2965142",
            firstName: "Brian",
            lastName: "Allen",
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
            ssn: "7890",
            phone: "610-555-0456",
            email: "m.davis@email.com",
            program: "Job Readiness",
            status: "Inactive",
            lastActivity: "2024-01-10",
            enrollmentDate: "2023-07-20",
            caseManager: "Johnson, District - 01",
          },
        ]

  // Filter clients based on search and status
  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.participantId.includes(searchTerm) ||
      client.ssn.includes(searchTerm)

    const matchesStatus = filterStatus === "all" || client.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const currentClient = selectedClient ? mockClients.find((c) => c.id === selectedClient) : null
  const currentClientData = selectedClient ? clientData[selectedClient as keyof typeof clientData] : null

  const handleAddActivity = () => {
    if (newActivity.description.trim() && selectedClient) {
      const newActivityEntry = {
        id: `a${Date.now()}`, // Generate unique ID
        type: newActivity.type,
        description: newActivity.description,
        author: "Current User", // In real app, get from auth context
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        outcome: newActivity.outcome,
      }

      // Update the client data state
      setClientData((prev) => ({
        ...prev,
        [selectedClient]: {
          ...prev[selectedClient as keyof typeof prev],
          activities: [newActivityEntry, ...(prev[selectedClient as keyof typeof prev]?.activities || [])],
        },
      }))

      // Reset form and close
      setNewActivity({ type: "Phone Call", description: "", outcome: "" })
      setShowAddActivity(false)
    }
  }

  const handleAddEmployment = () => {
    if (newEmployment.jobTitle.trim() && newEmployment.companyName.trim() && selectedClient) {
      const newEmploymentEntry = {
        id: `e${Date.now()}`,
        jobTitle: newEmployment.jobTitle,
        companyName: newEmployment.companyName,
        startDate: newEmployment.startDate,
        endDate: newEmployment.endDate,
        description: newEmployment.description,
        status: newEmployment.endDate ? "Completed" : "Current",
        addedBy: "Current User",
        addedDate: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }

      setClientData((prev) => ({
        ...prev,
        [selectedClient]: {
          ...prev[selectedClient as keyof typeof prev],
          employment: [newEmploymentEntry, ...(prev[selectedClient as keyof typeof prev]?.employment || [])],
        },
      }))

      setNewEmployment({ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" })
      setShowAddEmployment(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewCredential({
        ...newCredential,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      })
    }
  }

  const handleAddCredential = () => {
    if (newCredential.title.trim() && newCredential.fileName && selectedClient) {
      const newCredentialEntry = {
        id: `c${Date.now()}`,
        title: newCredential.title,
        type: newCredential.type,
        issuedBy: newCredential.issuedBy,
        issueDate: newCredential.issueDate,
        expirationDate: newCredential.expirationDate,
        description: newCredential.description,
        fileName: newCredential.fileName,
        fileSize: newCredential.fileSize,
        uploadedBy: "Current User",
        uploadedDate: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        status: "Active",
      }

      setClientData((prev) => ({
        ...prev,
        [selectedClient]: {
          ...prev[selectedClient as keyof typeof prev],
          credentials: [newCredentialEntry, ...(prev[selectedClient as keyof typeof prev]?.credentials || [])],
        },
      }))

      setNewCredential({
        title: "",
        type: "Professional Certification",
        issuedBy: "",
        issueDate: "",
        expirationDate: "",
        description: "",
        fileName: "",
        fileSize: "",
      })
      setShowAddCredential(false)
    }
  }

  const handleDeleteCredential = (credentialId: string) => {
    if (selectedClient && window.confirm("Are you sure you want to delete this credential?")) {
      setClientData((prev) => ({
        ...prev,
        [selectedClient]: {
          ...prev[selectedClient as keyof typeof prev],
          credentials:
            prev[selectedClient as keyof typeof prev]?.credentials?.filter((cred) => cred.id !== credentialId) || [],
        },
      }))
    }
  }

  const navigateToClient = (direction: "prev" | "next") => {
    if (!selectedClient) return

    const currentIndex = filteredClients.findIndex((c) => c.id === selectedClient)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredClients.length - 1
    } else {
      newIndex = currentIndex < filteredClients.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedClient(filteredClients[newIndex].id)
  }

  // Breadcrumb logic with dropdown options
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: "Dashboard",
        onClick: onBack,
        isActive: false,
        dropdownItems: [
          { label: "Overview", icon: Home, action: onBack },
          { label: "Reports", icon: BarChart3, action: () => console.log("Navigate to reports") },
          { label: "Recent Activities", icon: Activity, action: () => console.log("Navigate to activities") },
          { label: "System Settings", icon: Settings, action: () => console.log("Navigate to settings") },
        ],
      },
      {
        label: "Client Management",
        onClick: () => setSelectedClient(null),
        isActive: !selectedClient,
        dropdownItems: [
          {
            label: "All Clients",
            icon: Users,
            action: () => {
              setSelectedClient(null)
              setFilterStatus("all")
              setSearchTerm("")
            },
          },
          {
            label: "Active Clients",
            icon: Users,
            action: () => {
              setSelectedClient(null)
              setFilterStatus("active")
            },
          },
          {
            label: "Inactive Clients",
            icon: Users,
            action: () => {
              setSelectedClient(null)
              setFilterStatus("inactive")
            },
          },
          { label: "Client Reports", icon: BarChart3, action: () => console.log("Navigate to client reports") },
          { label: "Bulk Operations", icon: Settings, action: () => console.log("Navigate to bulk operations") },
        ],
      },
    ]

    if (selectedClient && currentClient) {
      breadcrumbs.push({
        label: `${currentClient.firstName} ${currentClient.lastName}`,
        onClick: () => {},
        isActive: true,
        dropdownItems: [
          { label: "Overview", icon: User, action: () => console.log("Client overview") },
          { label: "Activities", icon: Activity, action: () => console.log("Client activities") },
          { label: "Full Profile", icon: FileText, action: () => console.log("Full profile") },
          { label: "Edit Client", icon: Edit, action: () => console.log("Edit client") },
          { label: "Client History", icon: Clock, action: () => console.log("Client history") },
        ],
      })
    }

    return breadcrumbs
  }

  if (selectedClient && currentClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Client Record Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          {/* Top row with logo */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-12 w-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
          </div>

          {/* Second row with client info and navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setSelectedClient(null)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Client List
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentClient.firstName} {currentClient.lastName}
                </h2>
                <p className="text-sm text-gray-600">
                  PID: {currentClient.participantId} | {currentClient.program}
                </p>
              </div>
            </div>

            {/* Navigation between clients */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToClient("prev")}
                className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredClients.findIndex((c) => c.id === selectedClient) + 1} of {filteredClients.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToClient("next")}
                className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4" />
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
                        onClick={breadcrumb.onClick}
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
        </div>

        {/* Client Record Content */}
        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="profile">Full Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Quick Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={currentClient.status === "Active" ? "default" : "secondary"}>
                        {currentClient.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Case Manager:</span>
                      <span className="text-sm font-medium">{currentClient.caseManager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Enrollment:</span>
                      <span className="text-sm">{currentClient.enrollmentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Activity:</span>
                      <span className="text-sm">{currentClient.lastActivity}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{currentClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{currentClient.email}</span>
                    </div>
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
                  <CardContent>
                    {currentClientData?.activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="mb-3 last:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{activity.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Employment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Current Employment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentClientData?.employment?.find((emp) => emp.status === "Current") ? (
                      <div className="space-y-2">
                        {currentClientData.employment
                          .filter((emp) => emp.status === "Current")
                          .slice(0, 1)
                          .map((employment) => (
                            <div key={employment.id}>
                              <p className="font-medium text-gray-900">{employment.jobTitle}</p>
                              <p className="text-sm text-blue-600">{employment.companyName}</p>
                              <p className="text-xs text-gray-500">Since {employment.startDate}</p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No current employment on record</p>
                    )}
                  </CardContent>
                </Card>

                {/* Credentials Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Recent Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentClientData?.credentials?.length > 0 ? (
                      <div className="space-y-2">
                        {currentClientData.credentials.slice(0, 2).map((credential) => (
                          <div key={credential.id}>
                            <p className="font-medium text-gray-900 text-sm">{credential.title}</p>
                            <p className="text-xs text-blue-600">{credential.issuedBy}</p>
                            <p className="text-xs text-gray-500">{credential.issueDate}</p>
                          </div>
                        ))}
                        {currentClientData.credentials.length > 2 && (
                          <p className="text-xs text-gray-500">+{currentClientData.credentials.length - 2} more</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No credentials on record</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Activity Log</h3>
                  <Button onClick={() => setShowAddActivity(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Activity
                  </Button>
                </div>

                {/* Add Activity Form */}
                {showAddActivity && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Log New Activity</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddActivity(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="activityType">Activity Type</Label>
                          <Select
                            value={newActivity.type}
                            onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Phone Call">Phone Call</SelectItem>
                              <SelectItem value="In-Person Meeting">In-Person Meeting</SelectItem>
                              <SelectItem value="Email">Email</SelectItem>
                              <SelectItem value="Text Message">Text Message</SelectItem>
                              <SelectItem value="Job Interview">Job Interview</SelectItem>
                              <SelectItem value="Training Session">Training Session</SelectItem>
                              <SelectItem value="Follow-up">Follow-up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            placeholder="Describe the activity..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="outcome">Outcome</Label>
                          <Select
                            value={newActivity.outcome}
                            onValueChange={(value) => setNewActivity({ ...newActivity, outcome: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select outcome" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Positive">Positive</SelectItem>
                              <SelectItem value="Needs Follow-up">Needs Follow-up</SelectItem>
                              <SelectItem value="No Response">No Response</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                              <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddActivity}>
                            <Save className="w-4 h-4 mr-2" />
                            Log Activity
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Activities List */}
                <div className="space-y-4">
                  {currentClientData?.activities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{activity.type}</Badge>
                            <Badge variant="secondary">{activity.outcome}</Badge>
                          </div>
                          <span className="text-sm text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{activity.description}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>By: {activity.author}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Employment History</h3>
                  <Button onClick={() => setShowAddEmployment(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employment
                  </Button>
                </div>

                {/* Add Employment Form */}
                {showAddEmployment && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Add New Employment</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddEmployment(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobTitle">Job Title *</Label>
                          <Input
                            id="jobTitle"
                            value={newEmployment.jobTitle}
                            onChange={(e) => setNewEmployment({ ...newEmployment, jobTitle: e.target.value })}
                            placeholder="e.g., Sales Associate"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={newEmployment.companyName}
                            onChange={(e) => setNewEmployment({ ...newEmployment, companyName: e.target.value })}
                            placeholder="e.g., ABC Corporation"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newEmployment.startDate}
                            onChange={(e) => setNewEmployment({ ...newEmployment, startDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date (Optional)</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newEmployment.endDate}
                            onChange={(e) => setNewEmployment({ ...newEmployment, endDate: e.target.value })}
                          />
                          <p className="text-xs text-gray-500 mt-1">Leave blank if currently employed</p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="employmentDescription">Role Description</Label>
                        <Textarea
                          id="employmentDescription"
                          value={newEmployment.description}
                          onChange={(e) => setNewEmployment({ ...newEmployment, description: e.target.value })}
                          placeholder="Describe the role, responsibilities, and achievements..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddEmployment}>
                          <Save className="w-4 h-4 mr-2" />
                          Add Employment
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddEmployment(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Employment List */}
                <div className="space-y-4">
                  {currentClientData?.employment?.length > 0 ? (
                    currentClientData.employment.map((employment) => (
                      <Card key={employment.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-semibold text-lg text-gray-900">{employment.jobTitle}</h4>
                                <p className="text-blue-600 font-medium">{employment.companyName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={employment.status === "Current" ? "default" : "secondary"}>
                                {employment.status}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {employment.startDate} {employment.endDate && `- ${employment.endDate}`}
                              </span>
                            </div>
                          </div>

                          {employment.description && (
                            <p className="text-gray-700 mb-3 leading-relaxed">{employment.description}</p>
                          )}

                          <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                            <span>Added by: {employment.addedBy}</span>
                            <span>{employment.addedDate}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Employment History</h3>
                          <p className="text-gray-500 mb-4">
                            Start building this client's employment record by adding their first job.
                          </p>
                          <Button onClick={() => setShowAddEmployment(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Employment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Credentials Tab */}
            <TabsContent value="credentials" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Credentials & Certificates</h3>
                  <Button onClick={() => setShowAddCredential(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Credential
                  </Button>
                </div>

                {/* Add Credential Form */}
                {showAddCredential && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Add New Credential</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddCredential(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="credentialTitle">Document Title *</Label>
                          <Input
                            id="credentialTitle"
                            value={newCredential.title}
                            onChange={(e) => setNewCredential({ ...newCredential, title: e.target.value })}
                            placeholder="e.g., Forklift Operator Certification"
                          />
                        </div>
                        <div>
                          <Label htmlFor="credentialType">Credential Type</Label>
                          <Select
                            value={newCredential.type}
                            onValueChange={(value) => setNewCredential({ ...newCredential, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Professional Certification">Professional Certification</SelectItem>
                              <SelectItem value="Safety Certification">Safety Certification</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="License">License</SelectItem>
                              <SelectItem value="Training Certificate">Training Certificate</SelectItem>
                              <SelectItem value="Professional Development">Professional Development</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="issuedBy">Issued By</Label>
                          <Input
                            id="issuedBy"
                            value={newCredential.issuedBy}
                            onChange={(e) => setNewCredential({ ...newCredential, issuedBy: e.target.value })}
                            placeholder="e.g., OSHA Training Institute"
                          />
                        </div>
                        <div>
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Input
                            id="issueDate"
                            type="date"
                            value={newCredential.issueDate}
                            onChange={(e) => setNewCredential({ ...newCredential, issueDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                        <Input
                          id="expirationDate"
                          type="date"
                          value={newCredential.expirationDate}
                          onChange={(e) => setNewCredential({ ...newCredential, expirationDate: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank if credential does not expire</p>
                      </div>

                      <div>
                        <Label htmlFor="credentialDescription">Description</Label>
                        <Textarea
                          id="credentialDescription"
                          value={newCredential.description}
                          onChange={(e) => setNewCredential({ ...newCredential, description: e.target.value })}
                          placeholder="Brief description of the credential and its relevance..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fileUpload">Upload Certificate Document *</Label>
                        <div className="mt-2">
                          <Input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileUpload}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                          </p>
                          {newCredential.fileName && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-800">
                                  {newCredential.fileName} ({newCredential.fileSize})
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddCredential}
                          disabled={!newCredential.title || !newCredential.fileName}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Add Credential
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddCredential(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Credentials List */}
                <div className="space-y-4">
                  {currentClientData?.credentials?.length > 0 ? (
                    currentClientData.credentials.map((credential) => (
                      <Card key={credential.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gray-900 mb-1">{credential.title}</h4>
                                <div className="flex items-center gap-4 mb-2">
                                  <Badge variant="outline">{credential.type}</Badge>
                                  <Badge variant={credential.status === "Active" ? "default" : "secondary"}>
                                    {credential.status}
                                  </Badge>
                                </div>
                                {credential.issuedBy && (
                                  <p className="text-blue-600 font-medium mb-1">{credential.issuedBy}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  {credential.issueDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>Issued: {credential.issueDate}</span>
                                    </div>
                                  )}
                                  {credential.expirationDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>Expires: {credential.expirationDate}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCredential(credential.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {credential.description && (
                            <p className="text-gray-700 mb-3 leading-relaxed">{credential.description}</p>
                          )}

                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900">{credential.fileName}</span>
                              <span className="text-xs text-gray-500">({credential.fileSize})</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                            <span>Uploaded by: {credential.uploadedBy}</span>
                            <span>{credential.uploadedDate}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Credentials on Record</h3>
                          <p className="text-gray-500 mb-4">
                            Start building this client's credential portfolio by uploading their first certificate.
                          </p>
                          <Button onClick={() => setShowAddCredential(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Credential
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Full Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Client Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    This would show the complete client profile similar to what we built earlier, with all personal
                    information, program details, contact information, etc.
                  </p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Client List View
  return (
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

        {/* Second row with navigation and actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
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
                    <button onClick={breadcrumb.onClick} className="text-blue-600 hover:text-blue-800 hover:underline">
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
      </div>

      {/* Search and Filters */}
      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Search Clients</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, PID, or SSN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle>Client Records ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>PID</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Case Manager</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <TableCell className="font-medium">
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>{client.participantId}</TableCell>
                    <TableCell>{client.program}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>{client.caseManager}</TableCell>
                    <TableCell>{client.lastActivity}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        onClick={() => setSelectedClient(client.id)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Record
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
