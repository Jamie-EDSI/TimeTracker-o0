"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  Home,
  Users,
  UserPlus,
  Search,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Settings,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { NewClientForm } from "./new-client-form"
import { ClientManagement } from "./client-management"

export function Dashboard() {
  const [searchForm, setSearchForm] = useState({
    name: "",
    participantId: "",
    ssn: "",
    recordsPerPage: "10",
  })

  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [showClientManagement, setShowClientManagement] = useState(false)

  const handleSearch = () => {
    console.log("Searching with:", searchForm)
    // Implement search functionality
  }

  // Breadcrumb logic with dropdown options
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: "Dashboard",
        href: "#",
        isActive: false,
        dropdownItems: [
          { label: "Overview", icon: Home, action: () => console.log("Navigate to overview") },
          { label: "Reports", icon: BarChart3, action: () => console.log("Navigate to reports") },
          { label: "Recent Activities", icon: Activity, action: () => console.log("Navigate to activities") },
          { label: "System Settings", icon: Settings, action: () => console.log("Navigate to settings") },
        ],
      },
    ]

    if (showClientManagement) {
      breadcrumbs.push({
        label: "Client Management",
        href: "#",
        isActive: true,
        dropdownItems: [
          { label: "All Clients", icon: Users, action: () => console.log("Show all clients") },
          { label: "Active Clients", icon: Users, action: () => console.log("Show active clients") },
          { label: "Inactive Clients", icon: Users, action: () => console.log("Show inactive clients") },
          { label: "Client Reports", icon: BarChart3, action: () => console.log("Show client reports") },
        ],
      })
    } else if (showNewClientForm) {
      breadcrumbs.push({
        label: "Create New Client",
        href: "#",
        isActive: true,
        dropdownItems: [
          { label: "Client Form", icon: UserPlus, action: () => console.log("Client form") },
          { label: "Import Clients", icon: FileText, action: () => console.log("Import clients") },
          { label: "Client Templates", icon: FileText, action: () => console.log("Client templates") },
        ],
      })
    } else {
      breadcrumbs[0].isActive = true
    }

    return breadcrumbs
  }

  if (showClientManagement) {
    return <ClientManagement onBack={() => setShowClientManagement(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left side - EDSI Logo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <img src="/images/edsi-logo.png" alt="EDSI Logo" className="h-10 w-auto" />
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Show the Desktop
            </Button>
          </div>

          {/* Center - Application Selector */}
          <div className="flex-1 max-w-xs mx-8">
            <Select defaultValue="timetracker">
              <SelectTrigger>
                <SelectValue placeholder="Jump to Applications..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timetracker">TimeTracker</SelectItem>
                <SelectItem value="other">Other Applications...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right side - Title and Navigation */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-800">Data Staff Desktop</h1>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/manage-account" className="text-blue-600 hover:underline">
                Manage Account
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/logout" className="text-blue-600 hover:underline">
                Log Out
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/help" className="text-blue-600 hover:underline">
                Help
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/about" className="text-blue-600 hover:underline">
                About
              </Link>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation with Dropdowns */}
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
                          <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
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
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        if (breadcrumb.label === "Dashboard") {
                          setShowClientManagement(false)
                          setShowNewClientForm(false)
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {breadcrumb.label}
                    </button>
                    {breadcrumb.dropdownItems && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
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
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-6 p-6">
        {/* Left Sidebar - Reports */}
        <div className="w-80 space-y-4">
          {/* Unapproved Terminations */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-800 bg-orange-200 px-3 py-1 rounded">
                Unapproved Terminations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="text-sm">
                  There are <span className="font-bold">36</span> unapproved terminations.
                </span>
              </div>
              <Button variant="link" className="p-0 h-auto text-blue-600 underline text-sm">
                Launch Report
              </Button>
            </CardContent>
          </Card>

          {/* Zero Hours Report */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-800 bg-blue-200 px-3 py-1 rounded">
                Zero Hours Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  There are <span className="font-bold">377</span> zero hour clients.
                </span>
              </div>
              <Button variant="link" className="p-0 h-auto text-blue-600 underline text-sm">
                Click here to view the clients.
              </Button>
            </CardContent>
          </Card>

          {/* TANF Days Report */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-800 bg-blue-200 px-3 py-1 rounded">
                TANF Days Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  There are <span className="font-bold">7</span> clients over 1800 days.
                </span>
              </div>
              <Button variant="link" className="p-0 h-auto text-blue-600 underline text-sm">
                Click here to view clients.
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center Content */}
        <div className="flex-1 space-y-6">
          {/* Clients Clocked-In */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-800 bg-blue-200 px-3 py-1 rounded flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Clients Clocked-In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">There are no clients that are currently clocked-in.</p>
              <Button variant="link" className="p-0 h-auto text-blue-600 underline text-sm">
                Click here to view all of the clocked-in clients for today.
              </Button>
            </CardContent>
          </Card>

          {/* Prominent Create New Client Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => {
                setShowNewClientForm(true)
              }}
            >
              <UserPlus className="w-5 h-5 mr-3" />
              Create New Client
            </Button>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold">1,247</p>
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
                    <p className="text-sm text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Actions</p>
                    <p className="text-2xl font-bold">43</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Client Directory */}
        <div className="w-80">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-800 bg-gray-200 px-3 py-1 rounded">
                Client Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                  onClick={() => setShowClientManagement(true)}
                >
                  <Users className="w-4 h-4" />
                  My Clients
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                  <UserPlus className="w-4 h-4" />
                  New Client
                </Button>
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Search Client Directory</h3>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name:
                    </Label>
                    <Input
                      id="name"
                      value={searchForm.name}
                      onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="participantId" className="text-sm font-medium">
                      Participant Id:
                    </Label>
                    <Input
                      id="participantId"
                      value={searchForm.participantId}
                      onChange={(e) => setSearchForm({ ...searchForm, participantId: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ssn" className="text-sm font-medium">
                      SSN (Last 4):
                    </Label>
                    <Input
                      id="ssn"
                      value={searchForm.ssn}
                      onChange={(e) => setSearchForm({ ...searchForm, ssn: e.target.value })}
                      maxLength={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="records" className="text-sm font-medium">
                      Records/Page:
                    </Label>
                    <Select
                      value={searchForm.recordsPerPage}
                      onValueChange={(value) => setSearchForm({ ...searchForm, recordsPerPage: value })}
                    >
                      <SelectTrigger className="mt-1">
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

                  <Button onClick={handleSearch} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showNewClientForm && (
        <NewClientForm
          onClose={() => setShowNewClientForm(false)}
          onSave={(clientData) => {
            console.log("New client created:", clientData)
            setShowNewClientForm(false)
            // Here you would typically save to database
          }}
        />
      )}
    </div>
  )
}
