import { createClient } from "@supabase/supabase-js"
import { SupabaseDebugger, DataValidator } from "./supabase-debug"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("🔧 Supabase Configuration Check:")
console.log("URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
console.log("Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing")

const hasValidConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseAnonKey.includes("your_supabase")

let supabase: any = null
let configError: string | null = null
let databaseReady = false

if (hasValidConfig) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client created successfully")
  } catch (error: any) {
    console.error("❌ Failed to create Supabase client:", error)
    configError = `Supabase client creation failed: ${error?.message || "Unknown error"}`
  }
} else {
  configError = "Invalid Supabase configuration"
  console.log("⚠️ Using demo mode - Supabase not configured properly")
}

export { supabase }

export interface Client {
  id: string
  first_name: string
  last_name: string
  participant_id: string
  program: string
  status: string
  enrollment_date: string
  phone: string
  cell_phone?: string
  email: string
  address: string
  city: string
  state: string
  zip_code: string
  date_of_birth: string
  emergency_contact?: string
  emergency_phone?: string
  case_manager: string
  responsible_ec?: string
  required_hours?: number
  cao_number?: string
  education_level?: string
  graduation_year?: number
  school_name?: string
  field_of_study?: string
  education_notes?: string
  currently_enrolled?: string
  gpa?: number
  certifications?: string
  licenses?: string
  industry_certifications?: string
  certification_status?: string
  certification_notes?: string
  created_at?: string
  last_contact?: string
  last_modified?: string
  modified_by?: string
  deleted_at?: string
  deleted_by?: string
}

export interface CaseNote {
  id: string
  client_id: string
  note: string
  created_at: string
  author: string
  deleted_at?: string
  deleted_by?: string
}

export interface ClientFile {
  id: string
  client_id: string
  file_name: string
  file_size: number
  file_type: string
  file_category: "certification" | "education" | "general"
  storage_path: string
  public_url?: string
  upload_date: string
  uploaded_by: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  deleted_by?: string
}

const mockClients: Client[] = [
  {
    id: "1",
    first_name: "Sarah",
    last_name: "Johnson",
    participant_id: "2965145",
    program: "EARN",
    status: "Active",
    enrollment_date: "2023-02-20",
    phone: "484-555-0201",
    cell_phone: "484-555-0202",
    email: "sarah.johnson@email.com",
    address: "456 Oak Ave",
    city: "Philadelphia",
    state: "PA",
    zip_code: "19102",
    date_of_birth: "1990-07-15",
    emergency_contact: "Mike Johnson",
    emergency_phone: "484-555-0203",
    case_manager: "Brown, Lisa",
    responsible_ec: "Wilson, John",
    required_hours: 40,
    cao_number: "CAO-001",
    education_level: "High School Diploma/GED",
    graduation_year: 2008,
    school_name: "Philadelphia High School",
    field_of_study: "General Studies",
    education_notes: "Graduated with honors",
    currently_enrolled: "No",
    gpa: 3.5,
    certifications: "CPR Certified",
    licenses: "Driver's License",
    industry_certifications: "OSHA 10",
    certification_status: "Current",
    certification_notes: "All certifications up to date",
    created_at: "2023-02-20T10:00:00Z",
    last_contact: "2023-12-15",
    last_modified: "2023-12-15T15:30:00Z",
    modified_by: "Brown, Lisa",
  },
  {
    id: "2",
    first_name: "Michael",
    last_name: "Davis",
    participant_id: "2965146",
    program: "Job Readiness",
    status: "Active",
    enrollment_date: "2023-03-15",
    phone: "215-555-0102",
    email: "michael.davis@email.com",
    address: "789 Pine St",
    city: "Philadelphia",
    state: "PA",
    zip_code: "19103",
    date_of_birth: "1985-12-03",
    emergency_contact: "Jennifer Davis",
    emergency_phone: "215-555-0104",
    case_manager: "Smith, John",
    created_at: "2023-03-15T09:00:00Z",
    last_modified: "2023-12-10T14:20:00Z",
    modified_by: "Smith, John",
  },
  {
    id: "3",
    first_name: "Emily",
    last_name: "Rodriguez",
    participant_id: "2965147",
    program: "YOUTH",
    status: "Pending",
    enrollment_date: "2023-04-01",
    phone: "267-555-0301",
    email: "emily.rodriguez@email.com",
    address: "321 Maple Dr",
    city: "Philadelphia",
    state: "PA",
    zip_code: "19104",
    date_of_birth: "2001-09-22",
    emergency_contact: "Carlos Rodriguez",
    emergency_phone: "267-555-0302",
    case_manager: "Johnson, Mary",
    created_at: "2023-04-01T11:00:00Z",
    last_modified: "2023-12-05T16:45:00Z",
    modified_by: "Johnson, Mary",
  },
]

