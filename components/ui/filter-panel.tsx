"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"

interface FilterOption {
  key: string
  label: string
  type: "text" | "select" | "dateRange"
  options?: string[]
  placeholder?: string
}

interface FilterPanelProps {
  filters?: FilterOption[]
  onFiltersChange?: (filters: Record<string, any>) => void
  activeFilters?: Record<string, any>
  onClearFilters?: () => void
  programs?: string[]
  caseManagers?: string[]
  statuses?: string[]
}

export function FilterPanel({
  filters = [],
  onFiltersChange = () => {},
  activeFilters = {},
  onClearFilters = () => {},
  programs = [],
  caseManagers = [],
  statuses = [],
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    const updatedFilters = {
      ...(activeFilters || {}),
      [key]: value,
    }
    onFiltersChange(updatedFilters)
  }

  // Safely get active filter count
  const safeActiveFilters = activeFilters || {}
  const activeFilterCount = Object.values(safeActiveFilters).filter(
    (value) => value !== null && value !== undefined && value !== "",
  ).length

  // Create dynamic filter options based on props
  const dynamicFilters = []

  if (Array.isArray(programs) && programs.length > 0) {
    dynamicFilters.push({
      key: "program",
      label: "Program",
      type: "select" as const,
      options: programs,
      placeholder: "Select program...",
    })
  }

  if (Array.isArray(caseManagers) && caseManagers.length > 0) {
    dynamicFilters.push({
      key: "caseManager",
      label: "Case Manager",
      type: "select" as const,
      options: caseManagers,
      placeholder: "Select case manager...",
    })
  }

  if (Array.isArray(statuses) && statuses.length > 0) {
    dynamicFilters.push({
      key: "status",
      label: "Status",
      type: "select" as const,
      options: statuses,
      placeholder: "Select status...",
    })
  }

  // Add enrollment date filter
  dynamicFilters.push({
    key: "enrollmentDate",
    label: "Enrollment Date",
    type: "dateRange" as const,
    placeholder: "Select date range...",
  })

  // Use provided filters or dynamic filters
  const filterOptions = Array.isArray(filters) && filters.length > 0 ? filters : dynamicFilters

  // Don't render if no filters available
  if (!Array.isArray(filterOptions) || filterOptions.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{activeFilterCount}</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button onClick={onClearFilters} variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" size="sm">
              {isExpanded ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOptions.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label htmlFor={filter.key}>{filter.label}</Label>

                {filter.type === "text" && (
                  <Input
                    id={filter.key}
                    placeholder={filter.placeholder}
                    value={safeActiveFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                )}

                {filter.type === "select" && (
                  <Select
                    value={safeActiveFilters[filter.key] || ""}
                    onValueChange={(value) => handleFilterChange(filter.key, value === "clear" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">
                        <span className="text-gray-500 italic">Clear selection</span>
                      </SelectItem>
                      {(filter.options || [])
                        .filter((option) => option !== "")
                        .map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

                {filter.type === "dateRange" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`${filter.key}_from`} className="text-xs">
                        From
                      </Label>
                      <Input
                        id={`${filter.key}_from`}
                        type="date"
                        value={safeActiveFilters[`${filter.key}From`] || safeActiveFilters[`${filter.key}_from`] || ""}
                        onChange={(e) => handleFilterChange(`${filter.key}From`, e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${filter.key}_to`} className="text-xs">
                        To
                      </Label>
                      <Input
                        id={`${filter.key}_to`}
                        type="date"
                        value={safeActiveFilters[`${filter.key}To`] || safeActiveFilters[`${filter.key}_to`] || ""}
                        onChange={(e) => handleFilterChange(`${filter.key}To`, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
