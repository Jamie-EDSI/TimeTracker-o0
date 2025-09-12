import { isSupabaseConfigured, getSupabaseStatus, clientsApi, caseNotesApi } from "./supabase"

export interface SetupCheckResult {
  step: string
  status: "success" | "warning" | "error"
  message: string
  details?: string[]
}

export async function checkSupabaseSetup(): Promise<SetupCheckResult[]> {
  const results: SetupCheckResult[] = []

  // Step 1: Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    results.push({
      step: "Environment Variables",
      status: "error",
      message: "Missing required environment variables",
      details: [
        !url ? "NEXT_PUBLIC_SUPABASE_URL is not set" : "",
        !key ? "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set" : "",
        "Create a .env.local file in your project root",
        "Add your Supabase project URL and anon key",
      ].filter(Boolean),
    })
  } else {
    results.push({
      step: "Environment Variables",
      status: "success",
      message: "Environment variables are set",
    })
  }

  // Step 2: Check configuration validity
  const status = getSupabaseStatus()
  const configured = isSupabaseConfigured()

  if (!configured) {
    results.push({
      step: "Configuration Validation",
      status: "error",
      message: `Configuration invalid: ${status}`,
      details: [
        "Check that your Supabase URL is correct",
        "Verify your anon/public key is valid",
        "Ensure no placeholder values are used",
      ],
    })
  } else {
    results.push({
      step: "Configuration Validation",
      status: "success",
      message: "Configuration is valid",
    })
  }

  // Step 3: Test database connection
  try {
    const clients = await clientsApi.getAll()
    results.push({
      step: "Database Connection",
      status: "success",
      message: `Connected successfully - ${clients.length} clients found`,
    })

    // Step 4: Test table access
    if (clients.length > 0) {
      try {
        const caseNotes = await caseNotesApi.getByClientId(clients[0].id)
        results.push({
          step: "Table Access",
          status: "success",
          message: `Tables accessible - ${caseNotes.length} case notes found`,
        })
      } catch (error: any) {
        results.push({
          step: "Table Access",
          status: "warning",
          message: "Clients table accessible, but case_notes table may have issues",
          details: [error.message],
        })
      }
    } else {
      results.push({
        step: "Table Access",
        status: "warning",
        message: "Tables accessible but no data found",
        details: ["This is normal for a new project", "You can start adding clients"],
      })
    }
  } catch (error: any) {
    results.push({
      step: "Database Connection",
      status: "error",
      message: "Failed to connect to database",
      details: [
        error.message,
        "Check if your project is paused in Supabase dashboard",
        "Verify your API key has correct permissions",
        "Ensure database schema is set up correctly",
      ],
    })
  }

  return results
}

// Make function available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).checkSupabaseSetup = async () => {
    const results = await checkSupabaseSetup()
    console.log("🔧 Supabase Setup Check Results:")
    console.log("================================")

    results.forEach((result, index) => {
      const icon = result.status === "success" ? "✅" : result.status === "warning" ? "⚠️" : "❌"
      console.log(`${index + 1}. ${icon} ${result.step}: ${result.message}`)

      if (result.details) {
        result.details.forEach((detail) => {
          console.log(`   💡 ${detail}`)
        })
      }
    })

    return results
  }
}
