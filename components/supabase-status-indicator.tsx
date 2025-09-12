"use client"

import { useEffect, useState } from "react"
import { checkSupabaseSetup } from "@/lib/supabase-setup-checker"

export function SupabaseStatusIndicator() {
  const [status, setStatus] = useState<{
    isConfigured: boolean
    issues: string[]
    warnings: string[]
  } | null>(null)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return

    const setupStatus = checkSupabaseSetup()
    setStatus(setupStatus)
  }, [])

  // Don't render in production
  if (process.env.NODE_ENV !== "development" || !status) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
          status.isConfigured
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status.isConfigured ? "bg-green-500" : "bg-yellow-500"}`} />
          <span>{status.isConfigured ? "Supabase Connected" : "Supabase Setup Needed"}</span>
        </div>

        {!status.isConfigured && (
          <div className="mt-1 text-xs">
            <div>Issues: {status.issues.length}</div>
            {status.warnings.length > 0 && <div>Warnings: {status.warnings.length}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