const mockCaseNotes: CaseNote[] = [
  {
    id: "1",
    client_id: "1",
    note: "Initial assessment completed. Client shows strong motivation for job placement.",
    created_at: "2023-02-20T10:30:00Z",
    author: "Brown, Lisa",
  },
  {
    id: "2",
    client_id: "1",
    note: "Enrolled in Job Readiness program. Scheduled for skills assessment next week.",
    created_at: "2023-03-01T14:00:00Z",
    author: "Brown, Lisa",
  },
  {
    id: "3",
    client_id: "2",
    note: "Client completed job readiness workshop. Showing excellent progress in interview skills.",
    created_at: "2023-03-20T11:15:00Z",
    author: "Smith, John",
  },
]

const mockClientFiles: ClientFile[] = [
  {
    id: "file-1",
    client_id: "1",
    file_name: "CPR_Certificate.pdf",
    file_size: 245760,
    file_type: "application/pdf",
    file_category: "certification",
    storage_path: "client-files/1/CPR_Certificate.pdf",
    public_url: "/placeholder.svg?height=400&width=600&text=CPR+Certificate",
    upload_date: "2023-02-20T11:00:00Z",
    uploaded_by: "Brown, Lisa",
    description: "CPR Certification from American Red Cross",
    is_active: true,
    created_at: "2023-02-20T11:00:00Z",
    updated_at: "2023-02-20T11:00:00Z",
  },
]

const simulateDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const cleanDataForSupabase = (data: any) => {
  const cleaned = { ...data }
  const optionalFields = [
    "cell_phone",
    "emergency_contact",
    "emergency_phone",
    "responsible_ec",
    "cao_number",
    "education_level",
    "school_name",
    "field_of_study",
    "education_notes",
    "currently_enrolled",
    "certifications",
    "licenses",
    "industry_certifications",
    "certification_status",
    "certification_notes",
    "last_contact",
    "modified_by",
  ]

  optionalFields.forEach((field) => {
    if (cleaned[field] === "") cleaned[field] = null
  })

  if (cleaned.required_hours === "" || cleaned.required_hours === undefined) {
    cleaned.required_hours = null
  } else if (typeof cleaned.required_hours === "string") {
    const parsed = Number.parseInt(cleaned.required_hours)
    cleaned.required_hours = isNaN(parsed) ? null : parsed
  }

  if (cleaned.graduation_year === "" || cleaned.graduation_year === undefined) {
    cleaned.graduation_year = null
  } else if (typeof cleaned.graduation_year === "string") {
    const parsed = Number.parseInt(cleaned.graduation_year)
    cleaned.graduation_year = isNaN(parsed) ? null : parsed
  }

  if (cleaned.gpa === "" || cleaned.gpa === undefined) {
    cleaned.gpa = null
  } else if (typeof cleaned.gpa === "string") {
    const parsed = Number.parseFloat(cleaned.gpa)
    cleaned.gpa = isNaN(parsed) ? null : parsed
  }

  cleaned.last_modified = new Date().toISOString()
  return cleaned
}

export const isSupabaseConfigured = () => hasValidConfig && !configError

