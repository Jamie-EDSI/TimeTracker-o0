import { createClient } from "@supabase/supabase-js"
import { SupabaseDebugger, NetworkMonitor, DataValidator } from "./supabase-debug"

// Environment variable validation with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("🔧 Supabase Configuration Check:")
console.log("URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
console.log("Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing")

// Enhanced validation
const hasValidConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseAnonKey.includes("placeholder")

let supabase: any = null
let configError: string | null = null

if (hasValidConfig) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client created successfully")

    // Test connection immediately
    if (typeof window !== "undefined") {
      NetworkMonitor.testConnection().then((result) => {
        console.log("🌐 Connection Test Result:", result)
      })
    }
  } catch (error: any) {
    console.error("❌ Failed to create Supabase client:", error)
    configError = `Supabase client creation failed: ${error.message}`
  }
} else {
  configError = "Invalid Supabase configuration"
  console.log("⚠️ Using demo mode - Supabase not configured properly")
  console.log("💡 Check your .env.local file and ensure:")
  console.log("   - NEXT_PUBLIC_SUPABASE_URL is set correctly")
  console.log("   - NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly")
  console.log("   - Both values are not placeholder text")
}

export { supabase }

// Database types with enhanced validation
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

// Enhanced mock data for comprehensive testing
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
  {
    id: "4",
    first_name: "David",
    last_name: "Wilson",
    participant_id: "2965148",
    program: "EARN",
    status: "Active",
    enrollment_date: "2023-05-10",
    phone: "610-555-0401",
    email: "david.wilson@email.com",
    address: "654 Cedar Ln",
    city: "Philadelphia",
    state: "PA",
    zip_code: "19105",
    date_of_birth: "1988-03-14",
    emergency_contact: "Susan Wilson",
    emergency_phone: "610-555-0402",
    case_manager: "Brown, Lisa",
    created_at: "2023-05-10T08:00:00Z",
    last_modified: "2023-12-01T10:15:00Z",
    modified_by: "Brown, Lisa",
  },
  {
    id: "5",
    first_name: "Jessica",
    last_name: "Martinez",
    participant_id: "2965149",
    program: "Job Readiness",
    status: "Inactive",
    enrollment_date: "2023-01-15",
    phone: "215-555-0501",
    email: "jessica.martinez@email.com",
    address: "987 Birch St",
    city: "Philadelphia",
    state: "PA",
    zip_code: "19106",
    date_of_birth: "1992-11-08",
    emergency_contact: "Roberto Martinez",
    emergency_phone: "215-555-0502",
    case_manager: "Johnson, Mary",
    created_at: "2023-01-15T12:00:00Z",
    last_modified: "2023-11-20T14:30:00Z",
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
  {
    id: "4",
    client_id: "3",
    note: "Initial intake meeting scheduled. Client needs career guidance and support.",
    created_at: "2023-04-02T09:30:00Z",
    author: "Johnson, Mary",
  },
  {
    id: "5",
    client_id: "4",
    note: "Client has excellent technical skills. Recommended for advanced placement program.",
    created_at: "2023-05-12T11:00:00Z",
    author: "Brown, Lisa",
  },
]

// Helper function to simulate network delay for realistic demo
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to clean data for Supabase (convert empty strings to null for optional fields)
const cleanDataForSupabase = (data: any) => {
  const cleaned = { ...data }

  // Convert empty strings to null for optional fields
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

  // Convert empty strings to null for optional fields
  optionalFields.forEach((field) => {
    if (cleaned[field] === "") {
      cleaned[field] = null
    }
  })

  // Handle numeric fields - convert empty strings to null
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

  // Always set last_modified to current timestamp for updates
  cleaned.last_modified = new Date().toISOString()

  return cleaned
}

