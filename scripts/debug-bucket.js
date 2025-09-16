// Enhanced bucket debugging script for client-files bucket
// Run this in the browser console to get detailed bucket information

async function debugClientFilesBucket() {
  console.log("🔍 Starting comprehensive bucket debugging for client-files...")

  try {
    // Check if Supabase is available
    if (typeof window.verifyClientFilesBucket !== "function") {
      console.error("❌ verifyClientFilesBucket function not available")
      console.log("💡 Make sure you are on the correct page and the app has loaded")
      return
    }

    // Run the verification
    console.log("🔄 Running bucket verification...")
    const result = await window.verifyClientFilesBucket()

    console.log("📊 BUCKET VERIFICATION RESULTS:")
    console.log("================================")
    console.log("Bucket Name: client-files (with hyphen)")
    console.log("Exists:", result.exists ? "✅ YES" : "❌ NO")
    console.log("Accessible:", result.accessible ? "✅ YES" : "❌ NO")
    console.log("File Count:", result.fileCount || "Unknown")
    console.log("Error:", result.error || "None")

    if (result.buckets && result.buckets.length > 0) {
      console.log("\n📦 AVAILABLE BUCKETS:")
      result.buckets.forEach((bucket, index) => {
        console.log(`${index + 1}. ${bucket}`)
      })
    } else {
      console.log("\n📦 No buckets found")
    }

    if (result.similarBuckets && result.similarBuckets.length > 0) {
      console.log("\n🔍 SIMILAR BUCKETS FOUND:")
      result.similarBuckets.forEach((bucket, index) => {
        console.log(`${index + 1}. ${bucket}`)
      })
    }

    console.log("\n📋 INSTRUCTIONS:")
    result.instructions.forEach((instruction, index) => {
      console.log(`${index + 1}. ${instruction}`)
    })

    // Additional debugging
    if (result.exists) {
      console.log("\n✅ SUCCESS: client-files bucket is properly configured!")

      // Test file operations if accessible
      if (result.accessible && typeof window.clientFilesApi !== "undefined") {
        console.log("\n🧪 Testing file operations...")
        try {
          // Create a test file
          const testContent = new Blob([`Test file created at ${new Date().toISOString()}`], {
            type: "text/plain",
          })
          const testFile = new File([testContent], "debug-test.txt", { type: "text/plain" })

          console.log("📤 Uploading test file...")
          const uploadResult = await window.clientFilesApi.uploadFile(
            testFile,
            "debug-test-client",
            "general",
            "Debug test file",
          )

          console.log("✅ Test file uploaded successfully:", uploadResult.id)

          // Try to retrieve files
          console.log("📥 Retrieving files...")
          const files = await window.clientFilesApi.getByClientId("debug-test-client")
          console.log("✅ Files retrieved:", files.length)

          // Clean up
          if (uploadResult.id) {
            console.log("🗑️ Cleaning up test file...")
            await window.clientFilesApi.deleteFile(uploadResult.id, "Debug Script")
            console.log("✅ Test file cleaned up")
          }
        } catch (testError) {
          console.warn("⚠️ File operations test failed:", testError.message)
        }
      }
    } else {
      console.log("\n❌ ISSUE: client-files bucket not found")
      console.log("💡 Please create the bucket manually or run the setup script")
      console.log("💡 Make sure the bucket name is exactly 'client-files' (with hyphen)")
    }

    return result
  } catch (error) {
    console.error("🚨 Bucket debugging failed:", error)
    console.log("💡 Try refreshing the page and running this script again")
  }
}

// Also provide a simple bucket list function
async function listAllBuckets() {
  try {
    if (typeof window.supabase === "undefined") {
      console.error("❌ Supabase client not available")
      return
    }

    console.log("📦 Listing all storage buckets...")
    const { data: buckets, error } = await window.supabase.storage.listBuckets()

    if (error) {
      console.error("❌ Failed to list buckets:", error)
      return
    }

    if (buckets && buckets.length > 0) {
      console.log("📦 Found buckets:")
      buckets.forEach((bucket, index) => {
        console.log(`${index + 1}. ${bucket.name} (${bucket.public ? "public" : "private"})`)
        console.log(`   ID: ${bucket.id}`)
        console.log(`   Created: ${bucket.created_at}`)
        console.log(`   Updated: ${bucket.updated_at}`)
        console.log("")

        // Highlight if this is the client-files bucket
        if (bucket.name === "client-files") {
          console.log("   🎯 THIS IS THE TARGET BUCKET!")
        }
      })
    } else {
      console.log("📦 No buckets found")
    }

    return buckets
  } catch (error) {
    console.error("🚨 Error listing buckets:", error)
  }
}

// Run the debugging
console.log("🚀 Starting bucket debugging for client-files...")
debugClientFilesBucket()

// Make functions available
window.debugClientFilesBucket = debugClientFilesBucket
window.listAllBuckets = listAllBuckets

console.log("🔧 Debug functions available:")
console.log("  - window.debugClientFilesBucket()")
console.log("  - window.listAllBuckets()")
