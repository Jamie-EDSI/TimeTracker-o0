"use client"

import { useState, useEffect } from "react"
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
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  // Education fields
  educationLevel?: string
  graduationYear?: string
  schoolName?: string
  fieldOfStudy?: string
  educationNotes?: string
  currentlyEnrolled?: string
  gpa?: string
  // Certification fields
  certifications?: string
  licenses?: string
  industryCertifications?: string
  certificationStatus?: string
  certificationNotes?: string
  lastContact?: string
  // Case notes field
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

interface ClientProfileProps {
  client: Client
  onBack: () => void
  onSave: (updatedClient: Client) => void
  onDelete?: (clientId: string) => Promise<void>
}

export function ClientProfile({ client, onBack, onSave, onDelete }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState<Client>(client)
  const [showCaseNoteForm, setShowCaseNoteForm] = useState(false)
  const [caseNote, setCaseNote] = useState("")
  const [caseNotes, setCaseNotes] = useState<
    Array<{
      id: string
      note: string
      date: string
      author: string
    }>
  >(
    client.caseNotes || [
      // Sample case notes - in real app, these would come from props or API
      {
        id: "1",
        note: "Initial assessment completed. Client shows strong motivation for job placement.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Case Manager",
      },
      {
        id: "2",
        note: "Enrolled in Job Readiness program. Scheduled for skills assessment next week.",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Employment Counselor",
      },
    ],
  )
  const [showNoteSuccess, setShowNoteSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (client.caseNotes) {
      setCaseNotes(client.caseNotes)
    }
  }, [client.caseNotes])

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
      const newCaseNote = {
        id: Date.now().toString(),
        note: caseNote.trim(),
        date: new Date().toISOString(),
        author: "Current User",
      }

      setCaseNotes((prev) => [newCaseNote, ...prev])
      setCaseNote("")
      setShowCaseNoteForm(false)

      const updatedClient = {
        ...client,
        lastContact: new Date().toISOString(),
        caseNotes: [newCaseNote, ...(client.caseNotes || [])],
      }

      onSave(updatedClient)

      setShowNoteSuccess(true)
      setTimeout(() => setShowNoteSuccess(false), 3000)
    }
  }

  const handleCancelCaseNote = () => {
    setCaseNote("")
    setShowCaseNoteForm(false)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      // Move client to recycle bin instead of permanent deletion
      const deletedClient = {
        ...client,
        deletedAt: new Date().toISOString(),
        deletedBy: "Current User",
      }

      // In a real application, this would call an API to move to recycle bin
      console.log("Moving client to recycle bin:", deletedClient)

      // Call the onDelete callback to handle the deletion in the parent component
      if (onDelete) {
        await onDelete(client.id)
      }

      // Navigate back to dashboard
      onBack()
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("There was an error deleting the client. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
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
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 bg-transparent"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content - Smaller Information Cards */}
          <div className="space-y-3">
            <Card className="border border-gray-200">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Participant ID</label>
                    <p className="text-gray-900 font-mono text-sm">{currentClient.participantId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedClient.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{formatDate(currentClient.dateOfBirth)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    {isEditing ? (
                      <select
                        value={editedClient.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{formatDate(currentClient.enrollmentDate)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-3 pt-0">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedClient.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{currentClient.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedClient.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{currentClient.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{currentClient.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.zipCode}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.emergencyContact || ""}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.emergencyContact || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedClient.emergencyPhone || ""}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.emergencyPhone || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-3 pt-0">
                <div>
                  <label className="text-sm font-medium text-gray-600">Program</label>
                  {isEditing ? (
                    <select
                      value={editedClient.program}
                      onChange={(e) => handleInputChange("program", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <p className="text-gray-900 text-sm">{currentClient.program}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Case Manager</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.caseManager}
                      onChange={(e) => handleInputChange("caseManager", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{currentClient.caseManager}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Required Hours</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedClient.requiredHours || ""}
                        onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.requiredHours || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CAO Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.caoNumber || ""}
                        onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.caoNumber || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Highest Education Level</label>
                    {isEditing ? (
                      <select
                        value={editedClient.educationLevel || ""}
                        onChange={(e) => handleInputChange("educationLevel", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select education level</option>
                        <option value="Less than High School">Less than High School</option>
                        <option value="High School Diploma/GED">High School Diploma/GED</option>
                        <option value="Some College">Some College</option>
                        <option value="Associate Degree">Associate Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctoral Degree">Doctoral Degree</option>
                        <option value="Professional Degree">Professional Degree</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.educationLevel || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Graduation Year</label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        value={editedClient.graduationYear || ""}
                        onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2020"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.graduationYear || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">School/Institution Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.schoolName || ""}
                        onChange={(e) => handleInputChange("schoolName", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school or institution name"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.schoolName || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Field of Study/Major</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.fieldOfStudy || ""}
                        onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter field of study or major"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.fieldOfStudy || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Additional Education Details</label>
                  {isEditing ? (
                    <textarea
                      value={editedClient.educationNotes || ""}
                      onChange={(e) => handleInputChange("educationNotes", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      placeholder="Enter any additional education details, honors, relevant coursework, etc."
                    />
                  ) : (
                    <p className="text-gray-900 text-sm whitespace-pre-line">
                      {currentClient.educationNotes || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Currently Enrolled</label>
                    {isEditing ? (
                      <select
                        value={editedClient.currentlyEnrolled || "No"}
                        onChange={(e) => handleInputChange("currentlyEnrolled", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.currentlyEnrolled || "No"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">GPA (if applicable)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={editedClient.gpa || ""}
                        onChange={(e) => handleInputChange("gpa", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 3.5"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.gpa || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Certifications & Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Professional Certifications</label>
                    {isEditing ? (
                      <textarea
                        value={editedClient.certifications || ""}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        placeholder="List professional certifications (e.g., CompTIA A+, Microsoft Office Specialist, etc.)"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm whitespace-pre-line">
                        {currentClient.certifications || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Licenses</label>
                    {isEditing ? (
                      <textarea
                        value={editedClient.licenses || ""}
                        onChange={(e) => handleInputChange("licenses", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        placeholder="List professional licenses (e.g., Driver's License, CDL, Professional License, etc.)"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm whitespace-pre-line">
                        {currentClient.licenses || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Industry Certifications</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.industryCertifications || ""}
                        onChange={(e) => handleInputChange("industryCertifications", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., OSHA 10, Food Handler's License, etc."
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.industryCertifications || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Certification Status</label>
                    {isEditing ? (
                      <select
                        value={editedClient.certificationStatus || ""}
                        onChange={(e) => handleInputChange("certificationStatus", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select status</option>
                        <option value="Current">Current</option>
                        <option value="Expired">Expired</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Renewal Required">Renewal Required</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 text-sm">{currentClient.certificationStatus || "Not provided"}</p>
                    )}
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-600">Certification Documents</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      id="certification-upload"
                      onChange={(e) => {
                        // Handle file upload logic here
                        const files = Array.from(e.target.files || [])
                        console.log("Uploaded files:", files)
                        // In a real application, you would upload these files to a server
                      }}
                    />
                    <label htmlFor="certification-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">Click to upload certification documents</span>
                        <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Certification Notes</label>
                  {isEditing ? (
                    <textarea
                      value={editedClient.certificationNotes || ""}
                      onChange={(e) => handleInputChange("certificationNotes", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      placeholder="Additional notes about certifications, renewal dates, etc."
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{currentClient.certificationNotes || "Not provided"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Quick Actions and Case Notes */}
          <div className="space-y-3">
            {/* Quick Actions */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-3 pt-0">
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
              <Card className="border border-gray-200">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle>Add Case Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-3 pt-0">
                  <textarea
                    value={caseNote}
                    onChange={(e) => setCaseNote(e.target.value)}
                    placeholder="Enter case note details..."
                    className="w-full h-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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

            {/* Case Notes History - Large and Prominent */}
            <Card className="border border-gray-200 min-h-[700px]">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-xl font-bold">Case Notes ({caseNotes.length})</CardTitle>
                {showNoteSuccess && (
                  <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md">
                    <p className="text-sm text-green-700">✓ Case note added successfully</p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="space-y-3">
                    {caseNotes.map((note) => (
                      <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-blue-600">{note.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(note.date).toLocaleDateString()} at{" "}
                            {new Date(note.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{note.note}</p>
                      </div>
                    ))}
                    {caseNotes.length === 0 && (
                      <p className="text-sm text-gray-500 italic text-center py-4">No case notes yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {client.firstName} {client.lastName}? This record will be moved to the
              recycle bin and can be recovered later.
            </p>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
