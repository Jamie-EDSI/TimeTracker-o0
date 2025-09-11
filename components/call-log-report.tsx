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
  phone: string
  caseManager: string
}

interface CallLogReportProps {
  onBack: () => void
  onViewClient: (clientId: string) => void
  clients: Client[]
}

export function CallLogReport({ onBack, onViewClient, clients }: CallLogReportProps) {
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

  // Mock call log data
  const callLogs = clients.map((client) => ({
    ...client,
    lastCallDate: "2024-01-15",
    lastCallType: "Check-in",
    lastCallNotes: "Client reported progress on job search activities. Scheduled follow-up appointment.",
    totalCalls: Math.floor(Math.random() * 10) + 1,
    nextCallDue: "2024-01-22",
  }))

  const filteredLogs = callLogs.filter(
    (log) =>
      safeString(log.firstName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(log.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(log.participantId).includes(searchTerm),
  )

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    }
  }

  const getCallTypeBadge = (type: string) => {
    const colors = {
      "Check-in": "bg-blue-100 text-blue-800 border-blue-200",
      Assessment: "bg-purple-100 text-purple-800 border-purple-200",
      "Follow-up": "bg-orange-100 text-orange-800 border-orange-200",
      Emergency: "bg-red-100 text-red-800 border-red-200",
    }
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {type}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Call Log Report</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{filteredLogs.length}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredLogs.reduce((sum, log) => sum + log.totalCalls, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Calls</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredLogs.filter((log) => new Date(log.nextCallDue) <= new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Calls Due</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(filteredLogs.reduce((sum, log) => sum + log.totalCalls, 0) / filteredLogs.length || 0)}
              </div>
              <div className="text-sm text-gray-600">Avg Calls/Client</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Case Notes & Communications</CardTitle>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="search">Search Clients</Label>
              <Input
                id="search"
                placeholder="Search by name or PID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-9 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Name</div>
                <div>PID</div>
                <div>Status</div>
                <div>Last Call</div>
                <div>Call Type</div>
                <div>Total Calls</div>
                <div>Next Due</div>
                <div>Case Manager</div>
                <div>Actions</div>
              </div>
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-9 gap-4 text-sm items-center py-3 border-b hover:bg-gray-50"
                >
                  <div className="font-medium">
                    {safeString(log.lastName)}, {safeString(log.firstName)}
                  </div>
                  <div>{safeString(log.participantId)}</div>
                  <div>{getStatusBadge(log.status)}</div>
                  <div>{safeString(log.lastCallDate)}</div>
                  <div>{getCallTypeBadge(log.lastCallType)}</div>
                  <div>{log.totalCalls}</div>
                  <div className={new Date(log.nextCallDue) <= new Date() ? "text-red-600 font-medium" : ""}>
                    {safeString(log.nextCallDue)}
                  </div>
                  <div>{safeString(log.caseManager)}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onViewClient(log.id)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">No call logs found matching your search.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
