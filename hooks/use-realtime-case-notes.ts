"use client"

import { useState, useEffect, useCallback } from "react"
import { caseNotesApi, type CaseNote } from "@/lib/supabase"
import { RealtimeManager } from "@/lib/supabase-realtime"

export function useRealtimeCaseNotes(clientId: string) {
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRealtime, setIsRealtime] = useState(false)

  // Load initial data
  const loadCaseNotes = useCallback(async () => {
    if (!clientId) return

    try {
      setLoading(true)
      setError(null)
      const data = await caseNotesApi.getByClientId(clientId)
      setCaseNotes(data)
    } catch (err: any) {
      setError(err.message)
      console.error("Failed to load case notes:", err)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback(
    (payload: any) => {
      console.log("🔄 Real-time case note update received:", payload)

      // Only process updates for the current client
      if (payload.new?.client_id !== clientId && payload.old?.client_id !== clientId) {
        return
      }

      setCaseNotes((currentNotes) => {
        switch (payload.eventType) {
          case "INSERT":
            // Add new case note
            return [payload.new, ...currentNotes]

          case "UPDATE":
            // Update existing case note
            return currentNotes.map((note) => (note.id === payload.new.id ? payload.new : note))

          case "DELETE":
            // Remove deleted case note
            return currentNotes.filter((note) => note.id !== payload.old.id)

          default:
            return currentNotes
        }
      })
    },
    [clientId],
  )

  // Set up real-time subscription
  useEffect(() => {
    if (!clientId) return

    // Load initial data
    loadCaseNotes()

    // Set up real-time subscription
    const subscription = RealtimeManager.subscribeToCaseNotes(handleRealtimeUpdate)

    if (subscription) {
      setIsRealtime(true)
      console.log("✅ Real-time case notes subscription active")
    } else {
      setIsRealtime(false)
      console.log("⚠️ Real-time not available - using polling fallback")

      // Fallback: poll for updates every 30 seconds
      const pollInterval = setInterval(loadCaseNotes, 30000)
      return () => clearInterval(pollInterval)
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        RealtimeManager.unsubscribe("case_notes")
        console.log("🔌 Cleaned up case notes real-time subscription")
      }
    }
  }, [clientId, loadCaseNotes, handleRealtimeUpdate])

  // Manual refresh function
  const refresh = useCallback(() => {
    loadCaseNotes()
  }, [loadCaseNotes])

  // Add case note with optimistic update
  const addCaseNote = useCallback(
    async (noteData: Omit<CaseNote, "id" | "created_at">) => {
      try {
        const newNote = await caseNotesApi.create(noteData)

        // If not using real-time, manually update the list
        if (!isRealtime) {
          setCaseNotes((current) => [newNote, ...current])
        }

        return newNote
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [isRealtime],
  )

  // Delete case note with optimistic update
  const deleteCaseNote = useCallback(
    async (id: string) => {
      try {
        await caseNotesApi.delete(id)

        // If not using real-time, manually update the list
        if (!isRealtime) {
          setCaseNotes((current) => current.filter((note) => note.id !== id))
        }
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [isRealtime],
  )

  return {
    caseNotes,
    loading,
    error,
    isRealtime,
    refresh,
    addCaseNote,
    deleteCaseNote,
  }
}
