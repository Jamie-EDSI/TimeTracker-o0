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
}

export function NavigationCard({ title, description, icon: Icon, onClick, className }: NavigationCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`} onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs mb-2 text-gray-600">{description}</p>
        <Button variant="outline" size="sm" className="w-full text-xs py-1 bg-transparent">
          View →
        </Button>
      </CardContent>
    </Card>
  )
}
