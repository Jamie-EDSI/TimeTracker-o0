import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseStatusIndicator } from "@/components/supabase-status-indicator"

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
        {/* Load test functions in development */}
        {process.env.NODE_ENV === "development" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log('🔧 Loading Supabase test functions...');
                
                // Simple function to load test functions
                function loadTestFunctions() {
                  try {
                    // These will be available once the modules load
                    if (typeof window !== 'undefined') {
                      // Set a flag that functions should be loaded
                      window._loadSupabaseTests = true;
                      
                      // Try to load them periodically until successful
                      const checkInterval = setInterval(() => {
                        if (window.testSupabase && window.testSupabaseSync && window.checkSupabaseSetup) {
                          console.log('✅ All Supabase test functions are now available!');
                          console.log('Available commands:');
                          console.log('  - testSupabase()');
                          console.log('  - testSupabaseSync()');
                          console.log('  - checkSupabaseSetup()');
                          clearInterval(checkInterval);
                        }
                      }, 1000);
                      
                      // Clear interval after 30 seconds to avoid infinite checking
                      setTimeout(() => clearInterval(checkInterval), 30000);
                    }
                  } catch (error) {
                    console.log('Test functions will be available after page interaction');
                  }
                }
                
                // Load functions when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', loadTestFunctions);
                } else {
                  loadTestFunctions();
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
