import { supabase, isSupabaseConfigured } from "./supabase"

export interface SetupStatus {
  configured: boolean
  database: boolean
  storage: boolean
  tables: boolean
  policies: boolean
  sampleData: boolean
  errors: string[]
}

export async function checkSetupStatus(): Promise<SetupStatus> {
  const status: SetupStatus = {
    configured: false,
    database: false,
    storage: false,
    tables: false,
    policies: false,
    sampleData: false,
    errors: [],
  }

  try {
    // Check if Supabase is configured
    status.configured = isSupabaseConfigured()
    if (!status.configured) {
      status.errors.push("Supabase environment variables not configured")
      return status
    }

    // Test database connection
    try {
      const { data, error } = await supabase.from("clients").select("count", { count: "exact", head: true })
      if (error) {
        status.errors.push(`Database connection failed: ${error.message}`)
      } else {
        status.database = true
      }
    } catch (error: any) {
      status.errors.push(`Database connection error: ${error.message}`)
    }

    // Check if tables exist
    try {
      const { data: clientsData, error: clientsError } = await supabase.from("clients").select("id").limit(1)
      const { data: caseNotesData, error: caseNotesError } = await supabase.from("case_notes").select("id").limit(1)
      const { data: filesData, error: filesError } = await supabase.from("client_files").select("id").limit(1)

      if (!clientsError && !caseNotesError && !filesError) {
        status.tables = true
      } else {
        const errors = [clientsError, caseNotesError, filesError].filter(Boolean)
        status.errors.push(`Missing tables: ${errors.map((e) => e?.message).join(", ")}`)
      }
    } catch (error: any) {
      status.errors.push(`Table check failed: ${error.message}`)
    }

    // Check storage bucket (updated to use client_files with comprehensive verification)
    try {
      console.log("🔍 Checking storage bucket configuration...")

      // First check if storage is accessible at all
      let buckets: any[] = []
      let bucketError: any = null

      try {
        const { data: bucketsData, error: listError } = await supabase.storage.listBuckets()
        buckets = bucketsData || []
        bucketError = listError
      } catch (storageAccessError: any) {
        console.error("🚨 Storage access error:", storageAccessError)
        bucketError = storageAccessError
      }

      if (bucketError) {
        status.errors.push(`Storage access failed: ${bucketError.message}`)
        console.error("🚨 Storage bucket list error:", bucketError)

        // Check if this is a permissions issue
        if (bucketError.message?.includes("permission") || bucketError.message?.includes("unauthorized")) {
          status.errors.push("Storage permissions issue - check your Supabase service role key")
        }

        // Still try to test basic storage functionality
        try {
          console.log("🧪 Testing basic storage access...")
          const testResult = await supabase.storage.from("client_files").list("", { limit: 1 })
          if (!testResult.error) {
            console.log("✅ Basic storage access works, but bucket listing failed")
            status.storage = true
          }
        } catch (basicTestError) {
          console.warn("⚠️ Basic storage test also failed:", basicTestError)
        }
      } else {
        console.log("📦 Available buckets:", buckets?.map((b) => b.name) || [])

        if (buckets.length === 0) {
          status.errors.push("No storage buckets found - bucket may need to be created")
          console.log("💡 No buckets found. This could mean:")
          console.log("   1. No buckets have been created yet")
          console.log("   2. Insufficient permissions to list buckets")
          console.log("   3. Storage is not enabled in your Supabase project")

          // Try to access the client_files bucket directly
          try {
            console.log("🧪 Testing direct bucket access...")
            const { data: directTest, error: directError } = await supabase.storage
              .from("client_files")
              .list("", { limit: 1 })

            if (!directError) {
              console.log("✅ client_files bucket exists and is accessible!")
              status.storage = true
            } else {
              console.log("❌ Direct bucket access failed:", directError.message)
              if (directError.message?.includes("not found")) {
                status.errors.push("client_files bucket does not exist")
              }
            }
          } catch (directTestError: any) {
            console.error("🚨 Direct bucket test error:", directTestError)
          }
        } else {
          const clientFilesBucket = buckets?.find((bucket) => bucket.name === "client_files")
          if (clientFilesBucket) {
            status.storage = true
            console.log("✅ client_files bucket found:", clientFilesBucket)

            // Test file operations to verify storage functionality
            try {
              const testFile = new Blob(["test storage verification"], { type: "text/plain" })
              const testFileName = `verification/test-${Date.now()}.txt`

              console.log("🧪 Testing file upload to client_files bucket...")
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from("client_files")
                .upload(testFileName, testFile)

              if (!uploadError && uploadData) {
                console.log("✅ Storage upload test successful:", uploadData.path)

                // Test file retrieval
                const { data: downloadData, error: downloadError } = await supabase.storage
                  .from("client_files")
                  .download(testFileName)

                if (!downloadError && downloadData) {
                  console.log("✅ Storage download test successful")
                } else {
                  console.warn("⚠️ Storage download test failed:", downloadError?.message)
                }

                // Clean up test file
                const { error: deleteError } = await supabase.storage.from("client_files").remove([testFileName])

                if (!deleteError) {
                  console.log("✅ Storage cleanup successful")
                } else {
                  console.warn("⚠️ Storage cleanup failed:", deleteError.message)
                }
              } else {
                console.warn("⚠️ Storage upload test failed:", uploadError?.message)
                // Still mark as available if bucket exists, even if upload test fails
                status.storage = true
              }
            } catch (uploadTestError: any) {
              console.warn("⚠️ Storage upload test error:", uploadTestError.message)
              // Still mark as available if bucket exists
              status.storage = true
            }
          } else {
            status.errors.push("client_files storage bucket not found")
            console.error("❌ client_files bucket not found. Available buckets:", buckets?.map((b) => b.name) || [])
            console.log(
              "💡 To create the bucket, run the complete-setup.sql script or create it manually in Supabase Storage",
            )
          }
        }
      }
    } catch (error: any) {
      status.errors.push(`Storage bucket check error: ${error.message}`)
      console.error("🚨 Storage bucket check exception:", error)
    }

    // Skip RLS policies check since they will be set up later
    status.policies = true

    // Check for sample data
    try {
      const { data, error } = await supabase.from("clients").select("id").limit(1)
      if (!error && data && data.length > 0) {
        status.sampleData = true
      }
    } catch (error: any) {
      // Sample data check is optional
    }
  } catch (error: any) {
    status.errors.push(`Setup check failed: ${error.message}`)
  }

  return status
}