// Enhanced client database operations with comprehensive debugging
export const clientsApi = {
  // Get all active clients (excluding deleted ones)
  async getAll(): Promise<Client[]> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockClients.filter((client) => !client.deleted_at)
    }

    return SupabaseDebugger.logOperation("SELECT", "clients", null, async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("🚨 Supabase SELECT error:", error)
        console.log("🔄 Falling back to demo data")
        await simulateDelay()
        return mockClients.filter((client) => !client.deleted_at)
      }

      console.log(`✅ Successfully loaded ${data?.length || 0} clients from Supabase`)
      return data || []
    })
  },

  // Get deleted clients for recycle bin
  async getDeleted(): Promise<Client[]> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockClients.filter((client) => client.deleted_at)
    }

    return SupabaseDebugger.logOperation("SELECT_DELETED", "clients", null, async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false })

      if (error) {
        console.error("🚨 Supabase SELECT_DELETED error:", error)
        console.log("🔄 Falling back to demo data")
        await simulateDelay()
        return mockClients.filter((client) => client.deleted_at)
      }

      console.log(`✅ Successfully loaded ${data?.length || 0} deleted clients from Supabase`)
      return data || []
    })
  },

  // Get client by ID with debugging
  async getById(id: string): Promise<Client | null> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockClients.find((client) => client.id === id && !client.deleted_at) || null
    }

    return SupabaseDebugger.logOperation("SELECT_BY_ID", "clients", { id }, async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).is("deleted_at", null).single()

      if (error) {
        console.error("🚨 Supabase SELECT_BY_ID error:", error)
        console.log("🔄 Falling back to demo data")
        return mockClients.find((client) => client.id === id && !client.deleted_at) || null
      }

      return data
    })
  },

  // Create new client with comprehensive validation and debugging
  async create(client: Omit<Client, "id" | "created_at" | "last_modified">): Promise<Client> {
    // Validate data before sending
    const validation = DataValidator.validateClient(client)
    if (!validation.isValid) {
      const errorMessage = `Validation failed: ${validation.errors.join(", ")}`
      console.error("❌ Client validation failed:", validation.errors)
      throw new Error(errorMessage)
    }

    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      }
      mockClients.unshift(newClient)
      return newClient
    }

    const clientData = cleanDataForSupabase({
      ...client,
      created_at: new Date().toISOString(),
    })

    return SupabaseDebugger.logOperation("INSERT", "clients", clientData, async () => {
      const { data, error } = await supabase.from("clients").insert([clientData]).select().single()

      if (error) {
        console.error("🚨 Supabase INSERT error:", error)
        console.error("📤 Data that failed to insert:", clientData)

        // Detailed error analysis
        if (error.code === "23505") {
          throw new Error("Duplicate participant ID. Please use a unique participant ID.")
        } else if (error.code === "23502") {
          throw new Error("Missing required field. Please check all required fields are filled.")
        } else if (error.code === "42703") {
          throw new Error("Database schema mismatch. Please check the database setup.")
        } else {
          throw new Error(`Database error: ${error.message}`)
        }
      }

      console.log("✅ Client successfully created in Supabase:", data.id)
      return data
    })
  },

  // Update client with comprehensive validation and debugging
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    // Validate updates
    const validation = DataValidator.validateClient({ ...updates, id })
    if (!validation.isValid) {
      const errorMessage = `Validation failed: ${validation.errors.join(", ")}`
      console.error("❌ Client update validation failed:", validation.errors)
      throw new Error(errorMessage)
    }

    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          ...updates,
          last_modified: new Date().toISOString(),
        }
        return mockClients[clientIndex]
      }
      throw new Error("Client not found")
    }

    const updateData = cleanDataForSupabase(updates)

    return SupabaseDebugger.logOperation("UPDATE", "clients", { id, updates: updateData }, async () => {
      const { data, error } = await supabase.from("clients").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("🚨 Supabase UPDATE error:", error)
        console.error("📤 Data that failed to update:", updateData)
        console.error("🔍 Client ID:", id)

        if (error.code === "23505") {
          throw new Error("Duplicate participant ID. Please use a unique participant ID.")
        } else if (error.code === "42703") {
          throw new Error("Database schema mismatch. Please check the database setup.")
        } else {
          throw new Error(`Database error: ${error.message}`)
        }
      }

      console.log("✅ Client successfully updated in Supabase:", id)
      return data
    })
  },

  // Soft delete client (move to recycle bin)
  async softDelete(id: string, deletedBy = "Current User"): Promise<void> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
        }
      }
      return
    }

    return SupabaseDebugger.logOperation("SOFT_DELETE", "clients", { id }, async () => {
      const { error } = await supabase
        .from("clients")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
        })
        .eq("id", id)

      if (error) {
        console.error("🚨 Supabase SOFT_DELETE error:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("✅ Client successfully moved to recycle bin:", id)
    })
  },

  // Restore client from recycle bin
  async restore(id: string): Promise<Client> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          deleted_at: undefined,
          deleted_by: undefined,
          last_modified: new Date().toISOString(),
          modified_by: "Current User",
        }
        return mockClients[clientIndex]
      }
      throw new Error("Client not found")
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
        console.error("🚨 Supabase RESTORE error:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("✅ Client successfully restored from recycle bin:", id)
      return data
    })
  },

  // Permanently delete client
  async permanentDelete(id: string): Promise<void> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1)
      }
      return
    }

    return SupabaseDebugger.logOperation("PERMANENT_DELETE", "clients", { id }, async () => {
      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) {
        console.error("🚨 Supabase PERMANENT_DELETE error:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("✅ Client permanently deleted from Supabase:", id)
    })
  },
}

