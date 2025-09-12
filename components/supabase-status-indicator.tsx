"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { checkSupabaseSetup } from "@/lib/supabase-setup-checker"

export function SupabaseStatusIndicator() {
  const [status, setStatus] = useState<"checking" | "configured" | "needs-setup">("checking")

  useEffect(() => {
    const setupStatus = checkSupabaseSetup()
    setStatus(setupStatus.isConfigured ? "configured" : "needs-setup")
  }, [])

  if (process.env.NODE_ENV !== "development") {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === "checking" && <Badge variant="secondary">Checking Supabase...</Badge>}
      {status === "configured" && (
        <Badge variant="default" className="bg-green-600">
          ✅ Supabase Connected
        </Badge>
      )}
      {status === "needs-setup" && <Badge variant="destructive">⚠️ Supabase Setup Required</Badge>}
    </div>
  )
}
