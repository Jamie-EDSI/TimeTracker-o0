"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Download,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  User,
  FileText,
  Filter,
  Eye,
} from "lucide-react"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  phone: string
  email: string
  caseManager: string
}

interface CallLogReportProps {
  onBack: () => void
  onViewClient: (clientId: string) => void
  clients: Client[]
}

// Mock call log data
const mockCallLogs = [
  {
    id: "1",
    clientId: "1",
    clientName: "Davis, Michael",
    participantId: "2965144",
    lastContactDate: "2024-01-15",
    contactType: "Phone Call",
    duration: "15 minutes",
    caseNote:
      "Discussed job search progress. Client has submitted 3 applications this week. Scheduled follow-up interview preparation session.",
    nextFollowUp: "2024-01-22",
    priority: "Medium",
    caseManager: "Smith, John",
    program: "Job Readiness",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Johnson, Sarah",
    participantId: "2965145",
    lastContactDate: "2024-01-14",
    contactType: "In-Person",
    duration: "30 minutes",
    caseNote:
      "Career counseling session completed. Updated resume and discussed interview techniques. Client is ready for job placement.",
    nextFollowUp: "2024-01-21",
    priority: "High",
    caseManager: "Brown, Lisa",
    program: "EARN",
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Wilson, Robert",
    participantId: "2965146",
    lastContactDate: "2024-01-13",
    contactType: "Email",
    duration: "N/A",
    caseNote:
      "Sent job leads and application instructions. Client responded positively and will apply to 2 positions by end of week.",
    nextFollowUp: "2024-01-20",
    priority: "Medium",
    caseManager: "Davis, Jennifer",
    program: "Ex-Offender",
  },
  {
    id: "4",
    clientId: "4",
    clientName: "Brown, Emily",
    participantId: "2965147",
    lastContactDate: "2024-01-12",
    contactType: "Text Message",
    duration: "N/A",
    caseNote: "Quick check-in regarding training schedule. Client confirmed attendance for next week's sessions.",
    nextFollowUp: "2024-01-19",
    priority: "Low",
    caseManager: "Miller, Robert",
    program: "YOUTH",
  },
  {
    id: "5",
    clientId: "5",
    clientName: "Miller, James",
    participantId: "2965148",
    lastContactDate: "2024-01-11",
    contactType: "Phone Call",
    duration: "20 minutes",
    caseNote:
      "Discussed barriers to employment. Client needs transportation assistance. Connected with local resources.",
    nextFollowUp: "2024-01-18",
    priority: "High",
    caseManager: "Garcia, Maria",
    program: "Job Readiness",
  },
  {
    id: "6",
    clientId: "6",
    clientName: "Garcia, Lisa",
    participantId: "2965149",
    lastContactDate: "2024-01-10",
    contactType: "In-Person",
    duration: "45 minutes",
    caseNote: "Comprehensive assessment completed. Identified skills gaps and created individualized training plan.",
    nextFollowUp: "2024-01-17",
    priority: "Medium",
    caseManager: "White, Kevin",
    program: "EARN",
  },
]

export function CallLogReport({ onBack, onViewClient, clients }: CallLogReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgram, setFilterProgram] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterContactType, setFilterContactType] = useState("all")

  const filteredLogs = mockCallLogs.filter((log) => {
    const matchesSearch =
      log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.participantId.includes(searchTerm) ||
      log.caseNote.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgram = filterProgram === "all" || log.program === filterProgram
    const matchesPriority = filterPriority === "all" || log.priority === filterPriority
    const matchesContactType = filterContactType === "all" || log.contactType === filterContactType

    return matchesSearch && matchesProgram && matchesPriority && matchesContactType
  })

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "Phone Call":
        return <Phone className="w-4 h-4" />
      case "Email":
        return <Mail className="w-4 h-4" />
      case "In-Person":
        return <User className="w-4 h-4" />
      case "Text Message":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Client Name",
      "Participant ID",
      "Program",
      "Last Contact Date",
      "Contact Type",
      "Duration",
      "Case Note",
      "Next Follow-up",
      "Priority",
      "Case Manager",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          `"${log.clientName}"`,
          log.participantId,
          `"${log.program}"`,
          log.lastContactDate,
          `"${log.contactType}"`,
          `"${log.duration}"`,
          `"${log.caseNote.replace(/"/g, '""')}"`,
          log.nextFollowUp,
          log.priority,
          `"${log.caseManager}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `call-log-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-6 h-6 text-blue-600" />
              Call Log Report
            </h1>
          </div>
          <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold">{filteredLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold">{filteredLogs.filter((log) => log.priority === "High").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold">
                    {
                      filteredLogs.filter((log) => {
                        const contactDate = new Date(log.lastContactDate)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return contactDate >= weekAgo
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Duration</p>
                  <p className="text-2xl font-bold">22m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search clients, notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="program-filter">Program</Label>
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="Job Readiness">Job Readiness</SelectItem>
                    <SelectItem value="EARN">EARN</SelectItem>
                    <SelectItem value="Ex-Offender">Ex-Offender</SelectItem>
                    <SelectItem value="YOUTH">YOUTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority-filter">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact-type-filter">Contact Type</Label>
                <Select value={filterContactType} onValueChange={setFilterContactType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Phone Call">Phone Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Text Message">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterProgram("all")
                    setFilterPriority("all")
                    setFilterContactType("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Call Log Details ({filteredLogs.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Next Follow-up</TableHead>
                    <TableHead>Case Note</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.clientName}</div>
                          <div className="text-sm text-gray-500">PID: {log.participantId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.program}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {log.lastContactDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getContactTypeIcon(log.contactType)}
                          <span className="text-sm">{log.contactType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {log.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(log.priority)}>{log.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {log.nextFollowUp}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={log.caseNote}>
                          {log.caseNote}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClient(log.clientId)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No call logs found</p>
                <p className="text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
