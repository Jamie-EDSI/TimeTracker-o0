"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface NavigationCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  className?: string
  disabled?: boolean
}

export function NavigationCard({
  title,
  description,
  icon: Icon,
  onClick,
  className = "",
  disabled = false,
}: NavigationCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Button onClick={onClick} variant="ghost" className="w-full h-full p-0 hover:bg-transparent" disabled={disabled}>
        <div className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Icon className="w-6 h-6 text-blue-600" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 text-left">{description}</p>
          </CardContent>
        </div>
      </Button>
    </Card>
  )
}
