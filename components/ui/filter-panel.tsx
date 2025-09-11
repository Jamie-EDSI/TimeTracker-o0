"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X, RotateCcw } from "lucide-react"

interface FilterOption {
  key: string
  label: string
  type: "text" | "select" | "date" | "dateRange"
  options?: string[]
  placeholder?: string
}

interface FilterPanelProps {
  filters: FilterOption[]
  onFiltersChange: (filters: Record<string, any>) => void
  activeFilters: Record<string, any>
  onClearFilters: () => void
}

export function FilterPanel({ filters, onFiltersChange, activeFilters, onClearFilters }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value }
    if (!value || value === "") {
      delete newFilters[key]
    }
    onFiltersChange(newFilters)
  }

  const activeFilterCount = Object.keys(activeFilters).filter((key) => activeFilters[key]).length

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button onClick={onClearFilters} variant="ghost" size="sm">
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
            <Button onClick={() => setIsExpanded(!isExpanded)} variant="ghost" size="sm">
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label htmlFor={filter.key} className="text-xs font-medium">
                  {filter.label}
                </Label>

                {filter.type === "text" && (
                  <Input
                    id={filter.key}
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="h-8 text-sm"
                  />
                )}

                {filter.type === "select" && (
                  <Select
                    value={activeFilters[filter.key] || "all"}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {filter.label}</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filter.type === "date" && (
                  <Input
                    id={filter.key}
                    type="date"
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="h-8 text-sm"
                  />
                )}

                {filter.type === "dateRange" && (
                  <div className="space-y-2">
                    <Input
                      placeholder="From date"
                      type="date"
                      value={activeFilters[`${filter.key}_from`] || ""}
                      onChange={(e) => handleFilterChange(`${filter.key}_from`, e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="To date"
                      type="date"
                      value={activeFilters[`${filter.key}_to`] || ""}
                      onChange={(e) => handleFilterChange(`${filter.key}_to`, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value) return null
                  const filter = filters.find((f) => f.key === key || key.startsWith(f.key))
                  const label = filter?.label || key

                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {label}: {String(value)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleFilterChange(key, "")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
