"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ActiveClientsReportProps {
  onBack: () => void
}

export function ActiveClientsReport({ onBack }: ActiveClientsReportProps) {
  const activeClients = [
    {
      id: "1",
      name: "Sarah Johnson",
      participantId: "2965145",
      program: "EARN",
      enrollmentDate: "2023-02-20",
      caseManager: "Brown, Lisa",
      lastContact: "2023-11-15",
    },
    {
      id: "2",
      name: "Michael Davis",
      participantId: "2965146",
      program: "Job Readiness",
      enrollmentDate: "2023-03-15",
      caseManager: "Smith, John",
      lastContact: "2023-11-14",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">Active Clients Report</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Clients ({activeClients.length})</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search clients..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Participant ID</th>
                    <th className="text-left py-3 px-4">Program</th>
                    <th className="text-left py-3 px-4">Enrollment Date</th>
                    <th className="text-left py-3 px-4">Case Manager</th>
                    <th className="text-left py-3 px-4">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{client.name}</td>
                      <td className="py-3 px-4 font-mono">{client.participantId}</td>
                      <td className="py-3 px-4">{client.program}</td>
                      <td className="py-3 px-4">{new Date(client.enrollmentDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{client.caseManager}</td>
                      <td className="py-3 px-4">{new Date(client.lastContact).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
