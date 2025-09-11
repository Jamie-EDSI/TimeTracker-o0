"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface JobsPlacementsReportProps {
  onBack: () => void
}

export function JobsPlacementsReport({ onBack }: JobsPlacementsReportProps) {
  const placements = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      participantId: "2965145",
      employer: "ABC Manufacturing",
      position: "Production Assistant",
      startDate: "2023-10-15",
      hourlyWage: "$16.50",
      status: "Active",
    },
    {
      id: "2",
      clientName: "Michael Davis",
      participantId: "2965146",
      employer: "Tech Solutions Inc",
      position: "Data Entry Clerk",
      startDate: "2023-09-20",
      hourlyWage: "$15.00",
      status: "Active",
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
            <h1 className="text-2xl font-bold text-gray-900">Jobs & Placements Report</h1>
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
              <CardTitle>Job Placements ({placements.length})</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search placements..." className="pl-10 w-64" />
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
                    <th className="text-left py-3 px-4">Client Name</th>
                    <th className="text-left py-3 px-4">Participant ID</th>
                    <th className="text-left py-3 px-4">Employer</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">Hourly Wage</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((placement) => (
                    <tr key={placement.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{placement.clientName}</td>
                      <td className="py-3 px-4 font-mono">{placement.participantId}</td>
                      <td className="py-3 px-4">{placement.employer}</td>
                      <td className="py-3 px-4">{placement.position}</td>
                      <td className="py-3 px-4">{new Date(placement.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{placement.hourlyWage}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {placement.status}
                        </span>
                      </td>
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
