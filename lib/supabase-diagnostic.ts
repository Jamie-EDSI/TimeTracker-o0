import { supabase, clientsApi, caseNotesApi } from "./supabase-client-api"

interface DiagnosticResult {
  test: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: any
}

class SupabaseDiagnostic {
  private results: DiagnosticResult[] = []

  private addResult(test: string, status: "pass" | "fail" | "warning", message: string, details?: any) {
    this.results.push({ test, status, message, details })
  }

  async runAllTests(): Promise<DiagnosticResult[]> {
    this.results = []

    console.log("🔍 Starting Supabase diagnostic tests...")

    await this.testConnection()
    await this.testEnvironmentVariables()
    await this.testDatabaseSchema()
    await this.testSoftDeleteSupport()
    await this.testCRUDOperations()
    await this.testCaseNotes()

    this.printResults()
    return this.results
  }

  private async testConnection() {
    try {
      const { data, error } = await supabase.from("clients").select("count").limit(1)

      if (error) {
        this.addResult("Connection", "fail", `Failed to connect to Supabase: ${error.message}`, error)
      } else {
        this.addResult("Connection", "pass", "Successfully connected to Supabase database")
      }
    } catch (error) {
      this.addResult("Connection", "fail", `Connection test failed: ${error}`, error)
    }
  }

