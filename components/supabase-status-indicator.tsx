"use client"

import { useEffect, useState } from "react"
import { checkSupabaseSetup, type SetupStatus } from "@/lib/supabase-setup-checker"

export function SupabaseStatusIndicator() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== "development") return

    const checkStatus = () => {
      const setupStatus = checkSupabaseSetup()
      setStatus(setupStatus)
      setIsVisible(true)
    }

    checkStatus()

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  // Don't render in production
  if (process.env.NODE_ENV !== "development" || !isVisible || !status) {
    return null
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "connected":
        return "bg-green-500"
      case "not_configured":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case "connected":
        return "Supabase Connected"
      case "not_configured":
        return "Demo Mode"
      case "error":
        return "Supabase Error"
      default:
        return "Unknown Status"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg cursor-pointer transition-all hover:scale-105`}
        title={status.message}
        onClick={() => {
          console.log("🔍 Supabase Status Check:")
          console.log("Status:", status.status)
          console.log("Message:", status.message)
          console.log("Recommendations:", status.recommendations)
          if (status.status !== "connected") {
            console.log("\n💡 Run testSupabase() for detailed diagnostics")
          }
        }}
      >
        {getStatusText()}
      </div>
    </div>
  )
}
