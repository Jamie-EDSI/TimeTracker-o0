"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, Database, AlertCircle, CheckCircle } from "lucide-react"
import { isSupabaseConfigured, getSupabaseStatus, getConfigError } from "@/lib/supabase"

export function SupabaseStatusIndicator() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [status, setStatus] = useState<string>("checking")
  const [configured, setConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check status on mount
    const checkStatus = () => {
      const currentStatus = getSupabaseStatus()
      const isConfigured = isSupabaseConfigured()
      const configError = getConfigError()

      setStatus(currentStatus)
      setConfigured(isConfigured)
      setError(configError)
    }

    checkStatus()

    // Recheck every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (configured) return "bg-green-500"
    if (status === "not_configured") return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusIcon = () => {
    if (configured) return <CheckCircle className="h-4 w-4" />
    if (status === "not_configured") return <AlertCircle className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (configured) return "OK"
    if (status === "not_configured") return "Demo"
    return "Error"
  }

  const runTest = async (testName: string) => {
    try {
      if (testName === "basic" && (window as any).testSupabase) {
        await (window as any).testSupabase()
      } else if (testName === "sync" && (window as any).testSupabaseSync) {
        await (window as any).testSupabaseSync()
      } else if (testName === "setup" && (window as any).checkSupabaseSetup) {
        await (window as any).checkSupabaseSetup()
      } else {
        console.log(`Test function ${testName} not available yet. Try refreshing the page.`)
      }
    } catch (error) {
      console.error(`Test ${testName} failed:`, error)
    }
  }

  // Always show the compact version
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        // Compact version - always visible
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-white shadow-lg border-2 rounded-lg px-3 py-2 hover:shadow-xl transition-shadow"
        >
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </button>
      ) : (
        // Expanded version
        <Card className="w-80 shadow-lg border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Supabase Status
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <Badge variant={configured ? "default" : "secondary"} className={configured ? "bg-green-500" : ""}>
                {configured ? "Connected" : status === "not_configured" ? "Demo Mode" : "Error"}
              </Badge>
            </div>

            <div className="space-y-3 mt-4">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={configured ? "text-green-600" : "text-yellow-600"}>{status}</span>
                </div>
              </div>

              {error && (
                <div className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="font-medium text-yellow-800">Configuration Issue:</div>
                  <div className="text-yellow-700">{error}</div>
                </div>
              )}

              {process.env.NODE_ENV === "development" && (
                <div className="space-y-2">
                  <div className="text-xs font-medium">Debug Tools:</div>
                  <div className="grid grid-cols-1 gap-1">
                    <Button variant="outline" size="sm" onClick={() => runTest("basic")} className="text-xs h-7">
                      Test Connection
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => runTest("sync")} className="text-xs h-7">
                      Test CRUD Operations
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => runTest("setup")} className="text-xs h-7">
                      Check Setup
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">Click outside to close</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
