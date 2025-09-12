import { createClient } from "@supabase/supabase-js"

// Environment variable validation with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we have valid Supabase configuration
const hasValidConfig = supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "placeholder-key"

export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

// Database types
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
  required_hours?: string
  cao_number?: string
  education_level?: string
  graduation_year?: string
  school_name?: string
  field_of_study?: string
  education_notes?: string
  currently_enrolled?: string
  gpa?: string
  certifications?: string
  licenses?: string
  industry_certifications?: string
  certification_status?: string
  certification_notes?: string
  created_at?: string
  last_contact?: string
  last_modified?: string
  modified_by?: string
}

export interface CaseNote {
  id: string
  client_id: string
  note: string
  created_at: string
  author: string
}

// Mock data for development when Supabase is not configured
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
    required_hours: "40",
    cao_number: "CAO-001",
    education_level: "High School Diploma/GED",
    graduation_year: "2008",
    school_name: "Philadelphia High School",
    field_of_study: "General Studies",
    education_notes: "Graduated with honors",
    currently_enrolled: "No",
    gpa: "3.5",
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
  {
    id: "4",
    client_id: "3",
    note: "Initial intake meeting scheduled. Client needs career guidance and support.",
    created_at: "2023-04-02T09:30:00Z",
    author: "Johnson, Mary",
  },
]

// Client database operations
export const clientsApi = {
  // Get all clients
  async getAll(): Promise<Client[]> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      return Promise.resolve([...mockClients])
    }

    try {
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching clients:", error)
        console.log("Falling back to mock data")
        return mockClients
      }

      return data || []
    } catch (error) {
      console.error("Supabase error, falling back to mock data:", error)
      return mockClients
    }
  },

  // Get client by ID
  async getById(id: string): Promise<Client | null> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      return Promise.resolve(mockClients.find((client) => client.id === id) || null)
    }

    try {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching client:", error)
        console.log("Falling back to mock data")
        return mockClients.find((client) => client.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Supabase error, falling back to mock data:", error)
      return mockClients.find((client) => client.id === id) || null
    }
  },

  // Create new client
  async create(client: Omit<Client, "id" | "created_at" | "last_modified">): Promise<Client> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      }
      mockClients.unshift(newClient)
      return Promise.resolve(newClient)
    }

    try {
      const { data, error } = await supabase
        .from("clients")
        .insert([
          {
            ...client,
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating client:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Supabase error, using mock data:", error)
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      }
      mockClients.unshift(newClient)
      return newClient
    }
  },

  // Update client
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          ...updates,
          last_modified: new Date().toISOString(),
        }
        return Promise.resolve(mockClients[clientIndex])
      }
      throw new Error("Client not found")
    }

    try {
      const { data, error } = await supabase
        .from("clients")
        .update({
          ...updates,
          last_modified: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating client:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Supabase error, using mock data:", error)
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
  },

  // Delete client
  async delete(id: string): Promise<void> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1)
      }
      return Promise.resolve()
    }

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) {
        console.error("Error deleting client:", error)
        throw error
      }
    } catch (error) {
      console.error("Supabase error, using mock data:", error)
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1)
      }
    }
  },
}

// Case notes database operations
export const caseNotesApi = {
  // Get case notes for a client
  async getByClientId(clientId: string): Promise<CaseNote[]> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      return Promise.resolve(mockCaseNotes.filter((note) => note.client_id === clientId))
    }

    try {
      const { data, error } = await supabase
        .from("case_notes")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching case notes:", error)
        console.log("Falling back to mock data")
        return mockCaseNotes.filter((note) => note.client_id === clientId)
      }

      return data || []
    } catch (error) {
      console.error("Supabase error, falling back to mock data:", error)
      return mockCaseNotes.filter((note) => note.client_id === clientId)
    }
  },

  // Create new case note
  async create(caseNote: Omit<CaseNote, "id" | "created_at">): Promise<CaseNote> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      const newNote: CaseNote = {
        ...caseNote,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }
      mockCaseNotes.unshift(newNote)
      return Promise.resolve(newNote)
    }

    try {
      const { data, error } = await supabase
        .from("case_notes")
        .insert([
          {
            ...caseNote,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating case note:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Supabase error, using mock data:", error)
      const newNote: CaseNote = {
        ...caseNote,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }
      mockCaseNotes.unshift(newNote)
      return newNote
    }
  },

  // Delete case note
  async delete(id: string): Promise<void> {
    if (!supabase) {
      console.log("Using mock data - Supabase not configured")
      const noteIndex = mockCaseNotes.findIndex((note) => note.id === id)
      if (noteIndex !== -1) {
        mockCaseNotes.splice(noteIndex, 1)
      }
      return Promise.resolve()
    }

    try {
      const { error } = await supabase.from("case_notes").delete().eq("id", id)

      if (error) {
        console.error("Error deleting case note:", error)
        throw error
      }
    } catch (error) {
      console.error("Supabase error, using mock data:", error)
      const noteIndex = mockCaseNotes.findIndex((note) => note.id === id)
      if (noteIndex !== -1) {
        mockCaseNotes.splice(noteIndex, 1)
      }
    }
  },
}

// Utility function to check if Supabase is configured
export const isSupabaseConfigured = () => hasValidConfig
