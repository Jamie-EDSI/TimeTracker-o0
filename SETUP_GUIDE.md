# EDSI Client Management System - Setup Guide

This guide will help you set up the EDSI Client Management System with Supabase as the backend database and storage solution.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is sufficient)
- Basic knowledge of SQL and environment variables

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "edsi-client-management")
5. Enter a secure database password
6. Select a region close to your users
7. Click "Create new project"

Wait for the project to be created (this may take a few minutes).

## Step 2: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the **Project URL** and **anon/public key**
3. In your project root, copy `.env.local.example` to `.env.local`
4. Fill in your actual values:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

## Step 3: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `scripts/complete-setup.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the script

This will create:
- All necessary tables (clients, case_notes, client_files)
- Indexes for optimal performance
- Storage bucket named `client_files`
- Basic RLS policies
- Sample data for testing

## Step 4: Configure Storage

The setup script automatically creates the storage bucket, but you can verify:

1. Go to **Storage** in your Supabase dashboard
2. You should see a bucket named `client_files`
3. The bucket should be set to public access

## Step 5: Start the Application

1. Restart your development server:
\`\`\`bash
npm run dev
\`\`\`

2. Open your browser to `http://localhost:3000`
3. Check the setup status indicator in the bottom-right corner
4. All indicators should show green checkmarks

## Step 6: Test the System

1. Try creating a new client
2. Upload a file to test storage functionality
3. Add case notes
4. Test the search and filter features

## Troubleshooting

### Setup Status Indicator Shows Issues

The small indicator in the bottom-right corner will show any setup problems:
- **Red/Yellow**: Click to expand and see specific issues
- **Green**: Everything is working correctly

### Common Issues

1. **Environment Variables Not Set**
   - Make sure `.env.local` exists and has correct values
   - Restart your development server after changes

2. **Database Connection Failed**
   - Check your Supabase project is active
   - Verify the URL and key are correct
   - Check your internet connection

3. **Storage Bucket Not Found**
   - Run the complete setup script again
   - Manually create `client_files` bucket in Supabase Storage

4. **Tables Missing**
   - Run the complete setup script in SQL Editor
   - Check for any error messages in the SQL execution

### Getting Help

1. Check the browser console for detailed error messages
2. Use the setup diagnostics: Open browser console and run `runSetupDiagnostics()`
3. Check the Supabase dashboard for any error logs

## Security Notes

- RLS (Row Level Security) is enabled but set to allow all operations initially
- In production, you should configure proper RLS policies
- Never commit your `.env.local` file to version control
- Consider using the service role key only for admin operations

## Next Steps

Once setup is complete, you can:
- Customize the client form fields
- Add more case note categories
- Configure advanced search filters
- Set up automated backups
- Implement user authentication
- Configure proper RLS policies for production

## File Structure

\`\`\`
├── scripts/
│   ├── complete-setup.sql          # Main setup script
│   ├── create-client-files-table.sql
│   └── setup-storage-bucket.sql
├── lib/
│   ├── supabase.ts                 # Database client and API
│   └── setup-checker.ts            # Setup validation
├── components/
│   └── setup-status-indicator.tsx  # Setup status UI
└── .env.local.example              # Environment template
\`\`\`

The system is designed to work in demo mode even without Supabase, but full functionality requires proper database setup.
