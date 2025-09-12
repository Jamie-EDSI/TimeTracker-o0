// Test utility to verify Supabase connection
export async function testSupabase() {
  console.log("🧪 Testing Supabase Connection...")

  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("📋 Environment Variables:")
    console.log("- SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
    console.log("- SUPABASE_ANON_KEY:", supabaseKey ? "✅ Set" : "❌ Missing")

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing environment variables. Check your .env.local file")
      return false
    }

    // Test database connection
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("🔌 Testing database connection...")

    // Test basic query
    const { data, error } = await supabase.from("clients").select("count(*)").limit(1)

    if (error) {
      console.error("❌ Database connection failed:", error.message)
      return false
    }

    console.log("✅ Database connection successful!")
    console.log("📊 Found", data?.[0]?.count || 0, "clients in database")

    // Test table structure
    const { data: tableData, error: tableError } = await supabase.from("clients").select("*").limit(1)

    if (tableError) {
      console.error("❌ Table query failed:", tableError.message)
      return false
    }

    console.log("✅ Table structure verified")
    console.log("🎉 Supabase setup is working correctly!")

    return true
  } catch (error) {
    console.error("❌ Test failed:", error)
    return false
  }
}

// Make function available globally for easy testing
if (typeof window !== "undefined") {
  ;(window as any).testSupabase = testSupabase
}
