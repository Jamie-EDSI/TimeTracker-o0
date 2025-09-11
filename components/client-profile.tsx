"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, X, User, Phone, GraduationCap, FileText } from "lucide-react"

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
}

interface ClientProfileProps {
  client: Client
  onBack: () => void
  onSave: (updatedClient: Client) => void
}

export function ClientProfile({ client, onBack, onSave }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState<Client>(client)
  const [showCaseNoteForm, setShowCaseNoteForm] = useState(false)
  const [caseNote, setCaseNote] = useState("")

  const handleEdit = () => {
    setIsEditing(true)
    setEditedClient(client)
  }

  const handleSave = () => {
    onSave(editedClient)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedClient(client)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof Client, value: string) => {
    setEditedClient((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddCaseNote = () => {
    setShowCaseNoteForm(true)
  }

  const handleSaveCaseNote = () => {
    if (caseNote.trim()) {
      // Here you would typically save the case note to your data store
      console.log("Saving case note:", caseNote)
      setCaseNote("")
      setShowCaseNoteForm(false)
      // You could also trigger a refresh of the recent activity section
    }
  }

  const handleCancelCaseNote = () => {
    setCaseNote("")
    setShowCaseNoteForm(false)
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

  const currentClient = isEditing ? editedClient : client

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Client List
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentClient.firstName} {currentClient.lastName}
              </h1>
              <p className="text-gray-600">
                PID: {currentClient.participantId} • {currentClient.program}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={getStatusBadge(currentClient.status)}>{currentClient.status}</span>
            <div className="text-sm text-gray-500">1 of 6</div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Participant ID</label>
                    <p className="text-gray-900 font-mono">{currentClient.participantId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedClient.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formatDate(currentClient.dateOfBirth)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    {isEditing ? (
                      <select
                        value={editedClient.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    ) : (
                      <span className={getStatusBadge(currentClient.status)}>{currentClient.status}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Enrollment Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedClient.enrollmentDate}
                        onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formatDate(currentClient.enrollmentDate)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedClient.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentClient.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedClient.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentClient.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentClient.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.zipCode}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.emergencyContact || ""}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.emergencyContact || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedClient.emergencyPhone || ""}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.emergencyPhone || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Program</label>
                  {isEditing ? (
                    <select
                      value={editedClient.program}
                      onChange={(e) => handleInputChange("program", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Job Readiness">Job Readiness</option>
                      <option value="EARN">EARN</option>
                      <option value="Ex-Offender">Ex-Offender</option>
                      <option value="YOUTH">YOUTH</option>
                      <option value="Next Step Program">Next Step Program</option>
                      <option value="Career Development">Career Development</option>
                      <option value="Skills Training">Skills Training</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{currentClient.program}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Case Manager</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.caseManager}
                      onChange={(e) => handleInputChange("caseManager", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentClient.caseManager}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Required Hours</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedClient.requiredHours || ""}
                        onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.requiredHours || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CAO Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.caoNumber || ""}
                        onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{currentClient.caoNumber || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Quick Actions and Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleEdit}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isEditing}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button>
                <Button
                  onClick={handleAddCaseNote}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add Case Note
                </Button>
              </CardContent>
            </Card>

            {/* Case Note Form */}
            {showCaseNoteForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Case Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={caseNote}
                    onChange={(e) => setCaseNote(e.target.value)}
                    placeholder="Enter case note details..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveCaseNote} size="sm" className="bg-green-600 hover:bg-green-700">
                      Save Note
                    </Button>
                    <Button onClick={handleCancelCaseNote} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Case note added</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Program enrollment</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Initial assessment</p>
                      <p className="text-xs text-gray-500">2 weeks ago</p>
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
