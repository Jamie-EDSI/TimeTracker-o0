"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CallLogReportProps {
  onBack: () => void
}

export function CallLogReport({ onBack }: CallLogReportProps) {
  const callLogs = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      participantId: "2965145",
      callDate: "2023-11-15",
      callType: "Outbound",
      duration: "15 min",
      outcome: "Successful contact",
      notes: "Discussed job placement opportunities",
    },
    {
      id: "2",
      clientName: "Michael Davis",
      participantId: "2965146",
      callDate: "2023-11-14",
      callType: "Inbound",
      duration: "8 min",
      outcome: "Information provided",
      notes: "Client requested program information",
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
            <h1 className="text-2xl font-bold text-gray-900">Call Log Report</h1>
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
              <CardTitle>Call Logs ({callLogs.length})</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search calls..." className="pl-10 w-64" />
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
                    <th className="text-left py-3 px-4">Call Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Outcome</th>
                    <th className="text-left py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {callLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{log.clientName}</td>
                      <td className="py-3 px-4 font-mono">{log.participantId}</td>
                      <td className="py-3 px-4">{new Date(log.callDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{log.callType}</td>
                      <td className="py-3 px-4">{log.duration}</td>
                      <td className="py-3 px-4">{log.outcome}</td>
                      <td className="py-3 px-4">{log.notes}</td>
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
