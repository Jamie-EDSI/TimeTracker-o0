import { supabase, isSupabaseConfigured, getSupabaseStatus } from "./supabase"

export interface SetupCheckResult {
  isConfigured: boolean
  status: "not_configured" | "error" | "connected"
  issues: string[]
  recommendations: string[]
  environmentVariables: {
    url: boolean
    key: boolean
  }
  databaseConnection: boolean
  tablesExist: boolean
}

export class SupabaseSetupChecker {
  static async performFullCheck(): Promise<SetupCheckResult> {
    const result: SetupCheckResult = {
      isConfigured: false,
      status: "not_configured",
      issues: [],
      recommendations: [],
      environmentVariables: {
        url: false,
        key: false,
      },
      databaseConnection: false,
      tablesExist: false,
    }

    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    result.environmentVariables.url = !!url
    result.environmentVariables.key = !!key

    if (!url) {
      result.issues.push("NEXT_PUBLIC_SUPABASE_URL is not set")
      result.recommendations.push("Add your Supabase project URL to .env.local")
    } else if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
      result.issues.push("NEXT_PUBLIC_SUPABASE_URL format is invalid")
      result.recommendations.push("Ensure URL format is: https://your-project.supabase.co")
    }

    if (!key) {
      result.issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
      result.recommendations.push("Add your Supabase anon key to .env.local")
    } else if (key.length < 20) {
      result.issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid")
      result.recommendations.push("Ensure you're using the anon/public key, not the service role key")
    }

    // Check Supabase configuration
    result.isConfigured = isSupabaseConfigured()
    result.status = getSupabaseStatus()

    if (!result.isConfigured) {
      result.recommendations.push("Follow the setup guide in SUPABASE_SETUP_GUIDE.md")
      return result
    }

    // Test database connection
    try {
      if (supabase) {
        const { data, error } = await supabase.from("clients").select("count(*)").limit(1)

        if (error) {
          result.issues.push(`Database connection failed: ${error.message}`)
          result.recommendations.push("Check your API key and project URL")

          if (error.code === "42P01") {
            result.issues.push("Tables do not exist")
            result.recommendations.push("Run the SQL schema script in Supabase SQL Editor")
          }
        } else {
          result.databaseConnection = true
          result.tablesExist = true
        }
      }
    } catch (error: any) {
      result.issues.push(`Connection test failed: ${error.message}`)
      result.recommendations.push("Verify your Supabase project is active and accessible")
    }

    return result
  }

  static async printDetailedReport(): Promise<void> {
    console.group("🔍 Supabase Setup Analysis")

    const result = await this.performFullCheck()

    console.log("📊 Overall Status:", result.status)
    console.log("✅ Configured:", result.isConfigured)

    console.group("🌐 Environment Variables")
    console.log("URL Set:", result.environmentVariables.url ? "✅" : "❌")
    console.log("Key Set:", result.environmentVariables.key ? "✅" : "❌")
    console.groupEnd()

    console.group("🔌 Database Connection")
    console.log("Connection:", result.databaseConnection ? "✅" : "❌")
    console.log("Tables Exist:", result.tablesExist ? "✅" : "❌")
    console.groupEnd()

    if (result.issues.length > 0) {
      console.group("🚨 Issues Found")
      result.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })
      console.groupEnd()
    }

    if (result.recommendations.length > 0) {
      console.group("💡 Recommendations")
      result.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`)
      })
      console.groupEnd()
    }

    if (result.isConfigured && result.databaseConnection && result.tablesExist) {
      console.log("🎉 Supabase is fully configured and working!")
    } else {
      console.log("⚠️ Setup incomplete. Follow the recommendations above.")
    }

    console.groupEnd()
  }
}

// Make available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).checkSupabaseSetup = SupabaseSetupChecker.printDetailedReport
}
