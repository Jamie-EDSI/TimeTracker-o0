import { NextResponse } from "next/server"
import { supabaseServer, hasServerAccess } from "@/lib/supabase-server"

// Mock data for when database is not available
const mockClients = [
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
    created_at: "2023-02-20T10:00:00Z",
    last_modified: "2023-12-15T15:30:00Z",
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
    case_manager: "Smith, John",
    created_at: "2023-03-15T09:00:00Z",
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
    case_manager: "Johnson, Mary",
    created_at: "2023-04-01T11:00:00Z",
  },
]

export async function PUT(request: Request) {
  console.log("[v0] API /api/clients PUT called")

  if (!hasServerAccess()) {
    console.log("[v0] No service role key - cannot update")
    return NextResponse.json({
      success: false,
      error: "Database not configured - cannot update clients",
    }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Client ID is required",
      }, { status: 400 })
    }

    console.log("[v0] Updating client:", id)
    console.log("[v0] Update payload keys:", Object.keys(updates))
    console.log("[v0] Full update payload:", JSON.stringify(updates, null, 2))

    // Add last_modified timestamp and clean up the data
    // Remove any fields that shouldn't be sent to the database
    const { case_notes, caseNotes, ...cleanUpdates } = updates
    
    // Handle date fields - convert empty strings/undefined to null
    // PostgreSQL date columns reject empty strings, they require null or a valid date
    const dateFields = ['date_of_birth', 'enrollment_date', 'last_contact']
    dateFields.forEach(field => {
      const val = cleanUpdates[field]
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        cleanUpdates[field] = null
      }
    })
    
    // Handle numeric fields - convert empty strings to null
    const numericFields = ['required_hours', 'graduation_year', 'gpa']
    numericFields.forEach(field => {
      if (cleanUpdates[field] === '' || cleanUpdates[field] === undefined) {
        cleanUpdates[field] = null
      } else if (typeof cleanUpdates[field] === 'string') {
        const parsed = parseFloat(cleanUpdates[field])
        cleanUpdates[field] = isNaN(parsed) ? null : parsed
      }
    })
    
    const updateData = {
      ...cleanUpdates,
      last_modified: new Date().toISOString(),
      modified_by: cleanUpdates.modified_by || "Current User",
    }
    
    console.log("[v0] Cleaned update data keys:", Object.keys(updateData))

    const { data, error } = await supabaseServer!
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error during update:", JSON.stringify(error, null, 2))
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error hint:", error.hint)
      console.error("[v0] Error details:", error.details)
      return NextResponse.json({
        success: false,
        error: `${error.message} (code: ${error.code})`,
        details: error.details,
        hint: error.hint,
      }, { status: 500 })
    }

    console.log("[v0] Successfully updated client:", id)
    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error: any) {
    console.error("[v0] Exception in PUT /api/clients:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

export async function GET() {
  console.log("[v0] API /api/clients called")

  // If no server access, return mock data
  if (!hasServerAccess()) {
    console.log("[v0] No service role key - returning mock data")
    return NextResponse.json({
      success: true,
      data: mockClients,
      mode: "demo",
      message: "Using demo data - add SUPABASE_SERVICE_ROLE_KEY to access real database",
    })
  }

  try {
    console.log("[v0] Querying database with service role...")
    
    const { data, error } = await supabaseServer!
      .from("clients")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    console.log("[v0] Query result:", {
      dataCount: data?.length,
      hasError: !!error,
      errorDetails: error,
    })

    if (error) {
      console.error("[v0] Database error:", error)
      // Fall back to mock data on error
      return NextResponse.json({
        success: true,
        data: mockClients,
        mode: "demo",
        message: `Database error: ${error.message}. Using demo data.`,
      })
    }

    console.log(`[v0] Successfully loaded ${data.length} clients from database`)
    return NextResponse.json({
      success: true,
      data: data || [],
      mode: "database",
    })
  } catch (error: any) {
    console.error("[v0] Exception in /api/clients:", error)
    return NextResponse.json({
      success: true,
      data: mockClients,
      mode: "demo",
      message: `Server error: ${error.message}. Using demo data.`,
    })
  }
}
