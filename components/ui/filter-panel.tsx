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
}

export function FilterPanel({
  filters = [],
  onFiltersChange = () => {},
  activeFilters = {},
  onClearFilters = () => {},
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value,
    })
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  // Don't render if no filters provided
  if (!Array.isArray(filters) || filters.length === 0) {
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
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label htmlFor={filter.key}>{filter.label}</Label>

                {filter.type === "text" && (
                  <Input
                    id={filter.key}
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                )}

                {filter.type === "select" && (
                  <Select
                    value={activeFilters[filter.key] || ""}
                    onValueChange={(value) => handleFilterChange(filter.key, value === "__clear__" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__clear__">
                        <span className="text-muted-foreground">{filter.placeholder || "All"}</span>
                      </SelectItem>
                      {filter.options?.filter((option) => option && option.trim() !== "").map((option) => (
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
                        value={activeFilters[`${filter.key}_from`] || ""}
                        onChange={(e) => handleFilterChange(`${filter.key}_from`, e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${filter.key}_to`} className="text-xs">
                        To
                      </Label>
                      <Input
                        id={`${filter.key}_to`}
                        type="date"
                        value={activeFilters[`${filter.key}_to`] || ""}
                        onChange={(e) => handleFilterChange(`${filter.key}_to`, e.target.value)}
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
