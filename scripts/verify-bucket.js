// Console script to verify the client-files bucket
// Run this in the browser console to check bucket status

async function verifyClientFilesBucket() {
  try {
    console.log("🔍 Starting bucket verification...")

    // Check if the function is available
    if (typeof window.verifyClientFilesBucket === "function") {
      const result = await window.verifyClientFilesBucket()
      console.log("📊 Bucket verification result:", result)

      if (result.exists) {
        console.log("✅ SUCCESS: client-files bucket is working properly!")
        if (result.accessible) {
          console.log("✅ Bucket is accessible and ready for file operations")
          console.log(`📁 Current file count: ${result.fileCount || 0}`)
        }
      } else {
        console.log("❌ ISSUE: client-files bucket not found")
        console.log("Available buckets:", result.buckets)
        console.log("💡 Create the bucket in Supabase Storage dashboard or run complete-setup.sql")
      }

      return result
    } else {
      console.error("❌ verifyClientFilesBucket function not available")
      console.log("💡 Make sure you are on the correct page and Supabase is loaded")
    }
  } catch (error) {
    console.error("🚨 Verification failed:", error)
  }
}

// Run the verification
verifyClientFilesBucket()
