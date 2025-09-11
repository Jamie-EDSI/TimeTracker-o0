"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, User, Phone, GraduationCap, Shield, FileText } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (client: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function NewClientForm({ onClientCreated, onCancel, isLoading = false }: NewClientFormProps) {
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
    notes: "",
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const generatePID = () => {
    // Generate a more robust PID with timestamp and random components
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${timestamp}${random}`
  }

  useState(() => {
    setFormData((prev) => ({
      ...prev,
      participantId: generatePID(),
    }))
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Real-time validation for specific fields
    validateField(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    try {
      // Comprehensive validation
      const errors = validateAllFields()

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)

        // Focus on first error field
        const firstErrorField = Object.keys(errors)[0]
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.focus()
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }

        return
      }

      // Create clean data object with proper formatting
      const clientData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        participantId: formData.participantId,
        program: formData.program,
        status: formData.status,
        enrollmentDate: formData.enrollmentDate,
        phone: formData.phone.trim(),
        cellPhone: formData.cellPhone.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zipCode: formData.zipCode.trim(),
        dateOfBirth: formData.dateOfBirth,
        emergencyContact: formData.emergencyContact.trim(),
        emergencyPhone: formData.emergencyPhone.trim(),
        caseManager: formData.caseManager.trim(),
        responsibleEC: formData.responsibleEC.trim(),
        requiredHours: formData.requiredHours.trim(),
        caoNumber: formData.caoNumber.trim(),
        notes: formData.notes.trim(),
        educationLevel: formData.educationLevel.trim(),
        graduationYear: formData.graduationYear.trim(),
        schoolName: formData.schoolName.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        educationNotes: formData.educationNotes.trim(),
        currentlyEnrolled: formData.currentlyEnrolled.trim(),
        gpa: formData.gpa.trim(),
        certifications: formData.certifications.trim(),
        licenses: formData.licenses.trim(),
        industryCertifications: formData.industryCertifications.trim(),
        certificationStatus: formData.certificationStatus.trim(),
        certificationNotes: formData.certificationNotes.trim(),
      }

      // Call the parent handler with validated and formatted data
      await onClientCreated(clientData)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error creating the client. Please try again.")
    }
  }

  const handleClose = () => {
    if (isLoading) return

    // Check if form has unsaved changes
    const hasChanges = Object.values(formData).some(
      (value) => value.trim() !== "" && value !== "Active" && value !== new Date().toISOString().split("T")[0],
    )

    if (hasChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close this form? All data will be lost.",
      )
      if (!confirmClose) return
    }

    try {
      onCancel()
    } catch (error) {
      console.error("Error closing form:", error)
    }
  }

  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors }

    switch (field) {
      case "firstName":
      case "lastName":
        if (value.trim() && value.trim().length < 2) {
          errors[field] = "Must be at least 2 characters long"
        } else if (value.trim() && !/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          errors[field] = "Only letters, spaces, hyphens, and apostrophes allowed"
        } else {
          delete errors[field]
        }
        break

      case "email":
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors.email = "Please enter a valid email address"
        } else {
          delete errors.email
        }
        break

      case "phone":
      case "cellPhone":
      case "emergencyPhone":
        // Remove strict formatting - just check if it's not empty when provided
        if (value.trim() && value.trim().length < 3) {
          errors[field] = "Phone number too short"
        } else {
          delete errors[field]
        }
        break

      case "zipCode":
        if (value.trim() && !/^\d{5}(-\d{4})?$/.test(value.trim())) {
          errors.zipCode = "Please enter a valid ZIP code (12345 or 12345-6789)"
        } else {
          delete errors.zipCode
        }
        break

      case "dateOfBirth":
        if (value.trim()) {
          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()

          if (birthDate > today) {
            errors.dateOfBirth = "Birth date cannot be in the future"
          } else if (age > 120) {
            errors.dateOfBirth = "Please enter a valid birth date"
          } else {
            delete errors.dateOfBirth
          }
        }
        break

      case "requiredHours":
        if (value.trim() && (isNaN(Number(value)) || Number(value) < 0)) {
          errors.requiredHours = "Please enter a valid number of hours"
        } else {
          delete errors.requiredHours
        }
        break

      case "graduationYear":
        if (
          value.trim() &&
          (isNaN(Number(value)) || Number(value) < 1950 || Number(value) > new Date().getFullYear())
        ) {
          errors.graduationYear = "Please enter a valid graduation year"
        } else {
          delete errors.graduationYear
        }
        break

      case "gpa":
        if (value.trim() && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 4)) {
          errors.gpa = "Please enter a valid GPA between 0 and 4"
        } else {
          delete errors.gpa
        }
        break
    }

    setValidationErrors(errors)
  }

  const validateAllFields = () => {
    const errors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) errors.firstName = "First Name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required"
    if (!formData.program.trim()) errors.program = "Program is required"

    // Validate all other fields
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field as keyof typeof formData])
    })

    return { ...errors, ...validationErrors }
  }

  const usStates = [
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
            <Button variant="ghost" onClick={handleClose} className="flex items-center gap-2" disabled={isLoading}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">New Client Registration</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Client
                </>
              )}
            </Button>
            <Button onClick={handleClose} variant="outline" disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    required
                    disabled={isLoading}
                    className={validationErrors.firstName ? "border-red-500" : ""}
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    disabled={isLoading}
                    className={validationErrors.lastName ? "border-red-500" : ""}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participantId">Participant ID (PID)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="participantId"
                      value={formData.participantId}
                      readOnly
                      className="bg-gray-50 font-mono flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("participantId", generatePID())}
                      disabled={isLoading}
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
                    className={validationErrors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {validationErrors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
                  )}
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
                    placeholder="Enter phone number"
                    disabled={isLoading}
                    className={validationErrors.phone ? "border-red-500" : ""}
                  />
                  {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="cellPhone">Cell Phone</Label>
                  <Input
                    id="cellPhone"
                    type="tel"
                    value={formData.cellPhone}
                    onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                    placeholder="Enter cell phone"
                    disabled={isLoading}
                    className={validationErrors.cellPhone ? "border-red-500" : ""}
                  />
                  {validationErrors.cellPhone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.cellPhone}</p>
                  )}
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
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
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
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
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
                    disabled={isLoading}
                    className={validationErrors.zipCode ? "border-red-500" : ""}
                  />
                  {validationErrors.zipCode && <p className="text-red-500 text-xs mt-1">{validationErrors.zipCode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="John Doe"
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
                    placeholder="Enter emergency phone"
                    disabled={isLoading}
                    className={validationErrors.emergencyPhone ? "border-red-500" : ""}
                  />
                  {validationErrors.emergencyPhone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.emergencyPhone}</p>
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
                <Label htmlFor="program">Program *</Label>
                <Select
                  value={formData.program}
                  onValueChange={(value) => handleInputChange("program", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={validationErrors.program ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select program" />
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
                {validationErrors.program && <p className="text-red-500 text-xs mt-1">{validationErrors.program}</p>}
              </div>

              <div>
                <Label htmlFor="caseManager">Case Manager</Label>
                <Input
                  id="caseManager"
                  value={formData.caseManager}
                  onChange={(e) => handleInputChange("caseManager", e.target.value)}
                  placeholder="Smith, John"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requiredHours">Required Hours</Label>
                  <Input
                    id="requiredHours"
                    type="number"
                    value={formData.requiredHours}
                    onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                    placeholder="40"
                    min="0"
                    disabled={isLoading}
                    className={validationErrors.requiredHours ? "border-red-500" : ""}
                  />
                  {validationErrors.requiredHours && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.requiredHours}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="caoNumber">CAO Number</Label>
                  <Input
                    id="caoNumber"
                    value={formData.caoNumber}
                    onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                    placeholder="CAO-12345"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responsibleEC">Responsible EC</Label>
                <Input
                  id="responsibleEC"
                  value={formData.responsibleEC}
                  onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                  placeholder="Employment Counselor Name"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

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
                    placeholder="e.g., 2020"
                    disabled={isLoading}
                  />
                  {validationErrors.graduationYear && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.graduationYear}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <Label htmlFor="educationNotes">Additional Education Details</Label>
                <Textarea
                  id="educationNotes"
                  value={formData.educationNotes}
                  onChange={(e) => handleInputChange("educationNotes", e.target.value)}
                  placeholder="Enter any additional education details, honors, relevant coursework, etc."
                  className="min-h-[80px]"
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
                    placeholder="e.g., 3.5"
                    disabled={isLoading}
                    className={validationErrors.gpa ? "border-red-500" : ""}
                  />
                  {validationErrors.gpa && <p className="text-red-500 text-xs mt-1">{validationErrors.gpa}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications & Licenses */}
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
                    className="min-h-[80px]"
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
                    className="min-h-[80px]"
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
                    id="certification-upload-new"
                    disabled={isLoading}
                    onChange={(e) => {
                      // Handle file upload logic here
                      const files = Array.from(e.target.files || [])
                      console.log("Uploaded files:", files)
                      // In a real application, you would upload these files to a server
                    }}
                  />
                  <label
                    htmlFor="certification-upload-new"
                    className={`cursor-pointer ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <Label htmlFor="certificationNotes">Certification Notes</Label>
                <Textarea
                  id="certificationNotes"
                  value={formData.certificationNotes}
                  onChange={(e) => handleInputChange("certificationNotes", e.target.value)}
                  placeholder="Additional notes about certifications, renewal dates, etc."
                  className="min-h-[60px]"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter any additional notes or comments about the client..."
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
              </div>

              {/* Form Status Indicator */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">Form Status</span>
                </div>
                <p className="text-xs text-blue-700">
                  All client data will be securely stored in the database and immediately available across all reports
                  and features.
                </p>
                {Object.keys(validationErrors).length > 0 && (
                  <p className="text-xs text-red-600 mt-2">
                    Please correct {Object.keys(validationErrors).length} validation error(s) before saving.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
