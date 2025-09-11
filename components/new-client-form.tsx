"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, User, Phone, GraduationCap, Shield } from "lucide-react"

interface NewClientFormProps {
  onClientCreated: (client: any) => void
  onCancel: () => void
}

export function NewClientForm({ onClientCreated, onCancel }: NewClientFormProps) {
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
  })

  const generatePID = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString()
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.program) {
        alert("Please fill in all required fields")
        return
      }

      // Create a clean data object with all string values
      const clientData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        participantId: formData.participantId,
        program: formData.program,
        status: formData.status,
        enrollmentDate: formData.enrollmentDate,
        phone: formData.phone.trim(),
        cellPhone: formData.cellPhone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        dateOfBirth: formData.dateOfBirth,
        emergencyContact: formData.emergencyContact.trim(),
        emergencyPhone: formData.emergencyPhone.trim(),
        caseManager: formData.caseManager.trim(),
        responsibleEC: formData.responsibleEC.trim(),
        requiredHours: formData.requiredHours.trim(),
        caoNumber: formData.caoNumber.trim(),
      }

      onClientCreated(clientData)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error creating the client. Please try again.")
    }
  }

  const handleClose = () => {
    try {
      onCancel()
    } catch (error) {
      console.error("Error closing form:", error)
    }
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
            <Button variant="ghost" onClick={handleClose} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">New Client Registration</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Client
            </Button>
            <Button onClick={handleClose} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <Label htmlFor="participantId">Participant ID (PID)</Label>
                  <Input id="participantId" value={formData.participantId} readOnly className="bg-gray-50 font-mono" />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                  />
                </div>
                <div>
                  <Label htmlFor="cellPhone">Cell Phone</Label>
                  <Input
                    id="cellPhone"
                    type="tel"
                    value={formData.cellPhone}
                    onChange={(e) => handleInputChange("cellPhone", e.target.value)}
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
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
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
                <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                  <SelectTrigger>
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
              </div>

              <div>
                <Label htmlFor="caseManager">Case Manager</Label>
                <Input
                  id="caseManager"
                  value={formData.caseManager}
                  onChange={(e) => handleInputChange("caseManager", e.target.value)}
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
                  />
                </div>
                <div>
                  <Label htmlFor="caoNumber">CAO Number</Label>
                  <Input
                    id="caoNumber"
                    value={formData.caoNumber}
                    onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responsibleEC">Responsible EC</Label>
                <Input
                  id="responsibleEC"
                  value={formData.responsibleEC}
                  onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
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
                  placeholder="Enter any additional notes or comments..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
