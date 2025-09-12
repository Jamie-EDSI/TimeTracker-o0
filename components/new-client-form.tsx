"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, X, User, Phone, MapPin, Briefcase, Hash } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (clientData: any) => void
  onCancel: () => void
  isLoading: boolean
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
    state: "PA",
    zipCode: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    caseManager: "",
    responsibleEC: "",
    requiredHours: "",
    caoNumber: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Generate a random participant ID
  const generateParticipantId = () => {
    const randomId = Math.floor(Math.random() * 9000000) + 1000000
    setFormData((prev) => ({ ...prev, participantId: randomId.toString() }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.participantId.trim()) newErrors.participantId = "Participant ID is required"
    if (!formData.program.trim()) newErrors.program = "Program is required"
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
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
    if (validateForm()) {
      onClientCreated(formData)
    }
  }

  const states = [
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

  const programs = [
    "Job Readiness",
    "EARN",
    "Ex-Offender",
    "YOUTH",
    "Next Step Program",
    "Career Development",
    "Skills Training",
  ]

  const caseManagers = [
    "Brown, Lisa",
    "Smith, John",
    "Johnson, Mary",
    "Davis, Robert",
    "Wilson, Sarah",
    "Miller, James",
    "Garcia, Maria",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
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
            <Button
              type="submit"
              form="client-form"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
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
        <form id="client-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participantId">Participant ID *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="participantId"
                      value={formData.participantId}
                      onChange={(e) => handleInputChange("participantId", e.target.value)}
                      className={errors.participantId ? "border-red-500" : ""}
                      placeholder="Enter participant ID"
                    />
                    <Button
                      type="button"
                      onClick={generateParticipantId}
                      variant="outline"
                      className="flex items-center gap-1 bg-transparent"
                    >
                      <Hash className="w-4 h-4" />
                      Generate
                    </Button>
                  </div>
                  {errors.participantId && <p className="text-sm text-red-600 mt-1">{errors.participantId}</p>}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="cellPhone">Cell Phone</Label>
                  <Input
                    id="cellPhone"
                    value={formData.cellPhone}
                    onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="client@example.com"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Contact name"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Philadelphia"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className={errors.zipCode ? "border-red-500" : ""}
                    placeholder="19102"
                  />
                  {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                Program Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program">Program *</Label>
                  <select
                    id="program"
                    value={formData.program}
                    onChange={(e) => handleInputChange("program", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.program ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a program</option>
                    {programs.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                  {errors.program && <p className="text-sm text-red-600 mt-1">{errors.program}</p>}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="caseManager">Case Manager *</Label>
                  <select
                    id="caseManager"
                    value={formData.caseManager}
                    onChange={(e) => handleInputChange("caseManager", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.caseManager ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a case manager</option>
                    {caseManagers.map((manager) => (
                      <option key={manager} value={manager}>
                        {manager}
                      </option>
                    ))}
                  </select>
                  {errors.caseManager && <p className="text-sm text-red-600 mt-1">{errors.caseManager}</p>}
                </div>

                <div>
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="responsibleEC">Responsible EC</Label>
                  <Input
                    id="responsibleEC"
                    value={formData.responsibleEC}
                    onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                    placeholder="Employment Counselor"
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
                  />
                </div>

                <div>
                  <Label htmlFor="caoNumber">CAO Number</Label>
                  <Input
                    id="caoNumber"
                    value={formData.caoNumber}
                    onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                    placeholder="CAO-12345"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" onClick={onCancel} variant="outline" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating Client..." : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