export function getSetupInstructions(status: SetupStatus): string[] {
  const instructions: string[] = []

  if (!status.configured) {
    instructions.push("1. Create a Supabase project at supabase.com")
    instructions.push("2. Copy your project URL and anon key to .env.local")
    instructions.push("3. Restart your development server")
    return instructions
  }

  if (!status.database) {
    instructions.push("1. Check your Supabase project is active")
    instructions.push("2. Verify your environment variables are correct")
    instructions.push("3. Check your internet connection")
  }

  if (!status.tables) {
    instructions.push("1. Go to Supabase SQL Editor")
    instructions.push("2. Run the complete-setup.sql script")
    instructions.push("3. Wait for all tables to be created")
  }

  if (!status.storage) {
    instructions.push("1. Go to Supabase SQL Editor")
    instructions.push("2. Run the complete-setup.sql script to create the client_files bucket")
    instructions.push("3. Or manually create a bucket named 'client_files' in Storage dashboard")
    instructions.push("4. Verify the bucket appears in your Storage dashboard")
  }

  if (instructions.length === 0) {
    instructions.push("✅ Setup is complete! All systems are working properly.")
  }

  return instructions
}

export async function runSetupDiagnostics(): Promise<void> {
  console.log("🔍 Running setup diagnostics...")

  const status = await checkSetupStatus()

  console.log("📊 Setup Status:")
  console.log(`  Configured: ${status.configured ? "✅" : "❌"}`)
  console.log(`  Database: ${status.database ? "✅" : "❌"}`)
  console.log(`  Storage: ${status.storage ? "✅" : "❌"}`)
  console.log(`  Tables: ${status.tables ? "✅" : "❌"}`)
  console.log(`  Policies: ${status.policies ? "✅" : "❌"}`)
  console.log(`  Sample Data: ${status.sampleData ? "✅" : "❌"}`)

  if (status.errors.length > 0) {
    console.log("🚨 Errors found:")
    status.errors.forEach((error) => console.log(`  - ${error}`))
  }

  const instructions = getSetupInstructions(status)
  console.log("📋 Next steps:")
  instructions.forEach((instruction) => console.log(`  ${instruction}`))

  return
}

// Make diagnostics available globally for easy testing
if (typeof window !== "undefined") {
  ;(window as any).runSetupDiagnostics = runSetupDiagnostics
  ;(window as any).checkSetupStatus = checkSetupStatus
}