// Enhanced case notes database operations
export const caseNotesApi = {
  // Get case notes for a client with debugging (excluding deleted ones)
  async getByClientId(clientId: string): Promise<CaseNote[]> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockCaseNotes.filter((note) => note.client_id === clientId && !note.deleted_at)
    }

    return SupabaseDebugger.logOperation("SELECT_BY_CLIENT", "case_notes", { clientId }, async () => {
      const { data, error } = await supabase
        .from("case_notes")
        .select("*")
        .eq("client_id", clientId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("🚨 Supabase SELECT_BY_CLIENT error:", error)
        console.log("🔄 Falling back to demo data")
        return mockCaseNotes.filter((note) => note.client_id === clientId && !note.deleted_at)
      }

      console.log(`✅ Successfully loaded ${data?.length || 0} case notes for client ${clientId}`)
      return data || []
    })
  },

  // Create new case note with validation and debugging
  async create(caseNote: Omit<CaseNote, "id" | "created_at">): Promise<CaseNote> {
    // Validate case note data
    const validation = DataValidator.validateCaseNote(caseNote)
    if (!validation.isValid) {
      const errorMessage = `Validation failed: ${validation.errors.join(", ")}`
      console.error("❌ Case note validation failed:", validation.errors)
      throw new Error(errorMessage)
    }

    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const newNote: CaseNote = {
        ...caseNote,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }
      mockCaseNotes.unshift(newNote)
      return newNote
    }

    const noteData = {
      ...caseNote,
      created_at: new Date().toISOString(),
    }

    return SupabaseDebugger.logOperation("INSERT", "case_notes", noteData, async () => {
      const { data, error } = await supabase.from("case_notes").insert([noteData]).select().single()

      if (error) {
        console.error("🚨 Supabase INSERT error:", error)
        console.error("📤 Data that failed to insert:", noteData)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("✅ Case note successfully created in Supabase:", data.id)
      return data
    })
  },

  // Soft delete case note
  async softDelete(id: string, deletedBy = "Current User"): Promise<void> {
    if (!supabase || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const noteIndex = mockCaseNotes.findIndex((note) => note.id === id)
      if (noteIndex !== -1) {
        mockCaseNotes[noteIndex] = {
          ...mockCaseNotes[noteIndex],
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
        }
      }
      return
    }

    return SupabaseDebugger.logOperation("SOFT_DELETE", "case_notes", { id }, async () => {
      const { error } = await supabase
        .from("case_notes")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
        })
        .eq("id", id)

      if (error) {
        console.error("🚨 Supabase SOFT_DELETE error:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("✅ Case note successfully moved to recycle bin:", id)
    })
  },
}

// Utility functions with enhanced debugging
export const isSupabaseConfigured = () => hasValidConfig && !configError
export const getSupabaseStatus = () => {
  if (!hasValidConfig) return "not_configured"
  if (configError) return "error"
  return "connected"
}
export const getConfigError = () => configError

// Enhanced testing function
export const testSupabaseSync = async () => {
  console.log("🧪 Testing Supabase Sync Operations...")

  try {
    // Test network connectivity
    const networkTest = await NetworkMonitor.testConnection()
    console.log("🌐 Network Test:", networkTest)

    if (!networkTest.supabaseReachable) {
      console.error("❌ Supabase not reachable:", networkTest.error)
      return false
    }

    // Test CRUD operations
    console.log("🔄 Testing CRUD operations...")

    // Create test client
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

    const createdClient = await clientsApi.create(testClient)
    console.log("✅ Test client created:", createdClient.id)

    // Update test client
    const updatedClient = await clientsApi.update(createdClient.id, {
      phone: "555-9999",
    })
    console.log("✅ Test client updated")

    // Create test case note
    const testNote = await caseNotesApi.create({
      client_id: createdClient.id,
      note: "Test case note",
      author: "Test Author",
    })
    console.log("✅ Test case note created:", testNote.id)

    // Test soft delete
    await clientsApi.softDelete(createdClient.id, "Test User")
    console.log("✅ Test client soft deleted")

    // Test restore
    await clientsApi.restore(createdClient.id)
    console.log("✅ Test client restored")

    // Clean up test data
    await caseNotesApi.softDelete(testNote.id, "Test User")
    await clientsApi.permanentDelete(createdClient.id)
    console.log("✅ Test data cleaned up")

    console.log("🎉 All sync operations working correctly!")
    return true
  } catch (error: any) {
    console.error("❌ Sync test failed:", error.message)
    return false
  }
}
