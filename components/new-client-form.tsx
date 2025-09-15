"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, User, Phone, GraduationCap, Award, FileText } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (clientData: any) => void
  onCancel: () => void
  isLoading: boolean
}

export function NewClientForm({ onClientCreated, onCancel, isLoading }: NewClientFormProps) {
  const [activeTab, setActiveTab] = useState("personal")
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
    state: "PA",
    zipCode: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    caseManager: "",
    responsibleEC: "",
    requiredHours: "",
    caoNumber: "",
    educationLevel: "",
    graduationYear: "",
    schoolName: "",
    fieldOfStudy: "",
    educationNotes: "",
    currentlyEnrolled: "No",
    gpa: "",
    certifications: "",
    licenses: "",
    industryCertifications: "",
    certificationStatus: "",
    certificationNotes: "",
  })
  const [initialCaseNote, setInitialCaseNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const generateParticipantId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${timestamp}${random}`
  }

  const handleGenerateId = () => {
    const newId = generateParticipantId()
    handleInputChange("participantId", newId)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.participantId.trim()) newErrors.participantId = "Participant ID is required"
    if (!formData.program.trim()) newErrors.program = "Program is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
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

  const handleSubmit = () => {
    if (!validateForm()) {
      // Find the first tab with errors and switch to it
      const errorFields = Object.keys(errors)
      if (errorFields.some((field) => ["firstName", "lastName", "participantId", "program", "status", "enrollmentDate", "dateOfBirth", "caseManager"].includes(field))) {
        setActiveTab("personal")
      } else if (errorFields.some((field) => ["phone", "cellPhone", "email", "address", "city", "state", "zipCode", "emergencyContact", "emergencyPhone"].includes(field))) {
        setActiveTab("contact")
      } else if (errorFields.some((field) => ["educationLevel", "graduationYear", "schoolName", "fieldOfStudy", "educationNotes", "currentlyEnrolled", "gpa"].includes(field))) {
        setActiveTab("education")
      } else if (errorFields.some((field) => ["certifications", "licenses", "industryCertifications", "certificationStatus", "certificationNotes"].includes(field))) {
        setActiveTab("certifications")
      }
      return
    }

    const clientData = {
      ...formData,
      caseNotes: initialCaseNote.trim()
        ? [
            {
              id: `note_${Date.now()}`,
              note: initialCaseNote.trim(),
              date: new Date().toISOString(),
              author: "Current User",
            },
          ]
        : [],
    }

    onClientCreated(clientData)
  }

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]

  const programs = [
    "EARN",
    "Job Readiness",
    "YOUTH",
    "WIOA Adult",
    "WIOA Dislocated Worker",
    "SNAP E&T",
    "TANF",
    "Trade Adjustment Assistance",
    "Apprenticeship",
    "Other",
  ]

  const educationLevels = [
    "Less than High School",
    "High School Diploma",
    "GED",
    "Some College",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onCancel} variant="ghost" size="sm" className="flex items-center gap-2" disabled={isLoading}>
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
                <p className="text-gray-600">Add a new client to the system</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onCancel} variant="outline" disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Creating..." : "Create Client"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                  Initial Note
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className={errors.dateOfBirth ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    <div>
                      <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                      <Input
                        id="enrollmentDate"
                        type="date"
                        value={formData.enrollmentDate}
                        onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="participantId">Participant ID *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="participantId"
                          value={formData.participantId}
                          onChange={(e) => handleInputChange("participantId", e.target.value)}
                          className={errors.participantId ? "border-red-500" : ""}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          onClick={handleGenerateId}
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                        >
                          Generate
                        </Button>
                      </div>
                      {errors.participantId && <p className="text-sm text-red-500 mt-1">{errors.participantId}</p>}
                    </div>
                    <div>
                      <Label htmlFor="program">Program *</Label>
                      <Select
                        value={formData.program}
                        onValueChange={(value) => handleInputChange("program", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className={errors.program ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.program && <p className="text-sm text-red-500 mt-1">{errors.program}</p>}
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
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="caseManager">Case Manager *</Label>
                      <Input
                        id="caseManager"
                        value={formData.caseManager}
                        onChange={(e) => handleInputChange("caseManager", e.target.value)}
                        className={errors.caseManager ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.caseManager && <p className="text-sm text-red-500 mt-1">{errors.caseManager}</p>}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={errors.phone ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cellPhone">Cell Phone</Label>
                      <Input
                        id="cellPhone"
                        value={formData.cellPhone}
                        onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className={errors.address ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={errors.city ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
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
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className={errors.zipCode ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                    </div>
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
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="educationLevel">Education Level</Label>
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
                      <Label htmlFor="schoolName">School/Institution Name</Label>
                      <Input
                        id="schoolName"
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange("schoolName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Input
                        id="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        value={formData.graduationYear}
                        onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gpa">GPA</Label>
                      <Input
                        id="gpa"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange("gpa", e.target.value)}
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
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="educationNotes">Education Notes</Label>
                      <Textarea
                        id="educationNotes"
                        value={formData.educationNotes}
                        onChange={(e) => handleInputChange("educationNotes", e.target.value)}
                        rows={4}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="certifications" className="space-y-6 mt-6">
                <div className\
