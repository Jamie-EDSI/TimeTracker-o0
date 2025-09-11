"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Search, Eye } from "lucide-react"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  email: string
  caseManager: string
}

interface ActiveClientsReportProps {
  onBack: () => void
  onViewClient: (clientId: string) => void
  clients: Client[]
}

export function ActiveClientsReport({ onBack, onViewClient, clients }: ActiveClientsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [programFilter, setProgramFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")

  const safeString = (value: any): string => {
    if (value === null || value === undefined) {
      return "Not provided"
    }
    if (typeof value === "object") {
      return "Not provided"
    }
    return String(value)
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      safeString(client.firstName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(client.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(client.participantId).includes(searchTerm)

    const matchesProgram = programFilter === "all" || client.program === programFilter
    const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesProgram && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    }
  }

  const uniquePrograms = Array.from(new Set(clients.map((client) => client.program)))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Active Clients Report</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{filteredClients.length}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredClients.filter((c) => c.status === "Active").length}
              </div>
              <div className="text-sm text-gray-600">Active Clients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredClients.filter((c) => c.status === "Inactive").length}
              </div>
              <div className="text-sm text-gray-600">Inactive Clients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{uniquePrograms.length}</div>
              <div className="text-sm text-gray-600">Active Programs</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Directory</CardTitle>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="search">Search Clients</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or PID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="program-filter">Program</Label>
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {uniquePrograms.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Name</div>
                <div>PID</div>
                <div>Program</div>
                <div>Status</div>
                <div>Enrollment Date</div>
                <div>Phone</div>
                <div>Case Manager</div>
                <div>Actions</div>
              </div>
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="grid grid-cols-8 gap-4 text-sm items-center py-3 border-b hover:bg-gray-50"
                >
                  <div className="font-medium">
                    {safeString(client.lastName)}, {safeString(client.firstName)}
                  </div>
                  <div>{safeString(client.participantId)}</div>
                  <div>{safeString(client.program)}</div>
                  <div>{getStatusBadge(client.status)}</div>
                  <div>{safeString(client.enrollmentDate)}</div>
                  <div>{safeString(client.phone)}</div>
                  <div>{safeString(client.caseManager)}</div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => onViewClient(client.id)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="text-center py-8 text-gray-500">No clients found matching your criteria.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
