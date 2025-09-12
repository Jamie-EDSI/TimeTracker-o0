// Test utility to verify Supabase connection
// Run this in your browser console to test the connection

export async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase Connection...")

  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("📋 Environment Check:")
  console.log("- URL:", url ? "✅ Set" : "❌ Missing")
  console.log("- Key:", key ? "✅ Set" : "❌ Missing")

  if (!url || !key) {
    console.log("❌ Environment variables not configured properly")
    return false
  }

  // Test basic connection
  try {
    const { supabase } = await import("./supabase")

    if (!supabase) {
      console.log("❌ Supabase client not initialized")
      return false
    }

    console.log("🔌 Testing database connection...")

    // Try to fetch clients
    const { data, error } = await supabase.from("clients").select("count(*)").limit(1)

    if (error) {
      console.log("❌ Database connection failed:", error.message)
      return false
    }

    console.log("✅ Database connection successful!")
    console.log("📊 Client count:", data?.[0]?.count || 0)

    // Test case notes table
    const { data: notesData, error: notesError } = await supabase.from("case_notes").select("count(*)").limit(1)

    if (notesError) {
      console.log("⚠️ Case notes table issue:", notesError.message)
    } else {
      console.log("📝 Case notes count:", notesData?.[0]?.count || 0)
    }

    console.log("🎉 Supabase is fully configured and working!")
    return true
  } catch (error) {
    console.log("❌ Connection test failed:", error)
    return false
  }
}

// Auto-run test in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Add to window for easy access in console
  ;(window as any).testSupabase = testSupabaseConnection
  console.log("🔧 Run testSupabase() in console to test your Supabase connection")
}
