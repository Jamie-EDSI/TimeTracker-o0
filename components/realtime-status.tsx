"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Clock } from "lucide-react"
import { RealtimeManager } from "@/lib/supabase-realtime"
import { isSupabaseConfigured } from "@/lib/supabase"

export function RealtimeStatus() {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    setIsConfigured(isSupabaseConfigured())

    // Update connection status periodically
    const checkStatus = () => {
      const status = RealtimeManager.getConnectionStatus()
      setConnectionStatus(status)
    }

    // Check immediately
    checkStatus()

    // Check every 5 seconds
    const interval = setInterval(checkStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!isConfigured) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Demo Mode
      </Badge>
    )
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-3 w-3" />
      case "connecting":
        return <Clock className="h-3 w-3" />
      default:
        return <WifiOff className="h-3 w-3" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Live"
      case "connecting":
        return "Connecting"
      default:
        return "Offline"
    }
  }

  const getStatusVariant = () => {
    switch (connectionStatus) {
      case "connected":
        return "default" as const
      case "connecting":
        return "secondary" as const
      default:
        return "destructive" as const
    }
  }

  return (
    <Badge variant={getStatusVariant()} className="flex items-center gap-1">
      {getStatusIcon()}
      {getStatusText()}
    </Badge>
  )
}
