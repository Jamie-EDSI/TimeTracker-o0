import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SetupStatusIndicator } from "@/components/setup-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EDSI Client Management System",
  description: "Comprehensive client management system for EDSI programs",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <img src="/images/edsi-new-logo.jpg" alt="EDSI Logo" className="h-10 w-auto" />
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold text-gray-900">Client Management System</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, User</span>
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
        <SetupStatusIndicator />
      </body>
    </html>
  )
}
