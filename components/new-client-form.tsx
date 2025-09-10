"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, X, Save, UserPlus } from "lucide-react"

interface NewClientFormProps {
  onBack: () => void
}

export function NewClientForm({ onBack }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    participantId: "",
    program: "",
    phone: "",
    cellPhone: "",
    email: "",
    address: "",
    city: "",
    state: "PA",
    zipCode: "",
    dateOfBirth: "",
    ssn: "",
    emergencyContact: "",
    emergencyPhone: "",
    caseManager: "",
    responsibleEC: "",
    requiredHours: "",
    caoNumber: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setIsSubmitting(false)
    onBack() // Return to dashboard after successful submission
  }

  const handleCancel = () => {
    if (!isSubmitting) {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6" />
                Create New Client
              </h1>
              <p className="text-sm text-gray-600">Enter client information to create a new record</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="participantId">Participant ID *</Label>
                  <Input
                    id="participantId"
                    value={formData.participantId}
                    onChange={(e) => handleInputChange("participantId", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="ssn">SSN (Last 4 digits)</Label>
                  <Input
                    id="ssn"
                    value={formData.ssn}
                    onChange={(e) => handleInputChange("ssn", e.target.value)}
                    maxLength={4}
                    placeholder="1234"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="program">Program *</Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => handleInputChange("program", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                      <SelectItem value="EARN">EARN</SelectItem>
                      <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                      <SelectItem value="YOUTH">YOUTH</SelectItem>
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="484-555-0123"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="cellPhone">Cell Phone</Label>
                  <Input
                    id="cellPhone"
                    value={formData.cellPhone}
                    onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                    placeholder="484-555-0123"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="client@email.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main St"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Philadelphia"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="19101"
                    disabled={isSubmitting}
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
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="484-555-0123"
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Program Information */}
            <Card>
              <CardHeader>
                <CardTitle>Program Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="caseManager">Case Manager</Label>
                  <Input
                    id="caseManager"
                    value={formData.caseManager}
                    onChange={(e) => handleInputChange("caseManager", e.target.value)}
                    placeholder="Smith, John"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleEC">Responsible EC</Label>
                  <Input
                    id="responsibleEC"
                    value={formData.responsibleEC}
                    onChange={(e) => handleInputChange("responsibleEC", e.target.value)}
                    placeholder="Johnson, Sarah"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="requiredHours">Required Hours</Label>
                  <Input
                    id="requiredHours"
                    value={formData.requiredHours}
                    onChange={(e) => handleInputChange("requiredHours", e.target.value)}
                    placeholder="40"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="caoNumber">CAO Number</Label>
                  <Input
                    id="caoNumber"
                    value={formData.caoNumber}
                    onChange={(e) => handleInputChange("caoNumber", e.target.value)}
                    placeholder="CAO123456"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes about the client..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="px-6 bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Client
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
