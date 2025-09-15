import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseStatusIndicator } from "@/components/supabase-status-indicator"
import { SupabaseDiagnosticLoader } from "@/components/supabase-diagnostic-loader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeTracker - Client Management System",
  description: "EDSI Client Management and Time Tracking System",
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
        {children}
        <SupabaseStatusIndicator />
        <SupabaseDiagnosticLoader />
      </body>
    </html>
  )
}
