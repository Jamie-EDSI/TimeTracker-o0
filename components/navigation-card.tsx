"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface NavigationCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  color: "blue" | "green" | "purple" | "orange" | "teal" | "indigo"
}

export function NavigationCard({ title, description, icon: Icon, onClick, color }: NavigationCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700",
    green: "bg-green-50 border-green-200 hover:bg-green-100 text-green-700",
    purple: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700",
    orange: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700",
    teal: "bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700",
    indigo: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700",
  }

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    teal: "text-teal-600",
    indigo: "text-indigo-600",
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${colorClasses[color]}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg bg-white/50 ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm opacity-80">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
