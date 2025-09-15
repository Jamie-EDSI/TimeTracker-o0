"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { ClientProfile } from "@/components/client-profile"
import { NewClientForm } from "@/components/new-client-form"
import { RecycleBin } from "@/components/recycle-bin"
import { ClientManagement } from "@/components/client-management"
import { ActiveClientsReport } from "@/components/active-clients-report"
import { AllClientsReport } from "@/components/all-clients-report"
import { CallLogReport } from "@/components/call-log-report"
import { JobsPlacementsReport } from "@/components/jobs-placements-report"
import { SupabaseStatusIndicator } from "@/components/supabase-status-indicator"
import { clientsApi, clientFilesApi } from "@/lib/supabase"

type View =
  | "dashboard"
  | "client-profile"
  | "new-client"
  | "recycle-bin"
  | "client-management"
  | "active-clients-report"
  | "all-clients-report"
  | "call-log-report"
  | "jobs-placements-report"

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
  educationLevel?: string
  graduationYear?: string
  schoolName?: string
  fieldOfStudy?: string
  educationNotes?: string
  currentlyEnrolled?: string
  gpa?: string
  certifications?: string
  licenses?: string
  industryCertifications?: string
  certificationStatus?: string
  certificationNotes?: string
  lastContact?: string
  lastModified?: string
  modifiedBy?: string
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const clientsData = await clientsApi.getAll()

      // Transform the data to match our component interface
      const transformedClients: Client[] = clientsData.map((client) => ({
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        participantId: client.participant_id,
        program: client.program,
        status: client.status,
        enrollmentDate: client.enrollment_date,
        phone: client.phone,
        cellPhone: client.cell_phone,
        email: client.email,
        address: client.address,
        city: client.city,
        state: client.state,
        zipCode: client.zip_code,
        dateOfBirth: client.date_of_birth,
        emergencyContact: client.emergency_contact,
        emergencyPhone: client.emergency_phone,
        caseManager: client.case_manager,
        responsibleEC: client.responsible_ec,
        requiredHours: client.required_hours?.toString(),
        caoNumber: client.cao_number,
        educationLevel: client.education_level,
        graduationYear: client.graduation_year?.toString(),
        schoolName: client.school_name,
        fieldOfStudy: client.field_of_study,
        educationNotes: client.education_notes,
        currentlyEnrolled: client.currently_enrolled,
        gpa: client.gpa?.toString(),
        certifications: client.certifications,
        licenses: client.licenses,
        industryCertifications: client.industry_certifications,
        certificationStatus: client.certification_status,
        certificationNotes: client.certification_notes,
        lastContact: client.last_contact,
        lastModified: client.last_modified,
        modifiedBy: client.modified_by,
        caseNotes: [], // Will be loaded separately when viewing client profile
      }))

      setClients(transformedClients)
    } catch (error) {
      console.error("Error loading clients:", error)
      setError("Failed to load clients")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setCurrentView("client-profile")
  }

  const handleNewClient = () => {
    setCurrentView("new-client")
  }

  const handleClientCreated = async (clientData: any) => {
    try {
      setIsLoading(true)
      setError(null)

      // Transform the form data to match the database schema
      const dbClientData = {
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        participant_id: clientData.participantId,
        program: clientData.program,
        status: clientData.status,
        enrollment_date: clientData.enrollmentDate,
        phone: clientData.phone,
        cell_phone: clientData.cellPhone || null,
        email: clientData.email,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zipCode,
        date_of_birth: clientData.dateOfBirth,
        emergency_contact: clientData.emergencyContact || null,
        emergency_phone: clientData.emergencyPhone || null,
        case_manager: clientData.caseManager,
        responsible_ec: clientData.responsibleEC || null,
        required_hours: clientData.requiredHours ? Number.parseInt(clientData.requiredHours) : null,
        cao_number: clientData.caoNumber || null,
        education_level: clientData.educationLevel || null,
        graduation_year: clientData.graduationYear ? Number.parseInt(clientData.graduationYear) : null,
        school_name: clientData.schoolName || null,
        field_of_study: clientData.fieldOfStudy || null,
        education_notes: clientData.educationNotes || null,
        currently_enrolled: clientData.currentlyEnrolled || null,
        gpa: clientData.gpa ? Number.parseFloat(clientData.gpa) : null,
        certifications: clientData.certifications || null,
        licenses: clientData.licenses || null,
        industry_certifications: clientData.industryCertifications || null,
        certification_status: clientData.certificationStatus || null,
        certification_notes: clientData.certificationNotes || null,
      }

      // Create the client in the database
      const createdClient = await clientsApi.create(dbClientData)

      // Handle file uploads if any
      if (clientData.certificationFiles && clientData.certificationFiles.length > 0) {
        for (const fileData of clientData.certificationFiles) {
          if (fileData.file) {
            try {
              await clientFilesApi.uploadFile(
                fileData.file,
                createdClient.id,
                "certification",
                `Uploaded during client creation: ${fileData.name}`,
                "System",
              )
            } catch (fileError) {
              console.warn("Failed to upload certification file:", fileData.name, fileError)
            }
          }
        }
      }

      if (clientData.educationFiles && clientData.educationFiles.length > 0) {
        for (const fileData of clientData.educationFiles) {
          if (fileData.file) {
            try {
              await clientFilesApi.uploadFile(
                fileData.file,
                createdClient.id,
                "education",
                `Uploaded during client creation: ${fileData.name}`,
                "System",
              )
            } catch (fileError) {
              console.warn("Failed to upload education file:", fileData.name, fileError)
            }
          }
        }
      }

      // Reload clients to include the new one
      await loadClients()

      // Navigate back to dashboard
      setCurrentView("dashboard")
    } catch (error) {
      console.error("Error creating client:", error)
      setError(error instanceof Error ? error.message : "Failed to create client")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientSaved = async (updatedClient: Client) => {
    try {
      setIsLoading(true)
      setError(null)

      // Transform the client data back to database format
      const dbClientData = {
        first_name: updatedClient.firstName,
        last_name: updatedClient.lastName,
        participant_id: updatedClient.participantId,
        program: updatedClient.program,
        status: updatedClient.status,
        enrollment_date: updatedClient.enrollmentDate,
        phone: updatedClient.phone,
        cell_phone: updatedClient.cellPhone || null,
        email: updatedClient.email,
        address: updatedClient.address,
        city: updatedClient.city,
        state: updatedClient.state,
        zip_code: updatedClient.zipCode,
        date_of_birth: updatedClient.dateOfBirth,
        emergency_contact: updatedClient.emergencyContact || null,
        emergency_phone: updatedClient.emergencyPhone || null,
        case_manager: updatedClient.caseManager,
        responsible_ec: updatedClient.responsibleEC || null,
        required_hours: updatedClient.requiredHours ? Number.parseInt(updatedClient.requiredHours) : null,
        cao_number: updatedClient.caoNumber || null,
        education_level: updatedClient.educationLevel || null,
        graduation_year: updatedClient.graduationYear ? Number.parseInt(updatedClient.graduationYear) : null,
        school_name: updatedClient.schoolName || null,
        field_of_study: updatedClient.fieldOfStudy || null,
        education_notes: updatedClient.educationNotes || null,
        currently_enrolled: updatedClient.currentlyEnrolled || null,
        gpa: updatedClient.gpa ? Number.parseFloat(updatedClient.gpa) : null,
        certifications: updatedClient.certifications || null,
        licenses: updatedClient.licenses || null,
        industry_certifications: updatedClient.industryCertifications || null,
        certification_status: updatedClient.certificationStatus || null,
        certification_notes: updatedClient.certificationNotes || null,
        last_modified: updatedClient.lastModified,
        modified_by: updatedClient.modifiedBy,
      }

      // Update the client in the database
      await clientsApi.update(updatedClient.id, dbClientData)

      // Update the local clients list
      setClients((prevClients) =>
        prevClients.map((client) => (client.id === updatedClient.id ? updatedClient : client)),
      )

      // Update the selected client if it's the same one
      if (selectedClient?.id === updatedClient.id) {
        setSelectedClient(updatedClient)
      }
    } catch (error) {
      console.error("Error saving client:", error)
      throw error // Re-throw to let the component handle the error display
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedClient(null)
    setError(null)
  }

  const handleViewRecycleBin = () => {
    setCurrentView("recycle-bin")
  }

  const handleViewClientManagement = () => {
    setCurrentView("client-management")
  }

  const handleViewActiveClientsReport = () => {
    setCurrentView("active-clients-report")
  }

  const handleViewAllClientsReport = () => {
    setCurrentView("all-clients-report")
  }

  const handleViewCallLogReport = () => {
    setCurrentView("call-log-report")
  }

  const handleViewJobsPlacementsReport = () => {
    setCurrentView("jobs-placements-report")
  }

  // Render the appropriate view
  const renderCurrentView = () => {
    switch (currentView) {
      case "client-profile":
        return selectedClient ? (
          <ClientProfile client={selectedClient} onBack={handleBackToDashboard} onSave={handleClientSaved} />
        ) : (
          <div>No client selected</div>
        )

      case "new-client":
        return (
          <NewClientForm onClientCreated={handleClientCreated} onCancel={handleBackToDashboard} isLoading={isLoading} />
        )

      case "recycle-bin":
        return <RecycleBin onBack={handleBackToDashboard} onClientRestored={loadClients} />

      case "client-management":
        return (
          <ClientManagement
            onBack={handleBackToDashboard}
            clients={clients}
            onViewClient={handleViewClient}
            onClientUpdated={loadClients}
          />
        )

      case "active-clients-report":
        return (
          <ActiveClientsReport
            onBack={handleBackToDashboard}
            clients={clients.filter((client) => client.status === "Active")}
          />
        )

      case "all-clients-report":
        return <AllClientsReport onBack={handleBackToDashboard} clients={clients} />

      case "call-log-report":
        return <CallLogReport onBack={handleBackToDashboard} />

      case "jobs-placements-report":
        return <JobsPlacementsReport onBack={handleBackToDashboard} />

      default:
        return (
          <Dashboard
            clients={clients}
            onViewClient={handleViewClient}
            onNewClient={handleNewClient}
            onViewRecycleBin={handleViewRecycleBin}
            onViewClientManagement={handleViewClientManagement}
            onViewActiveClientsReport={handleViewActiveClientsReport}
            onViewAllClientsReport={handleViewAllClientsReport}
            onViewCallLogReport={handleViewCallLogReport}
            onViewJobsPlacementsReport={handleViewJobsPlacementsReport}
            isLoading={isLoading}
            error={error}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Supabase Status Indicator - Only show on dashboard */}
      {currentView === "dashboard" && (
        <div className="fixed top-4 right-4 z-50">
          <SupabaseStatusIndicator />
        </div>
      )}

      {renderCurrentView()}
    </div>
  )
}
