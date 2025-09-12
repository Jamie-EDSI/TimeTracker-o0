"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface InteractiveButtonProps {
  onClick: () => void
  icon: LucideIcon
  label: string
  description: string
  variant: "primary" | "secondary"
}

export function InteractiveButton({ onClick, icon: Icon, label, description, variant }: InteractiveButtonProps) {
  const baseClasses = "w-full justify-start text-left p-4 h-auto"
  const variantClasses = {
    primary: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
    secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
  }

  return (
    <Button onClick={onClick} variant="outline" className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1 text-left">
          <div className="font-medium">{label}</div>
          <div className="text-sm opacity-75">{description}</div>
        </div>
      </div>
    </Button>
  )
}
