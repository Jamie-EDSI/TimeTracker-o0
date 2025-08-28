"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as XLSX from "xlsx"
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Settings,
  Home,
  Activity,
  FileText,
  Eye,
  ArrowUpDown,
} from "lucide-react"

// Mock data based on the provided image
const mockActiveClients = [
  {
    id: "1",
    client: "Alexander, Eric",
    pid: "2753853",
    caoNumber: "",
    ec: "Lewis, Jillian",
    caseManager: "",
    enrollmentDate: "02/15/2023",
    daysEnrolled: 926,
    program: "Ex-Offender",
    activity: "99 - Generic_Activity",
    activityStartDate: "02/15/2023",
    expectedHours: 10,
    employmentStart: "",
    employmentEnd: "",
    claimedPlacement: "",
    status: "Active",
    phone: "484-555-0101",
    email: "eric.alexander@email.com",
  },
  {
    id: "2",
    client: "Alloway, Ralph",
    pid: "6660264",
    caoNumber: "",
    ec: "Lewis, Jillian",
    caseManager: "",
    enrollmentDate: "11/08/2023",
    daysEnrolled: 660,
    program: "Ex-Offender",
    activity: "99 - Generic_Activity",
    activityStartDate: "11/08/2023",
    expectedHours: 10,
    employmentStart: "",
    employmentEnd: "",
    claimedPlacement: "",
    status: "Active",
    phone: "484-555-0102",
    email: "ralph.alloway@email.com",
  },
  {
    id: "3",
    client: "Anderson, Heavyn",
    pid: "6429415",
    caoNumber: "949059",
    ec: "Dellafranco, Jeffrey",
    caseManager: "Chester, District",
    enrollmentDate: "09/17/2024",
    daysEnrolled: 346,
    program: "EARN",
    activity: "33 - Unsubsidized Employment",
    activityStartDate: "03/28/2025",
    expectedHours: 80,
    employmentStart: "03/28/2025",
    employmentEnd: "",
    claimedPlacement: "YES",
    status: "Active",
    phone: "484-555-0103",
    email: "heavyn.anderson@email.com",
  },
  {
    id: "4",
    client: "Andrew, O'Boyle",
    pid: "350696",
    caoNumber: "",
    ec: "Holmes, Ariona",
    caseManager: "",
    enrollmentDate: "06/13/2024",
    daysEnrolled: 442,
    program: "Ex-Offender",
    activity: "99 - Generic_Activity",
    activityStartDate: "06/13/2024",
    expectedHours: 40,
    employmentStart: "",
    employmentEnd: "",
    claimedPlacement: "",
    status: "Active",
    phone: "484-555-0104",
    email: "oboyle.andrew@email.com",
  },
  {
    id: "5",
    client: "Andrews, Dayshon",
    pid: "2643103",
    caoNumber: "1033753",
    ec: "Dellafranco, Jeffrey",
    caseManager: "Chester, District",
    enrollmentDate: "07/18/2024",
    daysEnrolled: 407,
    program: "EARN",
    activity: "33 - Unsubsidized Employment",
    activityStartDate: "09/01/2024",
    expectedHours: 80,
    employmentStart: "09/01/2024",
    employmentEnd: "",
    claimedPlacement: "YES",
    status: "Active",
    phone: "484-555-0105",
    email: "dayshon.andrews@email.com",
  },
  {
    id: "6",
    client: "Ansley, Lawrence",
    pid: "6612585",
    caoNumber: "",
    ec: "Lewis, Jillian",
    caseManager: "",
    enrollmentDate: "09/05/2023",
    daysEnrolled: 724,
    program: "Ex-Offender",
    activity: "99 - Generic_Activity",
    activityStartDate: "09/05/2023",
    expectedHours: 10,
    employmentStart: "",
    employmentEnd: "",
    claimedPlacement: "",
    status: "Active",
    phone: "484-555-0106",
    email: "lawrence.ansley@email.com",
  },
  {
    id: "7",
    client: "Argro, Kanie",
    pid: "4235316",
    caoNumber: "964917",
    ec: "McDermitt, Ricki",
    caseManager: "Chester, District",
    enrollmentDate: "05/13/2025",
    daysEnrolled: 108,
    program: "EARN",
    activity: "8 - Assessment Tracking",
    activityStartDate: "05/13/2025",
    expectedHours: 80,
    employmentStart: "",
    employmentEnd: "",
    claimedPlacement: "",
    status: "Active",
    phone: "484-555-0107",
    email: "kanie.argro@email.com",
  },
  {
    id: "8",
    client: "Arroyo, Jose",
    pid: "6287044",
    caoNumber: "",
    ec: "Padalino, Emily",
    caseManager: "",
    enrollmentDate: "11/19/2021",
    daysEnrolled: 1379,
    program: "YOUTH",
    activity: "92 - Case Management",
    activityStartDate: "11/19/2021",
    expectedHours: 5,
    employmentStart: "",
    employmentEnd: "",
    claimedPlacement: "",
    status: "Active",
    phone: "484-555-0108",
    email: "jose.arroyo@email.com",
  },
]

