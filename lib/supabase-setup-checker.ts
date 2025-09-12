import { getSupabaseStatus, getConfigError } from "./supabase"

export interface SetupStatus {
  isConfigured: boolean
  status: "not_configured" | "error" | "connected"
  message: string
  recommendations: string[]
}

export function checkSupabaseSetup(): SetupStatus {
  const status = getSupabaseStatus()
  const error = getConfigError()

  switch (status) {
    case "not_configured":
      return {
        isConfigured: false,
        status: "not_configured",
        message: "Supabase not configured - running in demo mode",
        recommendations: [
          "Create a Supabase project at https://supabase.com",
          "Run the SQL schema from scripts/supabase-schema.sql",
          "Add your credentials to .env.local",
          "Restart your development server",
        ],
      }

    case "error":
      return {
        isConfigured: false,
        status: "error",
        message: error || "Supabase configuration error",
        recommendations: [
          "Check your NEXT_PUBLIC_SUPABASE_URL format",
          "Verify your NEXT_PUBLIC_SUPABASE_ANON_KEY is correct",
          "Ensure your Supabase project is not paused",
          "Run testSupabase() in console for detailed diagnostics",
        ],
      }

    case "connected":
      return {
        isConfigured: true,
        status: "connected",
        message: "Connected to Supabase database",
        recommendations: [
          "Your setup is working correctly!",
          "All data will be saved to your Supabase database",
          "You can view and manage data in your Supabase dashboard",
        ],
      }

    default:
      return {
        isConfigured: false,
        status: "error",
        message: "Unknown configuration status",
        recommendations: ["Please check your setup and try again"],
      }
  }
}

export function getSetupInstructions(): string[] {
  return [
    "1. Create account at https://supabase.com",
    "2. Create new project",
    "3. Run SQL from scripts/supabase-schema.sql",
    "4. Copy URL and API key from Settings > API",
    "5. Update .env.local with your credentials",
    "6. Restart development server",
  ]
}
