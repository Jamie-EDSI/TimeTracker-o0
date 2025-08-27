"use client"

import { useState } from "react"
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
  MessageSquare,
} from "lucide-react"

// Mock client data - in real app this would come from database
const mockClients = [
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

// Mock notes and activities
const initialMockClientData = {
  "1": {
    notes: [
      {
        id: "n1",
        content: "Client showed great improvement in interview skills during today's session.",
        author: "Chester, District - 01",
        timestamp: "2024-01-15 10:30 AM",
        type: "General Note",
      },
      {
        id: "n2",
        content: "Discussed job placement opportunities. Client expressed interest in retail positions.",
        author: "Chester, District - 01",
        timestamp: "2024-01-12 2:15 PM",
        type: "Career Planning",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "Phone Call",
        description: "Follow-up call regarding job interview preparation",
        duration: "15 minutes",
        author: "Chester, District - 01",
        timestamp: "2024-01-15 10:00 AM",
        outcome: "Positive",
      },
      {
        id: "a2",
        type: "In-Person Meeting",
        description: "Career counseling session - resume review",
        duration: "45 minutes",
        author: "Chester, District - 01",
        timestamp: "2024-01-12 2:00 PM",
        outcome: "Completed",
      },
      {
        id: "a3",
        type: "Email",
        description: "Sent job opportunity listings in client's area of interest",
        duration: "5 minutes",
        author: "Chester, District - 01",
        timestamp: "2024-01-10 9:30 AM",
        outcome: "Sent",
      },
    ],
  },
}

interface ClientManagementProps {
  onBack: () => void
}

export function ClientManagement({ onBack }: ClientManagementProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddNote, setShowAddNote] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newNote, setNewNote] = useState({ content: "", type: "General Note" })
  const [newActivity, setNewActivity] = useState({
    type: "Phone Call",
    description: "",
    duration: "",
    outcome: "",
  })
  const [clientData, setClientData] = useState(initialMockClientData)

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

  const handleAddNote = () => {
    if (newNote.content.trim() && selectedClient) {
      const newNoteEntry = {
        id: `n${Date.now()}`, // Generate unique ID
        content: newNote.content,
        author: "Current User", // In real app, get from auth context
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        type: newNote.type,
      }

      // Update the client data state
      setClientData((prev) => ({
        ...prev,
        [selectedClient]: {
          ...prev[selectedClient as keyof typeof prev],
          notes: [newNoteEntry, ...(prev[selectedClient as keyof typeof prev]?.notes || [])],
        },
      }))

      // Reset form and close
      setNewNote({ content: "", type: "General Note" })
      setShowAddNote(false)
    }
  }

  const handleAddActivity = () => {
    if (newActivity.description.trim() && selectedClient) {
      const newActivityEntry = {
        id: `a${Date.now()}`, // Generate unique ID
        type: newActivity.type,
        description: newActivity.description,
        duration: newActivity.duration,
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
      setNewActivity({ type: "Phone Call", description: "", duration: "", outcome: "" })
      setShowAddActivity(false)
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
          { label: "Notes & Comments", icon: MessageSquare, action: () => console.log("Client notes") },
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
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
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Notes & Comments</h3>
                  <Button onClick={() => setShowAddNote(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                {/* Add Note Form */}
                {showAddNote && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Add New Note</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddNote(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="noteType">Note Type</Label>
                        <Select value={newNote.type} onValueChange={(value) => setNewNote({ ...newNote, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Note">General Note</SelectItem>
                            <SelectItem value="Career Planning">Career Planning</SelectItem>
                            <SelectItem value="Progress Update">Progress Update</SelectItem>
                            <SelectItem value="Issue/Concern">Issue/Concern</SelectItem>
                            <SelectItem value="Achievement">Achievement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="noteContent">Note Content</Label>
                        <Textarea
                          id="noteContent"
                          value={newNote.content}
                          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                          placeholder="Enter your note here..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddNote}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Note
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddNote(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes List */}
                <div className="space-y-4">
                  {currentClientData?.notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{note.type}</Badge>
                          <span className="text-sm text-gray-500">{note.timestamp}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{note.content}</p>
                        <p className="text-sm text-gray-500">By: {note.author}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                      <div className="grid grid-cols-2 gap-4">
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
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            value={newActivity.duration}
                            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                            placeholder="e.g., 30 minutes"
                          />
                        </div>
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
                          <span>Duration: {activity.duration}</span>
                          <span>By: {activity.author}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