export const getSupabaseStatus = (): "connected" | "setup_required" | "not_configured" | "error" => {
  if (!hasValidConfig || configError) return "not_configured"
  if (!databaseReady) return "setup_required"
  return "connected"
}

export const getConfigError = () => configError
export const isDatabaseReady = () => databaseReady

function extractErrorMessage(error: any): string {
  if (!error) return "Unknown error (null/undefined)"

  // Try common error properties
  if (typeof error === "string") return error
  if (error.message && error.message !== "") return error.message
  if (error.msg) return error.msg
  if (error.error && typeof error.error === "string") return error.error
  if (error.error?.message) return error.error.message
  if (error.hint && error.hint !== "") return error.hint
  if (error.details && error.details !== "") return error.details

  // Check for common error patterns
  if (error.code === "PGRST116" || error.statusCode === 406) {
    return "Row Level Security policy violation - anonymous access blocked"
  }
  if (error.code === "42501") {
    return "Insufficient privileges - check RLS policies"
  }

  // Try nested properties
  if (error.response?.message) return error.response.message

  // If we have a code but no message, it might be an RLS issue
  if ((error.code || error.statusCode) && (!error.message || error.message === "")) {
    return `Database access denied (code: ${error.code || error.statusCode}). This may be due to Row Level Security policies.`
  }

  // Try to stringify
  try {
    const str = JSON.stringify(error)
    if (str && str !== "{}" && str !== "null" && str !== '{"message":""}') {
      return str
    }
  } catch (e) {
    // Ignore stringify errors
  }

  // If we got here and message is empty, it's likely RLS
  if (error.message === "" || Object.keys(error).length === 0) {
    return "Database access blocked - Row Level Security may be preventing anonymous queries"
  }

  // Last resort
  return String(error)
}

async function checkDatabaseSetup(): Promise<boolean> {
  if (!supabase || configError) {
    console.log("⚠️ Skipping database check - no valid configuration")
    databaseReady = false
    return false
  }

  try {
    console.log("🔍 Checking database setup...")
    console.log("   Testing connection to:", supabaseUrl.substring(0, 30) + "...")

    const { count, error } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })

    console.log("[v0] Database check response:", { count, error })

    if (error) {
      const errorMsg = extractErrorMessage(error)
      const errorCode = error?.code || error?.error_code || ""
      const statusCode = String(error?.status || error?.statusCode || "")

      console.error("❌ Database check failed")
      console.error("   Error message:", errorMsg)
      console.error("   Error code:", errorCode || "none")
      console.error("   Status code:", statusCode || "none")
      console.error("   Raw error:", JSON.stringify(error))

      const errorLower = errorMsg.toLowerCase()
      if (
        errorMsg.includes("Row Level Security") ||
        errorMsg.includes("RLS") ||
        errorMsg.includes("access blocked") ||
        errorMsg.includes("access denied") ||
        errorCode === "PGRST116" ||
        errorCode === "42501" ||
        statusCode === "406" ||
        (errorMsg === "" && error.code)
      ) {
        console.warn("⚠️ RLS may be blocking access - using demo mode")
        console.warn("   The database exists but Row Level Security policies may prevent anonymous access")
        databaseReady = false
        configError = null // Don't show as error, just not ready
        return false
      }

      // Check for authentication errors
      if (
        errorLower.includes("invalid api key") ||
        errorLower.includes("jwt") ||
        errorLower.includes("401") ||
        errorLower.includes("unauthorized") ||
        errorCode === "PGRST301" ||
        statusCode === "401"
      ) {
        console.error("❌ Authentication failed - invalid API key")
        configError = "Invalid Supabase API key. Please check your credentials in .env.local"
        databaseReady = false
        return false
      }

      // Check if tables don't exist
      if (
        errorLower.includes("does not exist") ||
        errorLower.includes("relation") ||
        errorCode === "42P01" ||
        errorCode === "PGRST204"
      ) {
        console.log("⚠️ Database tables not found - setup required")
        databaseReady = false
        configError = null
        return false
      }

      // Generic error
      console.error("❌ Database error:", errorMsg)
      configError = null // Don't block, just use demo mode
      databaseReady = false
      return false
    }

    console.log("✅ Database is ready")
    console.log("   Found", count, "clients")
    databaseReady = true
    configError = null
    return true
  } catch (error: any) {
    const errorMsg = extractErrorMessage(error)
    console.error("🚨 Exception during database check:", errorMsg)
    console.error("   Raw exception:", error)

    if (errorMsg.toLowerCase().includes("fetch") || errorMsg.toLowerCase().includes("network")) {
      configError = "Network error - check your internet connection"
    } else if (errorMsg.toLowerCase().includes("jwt") || errorMsg.includes("401")) {
      configError = "Invalid API key - please check your .env.local"
    } else {
      configError = null // Don't block on exceptions, use demo mode
    }

    databaseReady = false
    return false
  }
}

