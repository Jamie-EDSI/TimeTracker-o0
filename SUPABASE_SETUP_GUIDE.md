# 🚀 Supabase Setup Guide for Time Tracker App

This guide will walk you through setting up Supabase for your Time Tracker application step by step.

## 📋 Prerequisites

- A web browser
- Access to your project files
- Basic understanding of environment variables

## 🎯 Step 1: Create a Supabase Account and Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using GitHub, Google, or email
4. Verify your email if required

### 1.2 Create a New Project
1. Once logged in, click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `time-tracker-app` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select "Free" for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

## 🗄️ Step 2: Set Up the Database Schema

### 2.1 Access the SQL Editor
1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### 2.2 Run the Schema Script
1. Copy the entire contents from `scripts/supabase-schema.sql` in your project
2. Paste it into the SQL Editor
3. Click **"Run"** button (or press Ctrl/Cmd + Enter)
4. You should see success messages for each table creation
5. Verify tables were created by checking the **"Table Editor"** tab

### 2.3 Verify Sample Data
1. Go to **"Table Editor"** in the left sidebar
2. Click on the **"clients"** table
3. You should see 3 sample clients (Sarah Johnson, Michael Davis, Emily Rodriguez)
4. Click on the **"case_notes"** table
5. You should see 4 sample case notes

## 🔑 Step 3: Get Your API Credentials

### 3.1 Find Your Project Settings
1. Click **"Settings"** in the left sidebar (gear icon)
2. Click **"API"** under the Project Settings section

### 3.2 Copy Your Credentials
You'll need two values:

**Project URL:**
- Look for "Project URL" section
- Copy the URL (format: `https://your-project-ref.supabase.co`)

**API Keys:**
- Look for "Project API keys" section
- Copy the **"anon public"** key (long string starting with `eyJ...`)
- ⚠️ **Do NOT use the service_role key** - it's for server-side only

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Update Your .env.local File
1. Open the `.env.local` file in your project root
2. Replace the placeholder values:

\`\`\`env
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
\`\`\`

### 4.2 Example Configuration
\`\`\`env
# Example (use your actual values):
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0ODAwMCwiZXhwIjoxOTUyMTI0MDAwfQ.example-signature-here
\`\`\`

## 🔄 Step 5: Restart Your Application

### 5.1 Stop the Development Server
- Press `Ctrl + C` in your terminal where the app is running

### 5.2 Start the Application
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

### 5.3 Verify Connection
1. Open your browser to `http://localhost:3000`
2. Check the browser console (F12 → Console tab)
3. You should see logs indicating Supabase connection instead of "Using mock data"

## ✅ Step 6: Test the Integration

### 6.1 Test Client Management
1. Go to the **"Client Management"** section
2. Try creating a new client
3. Verify the client appears in both your app and Supabase Table Editor

### 6.2 Test Case Notes
1. Open a client profile
2. Add a new case note
3. Verify it appears in the case_notes table in Supabase

### 6.3 Test Reports
1. Generate a report (Active Clients, All Clients, etc.)
2. Verify the data matches what's in your Supabase tables

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ "Using mock data - Supabase not configured"
**Cause:** Environment variables not set correctly
**Solution:**
1. Double-check your `.env.local` file
2. Ensure no extra spaces or quotes around values
3. Restart your development server
4. Clear browser cache

#### ❌ "Failed to fetch" or connection errors
**Cause:** Incorrect URL or API key
**Solution:**
1. Verify your Project URL in Supabase dashboard
2. Ensure you're using the **anon public** key, not service_role
3. Check for typos in your environment variables

#### ❌ "relation does not exist" errors
**Cause:** Database schema not created properly
**Solution:**
1. Go back to SQL Editor in Supabase
2. Re-run the schema script from `scripts/supabase-schema.sql`
3. Check Table Editor to confirm tables exist

#### ❌ Environment variables not loading
**Cause:** File naming or location issues
**Solution:**
1. Ensure file is named exactly `.env.local` (with the dot)
2. Place it in your project root directory (same level as package.json)
3. Restart your development server

### 🔍 Debugging Tips

#### Check Environment Variables
Add this to any component to debug:
\`\`\`javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
\`\`\`

#### Check Supabase Connection
Look for these console messages:
- ✅ **Good**: No "Using mock data" messages
- ❌ **Bad**: "Using mock data - Supabase not configured"
- ❌ **Bad**: "Supabase error, falling back to mock data"

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ No "mock data" messages in console
- ✅ New clients appear in Supabase Table Editor
- ✅ Case notes are saved to database
- ✅ Reports show real data from Supabase
- ✅ Data persists between browser sessions

## 🔒 Security Notes

### Important Security Practices:
1. **Never commit** your `.env.local` file to version control
2. **Use anon key only** - never expose service_role key in frontend
3. **Set up Row Level Security** in production
4. **Use environment-specific projects** (dev, staging, prod)

### Production Considerations:
- Set up proper Row Level Security (RLS) policies
- Use different Supabase projects for different environments
- Consider setting up authentication for user management
- Monitor usage and set up billing alerts

## 📞 Getting Help

If you're still having issues:
1. Check the browser console for error messages
2. Verify your Supabase project is active (not paused)
3. Try creating a simple test in Supabase SQL Editor
4. Check Supabase status page: [status.supabase.com](https://status.supabase.com)

## 🎯 Next Steps

Once Supabase is working:
- [ ] Set up user authentication
- [ ] Configure Row Level Security
- [ ] Add real-time subscriptions
- [ ] Set up automated backups
- [ ] Configure production environment

---

**Need more help?** Check the [Supabase Documentation](https://supabase.com/docs) or reach out for additional support!
