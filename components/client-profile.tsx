"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, MapPin, Briefcase, GraduationCap, Shield, Heart, FileText, Edit3 } from "lucide-react"

interface ClientData {
  id: string
  participantId: string
  firstName: string
  lastName: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  cellPhone?: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth: string
  pid: string
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  lastActivity?: string
  personal?: {
    firstName: string
    middleName?: string
    lastName: string
    dateOfBirth: string
    pid: string
    gender?: string
    ethnicity?: string
    race?: string
    veteranStatus?: string
    disabilityStatus?: string
    status: string
  }
  contact?: {
    phone: string
    email: string
    address: string
    city: string
    state: string
    zipCode: string
    emergencyContactName?: string
    emergencyContactPhone?: string
  }
  program?: {
    program: string
    caseManager: string
    enrollmentDate: string
    county?: string
    location?: string
    notes?: string
  }
  employment?: {
    currentlyEmployed?: string
    jobTitle?: string
    companyName?: string
    startDate?: string
    hourlyWage?: string
    hoursPerWeek?: string
  }
  additional?: {
    education?: string
    criminalRecord?: string
    childrenUnderAge6?: string
    driversLicense?: string
    housingIssue?: string
    passedDrugTest?: string
    snap?: string
    tanf?: string
  }
}

interface ClientProfileProps {
  client: ClientData
  isEditing: boolean
  onDataChange?: (data: Partial<ClientData>) => void
}