export async function testSupabaseConnection() {
  try {
    console.log("🧪 Testing Supabase connection...")

    if (!supabase) {
      return {
        success: false,
        error: "Supabase client not initialized - check your .env.local file",
        needsConfig: true,
      }
    }

    if (configError) {
      return {
        success: false,
        error: configError,
        needsConfig: true,
      }
    }

    console.log("🔍 Checking database setup...")
    const isReady = await checkDatabaseSetup()

    if (configError) {
      return {
        success: false,
        needsConfig: true,
        error: configError,
      }
    }

    if (!isReady) {
      return {
        success: false,
        setupRequired: true,
        error: "Database tables not found. Please run the setup script.",
      }
    }

    console.log("✅ Connection test successful")
    return {
      success: true,
      message: "Database connected and ready",
    }
  } catch (error: any) {
    const errorMsg = extractErrorMessage(error)
    console.error("🚨 Unexpected error in testSupabaseConnection:", errorMsg)
    return {
      success: false,
      error: errorMsg,
      needsConfig: false,
    }
  }
}

export const verifyClientFilesBucket = async () => {
  if (!supabase || configError) {
    return {
      exists: false,
      accessible: false,
      error: configError || "Supabase not configured",
    }
  }

  try {
    const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return {
        exists: false,
        accessible: false,
        error: bucketsError.message || "Failed to list buckets",
      }
    }

    const clientFilesBucket = bucketsData?.find((bucket: any) => bucket.name === "client-files")

    if (clientFilesBucket) {
      return {
        exists: true,
        accessible: true,
        bucket: clientFilesBucket,
      }
    }

    return {
      exists: false,
      accessible: false,
      error: "Bucket not found",
    }
  } catch (error: any) {
    return {
      exists: false,
      accessible: false,
      error: error?.message || "Failed to verify bucket",
    }
  }
}

