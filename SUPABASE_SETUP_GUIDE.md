# 🚀 Supabase Setup Guide for TimeTracker

This guide will walk you through setting up Supabase for your TimeTracker application in about 10 minutes.

## 📋 Prerequisites

- A web browser
- Your TimeTracker project files
- 5-10 minutes of your time

## 🎯 Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### 1.2 Create New Project
1. Once logged in, click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `timetracker` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is perfect for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for project setup to complete

## 🗄️ Step 2: Set Up Database Schema

### 2.1 Access SQL Editor
1. In your Supabase dashboard, look for the left sidebar
2. Click on **"SQL Editor"** (icon looks like `</>`)
3. You'll see a query editor interface

### 2.2 Run Database Setup Script
1. In your project, open the file: `scripts/supabase-schema.sql`
2. Copy ALL the content from this file (Ctrl+A, then Ctrl+C)
3. Back in Supabase SQL Editor, paste the content (Ctrl+V)
4. Click the **"Run"** button (or press Ctrl+Enter)
5. You should see success messages like:
   \`\`\`
   Database setup completed successfully!
   client_count: 5
   case_notes_count: 5
   \`\`\`

### 2.3 Verify Tables Created
1. In the left sidebar, click **"Table Editor"**
2. You should see two tables:
   - **clients** (with 5 sample records)
   - **case_notes** (with 5 sample records)
3. Click on each table to verify data was inserted

## 🔑 Step 3: Get API Credentials

### 3.1 Find Your Project Settings
1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see your project configuration

### 3.2 Copy Required Values
You need these two values:

**Project URL:**
- Look for "Project URL" 
- It looks like: `https://abcdefghijk.supabase.co`
- Click the copy icon next to it

**API Key (anon/public):**
- Look for "Project API keys"
- Find the **"anon public"** key (NOT the service_role key)
- It's a long string starting with `eyJ...`
- Click the copy icon next to it

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Update .env.local File
1. In your project root, open `.env.local`
2. Replace the placeholder values:

\`\`\`env
# Replace with your actual values from Step 3.2
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 4.2 Save and Restart
1. Save the `.env.local` file
2. If your development server is running, restart it:
   \`\`\`bash
   # Stop the server (Ctrl+C), then restart
   npm run dev
   \`\`\`

## ✅ Step 5: Test Your Setup

### 5.1 Check Application Status
1. Open your TimeTracker application in the browser
2. Look for these indicators:
   - **Console Messages**: Open browser dev tools (F12) and check console
   - **Data Loading**: You should see real client data instead of "demo mode"
   - **Status Indicator**: Look for a green badge in bottom-right corner (development mode)

### 5.2 Test Database Connection
1. Open browser console (F12 → Console tab)
2. Type: `testSupabase()` and press Enter
3. You should see success messages confirming connection

### 5.3 Test CRUD Operations
1. Try creating a new client in the application
2. Try editing an existing client
3. Try adding case notes
4. Verify changes persist after page refresh

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "Invalid API key" Error
**Problem**: Wrong API key or URL
**Solution**: 
- Double-check you copied the **anon/public** key (not service_role)
- Verify the URL format: `https://yourproject.supabase.co`
- Make sure there are no extra spaces or characters

#### ❌ "Failed to fetch" Error
**Problem**: Network or CORS issues
**Solution**:
- Check your internet connection
- Verify the Supabase project is active (not paused)
- Try refreshing the page

#### ❌ Tables Not Found
**Problem**: Database schema not set up correctly
**Solution**:
- Re-run the SQL script from `scripts/supabase-schema.sql`
- Check the SQL Editor for any error messages
- Verify tables exist in Table Editor

#### ❌ Environment Variables Not Loading
**Problem**: `.env.local` not configured correctly
**Solution**:
- Ensure file is named exactly `.env.local` (not `.env.local.txt`)
- Restart your development server after changes
- Check for typos in variable names

### Getting Help

If you're still having issues:

1. **Check Console**: Open browser dev tools (F12) and look for error messages
2. **Verify Setup**: Run `testSupabase()` in browser console
3. **Check Status**: Look for the status indicator in development mode
4. **Review Logs**: Check your terminal/console for server-side errors

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ No error messages in browser console
- ✅ Client data loads from database (not demo mode)
- ✅ New clients can be created and saved
- ✅ Case notes can be added and persist
- ✅ Green status indicator shows "Connected to Supabase"
- ✅ `testSupabase()` returns success messages

## 🚀 Next Steps

Once Supabase is configured:

1. **Explore Features**: Try all the application features with real data
2. **Add More Data**: Create additional clients and case notes
3. **Customize**: Modify the database schema if needed for your use case
4. **Deploy**: When ready, deploy your application with the same environment variables

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Need help?** Check the troubleshooting section above or review the console messages for specific error details.