interface ActiveClientsReportProps {
  onBack: () => void
  onViewClient: (clientId: string) => void
}

export function ActiveClientsReport({ onBack, onViewClient }: ActiveClientsReportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [programFilter, setProgramFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<string>("client")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [isExporting, setIsExporting] = useState(false)

  // Get unique programs for filter dropdown
  const programs = useMemo(() => {
    const uniquePrograms = [...new Set(mockActiveClients.map((client) => client.program))]
    return uniquePrograms.sort()
  }, [])

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    const filtered = mockActiveClients.filter((client) => {
      const matchesSearch =
        client.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.pid.includes(searchTerm) ||
        client.ec.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.activity.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProgram = programFilter === "all" || client.program === programFilter
      const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesProgram && matchesStatus
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a]
      let bValue = b[sortField as keyof typeof b]

      // Handle numeric fields
      if (sortField === "daysEnrolled" || sortField === "expectedHours") {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      }

      // Handle date fields
      if (sortField === "enrollmentDate" || sortField === "activityStartDate") {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [searchTerm, programFilter, statusFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClients = filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const exportToXLSX = async () => {
    setIsExporting(true)
    try {
      const headers = [
        "Client",
        "PID",
        "CAO #",
        "EC",
        "Case Manager",
        "Enrollment Date",
        "Days Enrolled",
        "Program",
        "Activity",
        "Activity Start Date",
        "Expected Hours",
        "Employment Start",
        "Employment End",
        "Claimed Placement",
        "Phone",
        "Email",
      ]

      const data = filteredAndSortedClients.map((client) => [
        client.client,
        client.pid,
        client.caoNumber,
        client.ec,
        client.caseManager,
        client.enrollmentDate,
        client.daysEnrolled,
        client.program,
        client.activity,
        client.activityStartDate,
        client.expectedHours,
        client.employmentStart,
        client.employmentEnd,
        client.claimedPlacement,
        client.phone,
        client.email,
      ])

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])

      // Auto-size columns
      const colWidths = headers.map((header, i) => {
        const maxLength = Math.max(header.length, ...data.map((row) => String(row[i] || "").length))
        return { wch: Math.min(maxLength + 2, 50) }
      })
      worksheet["!cols"] = colWidths

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Active Clients")

      XLSX.writeFile(workbook, `active-clients-report-${new Date().toISOString().split("T")[0]}.xlsx`)
    } finally {
      setTimeout(() => setIsExporting(false), 1000) // Brief delay to show completion
    }
  }

  const exportToCSV = async () => {
    setIsExporting(true)
    try {
      const headers = [
        "Client",
        "PID",
        "CAO #",
        "EC",
        "Case Manager",
        "Enrollment Date",
        "Days Enrolled",
        "Program",
        "Activity",
        "Activity Start Date",
        "Expected Hours",
        "Employment Start",
        "Employment End",
        "Claimed Placement",
        "Phone",
        "Email",
      ]

      const csvContent = [
        headers.join(","),
        ...filteredAndSortedClients.map((client) =>
          [
            `"${client.client}"`,
            client.pid,
            client.caoNumber,
            `"${client.ec}"`,
            `"${client.caseManager}"`,
            client.enrollmentDate,
            client.daysEnrolled,
            client.program,
            `"${client.activity}"`,
            client.activityStartDate,
            client.expectedHours,
            client.employmentStart,
            client.employmentEnd,
            client.claimedPlacement,
            client.phone,
            client.email,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `active-clients-report-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setTimeout(() => setIsExporting(false), 1000) // Brief delay to show completion
    }
  }

  const exportCurrentView = async () => {
    setIsExporting(true)
    try {
      const headers = [
        "Client",
        "PID",
        "CAO #",
        "EC",
        "Case Manager",
        "Enrollment Date",
        "Days Enrolled",
        "Program",
        "Activity",
        "Activity Start Date",
        "Expected Hours",
        "Employment Start",
        "Claimed Placement",
      ]

      const csvContent = [
        headers.join(","),
        ...paginatedClients.map((client) =>
          [
            `"${client.client}"`,
            client.pid,
            client.caoNumber,
            `"${client.ec}"`,
            `"${client.caseManager}"`,
            client.enrollmentDate,
            client.daysEnrolled,
            client.program,
            `"${client.activity}"`,
            client.activityStartDate,
            client.expectedHours,
            client.employmentStart,
            client.claimedPlacement,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `active-clients-current-view-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setTimeout(() => setIsExporting(false), 1000) // Brief delay to show completion
    }
  }

  const exportCurrentViewXLSX = async () => {
    setIsExporting(true)
    try {
      const headers = [
        "Client",
        "PID",
        "CAO #",
        "EC",
        "Case Manager",
        "Enrollment Date",
        "Days Enrolled",
        "Program",
        "Activity",
        "Activity Start Date",
        "Expected Hours",
        "Employment Start",
        "Employment End",
        "Claimed Placement",
      ]

      const data = paginatedClients.map((client) => [
        client.client,
        client.pid,
        client.caoNumber,
        client.ec,
        client.caseManager,
        client.enrollmentDate,
        client.daysEnrolled,
        client.program,
        client.activity,
        client.activityStartDate,
        client.expectedHours,
        client.employmentStart,
        client.employmentEnd,
        client.claimedPlacement,
      ])

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])

      // Auto-size columns
      const colWidths = headers.map((header, i) => {
        const maxLength = Math.max(header.length, ...data.map((row) => String(row[i] || "").length))
        return { wch: Math.min(maxLength + 2, 50) }
      })
      worksheet["!cols"] = colWidths

      // Add some styling
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1"
        if (!worksheet[address]) continue
        worksheet[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "E5E7EB" } },
        }
      }

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${currentPage}`)

      XLSX.writeFile(workbook, `active-clients-page-${currentPage}-${new Date().toISOString().split("T")[0]}.xlsx`)
    } finally {
      setTimeout(() => setIsExporting(false), 1000) // Brief delay to show completion
    }
  }

  // Breadcrumb logic
  const getBreadcrumbs = () => {
    return [
      {
        label: "Dashboard",
        onClick: onBack,
        isActive: false,
        dropdownItems: [
          { label: "Overview", icon: Home, action: onBack },
          { label: "Reports", icon: BarChart3, action: () => console.log("Navigate to reports") },
          { label: "Recent Activities", icon: Activity, action: () => console.log("Navigate to activities") },
          { label: "System Settings", icon: Settings, action: () => console.log("Navigate to settings") },
        ],
      },
      {
        label: "Active Clients Report",
        onClick: () => {},
        isActive: true,
        dropdownItems: [
          { label: "Export All as Excel", icon: Download, action: exportToXLSX },
          { label: "Export All as CSV", icon: Download, action: exportToCSV },
          { label: "Export Current Page (Excel)", icon: Eye, action: exportCurrentViewXLSX },
          { label: "Export Current Page (CSV)", icon: FileText, action: exportCurrentView },
          { label: "Print Report", icon: FileText, action: () => window.print() },
          { label: "Report Settings", icon: Settings, action: () => console.log("Report settings") },
        ],
      },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Top row with logo */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
        </div>

        {/* Second row with navigation and actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">Active Clients Report</h2>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Download className="w-4 h-4 mr-2" />
                  Export Client Data
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="text-base font-semibold">Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Full Dataset Exports */}
                <div className="px-2 py-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Complete Dataset</p>
                </div>

                <DropdownMenuItem onClick={exportToXLSX} className="cursor-pointer py-3">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Export as Excel (XLSX)</div>
                      <div className="text-xs text-gray-500">Full dataset with formatting</div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {filteredAndSortedClients.length} records
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer py-3">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-xs text-gray-500">Comma-separated values</div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {filteredAndSortedClients.length} records
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Current View Exports */}
                <div className="px-2 py-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Current Page Only</p>
                </div>

                <DropdownMenuItem onClick={exportCurrentViewXLSX} className="cursor-pointer py-3">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                      <Eye className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Current View (XLSX)</div>
                      <div className="text-xs text-gray-500">Page {currentPage} data only</div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {paginatedClients.length} records
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={exportCurrentView} className="cursor-pointer py-3">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                      <Eye className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Current View (CSV)</div>
                      <div className="text-xs text-gray-500">Page {currentPage} data only</div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {paginatedClients.length} records
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Additional Options */}
                <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer py-2">
                  <FileText className="w-4 h-4 mr-3 text-gray-600" />
                  <span>Print Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Export Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportToXLSX}
              className="hidden md:flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors bg-transparent"
              title="Quick export to Excel"
            >
              <FileText className="w-4 h-4 text-green-600" />
              XLSX
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="hidden md:flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
              title="Quick export to CSV"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              CSV
            </Button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((breadcrumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
                {breadcrumb.isActive ? (
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                    {breadcrumb.dropdownItems && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {breadcrumb.dropdownItems.map((item, itemIndex) => (
                            <DropdownMenuItem key={itemIndex} onClick={item.action} className="cursor-pointer">
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ) : (
                  <button onClick={breadcrumb.onClick} className="text-blue-600 hover:text-blue-800 hover:underline">
                    {breadcrumb.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Export Summary Card */}
        {filteredAndSortedClients.length > 0 && (
          <Card className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ready to Export</p>
                    <p className="text-sm text-gray-600">
                      {filteredAndSortedClients.length} clients match your current filters
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={exportToXLSX}
                    disabled={isExporting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Quick Export (XLSX)
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportToCSV}
                    disabled={isExporting}
                    className="hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Quick Export (CSV)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search Clients</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, PID, EC, or activity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="program">Program</Label>
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="itemsPerPage">Items per Page</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedClients.length)} of{" "}
            {filteredAndSortedClients.length} clients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="min-w-[150px]">
                      <Button variant="ghost" onClick={() => handleSort("client")} className="h-auto p-0 font-semibold">
                        Client {getSortIcon("client")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("pid")} className="h-auto p-0 font-semibold">
                        PID {getSortIcon("pid")}
                      </Button>
                    </TableHead>
                    <TableHead>CAO #</TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button variant="ghost" onClick={() => handleSort("ec")} className="h-auto p-0 font-semibold">
                        EC {getSortIcon("ec")}
                      </Button>
                    </TableHead>
                    <TableHead>Case Mgr</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("enrollmentDate")}
                        className="h-auto p-0 font-semibold"
                      >
                        Enrollment Date {getSortIcon("enrollmentDate")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("daysEnrolled")}
                        className="h-auto p-0 font-semibold"
                      >
                        Days Enrolled {getSortIcon("daysEnrolled")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("program")}
                        className="h-auto p-0 font-semibold"
                      >
                        Program {getSortIcon("program")}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[200px]">Activity</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("expectedHours")}
                        className="h-auto p-0 font-semibold"
                      >
                        Expected Hours {getSortIcon("expectedHours")}
                      </Button>
                    </TableHead>
                    <TableHead>Employment Start</TableHead>
                    <TableHead>Claimed Placement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{client.client}</TableCell>
                      <TableCell>{client.pid}</TableCell>
                      <TableCell>{client.caoNumber}</TableCell>
                      <TableCell>{client.ec}</TableCell>
                      <TableCell>{client.caseManager}</TableCell>
                      <TableCell>{client.enrollmentDate}</TableCell>
                      <TableCell className="text-center">{client.daysEnrolled}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.program}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{client.activity}</TableCell>
                      <TableCell className="text-center">{client.expectedHours}</TableCell>
                      <TableCell>{client.employmentStart}</TableCell>
                      <TableCell>
                        {client.claimedPlacement && (
                          <Badge variant="default" className="bg-green-600">
                            {client.claimedPlacement}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClient(client.id)}
                          className="hover:bg-blue-50 hover:border-blue-300"
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
          </CardContent>
        </Card>

        {/* Pagination Footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">Total: {filteredAndSortedClients.length} clients</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