export async function createClientFilesBucket() {
  if (!supabase || configError) {
    return { success: false, error: configError || "Supabase not configured" }
  }

  try {
    const { data, error } = await supabase.storage.createBucket("client-files", {
      public: false,
      allowedMimeTypes: ["image/*", "application/pdf", "application/msword", "text/*"],
      fileSizeLimit: 10485760,
    })

    if (error && !error.message.includes("already exists")) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create bucket" }
  }
}

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    console.log("[v0] clientsApi.getAll() - fetching from API")

    try {
      const response = await fetch("/api/clients", {
        cache: "no-store",
      })

      if (!response.ok) {
        console.error("[v0] API returned error status:", response.status)
        await simulateDelay()
        return mockClients
      }

      const result = await response.json()
      console.log("[v0] API response:", {
        success: result.success,
        mode: result.mode,
        dataCount: result.data?.length,
      })

      if (result.success && result.data) {
        return result.data
      }

      await simulateDelay()
      return mockClients
    } catch (error: any) {
      console.error("[v0] Exception calling API:", error.message)
      await simulateDelay()
      return mockClients
    }
  },

  async getDeleted(): Promise<Client[]> {
    if (!supabase || configError || !databaseReady) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false })

      if (error) {
        console.error("Error loading deleted clients:", extractErrorMessage(error))
        return []
      }

      return data || []
    } catch (error) {
      return []
    }
  },

  async getById(id: string): Promise<Client | null> {
    if (!supabase || configError || !databaseReady) {
      await simulateDelay()
      return mockClients.find((c) => c.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).is("deleted_at", null).single()

      if (error) {
        return mockClients.find((c) => c.id === id) || null
      }

      return data
    } catch (error) {
      return mockClients.find((c) => c.id === id) || null
    }
  },

  async create(client: Omit<Client, "id" | "created_at" | "last_modified">): Promise<Client> {
    const validation = DataValidator.validateClient(client)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
    }

    if (!supabase || configError || !databaseReady) {
      await simulateDelay()
      const newClient: Client = {
        ...client,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      }
      mockClients.unshift(newClient)
      console.log("✅ Client created in demo mode")
      return newClient
    }

    const clientData = cleanDataForSupabase({
      ...client,
      created_at: new Date().toISOString(),
    })

    return SupabaseDebugger.logOperation("INSERT", "clients", clientData, async () => {
      const { data, error } = await supabase.from("clients").insert([clientData]).select().single()

      if (error) {
        const errorMsg = extractErrorMessage(error)
        console.error("Error creating client:", errorMsg)
        throw new Error(`Database error: ${errorMsg}`)
      }

      console.log("✅ Client created:", data.id)
      return data
    })
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    // Only validate fields that are being updated — participant_id is immutable and not sent on update
    const hasName = updates.first_name && updates.first_name.trim() !== ""
    const hasLastName = updates.last_name && updates.last_name.trim() !== ""
    if (!hasName || !hasLastName) {
      console.error("[v0] Update validation failed — missing first_name or last_name:", { first_name: updates.first_name, last_name: updates.last_name })
      throw new Error("Validation failed: First name and last name are required")
    }
    console.log("[v0] clientsApi.update() - validation passed, updating via API")

    try {
      const updateData = cleanDataForSupabase(updates)
      
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action: "update", ...updateData }),
      })

      // Check for rate limiting or HTML error responses
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Non-JSON response:", response.status, response.statusText)
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.")
        }
        throw new Error(`Server error (${response.status}): ${response.statusText}`)
      }

      const result = await response.json()
      console.log("[v0] Update API response:", { success: result.success, hasData: !!result.data })

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update client")
      }

      console.log("[v0] Client updated:", id)
      return result.data
    } catch (error: any) {
      console.error("[v0] Exception calling update API:", error.message)
      throw error
    }
  },

  async softDelete(id: string, deletedBy = "Current User"): Promise<void> {
    console.log("[v0] DELETE: softDelete() called - id:", id, "deletedBy:", deletedBy)

    if (!supabase || configError || !databaseReady) {
      console.log("[v0] DELETE: Soft delete not available in demo mode")
      return
    }

    console.log("[v0] DELETE: supabase config ready, making DELETE API call")
    const response = await fetch(
      `/api/clients?id=${encodeURIComponent(id)}&action=soft&deletedBy=${encodeURIComponent(deletedBy)}`,
      { method: "DELETE" }
    )

    console.log("[v0] DELETE: API response status:", response.status)
    const { ok, error } = await parseApiResponse(response, "softDelete")
    console.log("[v0] DELETE: parseApiResponse result - ok:", ok, "error:", error)
    
    if (!ok || error) {
      throw new Error(error || "Failed to delete client")
    }
    console.log("[v0] DELETE: softDelete completed successfully")
  },

  async restore(id: string): Promise<Client> {
    if (!supabase || configError || !databaseReady) {
      throw new Error("Restore not available in demo mode")
    }

    return SupabaseDebugger.logOperation("RESTORE", "clients", { id }, async () => {
      const { data, error } = await supabase
        .from("clients")
        .update({
          deleted_at: null,
          deleted_by: null,
          last_modified: new Date().toISOString(),
          modified_by: "Current User",
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        const errorMsg = extractErrorMessage(error)
        throw new Error(`Database error: ${errorMsg}`)
      }
      console.log("✅ Client restored:", id)
      return data
    })
  },

  async permanentDelete(id: string): Promise<void> {
    if (!supabase || configError || !databaseReady) {
      console.log("[v0] Permanent delete not available in demo mode")
      return
    }

    const response = await fetch(
      `/api/clients?id=${encodeURIComponent(id)}&action=permanent`,
      { method: "DELETE" }
    )

    const { ok, error } = await parseApiResponse(response, "permanentDelete")
    if (!ok || error) {
      throw new Error(error || "Failed to permanently delete client")
    }
  },
}

