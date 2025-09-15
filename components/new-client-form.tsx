"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, User, Phone, GraduationCap, FileText, Upload, Trash2 } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (clientData: any) => void
  onCancel: () => void
  isLoading: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

export function NewClientForm({ onClientCreated, onCancel, isLoading }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    participantId: "",
    program: "",
    status: "Active",
    enrollmentDate: new Date().toISOString().split("T")[0],
    phone: "",
    cellPhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
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
    currentlyEnrolled: "No",
    gpa: "",
    // Certification fields
    certifications: "",
    licenses: "",
    industryCertifications: "",
    certificationStatus: "",
    certificationNotes: "",
  })

  const [caseNote, setCaseNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const generateParticipantId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `PID${timestamp}${random}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const newFiles: UploadedFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type (documents only)
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
          "image/gif",
        ]

        if (!allowedTypes.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            fileUpload: `File type not supported: ${file.name}`,
          }))
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            fileUpload: `File too large: ${file.name} (max 5MB)`,
          }))
          continue
        }

        // Create file object (in a real app, you'd upload to a server/cloud storage)
        const uploadedFile: UploadedFile = {
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // Temporary URL for preview
        }

        newFiles.push(uploadedFile)
      }

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Clear any previous upload errors
      if (errors.fileUpload) {
        setErrors((prev) => ({
          ...prev,
          fileUpload: "",
        }))
      }
    } catch (error) {
      console.error("File upload error:", error)
      setErrors((prev) => ({
        ...prev,
        fileUpload: "Failed to upload files. Please try again.",
      }))
    } finally {
      setIsUploading(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.program.trim()) newErrors.program = "Program is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.caseManager.trim()) newErrors.caseManager = "Case manager is required"

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    if (formData.phone && !/^[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // ZIP code validation
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Generate participant ID if not provided
    const participantId = formData.participantId || generateParticipantId()

    const clientData = {
      ...formData,
      participantId,
      uploadedFiles: uploadedFiles,
      caseNotes: caseNote.trim()
        ? [
            {
              id: `temp_${Date.now()}`,
              note: caseNote.trim(),
              date: new Date().toISOString(),
              author: "Current User",
            },
          ]
        : [],
    }

    onClientCreated(clientData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2" disabled={isLoading}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Creating..." : "Create Client"}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-300 bg-red-50" : ""}
                      disabled={isLoading}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-300 bg-red-50" : ""}
                      disabled={isLoading}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participantId">Participant ID</Label>
                    <Input
                      id="participantId"
                      value={formData.participantId}
                      onChange={(e) => handleInputChange("participantId", e.target.value)}
                      placeholder="Auto-generated if empty"
                      className="font-mono"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className={errors.dateOfBirth ? "border-red-300 bg-red-50" : ""}
                      disabled={isLoading}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
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
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-300 bg-red-50" : ""}
                      disabled={isLoading}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cellPhone">Cell Phone</Label>
                    <Input
                      id="cellPhone"
                      type="tel"
                      value={formData.cellPhone}
                      onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-300 bg-red-50" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
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
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className={errors.zipCode ? "border-red-300 bg-red-50" : ""}
                      disabled={isLoading}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="program">
                    Program <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => handleInputChange("program", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.program ? "border-red-300 bg-red-50" : ""}>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                      <SelectItem value="EARN">EARN</SelectItem>
                      <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                      <SelectItem value="YOUTH">YOUTH</SelectItem>
                      <SelectItem value="Next Step Program">Next Step Program</SelectItem>
                      <SelectItem value="Career Development">Career Development</SelectItem>
                      <SelectItem value="Skills Training">Skills Training</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.program && <p className="text-red-500 text-sm mt-1">{errors.program}</p>}
                </div>

                <div>
                  <Label htmlFor="caseManager">
                    Case Manager <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="caseManager"
                    value={formData.caseManager}
                    onChange={(e) => handleInputChange("caseManager", e.target.value)}
                    className={errors.caseManager ? "border-red-300 bg-red-50" : ""}
                    disabled={isLoading}
                  />
                  {errors.caseManager && <p className="text-red-500 text-sm mt-1">{errors.caseManager}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsibleEC">Responsible EC</Label>
                    <Input
                      id="responsibleEC"
                      value={formData.responsibleEC}
                      onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requiredHours">Required Hours</Label>
                    <Input
                      id="requiredHours"
                      type="number"
                      value={formData.requiredHours}
                      onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="caoNumber">CAO Number</Label>
                  <Input
                    id="caoNumber"
                    value={formData.caoNumber}
                    onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Education Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <SelectItem value="Less than High School">Less than High School</SelectItem>
                      <SelectItem value="High School Diploma/GED">High School Diploma/GED</SelectItem>
                      <SelectItem value="Some College">Some College</SelectItem>
                      <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                      <SelectItem value="Doctoral Degree">Doctoral Degree</SelectItem>
                      <SelectItem value="Professional Degree">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      placeholder="e.g., 2020"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      min="0"
                      max="4"
                      step="0.01"
                      value={formData.gpa}
                      onChange={(e) => handleInputChange("gpa", e.target.value)}
                      placeholder="e.g., 3.5"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="schoolName">School/Institution Name</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange("schoolName", e.target.value)}
                    placeholder="Enter school or institution name"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="fieldOfStudy">Field of Study/Major</Label>
                  <Input
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                    placeholder="Enter field of study or major"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="currentlyEnrolled">Currently Enrolled</Label>
                  <Select
                    value={formData.currentlyEnrolled}
                    onValueChange={(value) => handleInputChange("currentlyEnrolled", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
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
              </CardContent>
            </Card>

            {/* Certifications & Licenses with File Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Certifications & Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="certifications">Professional Certifications</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                    placeholder="List professional certifications (e.g., CompTIA A+, Microsoft Office Specialist, etc.)"
                    rows={2}
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
                    rows={2}
                    disabled={isLoading}
                  />
                </div>

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
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Renewal Required">Renewal Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="certificationNotes">Certification Notes</Label>
                  <Textarea
                    id="certificationNotes"
                    value={formData.certificationNotes}
                    onChange={(e) => handleInputChange("certificationNotes", e.target.value)}
                    placeholder="Additional notes about certifications, renewal dates, etc."
                    rows={2}
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload Section */}
                <div className="border-t pt-4">
                  <Label htmlFor="fileUpload">Upload Certification Documents</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="fileUpload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> certification documents
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (MAX. 5MB each)</p>
                        </div>
                        <input
                          id="fileUpload"
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                          onChange={handleFileUpload}
                          disabled={isLoading || isUploading}
                        />
                      </label>
                    </div>

                    {errors.fileUpload && <p className="text-red-500 text-sm mt-1">{errors.fileUpload}</p>}

                    {isUploading && <div className="mt-2 text-sm text-blue-600">Uploading files...</div>}
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Uploaded Documents ({uploadedFiles.length})
                      </Label>
                      <div className="mt-2 space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Initial Case Note */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Initial Case Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="caseNote">Case Note (Optional)</Label>
                  <Textarea
                    id="caseNote"
                    value={caseNote}
                    onChange={(e) => setCaseNote(e.target.value)}
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
