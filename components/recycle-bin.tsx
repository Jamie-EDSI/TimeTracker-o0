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
  first_name: string
  last_name: string
  participant_id: string
  program: string
  status: string
  enrollment_date: string
  phone: string
  email: string
  deleted_at: string
  deleted_by: string
}

interface RecycleBinProps {
  onBack: () => void
  onClientRestored?: () => void
}

export function RecycleBin({ onBack, onClientRestored }: RecycleBinProps) {
  const [deletedClients, setDeletedClients] = useState<DeletedClient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<DeletedClient | null>(null)
  const [actionType, setActionType] = useState<"restore" | "permanent">("restore")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDeletedClients()
  }, [])

  const loadDeletedClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const clients = await clientsApi.getDeleted()
      setDeletedClients(clients)
    } catch (error) {
      console.error("Error loading deleted clients:", error)
      setError("Failed to load deleted clients. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = (client: DeletedClient) => {
    setSelectedClient(client)
    setActionType("restore")
    setShowConfirmDialog(true)
  }

  const handlePermanentDelete = (client: DeletedClient) => {
    setSelectedClient(client)
    setActionType("permanent")
    setShowConfirmDialog(true)
  }

  const confirmAction = async () => {
    if (!selectedClient) return

    try {
      setIsLoading(true)
      setError(null)

      if (actionType === "restore") {
        await clientsApi.restore(selectedClient.id)
        setSuccessMessage(
          `Client ${selectedClient.first_name} ${selectedClient.last_name} has been successfully restored!`,
        )
        // Remove from deleted clients list
        setDeletedClients((prev) => prev.filter((client) => client.id !== selectedClient.id))
        // Notify parent component to refresh the main client list
        if (onClientRestored) {
          onClientRestored()
        }
      } else {
        await clientsApi.permanentDelete(selectedClient.id)
        setSuccessMessage(
          `Client ${selectedClient.first_name} ${selectedClient.last_name} has been permanently deleted.`,
        )
        // Remove from deleted clients list
        setDeletedClients((prev) => prev.filter((client) => client.id !== selectedClient.id))
      }

      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
    } catch (error) {
      console.error(`Error ${actionType === "restore" ? "restoring" : "deleting"} client:`, error)
      setError(`Failed to ${actionType === "restore" ? "restore" : "delete"} client. Please try again.`)
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
      setSelectedClient(null)
    }
  }

  const cancelAction = () => {
    setShowConfirmDialog(false)
    setSelectedClient(null)
  }

  const getFilteredClients = () => {
    if (!searchTerm.trim()) return deletedClients

    const searchLower = searchTerm.toLowerCase()
    return deletedClients.filter(
      (client) =>
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchLower) ||
        client.participant_id.toLowerCase().includes(searchLower) ||
        client.program.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.toLowerCase().includes(searchLower),
    )
  }

  const filteredClients = getFilteredClients()

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

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2" disabled={isLoading}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-600" />
                Recycle Bin
              </h1>
              <p className="text-gray-600">Manage deleted clients - restore or permanently delete</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-red-600">
              {filteredClients.length} deleted clients
            </Badge>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
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
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  actionType === "restore" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {actionType === "restore" ? (
                  <RotateCcw className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionType === "restore" ? "Restore Client" : "Permanently Delete Client"}
                </h3>
                <p className="text-sm text-gray-600">
                  {actionType === "restore" ? "This action will restore the client" : "This action cannot be undone"}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to {actionType === "restore" ? "restore" : "permanently delete"}{" "}
              <strong>
                {selectedClient.first_name} {selectedClient.last_name}
              </strong>
              ?
              {actionType === "permanent" && (
                <span className="block mt-2 text-red-600 font-medium">
                  This will permanently remove all client data and cannot be undone.
                </span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <Button onClick={cancelAction} variant="outline" disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                className={
                  actionType === "restore"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
                disabled={isLoading}
              >
                {isLoading
                  ? actionType === "restore"
                    ? "Restoring..."
                    : "Deleting..."
                  : actionType === "restore"
                    ? "Restore Client"
                    : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Search and Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search deleted clients by name, ID, program, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value || "")}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>Deleted clients are kept for 30 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deleted Clients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Deleted Clients ({filteredClients.length})</span>
              <Badge variant="secondary" className="text-red-600">
                {filteredClients.length} clients in recycle bin
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading deleted clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {deletedClients.length === 0 ? "No deleted clients" : "No clients found"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {deletedClients.length === 0 ? "The recycle bin is empty." : "Try adjusting your search criteria."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deleted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {client.first_name} {client.last_name}
                              </div>
                              <div className="text-sm text-gray-500">PID: {client.participant_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.program}</div>
                          <div className="text-sm text-gray-500">Enrolled: {formatDate(client.enrollment_date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(client.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.phone}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDateTime(client.deleted_at)}</div>
                          <div className="text-sm text-gray-500">by {client.deleted_by}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRestore(client)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={isLoading}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              onClick={() => handlePermanentDelete(client)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