  private async testEnvironmentVariables() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      this.addResult("Environment", "fail", "NEXT_PUBLIC_SUPABASE_URL is not set")
    } else if (!supabaseUrl.startsWith("https://")) {
      this.addResult("Environment", "warning", "NEXT_PUBLIC_SUPABASE_URL should start with https://")
    } else {
      this.addResult("Environment", "pass", "NEXT_PUBLIC_SUPABASE_URL is properly configured")
    }

    if (!supabaseKey) {
      this.addResult("Environment", "fail", "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
    } else if (supabaseKey.length < 100) {
      this.addResult("Environment", "warning", "NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short")
    } else {
      this.addResult("Environment", "pass", "NEXT_PUBLIC_SUPABASE_ANON_KEY is properly configured")
    }
  }

  private async testDatabaseSchema() {
    try {
      // Test clients table
      const { data: clientsData, error: clientsError } = await supabase.from("clients").select("*").limit(1)

      if (clientsError) {
        this.addResult("Schema", "fail", `Clients table error: ${clientsError.message}`, clientsError)
        return
      } else {
        this.addResult("Schema", "pass", "Clients table is accessible")
      }

      // Test case_notes table
      const { data: caseNotesData, error: caseNotesError } = await supabase.from("case_notes").select("*").limit(1)

      if (caseNotesError) {
        this.addResult("Schema", "warning", `Case notes table error: ${caseNotesError.message}`, caseNotesError)
      } else {
        this.addResult("Schema", "pass", "Case notes table is accessible")
      }
    } catch (error) {
      this.addResult("Schema", "fail", `Schema test failed: ${error}`, error)
    }
  }

  private async testSoftDeleteSupport() {
    try {
      const isAvailable = await clientsApi.isSoftDeleteAvailable()

      if (isAvailable) {
        this.addResult("Soft Delete", "pass", "Soft delete functionality is available")

        // Test soft delete views
        const { data: activeData, error: activeError } = await supabase.from("active_clients").select("count").limit(1)

        if (activeError) {
          this.addResult("Soft Delete", "warning", "Active clients view not available", activeError)
        } else {
          this.addResult("Soft Delete", "pass", "Active clients view is working")
        }

        const { data: deletedData, error: deletedError } = await supabase
          .from("deleted_clients")
          .select("count")
          .limit(1)

        if (deletedError) {
          this.addResult("Soft Delete", "warning", "Deleted clients view not available", deletedError)
        } else {
          this.addResult("Soft Delete", "pass", "Deleted clients view is working")
        }
      } else {
        this.addResult(
          "Soft Delete",
          "warning",
          "Soft delete functionality not available - run migration script to enable",
        )
      }
    } catch (error) {
      this.addResult("Soft Delete", "fail", `Soft delete test failed: ${error}`, error)
    }
  }

  private async testCRUDOperations() {
    try {
      // Test CREATE
      const testClient = {
        first_name: "Test",
        last_name: "Client",
        pid: `TEST_${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        phone: "555-0123",
        program: "TEST_PROGRAM",
        status: "Active",
      }

      const createdClient = await clientsApi.create(testClient)
      this.addResult("CRUD", "pass", "CREATE operation successful", { id: createdClient.id })

      // Test READ
      const fetchedClient = await clientsApi.getById(createdClient.id)
      if (fetchedClient) {
        this.addResult("CRUD", "pass", "READ operation successful")
      } else {
        this.addResult("CRUD", "fail", "READ operation failed - client not found")
      }

      // Test UPDATE
      const updatedClient = await clientsApi.update(createdClient.id, {
        first_name: "Updated Test",
      })
      if (updatedClient.first_name === "Updated Test") {
        this.addResult("CRUD", "pass", "UPDATE operation successful")
      } else {
        this.addResult("CRUD", "fail", "UPDATE operation failed")
      }

      // Test SOFT DELETE (if available)
      const softDeleteAvailable = await clientsApi.isSoftDeleteAvailable()
      if (softDeleteAvailable) {
        const softDeleted = await clientsApi.softDelete(createdClient.id, "diagnostic_test")
        if (softDeleted) {
          this.addResult("CRUD", "pass", "SOFT DELETE operation successful")

          // Test RESTORE
          const restored = await clientsApi.restore(createdClient.id)
          if (restored) {
            this.addResult("CRUD", "pass", "RESTORE operation successful")
          } else {
            this.addResult("CRUD", "fail", "RESTORE operation failed")
          }
        } else {
          this.addResult("CRUD", "fail", "SOFT DELETE operation failed")
        }
      }

      // Test HARD DELETE (cleanup)
      const hardDeleted = await clientsApi.hardDelete(createdClient.id)
      if (hardDeleted) {
        this.addResult("CRUD", "pass", "HARD DELETE operation successful (cleanup)")
      } else {
        this.addResult("CRUD", "warning", "HARD DELETE operation failed (cleanup)")
      }
    } catch (error) {
      this.addResult("CRUD", "fail", `CRUD operations test failed: ${error}`, error)
    }
  }

  private async testCaseNotes() {
    try {
      // Create a test client first
      const testClient = {
        first_name: "Case Note",
        last_name: "Test",
        pid: `CASE_TEST_${Date.now()}`,
        email: `casetest${Date.now()}@example.com`,
        phone: "555-0124",
        program: "TEST_PROGRAM",
        status: "Active",
      }

      const createdClient = await clientsApi.create(testClient)

      // Test case note creation
      const testCaseNote = {
        client_id: createdClient.id,
        note: "This is a test case note",
        author: "Diagnostic Test",
      }

      const createdCaseNote = await caseNotesApi.create(testCaseNote)
      this.addResult("Case Notes", "pass", "Case note CREATE operation successful")

      // Test case note retrieval
      const caseNotes = await caseNotesApi.getByClientId(createdClient.id)
      if (caseNotes.length > 0) {
        this.addResult("Case Notes", "pass", "Case note READ operation successful")
      } else {
        this.addResult("Case Notes", "fail", "Case note READ operation failed")
      }

      // Test case note update
      const updatedCaseNote = await caseNotesApi.update(createdCaseNote.id, {
        note: "Updated test case note",
      })
      if (updatedCaseNote.note === "Updated test case note") {
        this.addResult("Case Notes", "pass", "Case note UPDATE operation successful")
      } else {
        this.addResult("Case Notes", "fail", "Case note UPDATE operation failed")
      }

      // Test case note deletion
      const deletedCaseNote = await caseNotesApi.delete(createdCaseNote.id)
      if (deletedCaseNote) {
        this.addResult("Case Notes", "pass", "Case note DELETE operation successful")
      } else {
        this.addResult("Case Notes", "fail", "Case note DELETE operation failed")
      }

      // Cleanup test client
      await clientsApi.hardDelete(createdClient.id)
    } catch (error) {
      this.addResult("Case Notes", "fail", `Case notes test failed: ${error}`, error)
    }
  }

  private printResults() {
    console.log("\n📊 Supabase Diagnostic Results:")
    console.log("================================")

    const passed = this.results.filter((r) => r.status === "pass").length
    const failed = this.results.filter((r) => r.status === "fail").length
    const warnings = this.results.filter((r) => r.status === "warning").length

    this.results.forEach((result) => {
      const icon = result.status === "pass" ? "✅" : result.status === "fail" ? "❌" : "⚠️"
      console.log(`${icon} ${result.test}: ${result.message}`)
      if (result.details && result.status === "fail") {
        console.log(`   Details:`, result.details)
      }
    })

    console.log("\n📈 Summary:")
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`📊 Total: ${this.results.length}`)

    if (failed === 0) {
      console.log("\n🎉 All critical tests passed! Your Supabase integration is working correctly.")
    } else {
      console.log("\n🔧 Some tests failed. Please check the errors above and fix the issues.")
    }

    if (warnings > 0) {
      console.log("💡 Consider addressing the warnings to improve functionality.")
    }
  }

  getResults(): DiagnosticResult[] {
    return this.results
  }
}

// Global functions for browser console testing
export const runSupabaseDiagnostic = async () => {
  const diagnostic = new SupabaseDiagnostic()
  return await diagnostic.runAllTests()
}

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("clients").select("count").limit(1)
    if (error) {
      console.error("❌ Connection failed:", error.message)
      return false
    } else {
      console.log("✅ Connection successful!")
      return true
    }
  } catch (error) {
    console.error("❌ Connection test failed:", error)
    return false
  }
}

export const checkEnvironment = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("🔍 Environment Variables Check:")
  console.log("NEXT_PUBLIC_SUPABASE_URL:", url ? "✅ Set" : "❌ Missing")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", key ? "✅ Set" : "❌ Missing")

  if (url && key) {
    console.log("✅ All environment variables are configured")
    return true
  } else {
    console.log("❌ Missing required environment variables")
    return false
  }
}

export const testCRUD = async () => {
  console.log("🧪 Testing CRUD operations...")

  try {
    // Create
    const testClient = {
      first_name: "CRUD",
      last_name: "Test",
      pid: `CRUD_${Date.now()}`,
      email: `crud${Date.now()}@test.com`,
      phone: "555-CRUD",
      program: "TEST",
      status: "Active",
    }

    const created = await clientsApi.create(testClient)
    console.log("✅ CREATE:", created.id)

    // Read
    const read = await clientsApi.getById(created.id)
    console.log("✅ READ:", read ? "Success" : "Failed")

    // Update
    const updated = await clientsApi.update(created.id, { first_name: "Updated CRUD" })
    console.log("✅ UPDATE:", updated.first_name)

    // Delete
    const deleted = await clientsApi.hardDelete(created.id)
    console.log("✅ DELETE:", deleted ? "Success" : "Failed")

    console.log("🎉 All CRUD operations completed successfully!")
  } catch (error) {
    console.error("❌ CRUD test failed:", error)
  }
}

// Export the diagnostic class for advanced usage
export { SupabaseDiagnostic }
export { supabase, clientsApi, caseNotesApi }
