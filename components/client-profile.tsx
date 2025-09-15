"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Trash2,
  Plus,
  Calendar,
  Phone,
  User,
  GraduationCap,
  Award,
  Upload,
  FileText,
  AlertCircle,
} from "lucide-react"
import { clientsApi, caseNotesApi, type Client, type CaseNote } from "@/lib/supabase"

interface ClientProfileProps {
  client: Client
  onBack: () => void
  onClientUpdated: (client: Client) => void
  onClientDeleted: (clientId: string) => void
}

interface FileUpload {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

const PROGRAMS = ["EARN", "Job Readiness", "YOUTH", "Skills Training", "Career Development", "Other"]

const STATUS_OPTIONS = ["Active", "Pending", "Inactive", "Completed", "Withdrawn"]

const EDUCATION_LEVELS = [
  "Less than High School",
  "High School Diploma/GED",
  "Some College",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
  "Professional Degree",
  "Trade/Vocational Certificate",
]

const CASE_MANAGERS = [
  "Brown, Lisa",
  "Smith, John",
  "Johnson, Mary",
  "Wilson, David",
  "Davis, Sarah",
  "Martinez, Carlos",
  "Anderson, Jennifer",
  "Taylor, Michael",
]

export function ClientProfile({ client, onBack, onClientUpdated, onClientDeleted }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [editedClient, setEditedClient] = useState<Client>(client)

  useEffect(() => {
    loadCaseNotes()
  }, [client.id])

  const loadCaseNotes = async () => {
    try {
      const notes = await caseNotesApi.getByClientId(client.id)
      setCaseNotes(notes)
    } catch (error) {
      console.error("Error loading case notes:", error)
    }
  }

  const handleInputChange = (field: keyof Client, value: string | number) => {
    setEditedClient((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const updatedClient = await clientsApi.update(client.id, editedClient)
      onClientUpdated(updatedClient)
      setIsEditing(false)
    } catch (err: any) {
      console.error("Error updating client:", err)
      setError(err.message || "Failed to update client")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedClient(client)
    setIsEditing(false)
    setError(null)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await clientsApi.softDelete(client.id, "Current User")
      onClientDeleted(client.id)
    } catch (err: any) {
      console.error("Error deleting client:", err)
      setError(err.message || "Failed to delete client")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setIsAddingNote(true)
    try {
      const note = await caseNotesApi.create({
        client_id: client.id,
        note: newNote.trim(),
        author: "Current User",
      })
      setCaseNotes((prev) => [note, ...prev])
      setNewNote("")
    } catch (err: any) {
      console.error("Error adding case note:", err)
      setError(err.message || "Failed to add case note")
    } finally {
      setIsAddingNote(false)
    }
  }

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    processFiles(files)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const files = Array.from(event.dataTransfer.files)
    processFiles(files)
  }

  const processFiles = (files: File[]) => {
    setUploadError(null)

    const validFiles: FileUpload[] = []
    const errors: string[] = []

    files.forEach((file) => {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`)
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: File too large (max 5MB)`)
        return
      }

      const fileUpload: FileUpload = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          fileUpload.preview = e.target?.result as string
          setUploadedFiles((prev) => prev.map((f) => (f.id === fileUpload.id ? fileUpload : f)))
        }
        reader.readAsDataURL(file)
      }

      validFiles.push(fileUpload)
    })

    if (errors.length > 0) {
      setUploadError(errors.join(", "))
    }

    setUploadedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "withdrawn":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {client.first_name} {client.last_name}
            </h1>
            <p className="text-gray-600">ID: {client.participant_id}</p>
          </div>
          <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
        </div>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this client? This action will move the client to the recycle bin.
            </p>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="notes">Case Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Info Cards */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-semibold">{client.program}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Enrollment Date</p>
                    <p className="font-semibold">{formatDate(client.enrollment_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Case Manager</p>
                    <p className="font-semibold">{client.case_manager}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.first_name}</p>
                )}
              </div>
              <div>
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.last_name}</p>
                )}
              </div>
              <div>
                <Label>Date of Birth</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedClient.date_of_birth}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{formatDate(client.date_of_birth)}</p>
                )}
              </div>
              <div>
                <Label>Status</Label>
                {isEditing ? (
                  <Select value={editedClient.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                {isEditing ? (
                  <Input value={editedClient.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                ) : (
                  <p className="mt-1 text-sm">{client.phone}</p>
                )}
              </div>
              <div>
                <Label>Cell Phone</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.cell_phone || ""}
                    onChange={(e) => handleInputChange("cell_phone", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.cell_phone || "Not provided"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedClient.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.email}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                {isEditing ? (
                  <Input value={editedClient.address} onChange={(e) => handleInputChange("address", e.target.value)} />
                ) : (
                  <p className="mt-1 text-sm">{client.address}</p>
                )}
              </div>
              <div>
                <Label>City</Label>
                {isEditing ? (
                  <Input value={editedClient.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                ) : (
                  <p className="mt-1 text-sm">{client.city}</p>
                )}
              </div>
              <div>
                <Label>State</Label>
                {isEditing ? (
                  <Select value={editedClient.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm">{client.state}</p>
                )}
              </div>
              <div>
                <Label>ZIP Code</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.zip_code}
                    onChange={(e) => handleInputChange("zip_code", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.zip_code}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Emergency Contact Name</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.emergency_contact || ""}
                    onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.emergency_contact || "Not provided"}</p>
                )}
              </div>
              <div>
                <Label>Emergency Contact Phone</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.emergency_phone || ""}
                    onChange={(e) => handleInputChange("emergency_phone", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.emergency_phone || "Not provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Program Tab */}
        <TabsContent value="program">
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Program</Label>
                {isEditing ? (
                  <Select value={editedClient.program} onValueChange={(value) => handleInputChange("program", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMS.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm">{client.program}</p>
                )}
              </div>
              <div>
                <Label>Case Manager</Label>
                {isEditing ? (
                  <Select
                    value={editedClient.case_manager}
                    onValueChange={(value) => handleInputChange("case_manager", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CASE_MANAGERS.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm">{client.case_manager}</p>
                )}
              </div>
              <div>
                <Label>Enrollment Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedClient.enrollment_date}
                    onChange={(e) => handleInputChange("enrollment_date", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{formatDate(client.enrollment_date)}</p>
                )}
              </div>
              <div>
                <Label>Required Hours</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedClient.required_hours || ""}
                    onChange={(e) => handleInputChange("required_hours", Number.parseInt(e.target.value) || 0)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.required_hours || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>Responsible EC</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.responsible_ec || ""}
                    onChange={(e) => handleInputChange("responsible_ec", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.responsible_ec || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>CAO Number</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.cao_number || ""}
                    onChange={(e) => handleInputChange("cao_number", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.cao_number || "Not specified"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Education Level</Label>
                {isEditing ? (
                  <Select
                    value={editedClient.education_level || ""}
                    onValueChange={(value) => handleInputChange("education_level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm">{client.education_level || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>Graduation Year</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    min="1950"
                    max="2030"
                    value={editedClient.graduation_year || ""}
                    onChange={(e) => handleInputChange("graduation_year", Number.parseInt(e.target.value) || 0)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.graduation_year || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>School Name</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.school_name || ""}
                    onChange={(e) => handleInputChange("school_name", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.school_name || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>Field of Study</Label>
                {isEditing ? (
                  <Input
                    value={editedClient.field_of_study || ""}
                    onChange={(e) => handleInputChange("field_of_study", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.field_of_study || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>Currently Enrolled</Label>
                {isEditing ? (
                  <Select
                    value={editedClient.currently_enrolled || ""}
                    onValueChange={(value) => handleInputChange("currently_enrolled", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm">{client.currently_enrolled || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label>GPA</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={editedClient.gpa || ""}
                    onChange={(e) => handleInputChange("gpa", Number.parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.gpa || "Not specified"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Education Notes</Label>
                {isEditing ? (
                  <Textarea
                    value={editedClient.education_notes || ""}
                    onChange={(e) => handleInputChange("education_notes", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.education_notes || "No notes"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications and Licenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Certifications</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient.certifications || ""}
                      onChange={(e) => handleInputChange("certifications", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{client.certifications || "None listed"}</p>
                  )}
                </div>
                <div>
                  <Label>Licenses</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient.licenses || ""}
                      onChange={(e) => handleInputChange("licenses", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{client.licenses || "None listed"}</p>
                  )}
                </div>
                <div>
                  <Label>Industry Certifications</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient.industry_certifications || ""}
                      onChange={(e) => handleInputChange("industry_certifications", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{client.industry_certifications || "None listed"}</p>
                  )}
                </div>
                <div>
                  <Label>Certification Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.certification_status || ""}
                      onValueChange={(value) => handleInputChange("certification_status", value)}
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
                  ) : (
                    <p className="mt-1 text-sm">{client.certification_status || "Not specified"}</p>
                  )}
                </div>
              </div>

              {/* File Upload Section - Only show in edit mode */}
              {isEditing && (
                <div>
                  <Label>Upload Certification Documents</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Drop files here or click to upload
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG up to 5MB each
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>

                  {uploadError && <div className="mt-2 text-sm text-red-600">{uploadError}</div>}

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Uploaded Files</Label>
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {file.preview ? (
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <FileText className="h-10 w-10 text-gray-400" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="md:col-span-2">
                <Label>Certification Notes</Label>
                {isEditing ? (
                  <Textarea
                    value={editedClient.certification_notes || ""}
                    onChange={(e) => handleInputChange("certification_notes", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm">{client.certification_notes || "No notes"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Case Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Case Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Note */}
              <div className="space-y-2">
                <Label htmlFor="new-note">Add New Case Note</Label>
                <Textarea
                  id="new-note"
                  placeholder="Enter case note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim() || isAddingNote} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingNote ? "Adding..." : "Add Note"}
                </Button>
              </div>

              {/* Case Notes List */}
              <div className="space-y-4">
                {caseNotes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No case notes yet</p>
                ) : (
                  caseNotes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{note.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(note.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-sm">{note.note}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
