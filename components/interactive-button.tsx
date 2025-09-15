"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface InteractiveButtonProps {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
  variant?: "default" | "outline"
  className?: string
}

export function InteractiveButton({
  icon: Icon,
  title,
  description,
  onClick,
  variant = "default",
  className = "",
}: InteractiveButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={`h-auto p-4 flex flex-col items-start gap-2 text-left ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-sm opacity-80">{description}</span>
    </Button>
  )
}
