// Enhanced Supabase debugging utilities with comprehensive testing capabilities
import { createClient } from "@supabase/supabase-js"

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create supabase client for debugging
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Network monitoring utilities
export class NetworkMonitor {
  static async testConnection() {
    const results = {
      timestamp: new Date().toISOString(),
      supabaseReachable: false,
      internetConnection: false,
      latency: 0,
      error: null as string | null,
    }

    try {
      // Test internet connection first
      const startTime = Date.now()
      const response = await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
      })
      results.latency = Date.now() - startTime
      results.internetConnection = true

      // Test Supabase connection
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase.from("clients").select("count", { count: "exact", head: true })
        if (error) {
          results.error = error.message
        } else {
          results.supabaseReachable = true
        }
      } else {
        results.error = "Supabase credentials not configured"
      }
    } catch (error: any) {
      results.error = error.message
    }

    return results
  }

  static async checkTableAccess() {
    const tables = ["clients", "case_notes", "call_logs", "job_placements"]
    const results: Record<string, { accessible: boolean; error?: string }> = {}

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("count", { count: "exact", head: true })
        results[table] = {
          accessible: !error,
          error: error?.message,
        }
      } catch (error: any) {
        results[table] = {
          accessible: false,
          error: error.message,
        }
      }
    }

    return results
  }
}

// Data validation utilities
export class DataValidator {
  static validateClient(client: any) {
    const errors: string[] = []

    // Required fields
    if (!client.first_name?.trim()) errors.push("First name is required")
    if (!client.last_name?.trim()) errors.push("Last name is required")
    if (!client.participant_id?.trim()) errors.push("Participant ID is required")
    if (!client.program?.trim()) errors.push("Program is required")
    if (!client.status?.trim()) errors.push("Status is required")

    // Email validation
    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      errors.push("Invalid email format")
    }

    // Phone validation
    if (client.phone && !/^[\d\s\-$$$$]+$/.test(client.phone)) {
      errors.push("Invalid phone format")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateCaseNote(caseNote: any) {
    const errors: string[] = []

    if (!caseNote.client_id?.trim()) errors.push("Client ID is required")
    if (!caseNote.note?.trim()) errors.push("Note content is required")
    if (!caseNote.author?.trim()) errors.push("Author is required")

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Comprehensive Supabase debugger
export class SupabaseDebugger {
  static async runFullDiagnostic() {
    console.log("🔍 Starting Supabase Full Diagnostic...")

    const results = {
      timestamp: new Date().toISOString(),
      environment: this.checkEnvironment(),
      network: await NetworkMonitor.testConnection(),
      tables: await NetworkMonitor.checkTableAccess(),
      schema: await this.checkSchema(),
      permissions: await this.checkPermissions(),
    }

    console.log("📊 Diagnostic Results:", results)
    return results
  }

  static checkEnvironment() {
    return {
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseAnonKey,
      urlFormat: supabaseUrl?.includes(".supabase.co") || false,
      keyLength: supabaseAnonKey?.length || 0,
    }
  }

  static async checkSchema() {
    try {
      // Check if clients table exists and get its structure
      const { data, error } = await supabase.rpc("get_table_info", { table_name: "clients" })
      if (error) {
        // Fallback: try to query the table directly
        const { data: testData, error: testError } = await supabase.from("clients").select("*").limit(1)
        return {
          clientsTable: !testError,
          error: testError?.message,
        }
      }
      return {
        clientsTable: true,
        columns: data,
      }
    } catch (error: any) {
      return {
        clientsTable: false,
        error: error.message,
      }
    }
  }

  static async checkPermissions() {
    const operations = {
      select: false,
      insert: false,
      update: false,
      delete: false,
    }

    try {
      // Test SELECT
      const { error: selectError } = await supabase.from("clients").select("id").limit(1)
      operations.select = !selectError

      // Test INSERT (with rollback)
      const testClient = {
        first_name: "Test",
        last_name: "User",
        participant_id: `TEST-${Date.now()}`,
        program: "Test",
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

      const { data: insertData, error: insertError } = await supabase.from("clients").insert([testClient]).select()
      operations.insert = !insertError

      if (insertData && insertData[0]) {
        // Test UPDATE
        const { error: updateError } = await supabase
          .from("clients")
          .update({ phone: "555-9999" })
          .eq("id", insertData[0].id)
        operations.update = !updateError

        // Test DELETE (cleanup)
        const { error: deleteError } = await supabase.from("clients").delete().eq("id", insertData[0].id)
        operations.delete = !deleteError
      }
    } catch (error: any) {
      console.error("Permission check error:", error)
    }

    return operations
  }
}

// Global diagnostic functions
export const debugSupabaseConnection = async () => {
  return await SupabaseDebugger.runFullDiagnostic()
}

export const testCRUDOperations = async () => {
  console.log("🧪 Testing CRUD Operations...")

  try {
    const testClient = {
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

    // CREATE
    const { data: created, error: createError } = await supabase.from("clients").insert([testClient]).select().single()
    if (createError) throw createError
    console.log("✅ CREATE successful:", created.id)

    // READ
    const { data: read, error: readError } = await supabase.from("clients").select("*").eq("id", created.id).single()
    if (readError) throw readError
    console.log("✅ READ successful")

    // UPDATE
    const { data: updated, error: updateError } = await supabase
      .from("clients")
      .update({ phone: "555-9999" })
      .eq("id", created.id)
      .select()
      .single()
    if (updateError) throw updateError
    console.log("✅ UPDATE successful")

    // DELETE
    const { error: deleteError } = await supabase.from("clients").delete().eq("id", created.id)
    if (deleteError) throw deleteError
    console.log("✅ DELETE successful")

    console.log("🎉 All CRUD operations working!")
    return true
  } catch (error: any) {
    console.error("❌ CRUD test failed:", error.message)
    return false
  }
}

// Browser environment check
export const checkEnvironment = () => {
  const env = {
    isBrowser: typeof window !== "undefined",
    supabaseUrl: !!supabaseUrl,
    supabaseKey: !!supabaseAnonKey,
    urlValid: supabaseUrl?.includes(".supabase.co") || false,
    keyValid: (supabaseAnonKey?.length || 0) > 20,
  }

  console.log("🌍 Environment Check:", env)
  return env
}
