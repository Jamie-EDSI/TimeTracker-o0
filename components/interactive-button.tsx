"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface InteractiveButtonProps {
  title: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function InteractiveButton({
  title,
  icon: Icon,
  onClick,
  variant = "outline",
  className,
}: InteractiveButtonProps) {
  return (
    <Button onClick={onClick} variant={variant} className={`w-full justify-start hover:bg-blue-50 ${className}`}>
      <Icon className="w-4 h-4 mr-2" />
      {title}
    </Button>
  )
}
