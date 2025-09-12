import { clientsApi, caseNotesApi, isSupabaseConfigured, getSupabaseStatus } from "./supabase"

// Test function to verify Supabase connection
export async function testSupabase() {
  console.log("🧪 Testing Supabase Configuration...")
  console.log("=====================================")

  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("📋 Environment Variables:")
  console.log(`   URL: ${url ? "✅ Set" : "❌ Missing"}`)
  console.log(`   Key: ${key ? "✅ Set" : "❌ Missing"}`)

  if (!url || !key) {
    console.log("❌ Environment variables not configured")
    console.log("💡 Please check your .env.local file")
    return false
  }

  // Check configuration status
  const status = getSupabaseStatus()
  const configured = isSupabaseConfigured()

  console.log("\n🔧 Configuration Status:")
  console.log(`   Status: ${status}`)
  console.log(`   Configured: ${configured ? "✅ Yes" : "❌ No"}`)

  if (!configured) {
    console.log("❌ Supabase not properly configured")
    console.log("💡 Check your URL format and API key")
    return false
  }

  // Test database connection
  console.log("\n🔌 Testing Database Connection...")

  try {
    // Test clients API
    console.log("   Testing clients table...")
    const clients = await clientsApi.getAll()
    console.log(`   ✅ Clients loaded: ${clients.length} records`)

    if (clients.length > 0) {
      // Test case notes API
      console.log("   Testing case notes table...")
      const caseNotes = await caseNotesApi.getByClientId(clients[0].id)
      console.log(`   ✅ Case notes loaded: ${caseNotes.length} records`)
    }

    console.log("\n🎉 SUCCESS: Supabase is properly configured!")
    console.log("✅ Database connection working")
    console.log("✅ Tables accessible")
    console.log("✅ Data can be read")

    return true
  } catch (error: any) {
    console.log("\n❌ FAILED: Database connection error")
    console.log(`   Error: ${error.message}`)
    console.log("\n💡 Troubleshooting tips:")
    console.log("   1. Check your API key is correct")
    console.log("   2. Verify your project URL")
    console.log("   3. Ensure database schema is set up")
    console.log("   4. Check if project is paused in Supabase dashboard")

    return false
  }
}

// Make test function available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).testSupabase = testSupabase
}

export default testSupabase
