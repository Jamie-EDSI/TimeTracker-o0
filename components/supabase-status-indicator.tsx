"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Database, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  isSupabaseConfigured,
  getSupabaseStatus,
  testSupabaseConnection,
  verifyClientFilesBucket,
} from "@/lib/supabase"

export function SupabaseStatusIndicator() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [status, setStatus] = useState<"connected" | "not_configured" | "error">("not_configured")
  const [connectionDetails, setConnectionDetails] = useState<any>(null)
  const [storageStatus, setStorageStatus] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsChecking(true)
    const currentStatus = getSupabaseStatus()
    setStatus(currentStatus)

    if (currentStatus === "connected") {
      const result = await testSupabaseConnection()
      setConnectionDetails(result)

      const storage = await verifyClientFilesBucket()
      setStorageStatus(storage)
    }
    setIsChecking(false)
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "OK"
      case "error":
        return "Error"
      default:
        return "Not Configured"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        // Compact status button
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-3 py-2"
        >
          {getStatusIcon()}
          <span className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
          <ChevronUp className="w-3 h-3 text-gray-400" />
        </Button>
      ) : (
        // Expanded status card
        <Card className="w-96 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                Database Connection
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {status === "connected" ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge
                variant={status === "connected" ? "default" : "destructive"}
                className={status === "connected" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {getStatusText()}
              </Badge>
            </div>

            {/* Configuration Status */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Configuration</span>
              {isSupabaseConfigured() ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>

            {/* Storage Status */}
            {storageStatus && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Storage Bucket</span>
                {storageStatus.exists ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            )}

            {/* Connection Details */}
            {connectionDetails && (
              <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-medium">{connectionDetails.success ? "Connected" : "Disconnected"}</span>
                </div>
              </div>
            )}

            {/* Debug Tools - Only in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="pt-2 border-t space-y-2">
                <p className="text-xs font-medium text-gray-600">Debug Tools</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkConnection}
                    disabled={isChecking}
                    className="text-xs h-7 bg-transparent"
                  >
                    {isChecking ? "Checking..." : "Test Connection"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs h-7">
                    Reload
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
