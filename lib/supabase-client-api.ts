import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Client {
  id: string
  first_name: string
  last_name: string
  pid: string
  email: string
  phone?: string
  program: string
  status: string
  created_at: string
  updated_at?: string
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

class ClientsAPI {
  async getAll(): Promise<Client[]> {
    try {
      // First try to query with deleted_at filter (soft delete aware)
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) {
        // If error mentions deleted_at column doesn't exist, fall back to simple query
        if (error.message.includes("deleted_at") && error.message.includes("does not exist")) {
          console.warn("Soft delete not available, falling back to simple query")
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false })

          if (fallbackError) throw fallbackError
          return fallbackData || []
        }
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error fetching clients:", error)
      throw error
    }
  }

  async getDeleted(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false })

      if (error) {
        // If soft delete columns don't exist, return empty array
        if (error.message.includes("deleted_at") && error.message.includes("does not exist")) {
          console.warn("Soft delete not supported, returning empty deleted clients list")
          return []
        }
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error fetching deleted clients:", error)
      return [] // Return empty array instead of throwing
    }
  }

  async getById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching client by ID:", error)
      throw error
    }
  }

  async create(clientData: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> {
    try {
      const { data, error } = await supabase.from("clients").insert([clientData]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating client:", error)
      throw error
    }
  }

  async update(id: string, clientData: Partial<Client>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .update({ ...clientData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating client:", error)
      throw error
    }
  }

  async softDelete(id: string, deletedBy = "system"): Promise<boolean> {
    try {
      // Try soft delete first
      const { error } = await supabase
        .from("clients")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
        })
        .eq("id", id)

      if (error) {
        // If soft delete columns don't exist, fall back to hard delete
        if (error.message.includes("deleted_at") && error.message.includes("does not exist")) {
          console.warn("Soft delete not supported, performing hard delete")
          return await this.hardDelete(id)
        }
        throw error
      }

      return true
    } catch (error) {
      console.error("Error soft deleting client:", error)
      throw error
    }
  }

  async restore(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          deleted_at: null,
          deleted_by: null,
        })
        .eq("id", id)

      if (error) {
        if (error.message.includes("deleted_at") && error.message.includes("does not exist")) {
          throw new Error("Restore operation not supported - soft delete is not enabled")
        }
        throw error
      }

      return true
    } catch (error) {
      console.error("Error restoring client:", error)
      throw error
    }
  }

  async hardDelete(id: string): Promise<boolean> {
    try {
      // First delete related case notes
      await supabase.from("case_notes").delete().eq("client_id", id)

      // Then delete the client
      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error hard deleting client:", error)
      throw error
    }
  }

  async search(query: string): Promise<Client[]> {
    try {
      const searchTerm = `%${query.toLowerCase()}%`

      // Build the base query
      let queryBuilder = supabase.from("clients").select("*")

      // Add soft delete filter if supported
      try {
        queryBuilder = queryBuilder.is("deleted_at", null)
      } catch (error) {
        // Ignore if deleted_at column doesn't exist
        console.warn("Soft delete filter not available for search")
      }

      const { data, error } = await queryBuilder
        .or(
          `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},pid.ilike.${searchTerm}`,
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching clients:", error)
      throw error
    }
  }

  async isSoftDeleteAvailable(): Promise<boolean> {
    try {
      // Try to query the deleted_at column to see if it exists
      const { error } = await supabase.from("clients").select("deleted_at").limit(1)

      return !error
    } catch (error) {
      return false
    }
  }
}

class CaseNotesAPI {
  async getByClientId(clientId: string): Promise<CaseNote[]> {
    try {
      const { data, error } = await supabase
        .from("case_notes")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching case notes:", error)
      throw error
    }
  }

  async create(noteData: Omit<CaseNote, "id" | "created_at">): Promise<CaseNote> {
    try {
      const { data, error } = await supabase.from("case_notes").insert([noteData]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating case note:", error)
      throw error
    }
  }

  async update(id: string, noteData: Partial<CaseNote>): Promise<CaseNote> {
    try {
      const { data, error } = await supabase.from("case_notes").update(noteData).eq("id", id).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating case note:", error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("case_notes").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting case note:", error)
      throw error
    }
  }
}

export const clientsApi = new ClientsAPI()
export const caseNotesApi = new CaseNotesAPI()
