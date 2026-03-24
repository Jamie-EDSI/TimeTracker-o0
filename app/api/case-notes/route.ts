import { NextResponse } from "next/server"
import { supabaseServer, hasServerAccess } from "@/lib/supabase-server"

export async function POST(request: Request) {
  console.log("[v0] API /api/case-notes POST called")

  if (!hasServerAccess()) {
    console.log("[v0] No service role key - cannot create case note")
    return NextResponse.json({
      success: false,
      error: "Database not configured - cannot save case notes",
    }, { status: 503 })
  }

  try {
    const body = await request.json()
    console.log("[v0] Creating case note for client:", body.client_id)

    // Add created_at timestamp
    const noteData = {
      ...body,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseServer!
      .from("case_notes")
      .insert([noteData])
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error during case note creation:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 })
    }

    console.log("[v0] Successfully created case note:", data.id)
    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error: any) {
    console.error("[v0] Exception in POST /api/case-notes:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  console.log("[v0] API /api/case-notes GET called")

  if (!hasServerAccess()) {
    console.log("[v0] No service role key - returning empty array")
    return NextResponse.json({
      success: true,
      data: [],
      mode: "demo",
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    if (!clientId) {
      return NextResponse.json({
        success: false,
        error: "clientId is required",
      }, { status: 400 })
    }

    console.log("[v0] Fetching case notes for client:", clientId)

    const { data, error } = await supabaseServer!
      .from("case_notes")
      .select("*")
      .eq("client_id", clientId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error fetching case notes:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 })
    }

    console.log("[v0] Successfully loaded", data.length, "case notes")
    return NextResponse.json({
      success: true,
      data: data || [],
      mode: "database",
    })
  } catch (error: any) {
    console.error("[v0] Exception in GET /api/case-notes:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  console.log("[v0] API /api/case-notes DELETE called")

  if (!hasServerAccess()) {
    return NextResponse.json({
      success: false,
      error: "Database not configured",
    }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const deletedBy = searchParams.get("deletedBy") || "Current User"

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "id is required",
      }, { status: 400 })
    }

    console.log("[v0] Soft deleting case note:", id)

    const { error } = await supabaseServer!
      .from("case_notes")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
      })
      .eq("id", id)

    if (error) {
      console.error("[v0] Database error during soft delete:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 })
    }

    console.log("[v0] Successfully soft deleted case note:", id)
    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error("[v0] Exception in DELETE /api/case-notes:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
