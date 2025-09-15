"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: Record<string, any>
  onFiltersChange: (filters: Record<string, any>) => void
  programs?: string[]
  caseManagers?: string[]
  statuses?: string[]
}

export function FilterPanel({
  filters,
  onFiltersChange,
  programs = [],
  caseManagers = [],
  statuses = [],
}: FilterPanelProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    const clearedFilters = Object.keys(filters).reduce(
      (acc, key) => {
        acc[key] = ""
        return acc
      },
      {} as Record<string, any>,
    )
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value && value !== "")

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Program Filter */}
          {programs.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="program-filter">Program</Label>
              <Select value={filters.program || "all"} onValueChange={(value) => handleFilterChange("program", value)}>
                <SelectTrigger id="program-filter">
                  <SelectValue placeholder="All Programs" />
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
          )}

          {/* Case Manager Filter */}
          {caseManagers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="case-manager-filter">Case Manager</Label>
              <Select
                value={filters.caseManager || "all"}
                onValueChange={(value) => handleFilterChange("caseManager", value)}
              >
                <SelectTrigger id="case-manager-filter">
                  <SelectValue placeholder="All Case Managers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Case Managers</SelectItem>
                  {caseManagers.map((manager) => (
                    <SelectItem key={manager} value={manager}>
                      {manager}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status Filter */}
          {statuses.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Enrollment Date From */}
          <div className="space-y-2">
            <Label htmlFor="enrollment-from">Enrollment From</Label>
            <Input
              id="enrollment-from"
              type="date"
              value={filters.enrollmentDateFrom || ""}
              onChange={(e) => handleFilterChange("enrollmentDateFrom", e.target.value)}
            />
          </div>

          {/* Enrollment Date To */}
          <div className="space-y-2">
            <Label htmlFor="enrollment-to">Enrollment To</Label>
            <Input
              id="enrollment-to"
              type="date"
              value={filters.enrollmentDateTo || ""}
              onChange={(e) => handleFilterChange("enrollmentDateTo", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
