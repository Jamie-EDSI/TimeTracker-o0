"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, UserPlus, Phone, Briefcase, BarChart3 } from "lucide-react"

interface NavigationCardProps {
  onNavigate: (view: string) => void
  onSearch: (query: string) => void
}

export function NavigationCard({ onNavigate, onSearch }: NavigationCardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5" />
          Client Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            onClick={() => onNavigate("new-client")}
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            New Client
          </Button>

          <Button onClick={() => onNavigate("all-clients")} variant="outline" className="w-full justify-start">
            <Users className="w-4 h-4 mr-2" />
            View All Clients
          </Button>
        </div>

        {/* Reports */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Reports</h3>
          <div className="space-y-2">
            <Button
              onClick={() => onNavigate("active-clients")}
              variant="ghost"
              className="w-full justify-start text-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Active Clients
            </Button>

            <Button onClick={() => onNavigate("call-log")} variant="ghost" className="w-full justify-start text-sm">
              <Phone className="w-4 h-4 mr-2" />
              Call Log
            </Button>

            <Button
              onClick={() => onNavigate("jobs-placements")}
              variant="ghost"
              className="w-full justify-start text-sm"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Job Placements
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
