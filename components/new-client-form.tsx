"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save, X, User, AlertCircle } from "lucide-react"

interface NewClientFormProps {
  onBack: () => void
}

export function NewClientForm({ onBack }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    ssn: "",
    gender: "",
    ethnicity: "",
    race: "",
    veteranStatus: "",
    disabilityStatus: "",

    // Contact Information
    address: "",
    city: "",
    state: "PA",
    zipCode: "",
    phone: "",
    cellPhone: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelationship: "",

    // Program Information
    program: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    caseManager: "",
    responsibleEC: "",
    requiredHours: "",
    caoNumber: "",
    status: "Active", // Default to Active

    // Employment Information
    currentlyEmployed: "",
    employer: "",
    jobTitle: "",
    workSchedule: "",
    hourlyWage: "",

    // Education Information
    highestEducation: "",
    schoolName: "",
    graduationYear: "",
    hasGED: "",

    // Additional Information
    transportationMethod: "",
    hasDriversLicense: "",
    hasReliableTransportation: "",
    childcareNeeds: "",
    housingStatus: "",
    notes: "",
  })

  const [activeTab, setActiveTab] = useState("personal")
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validateTab = (tab: string) => {
    const newErrors: Record<string, string> = {}

    if (tab === "personal") {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.ssn.trim()) newErrors.ssn = "SSN is required"
    }

    if (tab === "contact") {
      if (!formData.address.trim()) newErrors.address = "Address is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
      if (!formData.phone.trim() && !formData.cellPhone.trim()) {
        newErrors.phone = "At least one phone number is required"
      }
    }

    if (tab === "program") {
      if (!formData.program) newErrors.program = "Program is required"
      if (!formData.enrollmentDate) newErrors.enrollmentDate = "Enrollment date is required"
      if (!formData.caseManager.trim()) newErrors.caseManager = "Case manager is required"
      if (!formData.status) newErrors.status = "Status is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTabChange = (newTab: string) => {
    if (validateTab(activeTab)) {
      setActiveTab(newTab)
    }
  }

  const handleSubmit = () => {
    // Validate all tabs
    const allTabs = ["personal", "contact", "program"]
    let allValid = true

    for (const tab of allTabs) {
      if (!validateTab(tab)) {
        allValid = false
      }
    }

    if (allValid) {
      console.log("Form submitted:", formData)
      // Here you would typically send the data to your backend
      alert("Client created successfully!")
      onBack()
    } else {
      alert("Please fill in all required fields")
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Inactive</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onBack}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Client
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className={errors.dateOfBirth ? "border-red-500" : ""}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ssn">Social Security Number *</Label>
                      <Input
                        id="ssn"
                        value={formData.ssn}
                        onChange={(e) => handleInputChange("ssn", e.target.value)}
                        placeholder="XXX-XX-XXXX"
                        className={errors.ssn ? "border-red-500" : ""}
                      />
                      {errors.ssn && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.ssn}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Select
                        value={formData.ethnicity}
                        onValueChange={(value) => handleInputChange("ethnicity", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hispanic-latino">Hispanic or Latino</SelectItem>
                          <SelectItem value="not-hispanic-latino">Not Hispanic or Latino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="race">Race</Label>
                      <Select value={formData.race} onValueChange={(value) => handleInputChange("race", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select race" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="black-african-american">Black or African American</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="american-indian-alaska-native">
                            American Indian or Alaska Native
                          </SelectItem>
                          <SelectItem value="native-hawaiian-pacific-islander">
                            Native Hawaiian or Other Pacific Islander
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="veteranStatus">Veteran Status</Label>
                      <Select
                        value={formData.veteranStatus}
                        onValueChange={(value) => handleInputChange("veteranStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select veteran status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veteran">Veteran</SelectItem>
                          <SelectItem value="not-veteran">Not a Veteran</SelectItem>
                          <SelectItem value="spouse-of-veteran">Spouse of Veteran</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="disabilityStatus">Disability Status</Label>
                      <Select
                        value={formData.disabilityStatus}
                        onValueChange={(value) => handleInputChange("disabilityStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select disability status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="NJ">New Jersey</SelectItem>
                          <SelectItem value="DE">Delaware</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
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
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="phone">Home Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(XXX) XXX-XXXX"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cellPhone">Cell Phone</Label>
                      <Input
                        id="cellPhone"
                        value={formData.cellPhone}
                        onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          placeholder="(XXX) XXX-XXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyRelationship">Relationship</Label>
                        <Input
                          id="emergencyRelationship"
                          value={formData.emergencyRelationship}
                          onChange={(e) => handleInputChange("emergencyRelationship", e.target.value)}
                          placeholder="e.g., Spouse, Parent, Friend"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Program Information Tab */}
              <TabsContent value="program" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="program">Program *</Label>
                      <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                        <SelectTrigger className={errors.program ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EARN">EARN</SelectItem>
                          <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                          <SelectItem value="YOUTH">YOUTH</SelectItem>
                          <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                          <SelectItem value="Career Development">Career Development</SelectItem>
                          <SelectItem value="Next Step Program">Next Step Program</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.program && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.program}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.status}
                        </p>
                      )}
                      {formData.status && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Preview: </span>
                          {getStatusBadge(formData.status)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                      <Input
                        id="enrollmentDate"
                        type="date"
                        value={formData.enrollmentDate}
                        onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                        className={errors.enrollmentDate ? "border-red-500" : ""}
                      />
                      {errors.enrollmentDate && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.enrollmentDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="requiredHours">Required Hours</Label>
                      <Input
                        id="requiredHours"
                        type="number"
                        value={formData.requiredHours}
                        onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                        placeholder="e.g., 40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caseManager">Case Manager *</Label>
                      <Input
                        id="caseManager"
                        value={formData.caseManager}
                        onChange={(e) => handleInputChange("caseManager", e.target.value)}
                        placeholder="e.g., Smith, John"
                        className={errors.caseManager ? "border-red-500" : ""}
                      />
                      {errors.caseManager && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.caseManager}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="responsibleEC">Responsible EC</Label>
                      <Input
                        id="responsibleEC"
                        value={formData.responsibleEC}
                        onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                        placeholder="e.g., Johnson, Sarah"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caoNumber">CAO Number</Label>
                      <Input
                        id="caoNumber"
                        value={formData.caoNumber}
                        onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                        placeholder="e.g., CAO123456"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Employment Information Tab */}
              <TabsContent value="employment" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentlyEmployed">Currently Employed</Label>
                      <Select
                        value={formData.currentlyEmployed}
                        onValueChange={(value) => handleInputChange("currentlyEmployed", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.currentlyEmployed === "yes" && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-semibold">Current Employment Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="employer">Employer Name</Label>
                          <Input
                            id="employer"
                            value={formData.employer}
                            onChange={(e) => handleInputChange("employer", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="workSchedule">Work Schedule</Label>
                          <Input
                            id="workSchedule"
                            value={formData.workSchedule}
                            onChange={(e) => handleInputChange("workSchedule", e.target.value)}
                            placeholder="e.g., Monday-Friday 9AM-5PM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hourlyWage">Hourly Wage</Label>
                          <Input
                            id="hourlyWage"
                            type="number"
                            step="0.01"
                            value={formData.hourlyWage}
                            onChange={(e) => handleInputChange("hourlyWage", e.target.value)}
                            placeholder="e.g., 15.00"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="highestEducation">Highest Education Level</Label>
                      <Select
                        value={formData.highestEducation}
                        onValueChange={(value) => handleInputChange("highestEducation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-high-school">Less than High School</SelectItem>
                          <SelectItem value="high-school-diploma">High School Diploma</SelectItem>
                          <SelectItem value="ged">GED</SelectItem>
                          <SelectItem value="some-college">Some College</SelectItem>
                          <SelectItem value="associates-degree">Associate's Degree</SelectItem>
                          <SelectItem value="bachelors-degree">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters-degree">Master's Degree</SelectItem>
                          <SelectItem value="doctoral-degree">Doctoral Degree</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hasDriversLicense">Has Driver's License</Label>
                      <Select
                        value={formData.hasDriversLicense}
                        onValueChange={(value) => handleInputChange("hasDriversLicense", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="transportationMethod">Primary Transportation</Label>
                      <Select
                        value={formData.transportationMethod}
                        onValueChange={(value) => handleInputChange("transportationMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transportation method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="own-vehicle">Own Vehicle</SelectItem>
                          <SelectItem value="public-transportation">Public Transportation</SelectItem>
                          <SelectItem value="family-friends">Family/Friends</SelectItem>
                          <SelectItem value="walking">Walking</SelectItem>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                          <SelectItem value="rideshare">Rideshare/Taxi</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hasReliableTransportation">Has Reliable Transportation</Label>
                      <Select
                        value={formData.hasReliableTransportation}
                        onValueChange={(value) => handleInputChange("hasReliableTransportation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="sometimes">Sometimes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="childcareNeeds">Childcare Needs</Label>
                      <Select
                        value={formData.childcareNeeds}
                        onValueChange={(value) => handleInputChange("childcareNeeds", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="after-school">After School</SelectItem>
                          <SelectItem value="summer">Summer Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="housingStatus">Housing Status</Label>
                      <Select
                        value={formData.housingStatus}
                        onValueChange={(value) => handleInputChange("housingStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select housing status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="own">Own Home</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="family">Living with Family</SelectItem>
                          <SelectItem value="temporary">Temporary Housing</SelectItem>
                          <SelectItem value="homeless">Homeless</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any additional information about the client..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="text-sm text-gray-600">* Required fields</div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Create Client
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
