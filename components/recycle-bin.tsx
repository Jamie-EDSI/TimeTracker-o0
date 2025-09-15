"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, RotateCcw, Trash2, Search, AlertCircle, RefreshCw } from "lucide-react"
import { clientsApi, type Client as SupabaseClient } from "@/lib/supabase"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  email: string
  deletedAt?: string
  deletedBy?: string
}

// Transform Supabase client to component client format
const transformSupabaseClient = (supabaseClient: SupabaseClient): Client => ({
  id: supabaseClient.id,
  firstName: supabaseClient.first_name,
  lastName: supabaseClient.last_name,
  participantId: supabaseClient.participant_id,
  program: supabaseClient.program,
  status: supabaseClient.status,
  enrollmentDate: supabaseClient.enrollment_date,
  phone: supabaseClient.phone,
  email: supabaseClient.email,
  deletedAt: supabaseClient.deleted_at,
  deletedBy: supabaseClient.deleted_by,
})

interface RecycleBinProps {
  onBack: () => void
  onClientRestored?: () => void
}

export function RecycleBin({ onBack, onClientRestored }: RecycleBinProps) {
  const [deletedClients, setDeletedClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [softDeleteSupported, setSoftDeleteSupported] = useState(true)

  useEffect(() => {
    loadDeletedClients()
  }, [])

  const loadDeletedClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabaseClients = await clientsApi.getDeleted()

      if (supabaseClients.length === 0) {
        // Check if this is because soft delete is not supported
        setSoftDeleteSupported(false)
      }

      const transformedClients = supabaseClients.map(transformSupabaseClient)
      setDeletedClients(transformedClients)
    } catch (error: any) {
      console.error("Error loading deleted clients:", error)
      if (error.message.includes("deleted_at") && error.message.includes("does not exist")) {
        setSoftDeleteSupported(false)
        setError(
          "Soft delete feature is not available. The database schema needs to be updated to support recycle bin functionality.",
        )
      } else {
        setError("Failed to load deleted clients. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (client: Client) => {
    if (!softDeleteSupported) {
      setError("Restore is not available because soft delete is not supported.")
      return
    }

    try {
      setIsLoading(true)
      await clientsApi.restore(client.id)

      // Remove from deleted clients list
      setDeletedClients((prev) => prev.filter((c) => c.id !== client.id))

      // Notify parent component
      onClientRestored?.()

      console.log(`✅ Client ${client.firstName} ${client.lastName} restored successfully`)
    } catch (error: any) {
      console.error("Error restoring client:", error)
      setError(`Failed to restore client: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermanentDelete = async (client: Client) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete ${client.firstName} ${client.lastName}? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      setIsLoading(true)
      await clientsApi.permanentDelete(client.id)

      // Remove from deleted clients list
      setDeletedClients((prev) => prev.filter((c) => c.id !== client.id))

      console.log(`✅ Client ${client.firstName} ${client.lastName} permanently deleted`)
    } catch (error: any) {
      console.error("Error permanently deleting client:", error)
      setError(`Failed to permanently delete client: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClients = deletedClients.filter((client) => {
    if (!searchTerm.trim()) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchLower) ||
      client.participantId.toLowerCase().includes(searchLower) ||
      client.program.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={loadDeletedClients}
              disabled={isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                {!softDeleteSupported && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600">
                      To enable the recycle bin feature, run the soft delete schema migration in your Supabase database.
                    </p>
                  </div>
                )}
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Soft Delete Not Supported Warning */}
        {!softDeleteSupported && !error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Recycle Bin Not Available</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  The recycle bin feature requires soft delete support in your database. Run the soft delete schema
                  migration to enable this feature.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Deleted Clients ({filteredClients.length})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search deleted clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-3 text-gray-600">Loading deleted clients...</span>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {softDeleteSupported ? "No deleted clients" : "Recycle bin not available"}
                </h3>
                <p className="text-gray-600">
                  {softDeleteSupported
                    ? "All clients are currently active. Deleted clients will appear here."
                    : "Enable soft delete support to use the recycle bin feature."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        {getStatusBadge(client.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Participant ID:</span> {client.participantId}
                        </div>
                        <div>
                          <span className="font-medium">Program:</span> {client.program}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {client.phone}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {client.email}
                        </div>
                        {client.deletedAt && (
                          <div className="col-span-2">
                            <span className="font-medium">Deleted:</span> {new Date(client.deletedAt).toLocaleString()}
                            {client.deletedBy && <span className="ml-2">by {client.deletedBy}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {softDeleteSupported && (
                        <Button
                          onClick={() => handleRestore(client)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                      <Button onClick={() => handlePermanentDelete(client)} disabled={isLoading} variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Forever
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
