// Server-side Supabase client that uses the service role key to bypass RLS
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

console.log("[v0] Server Supabase config:", {
  hasUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyLength: supabaseServiceKey?.length || 0,
})

export const supabaseServer = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

export function hasServerAccess() {
  return !!supabaseServer
}
