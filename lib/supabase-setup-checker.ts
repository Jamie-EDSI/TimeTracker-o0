// Utility to check if Supabase is properly set up
export function checkSupabaseSetup() {
  const issues: string[] = []
  const warnings: string[] = []

  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || url === "your_supabase_project_url_here") {
    issues.push("NEXT_PUBLIC_SUPABASE_URL is not configured")
  }

  if (!key || key === "your_supabase_anon_key_here") {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured")
  }

  // Check URL format
  if (url && !url.startsWith("https://") && !url.includes(".supabase.co")) {
    warnings.push("Supabase URL format looks incorrect")
  }

  // Check key format
  if (key && !key.startsWith("eyJ")) {
    warnings.push("Supabase anon key format looks incorrect")
  }

  return {
    isConfigured: issues.length === 0,
    issues,
    warnings,
    status: issues.length === 0 ? "ready" : "needs-setup",
  }
}

// Display setup status in console
export function displaySetupStatus() {
  const status = checkSupabaseSetup()

  console.log("🔧 Supabase Setup Status:")

  if (status.isConfigured) {
    console.log("✅ Supabase is configured and ready!")
  } else {
    console.log("❌ Supabase needs configuration:")
    status.issues.forEach((issue) => console.log(`  - ${issue}`))
  }

  if (status.warnings.length > 0) {
    console.log("⚠️ Warnings:")
    status.warnings.forEach((warning) => console.log(`  - ${warning}`))
  }

  if (!status.isConfigured) {
    console.log("📖 See SUPABASE_SETUP_GUIDE.md for detailed setup instructions")
  }

  return status
}
