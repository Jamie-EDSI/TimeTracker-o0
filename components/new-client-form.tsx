"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Phone, GraduationCap, Award, Upload, X, Download, Eye } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (clientData: any) => void
  onCancel: () => void
  isLoading?: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
  uploadDate: string
  url?: string
}

export function NewClientForm({ onClientCreated, onCancel, isLoading = false }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    participantId: "",
    program: "",
    status: "Active", // Default status set to Active
    enrollmentDate: new Date().toISOString().split("T")[0],
    dateOfBirth: "",
    phone: "",
    cellPhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    caseManager: "",
    responsibleEC: "",
    requiredHours: "",
    caoNumber: "",
    // Education fields
    educationLevel: "",
    graduationYear: "",
    schoolName: "",
    fieldOfStudy: "",
    educationNotes: "",
    currentlyEnrolled: "",
    gpa: "",
    // Certification fields
    certifications: "",
    licenses: "",
    industryCertifications: "",
    certificationStatus: "",
    certificationNotes: "",
    // Case notes
    initialCaseNote: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [showFilePreview, setShowFilePreview] = useState<UploadedFile | null>(null)

  // Generate a unique participant ID with exactly 7 digits
  const generateParticipantId = () => {
    // Generate 7 unique digits
    const digits = new Set<number>()

    // Keep generating until we have 7 unique digits
    while (digits.size < 7) {
      digits.add(Math.floor(Math.random() * 10))
    }

    // Convert to array and join to create the ID
    return Array.from(digits).join("")
  }

  // Initialize with generated participant ID on first render
  useState(() => {
    setFormData((prev) => ({
      ...prev,
      participantId: generateParticipantId(),
    }))
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || "", // Ensure value is never null
    }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: UploadedFile[] = []

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
        file: file,
        uploadDate: new Date().toISOString(),
        url: fileUrl,
      })
    }

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Clear the input
    event.target.value = ""
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter((file) => file.id !== fileId)
    })
  }

  const downloadFile = (file: UploadedFile) => {
    if (file.url) {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const viewFile = (file: UploadedFile) => {
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.firstName.trim()) newErrors.push("First Name is required")
    if (!formData.lastName.trim()) newErrors.push("Last Name is required")
    if (!formData.program.trim()) newErrors.push("Program is required")
    if (!formData.participantId.trim()) newErrors.push("Participant ID is required")

    // Participant ID validation - must be exactly 7 digits with all unique digits
    if (formData.participantId.trim()) {
      const participantId = formData.participantId.trim()

      // Check if it's exactly 7 digits
      if (!/^\d{7}$/.test(participantId)) {
        newErrors.push("Participant ID must be exactly 7 digits")
      } else {
        // Check if all digits are unique
        const digits = participantId.split("")
        const uniqueDigits = new Set(digits)
        if (uniqueDigits.size !== 7) {
          newErrors.push("Participant ID must contain 7 unique digits (no repeated digits)")
        }
      }
    }

    // Email validation
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.push("Please enter a valid email address")
    }

    // Phone validation
    if (formData.phone.trim() && !/^[\d\s\-()]+$/.test(formData.phone.trim())) {
      newErrors.push("Please enter a valid phone number")
    }

    // ZIP code validation
    if (formData.zipCode.trim() && !/^\d{5}(-\d{4})?$/.test(formData.zipCode.trim())) {
      newErrors.push("Please enter a valid ZIP code")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Prepare client data with case notes and certification files if provided
    const clientData = {
      ...formData,
      caseNotes: formData.initialCaseNote.trim()
        ? [
            {
              id: `note-${Date.now()}`,
              note: formData.initialCaseNote.trim(),
              date: new Date().toISOString(),
              author: formData.caseManager || "System",
            },
          ]
        : [],
      certificationFiles: uploadedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: file.uploadDate,
        url: file.url,
      })),
    }

    onClientCreated(clientData)
  }

  const regenerateParticipantId = () => {
    setFormData((prev) => ({
      ...prev,
      participantId: generateParticipantId(),
    }))
  }

  const programOptions = [
    "EARN",
    "Job Readiness",
    "YOUTH",
    "WIOA Adult",
    "WIOA Dislocated Worker",
    "TANF",
    "SNAP E&T",
    "Reentry",
    "Veterans Program",
    "Senior Community Service",
    "Other",
  ]

  const statusOptions = ["Active", "Inactive", "Pending", "Completed", "Withdrawn"]

  const educationLevels = [
    "Less than High School",
    "High School Diploma/GED",
    "Some College",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree",
    "Professional Degree",
  ]

  const certificationStatuses = ["Not Started", "In Progress", "Completed", "Expired", "Pending Renewal"]

  return (
    <div className="min-h-screen bg-gray-100">
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
                  <div className="w-16 h-16 mx-auto text-gray-400 mb-4 text-4xl">
                    {getFileIcon(showFilePreview.type)}
                  </div>
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

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back Button */}
            <Button
              onClick={onCancel}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            {/* Center - Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
              <p className="text-sm text-gray-600">Add a new client to the system</p>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Client"}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="text-gray-600 bg-transparent"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
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
              <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participantId">Participant ID *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="participantId"
                        value={formData.participantId}
                        onChange={(e) => handleInputChange("participantId", e.target.value)}
                        className="font-mono"
                        disabled={isLoading}
                        placeholder="7 unique digits"
                        maxLength={7}
                      />
                      <Button
                        type="button"
                        onClick={regenerateParticipantId}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                      >
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be exactly 7 unique digits</p>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program">Program *</Label>
                    <Select
                      value={formData.program}
                      onValueChange={(value) => handleInputChange("program", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programOptions.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caseManager">Case Manager</Label>
                    <Input
                      id="caseManager"
                      value={formData.caseManager}
                      onChange={(e) => handleInputChange("caseManager", e.target.value)}
                      placeholder="Enter case manager name"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsibleEC">Responsible EC</Label>
                    <Input
                      id="responsibleEC"
                      value={formData.responsibleEC}
                      onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                      placeholder="Enter responsible EC"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cellPhone">Cell Phone</Label>
                    <Input
                      id="cellPhone"
                      value={formData.cellPhone}
                      onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="client@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main Street"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Philadelphia"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange("state", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="PA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="NJ">NJ</SelectItem>
                        <SelectItem value="DE">DE</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="19102"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Contact Name"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Education Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="educationLevel">Highest Education Level</Label>
                    <Select
                      value={formData.educationLevel}
                      onValueChange={(value) => handleInputChange("educationLevel", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      placeholder="2020"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolName">School/Institution Name</Label>
                    <Input
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={(e) => handleInputChange("schoolName", e.target.value)}
                      placeholder="University Name"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study/Major</Label>
                    <Input
                      id="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                      placeholder="Business Administration"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="educationNotes">Additional Education Details</Label>
                  <Textarea
                    id="educationNotes"
                    value={formData.educationNotes}
                    onChange={(e) => handleInputChange("educationNotes", e.target.value)}
                    placeholder="Enter any additional education details, honors, relevant coursework, etc."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentlyEnrolled">Currently Enrolled</Label>
                    <Select
                      value={formData.currentlyEnrolled}
                      onValueChange={(value) => handleInputChange("currentlyEnrolled", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA (if applicable)</Label>
                    <Input
                      id="gpa"
                      value={formData.gpa}
                      onChange={(e) => handleInputChange("gpa", e.target.value)}
                      placeholder="3.5"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Licenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                  Certifications & Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="certifications">Professional Certifications</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange("certifications", e.target.value)}
                      placeholder="List professional certifications (e.g., CompTIA A+, Microsoft Office Specialist, etc.)"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenses">Licenses</Label>
                    <Textarea
                      id="licenses"
                      value={formData.licenses}
                      onChange={(e) => handleInputChange("licenses", e.target.value)}
                      placeholder="List professional licenses (e.g., Driver's License, CDL, Professional License, etc.)"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industryCertifications">Industry Certifications</Label>
                    <Input
                      id="industryCertifications"
                      value={formData.industryCertifications}
                      onChange={(e) => handleInputChange("industryCertifications", e.target.value)}
                      placeholder="e.g., OSHA 10, Food Handler's License, etc."
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificationStatus">Certification Status</Label>
                    <Select
                      value={formData.certificationStatus}
                      onValueChange={(value) => handleInputChange("certificationStatus", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {certificationStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <Label>Certification Documents</Label>
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
                        disabled={isLoading}
                      />
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}):</Label>
                        {uploadedFiles.map((file) => (
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
                              <Button
                                type="button"
                                onClick={() => removeFile(file.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                disabled={isLoading}
                                title="Remove file"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="certificationNotes">Certification Notes</Label>
                  <Textarea
                    id="certificationNotes"
                    value={formData.certificationNotes}
                    onChange={(e) => handleInputChange("certificationNotes", e.target.value)}
                    placeholder="Additional notes about certifications or licenses"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Initial Case Note */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Initial Case Note (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="initialCaseNote">Case Note</Label>
                  <Textarea
                    id="initialCaseNote"
                    value={formData.initialCaseNote}
                    onChange={(e) => handleInputChange("initialCaseNote", e.target.value)}
                    placeholder="Enter initial case note or intake information..."
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
