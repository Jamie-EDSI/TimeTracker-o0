"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Plus,
  Activity,
  Save,
  X,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building,
  Award,
  Calendar,
  Trash2,
  Download,
  Eye,
} from "lucide-react"

interface ClientProfileProps {
  client: any
  isEditing: boolean
  onDataChange: () => void
}

export function ClientProfile({ client, isEditing, onDataChange }: ClientProfileProps) {
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [showAddEmployment, setShowAddEmployment] = useState(false)
  const [showAddCredential, setShowAddCredential] = useState(false)

  // Editable form state
  const [editableData, setEditableData] = useState({
    firstName: client.firstName || "",
    lastName: client.lastName || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "1348 Adair Rd",
    city: client.city || "Brookhaven",
    state: client.state || "Pennsylvania",
    zipCode: client.zipCode || "19015",
    status: client.status || "Active",
    program: client.program || "",
    caseManager: client.caseManager || "",
  })

  const [newActivity, setNewActivity] = useState({
    type: "Phone Call",
    description: "",
    outcome: "",
  })

  const [newEmployment, setNewEmployment] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
  })

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

  // Handle input changes for editable fields
  const handleInputChange = (field: string, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }))
    onDataChange() // Notify parent of changes
  }

  // Mock client data structure for display
  const clientData = {
    personalInfo: {
      firstName: isEditing ? editableData.firstName : client.firstName,
      lastName: isEditing ? editableData.lastName : client.lastName,
      middleName: "",
      dateOfBirth: "1988-04-27",
      gender: "Male",
      ethnicity: "Black or African American",
      race: "Black or African American",
      veteranStatus: "No",
      disabilityStatus: "No",
      ssn: "1293",
      participantId: client.participantId,
      status: isEditing ? editableData.status : client.status,
    },
    contactInfo: {
      phone: isEditing ? editableData.phone : client.phone,
      email: isEditing ? editableData.email : client.email,
      address: isEditing ? editableData.address : client.address || "1348 Adair Rd",
      city: isEditing ? editableData.city : client.city || "Brookhaven",
      state: isEditing ? editableData.state : client.state || "Pennsylvania",
      zipCode: isEditing ? editableData.zipCode : client.zipCode || "19015",
    },
    programInfo: {
      program: isEditing ? editableData.program : client.program,
      caseManager: isEditing ? editableData.caseManager : client.caseManager,
      enrollmentDate: client.enrollmentDate,
      lastActivity: client.lastActivity,
      county: "Delaware County",
      location: "Delaware County 001, PA",
    },
    activities: [
      {
        id: "a1",
        type: "Phone Call",
        description: "Follow-up call regarding job interview preparation",
        author: client.caseManager,
        timestamp: "2024-01-15 10:00 AM",
        outcome: "Positive",
      },
      {
        id: "a2",
        type: "In-Person Meeting",
        description: "Career counseling session - resume review",
        author: client.caseManager,
        timestamp: "2024-01-12 2:00 PM",
        outcome: "Completed",
      },
    ],
    employment: [
      {
        id: "e1",
        jobTitle: "Warehouse Associate",
        companyName: "ABC Logistics Inc.",
        startDate: "2024-01-15",
        endDate: "",
        description: "Responsible for inventory management and order fulfillment.",
        status: "Current",
        addedBy: client.caseManager,
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
        fileName: "forklift_cert.pdf",
        fileSize: "2.4 MB",
        uploadedBy: client.caseManager,
        uploadedDate: "2024-01-10 9:15 AM",
        status: "Active",
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Inactive</Badge>
    }
  }

  const handleAddActivity = () => {
    if (newActivity.description.trim()) {
      // In a real app, this would make an API call
      console.log("Adding activity:", newActivity)
      setNewActivity({ type: "Phone Call", description: "", outcome: "" })
      setShowAddActivity(false)
      onDataChange()
    }
  }

  const handleAddEmployment = () => {
    if (newEmployment.jobTitle.trim() && newEmployment.companyName.trim()) {
      // In a real app, this would make an API call
      console.log("Adding employment:", newEmployment)
      setNewEmployment({ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" })
      setShowAddEmployment(false)
      onDataChange()
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
    if (newCredential.title.trim() && newCredential.fileName) {
      // In a real app, this would make an API call
      console.log("Adding credential:", newCredential)
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
      onDataChange()
    }
  }

  return (
    <div className="space-y-6">
      {/* Editing Mode Indicator */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800 font-medium">
              <strong>Editing Mode:</strong> Make your changes and click "Save Changes" to update the client record.
            </p>
          </div>
        </div>
      )}

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
            {/* Quick Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Quick Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={editableData.status}
                          onValueChange={(value) => handleInputChange("status", value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-gray-500">Preview:</span>
                        {getStatusBadge(editableData.status)}
                      </div>
                    ) : (
                      getStatusBadge(clientData.personalInfo.status)
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Case Manager:</span>
                    {isEditing ? (
                      <Input
                        value={editableData.caseManager}
                        onChange={(e) => handleInputChange("caseManager", e.target.value)}
                        className="w-40 h-8 text-sm"
                        placeholder="Case Manager"
                      />
                    ) : (
                      <span className="text-sm font-medium">{clientData.programInfo.caseManager}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Enrollment:</span>
                    <span className="text-sm">{clientData.programInfo.enrollmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Activity:</span>
                    <span className="text-sm">{clientData.programInfo.lastActivity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={editableData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="flex-1 h-8 text-sm"
                        placeholder="Phone number"
                      />
                    ) : (
                      <span className="text-sm">{clientData.contactInfo.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={editableData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="flex-1 h-8 text-sm"
                        placeholder="Email address"
                        type="email"
                      />
                    ) : (
                      <span className="text-sm">{clientData.contactInfo.email}</span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="text-sm flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editableData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Street address"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={editableData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              className="h-8 text-sm"
                              placeholder="City"
                            />
                            <Input
                              value={editableData.zipCode}
                              onChange={(e) => handleInputChange("zipCode", e.target.value)}
                              className="h-8 text-sm"
                              placeholder="ZIP"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>{clientData.contactInfo.address}</div>
                          <div>
                            {clientData.contactInfo.city}, {clientData.contactInfo.state}{" "}
                            {clientData.contactInfo.zipCode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                {clientData.activities.slice(0, 3).map((activity) => (
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

            {/* Current Employment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Current Employment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientData.employment.find((emp) => emp.status === "Current") ? (
                  <div className="space-y-2">
                    {clientData.employment
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

            {/* Recent Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientData.credentials.length > 0 ? (
                  <div className="space-y-2">
                    {clientData.credentials.slice(0, 2).map((credential) => (
                      <div key={credential.id}>
                        <p className="font-medium text-gray-900 text-sm">{credential.title}</p>
                        <p className="text-xs text-blue-600">{credential.issuedBy}</p>
                        <p className="text-xs text-gray-500">{credential.issueDate}</p>
                      </div>
                    ))}
                    {clientData.credentials.length > 2 && (
                      <p className="text-xs text-gray-500">+{clientData.credentials.length - 2} more</p>
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
              {clientData.activities.map((activity) => (
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
              {clientData.employment.length > 0 ? (
                clientData.employment.map((employment) => (
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
                    <Button onClick={handleAddCredential} disabled={!newCredential.title || !newCredential.fileName}>
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
              {clientData.credentials.length > 0 ? (
                clientData.credentials.map((credential) => (
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
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
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                  {isEditing && (
                    <Badge variant="secondary" className="ml-2">
                      Editing
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">First Name</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1"
                        placeholder="First name"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.personalInfo.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Middle Name</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.middleName || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1"
                        placeholder="Last name"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.personalInfo.lastName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date of Birth</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Gender</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">SSN (Last 4)</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.ssn}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Participant ID</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.participantId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ethnicity</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.ethnicity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Race</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.race}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Veteran Status</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.veteranStatus}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Disability Status</Label>
                    <p className="text-sm mt-1">{clientData.personalInfo.disabilityStatus}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    {isEditing ? (
                      <div className="mt-1 flex items-center gap-2">
                        <Select
                          value={editableData.status}
                          onValueChange={(value) => handleInputChange("status", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        {getStatusBadge(editableData.status)}
                      </div>
                    ) : (
                      <div className="mt-1">{getStatusBadge(clientData.personalInfo.status)}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Program Information
                  {isEditing && (
                    <Badge variant="secondary" className="ml-2">
                      Editing
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Program</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.program}
                        onChange={(e) => handleInputChange("program", e.target.value)}
                        className="mt-1"
                        placeholder="Program name"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.programInfo.program}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">County</Label>
                    <p className="text-sm mt-1">{clientData.programInfo.county}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm mt-1">{clientData.programInfo.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Case Manager</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.caseManager}
                        onChange={(e) => handleInputChange("caseManager", e.target.value)}
                        className="mt-1"
                        placeholder="Case manager name"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.programInfo.caseManager}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Enrollment Date</Label>
                    <p className="text-sm mt-1">{clientData.programInfo.enrollmentDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Activity</Label>
                    <p className="text-sm mt-1">{clientData.programInfo.lastActivity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                  {isEditing && (
                    <Badge variant="secondary" className="ml-2">
                      Editing
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1"
                        placeholder="Phone number"
                        type="tel"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.contactInfo.phone}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                        placeholder="Email address"
                        type="email"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.contactInfo.email}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1"
                        placeholder="Street address"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.contactInfo.address}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">City</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="mt-1"
                        placeholder="City"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.contactInfo.city}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State</Label>
                    <p className="text-sm mt-1">{clientData.contactInfo.state}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        value={editableData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="mt-1"
                        placeholder="ZIP code"
                      />
                    ) : (
                      <p className="text-sm mt-1">{clientData.contactInfo.zipCode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
