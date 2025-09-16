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
      status.errors.push("Supabase not configured - check environment variables")
      return status
    }

    // Check database connection
    try {
      const { data, error } = await supabase.from("clients").select("count", { count: "exact", head: true })
      if (!error) {
        status.database = true
        status.tables = true
      } else {
        status.errors.push(`Database error: ${error.message}`)
      }
    } catch (error: any) {
      status.errors.push(`Database connection failed: ${error.message}`)
    }

    // Check storage bucket
    try {
      const { data, error } = await supabase.storage.listBuckets()
      if (!error && data) {
        const clientFilesBucket = data.find((bucket) => bucket.id === "client-files")
        if (clientFilesBucket) {
          status.storage = true
        } else {
          status.errors.push("Storage bucket 'client-files' not found")
        }
      } else {
        status.errors.push(`Storage error: ${error?.message || "Unknown storage error"}`)
      }
    } catch (error: any) {
      status.errors.push(`Storage check failed: ${error.message}`)
    }

    // Check for sample data
    if (status.tables) {
      try {
        const { data, error } = await supabase.from("clients").select("id").limit(1)
        if (!error && data && data.length > 0) {
          status.sampleData = true
        }
      } catch (error: any) {
        // Sample data check is optional, don't add to errors
      }
    }

    // Check RLS policies (basic check)
    if (status.tables) {
      try {
        // Try to insert and immediately delete a test record
        const testClient = {
          first_name: "Test",
          last_name: "Setup",
          participant_id: `SETUP-TEST-${Date.now()}`,
          program: "Test",
          status: "Active",
          enrollment_date: new Date().toISOString().split("T")[0],
          phone: "000-000-0000",
          email: "test@setup.com",
          address: "Test Address",
          city: "Test City",
          state: "TS",
          zip_code: "00000",
          date_of_birth: "1990-01-01",
          case_manager: "Test Manager",
        }

        const { data, error } = await supabase.from("clients").insert([testClient]).select().single()

        if (!error && data) {
          // Clean up test record
          await supabase.from("clients").delete().eq("id", data.id)
          status.policies = true
        } else {
          status.errors.push(`RLS policy error: ${error?.message || "Policy check failed"}`)
        }
      } catch (error: any) {
        status.errors.push(`Policy check failed: ${error.message}`)
      }
    }
  } catch (error: any) {
    status.errors.push(`Setup check failed: ${error.message}`)
  }

  return status
}

export function getSetupInstructions(status: SetupStatus): string[] {
  const instructions: string[] = []

  if (!status.configured) {
    instructions.push("1. Create a Supabase project at https://supabase.com")
    instructions.push("2. Copy your project URL and anon key to .env.local")
    instructions.push("3. Restart your development server")
  }

  if (status.configured && !status.tables) {
    instructions.push("1. Go to your Supabase SQL Editor")
    instructions.push("2. Run the complete setup script from scripts/complete-setup.sql")
    instructions.push("3. Verify all tables were created successfully")
  }

  if (status.configured && !status.storage) {
    instructions.push("1. Enable Storage in your Supabase dashboard")
    instructions.push("2. Create a bucket named 'client-files'")
    instructions.push("3. Set the bucket to public access")
  }

  if (status.configured && !status.policies) {
    instructions.push("1. Check RLS policies in your Supabase dashboard")
    instructions.push("2. Ensure policies allow read/write access")
    instructions.push("3. Consider disabling RLS for development")
  }

  if (instructions.length === 0) {
    instructions.push("✅ Setup is complete! All systems are working correctly.")
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
  ;(window as any).runSetupDiagnostics = runSetupDiagnostics(window as any).checkSetupStatus = checkSetupStatus
}
