# Console Commands for Time Tracker App

Use these commands in the browser console to test and verify the application setup.

## Setup Verification Commands

### Check Overall Setup Status
\`\`\`javascript
await window.runSetupDiagnostics()
\`\`\`

### Check Setup Status (Detailed)
\`\`\`javascript
const status = await window.checkSetupStatus()
console.log('Setup Status:', status)
\`\`\`

### Test Supabase Connection
\`\`\`javascript
const result = await window.testSupabase()
console.log('Connection Test:', result)
\`\`\`

### Verify client-files Bucket
\`\`\`javascript
const bucketInfo = await window.verifyClientFilesBucket()
console.log('Bucket Info:', bucketInfo)
\`\`\`

## File Operations Commands

### Upload Test File
\`\`\`javascript
// Create a test file
const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
const result = await window.uploadClientFile('test-client-id', testFile)
console.log('Upload Result:', result)
\`\`\`

### Download File
\`\`\`javascript
const fileData = await window.downloadClientFile('path/to/file.txt')
console.log('Downloaded file:', fileData)
\`\`\`

### Delete File
\`\`\`javascript
const success = await window.deleteClientFile('path/to/file.txt')
console.log('File deleted:', success)
\`\`\`

## Quick Setup Check
\`\`\`javascript
// One-liner to check if everything is working
Promise.all([
  window.checkSetupStatus(),
  window.verifyClientFilesBucket()
]).then(([setup, bucket]) => {
  console.log('🔍 Quick Status Check:')
  console.log('Database:', setup.database ? '✅' : '❌')
  console.log('Storage:', setup.storage ? '✅' : '❌')
  console.log('Tables:', setup.tables ? '✅' : '❌')
  console.log('Bucket:', bucket.exists ? '✅' : '❌')
  console.log('Files:', bucket.fileCount || 0)
})
\`\`\`

## Troubleshooting Commands

### List All Available Buckets
\`\`\`javascript
// This will show all buckets in your Supabase project
const { data: buckets } = await supabase.storage.listBuckets()
console.log('All buckets:', buckets?.map(b => b.name))
\`\`\`

### Test File Upload to Bucket
\`\`\`javascript
// Test upload directly to client-files bucket
const testBlob = new Blob(['test'], { type: 'text/plain' })
const { data, error } = await supabase.storage
  .from('client-files')
  .upload(`test-${Date.now()}.txt`, testBlob)
console.log('Direct upload test:', { data, error })
\`\`\`

### Check Environment Variables
\`\`\`javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
\`\`\`

## Usage Instructions

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Copy and paste any of the commands above
4. Press Enter to execute

## Expected Results

- ✅ Green checkmarks indicate everything is working
- ❌ Red X marks indicate issues that need attention
- 🔍 Diagnostic messages provide detailed information
- 💡 Light bulb icons show helpful suggestions

## Common Issues

- If functions are not available, refresh the page and try again
- If bucket is not found, run the complete-setup.sql script
- If upload fails, check bucket permissions in Supabase dashboard
