"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus,
  Calendar,
  User,
  Phone,
  GraduationCap,
  Award,
  FileText,
  Trash2,
} from "lucide-react"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { caseNotesApi } from "@/lib/supabase"

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
  createdAt?: string
  lastContact?: string
  lastModified?: string
  modifiedBy?: string
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
  onSave: (client: Client) => Promise<Client>
  onDelete?: (client: Client) => Promise<void>
}

export function ClientProfile({ client, onBack, onSave, onDelete }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState<Client>(client)
  const [isSaving, setIsSaving] = useState(false)
  const [newCaseNote, setNewCaseNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update edited client when prop changes
  useEffect(() => {
    setEditedClient(client)
  }, [client])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const savedClient = await onSave(editedClient)
      setEditedClient(savedClient)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving client:", error)
      alert("Failed to save client. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedClient(client)
    setIsEditing(false)
  }

  const handleAddCaseNote = async () => {
    if (!newCaseNote.trim()) return

    try {
      setIsAddingNote(true)
      const caseNote = await caseNotesApi.create({
        client_id: client.id,
        note: newCaseNote.trim(),
        author: "Current User", // In a real app, this would be the logged-in user
      })

      const updatedCaseNotes = [
        {
          id: caseNote.id,
          note: caseNote.note,
          date: caseNote.created_at,
          author: caseNote.author,
        },
        ...(editedClient.caseNotes || []),
      ]

      setEditedClient({
        ...editedClient,
        caseNotes: updatedCaseNotes,
      })

      setNewCaseNote("")
    } catch (error) {
      console.error("Error adding case note:", error)
      alert("Failed to add case note. Please try again.")
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return

    try {
      setIsDeleting(true)
      await onDelete(client)
      onBack() // Navigate back after successful deletion
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("Failed to delete client. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString()
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm" className="text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.firstName} {client.lastName}
                </h1>
                <p className="text-sm text-gray-600">
                  Participant ID: {client.participantId} • {client.program}
                </p>
              </div>
              {getStatusBadge(client.status)}
            </div>
            <div className="flex items-center gap-2">
              {onDelete && (
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  disabled={isDeleting || isSaving}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Client
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Case Notes ({editedClient.caseNotes?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedClient.firstName}
                      onChange={(e) => setEditedClient({ ...editedClient, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedClient.lastName}
                      onChange={(e) => setEditedClient({ ...editedClient, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participantId">Participant ID</Label>
                    <Input
                      id="participantId"
                      value={editedClient.participantId}
                      onChange={(e) => setEditedClient({ ...editedClient, participantId: e.target.value })}
                      disabled={!isEditing}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedClient.dateOfBirth}
                      onChange={(e) => setEditedClient({ ...editedClient, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={editedClient.program}
                      onValueChange={(value) => setEditedClient({ ...editedClient, program: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EARN">EARN</SelectItem>
                        <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                        <SelectItem value="YOUTH">YOUTH</SelectItem>
                        <SelectItem value="WIOA Adult">WIOA Adult</SelectItem>
                        <SelectItem value="WIOA Youth">WIOA Youth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedClient.status}
                      onValueChange={(value) => setEditedClient({ ...editedClient, status: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={editedClient.enrollmentDate}
                      onChange={(e) => setEditedClient({ ...editedClient, enrollmentDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseManager">Case Manager</Label>
                    <Input
                      id="caseManager"
                      value={editedClient.caseManager}
                      onChange={(e) => setEditedClient({ ...editedClient, caseManager: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsibleEC">Responsible EC</Label>
                    <Input
                      id="responsibleEC"
                      value={editedClient.responsibleEC || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, responsibleEC: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requiredHours">Required Hours</Label>
                    <Input
                      id="requiredHours"
                      type="number"
                      value={editedClient.requiredHours || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, requiredHours: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caoNumber">CAO Number</Label>
                    <Input
                      id="caoNumber"
                      value={editedClient.caoNumber || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, caoNumber: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Record Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(client.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Last Modified:</span> {formatDate(client.lastModified)}
                    </div>
                    <div>
                      <span className="font-medium">Last Contact:</span> {formatDate(client.lastContact)}
                    </div>
                    <div>
                      <span className="font-medium">Modified By:</span> {client.modifiedBy || "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Primary Phone</Label>
                    <Input
                      id="phone"
                      value={editedClient.phone}
                      onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cellPhone">Cell Phone</Label>
                    <Input
                      id="cellPhone"
                      value={editedClient.cellPhone || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, cellPhone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedClient.email}
                      onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editedClient.address}
                      onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editedClient.city}
                      onChange={(e) => setEditedClient({ ...editedClient, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editedClient.state}
                      onChange={(e) => setEditedClient({ ...editedClient, state: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={editedClient.zipCode}
                      onChange={(e) => setEditedClient({ ...editedClient, zipCode: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        value={editedClient.emergencyContact || ""}
                        onChange={(e) => setEditedClient({ ...editedClient, emergencyContact: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={editedClient.emergencyPhone || ""}
                        onChange={(e) => setEditedClient({ ...editedClient, emergencyPhone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select
                      value={editedClient.educationLevel || ""}
                      onValueChange={(value) => setEditedClient({ ...editedClient, educationLevel: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than High School">Less than High School</SelectItem>
                        <SelectItem value="High School Diploma/GED">High School Diploma/GED</SelectItem>
                        <SelectItem value="Some College">Some College</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Doctoral Degree">Doctoral Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={editedClient.graduationYear || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, graduationYear: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={editedClient.schoolName || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, schoolName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      value={editedClient.fieldOfStudy || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, fieldOfStudy: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentlyEnrolled">Currently Enrolled</Label>
                    <Select
                      value={editedClient.currentlyEnrolled || ""}
                      onValueChange={(value) => setEditedClient({ ...editedClient, currentlyEnrolled: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select enrollment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={editedClient.gpa || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, gpa: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationNotes">Education Notes</Label>
                  <Textarea
                    id="educationNotes"
                    value={editedClient.educationNotes || ""}
                    onChange={(e) => setEditedClient({ ...editedClient, educationNotes: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications & Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Textarea
                      id="certifications"
                      value={editedClient.certifications || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, certifications: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="List certifications..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenses">Licenses</Label>
                    <Textarea
                      id="licenses"
                      value={editedClient.licenses || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, licenses: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="List licenses..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industryCertifications">Industry Certifications</Label>
                    <Textarea
                      id="industryCertifications"
                      value={editedClient.industryCertifications || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, industryCertifications: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="List industry certifications..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificationStatus">Certification Status</Label>
                    <Select
                      value={editedClient.certificationStatus || ""}
                      onValueChange={(value) => setEditedClient({ ...editedClient, certificationStatus: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificationNotes">Certification Notes</Label>
                  <Textarea
                    id="certificationNotes"
                    value={editedClient.certificationNotes || ""}
                    onChange={(e) => setEditedClient({ ...editedClient, certificationNotes: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Additional notes about certifications..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Case Notes Tab */}
          <TabsContent value="notes">
            <div className="space-y-6">
              {/* Add New Case Note */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Case Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={newCaseNote}
                    onChange={(e) => setNewCaseNote(e.target.value)}
                    placeholder="Enter case note..."
                    rows={4}
                  />
                  <Button onClick={handleAddCaseNote} disabled={!newCaseNote.trim() || isAddingNote}>
                    {isAddingNote ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Case Notes List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Case Notes History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editedClient.caseNotes && editedClient.caseNotes.length > 0 ? (
                    <div className="space-y-4">
                      {editedClient.caseNotes.map((note) => (
                        <div key={note.id} className="border-l-4 border-blue-200 pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(note.date)}</span>
                              <User className="w-4 h-4 ml-2" />
                              <span>{note.author}</span>
                            </div>
                          </div>
                          <p className="text-gray-900 whitespace-pre-wrap">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No case notes yet. Add the first note above.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      {onDelete && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          client={client}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
