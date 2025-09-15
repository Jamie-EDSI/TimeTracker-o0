"use client"

import { useEffect } from "react"

export function SupabaseDiagnosticLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    const loadDiagnostics = async () => {
      try {
        // Import diagnostic functions
        const diagnosticModule = await import("@/lib/supabase-diagnostic")

        // Attach functions to window object for console access
        ;(window as any).runSupabaseDiagnostic = diagnosticModule.runSupabaseDiagnostic
        ;(window as any).testSupabaseConnection = diagnosticModule.testSupabaseConnection
        ;(window as any).checkEnvironment = diagnosticModule.checkEnvironment
        ;(window as any).testCRUD = diagnosticModule.testCRUD
        ;(window as any).supabase = diagnosticModule.supabase
        ;(window as any).clientsApi = diagnosticModule.clientsApi
        ;(window as any).caseNotesApi = diagnosticModule.caseNotesApi

        console.log("🔧 Supabase diagnostic functions loaded!")
        console.log("Available functions:")
        console.log("  - runSupabaseDiagnostic() - Run complete diagnostic suite")
        console.log("  - testSupabaseConnection() - Test basic connection")
        console.log("  - checkEnvironment() - Check environment variables")
        console.log("  - testCRUD() - Test CRUD operations")
        console.log("  - supabase - Direct Supabase client access")
        console.log("  - clientsApi - Clients API methods")
        console.log("  - caseNotesApi - Case notes API methods")

        // Verify functions are available
        const functionsAvailable = [
          "runSupabaseDiagnostic",
          "testSupabaseConnection",
          "checkEnvironment",
          "testCRUD",
        ].every((fn) => typeof (window as any)[fn] === "function")

        if (functionsAvailable) {
          console.log("✅ All diagnostic functions are ready to use!")
        } else {
          console.warn("⚠️ Some diagnostic functions may not be available")
        }
      } catch (error) {
        console.error("❌ Failed to load diagnostic functions:", error)
      }
    }

    // Load diagnostics with a small delay to ensure everything is ready
    const timer = setTimeout(loadDiagnostics, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything
}
