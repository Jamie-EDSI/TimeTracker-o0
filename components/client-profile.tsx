"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, User, FileText, Clock, Phone, MapPin, History, Edit, Trash2, Save, Search } from "lucide-react"

// Mock data based on the screenshot
const clientData = {
  personalInfo: {
    participantId: "2965142",
    ssn: "1293",
    caoNumber: "",
    firstName: "Brian",
    middleInitial: "",
    lastName: "Allen",
    totalExcusedAbsence: "0.00",
    dateOfBirth: "April 27, 1988",
    gender: "Male",
    ethnicity: "Black or African American",
    education: "HS Diploma",
    criminalRecord: "Felony",
    childrenUnderAge6: "No",
    caseManager: "Chester, District - 01",
    economicallyDisadvantaged: "N/A",
    disabled: "N/A",
    veteran: "N/A",
    driversLicense: "No",
    housingIssue: "None",
    passedDrugTest: "N/A",
    status: "Active", // Added status field
  },
  programInfo: {
    daysEnrolled: "338",
    lastClockedInTime: "Never",
    lastClockedOutTime: "Never",
    currentlyClockedIn: "No",
    enrollmentDate: "08/27/2024",
    eligibilityDate: "",
    county: "Delaware County",
    snap: "No",
    selfInitiated: "No",
    tieredEmployment: "No",
    excusedHoursLast12Months: "0.00",
    terminationDate: "05/20/2025",
    terminationCode: "7 - Other",
    terminationPrePost: "Pre-placement",
    terminationGoodCause: "No",
    retentionMet: "Pending",
    advancement: "No",
    claimedPlacement: "No",
    location: "Delaware County 001, PA",
    responsibleEC: "Clark, Brandon",
    instructor: "Ashenfelter, Robert",
    jobDeveloper: "Hurst, Ryan",
    program: "Next Step Program",
    tanfDaysUsed: "267",
    enrollmentActivityCode: "99 - Generic_Activity",
    requiredHours: "20",
    coreMonthlyHours: "10",
    monthlyNonCoreHours: "10",
    csWeeklyDeemedHours: "20",
    initialMonthsVocEd: "0",
    primaryKeyword: "ALL",
    secondaryKeyword: "ALL",
    jobReadiness: "(unspecified)",
    caseId: "",
  },
  contactInfo: {
    addressLine1: "1348 Adair Rd",
    addressLine2: "",
    city: "Brookhaven",
    state: "Pennsylvania, PA",
    zip: "19015",
    homePhone: "484-487-1097",
    cellPhone: "215-207-4497",
    email: "Brianallen0488@gmail.com",
  },
  emergencyContact: {
    firstName: "Ashley",
    lastName: "Aelln",
    phone: "484-485-0427",
  },
  history: [
    {
      startDate: "08/27/2024",
      endDate: "05/20/2025",
      program: "Next Step Program",
      location: "Delaware County 001, PA",
    },
    {
      startDate: "05/25/2023",
      endDate: "02/15/2024",
      program: "Next Step Program",
      location: "Delaware County 001, PA",
    },
  ],
  auditInfo: {
    created: "Clark, Brandon [05/25/2023 11:00 AM]",
    lastUpdated: "Clark, Brandon [03/04/2025 04:25 PM]",
  },
}

