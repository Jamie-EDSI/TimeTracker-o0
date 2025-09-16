"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Database, HardDrive, Settings, ChevronDown, RefreshCw } from "lucide-react"
import { checkSetupStatus, getSetupInstructions, type SetupStatus } from "@/lib/setup-checker"
import { verifyClientFilesBucket } from "@/lib/supabase"

export function SetupStatusIndicator() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bucketInfo, setBucketInfo] = useState<any>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      console.log("🔄 Running setup status check...")
      const setupStatus = await checkSetupStatus()
      setStatus(setupStatus)
      setLastChecked(new Date())

      // Also check bucket info specifically with detailed logging
      console.log("🔄 Running bucket verification...")
      const bucketVerification = await verifyClientFilesBucket()
      setBucketInfo(bucketVerification)

      console.log("📊 Setup Status Summary:")
      console.log("  - Configured:", setupStatus.configured)
      console.log("  - Database:", setupStatus.database)
      console.log("  - Storage:", setupStatus.storage)
      console.log("  - Tables:", setupStatus.tables)
      console.log("  - Bucket exists:", bucketVerification.exists)
      console.log("  - Bucket accessible:", bucketVerification.accessible)

      // Auto-expand if there are issues
      const hasIssues =
        !setupStatus.configured ||
        !setupStatus.database ||
        !setupStatus.storage ||
        !setupStatus.tables ||
        !bucketVerification.exists

      if (hasIssues) {
        setIsExpanded(true)
      } else {
        // Auto-minimize after 5 seconds if everything is working
        setTimeout(() => setIsExpanded(false), 5000)
      }
    } catch (error) {
      console.error("Setup check failed:", error)
      setIsExpanded(true) // Expand on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Check status every 60 seconds (reduced frequency)
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading && !status) {
    return (
      <div className="fixed bottom-4 right-4 z-[1]">
        <Card className="w-16 h-12 shadow-lg border-2">
          <CardContent className="p-2 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!status) return null

  const isSetupComplete = status.configured && status.database && status.storage && status.tables && bucketInfo?.exists
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
              <Badge
                variant={status.storage && bucketInfo?.exists ? "default" : "destructive"}
                className="text-xs px-1 py-0"
              >
                {status.storage && bucketInfo?.exists ? "Ready" : "Missing"}
              </Badge>
            </div>

            {bucketInfo && (
              <div className="text-xs text-gray-600 ml-4 space-y-1">
                {bucketInfo.exists ? (
                  <>
                    <div className="text-green-600">✓ client-files bucket found</div>
                    {bucketInfo.accessible !== undefined && (
                      <div className={bucketInfo.accessible ? "text-green-600" : "text-orange-600"}>
                        {bucketInfo.accessible ? "✓ Bucket accessible" : "⚠ Limited access"}
                      </div>
                    )}
                    {bucketInfo.fileCount !== undefined && (
                      <div className="text-gray-500">📁 {bucketInfo.fileCount} files</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-red-600">✗ client-files bucket missing</div>
                    {bucketInfo.buckets && bucketInfo.buckets.length > 0 && (
                      <div className="text-gray-500">
                        Available: {bucketInfo.buckets.slice(0, 3).join(", ")}
                        {bucketInfo.buckets.length > 3 && ` +${bucketInfo.buckets.length - 3} more`}
                      </div>
                    )}
                    {bucketInfo.similarBuckets && bucketInfo.similarBuckets.length > 0 && (
                      <div className="text-orange-600">Similar: {bucketInfo.similarBuckets.join(", ")}</div>
                    )}
                  </>
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
            <Button
              variant="outline"
              size="sm"
              onClick={checkStatus}
              disabled={isLoading}
              className="text-xs h-7 bg-transparent"
            >
              {isLoading ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : null}
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                console.log("🔍 Manual bucket verification triggered...")
                const verification = await verifyClientFilesBucket()
                setBucketInfo(verification)
                console.log("📊 Manual bucket verification result:", verification)
              }}
              className="text-xs h-7"
            >
              Check Bucket
            </Button>
          </div>

          {lastChecked && (
            <div className="text-xs text-gray-500 mt-2">Last checked: {lastChecked.toLocaleTimeString()}</div>
          )}

          {status.errors.length > 0 && (
            <div className="mt-3 p-2 bg-red-50 rounded text-xs">
              <p className="font-medium text-red-800 mb-1">Errors:</p>
              {status.errors.slice(0, 2).map((error, index) => (
                <p key={index} className="text-red-700">
                  • {error}
                </p>
              ))}
              {status.errors.length > 2 && (
                <p className="text-red-600 italic">+{status.errors.length - 2} more errors (check console)</p>
              )}
            </div>
          )}

          {bucketInfo?.error && (
            <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
              <p className="font-medium text-orange-800 mb-1">Storage Issue:</p>
              <p className="text-orange-700">{bucketInfo.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
