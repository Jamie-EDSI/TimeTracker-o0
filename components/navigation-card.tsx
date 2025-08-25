"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  external?: boolean
  className?: string
}

export function NavigationCard({
  title,
  description,
  icon: Icon,
  onClick,
  variant = "default",
  external = false,
  className,
}: NavigationCardProps) {
  const variantStyles = {
    default: "border-gray-200 hover:border-blue-300 hover:bg-blue-50",
    primary: "border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100",
    success: "border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100",
    warning: "border-orange-200 bg-orange-50 hover:border-orange-400 hover:bg-orange-100",
    danger: "border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100",
  }

  const iconStyles = {
    default: "text-gray-600",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-orange-600",
    danger: "text-red-600",
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105",
        variantStyles[variant],
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <Icon className={cn("w-5 h-5", iconStyles[variant])} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {external && <ExternalLink className="w-4 h-4 text-gray-400" />}
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
