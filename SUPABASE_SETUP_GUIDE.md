# Supabase Setup Guide for Time Tracker App

## 📋 Prerequisites
- A web browser
- Access to your project files
- Basic understanding of copy/paste operations

## 🚀 Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up using GitHub, Google, or email
4. Verify your email if required

### 1.2 Create New Project
1. Once logged in, click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `time-tracker-app` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
4. Click "Create new project"
5. Wait 2-3 minutes for project setup to complete

## 🗄️ Step 2: Set Up Database Schema

### 2.1 Access SQL Editor
1. In your Supabase dashboard, look for the left sidebar
2. Click on "SQL Editor" (it has a `</>` icon)
3. You'll see a query editor interface

### 2.2 Run the Schema Script
1. In your project, locate the file: `scripts/supabase-schema.sql`
2. Open this file and copy ALL the content
3. In the Supabase SQL Editor, paste the entire content
4. Click "Run" button (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned" message

### 2.3 Verify Tables Were Created
1. In the left sidebar, click "Table Editor"
2. You should see two tables:
   - `clients` (with sample data)
   - `case_notes` (with sample notes)
3. Click on each table to verify data was inserted

## 🔑 Step 3: Get API Credentials

### 3.1 Find Your Project Settings
1. In the left sidebar, click the "Settings" icon (gear icon)
2. Click "API" from the settings menu

### 3.2 Copy Your Credentials
You'll see two important values:

**Project URL:**
- Look for "Project URL" section
- Copy the URL (looks like: `https://abcdefghijklmnop.supabase.co`)

**API Keys:**
- Look for "Project API keys" section
- Copy the "anon public" key (long string starting with `eyJ...`)
- ⚠️ **DO NOT** copy the "service_role" key for this setup

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Locate Your .env.local File
In your project root directory, find the file named `.env.local`

### 4.2 Update the Values
Replace the placeholder values with your actual Supabase credentials:

\`\`\`env
# Replace with your actual Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Replace with your actual Supabase anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

**Example:**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0ODAwMCwiZXhwIjoxOTUyMTI0MDAwfQ.example-key-here
\`\`\`

### 4.3 Save the File
- Save the `.env.local` file
- ⚠️ **Important**: Never commit this file to version control

## 🧪 Step 5: Test Your Setup

### 5.1 Restart Your Development Server
1. Stop your development server (Ctrl+C)
2. Start it again: `npm run dev` or `yarn dev`
3. Open your app in the browser

### 5.2 Test Database Connection
1. Open browser developer tools (F12)
2. Go to the Console tab
3. Type: `testSupabase()` and press Enter
4. You should see success messages

### 5.3 Verify App Functionality
1. Try creating a new client
2. Check if the client appears in your reports
3. Add a case note to verify that functionality

## 🔍 Troubleshooting

### Common Issues:

**❌ "Invalid API key" Error**
- Double-check you copied the "anon public" key, not the service role key
- Ensure no extra spaces or characters in your .env.local file

**❌ "Project not found" Error**
- Verify your Project URL is correct
- Make sure the URL starts with `https://`

**❌ Tables not found**
- Go back to SQL Editor and re-run the schema script
- Check Table Editor to confirm tables exist

**❌ Environment variables not loading**
- Restart your development server
- Check that .env.local is in your project root (same level as package.json)
- Ensure variable names start with `NEXT_PUBLIC_`

### Getting Help:
1. Check the browser console for error messages
2. Use the `testSupabase()` function to diagnose issues
3. Verify your Supabase project is active (not paused)

## 🎉 Success!

Once everything is working, you should see:
- ✅ Real data in your reports instead of mock data
- ✅ New clients saved to the database
- ✅ Case notes persisting between sessions
- ✅ Green status indicator (in development mode)

Your Time Tracker App is now fully connected to Supabase!
