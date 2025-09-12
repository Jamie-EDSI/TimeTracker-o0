import { supabase } from "./supabase"
import type { Client, CaseNote } from "./supabase"

// Real-time subscription types
export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE"

export interface RealtimePayload<T = any> {
  eventType: RealtimeEvent
  new: T
  old: T
  table: string
}

// Real-time subscription manager
export class RealtimeManager {
  private static subscriptions: Map<string, any> = new Map()
  private static connectionStatus: "connected" | "disconnected" | "connecting" = "disconnected"

  static getConnectionStatus() {
    return this.connectionStatus
  }

  static subscribeToClients(callback: (payload: RealtimePayload<Client>) => void) {
    if (!supabase) {
      console.log("📊 Real-time not available - using demo mode")
      return null
    }

    this.connectionStatus = "connecting"

    const subscription = supabase
      .channel("clients-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clients",
        },
        (payload: any) => {
          console.log("🔄 Real-time client update:", payload)
          this.connectionStatus = "connected"
          callback({
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
            table: "clients",
          })
        },
      )
      .subscribe((status: string) => {
        console.log("📡 Clients subscription status:", status)
        if (status === "SUBSCRIBED") {
          this.connectionStatus = "connected"
        } else if (status === "CLOSED") {
          this.connectionStatus = "disconnected"
        }
      })

    this.subscriptions.set("clients", subscription)
    console.log("✅ Subscribed to clients real-time updates")
    return subscription
  }

  static subscribeToCaseNotes(callback: (payload: RealtimePayload<CaseNote>) => void) {
    if (!supabase) {
      console.log("📊 Real-time not available - using demo mode")
      return null
    }

    this.connectionStatus = "connecting"

    const subscription = supabase
      .channel("case-notes-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "case_notes",
        },
        (payload: any) => {
          console.log("🔄 Real-time case note update:", payload)
          this.connectionStatus = "connected"
          callback({
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
            table: "case_notes",
          })
        },
      )
      .subscribe((status: string) => {
        console.log("📡 Case notes subscription status:", status)
        if (status === "SUBSCRIBED") {
          this.connectionStatus = "connected"
        } else if (status === "CLOSED") {
          this.connectionStatus = "disconnected"
        }
      })

    this.subscriptions.set("case_notes", subscription)
    console.log("✅ Subscribed to case notes real-time updates")
    return subscription
  }

  static unsubscribe(tableName: string) {
    const subscription = this.subscriptions.get(tableName)
    if (subscription && supabase) {
      supabase.removeChannel(subscription)
      this.subscriptions.delete(tableName)
      console.log(`🔌 Unsubscribed from ${tableName} real-time updates`)
    }
  }

  static unsubscribeAll() {
    if (!supabase) return

    this.subscriptions.forEach((subscription, tableName) => {
      supabase.removeChannel(subscription)
      console.log(`🔌 Unsubscribed from ${tableName} real-time updates`)
    })
    this.subscriptions.clear()
    this.connectionStatus = "disconnected"
  }

  static getActiveSubscriptions() {
    return Array.from(this.subscriptions.keys())
  }
}

// Test real-time functionality
export const testRealtimeSync = async () => {
  console.log("🔄 Testing Real-time Sync...")

  if (!supabase) {
    console.log("⚠️ Real-time not available - Supabase not configured")
    return false
  }

  try {
    // Subscribe to clients changes
    const clientSubscription = RealtimeManager.subscribeToClients((payload) => {
      console.log("📡 Real-time client event:", payload.eventType, payload.new)
    })

    // Subscribe to case notes changes
    const notesSubscription = RealtimeManager.subscribeToCaseNotes((payload) => {
      console.log("📡 Real-time case note event:", payload.eventType, payload.new)
    })

    console.log("✅ Real-time subscriptions active")
    console.log("💡 Try making changes in another browser tab to see real-time updates")

    // Clean up after 30 seconds for testing
    setTimeout(() => {
      RealtimeManager.unsubscribeAll()
      console.log("🔌 Test subscriptions cleaned up")
    }, 30000)

    return true
  } catch (error: any) {
    console.error("❌ Real-time test failed:", error.message)
    return false
  }
}

// Make available globally for testing
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).testRealtimeSync = testRealtimeSync(window as any).RealtimeManager = RealtimeManager
}
