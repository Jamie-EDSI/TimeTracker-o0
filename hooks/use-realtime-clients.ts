"use client"

import { useState, useEffect, useCallback } from "react"
import { clientsApi, type Client } from "@/lib/supabase"
import { RealtimeManager } from "@/lib/supabase-realtime"

export function useRealtimeClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRealtime, setIsRealtime] = useState(false)

  // Load initial data
  const loadClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientsApi.getAll()
      setClients(data)
    } catch (err: any) {
      setError(err.message)
      console.error("Failed to load clients:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log("🔄 Real-time client update received:", payload)

    setClients((currentClients) => {
      switch (payload.eventType) {
        case "INSERT":
          // Add new client
          return [payload.new, ...currentClients]

        case "UPDATE":
          // Update existing client
          return currentClients.map((client) => (client.id === payload.new.id ? payload.new : client))

        case "DELETE":
          // Remove deleted client
          return currentClients.filter((client) => client.id !== payload.old.id)

        default:
          return currentClients
      }
    })
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    // Load initial data
    loadClients()

    // Set up real-time subscription
    const subscription = RealtimeManager.subscribeToClients(handleRealtimeUpdate)

    if (subscription) {
      setIsRealtime(true)
      console.log("✅ Real-time clients subscription active")
    } else {
      setIsRealtime(false)
      console.log("⚠️ Real-time not available - using polling fallback")

      // Fallback: poll for updates every 30 seconds
      const pollInterval = setInterval(loadClients, 30000)
      return () => clearInterval(pollInterval)
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        RealtimeManager.unsubscribe("clients")
        console.log("🔌 Cleaned up clients real-time subscription")
      }
    }
  }, [loadClients, handleRealtimeUpdate])

  // Manual refresh function
  const refresh = useCallback(() => {
    loadClients()
  }, [loadClients])

  // Add client with optimistic update
  const addClient = useCallback(
    async (clientData: Omit<Client, "id" | "created_at" | "last_modified">) => {
      try {
        const newClient = await clientsApi.create(clientData)

        // If not using real-time, manually update the list
        if (!isRealtime) {
          setClients((current) => [newClient, ...current])
        }

        return newClient
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [isRealtime],
  )

  // Update client with optimistic update
  const updateClient = useCallback(
    async (id: string, updates: Partial<Client>) => {
      try {
        const updatedClient = await clientsApi.update(id, updates)

        // If not using real-time, manually update the list
        if (!isRealtime) {
          setClients((current) => current.map((client) => (client.id === id ? updatedClient : client)))
        }

        return updatedClient
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [isRealtime],
  )

  // Delete client with optimistic update
  const deleteClient = useCallback(
    async (id: string) => {
      try {
        await clientsApi.delete(id)

        // If not using real-time, manually update the list
        if (!isRealtime) {
          setClients((current) => current.filter((client) => client.id !== id))
        }
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [isRealtime],
  )

  return {
    clients,
    loading,
    error,
    isRealtime,
    refresh,
    addClient,
    updateClient,
    deleteClient,
  }
}
