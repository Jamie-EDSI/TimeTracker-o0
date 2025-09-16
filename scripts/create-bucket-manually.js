// Manual bucket creation script
// Run this in the browser console if SQL script doesn't work

async function createClientFilesBucket() {
  console.log("🔧 Attempting to create client_files bucket manually...")

  try {
    // Check if Supabase is available
    if (typeof window.supabase === "undefined") {
      console.error("❌ Supabase client not available")
      console.log("💡 Make sure you are on the correct page and the app has loaded")
      return false
    }

    // First, check if bucket already exists
    console.log("🔍 Checking if bucket already exists...")
    const { data: existingBuckets, error: listError } = await window.supabase.storage.listBuckets()

    if (listError) {
      console.error("❌ Failed to list buckets:", listError)
      console.log("💡 You may need to create the bucket manually in Supabase Dashboard")
      return false
    }

    const existingBucket = existingBuckets?.find((b) => b.name === "client_files")
    if (existingBucket) {
      console.log("✅ client_files bucket already exists!")
      return true
    }

    // Try to create the bucket
    console.log("🔨 Creating client_files bucket...")
    const { data: createData, error: createError } = await window.supabase.storage.createBucket("client_files", {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        "image/*",
        "application/pdf",
        "text/*",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    })

    if (createError) {
      console.error("❌ Failed to create bucket:", createError)
      console.log("💡 Manual creation steps:")
      console.log("   1. Go to your Supabase Dashboard")
      console.log("   2. Navigate to Storage section")
      console.log("   3. Click 'New bucket'")
      console.log("   4. Name it 'client_files' (with underscore)")
      console.log("   5. Set it to public")
      console.log("   6. Set file size limit to 50MB")
      return false
    }

    console.log("✅ client_files bucket created successfully!")
    console.log("📦 Bucket data:", createData)

    // Test the bucket
    console.log("🧪 Testing bucket access...")
    const { data: testData, error: testError } = await window.supabase.storage
      .from("client_files")
      .list("", { limit: 1 })

    if (testError) {
      console.warn("⚠️ Bucket created but access test failed:", testError)
    } else {
      console.log("✅ Bucket access test successful!")
    }

    return true
  } catch (error) {
    console.error("🚨 Error creating bucket:", error)
    return false
  }
}

// Run the creation
console.log("🚀 Starting manual bucket creation...")
createClientFilesBucket().then((success) => {
  if (success) {
    console.log("🎉 Bucket creation completed! Refresh the page to see updated status.")
  } else {
    console.log("❌ Bucket creation failed. Please create manually in Supabase Dashboard.")
  }
})

// Make function available
window.createClientFilesBucket = createClientFilesBucket

console.log("🔧 Manual bucket creation function available:")
console.log("  - window.createClientFilesBucket()")
