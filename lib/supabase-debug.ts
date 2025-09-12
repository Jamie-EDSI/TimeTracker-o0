import { supabase } from "./supabase"

// Debug utility to monitor Supabase operations
export class SupabaseDebugger {
  private static logs: Array<{
    timestamp: string
    operation: string
    table: string
    data?: any
    response?: any
    error?: any
    duration: number
  }> = []

  static async logOperation<T>(operation: string, table: string, data: any, apiCall: () => Promise<T>): Promise<T> {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    console.group(`🔍 Supabase ${operation} - ${table}`)
    console.log("📤 Request Data:", data)
    console.log("⏰ Started at:", timestamp)

    try {
      const result = await apiCall()
      const duration = Date.now() - startTime

      console.log("📥 Response:", result)
      console.log(`⚡ Duration: ${duration}ms`)
      console.log("✅ Success")

      this.logs.push({
        timestamp,
        operation,
        table,
        data,
        response: result,
        duration,
      })

      console.groupEnd()
      return result
    } catch (error: any) {
      const duration = Date.now() - startTime

      console.error("❌ Error:", error)
      console.log(`⚡ Duration: ${duration}ms`)
      console.log("🔍 Error Details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })

      this.logs.push({
        timestamp,
        operation,
        table,
        data,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        duration,
      })

      console.groupEnd()
      throw error
    }
  }

  static getLogs() {
    return this.logs
  }

  static clearLogs() {
    this.logs = []
  }

  static printSummary() {
    console.group("📊 Supabase Operations Summary")
    console.log(`Total operations: ${this.logs.length}`)

    const successful = this.logs.filter((log) => !log.error).length
    const failed = this.logs.filter((log) => log.error).length

    console.log(`✅ Successful: ${successful}`)
    console.log(`❌ Failed: ${failed}`)

    if (failed > 0) {
      console.log("\n🚨 Failed Operations:")
      this.logs
        .filter((log) => log.error)
        .forEach((log) => {
          console.log(`- ${log.operation} on ${log.table}: ${log.error.message}`)
        })
    }

    console.groupEnd()
  }
}

// Network monitoring utility
export class NetworkMonitor {
  static async testConnection(): Promise<{
    isOnline: boolean
    supabaseReachable: boolean
    latency: number
    error?: string
  }> {
    const startTime = Date.now()

    try {
      // Test basic internet connectivity
      const isOnline = navigator.onLine

      if (!isOnline) {
        return {
          isOnline: false,
          supabaseReachable: false,
          latency: 0,
          error: "No internet connection",
        }
      }

      // Test Supabase connectivity
      if (!supabase) {
        return {
          isOnline: true,
          supabaseReachable: false,
          latency: 0,
          error: "Supabase client not initialized",
        }
      }

      // Simple ping to Supabase
      const { error } = await supabase.from("clients").select("count(*)").limit(1)

      const latency = Date.now() - startTime

      if (error) {
        return {
          isOnline: true,
          supabaseReachable: false,
          latency,
          error: error.message,
        }
      }

      return {
        isOnline: true,
        supabaseReachable: true,
        latency,
      }
    } catch (error: any) {
      return {
        isOnline: navigator.onLine,
        supabaseReachable: false,
        latency: Date.now() - startTime,
        error: error.message,
      }
    }
  }
}

// Data validation utility
export class DataValidator {
  static validateClient(client: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Required fields
    if (!client.first_name?.trim()) errors.push("first_name is required")
    if (!client.last_name?.trim()) errors.push("last_name is required")
    if (!client.participant_id?.trim()) errors.push("participant_id is required")
    if (!client.program?.trim()) errors.push("program is required")
    if (!client.status?.trim()) errors.push("status is required")

    // Email validation
    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      errors.push("Invalid email format")
    }

    // Phone validation
    if (client.phone && !/^[\d\s\-()]+$/.test(client.phone)) {
      errors.push("Invalid phone format")
    }

    // Date validation
    if (client.date_of_birth && isNaN(Date.parse(client.date_of_birth))) {
      errors.push("Invalid date_of_birth format")
    }

    if (client.enrollment_date && isNaN(Date.parse(client.enrollment_date))) {
      errors.push("Invalid enrollment_date format")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateCaseNote(caseNote: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!caseNote.client_id?.trim()) errors.push("client_id is required")
    if (!caseNote.note?.trim()) errors.push("note is required")
    if (!caseNote.author?.trim()) errors.push("author is required")

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Make utilities available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).SupabaseDebugger = SupabaseDebugger
  ;(window as any).NetworkMonitor = NetworkMonitor
  ;(window as any).DataValidator = DataValidator
}