export function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("client")
  const [editableData, setEditableData] = useState(clientData)

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Inactive</Badge>
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setEditableData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        status: newStatus,
      },
    }))
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {editableData.personalInfo.firstName} {editableData.personalInfo.lastName}
          </h1>
          <div className="flex items-center gap-2">{getStatusBadge(editableData.personalInfo.status)}</div>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Find another client
          </Button>
          <Button variant="outline" size="sm">
            My Clients
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Previous Enrollment Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            <strong>NOTE:</strong> You are viewing a previous enrollment.{" "}
            <button className="underline hover:no-underline">Click here</button> to view the current enrollment (if
            any).
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="ec-management">EC Management</TabsTrigger>
          <TabsTrigger value="placement">Placement-Retention</TabsTrigger>
          <TabsTrigger value="call-log">Call Log</TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Participant ID:</Label>
                    <p className="text-sm">{editableData.personalInfo.participantId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">SSN (Last 4):</Label>
                    <p className="text-sm">{editableData.personalInfo.ssn}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">First Name:</Label>
                    {isEditing ? (
                      <Input defaultValue={editableData.personalInfo.firstName} />
                    ) : (
                      <p className="text-sm">{editableData.personalInfo.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Name:</Label>
                    {isEditing ? (
                      <Input defaultValue={editableData.personalInfo.lastName} />
                    ) : (
                      <p className="text-sm">{editableData.personalInfo.lastName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date of Birth:</Label>
                    <p className="text-sm">{editableData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Gender:</Label>
                    <p className="text-sm">{editableData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status:</Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Select value={editableData.personalInfo.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Preview:</span>
                          {getStatusBadge(editableData.personalInfo.status)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">{getStatusBadge(editableData.personalInfo.status)}</div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Ethnicity:</Label>
                    <p className="text-sm">{editableData.personalInfo.ethnicity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Education:</Label>
                    <p className="text-sm">{editableData.personalInfo.education}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Criminal Record:</Label>
                    <Badge variant="destructive" className="text-xs">
                      {editableData.personalInfo.criminalRecord}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Case Manager:</Label>
                    <p className="text-sm">{editableData.personalInfo.caseManager}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Driver's License:</Label>
                    <p className="text-sm">{editableData.personalInfo.driversLicense}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Program Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium"># Days Enrolled:</Label>
                    <p className="text-sm font-semibold">{editableData.programInfo.daysEnrolled}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Currently Clocked In?:</Label>
                    <Badge variant="secondary">{editableData.programInfo.currentlyClockedIn}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Enrollment Date:</Label>
                    <p className="text-sm">{editableData.programInfo.enrollmentDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">County:</Label>
                    <p className="text-sm">{editableData.programInfo.county}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Program:</Label>
                    <p className="text-sm font-semibold">{editableData.programInfo.program}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location:</Label>
                    <p className="text-sm">{editableData.programInfo.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Responsible EC:</Label>
                    <p className="text-sm">{editableData.programInfo.responsibleEC}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Instructor:</Label>
                    <p className="text-sm">{editableData.programInfo.instructor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">TANF Days Used:</Label>
                    <p className="text-sm">{editableData.programInfo.tanfDaysUsed}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium"># of Required Hours:</Label>
                    <p className="text-sm">{editableData.programInfo.requiredHours}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Termination Date:</Label>
                    <p className="text-sm">{editableData.programInfo.terminationDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Retention Met:</Label>
                    <Badge variant="outline">{editableData.programInfo.retentionMet}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Address Line 1:</Label>
                    {isEditing ? (
                      <Input defaultValue={editableData.contactInfo.addressLine1} />
                    ) : (
                      <p className="text-sm">{editableData.contactInfo.addressLine1}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">City:</Label>
                      <p className="text-sm">{editableData.contactInfo.city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">State:</Label>
                      <p className="text-sm">{editableData.contactInfo.state}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Zip:</Label>
                      <p className="text-sm">{editableData.contactInfo.zip}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Home Phone:</Label>
                      <p className="text-sm">{editableData.contactInfo.homePhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Cell Phone:</Label>
                      <p className="text-sm">{editableData.contactInfo.cellPhone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email:</Label>
                    <p className="text-sm">{editableData.contactInfo.email}</p>
                  </div>
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
                    <Label className="text-sm font-medium">First Name:</Label>
                    <p className="text-sm">{editableData.emergencyContact.firstName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Name:</Label>
                    <p className="text-sm">{editableData.emergencyContact.lastName}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Phone:</Label>
                    <p className="text-sm">{editableData.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableData.history.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.startDate}</TableCell>
                      <TableCell>{entry.endDate}</TableCell>
                      <TableCell>{entry.program}</TableCell>
                      <TableCell>{entry.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Audit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Created:</Label>
                  <p className="text-sm">{editableData.auditInfo.created}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated:</Label>
                  <p className="text-sm">{editableData.auditInfo.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity tracking functionality would be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hours Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Time tracking and hours management functionality would be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ec-management" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>EC Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Employment counselor management functionality would be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placement" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Placement & Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Job placement and retention tracking functionality would be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="call-log" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Call logging and communication tracking functionality would be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
