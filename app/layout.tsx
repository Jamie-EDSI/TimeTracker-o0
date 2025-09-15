import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseDiagnosticLoader } from "@/components/supabase-diagnostic-loader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeTracker - Client Management System",
  description: "Comprehensive client management with integrated reporting and database storage",
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
        <SupabaseDiagnosticLoader />
      </body>
    </html>
  )
}
