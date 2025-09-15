"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  Phone,
  GraduationCap,
  FileText,
  Trash2,
  Upload,
  Download,
  Eye,
  File,
} from "lucide-react"
import { caseNotesApi, clientsApi } from "@/lib/supabase"

interface ClientFile {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  url?: string
  file?: File
}

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
  lastModified?: string
  modifiedBy?: string
  // Case notes field
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
  // Uploaded files - now properly typed
  certificationFiles?: ClientFile[]
}

interface ClientProfileProps {
  client: Client
  onBack: () => void
  onSave: (updatedClient: Client) => void
}

export function ClientProfile({ client, onBack, onSave }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState<Client>({ ...client })
  const [currentClient, setCurrentClient] = useState<Client>(client)
  const [showCaseNoteForm, setShowCaseNoteForm] = useState(false)
  const [caseNote, setCaseNote] = useState("")
  const [caseNotes, setCaseNotes] = useState<
    Array<{
      id: string
      note: string
      date: string
      author: string
    }>
  >(client.caseNotes || [])
  const [showNoteSuccess, setShowNoteSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [certificationFiles, setCertificationFiles] = useState<ClientFile[]>([])
  const [showFilePreview, setShowFilePreview] = useState<ClientFile | null>(null)

  // Update local state when client prop changes
  useEffect(() => {
    setCurrentClient(client)
    setEditedClient({ ...client })
    if (client.caseNotes) {
      setCaseNotes(client.caseNotes)
    }
    if (client.certificationFiles) {
      setCertificationFiles([...client.certificationFiles])
    }
  }, [client])

  const handleEdit = () => {
    setIsEditing(true)
    // Reset edited client to current state to ensure we have latest data
    setEditedClient({ ...currentClient })
    setSaveError(null)
  }

  const validateClientData = (clientData: Client): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Required field validation
    if (!clientData.firstName?.trim()) errors.push("First Name is required")
    if (!clientData.lastName?.trim()) errors.push("Last Name is required")
    if (!clientData.program?.trim()) errors.push("Program is required")

    // Email validation
    if (clientData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email.trim())) {
      errors.push("Please enter a valid email address")
    }

    // Phone validation
    if (clientData.phone?.trim() && !/^[\d\s\-()]+$/.test(clientData.phone.trim())) {
      errors.push("Please enter a valid phone number")
    }

    // ZIP code validation
    if (clientData.zipCode?.trim() && !/^\d{5}(-\d{4})?$/.test(clientData.zipCode.trim())) {
      errors.push("Please enter a valid ZIP code")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      // Validate the data before saving
      const validation = validateClientData(editedClient)
      if (!validation.isValid) {
        setSaveError(`Validation errors: ${validation.errors.join(", ")}`)
        return
      }

      // Create a complete client object with all current data
      const clientToSave = {
        ...editedClient, // Use all the edited data
        id: currentClient.id, // Preserve the original ID
        participantId: currentClient.participantId, // Preserve PID
        lastModified: new Date().toISOString(),
        modifiedBy: "Current User",
        caseNotes: caseNotes, // Include current case notes
        certificationFiles: certificationFiles.map((file) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: file.uploadDate,
          url: file.url,
        })), // Include certification files without File objects
      }

      // Call the parent save function and wait for it to complete
      await onSave(clientToSave)

      // Update local state with saved data only after successful save
      setCurrentClient(clientToSave)
      setIsEditing(false)

      // Show success message
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving client:", error)
      setSaveError("Failed to save client data. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset to current saved state
    setEditedClient({ ...currentClient })
    setIsEditing(false)
    setSaveError(null)
    // Reset certification files to current state
    if (currentClient.certificationFiles) {
      setCertificationFiles([...currentClient.certificationFiles])
    } else {
      setCertificationFiles([])
    }
  }

  const handleInputChange = (field: keyof Client, value: string) => {
    setEditedClient((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear save error when user makes changes
    if (saveError) {
      setSaveError(null)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: ClientFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not supported: ${file.name}. Please upload PDF, DOC, DOCX, JPG, or PNG files.`)
        continue
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large: ${file.name}. Please upload files smaller than 10MB.`)
        continue
      }

      // Create URL for the file for preview/download
      const fileUrl = URL.createObjectURL(file)

      newFiles.push({
        id: `${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        url: fileUrl,
        file: file,
      })
    }

    setCertificationFiles((prev) => [...prev, ...newFiles])

    // Clear the input
    event.target.value = ""
  }

  const removeFile = (fileId: string) => {
    setCertificationFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.url && fileToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter((file) => file.id !== fileId)
    })
  }

  const downloadFile = (file: ClientFile) => {
    if (file.url) {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (file.file) {
      // If we have the File object, create a download link
      const url = URL.createObjectURL(file.file)
      const link = document.createElement("a")
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const viewFile = (file: ClientFile) => {
    if (file.type.includes("image") || file.type.includes("pdf")) {
      setShowFilePreview(file)
    } else {
      // For non-previewable files, just download them
      downloadFile(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("image")) return "🖼️"
    if (type.includes("word")) return "📝"
    return "📎"
  }

  const handleAddCaseNote = () => {
    setShowCaseNoteForm(true)
  }

  const handleSaveCaseNote = async () => {
    if (caseNote.trim()) {
      try {
        setIsSaving(true)

        // Save case note to Supabase
        const newCaseNote = await caseNotesApi.create({
          client_id: currentClient.id,
          note: caseNote.trim(),
          author: "Current User",
        })

        // Transform to component format
        const transformedNote = {
          id: newCaseNote.id,
          note: newCaseNote.note,
          date: newCaseNote.created_at,
          author: newCaseNote.author,
        }

        const updatedCaseNotes = [transformedNote, ...caseNotes]
        setCaseNotes(updatedCaseNotes)
        setCaseNote("")
        setShowCaseNoteForm(false)

        // Update the client with new case note
        const updatedClient = {
          ...currentClient,
          lastContact: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          modifiedBy: "Current User",
          caseNotes: updatedCaseNotes,
        }

        // Save the updated client
        await onSave(updatedClient)
        setCurrentClient(updatedClient)
        setEditedClient(updatedClient)

        setShowNoteSuccess(true)
        setTimeout(() => setShowNoteSuccess(false), 3000)
      } catch (error) {
        console.error("Error saving case note:", error)
        setSaveError("Failed to save case note. Please try again.")
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleCancelCaseNote = () => {
    setCaseNote("")
    setShowCaseNoteForm(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)

      // Soft delete the client (move to recycle bin)
      await clientsApi.softDelete(currentClient.id, "Current User")

      // Show success message and navigate back
      setShowDeleteConfirm(false)

      // Navigate back to dashboard after successful deletion
      setTimeout(() => {
        onBack()
      }, 1000)
    } catch (error) {
      console.error("Error deleting client:", error)
      setSaveError("Failed to delete client. Please try again.")
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
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

  // Use currentClient for display when not editing, editedClient when editing
  const displayClient = isEditing ? editedClient : currentClient

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2" disabled={isSaving}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {displayClient.firstName} {displayClient.lastName}
              </h1>
              <p className="text-gray-600">
                PID: {displayClient.participantId} • {displayClient.program}
              </p>
              {displayClient.lastModified && (
                <p className="text-xs text-gray-500">
                  Last modified: {formatDate(displayClient.lastModified)} by {displayClient.modifiedBy || "Unknown"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={getStatusBadge(displayClient.status)}>{displayClient.status}</span>
            <div className="text-sm text-gray-500">1 of 6</div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
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
              onClick={handleDeleteClick}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 bg-transparent"
              disabled={isSaving || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {showFilePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{showFilePreview.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatFileSize(showFilePreview.size)} • Uploaded {formatDate(showFilePreview.uploadDate)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadFile(showFilePreview)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button onClick={() => setShowFilePreview(null)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              {showFilePreview.type.includes("image") ? (
                <img
                  src={showFilePreview.url || "/placeholder.svg"}
                  alt={showFilePreview.name}
                  className="max-w-full max-h-[60vh] object-contain mx-auto"
                />
              ) : showFilePreview.type.includes("pdf") ? (
                <iframe src={showFilePreview.url} className="w-full h-[60vh]" title={showFilePreview.name} />
              ) : (
                <div className="p-8 text-center">
                  <File className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <Button onClick={() => downloadFile(showFilePreview)} className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
                <p className="text-sm text-gray-600">This action can be undone from the recycle bin</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <strong>
                {displayClient.firstName} {displayClient.lastName}
              </strong>
              ? This client will be moved to the recycle bin and can be restored later.
            </p>
            <div className="flex gap-3 justify-end">
              <Button onClick={handleDeleteCancel} variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Client"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {showSaveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">✓ Client information saved successfully!</p>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{saveError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSaveError(null)}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.firstName}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Participant ID</label>
                    <p className="text-gray-900 font-mono text-sm">{displayClient.participantId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedClient.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{formatDate(displayClient.dateOfBirth)}</p>
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
                        disabled={isSaving}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    ) : (
                      <span className={getStatusBadge(displayClient.status)}>{displayClient.status}</span>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{formatDate(displayClient.enrollmentDate)}</p>
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
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{displayClient.phone}</p>
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
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{displayClient.email}</p>
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
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{displayClient.address}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.city}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.state}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.zipCode}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.emergencyContact || "Not provided"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.emergencyPhone || "Not provided"}</p>
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
                      disabled={isSaving}
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
                    <p className="text-gray-900 text-sm">{displayClient.program}</p>
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
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{displayClient.caseManager}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.requiredHours || "Not specified"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.caoNumber || "Not provided"}</p>
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
                        disabled={isSaving}
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
                      <p className="text-gray-900 text-sm">{displayClient.educationLevel || "Not provided"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.graduationYear || "Not provided"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.schoolName || "Not provided"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.fieldOfStudy || "Not provided"}</p>
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
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm whitespace-pre-line">
                      {displayClient.educationNotes || "Not provided"}
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
                        disabled={isSaving}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.currentlyEnrolled || "No"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.gpa || "Not provided"}</p>
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm whitespace-pre-line">
                        {displayClient.certifications || "Not provided"}
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm whitespace-pre-line">
                        {displayClient.licenses || "Not provided"}
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.industryCertifications || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Certification Status</label>
                    {isEditing ? (
                      <select
                        value={editedClient.certificationStatus || ""}
                        onChange={(e) => handleInputChange("certificationStatus", e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSaving}
                      >
                        <option value="">Select status</option>
                        <option value="Current">Current</option>
                        <option value="Expired">Expired</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Renewal Required">Renewal Required</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 text-sm">{displayClient.certificationStatus || "Not provided"}</p>
                    )}
                  </div>
                </div>

                {/* File Upload Section - Only visible when editing */}
                {isEditing && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Certification Documents</label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <div className="text-sm text-gray-600 mb-2">
                          <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
                            Click to upload files
                          </label>
                          {" or drag and drop"}
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Display certification files */}
                {certificationFiles.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Certification Documents ({certificationFiles.length})
                    </label>
                    <div className="mt-2 space-y-2">
                      {certificationFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="text-2xl">{getFileIcon(file.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)} • Uploaded {formatDate(file.uploadDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              onClick={() => viewFile(file)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              title="View file"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              onClick={() => downloadFile(file)}
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {isEditing && (
                              <Button
                                type="button"
                                onClick={() => removeFile(file.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                disabled={isSaving}
                                title="Remove file"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Certification Notes</label>
                  {isEditing ? (
                    <textarea
                      value={editedClient.certificationNotes || ""}
                      onChange={(e) => handleInputChange("certificationNotes", e.target.value)}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      placeholder="Additional notes about certifications, renewal dates, etc."
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{displayClient.certificationNotes || "Not provided"}</p>
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
                  disabled={isEditing || isSaving}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button>
                <Button
                  onClick={handleAddCaseNote}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSaving}
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
                    disabled={isSaving}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveCaseNote}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSaving || !caseNote.trim()}
                    >
                      {isSaving ? "Saving..." : "Save Note"}
                    </Button>
                    <Button onClick={handleCancelCaseNote} variant="outline" size="sm" disabled={isSaving}>
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
    </div>
  )
}