// Helper to safely parse JSON response and handle rate limiting
async function parseApiResponse(response: Response, errorContext: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  const contentType = response.headers.get("content-type")
  
  // Check for non-JSON responses (rate limiting, server errors)
  if (!contentType || !contentType.includes("application/json")) {
    console.error(`[v0] Non-JSON response for ${errorContext}:`, response.status, response.statusText)
    if (response.status === 429) {
      return { ok: false, error: "Too many requests. Please wait a moment and try again." }
    }
    return { ok: false, error: `Server error (${response.status}): ${response.statusText}` }
  }

  try {
    const result = await response.json()
    if (!response.ok || !result.success) {
      return { ok: false, error: result.error || "Operation failed" }
    }
    return { ok: true, data: result.data }
  } catch (parseError: any) {
    console.error(`[v0] JSON parse error for ${errorContext}:`, parseError.message)
    return { ok: false, error: "Invalid server response" }
  }
}

export const caseNotesApi = {
  async getByClientId(clientId: string): Promise<CaseNote[]> {
    console.log("[v0] caseNotesApi.getByClientId() - fetching via API")

    try {
      const response = await fetch(`/api/case-notes?clientId=${encodeURIComponent(clientId)}`)
      const { ok, data, error } = await parseApiResponse(response, "getByClientId")

      if (!ok) {
        console.log("[v0] Case notes API failed:", error)
        return []
      }

      console.log("[v0] Case notes API response:", { count: data?.length || 0 })
      return data || []
    } catch (error: any) {
      console.error("[v0] Exception fetching case notes:", error.message)
      return []
    }
  },

  async create(caseNote: Omit<CaseNote, "id" | "created_at">): Promise<CaseNote> {
    const validation = DataValidator.validateCaseNote(caseNote)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
    }

    console.log("[v0] caseNotesApi.create() - creating via API")

    try {
      const response = await fetch("/api/case-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseNote),
      })

      const { ok, data, error } = await parseApiResponse(response, "create case note")

      if (!ok || !data) {
        throw new Error(error || "Failed to create case note")
      }

      console.log("[v0] Case note created:", data.id)
      return data
    } catch (error: any) {
      console.error("[v0] Exception calling create case note API:", error.message)
      throw error
    }
  },

  async softDelete(id: string, deletedBy = "Current User"): Promise<void> {
    console.log("[v0] caseNotesApi.softDelete() - deleting via API")

    try {
      const response = await fetch(
        `/api/case-notes?id=${encodeURIComponent(id)}&deletedBy=${encodeURIComponent(deletedBy)}`,
        { method: "DELETE" }
      )

      const { ok, error } = await parseApiResponse(response, "softDelete")

      if (!ok) {
        throw new Error(error || "Failed to delete case note")
      }

      console.log("[v0] Case note soft deleted:", id)
    } catch (error: any) {
      console.error("[v0] Exception deleting case note:", error.message)
      throw error
    }
  },
}

