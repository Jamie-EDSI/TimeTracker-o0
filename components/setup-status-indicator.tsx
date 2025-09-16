"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react"
import { checkSetupStatus, getSetupInstructions, type SetupStatus } from "@/lib/setup-checker"

export function SetupStatusIndicator() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const newStatus = await checkSetupStatus()
      setStatus(newStatus)
    } catch (error) {
      console.error("Error checking setup status:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusIcon = (isOk: boolean) => {
    if (isOk) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  const getOverallStatus = () => {
    if (!status) return "checking"
    if (status.configured && status.database && status.storage && status.tables) return "good"
    if (status.configured) return "partial"
    return "needs-setup"
  }

  const overallStatus = getOverallStatus()

  if (!showDetails && overallStatus === "good") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800 font-medium">Setup Complete</span>
          <Button
            onClick={() => setShowDetails(true)}
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700 p-1"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {overallStatus === "good" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {overallStatus === "partial" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
              {overallStatus === "needs-setup" && <XCircle className="w-5 h-5 text-red-500" />}
              {overallStatus === "checking" && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
              Setup Status
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={checkStatus} variant="ghost" size="sm" disabled={isChecking} className="p-2">
                <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => setShowDetails(false)} variant="ghost" size="sm" className="p-2">
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {status && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Environment Variables</span>
                  {getStatusIcon(status.configured)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Connection</span>
                  {getStatusIcon(status.database)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Bucket</span>
                  {getStatusIcon(status.storage)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Tables</span>
                  {getStatusIcon(status.tables)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Policies</span>
                  {getStatusIcon(status.policies)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sample Data</span>
                  {getStatusIcon(status.sampleData)}
                </div>
              </div>

              {status.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Issues Found:</h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {status.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Next Steps:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {getSetupInstructions(status).map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => window.open("https://supabase.com", "_blank")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Supabase
                </Button>
                <Button
                  onClick={() => {
                    const instructions = getSetupInstructions(status)
                    console.log("📋 Setup Instructions:")
                    instructions.forEach((instruction) => console.log(instruction))
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Show in Console
                </Button>
              </div>
            </>
          )}

          {!status && isChecking && (
            <div className="text-center py-4">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600">Checking setup status...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
