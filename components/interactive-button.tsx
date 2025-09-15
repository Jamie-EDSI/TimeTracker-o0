"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface InteractiveButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "sm" | "default" | "lg"
  className?: string
  disabled?: boolean
}

export function InteractiveButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
}: InteractiveButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      disabled={disabled}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  )
}
