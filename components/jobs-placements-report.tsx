"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download, Eye } from "lucide-react"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  caseManager: string
}

interface JobsPlacementsReportProps {
  onBack: () => void
  onViewClient: (clientId: string) => void
  clients: Client[]
}

export function JobsPlacementsReport({ onBack, onViewClient, clients }: JobsPlacementsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const safeString = (value: any): string => {
    if (value === null || value === undefined) {
      return "Not provided"
    }
    if (typeof value === "object") {
      return "Not provided"
    }
    return String(value)
  }

  // Mock employment data
  const employmentData = clients.map((client) => ({
    ...client,
    employmentStatus: Math.random() > 0.6 ? "Employed" : "Seeking",
    jobTitle: Math.random() > 0.6 ? "Sales Associate" : "",
    employer: Math.random() > 0.6 ? "ABC Company" : "",
    placementDate: Math.random() > 0.6 ? "2024-01-10" : "",
    hourlyWage: Math.random() > 0.6 ? "$15.50" : "",
    hoursPerWeek: Math.random() > 0.6 ? "35" : "",
    retentionDays: Math.random() > 0.6 ? Math.floor(Math.random() * 180) + 30 : 0,
  }))

  const filteredData = employmentData.filter(
    (data) =>
      safeString(data.firstName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(data.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(data.participantId).includes(searchTerm),
  )

  const getEmploymentBadge = (status: string) => {
    if (status === "Employed") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Employed</Badge>
    } else {
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Seeking</Badge>
    }
  }

  const employedCount = filteredData.filter((d) => d.employmentStatus === "Employed").length
  const placementRate = filteredData.length > 0 ? Math.round((employedCount / filteredData.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Jobs & Placements Report</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{employedCount}</div>
              <div className="text-sm text-gray-600">Currently Employed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{placementRate}%</div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  filteredData.filter((d) => d.retentionDays > 0).reduce((sum, d) => sum + d.retentionDays, 0) /
                    employedCount || 0,
                )}
              </div>
              <div className="text-sm text-gray-600">Avg Retention (Days)</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Employment Placements & EVF Data</CardTitle>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="search">Search Participants</Label>
              <Input
                id="search"
                placeholder="Search by name or PID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-10 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Name</div>
                <div>PID</div>
                <div>Program</div>
                <div>Employment Status</div>
                <div>Job Title</div>
                <div>Employer</div>
                <div>Placement Date</div>
                <div>Hourly Wage</div>
                <div>Hours/Week</div>
                <div>Actions</div>
              </div>
              {filteredData.map((data) => (
                <div
                  key={data.id}
                  className="grid grid-cols-10 gap-4 text-sm items-center py-3 border-b hover:bg-gray-50"
                >
                  <div className="font-medium">
                    {safeString(data.lastName)}, {safeString(data.firstName)}
                  </div>
                  <div>{safeString(data.participantId)}</div>
                  <div>{safeString(data.program)}</div>
                  <div>{getEmploymentBadge(data.employmentStatus)}</div>
                  <div>{safeString(data.jobTitle)}</div>
                  <div>{safeString(data.employer)}</div>
                  <div>{safeString(data.placementDate)}</div>
                  <div>{safeString(data.hourlyWage)}</div>
                  <div>{safeString(data.hoursPerWeek)}</div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => onViewClient(data.id)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500">No employment data found matching your search.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
