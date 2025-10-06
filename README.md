# Youth Services Client Management System

A comprehensive client management application for Youth Services Program, built with Next.js 14, React, TypeScript, and Supabase.

## 📋 Project Information

- **Program**: Youth Services Program
- **Version**: 1.0.0
- **Database**: Supabase (Independent Instance)
- **Deployment**: Vercel
- **Original Source**: TimeTracker Application
- **Created**: January 2025

## ✨ Features

- 👥 **Client Management** - Comprehensive client profiles with full demographic information
- 📝 **Case Notes** - Track interactions and progress with timestamp tracking
- 📊 **Advanced Reporting** - Generate reports with Excel and PDF export capabilities
- 📁 **File Management** - Upload, organize, and manage client documents securely
- 🗑️ **Soft Delete** - Recycle bin functionality for safe data management
- 🔍 **Advanced Search** - Filter and search clients with multiple criteria
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🔒 **Security** - Row Level Security (RLS) and secure file storage
- 📈 **Real-time Stats** - Dashboard with live statistics and metrics
- 📤 **Bulk Operations** - Export and manage multiple records efficiently

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage with RLS
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with autotable
- **Excel Export**: XLSX library
- **Deployment**: Vercel (Edge Network)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Vercel account (free tier available)

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/[username]/timetracker-youth-services.git
   cd timetracker-youth-services
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   - Create `.env.local` file in root directory
   - Add your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_PROGRAM_NAME=Youth Services Program
   \`\`\`

4. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open application**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Required environment variables for production:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGc...` |
| `NEXT_PUBLIC_PROGRAM_NAME` | Display name for your program | `Youth Services Program` |

Optional variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_PROGRAM_ABBR` | Short program abbreviation | `YSP` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support contact email | `support@youthservices.org` |

## 📊 Database Setup

### Quick Setup

1. Create a new Supabase project
2. Navigate to SQL Editor in Supabase dashboard
3. Run the schema script from `scripts/supabase-schema.sql`
4. Run the storage setup from `scripts/complete-setup.sql`
5. Verify tables and storage bucket are created

### Detailed Setup

See `SUPABASE_SETUP_GUIDE.md` for comprehensive database setup instructions including:
- Table structure details
- Row Level Security (RLS) policies
- Storage bucket configuration
- Sample data insertion
- Troubleshooting common issues

## 🌐 Deployment

### Deploy to Vercel (Recommended)

This application is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy automatically

**Live URL**: https://timetracker-youth-services.vercel.app

For detailed deployment instructions using only the dashboard, see `DASHBOARD_DUPLICATION_GUIDE.md`.

### Manual Deployment

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📚 Documentation

Comprehensive documentation is available:

- **`DASHBOARD_DUPLICATION_GUIDE.md`** - Complete guide for cloning this app for another program using only dashboards (no command line)
- **`SUPABASE_SETUP_GUIDE.md`** - Detailed database setup and configuration instructions
- **`SETUP_GUIDE.md`** - Complete application setup guide
- **`scripts/console-commands.md`** - Browser console debugging commands

## 🧪 Testing

### Browser Console Tests

Open browser console (F12) and run these commands:

\`\`\`javascript
// Test Supabase connection
await window.testSupabaseConnection()

// Verify storage bucket
await window.verifyClientFilesBucket()

// Test all CRUD operations
await window.testSupabaseSync()
\`\`\`

### Feature Testing Checklist

- ✅ Dashboard loads and displays statistics
- ✅ Create new client with all fields
- ✅ Edit existing client information
- ✅ View client profile with all sections
- ✅ Add case notes to clients
- ✅ Upload files (PDF, images, documents)
- ✅ Download uploaded files
- ✅ Preview files in modal
- ✅ Generate reports (Active Clients, All Clients, etc.)
- ✅ Export to Excel
- ✅ Export to PDF
- ✅ Search and filter clients
- ✅ Soft delete clients (move to recycle bin)
- ✅ Restore clients from recycle bin
- ✅ Permanently delete from recycle bin

## 🔧 Maintenance

### Regular Tasks

**Weekly:**
- Monitor application health and uptime
- Check for error logs in Vercel dashboard
- Verify Supabase project is active

**Monthly:**
- Review and update dependencies
- Check database storage usage
- Export database backup
- Review user feedback

**Quarterly:**
- Run performance audit
- Update documentation
- Security review
- Feature planning session

### Updating Dependencies

\`\`\`bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test thoroughly
npm run build
npm run dev
\`\`\`

## 🆘 Support & Troubleshooting

### Common Issues

**Issue: Supabase Connection Fails**
- Verify environment variables are set correctly
- Check Supabase project is active (not paused)
- Confirm API keys are correct

**Issue: File Upload Fails**
- Verify storage bucket exists (`client-files`)
- Check RLS policies on bucket
- Run `await window.verifyClientFilesBucket()` in console

**Issue: Build Errors**
- Clear `.next` directory
- Delete `node_modules` and reinstall
- Check TypeScript errors: `npm run type-check`

For more troubleshooting, see `DASHBOARD_DUPLICATION_GUIDE.md` section on troubleshooting.

### Getting Help

1. Check the documentation files listed above
2. Review browser console for errors (F12)
3. Check Supabase dashboard for database issues
4. Review Vercel deployment logs
5. Contact support: support@youthservices.org

## 📈 Scaling Considerations

### Database Limits

- **Free Tier**: 500 MB database, good for ~1,000 clients
- **Pro Tier**: 8 GB database, good for ~15,000 clients
- Monitor usage in Supabase dashboard

### Storage Limits

- **Free Tier**: 1 GB file storage
- **Pro Tier**: 100 GB file storage
- Regularly review and archive old files

### Performance Optimization

- Database indexes are optimized for common queries
- Files are stored with CDN delivery
- Implement pagination for large datasets
- Consider caching strategies for reports

## 🔐 Security

### Data Protection

- Row Level Security (RLS) enabled on all tables
- Secure file storage with access policies
- Environment variables never exposed to client
- HTTPS enforced on all connections

### Best Practices

- Regularly update dependencies for security patches
- Review and audit RLS policies quarterly
- Use strong database passwords
- Enable MFA on Vercel and Supabase accounts
- Regular data backups

## 📄 License

Private - Youth Services Program

This application is proprietary software developed for Youth Services Program. Unauthorized copying, distribution, or modification is prohibited.

## 🙏 Credits

**Original Framework**: TimeTracker Application  
**Customization**: Youth Services Program Team  
**Built with**: Next.js, Supabase, Vercel  
**UI Components**: shadcn/ui, Radix UI  

## 📞 Contact

For questions, support, or feedback:

- **Email**: support@youthservices.org
- **Website**: https://youth-services-tracker.org
- **Documentation**: See docs folder

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
