"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, RotateCcw, Trash2, AlertTriangle } from "lucide-react"
import { clientsApi } from "@/lib/supabase"

interface DeletedClient {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  email: string
  deletedAt: string
  deletedBy: string
}

interface RecycleBinProps {
  onBack: () => void
}

export function RecycleBin({ onBack }: RecycleBinProps) {
  const [deletedClients, setDeletedClients] = useState<DeletedClient[]>([])
  const [filteredClients, setFilteredClients] = useState<DeletedClient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRestoring, setIsRestoring] = useState<string | null>(null)
  const [isPermanentDeleting, setIsPermanentDeleting] = useState<string | null>(null)
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDeletedClients()
  }, [])

  useEffect(() => {
    // Filter clients based on search term
    if (searchTerm.trim()) {
      const filtered = deletedClients.filter((client) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchLower) ||
          client.participantId.toLowerCase().includes(searchLower) ||
          client.program.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.phone.toLowerCase().includes(searchLower)
        )
      })
      setFilteredClients(filtered)
    } else {
      setFilteredClients(deletedClients)
    }
  }, [searchTerm, deletedClients])

  const loadDeletedClients = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabaseClients = await clientsApi.getDeleted()
      const transformedClients = supabaseClients.map((client) => ({
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        participantId: client.participant_id,
        program: client.program,
        status: client.status,
        enrollmentDate: client.enrollment_date,
        phone: client.phone,
        email: client.email,
        deletedAt: client.deleted_at || "",
        deletedBy: client.deleted_by || "Unknown",
      }))

      setDeletedClients(transformedClients)
    } catch (error) {
      console.error("Error loading deleted clients:", error)
      setError("Failed to load deleted clients. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (clientId: string) => {
    try {
      setIsRestoring(clientId)
      setError(null)

      await clientsApi.restore(clientId)

      // Remove from deleted clients list
      setDeletedClients((prev) => prev.filter((client) => client.id !== clientId))

      setSuccessMessage("Client successfully restored!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error restoring client:", error)
      setError("Failed to restore client. Please try again.")
    } finally {
      setIsRestoring(null)
    }
  }

  const handlePermanentDeleteClick = (clientId: string) => {
    setShowPermanentDeleteConfirm(clientId)
  }

  const handlePermanentDeleteConfirm = async (clientId: string) => {
    try {
      setIsPermanentDeleting(clientId)
      setError(null)

      await clientsApi.permanentDelete(clientId)

      // Remove from deleted clients list
      setDeletedClients((prev) => prev.filter((client) => client.id !== clientId))

      setShowPermanentDeleteConfirm(null)
      setSuccessMessage("Client permanently deleted!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error permanently deleting client:", error)
      setError("Failed to permanently delete client. Please try again.")
      setShowPermanentDeleteConfirm(null)
    } finally {
      setIsPermanentDeleting(null)
    }
  }

  const handlePermanentDeleteCancel = () => {
    setShowPermanentDeleteConfirm(null)
  }

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
                <p className="text-gray-600">Deleted clients that can be restored</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-gray-600">
                {filteredClients.length} deleted clients
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">✓ {successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 01-1.414-1.414L10 11.414l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {showPermanentDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Permanent Delete</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this client? This action cannot be undone and all data will be
              lost forever.
            </p>
            <div className="flex gap-3 justify-end">
              <Button onClick={handlePermanentDeleteCancel} variant="outline" disabled={isPermanentDeleting}>
                Cancel
              </Button>
              <Button
                onClick={() => handlePermanentDeleteConfirm(showPermanentDeleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isPermanentDeleting}
              >
                {isPermanentDeleting ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Deleted Clients</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search deleted clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading deleted clients...</span>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <Trash2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  {searchTerm ? "No deleted clients match your search." : "No deleted clients found."}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline" size="sm" className="mt-2">
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
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
                          <span className="font-medium">PID:</span> {client.participantId}
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
                        <div>
                          <span className="font-medium">Enrollment:</span> {formatDate(client.enrollmentDate)}
                        </div>
                        <div>
                          <span className="font-medium">Deleted:</span> {formatDateTime(client.deletedAt)} by{" "}
                          {client.deletedBy}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleRestore(client.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isRestoring === client.id || isPermanentDeleting === client.id}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {isRestoring === client.id ? "Restoring..." : "Restore"}
                      </Button>
                      <Button
                        onClick={() => handlePermanentDeleteClick(client.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                        disabled={isRestoring === client.id || isPermanentDeleting === client.id}
                      >
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
