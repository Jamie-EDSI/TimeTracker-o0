"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, User, AlertCircle, CheckCircle } from "lucide-react"

interface NewClientFormProps {
  onClose: () => void
  onSubmit?: (clientData: any) => void
}

const generatePID = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString()
}

export function NewClientForm({ onClose, onSubmit }: NewClientFormProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    personal: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      pid: "",
      gender: "",
      ethnicity: "",
      race: "",
      veteranStatus: "",
      disabilityStatus: "",
      status: "Active",
    },
    contact: {
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
    program: {
      program: "",
      caseManager: "",
      enrollmentDate: "",
      county: "",
      location: "",
      notes: "",
    },
    employment: {
      currentlyEmployed: "",
      jobTitle: "",
      companyName: "",
      startDate: "",
      hourlyWage: "",
      hoursPerWeek: "",
    },
    additional: {
      education: "",
      criminalRecord: "",
      childrenUnderAge6: "",
      driversLicense: "",
      housingIssue: "",
      passedDrugTest: "",
      snap: "",
      tanf: "",
    },
  })

  useEffect(() => {
    if (!formData.personal.pid) {
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          pid: generatePID(),
        },
      }))
    }
  }, [])

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const requiredFields = {
    personal: ["firstName", "lastName", "dateOfBirth"],
    contact: ["phone", "email"],
    program: ["program", "caseManager", "enrollmentDate"],
    employment: [],
    additional: [],
  }

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))

    if (validationErrors[section]?.includes(field)) {
      setValidationErrors((prev) => ({
        ...prev,
        [section]: prev[section]?.filter((f) => f !== field) || [],
      }))
    }
  }

  const validateSection = (section: string) => {
    const required = requiredFields[section as keyof typeof requiredFields]
    const sectionData = formData[section as keyof typeof formData]
    const errors: string[] = []

    required.forEach((field) => {
      if (
        !sectionData[field as keyof typeof sectionData] ||
        String(sectionData[field as keyof typeof sectionData]).trim() === ""
      ) {
        errors.push(field)
      }
    })

    return errors
  }

  const getSectionStatus = (section: string) => {
    const errors = validateSection(section)
    return errors.length === 0 ? "complete" : "incomplete"
  }

  const getIncompleteSections = () => {
    const sections = ["personal", "contact", "program"]
    return sections.filter((section) => getSectionStatus(section) === "incomplete")
  }

  const handleSubmit = () => {
    try {
      const allErrors: Record<string, string[]> = {}
      let hasErrors = false

      Object.keys(requiredFields).forEach((section) => {
        const errors = validateSection(section)
        if (errors.length > 0) {
          allErrors[section] = errors
          hasErrors = true
        }
      })

      if (hasErrors) {
        setValidationErrors(allErrors)
        const firstErrorSection = Object.keys(allErrors)[0]
        setActiveTab(firstErrorSection)
        return
      }

      if (onSubmit) {
        onSubmit(formData)
      }
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      onClose()
    }
  }

  const handleClose = () => {
    try {
      const hasData = Object.values(formData).some((section) =>
        Object.values(section).some((value) => value.trim() !== ""),
      )

      if (hasData) {
        const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close without saving?")
        if (!confirmClose) return
      }

      onClose()
    } catch (error) {
      console.error("Error closing form:", error)
      onClose()
    }
  }

  const getTabIndicator = (section: string) => {
    const status = getSectionStatus(section)
    const hasErrors = validationErrors[section]?.length > 0

    if (hasErrors) {
      return <div className="w-2 h-2 bg-red-500 rounded-full ml-2" />
    } else if (status === "complete") {
      return <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
    } else if (requiredFields[section as keyof typeof requiredFields].length > 0) {
      return <div className="w-2 h-2 bg-orange-500 rounded-full ml-2" />
    }
    return null
  }

  const incompleteSections = getIncompleteSections()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-50 p-1 m-6 mb-0">
              <TabsTrigger value="personal" className="flex items-center">
                Personal
                {getTabIndicator("personal")}
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center">
                Contact
                {getTabIndicator("contact")}
              </TabsTrigger>
              <TabsTrigger value="program" className="flex items-center">
                Program
                {getTabIndicator("program")}
              </TabsTrigger>
              <TabsTrigger value="employment" className="flex items-center">
                Employment
                {getTabIndicator("employment")}
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex items-center">
                Additional
                {getTabIndicator("additional")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="p-6 pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.personal.firstName}
                      onChange={(e) => handleInputChange("personal", "firstName", e.target.value)}
                      className={validationErrors.personal?.includes("firstName") ? "border-red-500" : ""}
                    />
                    {validationErrors.personal?.includes("firstName") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        First name is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.personal.middleName}
                      onChange={(e) => handleInputChange("personal", "middleName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.personal.lastName}
                      onChange={(e) => handleInputChange("personal", "lastName", e.target.value)}
                      className={validationErrors.personal?.includes("lastName") ? "border-red-500" : ""}
                    />
                    {validationErrors.personal?.includes("lastName") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Last name is required
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
                      value={formData.personal.dateOfBirth}
                      onChange={(e) => handleInputChange("personal", "dateOfBirth", e.target.value)}
                      className={validationErrors.personal?.includes("dateOfBirth") ? "border-red-500" : ""}
                    />
                    {validationErrors.personal?.includes("dateOfBirth") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Date of birth is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pid">Participant ID (PID)</Label>
                    <Input
                      id="pid"
                      value={formData.personal.pid}
                      readOnly
                      className="bg-gray-50"
                      placeholder="Auto-generated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Automatically generated unique identifier</p>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.personal.gender}
                      onValueChange={(value) => handleInputChange("personal", "gender", value)}
                    >
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select
                      value={formData.personal.ethnicity}
                      onValueChange={(value) => handleInputChange("personal", "ethnicity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                        <SelectItem value="Not Hispanic or Latino">Not Hispanic or Latino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="race">Race</Label>
                    <Select
                      value={formData.personal.race}
                      onValueChange={(value) => handleInputChange("personal", "race", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select race" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="American Indian or Alaska Native">
                          American Indian or Alaska Native
                        </SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="Black or African American">Black or African American</SelectItem>
                        <SelectItem value="Native Hawaiian or Other Pacific Islander">
                          Native Hawaiian or Other Pacific Islander
                        </SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Two or More Races">Two or More Races</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="veteranStatus">Veteran Status</Label>
                    <Select
                      value={formData.personal.veteranStatus}
                      onValueChange={(value) => handleInputChange("personal", "veteranStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select veteran status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="disabilityStatus">Disability Status</Label>
                    <Select
                      value={formData.personal.disabilityStatus}
                      onValueChange={(value) => handleInputChange("personal", "disabilityStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select disability status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="p-6 pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.contact.phone}
                      onChange={(e) => handleInputChange("contact", "phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className={validationErrors.contact?.includes("phone") ? "border-red-500" : ""}
                    />
                    {validationErrors.contact?.includes("phone") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Phone number is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => handleInputChange("contact", "email", e.target.value)}
                      placeholder="john.doe@example.com"
                      className={validationErrors.contact?.includes("email") ? "border-red-500" : ""}
                    />
                    {validationErrors.contact?.includes("email") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Email address is required
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.contact.address}
                    onChange={(e) => handleInputChange("contact", "address", e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.contact.city}
                      onChange={(e) => handleInputChange("contact", "city", e.target.value)}
                      placeholder="Philadelphia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.contact.state}
                      onChange={(e) => handleInputChange("contact", "state", e.target.value)}
                      placeholder="PA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.contact.zipCode}
                      onChange={(e) => handleInputChange("contact", "zipCode", e.target.value)}
                      placeholder="19101"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactName">Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.contact.emergencyContactName}
                        onChange={(e) => handleInputChange("contact", "emergencyContactName", e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.contact.emergencyContactPhone}
                        onChange={(e) => handleInputChange("contact", "emergencyContactPhone", e.target.value)}
                        placeholder="(555) 987-6543"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="program" className="p-6 pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program">Program *</Label>
                    <Select
                      value={formData.program.program}
                      onValueChange={(value) => handleInputChange("program", "program", value)}
                    >
                      <SelectTrigger className={validationErrors.program?.includes("program") ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Next Step Program">Next Step Program</SelectItem>
                        <SelectItem value="Career Development">Career Development</SelectItem>
                        <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                        <SelectItem value="Skills Training">Skills Training</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.program?.includes("program") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Program selection is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="caseManager">Case Manager *</Label>
                    <Input
                      id="caseManager"
                      value={formData.program.caseManager}
                      onChange={(e) => handleInputChange("program", "caseManager", e.target.value)}
                      placeholder="Smith, John"
                      className={validationErrors.program?.includes("caseManager") ? "border-red-500" : ""}
                    />
                    {validationErrors.program?.includes("caseManager") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Case manager is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={formData.program.enrollmentDate}
                      onChange={(e) => handleInputChange("program", "enrollmentDate", e.target.value)}
                      className={validationErrors.program?.includes("enrollmentDate") ? "border-red-500" : ""}
                    />
                    {validationErrors.program?.includes("enrollmentDate") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Enrollment date is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.program.county}
                      onChange={(e) => handleInputChange("program", "county", e.target.value)}
                      placeholder="Delaware County"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.program.location}
                      onChange={(e) => handleInputChange("program", "location", e.target.value)}
                      placeholder="Delaware County 001, PA"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Program Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.program.notes}
                    onChange={(e) => handleInputChange("program", "notes", e.target.value)}
                    placeholder="Additional program information or notes..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="p-6 pt-4">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="currentlyEmployed">Currently Employed?</Label>
                  <Select
                    value={formData.employment.currentlyEmployed}
                    onValueChange={(value) => handleInputChange("employment", "currentlyEmployed", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.employment.currentlyEmployed === "Yes" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={formData.employment.jobTitle}
                          onChange={(e) => handleInputChange("employment", "jobTitle", e.target.value)}
                          placeholder="Sales Associate"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={formData.employment.companyName}
                          onChange={(e) => handleInputChange("employment", "companyName", e.target.value)}
                          placeholder="ABC Corporation"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.employment.startDate}
                          onChange={(e) => handleInputChange("employment", "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourlyWage">Hourly Wage</Label>
                        <Input
                          id="hourlyWage"
                          type="number"
                          step="0.01"
                          value={formData.employment.hourlyWage}
                          onChange={(e) => handleInputChange("employment", "hourlyWage", e.target.value)}
                          placeholder="15.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                        <Input
                          id="hoursPerWeek"
                          type="number"
                          value={formData.employment.hoursPerWeek}
                          onChange={(e) => handleInputChange("employment", "hoursPerWeek", e.target.value)}
                          placeholder="40"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="additional" className="p-6 pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education Level</Label>
                    <Select
                      value={formData.additional.education}
                      onValueChange={(value) => handleInputChange("additional", "education", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than High School">Less than High School</SelectItem>
                        <SelectItem value="High School Diploma">High School Diploma</SelectItem>
                        <SelectItem value="GED">GED</SelectItem>
                        <SelectItem value="Some College">Some College</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Doctoral Degree">Doctoral Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="driversLicense">Driver's License</Label>
                    <Select
                      value={formData.additional.driversLicense}
                      onValueChange={(value) => handleInputChange("additional", "driversLicense", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="criminalRecord">Criminal Record</Label>
                    <Select
                      value={formData.additional.criminalRecord}
                      onValueChange={(value) => handleInputChange("additional", "criminalRecord", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Misdemeanor">Misdemeanor</SelectItem>
                        <SelectItem value="Felony">Felony</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="childrenUnderAge6">Children Under Age 6</Label>
                    <Select
                      value={formData.additional.childrenUnderAge6}
                      onValueChange={(value) => handleInputChange("additional", "childrenUnderAge6", value)}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="snap">SNAP Benefits</Label>
                    <Select
                      value={formData.additional.snap}
                      onValueChange={(value) => handleInputChange("additional", "snap", value)}
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
                    <Label htmlFor="tanf">TANF Benefits</Label>
                    <Select
                      value={formData.additional.tanf}
                      onValueChange={(value) => handleInputChange("additional", "tanf", value)}
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
                    <Label htmlFor="housingIssue">Housing Issues</Label>
                    <Select
                      value={formData.additional.housingIssue}
                      onValueChange={(value) => handleInputChange("additional", "housingIssue", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Homeless">Homeless</SelectItem>
                        <SelectItem value="Temporary Housing">Temporary Housing</SelectItem>
                        <SelectItem value="At Risk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>* Required fields</span>
              {incompleteSections.length > 0 && (
                <div className="flex items-center gap-2 ml-4">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-700">
                    Incomplete sections:{" "}
                    {incompleteSections.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <User className="w-4 h-4 mr-2" />
                Create Client
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
