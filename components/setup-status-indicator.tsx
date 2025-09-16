"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Database, HardDrive, Settings, ChevronDown } from "lucide-react"
import { checkSetupStatus, getSetupInstructions, type SetupStatus } from "@/lib/setup-checker"
import { verifyClientFilesBucket } from "@/lib/supabase"

export function SetupStatusIndicator() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bucketInfo, setBucketInfo] = useState<any>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const setupStatus = await checkSetupStatus()
      setStatus(setupStatus)

      // Also check bucket info specifically
      const bucketVerification = await verifyClientFilesBucket()
      setBucketInfo(bucketVerification)

      // Auto-minimize if everything is working
      if (setupStatus.configured && setupStatus.database && setupStatus.storage && setupStatus.tables) {
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
      }
    } catch (error) {
      console.error("Setup check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-[1]">
        <Card className="w-16 h-12 shadow-lg border-2">
          <CardContent className="p-2 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!status) return null

  const isSetupComplete = status.configured && status.database && status.storage && status.tables
  const instructions = getSetupInstructions(status)

  // Minimized view when setup is complete
  if (isSetupComplete && !isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-[1]">
        <Card
          className="w-16 h-12 shadow-lg border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-2 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">OK</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Minimized view when setup is needed
  if (!isSetupComplete && !isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-[1]">
        <Card
          className="w-20 h-12 shadow-lg border-2 border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-2 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Settings className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-orange-700 font-medium">Setup</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Expanded view
  return (
    <div className="fixed bottom-4 right-4 z-[1] w-96">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isSetupComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <h3 className="font-semibold text-sm">{isSetupComplete ? "System Status" : "Setup Required"}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Configuration
              </span>
              <Badge variant={status.configured ? "default" : "destructive"} className="text-xs px-1 py-0">
                {status.configured ? "OK" : "Missing"}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Database
              </span>
              <Badge variant={status.database ? "default" : "destructive"} className="text-xs px-1 py-0">
                {status.database ? "Connected" : "Error"}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                Storage (client-files)
              </span>
              <Badge variant={status.storage ? "default" : "destructive"} className="text-xs px-1 py-0">
                {status.storage ? "Ready" : "Missing"}
              </Badge>
            </div>

            {bucketInfo && (
              <div className="text-xs text-gray-600 ml-4">
                {bucketInfo.exists ? (
                  <span className="text-green-600">✓ client-files bucket found and accessible</span>
                ) : (
                  <span className="text-red-600">✗ client-files bucket missing</span>
                )}
                {bucketInfo.fileCount !== undefined && (
                  <span className="text-gray-500 ml-2">({bucketInfo.fileCount} files)</span>
                )}
              </div>
            )}
          </div>

          {!isSetupComplete && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Next steps:</p>
              {instructions.slice(0, 3).map((instruction, index) => (
                <p key={index} className="text-xs text-gray-600">
                  {instruction}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={checkStatus} className="text-xs h-7 bg-transparent">
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const verification = await verifyClientFilesBucket()
                setBucketInfo(verification)
                console.log("Bucket verification:", verification)
              }}
              className="text-xs h-7"
            >
              Check Bucket
            </Button>
          </div>

          {status.errors.length > 0 && (
            <div className="mt-3 p-2 bg-red-50 rounded text-xs">
              <p className="font-medium text-red-800 mb-1">Errors:</p>
              {status.errors.slice(0, 2).map((error, index) => (
                <p key={index} className="text-red-700">
                  • {error}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
