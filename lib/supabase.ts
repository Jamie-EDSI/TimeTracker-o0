import { createClient } from "@supabase/supabase-js"
import { NetworkMonitor, DataValidator } from "./supabase-debug"

// Environment variable validation with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

let configError: string | null = null

if (hasValidConfig) {
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
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
  created_at: string
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
  author: string
  created_at: string
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

// Enhanced client database operations with comprehensive debugging
export const clientsApi = {
  // Get all active clients (excluding deleted ones)
  async getAll(): Promise<Client[]> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockClients.filter((client) => !client.deleted_at)
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient
      .from("clients")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get deleted clients for recycle bin
  async getDeleted(): Promise<Client[]> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockClients.filter((client) => client.deleted_at)
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient
      .from("clients")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get client by ID with debugging
  async getById(id: string): Promise<Client | null> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockClients.find((client) => client.id === id) || null
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient.from("clients").select("*").eq("id", id).single()

    if (error) throw error
    return data
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

    if (!hasValidConfig || configError) {
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

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient
      .from("clients")
      .insert([
        {
          ...client,
          last_modified: new Date().toISOString(),
          modified_by: "Current User",
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update client with comprehensive validation and debugging
  async update(id: string, updates: Partial<Omit<Client, "id" | "created_at">>): Promise<Client> {
    // Validate updates
    const validation = DataValidator.validateClient({ ...updates, id })
    if (!validation.isValid) {
      const errorMessage = `Validation failed: ${validation.errors.join(", ")}`
      console.error("❌ Client update validation failed:", validation.errors)
      throw new Error(errorMessage)
    }

    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          ...updates,
          last_modified: new Date().toISOString(),
          modified_by: "Current User",
        }
        return mockClients[clientIndex]
      }
      throw new Error("Client not found")
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient
      .from("clients")
      .update({
        ...updates,
        last_modified: new Date().toISOString(),
        modified_by: "Current User",
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Soft delete client (move to recycle bin)
  async softDelete(id: string, deletedBy = "Current User"): Promise<void> {
    if (!hasValidConfig || configError) {
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

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabaseClient
      .from("clients")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
      })
      .eq("id", id)

    if (error) throw error
  },

  // Restore client from recycle bin
  async restore(id: string): Promise<Client> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          deleted_at: null,
          deleted_by: null,
          last_modified: new Date().toISOString(),
          modified_by: "Current User",
        }
        return mockClients[clientIndex]
      }
      throw new Error("Client not found")
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient
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

    if (error) throw error
    return data
  },

  // Permanently delete client
  async permanentDelete(id: string): Promise<void> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1)
      }
      return
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabaseClient.from("clients").delete().eq("id", id)

    if (error) throw error
  },
}

// Enhanced case notes database operations
export const caseNotesApi = {
  // Get case notes for a client with debugging (excluding deleted ones)
  async getByClientId(clientId: string): Promise<CaseNote[]> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      return mockCaseNotes.filter((note) => note.client_id === clientId)
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient
      .from("case_notes")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
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

    if (!hasValidConfig || configError) {
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

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient.from("case_notes").insert([caseNote]).select().single()

    if (error) throw error
    return data
  },

  // Update case note
  async update(id: string, updates: Partial<Omit<CaseNote, "id" | "created_at">>): Promise<CaseNote> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const noteIndex = mockCaseNotes.findIndex((note) => note.id === id)
      if (noteIndex !== -1) {
        mockCaseNotes[noteIndex] = {
          ...mockCaseNotes[noteIndex],
          ...updates,
          last_modified: new Date().toISOString(),
          modified_by: "Current User",
        }
        return mockCaseNotes[noteIndex]
      }
      throw new Error("Case note not found")
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabaseClient.from("case_notes").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Delete case note
  async delete(id: string): Promise<void> {
    if (!hasValidConfig || configError) {
      console.log("📊 Using demo data - Supabase not configured properly")
      await simulateDelay()
      const noteIndex = mockCaseNotes.findIndex((note) => note.id === id)
      if (noteIndex !== -1) {
        mockCaseNotes.splice(noteIndex, 1)
      }
      return
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabaseClient.from("case_notes").delete().eq("id", id)

    if (error) throw error
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
    await caseNotesApi.delete(testNote.id)
    await clientsApi.permanentDelete(createdClient.id)
    console.log("✅ Test data cleaned up")

    console.log("🎉 All sync operations working correctly!")
    return true
  } catch (error: any) {
    console.error("❌ Sync test failed:", error.message)
    return false
  }
}
