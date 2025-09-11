"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Edit, Phone, Mail, Calendar, User, Briefcase } from "lucide-react"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
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
  ssn?: string
  emergencyContact: string
  emergencyPhone: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
}

interface ClientManagementProps {
  onBack: () => void
  clients: Client[]
  selectedClientId?: string | null
}

export function ClientManagement({ onBack, clients, selectedClientId }: ClientManagementProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    selectedClientId ? clients.find((c) => c.id === selectedClientId) || null : null,
  )

  const safeString = (value: any): string => {
    if (value === null || value === undefined) {
      return "Not provided"
    }
    if (typeof value === "object") {
      return "Not provided"
    }
    return String(value)
  }

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    }
  }

  if (selectedClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Client List
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {safeString(selectedClient.firstName)} {safeString(selectedClient.lastName)}
            </h1>
            {getStatusBadge(selectedClient.status)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Name</label>
                      <p className="text-gray-900">{safeString(selectedClient.firstName)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Name</label>
                      <p className="text-gray-900">{safeString(selectedClient.lastName)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Participant ID</label>
                      <p className="text-gray-900">{safeString(selectedClient.participantId)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{safeString(selectedClient.dateOfBirth)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{safeString(selectedClient.phone)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{safeString(selectedClient.email)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">
                      {safeString(selectedClient.address)}
                      <br />
                      {safeString(selectedClient.city)}, {safeString(selectedClient.state)}{" "}
                      {safeString(selectedClient.zipCode)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                      <p className="text-gray-900">{safeString(selectedClient.emergencyContact)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Emergency Phone</label>
                      <p className="text-gray-900">{safeString(selectedClient.emergencyPhone)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Program Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Program</label>
                      <p className="text-gray-900">{safeString(selectedClient.program)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                      <p className="text-gray-900">{safeString(selectedClient.enrollmentDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Case Manager</label>
                    <p className="text-gray-900">{safeString(selectedClient.caseManager)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Client
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Add Case Note
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Case note added</p>
                        <p className="text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Program enrollment</p>
                        <p className="text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Initial assessment</p>
                        <p className="text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Clients ({clients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Name</div>
                <div>PID</div>
                <div>Program</div>
                <div>Status</div>
                <div>Enrollment</div>
                <div>Case Manager</div>
                <div>Actions</div>
              </div>
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="grid grid-cols-7 gap-4 text-sm items-center py-3 border-b hover:bg-gray-50"
                >
                  <div className="font-medium">
                    {safeString(client.lastName)}, {safeString(client.firstName)}
                  </div>
                  <div>{safeString(client.participantId)}</div>
                  <div>{safeString(client.program)}</div>
                  <div>{getStatusBadge(client.status)}</div>
                  <div>{safeString(client.enrollmentDate)}</div>
                  <div>{safeString(client.caseManager)}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedClient(client)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
