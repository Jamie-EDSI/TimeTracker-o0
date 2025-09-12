"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Search,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Calendar,
  User,
  Filter,
  RefreshCw,
  Archive,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { clientsApi, type Client as SupabaseClient, isSoftDeleteSupported } from "@/lib/supabase"

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
  cellPhone: supabaseClient.cell_phone,
  email: supabaseClient.email,
  address: supabaseClient.address,
  city: supabaseClient.city,
  state: supabaseClient.state,
  zipCode: supabaseClient.zip_code,
  dateOfBirth: supabaseClient.date_of_birth,
  emergencyContact: supabaseClient.emergency_contact,
  emergencyPhone: supabaseClient.emergency_phone,
  caseManager: supabaseClient.case_manager,
  responsibleEC: supabaseClient.responsible_ec,
  requiredHours: supabaseClient.required_hours?.toString(),
  caoNumber: supabaseClient.cao_number,
  educationLevel: supabaseClient.education_level,
  graduationYear: supabaseClient.graduation_year?.toString(),
  schoolName: supabaseClient.school_name,
  fieldOfStudy: supabaseClient.field_of_study,
  educationNotes: supabaseClient.education_notes,
  currentlyEnrolled: supabaseClient.currently_enrolled,
  gpa: supabaseClient.gpa?.toString(),
  certifications: supabaseClient.certifications,
  licenses: supabaseClient.licenses,
  industryCertifications: supabaseClient.industry_certifications,
  certificationStatus: supabaseClient.certification_status,
  certificationNotes: supabaseClient.certification_notes,
  createdAt: supabaseClient.created_at,
  lastContact: supabaseClient.last_contact,
  lastModified: supabaseClient.last_modified,
  modifiedBy: supabaseClient.modified_by,
  deletedAt: supabaseClient.deleted_at,
  deletedBy: supabaseClient.deleted_by,
  caseNotes: [], // Will be loaded separately if needed
})

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  status: string
  enrollmentDate: string
  phone: string
  cellPhone?: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth: string
  emergencyContact?: string
  emergencyPhone?: string
  caseManager: string
  responsibleEC?: string
  requiredHours?: string
  caoNumber?: string
  createdAt?: string
  lastContact?: string
  lastModified?: string
  modifiedBy?: string
  deletedAt?: string
  deletedBy?: string
  // Education fields
  educationLevel?: string
  graduationYear?: string
  schoolName?: string
  fieldOfStudy?: string
  educationNotes?: string
  currentlyEnrolled?: string
  gpa?: string
  // Certification fields
  certifications?: string
  licenses?: string
  industryCertifications?: string
  certificationStatus?: string
  certificationNotes?: string
  // Case notes field
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

interface RecycleBinProps {
  onBack: () => void
  onClientRestored: (client: Client) => void
}

