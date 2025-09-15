"use client";

import { useEffect } from "react";

export function SupabaseDiagnosticLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const loadDiagnosticFunctions = async () => {
      try {
        console.log("🔧 Loading Supabase diagnostic functions...");

        // Dynamically import diagnostic module
        const diagnosticModule = await import("@/lib/supabase-diagnostic");
        const { runSupabaseDiagnostic, SupabaseDiagnostic } = diagnosticModule;

        if (typeof window === "undefined") return;

        const w = window as any;

        // Attach main diagnostics
        w.runSupabaseDiagnostic = runSupabaseDiagnostic;
        w.SupabaseDiagnostic = SupabaseDiagnostic;

        // Optional modules
        try {
          w.testSupabase = (await import("@/lib/supabase-test")).testSupabase;
        } catch (err) {
          console.warn("⚠️ Could not load supabase-test module:", err);
        }

        try {
          w.checkSupabaseSetup = (await import("@/lib/supabase-setup-checker")).checkSupabaseSetup;
        } catch (err) {
          console.warn("⚠️ Could not load supabase-setup-checker module:", err);
        }

        // 🔥 Table-agnostic CRUD tester
        w.testSupabaseSync = async (
          tableName = "clients",
          sampleData = {
            first_name: "Sync",
            last_name: "Test",
            participant_id: `SYNC-${Date.now()}`,
            program: "Test Program",
            status: "Active",
            enrollment_date: new Date().toISOString().split("T")[0],
            phone: "555-0123",
            email: "synctest@example.com",
            address: "123 Sync St",
            city: "Test City",
            state: "TS",
            zip_code: "12345",
            date_of_birth: "1990-01-01",
            case_manager: "Sync Manager",
          }
        ) => {
          console.group(`🔄 Supabase CRUD Test for table: ${tableName}`);

          try {
            const { createClient } = await import("@supabase/supabase-js");
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
              console.error("❌ Missing Supabase credentials");
              console.log({
                NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "✅ Set" : "❌ Missing",
                NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? "✅ Set" : "❌ Missing",
              });
              return;
            }

            const supabase = createClient(supabaseUrl, supabaseKey);
            let recordId: number | string | undefined;

            // CREATE
            console.log("🟢 CREATE test...");
            const { data: created, error: createError } = await supabase
              .from(tableName)
              .insert([sampleData])
              .select()
              .single();

            if (createError || !created?.id) {
              console.error("❌ CREATE failed:", createError || "No ID returned");
            } else {
              console.log("✅ CREATE successful:", created);
              recordId = created.id;
            }

            // READ
            if (recordId) {
              console.log("🟢 READ test...");
              const { data: read, error: readError } = await supabase
                .from(tableName)
                .select("*")
                .eq("id", recordId)
                .single();

              if (readError) console.error("❌ READ failed:", readError);
              else console.log("✅ READ successful:", read);
            }

            // UPDATE
            if (recordId) {
              console.log("🟢 UPDATE test...");
              const { data: updated, error: updateError } = await supabase
                .from(tableName)
                .update({ updated_at: new Date().toISOString() })
                .eq("id", recordId)
                .select()
                .single();

              if (updateError) console.error("❌ UPDATE failed:", updateError);
              else console.log("✅ UPDATE successful:", updated);
            }

            // DELETE
            if (recordId) {
              console.log("🟢 DELETE test...");
              const { error: deleteError } = await supabase.from(tableName).delete().eq("id", recordId);
              if (deleteError) console.error("❌ DELETE failed:", deleteError);
              else console.log("✅ DELETE successful");
            }

            console.log("🎉 CRUD test completed!");
          } catch (err) {
            console.error("❌ Unexpected error in testSupabaseSync:", err);
          } finally {
            console.groupEnd();
          }
        };

        // Simple environment check
        w.checkEnvironment = () => {
          console.log("🔍 Environment Variables Check:");
          console.log("NODE_ENV:", process.env.NODE_ENV);
          console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
          console.log(
            "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"
          );
          if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            console.log("URL Value:", process.env.NEXT_PUBLIC_SUPABASE_URL);
          }
          if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.log(
              "Key Value (first 20 chars):",
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + "..."
            );
          }
        };

        console.log("✅ Diagnostic functions loaded!");
        console.log("📋 Available commands:");
        console.log("  🔍 runSupabaseDiagnostic()");
        console.log("  🧪 testSupabaseSync(tableName, sampleData)");
        console.log("  🌍 checkEnvironment()");
        console.log("  ⚙️ testSupabase()");
        console.log("  🔧 checkSupabaseSetup()");

        if (typeof w.runSupabaseDiagnostic === "function") {
          console.log("✅ runSupabaseDiagnostic is ready to use!");
        } else {
          console.error("❌ runSupabaseDiagnostic failed to load properly");
        }
      } catch (err) {
        console.error("❌ Failed to load diagnostic functions:", err);
      }
    };

    const timer = setTimeout(loadDiagnosticFunctions, 300); // delay for hydration
    return () => clearTimeout(timer);
  }, []);

  return null; // Component doesn't render anything
}