export function ClientProfile({ client, isEditing, onDataChange }: ClientProfileProps) {
  const [editableData, setEditableData] = useState<ClientData>(client)

  useEffect(() => {
    setEditableData(client)
  }, [client])

  const handleInputChange = (field: string, value: string, section?: string) => {
    let updatedData: ClientData

    if (section) {
      updatedData = {
        ...editableData,
        [section]: {
          ...editableData[section as keyof ClientData],
          [field]: value,
        },
      }
    } else {
      updatedData = {
        ...editableData,
        [field]: value,
      }
    }

    setEditableData(updatedData)

    if (onDataChange) {
      onDataChange(updatedData)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Editing Mode Banner */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Editing Mode</h3>
          </div>
          <p className="text-blue-700 mt-1">
            Make changes to the client information below. Click "Save Changes" when finished.
          </p>
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
            {isEditing && (
              <Badge variant="outline" className="ml-2 text-blue-600">
                Editing
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">First Name</Label>
              {isEditing ? (
                <Input
                  value={editableData.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 font-medium">{client.firstName || "Not provided"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Last Name</Label>
              {isEditing ? (
                <Input
                  value={editableData.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 font-medium">{client.lastName || "Not provided"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Participant ID</Label>
              <p className="mt-1 font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
                {client.participantId || client.pid || "Not assigned"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
              <p className="mt-1">{formatDate(client.dateOfBirth)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Gender</Label>
              <p className="mt-1">{client.personal?.gender || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              {isEditing ? (
                <Select value={editableData.status || ""} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge className={getStatusBadgeColor(client.status)}>{client.status || "Unknown"}</Badge>
                </div>
              )}
            </div>
          </div>

          {(client.personal?.ethnicity || client.personal?.race) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Ethnicity</Label>
                <p className="mt-1">{client.personal.ethnicity || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Race</Label>
                <p className="mt-1">{client.personal.race || "Not provided"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            Contact Information
            {isEditing && (
              <Badge variant="outline" className="ml-2 text-blue-600">
                Editing
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={editableData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{client.phone || client.cellPhone || "Not provided"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editableData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{client.email || "Not provided"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              {isEditing ? (
                <Input
                  value={editableData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{client.address || "Not provided"}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">City</Label>
              {isEditing ? (
                <Input
                  value={editableData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{client.city || "Not provided"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">State</Label>
              <p className="mt-1">{client.state || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">ZIP Code</Label>
              {isEditing ? (
                <Input
                  value={editableData.zipCode || ""}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{client.zipCode || "Not provided"}</p>
              )}
            </div>
          </div>

          {(client.emergencyContact || client.emergencyPhone) && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Name</Label>
                    <p className="mt-1">{client.emergencyContact || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Phone</Label>
                    <p className="mt-1">{client.emergencyPhone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Program Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Program Information
            {isEditing && (
              <Badge variant="outline" className="ml-2 text-blue-600">
                Editing
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Program</Label>
              {isEditing ? (
                <Select
                  value={editableData.program || ""}
                  onValueChange={(value) => handleInputChange("program", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
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
              ) : (
                <p className="mt-1 font-medium">{client.program || "Not assigned"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Case Manager</Label>
              {isEditing ? (
                <Input
                  value={editableData.caseManager || ""}
                  onChange={(e) => handleInputChange("caseManager", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{client.caseManager || "Not assigned"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Enrollment Date</Label>
              <p className="mt-1">{formatDate(client.enrollmentDate)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Responsible EC</Label>
              <p className="mt-1">{client.responsibleEC || "Not assigned"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Required Hours</Label>
              <p className="mt-1">{client.requiredHours || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">CAO Number</Label>
              <p className="mt-1">{client.caoNumber || "Not provided"}</p>
            </div>
          </div>

          {client.program?.notes && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Program Notes</Label>
              <p className="mt-1 text-sm bg-gray-50 p-3 rounded border">{client.program.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employment Information */}
      {(client.employment?.currentlyEmployed || client.employment?.jobTitle) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Employment Status</Label>
                <p className="mt-1">
                  <Badge
                    className={
                      client.employment.currentlyEmployed === "Yes"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {client.employment.currentlyEmployed === "Yes" ? "Employed" : "Not Employed"}
                  </Badge>
                </p>
              </div>
              {client.employment.jobTitle && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Job Title</Label>
                  <p className="mt-1">{client.employment.jobTitle}</p>
                </div>
              )}
              {client.employment.companyName && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Company</Label>
                  <p className="mt-1">{client.employment.companyName}</p>
                </div>
              )}
            </div>

            {(client.employment.hourlyWage || client.employment.hoursPerWeek) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {client.employment.startDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                    <p className="mt-1">{formatDate(client.employment.startDate)}</p>
                  </div>
                )}
                {client.employment.hourlyWage && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Hourly Wage</Label>
                    <p className="mt-1">${client.employment.hourlyWage}</p>
                  </div>
                )}
                {client.employment.hoursPerWeek && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Hours per Week</Label>
                    <p className="mt-1">{client.employment.hoursPerWeek}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {client.additional && Object.values(client.additional).some((value) => value && value.trim() !== "") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.additional.education && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Education Level</Label>
                  <p className="mt-1">{client.additional.education}</p>
                </div>
              )}
              {client.additional.driversLicense && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Driver's License</Label>
                  <p className="mt-1">
                    <Badge
                      className={
                        client.additional.driversLicense === "Yes"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {client.additional.driversLicense}
                    </Badge>
                  </p>
                </div>
              )}
              {client.additional.criminalRecord && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Criminal Record</Label>
                  <p className="mt-1">
                    <Badge
                      className={
                        client.additional.criminalRecord === "None"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {client.additional.criminalRecord}
                    </Badge>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {client.additional.snap && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">SNAP Benefits</Label>
                  <p className="mt-1">
                    <Badge variant="outline">{client.additional.snap}</Badge>
                  </p>
                </div>
              )}
              {client.additional.tanf && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">TANF Benefits</Label>
                  <p className="mt-1">
                    <Badge variant="outline">{client.additional.tanf}</Badge>
                  </p>
                </div>
              )}
              {client.additional.childrenUnderAge6 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Children Under 6</Label>
                  <p className="mt-1">
                    <Badge variant="outline">{client.additional.childrenUnderAge6}</Badge>
                  </p>
                </div>
              )}
              {client.additional.housingIssue && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Housing Status</Label>
                  <p className="mt-1">
                    <Badge
                      className={
                        client.additional.housingIssue === "Stable"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {client.additional.housingIssue}
                    </Badge>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Record Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            Record Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-sm font-medium text-gray-600">Created Date</Label>
              <p className="mt-1">{formatDate(client.createdAt)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
              <p className="mt-1">{formatDate(client.updatedAt)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Created By</Label>
              <p className="mt-1">{client.createdBy || "System"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
