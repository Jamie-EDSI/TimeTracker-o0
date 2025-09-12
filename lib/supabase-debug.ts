// Supabase debugging utilities
export class SupabaseDebugger {
  private static operations: Array<{
    operation: string
    table: string
    data: any
    timestamp: string
    success: boolean
    error?: any
    duration?: number
  }> = []

  static async logOperation<T>(operation: string, table: string, data: any, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    console.group(`🔍 Supabase ${operation} - ${table}`)
    console.log("Timestamp:", timestamp)
    console.log("Data:", data)

    try {
      const result = await fn()
      const duration = Date.now() - startTime

      this.operations.push({
        operation,
        table,
        data,
        timestamp,
        success: true,
        duration,
      })

      console.log("✅ Success")
      console.log("Duration:", `${duration}ms`)
      console.log("Result:", result)
      console.groupEnd()

      return result
    } catch (error: any) {
      const duration = Date.now() - startTime

      this.operations.push({
        operation,
        table,
        data,
        timestamp,
        success: false,
        error,
        duration,
      })

      console.error("❌ Error:", error)
      console.error("Duration:", `${duration}ms`)
      console.groupEnd()

      throw error
    }
  }

  static printSummary() {
    console.table(this.operations)
  }

  static getOperations() {
    return [...this.operations]
  }

  static clearLog() {
    this.operations = []
  }
}

export class NetworkMonitor {
  static async testConnection() {
    const results = {
      internetConnected: false,
      supabaseReachable: false,
      latency: 0,
      error: null as string | null,
    }

    try {
      // Test internet connectivity
      const startTime = Date.now()
      const response = await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
      })
      results.internetConnected = true
      results.latency = Date.now() - startTime

      // Test Supabase connectivity
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl) {
        const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: "HEAD",
          mode: "cors",
        })
        results.supabaseReachable = supabaseResponse.ok
      }
    } catch (error: any) {
      results.error = error.message
    }

    return results
  }
}

export class DataValidator {
  static validateClient(client: any) {
    const errors: string[] = []

    if (!client.first_name || client.first_name.trim() === "") {
      errors.push("First name is required")
    }

    if (!client.last_name || client.last_name.trim() === "") {
      errors.push("Last name is required")
    }

    if (!client.participant_id || client.participant_id.trim() === "") {
      errors.push("Participant ID is required")
    }

    if (client.email && !this.isValidEmail(client.email)) {
      errors.push("Invalid email format")
    }

    if (client.phone && !this.isValidPhone(client.phone)) {
      errors.push("Invalid phone format")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateCaseNote(caseNote: any) {
    const errors: string[] = []

    if (!caseNote.client_id || caseNote.client_id.trim() === "") {
      errors.push("Client ID is required")
    }

    if (!caseNote.note || caseNote.note.trim() === "") {
      errors.push("Note content is required")
    }

    if (!caseNote.author || caseNote.author.trim() === "") {
      errors.push("Author is required")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    const cleanPhone = phone.replace(/[\s\-()]/g, "")
    return phoneRegex.test(cleanPhone)
  }
}

// Main debug function - exported as a regular function
export async function debugSupabase() {
  console.log("🔧 Starting Supabase Debug Session...")

  // Test network connectivity
  console.log("\n📡 Testing Network Connectivity...")
  const networkResults = await NetworkMonitor.testConnection()
  console.table(networkResults)

  // Test basic operations
  console.log("\n🧪 Testing Basic Operations...")
  try {
    // Dynamic import to avoid circular dependencies
    const supabaseModule = await import("./supabase")
    const { supabase } = supabaseModule

    if (supabase) {
      // Test connection
      const { data: testData, error: testError } = await supabase.from("clients").select("count").limit(1)

      if (testError) {
        console.error("❌ Database connection failed:", testError)
      } else {
        console.log("✅ Database connection successful")
      }
    } else {
      console.log("⚠️ Supabase client not configured - using demo mode")
    }

    // Print operation summary
    console.log("\n📊 Operation Summary:")
    SupabaseDebugger.printSummary()
  } catch (error) {
    console.error("❌ Debug session failed:", error)
  }

  console.log("\n🎯 Debug session complete!")
}

// Helper functions for easier access
export const debugUtils = {
  debugSupabase,
  SupabaseDebugger,
  NetworkMonitor,
  DataValidator,
}

// Make functions available globally for development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).debugSupabase =
    debugSupabase(window as any).SupabaseDebugger =
    SupabaseDebugger(window as any).NetworkMonitor =
    NetworkMonitor(window as any).DataValidator =
      DataValidator
}