export function RecycleBin({ onBack, onClientRestored }: RecycleBinProps) {
  const [deletedClients, setDeletedClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isPermanentDeleting, setIsPermanentDeleting] = useState(false)
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [showBulkPermanentDeleteDialog, setShowBulkPermanentDeleteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [softDeleteSupported, setSoftDeleteSupported] = useState(false)

  // Load deleted clients on component mount
  useEffect(() => {
    loadDeletedClients()
    checkSoftDeleteSupport()
  }, [])

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = deletedClients.filter((client) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchLower) ||
          client.participantId.toLowerCase().includes(searchLower) ||
          client.program.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.caseManager.toLowerCase().includes(searchLower)
        )
      })
      setFilteredClients(filtered)
    } else {
      setFilteredClients(deletedClients)
    }
  }, [searchTerm, deletedClients])

  const checkSoftDeleteSupport = async () => {
    try {
      const supported = await isSoftDeleteSupported()
      setSoftDeleteSupported(supported)
    } catch (error) {
      console.error("Error checking soft delete support:", error)
      setSoftDeleteSupported(false)
    }
  }

  const loadDeletedClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabaseClients = await clientsApi.getDeleted()
      const transformedClients = supabaseClients.map(transformSupabaseClient)
      setDeletedClients(transformedClients)
    } catch (error) {
      console.error("Error loading deleted clients:", error)
      setError("Failed to load deleted clients. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreClient = async (client: Client) => {
    try {
      setIsRestoring(true)
      const restoredSupabaseClient = await clientsApi.restore(client.id, "Current User")
      const restoredClient = transformSupabaseClient(restoredSupabaseClient)

      // Remove from deleted clients list
      setDeletedClients((prev) => prev.filter((c) => c.id !== client.id))
      setSelectedClients((prev) => {
        const newSet = new Set(prev)
        newSet.delete(client.id)
        return newSet
      })

      // Notify parent component
      onClientRestored(restoredClient)
    } catch (error) {
      console.error("Error restoring client:", error)
      setError("Failed to restore client. Please try again.")
    } finally {
      setIsRestoring(false)
    }
  }

  const handlePermanentDeleteClient = async (client: Client) => {
    try {
      setIsPermanentDeleting(true)
      await clientsApi.permanentDelete(client.id)

      // Remove from deleted clients list
      setDeletedClients((prev) => prev.filter((c) => c.id !== client.id))
      setSelectedClients((prev) => {
        const newSet = new Set(prev)
        newSet.delete(client.id)
        return newSet
      })

      setShowPermanentDeleteDialog(false)
      setClientToDelete(null)
    } catch (error) {
      console.error("Error permanently deleting client:", error)
      setError("Failed to permanently delete client. Please try again.")
    } finally {
      setIsPermanentDeleting(false)
    }
  }

  const handleBulkRestore = async () => {
    if (selectedClients.size === 0) return

    try {
      setIsRestoring(true)
      const clientsToRestore = deletedClients.filter((client) => selectedClients.has(client.id))

      for (const client of clientsToRestore) {
        const restoredSupabaseClient = await clientsApi.restore(client.id, "Current User")
        const restoredClient = transformSupabaseClient(restoredSupabaseClient)
        onClientRestored(restoredClient)
      }

      // Remove restored clients from the list
      setDeletedClients((prev) => prev.filter((client) => !selectedClients.has(client.id)))
      setSelectedClients(new Set())
    } catch (error) {
      console.error("Error restoring clients:", error)
      setError("Failed to restore some clients. Please try again.")
    } finally {
      setIsRestoring(false)
    }
  }

  const handleBulkPermanentDelete = async () => {
    if (selectedClients.size === 0) return

    try {
      setIsPermanentDeleting(true)
      const clientsToDelete = deletedClients.filter((client) => selectedClients.has(client.id))

      for (const client of clientsToDelete) {
        await clientsApi.permanentDelete(client.id)
      }

      // Remove deleted clients from the list
      setDeletedClients((prev) => prev.filter((client) => !selectedClients.has(client.id)))
      setSelectedClients(new Set())
      setShowBulkPermanentDeleteDialog(false)
    } catch (error) {
      console.error("Error permanently deleting clients:", error)
      setError("Failed to permanently delete some clients. Please try again.")
    } finally {
      setIsPermanentDeleting(false)
    }
  }

  const handleSelectClient = (clientId: string, checked: boolean) => {
    setSelectedClients((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(clientId)
      } else {
        newSet.delete(clientId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(new Set(filteredClients.map((client) => client.id)))
    } else {
      setSelectedClients(new Set())
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  if (!softDeleteSupported) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={onBack} variant="ghost" size="sm" className="text-blue-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Archive className="w-6 h-6 text-red-500" />
                  Recycle Bin
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Not Available Message */}
        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Archive className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Recycle Bin Not Available</h2>
              <p className="text-gray-600 mb-6">
                The recycle bin feature requires database schema updates. Please run the schema update script to enable
                soft delete functionality.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
                <h3 className="font-medium text-blue-900 mb-2">To enable the recycle bin:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Run the SQL script: scripts/supabase-schema-update.sql</li>
                  <li>This will add the necessary columns for soft delete</li>
                  <li>Refresh the page to use the recycle bin</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm" className="text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Archive className="w-6 h-6 text-red-500" />
                Recycle Bin
              </h1>
              <Badge variant="secondary" className="ml-2">
                {deletedClients.length} deleted records
              </Badge>
            </div>
            <Button onClick={loadDeletedClients} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
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

      {/* Content */}
      <div className="p-6">
        {/* Search and Actions Bar */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search deleted clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Bulk Actions */}
          {selectedClients.size > 0 && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <span className="text-sm font-medium text-blue-900">
                {selectedClients.size} client{selectedClients.size !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkRestore}
                  disabled={isRestoring || isPermanentDeleting}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isRestoring ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore Selected
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowBulkPermanentDeleteDialog(true)}
                  disabled={isRestoring || isPermanentDeleting}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Permanently Delete Selected
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg font-medium">Loading deleted clients...</span>
          </div>
        ) : filteredClients.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="p-12 text-center">
              <Archive className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No matching deleted clients" : "Recycle bin is empty"}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms to find deleted clients."
                  : "Deleted client records will appear here and can be restored if needed."}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Clients List */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Deleted Clients
                  <Badge variant="secondary">{filteredClients.length}</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedClients.size === filteredClients.length && filteredClients.length > 0}
                    onCheckedChange={handleSelectAll}
                    disabled={isRestoring || isPermanentDeleting}
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <div key={client.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedClients.has(client.id)}
                        onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                        disabled={isRestoring || isPermanentDeleting}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </h3>
                            {getStatusBadge(client.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleRestoreClient(client)}
                              disabled={isRestoring || isPermanentDeleting}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restore
                            </Button>
                            <Button
                              onClick={() => {
                                setClientToDelete(client)
                                setShowPermanentDeleteDialog(true)
                              }}
                              disabled={isRestoring || isPermanentDeleting}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Forever
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Participant ID:</span>
                            <br />
                            {client.participantId}
                          </div>
                          <div>
                            <span className="font-medium">Program:</span>
                            <br />
                            {client.program}
                          </div>
                          <div>
                            <span className="font-medium">Case Manager:</span>
                            <br />
                            {client.caseManager}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>
                            <br />
                            {client.email}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Deleted: {formatDate(client.deletedAt)}</span>
                          </div>
                          {client.deletedBy && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>By: {client.deletedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={showPermanentDeleteDialog} onOpenChange={setShowPermanentDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Permanently Delete Client
            </DialogTitle>
            <DialogDescription>
              {clientToDelete && (
                <>
                  <p className="mb-3">
                    You are about to permanently delete{" "}
                    <strong>
                      {clientToDelete.firstName} {clientToDelete.lastName}
                    </strong>{" "}
                    (ID: {clientToDelete.participantId}).
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800 font-medium">⚠️ This action cannot be undone!</p>
                    <p className="text-sm text-red-700 mt-1">
                      The client record and all associated data will be permanently removed from the database.
                    </p>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPermanentDeleteDialog(false)}
              disabled={isPermanentDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => clientToDelete && handlePermanentDeleteClient(clientToDelete)}
              disabled={isPermanentDeleting}
              className="flex-1"
            >
              {isPermanentDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Forever
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Permanent Delete Confirmation Dialog */}
      <Dialog open={showBulkPermanentDeleteDialog} onOpenChange={setShowBulkPermanentDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Permanently Delete Multiple Clients
            </DialogTitle>
            <DialogDescription>
              <p className="mb-3">
                You are about to permanently delete <strong>{selectedClients.size}</strong> client
                {selectedClients.size !== 1 ? "s" : ""}.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800 font-medium">⚠️ This action cannot be undone!</p>
                <p className="text-sm text-red-700 mt-1">
                  All selected client records and their associated data will be permanently removed from the database.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBulkPermanentDeleteDialog(false)}
              disabled={isPermanentDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkPermanentDelete}
              disabled={isPermanentDeleting}
              className="flex-1"
            >
              {isPermanentDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete {selectedClients.size} Forever
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
