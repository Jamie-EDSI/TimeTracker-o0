export function checkSupabaseSetup() {
  const issues: string[] = []
  const warnings: string[] = []

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL is not set")
  } else if (!supabaseUrl.startsWith("https://")) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL should start with https://")
  } else if (!supabaseUrl.includes(".supabase.co")) {
    warnings.push("NEXT_PUBLIC_SUPABASE_URL doesn't look like a Supabase URL")
  }

  if (!supabaseKey) {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
  } else if (!supabaseKey.startsWith("eyJ")) {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY doesn't look like a JWT token")
  }

  // Check for common mistakes
  if (supabaseUrl === "https://your-project-id.supabase.co") {
    issues.push("NEXT_PUBLIC_SUPABASE_URL is still using placeholder value")
  }

  if (supabaseKey === "your-anon-key-here") {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is still using placeholder value")
  }

  return {
    isConfigured: issues.length === 0,
    issues,
    warnings,
  }
}

export function logSetupStatus() {
  const status = checkSupabaseSetup()

  if (status.isConfigured) {
    console.log("✅ Supabase configuration looks good!")
  } else {
    console.log("⚠️ Supabase configuration issues found:")
    status.issues.forEach((issue) => console.log(`  ❌ ${issue}`))
  }

  if (status.warnings.length > 0) {
    console.log("⚠️ Warnings:")
    status.warnings.forEach((warning) => console.log(`  ⚠️ ${warning}`))
  }

  return status
}
