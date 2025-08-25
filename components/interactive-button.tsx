"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface InteractiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: "left" | "right"
}

export function InteractiveButton({
  children,
  onClick,
  variant = "default",
  size = "md",
  loading = false,
  disabled = false,
  className,
  icon: Icon,
  iconPosition = "left",
}: InteractiveButtonProps) {
  const variantStyles = {
    default: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400",
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl",
    warning:
      "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "transition-all duration-200 transform hover:scale-105 font-semibold",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4 mr-2" />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4 ml-2" />}
    </Button>
  )
}
