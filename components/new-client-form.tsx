"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { X, User, Phone, GraduationCap, Briefcase, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface NewClientFormProps {
  onClose: () => void
  onClientCreated: (clientData: any) => void
}

// Generate unique 7-digit PID
const generateUniquePID = (): string => {
  const timestamp = Date.now().toString().slice(-4) // Last 4 digits of timestamp
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0") // 3 random digits
  return timestamp + random
}

export function NewClientForm({ onClose, onClientCreated }: NewClientFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    pid: "", // Auto-generated PID instead of SSN
    gender: "",
    ethnicity: "",
    race: "",
    veteranStatus: "",
    disabilityStatus: "",

    // Contact Information
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",

    // Program Information
    program: "",
    caseManager: "",
    enrollmentDate: "",
    county: "",
    location: "",
    notes: "",

    // Employment Information
    currentlyEmployed: "",
    jobTitle: "",
    companyName: "",
    startDate: "",
    hourlyWage: "",
    hoursPerWeek: "",

    // Additional Information
    education: "",
    criminalRecord: "",
    childrenUnderAge6: "",
    driversLicense: "",
    housingIssue: "",
    passedDrugTest: "",
    snap: "",
    tanf: "",
  })

  // Auto-generate PID when component mounts
  useEffect(() => {
    if (!formData.pid) {
      setFormData((prev) => ({
        ...prev,
        pid: generateUniquePID(),
      }))
    }
  }, [])

  const steps = [
    { id: "personal", title: "Personal", icon: User, required: ["firstName", "lastName", "dateOfBirth", "pid"] },
    { id: "contact", title: "Contact", icon: Phone, required: ["phone", "email", "address"] },
    { id: "program", title: "Program", icon: GraduationCap, required: ["program", "caseManager", "enrollmentDate"] },
    { id: "employment", title: "Employment", icon: Briefcase, required: [] },
    { id: "additional", title: "Additional", icon: FileText, required: [] },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateStep = (stepIndex: number) => {
    const step = steps[stepIndex]
    return step.required.every((field) => formData[field as keyof typeof formData]?.trim() !== "")
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return validateStep(stepIndex) ? "completed" : "incomplete"
    }
    if (stepIndex === currentStep) {
      return "current"
    }
    return "upcoming"
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Transform form data to match expected client structure
    const clientData = {
      id: `client_${Date.now()}`,
      participantId: formData.pid,
      firstName: formData.firstName,
      lastName: formData.lastName,
      program: formData.program,
      status: "Active",
      enrollmentDate: formData.enrollmentDate,
      phone: formData.phone,
      cellPhone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      dateOfBirth: formData.dateOfBirth,
      pid: formData.pid,
      emergencyContact: formData.emergencyContactName,
      emergencyPhone: formData.emergencyContactPhone,
      caseManager: formData.caseManager,
      responsibleEC: formData.caseManager,
      requiredHours: "20",
      caoNumber: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
      lastActivity: "Just enrolled",
      personal: {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        pid: formData.pid,
        gender: formData.gender,
        ethnicity: formData.ethnicity,
        race: formData.race,
        veteranStatus: formData.veteranStatus,
        disabilityStatus: formData.disabilityStatus,
        status: "Active",
      },
      contact: {
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
      },
      program: {
        program: formData.program,
        caseManager: formData.caseManager,
        enrollmentDate: formData.enrollmentDate,
        county: formData.county,
        location: formData.location,
        notes: formData.notes,
      },
      employment: {
        currentlyEmployed: formData.currentlyEmployed,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        startDate: formData.startDate,
        hourlyWage: formData.hourlyWage,
        hoursPerWeek: formData.hoursPerWeek,
      },
      additional: {
        education: formData.education,
        criminalRecord: formData.criminalRecord,
        childrenUnderAge6: formData.childrenUnderAge6,
        driversLicense: formData.driversLicense,
        housingIssue: formData.housingIssue,
        passedDrugTest: formData.passedDrugTest,
        snap: formData.snap,
        tanf: formData.tanf,
      },
    }

    onClientCreated(clientData)
  }

  const getIncompleteSteps = () => {
    return steps
      .map((step, index) => ({ ...step, index }))
      .filter((step) => step.index <= currentStep && !validateStep(step.index))
      .map((step) => step.title)
  }

  const incompleteSteps = getIncompleteSteps()

  const isFieldIncomplete = (field: string, stepIndex: number) => {
    const step = steps[stepIndex]
    const isRequired = step.required.includes(field)
    const isEmpty = !formData[field as keyof typeof formData]?.trim()
    return isRequired && isEmpty
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index)
              const StepIcon = step.icon

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${
                        status === "completed"
                          ? "bg-green-100 text-green-800"
                          : status === "current"
                            ? "bg-blue-100 text-blue-800"
                            : status === "incomplete"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-500"
                      }
                    `}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : status === "incomplete" ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        status === "current"
                          ? "text-blue-900"
                          : status === "completed"
                            ? "text-green-900"
                            : status === "incomplete"
                              ? "text-red-900"
                              : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Personal Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName" className={isFieldIncomplete("firstName", 0) ? "text-red-600" : ""}>
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={isFieldIncomplete("firstName", 0) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className={isFieldIncomplete("lastName", 0) ? "text-red-600" : ""}>
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className={isFieldIncomplete("lastName", 0) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth" className={isFieldIncomplete("dateOfBirth", 0) ? "text-red-600" : ""}>
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={isFieldIncomplete("dateOfBirth", 0) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="pid" className={isFieldIncomplete("pid", 0) ? "text-red-600" : ""}>
                    Participant ID (PID) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="pid"
                      value={formData.pid}
                      readOnly
                      className="bg-gray-50 font-mono"
                      placeholder="Auto-generated"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Unique 7-digit identifier automatically generated for security
                  </p>
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange("ethnicity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                      <SelectItem value="Not Hispanic or Latino">Not Hispanic or Latino</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
                      <SelectItem value="American Indian or Alaska Native">American Indian or Alaska Native</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="Black or African American">Black or African American</SelectItem>
                      <SelectItem value="Native Hawaiian or Other Pacific Islander">
                        Native Hawaiian or Other Pacific Islander
                      </SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Two or More Races">Two or More Races</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className={isFieldIncomplete("phone", 1) ? "text-red-600" : ""}>
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className={isFieldIncomplete("phone", 1) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className={isFieldIncomplete("email", 1) ? "text-red-600" : ""}>
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john.doe@example.com"
                    className={isFieldIncomplete("email", 1) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className={isFieldIncomplete("address", 1) ? "text-red-600" : ""}>
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street"
                  className={isFieldIncomplete("address", 1) ? "border-red-500 bg-red-50" : ""}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City name"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alabama">Alabama</SelectItem>
                      <SelectItem value="Alaska">Alaska</SelectItem>
                      <SelectItem value="Arizona">Arizona</SelectItem>
                      <SelectItem value="Arkansas">Arkansas</SelectItem>
                      <SelectItem value="California">California</SelectItem>
                      <SelectItem value="Colorado">Colorado</SelectItem>
                      <SelectItem value="Connecticut">Connecticut</SelectItem>
                      <SelectItem value="Delaware">Delaware</SelectItem>
                      <SelectItem value="Florida">Florida</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Hawaii">Hawaii</SelectItem>
                      <SelectItem value="Idaho">Idaho</SelectItem>
                      <SelectItem value="Illinois">Illinois</SelectItem>
                      <SelectItem value="Indiana">Indiana</SelectItem>
                      <SelectItem value="Iowa">Iowa</SelectItem>
                      <SelectItem value="Kansas">Kansas</SelectItem>
                      <SelectItem value="Kentucky">Kentucky</SelectItem>
                      <SelectItem value="Louisiana">Louisiana</SelectItem>
                      <SelectItem value="Maine">Maine</SelectItem>
                      <SelectItem value="Maryland">Maryland</SelectItem>
                      <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                      <SelectItem value="Michigan">Michigan</SelectItem>
                      <SelectItem value="Minnesota">Minnesota</SelectItem>
                      <SelectItem value="Mississippi">Mississippi</SelectItem>
                      <SelectItem value="Missouri">Missouri</SelectItem>
                      <SelectItem value="Montana">Montana</SelectItem>
                      <SelectItem value="Nebraska">Nebraska</SelectItem>
                      <SelectItem value="Nevada">Nevada</SelectItem>
                      <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                      <SelectItem value="New Jersey">New Jersey</SelectItem>
                      <SelectItem value="New Mexico">New Mexico</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="North Carolina">North Carolina</SelectItem>
                      <SelectItem value="North Dakota">North Dakota</SelectItem>
                      <SelectItem value="Ohio">Ohio</SelectItem>
                      <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                      <SelectItem value="Oregon">Oregon</SelectItem>
                      <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                      <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                      <SelectItem value="South Carolina">South Carolina</SelectItem>
                      <SelectItem value="South Dakota">South Dakota</SelectItem>
                      <SelectItem value="Tennessee">Tennessee</SelectItem>
                      <SelectItem value="Texas">Texas</SelectItem>
                      <SelectItem value="Utah">Utah</SelectItem>
                      <SelectItem value="Vermont">Vermont</SelectItem>
                      <SelectItem value="Virginia">Virginia</SelectItem>
                      <SelectItem value="Washington">Washington</SelectItem>
                      <SelectItem value="West Virginia">West Virginia</SelectItem>
                      <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                      <SelectItem value="Wyoming">Wyoming</SelectItem>
                      <SelectItem value="District of Columbia">District of Columbia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Program Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program" className={isFieldIncomplete("program", 2) ? "text-red-600" : ""}>
                    Program <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Next Step Program">Next Step Program</SelectItem>
                      <SelectItem value="Career Development">Career Development</SelectItem>
                      <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                      <SelectItem value="Skills Training">Skills Training</SelectItem>
                      <SelectItem value="EARN">EARN</SelectItem>
                      <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                      <SelectItem value="YOUTH">YOUTH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="caseManager" className={isFieldIncomplete("caseManager", 2) ? "text-red-600" : ""}>
                    Case Manager <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="caseManager"
                    value={formData.caseManager}
                    onChange={(e) => handleInputChange("caseManager", e.target.value)}
                    placeholder="Case manager name"
                    className={isFieldIncomplete("caseManager", 2) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="enrollmentDate"
                    className={isFieldIncomplete("enrollmentDate", 2) ? "text-red-600" : ""}
                  >
                    Enrollment Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                    className={isFieldIncomplete("enrollmentDate", 2) ? "border-red-500 bg-red-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => handleInputChange("county", e.target.value)}
                    placeholder="County name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Program location"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Program Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional program notes or comments..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Employment Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="currentlyEmployed">Currently Employed?</Label>
                <Select
                  value={formData.currentlyEmployed}
                  onValueChange={(value) => handleInputChange("currentlyEmployed", value)}
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

              {formData.currentlyEmployed === "Yes" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        placeholder="Current job title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Current employer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
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
                        placeholder="15.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                      <Input
                        id="hoursPerWeek"
                        type="number"
                        value={formData.hoursPerWeek}
                        onChange={(e) => handleInputChange("hoursPerWeek", e.target.value)}
                        placeholder="40"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="education">Education Level</Label>
                  <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
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
                  <Label htmlFor="criminalRecord">Criminal Record</Label>
                  <Select
                    value={formData.criminalRecord}
                    onValueChange={(value) => handleInputChange("criminalRecord", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select criminal record status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Misdemeanor">Misdemeanor</SelectItem>
                      <SelectItem value="Felony">Felony</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driversLicense">Driver's License</Label>
                  <Select
                    value={formData.driversLicense}
                    onValueChange={(value) => handleInputChange("driversLicense", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select license status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="childrenUnderAge6">Children Under Age 6</Label>
                  <Select
                    value={formData.childrenUnderAge6}
                    onValueChange={(value) => handleInputChange("childrenUnderAge6", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="housingIssue">Housing Status</Label>
                  <Select
                    value={formData.housingIssue}
                    onValueChange={(value) => handleInputChange("housingIssue", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select housing status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stable">Stable</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Homeless">Homeless</SelectItem>
                      <SelectItem value="At Risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="passedDrugTest">Drug Test Status</Label>
                  <Select
                    value={formData.passedDrugTest}
                    onValueChange={(value) => handleInputChange("passedDrugTest", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Not Required">Not Required</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="snap">SNAP Benefits</Label>
                  <Select value={formData.snap} onValueChange={(value) => handleInputChange("snap", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SNAP status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tanf">TANF Benefits</Label>
                  <Select value={formData.tanf} onValueChange={(value) => handleInputChange("tanf", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select TANF status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          {incompleteSteps.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Incomplete sections: {incompleteSteps.join(", ")}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">* Required fields</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Create Client
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
