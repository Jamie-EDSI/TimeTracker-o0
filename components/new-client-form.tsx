"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, X, User, Phone, GraduationCap, FileText, Upload } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (clientData: any) => void
  onCancel: () => void
  isLoading: boolean
}

// Generate a random participant ID
const generateParticipantId = () => {
  return Math.floor(2900000 + Math.random() * 100000).toString()
}

export function NewClientForm({ onClientCreated, onCancel, isLoading }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    participantId: generateParticipantId(),
    program: "",
    status: "Active",
    enrollmentDate: new Date().toISOString().split("T")[0],
    phone: "",
    cellPhone: "",
    email: "",
    address: "",
    city: "",
    state: "PA",
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

  const [errors, setErrors] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.firstName.trim()) newErrors.push("First Name is required")
    if (!formData.lastName.trim()) newErrors.push("Last Name is required")
    if (!formData.program.trim()) newErrors.push("Program is required")

    // Email validation
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.push("Please enter a valid email address")
    }

    // Phone validation - allow various formats
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

    // Create client data with initial case note
    const clientDataWithCaseNotes = {
      ...formData,
      caseNotes: [
        {
          id: `note_${Date.now()}`,
          note: "Client record created. Initial enrollment completed.",
          date: new Date().toISOString(),
          author: "System",
        },
      ],
    }

    onClientCreated(clientDataWithCaseNotes)
  }

  const handleRegenerateId = () => {
    setFormData((prev) => ({
      ...prev,
      participantId: generateParticipantId(),
    }))
  }

  const allStates = [
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
              <p className="text-gray-600">Add a new client to the system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
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

      {/* Form Content */}
      <div className="p-6">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-medium text-red-800 mb-2">Please correct the following errors:</h3>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
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
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.some((e) => e.includes("First Name")) ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.some((e) => e.includes("Last Name")) ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="participantId">Participant ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="participantId"
                          value={formData.participantId}
                          onChange={(e) => handleInputChange("participantId", e.target.value)}
                          className="font-mono"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRegenerateId}
                          disabled={isLoading}
                          className="whitespace-nowrap bg-transparent"
                        >
                          Regenerate
                        </Button>
                      </div>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className={errors.some((e) => e.includes("phone number")) ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cellPhone">Cell Phone</Label>
                      <Input
                        id="cellPhone"
                        type="tel"
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
                      className={errors.some((e) => e.includes("email")) ? "border-red-500" : ""}
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
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
                        className={errors.some((e) => e.includes("ZIP code")) ? "border-red-500" : ""}
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
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                        disabled={isLoading}
                      />
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
                    <Label htmlFor="program">Program *</Label>
                    <Select
                      value={formData.program}
                      onValueChange={(value) => handleInputChange("program", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className={errors.some((e) => e.includes("Program")) ? "border-red-500" : ""}>
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
                  </div>

                  <div>
                    <Label htmlFor="caseManager">Case Manager</Label>
                    <Select
                      value={formData.caseManager}
                      onValueChange={(value) => handleInputChange("caseManager", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select case manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brown, Lisa">Brown, Lisa</SelectItem>
                        <SelectItem value="Smith, John">Smith, John</SelectItem>
                        <SelectItem value="Johnson, Mary">Johnson, Mary</SelectItem>
                        <SelectItem value="Davis, Sarah">Davis, Sarah</SelectItem>
                        <SelectItem value="Wilson, Michael">Wilson, Michael</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="responsibleEC">Responsible EC</Label>
                      <Input
                        id="responsibleEC"
                        value={formData.responsibleEC}
                        onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                        placeholder="Employment Counselor"
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
                        placeholder="40"
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
                      placeholder="CAO-2023-001"
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Education Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
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
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="gpa">GPA (if applicable)</Label>
                      <Input
                        id="gpa"
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange("gpa", e.target.value)}
                        placeholder="3.5"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
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
                          <SelectItem value="Current">Current</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Renewal Required">Renewal Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <Label className="mb-3 block">Certification Documents</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        id="certification-upload"
                        disabled={isLoading}
                        onChange={(e) => {
                          // Handle file upload logic here
                          const files = Array.from(e.target.files || [])
                          console.log("Uploaded files:", files)
                          // In a real application, you would upload these files to a server
                        }}
                      />
                      <label
                        htmlFor="certification-upload"
                        className={`cursor-pointer ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Click to upload certification documents</span>
                          <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</span>
                        </div>
                      </label>
                    </div>
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Creating Client..." : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
