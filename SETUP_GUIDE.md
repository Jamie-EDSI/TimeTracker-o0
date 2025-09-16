# Complete Setup Guide for Time Tracker App

## 🚀 Quick Start

### Step 1: Environment Setup

1. **Create `.env.local` file** in your project root:
\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Database Direct Connection (for advanced users)
DATABASE_URL=your_direct_database_url
\`\`\`

2. **Get Supabase Credentials**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings → API
   - Copy the Project URL and anon/public key

### Step 2: Database Setup

1. **Run the SQL scripts** in your Supabase SQL Editor in this order:

\`\`\`sql
-- 1. Create main tables
-- Copy and paste from scripts/supabase-schema.sql

-- 2. Add soft delete functionality  
-- Copy and paste from scripts/add-soft-delete-schema.sql

-- 3. Create file storage table
-- Copy and paste from scripts/create-client-files-table.sql

-- 4. Setup storage bucket
-- Copy and paste from scripts/setup-storage-bucket.sql
\`\`\`

### Step 3: Storage Configuration

1. **Enable Storage** in your Supabase dashboard
2. **Create bucket** named `client-files`
3. **Set bucket to public** for easier file access
4. **Configure CORS** if needed for your domain

### Step 4: Test the Setup

1. **Run the diagnostic functions**:
\`\`\`javascript
// In browser console
await testSupabaseSync()
\`\`\`

2. **Check connection status** in the app header
3. **Try creating a test client**
4. **Test file upload functionality**

## 🔍 Current Status

The app currently works in **demo mode** with the following features:
- ✅ Full client management (create, edit, delete, restore)
- ✅ Case notes functionality
- ✅ File upload with fallback to blob storage
- ✅ All UI components working
- ✅ Data persistence in memory
- ⚠️ No database persistence (until Supabase is configured)
- ⚠️ Files stored as blob URLs (temporary)

## 🛠️ Integration Checklist

### Database Integration
- [ ] Create Supabase project
- [ ] Set environment variables
- [ ] Run SQL schema scripts
- [ ] Test database connection
- [ ] Verify CRUD operations

### Storage Integration  
- [ ] Create storage bucket
- [ ] Configure storage policies
- [ ] Test file upload to storage
- [ ] Verify file persistence

### Authentication (Optional)
- [ ] Enable Supabase Auth
- [ ] Configure auth providers
- [ ] Add login/logout functionality
- [ ] Implement user roles

### Production Deployment
- [ ] Configure environment variables in deployment
- [ ] Set up domain CORS policies
- [ ] Configure RLS policies for security
- [ ] Test all functionality in production

## 🚨 Troubleshooting

### Common Issues:

1. **"Supabase not configured" message**
   - Check `.env.local` file exists
   - Verify environment variable names
   - Restart development server

2. **File upload errors**
   - Check storage bucket exists
   - Verify storage policies
   - Check file size limits (10MB max)

3. **Database connection issues**
   - Verify Supabase project is active
   - Check API keys are correct
   - Run diagnostic functions

4. **RLS Policy errors**
   - Disable RLS temporarily for testing
   - Check policy syntax in SQL scripts
   - Verify user permissions

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Run diagnostic functions
3. Verify environment variables
4. Check Supabase dashboard for errors
5. Review this setup guide

The app is designed to work in demo mode even without full Supabase setup, so you can test all functionality immediately.
