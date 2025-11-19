"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Database,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseStatus, testSupabaseConnection, verifyClientFilesBucket, getConfigError } from "@/lib/supabase"

export function SupabaseStatusIndicator() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [status, setStatus] = useState<"connected" | "error" | "not_configured" | "setup_required" | "checking">(
    "checking",
  )
  const [details, setDetails] = useState<any>(null)
  const [bucketStatus, setBucketStatus] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      setStatus("checking")
      setIsRefreshing(true)

      const supabaseStatus = getSupabaseStatus()
      const configError = getConfigError()

      if (supabaseStatus === "not_configured" || configError) {
        setStatus("not_configured")
        setDetails({ message: configError || "Supabase environment variables not configured" })
        setIsExpanded(true)
        return
      }

      const connectionTest = await testSupabaseConnection()

      if (!connectionTest) {
        setStatus("error")
        setDetails({ error: "Connection test returned no response" })
        return
      }

      if (connectionTest.needsConfig) {
        setStatus("not_configured")
        setDetails(connectionTest)
        setIsExpanded(true)
        return
      }

      if (connectionTest.setupRequired) {
        setStatus("setup_required")
        setDetails(connectionTest)
        setIsExpanded(true)
        return
      }

      if (!connectionTest.success) {
        setStatus("error")
        setDetails(connectionTest)
        return
      }

      const bucket = await verifyClientFilesBucket()
      setBucketStatus(bucket)

      setStatus("connected")
      setDetails(connectionTest)
    } catch (error: any) {
      console.error("Status check failed:", error)
      setStatus("error")
      setDetails({ error: error.message || "Unknown error occurred" })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500 hover:bg-green-600"
      case "setup_required":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "error":
      case "not_configured":
        return "bg-red-500 hover:bg-red-600"
      case "checking":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected"
      case "setup_required":
        return "Setup Required"
      case "error":
        return "Error"
      case "not_configured":
        return "Invalid Config"
      case "checking":
        return "Checking..."
      default:
        return "Unknown"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-4 h-4" />
      case "setup_required":
        return <AlertTriangle className="w-4 h-4" />
      case "checking":
        return <Loader2 className="w-4 h-4 animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-2 text-white border-0 shadow-lg ${getStatusColor()}`}
          size="sm"
        >
          {getStatusIcon()}
          <span className="font-medium text-sm">{getStatusText()}</span>
          <ChevronUp className="w-3 h-3" />
        </Button>
      ) : (
        <Card className="w-[400px] shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4" />
                Database Status
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-7 w-7 p-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge className={`${getStatusColor()} text-white`}>{getStatusText()}</Badge>
            </div>

            {status === "not_configured" && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900 mb-1">Invalid Supabase Configuration</p>
                    <p className="text-xs text-red-800 mb-3">
                      {details?.error || "Your Supabase credentials are incorrect or have expired."}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-md p-3 mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">To fix this:</p>
                  <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
                    <li>
                      Open your <span className="font-mono bg-gray-100 px-1 rounded">.env.local</span> file
                    </li>
                    <li>Go to your Supabase project dashboard</li>
                    <li>
                      Navigate to <span className="font-mono bg-gray-100 px-1 rounded">Settings → API</span>
                    </li>
                    <li>Copy the Project URL and anon/public key</li>
                    <li>Update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-red-700 hover:text-red-900 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Supabase Dashboard
                </a>
              </div>
            )}

            {status === "setup_required" && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-yellow-900 mb-1">Database Setup Required</p>
                    <p className="text-xs text-yellow-800 mb-3">
                      The database tables haven't been created yet. The app is running in demo mode.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-md p-3 mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Quick Setup Steps:</p>
                  <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
                    <li>Open your Supabase project dashboard</li>
                    <li>
                      Go to <span className="font-mono bg-gray-100 px-1 rounded">SQL Editor</span>
                    </li>
                    <li>
                      Click <span className="font-mono bg-gray-100 px-1 rounded">New Query</span>
                    </li>
                    <li>
                      Copy & paste contents of{" "}
                      <span className="font-mono bg-gray-100 px-1 rounded">scripts/supabase-schema.sql</span>
                    </li>
                    <li>
                      Click <span className="font-mono bg-gray-100 px-1 rounded">Run</span>
                    </li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-yellow-700 hover:text-yellow-900 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Supabase Dashboard
                </a>
              </div>
            )}

            {status === "error" && details?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 mb-1">Connection Error</p>
                <p className="text-xs text-red-600 font-mono">{details.error}</p>
              </div>
            )}

            {status === "connected" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-700">Database</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Ready</Badge>
                </div>
                {bucketStatus && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Storage</span>
                    <Badge variant={bucketStatus.exists ? "default" : "secondary"} className="text-xs">
                      {bucketStatus.exists ? "Ready" : "Not Setup"}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {(status === "setup_required" || status === "not_configured") && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <strong>Demo Mode:</strong> The app is fully functional with sample data. Your changes won't be saved
                  until you fix the {status === "not_configured" ? "configuration" : "setup"} issue.
                </p>
              </div>
            )}

            <Button
              onClick={checkStatus}
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Refresh Status
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