export const clientFilesApi = {
  async getByClientId(clientId: string, category?: string): Promise<ClientFile[]> {
    if (!supabase || configError || !databaseReady) {
      await simulateDelay()
      let files = mockClientFiles.filter((f) => f.client_id === clientId)
      if (category) {
        files = files.filter((f) => f.file_category === category)
      }
      return files
    }

    try {
      let query = supabase
        .from("client_files")
        .select("*")
        .eq("client_id", clientId)
        .eq("is_active", true)
        .is("deleted_at", null)

      if (category) {
        query = query.eq("file_category", category)
      }

      const { data, error } = await query

      if (error) {
        let files = mockClientFiles.filter((f) => f.client_id === clientId)
        if (category) {
          files = files.filter((f) => f.file_category === category)
        }
        return files
      }

      return data || []
    } catch (error) {
      let files = mockClientFiles.filter((f) => f.client_id === clientId)
      if (category) {
        files = files.filter((f) => f.file_category === category)
      }
      return files
    }
  },

  async uploadFile(
    file: File,
    clientId: string,
    category: "certification" | "education" | "general" = "certification",
    description?: string,
    uploadedBy = "Current User",
  ): Promise<ClientFile> {
    if (!supabase || configError || !databaseReady) {
      await simulateDelay(1000)
      const blobUrl = URL.createObjectURL(file)

      const mockFile: ClientFile = {
        id: `file-${Date.now()}`,
        client_id: clientId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_category: category,
        storage_path: `demo/${clientId}/${file.name}`,
        public_url: blobUrl,
        upload_date: new Date().toISOString(),
        uploaded_by: uploadedBy,
        description,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockClientFiles.push(mockFile)
      console.log("✅ File uploaded in demo mode")
      return mockFile
    }

    return SupabaseDebugger.logOperation("UPLOAD_FILE", "client_files", { fileName: file.name }, async () => {
      const timestamp = Date.now()
      const fileName = `${clientId}/${category}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

      const { error: uploadError } = await supabase.storage.from("client-files").upload(fileName, file)

      if (uploadError) {
        console.warn("Storage upload failed, using demo mode:", uploadError)
        const blobUrl = URL.createObjectURL(file)
        const mockFile: ClientFile = {
          id: `file-${Date.now()}`,
          client_id: clientId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_category: category,
          storage_path: fileName,
          public_url: blobUrl,
          upload_date: new Date().toISOString(),
          uploaded_by: uploadedBy,
          description: description || null,
          is_active: true,
        }
        mockClientFiles.push(mockFile)
        return mockFile
      }

      const { data: urlData } = supabase.storage.from("client-files").getPublicUrl(fileName)

      const fileRecord = {
        client_id: clientId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_category: category,
        storage_path: fileName,
        public_url: urlData.publicUrl,
        upload_date: new Date().toISOString(),
        uploaded_by: uploadedBy,
        description: description || null,
        is_active: true,
      }

      const { data: dbData, error: dbError } = await supabase
        .from("client_files")
        .insert([fileRecord])
        .select()
        .single()

      if (dbError) {
        await supabase.storage.from("client-files").remove([fileName])
        throw new Error("Failed to save file record")
      }

      return dbData
    })
  },

  async deleteFile(fileId: string, deletedBy = "Current User"): Promise<void> {
    if (!supabase || configError || !databaseReady) {
      const index = mockClientFiles.findIndex((f) => f.id === fileId)
      if (index !== -1) {
        mockClientFiles[index].is_active = false
      }
      return
    }

    return SupabaseDebugger.logOperation("DELETE_FILE", "client_files", { fileId }, async () => {
      const { error } = await supabase
        .from("client_files")
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
        })
        .eq("id", fileId)

      if (error) {
        const errorMsg = extractErrorMessage(error)
        throw new Error(`Database error: ${errorMsg}`)
      }
    })
  },

  async updateFile(
    fileId: string,
    updates: Partial<Pick<ClientFile, "description" | "file_category">>,
  ): Promise<ClientFile> {
    if (!supabase || configError || !databaseReady) {
      const index = mockClientFiles.findIndex((f) => f.id === fileId)
      if (index !== -1) {
        mockClientFiles[index] = {
          ...mockClientFiles[index],
          ...updates,
          updated_at: new Date().toISOString(),
        }
        return mockClientFiles[index]
      }
      throw new Error("File not found")
    }

    return SupabaseDebugger.logOperation("UPDATE_FILE", "client_files", { fileId, updates }, async () => {
      const { data, error } = await supabase
        .from("client_files")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", fileId)
        .select()
        .single()

      if (error) {
        const errorMsg = extractErrorMessage(error)
        throw new Error(`Database error: ${errorMsg}`)
      }
      return data
    })
  },

  async getDownloadUrl(fileId: string): Promise<string> {
    if (!supabase || configError || !databaseReady) {
      const file = mockClientFiles.find((f) => f.id === fileId)
      return file?.public_url || ""
    }

    const { data: fileData } = await supabase
      .from("client_files")
      .select("storage_path, public_url")
      .eq("id", fileId)
      .single()

    if (!fileData) {
      const file = mockClientFiles.find((f) => f.id === fileId)
      return file?.public_url || ""
    }

    if (fileData.public_url) {
      return fileData.public_url
    }

    const { data: urlData } = await supabase.storage.from("client-files").createSignedUrl(fileData.storage_path, 3600)

    return urlData?.signedUrl || ""
  },
}

export async function diagnoseSupabaseConfig() {
  console.log("🔍 Supabase Configuration Diagnostic")
  console.log("=====================================")

  console.log("\n1. Environment Variables:")
  console.log("   URL set:", !!supabaseUrl)
  console.log("   URL value:", supabaseUrl ? supabaseUrl.substring(0, 40) + "..." : "NOT SET")
  console.log("   URL format valid:", supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co"))
  console.log("   Key set:", !!supabaseAnonKey)
  console.log("   Key length:", supabaseAnonKey?.length || 0)
  console.log("   Key starts with 'eyJ':", supabaseAnonKey?.startsWith("eyJ"))

  console.log("\n2. Client Status:")
  console.log("   Client created:", !!supabase)
  console.log("   Has config:", hasValidConfig)
  console.log("   Config error:", configError || "none")
  console.log("   Database ready:", databaseReady)

  if (!supabase) {
    console.log("\n❌ ISSUE: Supabase client not created")
    console.log("   This usually means environment variables are missing or invalid")
    return { success: false, issue: "no_client" }
  }

  console.log("\n3. Testing connection...")
  try {
    const { data, error } = await supabase.from("clients").select("count", { count: "exact", head: true }).limit(0)

    console.log("   Query executed")
    console.log("   Has data:", !!data)
    console.log("   Has error:", !!error)

    if (error) {
      const errorMsg = extractErrorMessage(error)
      console.log("   Error message:", errorMsg)
      console.log("   Error code:", error?.code || "none")

      if (error.message?.includes("relation") || error.code === "42P01") {
        console.log("\n⚠️  ISSUE: Tables not created yet")
        return { success: false, issue: "tables_missing" }
      }

      return { success: false, issue: "query_error", error: errorMsg }
    }

    console.log("\n✅ Connection successful!")
    return { success: true }
  } catch (err: any) {
    const errorMsg = extractErrorMessage(err)
    console.log("\n❌ ISSUE: Exception during connection test")
    console.log("   Exception:", errorMsg)
    return { success: false, issue: "exception", error: errorMsg }
  }
}

export const testSupabaseSync = () => {
  return {
    isConfigured: hasValidConfig,
    configError,
    isDatabaseReady: databaseReady,
    status: getSupabaseStatus(),
  }
}

if (typeof window !== "undefined") {
  ;(window as any).testSupabaseConnection = testSupabaseConnection
  ;(window as any).verifyClientFilesBucket = verifyClientFilesBucket
  ;(window as any).createClientFilesBucket = createClientFilesBucket
  ;(window as any).checkDatabaseSetup = checkDatabaseSetup
  ;(window as any).diagnoseSupabaseConfig = diagnoseSupabaseConfig
  ;(window as any).testSupabaseSync = testSupabaseSync
}
