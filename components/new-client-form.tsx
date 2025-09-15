"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { clientsApi, type Client } from "@/lib/supabase"

interface NewClientFormProps {
  onClientCreated: (client: Client) => void
  onCancel: () => void
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

export function NewClientForm({ onClientCreated, onCancel }: NewClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    participant_id: "",
    program: "",
    status: "Active",
    enrollment_date: new Date().toISOString().split("T")[0],
    phone: "",
    cell_phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    date_of_birth: "",
    emergency_contact: "",
    emergency_phone: "",
    case_manager: "",
    responsible_ec: "",
    required_hours: "",
    cao_number: "",
    education_level: "",
    graduation_year: "",
    school_name: "",
    field_of_study: "",
    education_notes: "",
    currently_enrolled: "",
    gpa: "",
    certifications: "",
    licenses: "",
    industry_certifications: "",
    certification_status: "",
    certification_notes: "",
  })

  const generateParticipantId = () => {
    const id = Math.floor(Math.random() * 9000000) + 1000000
    setFormData((prev) => ({ ...prev, participant_id: id.toString() }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = () => {
    const required = ["first_name", "last_name", "participant_id", "program", "phone", "email", "case_manager"]
    const missing = required.filter((field) => !formData[field as keyof typeof formData])

    if (missing.length > 0) {
      setError(`Please fill in required fields: ${missing.join(", ").replace(/_/g, " ")}`)
      return false
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    return true
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const clientData = {
        ...formData,
        required_hours: formData.required_hours ? Number.parseInt(formData.required_hours) : undefined,
        graduation_year: formData.graduation_year ? Number.parseInt(formData.graduation_year) : undefined,
        gpa: formData.gpa ? Number.parseFloat(formData.gpa) : undefined,
      }

      const newClient = await clientsApi.create(clientData)
      onClientCreated(newClient)
    } catch (err: any) {
      console.error("Error creating client:", err)
      setError(err.message || "Failed to create client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Client</h1>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="participant_id">Participant ID *</Label>
              <div className="flex gap-2">
                <Input
                  id="participant_id"
                  value={formData.participant_id}
                  onChange={(e) => handleInputChange("participant_id", e.target.value)}
                  required
                />
                <Button type="button" variant="outline" onClick={generateParticipantId}>
                  Generate
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="program">Program *</Label>
              <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
            </div>
            <div>
              <Label htmlFor="enrollment_date">Enrollment Date</Label>
              <Input
                id="enrollment_date"
                type="date"
                value={formData.enrollment_date}
                onChange={(e) => handleInputChange("enrollment_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="case_manager">Case Manager *</Label>
              <Select value={formData.case_manager} onValueChange={(value) => handleInputChange("case_manager", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case manager" />
                </SelectTrigger>
                <SelectContent>
                  {CASE_MANAGERS.map((manager) => (
                    <SelectItem key={manager} value={manager}>
                      {manager}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cell_phone">Cell Phone</Label>
              <Input
                id="cell_phone"
                value={formData.cell_phone}
                onChange={(e) => handleInputChange("cell_phone", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
              />
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
              <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_phone"
                value={formData.emergency_phone}
                onChange={(e) => handleInputChange("emergency_phone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Program Details */}
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsible_ec">Responsible EC</Label>
              <Input
                id="responsible_ec"
                value={formData.responsible_ec}
                onChange={(e) => handleInputChange("responsible_ec", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="required_hours">Required Hours</Label>
              <Input
                id="required_hours"
                type="number"
                value={formData.required_hours}
                onChange={(e) => handleInputChange("required_hours", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cao_number">CAO Number</Label>
              <Input
                id="cao_number"
                value={formData.cao_number}
                onChange={(e) => handleInputChange("cao_number", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="education_level">Education Level</Label>
              <Select
                value={formData.education_level}
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
            </div>
            <div>
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                id="graduation_year"
                type="number"
                min="1950"
                max="2030"
                value={formData.graduation_year}
                onChange={(e) => handleInputChange("graduation_year", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="school_name">School Name</Label>
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => handleInputChange("school_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="field_of_study">Field of Study</Label>
              <Input
                id="field_of_study"
                value={formData.field_of_study}
                onChange={(e) => handleInputChange("field_of_study", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="currently_enrolled">Currently Enrolled</Label>
              <Select
                value={formData.currently_enrolled}
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
            </div>
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => handleInputChange("gpa", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="education_notes">Education Notes</Label>
              <Textarea
                id="education_notes"
                value={formData.education_notes}
                onChange={(e) => handleInputChange("education_notes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Certifications and Licenses */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications and Licenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange("certifications", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="licenses">Licenses</Label>
                <Textarea
                  id="licenses"
                  value={formData.licenses}
                  onChange={(e) => handleInputChange("licenses", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="industry_certifications">Industry Certifications</Label>
                <Textarea
                  id="industry_certifications"
                  value={formData.industry_certifications}
                  onChange={(e) => handleInputChange("industry_certifications", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="certification_status">Certification Status</Label>
                <Select
                  value={formData.certification_status}
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
              </div>
            </div>

            {/* File Upload Section */}
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
                    <span className="mt-1 block text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 5MB each</span>
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

            <div className="md:col-span-2">
              <Label htmlFor="certification_notes">Certification Notes</Label>
              <Textarea
                id="certification_notes"
                value={formData.certification_notes}
                onChange={(e) => handleInputChange("certification_notes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Client"}
          </Button>
        </div>
      </form>
    </div>
  )
}
