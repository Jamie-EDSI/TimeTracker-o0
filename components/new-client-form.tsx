"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, User, MapPin, Phone, FileText } from "lucide-react"

interface NewClientFormProps {
  onClose: () => void
  onSave: (clientData: any) => void
}

// Function to generate unique PID
const generatePID = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return timestamp.slice(-4) + random // Creates a 7-digit unique ID
}

export function NewClientForm({ onClose, onSave }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    participantId: generatePID(),
    firstName: "",
    middleInitial: "",
    lastName: "",
    ssn: "",
    dateOfBirth: "",
    gender: "",
    ethnicity: "",
    education: "",
    criminalRecord: "",
    childrenUnderAge6: "",
    caseManager: "",
    economicallyDisadvantaged: "",
    disabled: "",
    veteran: "",
    driversLicense: "",
    housingIssue: "",
    passedDrugTest: "",

    // Program Information
    enrollmentDate: new Date().toISOString().split("T")[0], // Today's date
    eligibilityDate: "",
    county: "",
    program: "",
    location: "",
    responsibleEC: "",
    instructor: "",
    jobDeveloper: "",
    enrollmentActivityCode: "",
    requiredHours: "",
    primaryKeyword: "",
    secondaryKeyword: "",

    // Contact Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    homePhone: "",
    cellPhone: "",
    email: "",

    // Emergency Contact
    emergencyFirstName: "",
    emergencyLastName: "",
    emergencyPhone: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleGenerateNewPID = () => {
    setFormData((prev) => ({
      ...prev,
      participantId: generatePID(),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6" />
            Create New Client
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Participant ID with regenerate button */}
                <div>
                  <Label htmlFor="participantId">Participant ID *</Label>
                  <div className="flex gap-2">
                    <Input id="participantId" value={formData.participantId} disabled className="bg-gray-100" />
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateNewPID}>
                      New ID
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleInitial">Middle Initial</Label>
                    <Input
                      id="middleInitial"
                      value={formData.middleInitial}
                      onChange={(e) => handleInputChange("middleInitial", e.target.value)}
                      maxLength={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ssn">SSN (Last 4 digits) *</Label>
                    <Input
                      id="ssn"
                      value={formData.ssn}
                      onChange={(e) => handleInputChange("ssn", e.target.value)}
                      maxLength={4}
                      pattern="[0-9]{4}"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange("ethnicity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Black or African American">Black or African American</SelectItem>
                        <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="Native American">Native American</SelectItem>
                        <SelectItem value="Pacific Islander">Pacific Islander</SelectItem>
                        <SelectItem value="Mixed Race">Mixed Race</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education Level</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than High School">Less than High School</SelectItem>
                        <SelectItem value="HS Diploma">HS Diploma</SelectItem>
                        <SelectItem value="GED">GED</SelectItem>
                        <SelectItem value="Some College">Some College</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Graduate Degree">Graduate Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="criminalRecord">Criminal Record</Label>
                    <Select
                      value={formData.criminalRecord}
                      onValueChange={(value) => handleInputChange("criminalRecord", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Misdemeanor">Misdemeanor</SelectItem>
                        <SelectItem value="Felony">Felony</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="caseManager">Case Manager</Label>
                  <Input
                    id="caseManager"
                    value={formData.caseManager}
                    onChange={(e) => handleInputChange("caseManager", e.target.value)}
                    placeholder="e.g., Chester, District - 01"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Program Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="eligibilityDate">Eligibility Date</Label>
                    <Input
                      id="eligibilityDate"
                      type="date"
                      value={formData.eligibilityDate}
                      onChange={(e) => handleInputChange("eligibilityDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select value={formData.county} onValueChange={(value) => handleInputChange("county", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delaware County">Delaware County</SelectItem>
                        <SelectItem value="Chester County">Chester County</SelectItem>
                        <SelectItem value="Montgomery County">Montgomery County</SelectItem>
                        <SelectItem value="Philadelphia County">Philadelphia County</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="program">Program *</Label>
                    <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Next Step Program">Next Step Program</SelectItem>
                        <SelectItem value="Career Development">Career Development</SelectItem>
                        <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                        <SelectItem value="Skills Training">Skills Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Delaware County 001, PA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsibleEC">Responsible EC</Label>
                    <Input
                      id="responsibleEC"
                      value={formData.responsibleEC}
                      onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                      placeholder="e.g., Clark, Brandon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => handleInputChange("instructor", e.target.value)}
                      placeholder="e.g., Ashenfelter, Robert"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="requiredHours">Required Hours per Week</Label>
                  <Input
                    id="requiredHours"
                    type="number"
                    value={formData.requiredHours}
                    onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pennsylvania, PA">Pennsylvania, PA</SelectItem>
                        <SelectItem value="New Jersey, NJ">New Jersey, NJ</SelectItem>
                        <SelectItem value="Delaware, DE">Delaware, DE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      pattern="[0-9]{5}"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="homePhone">Home Phone</Label>
                    <Input
                      id="homePhone"
                      value={formData.homePhone}
                      onChange={(e) => handleInputChange("homePhone", e.target.value)}
                      placeholder="xxx-xxx-xxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cellPhone">Cell Phone *</Label>
                    <Input
                      id="cellPhone"
                      value={formData.cellPhone}
                      onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                      placeholder="xxx-xxx-xxxx"
                      required
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
                    placeholder="example@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-500" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyFirstName">First Name *</Label>
                    <Input
                      id="emergencyFirstName"
                      value={formData.emergencyFirstName}
                      onChange={(e) => handleInputChange("emergencyFirstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyLastName">Last Name *</Label>
                    <Input
                      id="emergencyLastName"
                      value={formData.emergencyLastName}
                      onChange={(e) => handleInputChange("emergencyLastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Phone Number *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="xxx-xxx-xxxx"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 hover:bg-gray-50 transition-colors duration-200 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Client
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
