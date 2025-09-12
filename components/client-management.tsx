"use client"

import { useState } from "react"
import { Dashboard } from "./dashboard"
import { ClientProfile } from "./client-profile"
import { NewClientForm } from "./new-client-form"
import { ActiveClientsReport } from "./active-clients-report"
import { CallLogReport } from "./call-log-report"
import { JobsPlacementsReport } from "./jobs-placements-report"
import { AllClientsReport } from "./all-clients-report"

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
  isNew?: boolean
  createdAt?: string
  lastContact?: string
  caseNotes?: Array<{
    id: string
    note: string
    date: string
    author: string
  }>
}

export function ClientManagement() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "client-profile" | "new-client" | "active-clients" | "call-log" | "jobs-placements" | "all-clients"
  >("dashboard")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      participantId: "2965145",
      program: "EARN",
      status: "Active",
      enrollmentDate: "2023-02-20",
      phone: "484-555-0201",
      email: "sarah.johnson@email.com",
      address: "456 Oak Ave",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19102",
      dateOfBirth: "1990-07-15",
      emergencyContact: "Mike Johnson",
      emergencyPhone: "484-555-0203",
      caseManager: "Brown, Lisa",
      createdAt: "2023-02-20T10:00:00Z",
      lastContact: "2023-11-15T14:30:00Z",
      caseNotes: [
        {
          id: "note_1",
          note: "Initial assessment completed. Client shows strong motivation for job placement.",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          author: "Case Manager",
        },
        {
          id: "note_2",
          note: "Enrolled in Job Readiness program. Scheduled for skills assessment next week.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          author: "Employment Counselor",
        },
      ],
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Davis",
      participantId: "2965146",
      program: "Job Readiness",
      status: "Active",
      enrollmentDate: "2023-03-15",
      phone: "215-555-0102",
      email: "michael.davis@email.com",
      address: "789 Pine St",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19103",
      dateOfBirth: "1985-12-03",
      emergencyContact: "Jennifer Davis",
      emergencyPhone: "215-555-0104",
      caseManager: "Smith, John",
      createdAt: "2023-03-15T09:00:00Z",
      lastContact: "2023-11-14T13:15:00Z",
      caseNotes: [
        {
          id: "note_3",
          note: "Client completed job readiness workshop. Showing excellent progress in interview skills.",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          author: "Employment Counselor",
        },
      ],
    },
    {
      id: "3",
      firstName: "Emily",
      lastName: "Rodriguez",
      participantId: "2965147",
      program: "YOUTH",
      status: "Pending",
      enrollmentDate: "2023-04-01",
      phone: "267-555-0301",
      email: "emily.rodriguez@email.com",
      address: "321 Maple Dr",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19104",
      dateOfBirth: "2001-09-22",
      emergencyContact: "Carlos Rodriguez",
      emergencyPhone: "267-555-0302",
      caseManager: "Johnson, Mary",
      createdAt: "2023-04-01T11:00:00Z",
      lastContact: "2023-11-13T10:45:00Z",
      caseNotes: [],
    },
  ])

  const handleNavigate = (view: string) => {
    setCurrentView(view as any)
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setCurrentView("client-profile")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedClient(null)
  }

  const handleSaveClient = (updatedClient: Client) => {
    setClients((prevClients) => prevClients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
    setSelectedClient(updatedClient)
  }

  const handleClientCreated = (clientData: any) => {
    const newClient: Client = {
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...clientData,
      isNew: true,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
    }

    setClients((prevClients) => [newClient, ...prevClients])
    setCurrentView("dashboard")
  }

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log("Searching for:", query)
  }

  if (currentView === "client-profile" && selectedClient) {
    return <ClientProfile client={selectedClient} onBack={handleBackToDashboard} onSave={handleSaveClient} />
  }

  if (currentView === "new-client") {
    return <NewClientForm onClientCreated={handleClientCreated} onCancel={handleBackToDashboard} isLoading={false} />
  }

  if (currentView === "active-clients") {
    return <ActiveClientsReport onBack={handleBackToDashboard} clients={clients} onViewClient={handleViewClient} />
  }

  if (currentView === "call-log") {
    return <CallLogReport onBack={handleBackToDashboard} clients={clients} />
  }

  if (currentView === "jobs-placements") {
    return <JobsPlacementsReport onBack={handleBackToDashboard} clients={clients} />
  }

  if (currentView === "all-clients") {
    return <AllClientsReport onBack={handleBackToDashboard} clients={clients} onViewClient={handleViewClient} />
  }

  return (
    <Dashboard onNavigate={handleNavigate} onSearch={handleSearch} clients={clients} onViewClient={handleViewClient} />
  )
}
