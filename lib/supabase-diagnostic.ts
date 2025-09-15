import { createClient } from "@supabase/supabase-js"

// Diagnostic tool for Supabase integration issues
export class SupabaseDiagnostic {
  private supabaseUrl: string
  private supabaseKey: string
  private client: any

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (this.supabaseUrl && this.supabaseKey) {
      this.client = createClient(this.supabaseUrl, this.supabaseKey)
    }
  }

  async runFullDiagnostic() {
    console.log("🔍 Starting Supabase Integration Diagnostic...")
    console.log("=".repeat(50))

    const results = {
      environmentVariables: this.checkEnvironmentVariables(),
      urlValidation: this.validateUrl(),
      keyValidation: this.validateKey(),
      clientCreation: this.testClientCreation(),
      connectionTest: await this.testConnection(),
      authTest: await this.testAuthentication(),
      tableAccess: await this.testTableAccess(),
      crudOperations: await this.testCrudOperations(),
      realTimeConnection: await this.testRealTimeConnection(),
      rowLevelSecurity: await this.testRowLevelSecurity(),
    }

    this.printDiagnosticResults(results)
    return results
  }

  checkEnvironmentVariables() {
    console.log("1️⃣ Checking Environment Variables...")

    const checks = {
      supabaseUrl: {
        exists: !!this.supabaseUrl,
        value: this.supabaseUrl ? "✅ Set" : "❌ Missing",
        actual: this.supabaseUrl || "Not set",
      },
      supabaseKey: {
        exists: !!this.supabaseKey,
        value: this.supabaseKey ? "✅ Set" : "❌ Missing",
        actual: this.supabaseKey ? `${this.supabaseKey.substring(0, 20)}...` : "Not set",
      },
    }

    console.log("   NEXT_PUBLIC_SUPABASE_URL:", checks.supabaseUrl.value)
    console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY:", checks.supabaseKey.value)

    return checks
  }

  validateUrl() {
    console.log("2️⃣ Validating Supabase URL...")

    if (!this.supabaseUrl) {
      console.log("   ❌ URL is missing")
      return { valid: false, reason: "URL is missing" }
    }

    if (!this.supabaseUrl.startsWith("https://")) {
      console.log("   ❌ URL must start with https://")
      return { valid: false, reason: "URL must start with https://" }
    }

    if (!this.supabaseUrl.includes(".supabase.co")) {
      console.log("   ❌ URL must contain .supabase.co")
      return { valid: false, reason: "URL must contain .supabase.co" }
    }

    if (this.supabaseUrl.includes("placeholder") || this.supabaseUrl.includes("your-project")) {
      console.log("   ❌ URL appears to be a placeholder")
      return { valid: false, reason: "URL appears to be a placeholder" }
    }

    console.log("   ✅ URL format is valid")
    return { valid: true, reason: "URL format is valid" }
  }

  validateKey() {
    console.log("3️⃣ Validating Supabase API Key...")

    if (!this.supabaseKey) {
      console.log("   ❌ API Key is missing")
      return { valid: false, reason: "API Key is missing" }
    }

    if (this.supabaseKey.length < 20) {
      console.log("   ❌ API Key appears too short")
      return { valid: false, reason: "API Key appears too short" }
    }

    if (this.supabaseKey.includes("placeholder") || this.supabaseKey.includes("your-key")) {
      console.log("   ❌ API Key appears to be a placeholder")
      return { valid: false, reason: "API Key appears to be a placeholder" }
    }

    console.log("   ✅ API Key format appears valid")
    return { valid: true, reason: "API Key format appears valid" }
  }

  testClientCreation() {
    console.log("4️⃣ Testing Supabase Client Creation...")

    try {
      if (!this.client) {
        console.log("   ❌ Failed to create client - missing credentials")
        return { success: false, error: "Missing credentials" }
      }

      console.log("   ✅ Supabase client created successfully")
      return { success: true }
    } catch (error: any) {
      console.log("   ❌ Failed to create client:", error.message)
      return { success: false, error: error.message }
    }
  }

  async testConnection() {
    console.log("5️⃣ Testing Network Connection...")

    if (!this.client) {
      console.log("   ❌ No client available for connection test")
      return { success: false, error: "No client available" }
    }

    try {
      // Test basic connectivity by trying to access the REST API
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        method: "HEAD",
        headers: {
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
        },
      })

      if (response.ok) {
        console.log("   ✅ Network connection successful")
        return { success: true, status: response.status }
      } else {
        console.log(`   ❌ Network connection failed with status: ${response.status}`)
        return { success: false, error: `HTTP ${response.status}`, status: response.status }
      }
    } catch (error: any) {
      console.log("   ❌ Network connection failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  async testAuthentication() {
    console.log("6️⃣ Testing Authentication...")

    if (!this.client) {
      console.log("   ❌ No client available for auth test")
      return { success: false, error: "No client available" }
    }

    try {
      // Test if we can get the current session/user
      const {
        data: { session },
        error,
      } = await this.client.auth.getSession()

      if (error) {
        console.log("   ⚠️ Auth test completed with error:", error.message)
        return { success: false, error: error.message, hasSession: false }
      }

      console.log("   ✅ Auth system accessible")
      console.log(`   Session status: ${session ? "Active session found" : "No active session (normal for anon key)"}`)
      return { success: true, hasSession: !!session }
    } catch (error: any) {
      console.log("   ❌ Auth test failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  async testTableAccess() {
    console.log("7️⃣ Testing Table Access...")

    if (!this.client) {
      console.log("   ❌ No client available for table test")
      return { success: false, error: "No client available" }
    }

    const tableTests = {
      clients: await this.testTableQuery("clients"),
      case_notes: await this.testTableQuery("case_notes"),
    }

    return tableTests
  }

  async testTableQuery(tableName: string) {
    try {
      console.log(`   Testing ${tableName} table...`)

      const { data, error, count } = await this.client.from(tableName).select("*", { count: "exact", head: true })

      if (error) {
        console.log(`   ❌ ${tableName} table error:`, error.message)
        return {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      }

      console.log(`   ✅ ${tableName} table accessible (${count || 0} rows)`)
      return { success: true, rowCount: count || 0 }
    } catch (error: any) {
      console.log(`   ❌ ${tableName} table test failed:`, error.message)
      return { success: false, error: error.message }
    }
  }

  async testCrudOperations() {
    console.log("8️⃣ Testing CRUD Operations...")

    if (!this.client) {
      console.log("   ❌ No client available for CRUD test")
      return { success: false, error: "No client available" }
    }

    const testData = {
      first_name: "Test",
      last_name: "User",
      participant_id: `TEST-${Date.now()}`,
      program: "Test Program",
      status: "Active",
      enrollment_date: new Date().toISOString().split("T")[0],
      phone: "555-0123",
      email: "test@example.com",
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      zip_code: "12345",
      date_of_birth: "1990-01-01",
      case_manager: "Test Manager",
    }

    try {
      // Test CREATE
      console.log("   Testing CREATE operation...")
      const { data: createData, error: createError } = await this.client
        .from("clients")
        .insert([testData])
        .select()
        .single()

      if (createError) {
        console.log("   ❌ CREATE failed:", createError.message)
        return {
          success: false,
          operation: "CREATE",
          error: createError.message,
          code: createError.code,
          details: createError.details,
        }
      }

      console.log("   ✅ CREATE successful")
      const testId = createData.id

      // Test READ
      console.log("   Testing READ operation...")
      const { data: readData, error: readError } = await this.client
        .from("clients")
        .select("*")
        .eq("id", testId)
        .single()

      if (readError) {
        console.log("   ❌ READ failed:", readError.message)
        return {
          success: false,
          operation: "READ",
          error: readError.message,
        }
      }

      console.log("   ✅ READ successful")

      // Test UPDATE
      console.log("   Testing UPDATE operation...")
      const { data: updateData, error: updateError } = await this.client
        .from("clients")
        .update({ phone: "555-9999" })
        .eq("id", testId)
        .select()
        .single()

      if (updateError) {
        console.log("   ❌ UPDATE failed:", updateError.message)
        return {
          success: false,
          operation: "UPDATE",
          error: updateError.message,
        }
      }

      console.log("   ✅ UPDATE successful")

      // Test DELETE
      console.log("   Testing DELETE operation...")
      const { error: deleteError } = await this.client.from("clients").delete().eq("id", testId)

      if (deleteError) {
        console.log("   ❌ DELETE failed:", deleteError.message)
        return {
          success: false,
          operation: "DELETE",
          error: deleteError.message,
        }
      }

      console.log("   ✅ DELETE successful")
      console.log("   ✅ All CRUD operations working correctly")

      return { success: true, operations: ["CREATE", "READ", "UPDATE", "DELETE"] }
    } catch (error: any) {
      console.log("   ❌ CRUD test failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  async testRealTimeConnection() {
    console.log("9️⃣ Testing Real-time Connection...")

    if (!this.client) {
      console.log("   ❌ No client available for real-time test")
      return { success: false, error: "No client available" }
    }

    try {
      // Test real-time subscription
      const channel = this.client
        .channel("test-channel")
        .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, (payload: any) => {
          console.log("   📡 Real-time event received:", payload)
        })

      const subscribeResponse = await channel.subscribe()

      if (subscribeResponse === "SUBSCRIBED") {
        console.log("   ✅ Real-time connection successful")

        // Clean up
        setTimeout(() => {
          this.client.removeChannel(channel)
        }, 1000)

        return { success: true, status: "SUBSCRIBED" }
      } else {
        console.log("   ❌ Real-time subscription failed:", subscribeResponse)
        return { success: false, error: `Subscription status: ${subscribeResponse}` }
      }
    } catch (error: any) {
      console.log("   ❌ Real-time test failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  async testRowLevelSecurity() {
    console.log("🔟 Testing Row Level Security (RLS)...")

    if (!this.client) {
      console.log("   ❌ No client available for RLS test")
      return { success: false, error: "No client available" }
    }

    try {
      // Check if RLS is enabled by trying to access tables
      const { data, error } = await this.client.from("clients").select("id").limit(1)

      if (error) {
        if (error.code === "PGRST116" || error.message.includes("row-level security")) {
          console.log("   ⚠️ RLS is enabled but may be blocking access")
          console.log("   💡 Consider disabling RLS for development or setting up proper policies")
          return {
            success: false,
            error: "RLS blocking access",
            suggestion: "Disable RLS or configure policies",
            rlsEnabled: true,
          }
        } else {
          console.log("   ❌ RLS test failed:", error.message)
          return { success: false, error: error.message }
        }
      }

      console.log("   ✅ RLS test passed - tables accessible")
      return { success: true, rlsEnabled: false }
    } catch (error: any) {
      console.log("   ❌ RLS test failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  printDiagnosticResults(results: any) {
    console.log("\n" + "=".repeat(50))
    console.log("📊 DIAGNOSTIC SUMMARY")
    console.log("=".repeat(50))

    const issues = []
    const warnings = []

    // Analyze results
    if (!results.environmentVariables.supabaseUrl.exists) {
      issues.push("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
    }
    if (!results.environmentVariables.supabaseKey.exists) {
      issues.push("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
    }
    if (!results.urlValidation.valid) {
      issues.push(`Invalid URL: ${results.urlValidation.reason}`)
    }
    if (!results.keyValidation.valid) {
      issues.push(`Invalid API Key: ${results.keyValidation.reason}`)
    }
    if (!results.clientCreation.success) {
      issues.push(`Client creation failed: ${results.clientCreation.error}`)
    }
    if (!results.connectionTest.success) {
      issues.push(`Network connection failed: ${results.connectionTest.error}`)
    }
    if (!results.tableAccess.clients.success) {
      issues.push(`Clients table access failed: ${results.tableAccess.clients.error}`)
    }
    if (!results.tableAccess.case_notes.success) {
      issues.push(`Case notes table access failed: ${results.tableAccess.case_notes.error}`)
    }
    if (!results.crudOperations.success) {
      issues.push(`CRUD operations failed: ${results.crudOperations.error}`)
    }
    if (!results.realTimeConnection.success) {
      warnings.push(`Real-time connection issue: ${results.realTimeConnection.error}`)
    }
    if (results.rowLevelSecurity.rlsEnabled) {
      warnings.push("Row Level Security may be blocking operations")
    }

    // Print issues
    if (issues.length > 0) {
      console.log("🚨 CRITICAL ISSUES:")
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`)
      })
    }

    if (warnings.length > 0) {
      console.log("\n⚠️ WARNINGS:")
      warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`)
      })
    }

    if (issues.length === 0) {
      console.log("✅ No critical issues found!")
    }

    // Recommendations
    console.log("\n💡 RECOMMENDATIONS:")
    if (issues.length > 0) {
      console.log("   1. Fix the critical issues listed above first")
      console.log("   2. Ensure your .env.local file has correct Supabase credentials")
      console.log("   3. Verify your Supabase project is not paused")
      console.log("   4. Check that your database schema matches the expected structure")
    } else {
      console.log("   1. Your Supabase integration appears to be working correctly")
      console.log("   2. If you're still experiencing issues, check the browser console for client-side errors")
      console.log("   3. Verify that your application is using the correct API functions")
    }

    console.log("=".repeat(50))
  }
}

// Export the diagnostic function
export const runSupabaseDiagnostic = async () => {
  const diagnostic = new SupabaseDiagnostic()
  return await diagnostic.runFullDiagnostic()
}
