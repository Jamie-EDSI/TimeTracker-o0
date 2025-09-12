"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff, Database, Activity, RefreshCw } from "lucide-react"
import { getSupabaseStatus, isSupabaseConfigured } from "@/lib/supabase"
import { NetworkMonitor, SupabaseDebugger } from "@/lib/supabase-debug"

interface ConnectionStatus {
  isOnline: boolean
  supabaseReachable: boolean
  latency: number
  error?: string
}

export function SupabaseStatusIndicator() {
  const [status, setStatus] = useState<"not_configured" | "error" | "connected">("not_configured")
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsRefreshing(true)

    try {
      const supabaseStatus = getSupabaseStatus()
      setStatus(supabaseStatus)

      if (supabaseStatus === "connected") {
        const networkTest = await NetworkMonitor.testConnection()
        setConnectionStatus(networkTest)
      }

      setLastChecked(new Date())
    } catch (error) {
      console.error("Status check failed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkStatus()

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return connectionStatus?.supabaseReachable ? "bg-green-500" : "bg-yellow-500"
      case "error":
        return "bg-red-500"
      case "not_configured":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return connectionStatus?.supabaseReachable ? "Connected" : "Connection Issues"
      case "error":
        return "Error"
      case "not_configured":
        return "Demo Mode"
      default:
        return "Unknown"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return connectionStatus?.supabaseReachable ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )
      case "error":
        return <XCircle className="w-4 h-4" />
      case "not_configured":
        return <Database className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const showDebugInfo = () => {
    console.group("🔍 Supabase Debug Information")
    console.log("Status:", status)
    console.log("Configured:", isSupabaseConfigured())
    console.log("Connection:", connectionStatus)
    console.log("Environment Variables:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    })
    SupabaseDebugger.printSummary()
    console.groupEnd()
  }

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Badge
          className={`${getStatusColor()} text-white cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={() => setIsExpanded(true)}
        >
          {getStatusIcon()}
          <span className="ml-1">{getStatusText()}</span>
        </Badge>
      ) : (
        <Card className="w-80 shadow-lg border-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Supabase Status
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Main Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-medium">{getStatusText()}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={checkStatus} disabled={isRefreshing} className="h-6 w-6 p-0">
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Connection Details */}
            {connectionStatus && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {connectionStatus.isOnline ? (
                      <Wifi className="w-3 h-3 text-green-500" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-red-500" />
                    )}
                    <span>Internet</span>
                  </div>
                  <span className={connectionStatus.isOnline ? "text-green-600" : "text-red-600"}>
                    {connectionStatus.isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Latency</span>
                  </div>
                  <span className="text-gray-600">{connectionStatus.latency}ms</span>
                </div>

                {connectionStatus.error && (
                  <div className="text-red-600 text-xs bg-red-50 p-2 rounded">{connectionStatus.error}</div>
                )}
              </div>
            )}

            {/* Configuration Info */}
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>URL:</span>
                <span>{process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌"}</span>
              </div>
              <div className="flex justify-between">
                <span>API Key:</span>
                <span>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌"}</span>
              </div>
            </div>

            {/* Last Checked */}
            {lastChecked && (
              <div className="text-xs text-gray-500">Last checked: {lastChecked.toLocaleTimeString()}</div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={showDebugInfo} className="flex-1 text-xs bg-transparent">
                Debug Info
              </Button>
              {status === "not_configured" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("📖 Setup Guide: Check SUPABASE_SETUP_GUIDE.md")
                    console.log("🧪 Test Connection: Run testSupabase() in console")
                  }}
                  className="flex-1 text-xs"
                >
                  Setup Help
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
